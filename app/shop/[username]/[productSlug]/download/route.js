// app/shop/[username]/[productSlug]/download/route.js
// Route pour télécharger un produit gratuit

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopProduct from "@/models/ShopProduct";

export async function GET(req, { params }) {
  try {
    await dbConnect();

    const { username, productSlug } = await params;

    // Trouver la boutique
    const shop = await Shop.findOne({ 
      slug: username.toLowerCase(),
      isActive: true,
    }).lean();

    if (!shop) {
      return NextResponse.redirect(new URL("/404", req.url));
    }

    // Trouver le produit
    const product = await ShopProduct.findOne({
      shopId: shop._id,
      slug: productSlug,
      isActive: true,
    }).lean();

    if (!product) {
      return NextResponse.redirect(new URL(`/shop/${username}`, req.url));
    }

    // Vérifier que c'est bien un produit gratuit
    if (product.checkoutType !== "free") {
      return NextResponse.redirect(new URL(`/shop/${username}/${productSlug}`, req.url));
    }

    // Vérifier que le fichier existe
    if (!product.file?.url) {
      return NextResponse.json(
        { error: "Fichier non disponible" },
        { status: 404 }
      );
    }

    // Incrémenter les stats de ventes (même si gratuit)
    await ShopProduct.findByIdAndUpdate(product._id, {
      $inc: { "stats.sales": 1 },
    });

    // Rediriger vers le fichier
    return NextResponse.redirect(product.file.url);

  } catch (error) {
    console.error("❌ [Download] Erreur:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}