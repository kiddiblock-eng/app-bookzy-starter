// lib/promo.js
// ──────────────────────────────────────────────────────────────────────────
// Roue promo — premier achat, réservée aux comptes JAMAIS abonnés (Créateur/Pro).
// Le résultat (le %) est TOUJOURS décidé côté serveur (odds ci-dessous) ;
// la roue du client se contente d'animer jusqu'au segment gagnant.
// La remise s'applique uniquement sur les offres Créateur (7500) et Pro (12500).
// ──────────────────────────────────────────────────────────────────────────

export const PROMO_TTL_HOURS = 24;

// Offres sur lesquelles la remise s'applique
export const PROMO_ELIGIBLE_OFFERS = ["createur", "pro"];

// Segments visuels de la roue (l'ordre = l'affichage). value = % de remise.
export const WHEEL = [
  { percent: 10 },
  { percent: 5 },
  { percent: 15 },
  { percent: 10 },
  { percent: 5 },
  { percent: 10 },
  { percent: 15 },
  { percent: 10 },
];

// Probabilités RÉELLES (indépendantes du nombre de segments).
export const ODDS = [
  { percent: 5, weight: 0.5 },
  { percent: 10, weight: 0.45 },
  { percent: 15, weight: 0.05 },
];

/** Tire un % de remise selon les probabilités. */
export function pickPercent(rand = Math.random()) {
  let acc = 0;
  for (const o of ODDS) {
    acc += o.weight;
    if (rand < acc) return o.percent;
  }
  return ODDS[ODDS.length - 1].percent;
}

/** Choisit un index de segment correspondant au % gagné (pour l'animation). */
export function pickWheelIndex(percent, rand = Math.random()) {
  const idxs = WHEEL.reduce((a, s, i) => (s.percent === percent ? [...a, i] : a), []);
  if (!idxs.length) return 0;
  return idxs[Math.min(idxs.length - 1, Math.floor(rand * idxs.length))];
}

/** Génère un code promo lisible, ex. "BZ10-3F7K". */
export function generatePromoCode(percent) {
  const rnd = Math.random().toString(36).slice(2, 6).toUpperCase();
  return `BZ${percent}-${rnd}`;
}

/** Un code promo utilisateur est-il encore valable (non utilisé, non expiré) ? */
export function isPromoValid(promo) {
  if (!promo || !promo.code || promo.used) return false;
  if (!promo.expiresAt) return false;
  return new Date(promo.expiresAt).getTime() > Date.now();
}

/** Montant après remise (arrondi au FCFA). */
export function discountedAmount(amount, percent) {
  return Math.round(amount * (1 - percent / 100));
}
