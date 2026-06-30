export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import User from "@/models/User";
import Transaction from "@/models/Transaction";
import { withCache } from "@/lib/miniCache";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    const { authorized } = await verifyAdmin(req);
    if (!authorized) return NextResponse.json({ success: false, message: "Non autorisé" }, { status: 403 });

    const goals = await withCache("admin:goals", 30000, async () => {
      const now = new Date();
      const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

      const [totalUsers, salesData] = await Promise.all([
        User.countDocuments(),
        Transaction.aggregate([
          {
            $match: {
              createdAt: { $gte: monthStart },
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
        ]),
      ]);

      const totalSales = salesData[0]?.totalSales || 0;
      const totalRevenue = salesData[0]?.totalRevenue || 0;

      return [
        { name: "Utilisateurs", current: totalUsers, target: 15000 },
        { name: "Ventes", current: totalSales, target: 6000 },
        { name: "Revenus (FCFA)", current: totalRevenue, target: 12000000 },
      ];
    });

    return NextResponse.json({
      success: true,
      data: goals
    });

  } catch (error) {
    console.error("Erreur goals:", error);
    return NextResponse.json(
      { success: false, data: [] },
      { status: 500 }
    );
  }
}