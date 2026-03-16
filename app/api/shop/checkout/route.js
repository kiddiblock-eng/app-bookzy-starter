// app/api/shop/checkout/route.js
// API pour créer un paiement et acheter un produit

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopProduct from "@/models/ShopProduct";
import ShopSale from "@/models/ShopSale";
import Settings from "@/models/settings";
import MonerooProvider from "@/lib/payment/providers/MonerooProvider";
import crypto from "crypto";

// POST - Créer un paiement
export async function POST(req) {
  try {
    await dbConnect();

    const data = await req.json();
    const { productId, buyerEmail, buyerName, buyerPhone } = data;

    // Validation
    if (!productId) {
      return NextResponse.json(
        { success: false, error: "Produit requis" },
        { status: 400 }
      );
    }

    if (!buyerEmail || !buyerEmail.includes("@")) {
      return NextResponse.json(
        { success: false, error: "Email valide requis" },
        { status: 400 }
      );
    }

    // Récupérer le produit
    const product = await ShopProduct.findById(productId);
    if (!product || !product.isActive) {
      return NextResponse.json(
        { success: false, error: "Produit introuvable ou indisponible" },
        { status: 404 }
      );
    }

    // Vérifier le stock
    if (product.stockLimit !== null && product.stats.sales >= product.stockLimit) {
      return NextResponse.json(
        { success: false, error: "Ce produit n'est plus disponible" },
        { status: 400 }
      );
    }

    // Récupérer la boutique
    const shop = await Shop.findById(product.shopId);
    if (!shop || !shop.isActive) {
      return NextResponse.json(
        { success: false, error: "Boutique introuvable" },
        { status: 404 }
      );
    }

    // Charger les settings de paiement
    const settings = await Settings.findOne({ key: "global" }).lean();
    const monerooConfig = settings?.payment?.moneroo;

    if (!monerooConfig?.apiKey) {
      return NextResponse.json(
        { success: false, error: "Paiement non configuré" },
        { status: 500 }
      );
    }

    const provider = new MonerooProvider(monerooConfig);

    // Créer la vente (en attente)
    const transactionId = `SHOP_${Date.now()}_${crypto.randomBytes(4).toString("hex")}`;

    const sale = await ShopSale.create({
      shopId: shop._id,
      sellerId: shop.userId,
      productId: product._id,
      productSnapshot: {
        title: product.title,
        price: product.price,
        cover: product.cover,
        type: product.type,
      },
      buyer: {
        email: buyerEmail.toLowerCase().trim(),
        name: buyerName || "",
        phone: buyerPhone || "",
      },
      amount: product.price,
      commission: {
        rate: shop.commissionRate || 10,
      },
      payment: {
        provider: "moneroo",
        transactionId,
      },
      status: "pending",
    });

    // URL de retour après paiement
    const returnUrl = `${process.env.NEXT_PUBLIC_APP_URL}/shop/${shop.slug}/success?saleId=${sale._id}`;

    // Créer le paiement Moneroo
    const paymentResult = await provider.createPayment({
      amount: product.price,
      currency: "XOF",
      customerEmail: buyerEmail,
      customerName: buyerName || "Client",
      customerPhone: buyerPhone || "",
      description: `${product.title} - ${shop.name}`,
      returnUrl,
      metadata: {
        type: "smart_shop",
        saleId: sale._id.toString(),
        productId: product._id.toString(),
        shopId: shop._id.toString(),
      },
    });

    if (!paymentResult.success) {
      // Supprimer la vente en cas d'échec
      await ShopSale.findByIdAndDelete(sale._id);
      throw new Error("Erreur création paiement");
    }

    // Mettre à jour la vente avec les infos de paiement
    sale.payment.providerTransactionId = paymentResult.transactionId;
    await sale.save();

    console.log(`✅ [Shop Checkout] Paiement créé pour: ${product.title} - ${product.price} FCFA`);

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.paymentUrl,
      saleId: sale._id.toString(),
    });
  } catch (error) {
    console.error("❌ [Shop Checkout] Erreur:", error);
    return NextResponse.json(
      { success: false, error: error.message || "Erreur lors du paiement" },
      { status: 500 }
    );
  }
}