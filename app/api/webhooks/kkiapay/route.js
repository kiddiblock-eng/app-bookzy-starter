export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Settings from "@/models/settings";
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

    console.log("📩 Webhook KkiaPay:", payload);

    const provider = new KkiaPayProvider(kkiapayConfig);
    const webhookData = await provider.handleWebhook(payload);

    const tx = await Transaction.findOne({ 
      providerTransactionId: webhookData.transactionId,
      provider: 'kkiapay'
    });

    if (!tx) {
      console.warn("⚠️ Transaction introuvable:", webhookData.transactionId);
      return NextResponse.json({ success: true });
    }

    tx.status = webhookData.status;
    tx.providerResponse = {
      ...(tx.providerResponse || {}),
      webhook: webhookData.rawResponse,
      lastWebhookAt: new Date(),
    };

    if (webhookData.status === 'completed') {
      tx.completedAt = new Date();
      console.log("💰 Paiement confirmé:", tx.internalId);
    }

    await tx.save();

    // Email uniquement
    if (webhookData.status === 'completed' && tx.userId) {
      const user = await User.findById(tx.userId);
      if (user) {
        try {
          const html = paymentSuccessTemplate({
            firstName: user.firstName || "cher utilisateur",
            amount: tx.amount,
            transactionId: tx.internalId,
            ebookTitle: tx.kitData?.title || "Ton eBook",
          });

          await resend.emails.send({
            from: "Bookzy <no-reply@bookzy.io>",
            to: user.email,
            subject: "🎉 Paiement confirmé - Bookzy",
            html,
          });
        } catch (e) {
          console.error("❌ Email:", e);
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook ERR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}