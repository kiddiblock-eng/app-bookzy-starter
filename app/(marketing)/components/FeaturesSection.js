"use client";

import React, { useEffect, useRef } from "react";
import { Sparkles, TrendingUp, Target, ArrowRight, Check, BarChart3, Users, FileText } from "lucide-react";
import Link from "next/link";

/* 🎥 Cloudinary Video avec autoplay intelligent + POSTER (Fix écran noir) */
function CloudinaryVideo({ publicId, className, alt = "Feature video" }) {
  const ref = useRef(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) el.play().catch(() => {});
        else el.pause();
      },
      { threshold: 0.3 }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  const cloudName = "dcmlw5hak";
  
  // 1. URL de la vidéo
  const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto,w_1200/${publicId}.mp4`;

  // 2. ✅ URL de l'image "Poster" (Première frame de la vidéo)
  // so_0 = Start Offset 0 (Première image)
  // .jpg = On veut une image, pas une vidéo
  const posterUrl = `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto,w_1200,so_0/${publicId}.jpg`;

  return (
    <video 
      ref={ref} 
      src={videoUrl}
      poster={posterUrl} // 👈 C'est ça qui supprime l'écran noir
      className={`${className} bg-slate-50`} // On met un fond clair au cas où
      muted 
      loop 
      playsInline 
      preload="metadata" 
      title={alt}
    />
  );
}
/* 💎 Bloc Premium OPTIMISÉ */
function PremiumBlock({ children, color = "blue" }) {
  const gradients = {
    blue: "from-blue-400/20 to-cyan-400/20",
    orange: "from-orange-400/20 to-red-400/20",
    purple: "from-purple-400/20 to-pink-400/20"
  };

  const borderColors = {
    blue: "group-hover:border-blue-200",
    orange: "group-hover:border-orange-200",
    purple: "group-hover:border-purple-200"
  };

  return (
    <div className="relative group">
      <div className={`absolute -inset-1 bg-gradient-to-r ${gradients[color]} rounded-[2rem] blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500`} />
      <div className={`relative rounded-[1.5rem] overflow-hidden bg-white shadow-xl border border-gray-100 ${borderColors[color]} transition-all duration-300 group-hover:scale-[1.01]`}>
        <div className="p-2 bg-white">
          <div className="relative rounded-xl overflow-hidden bg-gray-900 aspect-video">
            {children}
            <div className="absolute inset-0 shadow-[inset_0_0_15px_rgba(0,0,0,0.3)] pointer-events-none" />
          </div>
        </div>
      </div>
    </div>
  );
}

export default function MainFeaturesSection() {
  return (
    <section id="features" className="bg-white py-24 relative overflow-hidden">
      
      {/* BACKGROUND SIMPLIFIÉ */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-50 via-white to-slate-50"></div>

      <div className="max-w-7xl mx-auto px-6 relative z-10">

        {/* ========== HEADER ========== */}
        <div className="text-center mb-24 relative">
          <div className="inline-flex items-center gap-2 bg-slate-900 text-white px-4 py-1.5 rounded-full mb-6 shadow-lg text-sm font-medium">
            <span>L'outil Tout-en-Un</span>
          </div>

          <h2 className="text-4xl md:text-6xl font-black text-slate-900 tracking-tighter mb-6 leading-[1.1]">
            Plus qu'un simple générateur,<br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-600">
              votre plume automatisée.
            </span>
          </h2>

          <p className="text-slate-600 text-lg max-w-2xl mx-auto leading-relaxed">
            Arrêtez de lutter avec la page blanche. Bookzy rédige votre livre, met en page votre PDF et écrit vos textes de vente en 1 minute.
          </p>
        </div>

        {/* ========== FEATURE 1 - GÉNÉRATEUR ========== */}
        <div className="mb-32 relative group">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* VISUEL */}
            <div className="order-1 lg:order-2 relative">
              <PremiumBlock color="blue">
                <CloudinaryVideo 
                  publicId="generator_bsjysh" 
                  className="w-full h-full object-cover" 
                  alt="Générateur eBook" 
                />
              </PremiumBlock>
            </div>

            {/* TEXTE */}
            <div className="order-2 lg:order-1">
              <div className="flex items-center gap-3 mb-6">
                <span className="flex items-center justify-center w-10 h-10 rounded-lg bg-blue-100 text-blue-700 font-bold text-xl border border-blue-200">1</span>
                <h3 className="text-3xl font-bold text-slate-900">Le Rédacteur IA</h3>
              </div>

              <h4 className="text-xl md:text-2xl font-semibold text-slate-700 mb-6">
                Un contenu expert et structuré <br/>
                <span className="text-blue-600">prêt à être vendu.</span>
              </h4>

              {/* SOCIAL PROOF CARD */}
              <div className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 p-5 rounded-2xl shadow-lg mb-8 hover:scale-105 transition-transform">
                <div className="flex items-center gap-4">
                  <div className="bg-green-500 p-3 rounded-full shadow-lg">
                    <Check className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="font-bold text-slate-900 text-lg">100% Contenu Original</p>
                    <p className="text-green-700 text-sm font-semibold">Propriété garantie • Aucun plagiat</p>
                  </div>
                </div>
              </div>

              {/* LISTE BÉNÉFICES */}
              <div className="space-y-4 mb-8">
                {[
                  "Ebook complet structuré (Chapitres, Intro, Conclusion)",
                  "PDF professionnel prêt à télécharger",
                  "Textes pour Facebook & WhatsApp inclus",
                  "Description pour page de vente rédigée"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3 group/item">
                    <div className="flex-shrink-0 w-6 h-6 rounded-full bg-blue-600 flex items-center justify-center group-hover/item:scale-110 transition-transform">
                      <Check className="w-3.5 h-3.5 text-white" />
                    </div>
                    <span className="text-slate-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>

              <Link href="https://app.bookzy.io/auth/register" className="inline-flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-blue-500/30">
                Commencer la rédaction 
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ========== FEATURE 2 - TENDANCE ========== */}
        <div className="mb-32 relative group">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* VISUEL - Image statique car c'est une capture */}
            <div className="order-1 relative">
              <PremiumBlock color="orange">
                <img 
                  src="/images/tendance.png" 
                  alt="Module Tendances" 
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
              </PremiumBlock>

              {/* Stat card flottante */}
              <div className="absolute -right-6 -bottom-6 bg-white p-4 rounded-xl shadow-2xl border-2 border-orange-200 hidden md:block">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gradient-to-br from-orange-500 to-red-500 rounded-full flex items-center justify-center shadow-lg">
                    <TrendingUp className="w-5 h-5 text-white" />
                  </div>
                  <div>
                    <p className="text-xs text-slate-500 font-medium">Tendance actuelle</p>
                    <p className="font-black text-slate-900 text-lg">+320% engagement</p>
                  </div>
                </div>
              </div>
            </div>

            {/* TEXTE */}
            <div className="order-2">
              <div className="inline-flex items-center gap-2 bg-orange-50 text-orange-700 px-3 py-1 rounded-md mb-4 text-xs font-bold uppercase tracking-wider border border-orange-200">
                <TrendingUp className="w-3 h-3" />
                Module Tendance
              </div>

              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Ne devinez plus. <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-red-600">Copiez ce qui marche.</span>
              </h3>

              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Notre algorithme scanne Facebook, TikTok et Google en temps réel pour détecter les sujets viraux avant tout le monde.
              </p>

              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200 hover:scale-105 transition-transform">
                  <div className="text-2xl mb-2">🕵️‍♂️</div>
                  <p className="font-bold text-slate-900 text-sm">Espionnage Légal</p>
                  <p className="text-slate-500 text-xs">Voyez les sujets qui buzzent</p>
                </div>
                <div className="bg-gradient-to-br from-orange-50 to-red-50 p-4 rounded-xl border-2 border-orange-200 hover:scale-105 transition-transform">
                  <div className="text-2xl mb-2">🌍</div>
                  <p className="font-bold text-slate-900 text-sm">Global Data</p>
                  <p className="text-slate-500 text-xs">Données Francophonie</p>
                </div>
              </div>
              
              <Link href="https://app.bookzy.io/auth/register" className="inline-flex items-center gap-2 px-6 py-3 bg-orange-600 hover:bg-orange-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-orange-500/30">
                Explorer les tendances
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>

        {/* ========== FEATURE 3 - NICHE HUNTER ========== */}
        <div className="relative group">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            
            {/* VISUEL */}
            <div className="order-1 lg:order-2 relative">
              <PremiumBlock color="purple">
                <CloudinaryVideo 
                  publicId="nichehunternew_psydjb" 
                  className="w-full h-full object-cover" 
                  alt="Niche Hunter" 
                />
              </PremiumBlock>
            </div>

            {/* TEXTE */}
            <div className="order-2 lg:order-1">
              <div className="inline-flex items-center gap-2 bg-purple-50 text-purple-700 px-3 py-1 rounded-md mb-4 text-xs font-bold uppercase tracking-wider border border-purple-200">
                <Target className="w-3 h-3" />
                Niche Hunter AI
              </div>

              <h3 className="text-3xl font-bold text-slate-900 mb-4">
                Syndrome de la page blanche ? <br/>
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-purple-500 to-pink-600">C'est du passé.</span>
              </h3>

              <p className="text-slate-600 text-lg mb-8 leading-relaxed">
                Entrez un simple mot-clé (ex: "Freelance") et laissez l'IA générer 10 idées uniques, rentables et peu concurrentielles.
              </p>

              {/* Card analyse */}
              <div className="bg-gradient-to-br from-purple-50 to-pink-50 border-2 border-purple-200 rounded-2xl p-6 shadow-lg">
                <p className="font-bold text-slate-900 mb-4 flex items-center gap-2">
                  <Sparkles className="w-5 h-5 text-purple-600" />
                  L'analyse comprend :
                </p>
                <div className="space-y-3">
                  {[
                    { icon: TrendingUp, text: "Score de rentabilité sur 10" },
                    { icon: BarChart3, text: "Analyse concurrence détaillée" },
                    { icon: Users, text: "Profil cible marketing" },
                    { icon: FileText, text: "Plan de contenu suggéré" }
                  ].map((feat, i) => (
                    <div key={i} className="flex items-center gap-3 text-sm group/item">
                      <div className="w-8 h-8 bg-white rounded-lg flex items-center justify-center border border-purple-200 group-hover/item:scale-110 transition-transform">
                        <feat.icon className="w-4 h-4 text-purple-600" />
                      </div>
                      <span className="text-slate-700 font-medium">{feat.text}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="mt-8">
                <Link href="https://app.bookzy.io/auth/register" className="inline-flex items-center gap-2 px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-xl font-semibold transition-all hover:scale-105 shadow-lg shadow-purple-500/30">
                  Découvrir ma niche
                  <ArrowRight className="w-4 h-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}