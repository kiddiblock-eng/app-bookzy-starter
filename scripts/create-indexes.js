import 'dotenv/config';
import { dbConnect } from "../lib/db.js";
import Projet from "../models/Projet.js";
import User from "../models/User.js";
import Vente from "../models/vente.js";

async function createIndexes() {
  try {
    await dbConnect();
    
    console.log("📊 Création des index MongoDB...");
    
    // Index Projet
    try {
      await Projet.collection.createIndex({ userId: 1, createdAt: -1 });
      console.log("✅ Index créé: Projet.userId + createdAt");
    } catch (e) {
      if (e.code === 86) {
        console.log("⚠️  Index Projet existe déjà (OK)");
      } else throw e;
    }
    
    // Index User
    try {
      await User.collection.createIndex({ email: 1 });
      console.log("✅ Index créé: User.email");
    } catch (e) {
      if (e.code === 86) {
        console.log("⚠️  Index User existe déjà (OK)");
      } else throw e;
    }
    
    // Index Vente
    try {
      await Vente.collection.createIndex({ userId: 1, createdAt: -1 });
      console.log("✅ Index créé: Vente.userId + createdAt");
    } catch (e) {
      if (e.code === 86) {
        console.log("⚠️  Index Vente existe déjà (OK)");
      } else throw e;
    }
    
    console.log("🎉 Tous les index sont prêts !");
    process.exit(0);
  } catch (error) {
    console.error("❌ Erreur:", error);
    process.exit(1);
  }
}

createIndexes();