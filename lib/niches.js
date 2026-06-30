// lib/niches.js — moteur des pages "marché de l'ebook" (data-driven)
// Les données réelles sont générées par scripts/build-niches.mjs (FB Ads + Google Trends)
// et stockées dans content/niches/<slug>.json. Une page n'existe QUE si sa donnée existe.
import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content", "niches");

export function getAllNicheSlugs() {
  try {
    return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export function getNiche(slug) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(DIR, `${slug}.json`), "utf8"));
    return { slug, ...data };
  } catch {
    return null;
  }
}

export function getAllNiches() {
  return getAllNicheSlugs().map(getNiche).filter((n) => n && n.niche);
}

export function getRelatedNiches(slug, categorie, n = 6) {
  return getAllNiches().filter((x) => x.slug !== slug && x.categorie === categorie).slice(0, n);
}

export function verdictFromScore(score) {
  if (score >= 75) return { label: "Fonce", tone: "high" };
  if (score >= 55) return { label: "Prometteur", tone: "good" };
  if (score >= 35) return { label: "À valider", tone: "mid" };
  return { label: "Prudence", tone: "low" };
}
