"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  ShieldCheck,
  UserCheck,
  Activity,
  Loader2,
  AlertTriangle,
} from "lucide-react";

export default function SecuritySettingsPage() {
  const [loading, setLoading] = useState(true);
  const [sec, setSec] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const res = await fetch("/api/admin/settings/security/overview", {
          credentials: "include",
        });
        const json = await res.json();
        if (json.success) setSec(json.security);
      } catch (e) {
        console.error(e);
      }
      setLoading(false);
    };

    load();
  }, []);

  if (loading || !sec) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  const twoFATextMap = {
    none: "Désactivée",
    email: "Via e-mail (code)",
    sms: "Via SMS",
    app: "Via application d’authentification",
  };

  return (
    <div className="max-w-3xl space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Shield className="text-purple-400" />
        Sécurité du compte admin
      </h1>

      {/* Bloc résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <UserCheck className="text-purple-300" />
            Compte
          </h2>
          <p className="text-sm">
            <span className="text-gray-400">Nom :</span>{" "}
            <span className="font-medium">{sec.name}</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-400">Email :</span>{" "}
            <span className="font-medium">{sec.email}</span>
          </p>
          <p className="text-sm">
            <span className="text-gray-400">Rôle :</span>{" "}
            <span className="font-medium uppercase">{sec.role}</span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            Compte créé le :{" "}
            <span className="text-gray-300">
              {sec.accountCreatedAt
                ? new Date(sec.accountCreatedAt).toLocaleString("fr")
                : "-"}
            </span>
          </p>
        </div>

        <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-semibold flex items-center gap-2">
            <ShieldCheck className="text-purple-300" />
            Double authentification
          </h2>

          <p className="text-sm">
            <span className="text-gray-400">Statut :</span>{" "}
            <span
              className={
                sec.twoFAEnabled ? "text-green-300 font-medium" : "text-red-300 font-medium"
              }
            >
              {sec.twoFAEnabled ? "Activée" : "Désactivée"}
            </span>
          </p>

          <p className="text-sm">
            <span className="text-gray-400">Méthode :</span>{" "}
            <span className="font-medium">{twoFATextMap[sec.twoFAMethod] || "—"}</span>
          </p>

          {!sec.twoFAEnabled && (
            <p className="text-xs text-yellow-200 bg-yellow-900/20 border border-yellow-700/40 rounded-xl px-3 py-2 mt-2 flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" />
              Active la 2FA dans la page &quot;E-mail & mot de passe&quot; pour sécuriser ton accès admin.
            </p>
          )}
        </div>
      </div>

      {/* Activité */}
      <div className="bg-white/5 border border-white/10 rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold flex items-center gap-2">
          <Activity className="text-purple-300" />
          Activité récente
        </h2>

        <p className="text-sm">
          <span className="text-gray-400">Dernière connexion :</span>{" "}
          <span className="font-medium">
            {sec.lastLogin ? new Date(sec.lastLogin).toLocaleString("fr") : "-"}
          </span>
        </p>

        {sec.activity ? (
          <>
            <p className="text-sm">
              <span className="text-gray-400">Dernière activité :</span>{" "}
              <span className="font-medium">
                {sec.activity.lastSeen
                  ? new Date(sec.activity.lastSeen).toLocaleString("fr")
                  : "-"}
              </span>
            </p>
            <p className="text-sm">
              <span className="text-gray-400">IP :</span>{" "}
              <span className="font-medium">{sec.activity.ip || "-"}</span>
            </p>
            <p className="text-xs text-gray-500 mt-1">
              Navigateur / device : {sec.activity.userAgent || "-"}
            </p>
          </>
        ) : (
          <p className="text-sm text-gray-400">
            Aucune activité enregistrée encore (endpoint /api/activity/track sera rempli au fur et
            à mesure).
          </p>
        )}
      </div>
    </div>
  );
}