import axios from 'axios';
import ProviderBase from './ProviderBase';

class FedaPayProvider extends ProviderBase {
  constructor(config) {
    super(config);
    
    // ✅ CORRECTION ICI : On vérifie si l'environnement est 'sandbox' OU 'test'
    // Tes logs indiquent que ta DB envoie 'test', donc cela permettra d'utiliser la bonne URL.
    const isSandbox = config.environment === 'sandbox' || config.environment === 'test';

    this.baseURL = isSandbox 
      ? 'https://sandbox-api.fedapay.com/v1'
      : 'https://api.fedapay.com/v1';
  }

  isConfigured() {
    // FedaPay requiert publicKey ET secretKey
    return !!(this.config?.publicKey && this.config?.secretKey);
  }

  async createPayment(data) {
    try {
      console.log('📤 Création paiement avec fedapay');
      console.log('🔑 Mode:', this.config?.environment || 'production');
      console.log('🌐 URL API:', this.baseURL); // Log ajouté pour vérifier l'URL utilisée
      
      const payload = {
        amount: data.amount,
        currency: {
          iso: data.currency || 'XOF'
        },
        customer: {
          email: data.customerEmail,
          firstname: data.customerName?.split(' ')[0] || 'Client',
          lastname: data.customerName?.split(' ')[1] || 'Bookzy'
        },
        description: data.description,
        callback_url: data.returnUrl
      };

      console.log('📦 Payload FedaPay:', JSON.stringify(payload, null, 2));

      const response = await axios.post(
        `${this.baseURL}/transactions`,
        payload,
        {
          headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${this.config.secretKey}`
          }
        }
      );

      console.log('✅ Réponse fedapay:', response.data);

      // Gestion de la structure de réponse
      // Note : L'API standard renvoie souvent { transaction: {...} } ou directement l'objet
      // On garde ta logique mais on ajoute une sécurité si la clé change
      const transactionData = response.data['v1/transaction'] || response.data.transaction || response.data;
      
      if (!transactionData) {
        console.error('❌ Structure de réponse invalide:', response.data);
        throw new Error('Structure de réponse FedaPay invalide');
      }

      return {
        success: true,
        paymentUrl: transactionData.payment_url || transactionData.url, 
        transactionId: transactionData.id || transactionData.reference,
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur création paiement fedapay:', error.response?.data || error.message);
      // On renvoie un message clair si l'authentification échoue
      const errorMsg = error.response?.data?.message || error.message;
      throw new Error(errorMsg);
    }
  }

  async verifyPayment(transactionId) {
    try {
      const response = await axios.get(
        `${this.baseURL}/transactions/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'Authorization': `Bearer ${this.config.secretKey}`
          }
        }
      );

      const transactionData = response.data['v1/transaction'] || response.data.transaction || response.data;
      
      if (!transactionData) {
        throw new Error('Structure de réponse FedaPay invalide');
      }

      const status = transactionData.status;
      
      return {
        success: status === 'approved',
        status: this.mapStatus(status),
        rawResponse: response.data
      };

    } catch (error) {
      console.error('❌ Erreur vérification paiement fedapay:', error.message);
      throw new Error('Erreur lors de la vérification du paiement');
    }
  }

  mapStatus(providerStatus) {
    const statusMap = {
      'pending': 'pending',
      'approved': 'completed',
      'declined': 'failed',
      'cancelled': 'cancelled'
    };

    return statusMap[providerStatus] || 'pending';
  }
}

export default FedaPayProvider;