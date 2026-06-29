"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const ACCENT = "#5f7aa6";
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.09, ease: EASE } }),
};

const AVATARS = [
  "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",
];

const CHIPS = ["Génération IA", "Niche Hunter", "Radar Cash", "Ebook Designer", "Romans IA", "Youbook"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 sm:pt-44 pb-24 sm:pb-32">
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-0 -translate-x-1/2 w-[820px] h-[520px] max-w-full opacity-70"
          style={{ background: "radial-gradient(ellipse at center, rgba(95,122,166,0.14), rgba(95,122,166,0.04) 45%, transparent 72%)" }} />
      </div>

      <div className="max-w-3xl mx-auto px-5 text-center">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
          className="inline-flex items-center gap-2 px-3 py-1.5 bg-white border border-neutral-200 rounded-full mb-8 shadow-sm">
          <Sparkles size={13} style={{ color: ACCENT }} />
          <span className="text-xs font-semibold text-neutral-700">Propulsé par l'IA · 25 000+ créateurs</span>
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
          className="text-[34px] leading-[1.08] sm:text-[60px] sm:leading-[1.05] font-bold tracking-tight text-neutral-900">
          Déléguez la rédaction et le design de votre ebook à Bookzy,
          <span className="block mt-1" style={{ color: ACCENT }}>réjouissez-vous du résultat en 1 minute.</span>
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
          className="mt-6 text-base sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Laissez Bookzy écrire, designer et mettre en forme votre prochain ebook. Un résultat plus pro que 99 % du marché, sans passer des heures à rédiger ou à mettre en page.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="mt-9 flex flex-col items-center gap-5">
          <Link href="/auth/register"
            className="group inline-flex items-center gap-2 px-7 py-4 bg-neutral-900 text-white text-[15px] font-semibold rounded-full hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/10">
            Créer mon ebook
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <div className="flex items-center gap-2.5">
            <div className="flex -space-x-2">
              {AVATARS.map((src, i) => <img key={i} src={src} alt="" className="w-6 h-6 rounded-full border-2 border-white object-cover" />)}
            </div>
            <span className="text-xs text-neutral-500">Déjà adopté par <span className="font-semibold text-neutral-700">25 000+ créateurs</span></span>
          </div>
        </motion.div>

        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show" className="mt-12 flex flex-wrap justify-center gap-2">
          {CHIPS.map((c) => (
            <span key={c} className="px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white text-xs font-medium text-neutral-600">{c}</span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
