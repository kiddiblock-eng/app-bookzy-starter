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

    // 🔥 FIX : Traiter le projet et envoyer l'email
    if (paid) {
      console.log("💰 Paiement confirmé, déclenchement génération...");
      
      // Déclencher la génération du projet
      if (tx.projetId) {
        const projet = await Projet.findById(tx.projetId);
        if (projet) {
          projet.isPaid = true;
          projet.status = 'processing'; // 🔥 DÉCLENCHE LA GÉNÉRATION
          projet.transactionId = tx._id.toString();
          await projet.save();
          console.log("✅ Projet mis en status 'processing':", projet._id);
        }
      }

      // Envoyer l'email de confirmation
      if (tx.userId) {
        const user = await User.findById(tx.userId);
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
            console.log("✅ Email envoyé à:", user.email);
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