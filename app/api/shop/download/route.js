// app/api/shop/download/route.js
// API pour télécharger un fichier acheté

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import ShopSale from "@/models/ShopSale";
import ShopProduct from "@/models/ShopProduct";

// GET - Télécharger le fichier
export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const saleId = searchParams.get("saleId");
    const token = searchParams.get("token");

    if (!saleId) {
      return NextResponse.json(
        { success: false, error: "Paramètres manquants" },
        { status: 400 }
      );
    }

    // Récupérer la vente
    const sale = await ShopSale.findById(saleId);
    
    if (!sale) {
      return NextResponse.json(
        { success: false, error: "Achat introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que le paiement est complété
    if (sale.status !== "completed") {
      return NextResponse.json(
        { success: false, error: "Paiement non confirmé" },
        { status: 400 }
      );
    }

    // Vérifier l'expiration du lien
    if (sale.delivery.linkExpiresAt && new Date() > new Date(sale.delivery.linkExpiresAt)) {
      return NextResponse.json(
        { success: false, error: "Ce lien a expiré. Contactez le vendeur pour obtenir un nouveau lien." },
        { status: 410 }
      );
    }

    // Récupérer le produit
    const product = await ShopProduct.findById(sale.productId);
    
    if (!product) {
      return NextResponse.json(
        { success: false, error: "Produit introuvable" },
        { status: 404 }
      );
    }

    // Vérifier que le fichier existe
    if (!product.file?.url) {
      return NextResponse.json(
        { success: false, error: "Fichier non disponible" },
        { status: 404 }
      );
    }

    // Incrémenter le compteur de téléchargements
    sale.delivery.downloadCount = (sale.delivery.downloadCount || 0) + 1;
    sale.delivery.status = "downloaded";
    sale.delivery.downloadedAt = new Date();
    await sale.save();

    console.log(`📥 [Shop Download] Téléchargement: ${product.title} (${sale.delivery.downloadCount}x)`);

    // Rediriger vers le fichier
    // Option 1: Redirection directe
    return NextResponse.redirect(product.file.url);

    // Option 2: Proxy le fichier (plus sécurisé mais plus lourd)
    // const response = await fetch(product.file.url);
    // const blob = await response.blob();
    // return new NextResponse(blob, {
    //   headers: {
    //     "Content-Type": product.file.type || "application/octet-stream",
    //     "Content-Disposition": `attachment; filename="${product.file.name || product.title}"`,
    //   },
    // });

  } catch (error) {
    console.error("❌ [Shop Download] Erreur:", error);
    return NextResponse.json(
      { success: false, error: "Erreur lors du téléchargement" },
      { status: 500 }
    );
  }
}