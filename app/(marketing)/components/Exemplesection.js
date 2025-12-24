"use client";

import React, { useState, useEffect } from "react";
import { 
  X, Eye, FileText, Target, Sparkles, Share2, 
  Copy, Zap, ArrowRight, Clock, CheckCircle2
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

const PdfMockup = () => (
  <div className="relative w-full aspect-[210/297] bg-white rounded-lg shadow-sm border border-slate-200 overflow-hidden flex flex-col p-4 md:p-6 gap-3 select-none">
    <div className="w-2/3 h-5 bg-blue-100 rounded-md mb-2" />
    <div className="w-1/2 h-3 bg-slate-100 rounded-md mb-4" />
    <div className="space-y-2">
      <div className="w-full h-2 bg-slate-100 rounded-full" />
      <div className="w-full h-2 bg-slate-100 rounded-full" />
      <div className="w-5/6 h-2 bg-slate-100 rounded-full" />
    </div>
    <div className="w-full h-32 bg-slate-50 rounded-md border border-slate-100 my-2 flex items-center justify-center">
      <Sparkles className="w-6 h-6 text-blue-200 opacity-50" />
    </div>
    <div className="space-y-2">
      <div className="w-full h-2 bg-slate-100 rounded-full" />
      <div className="w-11/12 h-2 bg-slate-100 rounded-full" />
      <div className="w-4/5 h-2 bg-slate-100 rounded-full" />
    </div>
    <div className="mt-auto flex justify-between items-center pt-4 border-t border-slate-50">
      <div className="w-8 h-8 rounded-full bg-blue-50" />
      <div className="w-16 h-2 bg-slate-100 rounded-full" />
    </div>
  </div>
);

// --- COMPOSANT PRINCIPAL ---

export default function ExamplesSection() {
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);

  // Ton URL PDF Cloudinary
  const pdfUrl = "https://res.cloudinary.com/dcmlw5hak/raw/upload/v1765662168/bookzy/ebooks/comment-creer-et-monetiser-un-compte-tiktok-grace-a-lia-sans-montrer-son-identit.pdf";

  // Gestion du scroll body
  useEffect(() => {
    if (selectedEbook) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [selectedEbook]);

  const openModal = () => {
    setSelectedEbook({ title: "Exemple : TikTok Monétisation", pdfUrl });
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

        {/* GRILLE PRINCIPALE */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 mb-16">
          
          {/* CARTE PDF */}
          <div 
            onClick={openModal}
            className="lg:col-span-5 bg-white rounded-3xl p-1 shadow-xl shadow-slate-200/50 border border-slate-200 group cursor-pointer hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-200/20 transition-all duration-300"
          >
            <div className="bg-gradient-to-b from-blue-50/50 to-white rounded-[20px] p-6 h-full flex flex-col relative overflow-hidden">
              <div className="absolute top-6 right-6 z-20">
                 <span className="bg-white/90 backdrop-blur text-blue-700 text-xs font-bold px-3 py-1.5 rounded-full border border-blue-100 shadow-sm flex items-center gap-1.5">
                    <Clock className="w-3.5 h-3.5" /> 1 min
                 </span>
              </div>

              <div className="mb-8 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-600/20 mb-4 group-hover:scale-110 transition-transform duration-300">
                  <FileText className="w-6 h-6" />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">Ebook Pro PDF</h3>
                <p className="text-slate-600 font-medium text-sm leading-relaxed">
                  L'IA génère <span className="text-slate-900 font-bold">25 à 40 pages</span> de contenu haute valeur, structuré et mis en page automatiquement.
                </p>
              </div>

              <div className="relative flex-1 min-h-[250px] flex items-center justify-center p-4 bg-slate-100/50 rounded-xl border border-slate-100 group-hover:bg-blue-50/50 transition-colors">
                 <div className="w-48 relative transform group-hover:-translate-y-2 transition-transform duration-500 ease-out shadow-xl">
                    <PdfMockup />
                    
                    {/* ✅ FIX MOBILE : Bouton visible par défaut (opacity-100), caché sur PC (md:opacity-0) et visible au survol PC */}
                    <div className="absolute inset-0 flex items-center justify-center opacity-100 md:opacity-0 md:group-hover:opacity-100 transition-opacity duration-300 bg-slate-900/10 backdrop-blur-[1px] rounded-lg">
                        <div className="bg-slate-900 text-white px-4 py-2 rounded-full text-sm font-bold flex items-center gap-2 shadow-xl transform translate-y-0 md:translate-y-2 md:group-hover:translate-y-0 transition-all">
                            <Eye className="w-4 h-4" /> Voir
                        </div>
                    </div>

                 </div>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE */}
          <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* COPYWRITING */}
            <div className="flex-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:border-pink-200 transition-all group">
              <div className="flex flex-col md:flex-row gap-8 items-start md:items-center h-full">
                <div className="flex-1">
                   <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 rounded-xl bg-pink-100 text-pink-600 flex items-center justify-center">
                        <Target className="w-5 h-5" />
                      </div>
                      <h3 className="text-xl font-bold text-slate-900">Copywriting AIDA</h3>
                   </div>
                   <p className="text-slate-600 font-medium mb-5 leading-relaxed">
                     Obtenez instantanément une page de vente persuasive utilisant la méthode AIDA pour convertir vos lecteurs en acheteurs.
                   </p>
                   <div className="flex items-center gap-2 text-xs font-bold text-slate-500 bg-slate-50 px-3 py-2 rounded-lg w-fit border border-slate-100">
                      <CheckCircle2 className="w-4 h-4 text-green-500" /> Prêt à copier-coller
                   </div>
                </div>
                <div className="w-full md:w-1/3 bg-slate-50 rounded-2xl p-4 border border-slate-100 relative overflow-hidden group-hover:border-pink-100 transition-colors">
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
            <div className="flex-1 bg-white rounded-3xl p-8 border border-slate-200 shadow-lg shadow-slate-200/40 hover:shadow-xl hover:border-indigo-200 transition-all group">
               <div className="flex flex-col md:flex-row gap-8 items-start md:items-center h-full">
                  <div className="flex-1">
                      <div className="flex items-center gap-3 mb-4">
                          <div className="w-10 h-10 rounded-xl bg-indigo-100 text-indigo-600 flex items-center justify-center">
                            <Share2 className="w-5 h-5" />
                          </div>
                          <h3 className="text-xl font-bold text-slate-900">Marketing Multicanal</h3>
                      </div>
                      <p className="text-slate-600 font-medium mb-6 leading-relaxed">
                        Ne cherchez plus quoi poster. L'IA génère vos posts Facebook, Instagram et vos messages WhatsApp.
                      </p>
                      <div className="flex gap-2">
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-50 text-indigo-700 text-xs font-bold border border-indigo-100">
                          <Zap className="w-3 h-3" /> Facebook
                        </span>
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-green-50 text-green-700 text-xs font-bold border border-green-100">
                          <Zap className="w-3 h-3" /> WhatsApp
                        </span>
                      </div>
                  </div>
                  <div className="w-full md:w-1/3 flex flex-col gap-2">
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
                  <p className="text-slate-400 text-sm">Outil "Niche Hunter" offert avec votre compte.</p>
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
                    <p className="text-[10px] sm:text-xs text-slate-500">Aperçu PDF complet</p>
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