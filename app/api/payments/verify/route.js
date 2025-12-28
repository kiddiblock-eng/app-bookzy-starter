export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import PaymentProviderService from "@/lib/payment/PaymentProviderService";
import Projet from "@/models/Projet";

export async function POST(req) { 
  try {
    await dbConnect();
    const { transactionId } = await req.json();

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) return NextResponse.json({ error: "Introuvable" }, { status: 404 });

    if (transaction.status === "completed") {
      return NextResponse.json({ success: true, paid: true, status: "completed" });
    }

    const provider = await PaymentProviderService.getProvider(transaction.provider);
    const verificationData = await provider.verifyPayment(transaction.providerTransactionId);
    
    if (verificationData.status === "completed") {
      transaction.status = "completed";
      transaction.completedAt = new Date();

      // 🎯 DÉCLENCHEMENT DE LA GÉNÉRATION EBOOK
      if (transaction.projetId) {
        const projet = await Projet.findById(transaction.projetId);
        if (projet) {
          projet.isPaid = true;
          projet.status = "processing"; // L'IA commence ici 🔥
          await projet.save();
        }
      }
    }

    await transaction.save();
    return NextResponse.json({ success: true, paid: transaction.status === "completed" });

  } catch (error) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}