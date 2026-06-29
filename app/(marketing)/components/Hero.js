"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Check, Star } from "lucide-react";

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

// Covers d'ebooks (la couleur vient du produit) — éventail
const COVERS = [
  { titre: "Vendre sur WhatsApp", cat: "Business", grad: "linear-gradient(150deg,#6366f1,#8b5cf6)", rot: -9, x: -118, z: 10, delay: 0.55, float: 5 },
  { titre: "Coaching qui cartonne", cat: "Argent", grad: "linear-gradient(150deg,#f59e0b,#ef4444)", rot: 8, x: 118, z: 10, delay: 0.7, float: -5 },
  { titre: "Business Digital", cat: "Formation", grad: "linear-gradient(150deg,#10b981,#0d9488)", rot: 0, x: 0, z: 30, delay: 0.85, float: 6 },
];

function Cover({ c }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 50, rotate: c.rot * 1.6, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotate: c.rot, scale: 1 }}
      transition={{ duration: 0.8, delay: c.delay, ease: EASE }}
      className="absolute"
      style={{ transform: `translateX(${c.x}px)`, zIndex: c.z }}
    >
      <motion.div animate={{ y: [0, c.float, 0] }} transition={{ duration: 4.5, repeat: Infinity, ease: "easeInOut" }}>
        <div
          className="w-[152px] sm:w-[180px] rounded-xl overflow-hidden shadow-[0_24px_50px_-12px_rgba(0,0,0,0.35)] border border-black/5"
          style={{ aspectRatio: "3/4.2", background: c.grad }}
        >
          <div className="relative h-full w-full p-4 flex flex-col">
            <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-white/20" />
            <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">{c.cat}</span>
            <p className="mt-3 text-[17px] sm:text-[19px] font-bold text-white leading-tight">{c.titre}</p>
            <div className="mt-auto flex items-center gap-1.5">
              <span className="w-4 h-4 rounded bg-white/25" />
              <span className="text-[9px] font-bold uppercase tracking-widest text-white/80">Bookzy</span>
            </div>
          </div>
        </div>
      </motion.div>
    </motion.div>
  );
}

export default function Hero() {
  return (
    <section className="relative overflow-hidden bg-white pt-28 sm:pt-36 pb-20 sm:pb-28">
      {/* Backdrop : halo lumineux teinté */}
      <div className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute left-1/2 top-10 -translate-x-1/2 w-[760px] h-[480px] max-w-full opacity-70"
          style={{ background: "radial-gradient(ellipse at center, rgba(139,92,246,0.16), rgba(99,102,241,0.06) 45%, transparent 72%)" }} />
        <div className="absolute inset-0"
          style={{
            backgroundImage: "linear-gradient(to right, rgba(0,0,0,0.025) 1px, transparent 1px), linear-gradient(to bottom, rgba(0,0,0,0.025) 1px, transparent 1px)",
            backgroundSize: "48px 48px",
            maskImage: "radial-gradient(ellipse 70% 55% at 50% 28%, black, transparent 80%)",
            WebkitMaskImage: "radial-gradient(ellipse 70% 55% at 50% 28%, black, transparent 80%)",
          }} />
      </div>

      <div className="max-w-3xl mx-auto px-5 text-center">
        {/* Badge preuve sociale */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
          className="inline-flex items-center gap-2.5 px-3 py-1.5 bg-white border border-neutral-200 rounded-full mb-7 shadow-sm">
          <div className="flex -space-x-2">
            {AVATARS.map((src, i) => (
              <img key={i} src={src} alt="" className="w-6 h-6 rounded-full border-2 border-white object-cover" />
            ))}
          </div>
          <span className="flex items-center gap-1 text-xs font-semibold text-neutral-700">
            <Star size={12} className="fill-amber-400 text-amber-400" />
            <span className="text-neutral-900">7 800+</span> créateurs actifs
          </span>
        </motion.div>

        {/* Titre — noir franc + un mot en accent */}
        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
          className="text-[36px] leading-[1.04] sm:text-[64px] sm:leading-[1.02] font-bold tracking-tight text-neutral-900">
          Crée et vends des
          <br className="hidden sm:block" />{" "}
          ebooks{" "}
          <span className="bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 bg-clip-text text-transparent">
            rentables
          </span>
          .
        </motion.h1>

        {/* Sous-titre — une idée */}
        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
          className="mt-5 text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
          L'IA trouve les sujets qui rapportent, écrit et designe ton ebook en une minute, et te donne le kit pour le vendre. Toi, tu encaisses.
        </motion.p>

        {/* CTA */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show"
          className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <Link href="/auth/register"
            className="group inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors shadow-lg shadow-neutral-900/10">
            Créer mon premier ebook
            <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <a href="#how" className="inline-flex items-center px-6 py-3.5 text-sm font-semibold text-neutral-700 hover:text-neutral-900 transition-colors">
            Voir comment ça marche
          </a>
        </motion.div>

        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show"
          className="mt-5 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-xs text-neutral-400">
          <span className="inline-flex items-center gap-1.5"><Check size={13} /> Gratuit pour commencer</span>
          <span className="inline-flex items-center gap-1.5"><Check size={13} /> Sans carte bancaire</span>
          <span className="inline-flex items-center gap-1.5"><Check size={13} /> Premier ebook en 1 minute</span>
        </motion.div>
      </div>

      {/* Éventail de covers + carte revenu */}
      <div className="relative max-w-3xl mx-auto mt-16 sm:mt-20 h-[270px] sm:h-[300px] flex items-start justify-center">
        {COVERS.map((c) => <Cover key={c.titre} c={c} />)}

        <motion.div
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ delay: 1.1, duration: 0.6, ease: EASE }}
          className="absolute z-40 right-[6%] sm:right-[16%] bottom-2"
        >
          <motion.div animate={{ y: [0, -8, 0] }} transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="bg-white rounded-xl border border-neutral-200 shadow-xl px-3.5 py-2.5 flex items-center gap-2.5">
            <span className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center shrink-0 text-base">💸</span>
            <div className="text-left">
              <p className="text-[11px] text-neutral-400 font-medium leading-none mb-1">Vendu cette semaine</p>
              <p className="text-[14px] font-bold text-neutral-900 leading-none">+250 000 FCFA</p>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
