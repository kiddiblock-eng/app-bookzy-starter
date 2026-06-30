// lib/guides.js — moteur des guides long-form (fichiers JSON dans content/guides)
import fs from "fs";
import path from "path";

const DIR = path.join(process.cwd(), "content", "guides");

export function getAllGuideSlugs() {
  try {
    return fs.readdirSync(DIR).filter((f) => f.endsWith(".json")).map((f) => f.replace(/\.json$/, ""));
  } catch {
    return [];
  }
}

export function getGuide(slug) {
  try {
    const data = JSON.parse(fs.readFileSync(path.join(DIR, `${slug}.json`), "utf8"));
    return { slug, ...data };
  } catch {
    return null;
  }
}

export function getAllGuides() {
  return getAllGuideSlugs().map(getGuide).filter((g) => g && g.title);
}

export function getRelatedGuides(slug, pillar, n = 4) {
  return getAllGuides().filter((g) => g.slug !== slug && g.pillar === pillar).slice(0, n);
}

export function getPillars() {
  const map = new Map();
  for (const g of getAllGuides()) {
    if (!map.has(g.pillar)) map.set(g.pillar, []);
    map.get(g.pillar).push(g);
  }
  return [...map.entries()].map(([name, guides]) => ({ name, guides }));
}
