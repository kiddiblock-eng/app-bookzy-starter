"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

const comparisons = [
  { label: "Trouver une idée rentable",   old: "Chercher manuellement des heures",  bookzy: "Radar Cash + Niche Hunter en 30s",  oldScore: 8,  newScore: 100, badge: "Nouveau" },
  { label: "Valider avant de créer",       old: "Créer et espérer que ça vende",     bookzy: "Score de rentabilité sur 100",       oldScore: 5,  newScore: 100, badge: "Nouveau" },
  { label: "Aperçu avant de payer",        old: "Aucun aperçu, payer d'abord",       bookzy: "Voir un aperçu avant",         oldScore: 5,  newScore: 100, badge: "Nouveau" },
  { label: "Temps de création",           old: "2 à 3 semaines",                    bookzy: "60 secondes",                        oldScore: 8,  newScore: 100 },
  { label: "Design PDF professionnel",    old: "À faire soi-même ou payer",         bookzy: "Automatique — 12 templates",         oldScore: 15, newScore: 100 },
  { label: "Cover 3D",                    old: "Payer un designer",                 bookzy: "Incluse automatiquement",            oldScore: 10, newScore: 100 },
  { label: "Textes marketing",            old: "Rédiger soi-même",                  bookzy: "Posts, scripts WhatsApp générés",    oldScore: 20, newScore: 100 },
  { label: "Vendre dans 25 pays",         old: "Carte bancaire uniquement",         bookzy: "Mobile Money via Taliopay",          oldScore: 6,  newScore: 100, badge: "Taliopay" },
  { label: "Coût pour démarrer",          old: "200 000+ FCFA",                     bookzy: "4 crédits offerts à l'inscription",  oldScore: 5,  newScore: 100 },
  { label: "Compétences requises",        old: "Design + Rédaction + Tech",         bookzy: "Aucune",                             oldScore: 12, newScore: 100 },
];

export default function PourquoiBookzy() {
  return (
    <section className="relative py-16 lg:py-24 overflow-hidden" style={{ background: "#FAFAFA" }}>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-5 sm:px-6">

        <div className="mb-14 pb-10 border-b border-[#E8E8E8]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Pourquoi Bookzy</p>
          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <h2 className="text-4xl sm:text-5xl lg:text-6xl font-black text-slate-900 tracking-tight leading-[0.92]">
              La différence<br />est claire
            </h2>
            <p className="text-slate-400 text-sm sm:max-w-xs">Comparez par vous-même.</p>
          </div>
        </div>

        {/* VS Header */}
        <div className="grid grid-cols-[1fr_auto_1fr] items-center gap-4 mb-10 max-w-2xl mx-auto">
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-white border border-[#E8E8E8] flex items-center justify-center">
              <span className="text-2xl">😓</span>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.15em] text-slate-400">Traditionnel</div>
            <div className="text-[10px] text-slate-300 mt-0.5 uppercase tracking-widest font-bold">Long et coûteux</div>
          </div>
          <div className="flex flex-col items-center">
            <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg">
              <span className="text-white font-black text-xs tracking-tight">VS</span>
            </div>
          </div>
          <div className="text-center">
            <div className="w-14 h-14 mx-auto mb-3 rounded-2xl bg-slate-900 flex items-center justify-center shadow-md">
              <span className="text-2xl">⚡</span>
            </div>
            <div className="text-xs font-black uppercase tracking-[0.15em] text-slate-900">Bookzy</div>
            <div className="text-[10px] text-slate-400 mt-0.5 uppercase tracking-widest font-bold">Rapide et pro</div>
          </div>
        </div>

        {/* Comparaisons */}
        <div className="space-y-3 max-w-2xl mx-auto mb-12">
          {comparisons.map((item, i) => (
            <div key={i} className="relative rounded-2xl p-4 sm:p-5 bg-white border border-[#E8E8E8] hover:border-slate-300 transition-colors">
              {item.badge && (
                <span className={`absolute top-3 right-3 px-2.5 py-0.5 text-white text-[9px] font-black rounded-full uppercase tracking-widest ${item.badge === 'Nouveau' ? 'bg-blue-600' : item.badge === 'Taliopay' ? 'bg-emerald-600' : 'bg-slate-900'}`}>
                  {item.badge}
                </span>
              )}
              <div className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em] mb-3">{item.label}</div>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <div className="w-32 text-right flex-shrink-0">
                    <span className="text-[10px] text-slate-400 font-medium">{item.old}</span>
                  </div>
                  <div className="flex-1 h-6 bg-slate-50 rounded-lg overflow-hidden border border-[#E8E8E8]">
                    <div className="h-full rounded-lg bg-slate-200" style={{ width: `${item.oldScore}%` }} />
                  </div>
                  <div className="w-5 flex-shrink-0 text-slate-300 text-sm font-bold">✗</div>
                </div>
                <div className="flex items-center gap-3">
                  <div className="w-32 text-right flex-shrink-0">
                    <span className="text-[10px] text-slate-900 font-black">{item.bookzy}</span>
                  </div>
                  <div className="flex-1 h-6 bg-slate-50 rounded-lg overflow-hidden border border-slate-200">
                    <div className="h-full rounded-lg bg-slate-900 flex items-center justify-end pr-2" style={{ width: `${item.newScore}%` }}>
                      <span className="text-[9px] font-black text-white">✓</span>
                    </div>
                  </div>
                  <div className="w-5 flex-shrink-0 text-slate-900 text-sm font-black">✓</div>
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="w-full h-px bg-[#E8E8E8] mb-10 max-w-2xl mx-auto" />

        <div className="max-w-2xl mx-auto text-center">
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black text-xs uppercase tracking-widest rounded-xl transition-all">
            Commencer gratuitement
            <ArrowRight className="w-4 h-4" />
          </Link>
          <p className="text-xs text-slate-400 mt-3">4 crédits offerts. Aucune carte requise.</p>
        </div>

      </div>
    </section>
  );
}