// app/api/admin/payment-providers/price/route.js

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Settings from '@/models/settings';
import { verifyAdmin } from '@/lib/auth';

export async function POST(req) {
  try {
    await dbConnect();

    const authResult = await verifyAdmin(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.message },
        { status: 403 }
      );
    }

    const { price } = await req.json();

    if (!price || price < 0) {
      return NextResponse.json(
        { success: false, error: 'Prix invalide' },
        { status: 400 }
      );
    }

    const settings = await Settings.findOne({ key: 'global' });
    
    if (!settings) {
      return NextResponse.json({
        success: false,
        error: 'Configuration non trouvée'
      }, { status: 404 });
    }

    if (!settings.payment) {
      settings.payment = {};
    }

    settings.payment.ebookPrice = parseInt(price);
    await settings.save();

    console.log(`✅ Prix: ${price} FCFA`);

    return NextResponse.json({
      success: true,
      message: 'Prix mis à jour',
      ebookPrice: settings.payment.ebookPrice
    });

  } catch (error) {
    console.error('❌ Erreur POST price:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}