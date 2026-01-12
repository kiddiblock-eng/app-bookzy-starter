export const dynamic = "force-dynamic";
// app/api/ebooks/outline/route.js
import { NextResponse } from "next/server";
import { getAIText } from "../../../../lib/ai";

export async function POST(req) {
  let titre = "Votre ebook"; // ← DÉFINI PAR DÉFAUT AU DÉBUT
  let totalChapters = 5;
  
  try {
    const body = await req.json();
    titre = body.titre || titre; // ← Utilise le titre reçu ou garde le défaut
    const tone = body.tone;
    const audience = body.audience;
    totalChapters = Number(body.chapters) || 5;

    if (!titre || titre === "Votre ebook") {
      return NextResponse.json({ 
        success: false, 
        message: "Titre requis" 
      }, { status: 400 });
    }

    const prompt = `
Agis comme un expert en édition.
Génère un plan détaillé (sommaire) pour un ebook intitulé : "${titre}".

Contexte :
- Ton : ${tone || "professionnel"}
- Cible : ${audience || "grand public"}
- Marché : Afrique & Europe
- Nombre de chapitres : ${totalChapters}

RÈGLES STRICTES :
1. Retourne UNIQUEMENT un tableau JSON de chaînes de caractères
2. Format exact : ["Introduction", "Chapitre 1: Titre descriptif", "Chapitre 2: Titre descriptif", ..., "Conclusion"]
3. Exactement ${totalChapters + 2} éléments (1 intro + ${totalChapters} chapitres + 1 conclusion)
4. Pas de backticks, pas de markdown, pas de gras, pas d'explications
5. Chaque titre de chapitre doit être concret et vendeur
6. N'utilise PAS de guillemets simples (') dans les titres, utilise des guillemets doubles (") ou évite-les

Exemple de sortie valide :
["Introduction", "Chapitre 1: Les bases essentielles", "Chapitre 2: Stratégies avancées", "Conclusion"]

COMMENCE MAINTENANT avec exactement ${totalChapters + 2} éléments :
`;

    console.log(`🤖 [OUTLINE] Génération plan pour "${titre}" (${totalChapters} chapitres)`);

    // ✅ Appel IA avec retry
    let text;
    try {
      text = await getAIText("ebook", prompt, 1000);
      console.log("📝 [OUTLINE] Réponse IA reçue");
    } catch (aiError) {
      console.error("❌ [OUTLINE] Erreur IA:", aiError.message);
      return NextResponse.json({ 
        success: true, 
        outline: generateFallbackOutline(titre, totalChapters),
        fallback: true
      });
    }

    // ✅ Nettoyage agressif
    let cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^\s*[\r\n]/gm, "") // Enlever lignes vides
      .replace(/'/g, '"') // ← REMPLACER LES APOSTROPHES PAR GUILLEMETS
      .trim();

    // ✅ Si le texte commence par autre chose qu'un crochet, chercher le tableau
    if (!cleanedText.startsWith("[")) {
      const match = cleanedText.match(/\[[\s\S]*\]/);
      if (match) {
        cleanedText = match[0];
      } else {
        console.warn("⚠️ [OUTLINE] Pas de tableau JSON trouvé, utilisation fallback");
        return NextResponse.json({ 
          success: true, 
          outline: generateFallbackOutline(titre, totalChapters),
          fallback: true
        });
      }
    }

    // ✅ Parse JSON
    let outline;
    try {
      outline = JSON.parse(cleanedText);
      
      // ✅ Vérifier que c'est bien un tableau
      if (!Array.isArray(outline)) {
        throw new Error("La réponse n'est pas un tableau");
      }
      
      // ✅ Vérifier que ce sont bien des strings
      if (!outline.every(item => typeof item === "string")) {
        throw new Error("Le tableau contient des éléments non-string");
      }
      
      // ✅ Vérifier le nombre d'éléments (tolérance ±1)
      const expectedLength = totalChapters + 2;
      if (outline.length < expectedLength - 1 || outline.length > expectedLength + 1) {
        console.warn(`⚠️ [OUTLINE] Mauvais nombre d'éléments (${outline.length}/${expectedLength}), ajustement`);
        outline = adjustOutlineLength(outline, totalChapters);
      }
      
      console.log(`✅ [OUTLINE] Plan généré avec succès (${outline.length} éléments)`);
      
      return NextResponse.json({ 
        success: true, 
        outline 
      });

    } catch (parseError) {
      console.error("❌ [OUTLINE] Erreur parsing JSON:", parseError.message);
      console.error("📄 [OUTLINE] Texte reçu:", cleanedText.substring(0, 300));
      
      return NextResponse.json({ 
        success: true, 
        outline: generateFallbackOutline(titre, totalChapters),
        fallback: true
      });
    }

  } catch (error) {
    console.error("❌ [OUTLINE] Erreur globale:", error);
    console.error(error.stack);
    
    // ✅ UTILISE titre ET totalChapters définis au début
    return NextResponse.json({ 
      success: true, 
      outline: generateFallbackOutline(titre, totalChapters),
      fallback: true,
      error: error.message
    });
  }
}

// ✅ Fonction fallback intelligente
function generateFallbackOutline(titre, totalChapters) {
  const outline = [`Introduction : Comprendre ${titre}`];
  
  const chapterTitles = [
    "Les fondamentaux essentiels",
    "La méthode étape par étape",
    "Les erreurs à éviter",
    "Stratégies avancées",
    "Études de cas pratiques",
    "Techniques d'optimisation",
    "Les outils indispensables",
    "Passage à l'action",
    "Aller plus loin",
    "Les tendances futures"
  ];
  
  for (let i = 0; i < totalChapters; i++) {
    const title = chapterTitles[i] || `Stratégies et méthodes ${i + 1}`;
    outline.push(`Chapitre ${i + 1} : ${title}`);
  }
  
  outline.push("Conclusion : Votre plan d'action");
  
  return outline;
}

// ✅ Fonction pour ajuster la longueur de l'outline
function adjustOutlineLength(outline, targetChapters) {
  const expectedLength = targetChapters + 2;
  
  // Si trop court, ajouter des chapitres
  if (outline.length < expectedLength) {
    const missing = expectedLength - outline.length;
    const lastIndex = outline.length - 1; // Position de la conclusion
    
    for (let i = 0; i < missing; i++) {
      const chapterNum = lastIndex + i;
      outline.splice(lastIndex, 0, `Chapitre ${chapterNum} : Approfondissement`);
    }
  }
  
  // Si trop long, retirer des chapitres du milieu
  if (outline.length > expectedLength) {
    const toRemove = outline.length - expectedLength;
    const middleIndex = Math.floor(outline.length / 2);
    outline.splice(middleIndex, toRemove);
  }
  
  return outline;
}