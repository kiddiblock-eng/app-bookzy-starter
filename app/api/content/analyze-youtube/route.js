export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAIText } from "../../../../lib/ai";
import { dbConnect } from "../../../../lib/db";
import User, { DAILY_LIMITS } from "../../../../models/User";
import { jwtVerify } from "jose";

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

export async function POST(req) {
  try {
    await dbConnect();

    const token = req.cookies.get("bookzy_token")?.value;
    if (!token) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const secret = new TextEncoder().encode(process.env.JWT_SECRET);
    const { payload } = await jwtVerify(token, secret);
    const userId = payload.id;

    if (!userId) {
      return NextResponse.json({ success: false, message: "Session invalide" }, { status: 401 });
    }

    const userDoc = await User.findById(userId);
    if (!userDoc) {
      return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });
    }

    // ✅ Quota journalier dispo → gratuit, sinon débit 2 crédits
    const canUseQuota = userDoc.canDoDaily("youtubeAnalysis");
    let usedQuota = false;

    if (canUseQuota) {
      await userDoc.incrementDaily("youtubeAnalysis");
      usedQuota = true;
    } else {
      const balance = userDoc.credits?.balance ?? 0;
      if (balance < 2) {
        return NextResponse.json({
          success: false,
          quotaExceeded: true,
          insufficientCredits: true,
          plan: userDoc.plan,
          balance,
          message: "Quota journalier épuisé et crédits insuffisants (2 crédits requis)."
        }, { status: 402 });
      }
      userDoc.credits.balance -= 2;
      userDoc.credits.totalSpent = (userDoc.credits.totalSpent || 0) + 2;
      await userDoc.save();
    }

    const { url } = await req.json();
    if (!url) return NextResponse.json({ success: false, message: "URL manquante" }, { status: 400 });

    const videoId = extractVideoId(url);
    if (!videoId) {
      if (!usedQuota) {
        userDoc.credits.balance += 2;
        userDoc.credits.totalSpent -= 2;
        await userDoc.save();
      }
      return NextResponse.json({ success: false, message: "URL YouTube invalide" }, { status: 400 });
    }

    console.log(`📡 [YOUBOOK] Analyse pour videoId: ${videoId}`);

    const response = await fetch(`https://youtube-transcript3.p.rapidapi.com/api/transcript?videoId=${videoId}`, {
      method: 'GET',
      headers: {
        'x-rapidapi-key': process.env.RAPIDAPI_KEY,
        'x-rapidapi-host': 'youtube-transcript3.p.rapidapi.com'
      }
    });

    const data = await response.json();

    let transcriptText = "";

    if (data.transcript && Array.isArray(data.transcript)) {
      transcriptText = data.transcript.map(item => item.text || item.content || String(item)).join(' ');
    } else if (data.content && Array.isArray(data.content)) {
      transcriptText = data.content.map(item => item.text || item.content || String(item)).join(' ');
    } else if (data.captions && Array.isArray(data.captions)) {
      transcriptText = data.captions.map(item => item.text || item.content || String(item)).join(' ');
    } else if (data.text && typeof data.text === 'string') {
      transcriptText = data.text;
    } else if (Array.isArray(data)) {
      transcriptText = data.map(item => item.text || item.content || String(item)).join(' ');
    } else {
      if (!usedQuota) {
        userDoc.credits.balance += 2;
        userDoc.credits.totalSpent -= 2;
        await userDoc.save();
      }
      return NextResponse.json({
        success: false,
        message: data.error || data.message || "Format de transcription non supporté. Essayez une autre vidéo."
      }, { status: 400 });
    }

    transcriptText = transcriptText.trim().replace(/\s+/g, ' ');

    if (transcriptText.length < 100) {
      if (!usedQuota) {
        userDoc.credits.balance += 2;
        userDoc.credits.totalSpent -= 2;
        await userDoc.save();
      }
      return NextResponse.json({
        success: false,
        message: "Contenu audio insuffisant. La vidéo doit contenir plus de paroles."
      }, { status: 400 });
    }

    const safeText = transcriptText.substring(0, 15000);

    const prompt = `Tu es l'expert Ghostwriter et Analyste de Bookzy, spécialisé dans la création d'ebooks pour le marché africain francophone.
    
TRANSCRIPTION VIDÉO YOUTUBE :
"${safeText}"

TA MISSION : Transformer cette transcription en un concept d'eBook professionnel et convaincant.

ANALYSE EN PROFONDEUR ET GÉNÈRE CE JSON :

1. "titre" : Titre accrocheur et vendeur (max 80 caractères). Doit donner envie d'acheter.
2. "hook" : L'angle unique qui différencie cet ebook. Pourquoi celui-ci et pas un autre ? (1 phrase percutante)
3. "description" : Résumé captivant de la valeur ajoutée (max 250 caractères)
4. "probleme" : Le problème principal que l'ebook résout. Sois spécifique. (1-2 phrases)
5. "transformation" : Ce que le lecteur saura faire après lecture. Commence par "Apres lecture, tu seras capable de..." (1-2 phrases)
6. "audience" : Objet avec "principal" et "niveau" (Débutant/Intermédiaire/Avancé)
7. "sommaire" : Tableau de 5-7 titres de chapitres logiques et accrocheurs
8. "key_insights" : Tableau de 3 faits ou idées clés concrètes
9. "verbatim" : La citation la plus puissante extraite mot pour mot du texte
10. "pages_estimees" : Nombre de pages entre 15 et 50
11. "tone" : Style éditorial (professionnel/simple/expert/inspirant/motivant)

RÉPONDS UNIQUEMENT AU FORMAT JSON PUR (sans markdown, sans backticks) :
{
  "titre": "...",
  "hook": "...",
  "description": "...",
  "probleme": "...",
  "transformation": "...",
  "audience": { "principal": "...", "niveau": "..." },
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
      if (!usedQuota) {
        userDoc.credits.balance += 2;
        userDoc.credits.totalSpent -= 2;
        await userDoc.save();
      }
      return NextResponse.json({ success: false, message: "L'IA a renvoyé un format invalide." }, { status: 500 });
    }

    console.log("✅ Analyse réussie!");

    const limit = DAILY_LIMITS[userDoc.plan]?.youtubeAnalysis;
    const remainingQuota = limit === Infinity ? Infinity : Math.max(0, (limit || 0) - (userDoc.dailyUsage?.youtubeAnalysis || 0));

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
      usedQuota,
      remainingQuota,
      newBalance: !usedQuota ? userDoc.credits?.balance : undefined
    });

  } catch (error) {
    console.error("❌ ERREUR API:", error.message);
    return NextResponse.json({ success: false, message: "Erreur lors du traitement." }, { status: 500 });
  }
}