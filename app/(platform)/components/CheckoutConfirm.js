"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Check, Loader2, TrendingUp, BookOpen } from "lucide-react";

const fmt = (n) => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");

// Écran de confirmation (récap valeur) AVANT Moneroo pour les offres payantes.
// S'ouvre via l'événement global "bookzy:checkout" avec :
//   { packId, ebooks?, price, label, perks: string[] }
export default function CheckoutConfirm() {
  const [offer, setOffer] = useState(null);
  const [paying, setPaying] = useState(false);

  useEffect(() => {
    const onOpen = (e) => { setOffer(e.detail || null); setPaying(false); };
    window.addEventListener("bookzy:checkout", onOpen);
    return () => window.removeEventListener("bookzy:checkout", onOpen);
  }, []);

  const pay = useCallback(async () => {
    if (!offer || paying) return;
    setPaying(true);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({
          packId: offer.packId,
          ...(offer.ebooks ? { ebooks: offer.ebooks } : {}),
          returnUrl: `${window.location.origin}/dashboard/tarifs?status=success`,
        }),
      });
      const data = await res.json();
      if (data.success && data.paymentUrl) window.location.href = data.paymentUrl;
      else { alert(data.message || "Erreur"); setPaying(false); }
    } catch { alert("Erreur de connexion"); setPaying(false); }
  }, [offer, paying]);

  if (!offer || typeof document === "undefined") return null;
  const p = fmt(offer.price);

  return createPortal(
    <div className="fixed inset-0 z-[10060] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(3px)" }}>
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden animate-[bzco_.3s_ease] max-h-[92vh] flex flex-col">
        <style>{`@keyframes bzco{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>

        <button onClick={() => setOffer(null)} aria-label="Fermer"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 z-10">
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 pt-7 pb-4 text-center shrink-0" style={{ background: "linear-gradient(180deg,#ecfdf5,#ffffff)" }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Pack {offer.label}</p>
          {offer.ebookCount > 0 && (
            <div className="mt-2 inline-flex items-center gap-1.5 rounded-full bg-emerald-100 px-3 py-1">
              <BookOpen className="w-4 h-4 text-emerald-700" />
              <span className="text-sm font-black text-emerald-800">
                {offer.ebookCount} ebook{offer.ebookCount > 1 ? "s" : ""} + kit complet
              </span>
            </div>
          )}
          <p className="text-3xl font-black text-slate-900 mt-2">{p} <span className="text-base font-bold">FCFA</span></p>
          <p className="text-xs text-slate-500 mt-0.5">Paiement unique · Mobile Money</p>
        </div>

        <div className="px-6 py-4 overflow-y-auto">
          <ul className="space-y-2.5">
            {(offer.perks || []).map((perk, i) => (
              <li key={i} className="flex items-start gap-2.5">
                <span className="mt-0.5 w-4 h-4 rounded-full bg-emerald-100 flex items-center justify-center shrink-0">
                  <Check className="w-2.5 h-2.5 text-emerald-700" strokeWidth={3} />
                </span>
                <span className="text-[13px] text-slate-700 leading-snug">{perk}</span>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex items-center gap-2 rounded-xl bg-emerald-50 px-3 py-2.5">
            <TrendingUp className="w-4 h-4 text-emerald-600 shrink-0" />
            <p className="text-xs font-semibold text-emerald-800 leading-snug">
              Revends chaque ebook 5 000 à 15 000 FCFA. Rentabilisé dès la 1ʳᵉ vente.
            </p>
          </div>

          <button onClick={pay} disabled={paying}
            className="mt-5 w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
            {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Payer {p} FCFA · Mobile Money
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-400">Paiement sécurisé · Accès immédiat</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
