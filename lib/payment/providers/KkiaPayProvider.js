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

  isConfigured() {
    // Vérifie que la clé secrète est présente dans le champ 'secret' de votre DB
    return !!this.config?.secret;
  }

  async createPayment(data) {
    try {
      // ✅ URL officielle pour la redirection
      const endpoint = `${this.apiUrl}/api/v1/payments/request`;
      
      // 🔥 UTILISATION DE LA CLÉ SECRÈTE (sk_...)
      // Pour les appels API, Kkiapay veut la Secret Key, pas la Public Key.
      const secretKey = this.config.secret;

      const payload = {
        amount: data.amount,
        currency: data.currency || 'XOF',
        email: data.customerEmail,
        reason: data.description || 'Paiement Bookzy',
        callback: data.returnUrl,
        sandbox: !this.isProduction
      };

      console.log(`📤 Envoi vers KkiaPay (Session) avec la clé: ${secretKey.substring(0, 8)}...`);

      const response = await axios.post(endpoint, payload, {
        headers: {
          'Accept': 'application/json',
          'x-api-key': secretKey // On envoie la Secret Key ici
        }
      });

      return {
        success: true,
        paymentUrl: response.data.url,
        transactionId: response.data.transactionId,
        rawResponse: response.data
      };
    } catch (error) {
      console.error('❌ Erreur KkiaPay API:', error.response?.data || error.message);
      throw new Error('Impossible d\'initier le paiement : vérifiez vos clés API Live');
    }
  }

  async verifyPayment(transactionId) {
    try {
      const response = await axios.get(
        `${this.apiUrl}/api/v1/transactions/status/${transactionId}`,
        {
          headers: {
            'Accept': 'application/json',
            'x-api-key': this.config.secret // On utilise aussi la Secret Key ici
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