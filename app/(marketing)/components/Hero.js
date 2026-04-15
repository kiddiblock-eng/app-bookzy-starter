"use client";

import { useState } from 'react';
import { IllustrationGeneration, IllustrationDesigner, IllustrationRomans, IllustrationYoubook, IllustrationRadar, IllustrationNiche, IllustrationValidateur } from '@/app/(marketing)/components/FeatureIllustrations';
import { useRouter } from 'next/navigation';
import { ArrowUp, BookOpen, Paperclip, ArrowRight, BookAIcon } from 'lucide-react';
import Link from 'next/link';

const featuresCreate = [
  {
    id: "generation", illustration: IllustrationGeneration,
    title: "Génération IA",
    description: "Décris ton sujet, choisis ton style et ton audience. L'IA rédige un ebook complet avec sommaire, chapitres et cover 3D, prêt à vendre en moins d'une minute.",
    image: "/screenshots/generation-ia.png",
    bgColor: "bg-gradient-to-br from-sky-100 to-blue-200",
    link: "/auth/register",
    learnMore: "/auth/register"
  },
  {
    id: "express", illustration: IllustrationDesigner,
    title: "Ebook Designer",
    description: "Tu as déjà écrit ton ebook ? Importe ton fichier Word ou colle ton texte. Bookzy applique un design professionnel en 20 secondes. Zéro effort, résultat pro.",
    image: "/screenshots/express.png",
    bgColor: "bg-gradient-to-br from-emerald-100 to-teal-200",
    link: "/auth/register",
    learnMore: "/express"
  },
  {
    id: "romans", illustration: IllustrationRomans,
    title: "Romans IA",
    description: "Thriller, romance, fantasy, policier. Décris tes personnages, l'IA écrit le chapitre 1 gratuitement pour te convaincre. Tu valides, elle génère le roman complet en PDF.",
    image: "/screenshots/roman.png",
    bgColor: "bg-gradient-to-br from-pink-100 to-rose-200",
    link: "/auth/register",
    learnMore: "/auth/register"
  },
  {
    id: "youbook", illustration: IllustrationYoubook,
    title: "Youbook",
    description: "Colle le lien d'une vidéo YouTube — formation, podcast, tutoriel. L'IA extrait le contenu, le structure en chapitres et génère un ebook complet prêt à vendre en 1 clic.",
    image: "/screenshots/youbook.png",
    bgColor: "bg-gradient-to-br from-red-100 to-rose-200",
    link: "/auth/register",
    learnMore: "/auth/register"
  }
];

const featuresResearch = [
  {
    id: "niche-hunter", illustration: IllustrationNiche,
    title: "Niche Hunter",
    description: "Entre un mot-clé. Niche Hunter analyse les pubs Facebook actives, les recherches Google et le marché pour te sortir les produits qui se vendent en ce moment. Fini les idées dans le vide.",
    image: "/screenshots/niche-hunter.png",
    bgColor: "bg-gradient-to-br from-amber-100 to-orange-200",
    link: "/auth/register",
    learnMore: "/auth/register"
  },
  {
    id: "radar", illustration: IllustrationRadar,
    title: "Radar Cash",
    description: "Quand un annonceur dépense des semaines sur Facebook, c'est parce que son produit vend. Radar Cash surveille ces pubs et te dit exactement quels sujets génèrent des ventes maintenant.",
    image: "/screenshots/radar.png",
    bgColor: "bg-gradient-to-br from-cyan-100 to-blue-200",
    link: "/auth/register",
    learnMore: "/auth/register"
  },
  {
    id: "validateur", illustration: IllustrationValidateur,
    title: "Validateur d'idée",
    description: "Entre ton sujet. L'IA interroge Facebook Ads, Google Trends et les données de marché pour te donner un score de rentabilité sur 100, le niveau de concurrence réel et une estimation de revenus. Ce n'est pas une intuition, c'est de la data.",
    image: "/screenshots/validateur.png",
    bgColor: "bg-gradient-to-br from-violet-100 to-purple-200",
    link: "/auth/register",
    learnMore: "/auth/register"
  }
];

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

function FeatureCard({ feature }) {
  return (
    <div
      className="group flex flex-col rounded-2xl overflow-hidden border border-[#E8E8E8] hover:border-slate-400 transition-all duration-300 hover:shadow-lg relative"
      style={{ background: '#FAFAFA' }}
    >
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: 'repeat', backgroundSize: '128px' }} />

      <Link href={feature.link} className="relative z-10 block">
        <div className="relative overflow-hidden border-b border-[#E8E8E8]">
          {feature.illustration ? <feature.illustration /> : (
            <div className={`${feature.bgColor}`} style={{ aspectRatio: '4/3' }} />
          )}
        </div>
      </Link>

      <div className="relative z-10 flex flex-col flex-1 p-5 sm:p-6">
        <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-2">
          {feature.id === 'generation' && 'Génération IA'}
          {feature.id === 'express' && 'Mise en page'}
          {feature.id === 'romans' && 'Romans IA'}
          {feature.id === 'niche-hunter' && 'Recherche de niche'}
          {feature.id === 'radar' && 'Radar Cash'}
          {feature.id === 'validateur' && "Validateur d'idée"}
          {feature.id === 'youbook' && 'YouTube → Ebook'}
        </p>
        <h3 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight leading-tight mb-3">{feature.title}</h3>
        <p className="text-slate-500 text-sm sm:text-base leading-relaxed flex-1">{feature.description}</p>
        <div className="w-full h-px bg-[#E8E8E8] my-4" />
        <Link href={feature.learnMore}
          className="inline-flex items-center gap-2 px-5 py-2.5 border border-[#E8E8E8] bg-white text-slate-700 font-bold rounded-xl hover:border-slate-900 hover:text-slate-900 transition-all text-xs uppercase tracking-widest self-start">
          En savoir plus <ArrowRight className="w-3.5 h-3.5" />
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
      <section className="relative overflow-hidden" style={{
        background: 'linear-gradient(180deg, #7DD3FC 0%, #BAE6FD 25%, #E0F2FE 55%, #BFDBFE 80%, #93C5FD 100%)',
        paddingTop: 'env(safe-area-inset-top, 0px)',
      }}>
        <div className="absolute inset-0 opacity-[0.04] pointer-events-none z-0"
          style={{ backgroundImage: GRAIN, backgroundRepeat: 'repeat', backgroundSize: '128px' }} />
        <div className="absolute top-20 right-[-80px] w-[380px] h-[380px] rounded-full border border-white/30 opacity-50 pointer-events-none z-0" />
        <div className="absolute bottom-[-60px] left-[-100px] w-[300px] h-[300px] rounded-full bg-white/10 opacity-40 pointer-events-none z-0" />

        <div className="relative z-10 min-h-screen flex flex-col items-center justify-center px-5 sm:px-6 pb-40"
          style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 80px)' }}>

          {/* Badge */}
          <div className="flex items-center gap-3 px-4 py-2 bg-white/70 backdrop-blur-sm border border-white/60 rounded-full mb-8 shadow-sm">
            <div className="flex -space-x-2">
              <img src="https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
              <img src="https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
              <img src="https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg" className="w-7 h-7 rounded-full border-2 border-white object-cover" alt="" />
            </div>
            <span className="text-xs font-black uppercase tracking-[0.15em] text-slate-700">
              <span className="text-slate-900">7 800+</span> créateurs actifs
            </span>
          </div>

          {/* Titre */}
          <h1 className="text-center max-w-4xl mb-6">
            <span className="block font-black text-slate-900 leading-[0.92] tracking-tight" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>
              Trouvez et créez des
            </span>
            <span className="block font-black leading-[0.92] tracking-tight mt-2" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)', color: '#1d4ed8' }}>
              ebooks rentables
            </span>
            <span className="block font-black text-slate-900 leading-[0.92] tracking-tight mt-2" style={{ fontSize: 'clamp(2rem, 6vw, 4.5rem)' }}>
              en 60s
            </span>
          </h1>

          {/* Sous-titre */}
          <p className="text-center text-base sm:text-lg text-slate-600 max-w-xl mx-auto mb-10 leading-relaxed">
            Espionnez les produits qui se vendent sur Facebook, validez votre idée avec des données réelles et créez votre ebook pro en moins d'une minute.
          </p>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="w-full max-w-2xl mb-8">
            <div className="bg-white/80 backdrop-blur-sm rounded-2xl border border-white/70 shadow-lg p-4 sm:p-5">
              <input type="text" value={sujet} onChange={(e) => setSujet(e.target.value)}
                placeholder="Ex: Comment vendre sur WhatsApp en Afrique..."
                className="w-full text-slate-900 placeholder:text-slate-400 text-base sm:text-lg bg-transparent border-0 focus:outline-none focus:ring-0 mb-4" />
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

          {/* Pills */}
          <div className="text-center">
            <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-4">Commencer par</p>
            <div className="flex flex-wrap items-center justify-center gap-2.5">
              <button onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/60 hover:border-slate-300 hover:bg-white rounded-xl text-xs font-bold uppercase tracking-widest text-slate-700 transition-all shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-blue-500" />
                Générer un ebook
              </button>
              <button onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/60 hover:border-slate-300 hover:bg-white rounded-xl text-xs font-bold uppercase tracking-widest text-slate-700 transition-all shadow-sm">
                <BookAIcon className="w-3.5 h-3.5 text-amber-500" />
                Radar Cash
              </button>
              <button onClick={() => router.push('/auth/register')} className="flex items-center gap-2 px-4 py-2.5 bg-white/70 backdrop-blur-sm border border-white/60 hover:border-slate-300 hover:bg-white rounded-xl text-xs font-bold uppercase tracking-widest text-slate-700 transition-all shadow-sm">
                <BookOpen className="w-3.5 h-3.5 text-violet-500" />
                Valider mon idée
              </button>
            </div>
          </div>
        </div>

        {/* Vague */}
        <div className="absolute bottom-0 left-0 right-0 z-20" style={{ lineHeight: 0 }}>
          <svg viewBox="0 0 1440 120" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="none"
            style={{ display: 'block', width: '100%', height: '120px' }}>
            <path d="M0,40 C180,100 360,0 540,60 C720,120 900,20 1080,70 C1260,120 1350,50 1440,60 L1440,120 L0,120 Z" fill="white" />
          </svg>
        </div>
      </section>

      {/* FEATURES CRÉER */}
      <section id="features" className="bg-white">
        <div className="max-w-7xl mx-auto px-5 sm:px-6 lg:px-8 pt-4 pb-16 lg:pb-24">

          <div className="text-center mb-12 lg:mb-16">
            <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-4 lg:mb-6">
              De l'idée au PDF en moins d'une minute
            </h2>
            <p className="text-slate-500 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
              Génération IA, mise en page pro, romans complets. Tout ce qu'il faut pour créer des produits digitaux qui se vendent.
            </p>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {featuresCreate.map((feature) => <FeatureCard key={feature.id} feature={feature} />)}
          </div>

          {/* FEATURES ESPIONNER/VALIDER */}
          <div className="mt-24 lg:mt-36">
            <div className="text-center mb-12 lg:mb-16">
              <h2 className="text-2xl sm:text-3xl lg:text-5xl font-bold text-slate-900 mb-4 lg:mb-6">
                Créez sur ce qui se vend déjà
              </h2>
              <p className="text-slate-500 text-base sm:text-lg lg:text-xl max-w-2xl mx-auto">
                Radar Cash, Niche Hunter et le Validateur d'idée analysent Facebook Ads, Google et le marché pour vous dire exactement quoi créer.
              </p>
            </div>
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 lg:gap-8">
              {featuresResearch.map((feature) => <FeatureCard key={feature.id} feature={feature} />)}
            </div>
          </div>

          {/* CTA */}
          <div className="text-center mt-20 lg:mt-28">
            <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 lg:px-10 lg:py-5 bg-slate-900 hover:bg-slate-800 text-white font-semibold text-base lg:text-lg rounded-full transition-all">
              Commencer gratuitement
              <ArrowRight className="w-5 h-5 lg:w-6 lg:h-6" />
            </Link>
            <p className="text-xs text-slate-400 mt-3">4 crédits offerts à l'inscription. Aucune carte requise.</p>
          </div>

        </div>
      </section>
    </>
  );
}