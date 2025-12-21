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
    console.log("🔍 Type de l'ID:", typeof id);
    
    // Chercher par transactionId
    const transaction = await Transaction.findOne({ transactionId: id });
    
    console.log("📦 Transaction trouvée:", transaction);
    
    // Afficher toutes les transactions pour debug
    const allTransactions = await Transaction.find({}).limit(5);
    console.log("📋 Dernières transactions:", allTransactions);
    
    if (!transaction) {
      return NextResponse.json({
        found: false,
        message: "Transaction not found",
        searchedId: id,
        searchedIdType: typeof id,
        allTransactionsCount: allTransactions.length,
        lastTransactions: allTransactions.map(t => ({
          transactionId: t.transactionId,
          transactionIdType: typeof t.transactionId,
          status: t.status,
          amount: t.amount,
          userId: t.userId
        }))
      });
    }
    
    return NextResponse.json({
      found: true,
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
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
