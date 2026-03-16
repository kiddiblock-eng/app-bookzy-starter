"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

// ─── Icons ────────────────────────────────────────────────────────────────────
const IconBook = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
  </svg>
);
const IconRocket = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/>
    <path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/>
    <path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/>
  </svg>
);
const IconCrown = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <path d="m2 4 3 12h14l3-12-6 7-4-7-4 7-6-7z"/><path d="M5 20h14"/>
  </svg>
);
const IconGift = ({ size = 20, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);
const IconCheck = ({ color = "#0f172a" }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M1.5 5.5L4 8L9.5 2.5" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round"/>
  </svg>
);
const IconX = ({ color = "#C8BFB0" }) => (
  <svg width="11" height="11" viewBox="0 0 11 11" fill="none">
    <path d="M2 2l7 7M9 2l-7 7" stroke={color} strokeWidth="1.8" strokeLinecap="round"/>
  </svg>
);
const IconCoin = ({ size = 16, color = "currentColor" }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <circle cx="12" cy="12" r="10"/><path d="M12 6v2m0 8v2M9 9h4a1 1 0 0 1 0 2H11a1 1 0 0 0 0 2h4"/>
  </svg>
);

// ─── Data ─────────────────────────────────────────────────────────────────────
const creditCosts = [
  { label: "Générer un ebook complet avec l'IA", cost: 20 },
  { label: "Transformer votre brouillon Word en ebook designé", cost: 10 },
  { label: "Publier votre boutique Smart Shop en ligne", cost: 5 },
];

const features = [
  { label: "Analyser une vidéo YouTube", sub: "Extrait le contenu clé avant de générer", gratuit: "1/jour", solo: "2/mois", createur: "8/mois", agence: "15/mois" },
  { label: "Trouver des niches rentables", sub: "Idées de sujets qui vendent", gratuit: "1/jour", solo: "3/mois", createur: "8/mois", agence: "20/mois" },
  { label: "Analyser une niche en profondeur", sub: "Données de marché, concurrence, potentiel", gratuit: "1/jour", solo: "3/mois", createur: "8/mois", agence: "20/mois" },
  { label: "Tendances ebooks en temps réel", sub: "Les sujets qui buzzent en ce moment", gratuit: "Limitées", solo: "Temps réel", createur: "Temps réel", agence: "Temps réel" },
  { label: "Boutique en ligne pour vendre ses ebooks", sub: "Smart Shop personnalisable et prêt à vendre", gratuit: null, solo: "Créer + Publier", createur: "Créer + Publier", agence: "Multi-boutiques" },
  { label: "Kit marketing automatique", sub: "Posts, scripts, visuels inclus à chaque ebook", gratuit: "Basique", solo: "Complet", createur: "Complet", agence: "Total" },
  { label: "Support", sub: null, gratuit: "Chatbot", solo: "Email", createur: "Email", agence: "WhatsApp prioritaire" },
];

const plans = [
  {
    id: "solo",
    icon: <IconBook size={18} color="#475569" />,
    name: "Pass Solo",
    price: 5100,
    credits: 60,
    tag: null,
    cta: "Acheter maintenant",
    dark: false,
  },
  {
    id: "createur",
    icon: <IconRocket size={18} color="#0f172a" />,
    name: "Pack Créateur",
    price: 19125,
    credits: 330,
    tag: "Populaire",
    cta: "Choisir ce pack",
    dark: true,
  },
  {
    id: "agence",
    icon: <IconCrown size={18} color="#475569" />,
    name: "Pack Agence",
    price: 31500,
    credits: 700,
    tag: null,
    cta: "Choisir ce pack",
    dark: false,
  },
];

function fmt(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
}

// ─── Component ────────────────────────────────────────────────────────────────
export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const isQ = billing === "quarterly";

  return (
    <section id="pricing" className="relative py-24 px-4 overflow-hidden" style={{ background: "#F5F2ED" }}>

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Tarifs</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[0.92]">
              Vos crédits s'accumulent.<br />
              <span className="text-blue-500">Ils n'expirent jamais.</span>
            </h2>
            <p className="text-slate-500 text-sm sm:max-w-xs leading-relaxed">
              Pas de remise à zéro. Ce que vous achetez vous appartient pour toujours.
            </p>
          </div>
        </div>

        {/* Coûts crédits */}
        <div className="flex flex-wrap gap-3 mb-8">
          {creditCosts.map((c, i) => (
            <div key={i} className="flex items-center gap-2 bg-white border border-[#C8BFB0] rounded-full px-4 py-2">
              <IconCoin size={13} color="#475569" />
              <span className="text-xs text-slate-600 font-medium">{c.label}</span>
              <span className="text-xs font-black text-slate-900">{c.cost} cr.</span>
            </div>
          ))}
        </div>

        {/* Toggle mensuel / trimestriel */}
        <div className="flex mb-10">
          <div className="inline-flex items-center bg-white border border-[#C8BFB0] rounded-full p-1 gap-1">
            <button
              onClick={() => setBilling("monthly")}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${
                !isQ ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Mensuel
            </button>
            <button
              onClick={() => setBilling("quarterly")}
              className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${
                isQ ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-700"
              }`}
            >
              Trimestriel
              <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">-15%</span>
            </button>
          </div>
        </div>

        {/* Banner gratuit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#C8BFB0] rounded-2xl px-6 py-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-[#F5F2ED] border border-[#C8BFB0] flex items-center justify-center shrink-0">
              <IconGift size={18} color="#475569" />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm tracking-tight">Commencer avec 4 crédits gratuits</p>
              <p className="text-slate-500 text-xs mt-0.5">Tester Niche Hunter, analyser une vidéo YouTube, explorer la plateforme</p>
            </div>
          </div>
          <Link
            href="/auth/register"
            className="shrink-0 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-colors whitespace-nowrap"
          >
            Créer mon compte gratuit
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {plans.map((plan) => {
            const priceDisplay = isQ ? plan.price * 3 * 0.85 : plan.price;
            const priceOriginal = plan.price * 3;
            const creditsDisplay = isQ ? plan.credits * 3 : plan.credits;

            return (
              <div
                key={plan.id}
                className={`relative rounded-2xl p-7 flex flex-col transition-all duration-300
                  ${plan.dark
                    ? "bg-slate-900 border border-slate-800 shadow-xl scale-[1.02]"
                    : "bg-white border border-[#C8BFB0] hover:border-slate-400 hover:shadow-md"
                  }`}
              >
                {/* Grain sur la card dark */}
                {plan.dark && (
                  <div className="absolute inset-0 opacity-[0.04] pointer-events-none rounded-2xl"
                    style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
                )}

                {plan.tag && (
                  <span className="absolute top-5 right-5 px-3 py-1 bg-white text-slate-900 text-[9px] font-black rounded-full uppercase tracking-widest border border-[#C8BFB0]">
                    {plan.tag}
                  </span>
                )}

                {/* Icon + Name */}
                <div className="relative z-10 flex items-center gap-3 mb-5">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center border ${plan.dark ? "bg-white/10 border-white/10" : "bg-[#F5F2ED] border-[#C8BFB0]"}`}>
                    {plan.icon}
                  </div>
                  <p className={`text-xs font-black uppercase tracking-[0.15em] ${plan.dark ? "text-white" : "text-slate-400"}`}>
                    {plan.name}
                  </p>
                </div>

                {/* Credits badge */}
                <div className={`relative z-10 inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full w-fit mb-4 border ${plan.dark ? "bg-white/10 border-white/10" : "bg-[#F5F2ED] border-[#C8BFB0]"}`}>
                  <IconCoin size={13} color={plan.dark ? "#94a3b8" : "#475569"} />
                  <span className={`text-sm font-black ${plan.dark ? "text-white" : "text-slate-900"}`}>
                    {fmt(creditsDisplay)} cr.
                  </span>
                  <span className={`text-xs font-bold ${plan.dark ? "text-white/40" : "text-slate-400"}`}>
                    {isQ ? "/ trimestre" : "/ mois"}
                  </span>
                </div>

                {/* Price */}
                <div className="relative z-10 mb-5">
                  {isQ && (
                    <p className={`line-through text-sm mb-0.5 ${plan.dark ? "text-white/30" : "text-slate-300"}`}>
                      {fmt(priceOriginal)} FCFA
                    </p>
                  )}
                  <div className="flex items-end gap-1">
                    <span className={`text-4xl font-black tracking-tight ${plan.dark ? "text-white" : "text-slate-900"}`}>
                      {fmt(priceDisplay)}
                    </span>
                    <span className={`text-sm mb-1.5 font-bold ${plan.dark ? "text-white/40" : "text-slate-400"}`}>FCFA</span>
                  </div>
                  <p className={`text-xs mt-1 ${plan.dark ? "text-white/30" : "text-slate-400"}`}>
                    {isQ ? "1 paiement · économisez 15%" : "Paiement unique"} · crédits sans expiration
                  </p>
                </div>

                <div className={`relative z-10 h-px mb-5 ${plan.dark ? "bg-white/10" : "bg-[#E8E2D9]"}`} />

                {/* Features */}
                <ul className="relative z-10 space-y-3.5 mb-8 flex-1">
                  {creditCosts.map((c, ci) => (
                    <li key={`credit-${ci}`} className="flex items-start gap-2.5">
                      <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${plan.dark ? "bg-white/10 border-white/10" : "bg-[#F5F2ED] border-[#C8BFB0]"}`}>
                        <IconCheck color={plan.dark ? "#94a3b8" : "#0f172a"} />
                      </span>
                      <p className={`text-sm leading-snug ${plan.dark ? "text-white/70" : "text-slate-600"}`}>
                        {c.label}
                      </p>
                    </li>
                  ))}
                  {features.map((f, i) => {
                    const val = f[plan.id];
                    const isWeak = ["1/jour", "3/jour", "Limitées", "Basique", "Chatbot", "Email"].includes(val);
                    return (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className={`mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center border ${
                          val === null
                            ? plan.dark ? "bg-white/5 border-white/5" : "bg-[#F5F2ED] border-[#E8E2D9]"
                            : plan.dark ? "bg-white/10 border-white/10" : "bg-[#F5F2ED] border-[#C8BFB0]"
                        }`}>
                          {val === null
                            ? <IconX color={plan.dark ? "#334155" : "#D6CFC4"} />
                            : <IconCheck color={plan.dark ? "#94a3b8" : "#0f172a"} />
                          }
                        </span>
                        <div>
                          <p className={`text-sm leading-snug ${plan.dark ? "text-white/70" : "text-slate-600"}`}>
                            {f.label}
                            {val && (
                              <span className={`ml-1 font-black text-xs ${
                                isWeak
                                  ? plan.dark ? "text-white/30" : "text-slate-300"
                                  : plan.dark ? "text-white" : "text-slate-900"
                              }`}>
                                · {val}
                              </span>
                            )}
                          </p>
                          {f.sub && (
                            <p className={`text-xs mt-0.5 ${plan.dark ? "text-white/30" : "text-slate-400"}`}>
                              {f.sub}
                            </p>
                          )}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                {/* CTA */}
                <Link
                  href="/auth/register"
                  className={`relative z-10 flex items-center justify-center gap-2 w-full font-black py-3.5 rounded-xl transition-all text-xs uppercase tracking-widest ${
                    plan.dark
                      ? "bg-white text-slate-900 hover:bg-slate-100"
                      : "bg-slate-900 text-white hover:bg-slate-800"
                  }`}
                >
                  {plan.cta}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="w-full h-px bg-[#C8BFB0] mb-6" />
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          Paiement sécurisé via Moneroo · Disponible dans 13 pays africains · Aucun prélèvement automatique
        </p>
      </div>
    </section>
  );
}