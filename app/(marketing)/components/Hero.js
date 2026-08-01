"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Star, Clock, Award } from "lucide-react";
import AvatarGroupAnimated from "./AvatarGroupAnimated";
import UpdateBadge from "./UpdateBadge";

const EASE = [0.22, 1, 0.36, 1];
const ACCENT = "#059669";
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.6, delay: i * 0.08, ease: EASE } }),
};


export default function Hero() {
  const router = useRouter();
  const [creators, setCreators] = useState(11639); // fallback = dernier compte connu
  useEffect(() => {
    let cancelled = false;
    fetch("/api/stats/users")
      .then((r) => r.json())
      .then((d) => { if (!cancelled && Number.isFinite(d?.count)) setCreators(d.count); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);
  const fmtCount = (n) => n.toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

  // Scroll doux vers la section exemples (sans ajouter de # dans l'URL).
  const scrollToExamples = () => {
    const el = document.getElementById("examples");
    if (!el) return;
    const y = el.getBoundingClientRect().top + window.scrollY - 72;
    window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <section className="relative bg-white pt-28 sm:pt-32 pb-14">
      <div className="max-w-2xl mx-auto px-5 text-center">
        {/* Badge mise à jour */}
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show"
          className="mb-7 flex justify-center">
          <UpdateBadge />
        </motion.div>

        {/* Titre punchy */}
        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
          className="text-[30px] leading-[1.12] sm:text-[46px] sm:leading-[1.07] font-extrabold tracking-tight text-neutral-900">
          Créez votre prochain ebook pro <span style={{ color: ACCENT }}>en 60 secondes.</span>
        </motion.h1>

        {/* Sous-titre concret */}
        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
          className="mt-6 text-base sm:text-lg text-neutral-600 leading-relaxed">
          Bookzy crée ton ebook et tout ce qu'il faut pour le vendre : couverture, affiche, textes marketing. Prêt à vendre en quelques minutes, pas en heures.
        </motion.p>

        {/* CTA : créer + voir des exemples */}
        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3">
          <button onClick={() => router.push("/auth/register")}
            className="group w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-neutral-900 text-white text-[15px] font-semibold rounded-2xl hover:bg-neutral-800 transition-colors">
            Créer mon ebook
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </button>
          <button onClick={scrollToExamples}
            className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-4 bg-white border border-neutral-200 text-neutral-900 text-[15px] font-semibold rounded-2xl hover:bg-neutral-50 hover:border-neutral-300 transition-colors">
            Voir des exemples
          </button>
        </motion.div>

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
        <motion.div variants={fadeUp} custom={5} initial="hidden" animate="show" className="mt-8 flex flex-wrap items-center justify-center gap-x-4 gap-y-3">
          <AvatarGroupAnimated />
          <div className="flex items-center gap-1.5">
            <div className="flex">
              {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={13} className="fill-amber-400 text-amber-400" />)}
            </div>
            <span className="text-sm text-neutral-600"><span className="font-semibold text-neutral-900">{fmtCount(creators)}</span> créateurs</span>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
