import axios from 'axios';
import ProviderBase from './ProviderBase';

class PawaPayProvider extends ProviderBase {
  constructor(config) {
    super(config);
    // PawaPay a des URLs différentes selon l'environnement
    this.baseURL = config.environment === 'sandbox'
      ? 'https://api.sandbox.pawapay.io'
      : 'https://api.pawapay.io';
  }

  isConfigured() {
    // PawaPay requiert juste apiKey
    return !!(this.config?.apiKey);
  }

  async createPayment(data) {
    try {
      console.log('📤 Création paiement avec pawapay');
      console.log('🔑 Mode:', this.config?.environment || 'production');
      
      const payload = {
        amount: data.amount.toString(),
        currency: data.currency || 'XOF',
        correspondent: 'MTN_MOMO_BEN', // À adapter selon le pays
        payer: {
          type: 'MSISDN',
          address: {
            value: data.customerPhone || '22997000000'
          }
        },
        customerTimestamp: new Date().toISOString(),
        statementDescription: data.description,
        metadata: [
          {
            fieldName: 'email',
            fieldValue: data.customerEmail,
            isPII: true
          },
          {
            fieldName: 'customerName',
            fieldValue: data.customerName || 'Client Bookzy',
            isPII: true
          }
        ]
      };

      console.log('📦 Payload PawaPay:', JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${this.baseURL}/deposits`,
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      console.log('✅ Réponse pawapay:', response.data);

      return {
        success: true,
        paymentUrl: null, // PawaPay n'a pas d'URL de paiement direct
        transactionId: response.data.depositId,
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur création paiement pawapay:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du paiement PawaPay');
    }
  }

  async verifyPayment(transactionId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/deposits/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      const status = response.data.status;
      
      return {
        success: status === 'COMPLETED',
        status: this.mapStatus(status),
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur vérification paiement pawapay:', error.message);
      throw new Error('Erreur lors de la vérification du paiement');
    }
  }

  mapStatus(providerStatus) {
    const statusMap = {
      'SUBMITTED': 'pending',
      'ACCEPTED': 'pending',
      'COMPLETED': 'completed',
      'FAILED': 'failed',
      'REJECTED': 'failed'
    };

    return statusMap[providerStatus] || 'pending';
  }
}

export default PawaPayProvider;