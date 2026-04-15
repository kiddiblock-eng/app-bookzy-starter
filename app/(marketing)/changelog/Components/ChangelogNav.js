"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Menu, X } from "lucide-react";

export default function ChangelogNav() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  return (
    <nav
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        isScrolled
          ? "bg-[#F5F2ED]/95 backdrop-blur-md border-b border-[#D6CFC4] py-3 shadow-sm"
          : "bg-transparent py-5"
      }`}
    >
      <div
        className="absolute inset-0 opacity-[0.03] pointer-events-none"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`,
          backgroundRepeat: "repeat",
          backgroundSize: "128px",
        }}
      />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">

          {/* LEFT */}
          <div className="flex items-center gap-5">
            <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
              <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Bookzy</span>
            </Link>
            <div className="w-px h-5 bg-[#C8BFB0] hidden sm:block" />
            <div className="flex flex-col">
              <span className="text-xs font-black uppercase tracking-[0.2em] text-slate-900">Changelog</span>
              <span className="text-[9px] font-semibold text-slate-400 uppercase tracking-widest">Mises à jour</span>
            </div>
          </div>

          {/* CENTER — version actuelle */}
          <div className="hidden md:flex items-center gap-3">
            <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
            <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Version actuelle</span>
            <div className="px-3 py-1 rounded-full border border-[#C8BFB0] bg-[#F0EBE3]" style={{ fontVariantNumeric: "tabular-nums" }}>
              <span className="text-xs font-black text-slate-900 tracking-wider">V1.2 </span>
              <span className="text-xs font-black text-blue-500 tracking-wider">MARS</span>
            </div>
          </div>

          {/* RIGHT */}
          <div className="flex items-center gap-2 lg:gap-6">
            <div className="hidden lg:flex items-center gap-6">
              {[
                { label: "Toutes les versions", href: "/changelog" },
                { label: "Roadmap", href: "/changelog#roadmap" },
              ].map((link) => (
                <Link key={link.label} href={link.href}
                  className="text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors relative group">
                  {link.label}
                  <span className="absolute -bottom-0.5 left-0 w-0 h-px bg-slate-900 transition-all duration-300 group-hover:w-full" />
                </Link>
              ))}
            </div>
            <Link href="/auth/login"
              className="px-3 py-1.5 lg:px-4 lg:py-2 text-slate-600 text-[11px] lg:text-xs font-bold rounded-lg uppercase tracking-widest hover:text-slate-900 transition-colors border border-[#C8BFB0] hover:border-slate-400 bg-white">
              Connexion
            </Link>
            <Link href="/auth/register"
              className="px-3 py-1.5 lg:px-4 lg:py-2 bg-slate-900 text-white text-[11px] lg:text-xs font-bold rounded-lg uppercase tracking-widest hover:bg-slate-800 transition-colors">
              S'inscrire
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="lg:hidden p-2 text-slate-700 hover:bg-[#E8E2D9] rounded-lg transition-colors">
            {isMobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* MOBILE MENU */}
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-[#F5F2ED] border-b border-[#D6CFC4] p-6 shadow-xl flex flex-col gap-5 lg:hidden">
            <div className="flex items-center gap-3 pb-4 border-b border-[#D6CFC4]">
              <div className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
              <span className="text-xs font-bold text-slate-500 uppercase tracking-widest">Version actuelle</span>
              <div className="px-3 py-1 rounded-full border border-[#C8BFB0] bg-[#EDE8E0]">
                <span className="text-xs font-black text-slate-900">V1.2 </span>
                <span className="text-xs font-black text-blue-500">MARS</span>
              </div>
            </div>
            {[
              { label: "Toutes les versions", href: "/changelog" },
              { label: "Roadmap", href: "/changelog#roadmap" },
            ].map((link) => (
              <Link key={link.label} href={link.href} onClick={() => setIsMobileMenuOpen(false)}
                className="text-sm font-bold text-slate-700 uppercase tracking-widest py-2 border-b border-[#E8E2D9] hover:text-slate-900 transition-colors">
                {link.label}
              </Link>
            ))}
            <div className="flex gap-3">
              <Link href="/auth/login" onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center px-4 py-3 border border-[#C8BFB0] text-slate-700 text-sm font-bold rounded-xl uppercase tracking-widest hover:bg-[#E8E2D9] transition-colors">
                Connexion
              </Link>
              <Link href="/auth/register" onClick={() => setIsMobileMenuOpen(false)}
                className="flex-1 text-center px-4 py-3 bg-slate-900 text-white text-sm font-bold rounded-xl uppercase tracking-widest">
                S'inscrire
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}