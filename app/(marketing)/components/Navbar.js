"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { Menu, X, ArrowRight } from "lucide-react";

const LINKS = [
  { label: "Comment ça marche", href: "#how" },
  { label: "Outils", href: "#outils" },
  { label: "Tarifs", href: "#tarifs" },
  { label: "FAQ", href: "#faq" },
];

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 8);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
      className={`fixed top-0 inset-x-0 z-50 transition-colors duration-300 ${
        scrolled ? "bg-white/80 backdrop-blur-xl border-b border-neutral-200/70" : "bg-transparent"
      }`}
    >
      <nav className="max-w-6xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center shrink-0">
          <img src="/logo12.webp" alt="Bookzy" className="h-7 w-auto object-contain" />
        </Link>

        <div className="hidden md:flex items-center gap-0.5">
          {LINKS.map((l) => (
            <a key={l.href} href={l.href} className="px-3.5 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-1.5">
          <Link href="/auth/login" className="px-3.5 py-2 text-sm font-medium text-neutral-600 hover:text-neutral-900 transition-colors">
            Se connecter
          </Link>
          <Link href="/auth/register" className="group inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 text-white text-sm font-semibold rounded-full hover:bg-neutral-800 transition-colors">
            Commencer <ArrowRight size={15} className="group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>

        <button onClick={() => setOpen(true)} className="md:hidden w-10 h-10 -mr-2 flex items-center justify-center text-neutral-800" aria-label="Menu">
          <Menu size={22} />
        </button>
      </nav>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/30 md:hidden" onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ x: "100%" }} animate={{ x: 0 }} exit={{ x: "100%" }}
              transition={{ type: "spring", damping: 30, stiffness: 300 }}
              className="fixed top-0 right-0 bottom-0 w-72 bg-white z-50 md:hidden p-5 flex flex-col"
            >
              <div className="flex items-center justify-between mb-8">
                <img src="/logo12.webp" alt="Bookzy" className="h-7 w-auto object-contain" />
                <button onClick={() => setOpen(false)} className="w-9 h-9 flex items-center justify-center text-neutral-500" aria-label="Fermer">
                  <X size={20} />
                </button>
              </div>
              <div className="flex flex-col gap-0.5">
                {LINKS.map((l) => (
                  <a key={l.href} href={l.href} onClick={() => setOpen(false)} className="px-3 py-3 text-[15px] font-medium text-neutral-700 hover:bg-neutral-100 rounded-xl transition-colors">
                    {l.label}
                  </a>
                ))}
              </div>
              <div className="mt-auto flex flex-col gap-2">
                <Link href="/auth/login" onClick={() => setOpen(false)} className="w-full py-3 text-center text-sm font-semibold text-neutral-700 border border-neutral-200 rounded-xl">
                  Se connecter
                </Link>
                <Link href="/auth/register" onClick={() => setOpen(false)} className="w-full py-3 text-center text-sm font-semibold text-white bg-neutral-900 rounded-xl">
                  Commencer gratuitement
                </Link>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.header>
  );
}
