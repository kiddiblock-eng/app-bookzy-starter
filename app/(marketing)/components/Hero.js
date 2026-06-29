"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, Check } from "lucide-react";

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

const ROTATE = ["en 1 min", "pour vendre", "pour apprendre"];
const ACCENT = "#5f7aa6"; // bleu grisé

function RotatingWord() {
  const [i, setI] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setI((x) => (x + 1) % ROTATE.length), 2000);
    return () => clearInterval(t);
  }, []);
  return (
    <span className="inline-flex justify-center overflow-hidden align-bottom" style={{ color: ACCENT }}>
      <AnimatePresence mode="wait">
        <motion.span
          key={i}
          initial={{ opacity: 0, y: "0.5em" }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: "-0.5em" }}
          transition={{ duration: 0.4, ease: EASE }}
          className="inline-block"
        >
          {ROTATE[i]}
        </motion.span>
      </AnimatePresence>
    </span>
  );
}

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
          style={{ background: "radial-gradient(ellipse at center, rgba(95,122,166,0.16), rgba(95,122,166,0.05) 45%, transparent 72%)" }} />
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
          <span className="text-xs font-semibold text-neutral-700">
            <span className="text-neutral-900">25 000+</span> créateurs actifs
          </span>
        </motion.div>

        {/* Titre — IA + mot qui tourne (bleu grisé) */}
        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
          className="text-[34px] leading-[1.07] sm:text-[60px] sm:leading-[1.04] font-bold tracking-tight text-neutral-900">
          L'IA qui écrit et designe
          <br className="hidden sm:block" />{" "}
          ton ebook pro{" "}
          <RotatingWord />
        </motion.h1>

        {/* Sous-titre */}
        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
          className="mt-5 text-base sm:text-lg text-neutral-600 max-w-xl mx-auto leading-relaxed">
          Bookzy te trouve les sujets qui rapportent et te donne le kit marketing pour vendre. Tu choisis, l'IA fait le reste.
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

      {/* Éventail de covers */}
      <div className="relative max-w-3xl mx-auto mt-16 sm:mt-20 h-[260px] sm:h-[290px] flex items-start justify-center">
        {COVERS.map((c) => <Cover key={c.titre} c={c} />)}
      </div>
    </section>
  );
}
