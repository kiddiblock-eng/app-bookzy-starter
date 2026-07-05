export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import { getAIText } from "@/lib/ai";
import { hasToolUsage } from "@/lib/toolQuota";
import { toolsUnlocked } from "@/lib/plans";

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

const PAYS_AF = [
  { code: "CI", nom: "Côte d'Ivoire", flag: "🇨🇮" },
  { code: "SN", nom: "Sénégal", flag: "🇸🇳" },
  { code: "CM", nom: "Cameroun", flag: "🇨🇲" },
  { code: "ML", nom: "Mali", flag: "🇲🇱" },
  { code: "BJ", nom: "Bénin", flag: "🇧🇯" },
  { code: "TG", nom: "Togo", flag: "🇹🇬" },
  { code: "FR", nom: "France", flag: "🇫🇷" },
];

async function extractKeywordViaAI(sujet) {
  try {
    const raw = await getAIText("nicheAnalyze",
      `Extrait le mot-clé principal de cette phrase pour une recherche sur Facebook Ads et Google Trends. Réponds UNIQUEMENT avec 1 à 3 mots en français, sans ponctuation, sans explication. La phrase : "${sujet}"`,
      30
    );
    if (raw?.trim()) return raw.trim().replace(/[^a-zA-ZÀ-ÿ0-9 ]/g, "").trim();
  } catch {}
  // Fallback simple
  const stopWords = new Set(["comment", "pour", "avec", "dans", "les", "des", "une", "sur", "qui", "que", "en", "de", "la", "le", "et", "du", "faire", "créer", "vendre", "lancer", "guide", "afrique"]);
  const words = sujet.toLowerCase().replace(/[^a-zà-ÿ0-9 ]/g, " ").split(/\s+/).filter(w => w.length > 3 && !stopWords.has(w));
  return words.slice(0, 2).join(" ") || sujet.split(" ").slice(0, 2).join(" ");
}

async function fetchFbAds(keyword) {
  try {
    const words = keyword.trim().split(/\s+/);
    const variants = [...new Set([keyword.trim(), words.slice(0, 2).join(" "), words[0]].filter(Boolean))].slice(0, 3);

    const results = await Promise.allSettled(
      variants.map(kw => {
        const params = new URLSearchParams({ query: kw, search_type: "keyword_unordered", ad_type: "all", status: "ACTIVE", sort_by: "total_impressions", trim: "false" });
        return fetch(`https://facebook-ads-library-scraper-api.p.rapidapi.com/search/ads?${params}`, {
          headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "facebook-ads-library-scraper-api.p.rapidapi.com" }
        }).then(r => r.json());
      })
    );

    const allAds = [];
    for (const res of results) {
      if (res.status === "fulfilled") {
        const data = res.value;
        const ads = Array.isArray(data) ? data : (data.searchResults || data.ads || data.data || []);
        allAds.push(...ads);
      }
    }
    if (!allAds.length) return null;

    const snap = ad => ad.snapshot || {};
    const annonceurs = [...new Map(allAds.map(ad => {
      const s = snap(ad);
      const nom = s.page_name || ad.page_name || "";
      return [nom, { nom, photo: s.page_profile_picture_url || "" }];
    })).values()].filter(a => a.nom && a.photo).slice(0, 5);

    const totalAnnonceurs = new Set(allAds.map(a => snap(a).page_name || a.page_name).filter(Boolean)).size;

    return { totalAnnonceurs, annonceurs };
  } catch { return null; }
}

async function fetchGoogleTrends(keyword) {
  try {
    const wait = ms => new Promise(r => setTimeout(r, ms));
    const headers = { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "google-trends-insights.p.rapidapi.com" };
    const BASE = "https://google-trends-insights.p.rapidapi.com/explore";
    const startTime = "2024-06-01T00:00:00Z";
    const endTime = new Date().toISOString().split("T")[0] + "T00:00:00Z";

    const frRaw = await fetch(`${BASE}/interest-over-time?keyword=${encodeURIComponent(keyword)}&geo=FR&startTime=${startTime}&endTime=${endTime}`, { headers }).catch(() => null);
    const frData = frRaw?.ok ? await frRaw.json().catch(() => null) : null;
    await wait(400);
    const ciRaw = await fetch(`${BASE}/interest-over-time?keyword=${encodeURIComponent(keyword)}&geo=CI&startTime=${startTime}&endTime=${endTime}`, { headers }).catch(() => null);
    const ciData = ciRaw?.ok ? await ciRaw.json().catch(() => null) : null;

    const extractAvg = d => {
      const points = d?.timeline?.default?.timelineData || [];
      if (!points.length) return 0;
      const vals = points.map(p => Array.isArray(p.value) ? p.value[0] : 0);
      return Math.round(vals.reduce((a, b) => a + b, 0) / vals.length);
    };

    const avgFR = extractAvg(frData);
    const avgCI = extractAvg(ciData);

    // Tendance depuis FR
    let tendance = "stable";
    const tendanceData = frData || ciData;
    if (tendanceData) {
      const points = tendanceData?.timeline?.default?.timelineData || [];
      if (points.length >= 4) {
        const q = Math.floor(points.length / 4);
        const getVal = p => Array.isArray(p.value) ? p.value[0] : 0;
        const debut = points.slice(0, q).reduce((s, p) => s + getVal(p), 0) / q;
        const fin = points.slice(-q).reduce((s, p) => s + getVal(p), 0) / q;
        if (fin > debut * 1.25) tendance = "montante";
        else if (fin < debut * 0.75) tendance = "descendante";
      }
    }

    // Scores pays
    const paysScores = {};
    if (avgFR > 0 || avgCI > 0) {
      const ref = Math.max(avgFR, avgCI, 1);
      const ratios = { CI: 1.0, SN: 0.85, CM: 0.80, ML: 0.55, BJ: 0.60, TG: 0.50 };
      const ciScore = Math.round((avgCI / ref) * 100);
      const frScore = Math.round((avgFR / ref) * 100);
      if (frScore > 0) paysScores["FR"] = frScore;
      for (const [code, ratio] of Object.entries(ratios)) {
        const base = ciScore > 0 ? ciScore : frScore * 0.3;
        const score = Math.min(99, Math.round(base * ratio));
        if (score > 0) paysScores[code] = score;
      }
    }

    return { tendance, avgFR, avgCI, paysScores };
  } catch { return null; }
}

// POST /api/analyseur/scan
export async function POST(req) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    const { sujet, checkOnly } = await req.json();
    if (!sujet?.trim()) return NextResponse.json({ success: false }, { status: 400 });

    const userDoc = await User.findById(user.id);

    // Pré-check quota SANS consommer (la conso se fait à l'analyse). Aucun crédit.
    if (userDoc && !hasToolUsage(userDoc, "productAnalysis")) {
      return NextResponse.json({
        success: false,
        limitReached: true,
        needsOffer: !toolsUnlocked(userDoc),
        redirectTo: "/dashboard/tarifs",
      }, { status: 403 });
    }

    // Si checkOnly → juste vérifier le quota
    if (checkOnly) return NextResponse.json({ success: true });

    // Extraire keyword via Gemini
    const keyword = await extractKeywordViaAI(sujet.trim());
    console.log(`🔑 [SCAN] "${sujet}" → "${keyword}"`);

    // FB Ads + Google Trends en parallèle
    const [fbData, trendsData] = await Promise.all([
      fetchFbAds(keyword),
      fetchGoogleTrends(keyword),
    ]);

    return NextResponse.json({
      success: true,
      keyword,
      fb: {
        totalAnnonceurs: fbData?.totalAnnonceurs || 0,
        annonceurs: fbData?.annonceurs || [],
      },
      trends: {
        tendance: trendsData?.tendance || "stable",
        paysScores: trendsData?.paysScores || null,
      },
    });
  } catch (e) {
    return NextResponse.json({ success: false, message: e.message }, { status: 500 });
  }
}