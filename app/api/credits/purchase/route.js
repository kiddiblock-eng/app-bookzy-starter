export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import PaymentProviderService from "@/lib/payment/PaymentProviderService";
import { verifyAuth } from "@/lib/auth";
import Transaction from "@/models/Transaction";
import User from "@/models/User";
import { OFFERS, offerCredits } from "@/lib/plans";
import { isPromoValid, discountedAmount, PROMO_ELIGIBLE_OFFERS } from "@/lib/promo";

const PACKS = {
  solo_monthly:       { credits: 100,  amount: 7500,  plan: "solo",     label: "Pass Solo — Mensuel"         },
  solo_quarterly:     { credits: 300,  amount: 19125, plan: "solo",     label: "Pass Solo — Trimestriel"     },
  createur_monthly:   { credits: 400,  amount: 22000, plan: "createur", label: "Pack Créateur — Mensuel"     },
  createur_quarterly: { credits: 1200, amount: 56100, plan: "createur", label: "Pack Créateur — Trimestriel" },
  agence_monthly:     { credits: 900,  amount: 45000, plan: "agence",   label: "Pack Agence — Mensuel"       },
  agence_quarterly:   { credits: 2700, amount: 114750,plan: "agence",   label: "Pack Agence — Trimestriel"   },
};

const RECHARGE_PRICE_PER_CREDIT = {
  free:     150,
  solo:     100,
  createur: 100,
  agence:   100,
};

const MIN_RECHARGE = 30;
const MAX_RECHARGE = 3000;

function parseRechargePackId(packId) {
  const match = packId.match(/^recharge_(\d+)_(free|solo|createur|agence)$/);
  if (!match) return null;
  const credits = parseInt(match[1]);
  const plan    = match[2];
  if (credits < MIN_RECHARGE || credits > MAX_RECHARGE) return null;
  const pricePerCredit = RECHARGE_PRICE_PER_CREDIT[plan] ?? 150;
  const amount         = credits * pricePerCredit;
  return {
    credits,
    amount,
    plan:  null,
    label: `Recharge ${credits} crédits — Bookzy`,
    isRecharge: true,
  };
}

export async function POST(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const { packId, returnUrl } = await req.json();

    let pack = PACKS[packId] ?? null;
    let isRecharge = false;
    let toolsTier = null;

    // Nouvelles offres "ebooks qui n'expirent jamais" (Découverte / Créateur / Pro)
    if (!pack && OFFERS[packId]) {
      const o = OFFERS[packId];
      const isFirstPurchase = (await Transaction.countDocuments({ userId: user.id, status: "completed" })) === 0;
      const amount = packId === "decouverte" && isFirstPurchase && o.welcomePriceFcfa ? o.welcomePriceFcfa : o.priceFcfa;
      toolsTier = o.unlocksTools ? packId : null; // "createur" | "pro" | null
      pack = {
        credits: offerCredits(packId),
        amount,
        plan: null, // on ne touche pas user.plan (ebooks non-expirants)
        label: `${o.label} · ${o.ebooks} ebook${o.ebooks > 1 ? "s" : ""}`,
      };
    }

    if (!pack) {
      pack = parseRechargePackId(packId);
      if (!pack) return NextResponse.json({ success: false, message: "Pack invalide" }, { status: 400 });
      isRecharge = true;
    }

    // 🎡 Remise "roue promo" — uniquement sur Créateur/Pro, si l'utilisateur a un code valable.
    // Le % est relu depuis la base (jamais depuis le client) et appliqué ici.
    let promo = null;
    if (PROMO_ELIGIBLE_OFFERS.includes(packId)) {
      const fullUser = await User.findById(user.id).select("promo");
      if (fullUser && isPromoValid(fullUser.promo)) {
        const original = pack.amount;
        pack.amount = discountedAmount(original, fullUser.promo.percent);
        promo = { code: fullUser.promo.code, percent: fullUser.promo.percent, original };
        pack.label = `${pack.label} · -${promo.percent}%`;
      }
    }

    const moneroo = await PaymentProviderService.getProvider("moneroo");
    const payment = await moneroo.createPayment({
      amount:        pack.amount,
      currency:      "XOF",
      description:   pack.label,
      customerEmail: user.email,
      customerName:  user.name || "Client Bookzy",
      returnUrl: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/tarifs?status=success`,
      metadata: {
        userId:     user.id.toString(),
        packId,
        credits:    pack.credits,
        plan:       pack.plan,
        label:      pack.label,
        amount:     pack.amount,
        isRecharge,
        toolsTier,
        promoCode:    promo?.code || null,
        promoPercent: promo?.percent || null,
      },
    });

    if (!payment.success || !payment.paymentUrl) {
      return NextResponse.json({ success: false, message: "Erreur lors de l'initialisation du paiement" }, { status: 500 });
    }

    const tx = await Transaction.create({
      userId:                user.id,
      provider:              "moneroo",
      purpose:               "credit_pack",
      packId,
      amount:                pack.amount,
      currency:              "XOF",
      status:                "pending",
      providerTransactionId: payment.transactionId,
    });

    console.log(`💳 [Credits Purchase] ${isRecharge ? "Recharge" : "Abonnement"} — ${packId} — ${pack.amount} XOF — user: ${user.id}`);
    console.log(`💾 [Credits] Transaction: ${tx._id}`);

    return NextResponse.json({ success: true, paymentUrl: payment.paymentUrl });

  } catch (error) {
    console.error("❌ [Credits Purchase] Erreur:", error.message);
    return NextResponse.json({ success: false, message: error.message || "Erreur serveur" }, { status: 500 });
  }
}