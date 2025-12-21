export const dynamic = "force-dynamic";
// app/api/admin/payment-providers/route.js

import { NextResponse } from 'next/server';
import { dbConnect } from '@/lib/db';
import Settings from '@/models/settings';
import { verifyAdmin } from '@/lib/auth';

export async function GET(req) {
  try {
    console.log('📥 GET /api/admin/payment-providers - Début');
    
    await dbConnect();
    console.log('✅ MongoDB connecté');

    // 🔥 CORRECTION : Utiliser verifyAdmin au lieu de verifyAuth
    const authResult = await verifyAdmin(req);
    
    if (!authResult.authorized) {
      console.log('❌ Accès refusé:', authResult.message);
      return NextResponse.json(
        { success: false, error: authResult.message || 'Non autorisé' },
        { status: 403 }
      );
    }

    console.log('✅ Admin autorisé:', authResult.user.mode || authResult.user.email);

    // Charger settings
    let settings;
    try {
      settings = await Settings.findOne({ key: 'global' }).lean();
      console.log('📊 Settings trouvé:', !!settings);
    } catch (dbError) {
      console.error('❌ Erreur DB:', dbError);
      return NextResponse.json(
        { success: false, error: 'Erreur base de données' },
        { status: 500 }
      );
    }
    
    // Si pas de settings, créer une config par défaut
    if (!settings || !settings.payment) {
      console.log('⚠️ Aucune configuration de paiement, retour config par défaut');
      
      return NextResponse.json({
        success: true,
        providers: [
          {
            name: 'moneroo',
            label: 'Moneroo',
            icon: '💳',
            enabled: false,
            configured: false,
            isActive: false,
            config: { environment: 'test', defaultCurrency: 'XOF' }
          },
          {
            name: 'fedapay',
            label: 'FedaPay',
            icon: '💰',
            enabled: false,
            configured: false,
            isActive: false,
            config: { environment: 'sandbox', defaultCurrency: 'XOF' }
          },
          {
            name: 'kkiapay',
            label: 'KkiaPay',
            icon: '⚡',
            enabled: false,
            configured: false,
            isActive: false,
            config: { environment: 'sandbox', defaultCurrency: 'XOF' }
          },
          {
            name: 'pawapay',
            label: 'PawaPay',
            icon: '🌍',
            enabled: false,
            configured: false,
            isActive: false,
            config: { environment: 'sandbox', defaultCurrency: 'XOF' }
          }
        ],
        activeProvider: '',
        ebookPrice: 2100
      });
    }

    const payment = settings.payment;
    const activeProvider = payment.activeProvider || '';

    console.log('💰 Prix eBook:', payment.ebookPrice);
    console.log('⭐ Provider actif:', activeProvider);

    // Définir la structure des providers
    const providerDefinitions = {
      moneroo: {
        name: 'moneroo',
        label: 'Moneroo',
        icon: '💳',
        requiredFields: ['apiKey']
      },
      fedapay: {
        name: 'fedapay',
        label: 'FedaPay',
        icon: '💰',
        requiredFields: ['publicKey', 'secretKey']
      },
      kkiapay: {
        name: 'kkiapay',
        label: 'KkiaPay',
        icon: '⚡',
        requiredFields: ['publicKey', 'privateKey', 'secret']
      },
      pawapay: {
        name: 'pawapay',
        label: 'PawaPay',
        icon: '🌍',
        requiredFields: ['apiKey']
      }
    };

    // Construire la liste des providers
    const providers = Object.entries(providerDefinitions).map(([key, def]) => {
      const config = payment[key] || {};
      
      // Vérifier si le provider est configuré
      const configured = def.requiredFields.every(field => {
        return config[field] && config[field] !== '';
      });

      const provider = {
        name: def.name,
        label: def.label,
        icon: def.icon,
        enabled: config.enabled || false,
        configured: configured,
        isActive: activeProvider === def.name,
        config: {
          environment: config.environment || (def.name === 'pawapay' ? 'sandbox' : 'test'),
          defaultCurrency: config.defaultCurrency || 'XOF',
        }
      };

      console.log(`📌 ${def.name}:`, {
        enabled: provider.enabled,
        configured: provider.configured,
        isActive: provider.isActive
      });

      return provider;
    });

    const response = {
      success: true,
      providers: providers,
      activeProvider: activeProvider,
      ebookPrice: payment.ebookPrice || 2100
    };

    console.log('✅ Réponse envoyée:', {
      nbProviders: providers.length,
      activeProvider: activeProvider,
      ebookPrice: response.ebookPrice
    });

    return NextResponse.json(response);

  } catch (error) {
    console.error('❌ Erreur GET payment-providers:', error);
    console.error('Stack:', error.stack);
    
    return NextResponse.json(
      { 
        success: false, 
        error: error.message,
        stack: process.env.NODE_ENV === 'development' ? error.stack : undefined
      },
      { status: 500 }
    );
  }
}