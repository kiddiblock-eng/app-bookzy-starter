export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import NicheAnalysis from "@/models/NicheAnalysis";
import User, { DAILY_LIMITS } from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { getAIText } from "@/lib/ai";


function cleanMarkdown(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\*\*/g, '')
    .replace(/\*/g, '')
    .replace(/`/g, '')
    .replace(/#/g, '')
    .trim();
}

function cleanJsonMarkdown(obj) {
  if (typeof obj === 'string') return cleanMarkdown(obj);
  if (Array.isArray(obj)) return obj.map(item => cleanJsonMarkdown(item));
  if (obj !== null && typeof obj === 'object') {
    const cleaned = {};
    for (const key in obj) cleaned[key] = cleanJsonMarkdown(obj[key]);
    return cleaned;
  }
  return obj;
}

// ✅ Extraction JSON robuste — résiste aux apostrophes et trailing commas
function extractJson(text) {
  if (!text) throw new Error("Réponse IA vide");

  let cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Impossible d'extraire le JSON.");

  let jsonStr = match[0];

  // Supprimer trailing commas
  jsonStr = jsonStr.replace(/,\s*([\]}])/g, "$1");

  try {
    return JSON.parse(jsonStr);
  } catch (e1) {
    // Remplacer les apostrophes dans les valeurs string
    try {
      const fixed = jsonStr.replace(/"([^"]*)"/g, (_, val) => {
        return '"' + val.replace(/'/g, "\u2019") + '"';
      });
      return JSON.parse(fixed);
    } catch (e2) {
      throw new Error("JSON invalide après tentatives de réparation: " + e1.message);
    }
  }
}

function getAnalysisContext(targetMarket) {
  if (targetMarket === "africa") {
    return {
      intro: "Tu es un expert en marketing digital qui aide les créateurs d'eBooks en Afrique francophone.",
      context: "🌍 Contexte : Afrique francophone (Sénégal, Côte d'Ivoire, Cameroun, etc.)",
      examples: `Exemples de TON à utiliser :
✓ "Les gens cherchent vraiment ça sur WhatsApp"
✓ "Ça marche si tu cibles bien les jeunes de 20-35 ans"
✓ "Propose des paiements Mobile Money (Wave, Orange Money)"

Exemples de public cible :
✓ "Les jeunes de 20-30 ans qui veulent se lancer mais ont peur de se planter"
✓ "Les mamans au foyer qui cherchent à arrondir les fins de mois"
✓ "Les étudiants qui veulent partir à l'étranger mais galèrent avec les dossiers"`,
      currency: "FCFA",
      platforms: "WhatsApp, Mobile Money, réseaux sociaux"
    };
  }
  return {
    intro: "Tu es un expert en marketing digital qui aide les créateurs d'eBooks.",
    context: "🌐 Contexte : Marché francophone international",
    examples: `Exemples de TON à utiliser :
✓ "Les gens cherchent vraiment ça en ligne"
✓ "Ça marche si tu cibles bien ton audience"
✓ "Propose des paiements PayPal, Stripe ou cartes bancaires"

Exemples de public cible :
✓ "Les jeunes adultes de 20-35 ans qui veulent se lancer dans ce domaine"
✓ "Les personnes cherchant une solution concrète à ce problème"
✓ "Les débutants qui veulent apprendre sans se ruiner"`,
    currency: "€/$",
    platforms: "Réseaux sociaux, email, publicité en ligne"
  };
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });
    }

    const { analysisId, nicheId } = await req.json();
    if (!analysisId || !nicheId) {
      return NextResponse.json({ success: false, message: "Paramètres manquants." }, { status: 400 });
    }

    const analysis = await NicheAnalysis.findOne({ _id: analysisId, userId: user.id });
    if (!analysis) {
      return NextResponse.json({ success: false, message: "Analyse introuvable." }, { status: 404 });
    }

    const niche = analysis.niches.find(n => n.nicheId === nicheId);
    if (!niche) {
      return NextResponse.json({ success: false, message: "Niche introuvable." }, { status: 404 });
    }

    // Déjà analysée → renvoyer directement sans déduire
    if (niche.analyzed && niche.analysis) {
      return NextResponse.json({ success: true, data: { niche } });
    }

    // ✅ Vérification crédits
    const userDoc = await User.findById(user.id);
    if (!userDoc) {
      return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });
    }

    // ✅ Quota journalier dispo → gratuit, sinon débit 1 crédit
    const canUseQuota = userDoc.canDoDaily("nicheAnalysis");
    let usedQuota = false;

    if (canUseQuota) {
      await userDoc.incrementDaily("nicheAnalysis");
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

    const ctx = getAnalysisContext(analysis.targetMarket || "africa");

    const base = `${ctx.intro}

📚 L'eBook à analyser :
- Titre : "${niche.title}"
- Description : "${niche.description}"
- Mots-clés : ${niche.keywords.join(", ")}
${niche.why_sells ? `- Pourquoi ça peut marcher : ${niche.why_sells}` : ''}

${ctx.context}

⚠️ RÈGLES D'OR :
- Parle comme un humain, pas comme une IA
- Sois direct et concret
- Zéro jargon marketing compliqué
- Donne des conseils actionnables, pas de la théorie
- IMPORTANT : Dans tes réponses JSON, n'utilise PAS d'apostrophes (') dans les textes, utilise plutôt des formulations sans apostrophe
`;

    console.log(`🚀 Analyse de "${niche.title}" (Marché: ${analysis.targetMarket || 'africa'}) - 4 appels parallèles...`);
    const startTime = Date.now();

    const prompt1 = `${base}

💪 Dis-moi franchement : POURQUOI cet eBook peut cartonner ?

Liste 3 points forts concrets et 3 trucs à surveiller.

JSON STRICT (sans apostrophes dans les textes) :
{
  "forces": ["Point fort 1", "Point fort 2", "Point fort 3"],
  "pointsAttention": ["Risque 1", "Risque 2", "Risque 3"]
}`;

    const prompt2 = `${base}

🎯 Comment se démarquer pour que les gens achètent CET eBook ?

Donne 3 stratégies concrètes applicables dès aujourd'hui.

JSON STRICT (sans apostrophes dans les textes) :
{"conseilsDiff": ["Stratégie 1", "Stratégie 2", "Stratégie 3"]}`;

    const prompt3 = `${base}

📊 Donne-moi les chiffres du marché.

JSON STRICT :
{
  "volumeEstime": "ex: 2k-5k ou 10k+ ou Peu",
  "tendance": "ex: Monte fort ou Stable ou Baisse",
  "difficulteSEO": 4,
  "cpcMoyen": "ex: 0.30 euros ou Quasi gratuit"
}`;

    const prompt4 = `${base}

✍️ Améliore le titre et dis-moi à QUI vendre cet eBook.

JSON STRICT (sans apostrophes dans les textes) :
{
  "titreOptimise": "Titre ultra-vendeur (max 60 caracteres)",
  "publicCible": "A qui vendre exactement (2-3 phrases max, ton naturel)"
}`;

    const [raw1, raw2, raw3, raw4] = await Promise.all([
      getAIText("nicheAnalyze", prompt1, 1500),
      getAIText("nicheAnalyze", prompt2, 1200),
      getAIText("nicheAnalyze", prompt3, 1200),
      getAIText("nicheAnalyze", prompt4, 1200)
    ]);

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⚡ 4 analyses terminées en ${totalTime}s`);

    const merged = {
      ...cleanJsonMarkdown(extractJson(raw1)),
      ...cleanJsonMarkdown(extractJson(raw2)),
      ...cleanJsonMarkdown(extractJson(raw3)),
      ...cleanJsonMarkdown(extractJson(raw4)),
      analysisTime: totalTime,
      analyzedAt: new Date().toISOString()
    };

    const index = analysis.niches.findIndex(n => n.nicheId === nicheId);
    analysis.niches[index].analysis = merged;
    analysis.niches[index].analyzed = true;
    analysis.niches[index].analysisCompletedAt = new Date();
    await analysis.save();

    console.log(`✅ Analyse complétée en ${totalTime}s pour "${niche.title}"`);

    const limit = DAILY_LIMITS[userDoc.plan]?.nicheAnalysis;
    const remainingQuota = limit === Infinity ? Infinity : Math.max(0, (limit || 0) - (userDoc.dailyUsage?.nicheAnalysis || 0));

    return NextResponse.json({
      success: true,
      data: { niche: analysis.niches[index], analysisTime: totalTime },
      usedQuota,
      remainingQuota,
      newBalance: !usedQuota ? userDoc.credits?.balance : undefined
    });

  } catch (e) {
    console.error("❌ Erreur analyse niche:", e);
    return NextResponse.json({ success: false, message: "Erreur lors de l'analyse.", error: e.message }, { status: 500 });
  }
}