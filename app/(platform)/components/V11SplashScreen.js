"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, X } from "lucide-react";

const DEPLOY_DATE = new Date("2026-04-13T00:00:00Z");

export default function V12SplashScreen({ user }) {
  const [visible, setVisible] = useState(false);
  const [mounted, setMounted] = useState(false);
  const [closing, setClosing] = useState(false);

  useEffect(() => {
    setMounted(true);
    if (!user) return;
    const seenAt = user.whatsNewSeenAt ? new Date(user.whatsNewSeenAt) : null;
    const alreadySeen = seenAt && seenAt >= DEPLOY_DATE;
    if (!alreadySeen) setTimeout(() => setVisible(true), 300);
  }, [user]);

  const handleClose = async () => {
    setClosing(true);
    try {
      await fetch("/api/user/whatsnew/seen", { method: "POST", credentials: "include" });
    } catch {}
    setTimeout(() => setVisible(false), 400);
  };

  if (!mounted || !visible) return null;

  return (
    <div className={`fixed inset-0 z-[9999] flex items-center justify-center transition-all duration-400 ${closing ? "opacity-0" : "opacity-100"}`}
      style={{ background: "rgba(0,0,0,0.85)", backdropFilter: "blur(8px)" }}>

      <div className={`relative w-full max-w-lg mx-4 transition-all duration-500 ${closing ? "scale-95 opacity-0" : "scale-100 opacity-100"}`}>
        <div className="relative bg-[#0A0A0A] rounded-3xl overflow-hidden border border-white/10 shadow-2xl">

          <div className="absolute inset-0 opacity-[0.08] pointer-events-none"
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
              backgroundRepeat: "repeat", backgroundSize: "128px"
            }} />

          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[400px] h-[200px] pointer-events-none"
            style={{ background: "radial-gradient(ellipse, rgba(255,255,255,0.06) 0%, transparent 70%)" }} />

          <button onClick={handleClose}
            className="absolute top-4 right-4 z-10 w-8 h-8 flex items-center justify-center rounded-full bg-white/5 hover:bg-white/10 border border-white/10 text-white/40 hover:text-white transition-all">
            <X className="w-4 h-4" />
          </button>

          <div className="relative z-10 p-8 sm:p-10">

            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/5 border border-white/10 rounded-full mb-8">
              <span className="w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
              <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white/40">V1.2 Mars</span>
            </div>

            <h1 className="font-black text-white leading-[0.92] tracking-tight mb-6"
              style={{ fontSize: "clamp(2rem, 6vw, 3rem)" }}>
              Mars vient<br />d'atterrir.<br />
              <span className="text-white/30">12 raisons de créer.</span>
            </h1>

            <p className="text-white/50 text-sm leading-relaxed mb-8 max-w-sm">
              Aperçu gratuit avant génération, Radar Cash, Validateur d'idée, Romans IA, crédits repensés et bien plus. Bookzy devient votre machine à revenus.
            </p>

            <div className="flex flex-wrap gap-2 mb-10">
              {["Aperçu gratuit", "Radar Cash", "Validateur d'idée", "Romans IA", "Crédits repensés", "Emails relance"].map(f => (
                <span key={f} className="px-3 py-1 bg-white/5 border border-white/10 rounded-full text-[10px] font-black text-white/40 uppercase tracking-widest">
                  {f}
                </span>
              ))}
            </div>

            <div className="w-full h-px bg-white/10 mb-8" />

            <div className="flex flex-col sm:flex-row gap-3">
              <button onClick={handleClose}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl text-xs uppercase tracking-widest transition-all">
                Accéder à mon dashboard <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <Link href="/changelog" onClick={handleClose}
                className="flex-1 flex items-center justify-center gap-2 py-3.5 bg-white/5 hover:bg-white/10 border border-white/10 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all">
                Voir les nouveautés
              </Link>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
}