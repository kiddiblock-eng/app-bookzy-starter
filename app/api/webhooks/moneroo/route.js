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
// On importe ton système d'affiliation
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

    // Extraction de l'ID depuis le webhook (peut être dans .data ou à la racine)
    const webhookDataRaw = payload.data || payload; 
    const monerooTransactionId = webhookDataRaw.id;

    if (!monerooTransactionId) {
        console.warn("⚠️ Webhook sans ID");
        return NextResponse.json({ success: true });
    }

    // 1️⃣ SÉCURITÉ ABSOLUE : On ne fait pas confiance au webhook.
    // On appelle Moneroo pour vérifier le vrai statut.
    console.log(`🔍 [Moneroo] Vérification API pour ${monerooTransactionId}...`);
    const verifiedData = await provider.verifyPayment(monerooTransactionId);

    // On récupère les IDs depuis les metadata vérifiées
    const internalTxId = verifiedData.metadata?.transactionId;

    // 2️⃣ Recherche de la transaction en base
    let tx = await Transaction.findOne({ providerTransactionId: monerooTransactionId });
    
    // Fallback : Si pas trouvé par ID Moneroo, on cherche par ID interne
    if (!tx && internalTxId) {
        tx = await Transaction.findById(internalTxId);
    }

    if (!tx) {
      console.error("❌ [Moneroo] Transaction introuvable en BDD.");
      return NextResponse.json({ success: true }); 
    }

    // 3️⃣ Mise à jour du statut
    tx.status = verifiedData.status;
    tx.providerTransactionId = verifiedData.transactionId; // On s'assure qu'il est bien enregistré
    tx.providerResponse = { 
        webhook: payload,
        verification: verifiedData.rawResponse 
    };
    
    const isPaid = verifiedData.status === 'completed';

    // 4️⃣ LOGIQUE MÉTIER SI PAYÉ
    if (isPaid && !tx.completedAt) {
      tx.completedAt = new Date();
      await tx.save();
      console.log("💰 [Moneroo] Paiement VALIDÉ pour:", tx._id);

      // A. DÉBLOQUER LE PROJET
      if (tx.projetId) {
        await Projet.findByIdAndUpdate(tx.projetId, { 
            isPaid: true, 
            updatedAt: new Date(), 
            transactionId: tx._id 
        });
      }

      // B. AFFILIATION (Sécurisée avec Try/Catch)
      if (tx.userId) {
          try {
             // Si l'affiliation plante, ça ne bloquera PAS la suite
             await processCommission(tx.userId, tx.amount);
             console.log(`🤝 Commission affiliation générée pour user ${tx.userId}`);
          } catch (affError) {
             console.error("⚠️ Erreur non-critique Affiliation:", affError.message);
          }
      }

      // C. ENVOYER L'EMAIL
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
    // On renvoie 500 pour que Moneroo réessaie plus tard si c'est un crash serveur
    return NextResponse.json({ success: false }, { status: 500 });
  }
}