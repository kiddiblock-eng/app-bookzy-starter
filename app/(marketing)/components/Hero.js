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

const CHAPTERS = [
  "Trouver tes premiers clients",
  "Le message qui fait acheter",
  "Closer sans paraître insistant",
  "Automatiser tes ventes",
  "Fidéliser et faire revenir",
];

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-32 sm:pt-40 pb-20 sm:pb-28">
      {/* Backdrop doux */}
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
      </div>

      {/* Visuel « résultat » : cover + intérieur */}
      <motion.div
        initial={{ opacity: 0, y: 48, scale: 0.97 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.9, delay: 0.5, ease: EASE }}
        className="relative max-w-4xl mx-auto px-5 mt-16 sm:mt-20"
      >
        <motion.div animate={{ y: [0, -10, 0] }} transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}>
          <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-3 sm:p-5 shadow-[0_40px_90px_-30px_rgba(0,0,0,0.28)]">
            <div className="grid sm:grid-cols-2 gap-3 sm:gap-5 items-stretch">
              {/* COVER */}
              <div className="rounded-2xl overflow-hidden shadow-xl border border-black/5 min-h-[260px] sm:min-h-[360px]"
                style={{ background: "linear-gradient(150deg,#6366f1,#8b5cf6)" }}>
                <div className="relative h-full w-full p-6 sm:p-7 flex flex-col text-white">
                  <span className="absolute left-0 top-0 bottom-0 w-2 bg-white/20" />
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/70">Business</span>
                  <p className="mt-4 text-3xl sm:text-[40px] font-bold leading-[1.05]">Vendre sur WhatsApp</p>
                  <p className="mt-3 text-sm text-white/80 max-w-[85%]">Le guide complet, prêt à vendre.</p>
                  <div className="mt-auto flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-white/25" />
                    <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">Bookzy</span>
                  </div>
                </div>
              </div>
              {/* INTÉRIEUR */}
              <div className="rounded-2xl bg-white border border-neutral-200 p-6 sm:p-7 flex flex-col">
                <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400 mb-1.5">Sommaire</span>
                <p className="text-lg font-bold text-neutral-900 mb-5">Vendre sur WhatsApp</p>
                <ul className="space-y-3.5 flex-1">
                  {CHAPTERS.map((c, i) => (
                    <li key={i} className="flex items-center gap-3">
                      <span className="w-6 h-6 rounded-md flex items-center justify-center shrink-0 text-[11px] font-bold" style={{ background: "rgba(95,122,166,0.12)", color: ACCENT }}>{i + 1}</span>
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
            </div>
          </div>
        </motion.div>

        {/* badge flottant */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 1.1, duration: 0.5, ease: EASE }}
          className="hidden sm:flex absolute -top-4 right-8 lg:right-2 items-center gap-2 bg-white rounded-full border border-neutral-200 shadow-lg px-4 py-2"
        >
          <Sparkles size={14} style={{ color: ACCENT }} />
          <span className="text-[13px] font-semibold text-neutral-900">Plus pro que 99 % du marché</span>
        </motion.div>
      </motion.div>
    </section>
  );
}
