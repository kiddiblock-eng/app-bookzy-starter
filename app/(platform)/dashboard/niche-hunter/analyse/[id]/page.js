"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft, ChevronRight, AlertCircle,
  Zap, TrendingUp, Target, MapPin, ShoppingBag, CheckCircle2
} from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

// ─── DRAPEAUX ─────────────────────────────────────────────────────────────────
const FLAG_MAP = {
  "cote d ivoire": "🇨🇮", "côte d'ivoire": "🇨🇮", "cote divoire": "🇨🇮", "abidjan": "🇨🇮", "ivoir": "🇨🇮",
  "senegal": "🇸🇳", "sénégal": "🇸🇳", "dakar": "🇸🇳",
  "cameroun": "🇨🇲", "douala": "🇨🇲", "yaounde": "🇨🇲",
  "mali": "🇲🇱", "bamako": "🇲🇱",
  "benin": "🇧🇯", "bénin": "🇧🇯", "cotonou": "🇧🇯",
  "togo": "🇹🇬", "lome": "🇹🇬", "lomé": "🇹🇬",
  "burkina": "🇧🇫", "ouagadougou": "🇧🇫",
  "niger": "🇳🇪", "niamey": "🇳🇪",
  "guinee": "🇬🇳", "guinée": "🇬🇳", "conakry": "🇬🇳",
  "congo": "🇨🇬", "brazzaville": "🇨🇬",
  "rdc": "🇨🇩", "kinshasa": "🇨🇩",
  "gabon": "🇬🇦", "libreville": "🇬🇦",
  "france": "🇫🇷", "paris": "🇫🇷",
  "belgique": "🇧🇪", "bruxelles": "🇧🇪",
  "suisse": "🇨🇭", "geneve": "🇨🇭", "genève": "🇨🇭",
  "canada": "🇨🇦", "montreal": "🇨🇦", "montréal": "🇨🇦",
  "maroc": "🇲🇦", "casablanca": "🇲🇦", "rabat": "🇲🇦",
  "tunisie": "🇹🇳", "tunis": "🇹🇳",
  "algerie": "🇩🇿", "algérie": "🇩🇿", "alger": "🇩🇿",
};

function getFlag(pays) {
  if (!pays) return "🌍";
  const key = pays.toLowerCase().trim();
  for (const [name, flag] of Object.entries(FLAG_MAP)) {
    if (key.includes(name)) return flag;
  }
  return "🌍";
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function AnalysePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutateBalance } = useCredits();

  const analysisId = params.id;
  const nicheId = searchParams.get("nicheId");

  const [loading, setLoading] = useState(true);
  const [niche, setNiche] = useState(null);
  const [error, setError] = useState("");
  const [quotaExceeded, setQuotaExceeded] = useState(false);
  const [quotaPlan, setQuotaPlan] = useState(null);
  const [highDemand, setHighDemand] = useState(false);
  const fetchedRef = useRef(false);

  useEffect(() => {
    if (!analysisId || !nicheId) { setError("Paramètres manquants"); setLoading(false); return; }
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchAnalysis();
  }, [analysisId, nicheId]);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch("/api/niche-hunter/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ analysisId, nicheId }),
      });
      const data = await res.json();

      if (data.quotaExceeded) { setQuotaExceeded(true); setQuotaPlan(data.plan); return; }
      if (data.highDemand) { setHighDemand(true); return; }
      if (res.status === 402 || data.insufficientCredits) { setError("Crédits insuffisants."); return; }
      if (!res.ok || !data.success) throw new Error(data.message || "Erreur");

      setNiche(data.data.niche);
      mutateBalance();
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEbook = () => {
    if (!niche) return;
    const suggestion = niche.analysis?.titreOptimise || niche.title || "";
    const description = niche.description || "";
    const p = new URLSearchParams({ suggestion: encodeURIComponent(suggestion), description: encodeURIComponent(description) });
    router.push(`/dashboard/projets/nouveau?${p.toString()}`);
  };

  // ── HIGH DEMAND ──────────────────────────────────────────────────────────────
  if (highDemand) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-5 px-4">
        <div className="text-5xl">⏳</div>
        <div className="text-center">
          <h2 className="text-lg font-bold text-slate-900 mb-2">Demande élevée actuellement</h2>
          <p className="text-sm text-slate-500 max-w-xs">
            Nos serveurs sont très sollicités en ce moment. Donne-nous encore quelques secondes et réessaie.
          </p>
        </div>
        <button
          onClick={() => {
            setHighDemand(false);
            setLoading(true);
            fetchedRef.current = false;
            fetchAnalysis();
          }}
          className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all"
        >
          Réessayer maintenant
        </button>
      </div>
    );
  }

  // ── LOADING ──────────────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white gap-4">
        <div className="relative w-16 h-16">
          <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-slate-900 animate-spin" />
          <div className="absolute inset-3 bg-slate-900 rounded-full flex items-center justify-center">
            <Target className="w-4 h-4 text-white" />
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-slate-900 mb-1">Analyse approfondie en cours...</p>
          <p className="text-xs text-slate-400">On prépare ton plan de bataille 🔥</p>
        </div>
      </div>
    );
  }

  // ── QUOTA ────────────────────────────────────────────────────────────────────
  if (quotaExceeded) {
    return (
      <div className="min-h-screen bg-white">
        <TopBar router={router} niche={null} onGenerate={handleGenerateEbook} />
        <div className="max-w-md mx-auto text-center px-4 py-20">
          <div className="w-14 h-14 bg-amber-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <AlertCircle className="w-7 h-7 text-amber-600" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 mb-2">Limite journalière atteinte</h3>
          <p className="text-sm text-slate-500 mb-6">
            {quotaPlan === "solo" ? "3 analyses utilisées aujourd'hui."
              : quotaPlan === "createur" ? "8 analyses utilisées aujourd'hui."
              : "Passez à un plan payant pour continuer."}
          </p>
          <div className="flex gap-3 justify-center">
            <button onClick={() => router.back()} className="px-5 py-2.5 bg-slate-100 text-slate-700 font-medium rounded-xl text-sm">Retour</button>
            <button onClick={() => router.push("/dashboard/tarifs")} className="px-5 py-2.5 bg-slate-900 text-white font-medium rounded-xl text-sm">Voir les plans</button>
          </div>
        </div>
      </div>
    );
  }

  // ── ERREUR ───────────────────────────────────────────────────────────────────
  if (error || !niche) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <p className="text-slate-900 font-medium mb-2">Erreur</p>
        <p className="text-sm text-slate-500 mb-6 text-center">{error || "Impossible de charger l'analyse"}</p>
        <button onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">Retour</button>
      </div>
    );
  }

  const a = niche.analysis || {};
  const scoreGlobal = a.scoreGlobal || Math.round(
    (Number(niche.potential || 0) * 10 + (10 - Number(niche.competition || 0)) * 5 + (10 - Number(niche.difficulty || 0)) * 5) / 2
  );
  const scoreColor = scoreGlobal >= 75 ? "text-emerald-600" : scoreGlobal >= 55 ? "text-amber-600" : "text-red-500";
  const scoreBg = scoreGlobal >= 75 ? "bg-emerald-50 border-emerald-200" : scoreGlobal >= 55 ? "bg-amber-50 border-amber-200" : "bg-red-50 border-red-200";

  return (
    <div className="min-h-screen bg-slate-50 pb-28">
      <TopBar router={router} niche={niche} onGenerate={handleGenerateEbook} />

      <div className="max-w-3xl mx-auto px-4 py-6 space-y-4">

        {/* ── HERO SCORE ─────────────────────────────────────────────── */}
        <div className={`border rounded-2xl p-6 ${scoreBg}`}>
          <div className="flex items-center gap-5 mb-4">
            <div className="text-center flex-shrink-0">
              <div className={`text-5xl font-black ${scoreColor}`}>{scoreGlobal}</div>
              <div className="text-xs text-slate-400 font-medium">/ 100</div>
            </div>
            <div className="flex-1">
              <h2 className="font-bold text-slate-900 text-base mb-1 line-clamp-2">{niche.title}</h2>
              {a.verdict && <p className="text-sm text-slate-600 leading-relaxed">{a.verdict}</p>}
            </div>
          </div>

          {/* ── BADGES MOTIVANTS ─────────────────────────────────────── */}
          <div className="flex flex-wrap gap-2">
            {a.projections?.[1]?.revenus && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-emerald-200 text-emerald-700 text-xs font-semibold rounded-full shadow-sm">
                💰 Jusqu'à {(a.projections[1].revenus / 1000).toFixed(0)}k FCFA ce mois
              </span>
            )}
            {a.planSemaines?.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-blue-200 text-blue-700 text-xs font-semibold rounded-full shadow-sm">
                🚀 Plan 100 ventes inclus
              </span>
            )}
            {a.paysTop?.length > 0 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-orange-200 text-orange-700 text-xs font-semibold rounded-full shadow-sm">
                📍 {a.paysTop.length} pays chauds identifiés
              </span>
            )}
            {niche.competition <= 4 && (
              <span className="inline-flex items-center gap-1.5 px-3 py-1.5 bg-white border border-purple-200 text-purple-700 text-xs font-semibold rounded-full shadow-sm">
                💎 Marché peu exploité
              </span>
            )}
          </div>
        </div>

        {/* ── CTA GÉNÉRATION ─────────────────────────────────────────── */}
        <button
          onClick={handleGenerateEbook}
          className="w-full bg-slate-900 hover:bg-slate-800 text-white rounded-2xl p-5 flex items-center justify-between group transition-all shadow-md"
        >
          <div className="text-left">
            <p className="text-base font-bold mb-0.5">Générer mon ebook maintenant</p>
            <p className="text-xs text-slate-400">
              {a.prixIdeal ? `Vends-le à ${a.prixIdeal.toLocaleString()} FCFA sur Taliopay` : "Crée et vends ton ebook sur Taliopay"}
            </p>
          </div>
          <div className="w-10 h-10 bg-white/10 rounded-xl flex items-center justify-center group-hover:bg-white/20 transition-all flex-shrink-0">
            <ChevronRight className="w-5 h-5 text-white" />
          </div>
        </button>

        {/* ── TITRE OPTIMISÉ ─────────────────────────────────────────── */}
        {a.titreOptimise && a.titreOptimise !== niche.title && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-2">✨ Titre optimisé par l'IA</p>
            <p className="text-base font-bold text-slate-900">{a.titreOptimise}</p>
            {a.publicCible && <p className="text-sm text-slate-500 mt-2">{a.publicCible}</p>}
          </div>
        )}

        {/* ── PAYS QUI CARTONNENT ────────────────────────────────────── */}
        {a.paysTop?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <MapPin className="w-4 h-4 text-slate-500" />
              <p className="text-sm font-bold text-slate-900">Où ça cartonne le plus</p>
            </div>
            <div className="space-y-3">
              {a.paysTop.map((p, i) => (
                <div key={i}>
                  <div className="flex items-center justify-between mb-1.5">
                    <div className="flex items-center gap-2.5">
                      <span className="text-xl">{getFlag(p.pays)}</span>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="text-sm font-semibold text-slate-900">{p.pays}</span>
                          {i === 0 && <span className="text-xs bg-orange-100 text-orange-700 px-1.5 py-0.5 rounded-full font-medium">🔥 Top</span>}
                        </div>
                        {p.raison && <p className="text-xs text-slate-400 leading-tight">{p.raison}</p>}
                      </div>
                    </div>
                    <span className="text-sm font-bold text-slate-700 flex-shrink-0 ml-2">{p.score}%</span>
                  </div>
                  <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                    <div
                      className={`h-full rounded-full transition-all ${i === 0 ? "bg-slate-900" : i === 1 ? "bg-slate-700" : i === 2 ? "bg-slate-500" : "bg-slate-300"}`}
                      style={{ width: `${p.score}%` }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── GRAPHIQUE PROJECTIONS REVENUS ──────────────────────────── */}
        {a.projections?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-4">
              <TrendingUp className="w-4 h-4 text-slate-500" />
              <p className="text-sm font-bold text-slate-900">Projections de revenus</p>
            </div>
            <div className="flex items-end gap-3 h-32 mb-3">
              {a.projections.map((proj, i) => {
                const maxRevenu = Math.max(...a.projections.map(p => p.revenus));
                const hauteur = Math.round((proj.revenus / maxRevenu) * 100);
                const colors = ["bg-slate-300", "bg-slate-600", "bg-slate-900"];
                return (
                  <div key={i} className="flex-1 flex flex-col items-center gap-1">
                    <p className="text-xs font-bold text-slate-900">{(proj.revenus / 1000).toFixed(0)}k</p>
                    <div className="w-full flex items-end justify-center" style={{ height: "80px" }}>
                      <div
                        className={`w-full rounded-t-lg ${colors[i]} transition-all`}
                        style={{ height: `${hauteur}%` }}
                      />
                    </div>
                    <p className="text-xs text-slate-500 text-center">{proj.scenario}</p>
                    <p className="text-xs text-slate-400 text-center">{proj.label}</p>
                  </div>
                );
              })}
            </div>
            <p className="text-xs text-slate-400 text-center">Revenus estimés en FCFA</p>
          </div>
        )}

        {/* ── PLAN 100 VENTES ────────────────────────────────────────── */}
        {a.planSemaines?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center gap-2 mb-1">
              <Target className="w-4 h-4 text-slate-500" />
              <p className="text-sm font-bold text-slate-900">Plan pour 100 ventes ce mois</p>
            </div>
            {a.prixIdeal && (
              <p className="text-xs text-slate-400 mb-4">
                Prix recommandé : <span className="font-semibold text-slate-700">{a.prixIdeal?.toLocaleString()} FCFA</span>
              </p>
            )}
            <div className="space-y-3">
              {a.planSemaines.map((s, i) => (
                <div key={i} className="flex gap-3">
                  <div className="flex flex-col items-center">
                    <div className="w-7 h-7 rounded-full bg-slate-900 text-white text-xs font-bold flex items-center justify-center flex-shrink-0">{i + 1}</div>
                    {i < a.planSemaines.length - 1 && <div className="w-px flex-1 bg-slate-200 mt-1" />}
                  </div>
                  <div className="pb-3 flex-1">
                    <div className="flex items-center gap-2 mb-0.5">
                      <p className="text-xs font-semibold text-slate-900">{s.semaine}</p>
                      <span className="text-xs bg-emerald-100 text-emerald-700 px-1.5 py-0.5 rounded-full font-medium">{s.objectif}</span>
                    </div>
                    <p className="text-sm text-slate-600">{s.action}</p>
                  </div>
                </div>
              ))}
            </div>
            {a.messageAccroche && (
              <div className="mt-4 bg-slate-50 border border-slate-200 rounded-xl p-3">
                <p className="text-xs font-semibold text-slate-500 mb-1">💬 Message d'accroche WhatsApp/Instagram</p>
                <p className="text-sm text-slate-800 italic">"{a.messageAccroche}"</p>
              </div>
            )}
          </div>
        )}

        {/* ── TACTIQUES DE VENTE ─────────────────────────────────────── */}
        {a.tactiquesVente?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm font-bold text-slate-900 mb-3">⚡ Tactiques pour vendre vite</p>
            <div className="space-y-2">
              {a.tactiquesVente.map((t, i) => (
                <div key={i} className="flex items-start gap-2">
                  <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                  <p className="text-sm text-slate-700">{t}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* ── POSITIONNEMENT ─────────────────────────────────────────── */}
        {(a.angleUnique || a.ceQueLaConcFaitMal || a.messageCle) && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm font-bold text-slate-900 mb-4">🎯 Comment te positionner</p>
            <div className="space-y-4">
              {a.angleUnique && (
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Ton angle unique</p>
                  <p className="text-sm text-slate-800 font-medium">{a.angleUnique}</p>
                </div>
              )}
              {a.ceQueLaConcFaitMal && (
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Ce que les concurrents ratent</p>
                  <p className="text-sm text-slate-700">{a.ceQueLaConcFaitMal}</p>
                </div>
              )}
              {a.messageCle && (
                <div>
                  <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-1">Ton message clé</p>
                  <p className="text-sm font-semibold text-slate-900">"{a.messageCle}"</p>
                </div>
              )}
            </div>
          </div>
        )}

        {/* ── FORCES / RISQUES ───────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm font-bold text-slate-900 mb-3">💪 Points forts</p>
            <div className="space-y-2">
              {(a.forces || []).map((f, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{f}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-sm font-bold text-slate-900 mb-3">⚠️ Points d'attention</p>
            <div className="space-y-2">
              {(a.risques || []).map((r, i) => (
                <div key={i} className="flex items-start gap-2">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-2 flex-shrink-0" />
                  <p className="text-sm text-slate-700">{r}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── TALIOPAY CTA ───────────────────────────────────────────── */}
        <div className="bg-slate-900 rounded-2xl p-5 text-white">
          <div className="flex items-start gap-3 mb-4">
            <ShoppingBag className="w-5 h-5 text-white flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-bold mb-1">Crée ta boutique sur Taliopay</p>
              <p className="text-xs text-slate-300 leading-relaxed">
                {a.conseilsTaliopay || "La meilleure plateforme pour vendre tes ebooks en Afrique avec paiement Mobile Money intégré (Wave, Orange Money, MTN)."}
              </p>
            </div>
          </div>
          <a
            href="https://taliopay.com"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full py-3 bg-white text-slate-900 font-semibold rounded-xl text-sm flex items-center justify-center gap-2 hover:bg-slate-100 transition-all"
          >
            Ouvrir ma boutique sur Taliopay <ChevronRight className="w-4 h-4" />
          </a>
        </div>

        {/* ── KEYWORDS ───────────────────────────────────────────────── */}
        {niche.keywords?.length > 0 && (
          <div className="bg-white border border-slate-200 rounded-2xl p-5">
            <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mb-3">Mots-clés associés</p>
            <div className="flex flex-wrap gap-2">
              {niche.keywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 text-xs text-slate-600 bg-slate-100 rounded-lg">{kw}</span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* ── CTA MOBILE FIXE ────────────────────────────────────────────── */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
        <button onClick={handleGenerateEbook}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl flex items-center justify-center gap-2 transition-all">
          Générer mon ebook — commencer à vendre 🚀
        </button>
      </div>
    </div>
  );
}

function TopBar({ router, niche, onGenerate }) {
  return (
    <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
      <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
        <button onClick={() => router.back()} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="flex-1 min-w-0">
          <p className="text-xs text-slate-400">Analyse approfondie</p>
          {niche && <h1 className="text-sm font-semibold text-slate-900 truncate">{niche.title}</h1>}
        </div>
        {niche && (
          <button onClick={onGenerate}
            className="hidden sm:flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all">
            Générer l'ebook <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}