export const dynamic = "force-dynamic";
export const maxDuration = 60;

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
import { generateExpressPDF } from "@/lib/express-pdf";
import jwt from "jsonwebtoken";

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie.split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];
  
  try {
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
}

export async function POST(req) {
  try {
    await dbConnect();
    
    const userId = getUserIdFromCookie(req);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }
    
    const { titre, introduction, conclusion, chapters, template } = await req.json();
    
    // Validation
    if (!titre || !chapters || chapters.length === 0) {
      return NextResponse.json(
        { success: false, error: "Données manquantes" },
        { status: 400 }
      );
    }
    
    if (chapters.some(ch => !ch.title || !ch.content)) {
      return NextResponse.json(
        { success: false, error: "Tous les chapitres doivent avoir un titre et du contenu" },
        { status: 400 }
      );
    }
    
    console.log(`👁️ [PREVIEW] Génération aperçu pour "${titre}" (${chapters.length} chapitres)`);
    
    // ✅ GÉNÉRER PDF AVEC WATERMARK
    const pdfResult = await generateExpressPDF({
      titre,
      introduction: introduction || "",
      conclusion: conclusion || "",
      chapters,
      template: template || "modern",
      watermark: true // ⭐ MODE APERÇU
    });
    
    // ✅ DEBUG COMPLET
    console.log(`🔍 [PREVIEW DEBUG] pdfResult complet :`, JSON.stringify(pdfResult, null, 2));
    
    if (!pdfResult.success) {
      console.error("❌ [PREVIEW] Erreur génération PDF:", pdfResult.error);
      return NextResponse.json(
        { success: false, error: "Erreur lors de la génération du PDF" },
        { status: 500 }
      );
    }
    
    console.log(`📄 [PREVIEW] PDF aperçu généré : ${pdfResult.pdfUrl}`);
    console.log(`🔍 [PREVIEW DEBUG] pdfResult.pdfUrl type:`, typeof pdfResult.pdfUrl);
    console.log(`🔍 [PREVIEW DEBUG] pdfResult.pdfUrl value:`, pdfResult.pdfUrl);
    
    // Vérifier que l'URL existe
    if (!pdfResult.pdfUrl) {
      console.error("❌ [PREVIEW] pdfResult.pdfUrl est undefined/null !");
      return NextResponse.json(
        { success: false, error: "URL du PDF non générée" },
        { status: 500 }
      );
    }
    
    // Chercher si projet existant pour ce contenu
    let projet = await Projet.findOne({ 
      userId, 
      titre,
      expressMode: true,
      isPaid: false,
      status: { $ne: "COMPLETED" }
    }).sort({ createdAt: -1 });
    
    if (projet) {
      // ✅ METTRE À JOUR LE PROJET EXISTANT
      projet.previewPdfUrl = pdfResult.pdfUrl;
      projet.expressChapters = chapters;
      projet.template = template || "modern";
      projet.status = "PREVIEW_READY";
      projet.introduction = introduction || "";
      projet.conclusion = conclusion || "";
      
      console.log(`🔍 [PREVIEW DEBUG] Avant save - projet.previewPdfUrl:`, projet.previewPdfUrl);
      
      await projet.save();
      
      console.log(`♻️ [PREVIEW] Projet existant mis à jour : ${projet._id}`);
      console.log(`📎 [PREVIEW] URL aperçu sauvegardée : ${projet.previewPdfUrl}`);
    } else {
      // ✅ CRÉER NOUVEAU PROJET
      console.log(`🔍 [PREVIEW DEBUG] Création nouveau projet avec previewPdfUrl:`, pdfResult.pdfUrl);
      
      projet = await Projet.create({
        userId,
        titre,
        expressMode: true,
        expressChapters: chapters,
        template: template || "modern",
        introduction: introduction || "",
        conclusion: conclusion || "",
        previewPdfUrl: pdfResult.pdfUrl, // ⭐ IMPORTANT : URL ICI
        status: "PREVIEW_READY",
        isPaid: false
      });
      
      console.log(`✨ [PREVIEW] Nouveau projet créé : ${projet._id}`);
      console.log(`📎 [PREVIEW] URL aperçu sauvegardée : ${projet.previewPdfUrl}`);
      console.log(`🔍 [PREVIEW DEBUG] Projet après création :`, {
        id: projet._id.toString(),
        previewPdfUrl: projet.previewPdfUrl,
        pdfUrl: projet.pdfUrl
      });
    }
    
    return NextResponse.json({
      success: true,
      projetId: projet._id.toString(),
      message: "Aperçu généré avec succès"
    });
    
  } catch (error) {
    console.error("❌ [PREVIEW] Erreur globale:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
