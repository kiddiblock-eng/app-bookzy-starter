"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Youtube, Loader2, AlertCircle, ArrowRight } from "lucide-react";

export default function YoubookPage() {
  const router = useRouter();
  
  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [progress, setProgress] = useState(0);

  const handleAnalyze = async () => {
    if (!url || isAnalyzing) return;
    
    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      setError("Veuillez entrer un lien YouTube valide.");
      return;
    }
    
    setIsAnalyzing(true);
    setError("");
    setProgress(0);

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
      const res = await fetch("/api/content/analyze-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      
      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
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

  const suggestions = [
    "Formation",
    "Interview", 
    "Podcast",
    "Conférence",
    "Tutoriel"
  ];

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-xl mx-auto px-4 py-20">
        
        {/* Logo centré */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-600 rounded-2xl mb-4">
            <Youtube className="w-8 h-8 text-white" />
          </div>
          <h1 className="text-2xl font-bold text-slate-900 mb-2">
            Youbook
          </h1>
          <p className="text-slate-500">
            Transforme n'importe quelle vidéo YouTube en ebook structuré
          </p>
        </div>

        {/* Input centré */}
        <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }} className="mb-6">
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="https://www.youtube.com/watch?v=..."
            disabled={isAnalyzing}
            className="w-full px-5 py-4 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-transparent transition-all text-center disabled:opacity-50"
          />
        </form>

        {/* Progress */}
        {isAnalyzing && (
          <div className="space-y-2 mb-6">
            <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div 
                className="h-full bg-slate-900 rounded-full transition-all duration-500"
                style={{ width: `${progress}%` }}
              />
            </div>
            <p className="text-xs text-slate-500 text-center">
              Conversion en cours... {Math.round(progress)}%
            </p>
          </div>
        )}

        {/* Bouton */}
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !url}
          className="w-full py-4 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white rounded-xl font-medium transition-all flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <>
              <Loader2 className="w-5 h-5 animate-spin" />
              Conversion en cours...
            </>
          ) : (
            <>
              Convertir en ebook
              <ArrowRight className="w-5 h-5" />
            </>
          )}
        </button>

        {/* Suggestions */}
        <div className="flex flex-wrap justify-center gap-2 mt-6">
          {suggestions.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1.5 text-sm bg-slate-100 text-slate-600 rounded-lg"
            >
              {tag}
            </span>
          ))}
        </div>

        {/* Error */}
        {error && (
          <div className="mt-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm font-medium text-red-900">Erreur</p>
              <p className="text-sm text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Comment ça marche */}
        <div className="mt-12 pt-8 border-t border-slate-100">
          <h2 className="text-sm font-semibold text-slate-900 mb-4 text-center">
            Comment ça marche
          </h2>
          <div className="grid grid-cols-3 gap-4">
            <Step number="1" text="Colle le lien YouTube" />
            <Step number="2" text="L'IA analyse le contenu" />
            <Step number="3" text="Obtiens ton ebook" />
          </div>
        </div>

      </div>
    </div>
  );
}

function Step({ number, text }) {
  return (
    <div className="text-center">
      <div className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-2">
        <span className="text-sm font-bold text-slate-600">{number}</span>
      </div>
      <p className="text-xs text-slate-600">{text}</p>
    </div>
  );
}