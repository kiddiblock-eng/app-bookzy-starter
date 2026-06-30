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
    <aside className="w-64 bg-white border-r border-neutral-200 h-full flex flex-col">
      {/* Petit Header de section */}
      <div className="px-6 py-6 border-b border-neutral-200">
        <h2 className="text-xs font-bold text-neutral-500 uppercase tracking-widest">
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
                    ? "bg-emerald-50 border-emerald-200 text-emerald-700"
                    : "bg-transparent border-transparent text-neutral-600 hover:text-neutral-900 hover:bg-neutral-100"
                }
              `}
            >
              <Icon
                size={18}
                className={`transition-colors ${active ? "text-emerald-600" : "text-neutral-500 group-hover:text-neutral-700"}`}
              />
              {item.label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
