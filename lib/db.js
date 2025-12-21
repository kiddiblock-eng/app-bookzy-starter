import mongoose from "mongoose";

// On déclare la variable mais on ne "throw" pas d'erreur ici au top-level
const MONGODB_URI = process.env.MONGODB_URI;

let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null };
}

// Variable globale pour éviter de relancer les migrations à chaque requête
let migrationsLaunched = false;

export async function dbConnect() {
  // ✅ CORRECTION : La vérification se fait ici pour ne pas bloquer le build Railway
  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI manquant dans les variables d'environnement.");
  }

  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
      maxPoolSize: 1, // ✅ Optimisation Serverless
      serverSelectionTimeoutMS: 5000, 
    };

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongooseInstance) => {
      // ─────────────────────────────────────────────────────────────────────────────
      // 🚀 PERFORMANCE : LOGIQUE DE MAINTENANCE EN ARRIÈRE-PLAN
      // ─────────────────────────────────────────────────────────────────────────────
      if (!migrationsLaunched) {
        migrationsLaunched = true;
        setTimeout(() => {
          runAllYourLogics(mongooseInstance.connection.db).catch(err => {
            console.error("⚠️ Erreur background logic:", err.message);
          });
        }, 10000); // Délai de 10 secondes
      }

      return mongooseInstance;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

// 👇👇👇 TON CODE DE LOGIQUE (PRÉSERVÉ À 100%) 👇👇👇

async function runAllYourLogics(db) {
  // 1. 🔥 MIGRATION AUTO - SUPPRESSION INDEX transactionId_1
  try {
    const collection = db.collection("transactions");
    const indexes = await collection.indexes();
    const oldIndex = indexes.find(idx => 
      idx.name === 'transactionId_1' && idx.unique === true
    );
    
    if (oldIndex) {
      console.log('🔧 [BG] MIGRATION: Suppression ancien index unique transactionId_1...');
      await collection.dropIndex('transactionId_1');
      console.log('✅ [BG] Ancien index supprimé avec succès');
    }
  } catch (migrationError) {
    if (migrationError.code !== 27) {
      console.log('⚠️ [BG] Migration index:', migrationError.message);
    }
  }

  // 2. 🔥 MIGRATION TRANSACTIONS - Ajouter createdAt manquant
  try {
    const transactionsCollection = db.collection("transactions");
    const missingCreatedAt = await transactionsCollection.countDocuments({
      createdAt: { $exists: false }
    });
    
    if (missingCreatedAt > 0) {
      console.log(`🔧 [BG] MIGRATION: ${missingCreatedAt} transactions sans createdAt détectées`);
      
      const result = await transactionsCollection.updateMany(
        { createdAt: { $exists: false } },
        [{ $set: { createdAt: { $ifNull: ["$updatedAt", new Date()] } } }]
      );
      
      console.log(`✅ [BG] ${result.modifiedCount} transactions corrigées avec createdAt`);
    }
  } catch (migrationError) {
    console.log('⚠️ [BG] Migration transactions:', migrationError.message);
  }

  // 3. 🔥 INITIALISATION & MIGRATION SETTINGS
  try {
    const settingsCollection = db.collection("settings");
    const existingSettings = await settingsCollection.findOne({ key: "global" });
    
    if (!existingSettings) {
      console.log('🔧 [BG] INIT: Création des settings par défaut...');
      
      await settingsCollection.insertOne({
        key: "global",
        appName: "Bookzy",
        appDomain: "",
        supportEmail: "",
        payment: {
          activeProvider: "moneroo",
          ebookPrice: 2100,
          moneroo: { enabled: false, environment: "test", apiKey: "", defaultCurrency: "XOF", webhookSecret: "" },
          fedapay: { enabled: false, environment: "sandbox", publicKey: "", secretKey: "", defaultCurrency: "XOF", webhookSecret: "" },
          kkiapay: { enabled: false, environment: "sandbox", publicKey: "", privateKey: "", secret: "", defaultCurrency: "XOF", webhookSecret: "" },
          pawapay: { enabled: false, apiKey: "", defaultCurrency: "XOF", webhookSecret: "" }
        },
        ai: {
          providers: {
            claude: { enabled: false, apiKey: "", model: "claude-sonnet-4-20250514" },
            openai: { enabled: false, apiKey: "", textModel: "gpt-4o", imageModel: "dall-e-3" },
            gemini: { enabled: false, apiKey: "", textModel: "gemini-2.5-flash", imageModel: "gemini-2.5-flash-image" }
          },
          generation: {
            ebook: { provider: "claude", model: "claude-sonnet-4-20250514" },
            cover: { provider: "gemini", model: "gemini-2.5-flash-image" },
            ads: { provider: "gemini", model: "gemini-2.5-flash" },
            nicheGenerate: { provider: "gemini", model: "gemini-2.5-flash" },
            nicheAnalyze: { provider: "gemini", model: "gemini-2.5-flash" }
          }
        },
        createdAt: new Date(),
        updatedAt: new Date()
      });
      
      console.log('✅ [BG] Settings par défaut créés');
    } else {
      const updates = {};
      let needsUpdate = false;
      
      if (existingSettings.ai?.providers?.gemini && !existingSettings.ai.providers.gemini.textModel) {
        updates['ai.providers.gemini'] = {
          enabled: existingSettings.ai.providers.gemini.enabled || false,
          apiKey: existingSettings.ai.providers.gemini.apiKey || "",
          textModel: existingSettings.ai.providers.gemini.model || "gemini-2.5-flash",
          imageModel: "gemini-2.5-flash-image"
        };
        needsUpdate = true;
      }
      
      if (!existingSettings.ai?.generation?.nicheGenerate) {
        updates['ai.generation.nicheGenerate'] = { provider: "gemini", model: "gemini-2.5-flash" };
        needsUpdate = true;
      }
      
      if (!existingSettings.ai?.generation?.nicheAnalyze) {
        updates['ai.generation.nicheAnalyze'] = { provider: "gemini", model: "gemini-2.5-flash" };
        needsUpdate = true;
      }
      
      if (typeof existingSettings.payment?.ebookPrice === 'undefined') {
        updates['payment.ebookPrice'] = 2100;
        needsUpdate = true;
      }
      
      if (existingSettings.payment?.moneroo && !existingSettings.payment.moneroo.apiKey &&
          (existingSettings.payment.moneroo.publicKey || existingSettings.payment.moneroo.secretKey)) {
        updates['payment.moneroo'] = {
          enabled: existingSettings.payment.moneroo.enabled || false,
          environment: existingSettings.payment.moneroo.environment || "test",
          apiKey: existingSettings.payment.moneroo.secretKey || existingSettings.payment.moneroo.publicKey || "",
          defaultCurrency: existingSettings.payment.moneroo.defaultCurrency || "XOF",
          webhookSecret: existingSettings.payment.moneroo.webhookSecret || ""
        };
        needsUpdate = true;
      }
      
      if (!existingSettings.payment?.kkiapay || !existingSettings.payment.kkiapay.privateKey) {
        updates['payment.kkiapay'] = {
          enabled: existingSettings.payment?.kkiapay?.enabled || false,
          environment: existingSettings.payment?.kkiapay?.environment || "sandbox",
          publicKey: existingSettings.payment?.kkiapay?.publicKey || "",
          privateKey: existingSettings.payment?.kkiapay?.privateKey || existingSettings.payment?.kkiapay?.secretKey || "",
          secret: existingSettings.payment?.kkiapay?.secret || "",
          defaultCurrency: existingSettings.payment?.kkiapay?.defaultCurrency || "XOF",
          webhookSecret: existingSettings.payment?.kkiapay?.webhookSecret || ""
        };
        needsUpdate = true;
      }
      
      if (!existingSettings.payment?.pawapay) {
        updates['payment.pawapay'] = { enabled: false, apiKey: "", defaultCurrency: "XOF", webhookSecret: "" };
        needsUpdate = true;
      }
      
      if (!existingSettings.payment?.fedapay) {
        updates['payment.fedapay'] = { enabled: false, environment: "sandbox", publicKey: "", secretKey: "", defaultCurrency: "XOF", webhookSecret: "" };
        needsUpdate = true;
      }
      
      if (needsUpdate && Object.keys(updates).length > 0) {
        console.log('🔧 [BG] MIGRATION: Mise à jour settings...');
        await settingsCollection.updateOne(
          { key: "global" },
          { $set: updates, $currentDate: { updatedAt: true } }
        );
        console.log('✅ [BG] Settings migrés');
      }
    }
  } catch (initError) {
    console.log('⚠️ [BG] Init settings:', initError.message);
  }
}