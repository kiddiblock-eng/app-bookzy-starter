"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

/* Video component with autoplay on scroll */
function AutoPlayVideo({ src, poster }) {
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

  return (
    <video
      ref={ref}
      src={src}
      poster={poster}
      className="w-full h-full object-cover"
      muted
      loop
      playsInline
      preload="metadata"
    />
  );
}

const features = [
  {
    id: "generator",
    label: "Générateur",
    title: "Générez un ebook complet en 60 secondes",
    description: "Entrez votre sujet, choisissez vos options. L'IA rédige 8+ chapitres, formate le PDF et génère votre cover 3D automatiquement.",
    points: [
      "PDF professionnel structuré",
      "Cover 3D générée par IA",
      "Textes marketing inclus (Facebook, WhatsApp)",
      "6 templates premium au choix"
    ],
    media: {
      type: "video",
      src: "https://res.cloudinary.com/dcmlw5hak/video/upload/q_auto,f_auto,w_1200/plumelive_zdfw0n.mp4",
      poster: "https://res.cloudinary.com/dcmlw5hak/video/upload/q_auto,f_auto,w_1200,so_0/plumelive_zdfw0n.jpg"
    },
    reverse: false
  },
  {
    id: "niche-hunter",
    label: "Niche Hunter",
    title: "Trouvez des idées rentables en 1 clic",
    description: "Entrez un mot-clé et l'IA génère 10 idées de niches avec score de rentabilité, analyse concurrence et profil cible.",
    points: [
      "10 idées générées instantanément",
      "Score de rentabilité sur 10",
      "Analyse de la concurrence",
      "Suggestions de contenu"
    ],
    media: {
      type: "video",
      src: "https://res.cloudinary.com/dcmlw5hak/video/upload/q_auto,f_auto,w_1200/niche-hunter_zwrlpz.mp4",
      poster: "https://res.cloudinary.com/dcmlw5hak/video/upload/q_auto,f_auto,w_1200,so_0/niche-hunter_zwrlpz.jpg"
    },
    reverse: true
  },
  {
    id: "tendances",
    label: "Tendances",
    title: "Surfez sur les sujets qui buzzent",
    description: "Notre algorithme scanne les réseaux en temps réel pour détecter les sujets viraux avant tout le monde.",
    points: [
      "Données Facebook, TikTok, Google",
      "Mise à jour en temps réel",
      "Filtres par catégorie",
      "Historique des tendances"
    ],
    media: {
      type: "image",
      src: "/images/tendance.png"
    },
    reverse: false
  },
  {
    id: "youbook",
    label: "Youbook",
    title: "Transformez YouTube en ebook",
    description: "Collez un lien YouTube et obtenez un ebook complet extrait automatiquement de la vidéo.",
    points: [
      "Transcription automatique",
      "Structure en chapitres",
      "Contenu optimisé pour la lecture",
      "3 conversions gratuites par jour"
    ],
    media: {
      type: "image",
      src: "https://res.cloudinary.com/dcmlw5hak/image/upload/v1766646838/yoobookimg_c7ffey.png"
    },
    reverse: true
  }
];

export default function Features() {
  return (
    <section id="features" className="bg-white">
      
      {/* Header */}
      <div className="py-16 lg:py-20 border-b border-slate-100">
        <div className="max-w-6xl mx-auto px-5 sm:px-6 text-center">
          <p className="text-blue-600 text-sm font-semibold tracking-wide uppercase mb-4">
            Fonctionnalités
          </p>
          <h2 className="text-3xl sm:text-4xl lg:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Tout ce qu'il vous faut pour réussir
          </h2>
          <p className="text-slate-500 text-base sm:text-lg max-w-xl mx-auto">
            De l'idée à la vente, Bookzy s'occupe de tout.
          </p>
        </div>
      </div>

      {/* Features */}
      {features.map((feature, index) => (
        <div 
          key={feature.id}
          className={`py-16 lg:py-24 ${index % 2 === 1 ? 'bg-slate-50' : 'bg-white'}`}
        >
          <div className="max-w-6xl mx-auto px-5 sm:px-6">
            <div className={`grid lg:grid-cols-2 gap-10 lg:gap-16 items-center ${feature.reverse ? 'lg:flex-row-reverse' : ''}`}>
              
              {/* Text */}
              <div className={feature.reverse ? 'lg:order-2' : 'lg:order-1'}>
                
                {/* Label */}
                <span className="inline-block text-blue-600 text-sm font-semibold tracking-wide uppercase mb-4">
                  {feature.label}
                </span>

                {/* Title */}
                <h3 className="text-2xl sm:text-3xl lg:text-4xl font-black text-slate-900 tracking-tight mb-4">
                  {feature.title}
                </h3>

                {/* Description */}
                <p className="text-slate-500 text-base sm:text-lg mb-6 leading-relaxed">
                  {feature.description}
                </p>

                {/* Points */}
                <ul className="space-y-3 mb-8">
                  {feature.points.map((point, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-blue-600 flex items-center justify-center flex-shrink-0">
                        <svg className="w-3 h-3 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                          <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                        </svg>
                      </div>
                      <span className="text-slate-700 text-sm sm:text-base">{point}</span>
                    </li>
                  ))}
                </ul>

              </div>

              {/* Media */}
              <div className={feature.reverse ? 'lg:order-1' : 'lg:order-2'}>
                <div className="relative rounded-2xl overflow-hidden bg-slate-100 border border-slate-200 shadow-xl">
                  
                  {/* Browser bar */}
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-slate-100 border-b border-slate-200">
                    <div className="w-3 h-3 rounded-full bg-red-400" />
                    <div className="w-3 h-3 rounded-full bg-yellow-400" />
                    <div className="w-3 h-3 rounded-full bg-green-400" />
                  </div>

                  {/* Content */}
                  <div className="aspect-video bg-slate-900">
                    {feature.media.type === "video" ? (
                      <AutoPlayVideo 
                        src={feature.media.src} 
                        poster={feature.media.poster} 
                      />
                    ) : (
                      <img 
                        src={feature.media.src} 
                        alt={feature.title}
                        className="w-full h-full object-cover"
                        loading="lazy"
                      />
                    )}
                  </div>

                </div>
              </div>

            </div>
          </div>
        </div>
      ))}

      {/* CTA */}
      <div className="py-12 lg:py-16">
        <div className="text-center">
          <Link 
            href="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-semibold rounded-xl transition-colors"
          >
            Voir plus de fonctionnalités
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>

    </section>
  );
}