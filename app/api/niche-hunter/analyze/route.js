export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import NicheAnalysis from "@/models/NicheAnalysis";
import User, { DAILY_LIMITS } from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { getAIText } from "@/lib/ai";

function cleanMarkdown(text) {
  if (typeof text !== "string") return text;
  return text.replace(/\*\*/g, "").replace(/\*/g, "").replace(/`/g, "").replace(/#/g, "").trim();
}

function cleanJsonMarkdown(obj) {
  if (typeof obj === "string") return cleanMarkdown(obj);
  if (Array.isArray(obj)) return obj.map(item => cleanJsonMarkdown(item));
  if (obj !== null && typeof obj === "object") {
    const cleaned = {};
    for (const key in obj) cleaned[key] = cleanJsonMarkdown(obj[key]);
    return cleaned;
  }
  return obj;
}

function extractJson(text) {
  if (!text) throw new Error("Réponse IA vide");
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("Impossible d'extraire le JSON.");
  let jsonStr = match[0];
  jsonStr = jsonStr.replace(/,\s*([\]}])/g, "$1");
  try {
    return JSON.parse(jsonStr);
  } catch (e1) {
    try {
      const fixed = jsonStr.replace(/"([^"]*)"/g, (_, val) => '"' + val.replace(/'/g, "\u2019") + '"');
      return JSON.parse(fixed);
    } catch (e2) {
      throw new Error("JSON invalide: " + e1.message);
    }
  }
}

function getAnalysisContext(targetMarket) {
  if (targetMarket === "africa") {
    return {
      intro: "Expert marketing digital et vente eBooks Afrique francophone.",
      context: "Marche : Afrique francophone (CI, Senegal, Cameroun, Mali, Benin, Togo)",
      currency: "FCFA",
      platforms: "WhatsApp, Instagram, Mobile Money (Wave, Orange Money, MTN)"
    };
  }
  return {
    intro: "Expert marketing digital et vente eBooks marche francophone international.",
    context: "Marche : France, Belgique, Suisse, Canada, Maroc",
    currency: "EUR",
    platforms: "Instagram, TikTok, YouTube, Stripe, PayPal"
  };
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const { analysisId, nicheId } = await req.json();
    if (!analysisId || !nicheId) return NextResponse.json({ success: false, message: "Paramètres manquants." }, { status: 400 });

    const analysis = await NicheAnalysis.findOne({ _id: analysisId, userId: user.id });
    if (!analysis) return NextResponse.json({ success: false, message: "Analyse introuvable." }, { status: 404 });

    const niche = analysis.niches.find(n => n.nicheId === nicheId);
    if (!niche) return NextResponse.json({ success: false, message: "Niche introuvable." }, { status: 404 });

    if (niche.analyzed && niche.analysis) {
      return NextResponse.json({ success: true, data: { niche } });
    }

    const userDoc = await User.findById(user.id);
    if (!userDoc) return NextResponse.json({ success: false, message: "Utilisateur introuvable." }, { status: 404 });

    const canUseQuota = userDoc.canDoDaily("nicheAnalysis");
    let usedQuota = false;

    if (canUseQuota) {
      await userDoc.incrementDaily("nicheAnalysis");
      usedQuota = true;
    } else {
      const balance = userDoc.credits?.balance ?? 0;
      if (balance < 2) {
        return NextResponse.json({
          success: false, quotaExceeded: true, insufficientCredits: true,
          plan: userDoc.plan, balance, message: "Quota journalier épuisé et crédits insuffisants."
        }, { status: 402 });
      }
      userDoc.credits.balance -= 2;
      userDoc.credits.totalSpent = (userDoc.credits.totalSpent || 0) + 2;
      await userDoc.save();
    }

    const ctx = getAnalysisContext(analysis.targetMarket || "africa");

    // ✅ Base ultra-courte = moins de tokens = plus rapide
    const base = `${ctx.intro}
eBook: "${niche.title}" — ${niche.description}
Prix: ${niche.prixMin || 2000}-${niche.prixMax || 6000} ${ctx.currency}
${ctx.context} | Plateformes: ${ctx.platforms}
REGLES: JSON strict, sans apostrophes, réponses courtes et concrètes.`;

    console.log(`🚀 Analyse "${niche.title}" — 3 appels parallèles...`);
    const startTime = Date.now();

    // ── APPEL 1 : Score + verdict + forces + risques + pays (fusionné)
    const prompt1 = `${base}

Retourne UN seul JSON avec score global, forces/risques, et top 5 pays.

JSON STRICT :
{
  "scoreGlobal": 78,
  "verdict": "Phrase courte sur le potentiel (max 12 mots)",
  "forces": ["Force concrete 1", "Force concrete 2", "Force concrete 3"],
  "risques": ["Risque reel 1", "Risque reel 2", "Risque reel 3"],
  "paysTop": [
    { "pays": "Cote d Ivoire", "score": 95, "raison": "Raison courte" },
    { "pays": "Senegal", "score": 88, "raison": "Raison courte" },
    { "pays": "Cameroun", "score": 80, "raison": "Raison courte" },
    { "pays": "Mali", "score": 72, "raison": "Raison courte" },
    { "pays": "Benin", "score": 65, "raison": "Raison courte" }
  ]
}`;

    // ── APPEL 2 : Plan 100 ventes + tactiques + message accroche
    const prompt2 = `${base}

Plan concret pour vendre ce mois. Boutique : Taliopay (taliopay.com) — Mobile Money integre.
Calcule un prix ideal REALISTE pour ce sujet specifique (entre 1500 et 15000 FCFA selon la valeur percue).
Calcule les revenus DYNAMIQUEMENT selon ce prix : revenus = nb ventes x prixIdeal.

JSON STRICT :
{
  "prixIdeal": 3500,
  "plateformeVente": "Taliopay",
  "planSemaines": [
    { "semaine": "Semaine 1", "objectif": "20 ventes", "action": "Action cle a faire" },
    { "semaine": "Semaine 2", "objectif": "30 ventes", "action": "Action cle a faire" },
    { "semaine": "Semaine 3", "objectif": "30 ventes", "action": "Action cle a faire" },
    { "semaine": "Semaine 4", "objectif": "20 ventes", "action": "Action cle a faire" }
  ],
  "tactiquesVente": ["Tactique 1", "Tactique 2", "Tactique 3"],
  "messageAccroche": "Message WhatsApp/Instagram ultra-vendeur 2 phrases max"
}`;

    // ── APPEL 3 : Positionnement + projections revenus + Taliopay conseil
    const prompt3 = `${base}

Positionnement pour dominer la niche et projections revenus. Recommande Taliopay pour vendre.
IMPORTANT : Les revenus doivent etre calcules dynamiquement selon le sujet "${niche.title}".
- Estime un prix ideal entre 1500 et 15000 FCFA selon la valeur percue du sujet
- Calcule revenus = nb ventes x ce prix (pas des chiffres fixes)
- Ex: si prix = 5000 FCFA : 50 ventes = 250 000, 100 ventes = 500 000, 200 ventes = 1 000 000

JSON STRICT :
{
  "angleUnique": "Angle unique percutant 1 phrase",
  "ceQueLaConcFaitMal": "Ce que les concurrents ratent",
  "messageCle": "Message marketing principal 1 phrase",
  "titreOptimise": "Titre vendeur max 60 caracteres",
  "publicCible": "A qui vendre exactement 2 phrases",
  "projections": [
    { "scenario": "50 ventes", "revenus": 0, "label": "Objectif minimal" },
    { "scenario": "100 ventes", "revenus": 0, "label": "Objectif du mois" },
    { "scenario": "200 ventes", "revenus": 0, "label": "Objectif ambitieux" }
  ],
  "conseilsTaliopay": "Pourquoi Taliopay est ideal pour vendre cet ebook 1 phrase"
}`;

    // ✅ 3 appels parallèles — tokens complets pour des réponses riches
    const [raw1, raw2, raw3] = await Promise.all([
      getAIText("nicheAnalyze", prompt1, 1500),
      getAIText("nicheAnalyze", prompt2, 1500),
      getAIText("nicheAnalyze", prompt3, 1500),
    ]);

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⚡ 3 analyses terminées en ${totalTime}s`);

    if (!raw1 && !raw2 && !raw3) {
      console.warn("⚠️ Tous les appels IA null — highDemand");
      return NextResponse.json({ success: false, highDemand: true, message: "Demande élevée actuellement." }, { status: 503 });
    }

    const safeExtract = (raw, label) => {
      if (!raw) { console.warn(`⚠️ ${label}: réponse vide`); return {}; }
      try {
        const result = cleanJsonMarkdown(extractJson(raw));
        console.log(`✅ ${label} keys:`, Object.keys(result));
        return result;
      } catch (e) {
        console.warn(`⚠️ ${label} extractJson échoué:`, e.message);
        return {};
      }
    };

    const merged = {
      ...safeExtract(raw1, "raw1 (score+pays)"),
      ...safeExtract(raw2, "raw2 (plan100)"),
      ...safeExtract(raw3, "raw3 (positionnement)"),
      analysisTime: totalTime,
      analyzedAt: new Date().toISOString(),
    };

    console.log("📦 MERGED keys:", Object.keys(merged));
    console.log("📦 paysTop:", JSON.stringify(merged.paysTop?.slice(0, 2)));
    console.log("📦 projections:", JSON.stringify(merged.projections));
    console.log("📦 planSemaines count:", merged.planSemaines?.length);

    const index = analysis.niches.findIndex(n => n.nicheId === nicheId);
    analysis.niches[index].analysis = merged;
    analysis.niches[index].analyzed = true;
    analysis.niches[index].analysisCompletedAt = new Date();
    analysis.markModified(`niches.${index}.analysis`); // ✅ requis pour Mixed
    await analysis.save();

    console.log(`✅ Analyse complétée en ${totalTime}s pour "${niche.title}"`);

    const limit = DAILY_LIMITS[userDoc.plan]?.nicheAnalysis;
    const remainingQuota = limit === Infinity ? Infinity : Math.max(0, (limit || 0) - (userDoc.dailyUsage?.nicheAnalysis || 0));

    return NextResponse.json({
      success: true,
      data: { niche: analysis.niches[index], analysisTime: totalTime },
      usedQuota,
      remainingQuota,
      newBalance: !usedQuota ? userDoc.credits?.balance : undefined,
    });

  } catch (e) {
    console.error("❌ Erreur analyse niche:", e);
    return NextResponse.json({ success: false, message: "Erreur lors de l analyse.", error: e.message }, { status: 500 });
  }
}