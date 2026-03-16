// app/api/smart-shop/produits/route.js
// API pour lister et créer des produits

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import ShopProduct from "@/models/ShopProduct";
import Shop from "@/models/Shop";
import Projet from "@/models/Projet";
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

// GET - Lister les produits de l'utilisateur (ShopProduct + Projets terminés)
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

    // 1. Récupérer les produits créés dans ShopProduct
    const shopProducts = await ShopProduct.find({ userId })
      .sort({ createdAt: -1 })
      .lean();

    // 2. Récupérer les projets COMPLETED avec un PDF
    const projets = await Projet.find({ 
      userId, 
      status: "COMPLETED",
      pdfUrl: { $exists: true, $ne: "", $ne: null }
    })
      .sort({ createdAt: -1 })
      .lean();

    console.log(`📚 [Produits] User ${userId}: ${shopProducts.length} ShopProducts, ${projets.length} Projets COMPLETED`);

    // 3. Trouver les projets déjà liés à un ShopProduct
    const linkedProjetIds = shopProducts
      .filter(p => p.projetId || p.ebookId)
      .map(p => (p.projetId || p.ebookId).toString());

    // 4. Transformer les projets non liés en format "produit"
    const projetsAsProducts = projets
      .filter(p => !linkedProjetIds.includes(p._id.toString()))
      .map(projet => ({
        _id: `projet_${projet._id}`,
        projetId: projet._id,
        userId: projet.userId,
        title: projet.titre || "Ebook sans titre",
        description: projet.description || "",
        price: 0,
        cover: projet.coverUrl || "",
        file: {
          url: projet.pdfUrl,
          name: `${projet.titre || "ebook"}.pdf`
        },
        checkoutType: "free",
        isActive: false,
        isFromBookzy: true,
        createdAt: projet.createdAt,
        updatedAt: projet.updatedAt,
        pages: projet.pages,
        chapters: projet.chapters,
      }));

    // 5. Fusionner : produits ShopProduct + projets non liés
    const allProducts = [
      ...shopProducts.map(p => ({ ...p, isFromBookzy: !!(p.projetId || p.ebookId) })),
      ...projetsAsProducts
    ].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    return NextResponse.json({
      success: true,
      products: allProducts,
    });
  } catch (error) {
    console.error("❌ [Produits] Erreur GET:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// POST - Créer un nouveau produit (uploadé par l'utilisateur OU depuis un projet)
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

    // Vérifier que l'utilisateur a une boutique
    let shop = await Shop.findOne({ userId });
    if (!shop) {
      return NextResponse.json(
        { success: false, error: "Crée d'abord ta boutique" },
        { status: 400 }
      );
    }

    const data = await req.json();
    const { title, description, price, file, cover, checkoutType, projetId, ebookId } = data;

    // Si c'est un projet Bookzy qu'on ajoute à la boutique
    if (projetId) {
      const projet = await Projet.findOne({ _id: projetId, userId });
      if (!projet) {
        return NextResponse.json(
          { success: false, error: "Projet introuvable" },
          { status: 404 }
        );
      }

      // Vérifier qu'il n'est pas déjà lié
      const existingProduct = await ShopProduct.findOne({ projetId });
      if (existingProduct) {
        return NextResponse.json(
          { success: false, error: "Ce projet est déjà dans ta boutique" },
          { status: 400 }
        );
      }

      // Créer le produit depuis le projet
      const product = await ShopProduct.create({
        userId,
        shopId: shop._id,
        projetId: projet._id,
        title: title || projet.titre || "Ebook sans titre",
        description: description || projet.description || "",
        price: price || 0,
        file: {
          url: projet.pdfUrl,
          name: `${projet.titre || "ebook"}.pdf`
        },
        cover: cover || projet.coverUrl || "",
        checkoutType: checkoutType || (price > 0 ? "link" : "free"),
        isActive: true,
      });

      return NextResponse.json({
        success: true,
        product,
        message: "Projet ajouté à la boutique",
      });
    }

    // Sinon, c'est un produit uploadé manuellement
    if (!title || !title.trim()) {
      return NextResponse.json(
        { success: false, error: "Titre requis" },
        { status: 400 }
      );
    }

    if (!file || !file.url) {
      return NextResponse.json(
        { success: false, error: "Fichier requis" },
        { status: 400 }
      );
    }

    const product = await ShopProduct.create({
      userId,
      shopId: shop._id,
      title: title.trim(),
      description: description || "",
      price: price || 0,
      file: {
        url: file.url,
        name: file.name || "fichier",
      },
      cover: cover || "",
      checkoutType: checkoutType || (price > 0 ? "link" : "free"),
      isActive: true,
    });

    console.log(`✅ [Produit] Nouveau produit créé: ${product.title}`);

    return NextResponse.json({
      success: true,
      product,
      message: "Produit créé",
    });
  } catch (error) {
    console.error("❌ [Produits] Erreur POST:", error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}