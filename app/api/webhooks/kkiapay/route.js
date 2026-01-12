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
import { processCommission } from "@/utils/affiliation";

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

    console.log("🔍 Webhook data traité:", {
      transactionId: webhookData.transactionId,
      metadata: webhookData.metadata,
      status: webhookData.status
    });

    // 🔥 CHERCHER PAR METADATA D'ABORD !
    let tx;

    // Option 1 : Par metadata (notre internalId)
    if (webhookData.metadata) {
      console.log("🔍 Recherche par metadata:", webhookData.metadata);
      tx = await Transaction.findOne({ 
        internalId: webhookData.metadata,
        provider: 'kkiapay'
      });
      
      if (tx) {
        console.log("✅ Transaction trouvée par metadata:", tx._id);
      }
    }

    // Option 2 : Fallback par providerTransactionId
    if (!tx && webhookData.transactionId) {
      console.log("🔍 Recherche par providerTransactionId:", webhookData.transactionId);
      tx = await Transaction.findOne({ 
        providerTransactionId: webhookData.transactionId,
        provider: 'kkiapay'
      });
      
      if (tx) {
        console.log("✅ Transaction trouvée par providerTransactionId:", tx._id);
      }
    }

    if (!tx) {
      console.warn("⚠️ Transaction introuvable:", {
        metadata: webhookData.metadata,
        transactionId: webhookData.transactionId
      });
      return NextResponse.json({ success: true });
    }

    // ✅ Sauvegarder le providerTransactionId
    tx.providerTransactionId = webhookData.transactionId;
    tx.status = webhookData.status;
    tx.providerResponse = {
      ...(tx.providerResponse || {}),
      webhook: webhookData.rawResponse,
      lastWebhookAt: new Date(),
    };

    // CAS DE SUCCÈS
    if (webhookData.status === 'completed') {
      tx.completedAt = new Date();
      console.log("💰 Paiement confirmé:", tx.internalId);
      
      await tx.save();

      // AFFILIATION
      if (tx.userId) {
        try {
          await processCommission(tx.userId, tx.amount);
          console.log(`🤝 Commission affiliation traitée pour l'utilisateur ${tx.userId}`);
        } catch (affError) {
          console.error("❌ Erreur traitement affiliation (non bloquant):", affError);
        }
      }

      // EMAIL DE SUCCÈS
      if (tx.userId) {
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
            console.log("✅ Email succès envoyé à:", user.email);
          } catch (e) {
            console.error("❌ Email:", e);
          }
        }
      }
    }

    // CAS D'ÉCHEC
    if (webhookData.status === 'failed') {
      console.log("❌ Paiement échoué:", tx.internalId);
      
      await tx.save();

      // Marquer le projet en erreur
      if (tx.projetId) {
        try {
          const projet = await Projet.findById(tx.projetId);
          if (projet) {
            projet.status = "ERROR";
            projet.errorMessage = "Paiement échoué";
            await projet.save();
            console.log("⚠️ Projet marqué en erreur:", projet._id);
          }
        } catch (e) {
          console.error("❌ Erreur update projet:", e);
        }
      }

      // Email d'échec
      if (tx.userId) {
        const user = await User.findById(tx.userId);
        if (user) {
          try {
            await resend.emails.send({
              from: "Bookzy <no-reply@bookzy.io>",
              to: user.email,
              subject: "⚠️ Paiement échoué - Bookzy",
              html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                  <h2 style="color: #ef4444;">Paiement échoué</h2>
                  <p>Bonjour ${user.firstName || 'cher utilisateur'},</p>
                  <p>Votre paiement pour "${tx.kitData?.title || 'votre eBook'}" n'a pas abouti.</p>
                  <p>Montant: ${tx.amount} ${tx.currency}</p>
                  <p>Vous pouvez réessayer depuis votre tableau de bord.</p>
                  <p><a href="https://app.bookzy.io/dashboard/projets" style="display: inline-block; padding: 12px 24px; background-color: #2563eb; color: white; text-decoration: none; border-radius: 8px; margin-top: 16px;">Réessayer</a></p>
                  <p style="margin-top: 24px; color: #64748b; font-size: 14px;">L'équipe Bookzy</p>
                </div>
              `,
            });
            console.log("✅ Email échec envoyé à:", user.email);
          } catch (e) {
            console.error("❌ Email échec:", e);
          }
        }
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("❌ Webhook ERR:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}