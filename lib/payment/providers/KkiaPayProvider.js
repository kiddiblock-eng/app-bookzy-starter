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
      console.log('🔑 Mode:', this.config?.environment || 'live');
      
      // ⚠️ KkiaPay LIVE n'a pas d'API REST backend
      // Il faut utiliser le widget SDK côté client
      if (this.config.environment === 'live' || !this.config.environment) {
        console.warn('⚠️ KkiaPay LIVE nécessite le widget SDK (pas d\'API backend)');
        
        // Retourner les données pour le widget côté client
        return {
          success: true,
          useWidget: true,
          widgetConfig: {
            amount: data.amount,
            api_key: this.config.publicKey,
            sandbox: false,
            email: data.customerEmail,
            phone: data.customerPhone || '',
            name: data.customerName || 'Client Bookzy',
          },
          paymentUrl: null,
          transactionId: `KKP-${Date.now()}`,
          rawResponse: {
            message: 'Utiliser le widget KkiaPay côté client'
          }
        };
      }

      // 🔥 MODE SANDBOX : Utiliser l'API REST
      const apiUrl = 'https://api-sandbox.kkiapay.me';
      
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
        `${apiUrl}/api/v1/payment-requests`,
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
      console.log(`🔍 Vérification KkiaPay transaction: ${transactionId}`);
      
      // ✅ API de vérification KkiaPay (fonctionne en LIVE et SANDBOX)
      const apiUrl = this.config.environment === 'sandbox' 
        ? 'https://api-sandbox.kkiapay.me'
        : 'https://api.kkiapay.me';
      
      const response = await axios.get(
        `${apiUrl}/api/v1/transactions/status/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': this.config.privateKey
          }
        }
      );

      console.log(`✅ Réponse vérification KkiaPay:`, response.data);

      const status = response.data.status;
      
      return {
        success: status === 'SUCCESS' || status === 'SUCCESSFUL',
        status: this.mapStatus(status),
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur vérification paiement kkiapay:', error.response?.data || error.message);
      throw new Error('Erreur lors de la vérification du paiement');
    }
  }

  /**
   * 🔥 NOUVELLE MÉTHODE : Traiter les webhooks KkiaPay
   */
  async handleWebhook(webhookData) {
    try {
      console.log('🎣 Traitement webhook KkiaPay:', webhookData);

      // KkiaPay envoie : { transactionId, isPaymentSucces, amount, ... }
      const transactionId = webhookData.transactionId;
      const isSuccess = webhookData.isPaymentSucces === true;

      if (!transactionId) {
        throw new Error('Transaction ID manquant dans le webhook');
      }

      // Vérifier le statut avec l'API KkiaPay
      const verification = await this.verifyPayment(transactionId);

      return {
        success: isSuccess && verification.success,
        transactionId: transactionId,
        status: verification.status,
        amount: webhookData.amount,
        rawResponse: webhookData
      };

    } catch (error) {
      console.error('❌ Erreur traitement webhook KkiaPay:', error);
      throw new Error(`Webhook KkiaPay error: ${error.message}`);
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