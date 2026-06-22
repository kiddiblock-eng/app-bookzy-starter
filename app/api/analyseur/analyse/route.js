export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import ProductAnalysis from "@/models/ProductAnalysis";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { getAIText } from "@/lib/ai";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;
const CREDITS_PAR_ANALYSE = 4;
const ANALYSES_GRATUITES_PAR_JOUR = 3;

const PAYS_AF = [
  { code: "CI", nom: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "SN", nom: "Sénégal", flag: "🇸🇳" },
  { code: "CM", nom: "Cameroun", flag: "🇨🇲" },
  { code: "ML", nom: "Mali", flag: "🇲🇱" },
  { code: "BJ", nom: "Bénin", flag: "🇧🇯" },
  { code: "TG", nom: "Togo", flag: "🇹🇬" },
  { code: "FR", nom: "France", flag: "🇫🇷" },
];

function extractJson(text) {
  if (!text) throw new Error("Réponse IA vide");
  let cleaned = text.replace(/```json/g, "").replace(/```/g, "").trim();
  const match = cleaned.match(/\{[\s\S]*\}/);
  if (!match) throw new Error("JSON introuvable");
  let jsonStr = match[0].replace(/,\s*([\]}])/g, "$1");
  try { return JSON.parse(jsonStr); }
  catch { throw new Error("JSON invalide"); }
}

// Retourne le keyword principal (pour Google Trends)
function extractKeywords(sujet) {
  const stopWords = new Set([
    "comment", "pour", "avec", "dans", "les", "des", "une", "sur", "qui", "que",
    "en", "de", "la", "le", "et", "du", "depuis", "vers", "faire", "créer",
    "réussir", "gagner", "vendre", "lancer", "démarrer", "guide", "complet",
    "tout", "savoir", "apprendre", "débuter", "débutant", "afrique", "africain",
    "grace", "grâce", "partir", "travers", "moyen", "aide", "sans", "plus",
    "how", "to", "the", "and", "for", "from", "with", "your", "what", "best",
  ]);
  const rawWords = sujet.replace(/[?!:;,.''"«»()\[\]]/g, " ").split(/\s+/).filter(w => w.length > 2);
  const propres = rawWords.filter(w => /^[A-ZÀÂÉÈÊËÎÏÔÙÛÜ]/.test(w) && w.length > 2 && !stopWords.has(w.toLowerCase()));
  if (propres.length) return propres.slice(0, 2).join(" ");
  const significatifs = rawWords.map(w => w.toLowerCase().replace(/[''`]/g, "")).filter(w => !stopWords.has(w) && w.length > 4);
  if (significatifs.length) return significatifs.slice(0, 2).join(" ");
  return rawWords.slice(0, 2).join(" ");
}

// Retourne jusqu'à 3 variants de keywords pour FB Ads (plus de couverture)
function extractKeywordVariants(sujet) {
  const stopWords = new Set([
    "comment", "pour", "avec", "dans", "les", "des", "une", "sur", "qui", "que",
    "en", "de", "la", "le", "et", "du", "depuis", "vers", "faire", "créer",
    "réussir", "gagner", "vendre", "lancer", "démarrer", "guide", "complet",
    "tout", "savoir", "apprendre", "débuter", "débutant", "afrique", "africain",
    "grace", "grâce", "partir", "travers", "moyen", "aide", "sans", "plus",
    "how", "to", "the", "and", "for", "from", "with", "your", "what", "best",
  ]);
  const rawWords = sujet.replace(/[?!:;,.''"«»()\[\]]/g, " ").split(/\s+/).filter(w => w.length > 2);

  // Noms propres / marques
  const propres = rawWords.filter(w => /^[A-ZÀÂÉÈÊËÎÏÔÙÛÜ]/.test(w) && w.length > 2 && !stopWords.has(w.toLowerCase()));

  // Mots significatifs
  const significatifs = rawWords.map(w => w.toLowerCase().replace(/[''`]/g, "")).filter(w => !stopWords.has(w) && w.length > 4);

  const variants = new Set();

  // Variant 1 : noms propres en priorité
  if (propres.length) variants.add(propres.slice(0, 2).join(" "));

  // Variant 2 : 2 premiers mots significatifs
  if (significatifs.length >= 2) variants.add(significatifs.slice(0, 2).join(" "));

  // Variant 3 : 1 seul mot le plus court et percutant
  if (significatifs.length) variants.add(significatifs[0]);

  // Fallback
  if (variants.size === 0) variants.add(rawWords.slice(0, 2).join(" "));

  return [...variants].slice(0, 3).filter(Boolean);
}

// ── Fetch Facebook Ads ────────────────────────────────────────────────────────
async function fetchFbAds(keyword) {
  try {
    // Générer 2-3 variants depuis le keyword propre fourni par Gemini
    const words = keyword.trim().split(/\s+/);
    const variants = [...new Set([
      keyword.trim(),                          // ex: "dropshipping Afrique"
      words.slice(0, 2).join(" "),             // ex: "dropshipping"
      words.length > 1 ? words[0] : null,     // ex: "dropshipping" seul
    ].filter(Boolean))].slice(0, 3);

    console.log(`🔍 [FB Ads] Variants: ${variants.join(" | ")}`);

    // Appels en parallèle pour chaque variant
    const results = await Promise.allSettled(
      variants.map(keyword => {
        const params = new URLSearchParams({
          query: keyword,
          search_type: "keyword_unordered",
          ad_type: "all",
          status: "ACTIVE",
          sort_by: "total_impressions",
          trim: "false",
        });
        return fetch(
          `https://facebook-ads-library-scraper-api.p.rapidapi.com/search/ads?${params}`,
          { headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "facebook-ads-library-scraper-api.p.rapidapi.com" } }
        ).then(r => r.json());
      })
    );

    // Fusionner tous les ads des différents variants
    const allAds = [];
    for (const res of results) {
      if (res.status === "fulfilled") {
        const data = res.value;
        const ads = Array.isArray(data) ? data : (data.searchResults || data.ads || data.data || []);
        allAds.push(...ads);
      }
    }

    if (!allAds.length) return null;

    const snap = (ad) => ad.snapshot || {};

    // Dédupliquer par nom de page
    const annonceurs = [...new Map(allAds.map(ad => {
      const s = snap(ad);
      const nom = s.page_name || ad.page_name || "";
      return [nom, {
        nom,
        photo: s.page_profile_picture_url || "",
        duree: ad.start_date
          ? `${Math.floor((Date.now() - new Date(typeof ad.start_date === "number" ? ad.start_date * 1000 : ad.start_date)) / 86400000)}j`
          : "?",
        body: typeof s.body === "string" ? s.body : s.body?.text || s.cards?.[0]?.body || "",
        titre: s.title || s.cards?.[0]?.title || "",
      }];
    })).values()].filter(a => a.nom).slice(0, 8);

    const durees = allAds.map(a => {
      if (!a.start_date) return 0;
      const d = typeof a.start_date === "number" ? a.start_date * 1000 : new Date(a.start_date).getTime();
      return Math.floor((Date.now() - d) / 86400000);
    }).filter(d => d > 0);
    const dureeMoyenne = durees.length ? Math.round(durees.reduce((a, b) => a + b, 0) / durees.length) : 0;

    const totalAnnonceurs = new Set(allAds.map(a => snap(a).page_name || a.page_name).filter(Boolean)).size;

    let saturationScore;
    if (totalAnnonceurs < 5)        saturationScore = 1;
    else if (totalAnnonceurs < 10)  saturationScore = 2;
    else if (totalAnnonceurs < 20)  saturationScore = 4;
    else if (totalAnnonceurs < 40)  saturationScore = 5;
    else if (totalAnnonceurs < 60)  saturationScore = 6;
    else if (totalAnnonceurs < 80)  saturationScore = 7;
    else if (totalAnnonceurs < 100) saturationScore = 8;
    else                            saturationScore = 9;

    const pubsContent = annonceurs.slice(0, 5)
      .map(a => `"${a.nom}": ${a.titre} — ${a.body}`)
      .join("\n");

    console.log(`📊 [FB Ads] Total annonceurs (${variants.length} variants): ${totalAnnonceurs}`);

    return { totalAnnonceurs, dureeMoyenne, dureemoyenne: `${dureeMoyenne}j`, annonceurs, saturationScore, pubsContent };
  } catch (e) {
    console.warn("⚠️ FB Ads error:", e.message);
    return null;
  }
}

// ── Fetch Google Trends ───────────────────────────────────────────────────────
// Vraie structure API : { timeline: { default: { timelineData: [{ value: [N] }] } } }
// On fait 7 appels interest-over-time en parallèle, un par pays cible

async function fetchGoogleTrends(keyword) {
  console.log(`🔍 [Google Trends] Recherche: "${keyword}"`);

  const headers = {
    "x-rapidapi-key": RAPIDAPI_KEY,
    "x-rapidapi-host": "google-trends-insights.p.rapidapi.com",
  };
  const BASE = "https://google-trends-insights.p.rapidapi.com/explore";
  const startTime = "2024-06-01T00:00:00Z";
  const endTime = new Date().toISOString().split("T")[0] + "T00:00:00Z";

  const PAYS_CIBLES = {
    CI: { nom: "Côte d'Ivoire", flag: "🇨🇮" },
    SN: { nom: "Sénégal",       flag: "🇸🇳" },
    CM: { nom: "Cameroun",      flag: "🇨🇲" },
    ML: { nom: "Mali",          flag: "🇲🇱" },
    BJ: { nom: "Bénin",         flag: "🇧🇯" },
    TG: { nom: "Togo",          flag: "🇹🇬" },
    FR: { nom: "France",        flag: "🇫🇷" },
  };

  // Moyenne des dernières 4 semaines depuis une réponse interest-over-time
  function extractAvg(data) {
    const points = data?.timeline?.default?.timelineData || [];
    if (!points.length) return 0;
    const last4 = points.slice(-4);
    const vals = last4.map(p => (Array.isArray(p.value) ? p.value[0] : 0)).filter(v => v > 0);
    return vals.length ? Math.round(vals.reduce((a, b) => a + b, 0) / vals.length) : 0;
  }

  const wait = ms => new Promise(r => setTimeout(r, ms));

  try {
    // Appels séquentiels avec délai pour éviter le rate-limiting "Too many requests"
    let frData = null, ciData = null;

    const frRaw = await fetch(
      `${BASE}/interest-over-time?keyword=${encodeURIComponent(keyword)}&geo=FR&startTime=${startTime}&endTime=${endTime}`,
      { headers }
    ).catch(() => null);
    if (frRaw?.ok) frData = await frRaw.json().catch(() => null);

    await wait(400);

    const ciRaw = await fetch(
      `${BASE}/interest-over-time?keyword=${encodeURIComponent(keyword)}&geo=CI&startTime=${startTime}&endTime=${endTime}`,
      { headers }
    ).catch(() => null);
    if (ciRaw?.ok) ciData = await ciRaw.json().catch(() => null);

    // Tendance depuis FR (le plus fiable en volume)
    let tendance = "stable";
    let volumeGlobal = 0;
    const tendanceData = frData || ciData;
    if (tendanceData) {
      const points = tendanceData?.timeline?.default?.timelineData || [];
      if (points.length >= 4) {
        const quarter = Math.floor(points.length / 4);
        const getVal = p => Array.isArray(p.value) ? p.value[0] : 0;
        const debutMoy = points.slice(0, quarter).reduce((s, p) => s + getVal(p), 0) / quarter;
        const finMoy   = points.slice(-quarter).reduce((s, p) => s + getVal(p), 0) / quarter;
        if (finMoy > debutMoy * 1.25)      tendance = "montante";
        else if (finMoy < debutMoy * 0.75) tendance = "descendante";
        const last = points[points.length - 1];
        volumeGlobal = Array.isArray(last?.value) ? last.value[0] : 0;
      }
    }

    // Scores bruts CI et FR
    const avgFR = extractAvg(frData);
    const avgCI = extractAvg(ciData);

    console.log(`📊 [Google Trends] Mondial: ${volumeGlobal} | CI: ${avgCI} | FR: ${avgFR} | Tendance: ${tendance}`);

    // Si aucune donnée sur CI ni FR → pas de scoring pays fiable
    if (avgCI === 0 && avgFR === 0) {
      console.log(`📊 [Google Trends] Aucun signal — Gemini estimera les scores pays`);
      return { tendance, volumeGlobal, paysScores: null, risingKeywords: [] };
    }

    // Construire les scores pays avec pondération réaliste
    // CI est la référence africaine (= 100 si c'est le plus haut)
    // Les autres pays africains sont estimés par rapport à CI avec des ratios connus
    // FR est gardé comme score absolu (marché diaspora)
    const RATIOS_VS_CI = {
      // Ratios relatifs basés sur pénétration internet + volume marché digital francophone
      CI: 1.00,
      SN: 0.85,
      CM: 0.80,
      ML: 0.55,
      BJ: 0.60,
      TG: 0.50,
      FR: null, // calculé depuis avgFR directement
    };

    // Référence : le plus haut entre avgCI et avgFR normalisé
    const maxRef = Math.max(avgCI, avgFR, 1);
    const paysScores = {};

    // Pays africains : calculés depuis avgCI avec ratios
    Object.entries(RATIOS_VS_CI).forEach(([code, ratio]) => {
      if (ratio === null) return; // FR traité séparément
      if (avgCI > 0) {
        const score = Math.round((avgCI / maxRef) * 100 * ratio);
        if (score > 5) paysScores[code] = Math.min(score, 99); // cap à 99
      }
    });

    // France : score direct depuis son propre appel
    if (avgFR > 0) {
      paysScores["FR"] = Math.round((avgFR / maxRef) * 100);
    }

    // Si CI=0 mais FR>0 : les pays africains n'ont pas de signal Google clair
    // On les inclut quand même avec des scores estimés depuis le mondial
    if (avgCI === 0 && avgFR > 0 && volumeGlobal > 0) {
      const baseAfrique = Math.round(volumeGlobal * 0.4); // estimation 40% du mondial
      paysScores["CI"] = Math.min(Math.round(baseAfrique), 75);
      paysScores["SN"] = Math.min(Math.round(baseAfrique * 0.85), 65);
      paysScores["CM"] = Math.min(Math.round(baseAfrique * 0.80), 60);
    }

    console.log(`📊 [Google Trends] Scores pays:`, paysScores);

    return { tendance, volumeGlobal, paysScores: Object.keys(paysScores).length ? paysScores : null, risingKeywords: [] };

  } catch (e) {
    console.warn("⚠️ Google Trends error:", e.message);
    return { tendance: "stable", volumeGlobal: 0, paysScores: null, risingKeywords: [] };
  }
}

// ── Construit le contexte pays pour le prompt Gemini ─────────────────────────
function buildPaysContext(paysScores) {
  const PAYS_CIBLES = {
    CI: { nom: "Côte d'Ivoire", flag: "🇨🇮" },
    SN: { nom: "Sénégal",       flag: "🇸🇳" },
    CM: { nom: "Cameroun",      flag: "🇨🇲" },
    ML: { nom: "Mali",          flag: "🇲🇱" },
    BJ: { nom: "Bénin",         flag: "🇧🇯" },
    TG: { nom: "Togo",          flag: "🇹🇬" },
    FR: { nom: "France",        flag: "🇫🇷" },
  };

  if (!paysScores || !Object.keys(paysScores).length) {
    return `Pas de données Google Trends par pays. Estime les scores selon ta connaissance du marché francophone africain.`;
  }

  const lines = Object.entries(paysScores)
    .filter(([code]) => PAYS_CIBLES[code])
    .sort(([, a], [, b]) => b - a)
    .map(([code, score]) => `  - ${PAYS_CIBLES[code].flag} ${PAYS_CIBLES[code].nom} (${code}) : indice Google Trends = ${score}/100`);

  return `SCORES GOOGLE TRENDS RÉELS PAR PAYS :
${lines.join("\n")}
Utilise ces indices directement comme base pour le champ "score" de chaque pays dans le JSON.
Tu peux ajuster de ±5 points max selon le contexte marché spécifique au sujet.
Inclus uniquement les pays présents dans cette liste pour le champ "pays".`;
}

// ── POST ──────────────────────────────────────────────────────────────────────
export async function POST(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const { sujet, scanData } = await req.json();
    if (!sujet?.trim()) return NextResponse.json({ success: false, message: "Sujet requis." }, { status: 400 });

    const userDoc = await User.findById(user.id);
    if (!userDoc) return NextResponse.json({ success: false, message: "Introuvable." }, { status: 404 });

    const isPremium = ["solo", "createur", "agence"].includes(userDoc.plan);

    // ── Quota ─────────────────────────────────────────────────────────────────
    const today = new Date().toISOString().split("T")[0];
    if (userDoc.dailyUsage?.date !== today) {
      userDoc.dailyUsage = { date: today, youtubeAnalysis: 0, nicheHunter: 0, nicheAnalysis: 0, productAnalysis: 0 };
    }
    const usedToday = userDoc.dailyUsage?.productAnalysis || 0;
    const existingCount = await ProductAnalysis.countDocuments({ userId: user.id });
    console.log(`📊 [QUOTA] plan: ${userDoc.plan} | isPremium: ${isPremium} | usedToday: ${usedToday} | total: ${existingCount}`);

    if (!isPremium) {
      if (existingCount === 0) {
        // 1ère analyse → débiter 4 crédits
        const balance = userDoc.credits?.balance ?? 0;
        if (balance < CREDITS_PAR_ANALYSE) {
          return NextResponse.json({
            success: false,
            limitReached: true,
            insufficientCredits: true,
            balance,
            required: CREDITS_PAR_ANALYSE,
            message: "Crédits insuffisants pour votre première analyse.",
          }, { status: 402 });
        }
        userDoc.credits.balance -= CREDITS_PAR_ANALYSE;
        userDoc.credits.totalSpent = (userDoc.credits.totalSpent || 0) + CREDITS_PAR_ANALYSE;
        await userDoc.save();
        console.log(`💳 [QUOTA] 4 crédits débités — 1ère analyse — solde: ${userDoc.credits.balance}`);
      } else {
        // 2ème analyse+ sans abonnement → débiter 8 crédits
        const CREDITS_SANS_ABONNEMENT = 8;
        const balance = userDoc.credits?.balance ?? 0;
        if (balance < CREDITS_SANS_ABONNEMENT) {
          return NextResponse.json({
            success: false,
            limitReached: true,
            insufficientCredits: true,
            balance,
            required: CREDITS_SANS_ABONNEMENT,
            message: `Il vous faut ${CREDITS_SANS_ABONNEMENT} crédits pour analyser sans abonnement. Rechargez ou passez à Solo.`,
          }, { status: 402 });
        }
        userDoc.credits.balance -= CREDITS_SANS_ABONNEMENT;
        userDoc.credits.totalSpent = (userDoc.credits.totalSpent || 0) + CREDITS_SANS_ABONNEMENT;
        await userDoc.save();
        console.log(`💳 [QUOTA] 8 crédits débités — analyse sans abonnement — solde: ${userDoc.credits.balance}`);
      }
    } else if (usedToday < ANALYSES_GRATUITES_PAR_JOUR) {
      // Premium : analyses incluses dans l'abonnement
      userDoc.dailyUsage.productAnalysis = (userDoc.dailyUsage.productAnalysis || 0) + 1;
      await userDoc.save();
    } else {
      // Premium : quota journalier dépassé → débiter crédits
      const balance = userDoc.credits?.balance ?? 0;
      if (balance < CREDITS_PAR_ANALYSE) {
        return NextResponse.json({ success: false, insufficientCredits: true, balance, required: CREDITS_PAR_ANALYSE }, { status: 402 });
      }
      userDoc.credits.balance -= CREDITS_PAR_ANALYSE;
      userDoc.credits.totalSpent = (userDoc.credits.totalSpent || 0) + CREDITS_PAR_ANALYSE;
      userDoc.dailyUsage.productAnalysis = (userDoc.dailyUsage.productAnalysis || 0) + 1;
      await userDoc.save();
    }

    // ── Fetch données réelles (skip si déjà fourni par /scan) ────────────────
    let fbData = null, trendsData = null;
    if (scanData?.fb && scanData?.trends) {
      // Données déjà récupérées par /scan — on les réutilise
      console.log(`⚡ [ANALYSE] Réutilisation données scan — skip API calls`);
      fbData = {
        totalAnnonceurs: scanData.fb.totalAnnonceurs,
        annonceurs: scanData.fb.annonceurs || [],
        dureemoyenne: scanData.fb.dureemoyenne || "?",
        saturationScore: scanData.fb.saturationScore,
        pubsContent: scanData.fb.pubsContent || "",
      };
      trendsData = {
        tendance: scanData.trends.tendance || "stable",
        paysScores: scanData.trends.paysScores || null,
        risingKeywords: [],
      };
    } else {
      // Pas de scanData → on fait les appels normalement
      // ── Extraction keyword via Gemini ──────────────────────────────────────
      let searchKeyword = sujet.trim();
      try {
        const kwRaw = await getAIText("nicheAnalyze",
          `Extrait le mot-clé principal de cette phrase pour une recherche sur Facebook Ads et Google Trends. Réponds UNIQUEMENT avec 1 à 3 mots en français, sans ponctuation, sans explication. La phrase : "${sujet.trim()}"`,
          30
        );
        if (kwRaw?.trim()) searchKeyword = kwRaw.trim().replace(/[^a-zA-ZÀ-ÿ0-9 ]/g, "").trim();
      } catch (e) {
        console.warn("⚠️ Keyword extraction failed, using raw sujet");
      }
      console.log(`🔑 [KEYWORD] "${sujet.trim()}" → "${searchKeyword}"`);
      [fbData, trendsData] = await Promise.all([
        fetchFbAds(searchKeyword),
        fetchGoogleTrends(searchKeyword),
      ]);
    }

    // ── Saturation label depuis score réel ────────────────────────────────────
    const satScore = fbData?.saturationScore ?? 5;
    const satLabel = satScore <= 3 ? "Faible" : satScore <= 6 ? "Modérée" : "Élevée";

    // ── Contexte réel pour Gemini ─────────────────────────────────────────────
    const contexteReel = `
DONNÉES FACEBOOK ADS RÉELLES (ne pas inventer) :
- Annonceurs actifs trouvés : ${fbData?.totalAnnonceurs ?? "données indisponibles"}
- Durée moyenne des campagnes : ${fbData?.dureemoyenne ?? "inconnue"}
- Score de saturation CALCULÉ depuis les vraies données : ${satScore}/10 (${satLabel}) — NE PAS MODIFIER CE SCORE dans ta réponse
- Contenu réel des pubs actives :
${fbData?.pubsContent ?? "Aucune pub trouvée pour ce sujet"}

DONNÉES GOOGLE TRENDS RÉELLES :
- Tendance de recherche sur 12 mois : ${trendsData?.tendance ?? "stable"}
- Indice de volume actuel (0-100) : ${trendsData?.volumeGlobal ?? "indisponible"}

${buildPaysContext(trendsData?.paysScores ?? null)}

${trendsData?.risingKeywords?.length
  ? `MOTS-CLÉS EN HAUSSE SUR GOOGLE (intègre les plus pertinents dans "keywords") :\n${trendsData.risingKeywords.map(k => `  - ${k}`).join("\n")}`
  : ""}
`;

    // ── Prompt Gemini ─────────────────────────────────────────────────────────
    const prompt = `Tu es un analyste marché senior spécialisé en vente de produits numériques en Afrique francophone. Tu es HONNÊTE et DIRECT — tu ne valides pas un sujet juste pour faire plaisir.

Sujet analysé : "${sujet}"

${contexteReel}

RÈGLES CRITIQUES — LIRE ATTENTIVEMENT :

VERDICT (sois honnête, ne dis pas "fonce" si c'est saturé ou risqué) :
- "fonce" : marché validé, peu saturé, timing bon, vrai potentiel → score 70-100
- "attends" : marché existe mais saturé, mauvais timing, ou besoin d'un meilleur angle → score 40-69
- "evite" : trop saturé, audience trop petite, ou produit sans valeur réelle → score < 40

SATURATION (basé sur les ${fbData?.totalAnnonceurs ?? 0} annonceurs FB réels) :
- Si saturation >= 7/10 : c'est un marché DANGEREUX, verdict = "attends" ou "evite" obligatoirement
- Si saturation >= 5/10 ET tendance descendante : verdict = "evite" obligatoirement
- Ne jamais dire "fonce" si saturation >= 8/10

REVENUS (réalistes selon le marché africain) :
- Score > 70 → 15 à 30 ventes/semaine, prix 5 000-15 000 FCFA
- Score 50-70 → 8 à 15 ventes/semaine, prix 3 500-8 000 FCFA  
- Score < 50 → 3 à 8 ventes/semaine, prix 2 000-5 000 FCFA

TIMING :
- "excellent" : tendance montante + saturation < 4 → foncer maintenant
- "bon" : tendance stable + saturation < 6 → bon moment
- "attendre" : tendance descendante OU saturation > 6 → attendre 2-3 mois ou changer d'angle
- "risque" : saturation > 7 → marché dangereux, reformuler obligatoirement

ANGLE GAGNANT (obligatoire dans tous les cas) :
- Si le sujet est saturé ou verdict = "attends"/"evite" : OBLIGATOIRE de remplir "sujetReformule" avec une version reformulée qui marcherait mieux
- Exemple : "vendre des ebooks" saturé → "vendre des templates Canva aux coiffeurs africains"
- Si verdict = "fonce" : "sujetReformule" peut être vide "" car le sujet actuel est bon
- L'angle gagnant doit être SPÉCIFIQUE, pas générique, avec une niche claire

JSON STRICT (réponds UNIQUEMENT avec ce JSON) :
{
  "scoreGlobal": 78,
  "verdict": "fonce",
  "verdictTexte": "Phrase courte et percutante max 12 mots — honnête sur le marché",
  "raisonVerdict": "Explication en 2 phrases pourquoi ce verdict, basée sur les données réelles",
  "timing": {
    "statut": "bon",
    "label": "Bon moment pour se lancer",
    "explication": "Pourquoi maintenant est (ou n'est pas) le bon moment, 1-2 phrases concrètes"
  },
  "titresSuggeres": [
    "Si verdict = fonce : 3 titres accrocheurs pour le sujet actuel",
    "Si verdict = attends/evite : 3 titres accrocheurs POUR LE SUJET REFORMULÉ (angleGagnant.sujetReformule), pas pour le sujet original — ces titres doivent permettre de se lancer immédiatement sur l'angle gagnant",
    "Titre 3 — plus émotionnel ou basé sur le résultat concret"
  ],
  "angleGagnant": {
    "titre": "Comment battre la concurrence en 1 phrase",
    "strategie": "Explication détaillée de l'angle unique — 3-4 phrases très concrètes et actionnables",
    "positionnemment": "Comment se positionner exactement face aux ${fbData?.totalAnnonceurs ?? 0} concurrents FB actifs",
    "sujetReformule": "Si le sujet actuel est risqué : version reformulée du sujet qui marcherait mieux. Sinon laisser vide."
  },
  "calendrierLancement": [
    { "semaine": 1, "titre": "Créer le contenu", "actions": ["Action 1 très concrète", "Action 2", "Action 3"] },
    { "semaine": 2, "titre": "Préparer la vente", "actions": ["Action 1", "Action 2", "Action 3"] },
    { "semaine": 3, "titre": "Lancer et vendre", "actions": ["Action 1", "Action 2", "Action 3"] },
    { "semaine": 4, "titre": "Scaler", "actions": ["Action 1", "Action 2", "Action 3"] }
  ],
  "pays": [
    { "nom": "Côte d'Ivoire", "flag": "🇨🇮", "score": 92, "raison": "Raison concrète basée sur les données" }
  ],
  "concurrents": {
    "niveau": "moyen",
    "description": "Description honnête du marché basée sur les pubs FB réelles",
    "strategies": ["Stratégie observée 1", "Stratégie observée 2", "Stratégie observée 3"],
    "angleUnique": "Différenciation concrète et spécifique"
  },
  "revenus": {
    "prixRecommande": 5000,
    "ventesParSemaine": 15,
    "semaine": 75000,
    "mois": 322500,
    "annee": 3870000,
    "hypothese": "Basé sur X ventes/semaine à Y FCFA via WhatsApp + Facebook Ads"
  },
  "saturation": {
    "score": ${satScore},
    "label": "${satLabel}",
    "description": "Explication honnête basée sur les ${fbData?.totalAnnonceurs ?? "?"} annonceurs FB"
  },
  "pratiques": [
    { "titre": "Titre court", "description": "Action concrète 1-2 phrases" },
    { "titre": "Titre court", "description": "Action concrète 1-2 phrases" },
    { "titre": "Titre court", "description": "Action concrète 1-2 phrases" },
    { "titre": "Titre court", "description": "Action concrète 1-2 phrases" }
  ],
  "keywords": ["mot-clé 1", "mot-clé 2", "mot-clé 3", "mot-clé 4", "mot-clé 5"],
  "audience": "Qui sont-ils exactement, quel problème précis ils ont, 1 phrase",
  "tendanceGoogle": "${trendsData?.tendance ?? "stable"}",
  "alternativesSiMauvais": []
}

RAPPEL FINAL : Sois honnête. Si le marché est saturé dis-le. Si le sujet est risqué dis-le. Mais propose toujours un angle pour s'en sortir.`;

    const raw = await getAIText("nicheAnalyze", prompt, 2500);
    if (!raw) return NextResponse.json({ success: false, message: "IA indisponible." }, { status: 503 });

    let aiData;
    try { aiData = extractJson(raw); }
    catch { return NextResponse.json({ success: false, message: "Erreur parsing IA." }, { status: 500 }); }

    // ── Forcer la saturation depuis les vraies données (l'IA ne peut pas l'écraser) ──
    aiData.saturation = {
      score: satScore,
      label: satLabel,
      description: aiData.saturation?.description || `${fbData?.totalAnnonceurs ?? 0} annonceurs actifs trouvés sur Facebook Ads.`,
    };

    // ── Forcer tendanceGoogle depuis les vraies données ────────────────────────
    aiData.tendanceGoogle = trendsData?.tendance ?? "stable";

    // ── Calculer revenus cohérents si ventesParSemaine présent ───────────────
    const ventesParSemaine = aiData.revenus?.ventesParSemaine || 10;
    const prixRecommande = aiData.revenus?.prixRecommande || 3500;
    const semaine = Math.round(ventesParSemaine * prixRecommande);
    const mois = Math.round(semaine * 4.3);
    const annee = Math.round(mois * 12);

    aiData.revenus = {
      prixRecommande,
      ventesParSemaine,
      semaine,
      mois,
      annee,
      hypothese: aiData.revenus?.hypothese || `Basé sur ${ventesParSemaine} ventes/semaine à ${prixRecommande.toLocaleString("fr-FR")} FCFA`,
    };

    // ── Sauvegarder ───────────────────────────────────────────────────────────
    const analysis = await ProductAnalysis.create({
      userId: user.id,
      sujet: sujet.trim(),
      scoreGlobal: aiData.scoreGlobal || 0,
      verdict: aiData.verdict || "attends",
      verdictTexte: aiData.verdictTexte || "",
      raisonVerdict: aiData.raisonVerdict || "",
      timing: aiData.timing || { statut: "bon", label: "Bon moment", explication: "" },
      titresSuggeres: aiData.titresSuggeres || [],
      angleGagnant: aiData.angleGagnant || {},
      calendrierLancement: aiData.calendrierLancement || [],
      fbAds: {
        totalAnnonceurs: fbData?.totalAnnonceurs || 0,
        dureemoyenne: fbData?.dureemoyenne || "0j",
        annonceurs: fbData?.annonceurs || [],
        tendance: aiData.tendanceGoogle,
      },
      tendanceGoogle: aiData.tendanceGoogle,
      pays: aiData.pays || [],
      concurrents: aiData.concurrents || {},
      revenus: aiData.revenus,
      saturation: aiData.saturation,
      pratiques: aiData.pratiques || [],
      keywords: aiData.keywords || [],
      audience: aiData.audience || "",
      alternativesSiMauvais: (aiData.alternativesSiMauvais || []).map(a =>
        typeof a === "string"
          ? { sujet: a, raison: "" }
          : { sujet: a.sujet || "", raison: a.raison || "" }
      ).filter(a => a.sujet),
    });

    console.log(`✅ [ANALYSEUR] "${sujet}" — score: ${aiData.scoreGlobal} — verdict: ${aiData.verdict} — FB: ${fbData?.totalAnnonceurs ?? 0} annonceurs — sat: ${satScore}/10 — user: ${userDoc.email}`);

    // ── Email de relance pour les free ────────────────────────────────────────
    if (!isPremium) {
      try {
        const EmailJob = (await import("@/models/EmailJob")).default;
        await EmailJob.create({
          userId:    userDoc._id,
          email:     userDoc.email,
          firstName: userDoc.firstName || userDoc.name?.split(" ")[0] || "",
          type:      "analyseur_relance",
          payload: {
            sujet:       sujet.trim(),
            scoreGlobal: aiData.scoreGlobal,
            verdict:     aiData.verdict,
            analysisId:  analysis._id,
          },
          sendAt: new Date(Date.now() + 24 * 60 * 60 * 1000), // 24h après
        });
        console.log(`📧 [EMAIL JOB] Relance programmée pour ${userDoc.email} dans 24h`);
      } catch (e) {
        console.warn("⚠️ Email job creation failed:", e.message);
      }
    }

    return NextResponse.json({
      success: true,
      isPremium,
      data: {
        id: analysis._id,
        sujet: sujet.trim(),
        scoreGlobal: aiData.scoreGlobal,
        verdict: aiData.verdict,
        verdictTexte: aiData.verdictTexte,
        raisonVerdict: aiData.raisonVerdict,
        timing: aiData.timing,
        titresSuggeres: aiData.titresSuggeres || [],
        angleGagnant: aiData.angleGagnant || {},
        calendrierLancement: aiData.calendrierLancement || [],
        fbAds: analysis.fbAds,
        tendanceGoogle: aiData.tendanceGoogle,
        pays: aiData.pays,
        concurrents: aiData.concurrents,
        revenus: aiData.revenus,
        saturation: aiData.saturation,
        pratiques: aiData.pratiques,
        keywords: aiData.keywords,
        audience: aiData.audience,
        alternativesSiMauvais: (aiData.alternativesSiMauvais || []).map(a =>
          typeof a === "string" ? { sujet: a, raison: "" } : { sujet: a.sujet || "", raison: a.raison || "" }
        ).filter(a => a.sujet),
        risingKeywords: trendsData?.risingKeywords || [],
      },
    });

  } catch (e) {
    console.error("❌ Erreur analyseur:", e);
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}