"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import ChangelogNav from "@/app/(marketing)/changelog/Components/ChangelogNav";
import { tagConfig } from "@/data/changelog";

const TABS = [
  { id: "tous", label: "Tous" },
  { id: "nouveau", label: "Nouveau" },
  { id: "amelioration", label: "Amélioration" },
  { id: "correction", label: "Correction" },
];

function SVGPlaceholder({ bg }) {
  return (
    <div className={`${bg} w-full h-full flex items-center justify-center`}>
      <svg viewBox="0 0 400 260" xmlns="http://www.w3.org/2000/svg" className="w-4/5 opacity-50">
        <rect x="20" y="20" width="360" height="220" rx="12" fill="white" fillOpacity="0.6" />
        <rect x="40" y="40" width="160" height="12" rx="6" fill="currentColor" fillOpacity="0.3" />
        <rect x="40" y="62" width="240" height="8" rx="4" fill="currentColor" fillOpacity="0.2" />
        <rect x="40" y="78" width="200" height="8" rx="4" fill="currentColor" fillOpacity="0.15" />
        <rect x="40" y="104" width="320" height="80" rx="8" fill="currentColor" fillOpacity="0.1" />
        <rect x="40" y="196" width="80" height="28" rx="8" fill="currentColor" fillOpacity="0.25" />
        <rect x="132" y="196" width="80" height="28" rx="8" fill="currentColor" fillOpacity="0.15" />
      </svg>
    </div>
  );
}

function FeatureCard({ change, index }) {
  const t = tagConfig[change.tag];
  const isNew = !change.before;
  const isEven = index % 2 === 0;

  return (
    <div className={`flex flex-col ${isEven ? "md:flex-row" : "md:flex-row-reverse"} gap-8 md:gap-16 items-center py-16 border-b border-[#E8E2D9] last:border-0`}>

      {/* Visuel */}
      <div className="w-full md:w-1/2 flex-shrink-0">
        <div className={`${change.bg} rounded-2xl overflow-hidden aspect-[4/3] shadow-lg`}>
          {change.image ? (
            <div className="relative w-full h-full flex items-center justify-center">
              <img
                src={change.image}
                alt={change.title}
                className="w-full h-full object-contain"
              />
            </div>
          ) : (
            <SVGPlaceholder bg="" />
          )}
        </div>
      </div>

      {/* Texte */}
      <div className="w-full md:w-1/2">
        {/* Badges */}
        <div className="flex items-center gap-2 mb-5">
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${t.color}`}>
            {t.label}
          </span>
          <span className={`text-[10px] font-black uppercase tracking-wider px-2.5 py-1 rounded-full border ${
            isNew
              ? "bg-blue-50 text-blue-600 border-blue-100"
              : "bg-emerald-50 text-emerald-600 border-emerald-100"
          }`}>
            {isNew ? "Nouveau" : "Mis à jour"}
          </span>
        </div>

        {/* Titre */}
        <h3 className="text-2xl md:text-3xl font-black text-slate-900 tracking-tight mb-5 leading-tight">
          {change.title}
        </h3>

        {/* Avant */}
        {change.before && (
          <div className="flex items-start gap-2 mb-4 p-3 rounded-xl bg-red-50 border border-red-100">
            <span className="flex-shrink-0 text-[9px] font-black uppercase tracking-wider mt-0.5 px-2 py-0.5 rounded-full bg-red-100 text-red-400">Avant</span>
            <p className="text-xs text-red-400 line-through leading-relaxed">{change.before}</p>
          </div>
        )}

        {/* Description */}
        <p className="text-slate-600 text-base leading-relaxed">
          {change.after}
        </p>
      </div>
    </div>
  );
}

export default function VersionDetail({ version }) {
  const [activeTab, setActiveTab] = useState("tous");

  const filtered = activeTab === "tous"
    ? version.changes
    : version.changes.filter((c) => c.tag === activeTab);

  return (
    <main className="min-h-screen bg-[#F5F2ED] font-poppins">
      <ChangelogNav />

      {/* Grain */}
      <div className="fixed inset-0 opacity-[0.025] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat", backgroundSize: "128px",
        }}
      />

      {/* Hero image */}
      <div className="relative w-full h-64 md:h-[420px] overflow-hidden">
        <div className="hidden md:block absolute inset-0">
          <Image src={version.planet} alt={version.name} fill priority className="object-cover object-center" sizes="100vw" />
        </div>
        <div className="block md:hidden absolute inset-0">
          <Image src={version.planetMobile} alt={version.name} fill priority className="object-cover object-center" sizes="100vw" />
        </div>
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

        <div className="absolute bottom-8 left-6 right-6 z-10">
          <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-2">{version.date}</p>
          <h1 className="font-black leading-none mb-3">
            <span className="text-white text-4xl md:text-6xl lg:text-7xl tracking-tight">V{version.version} </span>
            <span className="text-blue-400 text-4xl md:text-6xl lg:text-7xl tracking-tight">{version.name}</span>
          </h1>
          <p className="text-white/70 text-sm md:text-base max-w-2xl leading-relaxed">{version.tagline}</p>
        </div>
      </div>

      {/* Contenu */}
      <div className="relative z-10 max-w-5xl mx-auto px-6 py-14">

        {/* Intro */}
        <p className="text-slate-500 text-base leading-relaxed mb-12 pb-10 border-b border-[#C8BFB0] max-w-3xl">
          {version.summary}
        </p>

        {/* Onglets */}
        <div className="flex flex-wrap gap-2 mb-16">
          {TABS.map((tab) => {
            const count = tab.id === "tous"
              ? version.changes.length
              : version.changes.filter((c) => c.tag === tab.id).length;
            if (count === 0 && tab.id !== "tous") return null;
            const active = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full text-xs font-bold border transition-all ${
                  active
                    ? "bg-slate-900 text-white border-slate-900"
                    : "bg-white text-slate-500 border-[#C8BFB0] hover:border-slate-400 hover:text-slate-700"
                }`}
              >
                {tab.label}
                <span className={`text-[10px] font-black px-1.5 py-0.5 rounded-full ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-400"}`}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Features */}
        <div>
          {filtered.map((change, i) => (
            <FeatureCard key={i} change={change} index={i} />
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-16 text-slate-300">
            <p className="text-sm font-bold">Aucun changement dans cette catégorie</p>
          </div>
        )}

        {/* CTA */}
        <div className="mt-20 py-16 border-t border-[#C8BFB0] text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Vous n'avez pas encore de compte ?</p>
          <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Rejoignez Bookzy aujourd'hui.
          </h3>
          <p className="text-slate-500 text-base mb-10 max-w-md mx-auto">
            4 crédits offerts à l'inscription. Générez votre premier ebook sans carte bancaire.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/auth/register"
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-full transition-all shadow-lg text-sm"
            >
              Commencer gratuitement
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/auth/login"
              className="inline-flex items-center gap-2 px-8 py-4 bg-white border border-[#C8BFB0] hover:border-slate-400 text-slate-700 font-bold rounded-full transition-all text-sm"
            >
              J'ai déjà un compte
            </Link>
          </div>
        </div>

      </div>
    </main>
  );
}