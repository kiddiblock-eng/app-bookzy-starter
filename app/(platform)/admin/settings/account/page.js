"use client";

import { useEffect, useState } from "react";
import {
  Mail,
  Lock,
  ShieldCheck,
  Loader2,
  Smartphone,
  Shield,
  CheckCircle2,
  AlertTriangle,
} from "lucide-react";

export default function AccountSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [twoFAEnabled, setTwoFAEnabled] = useState(false);
  const [twoFAMethod, setTwoFAMethod] = useState("none");
  const [twoFAPhone, setTwoFAPhone] = useState("");

  const [lastLogin, setLastLogin] = useState(null);
  const [createdAt, setCreatedAt] = useState(null);

  const [status, setStatus] = useState(null);

  // 2FA APP
  const [showQR, setShowQR] = useState(false);
  const [qrCode, setQrCode] = useState("");
  const [tempSecret, setTempSecret] = useState("");
  const [verifyCode, setVerifyCode] = useState("");
  const [isVerifying, setIsVerifying] = useState(false);

  const load = async () => {
    try {
      const res = await fetch("/api/admin/settings/account", {
        credentials: "include",
      });
      const json = await res.json();

      if (json.success) {
        const acc = json.account;

        setName(acc.name || "");
        setEmail(acc.email || "");

        setTwoFAEnabled(acc.security?.twoFAEnabled || false);
        setTwoFAMethod(acc.security?.twoFAMethod || "none");
        setTwoFAPhone(acc.security?.twoFAPhone || "");

        setLastLogin(acc.lastLogin || null);
        setCreatedAt(acc.createdAt || null);
      } else {
        setStatus({ type: "error", message: json.message });
      }
    } catch (e) {
      setStatus({ type: "error", message: "Erreur réseau" });
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  // 📌 Générer QR + secret
  const generateQR = async () => {
    try {
      const res = await fetch("/api/admin/2fa/setup", {
        method: "POST",
        credentials: "include",
      });

      const json = await res.json();

      if (!json.success) {
        return setStatus({ type: "error", message: json.message });
      }

      setTempSecret(json.secret);
      setQrCode(json.qrCode); // 🔥 correction ici
      setShowQR(true);
    } catch {
      setStatus({ type: "error", message: "Erreur réseau" });
    }
  };

  // 📌 Vérification du code TOTP
  const verify2FA = async () => {
    setIsVerifying(true);

    try {
      const res = await fetch("/api/admin/2fa/verify", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          code: verifyCode, // 🔥 uniquement le code, pas besoin du secret
        }),
      });

      const json = await res.json();

      if (!json.success) {
        setStatus({ type: "error", message: json.message || "Code incorrect" });
      } else {
        setStatus({ type: "success", message: "2FA activée avec succès !" });
        setShowQR(false);
        load();
      }
    } catch {
      setStatus({ type: "error", message: "Erreur réseau" });
    }

    setIsVerifying(false);
  };

  const handleSave = async () => {
    setStatus(null);

    if (newPassword && newPassword !== confirmPassword) {
      return setStatus({
        type: "error",
        message: "Les nouveaux mots de passe ne correspondent pas.",
      });
    }

    setSaving(true);

    try {
      const body = {
        email,
        twoFA: {
          enabled: twoFAEnabled,
          method: twoFAEnabled ? twoFAMethod : "none",
          phone: twoFAPhone,
        },
      };

      if (newPassword) {
        body.currentPassword = currentPassword;
        body.newPassword = newPassword;
      }

      const res = await fetch("/api/admin/settings/account", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(body),
      });

      const json = await res.json();

      if (!json.success) {
        setStatus({ type: "error", message: json.message });
      } else {
        setStatus({ type: "success", message: "Compte mis à jour." });
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
      }
    } catch {
      setStatus({ type: "error", message: "Erreur réseau" });
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  return (
    <div className="max-w-3xl space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Shield className="text-purple-400" />
        E-mail & Mot de passe
      </h1>

      {status && (
        <div
          className={`flex items-center gap-3 px-4 py-3 rounded-xl border text-sm ${
            status.type === "success"
              ? "bg-green-900/30 border-green-500/40 text-green-200"
              : "bg-red-900/30 border-red-500/40 text-red-200"
          }`}
        >
          {status.type === "success" ? (
            <CheckCircle2 className="w-4 h-4" />
          ) : (
            <AlertTriangle className="w-4 h-4" />
          )}
          <span>{status.message}</span>
        </div>
      )}

      {/* EMAIL */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Mail className="text-purple-300" /> Email de connexion
        </h2>

        <div>
          <label className="text-sm text-gray-400">Adresse e-mail</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg p-3"
          />
        </div>
      </div>

      {/* PASSWORD */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Lock className="text-purple-300" /> Changer de mot de passe
        </h2>

        <div className="grid gap-4 md:grid-cols-3">
          <div className="md:col-span-1">
            <label className="text-sm text-gray-400">Mot de passe actuel</label>
            <input
              type="password"
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg p-3"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Nouveau mot de passe</label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg p-3"
            />
          </div>
          <div>
            <label className="text-sm text-gray-400">Confirmer</label>
            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg p-3"
            />
          </div>
        </div>
      </div>

      {/* 2FA */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-4">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <ShieldCheck className="text-purple-300" />
          Authentification à double facteur (2FA)
        </h2>

        {/* Toggle */}
        <div className="flex items-center justify-between bg-black/30 border border-white/10 rounded-xl px-4 py-3">
          <div>
            <p className="text-sm font-medium">Activer la 2FA</p>
          </div>

          <button
            onClick={() => setTwoFAEnabled((v) => !v)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition ${
              twoFAEnabled ? "bg-purple-500" : "bg-gray-600"
            }`}
          >
            <span
              className={`inline-block h-5 w-5 transform rounded-full bg-white transition ${
                twoFAEnabled ? "translate-x-5" : "translate-x-1"
              }`}
            />
          </button>
        </div>

        {/* OPTIONS */}
        {twoFAEnabled && (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-gray-400">Méthode</label>
              <select
                value={twoFAMethod}
                onChange={(e) => setTwoFAMethod(e.target.value)}
                className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg p-3"
              >
                <option value="email">E-mail</option>
                <option value="sms">SMS</option>
                <option value="app">Application (Google Auth)</option>
              </select>
            </div>

            {/* SMS */}
            {twoFAMethod === "sms" && (
              <div>
                <label className="text-sm text-gray-400">Numéro</label>
                <input
                  type="tel"
                  value={twoFAPhone}
                  onChange={(e) => setTwoFAPhone(e.target.value)}
                  className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg p-3"
                  placeholder="+225..."
                />
              </div>
            )}

            {/* GOOGLE AUTH */}
            {twoFAMethod === "app" && (
              <div className="space-y-4">
                {!showQR && (
                  <button
                    onClick={generateQR}
                    className="bg-purple-600 hover:bg-purple-700 px-4 py-2 rounded-lg"
                  >
                    Générer le QR Code
                  </button>
                )}

                {showQR && (
                  <div className="space-y-4 bg-black/20 p-4 rounded-xl border border-white/10">
                    <p className="text-xs text-gray-300 text-center">
                      Scanne avec Google Authenticator
                    </p>

                    <img src={qrCode} className="w-40 h-40 mx-auto" />

                    <p className="text-xs text-gray-400 text-center break-all">
                      Secret : {tempSecret}
                    </p>

                    <div>
                      <label className="text-sm text-gray-400">
                        Code à 6 chiffres
                      </label>
                      <input
                        value={verifyCode}
                        onChange={(e) => setVerifyCode(e.target.value)}
                        className="mt-1 w-full bg-black/30 border border-white/10 rounded-lg p-3"
                        placeholder="123456"
                        maxLength={6}
                      />
                    </div>

                    <button
                      onClick={verify2FA}
                      disabled={isVerifying}
                      className="bg-green-600 hover:bg-green-700 px-4 py-2 rounded-lg w-full"
                    >
                      {isVerifying ? "Vérification..." : "Activer 2FA"}
                    </button>
                  </div>
                )}
              </div>
            )}
          </div>
        )}
      </div>

      <button
        onClick={handleSave}
        disabled={saving}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-xl font-semibold"
      >
        {saving ? "Enregistrement..." : "Enregistrer les modifications"}
      </button>
    </div>
  );
}