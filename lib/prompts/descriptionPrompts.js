// lib/prompts/descriptionPrompts.js

export function getSalesDescriptionPrompt({ title, description, audience }) {
  return `
Rédige une description de vente professionnelle et persuasive pour un ebook intitulé "${title}".

CONTEXTE DU PRODUIT :
${description}

PUBLIC CIBLE :
${audience || "Africains francophones, étudiants, entrepreneurs, jeunes actifs"}

OBJECTIFS DE LA DESCRIPTION :
1. Accrocher le lecteur dès la première phrase avec une idée forte.
2. Décrire clairement le problème que vit la cible.
3. Montrer que l'ebook apporte une solution concrète et réaliste.
4. Mettre en avant les bénéfices concrets pour le lecteur.
5. Expliquer ce qu'il va réellement apprendre et obtenir.
6. Donner une projection claire des résultats possibles pour un lecteur motivé.
7. Ajouter un paragraphe court de crédibilité.
8. Terminer avec un appel à l'action puissant et professionnel.

STYLE :
Français impeccable, ton naturel, confiance élevée, 100 pour cent adapté au marché africain francophone. 
Aucun symbole de mise en forme. Aucun effet markdown.
Paragraphe courts et agréables à lire.
Texte destiné à une page de vente PDF ou web.

CONTRAINTES :
Aucun symbole (#, *, -).
Aucune exagération ou promesse irréaliste.
Retourne uniquement la description finale.`;
}