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
    
    const { titre, introduction, conclusion, chapters, template, aiUsed } = await req.json();
    
    // ✅ VALIDATION BASIQUE
    if (!titre || !chapters || !Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json(
        { success: false, error: "Titre et chapitres requis" },
        { status: 400 }
      );
    }
    
    // ✅ FILTRER LES CHAPITRES VIDES (au lieu de rejeter)
    const validChapters = chapters.filter(ch => {
      const hasTitle = ch.title && ch.title.trim().length > 0;
      const hasContent = ch.content && ch.content.trim().length > 0;
      return hasTitle && hasContent;
    });
    
    // ✅ VÉRIFIER qu'il reste au moins 1 chapitre valide
    if (validChapters.length === 0) {
      return NextResponse.json(
        { success: false, error: "Au moins un chapitre doit avoir un titre et du contenu" },
        { status: 400 }
      );
    }
    
    console.log(`✅ [Express] Création projet pour user ${userId}`);
    console.log(`📖 [Express] Titre: ${titre}`);
    console.log(`📚 [Express] Chapitres reçus: ${chapters.length}`);
    console.log(`✅ [Express] Chapitres valides: ${validChapters.length}`);
    console.log(`📝 [Express] Intro: ${introduction ? 'Oui' : 'Non'}`);
    console.log(`📝 [Express] Conclusion: ${conclusion ? 'Oui' : 'Non'}`);
    console.log(`🤖 [Express] IA utilisée: ${aiUsed || 0} fois`);
    
    // ✅ CALCULER LE COÛT IA - 5 INCLUSES
    const aiIncluded = 5;
    const aiExtra = Math.max(0, (aiUsed || 0) - aiIncluded);
    const aiExtraCost = aiExtra * 50;
    
    // ✅ CRÉER LE PROJET avec validChapters
    const projet = await Projet.create({
      userId,
      titre,
      introduction: introduction || "",
      conclusion: conclusion || "",
      description: `eBook généré via Bookzy Express avec ${validChapters.length} chapitres`,
      template: template || "modern",
      pages: 0,
      chapters: validChapters.length,
      status: "DRAFT",
      progress: 0,
      isPaid: false,
      
      // ✅ Champs Express
      expressMode: true,
      expressChapters: validChapters.map((ch, i) => ({
        number: i + 1, // Re-numéroter de 1 à N
        title: ch.title,
        content: ch.content
      })),
      
      // ✅ Tracking IA
      aiImprovementsUsed: aiUsed || 0,
      aiIncluded: aiIncluded,
      aiExtraCost: aiExtraCost
    });
    
    console.log(`✅ [Express] Projet créé: ${projet._id}`);
    console.log(`💰 [Express] Coût IA: ${aiExtraCost} FCFA (${aiUsed || 0} utilisées, ${aiIncluded} incluses, ${aiExtra} extra)`);
    
    return NextResponse.json({
      success: true,
      projetId: projet._id.toString(),
      message: `Projet créé avec ${validChapters.length} chapitre${validChapters.length > 1 ? 's' : ''}`,
      chaptersCreated: validChapters.length,
      chaptersSkipped: chapters.length - validChapters.length,
      aiExtraCost: aiExtraCost
    });
    
  } catch (error) {
    console.error("❌ [Express Create] Erreur:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}