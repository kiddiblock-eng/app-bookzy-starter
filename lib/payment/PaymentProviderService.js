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

      // 1. Récupérer la configuration globale depuis MongoDB
      const settings = await Settings.findOne({ key: "global" }).lean();

      if (!settings || !settings.payment) {
        console.error("❌ Configuration de paiement manquante");
        throw new Error("Configuration de paiement manquante");
      }

      const paymentConfig = settings.payment;
      const activeProviderName = paymentConfig.activeProvider;

      if (!activeProviderName) {
        console.error("❌ Aucun provider actif défini");
        throw new Error("Aucun provider actif configuré");
      }

      console.log(`📌 Provider actif configuré: ${activeProviderName}`);

      // 2. Mapping des classes
      const providerClasses = {
        moneroo: MonerooProvider,
        fedapay: FedaPayProvider,
        kkiapay: KkiaPayProvider,
        pawapay: PawaPayProvider,
      };

      // 3. Boucle d'initialisation des providers activés
      for (const [providerName, ProviderClass] of Object.entries(providerClasses)) {
        const config = paymentConfig[providerName];

        if (config && config.enabled) {
          try {
            // 🔥 Correction du Log : On vérifie 'secret' car c'est le nom dans ta DB
            console.log(`🔍 Configuration ${providerName}:`, {
              enabled: config.enabled,
              environment: config.environment,
              hasPublicKey: !!config.publicKey,
              hasPrivateKey: !!config.privateKey,
              hasSecretKey: !!config.secret, // ✅ Vérifie le champ 'secret' de ta DB
              defaultCurrency: config.defaultCurrency
            });

            const provider = new ProviderClass(config);

            // Vérifier si le provider est prêt à l'emploi
            if (provider.isConfigured()) {
              this.providers.set(providerName, provider);
              console.log(`✅ Provider ${providerName} initialisé et configuré`);

              // Définir le provider par défaut pour l'application
              if (providerName === activeProviderName) {
                this.activeProvider = provider;
                console.log(`⭐ Provider actif défini: ${providerName}`);
              }
            } else {
              console.warn(`⚠️ Provider ${providerName} activé mais clés manquantes`);
            }
          } catch (error) {
            console.error(`❌ Erreur init ${providerName}:`, error.message);
          }
        } else {
          console.log(`⏭️ Provider ${providerName} désactivé ou non configuré`);
        }
      }

      if (!this.activeProvider) {
        throw new Error(`Le provider actif "${activeProviderName}" n'a pas pu être initialisé`);
      }

      this.isInitialized = true;
      console.log(`📊 Providers prêts: ${Array.from(this.providers.keys()).join(", ")}`);

      return this.activeProvider;
    } catch (error) {
      console.error("❌ Erreur critique PaymentProviderService:", error);
      throw error;
    }
  }

  /**
   * Récupère le provider actif (recharge la DB pour être à jour)
   */
  async getActiveProvider() {
    this.reset();
    await this.initialize();
    
    if (!this.activeProvider) {
      throw new Error("Aucun provider de paiement actif");
    }

    return this.activeProvider;
  }

  /**
   * Récupère un provider spécifique par son nom (ex: 'kkiapay')
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
   * Reset l'état pour forcer un rechargement des clés
   */
  reset() {
    this.providers.clear();
    this.activeProvider = null;
    this.isInitialized = false;
  }
}

// Singleton pour l'application
const paymentProviderService = new PaymentProviderService();
export default paymentProviderService;