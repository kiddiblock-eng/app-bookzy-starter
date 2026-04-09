"use client";

import { useState, useRef } from "react";
import { Search, ArrowRight, ChevronRight, AlertCircle, Zap, Gem, TrendingUp, Flame } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCredits } from "@/hooks/useCredits";

// ─── LOADING MESSAGES ─────────────────────────────────────────────────────────
const LOADING_STEPS = [
  { label: "Connexion Facebook Ads Library...", pct: 15 },
  { label: "Analyse des pubs actives...", pct: 35 },
  { label: "Détection des angles gagnants...", pct: 60 },
  { label: "Génération des idées d'ebooks...", pct: 80 },
  { label: "Calcul des scores de marché...", pct: 95 },
];

const LOADING_MESSAGES = [
  ["Préparation de ton analyse...", "Laisse la magie opérer ✨"],
  ["On scrute les pubs actives...", "Les annonceurs ne cachent rien 🔍"],
  ["On détecte ce qui cartonne...", "Données en temps réel 📡"],
  ["L'IA analyse les patterns...", "Presque prêt pour toi 🧠"],
  ["On finalise tes 10 idées...", "Ce sera bluffant, promis 🔥"],
];

const SUGGESTIONS = ["Dropshipping", "Coaching", "Crypto", "Immobilier", "Freelance"];

const PAYS_AFRICA = ["Côte d'Ivoire", "Sénégal", "Cameroun", "Mali", "Bénin", "Togo", "Autre pays"];
const PAYS_INTERNATIONAL = ["France", "Belgique", "Suisse", "Canada", "Maroc", "Tunisie", "Autre pays"];

const WHATSAPP_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
  </svg>
);

const TELEGRAM_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M11.944 0A12 12 0 0 0 0 12a12 12 0 0 0 12 12 12 12 0 0 0 12-12A12 12 0 0 0 12 0a12 12 0 0 0-.056 0zm4.962 7.224c.1-.002.321.023.465.14a.506.506 0 0 1 .171.325c.016.093.036.306.02.472-.18 1.898-.962 6.502-1.36 8.627-.168.9-.499 1.201-.82 1.23-.696.065-1.225-.46-1.9-.902-1.056-.693-1.653-1.124-2.678-1.8-1.185-.78-.417-1.21.258-1.91.177-.184 3.247-2.977 3.307-3.23.007-.032.014-.15-.056-.212s-.174-.041-.249-.024c-.106.024-1.793 1.14-5.061 3.345-.48.33-.913.49-1.302.48-.428-.008-1.252-.241-1.865-.44-.752-.245-1.349-.374-1.297-.789.027-.216.325-.437.893-.663 3.498-1.524 5.83-2.529 6.998-3.014 3.332-1.386 4.025-1.627 4.476-1.635z"/>
  </svg>
);

const INSTAGRAM_ICON = (
  <svg viewBox="0 0 24 24" fill="currentColor" width="16" height="16">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zM12 16a4 4 0 1 1 0-8 4 4 0 0 1 0 8zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

const BOUTIQUE_ICON = (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" width="16" height="16">
    <circle cx="12" cy="12" r="10"/><path d="M2 12h20M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/>
  </svg>
);

const PLATEFORME_OPTIONS = [
  { label: "WhatsApp", icon: WHATSAPP_ICON },
  { label: "Telegram", icon: TELEGRAM_ICON },
  { label: "Instagram", icon: INSTAGRAM_ICON },
  { label: "Boutique en ligne", icon: BOUTIQUE_ICON },
];

export default function NicheHunterPage() {
  const router = useRouter();
  const { mutateBalance } = useCredits();

  const [step, setStep] = useState(1);
  const [theme, setTheme] = useState("");
  const [targetMarket, setTargetMarket] = useState("africa");
  const [plateforme, setPlateforme] = useState("");
  const [pays, setPays] = useState("");
  const [showAutreInput, setShowAutreInput] = useState(false);
  const [autrePaysInput, setAutrePaysInput] = useState("");

  const [loadingStep, setLoadingStep] = useState(0);
  const [loadingMsg, setLoadingMsg] = useState(0);
  const [loadingPct, setLoadingPct] = useState(0);

  const [niches, setNiches] = useState([]);
  const [fbStats, setFbStats] = useState(null);
  const [analysisId, setAnalysisId] = useState(null);
  const [error, setError] = useState("");
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [quotaPlan, setQuotaPlan] = useState(null);

  const intervalRef = useRef(null);

  // Pays options selon le marché sélectionné
  const paysOptions = targetMarket === "africa" ? PAYS_AFRICA : PAYS_INTERNATIONAL;

  // Reset pays quand on change de marché
  const handleMarketChange = (market) => {
    setTargetMarket(market);
    setPays("");
    setShowAutreInput(false);
    setAutrePaysInput("");
  };

  const handlePaysClick = (p) => {
    if (p === "Autre pays") {
      setPays("");
      setShowAutreInput(true);
    } else {
      setPays(pays === p ? "" : p);
      setShowAutreInput(false);
      setAutrePaysInput("");
    }
  };

  // Pays final envoyé à l'API — input libre si "Autre pays"
  const paysFinal = showAutreInput ? autrePaysInput.trim() : pays;

  const startLoadingAnimation = () => {
    let stepIdx = 0;
    let msgIdx = 0;
    let pct = 0;
    intervalRef.current = setInterval(() => {
      pct += Math.random() * 8 + 2;
      if (pct > 96) pct = 96;
      setLoadingPct(Math.round(pct));
      const targetPct = LOADING_STEPS[stepIdx]?.pct || 95;
      if (pct >= targetPct && stepIdx < LOADING_STEPS.length - 1) {
        stepIdx++;
        setLoadingStep(stepIdx);
      }
      if (msgIdx < LOADING_MESSAGES.length - 1 && pct > (msgIdx + 1) * 20) {
        msgIdx++;
        setLoadingMsg(msgIdx);
      }
    }, 400);
  };

  const stopLoadingAnimation = () => {
    if (intervalRef.current) clearInterval(intervalRef.current);
    setLoadingPct(100);
    setLoadingStep(LOADING_STEPS.length - 1);
  };

  const handleLaunch = async () => {
    if (!theme.trim()) return;
    setStep(3);
    setError("");
    setQuotaExceeded(false);
    startLoadingAnimation();

    try {
      const res = await fetch("/api/niche-hunter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ theme: theme.trim(), targetMarket, plateforme, pays: paysFinal }),
      });

      const data = await res.json();
      stopLoadingAnimation();

      if (data.quotaExceeded) {
        setQuotaExceeded(true);
        setQuotaPlan(data.plan);
        setStep(4);
        return;
      }
      if (res.status === 402 || data.insufficientCredits) {
        setError("Crédits insuffisants. Rechargez votre solde.");
        setStep(4);
        return;
      }
      if (!res.ok || !data.success) throw new Error(data.message || "Erreur");

      setNiches(data.data.niches);
      setFbStats(data.data.fbStats);
      setAnalysisId(data.data.id);
      mutateBalance();
      setStep(4);

    } catch (err) {
      stopLoadingAnimation();
      setError(err.message || "Une erreur est survenue.");
      setStep(4);
    }
  };

  const handleSurprise = () => {
    const themes = ["Dropshipping Afrique", "Coaching business en ligne", "Investissement mobile money", "Marketing WhatsApp", "Freelance depuis l'Afrique"];
    setTheme(themes[Math.floor(Math.random() * themes.length)]);
  };

  return (
    <div className="min-h-screen bg-white">

      {/* ─── ÉTAPE 1 : THÈME ─────────────────────────────────────────── */}
      {step === 1 && (
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="text-center mb-10">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-5">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">Niche Hunter</h1>
            <p className="text-slate-500 text-sm">Basé sur les vraies pubs Facebook actives en ce moment</p>
          </div>

          <div className="relative mb-4">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
            <input
              type="text"
              value={theme}
              onChange={e => setTheme(e.target.value)}
              onKeyDown={e => e.key === "Enter" && theme.trim() && setStep(2)}
              placeholder="Ex: dropshipping, coaching, crypto..."
              className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
          </div>

          <div className="flex flex-wrap gap-2 mb-6">
            {SUGGESTIONS.map(s => (
              <button key={s} onClick={() => setTheme(s)}
                className={`px-3 py-2 text-sm rounded-lg transition-all border ${theme === s ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                {s}
              </button>
            ))}
          </div>

          <div className="flex gap-3 mb-4">
            {[["africa", "🌍", "Afrique"], ["international", "🌐", "International"]].map(([m, icon, label]) => (
              <button key={m} onClick={() => handleMarketChange(m)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${targetMarket === m ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"}`}>
                {icon} {label}
              </button>
            ))}
          </div>

          <button onClick={handleSurprise}
            className="w-full flex items-center justify-between px-5 py-4 bg-slate-50 border border-slate-200 hover:border-slate-300 rounded-xl mb-5 transition-all group">
            <div className="text-left">
              <p className="text-sm font-medium text-slate-900">Laisse Bookzy choisir pour toi 🎲</p>
              <p className="text-xs text-slate-500">On détecte une niche qui cartonne en ce moment</p>
            </div>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-600 transition-colors" />
          </button>

          <button onClick={() => theme.trim() && setStep(2)} disabled={!theme.trim()}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2">
            Continuer <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* ─── ÉTAPE 2 : CONTEXTE ──────────────────────────────────────── */}
      {step === 2 && (
        <div className="max-w-lg mx-auto px-4 py-16">
          <div className="flex items-center justify-center gap-2 mb-10">
            {[1, 2, 3].map(i => (
              <div key={i} className={`h-1.5 rounded-full transition-all ${i <= 2 ? "w-10 bg-slate-900" : "w-6 bg-slate-200"}`} />
            ))}
          </div>

          <div className="text-center mb-8">
            <h2 className="text-xl font-bold text-slate-900 mb-2">Dis-moi où tu vends</h2>
            <p className="text-sm text-slate-500">Pour des idées adaptées à ton contexte exact</p>
          </div>

          {/* Plateforme */}
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Tu vends où ?</p>
          <div className="grid grid-cols-2 gap-2 mb-6">
            {PLATEFORME_OPTIONS.map(({ label, icon }) => (
              <button key={label} onClick={() => setPlateforme(plateforme === label ? "" : label)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all border ${plateforme === label ? "bg-slate-900 text-white border-slate-900" : "bg-slate-50 text-slate-700 border-slate-200 hover:border-slate-300"}`}>
                <span>{icon}</span> {label}
              </button>
            ))}
          </div>

          {/* Pays — dynamique selon marché */}
          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">Ton pays ?</p>
          <div className="flex flex-wrap gap-2 mb-3">
            {paysOptions.map(p => (
              <button key={p} onClick={() => handlePaysClick(p)}
                className={`px-3 py-2 text-sm rounded-lg transition-all border ${
                  (p === "Autre pays" && showAutreInput) || pays === p
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-slate-50 text-slate-600 border-slate-200 hover:border-slate-300"
                }`}>
                {p}
              </button>
            ))}
          </div>

          {/* Input libre si "Autre pays" */}
          {showAutreInput && (
            <input
              type="text"
              value={autrePaysInput}
              onChange={e => setAutrePaysInput(e.target.value)}
              placeholder="Ex: Guinée, Algérie, Congo..."
              autoFocus
              className="w-full px-4 py-3 mb-2 bg-slate-50 border border-slate-900 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
            />
          )}

          <div className={showAutreInput ? "mt-4" : "mt-8"}>
            <div className="flex gap-3">
              <button onClick={() => setStep(1)}
                className="flex-1 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl text-sm font-medium transition-all">
                Retour
              </button>
              <button onClick={handleLaunch}
                className="flex-1 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all flex items-center justify-center gap-2">
                Lancer l'analyse <Zap className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ─── ÉTAPE 3 : LOADING ───────────────────────────────────────── */}
      {step === 3 && (
        <div className="min-h-screen flex flex-col items-center justify-center px-4 py-16">
          <div className="relative w-20 h-20 mb-6">
            <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
            <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-slate-900 animate-spin" />
            <div className="absolute inset-3 bg-slate-900 rounded-full flex items-center justify-center">
              <Search className="w-5 h-5 text-white" />
            </div>
          </div>

          <h2 className="text-xl font-bold text-slate-900 mb-2 text-center">
            {LOADING_MESSAGES[loadingMsg][0]}
          </h2>
          <p className="text-sm text-slate-500 mb-8 text-center">
            {LOADING_MESSAGES[loadingMsg][1]}
          </p>

          <div className="w-72 mb-8">
            <div className="h-1 bg-slate-100 rounded-full overflow-hidden mb-2">
              <div className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${loadingPct}%` }} />
            </div>
            <div className="flex justify-between text-xs text-slate-400">
              <span>{LOADING_STEPS[loadingStep]?.label}</span>
              <span>{loadingPct}%</span>
            </div>
          </div>

          <div className="w-full max-w-xs space-y-3">
            {LOADING_STEPS.map((s, i) => (
              <div key={i} className={`flex items-center gap-3 transition-opacity ${i <= loadingStep ? "opacity-100" : "opacity-30"}`}>
                <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 transition-all ${i < loadingStep ? "bg-emerald-100" : i === loadingStep ? "bg-slate-100" : "bg-slate-50"}`}>
                  {i < loadingStep ? (
                    <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="#16a34a" strokeWidth="3">
                      <path d="M20 6L9 17l-5-5" />
                    </svg>
                  ) : (
                    <div className={`w-1.5 h-1.5 rounded-full ${i === loadingStep ? "bg-slate-900 animate-pulse" : "bg-slate-300"}`} />
                  )}
                </div>
                <span className="text-xs text-slate-600">{s.label}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ─── ÉTAPE 4 : RÉSULTATS ─────────────────────────────────────── */}
      {step === 4 && (
        <div>
          <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
            <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input type="text" value={theme} onChange={e => setTheme(e.target.value)}
                  placeholder="Nouvelle recherche..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all" />
              </div>
              <button onClick={handleLaunch} disabled={!theme.trim()}
                className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-lg text-sm font-medium transition-all flex items-center gap-2">
                <Search className="w-4 h-4" /> Analyser
              </button>
            </div>
          </div>

          <div className="max-w-5xl mx-auto px-4 py-6">

            {error && !quotaExceeded && (
              <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm mb-6">{error}</div>
            )}

            {quotaExceeded && (
              <div className="max-w-md mx-auto text-center py-16">
                <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
                  <AlertCircle className="w-7 h-7 text-amber-600" />
                </div>
                <h3 className="text-lg font-bold text-slate-900 mb-2">Limite journalière atteinte</h3>
                <p className="text-sm text-slate-500 mb-6">
                  {quotaPlan === "solo" ? "Vous avez utilisé vos 3 recherches du jour."
                    : quotaPlan === "createur" ? "Vous avez utilisé vos 8 recherches du jour."
                    : quotaPlan === "agence" ? "Vous avez utilisé vos 20 recherches du jour."
                    : "Passez à un plan payant pour continuer."}
                </p>
                <button onClick={() => router.push("/dashboard/tarifs")}
                  className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl text-sm">
                  Voir les plans
                </button>
              </div>
            )}

            {/* Dashboard Facebook Ads */}
            {fbStats && niches.length > 0 && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-5 mb-6">
                <div className="flex items-center gap-2 mb-4">
                  <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
                  <p className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
                    Facebook Ads Library — Données en temps réel pour "{theme}"
                  </p>
                </div>

                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
                  {[
                    [fbStats.totalAds?.toLocaleString(), "pubs trouvées"],
                    [fbStats.uniqueAdvertisers?.toLocaleString(), "annonceurs"],
                    [`${fbStats.activityRate}%`, "taux d'activité"],
                    [fbStats.avgDuration, "durée moyenne"],
                  ].map(([val, label]) => (
                    <div key={label} className="bg-white border border-slate-200 rounded-xl p-3">
                      <p className="text-lg font-bold text-slate-900">{val}</p>
                      <p className="text-xs text-slate-500 mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-700 mb-3">Répartition plateformes</p>
                    {Object.entries(fbStats.platforms || {}).map(([name, pct]) => (
                      <div key={name} className="mb-2">
                        <div className="flex justify-between text-xs text-slate-500 mb-1">
                          <span className="capitalize">{name}</span>
                          <span>{Math.round(pct)}%</span>
                        </div>
                        <div className="h-1 bg-slate-100 rounded-full overflow-hidden">
                          <div className="h-full bg-slate-900 rounded-full" style={{ width: `${pct}%` }} />
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white border border-slate-200 rounded-xl p-4">
                    <p className="text-xs font-semibold text-slate-700 mb-3">Types de créatifs</p>
                    {Object.entries(fbStats.creativeTypes || {}).map(([type, count]) => (
                      <div key={type} className="flex items-center gap-2 mb-2">
                        <div className="w-2 h-2 rounded bg-slate-400 flex-shrink-0" />
                        <span className="text-xs text-slate-500 flex-1 capitalize">{type}</span>
                        <span className="text-xs font-medium text-slate-700">{count}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {niches.length > 0 && (
              <>
                <div className="flex items-center justify-between mb-4">
                  <p className="text-sm text-slate-500">
                    <span className="font-semibold text-slate-900">{niches.length}</span> idées pour "{theme}"
                    {fbStats && <span className="ml-2 text-xs text-slate-400">basées sur {fbStats.totalAds?.toLocaleString()} pubs actives</span>}
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {niches.map(niche => (
                    <NicheCard key={niche.nicheId} niche={niche} analysisId={analysisId} router={router} />
                  ))}
                </div>
              </>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

function NicheCard({ niche, analysisId, router }) {
  const handleGenerate = () => {
    const params = new URLSearchParams({ suggestion: niche.title, description: niche.description });
    router.push(`/dashboard/projets/nouveau?${params.toString()}`);
  };
  const handleAnalyze = () => {
    router.push(`/dashboard/niche-hunter/analyse/${analysisId}?nicheId=${niche.nicheId}`);
  };

  const getBadge = (badge) => {
    if (badge === "gem") return { label: "Pépite cachée", icon: <Gem className="w-3 h-3" />, style: "bg-purple-50 text-purple-700 border-purple-200" };
    if (badge === "trending") return { label: "Tendance montante", icon: <TrendingUp className="w-3 h-3" />, style: "bg-blue-50 text-blue-700 border-blue-200" };
    return { label: "Très demandé", icon: <Flame className="w-3 h-3" />, style: "bg-orange-50 text-orange-700 border-orange-200" };
  };

  const badge = getBadge(niche.badge);

  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:border-slate-300 hover:shadow-md transition-all flex flex-col">
      {/* Badge + potentiel */}
      <div className="flex items-center justify-between mb-3">
        <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-medium rounded-full border ${badge.style}`}>
          {badge.icon} {badge.label}
        </span>
        <span className="text-xs text-slate-400">{niche.potential}/10</span>
      </div>

      {/* Titre */}
      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2 flex-none">{niche.title}</h3>

      {/* Description */}
      <p className="text-sm text-slate-500 line-clamp-2 mb-3 flex-none">{niche.description}</p>

      {/* Tendance 2026 — 1 ligne, impactant */}
      {niche.tendance2026 && (
        <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-100 rounded-lg px-3 py-2 mb-3 flex-none">
          <Zap className="w-3 h-3 text-emerald-600 flex-shrink-0" />
          <p className="text-xs font-medium text-emerald-700 line-clamp-1">{niche.tendance2026}</p>
        </div>
      )}

      {/* Scores */}
      <div className="space-y-2 mb-3 flex-none">
        {[
          ["Potentiel", niche.potential, niche.potential >= 7 ? "bg-slate-900" : "bg-slate-400"],
          ["Difficulté", niche.difficulty, niche.difficulty <= 3 ? "bg-emerald-500" : niche.difficulty <= 6 ? "bg-amber-500" : "bg-red-500"],
          ["Concurrence", niche.competition, niche.competition <= 3 ? "bg-emerald-500" : niche.competition <= 6 ? "bg-amber-500" : "bg-red-500"],
        ].map(([label, value, color]) => (
          <div key={label}>
            <div className="flex justify-between text-xs mb-1">
              <span className="text-slate-500">{label}</span>
              <span className="text-slate-700 font-medium">{value}/10</span>
            </div>
            <div className="h-1 w-full bg-slate-100 rounded-full overflow-hidden">
              <div className={`h-full rounded-full ${color}`} style={{ width: `${value * 10}%` }} />
            </div>
          </div>
        ))}
      </div>

      {/* Prix */}
      {(niche.prixMin || niche.prixMax) && (
        <div className="mb-3 flex-none">
          <p className="text-xs text-slate-400 mb-0.5">Prix recommandé</p>
          <p className="text-sm font-semibold text-slate-900">
            {niche.prixMin?.toLocaleString()} – {niche.prixMax?.toLocaleString()} FCFA
          </p>
        </div>
      )}

      {/* Annonceurs actifs */}
      {niche.adsContext?.length > 0 && (
        <div className="mb-3 flex-none">
          <p className="text-xs text-slate-400 mb-2">Annonceurs actifs sur ce thème</p>
          <div className="flex items-center gap-1.5 flex-wrap">
            {niche.adsContext.slice(0, 4).map((ad, i) => (
              <div key={i} className="flex items-center gap-1.5 bg-slate-50 border border-slate-100 rounded-full px-2 py-1">
                {ad.photo ? (
                  <img src={ad.photo} alt={ad.name} className="w-4 h-4 rounded-full object-cover flex-shrink-0" />
                ) : (
                  <div className="w-4 h-4 rounded-full bg-slate-200 flex-shrink-0" />
                )}
                <span className="text-xs text-slate-600 max-w-[80px] truncate">{ad.name}</span>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Keywords */}
      {niche.keywords?.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4 flex-none">
          {niche.keywords.slice(0, 3).map((k, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-slate-50 text-slate-500 rounded border border-slate-100">{k}</span>
          ))}
        </div>
      )}

      {/* CTA */}
      <div className="flex flex-col gap-2 mt-auto">
        <button onClick={handleGenerate}
          className="w-full py-3 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all flex items-center justify-center gap-1.5">
          Créer mon ebook sur ce sujet <ChevronRight className="w-4 h-4" />
        </button>
        <button onClick={handleAnalyze}
          className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 hover:bg-slate-50 rounded-lg transition-all">
          Analyser l'idée en profondeur
        </button>
      </div>
    </div>
  );
}