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

// --- EXTRACTION VIDEO ID ---
function extractVideoId(url) {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/,
    /^([a-zA-Z0-9_-]{11})$/
  ];
  
  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) return match[1];
  }
  
  return null;
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
    if (todayCount >= 3) return NextResponse.json({ 
      success: false, 
      message: "Limite quotidienne atteinte (3 analyses/jour). Revenez demain !",
      remainingToday: 0
    }, { status: 429 });

    // 3. Récupération de l'URL
    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, message: "URL manquante" }, { status: 400 });

    // 4. Extraction du videoId
    const videoId = extractVideoId(url);
    if (!videoId) {
      return NextResponse.json({ success: false, message: "URL YouTube invalide" }, { status: 400 });
    }

    console.log(`📡 [YOUBOOK] Analyse pour videoId: ${videoId}`);

    // 5. Appel à RapidAPI youtube-transcript3
    const response = await fetch(`https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com'
      }
    });

    const data = await response.json();
    
    // 🔍 DEBUG
    console.log("📦 [RAPIDAPI] Réponse brute:", JSON.stringify(data, null, 2).substring(0, 500));
    console.log("📦 [RAPIDAPI] Clés disponibles:", Object.keys(data));

    // 6. Extraction du texte - Gestion de plusieurs formats
    let transcriptText = "";

    // Format: data.transcript (array d'objets avec text)
    if (data.transcript && Array.isArray(data.transcript)) {
      transcriptText = data.transcript.map(item => item.text || item.content || String(item)).join(' ');
      console.log("✅ Format détecté: data.transcript (array)");
    }
    // Format: data.content
    else if (data.content && Array.isArray(data.content)) {
      transcriptText = data.content.map(item => item.text || item.content || String(item)).join(' ');
      console.log("✅ Format détecté: data.content (array)");
    }
    // Format: data.captions
    else if (data.captions && Array.isArray(data.captions)) {
      transcriptText = data.captions.map(item => item.text || item.content || String(item)).join(' ');
      console.log("✅ Format détecté: data.captions (array)");
    }
    // Format: data.text (string)
    else if (data.text && typeof data.text === 'string') {
      transcriptText = data.text;
      console.log("✅ Format détecté: data.text (string)");
    }
    // Format: data est directement un array
    else if (Array.isArray(data)) {
      transcriptText = data.map(item => item.text || item.content || String(item)).join(' ');
      console.log("✅ Format détecté: data est un array");
    }
    // Erreur de l'API
    else if (data.error || data.message) {
      console.error("❌ Erreur API:", data.error || data.message);
      return NextResponse.json({ 
        success: false, 
        message: data.error || data.message || "Erreur lors de la récupération de la transcription"
      }, { status: 400 });
    }
    else {
      console.error("❌ Format non reconnu. Données reçues:", Object.keys(data));
      return NextResponse.json({ 
        success: false, 
        message: "Format de transcription non supporté. Essayez une autre vidéo."
      }, { status: 400 });
    }

    // Nettoyage du texte
    transcriptText = transcriptText.trim().replace(/\s+/g, ' ');

    console.log(`📝 Transcription extraite: ${transcriptText.length} caractères`);

    if (transcriptText.length < 100) {
      return NextResponse.json({ 
        success: false, 
        message: "Contenu audio insuffisant. La vidéo doit contenir plus de paroles."
      }, { status: 400 });
    }

    // 7. Analyse Gemini
    const safeText = transcriptText.substring(0, 15000); 
    console.log(`🧠 Envoi de ${safeText.length} caractères à Gemini...`);

    const prompt = `Tu es l'expert Ghostwriter et Analyste de Bookzy, spécialisé dans la création d'ebooks pour le marché africain francophone.
    
TRANSCRIPTION VIDÉO YOUTUBE :
"${safeText}"

TA MISSION : Transformer cette transcription en un concept d'eBook professionnel et convaincant.

ANALYSE EN PROFONDEUR ET GÉNÈRE CE JSON :

1. "titre" : Titre accrocheur et vendeur (max 80 caractères). Doit donner envie d'acheter.

2. "hook" : L'angle unique qui différencie cet ebook. Pourquoi celui-ci et pas un autre ? (1 phrase percutante)

3. "description" : Résumé captivant de la valeur ajoutée (max 250 caractères)

4. "probleme" : Le problème principal que l'ebook résout. Sois spécifique. (1-2 phrases)

5. "transformation" : Ce que le lecteur saura faire après lecture. Commence par "Après lecture, tu seras capable de..." (1-2 phrases)

6. "audience" : Objet avec :
   - "principal" : Cible principale (sois précis, ex: "Freelances africains qui veulent trouver des clients internationaux")
   - "niveau" : "Débutant" ou "Intermédiaire" ou "Avancé"

7. "sommaire" : Tableau de 5-7 titres de chapitres logiques et accrocheurs extraits du contenu

8. "key_insights" : Tableau de 3 faits, chiffres ou idées clés concrètes et mémorables

9. "verbatim" : La citation la plus puissante extraite mot pour mot du texte

10. "pages_estimees" : Estimation du nombre de pages (entre 15 et 50, basé sur la densité du contenu)

11. "tone" : Style éditorial (professionnel/simple/expert/inspirant/motivant)

RÉPONDS UNIQUEMENT AU FORMAT JSON PUR (sans markdown, sans backticks) :
{
  "titre": "...",
  "hook": "...",
  "description": "...",
  "probleme": "...",
  "transformation": "...",
  "audience": {
    "principal": "...",
    "niveau": "..."
  },
  "sommaire": ["Chapitre 1: ...", "Chapitre 2: ...", "..."],
  "key_insights": ["...", "...", "..."],
  "verbatim": "...",
  "pages_estimees": 25,
  "tone": "..."
}`;

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

    // 8. Finalisation
    await incrementAnalysisCount(userId);
    
    console.log("✅ Analyse réussie!");

    return NextResponse.json({
      success: true,
      analysis: {
        titre: analysis.titre,
        hook: analysis.hook || "",
        description: analysis.description,
        probleme: analysis.probleme || "",
        transformation: analysis.transformation || "",
        audience: analysis.audience || { principal: "Grand Public", niveau: "Débutant" },
        sommaire: analysis.sommaire || [],
        key_insights: analysis.key_insights || [],
        verbatim: analysis.verbatim || "",
        pages_estimees: analysis.pages_estimees || 25,
        tone: analysis.tone
      },
      remainingToday: 3 - (todayCount + 1)
    });

  } catch (error) {
    console.error("❌ ERREUR API:", error.message);
    return NextResponse.json({ success: false, message: "Erreur lors du traitement." }, { status: 500 });
  }
}