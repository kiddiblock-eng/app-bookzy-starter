import { dbConnect} from "../../../../lib/db.js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";
import Projet from "../../../../models/Projet.js";

export async function GET() {
  try {
    await dbConnect();

    // 🔐 Authentification
    const token = cookies().get("bookzy_token")?.value;
    if (!token)
      return new Response(JSON.stringify({ message: "Non connecté" }), { status: 401 });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return new Response(
        JSON.stringify({ success: false, message: "ID utilisateur invalide" }),
        { status: 400 }
      );
    }

    // 🔍 Récupère les projets de l’utilisateur
    const projets = await Projet.find({ userId: new mongoose.Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .lean();

    // 🧮 Stats dynamiques
    const total = projets.length;
    const kits = projets.filter((p) => p.isPaid === true).length;
    const enCours = projets.filter((p) => p.statut === "en cours").length;

    // ✅ Renvoi formaté
    return new Response(
      JSON.stringify({
        success: true,
        total,
        kits,
        enCours,
        progression: Math.min(Math.round((total / 5) * 100), 100), // pour la barre
        projets,
      }),
      { status: 200 }
    );
  } catch (error) {
    console.error("❌ Erreur /api/projets/get :", error);
    return new Response(
      JSON.stringify({
        message: "Erreur serveur",
        error: error.message,
      }),
      { status: 500 }
    );
  }
}