"use client";

import { useEffect } from "react";
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
  ChevronRight,
  Youtube,
  LayoutDashboard
} from "lucide-react";

export default function DashboardSidebar({ open, setOpen }) {
  const pathname = usePathname();

  useEffect(() => {
    if (open) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "unset";
    }
    return () => {
      document.body.style.overflow = "unset";
    };
  }, [open]);

  const sidebarConfig = [
    {
      title: "Général",
      items: [
        { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard, exact: true },
      ]
    },
    {
      title: "Création",
      items: [
        { label: "Youbook", href: "/dashboard/youbook", icon: Youtube, badge: "NOUVEAU", isSpecial: true },
        { label: "Analyseur de Niche", href: "/dashboard/niche-hunter", icon: Target },
        { label: "Mes tendances", href: "/dashboard/trends", icon: TrendingUp, badge: "HOT" },
      ]
    },
    {
      title: "Bibliothèque",
      items: [
        { label: "Mes Projets", href: "/dashboard/projets", icon: Sparkles },
        { label: "Mes fichiers", href: "/dashboard/fichiers", icon: Library },
      ]
    },
    {
      title: "Social",
      items: [
        { label: "Communauté", href: "/dashboard/communaute", icon: Users },
      ]
    }
  ];

  const bottomItems = [
    { label: "Support", href: "/dashboard/support", icon: HelpCircle },
    { label: "Paramètres", href: "/dashboard/parametres", icon: Settings },
  ];

  const isLinkActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (error) {
      console.error("Erreur déconnexion", error);
    } finally {
      window.location.href = "/auth/login"; 
    }
  };

  return (
    <>
      {/* SIDEBAR DESKTOP */}
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 z-40 h-screen w-[280px] bg-white border-r border-slate-100 shadow-[2px_0_20px_rgba(0,0,0,0.02)]`}>
        <div className="h-20 flex items-center px-8 flex-shrink-0">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-md">
              <BookOpenSVG className="w-4 h-4 text-white" />
            </div>
            <span className="text-xl font-extrabold text-slate-900 tracking-tight">Bookzy</span>
          </Link>
        </div>

        <div className="px-6 pb-4 flex-shrink-0">
            <Link 
              href="/dashboard/projets/nouveau" 
              prefetch={true}
              className="group w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
            >
                <Plus size={16} strokeWidth={3} />
                <span className="tracking-wide text-sm">Générer un ebook</span>
            </Link>
        </div>

        {/* ✅ FIX: Espaces réduits pour tout tenir sans scroll */}
        <nav className="flex-1 px-4 py-2 flex flex-col gap-4 overflow-hidden">
          {sidebarConfig.map((section) => (
            <div key={section.title}>
              <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">{section.title}</p>
              <ul className="space-y-0">
                {section.items.map(({ label, href, icon: Icon, badge, exact, isSpecial }) => {
                  const isActive = isLinkActive(href, exact);
                  return (
                    <li key={href}>
                      <Link 
                        href={href} 
                        prefetch={true}
                        className={`group flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${isActive ? "bg-slate-50 text-slate-900 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"}`}
                      >
                        <div className="flex items-center gap-3">
                            <Icon size={18} className={isActive ? "text-indigo-600" : (isSpecial ? "text-red-500" : "text-slate-400 group-hover:text-slate-600")} />
                            <span className={isSpecial && !isActive ? "text-slate-700 font-bold" : ""}>{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            {badge === "NOUVEAU" && <span className="text-[8px] font-black bg-red-600 text-white px-1.5 py-0.5 rounded-md">NEW</span>}
                            {badge === "HOT" && <span className="text-[8px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-md">HOT</span>}
                            {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600"></div>}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}

          {/* ✅ SECTION AIDE (Support + Paramètres) - Dans le flow normal */}
          <div className="pt-3 border-t border-slate-50">
             <p className="px-4 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">Aide</p>
             <ul className="space-y-0">
                {bottomItems.map(({ label, href, icon: Icon }) => {
                    const isActive = pathname === href;
                    return (
                    <li key={label}>
                        <Link 
                          href={href} 
                          prefetch={true}
                          className={`group flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all ${isActive ? "text-slate-900 bg-slate-50 shadow-sm border border-slate-100" : "text-slate-500 hover:text-slate-900 hover:bg-slate-50/50"}`}
                        >
                          <Icon size={18} className={isActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"} />
                          <span>{label}</span>
                        </Link>
                    </li>
                    );
                })}
             </ul>
          </div>
        </nav>

        {/* ✅ DÉCONNEXION EN BAS */}
        <div className="p-4 border-t border-slate-50 flex-shrink-0">
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* SIDEBAR MOBILE */}
      {open && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpen(false)} />
          <div className={`fixed lg:hidden top-0 left-0 z-50 w-[85%] max-w-[300px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>
             <div className="h-20 flex items-center justify-between px-6 border-b border-slate-50">
                <Link href="/" className="flex items-center gap-2" onClick={() => setOpen(false)}>
                    <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                      <BookOpenSVG className="w-4 h-4 text-white" />
                    </div>
                    <span className="text-xl font-extrabold text-slate-900">Bookzy</span>
                </Link>
                <button onClick={() => setOpen(false)} className="p-2 text-slate-400 bg-slate-50 rounded-full">
                  <ChevronRight size={20} className="rotate-180" />
                </button>
             </div>

             {/* ✅ BOUTON GÉNÉRER EBOOK */}
             <div className="px-6 py-4 border-b border-slate-50">
                <Link
                    href="/dashboard/projets/nouveau"
                    onClick={() => setOpen(false)}
                    prefetch={true}
                    className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
                >
                    <Plus size={16} strokeWidth={3} />
                    <span className="text-sm">Générer un ebook</span>
                </Link>
             </div>

             <nav className="flex-1 overflow-y-auto px-6 py-3 space-y-4">
                {sidebarConfig.map((section) => (
                  <div key={section.title}>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">{section.title}</p>
                    <ul className="space-y-0.5">
                        {section.items.map(({ label, href, icon: Icon, badge, isSpecial }) => (
                            <li key={href}>
                                <Link 
                                  href={href} 
                                  onClick={() => setOpen(false)} 
                                  prefetch={true}
                                  className="flex items-center justify-between px-2 py-2.5 text-slate-600 font-medium hover:bg-slate-50 rounded-lg"
                                >
                                    <div className="flex items-center gap-3">
                                        <Icon size={18} className={isSpecial ? "text-red-500" : ""} />
                                        <span className="text-sm">{label}</span>
                                    </div>
                                    {badge && <span className={`text-[9px] font-bold px-2 py-0.5 rounded ${badge === "NOUVEAU" ? "bg-red-600 text-white" : "bg-orange-50 text-orange-600"}`}>{badge}</span>}
                                </Link>
                            </li>
                        ))}
                    </ul>
                  </div>
                ))}

                {/* ✅ SECTION SUPPORT ET PARAMÈTRES */}
                <div className="pt-3 border-t border-slate-100">
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Aide</p>
                  <ul className="space-y-0.5">
                    {bottomItems.map(({ label, href, icon: Icon }) => (
                      <li key={href}>
                        <Link 
                          href={href} 
                          onClick={() => setOpen(false)} 
                          prefetch={true}
                          className="flex items-center gap-3 px-2 py-2.5 text-slate-600 text-sm font-medium hover:bg-slate-50 rounded-lg"
                        >
                          <Icon size={18} />
                          <span>{label}</span>
                        </Link>
                      </li>
                    ))}
                  </ul>
                </div>
             </nav>
             
             {/* ✅ BOUTON DÉCONNEXION COMPACT */}
             <div className="p-3 bg-slate-50 border-t">
                <button onClick={handleLogout} className="w-full py-2.5 flex items-center justify-center gap-2 text-sm text-red-600 font-bold bg-white border border-slate-200 rounded-lg hover:bg-red-50 transition-all">
                    <LogOut size={16} /> 
                    <span>Déconnexion</span>
                </button>
             </div>
          </div>
        </>
      )}
    </>
  );
}

function BookOpenSVG(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    );
}