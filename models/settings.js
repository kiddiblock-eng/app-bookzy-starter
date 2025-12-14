import mongoose from "mongoose";

const SettingsSchema = new mongoose.Schema(
  {
    key: { type: String, required: true, unique: true },

    // --------------------------------
    // 🔥 BLOC GENERAL
    // --------------------------------
    appName: { type: String, default: "Bookzy" },
    appDomain: { type: String, default: "" },
    supportEmail: { type: String, default: "" },

    // --------------------------------
    // 🔥 BLOC PAYMENTS (COMPLET)
    // --------------------------------
    payment: {
      activeProvider: { type: String, default: "moneroo" },
      
      // 🔥 PRIX GLOBAL (pour tous les providers)
      ebookPrice: { type: Number, default: 2100 },

      // 🔴 Moneroo
      moneroo: {
        enabled: { type: Boolean, default: false },
        apiKey: { type: String, default: "" },
        webhookSecret: { type: String, default: "" },
        environment: { type: String, default: "test" }, // test ou live
        defaultCurrency: { type: String, default: "XOF" },
      },

      // 🔵 FedaPay
      fedapay: {
        enabled: { type: Boolean, default: false },
        publicKey: { type: String, default: "" },
        secretKey: { type: String, default: "" },
        webhookSecret: { type: String, default: "" },
        environment: { type: String, default: "sandbox" }, // sandbox ou live
        defaultCurrency: { type: String, default: "XOF" },
      },

      // 🟣 KkiaPay
      kkiapay: {
        enabled: { type: Boolean, default: false },
        publicKey: { type: String, default: "" },
        privateKey: { type: String, default: "" },
        secret: { type: String, default: "" },
        webhookSecret: { type: String, default: "" },
        environment: { type: String, default: "sandbox" }, // sandbox ou live
        defaultCurrency: { type: String, default: "XOF" },
      },

      // 🟢 PawaPay
      pawapay: {
        enabled: { type: Boolean, default: false },
        apiKey: { type: String, default: "" },
        webhookSecret: { type: String, default: "" },
        defaultCurrency: { type: String, default: "XOF" },
      }
    },

    // --------------------------------
    // 🔥 BLOC IA
    // --------------------------------
    ai: {
      providers: {
        claude: {
          enabled: { type: Boolean, default: false },
          apiKey: { type: String, default: "" },
          model: { type: String, default: "claude-sonnet-4-20250514" },
        },
        openai: {
          enabled: { type: Boolean, default: false },
          apiKey: { type: String, default: "" },
          textModel: { type: String, default: "gpt-4o" },
          imageModel: { type: String, default: "dall-e-3" },
        },
        gemini: {
          enabled: { type: Boolean, default: false },
          apiKey: { type: String, default: "" },
          model: { type: String, default: "gemini-2.0-flash-exp" },
        },
        // ✅ NOUVEAU : Replicate (Flux) SEULEMENT AJOUTÉ
        replicate: {
          enabled: { type: Boolean, default: false },
          apiKey: { type: String, default: "" },
          imageModel: { type: String, default: "black-forest-labs/flux-schnell" },
        },
      },

      generation: {
        ebook: {
          provider: { type: String, default: "claude" },
          model: { type: String, default: "claude-sonnet-4-20250514" },
        },
        cover: {
          provider: { type: String, default: "openai" },
          model: { type: String, default: "dall-e-3" },
        },
        ads: {
          provider: { type: String, default: "openai" },
          model: { type: String, default: "gpt-4o" },
        },
        nicheGenerate: {
          provider: { type: String, default: "gemini" },
          model: { type: String, default: "gemini-2.0-flash-exp" },
        },
        nicheAnalyze: {
          provider: { type: String, default: "gemini" },
          model: { type: String, default: "gemini-2.0-flash-exp" },
        },
      },
    },
  },
  { timestamps: true }
);

export default mongoose.models.Settings || mongoose.model("Settings", SettingsSchema);