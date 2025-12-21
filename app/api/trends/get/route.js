export const dynamic = "force-dynamic";
import { dbConnect } from "@/lib/db";
import Trend from "@/models/Trend";
import User from "@/models/User";
import jwt from "jsonwebtoken";

// ✅ Force le mode dynamique (Données toujours fraîches)

export async function GET(request) {
  try {
    await dbConnect();

    // 1. Authentification
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

    // 2. 🚀 OPTIMISATION FAVORIS : On ne charge QUE le tableau favorites
    // On utilise .lean() pour la vitesse
    const user = await User.findById(userId).select("favorites").lean();
    
    // Transformation en Set pour une vérification instantanée O(1)
    const favSet = new Set((user?.favorites || []).map(id => id.toString()));

    // 3. Paramètres URL
    const { searchParams } = new URL(request.url);
    const filter = searchParams.get("filter") || "all";
    const network = searchParams.get("network") || "all";
    const category = searchParams.get("category") || "all";
    const difficulty = searchParams.get("difficulty") || "all";
    const search = searchParams.get("search") || ""; // ✅ Mot-clé de recherche

    // 4. Construction de la Query
    let query = { isActive: true };

    // 🔥 GESTION DES FAVORIS (Côté Serveur)
    if (filter === "favorites") {
        // On demande à Mongo de ne sortir QUE les items qui sont dans la liste des favoris
        query._id = { $in: user?.favorites || [] };
    }

    if (network !== "all") query.network = network;
    if (category !== "all") query.categories = category;
    if (difficulty !== "all") query.difficulty = difficulty;

    if (filter === "hot") query.isHot = true;
    if (filter === "rising") query.isRising = true;
    if (filter === "easy") query.difficulty = "Facile";
    if (filter === "profitable") query.isProfitable = true;

    // 🔥 RECHERCHE GLOBALE (Sur toute la DB)
    if (search) {
      const regex = new RegExp(search, 'i'); // Insensible à la casse
      query.$or = [
        { title: { $regex: regex } },
        { description: { $regex: regex } },
        { tags: { $in: [regex] } },
        { network: { $regex: regex } }
      ];
    }

    // 5. Exécution (Limitée à 50 pour la performance)
    const trends = await Trend.find(query)
      .sort({ priority: -1, createdAt: -1 })
      .limit(50) 
      .lean();

    // 6. Formatage
    const formattedTrends = trends.map((t) => {
      const id = t._id.toString();
      
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
        trendDate: t.trendDate,
        tags: t.tags || [],
        
        // Est-ce un favori ?
        isFavorite: favSet.has(id),
      };
    });

    // 7. Stats Simples (Basées sur le résultat actuel)
    const stats = {
      total: formattedTrends.length,
      hot: formattedTrends.filter((t) => t.isHot).length,
      rising: formattedTrends.filter((t) => t.isRising).length,
      favorites: formattedTrends.filter((t) => t.isFavorite).length,
    };

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