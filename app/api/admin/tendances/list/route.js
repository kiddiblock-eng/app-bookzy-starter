import { dbConnect } from "@/lib/db";
import Trend from "@/models/Trend";
import { verifyAdmin } from "@/lib/auth";

export async function GET(req) {
  try {
    await dbConnect();

    // Vérification admin
    const admin = await verifyAdmin(req);
    if (!admin) {
      return new Response(
        JSON.stringify({ success: false, message: "Accès non autorisé" }),
        { status: 403 }
      );
    }

    const { searchParams } = new URL(req.url);

    // Pagination
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const skip = (page - 1) * limit;

    // Filtres optionnels
    const search = searchParams.get("search") || "";
    const network = searchParams.get("network") || "";
    const category = searchParams.get("category") || "";
    const tag = searchParams.get("tag") || "";

    let query = {};

    if (search) {
      query.$or = [
        { title: new RegExp(search, "i") },
        { description: new RegExp(search, "i") },
        { tags: new RegExp(search, "i") },
      ];
    }

    if (network) query.network = network;
    if (category) query.categories = category;
    if (tag) query.tags = tag;

    // Récupération
    const trends = await Trend.find(query)
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit)
      .lean();

    const total = await Trend.countDocuments(query);

    return new Response(
      JSON.stringify({
        success: true,
        trends,
        pagination: {
          total,
          page,
          limit,
          pages: Math.ceil(total / limit),
        },
      }),
      { status: 200 }
    );

  } catch (err) {
    console.error("Erreur GET tendances:", err);
    return new Response(
      JSON.stringify({
        success: false,
        message: "Erreur serveur",
      }),
      { status: 500 }
    );
  }
}