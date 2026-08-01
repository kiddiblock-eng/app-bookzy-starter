"use client";

import { useState, useEffect } from "react";
import { Loader2, Check, ArrowRight, Star } from "lucide-react";
import { OFFERS, OFFER_ORDER, createurPrice } from "@/lib/plans";
import { discountedAmount, PROMO_ELIGIBLE_OFFERS } from "@/lib/promo";
import PromoBanner from "@/app/(platform)/components/PromoBanner";

const fmt =(n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Avantages affichés par offre (détaillés)
const PERKS = {
  decouverte: [
    "1 ebook complet (PDF + Word)",
    "Mockup 3D + affiches publicitaires",
    "Textes marketing : Facebook, Instagram, WhatsApp",
    "Copywriting page de vente + post long format",
    "Sans les outils premium",
  ],
  createur: [
    "Chaque ebook en kit complet, prêt à vendre",
    "Mockup 3D et affiches en haute résolution",
    "2 versions haute résolution à télécharger",
    "Textes marketing + copywriting page de vente",
    "Tous les outils : Niche Hunter, Radar Cash, Validateur, Youbook, Designer, Romans",
  ],
  pro: [
    "15 ebooks en kit complet — le meilleur prix par ebook",
    "Mockup 3D et affiches en haute résolution",
    "2 versions haute résolution à télécharger",
    "Textes marketing + copywriting page de vente",
    "Tous les outils débloqués",
  ],
};

export default function TarifsPage() {
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");
  const [promo, setPromo] = useState(null); // { code, percent, expiresAt }
  const [trialEligible, setTrialEligible] = useState(false);
  const [createurQty, setCreateurQty] = useState(5); // curseur Créateur : 5 ou 10 ebooks

  useEffect(() => {
    let cancelled = false;
    fetch("/api/promo/status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d?.success && d.active) setPromo(d.active); })
      .catch(() => {});
    fetch("/api/trial/status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d?.success) setTrialEligible(!!d.eligible); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  // L'Essai n'apparaît que pour les comptes éligibles (jamais essai / abonnement).
  const offersToShow = OFFER_ORDER.filter((id) => id !== "essai" || trialEligible);

  // Tout achat passe par un écran de confirmation (récap valeur) AVANT Moneroo.
  const handleBuy = (offerId) => {
    if (offerId === "essai") {
      window.dispatchEvent(new CustomEvent("bookzy:trial-confirm", { detail: { price: OFFERS.essai.priceFcfa } }));
      return;
    }
    const o = OFFERS[offerId];
    const isCreateur = offerId === "createur";
    const qty = isCreateur ? createurQty : o.ebooks;
    const base = isCreateur ? createurPrice(createurQty) : o.priceFcfa;
    const promoOn = promo && PROMO_ELIGIBLE_OFFERS.includes(offerId);
    const price = promoOn ? discountedAmount(base, promo.percent) : base;
    window.dispatchEvent(new CustomEvent("bookzy:checkout", {
      detail: {
        packId: offerId,
        ebooks: isCreateur ? createurQty : undefined,
        ebookCount: qty,
        price,
        label: o.label,
        perks: PERKS[offerId] || [],
      },
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-4xl mx-auto px-5 py-6 sm:py-10">
        <PromoBanner />
        {/* Titre */}
        <div className="text-center mb-6 sm:mb-10">
          <h1 className="text-xl sm:text-3xl font-semibold text-neutral-900 mb-1.5 sm:mb-2">Choisis ton pack Bookzy</h1>
          <p className="text-neutral-500 text-sm">
            Tu paies tes ebooks une fois. <span className="font-semibold text-neutral-900">Ils n'expirent jamais.</span>
          </p>
        </div>

        {error && (
          <div className="max-w-md mx-auto mb-8 bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700 text-center">
            {error}
          </div>
        )}

        {/* Offres */}
        <div className={`grid gap-4 ${offersToShow.length === 3 ? "sm:grid-cols-3" : "sm:grid-cols-2 max-w-2xl mx-auto"}`}>
          {offersToShow.map((id) => {
            const o = OFFERS[id];
            const reco = o.recommended;
            const isLoadingThis = loading === id;
            const isCreateur = id === "createur";
            const basePrice = isCreateur ? createurPrice(createurQty) : o.priceFcfa;
            const ebookCount = isCreateur ? createurQty : o.ebooks;
            const promoOn = promo && PROMO_ELIGIBLE_OFFERS.includes(id);
            const finalPrice = promoOn ? discountedAmount(basePrice, promo.percent) : basePrice;
            return (
              <div
                key={id}
                id={id === "createur" ? "offre-createur" : undefined}
                className={`relative rounded-2xl bg-white flex flex-col ${reco ? "order-first sm:order-none border-2 border-emerald-500 sm:scale-[1.04] sm:z-10 px-4 pt-7 pb-4 sm:px-6 sm:pt-8 sm:pb-6 shadow-[0_16px_50px_-12px_rgba(16,185,129,0.55)]" : "border border-neutral-200 p-4 sm:p-6"}`}
              >
                {reco && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-emerald-600 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full flex items-center gap-1 shadow-md">
                    <Star className="w-3 h-3 fill-white" strokeWidth={0} /> Populaire
                  </span>
                )}

                <p className="text-sm font-bold text-neutral-900">{o.label}</p>
                <p className="text-xs text-neutral-500 mb-2 sm:mb-4">{o.tagline}</p>

                {isCreateur && (
                  <div className="mb-3 flex gap-1.5">
                    {o.ebookOptions.map((n) => (
                      <button key={n} type="button" onClick={() => setCreateurQty(n)}
                        className={`flex-1 py-1.5 rounded-lg text-xs font-bold border transition-all ${createurQty === n ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"}`}>
                        {n} ebooks
                      </button>
                    ))}
                  </div>
                )}

                <div className="mb-1 flex items-baseline flex-wrap gap-x-2">
                  {promoOn ? (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold text-emerald-600">{fmt(finalPrice)}</span>
                      <span className="text-sm text-neutral-400">FCFA</span>
                      <span className="text-sm text-red-500 line-through">{fmt(basePrice)}</span>
                      <span className="text-[11px] font-bold text-emerald-700 bg-emerald-100 px-1.5 py-0.5 rounded">-{promo.percent}%</span>
                    </>
                  ) : (
                    <>
                      <span className="text-2xl sm:text-3xl font-bold text-neutral-900">{fmt(basePrice)}</span>
                      <span className="text-sm text-neutral-400">FCFA</span>
                    </>
                  )}
                </div>
                {ebookCount > 1 && (
                  <p className="text-sm font-extrabold text-emerald-600 mb-1">
                    Seulement {fmt(basePrice / ebookCount)} FCFA / ebook
                  </p>
                )}
                <div className="text-xs text-neutral-500 mb-1">
                  <strong className="text-neutral-900">{ebookCount} ebook{ebookCount > 1 ? "s" : ""} + kit complet</strong>
                </div>
                {id === "decouverte" && o.welcomePriceFcfa && (
                  <div className="text-xs font-semibold text-emerald-600 mb-3">1er ebook à {fmt(o.welcomePriceFcfa)} FCFA</div>
                )}

                <div className="h-px bg-neutral-100 my-3 sm:my-4" />

                <ul className="space-y-1.5 sm:space-y-2.5 flex-1 mb-4 sm:mb-6">
                  {PERKS[id].map((perk, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <span className="mt-0.5 w-4 h-4 rounded-full bg-neutral-100 flex items-center justify-center shrink-0">
                        <Check className="w-2.5 h-2.5 text-neutral-900" strokeWidth={3} />
                      </span>
                      <span className="text-xs text-neutral-600 leading-snug">{perk}</span>
                    </li>
                  ))}
                </ul>

                <button
                  onClick={() => handleBuy(id)}
                  disabled={!!loading}
                  className={`w-full py-3 rounded-xl text-sm font-semibold flex items-center justify-center gap-2 transition-colors ${
                    reco ? "bg-emerald-600 text-white hover:bg-emerald-700 shadow-lg shadow-emerald-600/25" : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  } ${loading && !isLoadingThis ? "opacity-50" : ""}`}
                >
                  {isLoadingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Choisir <ArrowRight className="w-4 h-4" /></>}
                </button>

                {id === "essai" && (
                  <button
                    onClick={() => { const el = document.getElementById("offre-createur"); el ? el.scrollIntoView({ behavior: "smooth", block: "center" }) : null; }}
                    className="mt-2 w-full text-center text-xs text-neutral-500 underline underline-offset-2 hover:text-neutral-800 transition-colors"
                  >
                    Passer directement à un abonnement
                  </button>
                )}
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-neutral-400 mt-8">
          Tes ebooks n'expirent jamais · Paiement sécurisé · Aucun prélèvement automatique
        </p>
      </div>
    </div>
  );
}
