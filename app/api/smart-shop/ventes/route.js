// app/api/smart-shop/ventes/route.js
// API pour récupérer les ventes et statistiques

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopSale from "@/models/ShopSale";
import jwt from "jsonwebtoken";

function getUserIdFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  const token = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];

  try {
    return jwt.verify(token, process.env.JWT_SECRET)?.id || null;
  } catch {
    return null;
  }
}

// GET - Récupérer les ventes et stats
export async function GET(req) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que l'utilisateur a une boutique
    const shop = await Shop.findOne({ userId });
    if (!shop) {
      return NextResponse.json({
        success: true,
        sales: [],
        stats: {
          totalSales: 0,
          totalRevenue: 0,
          totalCommission: 0,
          netRevenue: 0,
          todaySales: 0,
          todayRevenue: 0,
          weekSales: 0,
          weekRevenue: 0,
          monthSales: 0,
          monthRevenue: 0,
        },
        message: "Aucune boutique trouvée",
      });
    }

    // Paramètres de requête
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const status = searchParams.get("status"); // pending, completed, failed
    const period = searchParams.get("period"); // today, week, month, all

    // Construire le filtre
    const filter = { sellerId: userId };
    
    if (status) {
      filter.status = status;
    }

    // Filtre par période
    const now = new Date();
    if (period === "today") {
      const startOfDay = new Date(now.setHours(0, 0, 0, 0));
      filter.createdAt = { $gte: startOfDay };
    } else if (period === "week") {
      const startOfWeek = new Date(now);
      startOfWeek.setDate(now.getDate() - 7);
      filter.createdAt = { $gte: startOfWeek };
    } else if (period === "month") {
      const startOfMonth = new Date(now);
      startOfMonth.setDate(now.getDate() - 30);
      filter.createdAt = { $gte: startOfMonth };
    }

    // Récupérer les ventes paginées
    const sales = await ShopSale.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    const totalCount = await ShopSale.countDocuments(filter);

    // Calculer les stats globales (toutes les ventes completed)
    const allCompletedSales = await ShopSale.find({
      sellerId: userId,
      status: "completed",
    }).lean();

    const totalRevenue = allCompletedSales.reduce((sum, s) => sum + s.amount, 0);
    const totalCommission = allCompletedSales.reduce((sum, s) => sum + (s.commission?.amount || 0), 0);
    const netRevenue = allCompletedSales.reduce((sum, s) => sum + (s.netAmount || 0), 0);

    // Stats par période
    const todayStart = new Date();
    todayStart.setHours(0, 0, 0, 0);

    const weekStart = new Date();
    weekStart.setDate(weekStart.getDate() - 7);

    const monthStart = new Date();
    monthStart.setDate(monthStart.getDate() - 30);

    const todaySales = allCompletedSales.filter(
      (s) => new Date(s.createdAt) >= todayStart
    );
    const weekSales = allCompletedSales.filter(
      (s) => new Date(s.createdAt) >= weekStart
    );
    const monthSales = allCompletedSales.filter(
      (s) => new Date(s.createdAt) >= monthStart
    );

    const stats = {
      totalSales: allCompletedSales.length,
      totalRevenue,
      totalCommission,
      netRevenue,
      todaySales: todaySales.length,
      todayRevenue: todaySales.reduce((sum, s) => sum + (s.netAmount || 0), 0),
      weekSales: weekSales.length,
      weekRevenue: weekSales.reduce((sum, s) => sum + (s.netAmount || 0), 0),
      monthSales: monthSales.length,
      monthRevenue: monthSales.reduce((sum, s) => sum + (s.netAmount || 0), 0),
      balance: shop.balance || 0,
    };

    // Ventes par jour pour le graphique (30 derniers jours)
    const chartData = [];
    for (let i = 29; i >= 0; i--) {
      const date = new Date();
      date.setDate(date.getDate() - i);
      date.setHours(0, 0, 0, 0);
      
      const nextDate = new Date(date);
      nextDate.setDate(nextDate.getDate() + 1);

      const daySales = allCompletedSales.filter((s) => {
        const saleDate = new Date(s.createdAt);
        return saleDate >= date && saleDate < nextDate;
      });

      chartData.push({
        date: date.toISOString().split("T")[0],
        sales: daySales.length,
        revenue: daySales.reduce((sum, s) => sum + (s.netAmount || 0), 0),
      });
    }

    return NextResponse.json({
      success: true,
      sales,
      stats,
      chartData,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("❌ [Smart Shop] Erreur GET ventes:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}