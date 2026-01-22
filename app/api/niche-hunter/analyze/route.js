export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import NicheAnalysis from "@/models/NicheAnalysis";
import { verifyAuth } from "@/lib/auth";
import { getAIText } from "@/lib/ai";


// Nettoyage markdown (enlever les * et autres)
function cleanMarkdown(text) {
  if (typeof text !== 'string') return text;
  return text
    .replace(/\*\*/g, '')   // Bold **texte**
    .replace(/\*/g, '')     // Italic *texte*
    .replace(/`/g, '')      // Code `texte`
    .replace(/#/g, '')      // Headers #
    .trim();
}

// Nettoyage récursif d'un objet JSON
function cleanJsonMarkdown(obj) {
  if (typeof obj === 'string') {
    return cleanMarkdown(obj);
  }
  if (Array.isArray(obj)) {
    return obj.map(item => cleanJsonMarkdown(item));
  }
  if (obj !== null && typeof obj === 'object') {
    const cleaned = {};
    for (const key in obj) {
      cleaned[key] = cleanJsonMarkdown(obj[key]);
    }
    return cleaned;
  }
  return obj;
}

// Extraction JSON robuste
function extractJson(text) {
  if (!text) throw new Error("Réponse IA vide");

  let match = text.match(/\{[\s\S]*\}/);
  if (match) return JSON.parse(match[0]);

  const cleaned = text
    .replace(/```json/g, "")
    .replace(/```/g, "")
    .trim();

  match = cleaned.match(/\{[\s\S]*\}/);

  if (!match) {
    console.error("Réponse brute IA:", text.slice(0, 400));
    throw new Error("Impossible d'extraire le JSON proprement.");
  }

  return JSON.parse(match[0]);
}

// ✅ NOUVELLE FONCTION : Contexte selon le marché
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
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    const { analysisId, nicheId } = await req.json();

    if (!analysisId || !nicheId) {
      return NextResponse.json(
        { success: false, message: "Paramètres manquants." },
        { status: 400 }
      );
    }

    const analysis = await NicheAnalysis.findOne({
      _id: analysisId,
      userId: user.id
    });

    if (!analysis) {
      return NextResponse.json(
        { success: false, message: "Analyse introuvable." },
        { status: 404 }
      );
    }

    const niche = analysis.niches.find(n => n.nicheId === nicheId);
    if (!niche) {
      return NextResponse.json(
        { success: false, message: "Niche introuvable." },
        { status: 404 }
      );
    }

    // Déjà analysée → on renvoie
    if (niche.analyzed && niche.analysis) {
      return NextResponse.json({
        success: true,
        data: { niche }
      });
    }

    // ✅ RÉCUPÉRER LE CONTEXTE SELON LE MARCHÉ
    const ctx = getAnalysisContext(analysis.targetMarket || "africa");

    // ------------------------------------------------------
    // CONTEXTE DE BASE ADAPTATIF
    // ------------------------------------------------------
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
`;

    // ------------------------------------------------------
    // 🚀 4 APPELS EN PARALLÈLE AVEC TON HUMAIN
    // ------------------------------------------------------
    console.log(`🚀 Analyse de "${niche.title}" (Marché: ${analysis.targetMarket || 'africa'}) - 4 appels parallèles...`);
    const startTime = Date.now();

    const prompt1 = `${base}

💪 Dis-moi franchement : POURQUOI cet eBook peut cartonner ?

Liste 3 points forts concrets et 3 trucs à surveiller.

Écris comme si tu expliquais ça à un ami autour d'un café. Pas de phrases trop longues.

JSON STRICT :
{
  "forces": [
    "Point fort 1 expliqué simplement",
    "Point fort 2 expliqué simplement", 
    "Point fort 3 expliqué simplement"
  ],
  "pointsAttention": [
    "Risque 1 expliqué clairement",
    "Risque 2 expliqué clairement",
    "Risque 3 expliqué clairement"
  ]
}

${ctx.examples}

❌ PAS DE :
- "Cette niche présente un potentiel intéressant..."
- "Il convient de noter que..."
- "Dans le contexte actuel..."`;

    const prompt2 = `${base}

🎯 Comment se démarquer pour que les gens achètent CET eBook et pas celui du voisin ?

Donne 3 stratégies concrètes qu'on peut appliquer dès aujourd'hui.

JSON STRICT :
{
  "conseilsDiff": [
    "Stratégie 1 ultra-concrète",
    "Stratégie 2 ultra-concrète",
    "Stratégie 3 ultra-concrète"
  ]
}

Exemples de stratégies adaptées :
✓ "Ajoute des témoignages vidéo de vrais clients qui ont testé"
✓ "Offre une garantie satisfait ou remboursé 7 jours"
✓ "Fais une version courte gratuite pour donner envie"
✓ "Utilise des exemples concrets et réalistes"

❌ PAS DE :
- "Optimiser le positionnement stratégique..."
- "Développer une proposition de valeur unique..."`;

    const prompt3 = `${base}

📊 Donne-moi les chiffres du marché.

Pas besoin d'être hyper précis, juste une idée réaliste.

JSON STRICT :
{
  "volumeEstime": "Combien de gens cherchent ça par mois (ex: '2k-5k' ou '10k+' ou 'Peu')",
  "tendance": "Est-ce que ça monte ou ça descend ? (ex: '↗️ Ça monte fort' ou '→ Stable' ou '↘️ Ça baisse')",
  "difficulteSEO": 4,
  "cpcMoyen": "Prix pub Google si on voulait en faire (ex: '0.30€' ou 'Quasi gratuit')"
}

TON naturel attendu :
✓ "Les recherches explosent depuis 6 mois"
✓ "C'est stable toute l'année"
✓ "Ça baisse un peu mais reste correct"`;

    const prompt4 = `${base}

✍️ Améliore le titre pour qu'il donne ENCORE PLUS envie d'acheter.

Et dis-moi exactement à QUI vendre cet eBook.

JSON STRICT :
{
  "titreOptimise": "Titre ultra-vendeur (max 60 caractères)",
  "publicCible": "À qui vendre exactement (2-3 phrases max, ton naturel)"
}

${ctx.examples}

❌ PAS DE :
- "La cible démographique principale se compose de..."
- "Les individus âgés de 25 à 35 ans présentant un intérêt pour..."`;

    // ✅ LANCER LES 4 EN PARALLÈLE
    const [raw1, raw2, raw3, raw4] = await Promise.all([
      getAIText("nicheAnalyze", prompt1, 1500),
      getAIText("nicheAnalyze", prompt2, 1200),
      getAIText("nicheAnalyze", prompt3, 1200),
      getAIText("nicheAnalyze", prompt4, 1200)
    ]);

    const totalTime = ((Date.now() - startTime) / 1000).toFixed(1);
    console.log(`⚡ 4 analyses terminées en ${totalTime}s`);

    // ------------------------------------------------------
    // EXTRACTION JSON + NETTOYAGE MARKDOWN
    // ------------------------------------------------------
    const step1 = cleanJsonMarkdown(extractJson(raw1));
    const step2 = cleanJsonMarkdown(extractJson(raw2));
    const step3 = cleanJsonMarkdown(extractJson(raw3));
    const step4 = cleanJsonMarkdown(extractJson(raw4));

    // ------------------------------------------------------
    // MERGE FINAL
    // ------------------------------------------------------
    const merged = {
      ...step1,
      ...step2,
      ...step3,
      ...step4,
      analysisTime: totalTime,
      analyzedAt: new Date().toISOString()
    };

    // Sauvegarde dans la niche
    const index = analysis.niches.findIndex(n => n.nicheId === nicheId);

    analysis.niches[index].analysis = merged;
    analysis.niches[index].analyzed = true;
    analysis.niches[index].analysisCompletedAt = new Date();

    await analysis.save();

    console.log(`✅ Analyse complétée en ${totalTime}s pour "${niche.title}"`);

    return NextResponse.json({
      success: true,
      data: {
        niche: analysis.niches[index],
        analysisTime: totalTime
      }
    });

  } catch (e) {
    console.error("❌ Erreur analyse niche:", e);
    return NextResponse.json(
      {
        success: false,
        message: "Erreur lors de l'analyse.",
        error: e.message
      },
      { status: 500 }
    );
  }
}