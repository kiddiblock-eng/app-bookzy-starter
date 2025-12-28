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
   * Initialise les instances de providers depuis la base de données
   */
  async initialize() {
    try {
      console.log("🔧 Initialisation PaymentProviderService...");

      // 1. Charger la configuration globale depuis MongoDB
      const settings = await Settings.findOne({ key: "global" }).lean();

      if (!settings || !settings.payment) {
        throw new Error("Configuration de paiement manquante dans la base de données");
      }

      const paymentConfig = settings.payment;
      const activeProviderName = paymentConfig.activeProvider;

      if (!activeProviderName) {
        throw new Error("Aucun fournisseur de paiement actif défini (activeProvider)");
      }

      // 2. Mapping des classes de providers disponibles
      const providerClasses = {
        moneroo: MonerooProvider,
        fedapay: FedaPayProvider,
        kkiapay: KkiaPayProvider,
        pawapay: PawaPayProvider,
      };

      // 3. Boucle d'initialisation pour chaque service
      for (const [providerName, ProviderClass] of Object.entries(providerClasses)) {
        const config = paymentConfig[providerName];

        // On n'initialise que si le service est activé (enabled: true)
        if (config && config.enabled) {
          try {
            const provider = new ProviderClass(config);

            // On vérifie si le provider possède les clés nécessaires (pk_ et sk_)
            if (provider.isConfigured()) {
              this.providers.set(providerName, provider);
              console.log(`✅ Provider ${providerName} initialisé et prêt`);

              // Définir le service actif pour l'application
              if (providerName === activeProviderName) {
                this.activeProvider = provider;
                console.log(`⭐ Provider ACTIF sélectionné : ${providerName}`);
              }
            } else {
              // 🔥 Si on arrive ici, c'est que les clés pk_ ou sk_ sont introuvables
              console.warn(`⚠️ Provider ${providerName} ignoré : clés API incomplètes dans MongoDB`);
            }
          } catch (error) {
            console.error(`❌ Échec de l'initialisation pour ${providerName}:`, error.message);
          }
        } else {
          console.log(`⏭️ Provider ${providerName} désactivé`);
        }
      }

      // 4. Vérification finale
      if (!this.activeProvider) {
        console.error("❌ Erreur : Le provider sélectionné n'est pas prêt. Vérifiez vos clés.");
        throw new Error(`Le provider "${activeProviderName}" n'a pas pu être initialisé`);
      }

      this.isInitialized = true;
      console.log(`📊 Services disponibles : ${Array.from(this.providers.keys()).join(", ")}`);
      return this.activeProvider;

    } catch (error) {
      console.error("❌ Erreur fatale PaymentProviderService:", error.message);
      throw error;
    }
  }

  /**
   * Récupère le provider actif (recharge la configuration pour être à jour)
   */
  async getActiveProvider() {
    // On réinitialise pour toujours prendre en compte les changements faits dans l'admin
    this.reset();
    await this.initialize();
    
    if (!this.activeProvider) {
      throw new Error("Aucun service de paiement actif");
    }
    return this.activeProvider;
  }

  /**
   * Récupère un provider spécifique par son nom
   */
  async getProvider(providerName) {
    if (!this.isInitialized) {
      await this.initialize();
    }

    const provider = this.providers.get(providerName);
    if (!provider) {
      throw new Error(`Le service "${providerName}" n'est pas disponible`);
    }
    return provider;
  }

  /**
   * Réinitialise l'état interne
   */
  reset() {
    this.providers.clear();
    this.activeProvider = null;
    this.isInitialized = false;
  }
}

// Export d'une instance unique (Singleton)
const paymentProviderService = new PaymentProviderService();
export default paymentProviderService;