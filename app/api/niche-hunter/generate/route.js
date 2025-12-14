import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db.js";
import NicheAnalysis from "../../../../models/NicheAnalysis.js";
import { verifyAuth } from "../../../../lib/auth.js";
import { getAIText } from "../../../../lib/ai.js";

export const dynamic = 'force-dynamic';

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

    const { theme } = await req.json();
    if (!theme || theme.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Le thème est requis." },
        { status: 400 }
      );
    }

    // Limite journalière : 3 recherches
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const countToday = await NicheAnalysis.countDocuments({
      userId: user.id,
      createdAt: { $gte: today }
    });

    if (countToday >= 6) {
      return NextResponse.json(
        {
          success: false,
          limitReached: true,
          message: "🚫 Limite journalière atteinte (6 recherches par jour). Revenez demain."
        },
        { status: 429 }
      );
    }

    // ----------------------------------------------------------
    // 🔥 PROMPT FLEXIBLE - ADAPTÉ AU THÈME (pas que argent)
    // ----------------------------------------------------------
    const basePrompt = `Tu es un créateur d'eBooks à SUCCÈS en Afrique francophone.

🎯 MISSION : Trouve 1 idée d'eBook sur le thème "${theme}" que les gens vont ACHETER massivement.

📍 CONTEXTE AFRIQUE FRANCOPHONE :
- Budget moyen eBook : 1000-5000 FCFA
- Moyens : WhatsApp, Mobile Money, Facebook
- Besoin : Solutions CONCRÈTES, pas de théorie

🚫 INTERDIT :
- Titres génériques : "Guide de...", "Les bases de..."
- Théorie pure sans application
- Promesses irréalistes
- Idées hors du thème "${theme}"

✅ FORMULE D'UN TITRE QUI SE VEND :
[RÉSULTAT PRÉCIS] + [MÉTHODE/DÉLAI] + [CONTEXTE APPLICABLE]

💡 EXEMPLES SELON LE TYPE DE THÈME :

📈 Si thème = BUSINESS/ARGENT :
- "Gagner 100k FCFA/mois avec WhatsApp Business (0 capital)"
- "7 business rentables à lancer avec moins de 50k FCFA"

💊 Si thème = SANTÉ/BIEN-ÊTRE :
- "Peau sans taches en 30 jours (méthodes naturelles africaines)"
- "Perdre 10kg en 60 jours sans salle de sport"

❤️ Si thème = RELATIONS/AMOUR :
- "Reconquérir son ex en 21 jours (méthode psychologique)"
- "Se marier en moins d'un an : 12 secrets (spécial 30+)"

✈️ Si thème = VOYAGE/VISA :
- "Visa Schengen du 1er coup : dossier parfait 2024"
- "7 pays faciles d'accès pour Africains (visa garanti)"

📚 Si thème = ÉDUCATION/COMPÉTENCES :
- "Apprendre l'anglais en 90 jours sans prof (gratuit)"
- "Maîtriser Excel en 21 jours pour décrocher un job"

🎯 GÉNÈRE EXACTEMENT 1 IDÉE ULTRA-VENDABLE sur "${theme}" :

RÈGLES :
1. Titre PRÉCIS avec chiffres/délais
2. Résout un VRAI problème
3. Méthode APPLICABLE
4. Budget ACCESSIBLE
5. Résultat RÉALISTE mais attractif

Format JSON STRICT :
{
  "niches": [
    {
      "title": "Titre ultra-vendeur (max 60 caractères)",
      "description": "Pitch vendeur en 1 phrase (max 120 caractères)",
      "difficulty": 3,
      "competition": 4,
      "potential": 9,
      "formatRecommande": "ebook",
      "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"],
      "why_sells": "Raison concrète pourquoi ça cartonne (1 phrase max)"
    }
  ]
}

⚠️ IMPORTANT : Génère EXACTEMENT 1 idée, pas plus, pas moins.

GÉNÈRE MAINTENANT 1 idée pour "${theme}" :`;

    // ----------------------------------------------------------
    // 🚀 OPTIMISATION : 10 APPELS EN PARALLÈLE (1 idée chacun = 10 total)
    // ----------------------------------------------------------
    console.log(`🚀 Génération de niches pour "${theme}" - 10 appels parallèles (1 idée/appel)...`);
    
    const startTime = Date.now();

    // 10 prompts avec angles différents
    const prompts = [
      basePrompt,
      basePrompt + "\n\n💡 Focus : Angle DIFFÉRENT et ORIGINAL.",
      basePrompt + "\n\n💡 Focus : Solution ULTRA-CONCRÈTE et actionnable.",
      basePrompt + "\n\n💡 Focus : Sous-niche PRÉCISE et ciblée.",
      basePrompt + "\n\n💡 Focus : Problème URGENT que les gens veulent résoudre MAINTENANT.",
      basePrompt + "\n\n💡 Focus : Méthode RAPIDE avec résultats visibles.",
      basePrompt + "\n\n💡 Focus : Budget TRÈS ACCESSIBLE (0-20k FCFA).",
      basePrompt + "\n\n💡 Focus : Angle NOVATEUR que personne ne fait encore.",
      basePrompt + "\n\n💡 Focus : Solution adaptée au QUOTIDIEN africain.",
      basePrompt + "\n\n💡 Focus : Promesse RÉALISTE mais très ATTRACTIVE."
    ];

    const calls = prompts.map(prompt => getAIText("nicheGenerate", prompt, 1200));

    const results = await Promise.all(calls);
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⚡ 10 appels terminés en ${totalTime}s`);

    // ----------------------------------------------------------
    // 📦 EXTRACTION + MERGE DES RÉSULTATS
    // ----------------------------------------------------------
    let allNiches = [];

    for (let i = 0; i < results.length; i++) {
      const answer = results[i];
      if (!answer) {
        console.warn(`⚠️ Appel ${i + 1} : réponse vide`);
        continue;
      }
      
      const jsonMatch = answer.match(/\{[\s\S]*\}/);
      if (!jsonMatch) {
        console.warn(`⚠️ Appel ${i + 1} : pas de JSON trouvé`);
        continue;
      }

      try {
        const parsed = JSON.parse(jsonMatch[0]);
        if (Array.isArray(parsed.niches)) {
          console.log(`✅ Appel ${i + 1} : ${parsed.niches.length} niches extraites`);
          allNiches = allNiches.concat(parsed.niches);
        }
      } catch (e) {
        console.warn(`⚠️ Appel ${i + 1} : erreur parsing JSON:`, e.message);
        continue;
      }
    }

    if (allNiches.length === 0) {
      throw new Error("Aucune niche générée par l'IA");
    }

    console.log(`📦 Total niches avant déduplication : ${allNiches.length}`);

    // ----------------------------------------------------------
    // 🔍 DÉDUPLICATION intelligente (garder exactement 10)
    // ----------------------------------------------------------
    const uniqueNiches = [];
    const seenTitles = new Set();

    // Trier par potentiel décroissant
    allNiches.sort((a, b) => (b.potential || 0) - (a.potential || 0));

    for (const niche of allNiches) {
      const normalizedTitle = niche.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, ''); // Enlever ponctuation pour comparaison
      
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueNiches.push(niche);
      }
      
      // ✅ EXACTEMENT 10 idées
      if (uniqueNiches.length >= 10) break;
    }

    console.log(`✅ Niches uniques sélectionnées : ${uniqueNiches.length}/10`);

    // ----------------------------------------------------------
    // 🏷️ AJOUT DES IDs
    // ----------------------------------------------------------
    const nichesWithIds = uniqueNiches.map((n, i) => ({
      nicheId: `${Date.now()}-${i}`,
      title: n.title,
      description: n.description,
      difficulty: n.difficulty || 5,
      competition: n.competition || 5,
      potential: n.potential || 7,
      keywords: Array.isArray(n.keywords) ? n.keywords : [],
      formatRecommande: n.formatRecommande || "ebook",
      why_sells: n.why_sells || "",
      analyzed: false
    }));

    // ----------------------------------------------------------
    // 💾 SAUVEGARDE
    // ----------------------------------------------------------
    const nicheAnalysis = await NicheAnalysis.create({
      userId: user.id,
      country: user.country || "",
      theme: theme.trim(),
      niches: nichesWithIds,
      generatedAt: new Date(),
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
      totalNiches: nichesWithIds.length,
      generationTime: totalTime
    });

    console.log(`✅ ${nichesWithIds.length} niches sauvegardées en ${totalTime}s pour l'utilisateur ${user.id}`);

    return NextResponse.json({
      success: true,
      data: {
        id: nicheAnalysis._id,
        theme: nicheAnalysis.theme,
        niches: nichesWithIds,
        generationTime: totalTime,
        message: `${nichesWithIds.length} idées d'eBooks générées en ${totalTime}s`
      }
    });

  } catch (error) {
    console.error("❌ Erreur génération niches:", error);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de la génération des niches.",
        error: error.message
      },
      { status: 500 }
    );
  }
}