export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import PromoConfig from "@/models/PromoConfig";
import Transaction from "@/models/Transaction";
import { isPromoValid, PROMO_ELIGIBLE_OFFERS } from "@/lib/promo";

// Renvoie l'état de la roue pour l'utilisateur connecté.
export async function GET() {
  try {
    await dbConnect();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    const config = await PromoConfig.getSingleton();
    const live = config.isLive();

    // Code déjà gagné et encore valable ?
    const active = isPromoValid(user.promo)
      ? { code: user.promo.code, percent: user.promo.percent, expiresAt: user.promo.expiresAt }
      : null;

    // A-t-il déjà été abonné (Créateur/Pro) ? → non éligible
    const everSubscribed =
      (await Transaction.countDocuments({
        userId: user._id,
        status: "completed",
        packId: { $in: PROMO_ELIGIBLE_OFFERS },
      })) > 0;

    const canSpin = live && !user.promo?.spun && !everSubscribed;

    return NextResponse.json({ success: true, canSpin, active });
  } catch (e) {
    console.error("❌ [promo/status]", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
