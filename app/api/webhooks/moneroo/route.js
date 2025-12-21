export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Settings from "@/models/settings";
import Projet from "@/models/Projet";
import User from "@/models/User";
import { Resend } from "resend";
import { paymentSuccessTemplate } from "@/lib/emailTemplates/paymentSuccessTemplate";
import MonerooProvider from "@/lib/payment/providers/MonerooProvider";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) { 
  const resend = new Resend(process.env.RESEND_API_KEY);
  const resend = new Resend(process.env.RESEND_API_KEY);
  try {
    await dbConnect();

    const settings = await Settings.findOne({ key: "global" }).lean();
    const monerooConfig = settings?.payment?.moneroo;

    // Vérifier la signature avec le provider
    const payload = await req.json();
    const signature = req.headers.get("x-moneroo-signature") || req.headers.get("x-webhook-secret");

    if (monerooConfig?.webhookSecret && signature !== monerooConfig.webhookSecret) {
      console.warn("⚠️ Signature webhook invalide");
      return NextResponse.json({ success: false }, { status: 401 });
    }

    console.log("📩 Webhook Moneroo:", payload);

    const provider = new MonerooProvider(monerooConfig);
    
    let webhookData;
    try {
      webhookData = await provider.handleWebhook(payload, signature);
    } catch (error) {
      console.error('Moneroo webhook verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Récupérer le transactionId depuis metadata
    const txId = payload?.metadata?.transactionId || payload?.data?.metadata?.transactionId;

    if (!txId) {
      console.warn("⚠️ Webhook sans transactionId");
      return NextResponse.json({ success: true });
    }

    // Trouver la transaction
    const tx = await Transaction.findOne({ 
      $or: [
        { internalId: txId },
        { providerTransactionId: webhookData.transactionId }
      ],
      provider: 'moneroo'
    });

    if (!tx) {
      console.warn("⚠️ Transaction introuvable:", txId);
      return NextResponse.json({ success: true });
    }

    // Mettre à jour le statut
    tx.status = webhookData.status;
    tx.providerResponse = {
      ...(tx.providerResponse || {}),
      webhook: webhookData.rawResponse,
      lastWebhookAt: new Date(),
    };

    const paid = webhookData.status === 'completed';

    if (paid) {
      tx.completedAt = new Date();
      console.log("💰 Paiement confirmé:", tx.internalId || tx._id);
    } else if (webhookData.status === 'failed') {
      console.log("❌ Paiement échoué:", tx.internalId || tx._id);
    }

    await tx.save();

    // Traiter le projet et envoyer l'email si paiement réussi
    if (paid) {
      const projetId = payload?.metadata?.projetId || payload?.data?.metadata?.projetId;
      const userId = payload?.metadata?.userId || payload?.data?.metadata?.userId;

      if (projetId) {
        const projet = await Projet.findById(projetId);
        if (projet) {
          projet.isPaid = true;
          projet.updatedAt = new Date();
          projet.transactionId = tx.internalId || tx._id;
          await projet.save();
        }
      }

      if (userId) {
        const user = await User.findById(userId);
        if (user) {
          try {
            const html = paymentSuccessTemplate({
              firstName: user.firstName || "cher utilisateur",
              amount: tx.amount,
              transactionId: tx.internalId || tx._id,
              ebookTitle: tx.kitData?.title || "Ton eBook",
            });

            await resend.emails.send({
              from: "Bookzy <no-reply@bookzy.io>",
              to: user.email,
              subject: "🎉 Paiement confirmé - Bookzy",
              html,
            });
          } catch (e) {
            console.error("❌ Email échoué:", e);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook Moneroo ERR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}