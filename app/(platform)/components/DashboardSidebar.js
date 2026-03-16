"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Library,
  Plus,
  LogOut,
  TrendingUp,
  Target,
  Youtube,
  LayoutDashboard,
  Banknote,
  FileText,
  Store,
  ChevronDown,
  Palette,
  Package,
  Receipt,
  CreditCard,
  BookOpen,
  ChevronLeft,
  ChevronRight,
} from "lucide-react";
import useSWR from "swr";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

export default function DashboardSidebar({ open, setOpen, collapsed = false, setCollapsed }) {
  const pathname = usePathname();
  const [smartShopOpen, setSmartShopOpen] = useState(false);
  const [_collapsed, _setCollapsed] = useState(false);
  const isCollapsed = setCollapsed ? collapsed : _collapsed;
  const toggleCollapse = setCollapsed ? () => setCollapsed(!collapsed) : () => _setCollapsed(!_collapsed);

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });
  const balance = balanceData?.credits?.balance ?? null;

  useEffect(() => {
    if (pathname.startsWith("/dashboard/smart-shop")) {
      setSmartShopOpen(true);
    }
  }, [pathname]);

  useEffect(() => {
    if (open) {
      const scrollY = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${scrollY}px`;
      document.body.style.width = "100%";
    } else {
      const scrollY = parseInt(document.body.style.top || "0") * -1;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    }
    return () => {
      const scrollY = parseInt(document.body.style.top || "0") * -1;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, scrollY);
    };
  }, [open]);

  const smartShopItems = [
    { label: "Boutique", href: "/dashboard/smart-shop/boutique", icon: Palette },
    { label: "Produits", href: "/dashboard/smart-shop/produits", icon: Package },
    { label: "Leads",    href: "/dashboard/smart-shop/leads",    icon: Receipt },
  ];

  const sidebarConfig = [
    {
      title: "Général",
      items: [
        { label: "Tableau de bord", href: "/dashboard", icon: LayoutDashboard, exact: true },
      ],
    },
    {
      title: "Création",
      items: [
        { label: "Youbook",            href: "/dashboard/youbook",       icon: Youtube,   isSpecial: true },
        { label: "Ebook Designer",   href: "/dashboard/express",       icon: FileText },
        { label: "Analyseur de Niche", href: "/dashboard/niche-hunter",  icon: Target },
        { label: "Mes tendances",      href: "/dashboard/trends",        icon: TrendingUp },
      ],
    },
    {
      title: "Bibliothèque",
      items: [
        { label: "Mes Ebooks", href: "/dashboard/fichiers", icon: Library },
      ],
    },
    {
      title: "Business",
      items: [
        { label: "Affiliation", href: "/dashboard/affiliation", icon: Banknote },
        { label: "Smart Shop",  href: "#",                      icon: Store, isAccordion: true },
      ],
    },
  ];

  const isLinkActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const isSmartShopActive = pathname.startsWith("/dashboard/smart-shop");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    } catch (error) {
      console.error("Erreur déconnexion", error);
    } finally {
      window.location.href = "/auth/login";
    }
  };

  const CreditsBlock = ({ mobile = false }) => {
    const isActive = pathname.startsWith("/dashboard/credits") || pathname.startsWith("/dashboard/tarifs");
    return (
      <Link
        href="/dashboard/credits"
        onClick={() => mobile && setOpen(false)}
        className={`flex items-center justify-between w-full px-4 py-2.5 rounded-xl transition-all duration-200 ${
          isActive
            ? "bg-blue-50 border border-blue-100 text-blue-700"
            : "bg-slate-50 border border-slate-100 hover:bg-blue-50 hover:border-blue-100 text-slate-700 hover:text-blue-700"
        }`}
      >
        <div className="flex items-center gap-2.5">
          <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${isActive ? "bg-blue-600" : "bg-slate-200"}`}>
            <CreditCard size={13} className={isActive ? "text-white" : "text-slate-500"} />
          </div>
          {!isCollapsed && <span className="text-sm font-semibold">Mes crédits</span>}
        </div>
        {balance !== null && !isCollapsed && (
          <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${isActive ? "bg-blue-600 text-white" : "bg-slate-200 text-slate-600"}`}>
            {balance}
          </span>
        )}
      </Link>
    );
  };

  // ══ SIDEBAR DESKTOP ══
  return (
    <>
      <aside className={`hidden lg:flex flex-col fixed left-0 top-0 z-40 h-screen bg-white border-r border-slate-100 shadow-[2px_0_20px_rgba(0,0,0,0.02)] transition-all duration-300 ${isCollapsed ? "w-[64px]" : "w-[256px]"}`}>

        {/* HEADER */}
        <div className="h-20 flex items-center justify-between px-4 flex-shrink-0">
          {!isCollapsed && (
            <Link href="/" className="flex items-center gap-3 group">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-md">
                <BookOpenIcon className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold text-slate-900 tracking-tight">Bookzy</span>
            </Link>
          )}
          {isCollapsed && (
            <div className="flex flex-col items-center gap-2 w-full">
              <Link href="/">
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center shadow-md">
                  <BookOpenIcon className="w-4 h-4 text-white" />
                </div>
              </Link>
              <button
                onClick={() => toggleCollapse()}
                className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
                title="Agrandir"
              >
                <ChevronRight size={16} />
              </button>
            </div>
          )}
          {!isCollapsed && (
            <button
              onClick={() => toggleCollapse()}
              className="p-1.5 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-600 transition-all"
              title="Réduire"
            >
              <ChevronLeft size={16} />
            </button>
          )}
        </div>

        {/* CTA */}
        <div className="px-3 pb-4 flex-shrink-0">
          {isCollapsed ? (
            <Link
              href="/dashboard/projets/nouveau"
              className="w-full flex items-center justify-center py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl transition-all"
              title="Générer un ebook"
            >
              <Plus size={18} strokeWidth={3} />
            </Link>
          ) : (
            <Link
              href="/dashboard/projets/nouveau"
              className="group w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all active:scale-[0.98]"
            >
              <Plus size={16} strokeWidth={3} />
              <span className="tracking-wide text-sm">Générer un ebook</span>
            </Link>
          )}
        </div>

        {/* NAV */}
        <nav className="flex-1 px-3 py-2 flex flex-col gap-3 overflow-y-auto overflow-x-hidden">
          {sidebarConfig.map((section) => (
            <div key={section.title}>
              {!isCollapsed && (
                <p className="px-2 text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-1.5">
                  {section.title}
                </p>
              )}
              {isCollapsed && <div className="h-px bg-slate-100 mb-1.5 mx-1" />}
              <ul className="space-y-0">
                {section.items.map(({ label, href, icon: Icon, badge, exact, isSpecial, disabled, isAccordion }) => {

                  if (isAccordion && label === "Smart Shop") {
                    if (collapsed) {
                      return (
                        <li key={label}>
                          <Link href="/dashboard/smart-shop/boutique"
                            className={`flex items-center justify-center py-2 rounded-xl transition-all ${isSmartShopActive ? "bg-slate-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
                            title="Smart Shop">
                            <Store size={18} />
                          </Link>
                        </li>
                      );
                    }
                    return (
                      <li key={label}>
                        <button
                          onClick={() => setSmartShopOpen(!smartShopOpen)}
                          className={`group flex items-center justify-between w-full px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                            isSmartShopActive || smartShopOpen
                              ? "bg-slate-50 text-slate-900 shadow-sm border border-slate-100"
                              : "text-slate-700 hover:text-slate-900 hover:bg-slate-50/50"
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <Store size={18} className={isSmartShopActive ? "text-indigo-600" : "text-slate-400 group-hover:text-slate-600"} />
                            <span>Smart Shop</span>
                          </div>
                          <ChevronDown size={16} className={`transition-transform duration-200 ${smartShopOpen ? "rotate-180" : ""} ${isSmartShopActive ? "text-indigo-600" : "text-slate-400"}`} />
                        </button>
                        <div className={`overflow-hidden transition-all duration-200 ${smartShopOpen ? "max-h-48 opacity-100" : "max-h-0 opacity-0"}`}>
                          <ul className="mt-1 space-y-0.5">
                            {smartShopItems.map(({ label: subLabel, href: subHref, icon: SubIcon }) => {
                              const isActive = isLinkActive(subHref);
                              return (
                                <li key={subHref}>
                                  <Link href={subHref} prefetch={true}
                                    className={`group flex items-center gap-3 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ml-4 ${
                                      isActive ? "bg-indigo-50 text-indigo-700 shadow-sm" : "text-slate-700 hover:text-slate-900 hover:bg-slate-50/50"
                                    }`}
                                  >
                                    <SubIcon size={16} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                                    <span>{subLabel}</span>
                                    {isActive && <div className="ml-auto w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>
                        </div>
                      </li>
                    );
                  }

                  const isActive = isLinkActive(href, exact);

                  if (collapsed) {
                    return (
                      <li key={href || label}>
                        <Link href={href}
                          className={`flex items-center justify-center py-2 rounded-xl transition-all ${isActive ? "bg-slate-50 text-indigo-600" : "text-slate-400 hover:bg-slate-50 hover:text-slate-600"}`}
                          title={label}>
                          <Icon size={18} className={isSpecial ? "text-red-500" : ""} />
                        </Link>
                      </li>
                    );
                  }

                  if (disabled) {
                    return (
                      <li key={label}>
                        <div className="flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium text-slate-300 cursor-not-allowed">
                          <div className="flex items-center gap-3">
                            <Icon size={18} className="text-slate-300" />
                            <span>{label}</span>
                          </div>
                        </div>
                      </li>
                    );
                  }

                  return (
                    <li key={href}>
                      <Link href={href} prefetch={true}
                        className={`group flex items-center justify-between px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${
                          isActive ? "bg-slate-50 text-slate-900 shadow-sm border border-slate-100" : "text-slate-700 hover:text-slate-900 hover:bg-slate-50/50"
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon size={18} className={isActive ? "text-indigo-600" : isSpecial ? "text-red-500" : "text-slate-400 group-hover:text-slate-600"} />
                          <span className={isSpecial && !isActive ? "text-slate-700 font-bold" : ""}>{label}</span>
                        </div>
                        <div className="flex items-center gap-2">
                          {badge === "NEW"  && <span className="text-[8px] font-black bg-gradient-to-r from-purple-600 to-pink-600 text-white px-1.5 py-0.5 rounded-md animate-pulse">NEW</span>}
                          {badge === "HOT"  && <span className="text-[8px] font-black bg-orange-500 text-white px-1.5 py-0.5 rounded-md">HOT</span>}
                          {isActive && <div className="w-1.5 h-1.5 rounded-full bg-indigo-600" />}
                        </div>
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
          <div className="h-2" />
        </nav>

        {/* FOOTER */}
        <div className="px-3 pb-2 flex-shrink-0">
          {isCollapsed ? (
            <Link href="/dashboard/credits"
              className="flex items-center justify-center py-2.5 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 transition-all"
              title={`Crédits${balance !== null ? ` : ${balance}` : ""}`}>
              <CreditCard size={16} className="text-slate-500" />
            </Link>
          ) : (
            <CreditsBlock />
          )}
        </div>
        <div className={`p-3 pt-2 border-t border-slate-50 flex-shrink-0 ${isCollapsed ? "flex justify-center" : ""}`}>
          {isCollapsed ? (
            <button onClick={handleLogout}
              className="p-2 rounded-lg hover:bg-red-50 text-slate-400 hover:text-red-600 transition-all w-full flex justify-center"
              title="Déconnexion">
              <LogOut size={16} />
            </button>
          ) : (
            <button onClick={handleLogout}
              className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-slate-500 hover:text-red-600 hover:bg-red-50 rounded-xl transition-all">
              <LogOut size={16} />
              Se déconnecter
            </button>
          )}
        </div>
      </aside>

      {/* ══ SIDEBAR MOBILE ══ */}
      {open && (
        <>
          <div className="fixed inset-0 bg-slate-900/20 backdrop-blur-sm z-40 lg:hidden" onClick={() => setOpen(false)} />
          <div className={`fixed lg:hidden top-0 left-0 z-50 w-[280px] h-full bg-white shadow-2xl flex flex-col transform transition-transform duration-300 ${open ? "translate-x-0" : "-translate-x-full"}`}>

            {/* HEADER MOBILE */}
            <div className="h-16 flex items-center justify-between px-4 border-b border-slate-100 flex-shrink-0">
              <Link href="/" className="flex items-center gap-2.5" onClick={() => setOpen(false)}>
                <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                  <BookOpenIcon className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-black text-slate-900">Bookzy</span>
              </Link>
              <button onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:bg-slate-50 rounded-lg">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* CTA MOBILE */}
            <div className="px-3 py-3 border-b border-slate-100 flex-shrink-0">
              <Link href="/dashboard/projets/nouveau" onClick={() => setOpen(false)} prefetch={true}
                className="w-full flex items-center justify-center gap-2 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold text-sm shadow-lg transition-all active:scale-[0.98]">
                <Plus size={16} strokeWidth={3} />
                <span>Générer un ebook</span>
              </Link>
            </div>

            {/* NAV MOBILE */}
            <nav className="py-1 flex flex-col flex-1">
              {sidebarConfig.map((section) => (
                <div key={section.title} className="px-2">
                  <p className="text-[9px] font-bold text-slate-400 uppercase tracking-wider px-2 pt-1.5 pb-0.5">{section.title}</p>
                  <ul className="space-y-0">
                    {section.items.map(({ label, href, icon: Icon, isSpecial, disabled, isAccordion }) => {

                      if (isAccordion && label === "Smart Shop") {
                        return (
                          <li key={label}>
                            <button
                              onClick={() => setSmartShopOpen(!smartShopOpen)}
                              className={`flex items-center justify-between w-full px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                                isSmartShopActive || smartShopOpen ? "bg-slate-50 text-slate-900" : "text-slate-700 hover:bg-slate-50"
                              }`}
                            >
                              <div className="flex items-center gap-3">
                                <Store size={17} className={isSmartShopActive ? "text-indigo-600" : "text-slate-400"} />
                                <span>Smart Shop</span>
                              </div>
                              <ChevronDown size={14} className={`transition-transform duration-200 ${smartShopOpen ? "rotate-180" : ""}`} />
                            </button>
                            {smartShopOpen && (
                              <ul className="space-y-0 mt-0.5">
                                {smartShopItems.map(({ label: subLabel, href: subHref, icon: SubIcon }) => {
                                  const isActive = isLinkActive(subHref);
                                  return (
                                    <li key={subHref}>
                                      <Link href={subHref} onClick={() => setOpen(false)} prefetch={true}
                                        className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ml-5 ${
                                          isActive ? "bg-indigo-50 text-indigo-700" : "text-slate-600 hover:bg-slate-50"
                                        }`}>
                                        <SubIcon size={15} className={isActive ? "text-indigo-600" : "text-slate-400"} />
                                        <span>{subLabel}</span>
                                      </Link>
                                    </li>
                                  );
                                })}
                              </ul>
                            )}
                          </li>
                        );
                      }

                      if (disabled) return null;

                      const isActive = isLinkActive(href);
                      return (
                        <li key={href}>
                          <Link href={href} onClick={() => setOpen(false)} prefetch={true}
                            className={`flex items-center gap-3 px-3 py-2 text-sm font-medium rounded-xl transition-colors ${
                              isActive ? "bg-slate-50 text-indigo-700" : "text-slate-700 hover:bg-slate-50"
                            }`}>
                            <Icon size={17} className={isActive ? "text-indigo-600" : isSpecial ? "text-red-500" : "text-slate-400"} />
                            <span>{label}</span>
                          </Link>
                        </li>
                      );
                    })}
                  </ul>
                </div>
              ))}
            </nav>

            {/* FOOTER MOBILE */}
            <div className="px-3 pb-4 pt-2 flex-shrink-0 border-t border-slate-100">
              <Link href="/dashboard/credits" onClick={() => setOpen(false)}
                className="flex items-center justify-between w-full px-4 py-3 rounded-xl bg-slate-50 border border-slate-100 hover:bg-blue-50 transition-all mb-2">
                <div className="flex items-center gap-2.5">
                  <CreditCard size={16} className="text-slate-500" />
                  <span className="text-sm font-semibold text-slate-700">Mes crédits</span>
                </div>
                {balance !== null && (
                  <span className="text-sm font-bold bg-slate-200 text-slate-600 px-2.5 py-0.5 rounded-full">{balance}</span>
                )}
              </Link>
              <button onClick={handleLogout}
                className="w-full py-2.5 flex items-center justify-center gap-2 text-sm text-red-600 font-bold bg-white border border-slate-200 rounded-xl hover:bg-red-50 transition-all">
                <LogOut size={15} />
                <span>Déconnexion</span>
              </button>
            </div>
          </div>
        </>
      )}
    </>
  );
}

function BookOpenIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}