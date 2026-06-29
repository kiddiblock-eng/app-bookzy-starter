"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, BookOpen, TrendingUp } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 24 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: EASE } }),
};

const AVATARS = [
  "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",
];

const TOOL_CHIPS = ["Niche Hunter", "Radar Cash", "Designer", "Romans"];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 sm:pt-36 pb-16 sm:pb-24">
      {/* Backdrop subtil : halo + grille fondue */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div
          className="absolute left-1/2 top-0 -translate-x-1/2 w-[820px] h-[520px] max-w-full"
          style={{ background: "radial-gradient(ellipse at center, rgba(0,0,0,0.05), transparent 70%)" }}
        />
        <div
          className="absolute inset-0"
          style={{
            backgroundImage:
              "linear-gradient(to right, rgba(0,0,0,0.03) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.03) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 60% at 50% 30%, black, transparent 80%)",
          }}
        />
      </div>

      <div className="max-w-3xl mx-auto px-5 text-center">
        {/* Badge preuve sociale */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
          className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-neutral-50 border border-neutral-200 rounded-full mb-7">
          <div className="flex -space-x-2">
            {AVATARS.map((src, i) => (
              <img key={i} src={src} alt="" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
          <span className="text-xs font-semibold text-neutral-600">
            <span className="text-neutral-900">7 800+</span> créateurs actifs
          </span>
        </motion.div>

        {/* Titre */}
        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
          className="text-[34px] leading-[1.05] sm:text-6xl sm:leading-[1.03] font-semibold tracking-tight text-neutral-900">
          Crée et vends des ebooks,
          <br />
          <span className="text-neutral-400">l'IA fait le travail.</span>
        </motion.h1>

        {/* Sous-titre — UNE idée claire */}
        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
          className="mt-5 text-base sm:text-lg text-neutral-500 max-w-xl mx-auto leading-relaxed">
          Bookzy trouve les sujets qui rapportent, génère un ebook pro en une minute et te donne le kit pour le vendre. Sans rien écrire, sans designer.
        </motion.p>

        {/* CTA unique */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show"
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/auth/register"
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors">
            Créer mon premier ebook
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a href="#how" className="inline-flex items-center px-6 py-3.5 text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors">
            Voir comment ça marche
          </a>
        </motion.div>

        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show"
          className="mt-5 flex items-center justify-center gap-5 text-xs text-neutral-400">
          <span className="inline-flex items-center gap-1.5"><Check size={13} /> Gratuit pour commencer</span>
          <span className="inline-flex items-center gap-1.5"><Check size={13} /> Sans carte bancaire</span>
        </motion.div>
      </div>

      {/* Mockup produit */}
      <motion.div
        initial={{ opacity: 0, y: 40, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, delay: 0.4, ease: EASE }}
        className="relative max-w-3xl mx-auto px-5 mt-14 sm:mt-16"
      >
        <div className="relative rounded-2xl border border-neutral-200 bg-white shadow-[0_30px_80px_-24px_rgba(0,0,0,0.28)] overflow-hidden">
          {/* barre fenêtre */}
          <div className="h-10 border-b border-neutral-100 flex items-center gap-1.5 px-4">
            <span className="w-3 h-3 rounded-full bg-neutral-200" />
            <span className="w-3 h-3 rounded-full bg-neutral-200" />
            <span className="w-3 h-3 rounded-full bg-neutral-200" />
          </div>
          {/* réplique de l'écran focus */}
          <div className="px-6 py-12 sm:py-16 flex flex-col items-center">
            <div className="w-11 h-11 rounded-2xl bg-neutral-900 flex items-center justify-center mb-5">
              <BookOpen className="text-white" size={20} />
            </div>
            <p className="text-lg sm:text-xl font-semibold text-neutral-900 mb-6 text-center">
              Quel ebook veux-tu créer aujourd'hui ?
            </p>
            <div className="w-full max-w-md flex items-center gap-2 border border-neutral-200 rounded-[22px] pl-4 pr-2 py-2 shadow-sm">
              <span className="text-sm text-neutral-400 flex-1 text-left truncate">Comment vendre sur WhatsApp en Afrique…</span>
              <span className="w-9 h-9 rounded-full bg-neutral-900 flex items-center justify-center shrink-0">
                <ArrowRight size={16} className="text-white" />
              </span>
            </div>
            <div className="flex flex-wrap justify-center gap-2 mt-5">
              {TOOL_CHIPS.map((t) => (
                <span key={t} className="px-3 py-1.5 text-xs font-medium text-neutral-600 bg-neutral-50 border border-neutral-200 rounded-full">
                  {t}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Cartes flottantes */}
        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 0.6, ease: EASE }}
          className="hidden sm:block absolute -left-4 lg:-left-10 top-24"
        >
          <motion.div animate={{ y: [0, -9, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white rounded-xl border border-neutral-200 shadow-lg px-3.5 py-2.5 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0">
              <Check size={14} className="text-emerald-600" />
            </span>
            <div className="text-left">
              <p className="text-[11px] text-neutral-400 font-medium leading-none mb-1">Idée validée</p>
              <p className="text-[13px] font-bold text-neutral-900 leading-none">Score 87/100</p>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.2, duration: 0.6, ease: EASE }}
          className="hidden sm:block absolute -right-4 lg:-right-10 bottom-14"
        >
          <motion.div animate={{ y: [0, 9, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white rounded-xl border border-neutral-200 shadow-lg px-3.5 py-2.5 flex items-center gap-2.5">
            <span className="w-7 h-7 rounded-lg bg-neutral-900 flex items-center justify-center shrink-0">
              <TrendingUp size={14} className="text-white" />
            </span>
            <div className="text-left">
              <p className="text-[11px] text-neutral-400 font-medium leading-none mb-1">Vendu cette semaine</p>
              <p className="text-[13px] font-bold text-neutral-900 leading-none">+250 000 FCFA</p>
            </div>
          </motion.div>
        </motion.div>
      </motion.div>
    </section>
  );
}
