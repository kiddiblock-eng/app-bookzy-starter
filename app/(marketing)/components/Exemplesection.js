"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Eye, FileText, Target, Sparkles, Share2, 
  Copy, Zap, ArrowRight, Clock, CheckCircle2, Palette
} from "lucide-react";

// --- SOUS-COMPOSANTS ---

const LiveBadge = () => (
  <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-3 py-1.5 rounded-full mb-6 shadow-sm">
    <span className="relative flex h-2.5 w-2.5">
      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
      <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-600"></span>
    </span>
    <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Génération Instantanée</span>
  </div>
);

const PdfMockup = ({ variant = "blue" }) => {
  const colors = {
    blue: { primary: "bg-blue-100", accent: "bg-blue-600", icon: "text-blue-200" },
    green: { primary: "bg-emerald-100", accent: "bg-emerald-600", icon: "text-emerald-200" }
  };
  
  const color = colors[variant] || colors.blue;
  
  return (
    <div className="relative w-full aspect-[210/297] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col p-4 md:p-6 gap-3 select-none">
      <div className={`w-2/3 h-5 ${color.primary} rounded-md mb-2`} />
      <div className="w-1/2 h-3 bg-slate-100 rounded-md mb-4" />
      <div className="space-y-2">
        <div className="w-full h-2 bg-slate-100 rounded-full" />
        <div className="w-full h-2 bg-slate-100 rounded-full" />
        <div className="w-5/6 h-2 bg-slate-100 rounded-full" />
      </div>
      <div className="w-full h-32 bg-slate-50 rounded-md border border-slate-100 my-2 flex items-center justify-center">
        <Sparkles className={`w-6 h-6 ${color.icon} opacity-50`} />
      </div>
      <div className="space-y-2">
        <div className="w-full h-2 bg-slate-100 rounded-full" />
        <div className="w-11/12 h-2 bg-slate-100 rounded-full" />
        <div className="w-4/5 h-2 bg-slate-100 rounded-full" />
      </div>
      <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
        <div className={`w-8 h-8 rounded-full ${color.primary}`} />
        <div className="w-16 h-2 bg-slate-100 rounded-full" />
      </div>
    </div>
  );
};

// --- COMPOSANT PRINCIPAL ---

export default function ExamplesSection() {
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);

  // ✅ 2 exemples d'eBooks
  const ebooks = [
    {
      id: 1,
      title: "Business",
      subtitle: "Monétisation avec l'IA",
      pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1766663881/bookzy/ebooks/tiktok-sans-visage-monetisez-votre-compte-avec-lia-guide-debutant-694d26256694fe.pdf",
      badge: "Tendance",
      badgeColor: "bg-pink-100 text-pink-600 border-pink-200",
      variant: "blue"
    },
    {
      id: 2,
      title: "Formation",
      subtitle: "Le guide ultime",
      pdfUrl: "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1766670419/bookzy/ebooks/e-commerce-afrique-le-guide-ultime-pour-lancer-et-generer-des-profits-a-partir-d.pdf",
      badge: "Business",
      badgeColor: "bg-emerald-100 text-emerald-600 border-emerald-200",
      variant: "green"
    }
  ];

  // Gestion du scroll body
  useEffect(() => {
    if (selectedEbook) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedEbook]);

  const openModal = (ebook) => {
    setSelectedEbook(ebook);
    setIsLoadingPdf(true);
  };

  return (
    <section id="examples" className="relative bg-slate-50 py-24 lg:py-32 overflow-hidden">
      
      <div className="absolute inset-0 bg-[radial-gradient(#e2e8f0_1px,transparent_1px)] [background-size:20px_20px] opacity-50"></div>
      <div className="absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-white/80"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <LiveBadge />
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6">
            Votre pack complet <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-indigo-600">
              généré en 60 secondes
            </span>
          </h2>
          <p className="text-slate-600 text-lg md:text-xl font-medium leading-relaxed max-w-2xl mx-auto">
            Plus besoin de passer des semaines à créer. Notre IA rédige l'Ebook, le formate en PDF et prépare tout votre marketing instantanément.
          </p>
        </div>

        {/* ✅ 2 CARTES PDF EXEMPLES (Side by side sur desktop, stacked sur mobile) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
          {ebooks.map((ebook) => (
            <div 
              key={ebook.id}
              onClick={() => openModal(ebook)}
              className="bg-white rounded-3xl p-1 shadow-xl shadow-slate-200/50 border border-slate-200 group cursor-pointer hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-300"
            >
              <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-[20px] p-6 h-full flex flex-col relative overflow-hidden">
                <div className="absolute top-6 right-6 z-20">
                   <span className={`backdrop-blur text-xs font-bold px-3 py-1.5 rounded-full border shadow-sm flex items-center gap-1.5 ${ebook.badgeColor}`}>
                      {ebook.badge}
                   </span>
                </div>

                <div className="mb-6 relative z-10">
                  <h3 className="text-xl font-bold text-slate-900 mb-1">{ebook.title}</h3>
                  <p className="text-slate-500 text-sm font-medium">{ebook.subtitle}</p>
                </div>

                <div className="relative flex-1 min-h-[280px] flex items-center justify-center p-4 bg-slate-100/50 rounded-xl border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                   <div className="w-48 relative transform group-hover:-translate-y-2 transition-transform duration-500 ease-out shadow-xl">
                      <PdfMockup variant={ebook.variant} />
                      
                      <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/10 backdrop-blur-[1px] rounded-lg">
                          <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all">
                              <Eye className="w-4 h-4" /> Voir l'exemple
                          </div>
                      </div>
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* ✅ SECTION TEMPLATES (Nouvelle mini-section entre les exemples et le reste) */}
        <div className="mb-16 bg-white rounded-3xl border border-slate-200 shadow-lg shadow-slate-200/40 p-8 md:p-10">
          <div className="flex flex-col md:flex-row items-start md:items-center gap-8">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-purple-500 to-pink-500 flex items-center justify-center text-white shadow-lg">
                  <Palette className="w-6 h-6" />
                </div>
                <div>
                  <h3 className="text-2xl font-bold text-slate-900">6 Templates Premium</h3>
                  <p className="text-slate-500 text-sm font-medium">Choisissez le design qui vous plaît</p>
                </div>
              </div>
              <p className="text-slate-600 font-medium leading-relaxed mb-6">
                Luxe, Moderne, Créatif, Éducatif, Énergie ou Minimal. L'IA adapte automatiquement le design, les couleurs et la typographie selon votre template choisi.
              </p>
              <div className="flex flex-wrap gap-2">
                {["Luxe 💎", "Moderne 🔷", "Créatif 🎨", "Éducatif 📚", "Énergie ⚡", "Minimal ⚪"].map((template) => (
                  <span key={template} className="px-3 py-1.5 bg-slate-50 border border-slate-200 rounded-lg text-sm font-medium text-slate-700 hover:border-purple-300 hover:bg-purple-50 transition-colors">
                    {template}
                  </span>
                ))}
              </div>
            </div>
            <div className="w-full md:w-1/3 grid grid-cols-3 gap-2">
              <div className="aspect-[3/4] bg-gradient-to-br from-amber-400 to-yellow-600 rounded-lg shadow-md"></div>
              <div className="aspect-[3/4] bg-gradient-to-br from-blue-400 to-indigo-600 rounded-lg shadow-md"></div>
              <div className="aspect-[3/4] bg-gradient-to-br from-purple-400 to-pink-600 rounded-lg shadow-md"></div>
              <div className="aspect-[3/4] bg-gradient-to-br from-emerald-400 to-green-600 rounded-lg shadow-md"></div>
              <div className="aspect-[3/4] bg-gradient-to-br from-orange-400 to-red-600 rounded-lg shadow-md"></div>
              <div className="aspect-[3/4] bg-gradient-to-br from-slate-300 to-slate-600 rounded-lg shadow-md"></div>
            </div>
          </div>
        </div>

        {/* GRILLE FEATURES (COPYWRITING + MARKETING) */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-16">
          
          {/* COPYWRITING */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:border-pink-200 transition-all group">
            <div className="flex flex-col gap-6">
              <div className="flex-1">
                 <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                      <Target className="w-5 h-5" />
                    </div>
                    <h3 className="text-xl font-bold text-slate-900">Copywriting AIDA</h3>
                 </div>
                 <p className="text-slate-600 font-medium mb-5 leading-relaxed">
                   Obtenez instantanément le contenu d'une page de vente persuasive utilisant la méthode AIDA pour convertir vos lecteurs en acheteurs.
                 </p>
                 <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-lg w-fit border border-slate-100">
                    <CheckCircle2 className="w-4 h-4 text-green-500" /> Prêt à copier-coller
                 </div>
              </div>
              <div className="bg-slate-50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden group-hover:border-pink-100 transition-colors">
                 <div className="space-y-2 opacity-60">
                    <div className="h-2 w-1/3 bg-pink-400 rounded-full mb-4"></div>
                    <div className="h-1.5 w-full bg-slate-300 rounded-full"></div>
                    <div className="h-1.5 w-full bg-slate-300 rounded-full"></div>
                    <div className="h-1.5 w-4/5 bg-slate-300 rounded-full"></div>
                 </div>
                 <div className="absolute bottom-4 right-4">
                    <Copy className="w-5 h-5 text-pink-500" />
                 </div>
              </div>
            </div>
          </div>

          {/* MARKETING */}
          <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:border-indigo-200 transition-all group">
             <div className="flex flex-col gap-6">
                <div className="flex-1">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                          <Share2 className="w-5 h-5" />
                        </div>
                        <h3 className="text-xl font-bold text-slate-900">Marketing Multicanal</h3>
                    </div>
                    <p className="text-slate-600 font-medium mb-6 leading-relaxed">
                      Ne cherchez plus quoi poster. L'IA génère la couverture 3D, vos posts Facebook, Instagram et vos messages WhatsApp.
                    </p>
                    <div className="flex flex-wrap gap-2">
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                        <Zap className="w-3 h-3" /> Facebook
                      </span>
                      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                        <Zap className="w-3 h-3" /> WhatsApp
                      </span>
                       <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-purple-50 text-purple-700 text-xs font-bold border border-purple-100">
                        <Zap className="w-3 h-3" /> Couverture 3D
                      </span>
                    </div>
                </div>
                <div className="flex flex-col gap-2">
                    <div className="bg-white border border-slate-100 shadow-sm p-3 rounded-xl flex items-center gap-3 transform translate-x-2 group-hover:translate-x-0 transition-transform">
                        <div className="w-8 h-8 rounded-full bg-indigo-100 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                            <div className="w-1/2 h-2 bg-slate-200 rounded-full" />
                            <div className="w-3/4 h-2 bg-slate-100 rounded-full" />
                        </div>
                    </div>
                    <div className="bg-white border border-slate-100 shadow-sm p-3 rounded-xl flex items-center gap-3 transform -translate-x-2 group-hover:translate-x-0 transition-transform delay-75">
                        <div className="w-8 h-8 rounded-full bg-green-100 flex-shrink-0" />
                        <div className="flex-1 space-y-1">
                            <div className="w-1/2 h-2 bg-slate-200 rounded-full" />
                            <div className="w-full h-2 bg-slate-100 rounded-full" />
                        </div>
                    </div>
                </div>
             </div>
          </div>

        </div>

        {/* FOOTER SECTION */}
        <div className="max-w-4xl mx-auto">
          <div className="relative rounded-2xl p-[2px] bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 shadow-2xl">
            <div className="bg-slate-900 rounded-[14px] px-6 py-5 md:py-4 flex flex-col md:flex-row items-center justify-between gap-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center border border-slate-700">
                  <Sparkles className="w-6 h-6 text-yellow-400 animate-pulse" />
                </div>
                <div>
                  <h4 className="text-white font-bold text-lg">Bonus Gratuit Inclus</h4>
                  <p className="text-slate-400 text-sm">Les outils Niche Hunter et Tendances sont inclus gratuitement avec votre compte.</p>
                </div>
              </div>
              <a 
                href="/auth/register" 
                className="w-full md:w-auto bg-white hover:bg-blue-50 text-slate-900 font-bold py-3 px-6 rounded-xl transition-all flex items-center justify-center gap-2 group"
              >
                Créer mon compte <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </a>
            </div>
          </div>
        </div>

      </div>

      {/* 🔥 MODAL PDF OPTIMISÉE POUR MOBILE 🔥 */}
      {selectedEbook && (
        <div 
          className="fixed inset-0 z-[100] flex items-center justify-center p-0 sm:p-4 md:p-6" 
          onClick={() => setSelectedEbook(null)}
        >
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm transition-opacity" />
          
          <div 
            className="bg-white w-full h-full sm:h-[85vh] sm:max-w-5xl sm:rounded-2xl shadow-2xl relative z-10 flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-200"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Header Modal */}
            <div className="flex items-center justify-between px-4 py-3 sm:px-6 sm:py-4 border-b border-slate-100 bg-white z-20">
              <div className="flex items-center gap-3">
                 <div className="p-2 bg-blue-50 text-blue-600 rounded-lg hidden sm:block">
                    <FileText className="w-5 h-5" />
                 </div>
                 <div className="max-w-[200px] sm:max-w-none">
                    <h3 className="font-bold text-slate-900 text-sm sm:text-base truncate">{selectedEbook.title}</h3>
                    <p className="text-[10px] sm:text-xs text-slate-500">{selectedEbook.subtitle}</p>
                 </div>
              </div>
              <button 
                onClick={() => setSelectedEbook(null)} 
                className="p-2 bg-slate-100 hover:bg-slate-200 rounded-full transition-colors text-slate-500"
              >
                <X className="w-5 h-5 sm:w-6 sm:h-6" />
              </button>
            </div>

            {/* Content Iframe avec le FIX GOOGLE */}
            <div className="flex-1 bg-slate-100 relative overflow-y-auto -webkit-overflow-scrolling-touch">
               {isLoadingPdf && (
                  <div className="absolute inset-0 flex flex-col items-center justify-center z-0">
                     <div className="w-10 h-10 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin mb-3"></div>
                     <span className="text-slate-500 font-medium text-sm">Chargement...</span>
                  </div>
               )}
               
               {/* 🚀 L'ASTUCE GOOGLE DOCS VIEWER : Force le rendu HTML compatible mobile */}
               <iframe 
                  src={`https://docs.google.com/gview?embedded=true&url=${encodeURIComponent(selectedEbook.pdfUrl)}`}
                  className={`w-full h-full relative z-10 border-0 ${isLoadingPdf ? 'opacity-0' : 'opacity-100'}`}
                  title="PDF Preview"
                  onLoad={() => setIsLoadingPdf(false)}
               />
            </div>

            {/* Footer Modal */}
            <div className="px-4 py-3 sm:px-6 sm:py-4 border-t border-slate-100 bg-white flex justify-between items-center z-20">
              <span className="text-xs font-medium text-slate-400 hidden sm:block">Généré par Bookzy AI</span>
              <a 
                href="/auth/register" 
                className="w-full sm:w-auto bg-slate-900 text-white px-6 py-3 sm:py-2.5 rounded-xl font-bold text-sm hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg"
              >
                <Sparkles className="w-4 h-4 text-yellow-300" />
                Générer mon pack
              </a>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}