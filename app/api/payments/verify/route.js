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
    const { transactionId } = body; // On utilise l'ID de notre transaction (Mongo)

    if (!transactionId) {
      return NextResponse.json({ error: "ID manquant" }, { status: 400 });
    }

    // 1. Trouver la transaction
    const transaction = await Transaction.findById(transactionId);

    if (!transaction) {
      return NextResponse.json({ error: "Transaction introuvable" }, { status: 404 });
    }

    // 2. Si déjà complétée, on s'arrête là (évite de relancer la génération)
    if (transaction.status === "completed") {
      return NextResponse.json({ success: true, paid: true, status: "completed" });
    }

    // 3. Initialiser le provider (Kkiapay, Fedapay, etc.)
    const provider = await PaymentProviderService.getProvider(transaction.provider);

    // 4. Vérifier le paiement
    // C'est ici que l'appel utilisera l'URL /status/ et la Secret Key
    const verificationData = await provider.verifyPayment(transaction.providerTransactionId);
    
    console.log(`✅ Résultat vérification ${transaction.provider}:`, verificationData.status);

    const isPaid = verificationData.status === "completed";

    // 5. Si le paiement est validé pour la première fois
    if (isPaid && transaction.status !== "completed") {
      transaction.status = "completed";
      transaction.completedAt = new Date();
      transaction.providerResponse = {
        ...transaction.providerResponse,
        verification: verificationData.rawResponse,
      };

      // 🎯 DÉCLENCHEMENT DE LA GÉNÉRATION
      if (transaction.projetId) {
        const projet = await Projet.findById(transaction.projetId);
        if (projet) {
          projet.isPaid = true;
          projet.status = "processing"; // ✅ Active l'IA pour générer l'ebook
          projet.paidAt = new Date();
          await projet.save();
          console.log(`🚀 Génération démarrée pour le projet ${projet._id}`);
        }
      }

      // 📧 ENVOI DE L'EMAIL
      if (transaction.userId) {
        const user = await User.findById(transaction.userId);
        if (user) {
          try {
            const html = paymentSuccessTemplate({
              firstName: user.firstName || "client",
              amount: transaction.amount,
              transactionId: transaction._id,
              ebookTitle: transaction.kitData?.title || "Votre eBook",
            });

            await resend.emails.send({
              from: "Bookzy <no-reply@bookzy.io>",
              to: user.email,
              subject: "🎉 Votre eBook est en cours de création !",
              html,
            });
          } catch (e) { console.error("Email error:", e); }
        }
      }
    } else {
      transaction.status = verificationData.status;
    }

    await transaction.save();

    return NextResponse.json({
      success: true,
      paid: isPaid,
      status: transaction.status
    });

  } catch (error) {
    console.error("❌ Erreur Verify:", error);
    return NextResponse.json({ error: "Erreur serveur" }, { status: 500 });
  }
}