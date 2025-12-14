"use client";

import Link from "next/link";
import { Settings, CreditCard, Shield, Webhook } from "lucide-react";
import { usePathname } from "next/navigation";

const items = [
  { href: "/admin/settings/general", label: "Général", icon: Settings },
  { href: "/admin/settings/payment", label: "Paiements", icon: CreditCard },
  { href: "/admin/settings/webhooks", label: "Webhooks", icon: Webhook },
  { href: "/admin/settings/security", label: "Sécurité", icon: Shield },
];

export default function SettingsSidebar() {
  const pathname = usePathname();

  return (
    <aside className="w-64 bg-[#0f1623] border-r border-slate-800 h-full flex flex-col">
      {/* Petit Header de section */}
      <div className="px-6 py-6 border-b border-slate-800/50">
        <h2 className="text-xs font-bold text-slate-500 uppercase tracking-widest">
          Configuration
        </h2>
      </div>

      {/* Navigation */}
      <nav className="p-4 space-y-1">
        {items.map((item) => {
          const Icon = item.icon;
          // On vérifie si le chemin commence par le href (pour gérer les sous-pages éventuelles)
          const active = pathname.startsWith(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className={`
                group flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-200 border
                ${
                  active
                    ? "bg-indigo-500/10 border-indigo-500/20 text-indigo-400 shadow-[0_0_15px_rgba(99,102,241,0.1)]"
                    : "bg-transparent border-transparent text-slate-400 hover:text-slate-100 hover:bg-slate-800/50"
                }
              `}
            >
              <Icon 
                size={18} 
                className={`transition-colors ${active ? "text-indigo-400" : "text-slate-500 group-hover:text-slate-300"}`} 
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}