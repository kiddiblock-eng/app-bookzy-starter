import axios from 'axios';
import ProviderBase from './ProviderBase';
import crypto from 'crypto';

class MonerooProvider extends ProviderBase {
  constructor(config) {
    super(config);
    this.baseURL = 'https://api.moneroo.io/v1';
  }

  isConfigured() {
    return !!(this.config?.apiKey);
  }

  // 1. CRÉATION DU PAIEMENT AVEC METADATA
  async createPayment(data) {
    try {
      console.log('📤 [Moneroo] Initialisation paiement...');
      
      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        customer: {
          email: data.customerEmail,
          first_name: data.customerName?.split(' ')[0] || 'Client',
          last_name: data.customerName?.split(' ')[1] || 'Bookzy',
          phone: data.customerPhone || ''
        },
        description: data.description,
        return_url: data.returnUrl,
        cancel_url: data.returnUrl,
        
        // 🔥 CRUCIAL : On envoie les IDs pour les récupérer au webhook
        metadata: {
            userId: data.userId,
            projetId: data.projetId,
            transactionId: data.transactionId
        }
      };

      const response = await axios.post(
        `${this.baseURL}/payments/initialize`,
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      // Moneroo renvoie les infos dans response.data.data ou response.data
      const monerooData = response.data.data || response.data;

      return {
        success: true,
        paymentUrl: monerooData.checkout_url,
        transactionId: monerooData.id,
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ [Moneroo] Erreur init:', error.response?.data || error.message);
      throw new Error(error.response?.data?.message || 'Erreur initialisation Moneroo');
    }
  }

  // 2. VÉRIFICATION ROBUSTE (GET API)
  async verifyPayment(transactionId) {
    try {
      console.log(`🔍 [Moneroo] Double-check API pour ID: ${transactionId}`);
      
      const response = await axios.get(
        `${this.baseURL}/payments/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.config.apiKey}`
          }
        }
      );

      const data = response.data.data || response.data;
      
      return {
        success: response.data.success,
        status: this.mapStatus(data.status),
        transactionId: data.id,
        amount: data.amount,
        metadata: data.metadata, // On récupère les vraies metadata fraîches
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ [Moneroo] Erreur Verify API:', error.message);
      throw new Error('Erreur lors de la vérification API Moneroo');
    }
  }

  // Helper pour la signature (optionnel pour l'instant)
  verifySignature(payload, signature) {
    if (!this.config.webhookSecret) return true;
    try {
      const payloadString = JSON.stringify(payload); 
      const computedSignature = crypto
        .createHmac('sha256', this.config.webhookSecret)
        .update(payloadString)
        .digest('hex');
      return signature === computedSignature; 
    } catch (e) {
      return false;
    }
  }

  mapStatus(providerStatus) {
    const statusMap = {
      'pending': 'pending',
      'success': 'completed',
      'successful': 'completed',
      'failed': 'failed',
      'cancelled': 'cancelled'
    };
    return statusMap[providerStatus] || 'pending';
  }
}

export default MonerooProvider;