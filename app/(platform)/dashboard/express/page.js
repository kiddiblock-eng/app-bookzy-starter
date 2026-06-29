"use client";

import { useState } from "react";
import Link from "next/link";
import { Pencil, FileUp, Check, X, ArrowRight } from "lucide-react";

const DETAILS = {
  editor: {
    title: "Écrire mon contenu",
    features: [
      "Éditeur riche (gras, titres, listes)",
      "IA intégrée (améliorer, corriger)",
      "10 améliorations IA incluses",
      "Copier-coller depuis Word",
      "Aperçu en temps réel",
      "12 templates professionnels",
    ],
  },
  import: {
    title: "Importer depuis Word",
    features: [
      "Import .docx automatique",
      "Détection des chapitres",
      "Ajustement du sommaire",
      "Génération ultra-rapide",
      "Documents structurés supportés",
      "Choix du template après import",
    ],
  },
};

function DetailsModal({ type, onClose }) {
  if (!type) return null;
  const data = DETAILS[type];
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl" onClick={(e) => e.stopPropagation()}>
        <div className="p-6">
          <div className="flex items-center justify-between mb-5">
            <h2 className="text-base font-semibold text-neutral-900">{data.title}</h2>
            <button onClick={onClose} className="w-8 h-8 rounded-lg bg-neutral-100 hover:bg-neutral-200 flex items-center justify-center transition-colors">
              <X size={15} className="text-neutral-500" />
            </button>
          </div>
          <ul className="space-y-3 mb-6">
            {data.features.map((f, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-4 h-4 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                  <Check size={11} className="text-neutral-900" strokeWidth={3} />
                </span>
                <span className="text-sm text-neutral-600">{f}</span>
              </li>
            ))}
          </ul>
          <button onClick={onClose} className="w-full py-3 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
            Fermer
          </button>
        </div>
      </div>
    </div>
  );
}

const OPTIONS = [
  {
    type: "editor",
    href: "/dashboard/express/editor",
    Icon: Pencil,
    title: "Écrire mon contenu",
    desc: "Rédige avec l'éditeur enrichi et l'assistance IA",
    perks: ["10 améliorations IA incluses", "Éditeur riche complet", "12 templates professionnels"],
    cta: "Commencer",
  },
  {
    type: "import",
    href: "/dashboard/express/import",
    Icon: FileUp,
    title: "Importer depuis Word",
    desc: "Uploade ton .docx et obtiens un ebook mis en page",
    perks: ["Détection des chapitres", "Ajustement du sommaire", "Mise en page instantanée"],
    cta: "Importer",
  },
];

export default function ExpressHome() {
  const [modalType, setModalType] = useState(null);

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-white">
      <DetailsModal type={modalType} onClose={() => setModalType(null)} />

      <div className="max-w-3xl mx-auto px-4 py-12 sm:py-16">
        {/* Header */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-2">Ebook Designer</h1>
          <p className="text-neutral-500 text-sm">
            Transforme tes textes et fichiers Word en PDF professionnels en quelques secondes.
          </p>
        </div>

        {/* Options */}
        <div className="grid sm:grid-cols-2 gap-4">
          {OPTIONS.map((o) => (
            <div key={o.type} className="rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col">
              <div className="w-11 h-11 rounded-xl bg-neutral-100 flex items-center justify-center mb-5">
                <o.Icon size={18} className="text-neutral-700" strokeWidth={1.75} />
              </div>
              <h2 className="text-base font-semibold text-neutral-900 mb-1">{o.title}</h2>
              <p className="text-sm text-neutral-500 mb-5 leading-snug">{o.desc}</p>
              <ul className="space-y-2 mb-6 flex-1">
                {o.perks.map((p, i) => (
                  <li key={i} className="flex items-center gap-2.5">
                    <span className="w-1 h-1 rounded-full bg-neutral-300 shrink-0" />
                    <span className="text-xs text-neutral-600">{p}</span>
                  </li>
                ))}
              </ul>
              <div className="flex gap-2">
                <Link href={o.href} className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-neutral-900 text-white rounded-xl text-sm font-semibold hover:bg-neutral-800 transition-colors">
                  {o.cta} <ArrowRight size={14} />
                </Link>
                <button onClick={() => setModalType(o.type)} className="px-4 py-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 text-sm font-medium text-neutral-600 transition-colors">
                  Détails
                </button>
              </div>
            </div>
          ))}
        </div>

        {/* Stats */}
        <div className="mt-10 pt-8 border-t border-neutral-200 flex flex-wrap gap-x-10 gap-y-4">
          {[
            { label: "Temps de génération", value: "~20 secondes" },
            { label: "Templates disponibles", value: "12 designs" },
            { label: "Format de sortie", value: "PDF A4" },
          ].map((s, i) => (
            <div key={i}>
              <div className="text-[11px] uppercase tracking-wide text-neutral-400 font-semibold mb-1">{s.label}</div>
              <div className="text-sm font-semibold text-neutral-900">{s.value}</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
