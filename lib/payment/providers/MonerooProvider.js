import axios from 'axios';
import ProviderBase from './ProviderBase';

class MonerooProvider extends ProviderBase {
  constructor(config) {
    super(config);
    this.baseURL = 'https://api.moneroo.io/v1';
  }

  isConfigured() {
    // 🔥 Vérifier apiKey au lieu de publicKey/secretKey
    return !!(this.config?.apiKey);
  }

  async createPayment(data) {
    try {
      console.log('📤 Création paiement avec moneroo');
      console.log('🔑 Mode:', this.config?.environment || 'production');
      
      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        customer: {
          email: data.customerEmail,
          first_name: data.customerName?.split(' ')[0] || 'Client',
          last_name: data.customerName?.split(' ')[1] || 'Bookzy'
        },
        description: data.description,
        return_url: data.returnUrl,
        cancel_url: data.cancelUrl || data.returnUrl
      };

      console.log('📦 Payload Moneroo:', JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${this.baseURL}/payments/initialize`,
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}` // 🔥 Utiliser apiKey
          }
        }
      );

      console.log('✅ Réponse moneroo:', response.data);

      // 🔥 CORRECTION : La structure de Moneroo est response.data.data
      const monerooData = response.data.data;

      return {
        success: true,
        paymentUrl: monerooData.checkout_url,
        transactionId: monerooData.id,
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur création paiement moneroo:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du paiement Moneroo');
    }
  }

  async verifyPayment(transactionId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/payments/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      // 🔥 CORRECTION : La structure de Moneroo est response.data.data
      const monerooData = response.data.data;
      const status = monerooData.status;
      
      return {
        success: status === 'success',
        status: this.mapStatus(status),
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur vérification paiement moneroo:', error.message);
      throw new Error('Erreur lors de la vérification du paiement');
    }
  }

  mapStatus(providerStatus) {
    const statusMap = {
      'pending': 'pending',
      'success': 'completed',
      'failed': 'failed',
      'cancelled': 'cancelled'
    };

    return statusMap[providerStatus] || 'pending';
  }
}

export default MonerooProvider;