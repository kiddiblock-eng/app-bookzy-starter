"use client";
import React from "react";
import {
  Zap,
  Globe2,
  ShieldCheck,
  Headphones,
  Palette,
  Rocket,
  BookOpen,
} from "lucide-react";

const Items = () => (
  <>
    <div className="group flex items-center gap-3 mr-16 hover:scale-105 transition-transform duration-300">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:shadow-blue-500/50 transition-shadow">
        <Zap className="text-white w-5 h-5" />
      </div>
      <span className="font-semibold text-gray-900">Ultra rapide</span>
    </div>
    
    <div className="group flex items-center gap-3 mr-16 hover:scale-105 transition-transform duration-300">
      <div className="w-10 h-10 bg-gradient-to-br from-cyan-500 to-blue-600 rounded-xl flex items-center justify-center shadow-lg shadow-cyan-500/30 group-hover:shadow-cyan-500/50 transition-shadow">
        <Globe2 className="text-white w-5 h-5" />
      </div>
      <span className="font-semibold text-gray-900">150+ pays</span>
    </div>
    
    <div className="group flex items-center gap-3 mr-16 hover:scale-105 transition-transform duration-300">
      <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-emerald-600 rounded-xl flex items-center justify-center shadow-lg shadow-green-500/30 group-hover:shadow-green-500/50 transition-shadow">
        <ShieldCheck className="text-white w-5 h-5" />
      </div>
      <span className="font-semibold text-gray-900">100% sécurisé</span>
    </div>
    
    <div className="group flex items-center gap-3 mr-16 hover:scale-105 transition-transform duration-300">
      <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-pink-600 rounded-xl flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:shadow-purple-500/50 transition-shadow">
        <Headphones className="text-white w-5 h-5" />
      </div>
      <span className="font-semibold text-gray-900">Support 24/7</span>
    </div>
    
    <div className="group flex items-center gap-3 mr-16 hover:scale-105 transition-transform duration-300">
      <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-600 rounded-xl flex items-center justify-center shadow-lg shadow-orange-500/30 group-hover:shadow-orange-500/50 transition-shadow">
        <Palette className="text-white w-5 h-5" />
      </div>
      <span className="font-semibold text-gray-900">Résultats pro</span>
    </div>
    
    <div className="group flex items-center gap-3 mr-16 hover:scale-105 transition-transform duration-300">
      <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-shadow">
        <Rocket className="text-white w-5 h-5" />
      </div>
      <span className="font-semibold text-gray-900">Instantané</span>
    </div>
    
    <div className="group flex items-center gap-3 mr-16 hover:scale-105 transition-transform duration-300">
      <div className="w-10 h-10 bg-gradient-to-br from-indigo-500 to-purple-600 rounded-xl flex items-center justify-center shadow-lg shadow-indigo-500/30 group-hover:shadow-indigo-500/50 transition-shadow">
        <BookOpen className="text-white w-5 h-5" />
      </div>
      <span className="font-semibold text-gray-900">+26k ebooks créés</span>
    </div>
  </>
);

export default function ScrollBar() {
  return (
    <section className="relative w-full bg-gradient-to-r from-slate-50 via-white to-slate-50 py-5 overflow-hidden border-y border-gray-200">
      
      {/* Gradient subtil en arrière-plan */}
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(59,130,246,0.08),transparent_70%)]" />
      
      {/* Grille de fond */}
      <div className="absolute inset-0 bg-grid-pattern opacity-[0.02]" />

      {/* Rail de défilement */}
      <div className="relative">
        <div className="marquee flex w-max items-center text-sm sm:text-base whitespace-nowrap">
          {/* Bande A */}
          <div className="flex items-center">
            <Items />
          </div>
          {/* Bande B (dupliquée) */}
          <div className="flex items-center" aria-hidden="true">
            <Items />
          </div>
        </div>
      </div>

      <style jsx>{`
        .marquee {
          animation: scroll 35s linear infinite;
        }
        
        .marquee:hover {
          animation-play-state: paused;
        }
        
        @keyframes scroll {
          0% {
            transform: translateX(0);
          }
          100% {
            transform: translateX(-50%);
          }
        }
        
        .bg-grid-pattern {
          background-image: 
            linear-gradient(rgba(59, 130, 246, 0.1) 1px, transparent 1px),
            linear-gradient(90deg, rgba(59, 130, 246, 0.1) 1px, transparent 1px);
          background-size: 50px 50px;
        }
      `}</style>
    </section>
  );
}