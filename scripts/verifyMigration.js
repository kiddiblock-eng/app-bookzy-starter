// scripts/verifyMigration.js
import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config({ path: '.env.local' });

async function verify() {
  await mongoose.connect(process.env.MONGODB_URI);
  
  const db = mongoose.connection.db;
  const projets = db.collection("projets");

  // Vérifier les projets migrés
  const goodProjects = await projets.countDocuments({ 
    chapters: { $type: "number" },
    chaptersText: { $exists: true }
  });

  // Vérifier les projets encore buggés
  const badProjects = await projets.countDocuments({ 
    chapters: { $type: "string" } 
  });

  console.log("📊 ÉTAT DE LA BASE");
  console.log(`✅ Projets migrés : ${goodProjects}`);
  console.log(`❌ Projets buggés : ${badProjects}`);
  console.log(`📦 Total         : ${goodProjects + badProjects}`);

  await mongoose.disconnect();
}

verify();