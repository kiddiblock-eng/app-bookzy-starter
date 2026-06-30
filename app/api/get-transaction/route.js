export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import { getUserFromToken, verifyAdmin } from "@/lib/auth";
import Transaction from "@/models/Transaction";

export async function GET(req) {
  try {
    await dbConnect();

    const user = await getUserFromToken(req);
    if (!user) {
      return NextResponse.json(
        { success: false, message: "Non authentifié" },
        { status: 401 }
      );
    }

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

    // Contrôle de propriété : le propriétaire ou un admin uniquement
    const isOwner =
      transaction.userId &&
      String(transaction.userId) === String(user.id);

    if (!isOwner) {
      const admin = await verifyAdmin(req);
      if (!admin?.authorized) {
        return NextResponse.json(
          { success: false, message: "Non autorisé" },
          { status: 403 }
        );
      }
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