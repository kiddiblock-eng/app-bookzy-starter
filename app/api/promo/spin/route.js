export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getUserFromToken } from "@/lib/auth";
import PromoConfig from "@/models/PromoConfig";
import Transaction from "@/models/Transaction";
import {
  pickPercent, pickWheelIndex, generatePromoCode,
  PROMO_TTL_HOURS, PROMO_ELIGIBLE_OFFERS,
} from "@/lib/promo";

// Tourne la roue UNE fois : le % est décidé ici (serveur), jamais côté client.
export async function POST() {
  try {
    await dbConnect();
    const user = await getUserFromToken();
    if (!user) return NextResponse.json({ success: false }, { status: 401 });

    const config = await PromoConfig.getSingleton();
    if (!config.isLive()) {
      return NextResponse.json({ success: false, message: "Promo indisponible" }, { status: 403 });
    }

    if (user.promo?.spun) {
      return NextResponse.json({ success: false, message: "Déjà utilisé" }, { status: 409 });
    }

    const everSubscribed =
      (await Transaction.countDocuments({
        userId: user._id,
        status: "completed",
        packId: { $in: PROMO_ELIGIBLE_OFFERS },
      })) > 0;
    if (everSubscribed) {
      return NextResponse.json({ success: false, message: "Non éligible" }, { status: 403 });
    }

    // Résultat décidé serveur
    const percent = pickPercent();
    const index = pickWheelIndex(percent);
    const code = generatePromoCode(percent);
    const wonAt = new Date();
    const expiresAt = new Date(wonAt.getTime() + PROMO_TTL_HOURS * 3600 * 1000);

    user.promo = { spun: true, percent, code, wonAt, expiresAt, used: false, usedAt: null };
    user.markModified("promo");
    await user.save();

    return NextResponse.json({
      success: true,
      index,          // segment sur lequel la roue doit s'arrêter
      percent,
      code,
      expiresAt,
    });
  } catch (e) {
    console.error("❌ [promo/spin]", e);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}
