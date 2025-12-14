// app/api/admin/payment-providers/active/route.js

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

    const { provider } = await req.json();

    const validProviders = ['moneroo', 'fedapay', 'kkiapay', 'pawapay'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { success: false, error: 'Provider invalide' },
        { status: 400 }
      );
    }

    const settings = await Settings.findOne({ key: 'global' });
    
    if (!settings || !settings.payment) {
      return NextResponse.json({
        success: false,
        error: 'Configuration non trouvée'
      }, { status: 404 });
    }

    const providerConfig = settings.payment[provider];
    if (!providerConfig || !providerConfig.enabled) {
      return NextResponse.json({
        success: false,
        error: `Le provider ${provider} doit être activé`
      }, { status: 400 });
    }

    const requiredFields = {
      moneroo: ['apiKey'],
      fedapay: ['publicKey', 'secretKey'],
      kkiapay: ['publicKey', 'privateKey', 'secret'],
      pawapay: ['apiKey']
    };

    const missing = requiredFields[provider].filter(field => !providerConfig[field]);
    if (missing.length > 0) {
      return NextResponse.json({
        success: false,
        error: `Champs manquants: ${missing.join(', ')}`
      }, { status: 400 });
    }

    settings.payment.activeProvider = provider;
    await settings.save();

    console.log(`✅ Provider actif: ${provider}`);

    return NextResponse.json({
      success: true,
      message: `${provider} est maintenant actif`
    });

  } catch (error) {
    console.error('❌ Erreur POST active:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}