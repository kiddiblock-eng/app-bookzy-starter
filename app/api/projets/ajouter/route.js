import { dbConnect } from "../../../../lib/db.js";
import { cookies } from "next/headers";
import jwt from "jsonwebtoken";
import Projet from "../../../../models/Projet.js";

export async function POST(req) {
  try {
    await dbConnect();

    // 🔒 Authentification
    const token = cookies().get("bookzy_token")?.value;
    if (!token)
      return new Response(
        JSON.stringify({ message: "Utilisateur non authentifié" }),
        { status: 401 }
      );

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const userId = decoded.id;

    const body = await req.json();

    // 🧩 Contenu automatique du kit
    const contenu = [
      {
        id: "ebook",
        nom: `${body.titre}.pdf`,
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
      {
        id: "texte1",
        nom: "Texte de vente 1.txt",
        url: "/kits/texte1.txt",
        format: "TXT",
        taille: "4 Ko",
      },
      {
        id: "texte2",
        nom: "Texte de vente 2.txt",
        url: "/kits/texte2.txt",
        format: "TXT",
        taille: "5 Ko",
      },
      {
        id: "texte3",
        nom: "Texte de vente 3.txt",
        url: "/kits/texte3.txt",
        format: "TXT",
        taille: "6 Ko",
      },
      {
        id: "description",
        nom: "Description du produit.txt",
        url: "/kits/description.txt",
        format: "TXT",
        taille: "3 Ko",
      },
    ];

    // 💾 Création du projet
    const projet = await Projet.create({
      ...body,
      userId,
      contenu,
      statut: "en cours",
      isPaid: false,
    });

    return new Response(
      JSON.stringify({ success: true, projet }),
      { status: 201 }
    );
  } catch (error) {
    console.error("❌ Erreur /api/projets/ajouter :", error);
    return new Response(
      JSON.stringify({ message: "Erreur serveur", error: error.message }),
      { status: 500 }
    );
  }
}