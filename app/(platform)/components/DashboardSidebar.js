"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Home,
  Sparkles, 
  Library, 
  HelpCircle,
  Settings,
  Plus,
  LogOut,
  TrendingUp,
  Target,
  Users,
  ChevronRight
} from "lucide-react";

export default function DashboardSidebar({ open, setOpen }) {
  const pathname = usePathname();

  const menuItems = [
    { label: "Accueil", href: "/dashboard", icon: Home, exact: true },
    { label: "Mes Projets", href: "/dashboard/projets", icon: Sparkles },
    { label: "Mes fichiers", href: "/dashboard/fichiers", icon: Library }, 
    { label: "Mes tendances", href: "/dashboard/trends", icon: TrendingUp, badge: "HOT" },
    { label: "Analyseur de Niche", href: "/dashboard/niche-hunter", icon: Target },
    { label: "Communauté", href: "/dashboard/communaute", icon: Users },
  ];

  const bottomItems = [
    { label: "Support", href: "/dashboard/support", icon: HelpCircle },
    { label: "Paramètres", href: "/dashboard/parametres", icon: Settings },
  ];

  const isLinkActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  return (
    <>
      {/* 🖥️ SIDEBAR DESKTOP */}
      <aside
        className={`hidden lg:flex flex-col fixed left-0 top-0 z-40 h-screen w-[280px] 
        bg-white border-r border-slate-100 transition-all duration-300 shadow-[2px_0_20px_rgba(0,0,0,0.02)]`}
      >
        {/* ✅ TON LOGO ORIGINAL ICI */}
        <div className="h-20 flex items-center px-8">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-md transition-all group-hover:scale-105">
              <BookOpenSVG className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Bookzy</span>
          </Link>
        </div>

        {/* NAVIGATION */}
        <nav className="flex-1 px-4 py-6 overflow-y-auto flex flex-col gap-8">
          
          {/* Menu Principal */}
          <div>
              <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Menu Principal</p>
              <ul className="space-y-1">
                {menuItems.map(({ label, href, icon: Icon, badge, exact }) => {
                  const isActive = isLinkActive(href, exact);
                  return (
                    <li key={href}>
                      <Link 
                        href={href} 
                        className={`group flex items-center justify-between px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                        ${isActive 
                            ? "bg-slate-50 text-slate-900 shadow-sm border border-slate-100" 
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                            <Icon 
                                size={20} 
                                strokeWidth={isActive ? 2 : 1.5}
                                className={isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"} 
                            />
                            <span>{label}</span>
                        </div>
                        
                        {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                        
                        {badge === "HOT" && (
                            <span className="text-[10px] font-bold text-orange-600 bg-orange-50 px-2 py-0.5 rounded-full">HOT</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
          </div>

          {/* Menu Secondaire */}
          <div>
             <p className="px-4 text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Autres</p>
             <ul className="space-y-1">
                {bottomItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                    <li key={label}>
                        <Link
                        href={href}
                        className={`group flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all
                        ${isActive 
                            ? "bg-slate-50 text-slate-900 border border-slate-100" 
                            : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"
                        }`}
                        >
                        <Icon size={20} strokeWidth={1.5} className={isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"} />
                        <span>{label}</span>
                        </Link>
                    </li>
                    );
                })}
             </ul>
          </div>

        </nav>

        {/* FOOTER ACTION */}
        <div className="p-6 border-t border-slate-50">
          <Link
            href="/dashboard/projets/nouveau"
            className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-semibold shadow-lg shadow-slate-200 hover:shadow-xl transition-all active:scale-[0.98] mb-4"
          >
            <Plus size={18} strokeWidth={2.5} />
            <span className="tracking-wide">Nouveau Projet</span>
          </Link>

          <button
            onClick={() => alert("Déconnexion à coder")} 
            className="w-full flex items-center justify-center gap-2 py-2.5 text-xs font-semibold text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
          >
            <LogOut size={14} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* 📱 SIDEBAR MOBILE */}
      {open && (
        <>
          <div
            className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden transition-opacity"
            onClick={() => setOpen(false)}
          />
          <div
            className={`fixed lg:hidden top-0 left-0 z-50 w-[85%] max-w-[300px] h-full bg-white
            shadow-2xl flex flex-col transform transition-transform duration-300 ease-out ${
              open ? "translate-x-0" : "-translate-x-full"
            }`}
          >
             {/* ✅ TON LOGO ORIGINAL MOBILE ICI */}
             <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                    <BookOpenSVG className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-extrabold text-slate-900">Bookzy</span>
                </Link>
               <button onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-slate-900 bg-slate-50 rounded-full">
                 <ChevronRight size={20} className="rotate-180" />
               </button>
             </div>

             <nav className="flex-1 overflow-y-auto p-6 space-y-8">
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Navigation</p>
                    <ul className="space-y-2">
                        {menuItems.map(({ label, href, icon: Icon }) => (
                            <li key={href}>
                                <Link href={href} onClick={() => setOpen(false)} className="flex items-center gap-4 px-2 py-3 text-slate-600 font-medium">
                                    <Icon size={22} strokeWidth={1.5} />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
                
                <div>
                    <p className="text-[11px] font-bold text-slate-400 uppercase tracking-widest mb-3">Compte</p>
                    <ul className="space-y-2">
                        {bottomItems.map(({ label, href, icon: Icon }) => (
                            <li key={href}>
                                <Link href={href} onClick={() => setOpen(false)} className="flex items-center gap-4 px-2 py-3 text-slate-600 font-medium">
                                    <Icon size={22} strokeWidth={1.5} />
                                    {label}
                                </Link>
                            </li>
                        ))}
                    </ul>
                </div>
             </nav>
             
             <div className="p-6 bg-slate-50">
                 <Link href="/dashboard/projets/nouveau" onClick={() => setOpen(false)} className="w-full py-4 bg-slate-900 text-white rounded-xl font-bold flex justify-center mb-3">
                    Nouveau Projet
                 </Link>
                 <button className="w-full py-3 text-slate-500 font-medium text-sm">Déconnexion</button>
             </div>
          </div>
        </>
      )}
    </>
  );
}

/* --- COMPOSANT LOGO ORIGINAL --- */
function BookOpenSVG(props) {
    return (
        <svg 
            {...props}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    );
}