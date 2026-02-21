"use client";

import { useState, useEffect } from "react";
import { X, FileText, Palette, MessageSquare } from "lucide-react";

const examples = [
  {
    id: 1,
    title: "TikTok sans visage",
    category: "Business",
    cover: "/1.png",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1766663881/bookzy/ebooks/tiktok-sans-visage-monetisez-votre-compte-avec-lia-guide-debutant-694d26256694fe.pdf",
  },
  {
    id: 2,
    title: "E-commerce Afrique",
    category: "Formation",
    cover: "/2.png",
    pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1766670419/bookzy/ebooks/e-commerce-afrique-le-guide-ultime-pour-lancer-et-generer-des-profits-a-partir-d.pdf",
  },
];

export default function Examples() {
  const [selectedPdf, setSelectedPdf] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    if (selectedPdf) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedPdf]);

  const openPdf = (example) => {
    setSelectedPdf(example);
    setIsLoading(true);
  };

  return (
    <section id="examples" className="bg-white py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <p className="text-blue-600 text-sm font-semibold tracking-wide uppercase mb-4">
            Exemples
          </p>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight mb-4">
            Générés avec Bookzy
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-lg mx-auto">
            De vrais ebooks créés par notre IA. Cliquez pour voir le PDF complet.
          </p>
        </div>

        {/* 2 Examples */}
        <div className="grid grid-cols-2 gap-4 sm:gap-8 max-w-2xl mx-auto mb-16">
          {examples.map((example) => (
            <button
              key={example.id}
              onClick={() => openPdf(example)}
              className="group text-left"
            >
              {/* Cover image */}
              <div className="aspect-[3/4] bg-slate-100 rounded-xl sm:rounded-2xl overflow-hidden mb-3 border border-slate-200 group-hover:border-blue-300 group-hover:shadow-xl transition-all duration-300">
                <img 
                  src={example.cover} 
                  alt={example.title}
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                />
              </div>

              {/* Title & category */}
              <h3 className="font-semibold text-slate-900 text-sm sm:text-base mb-1 group-hover:text-blue-600 transition-colors">
                {example.title}
              </h3>
              <p className="text-xs sm:text-sm text-slate-400">
                {example.category}
              </p>
            </button>
          ))}
        </div>

        {/* What's included */}
        <div className="grid sm:grid-cols-2 gap-4 sm:gap-6">
          
          {/* Templates */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                <Palette className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900">6 templates premium</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Luxe, Moderne, Créatif, Éducatif, Énergie ou Minimal. Choisissez le design qui correspond à votre style.
            </p>
            <div className="flex gap-1.5">
              <div className="w-8 h-10 rounded bg-gradient-to-br from-amber-400 to-amber-600" />
              <div className="w-8 h-10 rounded bg-gradient-to-br from-blue-400 to-blue-600" />
              <div className="w-8 h-10 rounded bg-gradient-to-br from-purple-400 to-purple-600" />
              <div className="w-8 h-10 rounded bg-gradient-to-br from-emerald-400 to-emerald-600" />
              <div className="w-8 h-10 rounded bg-gradient-to-br from-orange-400 to-orange-600" />
              <div className="w-8 h-10 rounded bg-gradient-to-br from-slate-400 to-slate-600" />
            </div>
          </div>

          {/* Kit Marketing */}
          <div className="bg-slate-50 rounded-2xl p-6 border border-slate-100">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center border border-slate-200">
                <MessageSquare className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="font-bold text-slate-900">Kit marketing inclus</h3>
            </div>
            <p className="text-slate-500 text-sm leading-relaxed mb-4">
              Textes prêts à poster sur Facebook, Instagram et WhatsApp. Plus une cover 3D professionnelle.
            </p>
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">
                Posts Facebook
              </span>
              <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">
                Posts Instagram
              </span>
              <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">
                Scripts WhatsApp
              </span>
              <span className="px-3 py-1.5 bg-white rounded-lg text-xs font-medium text-slate-600 border border-slate-200">
                Cover 3D
              </span>
            </div>
          </div>

        </div>

      </div>

      {/* PDF Modal */}
      {selectedPdf && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center"
          onClick={() => setSelectedPdf(null)}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />
          
          {/* Modal */}
          <div 
            className="relative z-10 bg-white w-full h-full sm:w-[90%] sm:h-[90%] sm:max-w-4xl sm:rounded-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header */}
            <div className="flex items-center justify-between px-4 py-3 border-b border-slate-100 bg-white">
              <div>
                <h3 className="font-bold text-slate-900 text-sm sm:text-base">{selectedPdf.title}</h3>
                <p className="text-xs text-slate-400">{selectedPdf.category}</p>
              </div>
              <button 
                onClick={() => setSelectedPdf(null)}
                className="p-2 hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-5 h-5 text-slate-500" />
              </button>
            </div>

            {/* PDF Viewer */}
            <div className="flex-1 bg-slate-50 relative">
              {/* Loading spinner */}
              {isLoading && (
                <div className="absolute inset-0 flex flex-col items-center justify-center bg-slate-50 z-10">
                  <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-4" />
                  <p className="text-slate-500 text-sm font-medium">Chargement du PDF...</p>
                </div>
              )}
              
              <iframe 
                src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(selectedPdf.pdfUrl)}`}
                className="w-full h-full border-0"
                title="PDF Preview"
                onLoad={() => setIsLoading(false)}
              />
            </div>
          </div>
        </div>
      )}
    </section>
  );
}