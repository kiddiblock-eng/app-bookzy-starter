// app/api/shop/[username]/route.js
// API publique pour récupérer une boutique et ses produits

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopProduct from "@/models/ShopProduct";

// GET - Récupérer la boutique publique
export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { username } = params;

    if (!username) {
      return NextResponse.json(
        { success: false, error: "Username requis" },
        { status: 400 }
      );
    }

    // Trouver la boutique par slug
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

    // Incrémenter les vues
    await Shop.findByIdAndUpdate(shop._id, {
      $inc: { "stats.totalViews": 1 },
    });

    // Récupérer les produits actifs
    const products = await ShopProduct.find({
      shopId: shop._id,
      isActive: true,
    })
      .select("-file.url") // Ne pas exposer l'URL du fichier
      .sort({ isFeatured: -1, order: 1, createdAt: -1 })
      .lean();

    // Nettoyer les données sensibles
    const publicShop = {
      _id: shop._id,
      name: shop.name,
      slug: shop.slug,
      bio: shop.bio,
      logo: shop.logo,
      banner: shop.banner,
      theme: shop.theme,
      socials: shop.socials,
      currency: shop.currency,
      stats: {
        totalProducts: products.length,
        totalSales: shop.stats?.totalSales || 0,
      },
      isVerified: shop.isVerified,
    };

    // Nettoyer les produits (enlever les infos sensibles)
    const publicProducts = products.map((p) => ({
      _id: p._id,
      title: p.title,
      description: p.description,
      price: p.price,
      comparePrice: p.comparePrice,
      type: p.type,
      cover: p.cover,
      images: p.images,
      category: p.category,
      isFeatured: p.isFeatured,
      checkoutType: p.checkoutType,
      buttonText: p.buttonText,
      stats: {
        sales: p.stats?.sales || 0,
      },
      slug: p.slug,
    }));

    return NextResponse.json({
      success: true,
      shop: publicShop,
      products: publicProducts,
    });
  } catch (error) {
    console.error("❌ [Shop Public] Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur serveur" },
      { status: 500 }
    );
  }
}