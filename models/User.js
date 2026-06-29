import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // IDENTITÉ
    firstName: { type: String, trim: true, default: "" },
    lastName:  { type: String, trim: true, default: "" },
    name:      { type: String, required: true, trim: true },
    email:     { type: String, required: true, unique: true, lowercase: true, trim: true },
    password:  { type: String, required: false },

    // LOCALISATION
    country: { type: String, default: "" },
    lang:    { type: String, default: "fr" },

    // RÔLES
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user"
    },
    permissions: {
      users:         { type: Boolean, default: false },
      ebooks:        { type: Boolean, default: false },
      payments:      { type: Boolean, default: false },
      analytics:     { type: Boolean, default: false },
      notifications: { type: Boolean, default: false },
      trends:        { type: Boolean, default: false },
      settings:      { type: Boolean, default: false }
    },

    avatar:   { type: String, default: "" },
    isActive: { type: Boolean, default: true },

    // EMAIL VERIFICATION
    emailVerified:            { type: Boolean, default: false },
    emailVerifiedAt:          { type: Date, default: null },
    emailVerificationSentAt:  { type: Date, default: null },

    // GOOGLE AUTH
    authProvider: { type: String, enum: ['local', 'google'], default: 'local' },
    googleId:     { type: String, sparse: true },

    // PASSWORD SECURITY
    lastPasswordChange: { type: Date, default: null },

    // STATS
    ebooksCreated: { type: Number, default: 0 },
    lastLogin:     { type: Date },

    // FAVORIS TENDANCES
    favorites: { type: [String], default: [] },
    unlockedTrendsAt:    { type: Date, default: null },
    unlockedTrendsCount: { type: Number, default: 0 },

    // ─── SYSTÈME DE CRÉDITS ──────────────────────────────────────────────────
    credits: {
      balance:        { type: Number, default: 4, min: 0 },
      totalPurchased: { type: Number, default: 0 },
      totalSpent:     { type: Number, default: 0 },
     freeProductAnalyses:  { type: Number, default: 0 }, // ← ajouter

    },

    // Plan actuel
    plan: {
      type: String,
      enum: ["free", "solo", "createur", "agence"],
      default: "free"
    },
    planExpiresAt: { type: Date, default: null },

    // Statut "outils débloqués" (acheteurs Créateur/Pro) — null sinon.
    // Reverrouillé automatiquement quand le solde d'ebooks tombe à 0.
    toolsTier: { type: String, default: null },

    // Limites journalières
    dailyUsage: {
      date:            { type: String, default: "" },
      youtubeAnalysis: { type: Number, default: 0 },
      nicheHunter:     { type: Number, default: 0 },
      nicheAnalysis:   { type: Number, default: 0 },
      productAnalysis: { type: Number, default: 0 }, // ← Analyseur de produit
    },
    // ─────────────────────────────────────────────────────────────────────────

    // AFFILIATION
    affiliateCode: { type: String, unique: true, sparse: true, trim: true },
    referredBy:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', default: null },
    wallet: {
      balance:     { type: Number, default: 0, min: 0 },
      totalEarned: { type: Number, default: 0 }
    },

    // ─── AMÉLIORATION IA ─────────────────────────────────────────────────────
    aiUsage: {
      usedToday:     { type: Number, default: 0 },
      dailyLimit:    { type: Number, default: 3 },
      lastResetDate: { type: Date, default: null },
    },
    // ─────────────────────────────────────────────────────────────────────────

    // NOTIFICATIONS
    whatsNewSeenAt: { type: Date, default: null },

    // SÉCURITÉ / 2FA
    security: {
      twoFAEnabled:  { type: Boolean, default: false },
      twoFAMethod:   { type: String, enum: ["none", "email", "sms", "app"], default: "none" },
      twoFAPhone:    { type: String, default: "" },
      twoFASecret:   { type: String, default: "" },
      twoFAVerified: { type: Boolean, default: false }
    },
  },
  { timestamps: true }
);

// ─── LIMITES JOURNALIÈRES PAR PLAN ──────────────────────────────────────────
export const DAILY_LIMITS = {
  free:     { youtubeAnalysis: 0,  nicheHunter: 0,  nicheAnalysis: 0,  productAnalysis: 0  },
  solo:     { youtubeAnalysis: 2,  nicheHunter: 3,  nicheAnalysis: 3,  productAnalysis: 3  },
  createur: { youtubeAnalysis: 8,  nicheHunter: 8,  nicheAnalysis: 8,  productAnalysis: 8  },
  agence:   { youtubeAnalysis: 15, nicheHunter: 20, nicheAnalysis: 20, productAnalysis: 20 },
};

// ─── COÛT DES ACTIONS EN CRÉDITS ────────────────────────────────────────────
export const CREDIT_COSTS = {
  ebook:        20,
  mise_en_page: 20, // Ebook Designer = 1 ebook
  smart_shop:    5,
};

// ─── CRÉDITS OFFERTS PAR PACK ────────────────────────────────────────────────
export const PACK_CREDITS = {
  solo_monthly:       100,
  solo_quarterly:     300,
  createur_monthly:   400,
  createur_quarterly: 1200,
  agence_monthly:     900,
  agence_quarterly:   2700,
};

// ─── MÉTHODES D'INSTANCE ─────────────────────────────────────────────────────

userSchema.methods.hasCredits = function (action) {
  const cost = CREDIT_COSTS[action];
  if (!cost) return false;
  return this.credits.balance >= cost;
};

userSchema.methods.spendCredits = async function (action) {
  const cost = CREDIT_COSTS[action];
  if (!cost) throw new Error(`Action inconnue: ${action}`);
  if (this.credits.balance < cost) throw new Error(`Crédits insuffisants (${this.credits.balance}/${cost})`);
  this.credits.balance   -= cost;
  this.credits.totalSpent += cost;
  // Plus d'ebooks → on reverrouille les outils (statut Créateur/Pro perdu)
  if (this.credits.balance <= 0) this.toolsTier = null;
  await this.save();
  return this.credits.balance;
};

userSchema.methods.addCredits = async function (amount, newPlan = null) {
  this.credits.balance        += amount;
  this.credits.totalPurchased += amount;
  if (newPlan) this.plan = newPlan;
  await this.save();
  return this.credits.balance;
};

userSchema.methods.checkDailyReset = function () {
  const today = new Date().toISOString().split("T")[0];
  if (this.dailyUsage.date !== today) {
    this.dailyUsage.date            = today;
    this.dailyUsage.youtubeAnalysis = 0;
    this.dailyUsage.nicheHunter     = 0;
    this.dailyUsage.nicheAnalysis   = 0;
    this.dailyUsage.productAnalysis = 0;
  }
};

userSchema.methods.canDoDaily = function (action) {
  this.checkDailyReset();
  const limit = DAILY_LIMITS[this.plan]?.[action];
  if (limit === Infinity) return true;
  return (this.dailyUsage[action] || 0) < limit;
};

userSchema.methods.incrementDaily = async function (action) {
  this.checkDailyReset();
  this.dailyUsage[action] = (this.dailyUsage[action] || 0) + 1;
  await this.save();
};

// ─── HOOKS ───────────────────────────────────────────────────────────────────

userSchema.pre("save", async function (next) {
  if (!this.isModified("password") || !this.password) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// ─── MÉTHODES EXISTANTES ─────────────────────────────────────────────────────

userSchema.methods.comparePassword = async function (candidatePassword) {
  if (!this.password) return false;
  return await bcrypt.compare(candidatePassword, this.password);
};

userSchema.methods.isAdmin = function () {
  return this.role === "admin" || this.role === "super_admin";
};

userSchema.methods.isVerified = function () {
  return this.emailVerified === true;
};

userSchema.methods.canResendVerification = function () {
  if (!this.emailVerificationSentAt) return true;
  const lastSent = new Date(this.emailVerificationSentAt);
  const now = new Date();
  return (now - lastSent) >= 60 * 1000;
};

export default mongoose.models.User || mongoose.model("User", userSchema);