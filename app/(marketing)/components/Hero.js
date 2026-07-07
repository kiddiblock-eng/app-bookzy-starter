"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Award } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const ACCENT = "#059669";
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: EASE } }),
};

const AVATARS = [
  "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",
];

export default function Hero() {
  const router = useRouter();
  const [sujet, setSujet] = useState("");

  const go = (e) => {
    e.preventDefault();
    router.push(sujet.trim() ? `/auth/register?suggestion=${encodeURIComponent(sujet.trim())}` : "/auth/register");
  };

  return (
    <section className="relative bg-white pt-28 sm:pt-32 pb-14">
      <div className="max-w-2xl mx-auto px-5 text-center">
        {/* Badge */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
          className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-neutral-200 bg-white mb-7">
          <span className="w-2 h-2 rounded-full bg-emerald-500" />
          <span className="text-xs font-semibold text-neutral-700">La création d'ebooks pour l'Afrique francophone</span>
        </motion.div>

        {/* Titre punchy */}
        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
          className="text-[30px] leading-[1.12] sm:text-[46px] sm:leading-[1.07] font-extrabold tracking-tight text-neutral-900">
          Créez votre prochain ebook pro <span style={{ color: ACCENT }}>en 60 secondes.</span>
        </motion.h1>

        {/* Sous-titre concret */}
        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
          className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed">
          Bookzy écrit et designe ton ebook. Un résultat plus pro que 99 % du marché, sans passer des heures à rédiger ou à mettre en page.
        </motion.p>

        {/* Champ "essaie tout de suite" */}
        <motion.form variants={fadeUp} custom={3} initial="hidden" animate="show" onSubmit={go} className="mt-8 max-w-md mx-auto">
          <input
            type="text"
            value={sujet}
            onChange={(e) => setSujet(e.target.value)}
            placeholder="Le sujet de ton ebook…"
            className="w-full px-5 py-4 rounded-2xl border border-neutral-200 text-[15px] text-neutral-900 placeholder:text-neutral-400 outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all"
          />
          <button type="submit"
            className="group mt-2.5 w-full inline-flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white text-[15px] font-semibold rounded-2xl hover:bg-neutral-800 transition-colors">
            Créer mon ebook
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
        </motion.form>

        <motion.div variants={fadeUp} custom={4} initial="hidden" animate="show" className="mt-5 flex items-center justify-center gap-x-4 sm:gap-x-6 text-[11px] sm:text-[13px] font-medium text-neutral-700">
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(5,150,105,0.12)" }}>
              <Clock size={11} style={{ color: ACCENT }} />
            </span>
            Un ebook complet en 1 minute
          </span>
          <span className="inline-flex items-center gap-1.5 whitespace-nowrap">
            <span className="w-5 h-5 rounded-lg flex items-center justify-center shrink-0" style={{ background: "rgba(5,150,105,0.12)" }}>
              <Award size={11} style={{ color: ACCENT }} />
            </span>
            Un rendu digne d'un pro
          </span>
        </motion.div>

        {/* Preuve sociale */}
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show" className="mt-7 flex items-center justify-center gap-3">
          <div className="flex -space-x-2">
            {AVATARS.map((src, i) => <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />)}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
            </div>
            <span className="text-sm text-neutral-600"><span className="font-semibold text-neutral-900">+25 000</span> créateurs actifs</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
