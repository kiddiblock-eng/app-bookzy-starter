import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/db";
import User from "../../../../../models/User";
import Transaction from "../../../../../models/Transaction";

export async function GET(req) {
  try {
    await dbConnect();

    const totalUsers = await User.countDocuments();

    // Mois actuel
    const now = new Date();
    const monthStart = new Date(now.getFullYear(), now.getMonth(), 1);

    // 🟢 VRAIES VENTES (pas estimation)
    const salesData = await Transaction.aggregate([
      {
        $match: {
          createdAt: { $gte: monthStart },
          status: "completed", // ✅ CHANGÉ de "success" à "completed"
          amount: { $gt: 0 }   // ✅ AJOUTÉ - Exclut les montants nuls ou négatifs
        }
      },
      {
        $group: {
          _id: null,
          totalRevenue: { $sum: "$amount" },
          totalSales: { $sum: 1 }
        }
      }
    ]);

    const totalSales = salesData[0]?.totalSales || 0;
    const totalRevenue = salesData[0]?.totalRevenue || 0;

    const goals = [
      {
        name: "Utilisateurs",
        current: totalUsers,
        target: 15000
      },
      {
        name: "Ventes",
        current: totalSales,
        target: 6000
      },
      {
        name: "Revenus (FCFA)",
        current: totalRevenue,
        target: 12000000
      }
    ];

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