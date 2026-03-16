"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, ArrowRight } from "lucide-react";

// ✅ À mettre à jour à chaque nouvelle release
const DEPLOY_DATE = new Date("2026-03-16T00:00:00Z");
const BANNER_DURATION_DAYS = 14;

export default function WhatsNewBanner({ user }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) return;

    // Vérifier si on est dans la fenêtre des 2 semaines
    const now = new Date();
    const expiresAt = new Date(DEPLOY_DATE);
    expiresAt.setDate(expiresAt.getDate() + BANNER_DURATION_DAYS);
    const isWithinWindow = now >= DEPLOY_DATE && now <= expiresAt;

    if (!isWithinWindow) return;

    // Vérifier si l'user a déjà vu cette bannière (whatsNewSeenAt après DEPLOY_DATE)
    const seenAt = user.whatsNewSeenAt ? new Date(user.whatsNewSeenAt) : null;
    const alreadySeen = seenAt && seenAt >= DEPLOY_DATE;

    if (!alreadySeen) setVisible(true);
  }, [user]);

  const handleClose = async () => {
    setVisible(false);
    // Enregistrer en DB
    try {
      await fetch("/api/user/whatsnew/seen", { method: "POST", credentials: "include" });
    } catch {}
  };

  if (!mounted || !visible) return null;

  return (
    <div className="w-full bg-slate-900 border-b border-slate-700 px-4 py-3 flex items-center gap-3 relative overflow-hidden">
      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px"
        }} />

      <div className="relative z-10 flex items-center gap-3 flex-1 min-w-0">
        <div className="flex items-center gap-2 flex-wrap min-w-0">
          <span className="text-[10px] font-black uppercase tracking-[0.2em] text-white/40 flex-shrink-0">
            V1.1 Venus
          </span>
          <span className="text-sm font-semibold text-white">
            Venus vient d'atterrir. Tout a changé.{" "}
            <span className="text-white/40 font-normal text-xs">Nouvelles fonctionnalités · Changements majeurs.</span>
          </span>
        </div>
      </div>

      <div className="relative z-10 flex items-center gap-2 flex-shrink-0">
        <Link href="/changelog"
          className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-white hover:bg-slate-100 text-slate-900 text-xs font-black rounded-lg uppercase tracking-widest transition-all">
          Découvrir <ArrowRight className="w-3 h-3" />
        </Link>
        <Link href="/changelog" className="sm:hidden text-xs font-black text-white underline underline-offset-2">
          Voir
        </Link>
        <button onClick={handleClose}
          className="w-7 h-7 flex items-center justify-center rounded-lg hover:bg-white/10 transition-colors text-white/50 hover:text-white">
          <X className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
}