"use client";

import { Star } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

const TESTIMONIALS = [
  {
    name: "Marc Kouadio",
    role: "Infopreneur",
    location: "Abidjan, CI",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg",
    quote: "J'ai arrêté de payer mon graphiste. Le PDF qui sort de Bookzy est plus propre que ce que je faisais sur Canva en 3h.",
    result: "12 ebooks vendus en 2 semaines"
  },
  {
    name: "Aïcha Koné",
    role: "Créatrice Food",
    location: "Dakar, SN",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",
    quote: "J'ai copié le script WhatsApp généré par l'IA et envoyé à ma liste. Première vente le soir même.",
    result: "Première vente en 6h"
  },
  {
    name: "Yann Dubois",
    role: "Formateur",
    location: "Douala, CM",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",
    quote: "Le Niche Hunter m'a trouvé une idée de niche que je n'aurais jamais cherchée. 15 ventes dès le premier jour.",
    result: "15 ventes le jour 1"
  },
  {
    name: "Clara Martin",
    role: "Coach Business",
    location: "Paris, FR",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/7fef677cbafd1e0f1f474ad0fa14a341.jpg",
    quote: "L'ebook de 80 pages est pertinent et bien structuré. Le kit marketing m'a fait économiser des heures.",
    result: "3 ebooks créés en 1 jour"
  },
  {
    name: "Kofi Mensah",
    role: "Digital Marketer",
    location: "Accra, GH",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg",
    quote: "En 60 secondes j'avais un ebook complet avec cover. J'ai partagé le lien sur mon Instagram et les DMs ont explosé.",
    result: "200+ DMs en 24h"
  },
  {
    name: "Fatou Diallo",
    role: "Entrepreneuse",
    location: "Bamako, ML",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",
    quote: "La boutique Smart Shop est incroyable. J'ai créé ma page en 10 minutes et partagé le lien sur WhatsApp.",
    result: "5 ventes le 1er jour"
  },
];

const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

export default function Testimonials() {
  return (
    <section id="testimonials" className="relative py-16 lg:py-24 overflow-hidden" style={{ background: "#EDE8E0" }}>

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* Header */}
      <div className="relative z-10 max-w-5xl mx-auto px-5 mb-12 pb-10 border-b border-[#C8BFB0]">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Témoignages</p>
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight leading-[0.92]">
            Aimé par notre<br />communauté
          </h2>
          <div className="flex items-center gap-2 sm:flex-col sm:items-end">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-xs font-black uppercase tracking-widest text-slate-400">4.9/5 · 7 300+ utilisateurs</span>
          </div>
        </div>
      </div>

      {/* Marquee row 1 */}
      <div className="relative z-10 mb-4">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
          style={{ background: "linear-gradient(to right, #EDE8E0, transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
          style={{ background: "linear-gradient(to left, #EDE8E0, transparent)" }} />
        <div className="flex gap-4 animate-marquee-left" style={{ width: "max-content" }}>
          {DOUBLED.map((t, i) => <TestimonialCard key={`row1-${i}`} t={t} />)}
        </div>
      </div>

      {/* Marquee row 2 */}
      <div className="relative z-10">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10"
          style={{ background: "linear-gradient(to right, #EDE8E0, transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10"
          style={{ background: "linear-gradient(to left, #EDE8E0, transparent)" }} />
        <div className="flex gap-4 animate-marquee-right" style={{ width: "max-content" }}>
          {[...DOUBLED].reverse().map((t, i) => <TestimonialCard key={`row2-${i}`} t={t} />)}
        </div>
      </div>

      <style jsx>{`
        @keyframes marquee-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(-50%); }
        }
        @keyframes marquee-right {
          0% { transform: translateX(-50%); }
          100% { transform: translateX(0); }
        }
        .animate-marquee-left { animation: marquee-left 30s linear infinite; }
        .animate-marquee-right { animation: marquee-right 30s linear infinite; }
        .animate-marquee-left:hover,
        .animate-marquee-right:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}

function TestimonialCard({ t }) {
  return (
    <div className="w-[300px] sm:w-[340px] flex-shrink-0 bg-white rounded-2xl p-5 border border-[#C8BFB0] hover:border-slate-400 hover:shadow-md transition-all duration-300">

      {/* Stars */}
      <div className="flex gap-0.5 mb-3">
        {[1,2,3,4,5].map(i => (
          <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />
        ))}
      </div>

      {/* Quote */}
      <p className="text-slate-600 text-sm leading-relaxed mb-4">
        "{t.quote}"
      </p>

      {/* Result badge */}
      <div className="mb-4">
        <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-[#F5F2ED] border border-[#C8BFB0] text-slate-700 text-[10px] font-black rounded-full uppercase tracking-widest">
          {t.result}
        </span>
      </div>

      {/* Author */}
      <div className="flex items-center gap-3 pt-3 border-t border-[#E8E2D9]">
        <img
          src={t.avatar}
          alt={t.name}
          className="w-9 h-9 rounded-full object-cover flex-shrink-0 border border-[#C8BFB0]"
        />
        <div>
          <p className="font-black text-slate-900 text-sm leading-tight tracking-tight">{t.name}</p>
          <p className="text-[10px] text-slate-400 uppercase tracking-widest font-bold mt-0.5">{t.role} · {t.location}</p>
        </div>
      </div>
    </div>
  );
}