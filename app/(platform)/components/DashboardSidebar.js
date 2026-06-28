"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Youtube, FileText, Target, TrendingUp,
  Library, Banknote, Store, CreditCard, LogOut, Plus,
  ChevronDown, BookOpen, Radio, ChevronLeft, ChevronRight,
  Palette, Package, Receipt, Search, History, Settings, Trophy, Scroll, BarChart2,
  SearchCheck, ExternalLink,
} from "lucide-react";
import useSWR from "swr";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

const NICHE_ITEMS = [
  { label: "Trouver une niche", href: "/dashboard/niche-hunter", exact: true, icon: SearchCheck, color: "#10b981" },
  { label: "Mes résultats", href: "/dashboard/niche-hunter/resultats", icon: History },
];

const ANALYSEUR_ITEMS = [
  { label: "Valider une idée", href: "/dashboard/analyseur", exact: true, icon: BarChart2, color: "#10b981" },
  { label: "Mes validations", href: "/dashboard/analyseur/historique", icon: History },
];

const NAV_SECTIONS = [
  {
    label: "PILOTAGE",
    items: [
      { label: "Générer un ebook", href: "/dashboard", icon: BookOpen, exact: true, color: "#6366f1" },
    ],
  },
  {
    label: "STUDIO DE CRÉATION",
    items: [
      { label: "Youbook", href: "/dashboard/youbook", icon: Youtube, color: "#ef4444" },
      { label: "Ebook Designer", href: "/dashboard/express", icon: FileText, color: "#8b5cf6" },
      { label: "Romans IA", href: "/dashboard/romans", icon: BookOpen, color: "#ec4899" },
    ],
  },
  {
    label: "OUTILS DE RECHERCHE",
    items: [
      { label: "Niche Hunter", href: "/dashboard/niche-hunter", icon: Target, color: "#10b981", accordion: "niche" },
      { label: "Radar Cash", href: "/dashboard/radar-cash", icon: Radio, color: "#06b6d4" },
      { label: "Validateur d'idée", href: "/dashboard/analyseur", icon: BarChart2, color: "#10b981", accordion: "analyseur" },
    ],
  },
  {
    label: "BIBLIOTHÈQUE",
    items: [
      { label: "Mes Ebooks", href: "/dashboard/fichiers", icon: Library, color: "#6366f1" },
      { label: "Mes Romans", href: "/dashboard/mes-romans", icon: Scroll, color: "#ec4899" },
    ],
  },
  {
    label: "BUSINESS",
    items: [
      { label: "Affiliation", href: "/dashboard/affiliation", icon: Banknote, color: "#10b981" },
      { label: "Taliopay", href: "https://taliopay.com", icon: Store, color: "#4f46e5", external: true },
    ],
  },
];

export default function DashboardSidebar({ open, setOpen, collapsed, setCollapsed }) {
  const pathname = usePathname();
  const [nicheOpen, setNicheOpen] = useState(false);
  const [analyseurOpen, setAnalyseurOpen] = useState(false);
  const [_collapsed, _setCollapsed] = useState(false);

  const isCollapsed = setCollapsed ? collapsed : _collapsed;
  const toggleCollapsed = () => setCollapsed ? setCollapsed(!collapsed) : _setCollapsed(!_collapsed);

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

  const isActive = (href, exact = false) => {
    if (exact) return pathname === href;
    return pathname === href || pathname.startsWith(href + "/");
  };

  const handleLogout = async () => {
    try { await fetch("/api/auth/logout", { method: "POST", credentials: "include" }); } catch {}
    window.location.href = "/auth/login";
  };

  const CollapsedSidebar = () => (
    <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "white", alignItems: "center" }}>
      <div style={{ padding: "16px 0 12px", display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", borderBottom: "1px solid #f1f5f9", width: "100%" }}>
        <Link href="/" style={{ display: "flex", alignItems: "center", justifyContent: "center" }}>
          <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <BookIcon style={{ width: "14px", height: "14px", color: "white" }} />
          </div>
        </Link>
        <button onClick={toggleCollapsed} style={{ padding: "4px", color: "#94a3b8", cursor: "pointer", border: "none", background: "none", borderRadius: "6px" }}>
          <ChevronRight size={14} />
        </button>
      </div>
      <nav style={{ flex: 1, overflowY: "auto", padding: "4px 0", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        {NAV_SECTIONS.flatMap(s => s.items).map(({ href, icon: Icon, exact, color, accordion, external }) => {
          const realHref = accordion === "niche" ? "/dashboard/niche-hunter" : accordion === "analyseur" ? "/dashboard/analyseur" : href;
          const on = !external && isActive(realHref, exact);
          if (external) {
            return (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", textDecoration: "none" }}>
                <Icon size={16} style={{ color: "#94a3b8" }} />
              </a>
            );
          }
          return (
            <Link key={realHref + (accordion || "")} href={realHref}
              style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: on ? "#f0f9ff" : "transparent", textDecoration: "none" }}>
              <Icon size={16} style={{ color: on ? color : "#94a3b8" }} />
            </Link>
          );
        })}
      </nav>
      <div style={{ padding: "8px 0", borderTop: "1px solid #f1f5f9", width: "100%", display: "flex", flexDirection: "column", alignItems: "center", gap: "2px" }}>
        <Link href="/dashboard/credits" style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", textDecoration: "none" }}>
          <CreditCard size={16} style={{ color: "#94a3b8" }} />
        </Link>
        <button onClick={handleLogout} style={{ width: "36px", height: "36px", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", background: "transparent", border: "none", cursor: "pointer" }}>
          <LogOut size={16} style={{ color: "#94a3b8" }} />
        </button>
      </div>
    </div>
  );

  const ExpandedSidebar = ({ mobile = false }) => {
    const close = mobile ? () => setOpen(false) : undefined;
    return (
      <div style={{ display: "flex", flexDirection: "column", height: "100%", background: "white" }}>
        <div style={{ padding: "16px 16px 12px", display: "flex", alignItems: "center", justifyContent: "space-between", borderBottom: "1px solid #f1f5f9" }}>
          <Link href="/" onClick={close} style={{ display: "flex", alignItems: "center", gap: "8px", textDecoration: "none" }}>
            <div style={{ width: "28px", height: "28px", borderRadius: "8px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <BookIcon style={{ width: "14px", height: "14px", color: "white" }} />
            </div>
            <span style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", letterSpacing: "-0.3px" }}>Bookzy</span>
          </Link>
          {!mobile ? (
            <button onClick={toggleCollapsed} style={{ padding: "4px 6px", color: "#94a3b8", cursor: "pointer", border: "none", background: "none", borderRadius: "6px" }}>
              <ChevronLeft size={14} />
            </button>
          ) : (
            <button onClick={() => setOpen(false)} style={{ padding: "6px", color: "#94a3b8", cursor: "pointer", border: "none", background: "none", borderRadius: "6px" }}>
              <svg width="18" height="18" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>

        <nav style={{ flex: 1, overflowY: "auto", padding: "4px 8px", display: "flex", flexDirection: "column", gap: "16px" }}>
          {NAV_SECTIONS.map((section) => (
            <div key={section.label}>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", padding: "0 8px", marginBottom: "4px" }}>{section.label}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {section.items.map(({ label, href, icon: Icon, exact, color, badge, accordion, external }) => {

                  // Lien externe (Taliopay)
                  if (external) {
                    return (
                      <a key={href} href={href} target="_blank" rel="noopener noreferrer"
                        style={{ display: "flex", alignItems: "center", gap: "9px", padding: "7px 8px", borderRadius: "8px", color: "#475569", fontSize: "13px", fontWeight: "400", textDecoration: "none" }}>
                        <Icon size={15} style={{ color: "#94a3b8", flexShrink: 0 }} />
                        <span style={{ flex: 1 }}>{label}</span>
                        <ExternalLink size={11} style={{ color: "#cbd5e1", flexShrink: 0 }} />
                      </a>
                    );
                  }

                  if (accordion === "niche") {
                    const on = isActive("/dashboard/niche-hunter");
                    return (
                      <div key={label}>
                        <button onClick={() => setNicheOpen(!nicheOpen)}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "9px", padding: "7px 8px", borderRadius: "8px", border: "none", cursor: "pointer", background: on ? "#f0f9ff" : "transparent", color: on ? "#0369a1" : "#475569", fontSize: "13px", fontWeight: on ? "600" : "400" }}>
                          <Icon size={15} style={{ color: on ? color : "#94a3b8", flexShrink: 0 }} />
                          <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                          <ChevronDown size={13} style={{ color: "#94a3b8", transform: nicheOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                        </button>
                        {nicheOpen && (
                          <div style={{ paddingLeft: "24px", marginTop: "1px", display: "flex", flexDirection: "column", gap: "1px" }}>
                            {NICHE_ITEMS.map(({ label: sl, href: sh, exact: se, icon: SI, color: sc }) => {
                              const sa = se ? pathname === sh : pathname.startsWith(sh);
                              return (
                                <Link key={sh} href={sh} onClick={close}
                                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", borderRadius: "7px", fontSize: "12px", fontWeight: sa ? "600" : "400", color: sa ? "#0369a1" : "#64748b", background: sa ? "#f0f9ff" : "transparent", textDecoration: "none" }}>
                                  <SI size={13} style={{ color: sa ? "#0369a1" : (sc || "#94a3b8"), flexShrink: 0 }} />
                                  {sl}
                                </Link>
                              );
                            })}
                          </div>
                        )}
                      </div>
                    );
                  }

                  if (accordion === "analyseur") {
                    const on = isActive("/dashboard/analyseur");
                    return (
                      <div key={label}>
                        <button onClick={() => setAnalyseurOpen(!analyseurOpen)}
                          style={{ width: "100%", display: "flex", alignItems: "center", gap: "9px", padding: "7px 8px", borderRadius: "8px", border: "none", cursor: "pointer", background: on ? "#f0f9ff" : "transparent", color: on ? "#0369a1" : "#475569", fontSize: "13px", fontWeight: on ? "600" : "400" }}>
                          <Icon size={15} style={{ color: on ? color : "#94a3b8", flexShrink: 0 }} />
                          <span style={{ flex: 1, textAlign: "left" }}>{label}</span>
                          <ChevronDown size={13} style={{ color: "#94a3b8", transform: analyseurOpen ? "rotate(180deg)" : "rotate(0deg)", transition: "transform 0.2s" }} />
                        </button>
                        {analyseurOpen && (
                          <div style={{ paddingLeft: "24px", marginTop: "1px", display: "flex", flexDirection: "column", gap: "1px" }}>
                            {ANALYSEUR_ITEMS.map(({ label: sl, href: sh, exact: se, icon: SI, color: sc }) => {
                              const sa = se ? pathname === sh : pathname.startsWith(sh);
                              return (
                                <Link key={sh} href={sh} onClick={close}
                                  style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", borderRadius: "7px", fontSize: "12px", fontWeight: sa ? "600" : "400", color: sa ? "#0369a1" : "#64748b", background: sa ? "#f0f9ff" : "transparent", textDecoration: "none" }}>
                                  <SI size={13} style={{ color: sa ? "#0369a1" : (sc || "#94a3b8"), flexShrink: 0 }} />
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
                    <Link key={href} href={href} onClick={close}
                      style={{ display: "flex", alignItems: "center", gap: "9px", padding: "7px 8px", borderRadius: "8px", background: on ? "#f0f9ff" : "transparent", color: on ? "#0369a1" : "#475569", fontSize: "13px", fontWeight: on ? "600" : "400", textDecoration: "none" }}>
                      <Icon size={15} style={{ color: on ? color : "#94a3b8", flexShrink: 0 }} />
                      <span style={{ flex: 1 }}>{label}</span>
                      {badge && (
                        <span style={{ fontSize: "9px", fontWeight: "700", padding: "2px 5px", borderRadius: "4px", background: "#f1f5f9", color: "#94a3b8", letterSpacing: "0.04em" }}>{badge}</span>
                      )}
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        <div style={{ padding: "8px", borderTop: "1px solid #f1f5f9" }}>
          <Link href="/dashboard/credits" onClick={close}
            style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "7px 8px", borderRadius: "8px", background: isActive("/dashboard/credits") ? "#f0f9ff" : "transparent", color: isActive("/dashboard/credits") ? "#0369a1" : "#475569", fontSize: "13px", fontWeight: isActive("/dashboard/credits") ? "600" : "400", textDecoration: "none", marginBottom: "1px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "9px" }}>
              <CreditCard size={15} style={{ color: "#94a3b8" }} />
              <span>Mes crédits</span>
            </div>
            {balance !== null && (
              <span style={{ fontSize: "11px", fontWeight: "700", background: "#f1f5f9", color: "#64748b", padding: "2px 7px", borderRadius: "20px" }}>{balance} cr.</span>
            )}
          </Link>
          <button onClick={handleLogout}
            style={{ width: "100%", display: "flex", alignItems: "center", gap: "9px", padding: "7px 8px", borderRadius: "8px", border: "none", cursor: "pointer", background: "transparent", color: "#475569", fontSize: "13px", fontWeight: "400" }}
            onMouseEnter={e => { e.currentTarget.style.background = "#fef2f2"; e.currentTarget.style.color = "#dc2626"; }}
            onMouseLeave={e => { e.currentTarget.style.background = "transparent"; e.currentTarget.style.color = "#475569"; }}>
            <LogOut size={15} style={{ color: "#94a3b8" }} />
            Se déconnecter
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      <aside style={{ position: "fixed", left: 0, top: 0, zIndex: 40, height: "100vh", width: isCollapsed ? "60px" : "220px", borderRight: "1px solid #f1f5f9", transition: "width 0.2s" }} className="hidden lg:block">
        {isCollapsed ? <CollapsedSidebar /> : <ExpandedSidebar />}
      </aside>
      {open && (
        <>
          <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.2)", zIndex: 40, backdropFilter: "blur(2px)" }} className="lg:hidden" onClick={() => setOpen(false)} />
          <div style={{ position: "fixed", top: 0, left: 0, zIndex: 50, width: "280px", height: "100%", boxShadow: "0 25px 50px rgba(0,0,0,0.15)" }} className="lg:hidden">
            <ExpandedSidebar mobile />
          </div>
        </>
      )}
    </>
  );
}

function BookIcon(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}