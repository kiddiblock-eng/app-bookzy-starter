import axios from 'axios';
import ProviderBase from './ProviderBase';

class KkiaPayProvider extends ProviderBase {
  constructor(config) {
    super(config);
    this.isProduction = config.environment === 'live' || !config.environment;
    this.apiUrl = this.isProduction ? 'https://api.kkiapay.me' : 'https://api-sandbox.kkiapay.me';
    
    // Détection automatique des clés par préfixe
    this.pk = Object.values(config).find(v => typeof v === 'string' && v.startsWith('pk_'));
    this.sk = Object.values(config).find(v => typeof v === 'string' && v.startsWith('sk_'));
  }

  isConfigured() {
    return !!(this.pk && this.sk);
  }

  async createPayment(data) {
    // 🛡️ MODE LIVE : On utilise le Widget pour éviter l'erreur 4003
    if (this.isProduction) {
      console.log('⚠️ Mode LIVE détecté : Passage en mode Widget SDK');
      return {
        success: true,
        useWidget: true, // Signal pour le frontend
        widgetConfig: {
          amount: data.amount,
          api_key: this.pk,
          sandbox: false,
          email: data.customerEmail,
          name: data.customerName || 'Client Bookzy',
          phone: data.customerPhone || '',
        }
      };
    }

    // 🧪 MODE SANDBOX : On garde la redirection pour vos tests
    try {
      const endpoint = `${this.apiUrl}/api/v1/payments/request`;
      const response = await axios.post(endpoint, {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        callback: data.returnUrl,
        sandbox: true
      }, {
        headers: { 'Accept': 'application/json', 'x-api-key': this.sk }
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
      const response = await axios.get(
        `${this.apiUrl}/api/v1/transactions/status/${transactionId}`,
        { headers: { 'Accept': 'application/json', 'x-api-key': this.sk } }
      );
      return {
        success: response.data.status === 'SUCCESS' || response.data.status === 'SUCCESSFUL',
        status: this.mapStatus(response.data.status),
        rawResponse: response.data
      };
    } catch (error) {
      throw new Error('Erreur vérification');
    }
  }

  mapStatus(s) {
    const m = { 'SUCCESS': 'completed', 'SUCCESSFUL': 'completed', 'FAILED': 'failed' };
    return m[s] || 'pending';
  }
}

export default KkiaPayProvider;