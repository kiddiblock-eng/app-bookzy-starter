"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Users,
  BarChart3,
  Bell,
  Flame,
  BookOpen,
  CreditCard,
  Settings,
  Brain,
  FileText,
  ShieldCheck,
  X
} from "lucide-react";

// Liens du menu (Ton ordre conservé)
const links = [
  { href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true },
  { href: "/admin/users", label: "Utilisateurs", icon: Users },
  { href: "/admin/analytics", label: "Statistiques", icon: BarChart3 },
  { href: "/admin/notifications", label: "Notifications", icon: Bell },
  { href: "/admin/tendances", label: "Tendances", icon: Flame },
  { href: "/admin/paiements", label: "Paiements", icon: CreditCard },
  { href: "/admin/ai", label: "Centre IA", icon: Brain },
  // ⭐ PLACÉ ICI AVANT eBooks et Paramètres
  { href: "/admin/niche-hunter/ai-stats", label: "IA – Stats", icon: Brain, badge: "Bêta" }, // J'ai ajouté un petit badge optionnel
  { href: "/admin/ebooks", label: "eBooks", icon: BookOpen },
  { href: "/admin/settings", label: "Paramètres", icon: Settings },
  { href: "/admin/blog", label: "Blogs", icon: FileText },
];

export default function AdminSidebar({ open, setOpen }) {
  const pathname = usePathname();

  const isLinkActive = (href, exact) => {
    if (exact) return pathname === href;
    return pathname.startsWith(href);
  };

  return (
    <>
      {/* 📱 MOBILE OVERLAY (Géré ici ou dans le layout, mais utile ici pour fermer) */}
      <div
        className={`fixed inset-0 bg-[#0B1121]/80 backdrop-blur-sm z-40 lg:hidden transition-opacity duration-300 ${
          open ? "opacity-100" : "opacity-0 pointer-events-none"
        }`}
        onClick={() => setOpen(false)}
      />

      {/* 🖥️ SIDEBAR CONTAINER */}
      <aside
        className={`
          fixed top-0 left-0 h-screen w-[280px]
          bg-[#0B1121] border-r border-slate-800
          flex flex-col z-50
          transition-transform duration-300 ease-in-out
          ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}
        `}
      >
        {/* HEADER / LOGO - Style "Sécure" */}
        <div className="h-20 flex items-center justify-between px-6 border-b border-slate-800/50 bg-[#0B1121]">
          <div className="flex items-center gap-3">
            {/* Logo Icon */}
            <div className="w-9 h-9 rounded-lg bg-indigo-500/10 border border-indigo-500/20 flex items-center justify-center shadow-[0_0_15px_rgba(99,102,241,0.15)]">
              <ShieldCheck className="w-5 h-5 text-indigo-400" />
            </div>

            {/* Logo Text */}
            <div className="flex flex-col">
              <span className="text-white font-bold text-base tracking-wide leading-none">
                BOOKZY
              </span>
              <span className="text-[10px] font-semibold text-indigo-400 uppercase tracking-widest mt-1">
                Mission Control
              </span>
            </div>
          </div>

          {/* Close Button (Mobile Only) */}
          <button 
            onClick={() => setOpen(false)} 
            className="lg:hidden text-slate-500 hover:text-white transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 py-6 overflow-y-auto custom-scrollbar">
          <ul className="space-y-1.5 px-4">
            
            {/* Section Label (Optionnel, pour faire pro) */}
            <li className="px-4 mb-2 text-[10px] font-bold uppercase text-slate-600 tracking-widest">
              Menu Principal
            </li>

            {links.map(({ href, label, icon: Icon, exact, badge }) => {
              const active = isLinkActive(href, exact);

              return (
                <li key={href}>
                  <Link
                    href={href}
                    onClick={() => setOpen(false)} // Ferme le menu sur mobile au clic
                    className={`
                      group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200 border
                      ${
                        active
                          ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-300 shadow-[0_0_20px_rgba(99,102,241,0.1)]"
                          : "bg-transparent border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                      }
                    `}
                  >
                    <div className="flex items-center gap-3.5">
                      <Icon
                        className={`w-5 h-5 transition-colors ${
                          active ? "text-indigo-400 drop-shadow-[0_0_8px_rgba(99,102,241,0.5)]" : "text-slate-500 group-hover:text-slate-300"
                        }`}
                        strokeWidth={1.5}
                      />
                      <span>{label}</span>
                    </div>

                    {/* Active Indicator or Badge */}
                    {active ? (
                      <div className="w-1.5 h-1.5 rounded-full bg-indigo-400 shadow-[0_0_8px_rgba(99,102,241,0.8)]"></div>
                    ) : badge ? (
                      <span className="text-[9px] bg-slate-800 text-slate-400 px-1.5 py-0.5 rounded border border-slate-700">
                        {badge}
                      </span>
                    ) : null}
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        {/* FOOTER DISCRET */}
        <div className="p-6 border-t border-slate-800/50 bg-[#0B1121]">
            <div className="flex items-center gap-3 bg-slate-900/50 p-3 rounded-lg border border-slate-800">
                <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div>
                <p className="text-xs text-slate-400 font-medium">Système : <span className="text-emerald-400">Stable</span></p>
            </div>
            <p className="text-[10px] text-slate-600 text-center mt-3 font-medium">
              v2.4.0 • Bookzy Admin
            </p>
        </div>
      </aside>
    </>
  );
}