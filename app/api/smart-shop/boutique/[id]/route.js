// app/api/smart-shop/produits/[id]/route.js
// API pour gérer un produit spécifique

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
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

// GET - Récupérer un produit
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;

    const product = await ShopProduct.findOne({ _id: id, userId }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produit introuvable" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      product,
    });
  } catch (error) {
    console.error("❌ [Smart Shop] Erreur GET produit:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Modifier un produit
export async function PUT(req, { params }) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;
    const data = await req.json();

    // Vérifier que le produit appartient à l'utilisateur
    const product = await ShopProduct.findOne({ _id: id, userId });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produit introuvable" },
        { status: 404 }
      );
    }

    const {
      title,
      description,
      price,
      comparePrice,
      type,
      file,
      cover,
      images,
      category,
      isActive,
      isFeatured,
      stockLimit,
    } = data;

    // Validation
    if (title !== undefined) {
      if (!title || title.trim().length < 2) {
        return NextResponse.json(
          { success: false, error: "Le titre est requis (min 2 caractères)" },
          { status: 400 }
        );
      }
      product.title = title.trim();
    }

    if (price !== undefined) {
      if (price < 100) {
        return NextResponse.json(
          { success: false, error: "Le prix minimum est de 100 FCFA" },
          { status: 400 }
        );
      }
      product.price = Math.round(price);
    }

    if (description !== undefined) product.description = description?.trim() || "";
    if (comparePrice !== undefined) product.comparePrice = comparePrice ? Math.round(comparePrice) : null;
    if (type !== undefined) product.type = type;
    if (cover !== undefined) product.cover = cover;
    if (images !== undefined) product.images = images;
    if (category !== undefined) product.category = category?.trim() || "";
    if (isActive !== undefined) product.isActive = isActive;
    if (isFeatured !== undefined) product.isFeatured = isFeatured;
    if (stockLimit !== undefined) product.stockLimit = stockLimit;

    if (file && file.url) {
      product.file = {
        url: file.url,
        name: file.name || product.file.name,
        size: file.size || product.file.size,
        type: file.type || product.file.type,
      };
    }

    await product.save();

    console.log(`✅ [Smart Shop] Produit mis à jour: ${product.title}`);

    return NextResponse.json({
      success: true,
      product,
      message: "Produit mis à jour",
    });
  } catch (error) {
    console.error("❌ [Smart Shop] Erreur PUT produit:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// DELETE - Supprimer un produit
export async function DELETE(req, { params }) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    const { id } = params;

    // Vérifier que le produit appartient à l'utilisateur
    const product = await ShopProduct.findOne({ _id: id, userId });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produit introuvable" },
        { status: 404 }
      );
    }

    // Supprimer le produit
    await ShopProduct.findByIdAndDelete(id);

    // Mettre à jour les stats de la boutique
    await Shop.findOneAndUpdate(
      { userId },
      { $inc: { "stats.totalProducts": -1 } }
    );

    console.log(`✅ [Smart Shop] Produit supprimé: ${product.title}`);

    return NextResponse.json({
      success: true,
      message: "Produit supprimé",
    });
  } catch (error) {
    console.error("❌ [Smart Shop] Erreur DELETE produit:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}