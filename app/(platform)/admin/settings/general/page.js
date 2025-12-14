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
    <div className="flex flex-col items-center justify-center py-20">
      <Loader2 className="animate-spin w-10 h-10 text-indigo-500 mb-4" />
      <p className="text-slate-500 text-xs font-mono uppercase tracking-widest">Chargement configuration...</p>
    </div>
  );

  return (
    <div className="max-w-4xl space-y-8">
      
      {/* HEADER */}
      <div className="flex items-center gap-3 border-b border-slate-800/50 pb-6">
        <div className="p-2 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-indigo-400">
          <Settings size={20} />
        </div>
        <div>
          <h1 className="text-xl font-bold text-white tracking-tight">Paramètres Généraux</h1>
          <p className="text-sm text-slate-500">Identité et configuration de base de l'application</p>
        </div>
      </div>

      {/* FORM CARD */}
      <div className="bg-[#0f1623] border border-slate-800 rounded-xl overflow-hidden shadow-sm">
        
        <div className="p-8 space-y-6">
          
          {/* Nom de l'application */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Nom de l'application
            </label>
            <div className="relative group">
              <Type className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={form.appName}
                onChange={(e) => setForm({ ...form, appName: e.target.value })}
                placeholder="Ex: Bookzy"
                className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-600">Nom affiché dans les titres et les emails.</p>
          </div>

          {/* Domaine */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Domaine principal
            </label>
            <div className="relative group">
              <Globe className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="text"
                value={form.appDomain}
                onChange={(e) => setForm({ ...form, appDomain: e.target.value })}
                placeholder="https://app.monsaas.com"
                className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-600">Utilisé pour générer les liens absolus (sitemaps, emails).</p>
          </div>

          {/* Email Support */}
          <div>
            <label className="block text-xs font-bold text-slate-500 uppercase tracking-wider mb-2">
              Email Support
            </label>
            <div className="relative group">
              <Mail className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4 group-focus-within:text-indigo-400 transition-colors" />
              <input
                type="email"
                value={form.supportEmail}
                onChange={(e) => setForm({ ...form, supportEmail: e.target.value })}
                placeholder="contact@bookzy.com"
                className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-3 focus:outline-none focus:border-indigo-500 transition-all placeholder:text-slate-600"
              />
            </div>
            <p className="mt-1.5 text-[11px] text-slate-600">Adresse de réponse par défaut pour les notifications.</p>
          </div>

        </div>

        {/* FOOTER ACTIONS */}
        <div className="px-8 py-5 bg-slate-900/30 border-t border-slate-800 flex justify-end">
          <button
            onClick={save}
            disabled={saving}
            className="flex items-center gap-2 px-6 py-2.5 bg-indigo-600 hover:bg-indigo-500 text-white font-medium text-sm rounded-lg transition-all shadow-lg shadow-indigo-900/20 disabled:opacity-50 disabled:cursor-not-allowed"
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