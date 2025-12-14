// lib/db.js

import mongoose from "mongoose";

let cached = global.mongoose;
if (!cached) cached = global.mongoose = { conn: null, promise: null };

export async function dbConnect() {
  const MONGODB_URI = process.env.MONGODB_URI;
  
  if (!MONGODB_URI) {
    throw new Error("❌ MONGODB_URI manquant dans .env.local");
  }

  if (cached.conn) {
    console.log("✅ Déjà connecté à MongoDB");
    return cached.conn;
  }

  if (!cached.promise) {
    console.log("🔄 Tentative de connexion à MongoDB...");
    cached.promise = mongoose
      .connect(MONGODB_URI, {
        bufferCommands: false,
        serverSelectionTimeoutMS: 10000,
      })
      .then(async (mongooseInstance) => {
        console.log("✅ Connexion MongoDB réussie !");

        // 🔥 MIGRATION AUTO - SUPPRESSION INDEX transactionId_1
        try {
          const db = mongooseInstance.connection.db;
          const collection = db.collection("transactions");
          
          const indexes = await collection.indexes();
          const oldIndex = indexes.find(idx => 
            idx.name === 'transactionId_1' && idx.unique === true
          );
          
          if (oldIndex) {
            console.log('🔧 MIGRATION: Suppression ancien index unique transactionId_1...');
            await collection.dropIndex('transactionId_1');
            console.log('✅ Ancien index supprimé avec succès');
          } else {
            console.log('✅ Aucun ancien index à migrer');
          }
        } catch (migrationError) {
          if (migrationError.code !== 27) {
            console.log('⚠️ Migration index:', migrationError.message);
          }
        }

        // 🔥 MIGRATION TRANSACTIONS - Ajouter createdAt manquant
        try {
          const db = mongooseInstance.connection.db;
          const transactionsCollection = db.collection("transactions");
          
          const missingCreatedAt = await transactionsCollection.countDocuments({
            createdAt: { $exists: false }
          });
          
          if (missingCreatedAt > 0) {
            console.log(`🔧 MIGRATION: ${missingCreatedAt} transactions sans createdAt détectées`);
            
            // Utilise updatedAt si disponible, sinon date actuelle
            const result = await transactionsCollection.updateMany(
              { createdAt: { $exists: false } },
              [
                {
                  $set: {
                    createdAt: {
                      $ifNull: ["$updatedAt", new Date()]
                    }
                  }
                }
              ]
            );
            
            console.log(`✅ ${result.modifiedCount} transactions corrigées avec createdAt`);
          } else {
            console.log('✅ Toutes les transactions ont un createdAt valide');
          }
        } catch (migrationError) {
          console.log('⚠️ Migration transactions:', migrationError.message);
        }

        // 🔥 INITIALISATION & MIGRATION SETTINGS
        try {
          const db = mongooseInstance.connection.db;
          const settingsCollection = db.collection("settings");
          
          const existingSettings = await settingsCollection.findOne({ key: "global" });
          
          if (!existingSettings) {
            console.log('🔧 INIT: Création des settings par défaut...');
            
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
            
            console.log('✅ Settings par défaut créés');
          } else {
            // 🔧 MIGRATION: Ajouter nicheGenerate et nicheAnalyze si absents
            const updates = {};
            let needsUpdate = false;
            
            // Migration Gemini textModel/imageModel
            if (existingSettings.ai?.providers?.gemini && !existingSettings.ai.providers.gemini.textModel) {
              updates['ai.providers.gemini'] = {
                enabled: existingSettings.ai.providers.gemini.enabled || false,
                apiKey: existingSettings.ai.providers.gemini.apiKey || "",
                textModel: existingSettings.ai.providers.gemini.model || "gemini-2.5-flash",
                imageModel: "gemini-2.5-flash-image"
              };
              needsUpdate = true;
            }
            
            // Ajouter nicheGenerate si absent
            if (!existingSettings.ai?.generation?.nicheGenerate) {
              updates['ai.generation.nicheGenerate'] = {
                provider: "gemini",
                model: "gemini-2.5-flash"
              };
              needsUpdate = true;
            }
            
            // Ajouter nicheAnalyze si absent
            if (!existingSettings.ai?.generation?.nicheAnalyze) {
              updates['ai.generation.nicheAnalyze'] = {
                provider: "gemini",
                model: "gemini-2.5-flash"
              };
              needsUpdate = true;
            }
            
            // Migration payment
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
              updates['payment.pawapay'] = {
                enabled: false,
                apiKey: "",
                defaultCurrency: "XOF",
                webhookSecret: ""
              };
              needsUpdate = true;
            }
            
            if (!existingSettings.payment?.fedapay) {
              updates['payment.fedapay'] = {
                enabled: false,
                environment: "sandbox",
                publicKey: "",
                secretKey: "",
                defaultCurrency: "XOF",
                webhookSecret: ""
              };
              needsUpdate = true;
            }
            
            if (needsUpdate && Object.keys(updates).length > 0) {
              console.log('🔧 MIGRATION: Mise à jour settings...', Object.keys(updates));
              await settingsCollection.updateOne(
                { key: "global" },
                { 
                  $set: updates,
                  $currentDate: { updatedAt: true }
                }
              );
              console.log('✅ Settings migrés');
            }
          }
        } catch (initError) {
          console.log('⚠️ Init settings:', initError.message);
        }

        return mongooseInstance;
      })
      .catch((err) => {
        console.error("❌ Erreur connexion MongoDB:", err.message);
        throw err;
      });
  }

  cached.conn = await cached.promise;
  return cached.conn;
}