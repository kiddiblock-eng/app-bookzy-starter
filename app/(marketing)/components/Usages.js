"use client";

import { motion } from "framer-motion";
import { FileText, Target, BarChart3 } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "./Reveal";

const ACCENT = "#059669";
const TINT = "rgba(5,150,105,0.10)";

const USAGES = [
  { Icon: FileText, tag: "Création", title: "Crée ton ebook", desc: "À partir d'un simple titre, l'IA rédige et designe un ebook complet, prêt à l'emploi." },
  { Icon: Target, tag: "Recherche", title: "Trouve une idée qui cartonne", desc: "Niche Hunter scanne le marché et te sort les sujets d'ebooks qui se vendent en ce moment." },
  { Icon: BarChart3, tag: "Validation", title: "Valide ton idée", desc: "Le Validateur analyse ton idée et lui donne un score de rentabilité sur 100, données réelles à l'appui." },
];

export default function Usages() {
  return (
    <section id="outils" className="bg-white py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <span className="inline-block px-3.5 py-1.5 rounded-full text-[11px] font-bold uppercase tracking-[0.12em] mb-5" style={{ background: TINT, color: ACCENT }}>
            Une seule app, trois usages
          </span>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">De l'idée à l'ebook, au même endroit.</h2>
          <p className="mt-4 text-neutral-500 text-lg">Le même outil t'accompagne du début à la fin : trouve un sujet, vérifie son potentiel, puis génère ton ebook complet.</p>
        </Reveal>

        <Stagger className="grid sm:grid-cols-3 gap-5">
          {USAGES.map((u) => (
            <motion.div key={u.title} variants={staggerItem}
              className="rounded-2xl border border-neutral-200 bg-white overflow-hidden hover:shadow-lg hover:-translate-y-1 transition-all">
              {/* Visuel haut teinté */}
              <div className="relative h-36 flex items-center justify-center overflow-hidden" style={{ background: TINT }}>
                <u.Icon size={120} strokeWidth={1.25} className="absolute -right-5 -bottom-5 opacity-[0.07]" style={{ color: ACCENT }} />
                <div className="relative w-14 h-14 rounded-2xl flex items-center justify-center shadow-sm" style={{ background: ACCENT }}>
                  <u.Icon size={26} className="text-white" />
                </div>
              </div>
              {/* Corps */}
              <div className="p-6">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-semibold mb-3" style={{ background: TINT, color: ACCENT }}>
                  <u.Icon size={11} /> {u.tag}
                </span>
                <h3 className="text-lg font-bold text-neutral-900 mb-2">{u.title}</h3>
                <p className="text-sm text-neutral-500 leading-relaxed">{u.desc}</p>
              </div>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
