import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import jwt from "jsonwebtoken";
import { NextResponse } from "next/server";

export async function POST(request) {
  try {
    await dbConnect();

    // 1. Auth
    const cookie = request.headers.get("cookie") || "";
    const token = cookie.split(";").map((c) => c.trim()).find((c) => c.startsWith("bookzy_token="))?.split("=")[1];

    if (!token) {
      return NextResponse.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json({ success: false, error: "Session expirée" }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id || decoded._id;
    const { trendId, action } = await request.json();

    if (!trendId || !action) {
      return NextResponse.json({ success: false, error: "Données manquantes" }, { status: 400 });
    }

    // 2. 🚀 OPTIMISATION ATOMIQUE (Ultra rapide)
    // Au lieu de charger l'user, modifier le tableau, et sauvegarder...
    // On envoie juste l'ordre précis à MongoDB.
    
    let updateQuery = {};

    if (action === "add") {
      // $addToSet : Ajoute SEULEMENT si ce n'est pas déjà dedans (évite les doublons)
      updateQuery = { $addToSet: { favorites: trendId } };
    } else {
      // $pull : Retire l'élément du tableau
      updateQuery = { $pull: { favorites: trendId } };
    }

    await User.findByIdAndUpdate(userId, updateQuery);

    return NextResponse.json({
      success: true,
      message: action === "add" ? "Ajouté aux favoris" : "Retiré des favoris",
    });

  } catch (error) {
    console.error("❌ Erreur POST /api/trends/favorites:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}