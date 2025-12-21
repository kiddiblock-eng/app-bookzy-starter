export const dynamic = "force-dynamic";
// app/api/admin/analytics/stats/route.js
// ✅ VERSION CORRIGÉE - Utilise Projet au lieu de Ebook

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { verifyAdmin } from "@/lib/auth";
import User from "@/models/User";
import Projet from "@/models/Projet"; // ✅ CHANGÉ
import Transaction from "@/models/Transaction";

// Helper pour formater l'ID date de l'aggregation
function mapDailyAgg(rows) {
  return rows.map((r) => ({
    date: `${String(r._id.day).padStart(2, "0")}-${String(r._id.month).padStart(2, "0")}-${r._id.year}`,
    count: r.count || 0,
    total: r.total || 0,
  }));
}

export async function GET(req) {
  try {
    await dbConnect();

    const admin = await verifyAdmin(req);
    if (!admin?.authorized) {
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);
    const days = parseInt(searchParams.get("days") || "30", 10);

    const sinceDate = new Date();
    sinceDate.setDate(sinceDate.getDate() - (isNaN(days) ? 30 : days) + 1);
    sinceDate.setHours(0, 0, 0, 0);

    // ---------- 1) KPI globaux ----------
    const [totalUsers, activeUsers, totalEbooks] = await Promise.all([
      User.countDocuments(),
      User.countDocuments({ isActive: { $ne: false } }),
      Projet.countDocuments({ status: "COMPLETED" }), // ✅ CHANGÉ
    ]);

    // Revenus + ventes totales
    let totalRevenue = 0;
    let totalSales = 0;

    try {
      const txAgg = await Transaction.aggregate([
        {
          $match: {
            status: "completed", // ✅ CHANGÉ de "success" à "completed"
            createdAt: { $gte: sinceDate },
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

      totalRevenue = txAgg?.[0]?.revenue || 0;
      totalSales = txAgg?.[0]?.sales || 0;
    } catch (e) {
      console.warn("Transaction aggregation error (stats):", e.message);
    }

    // ---------- 2) Users par jour ----------
    const usersDailyRaw = await User.aggregate([
      {
        $match: {
          createdAt: { $gte: sinceDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const usersDaily = mapDailyAgg(usersDailyRaw);

    // ---------- 3) eBooks par jour ----------
    const ebooksDailyRaw = await Projet.aggregate([ // ✅ CHANGÉ
      {
        $match: {
          status: "COMPLETED", // ✅ AJOUTÉ
          createdAt: { $gte: sinceDate },
        },
      },
      {
        $group: {
          _id: {
            year: { $year: "$createdAt" },
            month: { $month: "$createdAt" },
            day: { $dayOfMonth: "$createdAt" },
          },
          count: { $sum: 1 },
        },
      },
      { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
    ]);

    const ebooksDaily = mapDailyAgg(ebooksDailyRaw);

    // ---------- 4) Revenus par jour ----------
    let revenueDaily = [];
    try {
      const revenueDailyRaw = await Transaction.aggregate([
        {
          $match: {
            status: "completed", // ✅ CHANGÉ de "success" à "completed"
            createdAt: { $gte: sinceDate },
          },
        },
        {
          $group: {
            _id: {
              year: { $year: "$createdAt" },
              month: { $month: "$createdAt" },
              day: { $dayOfMonth: "$createdAt" },
            },
            total: { $sum: "$amount" },
            count: { $sum: 1 },
          },
        },
        { $sort: { "_id.year": 1, "_id.month": 1, "_id.day": 1 } },
      ]);

      revenueDaily = mapDailyAgg(revenueDailyRaw);
    } catch (e) {
      console.warn("Transaction daily agg error:", e.message);
    }

    // ---------- 5) Users par pays ----------
    const usersByCountryAgg = await User.aggregate([
      {
        $group: {
          _id: { $ifNull: ["$country", "$pays"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
      { $limit: 10 },
    ]);

    const usersByCountry = usersByCountryAgg.map((r) => ({
      country: r._id || "Non renseigné",
      count: r.count,
    }));

    // ---------- 6) Templates les plus utilisés ----------
    const templatesAgg = await Projet.aggregate([ // ✅ CHANGÉ
      {
        $match: {
          status: "COMPLETED" // ✅ AJOUTÉ
        }
      },
      {
        $group: {
          _id: { $ifNull: ["$template", "default"] },
          count: { $sum: 1 },
        },
      },
      { $sort: { count: -1 } },
    ]);

    const templatesStats = templatesAgg.map((t) => ({
      template: t._id || "default",
      count: t.count,
    }));

    // ---------- 7) Top utilisateurs par nombre d'eBooks ----------
    const topUsersAgg = await Projet.aggregate([ // ✅ CHANGÉ
      {
        $match: {
          status: "COMPLETED" // ✅ AJOUTÉ
        }
      },
      {
        $group: {
          _id: "$userId",
          ebooksCount: { $sum: 1 },
        },
      },
      { $sort: { ebooksCount: -1 } },
      { $limit: 5 },
    ]);

    const topUserIds = topUsersAgg.map((t) => t._id);
    const topUsersDocs = await User.find({ _id: { $in: topUserIds } })
      .select("_id firstName lastName name email country")
      .lean();

    const topUsers = topUsersAgg.map((t) => {
      const u = topUsersDocs.find((x) => x._id.toString() === t._id.toString());
      const fullName =
        ((u?.firstName || "") + " " + (u?.lastName || "")).trim() ||
        u?.name ||
        u?.email ||
        "Utilisateur";
      return {
        userId: t._id,
        name: fullName,
        email: u?.email || "",
        country: u?.country || "",
        ebooksCount: t.ebooksCount,
      };
    });

    // ---------- Réponse ----------
    return NextResponse.json({
      success: true,
      data: {
        kpis: {
          totalUsers,
          activeUsers,
          totalEbooks,
          totalRevenue,
          totalSales,
        },
        usersDaily,
        ebooksDaily,
        revenueDaily,
        usersByCountry,
        templatesStats,
        topUsers,
        periodDays: days,
      },
    });
  } catch (error) {
    console.error("❌ /api/admin/analytics/stats error:", error);
    return NextResponse.json(
      { success: false, message: "Erreur serveur" },
      { status: 500 }
    );
  }
}