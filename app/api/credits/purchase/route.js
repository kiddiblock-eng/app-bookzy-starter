export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import PaymentProviderService from "@/lib/payment/PaymentProviderService";
import { verifyAuth } from "@/lib/auth";

// ─── CONFIG PACKS FIXES ───────────────────────────────────────────────────────

const PACKS = {
  solo_monthly:       { credits: 60,   amount: 5100,  plan: "solo",     label: "Pass Solo — Mensuel"         },
  solo_quarterly:     { credits: 180,  amount: 13005, plan: "solo",     label: "Pass Solo — Trimestriel"     },
  createur_monthly:   { credits: 330,  amount: 19125, plan: "createur", label: "Pack Créateur — Mensuel"     },
  createur_quarterly: { credits: 990,  amount: 48769, plan: "createur", label: "Pack Créateur — Trimestriel" },
  agence_monthly:     { credits: 700,  amount: 31500, plan: "agence",   label: "Pack Agence — Mensuel"       },
  agence_quarterly:   { credits: 2100, amount: 80325, plan: "agence",   label: "Pack Agence — Trimestriel"   },
};

// ─── PRIX RECHARGE À LA CARTE ─────────────────────────────────────────────────

const RECHARGE_PRICE_PER_CREDIT = {
  free:     150,
  solo:     100,
  createur: 100,
  agence:   100,
};

const MIN_RECHARGE = 10;
const MAX_RECHARGE = 3000;

// ─── PARSER RECHARGE DYNAMIQUE ────────────────────────────────────────────────
// packId format : "recharge_{credits}_{plan}"  ex: "recharge_50_solo"

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
    plan:  null, // recharge ne change pas le plan
    label: `Recharge ${credits} crédits — Bookzy`,
    isRecharge: true,
  };
}

export async function POST(req) {
  try {
    await dbConnect();

    // 1. Auth
    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    // 2. Body
    const { packId, returnUrl } = await req.json();

    // 3. Résoudre le pack (fixe ou recharge dynamique)
    let pack = PACKS[packId] ?? null;
    let isRecharge = false;

    if (!pack) {
      pack = parseRechargePackId(packId);
      if (!pack) {
        return NextResponse.json(
          { success: false, message: "Pack invalide" },
          { status: 400 }
        );
      }
      isRecharge = true;
    }

    // 4. Initialiser le paiement
    const moneroo = await PaymentProviderService.getProvider("moneroo");

    const payment = await moneroo.createPayment({
      amount:        pack.amount,
      currency:      "XOF",
      description:   pack.label,
      customerEmail: user.email,
      customerName:  user.name || "Client Bookzy",
      returnUrl:     returnUrl || `${process.env.NEXT_PUBLIC_APP_URL}/dashboard/credits`,
      metadata: {
        userId:     user.id.toString(),
        packId,
        credits:    pack.credits,
        plan:       pack.plan,
        label:      pack.label,
        amount:     pack.amount,
        isRecharge, // ← le webhook sait que c'est une recharge (pas de changement de plan)
      },
    });

    if (!payment.success || !payment.paymentUrl) {
      return NextResponse.json(
        { success: false, message: "Erreur lors de l'initialisation du paiement" },
        { status: 500 }
      );
    }

    console.log(`💳 [Credits Purchase] ${isRecharge ? "Recharge" : "Abonnement"} — ${packId} — ${pack.amount} XOF — user: ${user.id}`);

    return NextResponse.json({
      success:    true,
      paymentUrl: payment.paymentUrl,
    });

  } catch (error) {
    console.error("❌ [Credits Purchase] Erreur:", error.message);
    return NextResponse.json(
      { success: false, message: error.message || "Erreur serveur" },
      { status: 500 }
    );
  }
}