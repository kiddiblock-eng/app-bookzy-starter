"use client";

import { Check } from "lucide-react";
import { Reveal } from "./Reveal";
import ScreenFrame from "./ScreenFrame";

const ACCENT = "#5f7aa6";

const ROWS = [
  {
    eyebrow: "Stratégie",
    title: "Créez sur ce qui se vend déjà.",
    text: "Niche Hunter, Radar Cash et le Validateur analysent le marché réel pour vous dire quoi créer — avant même d'écrire une ligne.",
    bullets: ["Niches rentables en 30 secondes", "Score de rentabilité sur 100", "Pubs gagnantes espionnées en direct"],
    img: "/screenshots/niche-hunter.png", reverse: false,
  },
  {
    eyebrow: "Design",
    title: "Importez votre texte, obtenez un ebook pro.",
    text: "Collez votre contenu ou un fichier Word : Bookzy applique une mise en page et une cover professionnelles en 20 secondes.",
    bullets: ["Import .docx automatique", "12 templates professionnels", "Export PDF haute qualité"],
    img: "/screenshots/express.png", reverse: true,
  },
  {
    eyebrow: "Recyclage",
    title: "Une vidéo YouTube devient un ebook.",
    text: "Collez le lien d'une formation, d'un podcast ou d'un tuto : l'IA en extrait le contenu et le structure en ebook complet.",
    bullets: ["Formations, podcasts, tutos", "Contenu structuré en chapitres", "Prêt à vendre"],
    img: "/screenshots/youbook.png", reverse: false,
  },
];

function Row({ eyebrow, title, text, bullets, img, reverse }) {
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

      <ScreenFrame src={img} alt={title} aspect="4/3" className={reverse ? "lg:order-1" : ""} />
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
