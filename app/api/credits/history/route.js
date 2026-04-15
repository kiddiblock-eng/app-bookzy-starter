 export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { verifyAuth } from "@/lib/auth";

const PACK_LABELS = {
  solo_monthly:       "Pass Solo — Mensuel",
  solo_quarterly:     "Pass Solo — Trimestriel",
  createur_monthly:   "Pack Créateur — Mensuel",
  createur_quarterly: "Pack Créateur — Trimestriel",
  agence_monthly:     "Pack Agence — Mensuel",
  agence_quarterly:   "Pack Agence — Trimestriel",
};

const PACK_CREDITS = {
  solo_monthly:       100,
  solo_quarterly:     300,
  createur_monthly:   400,
  createur_quarterly: 1200,
  agence_monthly:     900,
  agence_quarterly:   2700,
};

function parseRechargeCredits(packId) {
  const match = packId?.match(/^recharge_(\d+)_(free|solo|createur|agence)$/);
  if (!match) return null;
  return parseInt(match[1]);
}

function getPackLabel(packId) {
  if (!packId) return "Achat de crédits";
  if (PACK_LABELS[packId]) return PACK_LABELS[packId];
  const credits = parseRechargeCredits(packId);
  if (credits) return `Recharge ${credits} crédits`;
  return packId;
}

function getPackCredits(packId) {
  if (!packId) return 0;
  if (PACK_CREDITS[packId]) return PACK_CREDITS[packId];
  const credits = parseRechargeCredits(packId);
  return credits || 0;
}

export async function GET(req) {
  try {
    await dbConnect();
    const user = await verifyAuth(req);
    if (!user) return NextResponse.json({ success: false, message: "Non authentifié" }, { status: 401 });

    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));
    const skip  = (page - 1) * limit;

    const [transactions, total] = await Promise.all([
      Transaction.find({ userId: user.id, purpose: "credit_pack" })
        .sort({ createdAt: -1 }).skip(skip).limit(limit)
        .select("packId amount currency status completedAt createdAt").lean(),
      Transaction.countDocuments({ userId: user.id, purpose: "credit_pack" }),
    ]);

    const formatted = transactions.map(tx => ({
      id:          tx._id.toString(),
      packId:      tx.packId,
      label:       getPackLabel(tx.packId),
      credits:     getPackCredits(tx.packId),
      amount:      tx.amount,
      currency:    tx.currency,
      status:      tx.status,
      completedAt: tx.completedAt,
      createdAt:   tx.createdAt,
    }));

    return NextResponse.json({
      success: true,
      data: {
        transactions: formatted,
        pagination: { page, limit, total, totalPages: Math.ceil(total / limit), hasMore: skip + transactions.length < total },
      },
    });

  } catch (error) {
    console.error("❌ [Credits History] Erreur:", error.message);
    return NextResponse.json({ success: false, message: error.message || "Erreur serveur" }, { status: 500 });
  }
}