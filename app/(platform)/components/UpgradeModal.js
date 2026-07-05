"use client";

import Link from "next/link";
import { OFFERS } from "@/lib/plans";

/**
 * Modal de conversion affiché quand le quota gratuit d'un outil est épuisé.
 * Montre directement les 2 offres (Créateur / Pro) pour convertir vite.
 */
export default function UpgradeModal({ open, onClose, title, subtitle }) {
  if (!open) return null;

  const offers = [OFFERS.createur, OFFERS.pro].filter(Boolean);

  return (
    <div
      className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="bg-white rounded-3xl w-full max-w-lg overflow-hidden shadow-2xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6 text-center border-b border-neutral-100">
          <div className="text-3xl mb-2">🚀</div>
          <h3 className="text-lg font-bold text-neutral-900">
            {title || "Tu as utilisé tes essais gratuits du jour"}
          </h3>
          <p className="text-sm text-neutral-500 mt-1">
            {subtitle || "Passe à une offre pour un accès étendu aux outils + plus d'ebooks."}
          </p>
        </div>

        <div className="p-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {offers.map((o) => (
            <div
              key={o.id}
              className={`rounded-2xl border p-4 flex flex-col ${
                o.recommended ? "border-emerald-500 ring-1 ring-emerald-500/30" : "border-neutral-200"
              }`}
            >
              {o.recommended && (
                <span className="self-start mb-2 px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[10px] font-bold">
                  RECOMMANDÉ
                </span>
              )}
              <div className="text-sm font-bold text-neutral-900">{o.label}</div>
              <div className="text-2xl font-extrabold text-neutral-900 mt-1">
                {o.priceFcfa.toLocaleString()}{" "}
                <span className="text-sm font-medium text-neutral-500">FCFA</span>
              </div>
              <div className="text-xs text-neutral-500 mt-1">
                {o.ebooks} ebooks + tous les outils
              </div>
              <p className="text-xs text-neutral-500 mt-2 flex-1">{o.tagline}</p>
              <Link
                href={`/dashboard/tarifs?offer=${o.id}`}
                onClick={onClose}
                className={`mt-3 text-center px-3 py-2 rounded-xl text-sm font-semibold transition-colors ${
                  o.recommended
                    ? "bg-emerald-600 text-white hover:bg-emerald-700"
                    : "bg-neutral-900 text-white hover:bg-neutral-800"
                }`}
              >
                Choisir {o.label}
              </Link>
            </div>
          ))}
        </div>

        <div className="px-4 pb-4 text-center">
          <button onClick={onClose} className="text-xs text-neutral-400 hover:text-neutral-600">
            Plus tard
          </button>
        </div>
      </div>
    </div>
  );
}
