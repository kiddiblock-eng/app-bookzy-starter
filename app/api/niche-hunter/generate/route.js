export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.js";
import NicheAnalysis from "@/models/NicheAnalysis.js";
import { verifyAuth } from "@/lib/auth.js";
import { getAIText } from "@/lib/ai.js";


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

    // Limite journalière : 6 recherches
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
    // 🔥 NOUVEAU PROMPT - TITRES SÉRIEUX ET CRÉDIBLES
    // ----------------------------------------------------------
    const basePrompt = `Tu es un expert en création d'eBooks à succès pour l'Afrique francophone.

🎯 GÉNÈRE 1 TITRE D'EBOOK PROFESSIONNEL sur : "${theme}"

✅ RÈGLES D'OR :
1. Le titre doit sonner SÉRIEUX et CRÉDIBLE (pas spam/arnaque)
2. Évite les chiffres trop précis genre "50 000 FCFA" ou "21 jours"
3. Utilise des mots-clés que les gens recherchent vraiment
4. Promets un résultat RÉALISTE et ATTEIGNABLE
5. Adapté au contexte africain francophone

🔥 EXEMPLES DE BONS TITRES (SÉRIEUX) :

BUSINESS/ARGENT :
✓ "Monétiser ses compétences sur Internet : Guide pratique pour l'Afrique"
✓ "Créer et vendre un produit digital rentable"
✓ "Business en ligne : Les stratégies qui marchent vraiment"
✓ "Freelance en Afrique : Trouver ses premiers clients"

BEAUTÉ/SANTÉ :
✓ "Soins naturels pour une peau éclatante"
✓ "Perdre du poids durablement : Méthode adaptée à l'Afrique"
✓ "Cheveux crépus : Routine complète pour une pousse saine"
✓ "Alimentation saine avec les produits locaux africains"

AMOUR/RELATIONS :
✓ "Construire une relation amoureuse épanouie"
✓ "Reconquérir son ex : Stratégies psychologiques efficaces"
✓ "Trouver l'amour après 30 ans : Guide moderne"
✓ "Communication de couple : Les clés d'une relation durable"

VISA/VOYAGE :
✓ "Dossier visa Schengen : Guide complet 2024"
✓ "Partir étudier au Canada : Démarches et conseils"
✓ "Voyager avec un budget limité : Destinations accessibles"
✓ "Obtenir son visa étudiant : Stratégies éprouvées"

COMPÉTENCES/FORMATION :
✓ "Maîtriser Excel pour booster sa carrière"
✓ "Apprendre l'anglais efficacement en autodidacte"
✓ "Devenir développeur web : Parcours complet"
✓ "Marketing digital : Les bases pour entrepreneurs africains"

🚫 À ÉVITER ABSOLUMENT :
- Chiffres trop précis : "50 000 FCFA", "73 techniques", "21 jours"
- Superlatifs exagérés : "RÉVOLUTIONNAIRE", "JAMAIS VU", "SECRET"
- Promesses irréalistes : "Devenir millionnaire", "Sans effort"
- Titres trop longs : max 60 caractères
- Style clickbait spam

✅ PRÉFÈRE :
- Titres informatifs et directs
- Promesses réalistes
- Mots-clés naturels
- Ton professionnel mais accessible

📋 FORMAT JSON STRICT :
{
  "niches": [{
    "title": "Titre professionnel et crédible (max 60 caractères)",
    "description": "Explication en 1 phrase de ce qu'apporte l'ebook",
    "difficulty": Nombre entier de 1 à 10,
    "competition": Nombre entier de 1 à 10,
    "potential": Nombre entier de 1 à 10,
    "formatRecommande": "ebook",
    "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"],
    "why_sells": "Pourquoi ce sujet intéresse les gens (ton naturel)"
  }]
}

⚡ GÉNÈRE 1 TITRE SÉRIEUX ET VENDEUR pour "${theme}" :`;

    // ----------------------------------------------------------
    // 🚀 10 APPELS EN PARALLÈLE AVEC ANGLES VARIÉS
    // ----------------------------------------------------------
    console.log(`🚀 Génération de niches pour "${theme}" - 10 appels parallèles...`);
    
    const startTime = Date.now();

    const prompts = [
      basePrompt,
      basePrompt + "\n\n💡 Focus : Guide pratique et actionnable",
      basePrompt + "\n\n💡 Focus : Méthode pas-à-pas pour débutants",
      basePrompt + "\n\n💡 Focus : Stratégies éprouvées et réalistes",
      basePrompt + "\n\n💡 Focus : Formation complète sur le sujet",
      basePrompt + "\n\n💡 Focus : Solutions adaptées au contexte africain",
      basePrompt + "\n\n💡 Focus : Conseils d'experts accessibles à tous",
      basePrompt + "\n\n💡 Focus : Erreurs à éviter + bonnes pratiques",
      basePrompt + "\n\n💡 Focus : Tendances 2024-2025 dans ce domaine",
      basePrompt + "\n\n💡 Focus : Cas pratiques et exemples concrets"
    ];

    const calls = prompts.map(prompt => getAIText("nicheGenerate", prompt, 1200));
    const results = await Promise.all(calls);
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⚡ 10 appels terminés en ${totalTime}s`);

    // ----------------------------------------------------------
    // 📦 EXTRACTION + MERGE
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
    // 🔍 DÉDUPLICATION (garder 10 meilleurs)
    // ----------------------------------------------------------
    const uniqueNiches = [];
    const seenTitles = new Set();

    allNiches.sort((a, b) => (b.potential || 0) - (a.potential || 0));

    for (const niche of allNiches) {
      const normalizedTitle = niche.title
        .toLowerCase()
        .trim()
        .replace(/[^a-z0-9]/g, '');
      
      if (!seenTitles.has(normalizedTitle)) {
        seenTitles.add(normalizedTitle);
        uniqueNiches.push(niche);
      }
      
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

    console.log(`✅ ${nichesWithIds.length} niches sauvegardées en ${totalTime}s`);

    return NextResponse.json({
      success: true,
      data: {
        id: nicheAnalysis._id,
        theme: nicheAnalysis.theme,
        niches: nichesWithIds,
        generationTime: totalTime,
        message: `${nichesWithIds.length} idées d'eBooks générées`
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