export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    // 1. Connexion DB optimisée
    await dbConnect();

    // 2. Vérification Auth
    const cookieStore = cookies();
    const token = cookieStore.get("bookzy_token")?.value;

    if (!token) {
      return NextResponse.json(
        { success: false, message: "Utilisateur non connecté." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch (err) {
      return NextResponse.json(
        { success: false, message: "Session expirée." },
        { status: 401 }
      );
    }

    // 3. 🚀 RÉCUPÉRATION INTELLIGENTE
    // ✅ MODIFIÉ : Ajout de retryCount et updatedAt
    const projets = await Projet.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .select('titre pages status isPaid pdfUrl coverUrl createdAt updatedAt adsTexts adsImages retryCount') 
      .lean()
      .exec();

    // 4. Mapping & Calcul des indicateurs
    const ebooks = projets.map(p => {
      // ✅ VÉRIFICATION : Est-ce qu'il y a du contenu marketing ?
      const marketingExists = !!(
        p.adsTexts?.facebook || 
        p.adsTexts?.email || 
        p.adsTexts?.landing || 
        p.adsTexts?.whatsapp
      );
      
      // ✅ VÉRIFICATION : Est-ce qu'il y a des images ?
      const imagesExist = Array.isArray(p.adsImages) && p.adsImages.length > 0;

      return {
        _id: p._id.toString(),
        title: p.titre || "Sans titre",
        description: "",
        pages: p.pages || 0,
        createdAt: p.createdAt,
        updatedAt: p.updatedAt, // ✅ AJOUTÉ
        status: p.status,
        isPaid: p.isPaid,
        fileUrl: p.pdfUrl || null,
        coverUrl: p.coverUrl || null,
        retryCount: p.retryCount || 0, // ✅ AJOUTÉ
        
        hasMarketing: marketingExists,
        hasVisuels: imagesExist,

        adsImages: [], 
        adsTexts: {},
      };
    });

    return NextResponse.json(
      {
        success: true,
        ebooks,
        total: ebooks.length,
      },
      {
        status: 200,
        headers: {
          'Cache-Control': 'no-store, no-cache, must-revalidate, proxy-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      }
    );

  } catch (err) {
    console.error("❌ Erreur récupération projets :", err);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur interne du serveur.",
        error: err.message,
      },
      { status: 500 }
    );
  }
}