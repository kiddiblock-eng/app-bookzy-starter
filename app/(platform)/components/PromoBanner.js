"use client";

import { useEffect, useState } from "react";
import { Gift } from "lucide-react";

// Bandeau discret sur la page tarifs : rappelle le code promo actif + compte à rebours.
// La remise est appliquée automatiquement côté serveur sur Créateur/Pro.
export default function PromoBanner() {
  const [promo, setPromo] = useState(null);
  const [left, setLeft] = useState("");

  useEffect(() => {
    let cancelled = false;
    fetch("/api/promo/status", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => { if (!cancelled && d?.success && d.active) setPromo(d.active); })
      .catch(() => {});
    return () => { cancelled = true; };
  }, []);

  useEffect(() => {
    if (!promo?.expiresAt) return;
    const tick = () => {
      const ms = new Date(promo.expiresAt).getTime() - Date.now();
      if (ms <= 0) { setLeft("00:00:00"); setPromo(null); return; }
      const h = Math.floor(ms / 3.6e6);
      const m = Math.floor((ms % 3.6e6) / 6e4);
      const s = Math.floor((ms % 6e4) / 1000);
      setLeft(`${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}:${String(s).padStart(2, "0")}`);
    };
    tick();
    const t = setInterval(tick, 1000);
    return () => clearInterval(t);
  }, [promo]);

  if (!promo) return null;

  return (
    <div className="mb-6 rounded-2xl border border-emerald-200 px-5 py-3.5 text-center shadow-sm"
      style={{ background: "linear-gradient(90deg,#ecfdf5,#d1fae5)" }}>
      {/* Remise + code (peut passer à la ligne, jamais de scroll horizontal) */}
      <div className="flex items-center justify-center flex-wrap gap-x-2 gap-y-1">
        <Gift className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
        <span className="text-xs font-bold text-emerald-800">
          Remise -{promo.percent}% sur Créateur &amp; Pro
        </span>
        <span className="font-mono text-[11px] font-bold tracking-wider text-emerald-700 bg-white px-2 py-0.5 rounded-md shadow-sm">
          {promo.code}
        </span>
      </div>
      {/* Compte à rebours centré en bas, en rouge */}
      <div className="mt-1 text-[11px] font-semibold text-red-600">
        Expire dans <span className="font-bold tabular-nums">{left}</span>
      </div>
    </div>
  );
}
