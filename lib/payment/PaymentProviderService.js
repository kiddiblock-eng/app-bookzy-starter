import Settings from "@/models/settings";
import MonerooProvider from "./providers/MonerooProvider";
import KkiaPayProvider from "./providers/KkiaPayProvider";

class PaymentProviderService {
  // Cette fonction est appelée quand on veut payer
  static async getProvider(providerName) {
    console.log(`🔌 Tentative de connexion au provider : ${providerName}`);

    // 1. On va chercher tes réglages dans la base de données
    const settings = await Settings.findOne({ key: "global" }).lean();
    
    // Si pas de réglages, on arrête tout
    if (!settings || !settings.payment) {
      throw new Error("Erreur: Impossible de lire les réglages de paiement en base de données.");
    }

    // 2. On récupère la config spécifique (ex: celle de Moneroo)
    const config = settings.payment[providerName];

    // Si la config est vide, on arrête
    if (!config) {
      throw new Error(`Erreur: Aucune configuration trouvée pour ${providerName}. Vérifiez l'admin.`);
    }

    // 3. On choisit le bon outil
    let provider;
    switch (providerName) {
      case 'moneroo':
        provider = new MonerooProvider(config);
        break;
      case 'kkiapay':
        provider = new KkiaPayProvider(config);
        break;
      default:
        throw new Error(`Erreur: Le provider ${providerName} n'est pas reconnu par le code.`);
    }

    // 4. Vérification finale : Est-ce qu'il y a bien une Clé API ?
    if (!provider.isConfigured()) {
      throw new Error(`Erreur: Le service ${providerName} n'a pas de Clé API (apiKey) configurée.`);
    }

    // Si tout est bon, on donne le feu vert
    return provider;
  }
}

export default PaymentProviderService;