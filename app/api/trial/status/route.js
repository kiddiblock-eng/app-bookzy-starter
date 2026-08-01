export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import Transaction from "@/models/Transaction";
import { toolsUnlocked, OFFERS, CREDITS_PER_EBOOK } from "@/lib/plans";

// État de l'essai/abonnement pour l'utilisateur connecté.
// - subscribed : a un abonnement actif (Créateur/Pro, outils débloqués)
// - trialActive : a activé l'essai à 1000 FCFA
// - eligible : peut encore acheter l'essai (jamais essai / abonnement)
export async function GET() {
  try {
    await dbConnect();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    const subscribed = toolsUnlocked(user); // outils débloqués MAINTENANT (solde ≥ 10)
    const trialActive = !!user.trialTier;
    // A déjà été abonné (statut brut, même sans crédits) → n'est plus un nouveau à qui proposer l'essai.
    const hasTier = user.toolsTier === "createur" || user.toolsTier === "pro";

    const paid = await Transaction.countDocuments({
      userId: user._id,
      status: "completed",
      packId: { $in: ["essai", "decouverte", "createur", "pro"] },
    });
    // A déjà de quoi générer un ebook → plus besoin de proposer l'essai.
    const hasCredits = (user.credits?.balance || 0) >= CREDITS_PER_EBOOK;
    const eligible = paid === 0 && !hasTier && !trialActive && !hasCredits;

    return NextResponse.json({
      success: true,
      subscribed,
      trialActive,
      eligible,
      trial: { priceFcfa: OFFERS.essai.priceFcfa, maxPages: OFFERS.essai.maxPages, maxChapters: OFFERS.essai.maxChapters },
    });
  } catch (e) {
    console.error("❌ [trial/status]", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
