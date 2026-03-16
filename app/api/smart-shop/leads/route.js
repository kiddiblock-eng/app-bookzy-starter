// app/api/smart-shop/leads/route.js
// API pour gérer les leads

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Lead from "@/models/Lead";
import Shop from "@/models/Shop";
import ShopProduct from "@/models/ShopProduct";
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

// GET - Récupérer les leads du vendeur
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

    const { searchParams } = new URL(req.url);
    const page = parseInt(searchParams.get("page") || "1");
    const limit = parseInt(searchParams.get("limit") || "50");
    const status = searchParams.get("status");
    const productId = searchParams.get("productId");

    // Construire le filtre
    const filter = { userId };
    if (status) filter.status = status;
    if (productId) filter.productId = productId;

    // Compter le total
    const total = await Lead.countDocuments(filter);

    // Récupérer les leads avec pagination
    const leads = await Lead.find(filter)
      .sort({ createdAt: -1 })
      .skip((page - 1) * limit)
      .limit(limit)
      .lean();

    // Stats rapides
    const stats = await Lead.aggregate([
      { $match: { userId: new mongoose.Types.ObjectId(userId) } },
      {
        $group: {
          _id: null,
          total: { $sum: 1 },
          new: { $sum: { $cond: [{ $eq: ["$status", "new"] }, 1, 0] } },
          contacted: { $sum: { $cond: [{ $eq: ["$status", "contacted"] }, 1, 0] } },
          converted: { $sum: { $cond: [{ $eq: ["$status", "converted"] }, 1, 0] } },
        },
      },
    ]);

    return NextResponse.json({
      success: true,
      leads,
      pagination: {
        page,
        limit,
        total,
        pages: Math.ceil(total / limit),
      },
      stats: stats[0] || { total: 0, new: 0, contacted: 0, converted: 0 },
    });
  } catch (error) {
    console.error("❌ [Leads] Erreur GET:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un lead (appelé depuis la page publique)
export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();
    const { shopId, productId, contact, source } = data;

    // Validation
    if (!shopId || !productId || !contact) {
      return NextResponse.json(
        { success: false, error: "Données manquantes" },
        { status: 400 }
      );
    }

    // Vérifier que la boutique existe
    const shop = await Shop.findById(shopId);
    if (!shop) {
      return NextResponse.json(
        { success: false, error: "Boutique introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que le produit existe
    const product = await ShopProduct.findById(productId);
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produit introuvable" },
        { status: 404 }
      );
    }

    // Détecter le type de contact
    let contactType = "email";
    const cleanContact = contact.trim();
    
    if (/^[\d\s\+\-]+$/.test(cleanContact) && cleanContact.replace(/\D/g, '').length >= 8) {
      contactType = cleanContact.includes("whatsapp") ? "whatsapp" : "phone";
    } else if (cleanContact.includes("@")) {
      contactType = "email";
    } else if (/^\d/.test(cleanContact)) {
      contactType = "phone";
    }

    // Vérifier si ce lead existe déjà (même contact + même produit dans les dernières 24h)
    const existingLead = await Lead.findOne({
      productId,
      contact: cleanContact,
      createdAt: { $gte: new Date(Date.now() - 24 * 60 * 60 * 1000) },
    });

    if (existingLead) {
      // Lead déjà capturé récemment, on retourne OK sans créer de doublon
      return NextResponse.json({
        success: true,
        lead: existingLead,
        message: "Lead existant",
      });
    }

    // Créer le lead
    const lead = await Lead.create({
      shopId: shop._id,
      userId: shop.userId,
      productId: product._id,
      contact: cleanContact,
      contactType,
      source: source || "free",
      productTitle: product.title,
      productPrice: product.price || 0,
      metadata: {
        userAgent: req.headers.get("user-agent") || "",
        referrer: req.headers.get("referer") || "",
      },
    });

    console.log(`✅ [Lead] Nouveau lead capturé: ${cleanContact} pour ${product.title}`);

    return NextResponse.json({
      success: true,
      lead,
      message: "Lead capturé",
    });
  } catch (error) {
    console.error("❌ [Leads] Erreur POST:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// Import mongoose pour l'aggregation
import mongoose from "mongoose";