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

  // 🔥 CETTE MÉTHODE ÉTAIT MANQUANTE ET CAUSAIT L'ERREUR
  isConfigured() {
    // Vérifie que les 3 clés sont bien présentes dans ton admin Bookzy
    return !!(
      this.config?.publicKey && 
      this.config?.privateKey && 
      this.config?.secret
    );
  }

  async createPayment(data) {
    try {
      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        reason: data.description || 'Paiement Bookzy',
        callback: data.returnUrl,
        sandbox: !this.isProduction
      };

      const response = await axios.post(
        `${this.apiUrl}/api/v1/payment-requests`,
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': this.config.publicKey
          }
        }
      );

      return {
        success: true,
        paymentUrl: response.data.url,
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
      const response = await axios.get(
        `${this.apiUrl}/api/v1/transactions/status/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': this.config.secret // Utilise la Secret Key de l'admin
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
      console.error('❌ Erreur 404 Kkiapay:', error.message);
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