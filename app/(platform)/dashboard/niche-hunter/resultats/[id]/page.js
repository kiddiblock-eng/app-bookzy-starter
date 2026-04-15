"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, ChevronRight, Flame, Gem, TrendingUp, Zap, Search } from "lucide-react";

export default function ResultatDetailPage() {
  const params = useParams();
  const router = useRouter();
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetchAnalysis();
  }, []);

  const fetchAnalysis = async () => {
    try {
      const res = await fetch(`/api/niche-hunter/history/${params.id}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);
      setAnalysis(data.data);
    } catch (e) {
      setError(e.message);
    } finally {
      setLoading(false);
    }
  };

  const getBadge = (badge) => {
    if (badge === "gem") return { label: "Pépite cachée", icon: <Gem className="w-3 h-3" />, style: "bg-purple-50 text-purple-700 border-purple-200" };
    if (badge === "trending") return { label: "Tendance montante", icon: <TrendingUp className="w-3 h-3" />, style: "bg-blue-50 text-blue-700 border-blue-200" };
    return { label: "Très demandé", icon: <Flame className="w-3 h-3" />, style: "bg-orange-50 text-orange-700 border-orange-200" };
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-white">
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-2 border-slate-100" />
          <div className="absolute inset-0 rounded-full border-2 border-transparent border-t-slate-900 animate-spin" />
        </div>
      </div>
    );
  }

  if (error || !analysis) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-white px-4">
        <p className="text-slate-900 font-medium mb-2">Erreur</p>
        <p className="text-sm text-slate-500 mb-6">{error || "Analyse introuvable"}</p>
        <button onClick={() => router.back()} className="px-4 py-2 text-sm font-medium text-slate-700 bg-slate-100 rounded-lg">Retour</button>
      </div>
    );
  }

  const formatDate = (date) => new Date(date).toLocaleDateString("fr-FR", {
    day: "numeric", month: "long", year: "numeric"
  });

  return (
    <div className="min-h-screen bg-slate-50 pb-10">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1 min-w-0">
            <p className="text-xs text-slate-400">Résultats du {formatDate(analysis.createdAt)}</p>
            <h1 className="text-sm font-bold text-slate-900 truncate capitalize">{analysis.theme}</h1>
          </div>
          <button
            onClick={() => router.push("/dashboard/niche-hunter")}
            className="hidden sm:flex items-center gap-1 px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-all"
          >
            <Search className="w-3 h-3" /> Nouvelle recherche
          </button>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 py-6">
        {/* Stats */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{analysis.niches?.length || 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">Idées générées</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-emerald-600">{analysis.niches?.filter(n => n.analyzed).length || 0}</p>
            <p className="text-xs text-slate-500 mt-0.5">Analysées</p>
          </div>
          <div className="bg-white border border-slate-200 rounded-xl p-4 text-center">
            <p className="text-2xl font-bold text-slate-900">{analysis.generationTime || "—"}s</p>
            <p className="text-xs text-slate-500 mt-0.5">Temps de génération</p>
          </div>
        </div>

        {/* Niches */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {(analysis.niches || []).map((niche) => {
            const badge = getBadge(niche.badge);
            return (
              <div key={niche.nicheId} className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col hover:border-slate-300 hover:shadow-sm transition-all">
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

                {/* Tendance */}
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
                  <button
                    onClick={() => {
                      const p = new URLSearchParams({ suggestion: niche.title, description: niche.description });
                      router.push(`/dashboard/projets/nouveau?${p.toString()}`);
                    }}
                    className="w-full py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all flex items-center justify-center gap-1"
                  >
                    Créer mon ebook sur ce sujet <ChevronRight className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => router.push(`/dashboard/niche-hunter/analyse/${analysis._id}?nicheId=${niche.nicheId}`)}
                    className={`w-full py-2.5 text-sm font-medium rounded-lg transition-all ${
                      niche.analyzed
                        ? "text-emerald-700 bg-emerald-50 hover:bg-emerald-100"
                        : "text-slate-500 hover:text-slate-700 hover:bg-slate-50"
                    }`}
                  >
                    {niche.analyzed ? "✓ Voir l'analyse" : "Analyser l'idée en profondeur"}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}