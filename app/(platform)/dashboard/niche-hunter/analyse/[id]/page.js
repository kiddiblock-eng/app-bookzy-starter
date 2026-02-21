"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { ArrowLeft, Loader2, ChevronRight } from "lucide-react";

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
      <div className="flex flex-col items-center justify-center min-h-screen bg-white">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin mb-3" />
        <p className="text-sm text-slate-500">Analyse en cours...</p>
      </div>
    );
  }

  if (error || !niche) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <p className="text-slate-900 font-medium mb-2">Erreur</p>
        <p className="text-sm text-slate-500 mb-6 text-center">{error || "Impossible de charger l'analyse"}</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
        >
          Retour
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
    <div className="min-h-screen bg-white pb-24">
      
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400">Analyse</p>
            <h1 className="text-sm font-semibold text-slate-900 truncate">{niche.title}</h1>
          </div>
          <button
            onClick={handleGenerateEbook}
            className="hidden sm:flex items-center gap-1 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white text-sm font-medium rounded-lg transition-all"
          >
            Créer l'ebook
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="max-w-3xl mx-auto px-4 py-6">
        
        {/* Score + Description */}
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-4">
            <div className="text-center">
              <div className={`text-4xl font-bold ${scoreGlobal >= 70 ? 'text-emerald-600' : scoreGlobal >= 50 ? 'text-amber-600' : 'text-red-600'}`}>
                {scoreGlobal}
              </div>
              <div className="text-xs text-slate-400">/ 100</div>
            </div>
            <div className="flex-1">
              <p className="text-sm text-slate-600 leading-relaxed">
                {niche.description}
              </p>
            </div>
          </div>
        </div>

        {/* Métriques */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-8">
          <MetricItem label="Potentiel" value={niche.potential} max={10} />
          <MetricItem label="Difficulté" value={niche.difficulty} max={10} inverted />
          <MetricItem label="Concurrence" value={niche.competition} max={10} inverted />
          <MetricItem label="Volume" value={analysis.volumeEstime || "N/A"} />
        </div>

        {/* Barres de progression */}
        <div className="bg-slate-50 rounded-xl p-4 mb-8">
          <div className="space-y-4">
            <ProgressBar label="Potentiel de revenus" value={niche.potential} />
            <ProgressBar label="Facilité d'entrée" value={10 - niche.difficulty} />
            <ProgressBar label="Espace disponible" value={10 - niche.competition} />
          </div>
        </div>

        {/* Forces & Vigilance */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Points forts</h3>
            <ul className="space-y-2">
              {(analysis.forces || []).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
              {(!analysis.forces || analysis.forces.length === 0) && (
                <li className="text-sm text-slate-400">Aucune donnée</li>
              )}
            </ul>
          </div>
          <div className="border border-slate-200 rounded-xl p-4">
            <h3 className="text-sm font-semibold text-slate-900 mb-3">Points d'attention</h3>
            <ul className="space-y-2">
              {(analysis.pointsAttention || []).map((item, i) => (
                <li key={i} className="flex items-start gap-2 text-sm text-slate-600">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 mt-1.5 flex-shrink-0" />
                  {item}
                </li>
              ))}
              {(!analysis.pointsAttention || analysis.pointsAttention.length === 0) && (
                <li className="text-sm text-slate-400">Aucune donnée</li>
              )}
            </ul>
          </div>
        </div>

        {/* Recommandations */}
        <div className="border border-slate-200 rounded-xl p-4 mb-8">
          <h3 className="text-sm font-semibold text-slate-900 mb-4">Recommandations</h3>
          
          <div className="space-y-4">
            {analysis.titreOptimise && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Titre suggéré</p>
                <p className="text-sm text-slate-900 font-medium">{analysis.titreOptimise}</p>
              </div>
            )}
            
            {analysis.publicCible && (
              <div>
                <p className="text-xs text-slate-400 mb-1">Cible prioritaire</p>
                <p className="text-sm text-slate-700">{analysis.publicCible}</p>
              </div>
            )}

            {analysis.conseilsDiff && analysis.conseilsDiff.length > 0 && (
              <div>
                <p className="text-xs text-slate-400 mb-2">Conseils</p>
                <ul className="space-y-1.5">
                  {analysis.conseilsDiff.map((conseil, i) => (
                    <li key={i} className="text-sm text-slate-600">• {conseil}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Keywords */}
        {niche.keywords && niche.keywords.length > 0 && (
          <div className="mb-8">
            <p className="text-xs text-slate-400 mb-2">Mots-clés associés</p>
            <div className="flex flex-wrap gap-2">
              {niche.keywords.map((kw, i) => (
                <span key={i} className="px-2.5 py-1 text-xs text-slate-600 bg-slate-100 rounded-md">
                  {kw}
                </span>
              ))}
            </div>
          </div>
        )}

      </div>

      {/* CTA Mobile Fixed */}
      <div className="sm:hidden fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
        <button 
          onClick={handleGenerateEbook}
          className="w-full py-3 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl flex items-center justify-center gap-2 transition-all"
        >
          Créer l'ebook
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

    </div>
  );
}

/* Composants */
function MetricItem({ label, value, max, inverted }) {
  const displayValue = max ? `${value}/${max}` : value;
  return (
    <div className="text-center p-3 bg-slate-50 rounded-lg">
      <div className="text-lg font-semibold text-slate-900">{displayValue}</div>
      <div className="text-xs text-slate-500">{label}</div>
    </div>
  );
}

function ProgressBar({ label, value }) {
  const percentage = (value / 10) * 100;
  return (
    <div>
      <div className="flex justify-between text-xs mb-1.5">
        <span className="text-slate-600">{label}</span>
        <span className="text-slate-900 font-medium">{value}/10</span>
      </div>
      <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
        <div 
          className="h-full bg-slate-900 rounded-full transition-all"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}