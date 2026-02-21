"use client";

import { useState } from "react";
import { Search, ArrowRight, Loader2, Globe, Target, ChevronRight } from "lucide-react";
import { useRouter } from "next/navigation";

export default function NicheHunterPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("");
  const [targetMarket, setTargetMarket] = useState("africa");
  const [loading, setLoading] = useState(false);
  const [niches, setNiches] = useState([]);
  const [analysisId, setAnalysisId] = useState(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    
    if (!theme.trim()) {
      setError("Veuillez entrer un thème");
      return;
    }

    setLoading(true);
    setError("");
    setNiches([]); 
    setHasSearched(true);

    try {
      const res = await fetch("/api/niche-hunter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ 
          theme: theme.trim(),
          targetMarket
        })
      });

      const data = await res.json();

      if (!res.ok || !data.success) {
        throw new Error(data.message || "Erreur lors de la génération");
      }

      setNiches(data.data.niches);
      setAnalysisId(data.data.id);

    } catch (err) {
      console.error("Erreur:", err);
      setError(err.message || "Une erreur est survenue lors de l'analyse.");
      setNiches([]);
    } finally {
      setLoading(false);
    }
  };

  const suggestions = ["Dropshipping", "Coaching", "Crypto", "Fitness", "Cuisine"];

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER - Seulement visible après recherche */}
      {hasSearched && (
        <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
          <div className="max-w-5xl mx-auto px-4 py-3">
            <form onSubmit={handleSearch} className="flex items-center gap-3">
              <div className="flex-1 relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder="Nouvelle recherche..."
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
                  disabled={loading}
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setTargetMarket(targetMarket === "africa" ? "international" : "africa")}
                  className="px-3 py-2.5 bg-slate-100 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-200 transition-all flex items-center gap-2"
                >
                  {targetMarket === "africa" ? <Target className="w-4 h-4" /> : <Globe className="w-4 h-4" />}
                  {targetMarket === "africa" ? "Afrique" : "International"}
                </button>
                <button
                  type="submit"
                  disabled={loading || !theme.trim()}
                  className="px-4 py-2.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 text-white rounded-lg text-sm font-medium transition-all"
                >
                  {loading ? <Loader2 className="w-4 h-4 animate-spin" /> : "Rechercher"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* ÉTAT INITIAL - Centré */}
      {!hasSearched && (
        <div className="max-w-xl mx-auto px-4 py-20">
          
          {/* Logo centré */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-slate-900 rounded-2xl mb-4">
              <Search className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Niche Hunter
            </h1>
            <p className="text-slate-500">
              Trouve des idées d'ebooks rentables en quelques secondes
            </p>
          </div>

          {/* Recherche centrée */}
          <form onSubmit={handleSearch} className="mb-6">
            <input
              type="text"
              value={theme}
              onChange={(e) => setTheme(e.target.value)}
              placeholder="Ex: freelance, crypto, immobilier..."
              className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-center"
              disabled={loading}
            />
          </form>

          {/* Sélecteur marché */}
          <div className="flex gap-3 mb-6">
            <button
              type="button"
              onClick={() => setTargetMarket("africa")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                targetMarket === "africa"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Target className="w-4 h-4" />
              Afrique 
            </button>
            <button
              type="button"
              onClick={() => setTargetMarket("international")}
              className={`flex-1 flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-medium transition-all ${
                targetMarket === "international"
                  ? "bg-slate-900 text-white"
                  : "bg-slate-100 text-slate-600 hover:bg-slate-200"
              }`}
            >
              <Globe className="w-4 h-4" />
              International
            </button>
          </div>

          {/* Bouton recherche */}
          <button
            type="button"
            onClick={handleSearch}
            disabled={loading || !theme.trim()}
            className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
          >
            {loading ? (
              <>
                <Loader2 className="w-5 h-5 animate-spin" />
                Analyse en cours...
              </>
            ) : (
              <>
                Analyser
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Suggestions */}
          <div className="flex flex-wrap justify-center gap-2 mt-6">
            {suggestions.map((tag) => (
              <button
                key={tag}
                onClick={() => setTheme(tag)}
                className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 hover:bg-slate-200 rounded-lg transition-all"
              >
                {tag}
              </button>
            ))}
          </div>

          {/* Niches populaires */}
          <div className="mt-12 pt-8 border-t border-slate-100">
            <h2 className="text-sm font-semibold text-slate-900 mb-4 text-center">
              Niches populaires
            </h2>
            <div className="grid grid-cols-2 gap-2">
              {[
                { title: "Business en ligne", searches: "2.4K" },
                { title: "Dropservicing", searches: "1.8K" },
                { title: "Immobilier", searches: "3.1K" },
                { title: "Marketing digital", searches: "2.9K" },
              ].map((item, i) => (
                <button
                  key={i}
                  onClick={() => setTheme(item.title)}
                  className="flex items-center justify-between p-3 bg-slate-50 hover:bg-slate-100 rounded-lg transition-all text-left"
                >
                  <span className="text-sm text-slate-700 font-medium">{item.title}</span>
                  <span className="text-xs text-slate-400">{item.searches}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Erreur */}
          {error && (
            <div className="mt-6 bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm text-center">
              {error}
            </div>
          )}
        </div>
      )}

      {/* RÉSULTATS */}
      {hasSearched && (
        <div className="max-w-5xl mx-auto px-4 py-8">
          
          {/* Loading */}
          {loading && (
            <div className="flex flex-col items-center justify-center py-20">
              <Loader2 className="w-8 h-8 text-slate-400 animate-spin mb-4" />
              <p className="text-slate-500">Analyse en cours pour "{theme}"...</p>
            </div>
          )}

          {/* Erreur */}
          {error && !loading && (
            <div className="max-w-md mx-auto bg-red-50 border border-red-200 rounded-lg p-4 text-red-700 text-sm">
              {error}
            </div>
          )}

          {/* Résultats */}
          {niches.length > 0 && !loading && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <p className="text-sm text-slate-500">
                  <span className="font-semibold text-slate-900">{niches.length}</span> opportunités pour "{theme}"
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {niches.map((niche) => (
                  <NicheCard
                    key={niche.nicheId}
                    niche={niche}
                    analysisId={analysisId}
                    router={router}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

/* NICHE CARD - Avec barres de progression */
function NicheCard({ niche, analysisId, router }) {
  
  const handleGenerate = () => {
    const params = new URLSearchParams({
      suggestion: niche.title,
      description: niche.description
    });
    router.push(`/dashboard/projets/nouveau?${params.toString()}`);
  };

  const handleAnalyze = () => {
    router.push(`/dashboard/niche-hunter/analyse/${analysisId}?nicheId=${niche.nicheId}`);
  };

  const getBarColor = (value, type) => {
    if (type === "potential") return "bg-slate-900";
    if (type === "difficulty") {
      if (value <= 3) return "bg-emerald-500";
      if (value <= 6) return "bg-amber-500";
      return "bg-red-500";
    }
    return "bg-slate-400";
  };

  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 hover:border-slate-300 hover:shadow-sm transition-all">
      
      {/* Header */}
      <div className="flex items-start justify-between mb-3">
        <span className="text-xs font-medium text-slate-400">
          Potentiel {niche.potential}/10
        </span>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-900 mb-2 line-clamp-2">
        {niche.title}
      </h3>

      {/* Description */}
      <p className="text-sm text-slate-500 line-clamp-2 mb-4">
        {niche.description}
      </p>

      {/* Stats avec barres */}
      <div className="space-y-3 mb-4">
        
        {/* Potentiel */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Potentiel</span>
            <span className="text-slate-700 font-medium">{niche.potential}/10</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getBarColor(niche.potential, "potential")}`}
              style={{ width: `${niche.potential * 10}%` }}
            />
          </div>
        </div>

        {/* Difficulté */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Difficulté</span>
            <span className="text-slate-700 font-medium">{niche.difficulty}/10</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className={`h-full rounded-full ${getBarColor(niche.difficulty, "difficulty")}`}
              style={{ width: `${niche.difficulty * 10}%` }}
            />
          </div>
        </div>

        {/* Concurrence */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500">Concurrence</span>
            <span className="text-slate-700 font-medium">{niche.competition}/10</span>
          </div>
          <div className="h-1.5 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full rounded-full bg-slate-400"
              style={{ width: `${niche.competition * 10}%` }}
            />
          </div>
        </div>
      </div>

      {/* Keywords */}
      {niche.keywords && niche.keywords.length > 0 && (
        <div className="flex flex-wrap gap-1.5 mb-4">
          {niche.keywords.slice(0, 3).map((keyword, i) => (
            <span key={i} className="text-xs px-2 py-1 bg-slate-50 text-slate-500 rounded">
              {keyword}
            </span>
          ))}
        </div>
      )}

      {/* Actions */}
      <div className="flex gap-2">
        <button
          onClick={handleAnalyze}
          className="flex-1 py-2.5 text-sm font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-all"
        >
          Analyser
        </button>
        <button
          onClick={handleGenerate}
          className="flex-1 py-2.5 text-sm font-medium text-white bg-slate-900 hover:bg-slate-800 rounded-lg transition-all flex items-center justify-center gap-1"
        >
          Créer
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}