"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Youtube, FileText, Target, Radio, BarChart2, Library, Scroll,
  Banknote, Store, CreditCard, LogOut, ChevronDown, PanelLeft,
  BookOpen, SearchCheck, History, ExternalLink, PenLine,
} from "lucide-react";
import useSWR from "swr";
import { ebooksFromCredits } from "@/lib/plans";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

const PRIMARY = { label: "Générer un ebook", href: "/dashboard", icon: PenLine, exact: true };

const NICHE_ITEMS = [
  { label: "Trouver une niche", href: "/dashboard/niche-hunter", exact: true, icon: SearchCheck },
  { label: "Mes résultats", href: "/dashboard/niche-hunter/resultats", icon: History },
];

const ANALYSEUR_ITEMS = [
  { label: "Valider une idée", href: "/dashboard/analyseur", exact: true, icon: BarChart2 },
  { label: "Mes validations", href: "/dashboard/analyseur/historique", icon: History },
];

const NAV_SECTIONS = [
  {
    items: [
      { label: "Youbook", href: "/dashboard/youbook", icon: Youtube },
      { label: "Ebook Designer", href: "/dashboard/express", icon: FileText },
      { label: "Romans IA", href: "/dashboard/romans", icon: BookOpen },
      { label: "Niche Hunter", href: "/dashboard/niche-hunter", icon: Target, accordion: "niche" },
      { label: "Radar Cash", href: "/dashboard/radar-cash", icon: Radio },
      { label: "Validateur d'idée", href: "/dashboard/analyseur", icon: BarChart2, accordion: "analyseur" },
    ],
  },
  {
    items: [
      { label: "Mes Ebooks", href: "/dashboard/fichiers", icon: Library },
      { label: "Mes Romans", href: "/dashboard/mes-romans", icon: Scroll },
      { label: "Affiliation", href: "/dashboard/affiliation", icon: Banknote },
      { label: "Taliopay", href: "https://taliopay.com", icon: Store, external: true },
    ],
  },
];

export default function DashboardSidebar({ open, setOpen, collapsed, setCollapsed }) {
  const pathname = usePathname();
  const [nicheOpen, setNicheOpen] = useState(false);
  const [analyseurOpen, setAnalyseurOpen] = useState(false);
  const [tip, setTip] = useState(null);
  const [_collapsed, _setCollapsed] = useState(false);

  const isCollapsed = setCollapsed ? collapsed : _collapsed;
  const toggleCollapsed = () => (setCollapsed ? setCollapsed(!collapsed) : _setCollapsed(!_collapsed));

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });
  const balance = balanceData?.credits?.balance ?? null;

  useEffect(() => {
    if (pathname.startsWith("/dashboard/niche-hunter")) setNicheOpen(true);
    if (pathname.startsWith("/dashboard/analyseur")) setAnalyseurOpen(true);
  }, [pathname]);

  useEffect(() => {
    if (open) {
      const y = window.scrollY;
      document.body.style.overflow = "hidden";
      document.body.style.position = "fixed";
      document.body.style.top = `-${y}px`;
      document.body.style.width = "100%";
    } else {
      const y = parseInt(document.body.style.top || "0") * -1;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    }
    return () => {
      const y = parseInt(document.body.style.top || "0") * -1;
      document.body.style.overflow = "";
      document.body.style.position = "";
      document.body.style.top = "";
      document.body.style.width = "";
      window.scrollTo(0, y);
    };
  }, [open]);

  // Infobulle instantanée (fixed → échappe au scroll de la barre repliée)
  const showTip = (e, text) => {
    const r = e.currentTarget.getBoundingClientRect();
    setTip({ text, top: r.top + r.height / 2, left: r.right + 10 });
  };
  const hideTip = () => setTip(null);

  const isActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch {}
    window.location.href = "/auth/login";
  };

  // Style d'item façon ChatGPT (monochrome, actif/survol gris)
  const itemCls = (on) =>
    `flex items-center gap-3 px-3 py-2 rounded-lg text-sm transition-colors ${
      on ? "bg-neutral-100 text-neutral-900 font-medium" : "text-neutral-700 hover:bg-neutral-100"
    }`;
  const iconCls = (on) => `w-[18px] h-[18px] shrink-0 ${on ? "text-neutral-900" : "text-neutral-500"}`;

  // ── SIDEBAR REPLIÉE ──────────────────────────────────────────────────────
  const CollapsedSidebar = () => (
    <div className="flex flex-col h-full bg-white items-center py-3">
      <button onClick={toggleCollapsed} title="Ouvrir la barre latérale" aria-label="Ouvrir la barre latérale"
        className="group relative mb-2 w-9 h-9 rounded-lg flex items-center justify-center hover:bg-neutral-100 transition-colors">
        <img src="/sign1.webp" alt="Bookzy" className="w-9 h-9 rounded-lg object-contain transition-opacity group-hover:opacity-0" />
        <PanelLeft className="absolute w-5 h-5 text-neutral-600 opacity-0 group-hover:opacity-100 transition-opacity" />
      </button>
      <nav className="flex-1 overflow-y-auto w-full flex flex-col items-center gap-1">
        {[PRIMARY, ...NAV_SECTIONS.flatMap((s) => s.items)].map(({ label, href, icon: Icon, exact, external }) => {
          const on = !external && isActive(href, exact);
          const cls = `w-9 h-9 rounded-lg flex items-center justify-center ${on ? "bg-neutral-100" : "hover:bg-neutral-100"}`;
          if (external) {
            return <a key={href} href={href} onMouseEnter={(e) => showTip(e, label)} onMouseLeave={hideTip} target="_blank" rel="noopener noreferrer" className={cls}><Icon className={iconCls(false)} /></a>;
          }
          return <Link key={href} href={href} onMouseEnter={(e) => showTip(e, label)} onMouseLeave={hideTip} className={cls}><Icon className={iconCls(on)} /></Link>;
        })}
      </nav>
      <div className="w-full flex flex-col items-center gap-1 pt-2 border-t border-neutral-100">
        <Link href="/dashboard/tarifs" onMouseEnter={(e) => showTip(e, "Mes ebooks")} onMouseLeave={hideTip} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-neutral-100">
          <CreditCard className="w-[18px] h-[18px] text-neutral-500" />
        </Link>
        <button onClick={handleLogout} onMouseEnter={(e) => showTip(e, "Se déconnecter")} onMouseLeave={hideTip} className="w-9 h-9 rounded-lg flex items-center justify-center hover:bg-neutral-100">
          <LogOut className="w-[18px] h-[18px] text-neutral-500" />
        </button>
      </div>

      {tip && (
        <div
          style={{ position: "fixed", top: tip.top, left: tip.left, transform: "translateY(-50%)" }}
          className="z-[100] px-2 py-1 rounded-md bg-neutral-900 text-white text-xs font-medium whitespace-nowrap shadow-lg pointer-events-none"
        >
          {tip.text}
        </div>
      )}
    </div>
  );

  // ── SIDEBAR ÉTENDUE ──────────────────────────────────────────────────────
  const ExpandedSidebar = ({ mobile = false }) => {
    const close = mobile ? () => setOpen(false) : undefined;
    const primaryOn = isActive(PRIMARY.href, PRIMARY.exact);
    return (
      <div className="flex flex-col h-full bg-white">
        {/* Top */}
        <div className="flex items-center justify-between px-3 h-14 shrink-0">
          <Link href="/" onClick={close} className="flex items-center">
            <img src="/sign1.webp" alt="Bookzy" className="w-9 h-9 rounded-lg object-contain" />
          </Link>
          <button
            onClick={() => (mobile ? setOpen(false) : toggleCollapsed())}
            className="w-9 h-9 rounded-lg flex items-center justify-center text-neutral-500 hover:bg-neutral-100"
            aria-label="Fermer la barre latérale"
            title="Fermer la barre latérale"
          >
            <PanelLeft className="w-5 h-5" />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 overflow-y-auto px-2 pb-2">
          {/* Action principale */}
          <Link href={PRIMARY.href} onClick={close} data-tour="generate" className={`${itemCls(primaryOn)} mb-1`}>
            <PenLine className={iconCls(primaryOn)} />
            <span className="flex-1">{PRIMARY.label}</span>
          </Link>

          {NAV_SECTIONS.map((section, si) => (
            <div key={si} className={si === 0 ? "mt-2" : "mt-2 pt-2 border-t border-neutral-100"}>
              <div className="flex flex-col gap-0.5">
                {section.items.map(({ label, href, icon: Icon, exact, accordion, external }) => {
                  if (external) {
                    return (
                      <a key={href} href={href} target="_blank" rel="noopener noreferrer" className={itemCls(false)}>
                        <Icon className={iconCls(false)} />
                        <span className="flex-1">{label}</span>
                        <ExternalLink className="w-3 h-3 text-neutral-300" />
                      </a>
                    );
                  }
                  if (accordion === "niche" || accordion === "analyseur") {
                    const isNiche = accordion === "niche";
                    const accOpen = isNiche ? nicheOpen : analyseurOpen;
                    const setAcc = isNiche ? setNicheOpen : setAnalyseurOpen;
                    const subItems = isNiche ? NICHE_ITEMS : ANALYSEUR_ITEMS;
                    const on = isActive(href);
                    return (
                      <div key={label}>
                        <button onClick={() => setAcc(!accOpen)} data-tour={isNiche ? "tools" : undefined} className={`${itemCls(on)} w-full`}>
                          <Icon className={iconCls(on)} />
                          <span className="flex-1 text-left">{label}</span>
                          <ChevronDown className={`w-3.5 h-3.5 text-neutral-400 transition-transform ${accOpen ? "rotate-180" : ""}`} />
                        </button>
                        {accOpen && (
                          <div className="ml-6 mt-0.5 flex flex-col gap-0.5">
                            {subItems.map(({ label: sl, href: sh, exact: se, icon: SI }) => {
                              const sa = se ? pathname === sh : pathname.startsWith(sh);
                              return (
                                <Link key={sh} href={sh} onClick={close}
                                  className={`flex items-center gap-2.5 px-3 py-1.5 rounded-lg text-[13px] transition-colors ${sa ? "bg-neutral-100 text-neutral-900 font-medium" : "text-neutral-600 hover:bg-neutral-100"}`}>
                                  <SI className={`w-4 h-4 shrink-0 ${sa ? "text-neutral-900" : "text-neutral-400"}`} />
                                  {sl}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }
                  const on = isActive(href, exact);
                  return (
                    <Link key={href} href={href} onClick={close} data-tour={href === "/dashboard/fichiers" ? "myebooks" : undefined} className={itemCls(on)}>
                      <Icon className={iconCls(on)} />
                      <span className="flex-1">{label}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="px-2 py-2 border-t border-neutral-100">
          <Link href="/dashboard/tarifs" onClick={close} className={`${itemCls(isActive("/dashboard/tarifs"))} justify-between`}>
            <span className="flex items-center gap-3">
              <CreditCard className={iconCls(isActive("/dashboard/tarifs"))} />
              Mes ebooks
            </span>
            {balance !== null && (
              <span className="text-xs font-semibold text-neutral-500 bg-neutral-100 px-2 py-0.5 rounded-full">{ebooksFromCredits(balance)}</span>
            )}
          </Link>
          <button onClick={handleLogout} className="w-full flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-neutral-700 hover:bg-neutral-100 transition-colors">
            <LogOut className="w-[18px] h-[18px] text-neutral-500" />
            Se déconnecter
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <aside
        style={{ width: isCollapsed ? "60px" : "260px" }}
        className="hidden lg:block fixed left-0 top-0 z-40 h-screen border-r border-neutral-200 transition-[width] duration-200"
      >
        {isCollapsed ? <CollapsedSidebar /> : <ExpandedSidebar />}
      </aside>

      {open && (
        <>
          <div className="lg:hidden fixed inset-0 bg-black/20 backdrop-blur-[2px] z-40" onClick={() => setOpen(false)} />
          <div className="lg:hidden fixed top-0 left-0 z-50 w-[280px] h-full shadow-2xl">
            <ExpandedSidebar mobile />
          </div>
        </>
      )}
    </>
  );
}
