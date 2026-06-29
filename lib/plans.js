// lib/plans.js
// ──────────────────────────────────────────────────────────────────────────
// MODÈLE DE MONÉTISATION BOOKZY (figé 2026-06-29)
//
// Principe : on vend des EBOOKS qui N'EXPIRENT JAMAIS (pas d'abonnement,
// pas de "crédits" affichés). Le moteur interne reste les crédits
// (1 ebook = 20 crédits) — mais l'utilisateur ne voit QUE des "ebooks".
//
// - Free      : aperçu d'ebook + quota gratuit Niche Hunter & Validateur.
// - Découverte: 4 500 (1er 3 000) → +1 ebook. Aucun outil (hors quota free).
// - Créateur  : 7 500 → +5 ebooks  + TOUS les outils (tant qu'il reste des ebooks).
// - Pro       : 12 500 → +15 ebooks + TOUS les outils (tant qu'il reste des ebooks).
//
// Règle outils : débloqués tant que l'utilisateur a un solde issu d'un achat
// Créateur/Pro (user.toolsTier ∈ {createur, pro} ET solde > 0). Quand le solde
// tombe à 0 → outils reverrouillés (le webbook doit remettre toolsTier à null).
// Un achat Découverte NE débloque PAS les outils.
// ──────────────────────────────────────────────────────────────────────────

export const CREDITS_PER_EBOOK = 20;

// Offres achetables (paiement unique, sans expiration)
export const OFFERS = {
  decouverte: {
    id: "decouverte",
    label: "Découverte",
    tagline: "Pour créer tes premiers ebooks",
    priceFcfa: 4500,
    welcomePriceFcfa: 3000, // 1er achat uniquement
    ebooks: 2,
    unlocksTools: false,
  },
  createur: {
    id: "createur",
    label: "Créateur",
    tagline: "5 ebooks + tous les outils",
    priceFcfa: 7500,
    ebooks: 5,
    unlocksTools: true,
    recommended: true,
  },
  pro: {
    id: "pro",
    label: "Pro",
    tagline: "15 ebooks + tous les outils",
    priceFcfa: 12500,
    ebooks: 15,
    unlocksTools: true,
  },
};

export const OFFER_ORDER = ["decouverte", "createur", "pro"];

// Quota GRATUIT (tier free) — par semaine, pour tout le monde
export const FREE_WEEKLY = {
  nicheHunter: 2,
  validateur: 2,
};

// Outils réservés aux acheteurs Créateur/Pro (débloqués si toolsTier actif)
export const PREMIUM_TOOLS = ["radar", "youbook", "designer", "romans", "nicheHunter", "validateur"];

// ── Helpers ────────────────────────────────────────────────────────────────

/** Crédits offerts par une offre. */
export function offerCredits(id) {
  return (OFFERS[id]?.ebooks || 0) * CREDITS_PER_EBOOK;
}

/** Nombre d'ebooks restants depuis un solde de crédits. */
export function ebooksFromCredits(balance) {
  return Math.floor((balance || 0) / CREDITS_PER_EBOOK);
}

/** Prix par ebook d'une offre (argument d'upsell). */
export function pricePerEbook(id) {
  const o = OFFERS[id];
  return o && o.ebooks ? Math.round(o.priceFcfa / o.ebooks) : null;
}

/** Les outils premium sont-ils débloqués pour cet utilisateur ?
 *  → statut Créateur/Pro actif ET solde d'ebooks > 0. */
export function toolsUnlocked(user) {
  const tier = user?.toolsTier; // "createur" | "pro" | null
  return (tier === "createur" || tier === "pro") && (user?.credits?.balance || 0) > 0;
}

/** Prix d'une offre pour un user (applique le prix de bienvenue si éligible). */
export function offerPrice(id, { isFirstPurchase = false } = {}) {
  const o = OFFERS[id];
  if (!o) return null;
  return isFirstPurchase && o.welcomePriceFcfa ? o.welcomePriceFcfa : o.priceFcfa;
}
