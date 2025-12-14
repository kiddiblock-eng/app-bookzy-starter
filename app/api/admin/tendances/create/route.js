import { dbConnect } from "@/lib/db";
import Trend from "@/models/Trend";
import { verifyAdmin } from "@/lib/auth";

export async function POST(req) {
  try {
    await dbConnect();

    // Vérifier si admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, message: "Accès non autorisé" }),
        { status: 403 }
      );
    }

    const body = await req.json();

    const trend = await Trend.create({
      title: body.title,
      description: body.description,

      emoji: body.emoji || "💡",
      gradient: body.gradient || "from-blue-500 to-cyan-500",

      network: body.network || "Multi-plateformes",

      // 📌 Ici, on respecte EXACTEMENT ce que l’admin envoie
      potential: body.potential !== undefined ? Number(body.potential) : null,
      searches: body.searches !== undefined ? Number(body.searches) : null,
      growth: body.growth !== undefined ? Number(body.growth) : 0,

      difficulty: body.difficulty || "Moyen",
      competition: body.competition || "Moyenne",

      // 📌 Corrigé : plus de Boolean("false") qui devient true
      isHot: body.isHot === true,
      isRising: body.isRising === true,
      isProfitable: body.isProfitable === true,
      isActive: body.isActive !== false, // par défaut true

      isTrending: body.isTrending !== false,

      trendDate: body.trendDate ? new Date(body.trendDate) : new Date(),
      expiryDate: body.expiryDate ? new Date(body.expiryDate) : null,

      period: body.period || "Mois",

      sources: Array.isArray(body.sources) ? body.sources : [],
      tags: Array.isArray(body.tags) ? body.tags : [],
      categories: body.categories?.length ? body.categories : ["Autre"],

      // Analytics
      views: 0,
      clicks: 0,
      ctr: 0,

      priority: body.priority ? Number(body.priority) : 0,
      region: body.region || "Global",
      targetAudience: body.targetAudience || "Tous",
      contentType: body.contentType || "Vidéo courte",

      monetizationPotential: body.monetizationPotential || "Moyen",
      estimatedRevenue: body.estimatedRevenue || null,
      monetizationMethods: Array.isArray(body.monetizationMethods)
        ? body.monetizationMethods
        : [],

      createdBy: admin._id,
      notes: body.notes || "",
    });

    return new Response(
      JSON.stringify({
        success: true,
        message: "Tendance ajoutée avec succès",
        trend,
      }),
      { status: 201 }
    );

  } catch (err) {
    console.error("Erreur CREATE tendance:", err);
    return new Response(
      JSON.stringify({ success: false, message: "Erreur serveur" }),
      { status: 500 }
    );
  }
}