import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import NicheAnalysis from "../../../../models/NicheAnalysis";
import { verifyAuth } from "../../../../lib/auth";
import { getAIText } from "../../../../lib/ai";

export const dynamic = 'force-dynamic';

// Nettoyage markdown (enlever les * et autres)
function cleanMarkdown(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\*\*/g, '')   // Bold **texte**
    .replace(/\*/g, '')     // Italic *texte*
    .replace(/`/g, '')      // Code `texte`
    .replace(/#/g, '')      // Headers #
    .trim();
}

// Nettoyage récursif d'un objet JSON
function cleanJsonMarkdown(obj) {
  if (typeof obj === 'string') {
    return cleanMarkdown(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanJsonMarkdown(item));
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned = {};
    for (const key in obj) {
      cleaned[key] = cleanJsonMarkdown(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

// Extraction JSON robuste
function extractJson(text) {
  if (!text) throw new Error("Réponse IA vide");

  let match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    console.error("Réponse brute IA:", text.slice(0, 400));
    throw new Error("Impossible d'extraire le JSON proprement.");
  }

  return JSON.parse(match[0]);
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    const { analysisId, nicheId } = await req.json();

    if (!analysisId || !nicheId) {
      return NextResponse.json(
        { success: false, message: "Paramètres manquants." },
        { status: 400 }
      );
    }

    const analysis = await NicheAnalysis.findOne({
      _id: analysisId,
      userId: user.id
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, message: "Analyse introuvable." },
        { status: 404 }
      );
    }

    const niche = analysis.niches.find(n => n.nicheId === nicheId);
    if (!niche) {
      return NextResponse.json(
        { success: false, message: "Niche introuvable." },
        { status: 404 }
      );
    }

    // Déjà analysée → on renvoie
    if (niche.analyzed && niche.analysis) {
      return NextResponse.json({
        success: true,
        data: { niche }
      });
    }

    // ------------------------------------------------------
    // CONTEXTE DE BASE
    // ------------------------------------------------------
    const base = `Tu es un expert en analyse de niches pour eBooks & formations digitales,
spécialisé dans le marché AFRICAIN francophone.

Niche à analyser :
- Titre : "${niche.title}"
- Description : "${niche.description}"
- Mots-clés : ${niche.keywords.join(", ")}
- Potentiel estimé : ${niche.potential}/10
${niche.why_sells ? `- Pourquoi ça vend : ${niche.why_sells}` : ''}

Contexte : Afrique francophone uniquement (Sénégal, Côte d'Ivoire, Cameroun, etc.)
`;

    // ------------------------------------------------------
    // 🚀 OPTIMISATION : 4 APPELS EN PARALLÈLE (au lieu de 3)
    // ------------------------------------------------------
    console.log(`🚀 Analyse de "${niche.title}" - 4 appels parallèles...`);
    const startTime = Date.now();

    const prompt1 = `${base}

ÉTAPE 1 — Forces et Risques (marché africain)

Réponds en JSON STRICT :
{
  "forces": ["Force 1 adaptée au marché africain", "Force 2", "Force 3"],
  "pointsAttention": ["Risque réaliste 1", "Risque 2", "Risque 3"]
}

Focus : Ce qui marche EN AFRIQUE, pas en Europe/USA.`;

    const prompt2 = `${base}

ÉTAPE 2 — Stratégies de différenciation

Réponds en JSON STRICT :
{
  "conseilsDiff": ["Stratégie concrète 1 pour se démarquer", "Stratégie 2", "Stratégie 3"]
}

Donne des stratégies ACTIONNABLES, pas de théorie.`;

    const prompt3 = `${base}

ÉTAPE 3 — Données marché (estimations africaines)

Réponds en JSON STRICT :
{
  "volumeEstime": "Fourchette de recherches mensuelles ex: '5k-8k'",
  "tendance": "Évolution ex: '↗️ +25%' ou '↘️ -10%' ou '→ stable'",
  "difficulteSEO": 4,
  "cpcMoyen": "Coût par clic estimé ex: '0.20€' ou 'N/A'"
}

Donne des chiffres RÉALISTES pour l'Afrique francophone.`;

    const prompt4 = `${base}

ÉTAPE 4 — Optimisation titre & cible

Réponds en JSON STRICT :
{
  "titreOptimise": "Titre ultra-vendeur optimisé pour l'Afrique (max 60 car)",
  "publicCible": "Description du public cible en 2-3 phrases max"
}

Le titre doit être encore PLUS vendeur et adapté au contexte africain.`;

    // ✅ LANCER LES 4 EN PARALLÈLE
    const [raw1, raw2, raw3, raw4] = await Promise.all([
      getAIText("nicheAnalyze", prompt1, 1200),
      getAIText("nicheAnalyze", prompt2, 1000),
      getAIText("nicheAnalyze", prompt3, 1200),
      getAIText("nicheAnalyze", prompt4, 1000)
    ]);

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⚡ 4 analyses terminées en ${totalTime}s`);

    // ------------------------------------------------------
    // EXTRACTION JSON + NETTOYAGE MARKDOWN
    // ------------------------------------------------------
    const step1 = cleanJsonMarkdown(extractJson(raw1));
    const step2 = cleanJsonMarkdown(extractJson(raw2));
    const step3 = cleanJsonMarkdown(extractJson(raw3));
    const step4 = cleanJsonMarkdown(extractJson(raw4));

    // ------------------------------------------------------
    // MERGE FINAL
    // ------------------------------------------------------
    const merged = {
      ...step1,
      ...step2,
      ...step3,
      ...step4,
      analysisTime: totalTime,
      analyzedAt: new Date().toISOString()
    };

    // Sauvegarde dans la niche
    const index = analysis.niches.findIndex(n => n.nicheId === nicheId);

    analysis.niches[index].analysis = merged;
    analysis.niches[index].analyzed = true;
    analysis.niches[index].analysisCompletedAt = new Date();

    await analysis.save();

    console.log(`✅ Analyse complétée en ${totalTime}s pour "${niche.title}"`);

    return NextResponse.json({
      success: true,
      data: {
        niche: analysis.niches[index],
        analysisTime: totalTime
      }
    });

  } catch (e) {
    console.error("❌ Erreur analyse niche:", e);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'analyse.",
        error: e.message
      },
      { status: 500 }
    );
  }
}