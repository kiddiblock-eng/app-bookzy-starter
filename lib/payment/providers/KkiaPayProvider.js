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
    // ✅ On vérifie les champs exacts de votre MongoDB
    return !!(this.config?.privateKey || this.config?.publicKey);
  }

  async createPayment(data) {
    try {
      // 🎯 URL EXACTE pour la redirection
      const endpoint = `${this.apiUrl}/api/v1/payments/request`;
      
      // 🔑 D'après votre DB, la clé 'pk_...' est dans 'privateKey'
      const apiKey = this.config.privateKey || this.config.publicKey;

      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        reason: data.description || 'Paiement Bookzy',
        callback: data.returnUrl,
        sandbox: !this.isProduction
      };

      console.log(`📤 Envoi vers KkiaPay avec la clé: ${apiKey.substring(0, 8)}...`);

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Accept': 'application/json',
          'x-api-key': apiKey
        }
      });

      return {
        success: true,
        paymentUrl: response.data.url,
        transactionId: response.data.transactionId,
        rawResponse: response.data
      };
    } catch (error) {
      console.error('❌ Erreur création KkiaPay:', error.response?.data || error.message);
      throw new Error('Impossible d\'initier le paiement');
    }
  }

  async verifyPayment(transactionId) {
    try {
      // 🔑 On utilise le champ 'secret' de votre DB (sk_...)
      const secret = this.config.secret;

      const response = await axios.get(
        `${this.apiUrl}/api/v1/transactions/status/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': secret
          }
        }
      );

      const status = response.data.status;
      return {
        success: status === 'SUCCESS' || status === 'SUCCESSFUL',
        status: this.mapStatus(status),
        rawResponse: response.data
      };
    } catch (error) {
      console.error('❌ Erreur vérification Kkiapay:', error.response?.data || error.message);
      throw new Error('Erreur lors de la vérification');
    }
  }

  mapStatus(providerStatus) {
    const statusMap = {
      'SUCCESS': 'completed',
      'SUCCESSFUL': 'completed',
      'FAILED': 'failed',
      'PENDING': 'pending'
    };
    return statusMap[providerStatus] || 'pending';
  }
}

export default KkiaPayProvider;