import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const monthsCount = parseInt(searchParams.get("months") || "6");

    const revenueData = [];
    const now = new Date();

    for (let i = monthsCount - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      // 🔥 VRAIES transactions
      const monthlyTx = await Transaction.aggregate([
        {
          $match: {
            createdAt: { $gte: start, $lt: end },
            status: "completed",
            amount: { $gt: 0 },
          },
        },
        {
          $group: {
            _id: null,
            totalRevenue: { $sum: "$amount" },
            totalSales: { $sum: 1 },
          },
        },
      ]);

      const monthName = start.toLocaleDateString("fr-FR", { month: "short" });
      const formattedName = monthName.charAt(0).toUpperCase() + monthName.slice(1);

      revenueData.push({
        month: formattedName,
        revenue: monthlyTx.length > 0 ? monthlyTx[0].totalRevenue : 0,
        sales: monthlyTx.length > 0 ? monthlyTx[0].totalSales : 0,
      });
    }

    return NextResponse.json({
      success: true,
      data: revenueData,
    });

  } catch (error) {
    console.error("Erreur revenue monthly :", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur", data: [] },
      { status: 500 }
    );
  }
}