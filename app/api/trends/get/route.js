export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import Trend from "@/models/Trend";
import User from "@/models/User";
import jwt from "jsonwebtoken";

const UNLOCK_DURATION_MS = 24 * 60 * 60 * 1000; // 24h glissantes

export async function GET(request) {
  try {
    await dbConnect();

    const cookie = request.headers.get("cookie") || "";
    const token = cookie.split(";").map(c => c.trim()).find(c => c.startsWith("bookzy_token="))?.split("=")[1];

    if (!token) {
      return Response.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
    } catch {
      return Response.json({ success: false, error: "Session expirée" }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id || decoded._id;

    const user = await User.findById(userId).select("favorites plan credits unlockedTrendsAt unlockedTrendsCount").lean();
    const favSet = new Set((user?.favorites || []).map(id => id.toString()));

    const isPaidPlan = ["solo", "createur", "agence"].includes(user?.plan);

    // ✅ 24h glissantes
    const now = new Date();
    const lastUnlock = user?.unlockedTrendsAt;
    const isActive = lastUnlock && (now - new Date(lastUnlock)) < UNLOCK_DURATION_MS;
    const unlockedCount = isActive ? (user?.unlockedTrendsCount || 0) : 0;

    let trendLimit;
    if (isPaidPlan) {
      trendLimit = 33350;
    } else {
      trendLimit = 10 + unlockedCount; // 10 de base + ce qu'il a débloqué
    }

    const { searchParams } = new URL(request.url);
    const filter     = searchParams.get("filter")     || "all";
    const network    = searchParams.get("network")    || "all";
    const category   = searchParams.get("category")   || "all";
    const difficulty = searchParams.get("difficulty") || "all";
    const search     = searchParams.get("search")     || "";

    let query = { isActive: true };

    if (filter === "favorites") query._id = { $in: user?.favorites || [] };
    if (network !== "all")     query.network = network;
    if (category !== "all")    query.categories = category;
    if (difficulty !== "all")  query.difficulty = difficulty;
    if (filter === "hot")        query.isHot = true;
    if (filter === "rising")     query.isRising = true;
    if (filter === "easy")       query.difficulty = "Facile";
    if (filter === "profitable") query.isProfitable = true;

    if (search) {
      // 🛡️ Anti-ReDoS / injection regex : on échappe les métacaractères et on borne la longueur
      const safe = String(search).slice(0, 80).replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
      const regex = new RegExp(safe, 'i');
      query.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $in: [regex] } },
        { network: { $regex: regex } }
      ];
    }

    const trends = await Trend.aggregate([
      { $match: query },
      // Score = priority + aléatoire → mélange anciens et nouveaux
      { $addFields: {
        _score: {
          $add: [
            "$priority",
            { $multiply: [{ $rand: {} }, 40] } // variance de 0 à 40
          ]
        }
      }},
      { $sort: { _score: -1 } },
      { $limit: trendLimit },
      { $project: { _score: 0 } },
    ]);

    const formattedTrends = trends.map((t) => {
      const id = t._id.toString();
      return {
        id, title: t.title, description: t.description, emoji: t.emoji,
        gradient: t.gradient, network: t.network, potential: t.potential,
        difficulty: t.difficulty, searches: t.searches, competition: t.competition,
        growth: t.growth, isHot: t.isHot, isRising: t.isRising,
        isProfitable: t.isProfitable, categories: t.categories,
        trendDate: t.trendDate, tags: t.tags || [],
        isFavorite: favSet.has(id),
      };
    });

    const stats = {
      total: formattedTrends.length,
      hot: formattedTrends.filter((t) => t.isHot).length,
      rising: formattedTrends.filter((t) => t.isRising).length,
      favorites: formattedTrends.filter((t) => t.isFavorite).length,
    };

    // Expiration dans X heures
    let unlockedExpiresIn = null;
    if (isActive && lastUnlock) {
      const expiresAt = new Date(new Date(lastUnlock).getTime() + UNLOCK_DURATION_MS);
      unlockedExpiresIn = Math.ceil((expiresAt - now) / (1000 * 60 * 60)); // en heures
    }

    return Response.json({
      success: true,
      trends: formattedTrends,
      stats,
      isPaidPlan,
      isUnlocked: isActive && unlockedCount > 0,
      unlockedCount,
      unlockedExpiresIn, // ex: "expire dans 22h"
      plan: user?.plan || "free",
      creditsBalance: user?.credits?.balance ?? 0,
      canUnlock: !isPaidPlan, // toujours afficher le bouton si free
    });

  } catch (error) {
    console.error("❌ Erreur /api/trends/get:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}