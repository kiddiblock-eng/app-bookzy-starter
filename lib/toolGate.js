// lib/toolGate.js
// ──────────────────────────────────────────────────────────────────────────
// Gating des outils premium (Radar Cash, Youbook, Ebook Designer, Romans).
// Accès accordé uniquement si l'utilisateur a un statut Créateur/Pro actif
// (toolsTier ∈ {createur, pro} ET solde d'ebooks > 0) — voir toolsUnlocked().
//
// Niche Hunter & Validateur ne passent PAS par ici : ils ont un quota gratuit.
// ──────────────────────────────────────────────────────────────────────────
import { NextResponse } from "next/server";
import User from "@/models/User";
import { toolsUnlocked } from "@/lib/plans";

export function toolsLockedResponse() {
  return NextResponse.json(
    {
      success: false,
      locked: true,
      message: "Cet outil est réservé aux offres Créateur et Pro. Choisis une offre pour le débloquer.",
      redirectTo: "/dashboard/tarifs",
    },
    { status: 403 }
  );
}

/** Charge l'utilisateur et vérifie l'accès aux outils premium.
 *  @returns {{ user?, error? }} — `error` est une NextResponse à renvoyer tel quel. */
export async function requireToolsUnlocked(userId) {
  const user = await User.findById(userId);
  if (!user) {
    return { error: NextResponse.json({ success: false, message: "Utilisateur introuvable" }, { status: 404 }) };
  }
  if (!toolsUnlocked(user)) {
    return { error: toolsLockedResponse() };
  }
  return { user, error: null };
}
