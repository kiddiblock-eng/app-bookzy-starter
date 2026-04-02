export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db.js";
import NicheAnalysis from "@/models/NicheAnalysis.js";
import User, { DAILY_LIMITS } from "@/models/User.js";
import { verifyAuth } from "@/lib/auth.js";
import { getAIText } from "@/lib/ai.js";

// ─── RETRY HELPER ─────────────────────────────────────────────────────────────
async function getAITextWithRetry(model, prompt, maxTokens, maxRetries = 3) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      const result = await getAIText(model, prompt, maxTokens);
      if (result) return result;
      throw new Error("Réponse vide");
    } catch (err) {
      const isLast = attempt === maxRetries;
      console.warn(`⚠️ Appel IA tentative ${attempt}/${maxRetries} échouée: ${err.message}`);
      if (isLast) return null;
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  return null;
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

    const { theme, targetMarket } = await req.json();
    
    if (!theme || theme.trim().length === 0) {
      return NextResponse.json(
        { success: false, message: "Le thème est requis." },
        { status: 400 }
      );
    }

    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return NextResponse.json(
        { success: false, message: "Utilisateur introuvable." },
        { status: 404 }
      );
    }

    // ✅ Quota journalier dispo → gratuit, sinon débit 1 crédit
    const canUseQuota = userDoc.canDoDaily("nicheHunter");
    let usedQuota = false;

    if (canUseQuota) {
      await userDoc.incrementDaily("nicheHunter");
      usedQuota = true;
    } else {
      const balance = userDoc.credits?.balance ?? 0;
      if (balance < 1) {
        return NextResponse.json({
          success: false,
          quotaExceeded: true,
          insufficientCredits: true,
          plan: userDoc.plan,
          balance,
          message: "Quota journalier épuisé et crédits insuffisants."
        }, { status: 402 });
      }
      userDoc.credits.balance -= 1;
      userDoc.credits.totalSpent = (userDoc.credits.totalSpent || 0) + 1;
      await userDoc.save();
    }

    // ✅ Adapter le prompt selon targetMarket
    const marketContext = getMarketContext(targetMarket || "africa", theme);

    const basePrompt = `Tu es un expert en création d'eBooks à succès.

${marketContext}

🎯 GÉNÈRE 1 TITRE D'EBOOK PROFESSIONNEL sur : "${theme}"

⚠️ RÈGLE CRITIQUE DE DIVERSITÉ :
- Chaque titre doit avoir un ANGLE UNIQUE et DIFFÉRENT
- Varie la structure (pas toujours "Sujet : Le guide pour...")
- Change l'approche : débutant / expert / erreurs / stratégies / outils / cas pratiques
- NE RÉPÈTE JAMAIS la même formulation

✅ EXEMPLES DE TITRES VARIÉS (BONS) :

Pour "Dropshipping" :
✓ "Lancer son dropshipping rentable en 30 jours"
✓ "Dropshipping : Les erreurs qui coûtent cher"
✓ "Comment trouver les meilleurs fournisseurs dropshipping"
✓ "Automatiser son business dropshipping"
✓ "De 0 à 10 ventes par jour en dropshipping"
✓ "Dropshipping : Choisir sa niche gagnante"
✓ "Stratégies avancées de marketing dropshipping"
✓ "Créer une boutique dropshipping qui convertit"

❌ À ÉVITER (RÉPÉTITIF) :
✗ "Dropshipping : Le guide pour démarrer"
✗ "Dropshipping : Le guide pour créer sa boutique"
✗ "Dropshipping : Le guide pour vendre en ligne"
→ Tous commencent pareil !

✅ RÈGLES D'OR :
1. Le titre doit sonner SÉRIEUX et CRÉDIBLE (pas spam/arnaque)
2. Évite les chiffres trop précis genre "50 000 FCFA" ou "21 jours"
3. Utilise des mots-clés que les gens recherchent vraiment
4. Promets un résultat RÉALISTE et ATTEIGNABLE
5. **SOIS CRÉATIF : Chaque titre doit être DIFFÉRENT des autres**

🔥 STRUCTURES VARIÉES À UTILISER :

Structure 1 : Action directe
→ "Lancer son [sujet] rentable"
→ "Créer un [sujet] qui convertit"

Structure 2 : Transformation
→ "De débutant à expert en [sujet]"
→ "Comment passer de [A] à [B]"

Structure 3 : Erreurs à éviter
→ "[Sujet] : Les erreurs qui coûtent cher"
→ "Éviter les pièges du [sujet]"

Structure 4 : Méthode/Stratégie
→ "La méthode complète pour [objectif]"
→ "Stratégies avancées de [sujet]"

Structure 5 : Focus spécifique
→ "Trouver sa niche en [sujet]"
→ "Automatiser son [sujet]"

Structure 6 : Promesse chiffrée réaliste
→ "30 jours pour maîtriser le [sujet]"
→ "Les 7 piliers du [sujet] rentable"

🚫 À ÉVITER ABSOLUMENT :
- Répéter "[Sujet] : Le guide pour..." 10 fois
- Chiffres irréalistes : "Gagner 500K FCFA par jour"
- Superlatifs exagérés : "RÉVOLUTIONNAIRE", "JAMAIS VU"
- Titres trop longs : max 60 caractères

📋 FORMAT JSON STRICT :
{
  "niches": [{
    "title": "Titre UNIQUE et CRÉATIF (max 60 caractères)",
    "description": "Explication en 1 phrase de ce qu'apporte l'ebook",
    "difficulty": Nombre entier de 1 à 10,
    "competition": Nombre entier de 1 à 10,
    "potential": Nombre entier de 1 à 10,
    "formatRecommande": "ebook",
    "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"],
    "why_sells": "Pourquoi ce sujet intéresse les gens (ton naturel)"
  }]
}

⚡ GÉNÈRE 1 TITRE UNIQUE, CRÉATIF ET DIFFÉRENT pour "${theme}" :`;

    // ✅ 10 APPELS EN PARALLÈLE AVEC ANGLES VRAIMENT DIFFÉRENTS
    console.log(`🚀 Génération de niches pour "${theme}" (Marché: ${targetMarket || 'africa'}) - 10 appels parallèles...`);
    
    const startTime = Date.now();

    const prompts = [
      basePrompt + "\n\n💡 Angle UNIQUE : Guide complet pour débutants absolus",
      basePrompt + "\n\n💡 Angle UNIQUE : Les erreurs fatales à éviter",
      basePrompt + "\n\n💡 Angle UNIQUE : Stratégies avancées pour experts",
      basePrompt + "\n\n💡 Angle UNIQUE : Méthode rapide de A à Z",
      basePrompt + "\n\n💡 Angle UNIQUE : Outils et ressources indispensables",
      basePrompt + "\n\n💡 Angle UNIQUE : Études de cas réels et concrets",
      basePrompt + "\n\n💡 Angle UNIQUE : Automatisation et optimisation",
      basePrompt + "\n\n💡 Angle UNIQUE : Trouver sa niche rentable",
      basePrompt + "\n\n💡 Angle UNIQUE : Tendances et opportunités 2025",
      basePrompt + "\n\n💡 Angle UNIQUE : Monétisation et passage à l'échelle"
    ];

    // ✅ SEUL CHANGEMENT : getAITextWithRetry au lieu de getAIText
    const calls = prompts.map(prompt => getAITextWithRetry("nicheGenerate", prompt, 1200, 3));
    const results = await Promise.all(calls);
    
    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⚡ 10 appels terminés en ${totalTime}s`);

    // EXTRACTION + MERGE
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

    // DÉDUPLICATION
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

    // AJOUT DES IDs
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

    // SAUVEGARDE
    const nicheAnalysis = await NicheAnalysis.create({
      userId: user.id,
      country: user.country || "",
      theme: theme.trim(),
      targetMarket: targetMarket || "africa",
      niches: nichesWithIds,
      generatedAt: new Date(),
      ip: req.headers.get("x-forwarded-for") || req.headers.get("x-real-ip") || null,
      totalNiches: nichesWithIds.length,
      generationTime: totalTime
    });

    console.log(`✅ ${nichesWithIds.length} niches sauvegardées en ${totalTime}s`);

    const limit = DAILY_LIMITS[userDoc.plan]?.nicheHunter;
    const remainingQuota = limit === Infinity ? Infinity : Math.max(0, (limit || 0) - (userDoc.dailyUsage?.nicheHunter || 0));

    return NextResponse.json({
      success: true,
      data: {
        id: nicheAnalysis._id,
        theme: nicheAnalysis.theme,
        niches: nichesWithIds,
        generationTime: totalTime,
        message: `${nichesWithIds.length} idées d'eBooks générées`
      },
      usedQuota,
      remainingQuota,
      newBalance: !usedQuota ? userDoc.credits?.balance : undefined
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

// ✅ FONCTION : Contexte selon le marché
function getMarketContext(targetMarket, theme) {
  const africanKeywords = [
    'afrique', 'africain', 'sénégal', "côte d'ivoire", 'mali', 'niger',
    'burkina', 'bénin', 'togo', 'cameroun', 'congo', 'gabon',
    'fcfa', 'cemac', 'uemoa', 'dakar', 'abidjan', 'yaoundé',
    'mobile money', 'orange money', 'wave', 'mtn', 'attiéké', 'maquis'
  ];

  const isAfricanTopic = africanKeywords.some(keyword => 
    theme.toLowerCase().includes(keyword)
  );

  if (targetMarket === "africa" || (targetMarket === "auto" && isAfricanTopic)) {
    return `🌍 CONTEXTE MARCHÉ AFRICAIN FRANCOPHONE :
- Exemples adaptés au contexte africain
- Solutions accessibles et réalistes pour l'Afrique
- Références locales quand pertinent (villes, défis, opportunités)
- Ton professionnel et pragmatique`;
  }

  return `🌐 CONTEXTE MARCHÉ INTERNATIONAL :
- Exemples universels et concrets
- Stratégies applicables partout dans le monde francophone
- Références internationales (Europe, Amérique, Asie...)
- ⚠️ NE FORCE PAS le contexte africain si le sujet est universel`;
}