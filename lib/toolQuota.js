// lib/toolQuota.js
// ──────────────────────────────────────────────────────────────────────────
// Quota des outils premium (Niche Hunter, Validateur, Youbook) — modèle par
// OFFRE (Créateur/Pro), PLUS de débit de crédits à l'usage.
//
//            | Free (par jour) | Créateur/Pro (par jour)
//  Niche H.  |       2         |        10
//  Validateur|       2         |        10
//  Youbook   |       2         |     illimité
//
// Statut Créateur/Pro = toolsUnlocked() (toolsTier ∈ {createur,pro} ET solde >= 10).
// Quota épuisé → on demande de prendre une offre (jamais de crédit débité).
// ──────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import { toolsUnlocked } from "@/lib/plans";

const LIMITS = {
  free:    { nicheHunter: 2,  nicheAnalysis: 2,  productAnalysis: 2,  youtubeAnalysis: 2 },
  trial:   { nicheHunter: 3,  nicheAnalysis: 3,  productAnalysis: 3,  youtubeAnalysis: 3 },   // essai 1000 FCFA = free +1
  premium: { nicheHunter: 10, nicheAnalysis: 10, productAnalysis: 10, youtubeAnalysis: Infinity },
};

// Résout le palier de quota d'un utilisateur : premium (Créateur/Pro) > essai > free.
function tierFor(userDoc) {
  if (toolsUnlocked(userDoc)) return "premium";
  if (userDoc?.trialTier) return "trial";
  return "free";
}

/**
 * Vérifie le quota d'un outil et le consomme (incrémente le compteur du jour).
 * Aucun crédit n'est débité.
 * @returns {{ error: NextResponse|null }} — si error, la renvoyer telle quelle.
 */
export async function consumeToolUsage(userDoc, action) {
  const tier = tierFor(userDoc);
  const premium = tier === "premium";
  const limit = LIMITS[tier][action] ?? 0;

  if (typeof userDoc.checkDailyReset === "function") userDoc.checkDailyReset();
  const used = userDoc.dailyUsage?.[action] || 0;

  if (limit !== Infinity && used >= limit) {
    return {
      error: NextResponse.json(
        {
          success: false,
          needsOffer: !premium,
          limitReached: premium,
          message: premium
            ? "Limite quotidienne atteinte (10/jour). Reviens demain 🙌"
            : `Tu as utilisé tes ${limit} essais du jour. Passe à Créateur ou Pro pour continuer.`,
          redirectTo: "/dashboard/tarifs",
        },
        { status: premium ? 429 : 403 }
      ),
    };
  }

  await userDoc.incrementDaily(action);
  return { error: null };
}

/** Vérifie SANS consommer si l'utilisateur peut encore utiliser l'outil aujourd'hui. */
export function hasToolUsage(userDoc, action) {
  const tier = tierFor(userDoc);
  const limit = LIMITS[tier][action] ?? 0;
  if (limit === Infinity) return true;
  if (typeof userDoc.checkDailyReset === "function") userDoc.checkDailyReset();
  const used = userDoc.dailyUsage?.[action] || 0;
  return used < limit;
}
