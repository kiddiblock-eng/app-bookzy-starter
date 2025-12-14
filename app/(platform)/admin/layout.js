"use client";

import { useState, useEffect } from "react";
import AdminSidebar from "./components/AdminSidebar";
import AdminHeader from "./components/AdminHeader";

export default function AdminLayout({ children }) {
  const [open, setOpen] = useState(false);

  // 🔥 TRACKING AUTOMATIQUE EVERY 20s (CODE INCHANGÉ)
  useEffect(() => {
    const track = async () => {
      try {
        await fetch("/api/activity/track", {
          method: "POST",
          credentials: "include",
        });
      } catch (e) {
        // On ignore totalement les erreurs de tracking
        // console.warn("Activity track failed:", e);
      }
    };

    // premier ping au chargement
    track();

    // toutes les 20 secondes
    const interval = setInterval(track, 20_000);
    return () => clearInterval(interval);
  }, []);

  return (
    // 1. Fond Global : Noir bleuté profond (Thème Cyber/SaaS)
    <div className="flex w-full min-h-screen bg-[#0B1121] text-slate-100 font-sans selection:bg-indigo-500/30">
      
      {/* Sidebar */}
      <AdminSidebar open={open} setOpen={setOpen} />

      {/* RIGHT AREA */}
      <div
        className="
          flex-1 flex flex-col min-h-screen
          transition-all duration-300 ease-out
          lg:ml-[280px] /* Largeur ajustée pour un look plus 'Pro' */
        "
      >
        {/* Header */}
        <AdminHeader onMenuClick={() => setOpen(true)} />

        {/* PAGE CONTENT */}
        <main className="relative flex-1 px-4 sm:px-6 lg:px-8 py-8 overflow-y-auto overflow-x-hidden">
          
          {/* ✨ AMBIANCE : Lueur Violet/Bleu en arrière-plan (Effet Glow) */}
          <div className="fixed top-0 left-[280px] right-0 h-[500px] bg-gradient-to-b from-indigo-900/10 via-[#0B1121]/50 to-[#0B1121] pointer-events-none z-0" />
          
          {/* Contenu (Z-index pour passer au-dessus du glow) */}
          <div className="relative z-10 max-w-[1600px] mx-auto">
            {children}
          </div>

        </main>
      </div>

      {/* Mobile overlay (Amélioré avec un flou) */}
      {open && (
        <div
          className="fixed inset-0 bg-[#0B1121]/80 backdrop-blur-md lg:hidden z-40 transition-opacity duration-300"
          onClick={() => setOpen(false)}
        />
      )}
    </div>
  );
}