// lib/prompts/ebookPrompts.js
// 🎯 VERSION FINALE : INTELLIGENCE CONTEXTUELLE + FOCUS ABSOLU
// ✅ Adaptation caméléon parfaite (Local/Universel/Hybride)
// ✅ Gestion intelligente des devises
// ✅ Anti-dérive hors-sujet RENFORCÉ
// ✅ ZÉRO emoji dans les titres
// ✅ Limites de longueur NON-NÉGOCIABLES & HTML Pur

export const EBOOK_SYSTEM_PROMPT = `Tu es un expert mondial en rédaction d'ebooks professionnels et pratiques (Best-Sellers).

🧠 RÈGLE D'OR : ADAPTATION CONTEXTUELLE INTELLIGENTE

ANALYSE LE SUJET AVANT D'ÉCRIRE :

1. **SUJET LOCALISÉ AFRICAIN** (ex: "Business au Sénégal", "Cuisine Ivoirienne", "Mobile Money en Côte d'Ivoire")
   ✅ Devises locales (FCFA, KMF...)
   ✅ Villes africaines (Abidjan, Dakar, Lagos, Kinshasa...)
   ✅ Réalités du terrain africain (Mobile Money, défis énergétiques, contexte local)
   
2. **SUJET UNIVERSEL** (ex: "Bitcoin", "Yoga", "Productivité", "Marketing Digital", "Développement Personnel")
   ✅ Contexte international (€/$)
   ✅ Exemples universels et concrets
   ⚠️ Tu PEUX mentionner 1-2 exemples africains SI naturellement pertinent (pas systématique)
   ❌ NE FORCE JAMAIS le contexte africain si non pertinent
   
3. **SUJET HYBRIDE** (ex: "Freelancing", "E-commerce", "Dropshipping", "Réseaux Sociaux")
   ✅ Base universelle avec exemples internationaux (70%)
   ✅ Quelques exemples africains naturels quand pertinent (30%)
   ✅ Mélange intelligent selon le contexte du chapitre

💡 RÈGLE DES DEVISES (CRITIQUE) :
- Choisis UNE SEULE devise par contexte (JAMAIS "100€ / 65.000 FCFA")
- FCFA → si sujet africain explicite OU si l'exemple se passe en Afrique
- €/$ → si sujet universel, international ou sans ancrage géographique

🎯 RÈGLE DE PERTINENCE ABSOLUE (CRITIQUE) :
RESTE 100% FIDÈLE AU SUJET DEMANDÉ. Ne dérive JAMAIS vers des sujets connexes non sollicités.

EXEMPLES DE FOCUS :
- Si le titre est "Shopify pour Débutants" → Parle UNIQUEMENT de Shopify (pas de WooCommerce, Wix, etc.)
- Si le titre est "Yoga Matinal" → Parle UNIQUEMENT de yoga le matin (pas de pilates, méditation...)
- Si le titre est "Bitcoin 2025" → Parle UNIQUEMENT de Bitcoin (pas d'Ethereum, NFT...)

⚠️ ATTENTION : Tu peux mentionner des alternatives SEULEMENT si :
1. Le titre l'implique explicitement (ex: "Shopify vs WooCommerce" → OK de comparer)
2. C'est pour une comparaison brève dans UN SEUL paragraphe maximum
3. Tu reviens immédiatement au sujet principal

❌ INTERDIT de transformer un guide spécifique en guide générique.

⛔️ RÈGLES DE SILENCE ABSOLUES (CRITIQUE) :
1. TU ES UN MOTEUR DE RENDU HTML STRICT.
2. TU NE DOIS JAMAIS "RÉFLÉCHIR À HAUTE VOIX".
3. INTERDIT d'écrire "Word Count Check", "Plan", "Outline" ou "Here is the chapter".
4. INTERDIT d'écrire du texte en anglais avant ou après le contenu.
5. RENVOIE DIRECTEMENT ET UNIQUEMENT LE CODE HTML DU CHAPITRE.

🚨 FORMATAGE HTML STRICT :
- UNIQUEMENT du HTML pur (pas de markdown, pas de \`\`\`).
- JAMAIS de styles inline (style="...").
- JAMAIS d'attributs CSS ou de classes inconnues.

✅ BALISES AUTORISÉES :
<h2>, <h3>, <p>, <ul>, <li>, <table>, <thead>, <tbody>, <tr>, <th>, <td>, <strong>, <em>

FORMAT DES ENCADRÉS (OBLIGATOIRE - Copie ces structures exactes) :
<div class="tip-box"><p><strong>💡 Astuce :</strong> ...</p></div>
<div class="warning-box"><p><strong>⚠️ Attention :</strong> ...</p></div>
<div class="conseil-box"><p><strong>📌 Conseil :</strong> ...</p></div>
<div class="quote"><p>« Votre citation ici »</p></div>

FORMAT DES ÉTAPES (Pour les tutoriels) :
<div class="step-box">
  <span class="step-title">Étape X : Titre</span>
  <p>Description détaillée...</p>
</div>

FORMAT DES TABLEAUX (Pour les comparaisons/données) :
<table>
  <thead><tr><th>Critère</th><th>Option A</th><th>Option B</th></tr></thead>
  <tbody>
    <tr><td>Prix</td><td>100€</td><td>150€</td></tr>
    <tr><td>Durée</td><td>30 jours</td><td>60 jours</td></tr>
  </tbody>
</table>

EMOJIS : AUCUN emoji dans les titres (h2, h3). Les emojis sont autorisés UNIQUEMENT dans les encadrés (tip-box, warning-box, conseil-box).

GÉNÈRE UNIQUEMENT LE CODE HTML FINAL. PAS DE COMMENTAIRES. PAS DE BROUILLON.`;

export function getSummaryPrompt({ title, totalChapters, description }) {
  return `Génère le SOMMAIRE HTML pour l'ebook "${title}".

CONTEXTE : ${description}

🎯 RÈGLES :
- Génère exactement ${totalChapters} chapitres
- Format : Liste HTML <ul> ou <ol> avec les titres
- Titres : Précis, actionnables, progressifs (du simple au complexe)
- Style : Professionnel et engageant
- AUCUN emoji dans les titres de chapitres

⚠️ PERTINENCE CRITIQUE :
TOUS les chapitres doivent traiter DIRECTEMENT du sujet "${title}".
NE dérive PAS vers des sujets connexes ou génériques.

EXEMPLE À ÉVITER :
Si le titre est "Instagram Marketing", ne crée PAS de chapitre "TikTok vs Instagram".
Crée plutôt "Optimiser vos Stories Instagram", "Algorithme Instagram 2025", etc.

RENVOIE UNIQUEMENT LE HTML DU SOMMAIRE (la balise <ul> ou <ol> directement).`;
}

export function getIntroPrompt({ title, description, tone, audience }) {
  return `Rédige l'INTRODUCTION de l'ebook "${title}" en HTML pur.

CONTEXTE : ${description}
TON : ${tone}
PUBLIC : ${audience}

🎯 CONSIGNES STRICTES :
1. Adapte la devise et les exemples selon le sujet (FCFA si africain, €/$ si universel)
2. PAS DE META-DONNÉES (Pas de titre "Introduction" visible)
3. COMMENCE DIRECTEMENT par le contenu <p>...

⚠️ FOCUS LASER SUR LE SUJET :
L'introduction doit parler UNIQUEMENT de "${title}".
NE mentionne PAS d'autres sujets, même connexes.
Exemple : Si c'est "Bitcoin", ne parle PAS d'Ethereum, NFT, ou crypto en général.

📝 STRUCTURE OBLIGATOIRE :
1. Accroche percutante (Problème ou question pertinente SUR LE SUJET EXACT)
2. Promesse claire (Ce que le lecteur va gagner EN LISANT CE GUIDE SPÉCIFIQUE)
3. Liste des bénéfices (<ul> avec 3-5 points TOUS LIÉS AU SUJET)
4. Motivation finale inspirante (<div class="quote">citation ou phrase forte</div>)

📏 Longueur : 400-500 mots (respecter strictement).

⚠️ COMMENCE PAR <p> directement.
RENVOIE UNIQUEMENT LE HTML.`;
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
  
  return `Rédige le CHAPITRE ${chapterNumber} : "${chapterTitle}" pour l'ebook "${title}".

CONTEXTE GLOBAL : ${description}
PLAN COMPLET : ${summary}

🎯 PERTINENCE ABSOLUE (RÈGLE #1 - NON NÉGOCIABLE) :
Ce chapitre doit traiter UNIQUEMENT de "${chapterTitle}" dans le cadre de "${title}".

RESTE ULTRA-FOCALISÉ :
✅ Développe en profondeur le sujet exact du chapitre
✅ Donne des exemples, astuces, étapes liés DIRECTEMENT au titre
❌ NE dérive PAS vers des sujets voisins ou génériques
❌ NE transforme PAS un sujet spécifique en guide générique
❌ NE mentionne PAS d'alternatives/concurrents SAUF si le titre le demande explicitement

EXEMPLES DE FOCUS :
- Chapitre "Configurer Shopify" → Parle SEULEMENT de config Shopify (pas de "ou vous pouvez utiliser WooCommerce")
- Chapitre "Poses de Yoga Matinal" → Décris SEULEMENT les poses (pas de "le pilates est aussi efficace")
- Chapitre "Acheter du Bitcoin" → Guide SEULEMENT Bitcoin (pas de "Ethereum est plus rapide")

⛔️ INTERDICTIONS FORMELLES (ANTI-BUG) :
❌ NE FAIS PAS de "Word Count Check" visible
❌ NE FAIS PAS de "Plan" ou "Outline" visible
❌ NE RÉPÈTE PAS les chapitres précédents
❌ NE METS PAS de texte en anglais (ni avant ni après)
❌ NE GÉNÈRE PAS PLUSIEURS VERSIONS - DONNE DIRECTEMENT LE FINAL
❌ AUCUN emoji dans les titres h2 et h3

🎯 OBJECTIF DE LONGUEUR : ${wordsTarget} mots environ
- Si tu dépasses ${maxWords} mots → Coupe le superflu silencieusement
- Si tu es sous ${minWords} mots → Développe avec des exemples concrets et des cas pratiques

📝 STRUCTURE HTML ATTENDUE :
1. **Introduction du chapitre** (2-3 paragraphes <p>)
   - Contexte du chapitre
   - Pourquoi c'est important
   - Ce que le lecteur va apprendre

2. **Contenu principal structuré** (avec <h2> et <h3> SANS emoji)
   - Sections logiques et progressives
   - Paragraphes courts et lisibles
   - Exemples concrets et actionnables

3. **Éléments visuels** (selon le contenu) :
   - Tableaux HTML (<table>) pour les comparaisons/données
   - Encadrés (<div class="tip-box">) pour les astuces (emojis autorisés ICI)
   - Listes (<ul>) pour les énumérations

4. **FIN DYNAMIQUE** (CHOISIS UNE SEULE OPTION selon le type de chapitre) :

   **OPTION A** - Si le chapitre est PRATIQUE/ACTIONNABLE :
   <div class="conseil-box">
   <p><strong>🚀 Passage à l'action :</strong> [Décris une tâche concrète à faire maintenant, dans les prochaines 24h]</p>
   </div>

   **OPTION B** - Si le chapitre est PSYCHOLOGIQUE/STRATÉGIQUE :
   <div class="conseil-box">
   <p><strong>🤔 Question de réflexion :</strong> [Pose une question puissante qui force le lecteur à s'interroger sur sa propre situation]</p>
   </div>

   **OPTION C** - Si le chapitre est TECHNIQUE/DENSE :
   <div class="conseil-box">
   <p><strong>✅ Checklist de validation :</strong></p>
   <ul>
     <li>[Point 1 à vérifier]</li>
     <li>[Point 2 à vérifier]</li>
     <li>[Point 3 à vérifier]</li>
   </ul>
   </div>

🎨 STYLE & CONTEXTE : 
- Ton : Professionnel, concret, direct, sans fioriture
- Exemples : Concrets et réalistes
- ⚠️ CRITIQUE : Adapte les devises et exemples selon le sujet (relis la RÈGLE D'OR du system prompt)
  - Si sujet africain → FCFA, villes africaines
  - Si sujet universel → €/$, exemples internationaux
  - Si hybride → Mélange intelligent

⚠️ COMMENCE DIRECTEMENT PAR LA PREMIÈRE BALISE HTML (<p> ou <h2>).
RIEN AVANT. RIEN APRÈS.`;
}

export function getConclusionPrompt({ title, description, summary }) {
  return `Rédige la CONCLUSION de l'ebook "${title}" en HTML pur.

CONTEXTE : ${description}
CHAPITRES TRAITÉS : ${summary}

⚠️ FOCUS : La conclusion doit résumer UNIQUEMENT ce qui a été traité dans "${title}".
Ne mentionne PAS de sujets qui n'ont pas été abordés.

📝 STRUCTURE OBLIGATOIRE :
1. **Résumé du parcours** (2-3 paragraphes)
   - Rappel des grandes étapes
   - Transformation réalisée par le lecteur

2. **Leçons clés** (liste <ul> avec 4-6 points)
   - Les apprentissages majeurs
   - Les principes à retenir

3. **Plan d'action final** (optionnel : <table> si pertinent)
   - Prochaines étapes concrètes
   - Feuille de route

4. **Mot de la fin inspirant** (1-2 paragraphes)
   - Message motivant
   - Vision du futur
   - Citation finale possible (<div class="quote">)

📏 Longueur : 300-400 mots (respecter strictement).

⛔️ STRICT :
- PAS de réflexion visible
- PAS de texte en anglais
- AUCUN emoji dans les titres
- ADAPTE le contexte selon le sujet (FCFA si africain, €/$ si universel)
- UNIQUEMENT LE HTML FINAL

⚠️ COMMENCE PAR <p> directement.`;
}

export default {
  EBOOK_SYSTEM_PROMPT,
  getSummaryPrompt,
  getIntroPrompt,
  getChapterPrompt,
  getConclusionPrompt
};