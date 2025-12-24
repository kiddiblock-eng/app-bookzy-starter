export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { getAIText } from "../../../../lib/ai";

export async function POST(req) {
  try {
    const { titre, description, tone, audience } = await req.json();

    if (!description) {
      return NextResponse.json(
        { success: false, message: "Description requise" },
        { status: 400 }
      );
    }

    const prompt = `Tu es un expert en copywriting pour des ebooks.

TITRE DE L'EBOOK : "${titre || "Guide pratique"}"
DESCRIPTION ACTUELLE : "${description}"
TON : ${tone || "professionnel"}
AUDIENCE : ${audience || "Grand Public"}

MISSION : Améliore cette description pour :
- Clarifier les bénéfices concrets
- Structurer en 2-3 phrases percutantes
- Donner envie de créer cet ebook
- Maximum 250 caractères

RÈGLES STRICTES :
1. Retourne UNIQUEMENT la description améliorée
2. Pas de préambule ni explication
3. 2 à 3 phrases maximum
4. Focus sur les résultats/bénéfices
5. INTERDIT : Pas de Markdown (*, #), pas de gras (**).
EXEMPLES DE TRANSFORMATION :

AVANT : "Un livre sur le marketing digital"
APRÈS : "Découvrez les 7 stratégies marketing éprouvées par 500+ entrepreneurs. Générez vos premières ventes en ligne en moins de 30 jours, même sans budget."

AVANT : "Apprendre à coder en Python"
APRÈS : "Maîtrisez Python de zéro en créant 5 projets concrets : bot Instagram, analyseur de données, site web. Idéal pour débutants sans expérience technique."

Améliore maintenant la description actuelle :`;

    // Utilise le même provider que outline
    const improvedDescription = await getAIText("ebook", prompt, 200);
    
    // Nettoie la réponse
    const cleanedDescription = improvedDescription.trim();

    console.log("✅ Description améliorée:", cleanedDescription);

    return NextResponse.json({
      success: true,
      improvedDescription: cleanedDescription,
    });

  } catch (error) {
    console.error("❌ Erreur amélioration description:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}