"use client";

import React, { useState } from "react";
import { X, Eye, FileText, Target, Sparkles, Clock, Download, Share2, ThumbsUp, MessageCircle, Copy, Zap, ArrowRight } from "lucide-react";
import Link from "next/link";

export default function ExamplesSection() {
  const [selectedEbook, setSelectedEbook] = useState(null);
  const [isLoadingPdf, setIsLoadingPdf] = useState(true);

  // DONNÉES DE DÉMO (STATIQUES)
  const demoEbook = {
    id: 1,
    title: "TikTok Monétisation",
    time: "1 min",
    pdfUrl: "/images/ebookexemple.pdf", // Assure-toi que ce fichier existe dans public/pdfs/
  };

  const openModal = () => {
    setSelectedEbook(demoEbook);
    setIsLoadingPdf(true);
    document.body.style.overflow = "hidden";
  };

  const closeModal = () => {
    setSelectedEbook(null);
    document.body.style.overflow = "auto";
  };

  return (
    <section id="examples" className="relative bg-white py-24 lg:py-32 overflow-hidden border-t border-slate-100">
      
      {/* --- FOND AURORA (Cohérence avec Hero) --- */}
      <div className="absolute top-1/2 left-0 w-[600px] h-[600px] bg-blue-50/60 rounded-full blur-[120px] pointer-events-none -translate-y-1/2 -z-10 mix-blend-multiply" />
      <div className="absolute bottom-0 right-0 w-[600px] h-[600px] bg-pink-50/60 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply" />

      {/* --- HEADER --- */}
      <div className="max-w-7xl mx-auto px-6 relative z-10 mb-20">
        <div className="text-center max-w-3xl mx-auto">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full mb-8 shadow-sm cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Résultats en direct</span>
          </div>
          
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-6 leading-[1.1]">
            Voici ce que vous obtenez  <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-pink-600">
              en 1 minute
            </span>
          </h2>
          <p className="text-slate-600 text-lg font-medium leading-relaxed">
            Notre IA ne se contente pas d'écrire. Elle génère <strong>automatiquement</strong> votre Ebook, votre PDF et tout votre marketing en moins de 60 secondes.
          </p>
        </div>
      </div>

      {/* --- BENTO GRID --- */}
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 mb-24">
        
        {/* BLOC 1: LE PDF (Gros bloc gauche) */}
        <div className="lg:col-span-5 bg-white rounded-3xl p-8 border border-slate-100 shadow-xl shadow-slate-200/40 flex flex-col hover:-translate-y-1 hover:shadow-2xl hover:shadow-blue-900/5 transition-all duration-300 group cursor-pointer relative overflow-hidden" onClick={openModal}>
            
            {/* Petit halo interne */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50/50 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>

            <div className="relative z-10 mb-8">
                <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-blue-50 flex items-center justify-center text-blue-600">
                            <FileText className="w-5 h-5" />
                        </div>
                        <h3 className="text-lg font-bold text-slate-900">Ebook 100% IA</h3>
                    </div>
                    <span className="bg-blue-600 text-white text-[10px] font-bold px-2 py-1 rounded-full uppercase tracking-wider shadow-sm shadow-blue-500/30">Automatique</span>
                </div>
                <p className="text-slate-500 text-sm leading-relaxed">
                    L'IA rédige chaque chapitre, structure le contenu et génère un fichier PDF A4 professionnel.
                </p>
            </div>

            {/* VISUEL PDF ABSTRAIT */}
            <div className="relative z-10 w-full aspect-[3/4] bg-slate-50 rounded-2xl border border-slate-200 p-6 flex flex-col gap-4 overflow-hidden group-hover:border-blue-200 transition-colors duration-300">
                {/* Fake Content */}
                <div className="w-2/3 h-6 bg-slate-200 rounded-md mb-2" /> 
                <div className="w-full h-2 bg-white rounded-full shadow-sm" />
                <div className="w-full h-2 bg-white rounded-full shadow-sm" />
                <div className="w-5/6 h-2 bg-white rounded-full shadow-sm" />
                
                <div className="my-auto flex gap-4 opacity-50">
                    <div className="w-1/2 aspect-square bg-blue-100/50 rounded-lg flex items-center justify-center">
                        <Sparkles className="w-8 h-8 text-blue-300" />
                    </div>
                    <div className="flex-1 flex flex-col gap-2">
                        <div className="w-full h-2 bg-white rounded-full" />
                        <div className="w-full h-2 bg-white rounded-full" />
                        <div className="w-2/3 h-2 bg-white rounded-full" />
                    </div>
                </div>
                
                <div className="mt-auto w-full h-10 bg-slate-900 rounded-lg flex items-center justify-center text-white text-xs font-bold gap-2 shadow-lg shadow-slate-900/10 group-hover:bg-blue-600 transition-colors">
                    <Download className="w-3.5 h-3.5" /> Voir le résultat
                </div>
                
                {/* Overlay Hover */}
                <div className="absolute inset-0 bg-white/60 backdrop-blur-[2px] opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                    <span className="px-5 py-2.5 bg-white text-slate-900 rounded-full font-bold shadow-xl border border-slate-100 transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300 flex items-center gap-2">
                        <Eye className="w-4 h-4 text-blue-600" /> Voir le résultat
                    </span>
                </div>
            </div>
        </div>

        {/* COLONNE DROITE (7 colonnes) */}
        <div className="lg:col-span-7 flex flex-col gap-6">
            
            {/* BLOC 2: KIT SOCIAL (Maintenant Blanc/Clean) */}
            <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-8 relative overflow-hidden group shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-indigo-900/5 transition-all duration-300">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="w-10 h-10 rounded-xl bg-indigo-50 flex items-center justify-center text-indigo-600">
                                <Share2 className="w-5 h-5" />
                            </div>
                            <div>
                                <h3 className="text-lg font-bold text-slate-900">Marketing Automatisé</h3>
                                <p className="text-indigo-500 text-xs font-bold uppercase tracking-wide">Généré en parallèle</p>
                            </div>
                        </div>
                        <p className="text-slate-500 text-sm mb-6 leading-relaxed">
                            L'IA analyse votre livre et rédige instantanément les posts Facebook et messages WhatsApp parfaits pour le vendre.
                        </p>
                        <div className="flex gap-2">
                            <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-200 flex items-center gap-1.5"><Zap className="w-3 h-3 text-indigo-500"/> Post FB</span>
                            <span className="px-3 py-1.5 bg-slate-50 rounded-lg text-xs font-bold text-slate-600 border border-slate-200 flex items-center gap-1.5"><Zap className="w-3 h-3 text-green-500"/> WhatsApp</span>
                        </div>
                    </div>

                    {/* FAKE POST FACEBOOK */}
                    <div className="w-full md:w-64 bg-slate-50 rounded-xl border border-slate-200 p-4 transform rotate-2 group-hover:rotate-0 transition-transform duration-500 origin-bottom-right shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                            <div className="w-8 h-8 bg-white rounded-full shadow-sm" />
                            <div className="flex-1">
                                <div className="w-20 h-2 bg-slate-300 rounded-full mb-1" />
                                <div className="w-12 h-1.5 bg-slate-200 rounded-full" />
                            </div>
                        </div>
                        <div className="space-y-2 mb-3 opacity-60">
                            <div className="w-full h-1.5 bg-slate-400 rounded-full" />
                            <div className="w-full h-1.5 bg-slate-400 rounded-full" />
                            <div className="w-3/4 h-1.5 bg-slate-400 rounded-full" />
                        </div>
                        <div className="h-20 bg-indigo-50 rounded-lg mb-3 border border-indigo-100 flex items-center justify-center">
                             <span className="text-[10px] text-indigo-400 font-bold uppercase flex items-center gap-1"><Sparkles className="w-3 h-3"/> Image IA</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* BLOC 3: COPYWRITING */}
            <div className="flex-1 bg-white border border-slate-100 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8 relative overflow-hidden group shadow-xl shadow-slate-200/40 hover:-translate-y-1 hover:shadow-2xl hover:shadow-pink-900/5 transition-all duration-300">
                 
                 {/* FAKE LANDING PAGE */}
                 <div className="w-full md:w-1/2 bg-slate-50 border border-slate-200 rounded-xl p-4 relative top-4 md:top-0 shadow-inner">
                    <div className="w-full h-24 bg-white rounded-lg border border-slate-100 shadow-sm mb-3 flex flex-col items-center justify-center gap-2 p-3">
                        <div className="w-16 h-3 bg-pink-100 rounded-full mb-1" />
                        <div className="w-3/4 h-2 bg-slate-200 rounded-full" />
                        <div className="mt-2 px-3 py-1 bg-pink-500 rounded-full w-20 h-3" />
                    </div>
                    <div className="space-y-1.5 px-2 opacity-50">
                        <div className="w-full h-1 bg-slate-300 rounded-full" />
                        <div className="w-full h-1 bg-slate-300 rounded-full" />
                        <div className="w-5/6 h-1 bg-slate-300 rounded-full" />
                    </div>
                 </div>

                 <div className="flex-1 relative z-10">
                    <div className="flex items-center gap-3 mb-4">
                        <div className="w-10 h-10 rounded-xl bg-pink-50 flex items-center justify-center text-pink-600">
                            <Target className="w-5 h-5" />
                        </div>
                        <div>
                            <h3 className="text-lg font-bold text-slate-900">Copywriting Expert</h3>
                            <p className="text-pink-500 text-xs font-bold uppercase tracking-wide">Méthode AIDA</p>
                        </div>
                    </div>
                    <p className="text-slate-500 text-sm mb-4 leading-relaxed">
                        L'IA rédige un argumentaire de vente persuasif structuré pour transformer vos visiteurs en acheteurs.
                    </p>
                    <div className="flex items-center gap-2 text-slate-900 font-bold text-xs uppercase tracking-wide bg-slate-50 px-3 py-1.5 rounded-lg border border-slate-100 w-fit">
                        <Copy className="w-3 h-3 text-slate-400" /> Prêt à copier-coller
                    </div>
                 </div>
            </div>

        </div>
      </div>

      {/* --- BANNER BONUS (Noir) --- */}
      <div className="max-w-5xl mx-auto px-6">
        <div className="bg-slate-900 rounded-3xl p-8 flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden shadow-2xl shadow-slate-900/20 group">
            
            {/* Glow effet */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/20 rounded-full blur-[80px] -translate-y-1/2 translate-x-1/2 group-hover:bg-blue-500/30 transition-colors" />
            
            <div className="flex items-center gap-5 relative z-10">
                <div className="w-14 h-14 bg-white/5 rounded-2xl flex items-center justify-center backdrop-blur-sm border border-white/10 shadow-inner">
                    <Sparkles className="w-7 h-7 text-yellow-400 fill-yellow-400 animate-pulse" />
                </div>
                <div>
                    <h4 className="text-white font-bold text-xl mb-1">Bonus Gratuit Inclus</h4>
                    <p className="text-slate-400 text-sm font-medium">Débloquez l'outil "Niche Hunter" avec votre compte.</p>
                </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-3 relative z-10 w-full md:w-auto">
                 <Link href="/auth/register" className="bg-white text-slate-900 px-6 py-3 rounded-xl font-bold text-sm hover:bg-blue-50 transition-colors flex items-center justify-center gap-2 shadow-lg">
                    Créer mon compte gratuit <ArrowRight className="w-4 h-4" />
                 </Link>
            </div>
        </div>
      </div>

      {/* --- MODAL PDF (Clean) --- */}
      {selectedEbook && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 animate-in fade-in duration-200" onClick={closeModal}>
          <div className="absolute inset-0 bg-slate-900/80 backdrop-blur-sm" />
          <div className="bg-white rounded-2xl w-full max-w-5xl h-[85vh] shadow-2xl relative z-10 flex flex-col overflow-hidden ring-1 ring-slate-900/5" onClick={(e) => e.stopPropagation()}>
            
            <div className="flex items-center justify-between p-4 border-b border-slate-100 bg-white">
                <div className="flex items-center gap-3">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-lg">
                        <FileText className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-slate-900 text-sm">{selectedEbook.title}</h3>
                        <p className="text-slate-500 text-xs">Prévisualisation PDF</p>
                    </div>
                </div>
                <button onClick={closeModal} className="w-8 h-8 rounded-full hover:bg-slate-100 flex items-center justify-center text-slate-500 transition-colors">
                    <X className="w-5 h-5" />
                </button>
            </div>

            <div className="flex-1 bg-slate-100 relative flex items-center justify-center p-4 md:p-8">
                {isLoadingPdf && (
                     <div className="absolute inset-0 flex flex-col items-center justify-center text-slate-400 gap-3 z-0">
                        <div className="w-8 h-8 border-4 border-slate-200 border-t-blue-600 rounded-full animate-spin"></div>
                        <span className="text-sm font-medium text-slate-500">Chargement du document...</span>
                    </div>
                )}
                <iframe 
                    src={selectedEbook.pdfUrl} 
                    className="w-full h-full rounded-lg shadow-lg border border-slate-200 relative z-10 bg-white" 
                    title="PDF Preview" 
                    onLoad={() => setIsLoadingPdf(false)} 
                />
            </div>
            
            <div className="p-4 border-t border-slate-100 bg-white flex justify-end">
                <Link href="/auth/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors flex items-center gap-2 shadow-lg shadow-slate-900/10">
                    <Sparkles className="w-4 h-4 text-yellow-300" />
                    Générer mon pack maintenant
                </Link>
            </div>
          </div>
        </div>
      )}

    </section>
  );
}