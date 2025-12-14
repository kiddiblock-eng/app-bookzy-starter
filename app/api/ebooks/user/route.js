// app/api/ebooks/user/route.js
import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Projet from "../../../../models/Projet";  // ✅ Utiliser Projet au lieu de Ebook
import jwt from "jsonwebtoken";

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ Récupération sécurisée du cookie JWT
    const cookie = req.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("bookzy_token="))
      ?.split("=")[1];

    if (!token) {
      console.log("❌ Aucun token trouvé dans les cookies");
      return NextResponse.json(
        { success: false, message: "Utilisateur non connecté." },
        { status: 401 }
      );
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("✅ JWT décodé, userId:", decoded.id);
    } catch (err) {
      console.warn("JWT invalide ou expiré :", err.message);
      return NextResponse.json(
        { success: false, message: "Session expirée." },
        { status: 401 }
      );
    }

    // ✅ Récupération des PROJETS (pas Ebooks) de l'utilisateur connecté
    const projets = await Projet.find({ userId: decoded.id })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📚 ${projets.length} projets trouvés pour userId ${decoded.id}`);
    
    // 🔍 Debug : Affiche les premiers projets
    if (projets.length > 0) {
      console.log("Premier projet:", {
        id: projets[0]._id,
        titre: projets[0].titre,
        status: projets[0].status,
        isPaid: projets[0].isPaid,
        pdfUrl: projets[0].pdfUrl,
        coverUrl: projets[0].coverUrl,
      });
    } else {
      // 🔍 Si aucun projet, vérifie s'il y en a dans toute la collection
      const allProjets = await Projet.find({}).limit(5).lean();
      console.log(`⚠️ Aucun projet pour cet userId, mais ${allProjets.length} projets existent en base`);
      if (allProjets.length > 0) {
        console.log("Exemple de projet en base:", {
          id: allProjets[0]._id,
          userId: allProjets[0].userId,
          titre: allProjets[0].titre,
        });
      }
    }

    // 🎨 Formater pour le frontend (compatible avec ton interface)
    const ebooks = projets.map(p => ({
      _id: p._id.toString(),
      title: p.titre || "Sans titre",
      description: p.description || "",
      pages: p.pages || 20,
      chapters: p.chapters || 5,
      template: p.template || "modern",
      createdAt: p.createdAt,
      status: p.status, // COMPLETED, processing, DRAFT, ERROR
      isPaid: p.isPaid,
      
      // ✅ URLs des fichiers
      fileUrl: p.pdfUrl || null,  // PDF principal
      coverUrl: p.coverUrl || null,  // Couverture
      adsImages: p.adsImages || [],  // Affiches
      adsTexts: p.adsTexts || {},  // Textes marketing
    }));

    return NextResponse.json({
      success: true,
      ebooks,
      total: ebooks.length,
    });

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