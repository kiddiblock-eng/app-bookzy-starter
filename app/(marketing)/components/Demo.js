"use client";
import React, { useState } from "react";
import { Sparkles, Play, X, Zap, Package, Clock, Star } from "lucide-react";
import Link from "next/link";

export default function DemoPro() {
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  return (
    <section id="demo" className="relative w-full bg-slate-50 pt-20 pb-32 overflow-hidden selection:bg-blue-100">
      
      {/* BACKGROUND */}
      <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 brightness-100 contrast-150 mix-blend-overlay"></div>
      <div className="absolute inset-0 bg-grid-slate-200 [mask-image:linear-gradient(0deg,white,rgba(255,255,255,0.6))] bg-[length:40px_40px]" />
      
      {/* Orbes animés */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-400/30 rounded-full blur-[100px] animate-pulse-slow mix-blend-multiply" />
      <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-blue-400/30 rounded-full blur-[100px] animate-pulse-slow animation-delay-2000 mix-blend-multiply" />

      <div className="max-w-7xl mx-auto px-6 relative z-10">
        
        {/* HEADER */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 bg-white/80 backdrop-blur-md border border-blue-100 px-4 py-1.5 rounded-full shadow-sm mb-6 hover:scale-105 transition-transform cursor-default">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>
            </span>
            <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Démonstration Live</span>
          </div>

          <h2 className="text-4xl md:text-5xl lg:text-6xl font-extrabold text-slate-900 mb-6 tracking-tight leading-[1.1]">
            De zéro au PDF en{' '}
            <span className="relative inline-block">
              <span className="relative z-10 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500 bg-clip-text text-transparent">
                57 secondes
              </span>
              <svg className="absolute -bottom-2 w-full h-3 text-blue-200 -z-10" viewBox="0 0 100 10" preserveAspectRatio="none">
                <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="8" fill="none" />
              </svg>
            </span>
          </h2>

          <p className="text-lg text-slate-600 leading-relaxed">
            Découvrez comment l'IA génère automatiquement votre <strong className="text-slate-900">eBook professionnel + votre kit marketing</strong> en moins d'une minute.
          </p>
        </div>

        {/* MACBOOK MOCKUP */}
        <div className="relative max-w-5xl mx-auto group">
          
          {/* Effet Glow derrière */}
          <div className="absolute -inset-4 bg-gradient-to-r from-blue-600 via-violet-600 to-pink-600 rounded-3xl blur-2xl opacity-20 group-hover:opacity-30 transition duration-500"></div>
          
          {/* MacBook Frame */}
          <div className="relative bg-slate-900 rounded-2xl shadow-2xl overflow-hidden border-8 border-slate-800">
            
            {/* Top Bar MacOS */}
            <div className="bg-slate-800 px-4 py-2.5 flex items-center gap-2 border-b border-slate-700">
              <div className="flex gap-1.5">
                <div className="w-3 h-3 rounded-full bg-red-500" />
                <div className="w-3 h-3 rounded-full bg-yellow-500" />
                <div className="w-3 h-3 rounded-full bg-green-500" />
              </div>
            </div>

            {/* Zone Vidéo Thumbnail */}
            <div 
              className="relative aspect-video bg-slate-900 cursor-pointer overflow-hidden"
              onClick={() => setIsVideoOpen(true)}
            >
              
              {/* THUMBNAIL IMAGE */}
              <img 
                src="/images/dashboard1.png" 
                alt="Aperçu de la génération d'ebook"
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              {/* Overlay gradient au hover */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>

              {/* Bouton Play */}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="relative flex items-center justify-center">
                  {/* Glow pulsant */}
                  <div className="absolute w-32 h-32 bg-gradient-to-r from-blue-500 to-violet-500 rounded-full blur-2xl opacity-50 animate-pulse"></div>
                  
                  {/* Cercle Play */}
                  <div className="relative w-20 h-20 bg-gradient-to-br from-blue-600 to-violet-600 rounded-full flex items-center justify-center shadow-2xl transform transition-transform duration-300 group-hover:scale-110">
                    <Play className="w-8 h-8 text-white ml-1" fill="white" />
                  </div>
                </div>
              </div>

              {/* Badge durée */}
              <div className="absolute bottom-6 right-6 bg-black/80 backdrop-blur-sm text-white text-sm font-semibold px-4 py-2 rounded-lg border border-white/10 shadow-lg flex items-center gap-2">
                <Clock className="w-4 h-4" />
                <span></span>
              </div>
            </div>

            {/* Bottom Bar MacBook */}
            <div className="h-1 bg-slate-800"></div>
          </div>

          {/* MacBook Base */}
          <div className="relative mx-auto w-[95%] h-4 bg-gradient-to-b from-slate-800 to-slate-700 rounded-b-xl shadow-lg"></div>
          <div className="relative mx-auto w-[70%] h-2 bg-slate-600/50 rounded-b-lg"></div>

          {/* STATS FLOTTANTES */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 mt-12 max-w-3xl mx-auto">
            {[
              { label: "Temps total", icon: Zap, value: "< 60 sec", color: "text-blue-600", bgColor: "bg-blue-100" },
              { label: "Kit complet", icon: Package, value: "eBook + 3", color: "text-violet-600", bgColor: "bg-violet-100" },
              { label: "Automatisé", icon: Sparkles, value: "100%", color: "text-pink-600", bgColor: "bg-pink-100" },
            ].map((stat, i) => (
              <div key={i} className="bg-white/60 backdrop-blur border border-white shadow-sm rounded-xl p-3 sm:p-4 text-center hover:bg-white hover:scale-105 transition-all">
                <div className={`w-8 h-8 sm:w-10 sm:h-10 ${stat.bgColor} rounded-lg flex items-center justify-center mx-auto mb-2`}>
                  <stat.icon className={`w-4 h-4 sm:w-5 sm:h-5 ${stat.color}`} />
                </div>
                <p className={`text-xl sm:text-2xl font-black ${stat.color}`}>{stat.value}</p>
                <p className="text-xs sm:text-sm text-slate-500 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>

        </div>

       

        {/* CTA */}
        <div className="mt-12 text-center">
          <Link
            href="/auth/register"
            className="group inline-flex items-center justify-center gap-2 px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-Black-700 text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-xl transition-all hover:scale-105"
          >
            <span>Créer mon eBook </span>
          </Link>
        </div>

      </div>

      {/* MODAL VIDEO */}
      {isVideoOpen && (
        <div 
          className="fixed inset-0 z-[100] bg-slate-900/90 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in duration-200"
          onClick={() => setIsVideoOpen(false)}
        >
          <div className="relative w-full max-w-6xl aspect-video bg-black rounded-xl overflow-hidden shadow-2xl ring-1 ring-white/10">
            <button
              onClick={() => setIsVideoOpen(false)}
              className="absolute top-4 right-4 z-50 w-10 h-10 bg-black/50 hover:bg-black/70 text-white rounded-full flex items-center justify-center backdrop-blur transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
            <video controls autoPlay className="w-full h-full object-contain">
               <source src="/images/videolive.mp4" type="video/mp4" />
            </video>
          </div>
        </div>
      )}

      <style jsx>{`
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        @keyframes pulse-slow {
          0%, 100% { transform: scale(1); opacity: 0.3; }
          50% { transform: scale(1.05); opacity: 0.5; }
        }
        .animate-pulse-slow {
          animation: pulse-slow 4s ease-in-out infinite;
        }
      `}</style>
    </section>
  );
}