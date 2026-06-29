"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Loader2, ArrowLeft, Check, ArrowRight } from "lucide-react";
import { OFFERS, OFFER_ORDER, pricePerEbook, ebooksFromCredits } from "@/lib/plans";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());
const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Avantages affichés par offre
const PERKS = {
  decouverte: [
    "1 ebook complet (PDF + kit marketing)",
    "Qualité IA premium, prêt à vendre",
    "Ne s'utilise pas pour les autres outils",
  ],
  createur: [
    "5 ebooks complets",
    "Tous les outils débloqués (Niche Hunter, Radar Cash, Validateur, Youbook, Designer, Romans)",
    "Outils actifs tant qu'il te reste des ebooks",
  ],
  pro: [
    "15 ebooks complets",
    "Tous les outils débloqués",
    "Idéal si tu crées en volume",
  ],
};

export default function TarifsPage() {
  const router = useRouter();
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, { revalidateOnFocus: false });
  const balance = balanceData?.credits?.balance ?? null;
  const ebooksLeft = balance !== null ? ebooksFromCredits(balance) : null;

  const handleBuy = async (offerId) => {
    setLoading(offerId);
    setError("");
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packId: offerId, returnUrl: `${window.location.origin}/dashboard/credits` }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Erreur paiement");
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err.message);
      setLoading(null);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      {/* Top bar */}
      <div className="sticky top-0 z-30 bg-white border-b border-neutral-200">
        <div className="max-w-4xl mx-auto px-5 h-14 flex items-center justify-between">
          <button onClick={() => router.back()} className="flex items-center gap-1.5 text-sm text-neutral-500 hover:text-neutral-800 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </button>
          {ebooksLeft !== null && (
            <span className="text-xs text-neutral-500">
              Il te reste <strong className="text-neutral-900">{ebooksLeft} ebook{ebooksLeft !== 1 ? "s" : ""}</strong>
            </span>
          )}
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-5 py-10">
        {/* Titre */}
        <div className="text-center mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-2">Combien d'ebooks veux-tu créer ?</h1>
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
        <div className="grid sm:grid-cols-3 gap-4">
          {OFFER_ORDER.map((id) => {
            const o = OFFERS[id];
            const reco = o.recommended;
            const ppe = pricePerEbook(id);
            const isLoadingThis = loading === id;
            return (
              <div
                key={id}
                className={`relative rounded-2xl bg-white p-6 flex flex-col border ${reco ? "border-neutral-900 shadow-lg" : "border-neutral-200"}`}
              >
                {reco && (
                  <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-neutral-900 text-white text-[10px] font-bold uppercase tracking-wider px-3 py-1 rounded-full">
                    Recommandé
                  </span>
                )}

                <p className="text-sm font-bold text-neutral-900">{o.label}</p>
                <p className="text-xs text-neutral-500 mb-4">{o.tagline}</p>

                <div className="mb-1">
                  <span className="text-3xl font-bold text-neutral-900">{fmt(o.priceFcfa)}</span>
                  <span className="text-sm text-neutral-400 ml-1">FCFA</span>
                </div>
                <div className="text-xs text-neutral-500 mb-1">
                  <strong className="text-neutral-900">{o.ebooks} ebook{o.ebooks > 1 ? "s" : ""}</strong>
                  {ppe ? ` · ${fmt(ppe)} FCFA / ebook` : ""}
                </div>
                {id === "decouverte" && o.welcomePriceFcfa && (
                  <div className="text-xs font-semibold text-emerald-600 mb-3">1er ebook à {fmt(o.welcomePriceFcfa)} FCFA</div>
                )}

                <div className="h-px bg-neutral-100 my-4" />

                <ul className="space-y-2.5 flex-1 mb-6">
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
                    reco ? "bg-neutral-900 text-white hover:bg-neutral-800" : "bg-neutral-100 text-neutral-900 hover:bg-neutral-200"
                  } ${loading && !isLoadingThis ? "opacity-50" : ""}`}
                >
                  {isLoadingThis ? <Loader2 className="w-4 h-4 animate-spin" /> : <>Choisir <ArrowRight className="w-4 h-4" /></>}
                </button>
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
