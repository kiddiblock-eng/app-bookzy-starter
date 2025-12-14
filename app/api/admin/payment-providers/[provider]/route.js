// app/api/admin/payment-providers/[provider]/route.js

import { NextResponse } from 'next/server';
import { dbConnect } from '../../../../../lib/db';
import Settings from '../../../../../models/settings';
import { verifyAdmin } from '../../../../../lib/auth';

export async function PATCH(req, { params }) {
  try {
    await dbConnect();

    // Vérifier admin
    const authResult = await verifyAdmin(req);
    if (!authResult.authorized) {
      return NextResponse.json(
        { success: false, error: authResult.message },
        { status: 403 }
      );
    }

    const { provider } = params;
    const body = await req.json();

    // Providers valides
    const validProviders = ['moneroo', 'fedapay', 'kkiapay', 'pawapay'];
    if (!validProviders.includes(provider)) {
      return NextResponse.json(
        { success: false, error: 'Provider invalide' },
        { status: 400 }
      );
    }

    // Charger settings
    const settings = await Settings.findOne({ key: 'global' });
    
    if (!settings) {
      return NextResponse.json({
        success: false,
        error: 'Configuration non trouvée'
      }, { status: 404 });
    }

    // Initialiser payment si nécessaire
    if (!settings.payment) {
      settings.payment = {};
    }

    // Initialiser le provider si nécessaire
    if (!settings.payment[provider]) {
      settings.payment[provider] = {};
    }

    // Mettre à jour la configuration
    Object.keys(body).forEach(key => {
      // Ignorer les champs vides (pour ne pas écraser les clés existantes)
      if (body[key] !== '' && body[key] !== null && body[key] !== undefined) {
        settings.payment[provider][key] = body[key];
      }
    });

    // Sauvegarder
    await settings.save();

    console.log(`✅ Provider ${provider} mis à jour:`, settings.payment[provider]);

    return NextResponse.json({
      success: true,
      message: `Provider ${provider} mis à jour avec succès`
    });

  } catch (error) {
    console.error('❌ Erreur PATCH payment-provider:', error);
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}