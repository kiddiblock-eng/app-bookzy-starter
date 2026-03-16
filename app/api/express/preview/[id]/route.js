export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Projet from "@/models/Projet";
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

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    const userId = getUserIdFromCookie(req);
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }
    
    const { id } = params;
    
    // Validation format MongoDB ObjectId
    if (!id || !id.match(/^[0-9a-fA-F]{24}$/)) {
      return NextResponse.json(
        { success: false, error: "ID projet invalide" },
        { status: 400 }
      );
    }
    
    console.log(`🔍 [PREVIEW GET] Récupération aperçu : ${id}`);
    
    // ✅ RÉCUPÉRER LE PROJET
    const projet = await Projet.findOne({ 
      _id: id, 
      userId
    });
    
    if (!projet) {
      console.warn(`⚠️ [PREVIEW GET] Projet non trouvé ou accès refusé : ${id}`);
      return NextResponse.json(
        { success: false, error: "Projet introuvable" },
        { status: 404 }
      );
    }
    
    // ✅ LOGS DE DÉBOGAGE
    console.log(`🔍 [PREVIEW GET DEBUG] Projet trouvé :`, {
      id: projet._id.toString(),
      titre: projet.titre,
      previewPdfUrl: projet.previewPdfUrl,
      pdfUrl: projet.pdfUrl,
      status: projet.status,
      isPaid: projet.isPaid
    });
    
    // Vérifier qu'il y a bien un aperçu
    if (!projet.previewPdfUrl) {
      console.warn(`⚠️ [PREVIEW GET] Pas d'aperçu disponible : ${id}`);
      console.warn(`📋 [PREVIEW GET] Tous les champs du projet :`, projet.toObject());
      return NextResponse.json(
        { success: false, error: "Aperçu non disponible pour ce projet" },
        { status: 404 }
      );
    }
    
    console.log(`✅ [PREVIEW GET] Aperçu récupéré : ${projet.previewPdfUrl}`);
    
    return NextResponse.json({
      success: true,
      previewPdfUrl: projet.previewPdfUrl,
      titre: projet.titre,
      template: projet.template,
      isPaid: projet.isPaid,
      status: projet.status
    });
    
  } catch (error) {
    console.error("❌ [PREVIEW GET] Erreur:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}