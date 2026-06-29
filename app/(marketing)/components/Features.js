"use client";

import { Check } from "lucide-react";
import { Reveal } from "./Reveal";
import { VisualWriting, VisualDesign, VisualMarket } from "./FeatureVisuals";

const ACCENT = "#5f7aa6";

const ROWS = [
  {
    eyebrow: "Rédaction",
    title: "L'IA rédige votre ebook, du début à la fin.",
    text: "Décrivez votre sujet en une phrase. Bookzy structure le plan, écrit chaque chapitre et adapte le ton à votre audience.",
    bullets: ["Sommaire et chapitres complets", "Ton adapté à votre cible", "Prêt à vendre en une minute"],
    Visual: VisualWriting, reverse: false,
  },
  {
    eyebrow: "Design",
    title: "Une mise en page et une cover dignes d'un pro.",
    text: "Pas besoin de graphiste. Bookzy applique un design propre et génère une cover qui donne envie d'acheter.",
    bullets: ["12 templates professionnels", "Cover générée automatiquement", "Export PDF haute qualité"],
    Visual: VisualDesign, reverse: true,
  },
  {
    eyebrow: "Stratégie",
    title: "Créez ce qui se vend déjà.",
    text: "Niche Hunter, Radar Cash et le Validateur analysent le marché réel pour vous dire quoi créer — avant d'écrire une ligne.",
    bullets: ["Niches rentables en 30 secondes", "Score de rentabilité sur 100", "Pubs gagnantes espionnées en direct"],
    Visual: VisualMarket, reverse: false,
  },
];

function Row({ eyebrow, title, text, bullets, Visual, reverse }) {
  return (
    <div className="grid lg:grid-cols-2 gap-10 lg:gap-16 items-center">
      <Reveal y={28} className={reverse ? "lg:order-2" : ""}>
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>{eyebrow}</p>
        <h3 className="text-3xl sm:text-4xl font-bold tracking-tight text-neutral-900 mb-4 leading-tight">{title}</h3>
        <p className="text-neutral-500 text-lg leading-relaxed mb-6">{text}</p>
        <ul className="space-y-3">
          {bullets.map((b) => (
            <li key={b} className="flex items-center gap-3">
              <span className="w-5 h-5 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(95,122,166,0.14)" }}>
                <Check size={12} style={{ color: ACCENT }} strokeWidth={3} />
              </span>
              <span className="text-[15px] text-neutral-700">{b}</span>
            </li>
          ))}
        </ul>
      </Reveal>

      <Reveal y={28} delay={0.1} className={reverse ? "lg:order-1" : ""}>
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6 sm:p-10">
          <Visual />
        </div>
      </Reveal>
    </div>
  );
}

export default function Features() {
  return (
    <section id="outils" className="bg-white py-20 sm:py-28">
      <div className="max-w-6xl mx-auto px-5 sm:px-6 space-y-24 sm:space-y-32">
        {ROWS.map((r, i) => <Row key={i} {...r} />)}
      </div>
    </section>
  );
}
