export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAIText } from "../../../../lib/ai";
import { dbConnect } from "../../../../lib/db"; 
import { jwtVerify } from "jose";

// --- GESTION DES QUOTAS ---
async function getAnalysisCount(userId) {
  const mongoose = await dbConnect();
  const db = mongoose.connection.db;
  const today = new Date().toISOString().split('T')[0];
  const record = await db.collection('analyses_quota').findOne({ userId, date: today });
  return record ? record.count : 0;
}

async function incrementAnalysisCount(userId) {
  const mongoose = await dbConnect();
  const db = mongoose.connection.db;
  const today = new Date().toISOString().split('T')[0];
  await db.collection('analyses_quota').updateOne(
    { userId, date: today },
    { $inc: { count: 1 }, $set: { lastAnalysis: new Date() } },
    { upsert: true }
  );
}

// --- ROUTE POST ---
export async function POST(req) {
  try {
    // 1. Authentification
    const token = req.cookies.get("bookzy_token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.userId;

    // 2. Vérification Quota
    const todayCount = await getAnalysisCount(userId);
    if (todayCount >= 13) return NextResponse.json({ 
      success: false, 
      message: "Limite quotidienne atteinte (3 analyses/jour). Revenez demain !",
      remainingToday: 0
    }, { status: 429 });

    // 3. Récupération de l'URL
    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, message: "URL manquante" }, { status: 400 });

    console.log(`📡 [YOUBOOK] Analyse via RapidAPI pour : ${url}`);

    // 4. Appel à RapidAPI (Extraction de la transcription)
    const response = await fetch(`https://youtube-transcripts.p.rapidapi.com/youtube/transcript?url=${encodeURIComponent(url)}&chunkSize=500`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': process.env.RAPIDAPI_HOST
      }
    });

    const data = await response.json();
    
    // 5. Extraction du texte
    const rawSegments = data.content || data.transcript || [];
    let transcriptText = Array.isArray(rawSegments) 
        ? rawSegments.map(item => item.text || item.content || String(item)).join(' ') 
        : String(rawSegments);

    if (transcriptText.length < 100) {
      return NextResponse.json({ success: false, message: "Contenu audio insuffisant." }, { status: 400 });
    }

    // 6. Analyse Gemini (Fenêtre de 15 000 caractères)
    const safeText = transcriptText.substring(0, 15000); 
    console.log(`🧠 Envoi de ${safeText.length} caractères à Gemini...`);

    const prompt = `Tu es l'expert Ghostwriter et Analyste de Bookzy.
    
TRANSCRIPTION VIDÉO YOUTUBE :
"${safeText}"

TA MISSION : Transformer cette transcription en un concept d'eBook professionnel.

INSTRUCTIONS POUR LE JSON :
- "titre" : Un titre accrocheur, court et vendeur (max 80 caractères)
- "description" : Un résumé captivant de la valeur ajoutée (max 250 caractères)
- "tone" : Style éditorial détecté (professionnel/simple/expert/inspirant)
- "audience" : Cible idéale (Débutants/Étudiants/Entrepreneurs/Grand Public)
- "key_insights" : Un tableau de 3 faits, chiffres ou idées clés concrètes
- "verbatim" : La citation la plus puissante ou phrase mémorable extraite du texte

RÉPONDS UNIQUEMENT AU FORMAT JSON PUR (sans markdown, sans backticks) :
{
  "titre": "...",
  "description": "...",
  "tone": "...",
  "audience": "...",
  "key_insights": ["...", "...", "..."],
  "verbatim": "..."
}`;

    // Appel au modèle Flash pour la rapidité
    const aiResponse = await getAIText("ebook", prompt, 600, "gemini-1.5-flash");
    
    let analysis;
    try {
      const cleaned = aiResponse.trim().replace(/```json|```/g, '');
      const jsonMatch = cleaned.match(/\{[\s\S]*\}/);
      analysis = JSON.parse(jsonMatch[0]);
    } catch (e) {
      console.error("❌ Erreur parsing JSON IA:", aiResponse);
      return NextResponse.json({ success: false, message: "L'IA a renvoyé un format invalide." }, { status: 500 });
    }

    // 7. Finalisation et mise à jour quota
    await incrementAnalysisCount(userId);
    
    console.log("✅ Analyse réussie!");

    return NextResponse.json({
      success: true,
      analysis: {
        titre: analysis.titre,
        description: analysis.description,
        tone: analysis.tone,
        audience: analysis.audience,
        key_insights: analysis.key_insights || [],
        verbatim: analysis.verbatim || ""
      },
      remainingToday: 3 - (todayCount + 1)
    });

  } catch (error) {
    console.error("❌ ERREUR API:", error.message);
    return NextResponse.json({ success: false, message: "Erreur lors du traitement." }, { status: 500 });
  }
}