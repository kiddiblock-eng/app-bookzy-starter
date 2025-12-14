"use client";
import React from "react";
import {
  Check,
  X,
  ShieldCheck,
  FileText,
  Target,
  Copy,
  PenTool,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";

export default function WhyBookzy() {
  
  const bookzyFeatures = [
    {
      icon: FileText,
      title: "Mise en page Auto",
      desc: "Rendu éditeur professionnel sans toucher à Word.",
      color: "text-blue-600",
      bg: "bg-blue-50"
    },
    {
      icon: Copy,
      title: "Rédaction IA Experte",
      desc: "Contenu riche, structuré et 100% original.",
      color: "text-violet-600",
      bg: "bg-violet-50"
    },
    {
      icon: Target,
      title: "Analyse de Niche",
      desc: "Données de marché réelles pour viser juste.",
      color: "text-pink-600",
      bg: "bg-pink-50"
    },
    {
      icon: PenTool,
      title: "Kit Marketing",
      desc: "Posts & Arguments de vente générés pour vous.",
      color: "text-indigo-600",
      bg: "bg-indigo-50"
    }
  ];

  return (
    <section id="pourquoiBookzy" className="relative bg-white py-24 lg:py-32 overflow-hidden border-t border-slate-100">
      
      {/* --- FOND AURORA (Cohérence parfaite) --- */}
      <div className="absolute top-1/2 left-0 w-[800px] h-[800px] bg-blue-50/40 rounded-full blur-[120px] -translate-y-1/2 pointer-events-none -z-10 mix-blend-multiply" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-violet-50/40 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
      {/* --- HEADER (Structure Pro + Touche "Électrique") --- */}
<div className="text-center mb-24 max-w-4xl mx-auto">
  
  {/* Badge Minimaliste */}
  <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full border border-slate-200 bg-slate-50 mb-8 cursor-default">
    <div className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse" />
    <span className="text-slate-500 font-semibold text-xs uppercase tracking-widest">
      Productivité v2.0
    </span>
  </div>

  <h2 className="text-5xl md:text-7xl font-black text-slate-900 tracking-tighter mb-8 leading-[1.1]">
    {/* Ligne 1 : Le passé (Sobre et barré) */}
    <span className="block text-3xl md:text-4xl text-slate-400 font-bold mb-3 line-through decoration-slate-300 decoration-2">
      Des semaines de travail...
    </span>
    
    {/* Ligne 2 : Le présent (Vivant et Coloré) */}
    <span className="block">
      condensées en{' '}
      <span className="relative inline-block">
        {/* L'effet "Vivant" : Une lueur floue qui pulse derrière */}
        <span className="absolute -inset-2 bg-gradient-to-r from-blue-600 to-violet-600 rounded-lg blur-xl opacity-20 animate-pulse"></span>
        
        {/* Le Texte : Gradient Bleu/Violet puissant */}
        <span className="relative text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-violet-600 drop-shadow-sm">
          60 secondes.
        </span>
      </span>
    </span>
  </h2>
  
  <p className="text-slate-600 text-xl leading-relaxed font-medium max-w-2xl mx-auto">
    Ce n'est pas de la magie, c'est de la technologie. <br className="hidden md:block"/>
    Transformez une tâche de 30 jours en une pause café.
  </p>
</div>
          

        {/* --- LE COMPARATIF (Design Asymétrique) --- */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 mb-24 items-center">
          
          {/* GAUCHE : L'ANCIENNE MÉTHODE (Grisé / Effacé) */}
          <div className="p-8 rounded-3xl border border-slate-100 bg-slate-50/50 opacity-80 hover:opacity-100 transition-opacity">
            <div className="flex items-center justify-between mb-8 border-b border-slate-200 pb-4">
              <span className="text-slate-500 font-bold text-xs uppercase tracking-widest">Méthode Traditionnelle</span>
              <X className="w-5 h-5 text-slate-400" />
            </div>
            
            <div className="space-y-8">
              <div className="flex gap-4 items-start grayscale opacity-70">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
                  <Clock className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-slate-700 font-bold text-base">Lent et fastidieux</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">Nécessite des semaines de recherche, rédaction et relecture.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start grayscale opacity-70">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
                  <FileText className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-slate-700 font-bold text-base">Mise en page amateur</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">Difficile d'obtenir un rendu pro avec Word ou Google Docs.</p>
                </div>
              </div>

              <div className="flex gap-4 items-start grayscale opacity-70">
                <div className="w-8 h-8 rounded-full bg-slate-200 flex items-center justify-center flex-shrink-0 text-slate-500">
                  <Target className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-slate-700 font-bold text-base">Pas de stratégie</h4>
                  <p className="text-slate-500 text-sm mt-1 leading-relaxed">Création au hasard sans validation du marché ni plan de vente.</p>
                </div>
              </div>
            </div>
          </div>

          {/* DROITE : BOOKZY (Mis en lumière / Premium) */}
          <div className="relative p-8 rounded-3xl bg-white border border-slate-100 shadow-2xl shadow-blue-900/10 overflow-hidden group hover:-translate-y-1 transition-transform duration-300">
            {/* Glow interne */}
            <div className="absolute top-0 right-0 w-64 h-64 bg-blue-50 rounded-full blur-3xl opacity-50 group-hover:opacity-100 transition-opacity pointer-events-none" />
            
            <div className="relative z-10">
              <div className="flex items-center justify-between mb-8 border-b border-slate-100 pb-4">
                <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-blue-600 animate-pulse"></span>
                    <span className="text-blue-600 font-bold text-xs uppercase tracking-widest">L'Expérience Bookzy</span>
                </div>
                <ShieldCheck className="w-5 h-5 text-blue-600" />
              </div>
              
              <div className="space-y-8">
                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-blue-500/30">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-black text-base">Instantané (60s)</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed font-medium">L'IA génère un contenu structuré et pertinent immédiatement.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-blue-500/30">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-black text-base">Design Premium</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed font-medium">Formatage automatique digne d'une grande maison d'édition.</p>
                  </div>
                </div>

                <div className="flex gap-4 items-start">
                  <div className="w-8 h-8 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0 text-white shadow-lg shadow-blue-500/30">
                    <Check className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-slate-900 font-black text-base">Business-Ready</h4>
                    <p className="text-slate-500 text-sm mt-1 leading-relaxed font-medium">Livré avec les textes marketing pour générer des ventes.</p>
                  </div>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* --- GRID FEATURES (Minimaliste & Pro) --- */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {bookzyFeatures.map((feat, i) => (
                <div key={i} className="group p-6 bg-white rounded-2xl border border-slate-100 shadow-sm hover:shadow-xl hover:shadow-slate-200/50 hover:border-slate-200 transition-all duration-300 cursor-default">
                    <div className={`w-12 h-12 ${feat.bg} rounded-xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform duration-300`}>
                        <feat.icon className={`w-6 h-6 ${feat.color}`} />
                    </div>
                    <h3 className="font-bold text-slate-900 mb-2 text-lg">{feat.title}</h3>
                    <p className="text-sm text-slate-500 leading-relaxed font-medium">
                        {feat.desc}
                    </p>
                </div>
            ))}
        </div>

      </div>
    </section>
  );
}