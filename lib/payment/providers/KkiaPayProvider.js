import axios from 'axios';
import ProviderBase from './ProviderBase';

class KkiaPayProvider extends ProviderBase {
  constructor(config) {
    super(config);
    this.isProduction = config.environment === 'live' || !config.environment;
    this.apiUrl = this.isProduction 
      ? 'https://api.kkiapay.me' 
      : 'https://api-sandbox.kkiapay.me';
  }

  isConfigured() {
    // Vérifie la présence de la Secret Key (sk_...)
    return !!this.config?.secret;
  }

  async createPayment(data) {
    try {
      const endpoint = `${this.apiUrl}/api/v1/payments/request`;
      
      // On utilise la Secret Key (sk_...) du champ 'secret' de ta DB
      const secretKey = this.config.secret;

      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        reason: data.description || 'Paiement Bookzy',
        callback: data.returnUrl,
        sandbox: !this.isProduction
      };

      console.log(`📤 Tentative redirection KkiaPay avec la clé: ${secretKey.substring(0, 8)}...`);

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Accept': 'application/json',
          'x-api-key': secretKey // sk_ est obligatoire ici
        }
      });

      return {
        success: true,
        paymentUrl: response.data.url,
        transactionId: response.data.transactionId,
        rawResponse: response.data
      };
    } catch (error) {
      console.error('❌ Erreur KkiaPay API:', error.response?.data || error.message);
      throw new Error('Erreur initialisation paiement');
    }
  }

  async verifyPayment(transactionId) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/v1/transactions/status/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
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
      throw new Error('Erreur lors de la vérification');
    }
  }

  mapStatus(s) {
    const m = { 'SUCCESS': 'completed', 'SUCCESSFUL': 'completed', 'FAILED': 'failed' };
    return m[s] || 'pending';
  }
}

export default KkiaPayProvider;