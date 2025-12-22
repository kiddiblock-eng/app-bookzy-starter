"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";
import { Search, LogOut, Menu, Bell, Shield } from "lucide-react";

// ✅ J'ai ajouté 'onMenuClick' ici pour que le bouton mobile fonctionne avec ton Layout
export default function AdminHeader({ onMenuClick }) {
  const router = useRouter();
  const [loadingLogout, setLoadingLogout] = useState(false);

  // 🔒 TA LOGIQUE DE DÉCONNEXION (Intacte)
  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("https://app.bookzy.io/auth/login");
    } catch (e) {
      console.error("Erreur logout admin:", e);
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <header className="h-20 flex items-center justify-between px-6 sticky top-0 z-30 bg-[#0B1121]/80 backdrop-blur-xl border-b border-slate-800/60 transition-all duration-300">

      {/* LEFT SIDE: Menu Mobile + Titre */}
      <div className="flex items-center gap-4">
        {/* Bouton Burger (Visible uniquement sur Mobile) */}
        <button
          onClick={onMenuClick}
          className="lg:hidden p-2 -ml-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors"
        >
          <Menu className="w-6 h-6" />
        </button>

        <div className="flex flex-col justify-center">
          <h1 className="text-sm font-bold text-slate-100 tracking-wide">
            VUE D'ENSEMBLE
          </h1>
          <p className="text-[11px] text-indigo-400 font-medium flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            Système opérationnel
          </p>
        </div>
      </div>

      {/* RIGHT SIDE: Search + User + Actions */}
      <div className="flex items-center gap-4 sm:gap-6">

        {/* SEARCH BAR (Desktop) - Style "Dark Glass" */}
        <div className="hidden md:flex items-center bg-slate-900/50 border border-slate-700/50 focus-within:border-indigo-500/50 focus-within:ring-2 focus-within:ring-indigo-500/20 px-4 py-2 rounded-xl w-64 transition-all duration-200 group">
          <Search className="w-4 h-4 text-slate-500 group-focus-within:text-indigo-400 transition-colors" />
          <input
            placeholder="Commande rapide (Ctrl+K)..."
            className="bg-transparent outline-none text-sm text-slate-200 ml-3 placeholder:text-slate-600 w-full"
          />
        </div>

        {/* NOTIFICATION BELL (Décoratif) */}
        <button className="relative p-2 text-slate-400 hover:text-white hover:bg-slate-800/50 rounded-lg transition-colors">
          <Bell className="w-5 h-5" />
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-indigo-500 rounded-full border border-[#0B1121]"></span>
        </button>

        {/* SÉPARATEUR */}
        <div className="h-8 w-px bg-slate-800 hidden sm:block"></div>

        {/* USER PROFILE */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 p-[1px] shadow-lg shadow-indigo-900/20">
             <div className="w-full h-full bg-[#0B1121] rounded-[11px] flex items-center justify-center">
                <Shield className="w-5 h-5 text-indigo-400" />
             </div>
          </div>

          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm text-slate-200 font-bold">Ricardo</span>
            <span className="text-[10px] text-slate-500 uppercase tracking-wider font-semibold">Super Admin</span>
          </div>
        </div>

        {/* LOGOUT BUTTON */}
        <button
          onClick={handleLogout}
          disabled={loadingLogout}
          className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-slate-400 hover:text-red-400 hover:bg-red-400/10 transition-all border border-transparent hover:border-red-400/20"
          title="Se déconnecter"
        >
          <LogOut className={`w-4 h-4 ${loadingLogout ? 'animate-spin' : 'group-hover:-translate-x-0.5 transition-transform'}`} />
          <span className="hidden lg:inline">{loadingLogout ? "..." : "Sortir"}</span>
        </button>
      </div>
    </header>
  );
}