import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getAIText } from "@/lib/ai";
import Trend from "@/models/Trend";

export async function POST(req) {
  try {
    const adminSecret = req.headers.get("x-admin-secret");
    if (adminSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
      return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 401 });
    }

    await dbConnect();
    const { count = 20, region = "Afrique", categories = [], theme = "" } = await req.json();

    const categoriesStr = categories.length > 0
      ? "dans les catégories : " + categories.join(", ")
      : "dans des catégories variées (business, santé, finance, beauté, cuisine, tech, etc.)";

    const themeStr = theme ? "Thème spécifique : " + theme + "." : "";
    const year = new Date().getFullYear();

    const prompt = [
      "Tu es un expert en tendances de contenu digital et monétisation pour les marchés francophones africains.",
      "",
      "Génère exactement " + count + " tendances de contenu/niches rentables " + categoriesStr + " " + themeStr + " pour la région " + region + ".",
      "",
      "Réponds UNIQUEMENT avec un tableau JSON valide. Aucun texte avant ou après. Aucun markdown. Aucun backtick.",
      "",
      "Valeurs autorisées pour difficulty: Facile, Moyen, Difficile",
      "Valeurs autorisées pour competition: Faible, Moyenne, Élevée",
      "Valeurs autorisées pour monetizationPotential: Faible, Moyen, Élevé, Très élevé",
      "Valeurs autorisées pour categories: Technologie, Business, Santé, Fitness, Alimentation, Éducation, Divertissement, Lifestyle, Finance, Mode, Beauté, Voyage, Gaming, Sport, Art & Design, Musique, Immobilier, Entrepreneuriat, Marketing, Développement personnel, Environnement, Famille & Parentalité, Autre",
      "",
      "Règles importantes:",
      "- Tendances pertinentes pour l'Afrique francophone en " + year,
      "- Monétisables via ebooks, formations ou coaching",
      "- Variées, pas toutes dans la même niche",
      "- Ne commence jamais une tendance par 'Comment' ou 'Pourquoi', juste un titre accrocheur de 6 à 9 mots",
      "- La description doit être concise, 1 à 2 phrases max, pas de listes à puces",
      "- RÈGLE ABSOLUE : le champ title ne doit JAMAIS commencer par : Ebook, Formation, Coaching, Guide, Manuel, Tutoriel. Si un titre commence par ces mots, reformule-le. Ex: 'Ebook perte de poids' → 'Perdre du poids naturellement'. Le type de monétisation va dans monetizationMethods uniquement.",
      "- Les textes peuvent contenir des apostrophes normalement",
      "- Assure-toi que le JSON est valide : pas de virgules en trop, guillemets doubles autour des clés et valeurs string",
    ].join("\n");

    const rawText = await getAIText("nicheGenerate", prompt, 8000);

    // Extraire le tableau JSON de la réponse
    const jsonMatch = rawText.match(/\[\s*\{[\s\S]*\}\s*\]/);
    if (!jsonMatch) throw new Error("Pas de JSON valide dans la réponse IA");

    // Nettoyer les trailing commas
    const jsonStr = jsonMatch[0].replace(/,\s*([}\]])/g, "$1");

    let trends = [];
    try {
      trends = JSON.parse(jsonStr);
    } catch (parseErr) {
      // Récupération objet par objet si le JSON global est cassé
      console.error("Parse JSON échoué:", parseErr.message, "— récupération partielle...");
      const objMatches = [...jsonStr.matchAll(/\{[^{}]*\}/g)];
      for (const m of objMatches) {
        try { trends.push(JSON.parse(m[0])); } catch (e) { /* ignorer */ }
      }
      if (trends.length === 0) throw new Error("Impossible de parser la réponse IA : " + parseErr.message);
    }

    const VALID_CATEGORIES = ["Technologie","Business","Santé","Fitness","Alimentation","Éducation","Divertissement","Lifestyle","Finance","Mode","Beauté","Voyage","Gaming","Sport","Art & Design","Musique","Immobilier","Entrepreneuriat","Marketing","Développement personnel","Environnement","Famille & Parentalité","Autre"];
    const VALID_METHODS = ["Ebook","Formation","Coaching","Affiliation","Ads","Sponsoring","UGC","Produits","Services","Abonnement","Membership","Marketplace","Dropshipping"];
    const VALID_PERIODS = ["Jour","Semaine","Mois","Trimestre","Année","Permanent"];

    let created = 0;
    let skipped = 0;

    for (const t of trends) {
      try {
        if (!t.title || t.title.length < 5) { skipped++; continue; }

        // Rejeter les titres qui commencent par des mots interdits
        const forbiddenStarts = ["ebook", "formation", "coaching", "guide", "manuel", "tutoriel", "cours"];
        const titleLower = t.title.toLowerCase().trim();
        if (forbiddenStarts.some(w => titleLower.startsWith(w))) {
          // Tenter de corriger en supprimant le premier mot
          const words = t.title.split(" ");
          if (words.length > 2) {
            t.title = words.slice(1).join(" ");
          } else {
            skipped++;
            continue;
          }
        }

        // Vérifier doublon — comparaison exacte uniquement
        const exists = await Trend.findOne({
          title: { $regex: new RegExp("^" + t.title.replace(/[.*+?^${}()|[\]\\]/g, "\\$&") + "$", "i") }
        });
        if (exists) { skipped++; continue; }

        const validCategories = (Array.isArray(t.categories) ? t.categories : [])
          .filter(c => VALID_CATEGORIES.includes(c));
        if (validCategories.length === 0) validCategories.push("Autre");

        const validMethods = (Array.isArray(t.monetizationMethods) ? t.monetizationMethods : [])
          .filter(m => VALID_METHODS.includes(m));
        if (validMethods.length === 0) validMethods.push("Ebook");

        await Trend.create({
          title: t.title.substring(0, 100),
          description: (t.description || "").substring(0, 500),
          emoji: t.emoji || "💡",
          network: t.network || "Multi-plateformes",
          region: t.region || region,
          categories: validCategories,
          difficulty: ["Facile","Moyen","Difficile"].includes(t.difficulty) ? t.difficulty : "Moyen",
          competition: ["Faible","Moyenne","Élevée"].includes(t.competition) ? t.competition : "Moyenne",
          growth: Number(t.growth) || 50,
          searches: Number(t.searches) || 10000,
          potential: Number(t.potential) || 1000,
          isHot: Boolean(t.isHot),
          isRising: Boolean(t.isRising),
          isProfitable: Boolean(t.isProfitable),
          isTrending: true,
          period: VALID_PERIODS.includes(t.period) ? t.period : "Mois",
          monetizationPotential: ["Faible","Moyen","Élevé","Très élevé"].includes(t.monetizationPotential) ? t.monetizationPotential : "Moyen",
          monetizationMethods: validMethods,
          estimatedRevenue: t.estimatedRevenue || null,
          tags: Array.isArray(t.tags) ? t.tags : [],
          gradient: t.gradient || "from-blue-500 to-cyan-500",
          priority: Number(t.priority) || 50,
          isActive: true,
        });
        created++;
      } catch (e) {
        console.error("Erreur création trend:", e.message);
        skipped++;
      }
    }

    return NextResponse.json({ success: true, created, skipped, total: trends.length });

  } catch (err) {
    console.error("Erreur generate-ia:", err);
    return NextResponse.json({ success: false, message: err.message }, { status: 500 });
  }
}