"use client";

import { motion } from "framer-motion";
import { Target, Radio, BarChart3, Youtube, FileText, BookOpen, ArrowRight } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "./Reveal";

const ACCENT = "#5f7aa6";

const TOOLS = [
  { Icon: Target, name: "Niche Hunter", desc: "Les niches qui se vendent, sorties des pubs Facebook actives.", tag: "Recherche" },
  { Icon: Radio, name: "Radar Cash", desc: "Espionne les pubs qui cartonnent et reproduis-les en ebook.", tag: "Recherche" },
  { Icon: BarChart3, name: "Validateur d'idée", desc: "Un score de rentabilité sur 100 avant de te lancer.", tag: "Données" },
  { Icon: Youtube, name: "Youbook", desc: "Transforme une vidéo YouTube en ebook structuré.", tag: "Création" },
  { Icon: FileText, name: "Ebook Designer", desc: "Ton texte ou ton Word devient un PDF pro en 20 secondes.", tag: "Création" },
  { Icon: BookOpen, name: "Romans IA", desc: "Thriller, romance, fantasy… un roman complet écrit par l'IA.", tag: "Création" },
];

export default function Outils() {
  return (
    <section id="outils" className="bg-neutral-50 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>Tes outils</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">Tout pour créer ce qui se vend.</h2>
          <p className="mt-4 text-neutral-500">Six outils qui bossent ensemble : trouver l'idée, la valider, la transformer en ebook.</p>
        </Reveal>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((t) => (
            <motion.div
              key={t.name}
              variants={staggerItem}
              whileHover={{ y: -6 }}
              transition={{ type: "spring", stiffness: 300, damping: 22 }}
              className="group relative overflow-hidden rounded-2xl border border-neutral-200 bg-white p-6 hover:border-[#5f7aa6] hover:shadow-xl transition-colors"
            >
              {/* halo accent au hover */}
              <div className="pointer-events-none absolute -right-10 -top-10 w-32 h-32 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
                style={{ background: "radial-gradient(circle, rgba(95,122,166,0.16), transparent 70%)" }} />

              <div className="relative flex items-start justify-between mb-4">
                <motion.div
                  className="w-12 h-12 rounded-xl flex items-center justify-center"
                  style={{ background: "rgba(95,122,166,0.12)" }}
                  whileHover={{ rotate: -6, scale: 1.06 }}
                  transition={{ type: "spring", stiffness: 300, damping: 12 }}
                >
                  <t.Icon size={21} style={{ color: ACCENT }} />
                </motion.div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-neutral-300">{t.tag}</span>
              </div>

              <h3 className="relative text-base font-semibold text-neutral-900 mb-1.5 flex items-center gap-1.5">
                {t.name}
                <ArrowRight size={14} className="text-[#5f7aa6] opacity-0 -translate-x-1 group-hover:opacity-100 group-hover:translate-x-0 transition-all" />
              </h3>
              <p className="relative text-sm text-neutral-500 leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
