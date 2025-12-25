"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Sparkles, ArrowRight, FileText, CheckCircle2, 
  ArrowLeft, Target, Zap, Youtube, Users, Mic, TrendingUp
} from "lucide-react";

export default function YoubookResultPage() {
  const router = useRouter();
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const stored = sessionStorage.getItem('youbookResult');
    if (stored) {
      setResult(JSON.parse(stored));
      setLoading(false);
    } else { 
      router.push('/dashboard/youbook'); 
    }
  }, [router]);

  const handleGenerateEbook = () => {
    if (!result) return;
    
    const params = new URLSearchParams({
      suggestion: result.titre,
      description: result.description,
    });

    router.push(`/dashboard/projets/nouveau?${params.toString()}`);
  };

  if (loading) return (
    <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center">
        <div className="w-16 h-16 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin mb-4" />
        <h3 className="text-sm font-bold text-slate-600">Chargement...</h3>
    </div>
  );

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">

       <div className="max-w-4xl mx-auto px-4 sm:px-6 py-12 space-y-8">
          
          {/* BOUTON RETOUR EN HAUT */}
          <button 
            onClick={() => router.push('/dashboard/youbook')} 
            className="flex items-center gap-2 text-slate-600 hover:text-slate-900 transition-colors group mb-8"
          >
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
            <span className="text-sm font-bold">Nouvelle analyse</span>
          </button>
          
          {/* HEADER SUCCESS */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-50 border border-emerald-200 rounded-full mb-6">
              <CheckCircle2 className="w-5 h-5 text-emerald-600" />
              <span className="text-sm font-bold text-emerald-900">Analyse terminée</span>
            </div>
            
            <h1 className="text-3xl md:text-4xl font-black text-slate-900 mb-4 tracking-tight">
              Votre concept d'eBook est prêt
            </h1>
            <p className="text-slate-600">
              L'IA a analysé la transcription et généré un titre accrocheur avec une description optimisée.
            </p>
          </div>

          {/* CARTE TITRE + DESCRIPTION */}
          <div className="bg-white rounded-2xl border border-slate-200 shadow-lg overflow-hidden">
            
            {/* TITRE */}
            <div className="p-8 border-b border-slate-100 bg-gradient-to-br from-indigo-50 to-violet-50">
              <label className="block text-xs font-bold text-indigo-600 uppercase mb-3 flex items-center gap-2">
                <Target className="w-4 h-4" />
                Titre suggéré
              </label>
              <h2 className="text-2xl md:text-3xl font-black text-slate-900 leading-tight">
                {result.titre}
              </h2>
            </div>

            {/* DESCRIPTION */}
            <div className="p-8 border-b border-slate-100">
              <label className="block text-xs font-bold text-slate-400 uppercase mb-3 flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Description optimisée
              </label>
              <p className="text-lg text-slate-700 leading-relaxed">
                {result.description}
              </p>
            </div>

            {/* MÉTADONNÉES */}
            <div className="p-8 bg-slate-50">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
                
                {/* TON */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center">
                      <Mic className="w-5 h-5 text-indigo-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Ton recommandé</div>
                      <div className="text-sm font-black text-slate-900">{result.tone || "Professionnel"}</div>
                    </div>
                  </div>
                </div>

                {/* AUDIENCE */}
                <div className="bg-white p-5 rounded-xl border border-slate-200">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-violet-100 rounded-lg flex items-center justify-center">
                      <Users className="w-5 h-5 text-violet-600" />
                    </div>
                    <div>
                      <div className="text-xs font-bold text-slate-400 uppercase">Audience cible</div>
                      <div className="text-sm font-black text-slate-900">{result.audience || "Débutants"}</div>
                    </div>
                  </div>
                </div>
              </div>

              {/* CTA */}
              <button
                onClick={handleGenerateEbook}
                className="w-full py-4 bg-slate-900 hover:bg-indigo-600 text-white font-bold rounded-xl transition-all duration-300 flex items-center justify-center gap-2 shadow-lg hover:shadow-xl group"
              >
                <Zap className="w-5 h-5" />
                Générer l'eBook maintenant
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
          </div>

          {/* KEY INSIGHTS */}
          {result.key_insights && result.key_insights.length > 0 && (
            <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 bg-emerald-100 rounded-lg flex items-center justify-center">
                  <TrendingUp className="w-5 h-5 text-emerald-600" />
                </div>
                <h3 className="text-lg font-black text-slate-900">Points clés extraits</h3>
              </div>
              
              <div className="space-y-3">
                {result.key_insights.map((insight, idx) => (
                  <div key={idx} className="flex gap-3 p-4 bg-slate-50 rounded-xl border border-slate-100">
                    <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold flex-shrink-0 mt-0.5">
                      {idx + 1}
                    </div>
                    <p className="text-sm text-slate-700 leading-relaxed">{insight}</p>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* VERBATIM (CITATION) */}
          {result.verbatim && (
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 rounded-2xl p-8 text-white shadow-xl">
              <label className="text-xs font-bold text-indigo-400 uppercase mb-4 block">
                Citation clé de la vidéo
              </label>
              <p className="text-xl md:text-2xl font-serif italic leading-relaxed">
                "{result.verbatim}"
              </p>
            </div>
          )}

          {/* INFO BOTTOM */}
          <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-6">
            <div className="flex items-start gap-3">
              <Sparkles className="w-5 h-5 text-indigo-600 mt-0.5 flex-shrink-0" />
              <div>
                <h4 className="text-sm font-bold text-indigo-900 mb-2">Prochaine étape</h4>
                <p className="text-sm text-indigo-700 leading-relaxed">
                  Cliquez sur "Générer l'eBook" pour être redirigé vers le formulaire de création. 
                  Le titre et la description seront automatiquement pré-remplis.
                </p>
              </div>
            </div>
          </div>

       </div>
    </div>
  );
}