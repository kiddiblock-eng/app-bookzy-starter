"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, ArrowRight, CheckCircle2, Loader2, BookOpen, Users, Target, Zap } from "lucide-react";

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
    <div className="min-h-screen bg-white flex items-center justify-center">
      <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
    </div>
  );

  const audience = typeof result.audience === 'object' 
    ? result.audience 
    : { principal: result.audience || "Grand Public", niveau: "Débutant" };

  return (
    <div className="min-h-screen bg-white pb-24">
      <div className="max-w-3xl mx-auto px-4 py-8">
        
        {/* Back button */}
        <button 
          onClick={() => router.push('/dashboard/youbook')} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6"
        >
          <ArrowLeft className="w-4 h-4" />
          <span className="text-sm font-medium">Nouvelle analyse</span>
        </button>

        {/* Success + Pages */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <CheckCircle2 className="w-5 h-5 text-emerald-600" />
            <span className="text-sm font-medium text-emerald-700">Analyse terminée</span>
          </div>
          {result.pages_estimees && (
            <span className="text-sm text-slate-500">~{result.pages_estimees} pages estimées</span>
          )}
        </div>

        {/* Title */}
        <h1 className="text-2xl font-bold text-slate-900 mb-2">
          {result.titre}
        </h1>

        {/* Hook */}
        {result.hook && (
          <p className="text-lg text-slate-600 mb-6">
            {result.hook}
          </p>
        )}

        {/* Description */}
        <p className="text-slate-600 leading-relaxed mb-8">
          {result.description}
        </p>

        {/* Problème & Transformation */}
        {(result.probleme || result.transformation) && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
            {result.probleme && (
              <div className="p-4 bg-red-50 border border-red-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Target className="w-4 h-4 text-red-600" />
                  <p className="text-xs font-semibold text-red-600 uppercase">Problème résolu</p>
                </div>
                <p className="text-sm text-slate-700">{result.probleme}</p>
              </div>
            )}
            {result.transformation && (
              <div className="p-4 bg-emerald-50 border border-emerald-100 rounded-xl">
                <div className="flex items-center gap-2 mb-2">
                  <Zap className="w-4 h-4 text-emerald-600" />
                  <p className="text-xs font-semibold text-emerald-600 uppercase">Transformation</p>
                </div>
                <p className="text-sm text-slate-700">{result.transformation}</p>
              </div>
            )}
          </div>
        )}

        {/* Audience */}
        <div className="flex items-center gap-4 mb-8 p-4 bg-slate-50 rounded-xl">
          <Users className="w-5 h-5 text-slate-500" />
          <div>
            <p className="text-sm font-medium text-slate-900">{audience.principal}</p>
            <p className="text-xs text-slate-500">Niveau : {audience.niveau}</p>
          </div>
        </div>

        {/* Sommaire */}
        {result.sommaire && result.sommaire.length > 0 && (
          <div className="mb-8">
            <div className="flex items-center gap-2 mb-4">
              <BookOpen className="w-5 h-5 text-slate-700" />
              <p className="font-semibold text-slate-900">Sommaire suggéré</p>
            </div>
            <div className="space-y-2">
              {result.sommaire.map((chapitre, idx) => (
                <div key={idx} className="flex gap-3 p-3 bg-slate-50 rounded-lg">
                  <span className="text-sm font-bold text-slate-400 w-6">{idx + 1}.</span>
                  <p className="text-sm text-slate-700">{chapitre.replace(/^Chapitre \d+:\s*/i, '')}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Key insights */}
        {result.key_insights && result.key_insights.length > 0 && (
          <div className="mb-8">
            <p className="font-semibold text-slate-900 mb-3">Points clés</p>
            <div className="space-y-2">
              {result.key_insights.map((insight, idx) => (
                <div key={idx} className="flex gap-3 p-3 border border-slate-200 rounded-lg">
                  <span className="text-sm">💡</span>
                  <p className="text-sm text-slate-700">{insight}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Verbatim */}
        {result.verbatim && (
          <div className="mb-8 p-5 bg-slate-900 rounded-xl">
            <p className="text-xs text-slate-500 mb-2">Citation clé</p>
            <p className="text-white text-lg italic leading-relaxed">
              "{result.verbatim}"
            </p>
          </div>
        )}

        {/* Metadata */}
        <div className="flex items-center gap-4 text-sm text-slate-500 mb-8">
          <span>Ton : {result.tone}</span>
          {result.pages_estimees && (
            <>
              <span>•</span>
              <span>{result.pages_estimees} pages</span>
            </>
          )}
        </div>

        {/* CTA Fixed */}
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-200">
          <div className="max-w-3xl mx-auto">
            <button
              onClick={handleGenerateEbook}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-medium rounded-xl transition-colors flex items-center justify-center gap-2"
            >
              Générer l'ebook
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}