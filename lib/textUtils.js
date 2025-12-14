// lib/textUtils.js
// 🎯 Utilitaires pour respecter EXACTEMENT le nombre de pages demandé

/**
 * Compte le nombre de mots dans un texte
 */
export function countWords(text) {
  if (!text) return 0;
  return text.trim().split(/\s+/).length;
}

/**
 * Tronque un texte au nombre de mots maximum
 * Coupe intelligemment à la fin d'une phrase si possible
 */
export function truncateToWords(text, maxWords) {
  if (!text) return '';
  
  const words = text.trim().split(/\s+/);
  
  if (words.length <= maxWords) {
    return text;
  }
  
  // Tronquer au nombre de mots max
  let truncated = words.slice(0, maxWords).join(' ');
  
  // Essayer de couper à la fin d'une phrase
  const lastPeriod = truncated.lastIndexOf('.');
  const lastExclamation = truncated.lastIndexOf('!');
  const lastQuestion = truncated.lastIndexOf('?');
  
  const lastSentenceEnd = Math.max(lastPeriod, lastExclamation, lastQuestion);
  
  // Si on trouve une fin de phrase dans les 20 derniers mots, couper là
  if (lastSentenceEnd > truncated.length * 0.85) {
    truncated = truncated.substring(0, lastSentenceEnd + 1);
  } else {
    // Sinon ajouter "..." pour indiquer la troncature
    truncated += '...';
  }
  
  return truncated;
}

/**
 * Nettoie le HTML/Markdown généré par l'IA
 */
export function cleanAIText(text) {
  if (!text) return '';
  
  return text
    .trim()
    // Supprimer les balises markdown mal fermées
    .replace(/\*\*([^*]+)$/g, '$1')
    .replace(/\*([^*]+)$/g, '$1')
    // Supprimer les espaces multiples
    .replace(/\s+/g, ' ')
    // Supprimer les sauts de ligne excessifs
    .replace(/\n{3,}/g, '\n\n');
}

/**
 * Calcule les statistiques d'un ebook généré
 * Note : 190 mots/page correspond au rendu PDF réel avec marges
 */
export function getEbookStats(content) {
  const introWords = countWords(content.introduction);
  const chaptersWords = content.chapters.reduce((sum, ch) => sum + countWords(ch), 0);
  const conclusionWords = countWords(content.conclusion);
  const totalWords = introWords + chaptersWords + conclusionWords;
  const estimatedPages = Math.round(totalWords / 190); // ⚡ Changé de 250 à 190
  
  return {
    introWords,
    chaptersWords,
    conclusionWords,
    totalWords,
    estimatedPages,
  };
}