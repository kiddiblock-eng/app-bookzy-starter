import { dbConnect } from "../../../../lib/db";
import User from "../../../../models/User";
import jwt from "jsonwebtoken";

// GET - Récupérer les favoris
export async function GET(request) {
  try {
    await dbConnect();

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
      console.log("🔍 GET favorites - Token décodé:", decoded); // DEBUG
    } catch (err) {
      console.error("❌ JWT verify error:", err);
      return Response.json({ success: false, error: "Session expirée" }, { status: 401 });
    }

    const userId = decoded.userId || decoded.id || decoded._id;
    console.log("🔍 GET favorites - userId extrait:", userId);

    if (!userId) {
      return Response.json({ success: false, error: "userId manquant dans token" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ success: false, error: "Utilisateur non trouvé" }, { status: 404 });
    }

    return Response.json({
      success: true,
      favorites: user.favorites || [],
    });
  } catch (error) {
    console.error("❌ Erreur GET /api/trends/favorites:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST - Ajouter/Retirer un favori
export async function POST(request) {
  try {
    await dbConnect();

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
      console.log("🔍 POST favorites - Token décodé:", decoded); // DEBUG
    } catch (err) {
      console.error("❌ JWT verify error:", err);
      return Response.json({ success: false, error: "Session expirée" }, { status: 401 });
    }

    const { trendId, action } = await request.json();

    console.log("🔍 POST favorites - trendId:", trendId);
    console.log("🔍 POST favorites - action:", action);

    const userId = decoded.userId || decoded.id || decoded._id;
    console.log("🔍 POST favorites - userId extrait:", userId);

    if (!userId) {
      return Response.json({ success: false, error: "userId manquant dans token" }, { status: 401 });
    }

    const user = await User.findById(userId);
    if (!user) {
      return Response.json({ success: false, error: "Utilisateur non trouvé" }, { status: 404 });
    }

    if (!user.favorites) {
      user.favorites = [];
    }

    console.log("🔍 Favoris AVANT:", user.favorites);

    if (action === "add") {
      if (!user.favorites.some((id) => id.toString() === trendId)) {
        user.favorites.push(trendId);
      }
    } else if (action === "remove") {
      user.favorites = user.favorites.filter((id) => id.toString() !== trendId);
    }

    await user.save();

    console.log("✅ Favoris APRÈS:", user.favorites);

    return Response.json({
      success: true,
      favorites: user.favorites,
      message: action === "add" ? "Ajouté aux favoris" : "Retiré des favoris",
    });
  } catch (error) {
    console.error("❌ Erreur POST /api/trends/favorites:", error);
    return Response.json({ success: false, error: error.message }, { status: 500 });
  }
}
