export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAIText } from "../../../../lib/ai";

export async function POST(req) {
  try {
    const { titre, tone, audience } = await req.json();

    if (!titre) {
      return NextResponse.json(
        { success: false, message: "Titre requis" },
        { status: 400 }
      );
    }

    const prompt = `Tu es un expert en copywriting et création de titres accrocheurs pour des ebooks.

TITRE ACTUEL : "${titre}"
TON : ${tone || "professionnel"}
AUDIENCE : ${audience || "Grand Public"}

MISSION : Améliore ce titre pour le rendre :
- Plus accrocheur et vendeur
- Optimisé pour l'audience cible
- Clair sur le bénéfice principal
- Maximum 80 caractères

RÈGLES STRICTES :
1. Retourne UNIQUEMENT le nouveau titre, sans guillemets
2. Pas de préambule ni explication
3. Un seul titre (pas de liste)
4. Garde le sujet principal mais rends-le plus impactant
5. INTERDIT : Pas de Markdown (*, #), pas de gras (**).
EXEMPLES DE TRANSFORMATION :
"Guide du Marketing" → "Marketing Digital : Le Guide Ultime pour Multiplier Vos Ventes en 30 Jours"
"Apprendre Python" → "Python pour Débutants : Maîtrisez le Code en 7 Jours (Projets Inclus)"
"Immobilier" → "Immobilier Rentable : Générez 3000€/mois avec 0€ de Départ"

Améliore maintenant le titre actuel :`;

    // Utilise le même provider que outline
    const improvedTitle = await getAIText("ebook", prompt, 150);
    
    // Nettoie les guillemets si présents
    const cleanedTitle = improvedTitle.trim().replace(/^["']|["']$/g, "");

    console.log("✅ Titre amélioré:", cleanedTitle);

    return NextResponse.json({
      success: true,
      improvedTitle: cleanedTitle,
    });

  } catch (error) {
    console.error("❌ Erreur amélioration titre:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}