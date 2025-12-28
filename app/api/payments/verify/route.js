export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import PaymentProviderService from "@/lib/payment/PaymentProviderService";
import Projet from "@/models/Projet";
import User from "@/models/User";
import { Resend } from "resend";
import { paymentSuccessTemplate } from "@/lib/emailTemplates/paymentSuccessTemplate";

export async function POST(req) { 
  const resend = new Resend(process.env.RESEND_API_KEY); 

  try {
    await dbConnect();

    const body = await req.json();
    const { transactionId, kkiapayId } = body; // 🔥 Récupérer le vrai ID KkiaPay

    if (!transactionId) {
      return NextResponse.json(
        { error: "Transaction ID manquant" },
        { status: 400 }
      );
    }

    // Trouver la transaction
    const transaction = await Transaction.findOne({
      $or: [
        { internalId: transactionId },
        { _id: transactionId }
      ]
    });

    if (!transaction) {
      return NextResponse.json(
        { error: "Transaction introuvable" },
        { status: 404 }
      );
    }

    // 🔥 MISE À JOUR CRUCIALE : Remplacer l'ID temporaire par le vrai ID KkiaPay
    if (kkiapayId) {
      console.log(`🔄 Mise à jour providerTransactionId: ${transaction.providerTransactionId} → ${kkiapayId}`);
      transaction.providerTransactionId = kkiapayId;
      await transaction.save();
    }

    // Si déjà completed, retourner directement
    if (transaction.status === "completed") {
      return NextResponse.json({
        success: true,
        paid: true,
        status: "completed",
        transaction: {
          id: transaction.internalId || transaction._id,
          amount: transaction.amount,
          currency: transaction.currency,
          status: transaction.status,
          provider: transaction.provider,
          kitData: transaction.kitData || {},
          projetId: transaction.projetId || null,
        }
      });
    }

    // Récupérer le provider utilisé
    const providerName = transaction.provider;

    if (!providerName) {
      return NextResponse.json(
        { error: "Provider non défini pour cette transaction" },
        { status: 500 }
      );
    }

    // Initialiser le provider
    let provider;
    try {
      provider = await PaymentProviderService.getProvider(providerName);
    } catch (error) {
      console.error(`Erreur initialisation provider ${providerName}:`, error);
      return NextResponse.json(
        { error: `Provider ${providerName} non disponible` },
        { status: 500 }
      );
    }

    // 🔥 Vérifier le paiement avec le VRAI ID
    let verificationData;
    
    try {
      verificationData = await provider.verifyPayment(transaction.providerTransactionId);
      
      console.log(`✅ Vérification ${providerName}:`, verificationData);

    } catch (error) {
      console.error(`Erreur vérification ${providerName}:`, error);
      return NextResponse.json(
        { error: `Erreur vérification: ${error.message}` },
        { status: 500 }
      );
    }

    // Mettre à jour la transaction
    const previousStatus = transaction.status;
    transaction.status = verificationData.status;
    transaction.providerResponse = {
      ...(transaction.providerResponse || {}),
      verification: verificationData.rawResponse || verificationData,
      lastVerifiedAt: new Date(),
    };

    const paid = verificationData.status === "completed";

    if (paid && previousStatus !== "completed") {
      transaction.completedAt = new Date();
      console.log(`💰 Paiement ${providerName} confirmé:`, transaction.internalId || transaction._id);

      // 🔥 Marquer le projet comme payé et démarrer la génération
      if (transaction.projetId) {
        try {
          const projet = await Projet.findById(transaction.projetId);
          
          if (projet) {
            projet.isPaid = true;
            projet.paymentId = transaction.internalId || transaction._id.toString();
            projet.paidAt = new Date();
            projet.status = "processing"; // ✅ Passer en processing
            await projet.save();
            
            console.log(`✅ Projet ${projet._id} marqué comme payé et en processing`);
          } else {
            console.warn(`⚠️ Projet ${transaction.projetId} introuvable`);
          }
        } catch (projetError) {
          console.error("❌ Erreur mise à jour projet:", projetError);
        }
      } else if (transaction.userId) {
        // Fallback : chercher le dernier projet non payé
        try {
          const projets = await Projet.find({ 
            userId: transaction.userId,
            isPaid: false 
          }).sort({ createdAt: -1 }).limit(1);

          if (projets.length > 0) {
            const projet = projets[0];
            projet.isPaid = true;
            projet.paymentId = transaction.internalId || transaction._id.toString();
            projet.paidAt = new Date();
            projet.status = "processing"; // ✅ Démarrer la génération
            await projet.save();
            
            console.log(`✅ Projet ${projet._id} (fallback) marqué comme payé et en processing`);
          }
        } catch (fallbackError) {
          console.error("❌ Erreur fallback projet:", fallbackError);
        }
      }

      // Envoyer l'email de confirmation
      if (transaction.userId) {
        const user = await User.findById(transaction.userId);
        if (user) {
          try {
            const html = paymentSuccessTemplate({
              firstName: user.firstName || "cher utilisateur",
              amount: transaction.amount,
              transactionId: transaction.internalId || transaction._id,
              ebookTitle: transaction.kitData?.title || "Ton eBook",
            });

            await resend.emails.send({
              from: "Bookzy <no-reply@bookzy.io>",
              to: user.email,
              subject: "🎉 Paiement confirmé - Bookzy",
              html,
            });

            console.log(`📧 Email envoyé à ${user.email}`);
          } catch (e) {
            console.error("❌ Erreur envoi email:", e);
          }
        }
      }
    }

    await transaction.save();

    return NextResponse.json({
      success: true,
      status: verificationData.status,
      paid,
      provider: providerName,
      transaction: {
        id: transaction.internalId || transaction._id,
        amount: transaction.amount,
        currency: transaction.currency,
        status: transaction.status,
        completedAt: transaction.completedAt,
        kitData: transaction.kitData || {},
        projetId: transaction.projetId || null,
      }
    });

  } catch (error) {
    console.error("❌ Erreur vérification paiement:", error);
    return NextResponse.json(
      { error: "Erreur serveur" },
      { status: 500 }
    );
  }
}