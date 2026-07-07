"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { BookOpen, Gauge, Radar, ArrowRight } from "lucide-react";

const ACCENT = "#059669";

const options = [
  {
    id: "creer",
    Icon: BookOpen,
    title: "Je veux créer mon ebook pro",
    desc: "J'ai mon sujet, je génère un ebook complet dès maintenant.",
    href: "/dashboard",
  },
  {
    id: "valider",
    Icon: Gauge,
    title: "J'ai une idée à valider",
    desc: "Je veux savoir si mon idée va se vendre avant de me lancer.",
    href: "/dashboard/analyseur",
  },
  {
    id: "chercher",
    Icon: Radar,
    title: "Je cherche une idée",
    desc: "Je veux voir ce qui se vend et trouver une niche rentable.",
    href: "/dashboard/radar-cash",
  },
];

export default function Onboarding() {
  const [choice, setChoice] = useState("");
  const [leaving, setLeaving] = useState(false);
  const router = useRouter();

  const go = (o) => {
    if (leaving) return;
    setChoice(o.id);
    setLeaving(true);
    try { localStorage.setItem("onboardingStep", "done"); } catch { /* ignore */ }
    setTimeout(() => router.push(o.href), 260);
  };

  return (
    <main className="relative min-h-[100dvh] flex flex-col items-center justify-center px-5 py-14 overflow-hidden bg-white">
      {/* Halo vert diffus */}
      <div className="pointer-events-none absolute inset-0"
        style={{ background: "radial-gradient(80% 55% at 50% 0%, rgba(5,150,105,0.10), transparent 60%), radial-gradient(60% 50% at 50% 110%, rgba(5,150,105,0.14), transparent 65%)" }} />

      {/* Logo */}
      <div className="absolute top-6 left-6 flex items-center">
        <img src="/logo12.webp" alt="Bookzy" className="h-7 w-auto object-contain" />
      </div>

      <div className="relative w-full max-w-xl">
        {/* Titre */}
        <motion.div
          initial={{ opacity: 0, y: 14 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5, ease: [0.22, 1, 0.36, 1] }}
          className="text-center mb-10"
        >
          <span className="inline-block px-3 py-1 rounded-full text-[11px] font-bold uppercase tracking-widest mb-4"
            style={{ background: "rgba(5,150,105,0.10)", color: ACCENT }}>
            Bienvenue sur Bookzy
          </span>
          <h1 className="text-3xl sm:text-4xl font-black tracking-tight text-slate-900 leading-tight">
            Par où veux-tu <span style={{ color: ACCENT }}>commencer</span> ?
          </h1>
          <p className="mt-3 text-slate-500 text-sm sm:text-base">
            Choisis ton point de départ, tu pourras tout explorer ensuite.
          </p>
        </motion.div>

        {/* Choix */}
        <div className="space-y-3.5">
          {options.map((o, i) => {
            const active = choice === o.id;
            return (
              <motion.button
                key={o.id}
                type="button"
                onClick={() => go(o)}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.45, delay: 0.12 + i * 0.09, ease: [0.22, 1, 0.36, 1] }}
                whileHover={{ y: -3 }}
                whileTap={{ scale: 0.99 }}
                className={`group relative w-full flex items-center gap-4 text-left rounded-2xl border bg-white p-4 sm:p-5 transition-colors duration-200
                  ${active ? "border-emerald-500 shadow-xl" : "border-slate-200 hover:border-emerald-400 hover:shadow-lg"}`}
              >
                <span
                  className="shrink-0 w-12 h-12 sm:w-14 sm:h-14 rounded-2xl flex items-center justify-center transition-colors"
                  style={{ background: "rgba(5,150,105,0.10)", color: ACCENT }}
                >
                  <o.Icon className="w-6 h-6 sm:w-7 sm:h-7" strokeWidth={2} />
                </span>

                <span className="flex-1 min-w-0">
                  <span className="block text-base sm:text-lg font-bold text-slate-900">{o.title}</span>
                  <span className="block text-sm text-slate-500 mt-0.5 leading-snug">{o.desc}</span>
                </span>

                <ArrowRight
                  className="shrink-0 w-5 h-5 text-slate-300 group-hover:text-emerald-600 -translate-x-1 group-hover:translate-x-0 transition-all"
                />
              </motion.button>
            );
          })}
        </div>

        {/* Skip */}
        <motion.div
          initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.5 }}
          className="text-center mt-8"
        >
          <button type="button" onClick={() => go({ id: "skip", href: "/dashboard" })}
            className="text-sm text-slate-400 hover:text-slate-600 transition-colors">
            Explorer le dashboard directement
          </button>
        </motion.div>
      </div>
    </main>
  );
}
