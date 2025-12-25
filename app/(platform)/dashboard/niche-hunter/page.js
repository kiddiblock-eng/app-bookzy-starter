"use client";

import { useState } from "react";
import { 
  Target, 
  Search, 
  Sparkles, 
  ArrowRight,
  Zap,
  Award,
  Loader2,
  AlertTriangle,
  TrendingUp,
  BarChart3,
  Filter
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function NicheHunterPage() {
  const router = useRouter();
  const [theme, setTheme] = useState("");
  const [loading, setLoading] = useState(false);
  const [niches, setNiches] = useState([]);
  const [analysisId, setAnalysisId] = useState(null);
  const [error, setError] = useState("");
  const [hasSearched, setHasSearched] = useState(false);

  const handleSearch = async (e) => {
    e.preventDefault();
    
    if (!theme.trim()) {
      setError("Veuillez entrer un thème");
      return;
    }

    setLoading(true);
    setError("");
    // On garde les anciennes niches si on veut, ou on vide. Ici on vide pour l'effet de chargement.
    setNiches([]); 
    setHasSearched(true);

    try {
      const res = await fetch("/api/niche-hunter/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ theme: theme.trim() })
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

  const getDifficultyColor = (score) => {
    if (score <= 3) return "bg-emerald-500";
    if (score <= 6) return "bg-amber-500";
    return "bg-rose-500";
  };

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- HEADER / HERO SECTION --- */}
      {/* Si pas de recherche : Centré au milieu. Si recherche faite : Fixé en haut */}
      <div className={`transition-all duration-500 ease-in-out ${
        hasSearched 
          ? "bg-white border-b border-slate-200 py-4 shadow-sm sticky top-0 z-50" 
          : "min-h-[60vh] flex flex-col items-center justify-center px-4"
      }`}>
        
        <div className={`w-full transition-all duration-500 ${
          hasSearched ? "max-w-7xl mx-auto px-4 sm:px-6 flex items-center gap-4" : "max-w-2xl mx-auto text-center"
        }`}>
          
          {/* Logo & Titre (Disparaît ou se réduit après recherche) */}
          {!hasSearched && (
            <div className="mb-8 animate-fade-in-up">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-gradient-to-br from-indigo-600 to-violet-600 mb-6 shadow-xl shadow-indigo-200">
                <Target className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-4xl md:text-5xl font-extrabold text-slate-900 mb-4 tracking-tight">
                Niche Hunter <span className="text-indigo-600">AI</span>
              </h1>
              <p className="text-lg text-slate-500">
                Un mot-clé suffit pour découvrir des idées d'ebooks qui se vendent.
              </p>
            </div>
          )}

          {/* Logo version Header (Visible seulement après recherche) */}
          {hasSearched && (
            <div className="hidden md:flex items-center gap-2 mr-4">
               <div className="w-8 h-8 rounded-lg bg-indigo-600 flex items-center justify-center">
                  <Target className="w-5 h-5 text-white" />
               </div>
               <span className="font-bold text-lg hidden lg:block">Hunter</span>
            </div>
          )}

          {/* BARRE DE RECHERCHE */}
          <form onSubmit={handleSearch} className={`relative flex-1 ${!hasSearched ? "w-full" : ""}`}>
            <div className="relative group">
              <div className={`absolute -inset-0.5 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-2xl blur opacity-20 group-hover:opacity-40 transition duration-200 ${hasSearched ? 'hidden' : ''}`}></div>
              <div className="relative flex items-center">
                <Search className={`absolute left-4 w-5 h-5 text-slate-400 ${hasSearched ? 'w-4 h-4' : ''}`} />
                <input
                  type="text"
                  value={theme}
                  onChange={(e) => setTheme(e.target.value)}
                  placeholder={hasSearched ? "Nouvelle recherche..." : "Entrez un mot-clé ou une niche (ex : freelance, crypto, Business…) "}
                  className={`w-full pl-12 pr-14 bg-white border border-slate-200 focus:border-indigo-500 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-4 focus:ring-indigo-500/10 transition-all ${
                    hasSearched 
                      ? "py-2.5 rounded-xl text-sm" 
                      : "py-5 rounded-2xl text-lg shadow-xl"
                  }`}
                  disabled={loading}
                />
                <button
                  type="submit"
                  disabled={loading || !theme.trim()}
                  className={`absolute right-2 bg-indigo-600 hover:bg-indigo-700 disabled:bg-slate-300 text-white flex items-center justify-center transition-all disabled:cursor-not-allowed ${
                    hasSearched 
                      ? "w-8 h-8 rounded-lg" 
                      : "w-12 h-12 rounded-xl"
                  }`}
                >
                  {loading ? <Loader2 className="w-5 h-5 animate-spin" /> : <ArrowRight className="w-5 h-5" />}
                </button>
              </div>
            </div>
          </form>

          {/* Exemples (Visibles seulement si pas de recherche) */}
          {!hasSearched && (
            <div className="mt-8 flex flex-wrap justify-center gap-2 text-sm">
              <span className="text-slate-400 mr-2">Essayez :</span>
              {["Dropshipping", "Coaching", "SaaS B2B", "Jardinage"].map((tag) => (
                <button
                  key={tag}
                  onClick={() => setTheme(tag)}
                  className="px-3 py-1 bg-white border border-slate-200 rounded-full text-slate-600 hover:border-indigo-300 hover:text-indigo-600 transition-colors"
                >
                  {tag}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* --- RÉSULTATS SECTION --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {loading && (
          <div className="flex flex-col items-center justify-center py-20">
            <Loader2 className="w-12 h-12 text-indigo-600 animate-spin mb-4" />
            <h3 className="text-xl font-semibold text-slate-900">Analyse du marché en cours...</h3>
            <p className="text-slate-500">Notre IA scanne les tendances pour "{theme}"</p>
          </div>
        )}

        {error && (
          <div className="max-w-2xl mx-auto bg-red-50 border border-red-200 rounded-xl p-4 flex items-center gap-3 text-red-700">
            <AlertTriangle className="w-5 h-5" />
            {error}
          </div>
        )}

        {/* AFFICHAGE GRILLE */}
        {niches.length > 0 && !loading && (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
                <Sparkles className="w-6 h-6 text-indigo-500" />
                {niches.length} Opportunités trouvées
              </h2>
              {/* Fake Filter Button for UI richness */}
              <button className="hidden sm:flex items-center gap-2 px-4 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-600 hover:bg-slate-50">
                <Filter className="w-4 h-4" /> Filtres
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {niches.map((niche, index) => (
                <NicheCardV2
                  key={niche.nicheId}
                  niche={niche}
                  index={index}
                  analysisId={analysisId}
                  getDifficultyColor={getDifficultyColor}
                  router={router}
                />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

/* --- NOUVEAU DESIGN DE CARTE AVEC 2 BOUTONS CTA --- */
function NicheCardV2({ niche, index, analysisId, getDifficultyColor, router }) {
  const handleAnalyze = () => {
    router.push(`/dashboard/niche-hunter/analyse/${analysisId}?nicheId=${niche.nicheId}`);
  };

  const handleGenerate = () => {
    const params = new URLSearchParams({
      suggestion: niche.title,
      description: niche.description
    });
    router.push(`/dashboard/projets/nouveau?${params.toString()}`);
  };

  return (
    <div className="group bg-white rounded-2xl border border-slate-200 p-5 hover:shadow-xl hover:border-indigo-300 transition-all duration-300 flex flex-col h-full">
      
      {/* En-tête Carte */}
      <div className="flex justify-between items-start mb-4">
        <div className="bg-indigo-50 text-indigo-700 px-2.5 py-1 rounded-lg text-xs font-bold uppercase tracking-wide">
          Niche #{index + 1}
        </div>
        {/* Score Badge */}
        <div className="flex items-center gap-1 bg-slate-50 border border-slate-100 px-2 py-1 rounded-lg">
            <Award className="w-3.5 h-3.5 text-amber-500" />
            <span className="text-xs font-bold text-slate-700">{niche.potential}/10</span>
        </div>
      </div>

      {/* Titre & Description */}
      <div className="mb-6 flex-1">
        <h3 className="text-xl font-bold text-slate-900 mb-2 group-hover:text-indigo-600 transition-colors line-clamp-2">
          {niche.title}
        </h3>
        <p className="text-sm text-slate-500 line-clamp-3 leading-relaxed">
          {niche.description}
        </p>
      </div>

      {/* Métriques Visuelles (Barres) */}
      <div className="space-y-3 mb-6 bg-slate-50 p-3 rounded-xl border border-slate-100">
        
        {/* Difficulté */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Difficulté</span>
            <span className="text-slate-700 font-bold">{niche.difficulty}/10</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
                className={`h-full rounded-full ${getDifficultyColor(niche.difficulty)}`} 
                style={{ width: `${niche.difficulty * 10}%` }}
            ></div>
          </div>
        </div>

        {/* Concurrence */}
        <div>
          <div className="flex justify-between text-xs mb-1">
            <span className="text-slate-500 font-medium">Concurrence</span>
            <span className="text-slate-700 font-bold">{niche.competition}/10</span>
          </div>
          <div className="h-1.5 w-full bg-slate-200 rounded-full overflow-hidden">
            <div 
                className="h-full bg-blue-500 rounded-full" 
                style={{ width: `${niche.competition * 10}%` }}
            ></div>
          </div>
        </div>
      </div>

      {/* Mots clés (Tags) */}
      <div className="flex flex-wrap gap-2 mb-5">
        {niche.keywords.slice(0, 3).map((keyword, i) => (
          <span key={i} className="text-xs font-medium px-2.5 py-1 bg-white border border-slate-200 text-slate-600 rounded-md">
            #{keyword}
          </span>
        ))}
        {niche.keywords.length > 3 && (
            <span className="text-xs font-medium px-2 py-1 text-slate-400">+{niche.keywords.length - 3}</span>
        )}
      </div>

      {/* ✅ 2 BOUTONS CTA COMPACTS SUR MÊME LIGNE */}
      <div className="grid grid-cols-2 gap-2">
        <button
          onClick={handleAnalyze}
          className="py-3 rounded-xl bg-slate-900 text-white font-semibold text-sm hover:bg-indigo-600 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 group-hover:translate-y-[-2px]"
        >
          <Zap className="w-4 h-4" />
          Analyser
        </button>
        
        <button
          onClick={handleGenerate}
          className="py-3 rounded-xl bg-indigo-600 text-white font-semibold text-sm hover:bg-indigo-700 hover:shadow-lg hover:shadow-indigo-500/30 transition-all duration-300 flex items-center justify-center gap-2 group-hover:translate-y-[-2px]"
        >
          <Sparkles className="w-4 h-4" />
          Générer
        </button>
      </div>

    </div>
  );
}