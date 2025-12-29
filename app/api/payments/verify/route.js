export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import PaymentProviderService from "@/lib/payment/PaymentProviderService";
import Projet from "@/models/Projet";

export async function POST(req) { 
  try {
    await dbConnect();
    const { transactionId, kkiapayId } = await req.json();

    const transaction = await Transaction.findById(transactionId);
    if (!transaction) {
      return NextResponse.json({ error: "Introuvable" }, { status: 404 });
    }

    // 🔥 Si kkiapayId fourni, on met à jour le vrai ID
    if (kkiapayId) {
      transaction.providerTransactionId = kkiapayId;
      await transaction.save();
    }

    // Si déjà payé, on retourne directement
    if (transaction.status === "completed") {
      return NextResponse.json({ 
        success: true, 
        paid: true, 
        status: "completed",
        transaction: transaction.toObject()
      });
    }

    const provider = await PaymentProviderService.getProvider(transaction.provider);
    
    // 🔥 Vérifier avec le VRAI ID KkiaPay
    const realTransactionId = transaction.providerTransactionId;
    
    if (!realTransactionId || realTransactionId.startsWith('KKP-')) {
      return NextResponse.json({ 
        success: false, 
        paid: false,
        message: "ID de transaction KkiaPay manquant" 
      }, { status: 400 });
    }

    const verificationData = await provider.verifyPayment(realTransactionId);
    
    if (verificationData.status === "completed") {
      transaction.status = "completed";
      transaction.completedAt = new Date();

      // 🎯 DÉCLENCHEMENT DE LA GÉNÉRATION EBOOK
      if (transaction.projetId) {
        const projet = await Projet.findById(transaction.projetId);
        if (projet) {
          projet.isPaid = true;
          projet.status = "processing";
          await projet.save();
          
          console.log("🚀 Lancement génération pour projet:", projet._id);
          
          // 🔥 APPELER L'API DE GÉNÉRATION
          try {
            const appUrl = process.env.NEXT_PUBLIC_APP_URL || "https://app.bookzy.io";
            
            fetch(`${appUrl}/api/ebooks/generate`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ 
                projetId: projet._id.toString(),
                transactionId: transaction._id.toString(),
                titre: transaction.kitData?.title || transaction.kitData?.titre,
                description: transaction.kitData?.description,
                tone: transaction.kitData?.tone || transaction.kitData?.ton,
                audience: transaction.kitData?.audience,
                pages: transaction.kitData?.pages,
                chapters: transaction.kitData?.chapters || transaction.kitData?.chapitres,
                template: transaction.kitData?.template,
                outline: transaction.kitData?.outline
              })
            }).catch(err => console.error("❌ Erreur lancement génération:", err));
            
            console.log("✅ Génération lancée");
          } catch (error) {
            console.error("❌ Échec lancement génération:", error);
          }
        }
      }

      await transaction.save();
      
      return NextResponse.json({ 
        success: true, 
        paid: true,
        status: "completed",
        transaction: transaction.toObject()
      });
    }

    await transaction.save();
    
    return NextResponse.json({ 
      success: true, 
      paid: false,
      status: transaction.status,
      message: "Paiement en attente de confirmation"
    });

  } catch (error) {
    console.error("❌ Erreur verify payment:", error);
    return NextResponse.json({ 
      success: false,
      error: error.message 
    }, { status: 500 });
  }
}