import mongoose from "mongoose";

const trendSchema = new mongoose.Schema(
  {
    // ═══════════════════════════════════════════════════
    // 📝 INFORMATIONS DE BASE
    // ═══════════════════════════════════════════════════
    title: {
      type: String,
      required: [true, "Le titre est requis"],
      trim: true,
      maxlength: [100, "Le titre ne peut pas dépasser 100 caractères"],
    },
    description: {
      type: String,
      required: [true, "La description est requise"],
      trim: true,
      maxlength: [500, "La description ne peut pas dépasser 500 caractères"],
    },
    emoji: {
      type: String,
      default: "💡",
    },
    gradient: {
      type: String,
      default: "from-blue-500 to-cyan-500",
    },

    // ═══════════════════════════════════════════════════
    // 🌐 RÉSEAU SOCIAL (NOUVEAU !)
    // ═══════════════════════════════════════════════════
    network: {
      type: String,
      enum: [
        "TikTok",
        "Instagram",
        "YouTube",
        "YouTube Shorts",
        "Facebook",
        "Twitter/X",
        "Pinterest",
        "LinkedIn",
        "Snapchat",
        "Reddit",
        "Twitch",
        "Multi-plateformes", // Pour les tendances qui marchent partout
        "Autre",
      ],
      default: "Multi-plateformes",
    },

    // ═══════════════════════════════════════════════════
    // 📊 MÉTRIQUES
    // ═══════════════════════════════════════════════════
    potential: {
      type: Number,
      default: 1000,
      min: [0, "Le potentiel ne peut pas être négatif"],
      max: [10000, "Le potentiel maximum est 10000"],
    },
    difficulty: {
      type: String,
      enum: ["Facile", "Moyen", "Difficile"],
      default: "Moyen",
    },
    searches: {
      type: Number,
      default: 10000,
      min: [0, "Les recherches ne peuvent pas être négatives"],
    },
    competition: {
      type: String,
      enum: ["Faible", "Moyenne", "Élevée"],
      default: "Moyenne",
    },
    growth: {
      type: Number,
      default: 50,
      min: [-100, "La croissance minimale est -100%"],
      max: [1000, "La croissance maximale est 1000%"],
    },

    // ═══════════════════════════════════════════════════
    // 🏷️ CATÉGORISATION & FILTRES
    // ═══════════════════════════════════════════════════
    isHot: {
      type: Boolean,
      default: false,
    },
    isRising: {
      type: Boolean,
      default: false,
    },
    isTrending: {
      type: Boolean,
      default: true,
    },
    isProfitable: {
      type: Boolean,
      default: false,
    },
    isActive: {
      type: Boolean,
      default: true,
    },

    // ═══════════════════════════════════════════════════
    // 📅 DATES & PÉRIODE (NOUVEAU !)
    // ═══════════════════════════════════════════════════
    trendDate: {
      type: Date,
      default: Date.now,
      index: true, // Index pour requêtes rapides par date
    },
    expiryDate: {
      type: Date,
      default: null, // null = pas d'expiration
    },
    period: {
      type: String,
      enum: ["Jour", "Semaine", "Mois", "Trimestre", "Année", "Permanent"],
      default: "Mois",
    },

    // ═══════════════════════════════════════════════════
    // 🎯 SOURCES & TAGS
    // ═══════════════════════════════════════════════════
    sources: {
      type: [String],
      default: [],
    },
    tags: {
      type: [String],
      default: [],
      index: true, // Index pour recherche rapide par tags
    },
    categories: {
      type: [String],
      enum: [
        "Technologie",
        "Business",
        "Santé",
        "Fitness",
        "Alimentation",
        "Éducation",
        "Divertissement",
        "Lifestyle",
        "Finance",
        "Mode",
        "Beauté",
        "Voyage",
        "Gaming",
        "Sport",
        "Art & Design",
        "Musique",
        "Immobilier",
        "Entrepreneuriat",
        "Marketing",
        "Développement personnel",
        "Environnement",
        "Famille & Parentalité",
        "Autre",
      ],
      default: ["Autre"],
    },

    // ═══════════════════════════════════════════════════
    // 📈 ANALYTICS (NOUVEAU !)
    // ═══════════════════════════════════════════════════
    views: {
      type: Number,
      default: 0,
    },
    clicks: {
      type: Number,
      default: 0,
    },
    favorites: {
      type: Number,
      default: 0,
    },
    ctr: {
      // Click-Through Rate (calculé automatiquement)
      type: Number,
      default: 0,
    },

    // ═══════════════════════════════════════════════════
    // 🎨 MÉTADONNÉES AVANCÉES (NOUVEAU !)
    // ═══════════════════════════════════════════════════
    priority: {
      type: Number,
      default: 0,
      min: [0, "La priorité minimale est 0"],
      max: [100, "La priorité maximale est 100"],
    },
    region: {
      type: String,
      enum: ["Global", "France", "USA", "UK", "Canada", "Afrique", "Europe", "Asie", "Autre"],
      default: "Global",
    },
    targetAudience: {
      type: String,
      enum: ["Tous", "18-24 ans", "25-34 ans", "35-44 ans", "45-54 ans", "55+ ans"],
      default: "Tous",
    },
    contentType: {
      type: String,
      enum: [
        "Vidéo courte",
        "Vidéo longue",
        "Reel/Short",
        "Livestream",
        "Post texte",
        "Image/Carrousel",
        "Article/Blog",
        "Podcast",
        "Story",
        "Autre",
      ],
      default: "Vidéo courte",
    },

    // ═══════════════════════════════════════════════════
    // 💰 MONÉTISATION (NOUVEAU !)
    // ═══════════════════════════════════════════════════
    monetizationPotential: {
      type: String,
      enum: ["Faible", "Moyen", "Élevé", "Très élevé"],
      default: "Moyen",
    },
    estimatedRevenue: {
      type: String, // Ex: "100-500€/mois"
      default: null,
    },
   monetizationMethods: {
  type: [String],
  enum: [
    "Ebook",
    "ebook",
    "E-book",
    "Formation",
    "Coaching",
    "Affiliation",
    "Ads",
    "Sponsoring",
    "UGC",
    "Produits",
    "Services",
    "Abonnement",
    "Membership",
    "Marketplace",
    "Dropshipping"
  ],
  default: []
},
     

    // ═══════════════════════════════════════════════════
    // 👤 MÉTADONNÉES ADMIN
    // ═══════════════════════════════════════════════════
    createdBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      default: null,
    },
    notes: {
      type: String,
      default: "",
      maxlength: [1000, "Les notes ne peuvent pas dépasser 1000 caractères"],
    },
  },
  {
    timestamps: true, // Ajoute automatiquement createdAt et updatedAt
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);

// ═══════════════════════════════════════════════════
// 🔍 INDEX POUR PERFORMANCES
// ═══════════════════════════════════════════════════
trendSchema.index({ network: 1, isActive: 1 });
trendSchema.index({ trendDate: -1 });
trendSchema.index({ categories: 1 });
trendSchema.index({ priority: -1, createdAt: -1 });
trendSchema.index({ isHot: 1, isRising: 1, isTrending: 1 });

// ═══════════════════════════════════════════════════
// 📊 VIRTUALS (champs calculés)
// ═══════════════════════════════════════════════════

// Calculer si la tendance est expirée
trendSchema.virtual("isExpired").get(function () {
  if (!this.expiryDate) return false;
  return new Date() > this.expiryDate;
});

// Calculer l'âge de la tendance en jours
trendSchema.virtual("ageInDays").get(function () {
  const now = new Date();
  const created = this.trendDate || this.createdAt;
  const diffTime = Math.abs(now - created);
  return Math.ceil(diffTime / (1000 * 60 * 60 * 24));
});

// Score de popularité combiné
trendSchema.virtual("popularityScore").get(function () {
  return (
    this.views * 1 +
    this.clicks * 3 +
    this.favorites * 5 +
    this.priority * 10
  );
});

// ═══════════════════════════════════════════════════
// 🎯 MÉTHODES D'INSTANCE
// ═══════════════════════════════════════════════════

// Calculer le CTR (Click-Through Rate)
trendSchema.methods.calculateCTR = function () {
  if (this.views === 0) return 0;
  return ((this.clicks / this.views) * 100).toFixed(2);
};

// Incrémenter les vues
trendSchema.methods.incrementViews = async function () {
  this.views += 1;
  this.ctr = this.calculateCTR();
  return this.save();
};

// Incrémenter les clics
trendSchema.methods.incrementClicks = async function () {
  this.clicks += 1;
  this.ctr = this.calculateCTR();
  return this.save();
};

// Vérifier si la tendance est toujours valide
trendSchema.methods.isValid = function () {
  if (!this.isActive) return false;
  if (this.isExpired) return false;
  return true;
};

// ═══════════════════════════════════════════════════
// 🔧 MÉTHODES STATIQUES
// ═══════════════════════════════════════════════════

// Récupérer les tendances actives par réseau
trendSchema.statics.getByNetwork = function (network, limit = 20) {
  return this.find({ network, isActive: true, isExpired: false })
    .sort({ priority: -1, createdAt: -1 })
    .limit(limit);
};

// Récupérer les tendances par période
trendSchema.statics.getByPeriod = function (startDate, endDate) {
  return this.find({
    isActive: true,
    trendDate: { $gte: startDate, $lte: endDate },
  }).sort({ trendDate: -1 });
};

// Récupérer les top tendances
trendSchema.statics.getTopTrends = function (limit = 10) {
  return this.find({ isActive: true })
    .sort({ priority: -1, views: -1, favorites: -1 })
    .limit(limit);
};

// Nettoyer les tendances expirées
trendSchema.statics.cleanExpired = function () {
  return this.updateMany(
    { expiryDate: { $lt: new Date() }, isActive: true },
    { isActive: false }
  );
};

// ═══════════════════════════════════════════════════
// 🪝 HOOKS (Middleware)
// ═══════════════════════════════════════════════════

// Avant sauvegarde : mettre à jour le CTR
trendSchema.pre("save", function (next) {
  this.ctr = this.calculateCTR();
  
  // Auto-définir isProfitable basé sur le potentiel
  if (this.potential >= 4000) {
    this.isProfitable = true;
  }
  
  next();
});

// Avant sauvegarde : vérifier l'expiration
trendSchema.pre("save", function (next) {
  if (this.expiryDate && new Date() > this.expiryDate) {
    this.isActive = false;
  }
  next();
});

const Trend = mongoose.models.Trend || mongoose.model("Trend", trendSchema);

export default Trend;