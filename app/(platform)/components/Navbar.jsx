"use client";
import { useState } from "react";
import { Menu, X } from "lucide-react";
import Link from "next/link";

export default function Navbar() {
  const [open, setOpen] = useState(false);

  return (
    <nav className="w-full bg-blue-600 text-white fixed top-0 left-0 z-50 shadow-md">
      <div className="max-w-6xl mx-auto flex items-center justify-between p-4">
        {/* Logo */}
        <Link href="/" className="text-lg font-semibold tracking-wide">
          Bookzy
        </Link>

        {/* Bouton menu (mobile) */}
        <button
          onClick={() => setOpen(!open)}
          className="md:hidden p-2 focus:outline-none"
        >
          {open ? <X size={22} /> : <Menu size={22} />}
        </button>

        {/* Liens desktop */}
        <div className="hidden md:flex gap-6 text-sm font-medium">
          <Link href="/" className="hover:text-neutral-200 transition">
            Accueil
          </Link>
          <Link
            href="/dashboard/support"
            className="hover:text-neutral-200 transition"
          >
            Support
          </Link>
          <Link
            href="/dashboard/historique"
            className="hover:text-neutral-200 transition"
          >
            Historique
          </Link>
          <Link
            href="/dashboard/settings"
            className="hover:text-neutral-200 transition"
          >
            Paramètres
          </Link>
        </div>
      </div>

      {/* Menu mobile */}
      {open && (
        <div className="md:hidden bg-blue-700 border-t border-blue-500">
          <div className="flex flex-col p-4 gap-3">
            <Link href="/" onClick={() => setOpen(false)}>
              Accueil
            </Link>
            <Link href="/dashboard/support" onClick={() => setOpen(false)}>
              Support
            </Link>
            <Link href="/dashboard/historique" onClick={() => setOpen(false)}>
              Historique
            </Link>
            <Link href="/dashboard/settings" onClick={() => setOpen(false)}>
              Paramètres
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}