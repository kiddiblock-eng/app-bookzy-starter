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
import { processCommission } from "@/utils/affiliation";

export async function POST(req) { 
  const resend = new Resend(process.env.RESEND_API_KEY); 

  try {
    await dbConnect();

    const settings = await Settings.findOne({ key: "global" }).lean();
    const monerooConfig = settings?.payment?.moneroo;
    const provider = new MonerooProvider(monerooConfig);

    const payload = await req.json();
    console.log("📩 [Moneroo] Webhook reçu.");

    const webhookDataRaw = payload.data || payload; 
    const monerooTransactionId = webhookDataRaw.id;

    if (!monerooTransactionId) {
        console.warn("⚠️ Webhook sans ID");
        return NextResponse.json({ success: true });
    }

    console.log(`🔍 [Moneroo] Vérification API pour ${monerooTransactionId}...`);
    const verifiedData = await provider.verifyPayment(monerooTransactionId);

    const internalTxId = verifiedData.metadata?.transactionId;

    let tx = await Transaction.findOne({ providerTransactionId: monerooTransactionId });
    
    if (!tx && internalTxId) {
        tx = await Transaction.findById(internalTxId);
    }

    if (!tx) {
      console.error("❌ [Moneroo] Transaction introuvable en BDD.");
      return NextResponse.json({ success: true }); 
    }

    tx.status = verifiedData.status;
    tx.providerTransactionId = verifiedData.transactionId;
    tx.providerResponse = { 
        webhook: payload,
        verification: verifiedData.rawResponse 
    };
    
    const isPaid = verifiedData.status === 'completed';

    if (isPaid && !tx.completedAt) {
      tx.completedAt = new Date();
      await tx.save();
      console.log("💰 [Moneroo] Paiement VALIDÉ pour:", tx._id);

      // A. DÉBLOQUER LE PROJET + 🚀 LANCER GÉNÉRATION
      if (tx.projetId) {
        await Projet.findByIdAndUpdate(tx.projetId, { 
            isPaid: true,
            status: "processing",  // ✅ AJOUTÉ
            progress: 5,           // ✅ AJOUTÉ
            updatedAt: new Date(), 
            transactionId: tx._id 
        });

        // 🚀 NOUVEAU : Lancer la génération
        console.log(`🚀 [Moneroo] Démarrage génération pour projet ${tx.projetId}`);
        
        const baseUrl = process.env.NODE_ENV === 'production' 
          ? 'https://app.bookzy.io' 
          : 'http://localhost:3000';

        fetch(`${baseUrl}/api/ebooks/generate`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ 
            projetId: tx.projetId.toString(),
            transactionId: tx._id.toString(),
            force: true 
          })
        })
        .then(res => {
          console.log(`✅ [Moneroo] Génération lancée, status: ${res.status}`);
          return res.json();
        })
        .then(data => {
          console.log(`✅ [Moneroo] Réponse génération:`, data);
        })
        .catch(err => {
          console.error("❌ [Moneroo] Erreur génération:", err.message);
        });
      }

      // B. AFFILIATION (INCHANGÉ ✅)
      if (tx.userId) {
          try {
             await processCommission(tx.userId, tx.amount);
             console.log(`🤝 Commission affiliation générée pour user ${tx.userId}`);
          } catch (affError) {
             console.error("⚠️ Erreur non-critique Affiliation:", affError.message);
          }
      }

      // C. EMAIL (INCHANGÉ ✅)
      if (tx.userId) {
        const user = await User.findById(tx.userId);
        if (user) {
             try {
                const html = paymentSuccessTemplate({
                  firstName: user.firstName || "cher utilisateur",
                  amount: tx.amount,
                  transactionId: tx.internalId || "Moneroo",
                  ebookTitle: tx.kitData?.title || "Ton eBook",
                });
                await resend.emails.send({
                  from: "Bookzy <no-reply@bookzy.io>",
                  to: user.email,
                  subject: "🎉 Paiement confirmé - Bookzy",
                  html,
                });
              } catch (e) { console.error("❌ Erreur Email:", e); }
        }
      }

    } else if (verifiedData.status === 'failed') {
        tx.status = 'failed';
        await tx.save();
        console.log("❌ [Moneroo] Paiement échoué confirmé par API");
    }

    return NextResponse.json({ success: true });

  } catch (error) {
    console.error("❌ [Moneroo] Webhook Crash:", error);
    return NextResponse.json({ success: false }, { status: 500 });
  }
}