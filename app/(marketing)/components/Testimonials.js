"use client";

import { Star } from "lucide-react";

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
];

export default function Testimonials() {
  return (
    <section id="testimonials" className="bg-white py-16 lg:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">

        {/* Header */}
        <div className="text-center mb-12">
          <div className="inline-flex items-center gap-2 mb-4">
            <div className="flex">
              {[1,2,3,4,5].map(i => (
                <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />
              ))}
            </div>
            <span className="text-slate-500 text-sm font-medium">
              4.9/5 · 1,300+ avis
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl font-black text-slate-900 tracking-tight">
            Ce qu'ils en pensent
          </h2>
        </div>

        {/* Testimonials grid - 2 columns */}
        <div className="grid sm:grid-cols-2 gap-5">
          {TESTIMONIALS.map((t, index) => (
            <div 
              key={index}
              className="bg-slate-50 rounded-2xl p-6 border border-slate-100"
            >
              {/* Quote */}
              <p className="text-slate-700 text-base leading-relaxed mb-5">
                "{t.quote}"
              </p>

              {/* Result */}
              <div className="mb-5">
                <span className="inline-block px-3 py-1.5 bg-blue-100 text-blue-700 text-xs font-semibold rounded-full">
                  → {t.result}
                </span>
              </div>

              {/* Author */}
              <div className="flex items-center gap-3 pt-4 border-t border-slate-200">
                <img 
                  src={t.avatar} 
                  alt={t.name} 
                  className="w-10 h-10 rounded-full object-cover"
                />
                <div>
                  <h4 className="font-semibold text-slate-900 text-sm">{t.name}</h4>
                  <p className="text-xs text-slate-500">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}