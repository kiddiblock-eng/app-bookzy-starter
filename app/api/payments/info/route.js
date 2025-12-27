export const dynamic = "force-dynamic";
// app/api/payments/info/route.js

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Transaction from '@/models/Transaction';
import Settings from '@/models/settings';

export async function GET(req) {
  try {
    await dbConnect();

    const { searchParams } = new URL(req.url);
    const transactionId = searchParams.get('id');

    if (!transactionId) {
      return NextResponse.json(
        { success: false, message: 'Transaction ID manquant' },
        { status: 400 }
      );
    }

    // Récupérer la transaction
    const transaction = await Transaction.findById(transactionId).lean();

    if (!transaction) {
      return NextResponse.json(
        { success: false, message: 'Transaction introuvable' },
        { status: 404 }
      );
    }

    // Récupérer les settings pour la config du provider
    const settings = await Settings.findOne({ key: 'global' }).lean();
    const providerConfig = settings?.payment?.[transaction.provider];

    // 🔥 Cas KkiaPay LIVE avec widget
    if (
      transaction.provider === 'kkiapay' && 
      (providerConfig?.environment === 'live' || !providerConfig?.environment)
    ) {
      return NextResponse.json({
        success: true,
        useWidget: true,
        widgetProvider: 'kkiapay',
        widgetConfig: {
          amount: transaction.amount,
          api_key: providerConfig.publicKey,
          sandbox: false,
          email: transaction.kitData?.customerEmail || '',
          phone: transaction.kitData?.customerPhone || '',
          name: transaction.kitData?.customerName || 'Client Bookzy',
        },
        transactionId: transaction._id.toString(),
        amount: transaction.amount,
        currency: transaction.currency,
      });
    }

    // 🔥 Mode classique avec redirection
    return NextResponse.json({
      success: true,
      paymentUrl: transaction.paymentUrl,
      transactionId: transaction._id.toString(),
      provider: transaction.provider,
      amount: transaction.amount,
      currency: transaction.currency,
    });

  } catch (error) {
    console.error('❌ Erreur GET payment info:', error);
    return NextResponse.json(
      { success: false, message: 'Erreur serveur' },
      { status: 500 }
    );
  }
}