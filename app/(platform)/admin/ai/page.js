"use client";

import { useEffect, useState } from "react";

// ⚠️ TES MODÈLES EXISTANTS - PAS TOUCHÉ
const CLAUDE_MODELS = [
  "claude-sonnet-4-5-20250929",
  "claude-haiku-4-5-20251001",
  "claude-opus-4-1-20250805",
  "claude-opus-4-20250514",
  "claude-sonnet-4-20250514",
  "claude-3-5-haiku-20241022",
  "claude-3-haiku-20240307"
];

const OPENAI_TEXT_MODELS = [
  "gpt-4.1",
  "gpt-4.1-mini",
  "gpt-4o",
  "gpt-4o-mini",
  "gpt-4-turbo",
  "gpt-4-turbo-preview",
  "gpt-3.5-turbo",
];

const OPENAI_IMAGE_MODELS = ["dall-e-3", "dall-e-2"];

const GEMINI_TEXT_MODELS = [
  "gemini-3-pro-preview",
  "gemini-2.5-pro",
  "gemini-2.5-flash",
  "gemini-2.5-flash-lite",
  "gemini-1.5-pro",
  "gemini-1.5-flash",
];

const GEMINI_IMAGE_MODELS = [
  "gemini-2.5-flash-image",
  "gemini-3-pro-image-preview",
];

// ✅ NOUVEAU : Modèles Flux SEULEMENT AJOUTÉ
const FLUX_IMAGE_MODELS = [
  "black-forest-labs/flux-schnell",
  "black-forest-labs/flux-dev",
  "black-forest-labs/flux-1.1-pro",
];

const DEFAULT_AI_CONFIG = {
  providers: {
    claude: {
      enabled: false,
      apiKey: "",
      model: "claude-sonnet-4-20250514",
    },
    openai: {
      enabled: false,
      apiKey: "",
      textModel: "gpt-4o",
      imageModel: "dall-e-3",
    },
    gemini: {
      enabled: false,
      apiKey: "",
      textModel: "gemini-2.5-flash",
      imageModel: "gemini-2.5-flash-image",
    },
    // ✅ NOUVEAU : Replicate SEULEMENT AJOUTÉ
    replicate: {
      enabled: false,
      apiKey: "",
      imageModel: "black-forest-labs/flux-schnell",
    },
  },
  generation: {
    ebook: {
      provider: "claude",
      model: "claude-sonnet-4-20250514",
    },
    cover: {
      provider: "gemini",
      model: "gemini-2.5-flash-image",
    },
    ads: {
      provider: "gemini",
      model: "gemini-2.5-flash",
    },
    nicheGenerate: {
      provider: "gemini",
      model: "gemini-2.5-flash",
    },
    nicheAnalyze: {
      provider: "gemini",
      model: "gemini-2.5-flash",
    },
  },
};

export default function AISettingsPage() {
  const [aiConfig, setAiConfig] = useState(DEFAULT_AI_CONFIG);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        setLoading(true);
        
        const res = await fetch("/api/admin/settings/ai", {
          cache: 'no-store', 
          headers: { 'Pragma': 'no-cache' } 
        });
        
        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Impossible de charger la config IA");
        }
        
        console.log("📥 Config chargée depuis DB:", JSON.stringify(data.ai, null, 2));
        
        if (!data.ai) {
          setAiConfig(DEFAULT_AI_CONFIG);
          return;
        }
        
        const mergedConfig = {
          providers: {
            claude: {
              ...DEFAULT_AI_CONFIG.providers.claude,
              ...(data.ai.providers?.claude || {}),
            },
            openai: {
              ...DEFAULT_AI_CONFIG.providers.openai,
              ...(data.ai.providers?.openai || {}),
            },
            gemini: {
              ...DEFAULT_AI_CONFIG.providers.gemini,
              ...(data.ai.providers?.gemini || {}),
            },
            // ✅ NOUVEAU : Replicate
            replicate: {
              ...DEFAULT_AI_CONFIG.providers.replicate,
              ...(data.ai.providers?.replicate || {}),
            },
          },
          generation: {
            ebook: data.ai.generation?.ebook || DEFAULT_AI_CONFIG.generation.ebook,
            cover: data.ai.generation?.cover || DEFAULT_AI_CONFIG.generation.cover,
            ads: data.ai.generation?.ads || DEFAULT_AI_CONFIG.generation.ads,
            nicheGenerate: data.ai.generation?.nicheGenerate || DEFAULT_AI_CONFIG.generation.nicheGenerate,
            nicheAnalyze: data.ai.generation?.nicheAnalyze || DEFAULT_AI_CONFIG.generation.nicheAnalyze,
          },
        };
        
        console.log("✅ Config fusionnée:", JSON.stringify(mergedConfig, null, 2));
        
        setAiConfig(mergedConfig);
        
      } catch (e) {
        setError(e.message);
      } finally {
        setLoading(false);
      }
    };
    load();
  }, []);

  const updateProviderField = (provider, field, value) => {
    setAiConfig((prev) => ({
      ...prev,
      providers: {
        ...prev.providers,
        [provider]: {
          ...prev.providers[provider],
          [field]: value,
        },
      },
    }));
  };

  const updateGenerationField = (feature, field, value) => {
    setAiConfig((prev) => {
      const currentFeature = prev.generation?.[feature] || {};
      
      if (field === "provider") {
        const newProvider = value;
        let newModel = currentFeature.model;
        
        if (newProvider === "claude") {
          newModel = CLAUDE_MODELS[0];
        } else if (newProvider === "openai") {
          const isImageFeature = feature === "cover";
          newModel = isImageFeature ? OPENAI_IMAGE_MODELS[0] : OPENAI_TEXT_MODELS[0];
        } else if (newProvider === "gemini") {
          const isImageFeature = feature === "cover";
          newModel = isImageFeature ? GEMINI_IMAGE_MODELS[0] : GEMINI_TEXT_MODELS[0];
        } else if (newProvider === "replicate") {
          // ✅ NOUVEAU : Flux
          newModel = FLUX_IMAGE_MODELS[0];
        }
        
        return {
          ...prev,
          generation: {
            ...prev.generation,
            [feature]: {
              ...currentFeature,
              provider: newProvider,
              model: newModel,
            },
          },
        };
      }
      
      return {
        ...prev,
        generation: {
          ...prev.generation,
          [feature]: {
            ...currentFeature,
            [field]: value,
          },
        },
      };
    });
  };

  const handleSave = async () => {
    try {
      setSaving(true);
      setMessage(null);
      setError(null);

      console.log("💾 Sauvegarde config AI:", JSON.stringify(aiConfig, null, 2));

      const res = await fetch("/api/admin/settings/ai", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ai: aiConfig }),
      });

      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erreur lors de la sauvegarde");
      }

      console.log("✅ Config sauvegardée:", data.ai);
      setMessage("✅ Configuration IA mise à jour avec succès");
      
      setTimeout(async () => {
        const reloadRes = await fetch("/api/admin/settings/ai"); 
        const reloadData = await reloadRes.json();
        if (reloadRes.ok && reloadData.success) {
          console.log("🔄 Config rechargée:", reloadData.ai);
        }
      }, 500);
      
    } catch (e) {
      setError(e.message);
    } finally {
      setSaving(false);
    }
  };

  const providerOptions = [
    { value: "claude", label: "Claude (Anthropic)" },
    { value: "openai", label: "OpenAI" },
    { value: "gemini", label: "Gemini (Google)" },
    { value: "replicate", label: "Flux (Replicate)" }, // ✅ NOUVEAU
  ];

  const imageProviderOptions = [
    { value: "openai", label: "OpenAI (DALL-E)" },
    { value: "gemini", label: "Gemini (Google)" },
    { value: "replicate", label: "Flux (Replicate) - Recommandé" }, // ✅ NOUVEAU
  ];

  return (
    <div className="min-h-screen w-full bg-gradient-to-br from-slate-950 via-slate-900 to-slate-950 px-4 py-6 md:px-8 md:py-10">
      {/* Header */}
      <div className="max-w-5xl mx-auto mb-6 md:mb-10">
        <div className="flex items-center gap-3 mb-3">
          <div className="h-9 w-9 rounded-2xl bg-gradient-to-br from-indigo-500 via-purple-500 to-amber-500 flex items-center justify-center shadow-lg shadow-purple-500/40">
            <span className="text-lg">⚙️</span>
          </div>
          <div>
            <h1 className="text-xl md:text-2xl font-semibold text-white tracking-tight">
              Paramètres IA
            </h1>
            <p className="text-sm text-slate-400">
              Configure Claude, OpenAI, Gemini & Flux, et choisis quel moteur génère chaque partie de tes eBooks.
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-3 justify-between">
          <span className="px-3 py-1 rounded-full text-xs font-medium bg-slate-900/60 border border-slate-700/60 text-slate-300">
            💡 Tous les changements impactent instantanément Bookzy AI
          </span>

          <button
            onClick={handleSave}
            disabled={saving || loading}
            className="inline-flex items-center gap-2 rounded-full bg-gradient-to-r from-indigo-500 via-purple-500 to-amber-400 px-5 py-2 text-xs md:text-sm font-semibold text-slate-950 shadow-lg shadow-indigo-500/30 disabled:opacity-60 disabled:cursor-not-allowed"
          >
            {saving ? (
              <>
                <span className="h-3 w-3 rounded-full border-2 border-slate-900 border-t-transparent animate-spin" />
                Sauvegarde...
              </>
            ) : (
              <>
                <span>💾</span>
                <span>Enregistrer la configuration</span>
              </>
            )}
          </button>
        </div>

        {loading && (
          <div className="mt-4 rounded-xl border border-slate-800 bg-slate-900/60 px-4 py-3 text-xs text-slate-300">
            Chargement de la configuration IA...
          </div>
        )}

        {!loading && (message || error) && (
          <div className="mt-4">
            {message && (
              <div className="mb-2 rounded-xl border border-emerald-500/40 bg-emerald-500/10 px-4 py-3 text-xs text-emerald-200">
                {message}
              </div>
            )}
            {error && (
              <div className="mb-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-xs text-red-200">
                {error}
              </div>
            )}
          </div>
        )}
      </div>

      {!loading && (
        <div className="max-w-5xl mx-auto space-y-8 md:space-y-10">
          {/* PROVIDERS */}
          <section className="space-y-4">
            <h2 className="text-sm md:text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-900/80 flex items-center justify-center border border-slate-700/70 text-xs">
                1
              </span>
              Moteurs IA disponibles
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Active les providers que tu utilises, colle tes clés API, puis choisis les modèles par défaut.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-5">
              {/* Claude */}
              <div className="relative overflow-hidden rounded-2xl border border-indigo-500/40 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 shadow-[0_18px_45px_rgba(88,28,135,0.35)]">
                <div className="absolute inset-x-0 -top-16 h-28 bg-gradient-to-b from-indigo-500/40 via-purple-500/20 to-transparent blur-2xl pointer-events-none" />
                <div className="relative p-4 md:p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🤖</span>
                        <h3 className="text-sm font-semibold text-slate-50">
                          Claude (Anthropic)
                        </h3>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-400 mt-1">
                        Recommandé pour la génération d'eBooks longue durée.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateProviderField(
                          "claude",
                          "enabled",
                          !aiConfig.providers.claude.enabled
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                        aiConfig.providers.claude.enabled
                          ? "bg-emerald-500/80 border-emerald-300/60"
                          : "bg-slate-800 border-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow transition ${
                          aiConfig.providers.claude.enabled
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      API Key Anthropic
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                      placeholder="sk-ant-..."
                      value={aiConfig.providers.claude.apiKey || ""}
                      onChange={(e) =>
                        updateProviderField("claude", "apiKey", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle par défaut
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500/70"
                      value={aiConfig.providers.claude.model || ""}
                      onChange={(e) =>
                        updateProviderField("claude", "model", e.target.value)
                      }
                    >
                      {CLAUDE_MODELS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* OpenAI */}
              <div className="relative overflow-hidden rounded-2xl border border-sky-500/40 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 shadow-[0_18px_45px_rgba(56,189,248,0.35)]">
                <div className="absolute inset-x-0 -top-16 h-28 bg-gradient-to-b from-sky-500/40 via-cyan-500/20 to-transparent blur-2xl pointer-events-none" />
                <div className="relative p-4 md:p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">💼</span>
                        <h3 className="text-sm font-semibold text-slate-50">
                          OpenAI
                        </h3>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-400 mt-1">
                        Utilisé pour les textes publicitaires & les visuels (DALL·E).
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateProviderField(
                          "openai",
                          "enabled",
                          !aiConfig.providers.openai.enabled
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                        aiConfig.providers.openai.enabled
                          ? "bg-emerald-500/80 border-emerald-300/60"
                          : "bg-slate-800 border-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow transition ${
                          aiConfig.providers.openai.enabled
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      API Key OpenAI
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                      placeholder="sk-proj-..."
                      value={aiConfig.providers.openai.apiKey || ""}
                      onChange={(e) =>
                        updateProviderField("openai", "apiKey", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle texte par défaut
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                      value={aiConfig.providers.openai.textModel || ""}
                      onChange={(e) =>
                        updateProviderField(
                          "openai",
                          "textModel",
                          e.target.value
                        )
                      }
                    >
                      {OPENAI_TEXT_MODELS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle image (DALL·E)
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-sky-500/70"
                      value={aiConfig.providers.openai.imageModel || ""}
                      onChange={(e) =>
                        updateProviderField(
                          "openai",
                          "imageModel",
                          e.target.value
                        )
                      }
                    >
                      {OPENAI_IMAGE_MODELS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Gemini */}
              <div className="relative overflow-hidden rounded-2xl border border-amber-500/40 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 shadow-[0_18px_45px_rgba(245,158,11,0.35)]">
                <div className="absolute inset-x-0 -top-16 h-28 bg-gradient-to-b from-amber-500/40 via-orange-500/20 to-transparent blur-2xl pointer-events-none" />
                <div className="relative p-4 md:p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">🌐</span>
                        <h3 className="text-sm font-semibold text-slate-50">
                          Gemini (Google)
                        </h3>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-400 mt-1">
                        Gratuit ! Génère textes marketing + images.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateProviderField(
                          "gemini",
                          "enabled",
                          !aiConfig.providers.gemini.enabled
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                        aiConfig.providers.gemini.enabled
                          ? "bg-emerald-500/80 border-emerald-300/60"
                          : "bg-slate-800 border-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow transition ${
                          aiConfig.providers.gemini.enabled
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      API Key Gemini
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
                      placeholder="AIzaSyA..."
                      value={aiConfig.providers.gemini.apiKey || ""}
                      onChange={(e) =>
                        updateProviderField("gemini", "apiKey", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle texte par défaut
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
                      value={aiConfig.providers.gemini.textModel || ""}
                      onChange={(e) =>
                        updateProviderField(
                          "gemini",
                          "textModel",
                          e.target.value
                        )
                      }
                    >
                      {GEMINI_TEXT_MODELS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle image par défaut
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-amber-500/70"
                      value={aiConfig.providers.gemini.imageModel || ""}
                      onChange={(e) =>
                        updateProviderField(
                          "gemini",
                          "imageModel",
                          e.target.value
                        )
                      }
                    >
                      {GEMINI_IMAGE_MODELS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* ✅ NOUVEAU : Flux (Replicate) */}
              <div className="relative overflow-hidden rounded-2xl border border-green-500/40 bg-gradient-to-b from-slate-900/80 via-slate-950 to-slate-950 shadow-[0_18px_45px_rgba(34,197,94,0.35)]">
                <div className="absolute inset-x-0 -top-16 h-28 bg-gradient-to-b from-green-500/40 via-emerald-500/20 to-transparent blur-2xl pointer-events-none" />
                <div className="relative p-4 md:p-5 space-y-3">
                  <div className="flex items-center justify-between gap-2">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-lg">⚡</span>
                        <h3 className="text-sm font-semibold text-slate-50">
                          Flux (Replicate)
                        </h3>
                      </div>
                      <p className="text-[11px] md:text-xs text-slate-400 mt-1">
                        Recommandé ! Images ultra-rapides & 13x moins cher que DALL-E.
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() =>
                        updateProviderField(
                          "replicate",
                          "enabled",
                          !aiConfig.providers.replicate?.enabled
                        )
                      }
                      className={`relative inline-flex h-6 w-11 items-center rounded-full border transition ${
                        aiConfig.providers.replicate?.enabled
                          ? "bg-emerald-500/80 border-emerald-300/60"
                          : "bg-slate-800 border-slate-600"
                      }`}
                    >
                      <span
                        className={`inline-block h-4 w-4 transform rounded-full bg-slate-950 shadow transition ${
                          aiConfig.providers.replicate?.enabled
                            ? "translate-x-5"
                            : "translate-x-1"
                        }`}
                      />
                    </button>
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      API Key Replicate
                    </label>
                    <input
                      type="password"
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-green-500/70"
                      placeholder="r8_..."
                      value={aiConfig.providers.replicate?.apiKey || ""}
                      onChange={(e) =>
                        updateProviderField("replicate", "apiKey", e.target.value)
                      }
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle image
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-green-500/70"
                      value={aiConfig.providers.replicate?.imageModel || ""}
                      onChange={(e) =>
                        updateProviderField(
                          "replicate",
                          "imageModel",
                          e.target.value
                        )
                      }
                    >
                      {FLUX_IMAGE_MODELS.map((m) => (
                        <option key={m} value={m}>
                          {m}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="mt-2 p-2 bg-green-500/10 border border-green-500/20 rounded-lg">
                    <p className="text-[10px] text-green-300">
                      💰 <strong>Prix :</strong> $0.003/image (schnell) vs $0.04 DALL-E 3
                    </p>
                    <p className="text-[10px] text-green-300">
                      ⚡ <strong>Vitesse :</strong> Ultra rapide
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* GENERATION MAPPING */}
          <section className="space-y-4">
            <h2 className="text-sm md:text-base font-semibold text-slate-100 flex items-center gap-2">
              <span className="h-6 w-6 rounded-full bg-slate-900/80 flex items-center justify-center border border-slate-700/70 text-xs">
                2
              </span>
              Mappage des fonctionnalités
            </h2>
            <p className="text-xs md:text-sm text-slate-400 max-w-2xl">
              Associe chaque fonctionnalité au moteur IA de ton choix.
            </p>

            <div className="space-y-4">
              {/* Ebook Generation */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-slate-50 mb-3">
                  Génération d'Ebooks (Texte long)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Provider IA
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.ebook.provider || ""}
                      onChange={(e) =>
                        updateGenerationField("ebook", "provider", e.target.value)
                      }
                    >
                      {providerOptions.filter(p => p.value !== 'replicate').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle spécifique
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.ebook.model || ""}
                      onChange={(e) =>
                        updateGenerationField("ebook", "model", e.target.value)
                      }
                      disabled={!aiConfig.generation.ebook.provider}
                    >
                      {aiConfig.generation.ebook.provider === "claude" &&
                        CLAUDE_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.ebook.provider === "openai" &&
                        OPENAI_TEXT_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.ebook.provider === "gemini" &&
                        GEMINI_TEXT_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Cover Generation */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-slate-50 mb-3">
                  Génération de Couverture (Image)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Provider IA
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.cover.provider || ""}
                      onChange={(e) =>
                        updateGenerationField("cover", "provider", e.target.value)
                      }
                    >
                      {imageProviderOptions.map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle spécifique
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.cover.model || ""}
                      onChange={(e) =>
                        updateGenerationField("cover", "model", e.target.value)
                      }
                      disabled={!aiConfig.generation.cover.provider}
                    >
                      {aiConfig.generation.cover.provider === "openai" &&
                        OPENAI_IMAGE_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.cover.provider === "gemini" &&
                        GEMINI_IMAGE_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.cover.provider === "replicate" &&
                        FLUX_IMAGE_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Ads */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-slate-50 mb-3">
                  Génération de Publicités (Ads)
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Provider IA
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.ads.provider || ""}
                      onChange={(e) =>
                        updateGenerationField("ads", "provider", e.target.value)
                      }
                    >
                      {providerOptions.filter(p => p.value !== 'replicate').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle spécifique
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.ads.model || ""}
                      onChange={(e) =>
                        updateGenerationField("ads", "model", e.target.value)
                      }
                      disabled={!aiConfig.generation.ads.provider}
                    >
                      {aiConfig.generation.ads.provider === "claude" &&
                        CLAUDE_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.ads.provider === "openai" &&
                        OPENAI_TEXT_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.ads.provider === "gemini" &&
                        GEMINI_TEXT_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Niche Generate */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-slate-50 mb-3">
                  Niche Hunter : Idéation
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Provider IA
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.nicheGenerate.provider || ""}
                      onChange={(e) =>
                        updateGenerationField("nicheGenerate", "provider", e.target.value)
                      }
                    >
                      {providerOptions.filter(p => p.value !== 'replicate').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle spécifique
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.nicheGenerate.model || ""}
                      onChange={(e) =>
                        updateGenerationField("nicheGenerate", "model", e.target.value)
                      }
                      disabled={!aiConfig.generation.nicheGenerate.provider}
                    >
                      {aiConfig.generation.nicheGenerate.provider === "claude" &&
                        CLAUDE_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.nicheGenerate.provider === "openai" &&
                        OPENAI_TEXT_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.nicheGenerate.provider === "gemini" &&
                        GEMINI_TEXT_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Niche Analyze */}
              <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-4">
                <h3 className="text-sm font-semibold text-slate-50 mb-3">
                  Niche Hunter : Analyse
                </h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Provider IA
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.nicheAnalyze.provider || ""}
                      onChange={(e) =>
                        updateGenerationField("nicheAnalyze", "provider", e.target.value)
                      }
                    >
                      {providerOptions.filter(p => p.value !== 'replicate').map((opt) => (
                        <option key={opt.value} value={opt.value}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                  </div>
                  <div>
                    <label className="text-[11px] font-medium text-slate-300">
                      Modèle spécifique
                    </label>
                    <select
                      className="w-full rounded-xl border border-slate-700 bg-slate-900/80 px-3 py-2 text-xs text-slate-100 focus:outline-none focus:ring-2 focus:ring-purple-500/70 mt-1"
                      value={aiConfig.generation.nicheAnalyze.model || ""}
                      onChange={(e) =>
                        updateGenerationField("nicheAnalyze", "model", e.target.value)
                      }
                      disabled={!aiConfig.generation.nicheAnalyze.provider}
                    >
                      {aiConfig.generation.nicheAnalyze.provider === "claude" &&
                        CLAUDE_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.nicheAnalyze.provider === "openai" &&
                        OPENAI_TEXT_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                      {aiConfig.generation.nicheAnalyze.provider === "gemini" &&
                        GEMINI_TEXT_MODELS.map((m) => (
                          <option key={m} value={m}>
                            {m}
                          </option>
                        ))}
                    </select>
                  </div>
                </div>
              </div>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}