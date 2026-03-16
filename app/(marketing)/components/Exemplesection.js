"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, Check } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

const templates = [
  { id: 1, name: "Neon",     image: "/shop-previews/neon.svg",     color: "#1a1033" },
  { id: 2, name: "Midnight", image: "/shop-previews/midnight.svg", color: "#0f1729" },
  { id: 3, name: "Minimal",  image: "/shop-previews/minimal.svg",  color: "#94a3b8" },
  { id: 4, name: "Brutalist",image: "/shop-previews/brutalist.svg",color: "#fbbf24" },
];

const features = [
  "13 templates personnalisables",
  "Vente via WhatsApp, lien ou paiement direct",
  "Lien partageable instantanément",
  "Zéro commission sur vos ventes",
  "Leads et téléchargements gratuits",
];

export default function SmartShopSection() {
  const [active, setActive] = useState(0);
  const touchStartX = useRef(null);

  useEffect(() => {
    const t = setInterval(() => setActive((prev) => (prev + 1) % templates.length), 2500);
    return () => clearInterval(t);
  }, []);

  const prev = () => setActive((p) => (p - 1 + templates.length) % templates.length);
  const next = () => setActive((p) => (p + 1) % templates.length);
  const onTouchStart = (e) => { touchStartX.current = e.touches[0].clientX; };
  const onTouchEnd = (e) => {
    if (touchStartX.current === null) return;
    const diff = touchStartX.current - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 40) diff > 0 ? next() : prev();
    touchStartX.current = null;
  };

  return (
    <section className="relative py-16 lg:py-24 overflow-hidden" style={{ background: "#F5F2ED" }}>

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-5 sm:px-6">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">

          {/* GAUCHE */}
          <div>
            <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C8BFB0] rounded-full mb-6">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Smart Shop</span>
            </div>

            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[0.92] mb-5">
              Votre boutique<br />
              <span className="text-blue-500">gratuite</span> en 2 clics
            </h2>

            <p className="text-slate-500 text-base leading-relaxed mb-8 max-w-md">
              Créez une page de vente professionnelle sous forme de link in bio pour vos ebooks. Partagez le lien sur WhatsApp, Instagram ou Facebook.
            </p>

            <div className="w-full h-px bg-[#C8BFB0] mb-8" />

            <ul className="space-y-3 mb-10">
              {features.map((f, i) => (
                <li key={i} className="flex items-center gap-3">
                  <div className="w-5 h-5 rounded-full bg-white border border-[#C8BFB0] flex items-center justify-center flex-shrink-0">
                    <Check className="w-3 h-3 text-slate-700" />
                  </div>
                  <span className="text-slate-600 text-sm font-medium">{f}</span>
                </li>
              ))}
            </ul>

            <div className="flex items-center gap-3 mb-8">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Templates</span>
              <div className="flex gap-2">
                {templates.map((t, i) => (
                  <button
                    key={t.id}
                    onClick={() => setActive(i)}
                    className="transition-all duration-300 rounded-full"
                    style={{
                      width: active === i ? 20 : 7,
                      height: 7,
                      background: active === i ? "#0f172a" : "#C8BFB0",
                    }}
                  />
                ))}
              </div>
              <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">{templates[active].name}</span>
            </div>

            <div className="flex items-center gap-3 flex-wrap">
              <Link
                href="/auth/register"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                Créer ma boutique
                <ArrowRight className="w-4 h-4" />
              </Link>
              <a
                href="/shop/prisma"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-7 py-3.5 bg-white border border-[#C8BFB0] hover:border-slate-400 text-slate-700 font-bold text-xs uppercase tracking-widest rounded-xl transition-all"
              >
                Voir une boutique
              </a>
            </div>
          </div>

          {/* DROITE */}
          <div className="flex justify-center lg:justify-end lg:pr-8">
            <div
              className="relative h-[420px] w-[280px] sm:w-[320px] lg:h-[620px] lg:w-[560px]"
              onTouchStart={onTouchStart}
              onTouchEnd={onTouchEnd}
            >
              {templates.map((t, i) => {
                const offset = i - active;
                const absOffset = Math.abs(offset);
                const isActive = offset === 0;
                return (
                  <div
                    key={t.id}
                    onClick={() => setActive(i)}
                    className="absolute top-0 left-1/2 cursor-pointer transition-all duration-500 w-[200px] lg:w-[300px]"
                    style={{
                      transform: `translateX(calc(-50% + ${offset * 75}px)) translateY(${absOffset * 15}px) rotate(${offset * 8}deg) scale(${isActive ? 1 : 1 - absOffset * 0.08})`,
                      zIndex: templates.length - absOffset,
                      opacity: absOffset > 2 ? 0 : 1,
                    }}
                  >
                    <img
                      src={t.image}
                      alt={t.name}
                      className="w-full"
                      style={{
                        filter: isActive
                          ? "drop-shadow(0 25px 40px rgba(0,0,0,0.18))"
                          : "drop-shadow(0 8px 20px rgba(0,0,0,0.10))",
                      }}
                    />
                    {isActive && (
                      <div className="absolute bottom-4 left-1/2 -translate-x-1/2 bg-white border border-[#C8BFB0] text-slate-700 text-[10px] font-black px-3 py-1.5 rounded-full whitespace-nowrap uppercase tracking-widest">
                        {t.name}
                      </div>
                    )}
                  </div>
                );
              })}

              <button
                onClick={prev}
                className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-8 w-8 h-8 bg-white rounded-lg border border-[#C8BFB0] hover:border-slate-400 flex items-center justify-center z-50 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <button
                onClick={next}
                className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-8 w-8 h-8 bg-white rounded-lg border border-[#C8BFB0] hover:border-slate-400 flex items-center justify-center z-50 transition-all shadow-sm"
              >
                <svg className="w-4 h-4 text-slate-600" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}