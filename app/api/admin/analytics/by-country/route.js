export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { verifyAdmin } from "@/lib/auth";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET(req) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json(
        { success: false, message: admin.message || "Non autorisé" },
        { status: 403 }
      );
    }

    const stats = await Transaction.aggregate([
      // 1️⃣ On filtre uniquement les vraies ventes
      {
        $match: {
          status: "success",
          amount: { $gt: 0 },
          country: { $exists: true, $ne: "" },
        },
      },
      // 2️⃣ Groupe par pays
      {
        $group: {
          _id: "$country",
          count: { $sum: 1 },
          revenue: { $sum: "$amount" },
        },
      },
      // 3️⃣ On prépare le shape final
      {
        $project: {
          _id: 0,
          country: "$_id",
          count: 1,
          revenue: 1,
        },
      },
      // 4️⃣ Tri par revenu décroissant
      { $sort: { revenue: -1 } },
    ]);

    return NextResponse.json({
      success: true,
      data: stats,
    });
  } catch (e) {
    console.log("Erreur stats pays:", e);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}