// lib/plans.js
// ──────────────────────────────────────────────────────────────────────────
// SOURCE UNIQUE DE VÉRITÉ du modèle de monétisation Bookzy (figé le 2026-06-28).
//
// Modèle :
//   - free      : gratuit. Aperçu d'ebook seulement + petit goût des outils de
//                 recherche (quota HEBDO). Tout le reste verrouillé → on pousse
//                 vers l'achat/abonnement.
//   - unit      : ACHAT À L'UNITÉ (one-shot, PAS un abonnement). 1 ebook.
//                 1er achat à prix de bienvenue. Retombe en free après.
//   - createur  : ABONNEMENT mensuel. 5 ebooks/mois + tous les types de création.
//   - pro       : ABONNEMENT mensuel. 15 ebooks/mois.
//
// Convention quota : un nombre = limite sur `toolQuota.period` ("week" | "day"),
//                    null = illimité, 0 = verrouillé.
//
// NB : fichier additif. Le câblage des écrans/paywalls vers cette config se fait
//      ensuite, étape par étape (ne remplace pas encore models/User.js).
// ──────────────────────────────────────────────────────────────────────────

export const PLAN_ORDER = ["free", "unit", "createur", "pro"];

export const CREATION_TYPES = ["ebook", "youbook", "designer", "roman"];

export const PLANS = {
  free: {
    id: "free",
    label: "Free",
    kind: "gratuit",
    recurring: false,
    priceFcfa: 0,
    ebooksPerMonth: 0,            // aperçu seulement, aucune création complète
    creationTypes: [],
    toolQuota: {
      period: "week",
      validateur: 1,
      radar: 0,                  // verrouillé en free
      nicheHunter: 1,
      youtubeAnalyse: 1,
    },
    fallbackOnExpire: null,       // c'est déjà l'état plancher
  },

  unit: {
    id: "unit",
    label: "À l'unité",
    kind: "one-shot",
    recurring: false,
    priceFcfa: 3000,
    welcomePriceFcfa: 2000,       // 1er achat (offre de bienvenue)
    ebooks: 1,                    // achat ponctuel = 1 ebook
    creationTypes: ["ebook"],
    toolQuota: {
      period: "week",
      validateur: 2,
      radar: 2,
      nicheHunter: 0,
      youtubeAnalyse: 0,
    },
    fallbackOnExpire: "free",
  },

  createur: {
    id: "createur",
    label: "Créateur",
    kind: "abonnement",
    recurring: true,
    priceFcfa: 7500,
    periodDays: 30,
    resetMonthly: true,           // use-it-or-lose-it (pas de report)
    ebooksPerMonth: 5,
    creationTypes: ["ebook", "youbook", "designer", "roman"],
    toolQuota: {
      period: "day",
      validateur: 3,
      radar: null,               // illimité
      nicheHunter: 3,
      youtubeAnalyse: null,
    },
    support: "prioritaire",
    fallbackOnExpire: "free",
  },

  pro: {
    id: "pro",
    label: "Pro",
    kind: "abonnement",
    recurring: true,
    priceFcfa: 12500,
    periodDays: 30,
    resetMonthly: true,
    ebooksPerMonth: 15,
    creationTypes: ["ebook", "youbook", "designer", "roman"],
    toolQuota: {
      period: "day",
      validateur: 10,
      radar: null,
      nicheHunter: 8,
      youtubeAnalyse: null,
    },
    support: "whatsapp",
    fallbackOnExpire: "free",
  },
};

// Outils de recherche limités par quota (mappés sur les compteurs d'usage).
export const RESEARCH_TOOLS = ["validateur", "radar", "nicheHunter", "youtubeAnalyse"];

// Prix de référence à l'unité (sert au copy d'upsell vers l'abonnement).
export const UNIT_PRICE_FCFA = PLANS.unit.priceFcfa; // 3000

/** Prix par ebook d'un plan (pour l'argument d'upsell). null si non applicable. */
export function pricePerEbook(planId) {
  const p = PLANS[planId];
  if (!p) return null;
  if (p.ebooksPerMonth) return Math.round(p.priceFcfa / p.ebooksPerMonth);
  if (p.ebooks) return Math.round(p.priceFcfa / p.ebooks);
  return null;
}

/** Un plan autorise-t-il ce type de création ? */
export function canCreate(planId, type) {
  return !!PLANS[planId]?.creationTypes?.includes(type);
}

/** Quota d'un outil de recherche pour un plan (number | null=illimité | 0=verrouillé). */
export function toolQuota(planId, tool) {
  return PLANS[planId]?.toolQuota?.[tool] ?? 0;
}
