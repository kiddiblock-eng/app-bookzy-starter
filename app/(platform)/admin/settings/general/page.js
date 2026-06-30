"use client";

import { useEffect, useState } from "react";
import {
  Loader2,
  Save,
  Globe,
  Mail,
  Type,
  Settings
} from "lucide-react";

export default function GeneralSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    appName: "",
    appDomain: "",
    supportEmail: "",
  });

  // --- LOGIQUE (STRICTEMENT INTACTE) ---
  const load = async () => {
    const res = await fetch("/api/admin/settings/get", { credentials: "include" });
    const json = await res.json();

    if (json.success) {
      setForm({
        appName: json.settings.appName || "",
        appDomain: json.settings.appDomain || "",
        supportEmail: json.settings.supportEmail || "",
      });
    }

    setLoading(false);
  };

  useEffect(() => { load(); }, []);

  const save = async () => {
    setSaving(true);
    await fetch("/api/admin/settings/update", {
      method: "POST",
      credentials: "include",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ ...form }),
    });
    setSaving(false);
  };

  // --- RENDER ---

  if (loading) return (
    <div className="max-w-4xl space-y-8">
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-6">
        <div className="h-10 w-10 rounded-lg bg-neutral-100 animate-pulse" />
        <div className="space-y-2">
          <div className="h-5 w-56 rounded bg-neutral-100 animate-pulse" />
          <div className="h-3 w-72 rounded bg-neutral-100 animate-pulse" />
        </div>
      </div>
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">
        <div className="p-8 space-y-6">
          {[0, 1, 2].map((i) => (
            <div key={i} className="space-y-2">
              <div className="h-3 w-40 rounded bg-neutral-100 animate-pulse" />
              <div className="h-12 w-full rounded-xl bg-neutral-100 animate-pulse" />
            </div>
          ))}
        </div>
        <div className="px-8 py-5 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <div className="h-10 w-56 rounded-xl bg-neutral-100 animate-pulse" />
        </div>
      </div>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">

      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-neutral-200 pb-6">
        <div className="p-2 bg-emerald-50 border border-emerald-200 rounded-lg text-emerald-600">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Paramètres Généraux</h1>
          <p className="text-sm text-neutral-500">Identité et configuration de base de l'application</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-white border border-neutral-200 rounded-2xl overflow-hidden">

        <div className="p-8 space-y-6">

          {/* Nom de l'application */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Nom de l'application
            </label>
            <div className="relative group">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                value={form.appName}
                onChange={(e) => setForm({ ...form, appName: e.target.value })}
                placeholder="Ex: Bookzy"
                className="w-full bg-white border border-neutral-200 text-neutral-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all placeholder:text-neutral-400"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-500">Nom affiché dans les titres et les emails.</p>
          </div>

          {/* Domaine */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Domaine principal
            </label>
            <div className="relative group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="text"
                value={form.appDomain}
                onChange={(e) => setForm({ ...form, appDomain: e.target.value })}
                placeholder="https://app.monsaas.com"
                className="w-full bg-white border border-neutral-200 text-neutral-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all placeholder:text-neutral-400"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-500">Utilisé pour générer les liens absolus (sitemaps, emails).</p>
          </div>

          {/* Email Support */}
          <div>
            <label className="block text-xs font-bold text-neutral-500 uppercase tracking-wider mb-2">
              Email Support
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400 w-4 h-4 group-focus-within:text-emerald-600 transition-colors" />
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                placeholder="contact@bookzy.com"
                className="w-full bg-white border border-neutral-200 text-neutral-900 text-sm rounded-xl pl-10 pr-4 py-3 focus:outline-none focus:ring-2 focus:ring-neutral-900 transition-all placeholder:text-neutral-400"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-neutral-500">Adresse de réponse par défaut pour les notifications.</p>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-8 py-5 bg-neutral-50 border-t border-neutral-200 flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-medium text-sm rounded-xl transition-all disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin" />
                Enregistrement...
              </>
            ) : (
              <>
                <Save className="w-4 h-4" />
                Enregistrer les modifications
              </>
            )}
          </button>
        </div>

      </div>
    </div>
  );
}
