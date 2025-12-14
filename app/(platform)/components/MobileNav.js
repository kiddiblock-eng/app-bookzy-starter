"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, Folder, Images, History, Settings } from "lucide-react";

export default function MobileNav() {
  const pathname = usePathname();

  const items = [
    { href: "/dashboard", icon: Home, label: "Accueil" },
    { href: "/dashboard/projets", icon: Folder, label: "Projets" },
    { href: "/dashboard/templates", icon: Images, label: "Templates" },
    { href: "/dashboard/historique", icon: History, label: "Historique" },
    { href: "/dashboard/parametres", icon: Settings, label: "Profil" },
  ];

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 dark:border-neutral-800 bg-white dark:bg-neutral-950">
      <div className="flex justify-around py-2">
        {items.map(({ href, icon: Icon, label }) => {
          const active = pathname === href || pathname?.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={`flex flex-col items-center text-xs ${
                active
                  ? "text-blue-600"
                  : "text-neutral-500 hover:text-neutral-800 dark:hover:text-neutral-300"
              }`}
            >
              <Icon className="w-5 h-5" />
              <span className="mt-0.5">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}