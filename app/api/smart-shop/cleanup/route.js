// app/api/smart-shop/cleanup/route.js
// API pour nettoyer les ShopProducts en double

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

// POST - Nettoyer les doublons
export async function POST(req) {
  try {
    await dbConnect();

    const userId = getUserIdFromCookie(req);
    if (!userId) {
      return NextResponse.json(
        { success: false, error: "Non authentifié" },
        { status: 401 }
      );
    }

    // Récupérer tous les ShopProducts de l'utilisateur
    const allProducts = await ShopProduct.find({ userId }).sort({ createdAt: -1 });
    
    console.log(`🧹 [Cleanup] ${allProducts.length} produits trouvés pour userId: ${userId}`);

    const toDelete = [];
    const seen = new Set();

    for (const product of allProducts) {
      // Clé unique : ebookId si existe, sinon titre
      const key = product.ebookId || product.title;
      
      if (seen.has(key)) {
        // Doublon - marquer pour suppression
        toDelete.push(product._id);
        console.log(`  ❌ Doublon à supprimer: ${product.title} (${product._id})`);
      } else {
        seen.add(key);
        console.log(`  ✅ Garder: ${product.title} (${product._id}) - ebookId: ${product.ebookId || 'null'}`);
      }
    }

    // Supprimer les doublons
    if (toDelete.length > 0) {
      await ShopProduct.deleteMany({ _id: { $in: toDelete } });
      console.log(`🗑️ [Cleanup] ${toDelete.length} doublons supprimés`);
    }

    // Compter les produits restants
    const remaining = await ShopProduct.countDocuments({ userId });

    return NextResponse.json({
      success: true,
      message: `Nettoyage terminé. ${toDelete.length} doublons supprimés. ${remaining} produits restants.`,
      deleted: toDelete.length,
      remaining,
    });
  } catch (error) {
    console.error("❌ [Cleanup] Erreur:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// GET - Voir l'état actuel ou nettoyer avec ?clean=true
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

    const url = new URL(req.url);
    const shouldClean = url.searchParams.get('clean') === 'true';

    if (shouldClean) {
      // Nettoyer les doublons
      const allProducts = await ShopProduct.find({ userId }).sort({ createdAt: -1 });
      
      const toDelete = [];
      const seen = new Set();

      for (const product of allProducts) {
        const key = product.ebookId || product.title;
        
        if (seen.has(key)) {
          toDelete.push(product._id);
        } else {
          seen.add(key);
        }
      }

      if (toDelete.length > 0) {
        await ShopProduct.deleteMany({ _id: { $in: toDelete } });
      }

      const remaining = await ShopProduct.find({ userId }).select('title ebookId isActive price').lean();

      return NextResponse.json({
        success: true,
        message: `✅ Nettoyage terminé ! ${toDelete.length} doublons supprimés.`,
        deleted: toDelete.length,
        remaining: remaining.length,
        products: remaining
      });
    }

    // Juste afficher
    const products = await ShopProduct.find({ userId }).select('title ebookId isActive price createdAt').lean();
    
    return NextResponse.json({
      success: true,
      count: products.length,
      products: products.map(p => ({
        _id: p._id,
        title: p.title,
        ebookId: p.ebookId || null,
        isActive: p.isActive,
        price: p.price,
        createdAt: p.createdAt
      }))
    });
  } catch (error) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}