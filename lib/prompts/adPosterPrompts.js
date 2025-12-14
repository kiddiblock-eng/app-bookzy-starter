// lib/prompts/adPosterPrompts.js

export function getTwoPostersPrompt({ title, description }) {
  const randomSeed = Math.floor(Math.random() * 99999999);

  return `
Génère DEUX affiches publicitaires totalement différentes pour promouvoir un eBook intitulé "${title}".
Ces affiches doivent être destinées à de la publicité professionnelle (TikTok Ads, Meta Ads, Instagram Ads).

IMPORTANT — VARIATION GARANTIE :
• Les deux affiches doivent avoir un style visuel radicalement différent.
• Interdit de réutiliser la même composition, pose, couleurs, ambiance ou arrière-plan.
• Tu dois générer deux univers graphiques uniques.
• Utilise une créativité élevée (évite les modèles répétitifs).
• Utilise le SEED aléatoire suivant : ${randomSeed}

CONTRAINTES ABSOLUES :
• Aucun texte dans l’image (surface propre pour overlay)
• Aucune personne identifiable ou célébrité
• Interdit d'écrire des chiffres, prix, mots, logos
• Style haut-de-gamme, qualité publicité professionnelle

---

POSTER_1 — STYLE DYNAMIQUE, JEUNE, TIKTOK :
• Couleurs : rose TikTok, turquoise, violet néon
• Éclairage : cyber, dynamique, high contrast
• Personnage africain utilisant smartphone (mais angle différent de poster 2)
• Ambiance : motivante, énergique, technologique
• Composition : moderne, diagonale, mouvement
• Arrière-plan : formes abstraites, flou artistique, particules lumineuses
• Style : inspiré reels TikTok / virality / growth

---

POSTER_2 — STYLE PREMIUM, BUSINESS, ÉLÉGANT :
• Couleurs : bleu nuit, argent, violet royal
• Éclairage : studio professionnel, luxe, propre
• Scène : smartphone sur table, mains, ou silhouette floue (pas même pose que poster 1)
• Ambiance : réussite, crédibilité, finance, high-end
• Composition : minimaliste, centrée, équilibrée
• Arrière-plan : dégradé propre + lueurs premium
• Style : professionnel, corporate moderne

---

INSTRUCTIONS TECHNIQUES :
• Format vertical 9:16
• Haute résolution
• Style photographie publicitaire premium
• Profondeur, lumière, contraste maîtrisés
• Rendu réaliste ou hyper-réaliste

---

RETOUR ATTENDU :
POSTER_1:
[prompt détaillé uniquement pour le poster 1]

POSTER_2:
[prompt détaillé uniquement pour le poster 2]

Tu dois respecter totalement les deux identités visuelles différentes.
`;
}