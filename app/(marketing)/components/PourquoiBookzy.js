"use client";

import { X, Check } from "lucide-react";
import { Reveal } from "./Reveal";

const ACCENT = "#5f7aa6";

const SANS = [
  "Chercher une idée à l'aveugle pendant des heures",
  "Écrire des dizaines de pages soi-même",
  "Payer un designer pour la mise en page",
  "Créer et espérer que ça se vende",
  "Galérer à écrire les textes de vente",
];

const AVEC = [
  "Les niches rentables sorties en 30 secondes",
  "L'IA rédige l'ebook complet pour toi",
  "Design pro et cover générés automatiquement",
  "Un score de rentabilité avant de te lancer",
  "Kit marketing WhatsApp & Facebook inclus",
];

export default function PourquoiBookzy() {
  return (
    <section className="bg-neutral-50 py-20 sm:py-28">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>Pourquoi Bookzy</p>
          <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">Avant, c'était la galère. Plus maintenant.</h2>
        </Reveal>

        <div className="grid md:grid-cols-2 gap-4">
          <Reveal className="rounded-2xl border border-neutral-200 bg-white p-7">
            <p className="text-sm font-bold text-neutral-400 uppercase tracking-wide mb-5">Sans Bookzy</p>
            <ul className="space-y-3.5">
              {SANS.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full bg-neutral-100 flex items-center justify-center shrink-0 mt-0.5"><X size={12} className="text-neutral-400" /></span>
                  <span className="text-sm text-neutral-500">{s}</span>
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={0.1} className="rounded-2xl border-2 border-[#5f7aa6] bg-white p-7 shadow-lg">
            <p className="text-sm font-bold uppercase tracking-wide mb-5" style={{ color: ACCENT }}>Avec Bookzy</p>
            <ul className="space-y-3.5">
              {AVEC.map((s) => (
                <li key={s} className="flex items-start gap-3">
                  <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0 mt-0.5" style={{ background: "rgba(95,122,166,0.14)" }}><Check size={12} style={{ color: ACCENT }} strokeWidth={3} /></span>
                  <span className="text-sm text-neutral-700">{s}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </div>
    </section>
  );
}
