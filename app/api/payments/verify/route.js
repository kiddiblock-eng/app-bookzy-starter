export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import PaymentProviderService from "@/lib/payment/PaymentProviderService";

export async function POST(req) { 
  try {
    await dbConnect();
    const { transactionId, kkiapayId } = await req.json();

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    if (kkiapayId) {
      transaction.providerTransactionId = kkiapayId;
      await transaction.save();
    }

    if (transaction.status === "completed") {
      return NextResponse.json({ 
        success: true, 
        paid: true,
        transaction: transaction.toObject()
      });
    }

    const provider = await PaymentProviderService.getProvider(transaction.provider);
    const verificationData = await provider.verifyPayment(transaction.providerTransactionId);
    
    if (verificationData.status === "completed" || verificationData.success) {
      transaction.status = "completed";
      transaction.completedAt = new Date();
      await transaction.save();
      
      return NextResponse.json({ 
        success: true, 
        paid: true,
        transaction: transaction.toObject()
      });
    }

    return NextResponse.json({ 
      success: false, 
      paid: false
    });

  } catch (error) {
    console.error("❌ Verify:", error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}