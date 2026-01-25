import { NextResponse } from "next/server";
import { dbConnect } from "../../../../lib/db";
import Transaction from "../../../../models/Transaction";

export async function GET(req, { params }) {
  try {
    await dbConnect();
    
    const { id } = params;
    
    if (!id) {
      return NextResponse.json({ 
        success: false, 
        message: "ID manquant" 
      }, { status: 400 });
    }
    
    const transaction = await Transaction.findById(id);
    
    if (!transaction) {
      console.log("⚠️ Transaction introuvable:", id);
      return NextResponse.json({ 
        success: false, 
        message: "Transaction introuvable" 
      }, { status: 404 });
    }
    
    if (!transaction.paymentUrl) {
      console.log("⚠️ Transaction sans paymentUrl:", id);
      return NextResponse.json({ 
        success: false, 
        message: "URL de paiement manquante" 
      }, { status: 410 });
    }
    
    return NextResponse.json({ 
      success: true, 
      transaction: {
        _id: transaction._id,
        paymentUrl: transaction.paymentUrl,
        status: transaction.status
      }
    });
    
  } catch (error) {
    console.error("❌ Erreur get-transaction:", error.message);
    return NextResponse.json({ 
      success: false, 
      error: error.message 
    }, { status: 500 });
  }
}