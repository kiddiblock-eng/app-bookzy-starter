"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ChevronDown } from "lucide-react";
import { Reveal } from "./Reveal";

const ACCENT = "#059669";

const QA = [
  { q: "C'est gratuit pour commencer ?", a: "Oui. Tu peux explorer Bookzy et tester Niche Hunter et le Validateur gratuitement chaque semaine. Tu ne paies que pour générer tes ebooks." },
  { q: "Comment je paie ?", a: "Par mobile money (Orange, MTN, Moov, Wave…) ou carte. Un seul paiement, aucun prélèvement automatique." },
  { q: "Mes ebooks expirent-ils ?", a: "Jamais. Tu paies tes ebooks une fois et ils restent à toi pour toujours." },
  { q: "C'est quoi la différence entre les outils ?", a: "Niche Hunter et Radar Cash trouvent les sujets qui se vendent, le Validateur note ton idée sur 100, et la génération + Designer + Youbook + Romans créent l'ebook complet." },
  { q: "Je peux revendre les ebooks générés ?", a: "Oui, à 100 %. Ce que tu crées t'appartient : tu le vends et tu gardes tout." },
  { q: "Ça marche sur mobile ?", a: "Oui, tout se fait depuis ton téléphone — de la recherche d'idée à la vente." },
];

export default function FAQ() {
  const [open, setOpen] = useState(0);
  return (
    <section id="faq" className="bg-white py-14 sm:py-20">
      <div className="max-w-3xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>FAQ</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">Questions fréquentes.</h2>
        </Reveal>

        <div className="border-t border-neutral-200">
          {QA.map((item, i) => {
            const isOpen = open === i;
            return (
              <div key={i} className="border-b border-neutral-200">
                <button
                  onClick={() => setOpen(isOpen ? -1 : i)}
                  className="w-full flex items-center justify-between gap-4 py-5 text-left"
                >
                  <span className="text-[15px] sm:text-base font-semibold text-neutral-900">{item.q}</span>
                  <ChevronDown
                    size={18}
                    className={`shrink-0 text-neutral-400 transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`}
                  />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                      className="overflow-hidden"
                    >
                      <p className="pb-5 pr-8 text-sm text-neutral-500 leading-relaxed">{item.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
