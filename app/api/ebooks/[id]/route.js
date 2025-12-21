export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers"; // Plus propre pour lire les cookies
import { dbConnect } from "@/lib/db";   // ✅ On utilise ta connexion optimisée
import Projet from "@/models/Projet";   // Vérifie que le chemin est bon
import jwt from "jsonwebtoken";

// Force le recalcul (pas de cache sur les détails, on veut les dernières infos)

export async function GET(req, { params }) {
  try {
    // 1. Connexion Optimisée (maxPoolSize: 1)
    await dbConnect();

    // 2. Vérification Auth (Standardisée)
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

    // 3. Récupération COMPLÈTE (Pas de .select ici !)
    const projet = await Projet.findOne({
      _id: projetId,
      userId: decoded.id // Sécurité : on vérifie que c'est bien son projet
    }).lean();

    if (!projet) {
      return NextResponse.json({ error: "Projet introuvable" }, { status: 404 });
    }

    // 4. On renvoie tout le paquet
    return NextResponse.json({
      success: true,
      projet // Contient pdfUrl, adsTexts, adsImages, etc.
    });

  } catch (e) {
    console.error("❌ GET Projet error:", e);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}