// lib/prompts/ebookPrompts.js
// 🎯 VERSION CORRIGÉE : LIMITES STRICTES DE MOTS
// ✅ Prompts qui génèrent du HTML pur SANS couleurs inline
// ✅ Limites de longueur NON-NÉGOCIABLES

export const EBOOK_SYSTEM_PROMPT = `Tu es un expert africain en rédaction d'ebooks professionnels en français en prenant compte des réalités de l'afrique francophone  .

🚨 RÈGLE ABSOLUE DE FORMATAGE :
Tu dois générer UNIQUEMENT du HTML pur. JAMAIS de markdown. JAMAIS de styles inline.

INTERDICTIONS STRICTES :
❌ PAS de ## ou # pour les titres
❌ PAS de ** ou * pour le gras/italique
❌ PAS de - ou * pour les listes
❌ PAS de > pour les citations
❌ PAS de | pour les tableaux markdown
❌ PAS de \`\`\` pour le code
❌ JAMAIS de style="..." (AUCUN style inline)
❌ JAMAIS de couleurs inline (color, background, font-size, etc.)
❌ JAMAIS d'attributs CSS dans le HTML

🚨 CRITIQUE : Le CSS est géré par le système. Tu génères UNIQUEMENT le HTML sans aucun style.

✅ UTILISE UNIQUEMENT :
<h2>Titre de section</h2>
<h3>Sous-titre</h3>
<p>Paragraphe normal</p>
<ul><li>Item de liste</li></ul>
<table>...</table>
<div class="tip-box">💡 <strong>Astuce :</strong> ...</div>

STYLE D'ÉCRITURE :
• Phrases claires et directes
• Exemples CONCRETS avec chiffres réels
• Étapes numérotées précises
• Ton professionnel mais accessible
• PAS de blabla générique

FORMAT EXACT DES TABLEAUX HTML :
<table>
<thead>
<tr>
<th>Colonne 1</th>
<th>Colonne 2</th>
<th>Colonne 3</th>
</tr>
</thead>
<tbody>
<tr>
<td>Donnée 1</td>
<td>Donnée 2</td>
<td>Donnée 3</td>
</tr>
<tr>
<td>Donnée A</td>
<td>Donnée B</td>
<td>Donnée C</td>
</tr>
</tbody>
</table>

FORMAT DES ENCADRÉS :
<div class="tip-box">
<p><strong>💡 Astuce :</strong> Contenu de l'astuce...</p>
</div>

<div class="warning-box">
<p><strong>⚠️ Attention :</strong> Avertissement important...</p>
</div>

<div class="conseil-box">
<p><strong>📌 Conseil :</strong> Recommandation pratique...</p>
</div>

FORMAT DES CITATIONS :
<div class="quote">
<p>« Votre citation inspirante entre guillemets français. »</p>
</div>

FORMAT DES ÉTAPES :
<div class="step-box">
<span class="step-title">🟢 Étape 1 : Titre de l'étape</span>
<p>Description détaillée de ce qu'il faut faire...</p>
</div>

EMOJIS :
• Utilise 1 emoji MAXIMUM par titre de section
• Utilise des emojis dans les encadrés (💡 ⚠️ 📌 ✅ ❌)
• JAMAIS d'emojis dans les paragraphes normaux

QUAND UTILISER DES TABLEAUX :
• Comparaisons (outils, prix, fonctionnalités)
• Étapes chronologiques avec détails
• Statistiques et données chiffrées
• Avant/Après
• Listes avec plusieurs attributs`;

export function getSummaryPrompt({ title, totalChapters, description }) {
  return `Génère un sommaire détaillé pour l'ebook "${title}".

CONTEXTE DU SUJET :
${description}

INSTRUCTIONS :
1. Crée exactement ${totalChapters} chapitres
2. Chaque chapitre doit couvrir une partie ESSENTIELLE du sujet
3. Les titres doivent être PRÉCIS et indiquer clairement le contenu
4. Progression logique de A à Z
5. Chaque chapitre doit être actionnable

FORMAT EXACT :
Chapitre 1 : [Titre précis du chapitre 1]
Chapitre 2 : [Titre précis du chapitre 2]
...
Chapitre ${totalChapters} : [Titre précis du chapitre ${totalChapters}]

EXEMPLE DE BON TITRE :
✅ "Chapitre 3 : Créer votre compte Google Ads et configurer le suivi"
❌ "Chapitre 3 : Les fondamentaux" (trop vague)

IMPORTANT : Les titres doivent refléter des ACTIONS ou CONCEPTS précis du sujet "${title}".`;
}

export function getIntroPrompt({ title, description, tone, audience }) {
  return `Rédige l'introduction de l'ebook "${title}" en HTML pur SANS styles inline.

CONTEXTE :
${description}

Ton : ${tone}
Public : ${audience}

🚨 LIMITE STRICTE DE LONGUEUR 🚨
MAXIMUM ABSOLU : 400-500 mots
SI TU DÉPASSES 550 mots, LE CONTENU SERA TRONQUÉ
Sois CONCIS. Chaque phrase doit avoir un but.

STRUCTURE DE L'INTRODUCTION :

1. ACCROCHE (2-3 paragraphes)
<p>Commence par un fait surprenant, une question puissante ou un problème réel lié au sujet exact.</p>

2. PROMESSE CLAIRE (2-3 paragraphes)
<p>Explique PRÉCISÉMENT ce que le lecteur va apprendre...</p>

3. BÉNÉFICES CONCRETS (5-7 points)
<h3>Ce que vous allez apprendre</h3>
<ul>
<li>Bénéfice spécifique et mesurable</li>
<li>Bénéfice spécifique et mesurable</li>
</ul>

4. MOTIVATION FINALE (1 paragraphe)
<div class="quote">
<p>« Phrase courte et motivante pour commencer. »</p>
</div>

RÈGLES STRICTES :
• Reste 100% focus sur "${title}"
• UNIQUEMENT du HTML pur (pas de markdown)
• PAS de ##, **, -, etc.
• JAMAIS de style="..." ou attributs CSS
• Écris en HTML pur avec <p>, <ul>, <li>, etc.
• Les bénéfices doivent être MESURABLES ou VÉRIFIABLES
• MAXIMUM 500 mots - Compte pendant que tu écris

Génère UNIQUEMENT le code HTML, sans balises <html> ou <body>, et SANS AUCUN STYLE INLINE.`;
}

export function getChapterPrompt({ 
  chapterNumber, 
  chapterTitle, 
  title, 
  description, 
  summary,
  totalChapters,
  wordsTarget 
}) {
  const minWords = Math.floor(wordsTarget * 0.9);
  const maxWords = Math.floor(wordsTarget * 1.1);
  
  return `Rédige UNIQUEMENT le CHAPITRE ${chapterNumber} : "${chapterTitle}" pour l'ebook "${title}" en HTML pur SANS styles inline.

CONTEXTE GLOBAL :
${description}

SOMMAIRE COMPLET :
${summary}

🚨🚨🚨 LIMITE STRICTE DE LONGUEUR 🚨🚨🚨
MINIMUM : ${minWords} mots
CIBLE EXACTE : ${wordsTarget} mots
MAXIMUM ABSOLU : ${maxWords} mots

⚠️ SI TU DÉPASSES ${maxWords} mots, LE CONTENU SERA AUTOMATIQUEMENT TRONQUÉ ET REJETÉ.
⚠️ SI TU ES EN DESSOUS DE ${minWords} mots, LE CHAPITRE SERA CONSIDÉRÉ INCOMPLET.

COMPTE TES MOTS PENDANT QUE TU ÉCRIS. Cette limite est NON-NÉGOCIABLE.
Privilégie la QUALITÉ sur la quantité. Sois CONCIS, DIRECT, et ACTIONNABLE.

STRUCTURE DU CHAPITRE EN HTML :

1. Introduction du chapitre (2-3 paragraphes courts)
<p>Explique ce que le lecteur va apprendre dans ce chapitre spécifique...</p>

2. Contenu principal (adapté au sujet)

Pour un processus/tutoriel :
<h3>🔧 Étape par étape</h3>
<div class="step-box">
<span class="step-title">🟢 Étape 1 : Titre précis</span>
<p>Description TRÈS détaillée avec captures d'écran décrites...</p>
</div>

Pour du contenu conceptuel :
<h3>Premier sous-sujet important</h3>
<p>Explication approfondie avec exemples concrets...</p>

3. TABLEAUX (si comparaisons, prix, données) :
<h3>📊 Comparaison des options</h3>
<table>
<thead>
<tr>
<th>Critère</th>
<th>Option A</th>
<th>Option B</th>
</tr>
</thead>
<tbody>
<tr>
<td>Prix</td>
<td>Valeur A</td>
<td>Valeur B</td>
</tr>
</tbody>
</table>

4. ENCADRÉS ASTUCES/CONSEILS (1-2 maximum) :
<div class="tip-box">
<p><strong>💡 Astuce :</strong> Conseil pratique et actionnable...</p>
</div>

<div class="warning-box">
<p><strong>⚠️ Erreur à éviter :</strong> Décrivez une erreur courante...</p>
</div>

5. POINTS CLÉS À RETENIR (3-5 points maximum) :
<h3>✅ Points clés du chapitre</h3>
<ul>
<li>Point actionnable spécifique 1</li>
<li>Point actionnable spécifique 2</li>
<li>Point actionnable spécifique 3</li>
</ul>

6. ACTION IMMÉDIATE :
<div class="conseil-box">
<p><strong>📌 Action immédiate :</strong> Donnez UNE action concrète que le lecteur peut faire maintenant.</p>
</div>

RÈGLES ABSOLUES :
• UNIQUEMENT du HTML pur (pas de markdown)
• Reste 100% FOCUS sur "${chapterTitle}"
• PAS de ##, **, -, |, etc.
• JAMAIS de style="..." ou attributs CSS inline
• Exemples RÉELS avec noms, chiffres, dates
• Si technique : décris chaque clic précisément
• Si business : donne des chiffres, stratégies concrètes
• Utilise des tableaux HTML pour les comparaisons
• 1 emoji max par titre de section
• RESPECTE LA LIMITE DE ${wordsTarget} mots (±10%)

EXEMPLES DE BON CONTENU :

✅ DESCRIPTION PRÉCISE :
<p>Dans le tableau de bord, cliquez sur "Paramètres" dans le menu de gauche. Puis sélectionnez "Compte" dans le sous-menu. Vous verrez un bouton orange "Vérifier mon compte" en haut à droite.</p>

❌ DESCRIPTION VAGUE :
<p>Allez dans les paramètres et vérifiez votre compte.</p>

🚨 RAPPEL FINAL : ${wordsTarget} mots MAXIMUM (±10%). Ne génère JAMAIS de style inline.

Génère UNIQUEMENT le contenu HTML du chapitre, sans balises <html> ou <body>, et SANS STYLES INLINE.`;
}

export function getConclusionPrompt({ title, description, summary }) {
  return `Rédige la conclusion de l'ebook "${title}" en HTML pur SANS styles inline.

CONTEXTE :
${description}

CHAPITRES COUVERTS :
${summary}

🚨 LIMITE STRICTE DE LONGUEUR 🚨
MAXIMUM ABSOLU : 350-450 mots
SI TU DÉPASSES 500 mots, LE CONTENU SERA TRONQUÉ
Sois CONCIS et IMPACTANT.

STRUCTURE DE LA CONCLUSION :

1. RÉCAPITULATIF (2-3 paragraphes)
<p>Résume le parcours complet en rappelant les points clés...</p>

2. POINTS CLÉS FINAUX (5 points maximum)
<h3>🎯 Les leçons essentielles</h3>
<ul>
<li>Leçon concrète 1 avec référence à un chapitre</li>
<li>Leçon concrète 2</li>
<li>Leçon concrète 3</li>
<li>Leçon concrète 4</li>
<li>Leçon concrète 5</li>
</ul>

3. PLAN D'ACTION 30 JOURS (si pertinent)
<h3>📅 Votre plan d'action des 30 prochains jours</h3>
<table>
<thead>
<tr>
<th>Semaine</th>
<th>Actions à réaliser</th>
</tr>
</thead>
<tbody>
<tr>
<td>Semaine 1</td>
<td>Actions spécifiques...</td>
</tr>
<tr>
<td>Semaine 2</td>
<td>Actions spécifiques...</td>
</tr>
</tbody>
</table>

4. MESSAGE FINAL (court et puissant)
<p>Rappel de la promesse tenue...</p>
<p>Encouragement concret et réaliste...</p>

<div class="quote">
<p>« Citation inspirante finale qui résume l'esprit de l'ebook. »</p>
</div>

RÈGLES STRICTES :
• UNIQUEMENT du HTML pur (pas de markdown)
• JAMAIS de style="..." ou attributs CSS
• Références spécifiques aux chapitres
• Message motivant mais réaliste
• MAXIMUM 450 mots - Compte pendant que tu écris

Génère UNIQUEMENT le code HTML, sans balises <html> ou <body>, et SANS STYLES INLINE.`;
}

export default {
  EBOOK_SYSTEM_PROMPT,
  getSummaryPrompt,
  getIntroPrompt,
  getChapterPrompt,
  getConclusionPrompt
};