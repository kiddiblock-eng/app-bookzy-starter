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
// Créateur/Pro (user.toolsTier ∈ {createur, pro} ET solde >= 10 crédits). Quand le
// solde tombe à 0 → outils reverrouillés (le webhook remet toolsTier à null).
// Un achat Découverte NE débloque PAS les outils.
// ──────────────────────────────────────────────────────────────────────────

export const CREDITS_PER_EBOOK = 20;

// Seuil minimum de crédits pour accéder aux outils premium.
// Évite qu'un compte quasi vide (ex. 5 crédits) utilise les outils indéfiniment.
export const TOOLS_MIN_CREDITS = 10;

// Offres achetables (paiement unique, sans expiration)
export const OFFERS = {
  essai: {
    id: "essai",
    label: "Essai",
    tagline: "Génère ton premier ebook, sans abonnement",
    priceFcfa: 1000,
    ebooks: 1,
    unlocksTools: false, // pas le tier premium ; accès outils "essai" (free +1) géré via user.trialTier
    trial: true,
    maxPages: 30,
    maxChapters: 3,
  },
  decouverte: {
    id: "decouverte",
    label: "Découverte",
    tagline: "Un kit complet pour te lancer, prêt à vendre",
    priceFcfa: 2500,
    ebooks: 1,
    unlocksTools: false,
  },
  createur: {
    id: "createur",
    label: "Créateur",
    tagline: "Crée une vraie collection, images haute résolution et tous les outils débloqués",
    priceFcfa: 7500,           // prix de base (5 ebooks)
    ebooks: 5,                 // quantité de base
    pricePerEbook: 1500,       // curseur : 5 ou 10 ebooks
    ebookOptions: [5, 10],
    unlocksTools: true,
    recommended: true,
  },
  pro: {
    id: "pro",
    label: "Business",
    tagline: "Le pack volume : 15 ebooks au meilleur prix, images haute résolution et tous les outils",
    priceFcfa: 16500,
    ebooks: 15,
    unlocksTools: true,
  },
};

export const OFFER_ORDER = ["decouverte", "createur", "pro"];

/** Prix Créateur pour une quantité d'ebooks choisie (curseur 5 ou 10). */
export function createurPrice(qty) {
  const o = OFFERS.createur;
  const n = o.ebookOptions.includes(Number(qty)) ? Number(qty) : o.ebooks;
  return n * o.pricePerEbook;
}

// Offres qui débloquent les outils premium (le "vrai" abonnement)
export const SUBSCRIPTION_OFFERS = ["createur", "pro"];

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

/** % d'économie d'une offre vs le prix à l'unité (Découverte). 0 pour Découverte. */
export function discountPercent(id) {
  const ref = pricePerEbook("decouverte");
  const p = pricePerEbook(id);
  if (!ref || !p || p >= ref) return 0;
  return Math.round((1 - p / ref) * 100);
}

/** Les outils premium sont-ils débloqués pour cet utilisateur ?
 *  → statut Créateur/Pro actif ET solde >= TOOLS_MIN_CREDITS (10). */
export function toolsUnlocked(user) {
  const tier = user?.toolsTier; // "createur" | "pro" | null
  return (tier === "createur" || tier === "pro") && (user?.credits?.balance || 0) >= TOOLS_MIN_CREDITS;
}

/** Prix d'une offre pour un user (applique le prix de bienvenue si éligible). */
export function offerPrice(id, { isFirstPurchase = false } = {}) {
  const o = OFFERS[id];
  if (!o) return null;
  return isFirstPurchase && o.welcomePriceFcfa ? o.welcomePriceFcfa : o.priceFcfa;
}
