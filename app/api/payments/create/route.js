export const dynamic = "force-dynamic";
import { NextResponse } from "next/server";
import { dbConnect } from "@/lib/db";
import Transaction from "@/models/Transaction";
import Settings from "@/models/settings"; 
import User from "@/models/User";
import { verifyAuth } from "@/lib/auth";
import PaymentProviderService from "@/lib/payment/PaymentProviderService";

export async function POST(req) {
  try {
    await dbConnect();
    const authUser = await verifyAuth(req);
    if (!authUser) return NextResponse.json({ success: false }, { status: 401 });

    const user = await User.findById(authUser.id).lean();
    const body = await req.json();
    const { projetId, kitData } = body;

    const settings = await Settings.findOne({ key: "global" }).lean();
    
    // On force Moneroo si c'est ta stratégie, sinon on garde la logique dynamique
    const activeProviderName = settings.payment.activeProvider || "moneroo"; 
    const providerConfig = settings.payment[activeProviderName];

    const PRICE = settings.payment.ebookPrice || 2000; // Mis à 2000 FCFA comme dans ta vidéo
    const CURRENCY = providerConfig.defaultCurrency || "XOF";

    // 1. Création transaction en BDD (Pending)
    const tx = await Transaction.create({
      userId: authUser.id,
      provider: activeProviderName,
      amount: PRICE,
      currency: CURRENCY,
      status: "pending",
      projetId: projetId || null,
      kitData: { 
        ...kitData, 
        customerEmail: user.email,
        customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
        customerPhone: user.phone || ''
      },
      internalId: `BKZ-${Date.now()}`
    });

    const provider = await PaymentProviderService.getProvider(activeProviderName);
    const callbackBase = settings.appDomain || process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";
    
    // URL où l'user revient après paiement
    const returnUrl = `${callbackBase}/dashboard/projets/nouveau?tx=${tx._id.toString()}`;

    // 2. Appel au Provider (Moneroo)
    const paymentResult = await provider.createPayment({
      amount: PRICE,
      currency: CURRENCY,
      description: `eBook Bookzy : ${kitData?.title || "Nouveau"}`,
      customerEmail: user.email,
      customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      customerPhone: user.phone || '',
      returnUrl,
      
      // 👇 ICI : ON ENVOIE LES DONNÉES CRITIQUES POUR LE WEBHOOK 👇
      userId: authUser.id,
      projetId: projetId,
      transactionId: tx._id.toString() 
    });

    // 3. Mise à jour avec l'ID Moneroo
    tx.providerTransactionId = paymentResult.transactionId;
    tx.paymentUrl = paymentResult.paymentUrl;
    await tx.save();

    return NextResponse.json({
      success: true,
      paymentUrl: paymentResult.paymentUrl,
      transactionId: tx._id.toString(),
      provider: activeProviderName
    });

  } catch (error) {
    console.error('❌ Erreur create payment:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}