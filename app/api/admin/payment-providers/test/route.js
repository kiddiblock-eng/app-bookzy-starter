// app/api/admin/payment-providers/test/route.js

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Settings from '@/models/settings';
import { verifyAdmin } from '@/lib/auth';
import PaymentProviderService from '@/lib/payment/PaymentProviderService';

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

    const settings = await Settings.findOne({ key: 'global' }).lean();
    
    if (!settings || !settings.payment || !settings.payment[provider]) {
      return NextResponse.json({
        success: false,
        error: 'Configuration non trouvée'
      }, { status: 404 });
    }

    const providerConfig = settings.payment[provider];

    if (!providerConfig.enabled) {
      return NextResponse.json({
        success: false,
        error: 'Provider désactivé'
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

    PaymentProviderService.reset();

    try {
      const providerInstance = await PaymentProviderService.getProvider(provider);
      
      if (!providerInstance.isConfigured()) {
        return NextResponse.json({
          success: false,
          error: 'Provider mal configuré'
        }, { status: 400 });
      }

      return NextResponse.json({
        success: true,
        message: `Connexion ${provider} réussie !`,
        details: {
          provider: provider,
          environment: providerConfig.environment || 'production',
          configured: true
        }
      });

    } catch (error) {
      console.error(`❌ Test ${provider}:`, error);
      return NextResponse.json({
        success: false,
        error: `Erreur: ${error.message}`
      }, { status: 500 });
    }

  } catch (error) {
    console.error('❌ Erreur POST test:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}