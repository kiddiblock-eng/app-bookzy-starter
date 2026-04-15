"use client";

import { useState } from "react";
import Link from "next/link";
import { ArrowRight, Check, X } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

function fmt(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
}

const PLANS = [
  {
    id: "solo",
    name: "Pass Solo",
    description: "Pour démarrer",
    price: 7500,
    credits: 100,
    badge: null,
    color: "#0f172a",
    colorLight: "#f8fafc",
    colorBorder: "#e2e8f0",
    colorText: "#334155",
  },
  {
    id: "createur",
    name: "Pack Créateur",
    description: "Le plus populaire",
    price: 22000,
    credits: 400,
    badge: "Recommandé",
    color: "#2563eb",
    colorLight: "#eff6ff",
    colorBorder: "#bfdbfe",
    colorText: "#1d4ed8",
  },
  {
    id: "agence",
    name: "Pack Agence",
    description: "Pour les équipes",
    price: 45000,
    credits: 900,
    badge: null,
    color: "#065f46",
    colorLight: "#f0fdf4",
    colorBorder: "#a7f3d0",
    colorText: "#047857",
  },
];

const FEATURES = [
  { label: "Générez des ebooks pro en 1 minute", sub: "L'IA écrit, structure et met en page pour vous", solo: true, createur: true, agence: true },
  { label: "Transformez votre Word en PDF vendable", sub: "Importez votre brouillon, ressortez un ebook designé", solo: true, createur: true, agence: true },
  { label: "Transformez une vidéo YouTube en ebook", sub: "Le contenu est extrait et restructuré automatiquement", solo: true, createur: true, agence: true },
  { label: "Écrivez des romans avec l'IA", sub: "Fiction, développement personnel, guides pratiques", solo: true, createur: true, agence: true },
  { label: "Trouvez des niches qui vendent sur Facebook", sub: "Idées validées par les données du marché", solo: true, createur: true, agence: true },
  { label: "Suivez les tendances en temps réel", sub: "Sachez ce qui se vend avant tout le monde", solo: true, createur: true, agence: true },
  { label: "Validez votre idée avant de créer", sub: "Score de rentabilité, concurrence, potentiel revenus", solo: true, createur: true, agence: true },
  { label: "Rechargez quand vous voulez", sub: "Ajoutez exactement le montant dont vous avez besoin", solo: true, createur: true, agence: true },
  { label: "Kit marketing prêt à publier", sub: "Posts réseaux sociaux, scripts vidéo et visuels inclus", solo: "Complet", createur: "Complet", agence: "Total" },
  { label: "Support", solo: "Email", createur: "Email prioritaire", agence: "WhatsApp dédié" },
];

const IconGift = () => (
  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#475569" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round">
    <polyline points="20 12 20 22 4 22 4 12"/><rect x="2" y="7" width="20" height="5"/>
    <line x1="12" y1="22" x2="12" y2="7"/>
    <path d="M12 7H7.5a2.5 2.5 0 0 1 0-5C11 2 12 7 12 7z"/>
    <path d="M12 7h4.5a2.5 2.5 0 0 0 0-5C13 2 12 7 12 7z"/>
  </svg>
);

export default function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const isQ = billing === "quarterly";

  return (
    <section id="pricing" className="relative py-24 px-4 overflow-hidden" style={{ background: "#FAFAFA" }}>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="relative z-10 max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-12 pb-10 border-b border-[#E8E8E8]">
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

        {/* Toggle */}
        <div className="flex mb-10">
          <div className="inline-flex items-center bg-white border border-[#E8E8E8] rounded-full p-1 gap-1">
            <button onClick={() => setBilling("monthly")} className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${!isQ ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}>
              Mensuel
            </button>
            <button onClick={() => setBilling("quarterly")} className={`px-5 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all flex items-center gap-2 ${isQ ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-700"}`}>
              Trimestriel
              <span className="bg-emerald-500 text-white text-[9px] font-black px-2 py-0.5 rounded-full">-15%</span>
            </button>
          </div>
        </div>

        {/* Banner gratuit */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 bg-white border border-[#E8E8E8] rounded-2xl px-6 py-4 mb-8">
          <div className="flex items-center gap-4">
            <div className="w-10 h-10 rounded-xl bg-slate-50 border border-[#E8E8E8] flex items-center justify-center shrink-0">
              <IconGift />
            </div>
            <div>
              <p className="font-black text-slate-900 text-sm">Commencer avec 4 crédits gratuits</p>
              <p className="text-slate-500 text-xs mt-0.5">Testez Radar Cash, explorez la plateforme, créez votre premier aperçu</p>
            </div>
          </div>
          <Link href="/auth/register" className="shrink-0 inline-flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white font-black px-6 py-3 rounded-xl text-xs uppercase tracking-widest transition-colors whitespace-nowrap">
            Créer mon compte gratuit <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {/* Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-10">
          {PLANS.map((plan) => {
            const priceDisplay = isQ ? Math.round(plan.price * 3 * 0.85) : plan.price;
            const creditsDisplay = isQ ? plan.credits * 3 : plan.credits;
            const isRecommended = plan.badge === "Recommandé";

            return (
              <div key={plan.id} className="relative rounded-2xl p-7 flex flex-col border transition-all duration-300"
                style={{
                  background: isRecommended ? plan.color : "white",
                  borderColor: isRecommended ? plan.color : "#E8E8E8",
                  boxShadow: isRecommended ? "0 8px 32px rgba(37,99,235,0.15)" : "none",
                  transform: isRecommended ? "scale(1.02)" : "scale(1)",
                }}>

                {plan.badge && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 bg-white text-[9px] font-black rounded-full uppercase tracking-widest shadow-sm" style={{ color: plan.color, border: `1px solid ${plan.colorBorder}` }}>
                    {plan.badge}
                  </span>
                )}

                <div className="mb-4">
                  <p className="text-xs font-black uppercase tracking-[0.15em] mb-0.5" style={{ color: isRecommended ? "rgba(255,255,255,0.6)" : "#94a3b8" }}>{plan.description}</p>
                  <p className="font-black text-lg tracking-tight" style={{ color: isRecommended ? "white" : "#0f172a" }}>{plan.name}</p>
                </div>

                <div className="mb-5">
                  {isQ && <p className="text-sm line-through mb-0.5" style={{ color: isRecommended ? "rgba(255,255,255,0.3)" : "#cbd5e1" }}>{fmt(plan.price * 3)} FCFA</p>}
                  <div className="flex items-end gap-1">
                    <span className="text-4xl font-black tracking-tight" style={{ color: isRecommended ? "white" : "#0f172a" }}>{fmt(priceDisplay)}</span>
                    <span className="text-sm mb-1.5 font-bold" style={{ color: isRecommended ? "rgba(255,255,255,0.4)" : "#94a3b8" }}>FCFA/{isQ ? "trim" : "mois"}</span>
                  </div>
                  <div className="inline-flex items-center gap-1.5 mt-2 px-3 py-1 rounded-full text-xs font-black" style={{ background: isRecommended ? "rgba(255,255,255,0.15)" : "#f8fafc", color: isRecommended ? "white" : "#0f172a" }}>
                    {fmt(creditsDisplay)} crédits {isQ ? "/ trimestre" : "/ mois"}
                  </div>
                </div>

                <div className="h-px mb-5" style={{ background: isRecommended ? "rgba(255,255,255,0.15)" : "#E8E8E8" }} />

                <ul className="space-y-3 mb-8 flex-1">
                  {FEATURES.map((f, i) => {
                    const val = f[plan.id];
                    return (
                      <li key={i} className="flex items-start gap-2.5">
                        <span className="mt-0.5 shrink-0 w-5 h-5 rounded-full flex items-center justify-center" style={{ background: isRecommended ? "rgba(255,255,255,0.15)" : "#f8fafc", border: `1px solid ${isRecommended ? "rgba(255,255,255,0.1)" : "#E8E8E8"}` }}>
                          {val === false
                            ? <X size={9} color={isRecommended ? "rgba(255,255,255,0.3)" : "#D1D5DB"} />
                            : <Check size={9} color={isRecommended ? "white" : "#0f172a"} strokeWidth={2.5} />
                          }
                        </span>
                        <div>
                          <p className="text-sm leading-snug" style={{ color: isRecommended ? "rgba(255,255,255,0.85)" : "#475569" }}>
                            {f.label}
                            {val && val !== true && val !== false && (
                              <span className="ml-1 font-black text-xs" style={{ color: isRecommended ? "white" : "#0f172a" }}>· {val}</span>
                            )}
                          </p>
                          {f.sub && <p className="text-xs mt-0.5" style={{ color: isRecommended ? "rgba(255,255,255,0.4)" : "#94a3b8" }}>{f.sub}</p>}
                        </div>
                      </li>
                    );
                  })}
                </ul>

                <Link href="/auth/register" className="flex items-center justify-center gap-2 w-full font-black py-3.5 rounded-xl transition-all text-xs uppercase tracking-widest"
                  style={{ background: isRecommended ? "white" : "#0f172a", color: isRecommended ? plan.color : "white" }}>
                  {plan.name === "Pass Solo" ? "Choisir Solo" : plan.name === "Pack Créateur" ? "Choisir Créateur" : "Choisir Agence"}
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        <div className="w-full h-px bg-[#E8E8E8] mb-6" />
        <p className="text-center text-xs font-bold text-slate-400 uppercase tracking-widest">
          Paiement sécurisé · Disponible dans 27 pays africains · Aucun prélèvement automatique
        </p>
      </div>
    </section>
  );
}