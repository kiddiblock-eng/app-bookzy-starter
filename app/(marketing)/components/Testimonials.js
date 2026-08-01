"use client";

import { Star } from "lucide-react";
import { Reveal } from "./Reveal";

const ACCENT = "#059669";

const DATA = [
  { name: "Mamadou Diop",   role: "Coach · Dakar, Sénégal",              initials: "MD", avatar: "/t1.jpg", text: "J'ai créé mon premier ebook en 10 minutes et vendu 23 exemplaires sur WhatsApp la première semaine." },
  { name: "Kouadio Yao",    role: "Infopreneur · Abidjan, Côte d'Ivoire", initials: "KY", avatar: "/T2.jpg", text: "La couverture et l'affiche générées sont si propres que les gens pensent que j'ai payé un graphiste." },
  { name: "Fadel Adjovi",   role: "Créateur · Cotonou, Bénin",           initials: "FA", avatar: "/T3.jpg", text: "Le kit complet me fait gagner des heures : ebook, visuels et textes de vente prêts d'un coup." },
  { name: "Ibrahim Traoré", role: "Formateur · Bamako, Mali",            initials: "IT", avatar: "/T4.jpg", text: "Je ne savais pas quoi écrire. En quelques minutes j'avais un ebook structuré et prêt à vendre." },
  { name: "Serge Nkeng",    role: "Entrepreneur · Douala, Cameroun",     initials: "SN", avatar: "/T5.jpg", text: "Paiement mobile money, tout est fluide. J'encaisse directement mes ventes, sans galère." },
  { name: "Ousmane Ba",     role: "Auteur · Nouakchott, Mauritanie",     initials: "OB", color: "#b45309", text: "En une soirée j'avais 3 ebooks prêts à vendre. Bookzy a remplacé mon graphiste et mon rédacteur." },
  { name: "Komla Adjo",     role: "Formateur · Lomé, Togo",              initials: "KA", color: "#6d28d9", text: "Les textes marketing, je les copie-colle sur WhatsApp et Facebook. Première vente le jour même." },
];

function Card({ t }) {
  return (
    <div className="w-[320px] shrink-0 rounded-2xl border border-neutral-200 bg-white p-6 flex flex-col">
      <div className="flex gap-0.5 mb-4">
        {Array.from({ length: 5 }).map((_, i) => <Star key={i} size={15} className="fill-amber-400 text-amber-400" />)}
      </div>
      <p className="text-[15px] text-neutral-700 leading-relaxed flex-1">« {t.text} »</p>
      <div className="flex items-center gap-3 mt-6">
        {t.avatar ? (
          <div className="relative w-10 h-10 rounded-full overflow-hidden bg-neutral-100 ring-1 ring-black/5 shrink-0">
            <span className="absolute inset-0 flex items-center justify-center text-[11px] font-semibold text-neutral-500">{t.initials}</span>
            <img src={t.avatar} alt={t.name} className="relative w-full h-full object-cover" />
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full flex items-center justify-center text-[11px] font-bold text-white shrink-0" style={{ background: t.color }}>{t.initials}</div>
        )}
        <div>
          <p className="text-sm font-semibold text-neutral-900">{t.name}</p>
          <p className="text-xs text-neutral-500">{t.role}</p>
        </div>
      </div>
    </div>
  );
}

export default function Testimonials() {
  const loop = [...DATA, ...DATA];
  return (
    <section className="bg-neutral-50 py-20 sm:py-28 overflow-hidden">
      <style>{`
        @keyframes bzmarquee { from { transform: translateX(0); } to { transform: translateX(-50%); } }
        .bz-marquee-track { animation: bzmarquee 55s linear infinite; }
        .bz-marquee:hover .bz-marquee-track { animation-play-state: paused; }
      `}</style>

      <Reveal className="text-center max-w-2xl mx-auto mb-14 px-5">
        <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>Ils en parlent</p>
        <h2 className="text-3xl sm:text-5xl font-bold tracking-tight text-neutral-900">Ils créent et vendent déjà.</h2>
        <p className="mt-4 text-neutral-500">Des créateurs partout en Afrique lancent leur ebook avec Bookzy.</p>
      </Reveal>

      <div
        className="bz-marquee relative"
        style={{
          maskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
          WebkitMaskImage: "linear-gradient(to right, transparent, #000 6%, #000 94%, transparent)",
        }}
      >
        <div className="bz-marquee-track flex gap-5 w-max">
          {loop.map((t, i) => <Card key={i} t={t} />)}
        </div>
      </div>
    </section>
  );
}
