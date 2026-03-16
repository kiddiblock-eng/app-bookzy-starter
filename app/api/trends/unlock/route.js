export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";

const UNLOCK_COST = 2;
const UNLOCK_BATCH = 50;
const UNLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24h glissantes

export async function POST(req) {
  try {
    await dbConnect();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json({ success: false, error: "Non authentifié" }, { status: 401 });
    }

    // Abonnés → pas besoin de débloquer
    if (["solo", "createur", "agence"].includes(user.plan)) {
      return NextResponse.json({ success: true, alreadyUnlocked: true });
    }

    const balance = user.credits?.balance ?? 0;
    if (balance < UNLOCK_COST) {
      return NextResponse.json(
        {
          success: false,
          insufficientCredits: true,
          balance,
          required: UNLOCK_COST,
          error: `Crédits insuffisants. Il vous faut ${UNLOCK_COST} crédits pour débloquer 50 tendances supplémentaires.`
        },
        { status: 402 }
      );
    }

    const now = new Date();

    // ✅ Si première fois ou session expirée (> 24h) → reset le compteur
    const lastUnlock = user.unlockedTrendsAt;
    const isExpired = !lastUnlock || (now - new Date(lastUnlock)) >= UNLOCK_DURATION_MS;

    if (isExpired) {
      user.unlockedTrendsAt = now;
      user.unlockedTrendsCount = UNLOCK_BATCH; // 50
    } else {
      // ✅ Session active → ajouter 50 de plus
      user.unlockedTrendsCount = (user.unlockedTrendsCount || 0) + UNLOCK_BATCH;
    }

    user.credits.balance = Math.round((balance - UNLOCK_COST) * 10) / 10;
    user.credits.totalSpent = (user.credits.totalSpent || 0) + UNLOCK_COST;
    await user.save();

    console.log(`💳 [Trends Unlock] +${UNLOCK_BATCH} tendances — total: ${user.unlockedTrendsCount} — solde: ${user.credits.balance}`);

    return NextResponse.json({
      success: true,
      newBalance: user.credits.balance,
      unlockedCount: user.unlockedTrendsCount,
    });

  } catch (error) {
    console.error("❌ [Trends Unlock] Erreur:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}