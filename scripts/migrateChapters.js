// scripts/migrateChapters.js
import mongoose from "mongoose";
import dotenv from "dotenv";

// ✅ AJOUT : Charger les variables d'environnement
dotenv.config({ path: '.env.local' });

const MONGODB_URI = process.env.MONGODB_URI;

// ✅ AJOUT : Vérification
if (!MONGODB_URI) {
  console.error("❌ ERREUR : MONGODB_URI non définie dans .env.local");
  console.log("💡 Vérifie que ton fichier .env.local existe et contient MONGODB_URI");
  process.exit(1);
}

async function migrateChapters() {
  try {
    console.log("🔗 Connexion à MongoDB...");
    await mongoose.connect(MONGODB_URI);
    console.log("✅ Connecté à la base de données\n");

    const db = mongoose.connection.db;
    const projetsCollection = db.collection("projets");

    // Trouver tous les projets où chapters est un String
    console.log("🔍 Recherche des projets à migrer...");
    const buggedProjects = await projetsCollection.find({ 
      chapters: { $type: "string" } 
    }).toArray();

    const total = buggedProjects.length;
    console.log(`📦 ${total} projet(s) à corriger\n`);

    if (total === 0) {
      console.log("✅ Aucun projet à migrer. Base de données propre !");
      await mongoose.disconnect();
      return;
    }

    let fixed = 0;
    let errors = 0;

    for (const projet of buggedProjects) {
      try {
        const updates = {};

        // Déplacer le HTML vers chaptersText si pas déjà fait
        if (!projet.chaptersText && typeof projet.chapters === 'string') {
          updates.chaptersText = projet.chapters;
        }

        // Compter les chapitres réels dans le HTML
        const htmlContent = typeof projet.chapters === 'string' ? projet.chapters : '';
        const chapterCount = (htmlContent.match(/<h2/gi) || []).length;
        updates.chapters = chapterCount > 0 ? chapterCount : 8; // Default 8

        // Appliquer la mise à jour
        await projetsCollection.updateOne(
          { _id: projet._id },
          { $set: updates }
        );

        console.log(`✅ [${fixed + 1}/${total}] "${projet.titre}" → ${updates.chapters} chapitres`);
        fixed++;

      } catch (err) {
        console.error(`❌ Erreur projet "${projet.titre}" (${projet._id}):`, err.message);
        errors++;
      }
    }

    console.log("\n" + "=".repeat(50));
    console.log("📊 RÉSULTAT DE LA MIGRATION");
    console.log("=".repeat(50));
    console.log(`✅ Corrigés avec succès : ${fixed}`);
    console.log(`❌ Erreurs rencontrées  : ${errors}`);
    console.log(`📦 Total traité         : ${total}`);
    console.log("=".repeat(50) + "\n");

    if (errors === 0) {
      console.log("🎉 Migration terminée avec succès !");
    } else {
      console.log("⚠️  Migration terminée avec quelques erreurs");
    }

    await mongoose.disconnect();
    console.log("🔌 Déconnexion de MongoDB");

  } catch (error) {
    console.error("\n❌ ERREUR FATALE :", error);
    process.exit(1);
  }
}

// Exécution
migrateChapters();