export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import { withCache } from "@/lib/miniCache";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const { authorized } = await verifyAdmin(req);
    if (!authorized) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });

    const { searchParams } = new URL(req.url);
    const monthsCount = parseInt(searchParams.get("months") || "6");

    const revenueData = await withCache(`admin:revenue:${monthsCount}`, 30000, async () => {
    const now = new Date();

    // Les N mois sont calculés EN PARALLÈLE (avant : séquentiel = N allers-retours)
    const monthTasks = [];
    for (let i = monthsCount - 1; i >= 0; i--) {
      const start = new Date(now.getFullYear(), now.getMonth() - i, 1);
      const end = new Date(now.getFullYear(), now.getMonth() - i + 1, 1);

      monthTasks.push(
        Transaction.aggregate([
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
        ]).then((monthlyTx) => {
          const monthName = start.toLocaleDateString("fr-FR", { month: "short" });
          const formattedName = monthName.charAt(0).toUpperCase() + monthName.slice(1);
          return {
            month: formattedName,
            revenue: monthlyTx.length > 0 ? monthlyTx[0].totalRevenue : 0,
            sales: monthlyTx.length > 0 ? monthlyTx[0].totalSales : 0,
          };
        })
      );
    }

      return Promise.all(monthTasks);
    });

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