"use client";

import { useState } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

const ACCENT = "#5f7aa6";
const EASE = [0.22, 1, 0.36, 1];

const EXAMPLES = [
  { id: "wa", t: "Vendre sur WhatsApp", cat: "Business", g: "linear-gradient(150deg,#6366f1,#8b5cf6)", chapters: ["Trouver tes premiers clients", "Le message qui fait acheter", "Closer sans paraître insistant", "Automatiser tes ventes", "Fidéliser et faire revenir"] },
  { id: "sante", t: "Maigrir sans sport", cat: "Santé", g: "linear-gradient(150deg,#ef4444,#f59e0b)", chapters: ["Comprendre ton métabolisme", "Les 7 aliments brûle-graisse", "Composer ton assiette", "Vaincre les fringales", "Garder la ligne à vie"] },
  { id: "forex", t: "Forex pour débutants", cat: "Finance", g: "linear-gradient(150deg,#0ea5e9,#2563eb)", chapters: ["Le marché en 10 minutes", "Ouvrir ton premier compte", "Lire un graphique", "Gérer ton risque", "Ta première stratégie gagnante"] },
  { id: "couple", t: "Coaching de couple", cat: "Relations", g: "linear-gradient(150deg,#ec4899,#be185d)", chapters: ["Recréer la complicité", "Communiquer sans se blesser", "Raviver le désir", "Gérer les conflits", "Construire un projet à deux"] },
];

export default function TemplatesSection() {
  const [sel, setSel] = useState(0);
  const e = EXAMPLES[sel];

  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>Exemples</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">Regarde ce que tu peux créer.</h2>
          <p className="mt-4 text-neutral-500">Cover pro, sommaire structuré, contenu complet — l'IA génère tout l'intérieur.</p>
        </Reveal>

        <Reveal>
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3 sm:p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={e.id}
                initial={{ opacity: 0, y: 14 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -14 }}
                transition={{ duration: 0.4, ease: EASE }}
                className="grid sm:grid-cols-2 gap-3 sm:gap-5 items-stretch"
              >
                {/* COVER */}
                <div className="rounded-2xl overflow-hidden shadow-xl border border-black/5 min-h-[280px] sm:min-h-[380px]" style={{ background: e.g }}>
                  <div className="relative h-full w-full p-6 flex flex-col text-white">
                    <span className="absolute left-0 top-0 bottom-0 w-2 bg-white/20" />
                    <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">{e.cat}</span>
                    <p className="mt-4 text-3xl sm:text-4xl font-bold leading-tight">{e.t}</p>
                    <p className="mt-3 text-sm text-white/80 max-w-[85%]">Le guide complet, prêt à vendre.</p>
                    <div className="mt-auto flex items-center gap-2">
                      <span className="w-5 h-5 rounded bg-white/25" />
                      <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Bookzy</span>
                    </div>
                  </div>
                </div>

                {/* INTÉRIEUR — le contenu */}
                <div className="rounded-2xl bg-white border border-neutral-200 p-6 sm:p-7 flex flex-col">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">Sommaire</span>
                  <p className="text-lg font-bold text-neutral-900 mb-5">{e.t}</p>
                  <ul className="space-y-3.5 flex-1">
                    {e.chapters.map((c, i) => (
                      <li key={i} className="flex items-center gap-3">
                        <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold" style={{ background: "rgba(95,122,166,0.12)", color: ACCENT }}>
                          {i + 1}
                        </span>
                        <span className="text-sm text-neutral-700">{c}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="mt-5 pt-5 border-t border-neutral-100 space-y-2">
                    <div className="h-1.5 rounded bg-neutral-100 w-[92%]" />
                    <div className="h-1.5 rounded bg-neutral-100 w-[78%]" />
                    <div className="h-1.5 rounded bg-neutral-100 w-[55%]" />
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </Reveal>

        {/* Sélecteur d'exemples */}
        <div className="flex flex-wrap justify-center gap-3 mt-6">
          {EXAMPLES.map((x, i) => (
            <button key={x.id} onClick={() => setSel(i)}
              className={`rounded-lg overflow-hidden border-2 transition-all ${i === sel ? "border-[#5f7aa6] scale-105 shadow-md" : "border-transparent opacity-60 hover:opacity-100"}`}>
              <div className="w-[62px] h-[86px] p-2 flex flex-col justify-between text-white" style={{ background: x.g }}>
                <span className="text-[6px] font-bold uppercase tracking-wider text-white/70">{x.cat}</span>
                <span className="text-[9px] font-bold leading-tight">{x.t}</span>
              </div>
            </button>
          ))}
        </div>

        <Reveal className="text-center mt-12">
          <Link href="/auth/register" className="group inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors">
            Créer le mien <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
