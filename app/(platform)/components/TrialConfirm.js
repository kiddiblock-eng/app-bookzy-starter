"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { X, Loader2, BookOpenCheck, TrendingUp, FileText, Wrench, Infinity as InfinityIcon } from "lucide-react";

// Écran de confirmation (stack de valeur) qui s'intercale AVANT Moneroo pour l'essai.
// S'ouvre via l'événement global "bookzy:trial-confirm".
const PERKS = [
  { Icon: BookOpenCheck, text: "Un ebook complet et professionnel, rédigé et mis en page pour toi" },
  { Icon: TrendingUp,    text: "Prêt à vendre, revends-le 5 000 à 15 000 FCFA" },
  { Icon: FileText,      text: "Export PDF, généré en moins d'une minute" },
  { Icon: Wrench,        text: "Accès aux outils : Niche Hunter, Validateur, Youbook" },
  { Icon: InfinityIcon,  text: "Sans abonnement · paiement unique · à toi pour toujours" },
];

export default function TrialConfirm() {
  const [open, setOpen] = useState(false);
  const [paying, setPaying] = useState(false);
  const [price, setPrice] = useState(1000);

  useEffect(() => {
    const onOpen = (e) => { if (e.detail?.price) setPrice(e.detail.price); setOpen(true); };
    window.addEventListener("bookzy:trial-confirm", onOpen);
    return () => window.removeEventListener("bookzy:trial-confirm", onOpen);
  }, []);

  const pay = useCallback(async () => {
    if (paying) return;
    setPaying(true);
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include",
        body: JSON.stringify({ packId: "essai", returnUrl: `${window.location.origin}/dashboard?status=success` }),
      });
      const data = await res.json();
      if (data.success && data.paymentUrl) window.location.href = data.paymentUrl;
      else { alert(data.message || "Erreur"); setPaying(false); }
    } catch { alert("Erreur de connexion"); setPaying(false); }
  }, [paying]);

  if (!open || typeof document === "undefined") return null;
  const p = price.toLocaleString("fr-FR");

  return createPortal(
    <div className="fixed inset-0 z-[10060] flex items-center justify-center p-4"
      style={{ background: "rgba(15,23,42,0.55)", backdropFilter: "blur(3px)" }}>
      <div className="relative w-full max-w-sm rounded-3xl bg-white shadow-2xl overflow-hidden animate-[bztc_.3s_ease]">
        <style>{`@keyframes bztc{from{opacity:0;transform:translateY(12px)}to{opacity:1;transform:none}}`}</style>

        <button onClick={() => setOpen(false)} aria-label="Fermer"
          className="absolute top-3 right-3 w-8 h-8 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100 z-10">
          <X className="w-4 h-4" />
        </button>

        <div className="px-6 pt-7 pb-4 text-center" style={{ background: "linear-gradient(180deg,#ecfdf5,#ffffff)" }}>
          <p className="text-[11px] font-bold uppercase tracking-widest text-emerald-600">Ton essai Bookzy</p>
          <p className="text-3xl font-black text-slate-900 mt-1">{p} <span className="text-base font-bold">FCFA</span></p>
          <p className="text-xs text-slate-500 mt-0.5">Paiement unique · Mobile Money</p>
        </div>

        <div className="px-6 py-4">
          <ul className="space-y-3">
            {PERKS.map((perk, i) => (
              <li key={i} className="flex items-center gap-3">
                <span className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center shrink-0">
                  <perk.Icon className="w-[18px] h-[18px] text-emerald-600" strokeWidth={2} />
                </span>
                <span className="text-[13px] text-slate-700 leading-snug">{perk.text}</span>
              </li>
            ))}
          </ul>

          <button onClick={pay} disabled={paying}
            className="mt-5 w-full py-3.5 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold flex items-center justify-center gap-2 transition-colors disabled:opacity-70">
            {paying ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            Payer {p} FCFA
          </button>
          <p className="mt-2 text-center text-[11px] text-slate-400">Paiement sécurisé · Accès immédiat</p>
        </div>
      </div>
    </div>,
    document.body
  );
}
