"use client";

import { motion } from "framer-motion";
import { Target, Radio, BarChart3, Youtube, FileText, BookOpen } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "./Reveal";

const ACCENT = "#5f7aa6";

const TOOLS = [
  { Icon: Target, name: "Niche Hunter", desc: "Les niches qui se vendent, sorties des pubs Facebook actives." },
  { Icon: Radio, name: "Radar Cash", desc: "Espionne les pubs qui cartonnent et reproduis-les en ebook." },
  { Icon: BarChart3, name: "Validateur d'idée", desc: "Un score de rentabilité sur 100 avant de te lancer." },
  { Icon: Youtube, name: "Youbook", desc: "Transforme une vidéo YouTube en ebook structuré." },
  { Icon: FileText, name: "Ebook Designer", desc: "Ton texte ou ton Word devient un PDF pro en 20 secondes." },
  { Icon: BookOpen, name: "Romans IA", desc: "Thriller, romance, fantasy… un roman complet écrit par l'IA." },
];

export default function Outils() {
  return (
    <section id="outils" className="bg-neutral-50 py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>Tes outils</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">Tout pour créer ce qui se vend.</h2>
        </Reveal>

        <Stagger className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {TOOLS.map((t) => (
            <motion.div key={t.name} variants={staggerItem}
              className="group rounded-2xl border border-neutral-200 bg-white p-6 hover:border-neutral-300 hover:shadow-md transition-all">
              <div className="w-11 h-11 rounded-xl bg-neutral-900 flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                <t.Icon size={19} className="text-white" />
              </div>
              <h3 className="text-base font-semibold text-neutral-900 mb-1.5">{t.name}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{t.desc}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
