"use client";

import { motion } from "framer-motion";
import { Check, FileText, ArrowRight, ArrowDown, Youtube } from "lucide-react";
import { Reveal } from "./Reveal";

const ACCENT = "#5f7aa6";
const EASE = [0.22, 1, 0.36, 1];
const view = { once: true, margin: "-70px" };

/* ── Visuels : composés de petits éléments (listes / barres / chips / badges) ── */

function Bar({ pct, delay }) {
  return (
    <div className="h-1.5 flex-1 rounded-full bg-neutral-100 overflow-hidden">
      <motion.div
        className="h-full rounded-full"
        style={{ background: ACCENT, width: `${pct}%`, transformOrigin: "left" }}
        initial={{ scaleX: 0 }}
        whileInView={{ scaleX: 1 }}
        viewport={view}
        transition={{ duration: 0.7, delay, ease: EASE }}
      />
    </div>
  );
}

function GraphicNiche() {
  const rows = [
    { n: "Vendre sur WhatsApp", s: "9/10", pct: 90 },
    { n: "Visa Canada", s: "8/10", pct: 80 },
    { n: "Forex débutant", s: "7/10", pct: 70 },
  ];
  return (
    <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 sm:p-6">
      <div className="flex items-center justify-between mb-5">
        <span className="text-xs font-bold uppercase tracking-wider text-neutral-400">Opportunités détectées</span>
        <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-600">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" /> En direct
        </span>
      </div>
      <div className="space-y-4">
        {rows.map((r, i) => (
          <motion.div key={r.n} initial={{ opacity: 0, y: 10 }} whileInView={{ opacity: 1, y: 0 }} viewport={view} transition={{ delay: 0.1 + i * 0.1, duration: 0.4 }} className="flex items-center gap-3">
            <span className="text-sm font-medium text-neutral-800 w-36 shrink-0 truncate">{r.n}</span>
            <Bar pct={r.pct} delay={0.25 + i * 0.1} />
            <span className="text-[11px] font-bold text-neutral-900 px-2 py-0.5 rounded-md bg-neutral-100 shrink-0">{r.s}</span>
          </motion.div>
        ))}
      </div>
      <div className="mt-5 pt-4 border-t border-neutral-100 text-xs text-neutral-400">+ 10 niches rentables sur ce mot-clé</div>
    </div>
  );
}

function GraphicDesign() {
  const templates = ["Moderne", "Luxe", "Minimal", "Tech", "Afrique", "Business"];
  return (
    <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-2 px-3 py-2 rounded-xl bg-neutral-100 text-sm font-semibold text-neutral-700">
          <FileText size={15} className="text-neutral-500" /> mon-texte.docx
        </span>
        <ArrowRight size={16} className="text-neutral-300 shrink-0" />
        <span className="px-3 py-2 rounded-xl text-sm font-semibold text-white" style={{ background: ACCENT }}>PDF pro</span>
      </div>

      <p className="mt-6 mb-2.5 text-xs font-bold uppercase tracking-wider text-neutral-400">12 templates</p>
      <div className="flex flex-wrap gap-2">
        {templates.map((t, i) => (
          <motion.span key={t} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={view} transition={{ delay: 0.15 + i * 0.06, duration: 0.3 }}
            className="px-3 py-1.5 rounded-full border border-neutral-200 text-xs font-medium text-neutral-600">{t}</motion.span>
        ))}
      </div>

      <div className="mt-6 inline-flex items-center gap-1.5 text-[13px] font-semibold text-neutral-700">
        <span className="w-4 h-4 rounded-full flex items-center justify-center" style={{ background: "rgba(95,122,166,0.14)" }}><Check size={10} style={{ color: ACCENT }} strokeWidth={3} /></span>
        Cover générée automatiquement
      </div>
    </div>
  );
}

function GraphicYoutube() {
  const chapters = ["Introduction au sujet", "Les 3 piliers essentiels", "La méthode pas à pas", "Erreurs à éviter"];
  return (
    <div className="rounded-2xl bg-white border border-neutral-200 shadow-sm p-5 sm:p-6">
      <div className="flex items-center gap-2.5 px-3 py-2.5 rounded-xl bg-neutral-50 border border-neutral-200">
        <Youtube size={16} className="text-red-500 shrink-0" />
        <span className="text-sm text-neutral-400 truncate">youtube.com/watch?v=…</span>
      </div>
      <div className="flex justify-center my-3"><ArrowDown size={16} className="text-neutral-300" /></div>
      <div className="space-y-2">
        {chapters.map((c, i) => (
          <motion.div key={c} initial={{ opacity: 0, x: -8 }} whileInView={{ opacity: 1, x: 0 }} viewport={view} transition={{ delay: 0.15 + i * 0.1, duration: 0.35 }}
            className="flex items-center gap-3 px-3 py-2.5 rounded-xl bg-neutral-50">
            <span className="w-5 h-5 rounded-md flex items-center justify-center text-[11px] font-bold shrink-0" style={{ background: "rgba(95,122,166,0.14)", color: ACCENT }}>{i + 1}</span>
            <span className="text-sm text-neutral-700">{c}</span>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

const ROWS = [
  {
    eyebrow: "Stratégie",
    title: "Créez sur ce qui se vend déjà.",
    text: "Niche Hunter, Radar Cash et le Validateur analysent le marché réel pour vous dire quoi créer — avant même d'écrire une ligne.",
    bullets: ["Niches rentables en 30 secondes", "Score de rentabilité sur 100", "Pubs gagnantes espionnées en direct"],
    Graphic: GraphicNiche, reverse: false,
  },
  {
    eyebrow: "Design",
    title: "Importez votre texte, obtenez un ebook pro.",
    text: "Collez votre contenu ou un fichier Word : Bookzy applique une mise en page et une cover professionnelles en 20 secondes.",
    bullets: ["Import .docx automatique", "12 templates professionnels", "Export PDF haute qualité"],
    Graphic: GraphicDesign, reverse: true,
  },
  {
    eyebrow: "Recyclage",
    title: "Une vidéo YouTube devient un ebook.",
    text: "Collez le lien d'une formation, d'un podcast ou d'un tuto : l'IA en extrait le contenu et le structure en ebook complet.",
    bullets: ["Formations, podcasts, tutos", "Contenu structuré en chapitres", "Prêt à vendre"],
    Graphic: GraphicYoutube, reverse: false,
  },
];

function Row({ eyebrow, title, text, bullets, Graphic, reverse }) {
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
        <div className="rounded-3xl border border-neutral-200 bg-neutral-50 p-5 sm:p-8">
          <Graphic />
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
