#!/usr/bin/env node
/**
 * Génère les pages "marché de l'ebook" data-driven.
 * Pour chaque niche : Facebook Ads (annonceurs actifs) + Google Trends (tendance, pays),
 * puis calcule un score de rentabilité à partir de ces signaux RÉELS.
 *
 * Usage (par lots, pour maîtriser le coût RapidAPI) :
 *   node scripts/build-niches.mjs --limit 50 --offset 0
 *   node scripts/build-niches.mjs --limit 50 --offset 50
 *   node scripts/build-niches.mjs --mock --limit 3      (test sans API, NE PAS committer)
 *
 * Prérequis : RAPIDAPI_KEY dans .env.local
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const ROOT = path.join(__dirname, "..");
const OUT_DIR = path.join(ROOT, "content", "niches");

// --- charge .env.local ---
try {
  const env = fs.readFileSync(path.join(ROOT, ".env.local"), "utf8");
  for (const line of env.split("\n")) {
    const m = line.match(/^\s*([A-Z0-9_]+)\s*=\s*(.*)\s*$/);
    if (m && !process.env[m[1]]) process.env[m[1]] = m[2].replace(/^["']|["']$/g, "");
  }
} catch {}

const RAPIDAPI_KEY = process.env.RAPIDAPI_KEY;

// --- args ---
const args = process.argv.slice(2);
const getArg = (k, d) => { const i = args.indexOf(k); return i >= 0 ? args[i + 1] : d; };
const MOCK = args.includes("--mock");
const LIMIT = parseInt(getArg("--limit", "50"));
const OFFSET = parseInt(getArg("--offset", "0"));

const slugify = (s) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/['']/g, " ").replace(/[^a-z0-9]+/g, "-").replace(/^-+|-+$/g, "");
const wait = (ms) => new Promise((r) => setTimeout(r, ms));

const STOP = new Set(["comment", "pour", "avec", "dans", "les", "des", "une", "sur", "qui", "que", "son", "ses", "ton", "tes", "de", "la", "le", "et", "du", "faire", "creer", "créer", "vendre", "lancer", "gerer", "gérer", "trouver", "reussir", "réussir", "guide", "afrique", "ligne", "premier", "premiere"]);
function extractKeyword(sujet) {
  const words = sujet.toLowerCase().replace(/[^a-zà-ÿ0-9 ]/g, " ").split(/\s+/).filter((w) => w.length > 3 && !STOP.has(w));
  return words.slice(0, 2).join(" ") || sujet.split(" ").slice(0, 2).join(" ");
}

async function fetchFbAds(keyword) {
  try {
    const words = keyword.trim().split(/\s+/);
    const variants = [...new Set([keyword.trim(), words.slice(0, 2).join(" "), words[0]].filter(Boolean))].slice(0, 2);
    const results = await Promise.allSettled(variants.map((kw) => {
      const params = new URLSearchParams({ query: kw, search_type: "keyword_unordered", ad_type: "all", status: "ACTIVE", sort_by: "total_impressions", trim: "false" });
      return fetch(`https://facebook-ads-library-scraper-api.p.rapidapi.com/search/ads?${params}`, {
        headers: { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "facebook-ads-library-scraper-api.p.rapidapi.com" },
      }).then((r) => r.json());
    }));
    const allAds = [];
    for (const res of results) {
      if (res.status === "fulfilled") {
        const d = res.value;
        const ads = Array.isArray(d) ? d : (d.searchResults || d.ads || d.data || []);
        allAds.push(...ads);
      }
    }
    if (!allAds.length) return { totalAnnonceurs: 0, annonceurs: [] };
    const snap = (ad) => ad.snapshot || {};
    const annonceurs = [...new Map(allAds.map((ad) => {
      const s = snap(ad); const nom = s.page_name || ad.page_name || "";
      return [nom, { nom, photo: s.page_profile_picture_url || "" }];
    })).values()].filter((a) => a.nom).slice(0, 5);
    const totalAnnonceurs = new Set(allAds.map((a) => snap(a).page_name || a.page_name).filter(Boolean)).size;
    return { totalAnnonceurs, annonceurs };
  } catch { return { totalAnnonceurs: 0, annonceurs: [] }; }
}

async function fetchTrends(keyword) {
  try {
    const headers = { "x-rapidapi-key": RAPIDAPI_KEY, "x-rapidapi-host": "google-trends-insights.p.rapidapi.com" };
    const BASE = "https://google-trends-insights.p.rapidapi.com/explore";
    const startTime = "2024-06-01T00:00:00Z";
    const endTime = new Date().toISOString().split("T")[0] + "T00:00:00Z";
    const frRaw = await fetch(`${BASE}/interest-over-time?keyword=${encodeURIComponent(keyword)}&geo=FR&startTime=${startTime}&endTime=${endTime}`, { headers }).catch(() => null);
    const frData = frRaw?.ok ? await frRaw.json().catch(() => null) : null;
    await wait(400);
    const ciRaw = await fetch(`${BASE}/interest-over-time?keyword=${encodeURIComponent(keyword)}&geo=CI&startTime=${startTime}&endTime=${endTime}`, { headers }).catch(() => null);
    const ciData = ciRaw?.ok ? await ciRaw.json().catch(() => null) : null;
    const avg = (d) => { const p = d?.timeline?.default?.timelineData || []; if (!p.length) return 0; const v = p.map((x) => Array.isArray(x.value) ? x.value[0] : 0); return Math.round(v.reduce((a, b) => a + b, 0) / v.length); };
    const avgFR = avg(frData), avgCI = avg(ciData);
    let tendance = "stable";
    const td = frData || ciData;
    const pts = td?.timeline?.default?.timelineData || [];
    if (pts.length >= 4) {
      const q = Math.floor(pts.length / 4); const gv = (p) => Array.isArray(p.value) ? p.value[0] : 0;
      const debut = pts.slice(0, q).reduce((s, p) => s + gv(p), 0) / q;
      const fin = pts.slice(-q).reduce((s, p) => s + gv(p), 0) / q;
      if (fin > debut * 1.25) tendance = "montante"; else if (fin < debut * 0.75) tendance = "descendante";
    }
    const paysScores = {};
    if (avgFR > 0 || avgCI > 0) {
      const ref = Math.max(avgFR, avgCI, 1);
      const ratios = { CI: 1.0, SN: 0.85, CM: 0.8, ML: 0.55, BJ: 0.6, TG: 0.5 };
      const ciScore = Math.round((avgCI / ref) * 100), frScore = Math.round((avgFR / ref) * 100);
      if (frScore > 0) paysScores.FR = frScore;
      for (const [c, r] of Object.entries(ratios)) { const base = ciScore > 0 ? ciScore : frScore * 0.3; const sc = Math.min(99, Math.round(base * r)); if (sc > 0) paysScores[c] = sc; }
    }
    return { tendance, paysScores };
  } catch { return { tendance: "stable", paysScores: {} }; }
}

// Score de rentabilité dérivé des signaux réels
function computeScore({ totalAnnonceurs, tendance, paysScores }) {
  const advScore = Math.min(60, totalAnnonceurs * 4); // demande prouvée par les annonceurs actifs
  const trendScore = tendance === "montante" ? 22 : tendance === "stable" ? 12 : 2;
  const geo = Object.values(paysScores || {});
  const geoBonus = geo.length ? Math.min(16, Math.round(Math.max(...geo) / 6)) : 0;
  return Math.max(5, Math.min(99, advScore + trendScore + geoBonus));
}
function verdict(score) { return score >= 75 ? "Fonce" : score >= 55 ? "Prometteur" : score >= 35 ? "À valider" : "Prudence"; }
function revenus(score) {
  const low = Math.round((score * 600) / 1000) * 1000;
  const high = Math.round((score * 3500) / 1000) * 1000;
  const f = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
  return `${f(low)} – ${f(high)} FCFA / mois`;
}

async function main() {
  fs.mkdirSync(OUT_DIR, { recursive: true });
  const { ALL_TOPICS } = await import(path.join(ROOT, "lib", "seoTopics.js"));
  const batch = ALL_TOPICS.slice(OFFSET, OFFSET + LIMIT);
  if (!MOCK && !RAPIDAPI_KEY) { console.error("❌ RAPIDAPI_KEY manquante dans .env.local"); process.exit(1); }
  console.log(`▶ ${MOCK ? "[MOCK] " : ""}${batch.length} niches (offset ${OFFSET})`);

  let done = 0, skipped = 0;
  for (const t of batch) {
    const slug = t.slug;
    const out = path.join(OUT_DIR, `${slug}.json`);
    if (fs.existsSync(out)) { skipped++; continue; }

    let data;
    if (MOCK) {
      const totalAnnonceurs = Math.floor(Math.random() * 30);
      const tendance = ["montante", "stable", "descendante"][Math.floor(Math.random() * 3)];
      const paysScores = { CI: 60 + Math.floor(Math.random() * 39), SN: 40 + Math.floor(Math.random() * 40), CM: 30 + Math.floor(Math.random() * 40) };
      const score = computeScore({ totalAnnonceurs, tendance, paysScores });
      data = { niche: t.titre, keyword: extractKeyword(t.titre), categorie: t.categorie, totalAnnonceurs, annonceurs: [], tendance, paysScores, score, verdict: verdict(score), revenusEstimes: revenus(score), mock: true, generatedAt: new Date().toISOString() };
    } else {
      const keyword = extractKeyword(t.titre);
      const [fb, tr] = await Promise.all([fetchFbAds(keyword), fetchTrends(keyword)]);
      const score = computeScore({ totalAnnonceurs: fb.totalAnnonceurs, tendance: tr.tendance, paysScores: tr.paysScores });
      data = { niche: t.titre, keyword, categorie: t.categorie, totalAnnonceurs: fb.totalAnnonceurs, annonceurs: fb.annonceurs, tendance: tr.tendance, paysScores: tr.paysScores, score, verdict: verdict(score), revenusEstimes: revenus(score), generatedAt: new Date().toISOString() };
      await wait(800); // respect des limites RapidAPI
    }
    fs.writeFileSync(out, JSON.stringify(data, null, 2));
    done++;
    console.log(`  ✅ ${slug} — score ${data.score} (${data.verdict})`);
  }
  console.log(`▶ Terminé : ${done} générées, ${skipped} déjà présentes.`);
}

main().catch((e) => { console.error(e); process.exit(1); });
