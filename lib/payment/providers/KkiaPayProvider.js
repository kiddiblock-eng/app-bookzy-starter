import axios from 'axios';
import ProviderBase from './ProviderBase';

class KkiaPayProvider extends ProviderBase {
  constructor(config) {
    super(config);
    // KkiaPay a une seule URL pour sandbox et production
    this.baseURL = 'https://api.kkiapay.me';
  }

  isConfigured() {
    // KkiaPay requiert publicKey, privateKey ET secret
    return !!(this.config?.publicKey && this.config?.privateKey && this.config?.secret);
  }

  async createPayment(data) {
    try {
      console.log('📤 Création paiement avec kkiapay');
      console.log('🔑 Mode:', this.config?.environment || 'production');
      
      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        name: data.customerName || 'Client Bookzy',
        description: data.description,
        callback_url: data.returnUrl
      };

      console.log('📦 Payload KkiaPay:', JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${this.baseURL}/api/v1/payment-requests`,
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'x-api-key': this.config.privateKey
          }
        }
      );

      console.log('✅ Réponse kkiapay:', response.data);

      return {
        success: true,
        paymentUrl: response.data.url,
        transactionId: response.data.requestId,
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur création paiement kkiapay:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du paiement KkiaPay');
    }
  }

  async verifyPayment(transactionId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/api/v1/transactions/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': this.config.privateKey
          }
        }
      );

      const status = response.data.status;
      
      return {
        success: status === 'SUCCESS',
        status: this.mapStatus(status),
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur vérification paiement kkiapay:', error.message);
      throw new Error('Erreur lors de la vérification du paiement');
    }
  }

  mapStatus(providerStatus) {
    const statusMap = {
      'PENDING': 'pending',
      'SUCCESS': 'completed',
      'FAILED': 'failed',
      'CANCELLED': 'cancelled'
    };

    return statusMap[providerStatus] || 'pending';
  }
}

export default KkiaPayProvider;