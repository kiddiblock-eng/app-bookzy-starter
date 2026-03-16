// app/api/shop/[username]/[productSlug]/route.js
// API publique pour récupérer un produit

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopProduct from "@/models/ShopProduct";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { username, productSlug } = await params;

    if (!username || !productSlug) {
      return NextResponse.json(
        { success: false, error: "Paramètres requis" },
        { status: 400 }
      );
    }

    // Trouver la boutique
    const shop = await Shop.findOne({ 
      slug: username.toLowerCase(),
      isActive: true,
    }).lean();

    if (!shop) {
      return NextResponse.json(
        { success: false, error: "Boutique introuvable" },
        { status: 404 }
      );
    }

    // ✅ Bloquer si la boutique n'est pas publiée
    if (!shop.isPublished) {
      return NextResponse.json(
        { success: false, error: "Boutique introuvable" },
        { status: 404 }
      );
    }

    // Trouver le produit
    const product = await ShopProduct.findOne({
      shopId: shop._id,
      slug: productSlug.toLowerCase(),
      isActive: true,
    }).lean();

    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produit introuvable" },
        { status: 404 }
      );
    }

    // Incrémenter les vues du produit
    await ShopProduct.findByIdAndUpdate(product._id, {
      $inc: { "stats.views": 1 },
    });

    // Nettoyer les données sensibles - INCLURE LE THEME
    const publicShop = {
      _id: shop._id,
      name: shop.name,
      slug: shop.slug,
      logo: shop.logo,
      banner: shop.banner,
      currency: shop.currency,
      theme: shop.theme,
      socials: shop.socials,
    };

    const publicProduct = {
      _id: product._id,
      title: product.title,
      description: product.description,
      price: product.price,
      comparePrice: product.comparePrice,
      type: product.type,
      cover: product.cover,
      images: product.images,
      slug: product.slug,
      checkoutType: product.checkoutType,
      buttonText: product.buttonText,
      whatsappNumber: product.whatsappNumber,
      whatsappMessage: product.whatsappMessage,
      externalLink: product.externalLink,
      fomo: product.fomo,
      faqs: product.faqs || [],
      testimonials: product.testimonials || [],
      stats: {
        sales: product.stats?.sales || 0,
        views: product.stats?.views || 0,
      },
    };

    return NextResponse.json({
      success: true,
      shop: publicShop,
      product: publicProduct,
    });
  } catch (error) {
    console.error("❌ [Product Public] Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}