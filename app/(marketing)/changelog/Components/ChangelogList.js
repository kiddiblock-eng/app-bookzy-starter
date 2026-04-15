"use client";

import Link from "next/link";
import Image from "next/image";
import { ArrowRight } from "lucide-react";
import { versions, tagConfig } from "@/data/changelog";

export default function ChangelogList() {
  return (
    <section className="bg-[#F5F2ED] min-h-screen py-24 px-6 font-poppins">

      <div
        className="fixed inset-0 opacity-[0.025] pointer-events-none z-0"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative z-10 max-w-5xl mx-auto">

        {/* Header */}
        <div className="mb-16 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Toutes les versions</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight mb-4">
            Historique des mises à jour
          </h2>
          <p className="text-slate-500 text-lg max-w-xl">
            Chaque version porte le nom d'une planète. Chaque planète, une nouvelle ère pour Bookzy.
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          <div className="absolute left-0 top-0 bottom-0 w-px bg-[#C8BFB0] hidden md:block" />

          <div className="space-y-12">
            {versions.map((version) => (
              <div key={version.id} className="md:pl-10 relative">

                {/* Dot */}
                <div className="hidden md:flex absolute -left-[5px] top-6 w-[11px] h-[11px] rounded-full border-2 border-[#C8BFB0] bg-[#F5F2ED] items-center justify-center">
                  {version.current && <div className="w-2 h-2 rounded-full bg-blue-500 animate-pulse" />}
                </div>

                {/* Carte */}
                <div className={`rounded-2xl border overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  version.current ? "bg-white border-[#C8BFB0] shadow-md" : "bg-[#EDE8E0] border-[#C8BFB0]"
                }`}>

                  {/* Image header */}
                  <div className="relative w-full h-56 md:h-72 overflow-hidden">
                    <div className="hidden md:block absolute inset-0">
                      <Image src={version.planet} alt={`Bookzy ${version.name}`} fill className="object-cover object-center" sizes="(max-width: 1024px) 100vw, 900px" />
                    </div>
                    <div className="block md:hidden absolute inset-0">
                      <Image src={version.planetMobile} alt={`Bookzy ${version.name}`} fill className="object-cover object-center" sizes="100vw" />
                    </div>
                    <div className={`absolute inset-0 bg-gradient-to-t ${version.current ? "from-black/70 via-black/20 to-transparent" : "from-black/80 via-black/40 to-black/20"}`} />
                    <div className="absolute bottom-5 left-5 right-5 flex items-end justify-between">
                      <div>
                        <p className="text-white/60 text-xs font-bold uppercase tracking-widest mb-1">{version.date}</p>
                        <h3 className="font-black leading-none">
                          <span className="text-white text-4xl md:text-5xl tracking-tight">V{version.version} </span>
                          <span className="text-blue-400 text-4xl md:text-5xl tracking-tight">{version.name}</span>
                        </h3>
                      </div>
                      <div className="flex flex-col items-end gap-2">
                        {version.current && (
                          <span className="px-3 py-1 bg-blue-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full">Actuelle</span>
                        )}
                        <span className="px-3 py-1 bg-white/20 backdrop-blur-sm text-white text-[10px] font-bold rounded-full border border-white/20">
                          {version.changes.length} changements
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Contenu */}
                  <div className="p-6 md:p-8">
                    <p className="text-slate-400 text-xs font-bold uppercase tracking-widest mb-6 italic">{version.tagline}</p>

                    {/* Liste fonctionnalités */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-1.5 mb-6">
                      {version.changes.slice(0, 8).map((change, j) => {
                        const t = tagConfig[change.tag];
                        const isNew = !change.before;
                        return (
                          <div key={j} className={`flex items-center gap-2 px-2.5 py-1.5 rounded-lg ${
                            version.current ? "bg-slate-50" : "bg-[#E8E2D9]"
                          }`}>
                            <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-0.5 ${t.dot}`} />
                            <span className="text-[11px] font-semibold text-slate-700 flex-1 leading-snug">{change.title}</span>
                            <span className={`flex-shrink-0 text-[9px] font-black uppercase tracking-wider px-2 py-0.5 rounded-full border ${
                              isNew
                                ? "bg-blue-50 text-blue-600 border-blue-100"
                                : "bg-emerald-50 text-emerald-600 border-emerald-100"
                            }`}>
                              {isNew ? "Nouveau" : "Mis à jour"}
                            </span>
                          </div>
                        );
                      })}
                    </div>

                    {/* CTA */}
                    <Link
                      href={`/changelog/${version.id}`}
                      className={`group inline-flex items-center gap-2 px-5 py-3 rounded-xl font-bold text-sm transition-all ${
                        version.current
                          ? "bg-slate-900 text-white hover:bg-slate-800"
                          : "bg-[#D6CFC4] text-slate-700 hover:bg-[#C8BFB0]"
                      }`}
                    >
                      Voir tous les {version.changes.length} changements
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Prochaine version */}
          <div className="mt-12 md:pl-10 relative">
            <div className="hidden md:block absolute -left-[5px] top-6 w-[11px] h-[11px] rounded-full border-2 border-dashed border-[#C8BFB0] bg-[#F5F2ED]" />
            <div className="rounded-2xl border border-dashed border-[#C8BFB0] overflow-hidden">
              <div className="w-full h-32 bg-[#E8E2D9] flex items-center justify-center">
                <div className="text-center">
                  <div className="w-10 h-10 rounded-full border-2 border-dashed border-[#C8BFB0] mx-auto mb-2 flex items-center justify-center">
                    <span className="text-[#C8BFB0] text-xl font-black">?</span>
                  </div>
                  <p className="text-[#C8BFB0] text-xs font-black uppercase tracking-widest">Prochaine planète</p>
                </div>
              </div>
              <div className="p-6">
                <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-300 mb-2">Prochainement</p>
                <h3 className="text-2xl font-black text-slate-300 tracking-tight mb-1">V1.3 <span className="text-slate-200">???</span></h3>
                <p className="text-slate-400 text-sm">La prochaine mise à jour est en cours de développement.</p>
              </div>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}