"use client";

import Link from "next/link";
import { ArrowRight } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

export default function CTA() {
  return (
    <section className="relative min-h-[85vh] flex flex-col items-center justify-center overflow-hidden px-5 py-24"
      style={{ background: "#F5F2ED" }}>

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* Cercles décoratifs */}
      <div className="absolute top-[-60px] right-[-80px] w-[420px] h-[420px] rounded-full border border-[#D6CFC4] opacity-50 pointer-events-none z-0" />
      <div className="absolute bottom-[-80px] left-[-100px] w-[350px] h-[350px] rounded-full bg-blue-50 opacity-40 pointer-events-none z-0" />
      <div className="absolute top-1/2 left-[-200px] w-[300px] h-[300px] rounded-full border border-[#C8BFB0] opacity-20 pointer-events-none z-0" />

      {/* Contenu */}
      <div className="relative z-10 text-center max-w-3xl mx-auto w-full">

        {/* Badge */}
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C8BFB0] bg-white/60 backdrop-blur-sm mb-8">
          <span className="w-1.5 h-1.5 rounded-full bg-sky-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Propulsé par l'IA</span>
        </div>

        {/* Label */}
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-4">Rejoignez la communauté</p>

        {/* Titre */}
        <h2 className="font-black text-slate-900 tracking-tight leading-[0.92] mb-6"
          style={{ fontSize: "clamp(3rem, 9vw, 6rem)" }}>
          De l'idée à l'ebook<br />
          <span className="text-blue-500">en 60 secondes.</span>
        </h2>

        <p className="text-slate-500 text-base sm:text-lg mb-10 max-w-md mx-auto leading-relaxed">
          Rejoignez des milliers de créateurs qui vendent leurs ebooks avec Bookzy.
        </p>

        {/* Divider */}
        <div className="w-24 h-px bg-[#C8BFB0] mx-auto mb-10" />

        {/* CTAs */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-3 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl transition-all text-xs uppercase tracking-widest shadow-lg"
          >
            Commencer gratuitement
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <div className="inline-flex items-center gap-2 px-5 py-4 border border-[#C8BFB0] rounded-xl bg-white/60">
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">4 crédits offerts</span>
            <span className="text-xs text-slate-400">sans carte bancaire</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="flex flex-wrap justify-center gap-8 mt-16">
          {[
            { value: "7 300+", label: "Créateurs actifs" },
            { value: "60s",    label: "Par ebook" },
            { value: "13",     label: "Pays africains" },
            { value: "100%",   label: "Propriété à vous" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}