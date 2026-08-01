"use client";

import { useEffect, useState, useCallback } from "react";
import { createPortal } from "react-dom";
import { Gift, X } from "lucide-react";

// Petit son de notification (Web Audio, sans fichier). Best-effort : bloqué si aucune
// interaction récente (politique autoplay), mais la notif visuelle reste.
function playChime() {
  try {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return;
    const ctx = new AC();
    const now = ctx.currentTime;
    [[880, 0], [1174, 0.12]].forEach(([freq, t]) => {
      const o = ctx.createOscillator();
      const g = ctx.createGain();
      o.type = "sine";
      o.frequency.value = freq;
      o.connect(g); g.connect(ctx.destination);
      g.gain.setValueAtTime(0.0001, now + t);
      g.gain.exponentialRampToValueAtTime(0.18, now + t + 0.02);
      g.gain.exponentialRampToValueAtTime(0.0001, now + t + 0.28);
      o.start(now + t); o.stop(now + t + 0.3);
    });
  } catch { /* ignore */ }
}

export default function TrialNudge() {
  const [open, setOpen] = useState(false);
  const [price, setPrice] = useState(1000);

  useEffect(() => {
    let cancelled = false;
    try { if (sessionStorage.getItem("bz_trial_nudge") === "1") return; } catch { /* ignore */ }
    fetch("/api/trial/status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        if (!cancelled && d?.success && d.eligible) {
          if (d.trial?.priceFcfa) setPrice(d.trial.priceFcfa);
          setTimeout(() => { setOpen(true); playChime(); }, 1500);
        }
      })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  const close = useCallback(() => {
    setOpen(false);
    try { sessionStorage.setItem("bz_trial_nudge", "1"); } catch { /* ignore */ }
  }, []);

  const activate = useCallback(() => {
    close();
    window.dispatchEvent(new CustomEvent("bookzy:trial-confirm", { detail: { price } }));
  }, [close, price]);

  if (!open || typeof document === "undefined") return null;

  return createPortal(
    <div className="fixed z-[10040] left-4 right-4 bottom-4 sm:left-auto sm:right-6 sm:bottom-6 sm:w-[360px] animate-[bznudge_.35s_ease]">
      <style>{`@keyframes bznudge{from{opacity:0;transform:translateY(16px)}to{opacity:1;transform:none}}`}</style>
      <div className="relative rounded-2xl bg-white shadow-2xl border border-slate-100 overflow-hidden">
        <button onClick={close} aria-label="Fermer"
          className="absolute top-2.5 right-2.5 w-7 h-7 rounded-full flex items-center justify-center text-slate-400 hover:bg-slate-100">
          <X className="w-4 h-4" />
        </button>
        <div className="p-4 pr-9">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-11 h-11 rounded-xl flex items-center justify-center"
              style={{ background: "rgba(5,150,105,0.12)", color: "#059669" }}>
              <Gift className="w-6 h-6" />
            </div>
            <div className="min-w-0">
              <p className="text-sm font-bold text-slate-900">Ton premier ebook t'attend</p>
              <p className="text-xs text-slate-500 mt-0.5 leading-snug">
                Active l'essai et génère un ebook complet en moins d'une minute.
              </p>
            </div>
          </div>
          <button onClick={activate}
            className="mt-3 w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-sm font-bold transition-colors">
            Activer l'essai · {price.toLocaleString("fr-FR")} FCFA
          </button>
          <button onClick={() => { window.location.href = "/dashboard/tarifs"; }}
            className="mt-2.5 w-full text-center text-xs text-slate-500 underline underline-offset-2 hover:text-slate-800 transition-colors">
            Passer à un abonnement premium
          </button>
        </div>
      </div>
    </div>,
    document.body
  );
}
