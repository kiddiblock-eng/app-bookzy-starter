"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import {
  ArrowLeft,
  AlertTriangle,
  CheckCircle2,
  Lightbulb,
  BarChart3,
  Rocket,
  Euro,
  Search as SearchIcon,
  TrendingUp,
  Loader2,
  MousePointerClick,
  Sparkles
} from "lucide-react";

export default function AnalysePage() {
  const params = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  
  const analysisId = params.id;
  const nicheId = searchParams.get("nicheId");

  const [loading, setLoading] = useState(true);
  const [niche, setNiche] = useState(null);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!analysisId || !nicheId) {
      setError("Paramètres manquants");
      setLoading(false);
      return;
    }
    fetchAnalysis();
  }, [analysisId, nicheId]);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch("/api/niche-hunter/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ analysisId, nicheId })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erreur lors de l'analyse");
      }

      setNiche(data.data.niche);
    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGenerateEbook = () => {
    if (!niche) return;
    const suggestion = niche.analysis?.titreOptimise || niche.title || "";
    const description = niche.description || "";

    const params = new URLSearchParams({
      suggestion: encodeURIComponent(suggestion),
      description: encodeURIComponent(description)
    });

    router.push(`/dashboard/projets/nouveau?${params.toString()}`);
  };

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50">
        <div className="w-12 h-12 rounded-xl bg-white border border-slate-200 flex items-center justify-center mb-4 shadow-sm">
          <Loader2 className="w-6 h-6 text-indigo-600 animate-spin" />
        </div>
        <p className="text-slate-600 font-medium animate-pulse">Analyse approfondie des données...</p>
      </div>
    );
  }

  if (error || !niche) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-slate-50 px-4">
        <div className="w-12 h-12 rounded-xl bg-red-50 border border-red-100 flex items-center justify-center mb-4">
          <AlertTriangle className="w-6 h-6 text-red-600" />
        </div>
        <h2 className="text-lg font-bold text-slate-900 mb-2">Erreur d'analyse</h2>
        <p className="text-slate-500 mb-6 text-center max-w-md">{error || "Impossible de charger l'analyse"}</p>
        <button
          onClick={() => router.back()}
          className="px-6 py-2.5 bg-white border border-slate-300 hover:bg-slate-50 text-slate-700 rounded-lg font-medium transition-all"
        >
          Retour au tableau de bord
        </button>
      </div>
    );
  }

  const analysis = niche.analysis || {};
  const scoreGlobal = Math.round(
    (Number(niche.potential || 0) * 10 +
      (10 - Number(niche.competition || 0)) * 5 +
      (10 - Number(niche.difficulty || 0)) * 5) / 2
  );

  return (
    // Padding bottom augmenté (pb-32) pour que le contenu ne soit pas caché par le bouton fixe sur mobile
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900 pb-32 md:pb-20">
      
      {/* HEADER FIXE (Desktop CTA) */}
      <div className="sticky top-0 z-40 bg-white border-b border-slate-200">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => router.back()}
              className="p-2 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded-lg transition-all"
            >
              <ArrowLeft className="w-5 h-5" />
            </button>
            <div>
               <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-0.5">Rapport d'analyse</div>
               <h1 className="text-lg font-bold text-slate-900 leading-none truncate max-w-[200px] sm:max-w-md">{niche.title}</h1>
            </div>
          </div>
          
          {/* Bouton Desktop (Caché sur mobile) */}
          <button
            onClick={handleGenerateEbook}
            className="hidden md:flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-95"
          >
            <Rocket className="w-4 h-4" />
            <span>Lancer le projet</span>
          </button>
        </div>
      </div>

      {/* CONTENU PRINCIPAL */}
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* GRILLE SCORE */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <div className="lg:col-span-1 bg-white border border-slate-200 rounded-2xl p-6 shadow-sm flex flex-col justify-between relative overflow-hidden">
                <div className="absolute top-0 right-0 p-4 opacity-10">
                    <BarChart3 className="w-24 h-24 text-indigo-600" />
                </div>
                <div>
                    <div className="text-sm font-bold text-slate-500 uppercase tracking-wide mb-4">Score de Viabilité</div>
                    <div className="flex items-end gap-3 mb-2">
                        <span className={`text-7xl font-black tracking-tighter ${scoreGlobal >= 70 ? 'text-emerald-600' : scoreGlobal >= 50 ? 'text-amber-500' : 'text-red-500'}`}>
                            {scoreGlobal}
                        </span>
                        <span className="text-xl font-bold text-slate-400 mb-2">/100</span>
                    </div>
                    <div className="inline-flex px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-xs font-bold">
                        {scoreGlobal >= 75 ? "🔥 Opportunité Excellente" : scoreGlobal >= 50 ? "✨ Potentiel Intéressant" : "⚡ Risqué"}
                    </div>
                </div>
                <div className="mt-8 space-y-3">
                    <ScoreBar label="Potentiel" value={niche.potential} color="bg-indigo-500" />
                    <ScoreBar label="Facilité" value={10 - niche.difficulty} color="bg-emerald-500" />
                    <ScoreBar label="Faible Concurrence" value={10 - niche.competition} color="bg-amber-500" />
                </div>
            </div>

            <div className="lg:col-span-2 flex flex-col gap-6">
                <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                    <h2 className="text-lg font-bold text-slate-900 mb-3">Résumé de l'opportunité</h2>
                    <p className="text-slate-600 leading-relaxed text-sm sm:text-base">
                        {niche.description}
                    </p>
                </div>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 flex-1">
                    <MetricCard icon={SearchIcon} label="Volume Rech." value={analysis.volumeEstime || "N/A"} />
                    <MetricCard icon={TrendingUp} label="Tendance" value={analysis.tendance || "Stable"} color={analysis.tendance === 'Hausse' ? 'text-green-600' : 'text-slate-600'} />
                    <MetricCard icon={Euro} label="CPC Moyen" value={analysis.cpcMoyen || "N/A"} />
                    <MetricCard icon={MousePointerClick} label="Diff. SEO" value={analysis.difficulteSEO || "Moyen"} />
                </div>
            </div>
        </div>

        {/* DETAILS */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <SectionHeader icon={CheckCircle2} title="Forces du marché" color="text-emerald-600" />
                <ContentList items={analysis.forces} type="success" />
            </div>
            <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                <SectionHeader icon={AlertTriangle} title="Points de vigilance" color="text-amber-600" />
                <ContentList items={analysis.pointsAttention} type="warning" />
            </div>
        </div>

        {/* STRATÉGIE */}
        <div className="bg-indigo-50 border border-indigo-100 rounded-2xl p-6 sm:p-8 mb-8">
             <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center shadow-md">
                    <Lightbulb className="w-6 h-6 text-white" />
                </div>
                <h2 className="text-xl font-bold text-indigo-900">Angle d'attaque recommandé</h2>
             </div>
             
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                    <div className="text-xs font-bold text-indigo-500 uppercase mb-2">Titre eBook Suggéré</div>
                    <div className="font-serif text-lg text-slate-800 italic">
                        "{analysis.titreOptimise || niche.title}"
                    </div>
                </div>
                <div className="bg-white p-5 rounded-xl border border-indigo-100 shadow-sm">
                    <div className="text-xs font-bold text-indigo-500 uppercase mb-2">Cible Prioritaire</div>
                    <div className="font-medium text-slate-800">
                        {analysis.publicCible || "Non spécifié"}
                    </div>
                </div>
             </div>

             <div className="mt-6">
                <div className="text-sm font-bold text-indigo-800 mb-3">Conseils de différenciation :</div>
                <ul className="space-y-2">
                    {(analysis.conseilsDiff || []).map((conseil, i) => (
                        <li key={i} className="flex items-start gap-2 text-sm text-indigo-700">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-indigo-500 flex-shrink-0"></span>
                            {conseil}
                        </li>
                    ))}
                </ul>
             </div>
        </div>

        {/* BLOCK FINAL DESKTOP (Rassurant) */}
        <div className="hidden md:block bg-white border border-slate-200 rounded-2xl p-8 text-center shadow-sm mt-8">
            <h2 className="text-2xl font-bold text-slate-900 mb-2">Convaincu par cette opportunité ?</h2>
            <p className="text-slate-600 mb-8 max-w-xl mx-auto">
                Transformez cette analyse en un produit réel. Notre IA va générer pour vous un eBook complet, avec un <span className="font-bold text-slate-800">design ultra-professionnel supérieur à 90% de ce qui existe sur le marché</span>.
            </p>
            <button 
                onClick={handleGenerateEbook}
                className="inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-200 transition-all hover:-translate-y-1"
            >
                <Rocket className="w-5 h-5" />
                Lancer la création maintenant
            </button>
        </div>

      </div>

      {/* 🚀 STICKY BOTTOM BAR (MOBILE ONLY) */}
      <div className="md:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200 z-50 shadow-[0_-5px_15px_rgba(0,0,0,0.05)]">
          <div className="flex flex-col gap-2">
             <div className="flex items-center justify-center gap-1.5 text-[10px] font-bold text-indigo-600 bg-indigo-50 py-1 rounded-full mb-1">
                <Sparkles className="w-3 h-3" /> Design Pro &gt; 90% du marché
             </div>
             <button 
                onClick={handleGenerateEbook}
                className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 text-white rounded-xl font-bold text-base shadow-lg active:scale-95 transition-all"
             >
                <Rocket className="w-5 h-5" />
                Générer mon eBook
             </button>
          </div>
      </div>

    </div>
  );
}

/* --- SUB-COMPONENTS --- */

function MetricCard({ icon: Icon, label, value, color = "text-slate-900" }) {
    return (
        <div className="bg-white border border-slate-200 rounded-xl p-4 flex flex-col justify-center items-center text-center hover:border-indigo-300 transition-colors">
            <Icon className="w-5 h-5 text-slate-400 mb-2" />
            <div className={`text-lg font-bold ${color}`}>{value}</div>
            <div className="text-xs font-medium text-slate-500">{label}</div>
        </div>
    )
}

function ScoreBar({ label, value, color }) {
    return (
        <div>
            <div className="flex justify-between text-xs font-medium text-slate-600 mb-1">
                <span>{label}</span>
                <span>{value}/10</span>
            </div>
            <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
                <div className={`h-full rounded-full ${color}`} style={{ width: `${value * 10}%` }}></div>
            </div>
        </div>
    )
}

function SectionHeader({ icon: Icon, title, color }) {
    return (
        <div className="flex items-center gap-3 mb-5 pb-4 border-b border-slate-100">
            <Icon className={`w-6 h-6 ${color}`} />
            <h3 className="text-lg font-bold text-slate-900">{title}</h3>
        </div>
    )
}

function ContentList({ items, type }) {
    const safeItems = Array.isArray(items) ? items : [];
    const bulletColor = type === 'success' ? 'bg-emerald-500' : 'bg-amber-500';

    if (safeItems.length === 0) return <p className="text-slate-400 italic text-sm">Aucune donnée disponible.</p>;

    return (
        <ul className="space-y-3">
            {safeItems.map((item, i) => (
                <li key={i} className="flex items-start gap-3">
                    <span className={`mt-2 w-1.5 h-1.5 rounded-full ${bulletColor} flex-shrink-0`}></span>
                    <span className="text-sm text-slate-700 leading-relaxed">{item}</span>
                </li>
            ))}
        </ul>
    )
}