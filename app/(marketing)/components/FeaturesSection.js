"use client";

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowUp, BookOpen, Zap, Store, Paperclip, ArrowRight } from 'lucide-react';
import Link from 'next/link';

const featuresCreate = [
  {
    id: "generation",
    title: "Génération IA",
    description: "Décris ton sujet, choisis ton template, ton ton et ton audience. L'IA rédige un ebook complet avec sommaire, chapitres et cover 3D — prêt à vendre en moins d'une minute.",
    image: "/screenshots/generation-ia.png",
    bgColor: "bg-gradient-to-br from-sky-100 to-blue-200",
    link: "/auth/register"
  },
  {
    id: "express",
    title: "Mise en page Express",
    description: "Tu as déjà ton contenu ? Écris-le dans l'éditeur ou importe ton fichier Word (.docx). Bookzy génère un PDF au design professionnel en moins de 20 secondes, sans effort.",
    image: "/screenshots/express.png",
    bgColor: "bg-gradient-to-br from-emerald-100 to-teal-200",
    link: "/auth/register"
  },
  {
    id: "smartshop",
    title: "Smart Shop",
    description: "Crée ta boutique en ligne en quelques clics. Choisis parmi 13 templates, configure ton lien, ajoute tes ebooks et vends via WhatsApp, lien externe ou téléchargement gratuit.",
    image: "/screenshots/smart-shop.png",
    bgColor: "bg-gradient-to-br from-violet-100 to-purple-200",
    link: "/auth/register"
  }
];

const featuresResearch = [
  {
    id: "niche-hunter",
    title: "Niche Hunter",
    description: "Entre un thème, choisis ton marché (Afrique ou International). L'IA analyse le potentiel, la difficulté et la concurrence pour chaque niche — et tu crées ton ebook en 1 clic.",
    image: "/screenshots/niche-hunter.png",
    bgColor: "bg-gradient-to-br from-amber-100 to-orange-200",
    link: "/niche-hunter"
  },
  {
    id: "tendances",
    title: "Tendances",
    description: "Découvre en temps réel ce qui buzz sur TikTok, Instagram, YouTube et Facebook. Filtre par catégorie, réseau ou difficulté et lance la création de ton ebook directement depuis la tendance.",
    image: "/screenshots/tendances.png",
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-200",
    link: "/tendances"
  },
  {
    id: "youbook",
    title: "Youbook",
    description: "Colle le lien d'une vidéo YouTube — formation, podcast, conférence ou tutoriel. L'IA extrait le contenu, le structure en chapitres et génère un ebook complet prêt à publier.",
    image: "/screenshots/youbook.png",
    bgColor: "bg-gradient-to-br from-red-100 to-rose-200",
    link: "/youbook"
  }
];

function FeatureCard({ feature }) {
  return (
    <Link
      href={feature.link}
      className="group block rounded-3xl overflow-hidden border border-slate-200/50 bg-white shadow-sm hover:shadow-xl transition-all duration-300"
    >
      <div className={`${feature.bgColor} p-4 lg:p-6 aspect-[4/3] flex items-center justify-center overflow-hidden`}>
        <div className="relative w-full h-full rounded-xl lg:rounded-2xl overflow-hidden shadow-2xl border border-white/20">
          <img
            src={feature.image}
            alt={feature.title}
            className="w-full h-full object-cover object-top group-hover:scale-105 transition-transform duration-500"
          />
        </div>
      </div>
      <div className="p-5 sm:p-6 lg:p-7">
        <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 mb-2 lg:mb-3 group-hover:text-blue-600 transition-colors">
          {feature.title}
        </h3>
        <p className="text-slate-500 text-sm sm:text-base lg:text-lg leading-relaxed">
          {feature.description}
        </p>
      </div>
    </Link>
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
          HERO — fond bleu ciel
      ═══════════════════════════════════════════════════════════════ */}
      <section
        className="relative overflow-hidden"
        style={{
          background: 'linear-gradient(180deg, #7DD3FC 0%, #BAE6FD 25%, #E0F2FE 55%, #BFDBFE 80%, #93C5FD 100%)'
        }}
      >
        {/* Nuages décoratifs */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute top-20 left-10 w-64 h-32 rounded-full opacity-60 blur-3xl" style={{ background: 'rgba(255,255,255,0.8)' }} />
          <div className="absolute top-40 right-20 w-96 h-40 rounded-full opacity-50 blur-3xl" style={{ background: 'rgba(255,255,255,0.7)' }} />
          <div className="absolute bottom-60 left-1/4 w-80 h-32 rounded-full opacity-40 blur-3xl" style={{ background: 'rgba(255,255,255,0.6)' }} />
        </div>

        {/* Contenu Hero */}
        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 pt-24 pb-40">

          {/* Social proof */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/80 backdrop-blur-sm border border-white/50 rounded-full mb-8 shadow-sm">
            <div className="flex -space-x-2">
              <img src="/T4.jpg" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
              <img src="/T5.jpg" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
              <img src="/t1.jpg" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
            </div>
            <span className="text-sm text-slate-700">
              <span className="font-semibold text-slate-900">3,500+</span> créateurs nous font confiance
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-center max-w-4xl mb-6">
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight">
              Une façon plus <em className="italic font-serif">intelligente</em>
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight mt-1 sm:mt-2">
              de créer et vendre ton ebook
            </span>
            <span className="block text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold text-slate-900 leading-[1.15] tracking-tight mt-1 sm:mt-2">
              en <span className="text-blue-700">60 secondes</span>
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-center text-base sm:text-lg text-slate-700 max-w-2xl mb-10 leading-relaxed">
            Générez votre ebook avec l'IA, obtenez un design professionnel et vendez-le instantanément grâce à votre boutique Bookzy.
          </p>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
            <div className="bg-white rounded-2xl shadow-xl border border-white/50 p-4 sm:p-5">
              <input
                type="text"
                value={sujet}
                onChange={(e) => setSujet(e.target.value)}
                placeholder="Décris le sujet de ton ebook..."
                className="w-full text-slate-900 placeholder:text-slate-400 text-base sm:text-lg bg-transparent border-0 focus:outline-none focus:ring-0 mb-4"
              />
              <div className="flex items-center justify-between">
                <button type="button" className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-colors">
                  <Paperclip className="w-5 h-5" />
                </button>
                <button type="submit" className="w-10 h-10 bg-blue-500 hover:bg-blue-600 rounded-full flex items-center justify-center text-white transition-colors shadow-lg shadow-blue-500/30">
                  <ArrowUp className="w-5 h-5" />
                </button>
              </div>
            </div>
          </form>

          {/* Tags */}
          <div className="text-center">
            <p className="text-sm text-slate-600 mb-4">Commencer par :</p>
            <div className="flex flex-wrap items-center justify-center gap-3">
              <button onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-white/70 rounded-full text-sm font-medium text-slate-700 transition-all shadow-sm">
                <BookOpen className="w-4 h-4 text-blue-500" />
                Générer avec l'IA
              </button>
              <button onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-white/70 rounded-full text-sm font-medium text-slate-700 transition-all shadow-sm">
                <Zap className="w-4 h-4 text-amber-500" />
                Mise en page Express
              </button>
              <button onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-4 py-2.5 bg-white hover:bg-slate-50 border border-white/70 rounded-full text-sm font-medium text-slate-700 transition-all shadow-sm">
                <Store className="w-4 h-4 text-emerald-500" />
                Créer ma boutique
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
              Génération IA, mise en page professionnelle, boutique intégrée — tout ce dont tu as besoin, en un seul endroit.
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
                Trouvez les idées qui cartonnent
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