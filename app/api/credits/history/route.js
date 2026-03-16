export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { verifyAuth } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const user = await verifyAuth(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

    // Pagination
    const { searchParams } = new URL(req.url);
    const page  = Math.max(1, parseInt(searchParams.get("page")  || "1"));
    const limit = Math.min(50, parseInt(searchParams.get("limit") || "10"));
    const skip  = (page - 1) * limit;

    // Récupérer uniquement les transactions credit_pack de ce user
    const [transactions, total] = await Promise.all([
      Transaction.find({
        userId:  user.id,
        purpose: "credit_pack",
      })
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit)
        .select("packId amount currency status completedAt createdAt")
        .lean(),

      Transaction.countDocuments({
        userId:  user.id,
        purpose: "credit_pack",
      }),
    ]);

    // Mapping lisible pour le frontend
    const PACK_LABELS = {
      solo_monthly:       "Pass Solo — Mensuel",
      solo_quarterly:     "Pass Solo — Trimestriel",
      createur_monthly:   "Pack Créateur — Mensuel",
      createur_quarterly: "Pack Créateur — Trimestriel",
      agence_monthly:     "Pack Agence — Mensuel",
      agence_quarterly:   "Pack Agence — Trimestriel",
    };

    const PACK_CREDITS = {
      solo_monthly:        20,
      solo_quarterly:      60,
      createur_monthly:   110,
      createur_quarterly: 330,
      agence_monthly:     315,
      agence_quarterly:   945,
    };

    const formatted = transactions.map(tx => ({
      id:          tx._id.toString(),
      packId:      tx.packId,
      label:       PACK_LABELS[tx.packId]   || tx.packId,
      credits:     PACK_CREDITS[tx.packId]  || 0,
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
        pagination: {
          page,
          limit,
          total,
          totalPages: Math.ceil(total / limit),
          hasMore: skip + transactions.length < total,
        },
      },
    });

  } catch (error) {
    console.error("❌ [Credits History] Erreur:", error.message);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}