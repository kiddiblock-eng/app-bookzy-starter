import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Trend from "@/models/Trend";

export async function POST(req) {
  try {
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    await dbConnect();

    const formData = await req.formData();
    const file = formData.get("file");
    if (!file) return NextResponse.json({ success: false, message: "Fichier manquant" }, { status: 400 });

    const text = await file.text();
    const lines = text.split("\n").map(l => l.trim()).filter(Boolean);

    if (lines.length < 2) {
      return NextResponse.json({ success: false, message: "CSV vide ou invalide" }, { status: 400 });
    }

    // Parser l'en-tête
    const headers = parseCSVLine(lines[0]);
    const idx = (name) => headers.findIndex(h => h.toLowerCase().trim() === name.toLowerCase());

    const titleIdx = idx("title");
    const descIdx = idx("description");

    if (titleIdx === -1 || descIdx === -1) {
      return NextResponse.json({ success: false, message: "Colonnes 'title' et 'description' obligatoires dans l'en-tête" }, { status: 400 });
    }

    let created = 0;
    let skipped = 0;
    let errors = 0;

    for (let i = 1; i < lines.length; i++) {
      try {
        const cols = parseCSVLine(lines[i]);
        const title = cols[titleIdx]?.trim();
        const description = cols[descIdx]?.trim();

        if (!title || !description) { skipped++; continue; }

        // Vérifier doublon
        const exists = await Trend.findOne({ title: { $regex: new RegExp(title.substring(0, 30).replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), "i") } });
        if (exists) { skipped++; continue; }

        const getCol = (name) => {
          const i = idx(name);
          return i !== -1 ? cols[i]?.trim() : undefined;
        };

        const categoriesRaw = getCol("categories");
        const rawCats = categoriesRaw ? categoriesRaw.split("|").map(c => c.trim()).filter(Boolean) : [];
        // Normaliser les catégories vers les valeurs exactes du modèle
        const validCategories = ["Technologie","Business","Santé","Fitness","Alimentation","Éducation","Divertissement","Lifestyle","Finance","Mode","Beauté","Voyage","Gaming","Sport","Art & Design","Musique","Immobilier","Entrepreneuriat","Marketing","Développement personnel","Environnement","Famille & Parentalité","Autre"];
        const normCatMap = {
          "sante": "Santé", "santé": "Santé", "health": "Santé",
          "fitness": "Fitness",
          "alimentation": "Alimentation", "food": "Alimentation", "cuisine": "Alimentation",
          "education": "Éducation", "éducation": "Éducation",
          "divertissement": "Divertissement",
          "lifestyle": "Lifestyle",
          "finance": "Finance", "argent": "Finance",
          "mode": "Mode", "fashion": "Mode",
          "beaute": "Beauté", "beauté": "Beauté", "beauty": "Beauté",
          "voyage": "Voyage", "travel": "Voyage",
          "gaming": "Gaming", "jeux": "Gaming",
          "sport": "Sport",
          "art": "Art & Design", "design": "Art & Design", "art & design": "Art & Design",
          "musique": "Musique", "music": "Musique",
          "immobilier": "Immobilier",
          "entrepreneuriat": "Entrepreneuriat", "entrepreneurship": "Entrepreneuriat",
          "marketing": "Marketing",
          "developpement personnel": "Développement personnel",
          "développement personnel": "Développement personnel",
          "developpement": "Développement personnel",
          "coaching": "Développement personnel",
          "environnement": "Environnement",
          "famille": "Famille & Parentalité", "parentalite": "Famille & Parentalité",
          "technologie": "Technologie", "tech": "Technologie", "technology": "Technologie",
          "business": "Business",
        };
        const categories = rawCats.map(c => {
          const key = c.toLowerCase().trim();
          return normCatMap[key] || validCategories.find(v => v.toLowerCase() === key) || "Autre";
        });

        const monetizationRaw = getCol("monetizationmethods") || getCol("monetization_methods");
        const monetizationMethods = monetizationRaw ? monetizationRaw.split("|").map(m => m.trim()).filter(Boolean) : ["Ebook"];

        // Normalisation permissive des enums
        const normDifficulty = (v) => {
          if (!v) return "Moyen";
          const l = v.toLowerCase();
          if (l.includes("facile") || l.includes("easy")) return "Facile";
          if (l.includes("difficile") || l.includes("hard")) return "Difficile";
          return "Moyen";
        };
        const normCompetition = (v) => {
          if (!v) return "Moyenne";
          const l = v.toLowerCase();
          if (l.includes("faible") || l.includes("low")) return "Faible";
          if (l.includes("lev") || l.includes("high")) return "Élevée";
          return "Moyenne";
        };
        const normMonetPotential = (v) => {
          if (!v) return "Moyen";
          const l = v.toLowerCase();
          if (l.includes("tres") || l.includes("très") || l.includes("very")) return "Très élevé";
          if (l.includes("elev") || l.includes("lev") || l.includes("high")) return "Élevé";
          if (l.includes("faible") || l.includes("low")) return "Faible";
          return "Moyen";
        };
        const normPeriod = (v) => {
          const valid = ["Jour", "Semaine", "Mois", "Trimestre", "Année", "Permanent"];
          if (!v) return "Mois";
          const found = valid.find(p => p.toLowerCase() === v.toLowerCase());
          return found || "Mois";
        };
        const normNetwork = (v) => {
          const valid = ["TikTok","Instagram","YouTube","YouTube Shorts","Facebook","Twitter/X","Pinterest","LinkedIn","Snapchat","Reddit","Twitch","Multi-plateformes","Autre"];
          if (!v) return "Multi-plateformes";
          const found = valid.find(n => n.toLowerCase() === v.toLowerCase());
          return found || "Multi-plateformes";
        };
        const normRegion = (v) => {
          const valid = ["Global","France","USA","UK","Canada","Afrique","Europe","Asie","Autre"];
          if (!v) return "Global";
          const found = valid.find(r => r.toLowerCase() === v.toLowerCase());
          return found || "Global";
        };

        await Trend.create({
          title,
          description,
          emoji: getCol("emoji") || "💡",
          network: normNetwork(getCol("network")),
          region: normRegion(getCol("region")),
          categories,
          difficulty: normDifficulty(getCol("difficulty")),
          competition: normCompetition(getCol("competition")),
          growth: Number(getCol("growth")) || 50,
          searches: Number(getCol("searches")) || 10000,
          potential: Number(getCol("potential")) || 1000,
          isHot: getCol("ishot") === "true",
          isRising: getCol("isrising") === "true",
          isProfitable: getCol("isprofitable") === "true",
          isTrending: getCol("istrending") !== "false",
          period: normPeriod(getCol("period")),
          monetizationPotential: normMonetPotential(getCol("monetizationpotential")),
          monetizationMethods: monetizationMethods.length > 0 ? monetizationMethods : ["Ebook"],
          estimatedRevenue: getCol("estimatedrevenue") || null,
          tags: getCol("tags") ? getCol("tags").split("|").map(t => t.trim()) : [],
          gradient: getCol("gradient") || "from-blue-500 to-cyan-500",
          priority: Number(getCol("priority")) || 0,
          notes: getCol("notes") || "",
          isActive: true,
        });
        created++;
      } catch (e) {
        console.error(`Erreur ligne ${i}:`, e.message);
        errors++;
      }
    }

    return NextResponse.json({ success: true, created, skipped, errors, total: lines.length - 1 });

  } catch (err) {
    console.error("Erreur import-csv:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}


// Normaliser les valeurs d'enum (accents manquants, casse, etc.)
function normalizeEnum(value, validValues, fallback) {
  if (!value) return fallback;
  const v = value.trim();
  // Match exact
  if (validValues.includes(v)) return v;
  // Match insensible à la casse et aux accents
  const normalized = v.toLowerCase()
    .replace(/e/g, "e").replace(/é|è|ê|ë/g, "e")
    .replace(/a/g, "a").replace(/à|â|ä/g, "a")
    .replace(/u/g, "u").replace(/ù|û|ü/g, "u")
    .replace(/i/g, "i").replace(/î|ï/g, "i")
    .replace(/o/g, "o").replace(/ô|ö/g, "o")
    .replace(/c/g, "c").replace(/ç/g, "c");
  const found = validValues.find(val => {
    const n = val.toLowerCase()
      .replace(/é|è|ê|ë/g, "e").replace(/à|â|ä/g, "a")
      .replace(/ù|û|ü/g, "u").replace(/î|ï/g, "i")
      .replace(/ô|ö/g, "o").replace(/ç/g, "c");
    return n === normalized;
  });
  return found || fallback;
}

const VALID_CATEGORIES = ["Technologie","Business","Santé","Fitness","Alimentation","Éducation","Divertissement","Lifestyle","Finance","Mode","Beauté","Voyage","Gaming","Sport","Art & Design","Musique","Immobilier","Entrepreneuriat","Marketing","Développement personnel","Environnement","Famille & Parentalité","Autre"];
const VALID_DIFFICULTIES = ["Facile","Moyen","Difficile"];
const VALID_COMPETITIONS = ["Faible","Moyenne","Élevée"];
const VALID_MONETIZATION = ["Faible","Moyen","Élevé","Très élevé"];
const VALID_PERIODS = ["Jour","Semaine","Mois","Trimestre","Année","Permanent"];

// Parser une ligne CSV (gère les guillemets et virgules dans les valeurs)
function parseCSVLine(line) {
  const result = [];
  let current = "";
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    if (char === '"') {
      inQuotes = !inQuotes;
    } else if (char === "," && !inQuotes) {
      result.push(current.trim().replace(/^"|"$/g, ""));
      current = "";
    } else {
      current += char;
    }
  }
  result.push(current.trim().replace(/^"|"$/g, ""));
  return result;
}