export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Projet from "@/models/Projet.js";

export async function POST(req) {
  try {
    await dbConnect();

    // 🔒 Authentification
    const cookieStore = cookies();
    const token = cookieStore.get("bookzy_token")?.value;
    
    if (!token) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non authentifié" },
        { status: 401 }
      );
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();
    
    console.log("📥 [AJOUTER] Body reçu:", body);

    // 🧩 Contenu automatique du kit
    const contenu = [
      {
        id: "ebook",
        nom: `${body.titre || 'ebook'}.pdf`,
        url: "/kits/ebook.pdf",
        format: "PDF",
        taille: "2.4 Mo",
      },
      {
        id: "cover",
        nom: "Page de couverture.png",
        url: "/kits/cover.png",
        format: "PNG",
        taille: "1.1 Mo",
      },
      {
        id: "affiche1",
        nom: "Affiche publicitaire 1.png",
        url: "/kits/affiche1.png",
        format: "PNG",
        taille: "1.5 Mo",
      },
      {
        id: "affiche2",
        nom: "Affiche publicitaire 2.png",
        url: "/kits/affiche2.png",
        format: "PNG",
        taille: "1.6 Mo",
      },
    ];

    // 💾 Création du projet avec les BONS champs
    const projet = await Projet.create({
      userId,
      titre: body.titre,
      description: body.description,
      pages: parseInt(body.pages) || 20,
      chapters: parseInt(body.chapitres) || 5, // ✅ Frontend envoie "chapitres", modèle attend "chapters"
      tone: body.ton || "professionnel", // ✅ Frontend envoie "ton", modèle attend "tone"
      audience: body.audience || "Débutants",
      template: body.template || "modern",
      summary: body.outline ? body.outline.join("\n") : "", // ✅ Sauvegarde l'outline
      contenu,
      status: "DRAFT", // ✅ "status" pas "statut"
      isPaid: false,
      progress: 0
    });

    console.log("✅ [AJOUTER] Projet créé:", projet._id);

    return NextResponse.json({ 
      success: true, 
      projet: {
        _id: projet._id.toString(),
        titre: projet.titre,
        template: projet.template,
        summary: projet.summary
      }
    }, { status: 201 });

  } catch (error) {
    console.error("❌ Erreur /api/projets/ajouter :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur", error: error.message },
      { status: 500 }
    );
  }
}