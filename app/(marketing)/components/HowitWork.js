"use client";

import { motion } from "framer-motion";
import { MessageSquareText, PenLine, Download } from "lucide-react";
import { Reveal, Stagger, staggerItem } from "./Reveal";

const ACCENT = "#059669";

const STEPS = [
  { n: "01", Icon: MessageSquareText, title: "Décris ton idée", desc: "En une phrase, dis à l'IA le sujet de ton ebook. Pas besoin d'écrire quoi que ce soit — juste l'idée." },
  { n: "02", Icon: PenLine, title: "L'IA écrit et designe tout", desc: "Contenu, chapitres, mise en page et cover : générés automatiquement en une minute. Zéro compétence technique." },
  { n: "03", Icon: Download, title: "Télécharge et vends", desc: "Ton PDF pro est prêt, avec le kit marketing pour le partager sur WhatsApp et le vendre." },
];

export default function HowitWork() {
  return (
    <section id="how" className="bg-white py-14 sm:py-20">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14 sm:mb-16">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>Comment ça marche</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">Créer un ebook, c'est devenu enfantin.</h2>
          <p className="mt-4 text-neutral-500">Pas besoin d'écrire, ni de savoir designer. Tu donnes l'idée, l'IA fait absolument tout.</p>
        </Reveal>

        <Stagger className="grid md:grid-cols-3 gap-5">
          {STEPS.map((s) => (
            <motion.div key={s.n} variants={staggerItem}
              className="relative rounded-2xl border border-neutral-200 bg-white p-7 hover:shadow-lg hover:-translate-y-1 transition-all">
              <span className="absolute top-5 right-6 text-5xl font-bold text-neutral-100 select-none">{s.n}</span>
              <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-5" style={{ background: "rgba(5,150,105,0.1)" }}>
                <s.Icon size={20} style={{ color: ACCENT }} />
              </div>
              <h3 className="text-lg font-semibold text-neutral-900 mb-2">{s.title}</h3>
              <p className="text-sm text-neutral-500 leading-relaxed">{s.desc}</p>
            </motion.div>
          ))}
        </Stagger>
      </div>
    </section>
  );
}
