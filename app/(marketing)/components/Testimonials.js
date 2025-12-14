"use client";
import React, { useRef } from "react";
import { Star, ChevronLeft, ChevronRight, BadgeCheck, TrendingUp } from "lucide-react";

const TESTIMONIALS = [
  {
    name: "M. Kouadio",
    username: "@kouadio_biz",
    role: "Infopreneur",
    date: "Il y a 2 jours",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg",
    quote: "J'ai arrêté de payer mon graphiste. Le PDF qui sort de Bookzy est plus propre que ce que je faisais sur Canva en 3h. Les textes de vente Facebook sont un cheat code.",
    kpi: "Ebook prêt en 60s chrono",
    kpiColor: "bg-blue-100 text-blue-700 border-blue-200"
  },
  {
    name: "Aïcha K.",
    username: "@aicha_cooks",
    role: "Créatrice Food",
    date: "Il y a 1 semaine",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",
    quote: "J'ai juste copié-collé le script WhatsApp généré par l'IA à ma liste de diffusion. J'ai fait ma première vente pendant que je dormais. C'est effrayant d'efficacité.",
    kpi: "Première vente en 6h",
    kpiColor: "bg-emerald-100 text-emerald-700 border-emerald-200"
  },
  {
    name: "Yann D.",
    username: "@yann_ecom",
    role: "Formateur",
    date: "Il y a 3 jours",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",
    quote: "Le Niche Hunter m'a trouvé une idée que je n'aurais jamais cherchée. J'ai lancé l'ebook, utilisé les posts générés, et boum. C'est une machine à cash.",
    kpi: "15 ventes le Jour 1",
    kpiColor: "bg-orange-100 text-orange-800 border-orange-200"
  },
  {
    name: "Clara Martin",
    username: "@clara_coaching",
    role: "Coach Business",
    date: "Il y a 5 jours",
    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/7fef677cbafd1e0f1f474ad0fa14a341.jpg",
    quote: "J'avais peur du contenu générique. Mais l'ebook de 80 pages est super pertinent. Le kit marketing (Emails + LinkedIn) m'a fait économiser 500€ de copywriter.",
    kpi: "500€ d'économie / projet",
    kpiColor: "bg-violet-100 text-violet-700 border-violet-200"
  },
];

export default function Testimonials() {
  const trackRef = useRef(null);

  const scrollByCard = (dir) => {
    const el = trackRef.current;
    if (!el) return;
    const card = el.querySelector("[data-card]");
    const step = (card?.clientWidth ?? 360) + 24; 
    el.scrollBy({ left: dir === "left" ? -step : step, behavior: "smooth" });
  };

  return (
    <section id="testimonials" className="bg-slate-50 py-24 overflow-hidden border-t border-slate-200">
      <div className="max-w-7xl mx-auto px-6">
        
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-4 tracking-tight">
              Ils impriment du cash <br />
              <span className="text-blue-600">pendant que vous hésitez.</span>
            </h2>
            <p className="text-slate-600 text-lg">
              Rejoignez les 1,200+ créateurs qui ont automatisé leur business.
            </p>
          </div>

          {/* Navigation Buttons */}
          <div className="flex gap-3">
            <button onClick={() => scrollByCard("left")} className="p-3 rounded-full bg-white border border-slate-200 hover:border-slate-900 text-slate-600 hover:text-slate-900 transition-all shadow-sm">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button onClick={() => scrollByCard("right")} className="p-3 rounded-full bg-white border border-slate-200 hover:border-slate-900 text-slate-600 hover:text-slate-900 transition-all shadow-sm">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Carousel */}
        <div 
          ref={trackRef}
          className="flex gap-6 overflow-x-auto scroll-smooth snap-x snap-mandatory pb-8 scrollbar-hide -mx-6 px-6"
        >
          {TESTIMONIALS.map((t, index) => (
            <div
              key={index}
              data-card
              className="snap-start shrink-0 w-[350px] md:w-[400px]"
            >
              <div className="h-full bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow flex flex-col">
                
                {/* User Info (Style Twitter/LinkedIn) */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover border border-slate-100" />
                    <div>
                      <div className="flex items-center gap-1">
                        <h4 className="font-bold text-slate-900 text-sm">{t.name}</h4>
                        <BadgeCheck className="w-3.5 h-3.5 text-blue-500 fill-blue-50" />
                      </div>
                      <p className="text-xs text-slate-500">{t.username} • {t.role}</p>
                    </div>
                  </div>
                  {/* Étoiles */}
                  <div className="flex gap-0.5">
                     {[1,2,3,4,5].map(i => <Star key={i} className="w-3 h-3 text-orange-400 fill-orange-400" />)}
                  </div>
                </div>

                {/* Quote */}
                <p className="text-slate-700 text-[15px] leading-relaxed mb-6 flex-1">
                  "{t.quote}"
                </p>

                {/* Footer avec Date et KPI */}
                <div className="pt-4 border-t border-slate-50 flex items-center justify-between">
                   <span className="text-xs text-slate-400 font-medium">{t.date}</span>
                   
                   <div className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-bold border ${t.kpiColor}`}>
                      <TrendingUp className="w-3 h-3" /> {t.kpi}
                   </div>
                </div>

              </div>
            </div>
          ))}
        </div>

      </div>

      <style jsx>{`
        .scrollbar-hide {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
        .scrollbar-hide::-webkit-scrollbar {
          display: none;
        }
      `}</style>
    </section>
  );
}