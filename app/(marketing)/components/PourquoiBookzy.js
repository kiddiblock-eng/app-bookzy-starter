"use client";

import { Check, X, Clock, Palette, FileText, TrendingUp } from "lucide-react";

export default function Comparison() {
  const comparisons = [
    { label: "Temps de création", old: "2-3 semaines", bookzy: "60 secondes" },
    { label: "Design PDF", old: "À faire soi-même(1 semaine)", bookzy: "Automatique" },
    { label: "Cover 3D", old: "Payer un designer", bookzy: "Incluse" },
    { label: "Textes marketing", old: "Rédiger soi-même", bookzy: "Générés par IA" },
    { label: "Coût total", old: "200 000+ FCFA", bookzy: "2 000 FCFA" },
    { label: "Compétences requises", old: "Design + Rédaction", bookzy: "Aucune" },
  ];

  const reasons = [
    {
      icon: Clock,
      title: "60 secondes",
      description: "Un ebook complet généré en moins d'une minute.",
    },
    {
      icon: Palette,
      title: "Design pro",
      description: "PDF formaté, cover 3D, mise en page premium.",
    },
    {
      icon: FileText,
      title: "Prêt à vendre",
      description: "Textes marketing et posts réseaux sociaux inclus.",
    },
    {
      icon: TrendingUp,
      title: "2 000 FCFA",
      description: "Pas d'abonnement. Payez uniquement à l'usage.",
    },
  ];

  return (
    <section className="bg-white py-16 lg:py-24">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12 lg:mb-16">
          <p className="text-blue-600 text-sm font-semibold tracking-wide uppercase mb-4">
            Pourquoi Bookzy
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            La différence est claire
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-lg mx-auto">
            Comparez par vous-même.
          </p>
        </div>

        {/* Comparison table */}
        <div className="bg-slate-50 rounded-2xl overflow-hidden border border-slate-200 mb-16">
          
          {/* Header row */}
          <div className="grid grid-cols-3 border-b border-slate-200">
            <div className="p-4 sm:p-5"></div>
            <div className="p-4 sm:p-5 text-center border-l border-slate-200 bg-slate-100">
              <span className="text-sm font-medium text-slate-500">Traditionnel</span>
            </div>
            <div className="p-4 sm:p-5 text-center border-l border-slate-200 bg-blue-600">
              <span className="text-sm font-bold text-white">Bookzy</span>
            </div>
          </div>

          {/* Comparison rows */}
          {comparisons.map((item, index) => (
            <div 
              key={index}
              className={`grid grid-cols-3 ${index !== comparisons.length - 1 ? 'border-b border-slate-200' : ''}`}
            >
              {/* Label */}
              <div className="p-4 sm:p-5 flex items-center bg-white">
                <span className="text-sm font-medium text-slate-700">{item.label}</span>
              </div>

              {/* Old way */}
              <div className="p-4 sm:p-5 flex items-center justify-center border-l border-slate-200 bg-slate-50">
                <div className="flex items-center gap-2">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0" />
                  <span className="text-sm text-slate-500">{item.old}</span>
                </div>
              </div>

              {/* Bookzy */}
              <div className="p-4 sm:p-5 flex items-center justify-center border-l border-slate-200 bg-blue-50">
                <div className="flex items-center gap-2">
                  <Check className="w-4 h-4 text-blue-600 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-900">{item.bookzy}</span>
                </div>
              </div>
            </div>
          ))}

        </div>

        

      </div>
    </section>
  );
}