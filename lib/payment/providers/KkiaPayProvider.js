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
    if (this.isProduction) {
      console.log('⚠️ Mode LIVE détecté : Passage en mode Widget SDK');
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
        },
        transactionId: `KKP-${Date.now()}`
      };
    }

    try {
      const endpoint = `${this.apiUrl}/api/v1/payments/request`;
      const response = await axios.post(endpoint, {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        callback: data.returnUrl,
        sandbox: true
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
    try {
      // 🔥 FIX : L'API KkiaPay 2025 utilise POST au lieu de GET
      const response = await axios.post(
        `${this.apiUrl}/api/v1/transaction/status`,
        { 
          transactionId: transactionId
        },
        { 
          headers: { 
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': this.config.secret
          } 
        }
      );
      
      return {
        success: response.data.status === 'SUCCESS' || response.data.status === 'SUCCESSFUL',
        status: this.mapStatus(response.data.status),
        rawResponse: response.data
      };
    } catch (error) {
      console.error('❌ Erreur vérification:', error.response?.data || error.message);
      throw new Error('Erreur vérification');
    }
  }

  async handleWebhook(webhookData) {
    try {
      const transactionId = webhookData.transactionId;
      const isSuccess = webhookData.isPaymentSucces === true;

      if (!transactionId) {
        throw new Error('Transaction ID manquant');
      }

      const verification = await this.verifyPayment(transactionId);

      return {
        success: isSuccess && verification.success,
        transactionId: transactionId,
        status: verification.status,
        amount: webhookData.amount,
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