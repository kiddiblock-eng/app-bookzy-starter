"use client";

import Link from "next/link";
import { Check, ArrowRight } from "lucide-react";
import { OFFERS, OFFER_ORDER, discountPercent } from "@/lib/plans";
import { Reveal } from "./Reveal";

const ACCENT = "#5f7aa6";
const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

const PERKS = {
  decouverte: ["Chaque ebook : PDF + kit marketing", "Qualité IA premium, prêt à vendre", "Tes ebooks n'expirent jamais"],
  createur: ["Tous les outils débloqués", "Niche Hunter, Radar, Validateur, Youbook…", "Outils actifs tant qu'il te reste des ebooks"],
  pro: ["Tous les outils débloqués", "Idéal si tu crées en volume", "Le meilleur prix par ebook"],
};

export default function Pricing() {
  return (
    <section id="tarifs" className="bg-neutral-50 py-14 sm:py-20">
      <div className="max-w-5xl mx-auto px-5 sm:px-6">
        <Reveal className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-xs font-bold uppercase tracking-[0.2em] mb-3" style={{ color: ACCENT }}>Tarifs</p>
          <h2 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-neutral-900">Paie tes ebooks une fois. Ils n'expirent jamais.</h2>
          <p className="mt-4 text-neutral-500">Pas d'abonnement, pas de prélèvement automatique. Tu paies, tu crées, c'est à toi.</p>
        </Reveal>

        <div className="grid sm:grid-cols-3 gap-4 items-start">
          {OFFER_ORDER.map((id, idx) => {
            const o = OFFERS[id];
            const reco = o.recommended;
            const disc = discountPercent(id);
            return (
              <Reveal key={id} delay={idx * 0.08}
                className={`relative rounded-2xl bg-white p-6 flex flex-col ${reco ? "border-2 border-[#5f7aa6] shadow-xl" : "border border-neutral-200"}`}>
                {reco && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full" style={{ background: ACCENT }}>
                    Le plus populaire
                  </span>
                )}

                <p className="text-sm font-bold text-neutral-900">{o.label}</p>
                <p className="text-xs text-neutral-500 mb-4 min-h-[32px]">{o.tagline}</p>

                <div className="mb-1">
                  <span className="text-3xl font-bold text-neutral-900">{fmt(o.priceFcfa)}</span>
                  <span className="text-sm text-neutral-400 ml-1">FCFA</span>
                </div>
                <div className="text-xs text-neutral-500 mb-5">
                  <strong className="text-neutral-900">Crée jusqu'à {o.ebooks} ebook{o.ebooks > 1 ? "s" : ""}</strong>
                  {disc > 0 && <span className="ml-1.5 font-semibold text-emerald-600">· économise {disc}%</span>}
                </div>

                <ul className="space-y-2.5 flex-1 mb-6">
                  {PERKS[id].map((perk, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-4 h-4 rounded-full flex items-center justify-center shrink-0" style={{ background: "rgba(95,122,166,0.14)" }}>
                        <Check size={10} style={{ color: ACCENT }} strokeWidth={3} />
                      </span>
                      <span className="text-xs text-neutral-600 leading-snug">{perk}</span>
                    </li>
                  ))}
                </ul>

                <Link href="/auth/register"
                  className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${reco ? "bg-neutral-900 text-white hover:bg-neutral-800" : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"}`}>
                  Choisir <ArrowRight size={15} />
                </Link>
              </Reveal>
            );
          })}
        </div>

        <p className="text-center text-xs text-neutral-400 mt-8">Tes ebooks n'expirent jamais · Paiement mobile money sécurisé · Aucun prélèvement automatique</p>
      </div>
    </section>
  );
}
