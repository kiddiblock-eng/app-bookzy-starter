"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";

const EASE = [0.22, 1, 0.36, 1];
const fadeUp = {
  hidden: { opacity: 0, y: 22 },
  show: (i = 0) => ({ opacity: 1, y: 0, transition: { duration: 0.7, delay: i * 0.09, ease: EASE } }),
};

const AVATARS = [
  "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",
  "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",
];

export default function Hero() {
  return (
    <section className="relative bg-white pt-28 sm:pt-36 pb-12 sm:pb-16">
      <div className="max-w-3xl mx-auto px-5 text-center">
        <motion.div variants={fadeUp} custom={0} initial="hidden" animate="show" className="flex items-center justify-center gap-2.5 mb-8">
          <div className="flex -space-x-2">
            {AVATARS.map((src, i) => <img key={i} src={src} alt="" className="w-7 h-7 rounded-full border-2 border-white object-cover" />)}
          </div>
          <span className="text-sm text-neutral-500">Rejoint par <span className="font-semibold text-neutral-800">25 000+ créateurs</span></span>
        </motion.div>

        <motion.h1 variants={fadeUp} custom={1} initial="hidden" animate="show"
          className="font-serif text-[34px] leading-[1.1] sm:text-[58px] sm:leading-[1.07] font-semibold tracking-tight text-neutral-900">
          Déléguez à Bookzy la rédaction, le design et la mise en forme de votre ebook.
        </motion.h1>

        <motion.p variants={fadeUp} custom={2} initial="hidden" animate="show"
          className="mt-6 text-base sm:text-xl text-neutral-600 max-w-2xl mx-auto leading-relaxed">
          Un résultat plus pro que 99 % du marché, prêt à vendre — sans passer des heures à rédiger ou à mettre en page.
        </motion.p>

        <motion.div variants={fadeUp} custom={3} initial="hidden" animate="show" className="mt-8">
          <Link href="/auth/register"
            className="group inline-flex items-center gap-2 px-7 py-4 bg-neutral-900 text-white text-[15px] font-semibold rounded-full hover:bg-neutral-800 transition-colors">
            Créer mon ebook
            <ArrowRight size={17} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <p className="mt-4 text-xs text-neutral-400">Gratuit pour commencer · Sans carte bancaire</p>
        </motion.div>
      </div>
    </section>
  );
}
