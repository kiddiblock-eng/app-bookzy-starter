export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { jwtVerify } from "jose";
import { dbConnect } from "@/lib/db";
import { withCache } from "@/lib/miniCache";
import NicheAnalysis from "@/models/NicheAnalysis";
import User from "@/models/User";

// ========================================
// FONCTIONS HELPERS
// ========================================

function getStartDate(range) {
  const now = new Date();
  switch (range) {
    case "24h":
      return new Date(now.getTime() - 24 * 60 * 60 * 1000);
    case "7d":
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now.getTime() - 90 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
  }
}

function getPreviousStartDate(range) {
  const now = new Date();
  switch (range) {
    case "24h":
      return new Date(now.getTime() - 48 * 60 * 60 * 1000);
    case "7d":
      return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
    case "30d":
      return new Date(now.getTime() - 60 * 24 * 60 * 60 * 1000);
    case "90d":
      return new Date(now.getTime() - 180 * 24 * 60 * 60 * 1000);
    default:
      return new Date(now.getTime() - 14 * 24 * 60 * 60 * 1000);
  }
}

function calculateTrend(current, previous) {
  if (previous === 0) return current > 0 ? 100 : 0;
  return (((current - previous) / previous) * 100).toFixed(1);
}

export async function GET(req) {
  try {
    await dbConnect();

    // ✅ Méthode 1 : JWT Token (via cookie)
    const adminToken = req.cookies.get("admin_token")?.value;
    
    // ✅ Méthode 2 : Admin Secret (via header)
    const adminSecret = req.headers.get("x-admin-secret");

    let isAuthorized = false;

    // Vérifier JWT token
    if (adminToken) {
      try {
        const decoded = await jwtVerify(
          adminToken,
          new TextEncoder().encode(process.env.JWT_SECRET)
        );

        if (
          decoded.payload.role === "admin" ||
          decoded.payload.role === "super_admin"
        ) {
          isAuthorized = true;
          console.log("✅ Auth JWT réussie");
        }
      } catch (error) {
        console.error("❌ JWT invalide:", error.message);
      }
    }

    // Fallback : vérifier le secret
    if (!isAuthorized && adminSecret === process.env.ADMIN_SECRET) {
      isAuthorized = true;
      console.log("✅ Auth SECRET réussie");
    }

    if (!isAuthorized) {
      console.log("❌ Non autorisé - Aucune méthode valide");
      return NextResponse.json(
        { success: false, message: "Non autorisé" },
        { status: 401 }
      );
    }

    // ----- RANGE FILTER -----
    const { searchParams } = new URL(req.url);
    const range = searchParams.get("range") || "7d";

    const responseData = await withCache(`admin:niche-hunter:ai-stats:${range}`, 30000, async () => {
    const date = getStartDate(range);
    const previousDate = getPreviousStartDate(range);

    // Récupérer données filtrées (période actuelle)
    const analyses = await NicheAnalysis.find({
      createdAt: { $gte: date }
    })
      .populate("userId", "email name country")
      .sort({ createdAt: 1 })
      .lean();

    // Récupérer données période précédente (pour trends)
    const previousAnalyses = await NicheAnalysis.find({
      createdAt: { $gte: previousDate, $lt: date }
    })
      .populate("userId", "email name country")
      .lean();

    // Total analyses filtrées
    const totalAnalyses = analyses.length;

    // Analyses aujourd'hui
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    const todayAnalyses = analyses.filter(
      (a) => new Date(a.createdAt) >= today
    ).length;

    // ---- Evolution dans le temps ----
    const usageOverTimeMap = {};
    analyses.forEach((a) => {
      const d = new Date(a.createdAt).toISOString().split("T")[0];
      usageOverTimeMap[d] = (usageOverTimeMap[d] || 0) + 1;
    });

    const usageOverTime = Object.entries(usageOverTimeMap).map(([d, count]) => ({
      date: d,
      count
    }));

    // ---- Top utilisateurs ----
    const userMap = {};
    analyses.forEach((a) => {
      const id = a.userId?._id?.toString();
      if (!id) return;

      if (!userMap[id]) {
        userMap[id] = {
          email: a.userId.email,
          fullName: a.userId.name,
          country: a.userId.country,
          count: 0
        };
      }

      userMap[id].count++;
    });

    const topUsers = Object.values(userMap)
      .sort((a, b) => b.count - a.count)
      .slice(0, 10);

    // ---- Répartition par pays ----
    const countryMap = {};
    analyses.forEach((a) => {
      const country = a.userId?.country || "Inconnu";
      countryMap[country] = (countryMap[country] || 0) + 1;
    });

    const topCountries = Object.entries(countryMap)
      .map(([country, count]) => ({ country, count }))
      .sort((a, b) => b.count - a.count);

    // ========================================
    // ✅ CALCUL DES STATUTS (Doughnut Chart)
    // ========================================
    
    let statusStats = {
      completed: 0,
      processing: 0,
      failed: 0,
      pending: 0,
    };

    try {
      // Essayer d'abord avec analysisStatus
      const statusCounts = await NicheAnalysis.aggregate([
        { $unwind: "$niches" },
        {
          $group: {
            _id: "$niches.analysisStatus",
            count: { $sum: 1 },
          },
        },
      ]);

      // Map des statuts
      const statusMap = {};
      statusCounts.forEach(s => {
        if (s._id) statusMap[s._id] = s.count;
      });

      // Si on a des données avec analysisStatus
      if (Object.keys(statusMap).length > 0) {
        statusStats = {
          completed: statusMap["completed"] || 0,
          processing: statusMap["processing"] || 0,
          failed: statusMap["failed"] || 0,
          pending: statusMap["pending"] || 0,
        };
      } else {
        // Fallback : utiliser le champ "analyzed"
        const analyzedCounts = await NicheAnalysis.aggregate([
          { $unwind: "$niches" },
          {
            $group: {
              _id: {
                $cond: [
                  { $eq: ["$niches.analyzed", true] },
                  "completed",
                  "pending"
                ]
              },
              count: { $sum: 1 }
            }
          }
        ]);

        analyzedCounts.forEach(s => {
          if (s._id === "completed") statusStats.completed = s.count;
          if (s._id === "pending") statusStats.pending = s.count;
        });
      }

      console.log("📊 Status Stats:", statusStats);

    } catch (error) {
      console.error("❌ Erreur calcul statusStats:", error);
      // Garder les valeurs par défaut (tous à 0)
    }

    // ========================================
    // ✅ TREND UTILISATEURS ACTIFS
    // ========================================
    
    const currentActiveUsersIds = new Set(
      analyses.map(a => a.userId?._id?.toString()).filter(Boolean)
    );
    const previousActiveUsersIds = new Set(
      previousAnalyses.map(a => a.userId?._id?.toString()).filter(Boolean)
    );

    const activeUsersTrend = calculateTrend(
      currentActiveUsersIds.size,
      previousActiveUsersIds.size
    );

    // ========================================
    // ✅ TREND NICHES GÉNÉRÉES
    // ========================================
    
    const currentNichesTotal = analyses.reduce((sum, a) => sum + (a.niches?.length || 0), 0);
    const previousNichesTotal = previousAnalyses.reduce((sum, a) => sum + (a.niches?.length || 0), 0);

    const nichesTrend = calculateTrend(currentNichesTotal, previousNichesTotal);

    // ========================================
    // RÉPONSE FINALE
    // ========================================

    return {
      success: true,
      stats: {
        totalAnalyses,
        todayAnalyses,
        topUsers,
        usageOverTime,
        topCountries,
        // ✅ NOUVELLES DONNÉES
        statusStats,
        activeUsersTrend: parseFloat(activeUsersTrend),
        nichesTrend: parseFloat(nichesTrend),
        totalNichesGenerated: currentNichesTotal,
      },
      analyses: analyses.map((a) => ({
        id: a._id,
        theme: a.theme,
        totalNiches: a.niches?.length || 0,
        user: {
          email: a.userId?.email,
          fullName: a.userId?.name,
          country: a.userId?.country
        },
        generatedAt: a.createdAt
      }))
    };
    });

    return NextResponse.json(responseData);

  } catch (error) {
    console.error("❌ Erreur admin AI stats:", error);
    return NextResponse.json(
      { success: false, message: "Erreur interne" },
      { status: 500 }
    );
  }
}