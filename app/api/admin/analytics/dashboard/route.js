import { NextResponse } from "next/server";
import { dbConnect } from "../../../../../lib/db";
import { verifyAdmin } from "../../../../../lib/auth";

import User from "../../../../../models/User";
import Projet from "../../../../../models/Projet";
import Transaction from "../../../../../models/Transaction";
import UserActivity from "../../../../../models/UserActivity";

export async function GET(req) {
  try {
    await dbConnect();

    // 🔐 Vérification Admin (x-admin-secret OU cookie JWT)
    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json(
        { success: false, message: admin.message || "Non autorisé" },
        { status: 403 }
      );
    }

    // -----------------------------
    // 1️⃣ TOTAL USERS
    // -----------------------------
    const totalUsers = await User.countDocuments();

    // -----------------------------
    // 2️⃣ TOTAL EBOOKS (projets complétés uniquement)
    // -----------------------------
    const totalEbooks = await Projet.countDocuments({ status: "COMPLETED" }); // ✅ CORRIGÉ

    // -----------------------------
    // 3️⃣ REVENUE TOTAL + SALES COUNT (transactions completed)
    // -----------------------------
    const txAgg = await Transaction.aggregate([
      {
        $match: {
          status: "completed", // ✅ CORRIGÉ (minuscule)
          amount: { $gt: 0 },
        },
      },
      {
        $group: {
          _id: null,
          revenue: { $sum: "$amount" },
          sales: { $sum: 1 },
        },
      },
    ]);

    const revenue = txAgg[0]?.revenue || 0;
    const totalSales = txAgg[0]?.sales || 0;

    // -----------------------------
    // 4️⃣ ACTIVE USERS NOW (last 5 minutes)
    // -----------------------------
    const last5min = new Date(Date.now() - 5 * 60 * 1000);

    const activeNow = await UserActivity.countDocuments({
      lastSeen: { $gte: last5min },
    });

    // ✅ RÉPONSE
    return NextResponse.json({
      success: true,
      data: {
        totalUsers,
        totalEbooks,
        revenue,
        totalSales,
        activeNow,
      },
    });
  } catch (error) {
    console.error("❌ Dashboard error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}