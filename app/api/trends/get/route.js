import { dbConnect } from "@/lib/db";
import Trend from "@/models/Trend";
import User from "@/models/User";
import jwt from "jsonwebtoken";


export const dynamic = 'force-dynamic';

export async function GET(request) {
  try {
    await dbConnect();

    // 🔐 Token
    const cookie = request.headers.get("cookie") || "";
    const token = cookie
      .split(";")
      .map((c) => c.trim())
      .find((c) => c.startsWith("bookzy_token="))
      ?.split("=")[1];

    if (!token) {
      return Response.json({ success: false, error: "Non autorisé" }, { status: 401 });
    }

    let decoded;
    try {
      decoded = jwt.verify(token, process.env.JWT_SECRET);
      console.log("🔍 GET /api/trends/get - Token décodé:", decoded);
    } catch {
      return Response.json({ success: false, error: "Session expirée" }, { status: 401 });
    }

    // ✅ CORRECTION : Support de "id", "userId" ou "_id"
    const userId = decoded.userId || decoded.id || decoded._id;

    console.log("🔍 GET /api/trends/get - userId:", userId);

    if (!userId) {
      return Response.json({ success: false, error: "userId manquant dans token" }, { status: 401 });
    }

    // ✅ CORRECTION : Retire .lean() pour avoir les defaults de Mongoose
    const user = await User.findById(userId);

    console.log("🔍 GET /api/trends/get - user trouvé:", !!user);
    console.log("🔍 GET /api/trends/get - user.favorites:", user?.favorites);

    // ✅ CORRECTION : Simplifie et ajoute fallback
    const favArray = (user?.favorites || []).map((id) => id.toString());

    console.log("🔍 GET /api/trends/get - favArray final:", favArray);
    console.log("🔍 GET /api/trends/get - nombre de favoris:", favArray.length);

    const { searchParams } = new URL(request.url);

    // 🔍 Filtres
    const filter = searchParams.get("filter") || "all";
    const network = searchParams.get("network") || "all";
    const period = searchParams.get("period") || "all";
    const category = searchParams.get("category") || "all";
    const region = searchParams.get("region") || "all";
    const difficulty = searchParams.get("difficulty") || "all";

    // 🔍 Query Mongo
    let query = { isActive: true };

    if (network !== "all") query.network = network;
    if (period !== "all") query.period = period;
    if (category !== "all") query.categories = category;
    if (region !== "all") query.region = region;
    if (difficulty !== "all") query.difficulty = difficulty;

    if (filter === "hot") query.isHot = true;
    if (filter === "rising") query.isRising = true;
    if (filter === "easy") query.difficulty = "Facile";
    if (filter === "profitable") query.isProfitable = true;

    const trends = await Trend.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(50)
      .lean();

    console.log("🔍 GET /api/trends/get - nombre de trends:", trends.length);

    // 🎯 Formatter + inclure TOUTES les infos admin
    const formattedTrends = trends.map((t) => {
      const id = t._id.toString();
      const isFav = favArray.includes(id);
      
      // Log seulement les 3 premiers pour pas surcharger
      if (trends.indexOf(t) < 3) {
        console.log(`🔍 Trend "${t.title}" - ID: ${id} - isFavorite: ${isFav}`);
      }
      
      return {
        id,
        title: t.title,
        description: t.description,
        emoji: t.emoji,
        gradient: t.gradient,

        network: t.network,
        potential: t.potential,
        difficulty: t.difficulty,
        searches: t.searches,
        competition: t.competition,
        growth: t.growth,

        isHot: t.isHot,
        isRising: t.isRising,
        isProfitable: t.isProfitable,

        categories: t.categories,
        period: t.period,
        region: t.region,

        sources: t.sources,
        tags: t.tags,

        monetizationPotential: t.monetizationPotential,
        monetizationMethods: t.monetizationMethods,
        estimatedRevenue: t.estimatedRevenue,
        contentType: t.contentType,
        targetAudience: t.targetAudience,

        trendDate: t.trendDate,

        // ❤️ FAVORI
        isFavorite: isFav,
      };
    });

    // 📊 Stats
    const stats = {
      total: formattedTrends.length,
      hot: formattedTrends.filter((t) => t.isHot).length,
      rising: formattedTrends.filter((t) => t.isRising).length,
      easy: formattedTrends.filter((t) => t.difficulty === "Facile").length,
      profitable: formattedTrends.filter((t) => t.isProfitable).length,
      favorites: formattedTrends.filter((t) => t.isFavorite).length,
    };

    console.log("✅ GET /api/trends/get - stats.favorites:", stats.favorites);

    return Response.json({
      success: true,
      trends: formattedTrends,
      stats,
    });

  } catch (error) {
    console.error("❌ Erreur /api/trends/get:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
