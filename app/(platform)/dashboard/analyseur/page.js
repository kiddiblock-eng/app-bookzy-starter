"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, BarChart2, TrendingUp, Globe, DollarSign, Users, Target, CheckCircle, Loader2, TrendingDown, Minus, Calendar, BookOpen, ArrowRight } from "lucide-react";

export default function AnalyseurPage() {
  const router = useRouter();
  const [sujet, setSujet] = useState("");
  const [error, setError] = useState("");
  const [limitReached, setLimitReached] = useState(false);

  // Animation state
  const [phase, setPhase] = useState("idle"); // idle | scanning | generating | done
  const [steps, setSteps] = useState({
    fb: { status: "waiting", annonceurs: [], total: 0 },
    trends: { status: "waiting", tendance: null },
    marches: { status: "waiting", paysScores: null },
    ia: { status: "waiting" },
    rapport: { status: "waiting" },
  });

  const updateStep = (key, data) => setSteps(prev => ({ ...prev, [key]: { ...prev[key], ...data } }));
  const wait = ms => new Promise(r => setTimeout(r, ms));

  const handleAnalyse = async () => {
    if (!sujet.trim()) return;
    setError("");
    setLimitReached(false);

    // ── Vérifier le quota AVANT de lancer l'animation ────────────────────────
    try {
      const checkRes = await fetch("/api/analyseur/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sujet: sujet.trim(), checkOnly: true }),
      });
      const checkData = await checkRes.json();
      if (!checkData.success && (checkData.limitReached || checkData.needsOffer)) {
        window.dispatchEvent(new CustomEvent("bookzy:upgrade"));
        return;
      }
    } catch {}

    // Quota ok → lancer l'animation
    setPhase("scanning");
    setSteps({
      fb: { status: "waiting", annonceurs: [], total: 0 },
      trends: { status: "waiting", tendance: null },
      marches: { status: "waiting", paysScores: null },
      ia: { status: "waiting" },
      rapport: { status: "waiting" },
    });

    try {
      // ── ÉTAPE 1 : FB Ads (via scan route) ────────────────────────────────
      updateStep("fb", { status: "loading" });
      const scanRes = await fetch("/api/analyseur/scan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ sujet: sujet.trim() }),
      });
      const scanData = await scanRes.json();

      if (!scanData.success) {
        setPhase("idle");
        if (scanData.limitReached || scanData.needsOffer) window.dispatchEvent(new CustomEvent("bookzy:upgrade"));
        else setError("Erreur lors du scan. Réessaie.");
        return;
      }

      if (scanData.success) {
        updateStep("fb", { status: "done", total: scanData.fb.totalAnnonceurs, annonceurs: scanData.fb.annonceurs });
      } else {
        updateStep("fb", { status: "done", total: 0, annonceurs: [] });
      }

      // ── ÉTAPE 2 : Google Trends ───────────────────────────────────────────
      updateStep("trends", { status: "loading" });
      await wait(400); // petit délai visuel
      updateStep("trends", { status: "done", tendance: scanData.trends?.tendance || "stable" });

      // ── ÉTAPE 3 : Comparaison marchés ────────────────────────────────────
      updateStep("marches", { status: "loading" });
      await wait(800);
      updateStep("marches", { status: "done", paysScores: scanData.trends?.paysScores });

      // ── ÉTAPE 4 : Gemini analyse (lancer /analyse en parallèle) ──────────
      updateStep("ia", { status: "loading" });
      setPhase("generating");

      const analyseRes = await fetch("/api/analyseur/analyse", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          sujet: sujet.trim(),
          scanData: scanData.success ? { fb: scanData.fb, trends: scanData.trends } : null,
        }),
      });
      const analyseData = await analyseRes.json();

      if (!analyseData.success) {
        setPhase("idle");
        if (analyseData.limitReached || analyseData.needsOffer) window.dispatchEvent(new CustomEvent("bookzy:upgrade", { detail: { title: analyseData.message } }));
        else setError(analyseData.message || "Erreur.");
        return;
      }

      updateStep("ia", { status: "done" });

      // ── ÉTAPE 5 : Rapport généré ──────────────────────────────────────────
      updateStep("rapport", { status: "loading" });
      await wait(600);
      updateStep("rapport", { status: "done" });

      setPhase("done");
      await wait(400);
      router.push(`/dashboard/analyseur/${analyseData.data.id}?premium=true`);

    } catch {
      setPhase("idle");
      setError("Erreur serveur. Réessaie.");
    }
  };

  function TendanceLabel({ tendance }) {
    if (tendance === "montante") return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-emerald-600"><TrendingUp size={11} /> Montante</span>;
    if (tendance === "descendante") return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-red-500"><TrendingDown size={11} /> Descendante</span>;
    return <span className="inline-flex items-center gap-1 text-[11px] font-semibold text-neutral-400"><Minus size={11} /> Stable</span>;
  }

  const STEP_CONFIG = [
    { key: "fb",      Icon: Users,      label: "Scan Facebook Ads" },
    { key: "trends",  Icon: TrendingUp, label: "Google Trends" },
    { key: "marches", Icon: Globe,      label: "Comparaison des marchés" },
    { key: "ia",      Icon: BarChart2,  label: "Analyse IA" },
    { key: "rapport", Icon: Target,     label: "Génération du rapport" },
  ];

  const doneCount = Object.values(steps).filter(s => s.status === "done").length;

  // ── Vue animation ──────────────────────────────────────────────────────────
  if (phase !== "idle") return (
    <div className="min-h-[calc(100dvh-56px)] bg-white flex flex-col items-center justify-center px-4 py-10">
      <div className="w-full max-w-md">

        <div className="text-center mb-7">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full mb-3.5">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span className="text-[11px] font-semibold text-neutral-500 uppercase tracking-wide">Analyse en cours</span>
          </div>
          <h2 className="text-lg font-semibold text-neutral-900 mb-1">« {sujet} »</h2>
          <p className="text-xs text-neutral-400">Analyse sur plusieurs sources de données réelles</p>
        </div>

        <div className="flex flex-col gap-2 mb-6">
          {STEP_CONFIG.map(({ key, Icon, label }) => {
            const step = steps[key];
            const done = step.status === "done";
            const loading = step.status === "loading";
            const waiting = step.status === "waiting";

            return (
              <div key={key} className={`px-4 py-3.5 rounded-xl border transition-all ${done ? "bg-emerald-50 border-emerald-100" : loading ? "bg-white border-neutral-200 shadow-sm" : "bg-neutral-50 border-neutral-100"} ${waiting ? "opacity-40" : "opacity-100"}`}>
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-lg shrink-0 flex items-center justify-center ${done ? "bg-emerald-100" : "bg-neutral-100"}`}>
                    {done ? <CheckCircle size={16} className="text-emerald-600" /> : <Icon size={16} className={loading ? "text-neutral-700" : "text-neutral-300"} />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-[13px] font-semibold ${done ? "text-emerald-700" : loading ? "text-neutral-900" : "text-neutral-400"}`}>{label}</p>

                    {/* Détails FB Ads */}
                    {key === "fb" && done && (
                      <div className="mt-2">
                        <span className="text-xs font-semibold text-neutral-700">{step.total} annonceurs actifs</span>
                        {step.annonceurs.length > 0 && (
                          <div className="flex mt-1.5">
                            {step.annonceurs.slice(0, 4).map((a, i) => (
                              <div key={i} className={`w-7 h-7 rounded-full overflow-hidden border-2 border-white bg-neutral-200 shrink-0 ${i > 0 ? "-ml-2" : ""}`}>
                                {a.photo && <img src={a.photo} alt={a.nom} className="w-full h-full object-cover" />}
                              </div>
                            ))}
                            {step.total > 4 && (
                              <div className="w-7 h-7 rounded-full border-2 border-white -ml-2 bg-neutral-100 flex items-center justify-center text-[9px] font-bold text-neutral-500">
                                +{step.total - 4}
                              </div>
                            )}
                          </div>
                        )}
                      </div>
                    )}

                    {/* Tendance Google */}
                    {key === "trends" && done && step.tendance && (
                      <div className="mt-1"><TendanceLabel tendance={step.tendance} /></div>
                    )}

                    {/* Pays */}
                    {key === "marches" && done && step.paysScores && (
                      <div className="mt-1.5 flex gap-1.5 flex-wrap">
                        {Object.entries(step.paysScores).sort((a, b) => b[1] - a[1]).slice(0, 4).map(([code, score]) => {
                          const flags = { CI: "🇨🇮", SN: "🇸🇳", CM: "🇨🇲", ML: "🇲🇱", BJ: "🇧🇯", TG: "🇹🇬", FR: "🇫🇷" };
                          return (
                            <div key={code} className="flex items-center gap-1 px-2 py-0.5 bg-white border border-neutral-200 rounded-full">
                              <span className="text-xs">{flags[code]}</span>
                              <span className="text-[10px] font-bold text-neutral-900">{score}/100</span>
                            </div>
                          );
                        })}
                      </div>
                    )}

                    {/* IA */}
                    {key === "ia" && loading && <p className="text-[11px] text-neutral-400 mt-0.5">Bookzy analyse tes données de marché…</p>}
                    {key === "rapport" && loading && <p className="text-[11px] text-neutral-400 mt-0.5">Score, verdict, revenus, titres accrocheurs…</p>}
                  </div>
                  {loading && <Loader2 size={15} className="text-neutral-400 animate-spin shrink-0" />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Barre progression */}
        <div className="bg-neutral-100 rounded-full h-1 overflow-hidden">
          <div className="h-full bg-neutral-900 rounded-full transition-all duration-500" style={{ width: `${Math.max(5, (doneCount / STEP_CONFIG.length) * 100)}%` }} />
        </div>
        <p className="text-[11px] text-neutral-400 text-center mt-2">{doneCount}/{STEP_CONFIG.length} étapes complétées</p>
      </div>
    </div>
  );

  // ── Vue focus ──────────────────────────────────────────────────────────────
  return (
    <div className="min-h-[calc(100dvh-56px)] bg-white flex flex-col items-center justify-center px-4 py-12">
      <div className="w-full max-w-2xl">

        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 mb-5">
            <BarChart2 size={22} className="text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-2.5 tracking-tight">
            Ton produit digital va-t-il cartonner ?
          </h1>
          <p className="text-sm text-neutral-500 max-w-lg mx-auto">
            Découvre le potentiel de ton idée en quelques secondes — données réelles, rapport clair pour foncer ou pivoter.
          </p>
        </div>

        <div className="relative">
          <input type="text" value={sujet} onChange={e => setSujet(e.target.value)}
            onKeyDown={e => e.key === "Enter" && sujet.trim() && handleAnalyse()}
            placeholder="Ton idée ici…"
            className="w-full pl-5 pr-16 py-4 text-[15px] border border-neutral-200 rounded-[28px] outline-none text-neutral-900 placeholder:text-neutral-400 focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
          />
          <button onClick={handleAnalyse} disabled={!sujet.trim()}
            className="absolute right-2.5 top-1/2 -translate-y-1/2 w-11 h-11 rounded-full bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 flex items-center justify-center transition-colors">
            <Search size={17} className={sujet.trim() ? "text-white" : "text-neutral-400"} />
          </button>
        </div>

        {error && (
          <div className="mt-3 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">{error}</div>
        )}

        {limitReached && (
          <div className="mt-4 bg-neutral-900 rounded-2xl p-5">
            <p className="text-sm font-semibold text-white mb-1.5">Tu as utilisé tes analyses gratuites de la semaine</p>
            <p className="text-[13px] text-neutral-400 mb-4 leading-relaxed">Passe à une offre Créateur ou Pro pour analyser sans limite et débloquer tous les outils.</p>
            <div className="flex gap-2">
              <button onClick={() => router.push("/dashboard/tarifs")} className="flex-1 py-2.5 bg-white text-neutral-900 rounded-xl text-[13px] font-semibold hover:bg-neutral-100 transition-colors flex items-center justify-center gap-1.5">
                Voir les offres <ArrowRight size={14} />
              </button>
              <button onClick={() => router.push("/dashboard/analyseur/historique")} className="px-4 py-2.5 text-[13px] font-semibold text-neutral-300 border border-neutral-700 rounded-xl hover:bg-neutral-800 transition-colors">
                Mes analyses
              </button>
            </div>
          </div>
        )}

        {/* Promesses */}
        <div className="mt-12">
          <p className="text-[11px] font-semibold text-neutral-400 uppercase tracking-wider text-center mb-4">Ton rapport contiendra</p>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
            {[
              { Icon: TrendingUp, titre: "Score de marché", desc: "Un verdict clair sur 100 pour savoir si tu dois foncer" },
              { Icon: Users, titre: "Annonceurs Facebook actifs", desc: "Qui investit déjà sur ce sujet, avec leurs profils" },
              { Icon: Globe, titre: "Pays les plus rentables", desc: "Score par pays pour concentrer tes efforts de vente" },
              { Icon: Target, titre: "Positionnement concurrents", desc: "Leur stratégie et comment te différencier" },
              { Icon: DollarSign, titre: "Revenus estimés", desc: "Ce que ce produit peut te rapporter semaine / mois / an" },
              { Icon: BarChart2, titre: "Plan de vente complet", desc: "Des actions concrètes pour vendre rapidement" },
              { Icon: TrendingUp, titre: "Verdict honnête", desc: "Fonce / Attends / Évite — basé sur les vraies données" },
              { Icon: Target, titre: "Battre la concurrence", desc: "Ton angle gagnant pour dominer le marché" },
              { Icon: Calendar, titre: "Plan de lancement", desc: "4 semaines d'actions concrètes" },
              { Icon: BookOpen, titre: "Titres accrocheurs", desc: "3 titres optimisés pour vendre immédiatement" },
            ].map((p, i) => (
              <div key={i} className="flex items-start gap-3 p-4 bg-neutral-50 border border-neutral-100 rounded-xl">
                <div className="w-8 h-8 rounded-lg bg-white border border-neutral-200 flex items-center justify-center shrink-0">
                  <p.Icon size={15} className="text-neutral-700" />
                </div>
                <div>
                  <p className="text-[13px] font-semibold text-neutral-900 mb-0.5">{p.titre}</p>
                  <p className="text-xs text-neutral-500 leading-snug">{p.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
