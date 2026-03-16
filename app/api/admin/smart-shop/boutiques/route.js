// app/api/admin/smart-shop/boutiques/route.js
// API Admin pour lister toutes les boutiques

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopProduct from "@/models/ShopProduct";
import Lead from "@/models/Lead";
import User from "@/models/User";
import jwt from "jsonwebtoken";

function getUserFromCookie(req) {
  const cookie = req.headers.get("cookie") || "";
  
  // Essayer admin_token d'abord, puis bookzy_token
  const adminToken = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("admin_token="))
    ?.split("=")[1];
    
  const userToken = cookie
    .split(";")
    .map((c) => c.trim())
    .find((c) => c.startsWith("bookzy_token="))
    ?.split("=")[1];

  const token = adminToken || userToken;

  try {
    return jwt.verify(token, process.env.JWT_SECRET) || null;
  } catch {
    return null;
  }
}

// GET - Lister toutes les boutiques
export async function GET(req) {
  try {
    await dbConnect();

    const userData = getUserFromCookie(req);
    if (!userData) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Vérifier que c'est un admin
    const user = await User.findById(userData.id);
    if (!user || user.role !== "admin") {
      return NextResponse.json(
        { success: false, error: "Accès non autorisé" },
        { status: 403 }
      );
    }

    // Paramètres
    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page")) || 1;
    const limit = parseInt(searchParams.get("limit")) || 20;
    const search = searchParams.get("search") || "";
    const status = searchParams.get("status"); // active, inactive

    // Construire le filtre
    const filter = {};
    
    if (search) {
      filter.$or = [
        { name: { $regex: search, $options: "i" } },
        { slug: { $regex: search, $options: "i" } },
      ];
    }

    if (status === "active") {
      filter.isActive = true;
    } else if (status === "inactive") {
      filter.isActive = false;
    }

    // Récupérer les boutiques avec les infos utilisateur
    const shops = await Shop.find(filter)
      .populate("userId", "email firstName lastName")
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Enrichir chaque boutique avec le nombre de produits et leads
    const enrichedShops = await Promise.all(
      shops.map(async (shop) => {
        let totalProducts = 0;
        let totalLeads = 0;
        
        try {
          totalProducts = await ShopProduct.countDocuments({ shopId: shop._id });
        } catch (e) {
          console.log("Erreur count products:", e.message);
        }
        
        try {
          totalLeads = await Lead.countDocuments({ shopId: shop._id });
        } catch (e) {
          console.log("Erreur count leads:", e.message);
        }
        
        return {
          ...shop,
          stats: {
            ...shop.stats,
            totalProducts,
            totalLeads,
          },
        };
      })
    );

    const totalCount = await Shop.countDocuments(filter);

    // Stats globales
    let globalTotalProducts = 0;
    let globalTotalLeads = 0;
    
    try {
      globalTotalProducts = await ShopProduct.countDocuments();
    } catch (e) {}
    
    try {
      globalTotalLeads = await Lead.countDocuments();
    } catch (e) {}

    const globalStats = {
      totalShops: await Shop.countDocuments(),
      activeShops: await Shop.countDocuments({ isActive: true }),
      totalProducts: globalTotalProducts,
      totalLeads: globalTotalLeads,
    };

    return NextResponse.json({
      success: true,
      shops: enrichedShops,
      globalStats,
      pagination: {
        page,
        limit,
        totalCount,
        totalPages: Math.ceil(totalCount / limit),
      },
    });
  } catch (error) {
    console.error("❌ [Admin Smart Shop] Erreur GET boutiques:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}