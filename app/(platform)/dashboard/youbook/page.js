"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // ✅ Import nécessaire pour la redirection Next.js
import { Youtube, Loader2, AlertCircle, ArrowRight, BookOpen } from "lucide-react";

export default function YoubookPage() {
  // ✅ Hook pour la navigation
  const router = useRouter();
  
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!url || isAnalyzing) return;
    
    // Validation basique de l'URL YouTube
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
        setError("Veuillez entrer un lien YouTube valide.");
        return;
    }
    
    setIsAnalyzing(true);
    setError("");
    setProgress(0);

    // Simulation de la barre de progression (Design demandé)
    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) {
          clearInterval(progressInterval);
          return prev;
        }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      // Appel à notre API backend
      const res = await fetch("/api/content/analyze-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        // ✅ Stockage du résultat et redirection fluide via le router Next.js
        sessionStorage.setItem('youbookResult', JSON.stringify(data.analysis));
        setTimeout(() => {
          router.push('/dashboard/youbook/result');
        }, 500);
      } else {
        setError(data.message || "Impossible d'analyser cette vidéo");
        setIsAnalyzing(false);
        setProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError("Erreur de connexion au serveur");
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && url && !isAnalyzing) {
      handleAnalyze();
    }
  };

  return (
    // ✅ TON DESIGN EXACT : Background dégradé violet/indigo
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-indigo-50/20 to-violet-50/30 p-6 md:p-12 font-sans">
      <div className="max-w-4xl mx-auto">
        
        {/* Header - ✅ TON DESIGN : Logo rouge YouTube avec effet glow */}
        <div className="flex items-center gap-4 mb-12">
          <div className="relative">
            <div className="absolute inset-0 bg-red-500 rounded-2xl blur-lg opacity-20 animate-pulse"></div>
            <div className="relative w-14 h-14 bg-gradient-to-br from-red-600 to-red-500 rounded-2xl flex items-center justify-center shadow-lg shadow-red-500/30">
              <Youtube className="w-7 h-7 text-white" />
            </div>
          </div>
          <div>
            <h1 className="text-3xl font-bold text-slate-900">Youbook Studio</h1>
            <p className="text-sm text-slate-600">De la vidéo au livre en quelques secondes</p>
          </div>
        </div>

        {/* Card principale */}
        <div className="bg-white rounded-3xl border border-slate-200 overflow-hidden shadow-xl shadow-slate-200/50">
          
          {/* ✅ TON DESIGN : Bande dégradée haut de page */}
          <div className="h-1.5 bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600"></div>
          
          <div className="p-8 md:p-10">
            
            <div className="mb-10">
              <h2 className="text-4xl font-bold text-slate-900 mb-4 leading-tight">
                Convertisseur <br/>
                de vidéo YouTube en eBook Pro
              </h2>
              
              <p className="text-lg text-slate-600">
                Ajoutez l'URL d'une vidéo et obtenez un eBook complet avec structure, chapitres et contenu extrait automatiquement.
              </p>
            </div>

            {/* ✅ TON DESIGN : Mini features palette bleu/violet */}
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 bg-indigo-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <Youtube className="w-4 h-4 text-indigo-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">URL vidéo</span>
              </div>
              
              <div className="flex items-center gap-3 p-3 bg-slate-50 rounded-xl border border-slate-100">
                <div className="w-8 h-8 bg-violet-100 rounded-lg flex items-center justify-center flex-shrink-0">
                  <BookOpen className="w-4 h-4 text-violet-600" />
                </div>
                <span className="text-sm font-semibold text-slate-700">eBook généré</span>
              </div>
            </div>

            {/* Input + Button */}
            <div className="space-y-4">
              <div className="relative">
                <input 
                  type="url" 
                  value={url} 
                  onChange={(e) => setUrl(e.target.value)}
                  onKeyPress={handleKeyPress}
                  placeholder="https://www.youtube.com/watch?v=..."
                  disabled={isAnalyzing}
                  className="w-full bg-slate-50 border-2 border-slate-200 rounded-2xl py-4 pl-5 pr-12 focus:outline-none focus:border-indigo-500 focus:bg-white font-medium text-slate-900 placeholder:text-slate-400 transition-all disabled:opacity-50"
                />
                <Youtube className="absolute right-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400" />
              </div>

              {isAnalyzing && (
                <div className="space-y-2">
                  <div className="w-full h-2 bg-slate-100 rounded-full overflow-hidden">
                    {/* ✅ TON DESIGN : Barre de progression dégradée */}
                    <div 
                      className="h-full bg-gradient-to-r from-indigo-600 via-violet-600 to-purple-600 transition-all duration-500 ease-out rounded-full"
                      style={{ width: `${progress}%` }}
                    ></div>
                  </div>
                  <p className="text-xs text-slate-500 font-medium flex items-center justify-center gap-2">
                    <span className="inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full animate-pulse"></span>
                    Conversion en cours... {Math.round(progress)}%
                  </p>
                </div>
              )}

              {/* ✅ TON DESIGN : Bouton foncé dégradé */}
              <button 
                onClick={handleAnalyze}
                disabled={isAnalyzing || !url} 
                className="group w-full py-4 bg-gradient-to-r from-slate-900 via-slate-800 to-slate-900 hover:from-slate-800 hover:to-slate-900 text-white rounded-2xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20 hover:shadow-xl hover:shadow-slate-900/30 hover:scale-[1.01]"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Conversion en cours</span>
                  </>
                ) : (
                  <>
                    <span>Convertir en eBook</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </button>
            </div>

            {error && (
              <div className="mt-5 p-4 bg-red-50 border border-red-100 text-red-700 text-sm rounded-xl flex items-start gap-3">
                <AlertCircle className="w-5 h-5 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-semibold">Erreur de conversion</p>
                  <p className="text-red-600">{error}</p>
                </div>
              </div>
            )}

            {/* ✅ TON DESIGN : Info box avec palette indigo/violet */}
            <div className="mt-8 p-4 bg-gradient-to-r from-indigo-50 to-violet-50 rounded-xl border border-indigo-100">
              <div className="flex items-start gap-3">
                <div className="w-5 h-5 bg-indigo-600 rounded-lg flex items-center justify-center flex-shrink-0 mt-0.5">
                  <BookOpen className="w-3 h-3 text-white" />
                </div>
                <div className="text-sm">
                  <p className="font-semibold text-slate-900 mb-1">Comment ça marche ?</p>
                  <p className="text-slate-600">L'outil analyse le contenu de la vidéo YouTube et génère automatiquement un eBook structuré avec titres, chapitres et sections.</p>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* ✅ TON DESIGN : Footer avec accent violet */}
        <div className="mt-8 text-center">
          <p className="text-xs text-slate-400 flex items-center justify-center gap-2">
            <span className="inline-block w-1.5 h-1.5 bg-indigo-600 rounded-full"></span>
            Conversion automatique • Résultat instantané
          </p>
        </div>

      </div>
    </div>
  );
}