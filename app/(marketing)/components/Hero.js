"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, BookOpen, Zap, Store, Paperclip, ArrowRight, BookAIcon } from 'lucide-react';
import Link from 'next/link';

const featuresCreate = [
  {
    id: "generation",
    title: "Génération IA",
    description: "Décris ton sujet, choisis ton template, ton ton et ton audience. L'IA rédige un ebook complet avec sommaire, chapitres et cover 3D ,prêt à vendre en moins d'une minute.",
    image: "/screenshots/generation-ia.png",
    bgColor: "bg-gradient-to-br from-sky-100 to-blue-200",
    link: "/auth/register",
    learnMore: "/auth/register"
  },
  {
    id: "express",
    title: "Ebook Designer",
    description: "Tu as déjà ton contenu ? Écris-le dans l'éditeur ou importe ton fichier Word (.docx). Bookzy génère un PDF au design professionnel en moins de 20 secondes, sans effort.",
    image: "/screenshots/express.png",
    bgColor: "bg-gradient-to-br from-emerald-100 to-teal-200",
    link: "/auth/register",
    learnMore: "/express"
  },
  {
    id: "smartshop",
    title: "Smart Shop",
    description: "Crée ta boutique en ligne en quelques clics. Choisis parmi 13 templates, configure ton lien, ajoute tes ebooks et vends via WhatsApp, lien externe ou téléchargement gratuit.",
    image: "/screenshots/smart-shop.png",
    bgColor: "bg-gradient-to-br from-violet-100 to-purple-200",
    link: "/auth/register",
    learnMore: "/smart-shop"
  }
];

const featuresResearch = [
  {
    id: "niche-hunter",
    title: "Niche Hunter",
    description: "Entre un thème, choisis ton marché (Afrique ou International). L'IA analyse le potentiel, la difficulté et la concurrence pour chaque niche et tu crées ton ebook en 1 clic.",
    image: "/screenshots/niche-hunter.png",
    bgColor: "bg-gradient-to-br from-amber-100 to-orange-200",
    link: "/niche-hunter",
    learnMore: "/niche-hunter"
  },
  {
    id: "tendances",
    title: "Tendances",
    description: "Découvre en temps réel ce qui buzz sur TikTok, Instagram, YouTube et Facebook. Filtre par catégorie, réseau ou difficulté et lance la création de ton ebook directement depuis la tendance.",
    image: "/screenshots/tendances.png",
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-200",
    link: "/tendances",
    learnMore: "/tendances"
  },
  {
    id: "youbook",
    title: "Youbook",
    description: "Colle le lien d'une vidéo YouTube formation, podcast, conférence ou tutoriel. L'IA extrait le contenu, le structure en chapitres et génère un ebook complet prêt à publier.",
    image: "/screenshots/youbook.png",
    bgColor: "bg-gradient-to-br from-red-100 to-rose-200",
    link: "/youbook",
    learnMore: "/youbook"
  }
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

function FeatureCard({ feature }) {
  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden border border-[#C8BFB0] hover:border-slate-400 transition-all duration-300 hover:shadow-lg relative"
      style={{ background: '#F5F2ED' }}
    >
      {/* Grain texture */}
      <div
        className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: 'repeat', backgroundSize: '128px' }}
      />

      {/* Image zone */}
      <Link href={feature.link} className="relative z-10 block">
        <div className="relative overflow-hidden border-b border-[#C8BFB0]" style={{ aspectRatio: '4/3' }}>
          <div className={`absolute inset-0 ${feature.bgColor} opacity-60`} />
          <img
            src={feature.image}
            alt={feature.title}
            className="relative z-10 w-full h-full object-cover object-top group-hover:scale-[1.03] transition-transform duration-500"
          />
        </div>
      </Link>

      {/* Contenu */}
      <div className="relative z-10 flex flex-col flex-1 p-5 sm:p-6">
        {/* Label uppercase style Smart Shop */}
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
          {feature.id === 'generation' && 'Génération IA'}
          {feature.id === 'express' && 'Mise en page'}
          {feature.id === 'smartshop' && 'Boutique en ligne'}
          {feature.id === 'niche-hunter' && 'Recherche de niche'}
          {feature.id === 'tendances' && 'Veille marché'}
          {feature.id === 'youbook' && 'Conversion YouTube'}
        </p>

        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-3">
          {feature.title}
        </h3>

        <p className="text-slate-500 text-sm sm:text-base leading-relaxed flex-1">
          {feature.description}
        </p>

        {/* Divider */}
        <div className="w-full h-px bg-[#C8BFB0] my-4" />

        {/* Bouton En savoir plus */}
        <Link
          href={feature.learnMore}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#C8BFB0] bg-white text-slate-700 font-bold rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all text-xs uppercase tracking-widest self-start"
        >
          En savoir plus
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}

export default function HeroAndFeatures() {
  const router = useRouter();
  const [sujet, setSujet] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    if (sujet.trim()) {
      router.push(`/auth/register?suggestion=${encodeURIComponent(sujet)}`);
    } else {
      router.push('/auth/register');
    }
  };

  return (
    <>
      {/* ═══════════════════════════════════════════════════════════════
          HERO — fond bleu ciel + style Smart Shop
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #7DD3FC 0%, #BAE6FD 25%, #E0F2FE 55%, #BFDBFE 80%, #93C5FD 100%)',
          paddingTop: 'env(safe-area-inset-top, 0px)',
        }}
      >
        {/* Grain texture Smart Shop */}
        <div
          className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
          style={{ backgroundImage: GRAIN, backgroundRepeat: 'repeat', backgroundSize: '128px' }}
        />

        {/* Cercles décoratifs style Smart Shop */}
        <div className="absolute top-20 right-[-80px] w-[380px] h-[380px] rounded-full border border-white/30 opacity-50 pointer-events-none z-0" />
        <div className="absolute bottom-[-60px] left-[-100px] w-[300px] h-[300px] rounded-full bg-white/10 opacity-40 pointer-events-none z-0" />

        {/* Contenu Hero */}
        <div
          className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 pb-40"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 80px)' }}
        >

          {/* Badge social proof — style Smart Shop */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/60 rounded-full mb-8 shadow-sm">
            <div className="flex -space-x-2">
              <img src="https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
              <img src="https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
              <img src="https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-700">
              <span className="text-slate-900">7 300+</span> créateurs
            </span>
          </div>

          {/* Titre — typo black style Smart Shop */}
          <h1 className="text-center max-w-4xl mb-6">
            <span className="block font-black text-slate-900 leading-[0.92] tracking-tight" style={{ fontSize: 'clamp(2.8rem, 9vw, 6.5rem)' }}>
              La <em className="italic font-serif">machine</em>
            </span>
            <span className="block font-black text-slate-900 leading-[0.92] tracking-tight mt-2" style={{ fontSize: 'clamp(2.8rem, 9vw, 6.5rem)' }}>
              qui trouve et crée
            </span>
            <span className="block font-black text-slate-900 leading-[0.92] tracking-tight mt-2" style={{ fontSize: 'clamp(2.8rem, 9vw, 6.5rem)' }}>
              des ebooks en <span className="text-blue-700">60s</span>
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-center text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
            Générez votre ebook avec l'IA, obtenez un design professionnel et vendez-le instantanément grâce à votre boutique Bookzy.
          </p>

          {/* Formulaire — style Smart Shop */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/70 shadow-lg p-4 sm:p-5">
              <input
                type="text"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                placeholder="Décris le sujet de ton ebook..."
                className="w-full text-slate-900 placeholder:text-slate-400 text-base sm:text-lg bg-transparent border-0 focus:outline-none focus:ring-0 mb-4"
              />
              <div className="flex items-center justify-between">
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100/60 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button type="submit" className="w-10 h-10 bg-slate-900 hover:bg-slate-800 rounded-full flex items-center justify-center text-white transition-colors shadow-md">
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Tags — style Smart Shop pills */}
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Commencer par</p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/60 hover:border-slate-300 hover:bg-white rounded-xl text-xs font-bold uppercase tracking-widest text-slate-700 transition-all shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                Générer avec l'IA
              </button>
              <button onClick={() => router.push('/express')} className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/60 hover:border-slate-300 hover:bg-white rounded-xl text-xs font-bold uppercase tracking-widest text-slate-700 transition-all shadow-sm">
                <BookAIcon className="w-3.5 h-3.5 text-amber-500" />
                Ebook Designer
              </button>
              <button onClick={() => router.push('/smart-shop')} className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/60 hover:border-slate-300 hover:bg-white rounded-xl text-xs font-bold uppercase tracking-widest text-slate-700 transition-all shadow-sm">
                <Store className="w-3.5 h-3.5 text-emerald-500" />
                Smart Shop
              </button>
            </div>
          </div>
        </div>

        {/* ═══════════════════════════════════════════════════════════════
            VAGUE SVG — colle au bas du Hero, mange le blanc en dessous
            Même technique que Dokie / Linear / Vercel
        ═══════════════════════════════════════════════════════════════ */}
        <div className="absolute bottom-0 left-0 right-0 z-20" style={{ lineHeight: 0 }}>
          <svg
            viewBox="0 0 1440 120"
            xmlns="http://www.w3.org/2000/svg"
            preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '120px' }}
          >
            <path
              d="M0,40 C180,100 360,0 540,60 C720,120 900,20 1080,70 C1260,120 1350,50 1440,60 L1440,120 L0,120 Z"
              fill="white"
            />
          </svg>
        </div>
      </section>

      {/* ═══════════════════════════════════════════════════════════════
          FEATURES — fond blanc, commence exactement là où la vague finit
      ═══════════════════════════════════════════════════════════════ */}
      <section id="features" className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 pb-16 lg:pb-24">

          {/* Header Section 1 */}
          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-4 lg:mb-6">
              La plateforme IA{' '}
              <span className="relative inline-block">
                <span className="relative z-10">#1</span>
                <span
                  className="absolute inset-x-0 bottom-1 h-3 lg:h-4 -z-0 rounded"
                  style={{ background: 'linear-gradient(90deg, #93C5FD, #60A5FA)' }}
                />
              </span>{' '}
              pour créer et vendre des ebooks
            </h2>
            <p className="text-slate-500 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
              Génération IA, mise en page professionnelle, boutique intégrée,tout ce dont tu as besoin, en un seul endroit.
            </p>
          </div>

          {/* Cards Création */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
            {featuresCreate.map((feature) => (
              <FeatureCard key={feature.id} feature={feature} />
            ))}
          </div>

          {/* Section 2 */}
          <div className="mt-24 lg:mt-36">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-4 lg:mb-6">
                Détectez les niches rentables avant tout le monde.
              </h2>
              <p className="text-slate-500 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
                Analysez le marché, découvrez les tendances et créez des ebooks sur des sujets rentables.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuresResearch.map((feature) => (
                <FeatureCard key={feature.id} feature={feature} />
              ))}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20 lg:mt-28">
            <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 lg:px-10 lg:py-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base lg:text-lg rounded-full transition-all">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </Link>
          </div>

        </div>
      </section>
    </>
  );
}