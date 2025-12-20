import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // ✅ Gestion propre des cookies
import { dbConnect } from "@/lib/db";   // ✅ Connexion optimisée centralisée
import Projet from "@/models/Projet";   // (Adapte le chemin si nécessaire)
import jwt from "jsonwebtoken";

export async function PUT(req, { params }) {
  try {
    // 1. Connexion DB Rapide
    await dbConnect();

    // 2. Auth standardisée (plus robuste)
    const cookieStore = cookies();
    const token = cookieStore.get("bookzy_token")?.value;

    if (!token) {
      return NextResponse.json({ error: "Non autorisé" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
      return NextResponse.json({ error: "Session expirée" }, { status: 401 });
    }

    const projetId = params.id;
    const updateData = await req.json();

    // 3. Mise à jour sécurisée
    // On s'assure que le projet appartient bien au user (userId: decoded.id)
    const projet = await Projet.findOneAndUpdate(
      { _id: projetId, userId: decoded.id },
      { $set: updateData }, // $set est plus explicite pour dire "met à jour ces champs"
      { new: true } // Renvoie la version mise à jour
    );

    if (!projet) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      projet
    });

  } catch (e) {
    console.error("❌ UPDATE Projet error:", e);
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}