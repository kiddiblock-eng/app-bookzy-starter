import axios from 'axios';
import ProviderBase from './ProviderBase';

class KkiaPayProvider extends ProviderBase {
  constructor(config) {
    super(config);
    this.isProduction = config.environment === 'live' || !config.environment;
    this.apiUrl = this.isProduction ? 'https://api.kkiapay.me' : 'https://api-sandbox.kkiapay.me';
  }

  isConfigured() {
    // On vérifie que la pk_ et la sk_ sont présentes
    return !!(this.config?.publicKey && this.config?.secret);
  }

  async createPayment(data) {
    try {
      const endpoint = `${this.apiUrl}/api/v1/payments/request`;
      
      // 🔥 IMPORTANT : Kkiapay demande la PUBLIC KEY (pk_...) pour générer le lien
      const publicKey = this.config.publicKey; 

      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        reason: data.description || 'Ebook Bookzy',
        callback: data.returnUrl,
        sandbox: !this.isProduction
      };

      console.log(`📤 Création lien KkiaPay avec la Public Key: ${publicKey.substring(0, 10)}...`);

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Accept': 'application/json',
          'x-api-key': publicKey // pk_... ici pour éviter l'erreur 4003
        }
      });

      return {
        success: true,
        paymentUrl: response.data.url,
        transactionId: response.data.transactionId
      };
    } catch (error) {
      console.error('❌ Erreur Kkiapay API:', error.response?.data || error.message);
      throw new Error('Erreur initialisation paiement');
    }
  }

  async verifyPayment(transactionId) {
    try {
      // 🔥 Pour la vérification, on utilise la SECRET KEY (sk_...)
      const response = await axios.get(
        `${this.apiUrl}/api/v1/transactions/status/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': this.config.secret
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
      console.error('❌ Erreur vérification Kkiapay:', error.message);
      throw new Error('Erreur lors de la vérification');
    }
  }

  mapStatus(s) {
    const m = { 'SUCCESS': 'completed', 'SUCCESSFUL': 'completed', 'FAILED': 'failed' };
    return m[s] || 'pending';
  }
}

export default KkiaPayProvider;