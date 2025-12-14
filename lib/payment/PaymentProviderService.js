// lib/payment/PaymentProviderService.js

import Settings from "../../models/settings";
import MonerooProvider from "./providers/MonerooProvider";
import FedaPayProvider from "./providers/FedaPayProvider";
import KkiaPayProvider from "./providers/KkiaPayProvider";
import PawaPayProvider from "./providers/PawaPayProvider";

class PaymentProviderService {
  constructor() {
    this.providers = new Map();
    this.activeProvider = null;
    this.isInitialized = false;
  }

  /**
   * Initialiser les providers depuis la base de données
   */
  async initialize() {
    try {
      console.log("🔧 Initialisation PaymentProviderService...");

      // Charger la config depuis Settings
      const settings = await Settings.findOne({ key: "global" }).lean();

      if (!settings || !settings.payment) {
        console.error("❌ Aucune configuration de paiement trouvée dans settings");
        throw new Error("Configuration de paiement manquante");
      }

      const paymentConfig = settings.payment;
      const activeProviderName = paymentConfig.activeProvider;

      if (!activeProviderName) {
        console.error("❌ Aucun provider actif défini dans settings.payment.activeProvider");
        throw new Error("Aucun provider actif configuré");
      }

      console.log(`📌 Provider actif configuré: ${activeProviderName}`);

      // Map des classes de providers
      const providerClasses = {
        moneroo: MonerooProvider,
        fedapay: FedaPayProvider,
        kkiapay: KkiaPayProvider,
        pawapay: PawaPayProvider,
      };

      // Initialiser tous les providers disponibles
      for (const [providerName, ProviderClass] of Object.entries(providerClasses)) {
        const config = paymentConfig[providerName];

        if (config && config.enabled) {
          try {
            // 🔥 LOG de debug pour voir la config exacte
            console.log(`🔍 Configuration ${providerName}:`, {
              enabled: config.enabled,
              environment: config.environment,
              hasApiKey: !!config.apiKey,
              hasPublicKey: !!config.publicKey,
              hasSecretKey: !!config.secretKey,
              hasPrivateKey: !!config.privateKey,
              defaultCurrency: config.defaultCurrency
            });

            // Créer l'instance du provider
            const provider = new ProviderClass(config);

            // Vérifier que le provider est correctement configuré
            if (provider.isConfigured()) {
              this.providers.set(providerName, provider);
              console.log(`✅ Provider ${providerName} initialisé et configuré`);

              // Si c'est le provider actif, le définir
              if (providerName === activeProviderName) {
                this.activeProvider = provider;
                console.log(`✅ Provider actif défini: ${providerName}`);
              }
            } else {
              console.warn(`⚠️ Provider ${providerName} activé mais clés API manquantes`);
              console.log(`💡 Config reçue:`, config);
            }
          } catch (error) {
            console.error(`❌ Erreur lors de l'initialisation de ${providerName}:`, error.message);
          }
        } else {
          console.log(`⏭️ Provider ${providerName} désactivé ou non configuré`);
        }
      }

      if (!this.activeProvider) {
        console.error("❌ Le provider actif n'a pas pu être initialisé");
        console.log("Available providers:", Array.from(this.providers.keys()));
        throw new Error(`Le provider actif "${activeProviderName}" n'est pas disponible ou mal configuré`);
      }

      this.isInitialized = true;
      console.log(`✅ PaymentProviderService initialisé avec succès`);
      console.log(`📊 Providers disponibles: ${Array.from(this.providers.keys()).join(", ")}`);

      return this.activeProvider;
    } catch (error) {
      console.error("❌ Erreur lors de l'initialisation de PaymentProviderService:", error);
      throw error;
    }
  }

  /**
   * Obtenir le provider actif (initialise si nécessaire)
   */
  async getActiveProvider() {
    if (!this.isInitialized) {
      await this.initialize();
    }

    if (!this.activeProvider) {
      throw new Error("Aucun provider de paiement actif");
    }

    return this.activeProvider;
  }

  /**
   * Obtenir un provider spécifique par son nom
   */
  async getProvider(providerName) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Provider "${providerName}" non disponible`);
    }

    return provider;
  }

  /**
   * Vérifier si un provider existe
   */
  hasProvider(providerName) {
    return this.providers.has(providerName);
  }

  /**
   * Liste tous les providers disponibles
   */
  getAvailableProviders() {
    return Array.from(this.providers.keys());
  }

  /**
   * Réinitialiser le service (utile pour tests ou rechargement config)
   */
  reset() {
    this.providers.clear();
    this.activeProvider = null;
    this.isInitialized = false;
    console.log("🔄 PaymentProviderService réinitialisé");
  }
}

// Export singleton
const paymentProviderService = new PaymentProviderService();

export default paymentProviderService;