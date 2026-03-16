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
    
    const { titre, introduction, conclusion, chapters, template } = await req.json();
    
    // ✅ VALIDATION
    if (!titre || !chapters || !Array.isArray(chapters) || chapters.length === 0) {
      return NextResponse.json(
        { success: false, error: "Données invalides" },
        { status: 400 }
      );
    }
    
    // ✅ FILTRER LES CHAPITRES VIDES
    const validChapters = chapters.filter(ch => {
      const hasTitle = ch.title && ch.title.trim().length > 0;
      const hasContent = ch.content && ch.content.trim().length > 0;
      return hasTitle && hasContent;
    });
    
    if (validChapters.length === 0) {
      return NextResponse.json(
        { success: false, error: "Au moins un chapitre doit avoir un titre et du contenu" },
        { status: 400 }
      );
    }
    
    console.log(`🧪 [Test Express] Création projet TEST`);
    console.log(`📖 [Test] Titre: ${titre}`);
    console.log(`📚 [Test] Chapitres reçus: ${chapters.length}`);
    console.log(`✅ [Test] Chapitres valides: ${validChapters.length}`);
    
    // ✅ CRÉER LE PROJET avec validChapters
    const projet = await Projet.create({
      userId,
      titre,
      introduction: introduction || "",
      conclusion: conclusion || "",
      description: `TEST eBook Express avec ${validChapters.length} chapitres`,
      template: template || "modern",
      pages: 0,
      chapters: validChapters.length,
      status: "DRAFT",
      progress: 0,
      isPaid: true, // ✅ TEST MODE = Pas de paiement
      expressMode: true,
      expressChapters: validChapters.map((ch, i) => ({
        number: i + 1, // Re-numéroter
        title: ch.title,
        content: ch.content
      }))
    });
    
    console.log(`✅ [Test Express] Projet créé: ${projet._id}`);
    
    // ✅ FORCER LOCALHOST EN MODE TEST
    const baseUrl = 'http://localhost:3000';
    const generateUrl = `${baseUrl}/api/express/generate`;
    
    console.log(`📡 [Test] URL génération: ${generateUrl}`);
    
    const generateRes = await fetch(generateUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        projetId: projet._id.toString(),
        transactionId: "TEST_NO_PAYMENT"
      })
    });
    
    console.log(`📡 [Test] Status: ${generateRes.status}`);
    
    const contentType = generateRes.headers.get('content-type');
    
    if (!generateRes.ok) {
      const text = await generateRes.text();
      console.error(`❌ [Test] Erreur génération (status ${generateRes.status}):`, text.substring(0, 500));
      
      return NextResponse.json({
        success: false,
        error: `Erreur génération (status ${generateRes.status})`,
        projetId: projet._id.toString(),
        details: text.substring(0, 200)
      });
    }
    
    if (!contentType?.includes('application/json')) {
      const text = await generateRes.text();
      console.error(`❌ [Test] Réponse non-JSON:`, text.substring(0, 200));
      
      return NextResponse.json({
        success: false,
        error: "La génération a retourné du HTML au lieu de JSON",
        projetId: projet._id.toString()
      });
    }
    
    const generateData = await generateRes.json();
    console.log(`✅ [Test] Génération lancée avec succès`);
    
    return NextResponse.json({
      success: true,
      message: `Génération test lancée ! ${validChapters.length} chapitre${validChapters.length > 1 ? 's' : ''} créé${validChapters.length > 1 ? 's' : ''}`,
      projetId: projet._id.toString(),
      chaptersCreated: validChapters.length,
      chaptersSkipped: chapters.length - validChapters.length,
      generateResult: generateData
    });
    
  } catch (error) {
    console.error("❌ [Test Express] Erreur:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}