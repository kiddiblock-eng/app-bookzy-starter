import { dbConnect } from "@/lib/db.js";
import Projet from "@/models/Projet.js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import mongoose from "mongoose";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    // 🔒 Authentification via cookie JWT
    const token = cookies().get("bookzy_token")?.value;
    if (!token) {
      return new Response(
        JSON.stringify({ message: "Utilisateur non authentifié" }),
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id?.toString();

    const { id } = params;

    // 🔍 Recherche du projet appartenant à l'utilisateur connecté
    const projet = await Projet.findOne({
      _id: new mongoose.Types.ObjectId(id),
      userId: new mongoose.Types.ObjectId(userId),
    })
      .select("-__v")
      .lean();

    if (!projet) {
      return new Response(
        JSON.stringify({ message: "Projet non trouvé ou accès refusé" }),
        { status: 404 }
      );
    }

    // ✅ Formatage propre du projet
    const projetFormate = {
      ...projet,
      id: projet._id.toString(),
      date: new Date(projet.createdAt).toLocaleDateString("fr-FR"),
      datePaiement: projet.isPaid
        ? new Date(projet.updatedAt).toLocaleDateString("fr-FR")
        : null,
      contenu: projet.contenu || [],
    };

    console.log("📦 Projet chargé :", projetFormate.titre || projetFormate.id);

    // 🔁 On retourne { projet: ... } pour correspondre à ton front
    return new Response(JSON.stringify({ projet: projetFormate }), {
      status: 200,
      headers: { "Content-Type": "application/json" },
    });
  } catch (error) {
    console.error("❌ Erreur /api/projets/[id] :", error);
    return new Response(
      JSON.stringify({ message: "Erreur serveur", error: error.message }),
      { status: 500 }
    );
  }
}
