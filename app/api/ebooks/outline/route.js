export const dynamic = "force-dynamic";
// app/api/ebooks/outline/route.js
import { NextResponse } from "next/server";
import { getAIText } from "../../../../lib/ai";

export async function POST(req) {
  let titre = "Votre ebook";
  let totalChapters = 5;
  
  try {
    const body = await req.json();
    titre = body.titre || titre;
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
Agis comme un expert en édition professionnelle.

Génère un plan détaillé (sommaire) pour un ebook intitulé : "${titre}".

Contexte :
- Ton : ${tone || "professionnel"}
- Cible : ${audience || "grand public"}
- Marché : Afrique & Europe
- Nombre de chapitres : ${totalChapters}

RÈGLES STRICTES :
1. Chaque titre de chapitre doit être COMPLET et DESCRIPTIF (70-100 caractères)
2. Format professionnel type Amazon/Kobo : "Chapitre X: Titre principal - Sous-titre explicatif"
3. Les titres doivent être vendeurs et donner envie de lire
4. IMPORTANT : N'utilise JAMAIS d'apostrophes (') - Remplace toujours par "de" ou reformule
   ❌ MAUVAIS : "l'aventure", "d'Afrique", "qu'il"
   ✅ BON : "une aventure", "de Afrique", "que il"
5. Utilise des tirets (-) pour séparer titre principal et sous-titre

EXEMPLES DE BONS TITRES :
✅ "Chapitre 1: Maîtriser la sous-location - Votre tremplin sans capital pour réussir sur Airbnb"
✅ "Chapitre 2: Rendez vos meublés irrésistibles - Guide complet de décoration et tarification"
✅ "Chapitre 3: Attirer les expatriés et la diaspora - Stratégies marketing pour louer à prix premium"

FORMAT DE SORTIE :
Retourne UNIQUEMENT un tableau JSON avec exactement ${totalChapters + 2} éléments :
["Introduction", "Chapitre 1: Titre long - Sous-titre descriptif", ..., "Conclusion"]

PAS de markdown, PAS de backticks, PAS d'explications.
AUCUNE apostrophe dans les titres.

COMMENCE MAINTENANT :
`;

    console.log(`🤖 [OUTLINE] Génération plan pour "${titre}" (${totalChapters} chapitres)`);

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

    // ✅ Nettoyage
    let cleanedText = text
      .replace(/```json/g, "")
      .replace(/```/g, "")
      .replace(/^\s*[\r\n]/gm, "")
      .trim();

    if (!cleanedText.startsWith("[")) {
      const match = cleanedText.match(/\[[\s\S]*\]/);
      if (match) {
        cleanedText = match[0];
      } else {
        console.warn("⚠️ [OUTLINE] Pas de tableau JSON trouvé");
        return NextResponse.json({ 
          success: true, 
          outline: generateFallbackOutline(titre, totalChapters),
          fallback: true
        });
      }
    }

    // 🔥 PARSING ROBUSTE
    let outline;
    try {
      outline = JSON.parse(cleanedText);
    } catch (firstError) {
      console.warn("⚠️ [OUTLINE] Parsing JSON échoué, essai extraction manuelle");
      console.error("📄 [OUTLINE] Texte reçu:", cleanedText.substring(0, 300));
      
      try {
        const matches = cleanedText.match(/"([^"\\]*(\\.[^"\\]*)*)"/g);
        
        if (matches && matches.length > 0) {
          outline = matches.map(m => {
            let str = m.slice(1, -1);
            str = str
              .replace(/\\"/g, '"')
              .replace(/\\'/g, "'")
              .replace(/\\\\/g, '\\')
              .replace(/\\n/g, '\n');
            return str;
          });
          
          console.log(`✅ [OUTLINE] Extraction manuelle réussie (${outline.length} éléments)`);
        } else {
          throw new Error("Aucun élément trouvé");
        }
      } catch (secondError) {
        console.error("❌ [OUTLINE] Extraction manuelle échouée:", secondError.message);
        return NextResponse.json({ 
          success: true, 
          outline: generateFallbackOutline(titre, totalChapters),
          fallback: true
        });
      }
    }

    // Validation
    if (!Array.isArray(outline)) {
      outline = [outline].flat();
    }

    outline = outline.filter(item => typeof item === "string" && item.length > 0);

    if (outline.length === 0) {
      return NextResponse.json({ 
        success: true, 
        outline: generateFallbackOutline(titre, totalChapters),
        fallback: true
      });
    }

    // Ajuster le nombre d'éléments
    const expectedLength = totalChapters + 2;
    if (outline.length < expectedLength - 1 || outline.length > expectedLength + 1) {
      console.warn(`⚠️ [OUTLINE] Ajustement: ${outline.length} → ${expectedLength}`);
      outline = adjustOutlineLength(outline, totalChapters);
    }

    console.log(`✅ [OUTLINE] Plan validé (${outline.length} éléments)`);

    return NextResponse.json({ 
      success: true, 
      outline 
    });

  } catch (error) {
    console.error("❌ [OUTLINE] Erreur globale:", error);
    return NextResponse.json({ 
      success: true, 
      outline: generateFallbackOutline(titre, totalChapters),
      fallback: true
    });
  }
}

function generateFallbackOutline(titre, totalChapters) {
  const outline = [`Introduction : Découvrir ${titre}`];
  
  const chapterTitles = [
    "Les fondamentaux essentiels - Tout ce que vous devez savoir pour bien démarrer",
    "La méthode étape par étape - Guide pratique pour passer à action rapidement",
    "Les erreurs à éviter - Apprenez des échecs des autres pour gagner du temps",
    "Stratégies avancées - Techniques de professionnels pour maximiser vos résultats",
    "Études de cas pratiques - Exemples concrets de réussite inspirants",
    "Techniques de optimisation - Améliorez vos performances avec ces astuces",
    "Les outils indispensables - Votre boîte à outils pour réussir efficacement",
    "Passage à action - Votre plan de route pour démarrer dès maintenant",
    "Aller plus loin - Ressources et formations pour continuer à progresser",
    "Les tendances futures - Anticipez les changements pour rester en avance"
  ];
  
  for (let i = 0; i < totalChapters; i++) {
    const title = chapterTitles[i] || `Stratégies et méthodes avancées - Techniques professionnelles ${i + 1}`;
    outline.push(`Chapitre ${i + 1} : ${title}`);
  }
  
  outline.push("Conclusion : Votre plan de action pour réussir");
  
  return outline;
}

function adjustOutlineLength(outline, targetChapters) {
  const expectedLength = targetChapters + 2;
  
  if (outline.length < expectedLength) {
    const missing = expectedLength - outline.length;
    const lastIndex = outline.length - 1;
    
    for (let i = 0; i < missing; i++) {
      const chapterNum = lastIndex + i;
      outline.splice(lastIndex, 0, `Chapitre ${chapterNum} : Approfondissement - Stratégies complémentaires pour aller plus loin`);
    }
  }
  
  if (outline.length > expectedLength) {
    const toRemove = outline.length - expectedLength;
    const middleIndex = Math.floor(outline.length / 2);
    outline.splice(middleIndex, toRemove);
  }
  
  return outline;
}