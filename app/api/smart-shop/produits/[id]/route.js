// app/api/smart-shop/produits/[id]/route.js
// API pour gérer un produit spécifique

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
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

    const { id } = await params;
    const product = await ShopProduct.findOne({ _id: id, userId }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, product });
  } catch (error) {
    console.error("❌ [Produit] Erreur GET:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// PUT - Mettre à jour un produit
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

    const { id } = await params;
    const product = await ShopProduct.findOne({ _id: id, userId });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    const data = await req.json();

    console.log(`📝 [Produit] Update ${id}:`, data);

    // Mise à jour des champs si présents
    if (data.title !== undefined) product.title = data.title;
    if (data.description !== undefined) product.description = data.description;
    if (data.price !== undefined) product.price = data.price;
    if (data.comparePrice !== undefined) product.comparePrice = data.comparePrice;
    if (data.cover !== undefined) product.cover = data.cover;
    if (data.isActive !== undefined) product.isActive = data.isActive;
    if (data.isFeatured !== undefined) product.isFeatured = data.isFeatured;
    if (data.order !== undefined) product.order = data.order;
    
    // Options de checkout
    if (data.checkoutType !== undefined) product.checkoutType = data.checkoutType;
    if (data.whatsappNumber !== undefined) product.whatsappNumber = data.whatsappNumber;
    if (data.whatsappMessage !== undefined) product.whatsappMessage = data.whatsappMessage;
    if (data.externalLink !== undefined) product.externalLink = data.externalLink;
    if (data.buttonText !== undefined) product.buttonText = data.buttonText;

    // Nouveaux champs pour la page produit
    if (data.fomo !== undefined) product.fomo = data.fomo;
    if (data.faqs !== undefined) product.faqs = data.faqs;
    if (data.testimonials !== undefined) product.testimonials = data.testimonials;

    await product.save();

    console.log(`✅ [Produit] ${product.title} - isActive: ${product.isActive}`);

    return NextResponse.json({
      success: true,
      product,
      message: "Produit mis à jour",
    });
  } catch (error) {
    console.error("❌ [Produit] Erreur PUT:", error);
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

    const { id } = await params;
    const product = await ShopProduct.findOneAndDelete({ _id: id, userId });

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produit non trouvé" },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Produit supprimé",
    });
  } catch (error) {
    console.error("❌ [Produit] Erreur DELETE:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}