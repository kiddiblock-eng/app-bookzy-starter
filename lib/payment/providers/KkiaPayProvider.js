import axios from 'axios';
import ProviderBase from './ProviderBase';

class KkiaPayProvider extends ProviderBase {
  constructor(config) {
    super(config);
    this.isProduction = config.environment === 'live' || !config.environment;
    this.apiUrl = this.isProduction ? 'https://api.kkiapay.me' : 'https://api-sandbox.kkiapay.me';
  }

  isConfigured() {
    console.log('🔍 KkiaPay config reçue:', JSON.stringify(this.config, null, 2));
    console.log('✅ publicKey exists?', !!this.config?.publicKey);
    console.log('✅ privateKey exists?', !!this.config?.privateKey);
    console.log('✅ secret exists?', !!this.config?.secret);
    
    const isOk = !!(this.config?.publicKey && this.config?.privateKey && this.config?.secret);
    console.log('🎯 isConfigured result:', isOk);
    
    return isOk;
  }

  async createPayment(data) {
    // 🔥 MODE LIVE (Widget)
    if (this.isProduction) {
      console.log('⚠️ Mode LIVE détecté : Passage en mode Widget SDK');
      console.log('📌 Metadata envoyé:', data.metadata); // ← AJOUTÉ pour debug
      
      return {
        success: true,
        useWidget: true,
        widgetConfig: {
          amount: data.amount,
          api_key: this.config.publicKey,
          sandbox: false,
          email: data.customerEmail,
          name: data.customerName || 'Client Bookzy',
          phone: data.customerPhone || '',
          // 🔥 AJOUTER METADATA ICI
          metadata: data.metadata // ← CRITIQUE !
        },
        // ❌ Pas de transactionId avant paiement en mode widget
        transactionId: null
      };
    }

    // 🔥 MODE SANDBOX (API)
    try {
      const endpoint = `${this.apiUrl}/api/v1/payments/request`;
      const response = await axios.post(endpoint, {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        callback: data.returnUrl,
        sandbox: true,
        // 🔥 AJOUTER METADATA AUSSI EN SANDBOX
        metadata: data.metadata
      }, {
        headers: { 
          'Accept': 'application/json', 
          'x-api-key': this.config.secret
        }
      });

      return {
        success: true,
        useWidget: false,
        paymentUrl: response.data.url,
        transactionId: response.data.transactionId
      };
    } catch (error) {
      console.error('❌ Erreur Sandbox Kkiapay:', error.message);
      throw new Error('Erreur initialisation paiement');
    }
  }

  async verifyPayment(transactionId) {
    console.log('⚠️ API vérification KkiaPay non disponible - Mode webhook uniquement');
    console.log('📌 Transaction ID reçu:', transactionId);
    
    return {
      success: true,
      status: 'pending',
      rawResponse: { 
        note: 'Vérification via webhook uniquement',
        transactionId: transactionId
      }
    };
  }

  async handleWebhook(webhookData) {
    try {
      const transactionId = webhookData.transactionId;
      const isSuccess = webhookData.isPaymentSucces === true;
      
      // 🔥 EXTRAIRE METADATA DU WEBHOOK
      const metadata = webhookData.metadata || webhookData.stateData || null;

      if (!transactionId) {
        throw new Error('Transaction ID manquant');
      }

      console.log('✅ Webhook KkiaPay reçu');
      console.log('📌 Transaction ID:', transactionId);
      console.log('📌 Metadata (bookzyTxId):', metadata); // ← AJOUTÉ
      console.log('📌 Statut:', isSuccess ? 'SUCCESS' : 'FAILED');
      console.log('📌 Montant:', webhookData.amount);

      return {
        success: isSuccess,
        transactionId: transactionId,
        status: isSuccess ? 'completed' : 'failed',
        amount: webhookData.amount,
        metadata: metadata, // 🔥 RETOURNER METADATA !
        rawResponse: webhookData
      };
    } catch (error) {
      console.error('❌ Erreur webhook KkiaPay:', error);
      throw new Error(`Webhook error: ${error.message}`);
    }
  }

  mapStatus(s) {
    const m = { 
      'SUCCESS': 'completed', 
      'SUCCESSFUL': 'completed', 
      'FAILED': 'failed',
      'PENDING': 'pending',
      'CANCELLED': 'cancelled'
    };
    return m[s] || 'pending';
  }
}

export default KkiaPayProvider;