"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, BarChart3, Bell, Flame, BookOpen, CreditCard,
  Settings, Brain, FileText, X, Banknote, Store, FileEdit, Lightbulb, Activity, Gift,
} from "lucide-react";

const ACCENT = "#059669";

const GROUPS = [
  { items: [{ href: "/admin", label: "Dashboard", icon: LayoutDashboard, exact: true }] },
  {
    label: "Croissance",
    items: [
      { href: "/admin/users", label: "Utilisateurs", icon: Users },
      { href: "/admin/analytics", label: "Statistiques", icon: BarChart3 },
      { href: "/admin/notifications", label: "Notifications", icon: Bell },
      { href: "/admin/affiliation", label: "Affiliation", icon: Banknote },
      { href: "/admin/suggestions", label: "Suggestions", icon: Lightbulb },
    ],
  },
  {
    label: "Contenu",
    items: [
      { href: "/admin/ebooks", label: "eBooks", icon: BookOpen },
      { href: "/admin/blog", label: "Blogs", icon: FileText },
      { href: "/admin/express", label: "Mises en page", icon: FileEdit },
      { href: "/admin/smart-shop", label: "Smart Shop", icon: Store },
      { href: "/admin/tendances", label: "Tendances", icon: Flame },
    ],
  },
  {
    label: "Intelligence",
    items: [
      { href: "/admin/ai", label: "Centre IA", icon: Brain },
      { href: "/admin/niche-hunter/ai-stats", label: "IA — Stats", icon: Activity, badge: "Bêta" },
    ],
  },
  { label: "Finance", items: [
    { href: "/admin/paiements", label: "Paiements", icon: CreditCard },
    { href: "/admin/promo", label: "Roue promo", icon: Gift },
  ] },
  { label: "Système", items: [{ href: "/admin/settings", label: "Paramètres", icon: Settings }] },
];

export default function AdminSidebar({ open, setOpen }) {
  const pathname = usePathname();
  const isActive = (href, exact) => (exact ? pathname === href : pathname.startsWith(href));

  return (
    <>
      <div
        className={`fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-300 ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
      />

      <aside
        className={`fixed top-0 left-0 h-screen w-[260px] bg-white border-r border-neutral-200 flex flex-col z-50 transition-transform duration-300 ease-in-out ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-5 border-b border-neutral-100">
          <Link href="/admin" className="flex items-center gap-2.5">
            <img src="/logo12.webp" alt="Bookzy" className="h-6 w-auto object-contain" />
            <span className="text-[11px] font-bold uppercase tracking-wider text-neutral-400">Admin</span>
          </Link>
          <button onClick={() => setOpen(false)} className="lg:hidden text-neutral-400 hover:text-neutral-700">
            <X size={20} />
          </button>
        </div>

        {/* Nav */}
        <nav className="flex-1 py-4 overflow-y-auto">
          {GROUPS.map((group, gi) => (
            <div key={gi} className="px-3 mb-4">
              {group.label && (
                <p className="px-3 mb-1.5 text-[10px] font-bold uppercase tracking-wider text-neutral-400">{group.label}</p>
              )}
              <ul className="space-y-0.5">
                {group.items.map(({ href, label, icon: Icon, exact, badge }) => {
                  const active = isActive(href, exact);
                  return (
                    <li key={href}>
                      <Link
                        href={href}
                        onClick={() => setOpen(false)}
                        className={`group flex items-center justify-between px-3 py-2.5 rounded-xl text-sm font-medium transition-colors ${active ? "bg-emerald-50 text-emerald-700" : "text-neutral-600 hover:bg-neutral-100 hover:text-neutral-900"}`}
                      >
                        <span className="flex items-center gap-3">
                          <Icon size={18} style={active ? { color: ACCENT } : undefined} className={active ? "" : "text-neutral-400 group-hover:text-neutral-600"} strokeWidth={2} />
                          {label}
                        </span>
                        {badge && (
                          <span className="text-[9px] font-bold px-1.5 py-0.5 rounded-md bg-neutral-100 text-neutral-500 border border-neutral-200">{badge}</span>
                        )}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </div>
          ))}
        </nav>

        {/* Footer */}
        <div className="p-4 border-t border-neutral-100">
          <div className="flex items-center gap-2 px-3 py-2 rounded-lg bg-neutral-50">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-xs text-neutral-500">Système opérationnel</span>
          </div>
        </div>
      </aside>
    </>
  );
}
