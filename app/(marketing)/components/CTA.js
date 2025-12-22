"use client";

import Link from "next/link";
import { Sparkles, ArrowRight, ShieldCheck, Star } from "lucide-react";

export default function FinalCTA() {
  
  const avatars = [
    "/images/garcon1.jpg", 
    "/images/filleblanche1.jpg", 
    "/images/garcon3.jpg"
  ];

  return (
    <section className="bg-white py-12 lg:py-20 px-4">
      
      {/* BANNIÈRE HORIZONTALE */}
      <div className="relative max-w-6xl mx-auto bg-[#0a0f1c] rounded-[2rem] md:rounded-[3rem] overflow-hidden shadow-2xl shadow-slate-900/20">
        
        {/* BACKGROUND SIMPLIFIÉ */}
        <div className="absolute inset-0 bg-gradient-to-r from-blue-950/40 via-transparent to-violet-950/40"></div>

        <div className="relative z-10 px-8 py-12 md:p-16">
          
          <div className="flex flex-col lg:flex-row items-center justify-between gap-10 lg:gap-20">
            
            {/* GAUCHE : TEXTE */}
            <div className="text-center lg:text-left flex-1">
              
              {/* Preuve Sociale */}
              <div className="flex justify-center lg:justify-start mb-6">
                <div className="inline-flex items-center gap-3 px-2 py-1.5 pl-2 pr-4 rounded-full bg-white/5 border border-white/10">
                    <div className="flex -space-x-3">
                        {avatars.map((src, i) => (
                             <div key={i} className="relative w-8 h-8 rounded-full border-2 border-[#0a0f1c] overflow-hidden">
                                <img 
                                  src={src} 
                                  alt={`User ${i}`} 
                                  className="w-full h-full object-cover bg-slate-800" 
                                  loading="lazy"
                                  width="32"
                                  height="32"
                                />
                             </div>
                        ))}
                    </div>
                    <div className="flex items-center gap-1.5 text-yellow-400 border-l border-white/10 pl-3">
                        <Star className="w-4 h-4 fill-current" />
                        <span className="text-sm font-bold text-white">4.9/5</span>
                    </div>
                </div>
              </div>

              <h2 className="text-3xl md:text-5xl font-black text-white tracking-tight mb-4 leading-tight">
                Lancez votre best-seller <br className="hidden lg:block" />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-200 via-white to-blue-200">
                  avant ce soir.
                </span>
              </h2>

              <p className="text-base md:text-lg text-slate-400 font-medium leading-relaxed max-w-xl mx-auto lg:mx-0">
                L'IA a déjà fait 90% du travail. Il ne manque que votre clic pour transformer une idée en revenu.
              </p>
            </div>

            {/* DROITE : ACTION */}
            <div className="flex flex-col items-center lg:items-end gap-4 shrink-0">
              <Link
                href="https://app.bookzy.io/auth/register"
                className="group relative inline-flex items-center gap-3 px-8 py-4 md:px-10 md:py-5 bg-white text-slate-950 text-lg md:text-xl font-bold rounded-2xl hover:bg-blue-50 hover:scale-[1.02] transition-all duration-300 shadow-lg whitespace-nowrap"
              >
                <Sparkles className="w-5 h-5 text-blue-600 fill-blue-600" />
                <span>Générer mon ebook</span>
                <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <p className="text-slate-500 text-sm font-medium flex items-center gap-2">
                 <ShieldCheck className="w-4 h-4 text-emerald-500" />
                 Pas de carte requise
              </p>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
}