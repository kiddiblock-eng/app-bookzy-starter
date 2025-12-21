export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function POST(req) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin.authorized) {
      return NextResponse.json({ success: false, message: admin.message }, { status: 403 });
    }

    const { startDate, endDate } = await req.json();

    const start = new Date(startDate);
    const end = new Date(endDate);

    const result = await Transaction.aggregate([
      {
        $match: {
          createdAt: {
            $gte: start,
            $lte: end,
          },
          status: "completed", // ✅ AJOUTÉ - Filtre uniquement les transactions complétées
          amount: { $gt: 0 } // ✅ AJOUTÉ - Exclut les montants négatifs ou nuls
        }
      },
      {
        $group: {
          _id: null,
          totalSales: { $sum: "$amount" },
          count: { $sum: 1 }
        }
      }
    ]);

    return NextResponse.json({
      success: true,
      data: result[0] || { totalSales: 0, count: 0 }
    });

  } catch (e) {
    console.log("Erreur sales range:", e);
    return NextResponse.json({ success: false, message: "Erreur serveur" }, { status: 500 });
  }
}