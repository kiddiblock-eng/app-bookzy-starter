"use client";

import { useRouter, usePathname } from "next/navigation";
import { useState, useEffect } from "react";
import { LogOut, Menu, Shield } from "lucide-react";

const TITLES = {
  "/admin": "Vue d'ensemble",
  "/admin/users": "Utilisateurs",
  "/admin/analytics": "Statistiques",
  "/admin/notifications": "Notifications",
  "/admin/tendances": "Tendances",
  "/admin/paiements": "Paiements",
  "/admin/affiliation": "Affiliation",
  "/admin/smart-shop": "Smart Shop",
  "/admin/express": "Mises en page",
  "/admin/suggestions": "Suggestions",
  "/admin/ai": "Centre IA",
  "/admin/niche-hunter/ai-stats": "IA — Stats",
  "/admin/ebooks": "eBooks",
  "/admin/blog": "Blogs",
  "/admin/settings": "Paramètres",
};

function titleFor(pathname) {
  const keys = Object.keys(TITLES).sort((a, b) => b.length - a.length);
  const k = keys.find((key) => pathname === key || pathname.startsWith(key + "/"));
  return TITLES[k] || "Admin";
}

export default function AdminHeader({ onMenuClick }) {
  const router = useRouter();
  const pathname = usePathname();
  const [loadingLogout, setLoadingLogout] = useState(false);
  const [name, setName] = useState("");

  useEffect(() => {
    let on = true;
    fetch("/api/profile/get", { credentials: "include" })
      .then((r) => r.json())
      .then((d) => {
        const u = d?.user || d;
        const n = u?.displayName || `${u?.firstName ?? ""} ${u?.lastName ?? ""}`.trim();
        if (on && n) setName(n);
      })
      .catch(() => {});
    return () => { on = false; };
  }, []);

  const handleLogout = async () => {
    try {
      setLoadingLogout(true);
      await fetch("/api/auth/logout", { method: "POST" });
      router.push("/auth/login");
    } catch (e) {
      console.error("Erreur logout admin:", e);
    } finally {
      setLoadingLogout(false);
    }
  };

  return (
    <header className="h-16 flex items-center justify-between px-4 sm:px-6 sticky top-0 z-30 bg-white/85 backdrop-blur-xl border-b border-neutral-200">
      <div className="flex items-center gap-3">
        <button onClick={onMenuClick} className="lg:hidden w-10 h-10 -ml-2 flex items-center justify-center text-neutral-700 hover:bg-neutral-100 rounded-lg transition-colors">
          <Menu className="w-5 h-5" />
        </button>
        <h1 className="text-base font-bold text-neutral-900 tracking-tight">{titleFor(pathname)}</h1>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="flex items-center gap-2.5">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 flex items-center justify-center">
            <Shield className="w-4.5 h-4.5 text-emerald-600" />
          </div>
          <div className="hidden sm:flex flex-col leading-tight">
            <span className="text-sm font-semibold text-neutral-900">{name || "Admin"}</span>
            <span className="text-[10px] text-neutral-400 uppercase tracking-wider font-semibold">Super Admin</span>
          </div>
        </div>

        <div className="h-7 w-px bg-neutral-200 hidden sm:block" />

        <button
          onClick={handleLogout}
          disabled={loadingLogout}
          className="group flex items-center gap-2 px-3 py-2 rounded-lg text-sm font-medium text-neutral-600 hover:text-red-600 hover:bg-red-50 transition-colors"
          title="Se déconnecter"
        >
          <LogOut className={`w-4 h-4 ${loadingLogout ? "animate-spin" : ""}`} />
          <span className="hidden lg:inline">{loadingLogout ? "..." : "Sortir"}</span>
        </button>
      </div>
    </header>
  );
}
