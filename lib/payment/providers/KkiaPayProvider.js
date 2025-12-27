import axios from 'axios';
import ProviderBase from './ProviderBase';

class KkiaPayProvider extends ProviderBase {
  constructor(config) {
    super(config);
    // ✅ KkiaPay : API REST uniquement disponible en SANDBOX
    this.baseURL = config.environment === 'sandbox' 
      ? 'https://api-sandbox.kkiapay.me'
      : null; // Pas d'API REST en production
  }

  isConfigured() {
    // KkiaPay requiert publicKey, privateKey ET secret
    return !!(this.config?.publicKey && this.config?.privateKey && this.config?.secret);
  }

  async createPayment(data) {
    try {
      console.log('📤 Création paiement avec kkiapay');
      console.log('🔑 Mode:', this.config?.environment || 'live');
      
      // ⚠️ KkiaPay LIVE n'a pas d'API REST backend
      // Il faut utiliser le widget SDK côté client
      if (this.config.environment === 'live' || !this.config.environment) {
        console.warn('⚠️ KkiaPay LIVE nécessite le widget SDK (pas d\'API backend)');
        
        // Retourner les données pour le widget côté client
        return {
          success: true,
          useWidget: true, // 🔥 Flag pour indiquer d'utiliser le widget
          widgetConfig: {
            amount: data.amount,
            api_key: this.config.publicKey,
            sandbox: false,
            email: data.customerEmail,
            phone: data.customerPhone || '',
            name: data.customerName || 'Client Bookzy',
          },
          // Pas de paymentUrl car le widget s'ouvre côté client
          paymentUrl: null,
          transactionId: `KKP-${Date.now()}`,
          rawResponse: {
            message: 'Utiliser le widget KkiaPay côté client'
          }
        };
      }

      // 🔥 MODE SANDBOX : Utiliser l'API REST
      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        firstname: data.customerName?.split(' ')[0] || 'Client',
        lastname: data.customerName?.split(' ')[1] || 'Bookzy',
        reason: data.description || 'Paiement Bookzy',
      };

      console.log('📦 Payload KkiaPay (sandbox):', JSON.stringify(payload, null, 2));

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

      console.log('✅ Réponse kkiapay (sandbox):', response.data);

      return {
        success: true,
        paymentUrl: response.data.url,
        transactionId: response.data.requestId || response.data.transactionId,
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur création paiement kkiapay:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur lors de la création du paiement KkiaPay');
    }
  }

  async verifyPayment(transactionId) {
    try {
      // ⚠️ En LIVE, utiliser l'API de vérification
      const apiUrl = this.config.environment === 'sandbox'
        ? 'https://api-sandbox.kkiapay.me'
        : 'https://api.kkiapay.me';

      const response = await axios.get(
        `${apiUrl}/api/v1/transactions/status`,
        {
          params: {
            transactionId: transactionId
          },
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
      'SUCCESSFUL': 'completed',
      'FAILED': 'failed',
      'CANCELLED': 'cancelled'
    };

    return statusMap[providerStatus] || 'pending';
  }
}

export default KkiaPayProvider;