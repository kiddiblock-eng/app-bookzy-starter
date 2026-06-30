"use client";

import { useEffect, useState } from "react";
import {
  Shield,
  ShieldCheck,
  UserCheck,
  Activity,
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
      <div className="max-w-3xl space-y-10">
        <div className="h-9 w-72 rounded bg-neutral-100 animate-pulse" />
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[0, 1].map((i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
              <div className="h-5 w-40 rounded bg-neutral-100 animate-pulse" />
              <div className="h-4 w-full rounded bg-neutral-100 animate-pulse" />
              <div className="h-4 w-3/4 rounded bg-neutral-100 animate-pulse" />
              <div className="h-4 w-2/3 rounded bg-neutral-100 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <div className="h-5 w-48 rounded bg-neutral-100 animate-pulse" />
          <div className="h-4 w-full rounded bg-neutral-100 animate-pulse" />
          <div className="h-4 w-1/2 rounded bg-neutral-100 animate-pulse" />
        </div>
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
      <h1 className="text-3xl font-bold tracking-tight text-neutral-900 flex items-center gap-3">
        <Shield className="text-emerald-600" />
        Sécurité du compte admin
      </h1>

      {/* Bloc résumé */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <UserCheck className="text-emerald-600" />
            Compte
          </h2>
          <p className="text-sm text-neutral-600">
            <span className="text-neutral-500">Nom :</span>{" "}
            <span className="font-medium text-neutral-900">{sec.name}</span>
          </p>
          <p className="text-sm text-neutral-600">
            <span className="text-neutral-500">Email :</span>{" "}
            <span className="font-medium text-neutral-900">{sec.email}</span>
          </p>
          <p className="text-sm text-neutral-600">
            <span className="text-neutral-500">Rôle :</span>{" "}
            <span className="font-medium uppercase text-neutral-900">{sec.role}</span>
          </p>
          <p className="text-xs text-neutral-500 mt-2">
            Compte créé le :{" "}
            <span className="text-neutral-700">
              {sec.accountCreatedAt
                ? new Date(sec.accountCreatedAt).toLocaleString("fr")
                : "-"}
            </span>
          </p>
        </div>

        <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
          <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
            <ShieldCheck className="text-emerald-600" />
            Double authentification
          </h2>

          <p className="text-sm text-neutral-600">
            <span className="text-neutral-500">Statut :</span>{" "}
            <span
              className={
                sec.twoFAEnabled ? "text-emerald-600 font-medium" : "text-red-600 font-medium"
              }
            >
              {sec.twoFAEnabled ? "Activée" : "Désactivée"}
            </span>
          </p>

          <p className="text-sm text-neutral-600">
            <span className="text-neutral-500">Méthode :</span>{" "}
            <span className="font-medium text-neutral-900">{twoFATextMap[sec.twoFAMethod] || "—"}</span>
          </p>

          {!sec.twoFAEnabled && (
            <p className="text-xs text-amber-700 bg-amber-50 border border-amber-200 rounded-xl px-3 py-2 mt-2 flex items-center gap-2">
              <AlertTriangle className="w-3 h-3" />
              Active la 2FA dans la page &quot;E-mail & mot de passe&quot; pour sécuriser ton accès admin.
            </p>
          )}
        </div>
      </div>

      {/* Activité */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 space-y-3">
        <h2 className="text-lg font-semibold text-neutral-900 flex items-center gap-2">
          <Activity className="text-emerald-600" />
          Activité récente
        </h2>

        <p className="text-sm text-neutral-600">
          <span className="text-neutral-500">Dernière connexion :</span>{" "}
          <span className="font-medium text-neutral-900">
            {sec.lastLogin ? new Date(sec.lastLogin).toLocaleString("fr") : "-"}
          </span>
        </p>

        {sec.activity ? (
          <>
            <p className="text-sm text-neutral-600">
              <span className="text-neutral-500">Dernière activité :</span>{" "}
              <span className="font-medium text-neutral-900">
                {sec.activity.lastSeen
                  ? new Date(sec.activity.lastSeen).toLocaleString("fr")
                  : "-"}
              </span>
            </p>
            <p className="text-sm text-neutral-600">
              <span className="text-neutral-500">IP :</span>{" "}
              <span className="font-medium text-neutral-900">{sec.activity.ip || "-"}</span>
            </p>
            <p className="text-xs text-neutral-500 mt-1">
              Navigateur / device : {sec.activity.userAgent || "-"}
            </p>
          </>
        ) : (
          <p className="text-sm text-neutral-500">
            Aucune activité enregistrée encore (endpoint /api/activity/track sera rempli au fur et
            à mesure).
          </p>
        )}
      </div>
    </div>
  );
}
