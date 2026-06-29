"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight } from "lucide-react";
import { Reveal } from "./Reveal";

const ACCENT = "#5f7aa6";
const EASE = [0.22, 1, 0.36, 1];

const COVERS = [
  { t: "Vendre sur WhatsApp", c: "Business", g: "linear-gradient(150deg,#6366f1,#8b5cf6)" },
  { t: "Maigrir sans sport", c: "Santé", g: "linear-gradient(150deg,#ef4444,#f59e0b)" },
  { t: "Forex pour débutants", c: "Finance", g: "linear-gradient(150deg,#0ea5e9,#2563eb)" },
  { t: "Coaching de couple", c: "Relations", g: "linear-gradient(150deg,#ec4899,#be185d)" },
  { t: "Business Digital", c: "Formation", g: "linear-gradient(150deg,#10b981,#0d9488)" },
  { t: "Confiance en soi", c: "Mindset", g: "linear-gradient(150deg,#8b5cf6,#6d28d9)" },
  { t: "Recettes africaines", c: "Cuisine", g: "linear-gradient(150deg,#f59e0b,#b45309)" },
  { t: "Réussir son Visa", c: "Immigration", g: "linear-gradient(150deg,#0f766e,#0891b2)" },
];

function Cover({ t, c, g, i }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-60px" }}
      transition={{ duration: 0.5, delay: (i % 4) * 0.06, ease: EASE }}
      whileHover={{ y: -6 }}
      className="rounded-xl overflow-hidden shadow-[0_18px_40px_-16px_rgba(0,0,0,0.3)] border border-black/5"
      style={{ aspectRatio: "3/4.2", background: g }}
    >
      <div className="relative h-full w-full p-4 flex flex-col">
        <span className="absolute left-0 top-0 bottom-0 w-1.5 bg-white/20" />
        <span className="text-[9px] font-bold uppercase tracking-[0.18em] text-white/70">{c}</span>
        <p className="mt-2.5 text-[15px] sm:text-[16px] font-bold text-white leading-tight">{t}</p>
        <div className="mt-auto flex items-center gap-1.5">
          <span className="w-3.5 h-3.5 rounded bg-white/25" />
          <span className="text-[8px] font-bold uppercase tracking-widest text-white/80">Bookzy</span>
        </div>
      </div>
    </motion.div>
  );
}

export default function TemplatesSection() {
  return (
    <section className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>Exemples</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">Des ebooks qui donnent envie d'acheter.</h2>
          <p className="mt-4 text-neutral-500">Chacun arrive avec sa cover, sa mise en page pro et son kit marketing.</p>
        </Reveal>

        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-5">
          {COVERS.map((c, i) => <Cover key={c.t} {...c} i={i} />)}
        </div>

        <Reveal className="text-center mt-12">
          <Link href="/auth/register" className="group inline-flex items-center gap-2 px-6 py-3.5 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors">
            Créer le mien <ArrowRight size={16} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </Reveal>
      </div>
    </section>
  );
}
