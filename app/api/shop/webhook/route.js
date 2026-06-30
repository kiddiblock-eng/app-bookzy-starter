// app/api/shop/webhook/route.js
// Webhook Moneroo pour confirmer les paiements Smart Shop

export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Shop from "@/models/Shop";
import ShopProduct from "@/models/ShopProduct";
import ShopSale from "@/models/ShopSale";
import Settings from "@/models/settings";
import MonerooProvider from "@/lib/payment/providers/MonerooProvider";
import crypto from "crypto";

// Fonction pour envoyer l'email avec le lien de téléchargement
async function sendDeliveryEmail(sale, product, shop) {
  try {
    // Générer un lien de téléchargement sécurisé (expire dans 72h)
    const token = crypto.randomBytes(32).toString("hex");
    const expiresAt = new Date();
    expiresAt.setHours(expiresAt.getHours() + 72);

    const downloadLink = `${process.env.NEXT_PUBLIC_APP_URL}/api/shop/download?token=${token}&saleId=${sale._id}`;

    // Sauvegarder le lien dans la vente
    sale.delivery.downloadLink = downloadLink;
    sale.delivery.linkExpiresAt = expiresAt;
    sale.delivery.status = "sent";
    sale.delivery.sentAt = new Date();
    await sale.save();

    // Envoyer l'email via Resend ou autre service
    const emailContent = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <div style="text-align: center; margin-bottom: 30px;">
          <h1 style="color: #1a1a1a; margin: 0;">Merci pour votre achat ! 🎉</h1>
        </div>
        
        <div style="background: #f8fafc; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
          <h2 style="color: #374151; margin: 0 0 16px 0; font-size: 18px;">Votre commande</h2>
          <div style="display: flex; gap: 16px; align-items: center;">
            ${product.cover ? `<img src="${product.cover}" alt="${product.title}" style="width: 80px; height: 80px; object-fit: cover; border-radius: 8px;" />` : ""}
            <div>
              <p style="margin: 0 0 4px 0; font-weight: bold; color: #1a1a1a;">${product.title}</p>
              <p style="margin: 0; color: #6b7280;">Vendu par ${shop.name}</p>
              <p style="margin: 8px 0 0 0; font-weight: bold; color: #6366f1;">${sale.amount.toLocaleString()} FCFA</p>
            </div>
          </div>
        </div>
        
        <div style="text-align: center; margin-bottom: 24px;">
          <a href="${downloadLink}" 
             style="display: inline-block; background: #6366f1; color: white; padding: 16px 32px; border-radius: 8px; text-decoration: none; font-weight: bold; font-size: 16px;">
            📥 Télécharger mon fichier
          </a>
          <p style="color: #9ca3af; font-size: 14px; margin-top: 12px;">
            Ce lien expire dans 72 heures
          </p>
        </div>
        
        <div style="border-top: 1px solid #e5e7eb; padding-top: 20px; text-align: center; color: #9ca3af; font-size: 12px;">
          <p>Besoin d'aide ? Contactez ${shop.name}</p>
          <p style="margin-top: 8px;">Propulsé par <a href="https://bookzy.io" style="color: #6366f1;">Bookzy</a></p>
        </div>
      </div>
    `;

    // Si tu as Resend configuré
    if (process.env.RESEND_API_KEY) {
      const { Resend } = await import("resend");
      const resend = new Resend(process.env.RESEND_API_KEY);

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "Bookzy <noreply@bookzy.io>",
        to: sale.buyer.email,
        subject: `🎉 Votre achat : ${product.title}`,
        html: emailContent,
      });

      console.log(`📧 [Shop] Email envoyé à ${sale.buyer.email}`);
    } else {
      console.log(`⚠️ [Shop] Resend non configuré, email non envoyé`);
    }

    return true;
  } catch (error) {
    console.error("❌ [Shop] Erreur envoi email:", error);
    return false;
  }
}

// POST - Webhook Moneroo
export async function POST(req) {
  try {
    await dbConnect();

    const body = await req.json();
    console.log("🔔 [Shop Webhook] Reçu");

    // 🔒 SÉCURITÉ : on NE fait PAS confiance au corps du webhook.
    // On re-vérifie le paiement directement auprès de l'API Moneroo
    // (un attaquant ne peut pas forger un paiement : l'ID est vérifié à la source).
    const webhookDataRaw = body.data || body;
    const monerooTransactionId = webhookDataRaw.id;
    if (!monerooTransactionId) {
      console.log("❌ [Shop Webhook] ID de transaction manquant");
      return NextResponse.json({ received: true });
    }

    const settings = await Settings.findOne({ key: "global" }).lean();
    const provider = new MonerooProvider(settings?.payment?.moneroo);
    const verifiedData = await provider.verifyPayment(monerooTransactionId);

    if (verifiedData?.status !== "completed") {
      console.log(`ℹ️ [Shop Webhook] Paiement non confirmé par Moneroo (${verifiedData?.status})`);
      return NextResponse.json({ received: true });
    }

    // On utilise les métadonnées VÉRIFIÉES (renvoyées par l'API), pas le corps brut
    const metadata = verifiedData.metadata || webhookDataRaw.metadata || {};

    if (metadata.type !== "smart_shop") {
      console.log("ℹ️ [Shop Webhook] Pas un paiement Smart Shop");
      return NextResponse.json({ received: true });
    }

    const saleId = metadata.saleId;
    if (!saleId) {
      console.log("❌ [Shop Webhook] saleId manquant");
      return NextResponse.json({ received: true });
    }

    // Récupérer la vente
    const sale = await ShopSale.findById(saleId);
    if (!sale) {
      console.log(`❌ [Shop Webhook] Vente introuvable: ${saleId}`);
      return NextResponse.json({ received: true });
    }

    // Vérifier si déjà traitée (idempotence)
    if (sale.status === "completed") {
      console.log(`ℹ️ [Shop Webhook] Vente déjà traitée: ${saleId}`);
      return NextResponse.json({ received: true });
    }

    // Mettre à jour la vente
    sale.status = "completed";
    sale.completedAt = new Date();
    sale.payment.method = paymentData.method || paymentData.payment_method || "";
    await sale.save();

    // Récupérer le produit et la boutique
    const product = await ShopProduct.findById(sale.productId);
    const shop = await Shop.findById(sale.shopId);

    if (product && shop) {
      // Mettre à jour les stats du produit
      await ShopProduct.findByIdAndUpdate(product._id, {
        $inc: {
          "stats.sales": 1,
          "stats.revenue": sale.netAmount,
        },
      });

      // Mettre à jour les stats et le solde de la boutique
      await Shop.findByIdAndUpdate(shop._id, {
        $inc: {
          "stats.totalSales": 1,
          "stats.totalRevenue": sale.amount,
          balance: sale.netAmount, // Ajouter au solde
        },
      });

      // Envoyer l'email avec le fichier
      await sendDeliveryEmail(sale, product, shop);

      console.log(`✅ [Shop Webhook] Vente confirmée: ${product.title} - ${sale.amount} FCFA`);
      console.log(`💰 [Shop Webhook] Net vendeur: ${sale.netAmount} FCFA (commission: ${sale.commission.amount} FCFA)`);
    }

    return NextResponse.json({ 
      received: true,
      saleId: sale._id,
      status: "completed",
    });
  } catch (error) {
    console.error("❌ [Shop Webhook] Erreur:", error);
    return NextResponse.json(
      { error: error.message },
      { status: 500 }
    );
  }
}