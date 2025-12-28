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

  async createPayment(data) {
    try {
      // Préparation du payload pour la redirection directe
      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        reason: data.description || 'Paiement Bookzy',
        callback: data.returnUrl, // URL de retour après paiement 🔥
        sandbox: !this.isProduction
      };

      const response = await axios.post(
        `${this.apiUrl}/api/v1/payment-requests`,
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': this.config.publicKey // Utilise la Public Key ici
          }
        }
      );

      return {
        success: true,
        paymentUrl: response.data.url, // URL de redirection directe 🔥
        transactionId: response.data.transactionId,
        rawResponse: response.data
      };
    } catch (error) {
      console.error('❌ Erreur création KkiaPay:', error.response?.data || error.message);
      throw new Error('Impossible d\'initier le paiement KkiaPay');
    }
  }

  async verifyPayment(transactionId) {
    try {
      // 🔥 URL CORRECTE avec /status/ et utilisation de la SECRET KEY
      const response = await axios.get(
        `${this.apiUrl}/api/v1/transactions/status/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': this.config.secret // Indispensable pour éviter le 404 🔥
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
      console.error('❌ Erreur 404 Kkiapay : Vérifiez la SECRET KEY dans l\'admin');
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