export const dynamic = "force-dynamic";
// app/api/ebooks/outline/route.js
import { NextResponse } from "next/server";
import { getAIText } from "../../../../lib/ai"; // Utilise ton provider existant

export async function POST(req) {
  try {
    const { titre, tone, audience } = await req.json();

    if (!titre) return NextResponse.json({ success: false, message: "Titre requis" }, { status: 400 });

    const prompt = `
      Agis comme un expert en édition.
      Génère un plan détaillé (sommaire) de 5 à 8 chapitres pour un ebook intitulé : "${titre}".
      
      Contexte :
      - Ton : ${tone}
      - Cible : ${audience}
      - Marché : Afrique & Europe.

      IMPORTANT : Réponds UNIQUEMENT avec un tableau JSON pur de chaînes de caractères.
      Exemple : ["Introduction", "Chapitre 1 : Titre", "Conclusion"]
      Pas de markdown, pas de gras.
    `;

    // On utilise ton provider existant "ebook" ou un nouveau "outline"
    // maxTokens petit (500) car c'est juste un plan
    const text = await getAIText("ebook", prompt, 1000); 

    // Nettoyage JSON agressif
    const cleanedText = text.replace(/```json/g, "").replace(/```/g, "").trim();
    const outline = JSON.parse(cleanedText);

    return NextResponse.json({ success: true, outline });

  } catch (error) {
    console.error("Erreur Outline API:", error);
    // Fallback manuel si l'IA échoue
    return NextResponse.json({ 
      success: true, 
      outline: [
        `Introduction : Comprendre ${titre}`,
        "Chapitre 1 : Les fondamentaux essentiels",
        "Chapitre 2 : La méthode étape par étape",
        "Chapitre 3 : Les erreurs à éviter",
        "Chapitre 4 : Études de cas et exemples",
        "Conclusion : Votre plan d'action"
      ] 
    });
  }
}