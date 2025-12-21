export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";

export async function GET(req) {
  try {
    await dbConnect();
    
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    
    console.log("🔍 Recherche transaction:", id);
    
    const transaction = await Transaction.findOne({ transactionId: id });
    
    if (!transaction) {
      return NextResponse.json(
        { success: false, message: "Transaction non trouvée" },
        { status: 404 }
      );
    }
    
    console.log("✅ Transaction trouvée:", transaction.transactionId);
    
    return NextResponse.json({
      success: true,
      transaction: {
        transactionId: transaction.transactionId,
        status: transaction.status,
        amount: transaction.amount,
        currency: transaction.currency,
        kitData: transaction.kitData
      }
    });
    
  } catch (err) {
    console.error("❌ Erreur:", err);
    return NextResponse.json(
      { success: false, message: err.message },
      { status: 500 }
    );
  }
}