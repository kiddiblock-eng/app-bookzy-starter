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
    const activeProviderName = settings.payment.activeProvider || "kkiapay";
    const providerConfig = settings.payment[activeProviderName];

    const PRICE = settings.payment.ebookPrice || 2100;
    const CURRENCY = providerConfig.defaultCurrency || "XOF";

    // Création transaction
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
    const callbackBase = settings.appDomain || "http://localhost:3000";
    
    const returnUrl = `${callbackBase}/dashboard/projets/nouveau?tx=${tx._id.toString()}`;

    const paymentResult = await provider.createPayment({
      amount: PRICE,
      currency: CURRENCY,
      description: `eBook Bookzy : ${kitData?.title || "Nouveau"}`,
      customerEmail: user.email,
      customerName: `${user.firstName || ''} ${user.lastName || ''}`.trim(),
      customerPhone: user.phone || '',
      returnUrl
    });

    tx.providerTransactionId = paymentResult.transactionId;
    tx.paymentUrl = paymentResult.paymentUrl;
    await tx.save();

    // 🔥 FIX : Retourner les bonnes données selon le mode
    if (paymentResult.useWidget) {
      return NextResponse.json({
        success: true,
        useWidget: true,
        widgetConfig: paymentResult.widgetConfig,
        transactionId: tx._id.toString(),
        provider: activeProviderName
      });
    } else {
      return NextResponse.json({
        success: true,
        useWidget: false,
        paymentUrl: paymentResult.paymentUrl,
        transactionId: tx._id.toString(),
        provider: activeProviderName
      });
    }

  } catch (error) {
    console.error('❌ Erreur create payment:', error);
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}