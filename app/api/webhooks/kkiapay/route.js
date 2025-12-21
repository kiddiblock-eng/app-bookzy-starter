export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Settings from "@/models/settings";
import Projet from "@/models/Projet";
import User from "@/models/User";
import { Resend } from "resend";
import { paymentSuccessTemplate } from "@/lib/emailTemplates/paymentSuccessTemplate";
import KkiaPayProvider from "@/lib/payment/providers/KkiaPayProvider";

// const resend = new Resend(process.env.RESEND_API_KEY);

export async function POST(req) { 
  const resend = new Resend(process.env.RESEND_API_KEY); 

  try {
    await dbConnect();

    const settings = await Settings.findOne({ key: "global" }).lean();
    const kkiapayConfig = settings?.payment?.kkiapay;

    const payload = await req.json();
    const signature = req.headers.get("x-kkiapay-signature");

    console.log("📩 Webhook KkiaPay:", payload);

    const provider = new KkiaPayProvider(kkiapayConfig);
    
    let webhookData;
    try {
      webhookData = await provider.handleWebhook(payload, signature);
    } catch (error) {
      console.error('KkiaPay webhook verification failed:', error);
      return NextResponse.json({ error: 'Invalid signature' }, { status: 400 });
    }

    // Trouver la transaction
    const tx = await Transaction.findOne({ 
      providerTransactionId: webhookData.transactionId,
      provider: 'kkiapay'
    });

    if (!tx) {
      console.warn("⚠️ Transaction KkiaPay introuvable:", webhookData.transactionId);
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
      console.log("💰 Paiement KkiaPay confirmé:", tx.internalId || tx._id);
    }

    await tx.save();

    // Traiter le projet et envoyer l'email
    if (paid) {
      const metadata = payload?.metadata;
      const projetId = metadata?.projetId;
      const userId = metadata?.userId;

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
    console.error("❌ Webhook KkiaPay ERR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}