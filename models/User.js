// models/User.js

import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const userSchema = new mongoose.Schema(
  {
    // IDENTITÉ
    firstName: {
      type: String,
      trim: true,
      default: ""
    },
    lastName: {
      type: String,
      trim: true,
      default: ""
    },
    name: {
      type: String,
      required: true,
      trim: true
    },

    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true
    },

    password: {
      type: String,
      required: true
    },

    // LOCALISATION
    country: {
      type: String,
      default: ""
    },
    lang: {
      type: String,
      default: "fr"
    },

    // RÔLES
    role: {
      type: String,
      enum: ["user", "admin", "super_admin"],
      default: "user"
    },

    permissions: {
      users: { type: Boolean, default: false },
      ebooks: { type: Boolean, default: false },
      payments: { type: Boolean, default: false },
      analytics: { type: Boolean, default: false },
      notifications: { type: Boolean, default: false },
      trends: { type: Boolean, default: false },
      settings: { type: Boolean, default: false }
    },

    avatar: {
      type: String,
      default: ""
    },

    isActive: {
      type: Boolean,
      default: true
    },

    // 🔥 EMAIL VERIFICATION (garde UN SEUL champ)
    emailVerified: {
      type: Boolean,
      default: false
    },
    emailVerifiedAt: {
      type: Date,
      default: null
    },
    emailVerificationSentAt: {
      type: Date,
      default: null
    },

    // 🔥 PASSWORD SECURITY
    lastPasswordChange: {
      type: Date,
      default: null
    },

    // STATS
    ebooksCreated: {
      type: Number,
      default: 0
    },

    lastLogin: {
      type: Date
    },

    // ✅ FAVORIS TENDANCES
    favorites: {
      type: [String],
      default: []
    },

    // 🔐 SÉCURITÉ / 2FA
    security: {
      twoFAEnabled: { type: Boolean, default: false },

      twoFAMethod: {
        type: String,
        enum: ["none", "email", "sms", "app"],
        default: "none"
      },

      twoFAPhone: {
        type: String,
        default: ""
      },

      // Secret pour Authenticator (base32)
      twoFASecret: {
        type: String,
        default: ""
      },

      // True une fois que l'utilisateur a validé un code TOTP
      twoFAVerified: {
        type: Boolean,
        default: false
      }
    },

    subscription: {
      plan: {
        type: String,
        enum: ["free", "pro", "premium"],
        default: "free"
      },
      status: {
        type: String,
        enum: ["active", "inactive", "cancelled"],
        default: "active"
      },
      startDate: Date,
      endDate: Date
    }
  },
  {
    timestamps: true
  }
);

// HASH MOT DE PASSE
userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

// COMPARE PASSWORD
userSchema.methods.comparePassword = async function (candidatePassword) {
  return await bcrypt.compare(candidatePassword, this.password);
};

// CHECK ADMIN
userSchema.methods.isAdmin = function () {
  return this.role === "admin" || this.role === "super_admin";
};

// 🔥 CHECK EMAIL VERIFIED
userSchema.methods.isVerified = function () {
  return this.emailVerified === true;
};

// 🔥 CHECK SI PEUT RENVOYER EMAIL (rate limiting 1 min)
userSchema.methods.canResendVerification = function () {
  if (!this.emailVerificationSentAt) return true;
  
  const lastSent = new Date(this.emailVerificationSentAt);
  const now = new Date();
  const oneMinute = 60 * 1000;
  
  return (now - lastSent) >= oneMinute;
};

// 🔥 FIX IMPORTANT — empêche la validation complète lors des updates partiels (2FA)
userSchema.set("validateBeforeSave", false);

export default mongoose.models.User || mongoose.model("User", userSchema);