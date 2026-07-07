"use client";

import { useEffect, useState } from "react";
import { Loader2, Check, Gift } from "lucide-react";

// Convertit une date ISO → valeur d'input datetime-local (heure locale).
function toLocalInput(iso) {
  if (!iso) return "";
  const d = new Date(iso);
  const off = d.getTimezoneOffset() * 60000;
  return new Date(d.getTime() - off).toISOString().slice(0, 16);
}

export default function AdminPromoPage() {
  const [config, setConfig] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetEmail, setResetEmail] = useState("");
  const [resetMsg, setResetMsg] = useState("");
  const [resetting, setResetting] = useState(false);

  const doReset = async () => {
    if (!resetEmail.trim()) return;
    setResetting(true);
    setResetMsg("");
    try {
      const res = await fetch("/api/admin/promo/reset", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: resetEmail.trim() }),
      });
      const d = await res.json();
      setResetMsg(d?.message || (d?.success ? "OK" : "Erreur"));
      if (d?.success) setResetEmail("");
    } catch {
      setResetMsg("Erreur réseau");
    }
    setResetting(false);
  };

  const load = async () => {
    const res = await fetch("/api/admin/promo", { credentials: "include" });
    const d = await res.json();
    if (d?.success) setConfig(d.config);
    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    setSaved(false);
    const res = await fetch("/api/admin/promo", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        enabled: config.enabled,
        startsAt: config.startsAt || null,
        endsAt: config.endsAt || null,
      }),
    });
    const d = await res.json();
    if (d?.success) { setConfig(d.config); setSaved(true); setTimeout(() => setSaved(false), 2000); }
    setSaving(false);
  };

  if (loading) return <div className="p-8 flex items-center gap-2 text-slate-400"><Loader2 className="w-4 h-4 animate-spin" /> Chargement…</div>;
  if (!config) return <div className="p-8 text-red-500">Accès refusé.</div>;

  return (
    <div className="max-w-2xl mx-auto p-6 sm:p-8">
      <div className="flex items-center gap-3 mb-1">
        <div className="w-10 h-10 rounded-xl flex items-center justify-center text-white" style={{ background: "#059669" }}>
          <Gift className="w-5 h-5" />
        </div>
        <h1 className="text-2xl font-black text-slate-900">Roue promo</h1>
      </div>
      <p className="text-slate-500 text-sm mb-6">
        Remise de bienvenue (5 / 10 / 15 %) proposée une fois aux comptes jamais abonnés. Le % est tiré côté serveur, la remise s'applique sur Créateur &amp; Pro.
      </p>

      <div className="rounded-2xl border border-slate-200 bg-white p-5 space-y-5">
        {/* Statut live */}
        <div className="flex items-center justify-between">
          <span className="text-sm font-medium text-slate-700">État actuel</span>
          <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${config.live ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-500"}`}>
            {config.live ? "En cours" : "Inactive"}
          </span>
        </div>

        {/* Toggle */}
        <label className="flex items-center justify-between cursor-pointer">
          <span className="text-sm font-medium text-slate-700">Activer la roue</span>
          <button
            type="button"
            onClick={() => setConfig({ ...config, enabled: !config.enabled })}
            className={`relative w-12 h-7 rounded-full transition-colors ${config.enabled ? "bg-emerald-500" : "bg-slate-300"}`}
          >
            <span className={`absolute top-1 left-1 w-5 h-5 rounded-full bg-white transition-transform ${config.enabled ? "translate-x-5" : ""}`} />
          </button>
        </label>

        {/* Dates de campagne */}
        <div className="grid sm:grid-cols-2 gap-4 pt-2 border-t border-slate-100">
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Début (optionnel)</label>
            <input
              type="datetime-local"
              value={toLocalInput(config.startsAt)}
              onChange={(e) => setConfig({ ...config, startsAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
          <div>
            <label className="block text-xs font-semibold text-slate-500 mb-1.5">Fin (optionnel)</label>
            <input
              type="datetime-local"
              value={toLocalInput(config.endsAt)}
              onChange={(e) => setConfig({ ...config, endsAt: e.target.value ? new Date(e.target.value).toISOString() : null })}
              className="w-full px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
            />
          </div>
        </div>
        <p className="text-xs text-slate-400">
          Sans dates : la roue est proposée en continu (une fois par nouvel éligible). Avec dates : uniquement pendant la campagne.
        </p>

        <button
          onClick={save}
          disabled={saving}
          className="w-full py-3 rounded-xl text-white font-bold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-70"
          style={{ background: "#059669" }}
        >
          {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : saved ? <Check className="w-4 h-4" /> : null}
          {saved ? "Enregistré" : "Enregistrer"}
        </button>
      </div>

      {/* Reset d'un compte (tests / SAV) */}
      <div className="mt-6 rounded-2xl border border-slate-200 bg-white p-5">
        <p className="text-sm font-bold text-slate-900 mb-1">Réinitialiser un compte</p>
        <p className="text-xs text-slate-500 mb-3">Efface le code d'un utilisateur pour qu'il puisse re-tourner la roue.</p>
        <div className="flex gap-2">
          <input
            type="email"
            value={resetEmail}
            onChange={(e) => setResetEmail(e.target.value)}
            placeholder="email@exemple.com"
            className="flex-1 px-3 py-2 rounded-xl border border-slate-200 text-sm text-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent"
          />
          <button
            onClick={doReset}
            disabled={resetting || !resetEmail.trim()}
            className="px-4 py-2 rounded-xl bg-slate-900 text-white text-sm font-semibold hover:bg-slate-800 disabled:opacity-50 flex items-center gap-2"
          >
            {resetting ? <Loader2 className="w-4 h-4 animate-spin" /> : null} Réinitialiser
          </button>
        </div>
        {resetMsg && <p className="mt-2 text-xs font-medium text-slate-600">{resetMsg}</p>}
      </div>
    </div>
  );
}
