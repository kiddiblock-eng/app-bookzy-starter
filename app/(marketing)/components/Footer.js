"use client";

import Link from "next/link";
import { Mail, Facebook, Instagram } from "lucide-react";
import { usePathname } from "next/navigation";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

function BookOpenSVG(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const EXCLUDE_PATHS = [
    "/niche-hunter", "/tendances", "/youbook", "/blog", "/legal",
    "/auth", "/dashboard", "/affiliation", "/suggestions",
    "/changelog", "/express", "/smart-shop", "/exemples-ebooks",
  ];
  if (EXCLUDE_PATHS.some(path => pathname.startsWith(path))) return null;

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({ top: element.getBoundingClientRect().top + window.pageYOffset - 80, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative overflow-hidden" style={{ background: "#0a0a0a" }}>

      {/* Grain matte */}
      <div className="absolute inset-0 opacity-[0.12] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* Ligne top subtile */}
      <div className="absolute top-0 left-0 right-0 h-px bg-white/[0.06]" />

      {/* Halo déco très subtil */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[600px] h-[200px] rounded-full opacity-[0.04] pointer-events-none"
        style={{ background: "radial-gradient(ellipse, #ffffff 0%, transparent 70%)" }} />

      <div className="relative z-10 max-w-7xl mx-auto px-5 sm:px-6 lg:px-8">

        {/* Main grid */}
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-7 gap-10 lg:gap-8">

            {/* Logo + mission */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-flex items-center gap-2.5 mb-6 group">
                <div className="w-9 h-9 rounded-lg bg-white/10 border border-white/10 flex items-center justify-center group-hover:bg-white/15 transition-all">
                  <BookOpenSVG className="w-4 h-4 text-white" />
                </div>
                <span className="text-lg font-black text-white tracking-tight">Bookzy</span>
              </Link>

              <p className="text-white/40 text-sm leading-relaxed mb-6 max-w-xs">
                La plateforme IA #1 pour créer et vendre des ebooks sans écrire un seul mot.
              </p>

              <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-white/10 bg-white/5 w-fit">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
                </span>
                <span className="text-[10px] font-black uppercase tracking-[0.15em] text-white/40">Système opérationnel 24/7</span>
              </div>
            </div>

            {/* Produit */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 mb-5">Produit</p>
              <ul className="space-y-3 text-sm">
                <li><button onClick={() => scrollToSection("features")} className="text-white/40 hover:text-white transition-colors font-medium">Fonctionnalités</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="text-white/40 hover:text-white transition-colors font-medium">Tarifs</button></li>
                <li><button onClick={() => scrollToSection("examples")} className="text-white/40 hover:text-white transition-colors font-medium">Exemples</button></li>
                <li><button onClick={() => scrollToSection("howitWorks")} className="text-white/40 hover:text-white transition-colors font-medium">Comment ça marche</button></li>
                <li>
                  <Link href="/express" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 flex-shrink-0" />
                    Ebook Designer
                  </Link>
                </li>
                <li>
                  <Link href="/smart-shop" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400/60 flex-shrink-0" />
                    Smart Shop
                  </Link>
                </li>
                <li className="pt-1">
                  <Link href="/affiliation" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 flex-shrink-0" />
                    Devenir Affilié
                    <span className="bg-white/10 border border-white/10 text-white/60 text-[9px] font-black px-1.5 py-0.5 rounded uppercase tracking-wider">New</span>
                  </Link>
                </li>
              </ul>
            </div>

            {/* Outils */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 mb-5">Outils</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/niche-hunter" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-pink-400/60 flex-shrink-0" />
                    Niche Hunter
                  </Link>
                </li>
                <li>
                  <Link href="/tendances" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-orange-400/60 flex-shrink-0" />
                    Tendances
                  </Link>
                </li>
                <li>
                  <Link href="/youbook" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-red-400/60 flex-shrink-0" />
                    Youbook
                  </Link>
                </li>
                <li>
                  <button onClick={() => scrollToSection("faq")} className="text-white/40 hover:text-white transition-colors font-medium">FAQ</button>
                </li>
              </ul>
            </div>

            {/* Communauté */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 mb-5">Communauté</p>
              <ul className="space-y-3 text-sm">
                <li>
                  <Link href="/suggestions" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-400/60 flex-shrink-0" />
                    Suggestions
                  </Link>
                </li>
                <li>
                  <Link href="/changelog" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 flex-shrink-0" />
                    Nouveautés
                  </Link>
                </li>
                <li>
                  <Link href="/exemples-ebooks" className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-violet-400/60 flex-shrink-0" />
                    Exemples d'Ebooks
                  </Link>
                </li>
                <li>
                  <a href="https://t.me/+Yad7Hj17d445Mzdk" target="_blank" rel="noopener noreferrer"
                    className="text-white/40 hover:text-white transition-colors flex items-center gap-2 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-blue-400/60 flex-shrink-0" />
                    Telegram
                  </a>
                </li>
              </ul>
            </div>

            {/* Légal */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 mb-5">Légal</p>
              <ul className="space-y-3 text-sm">
                <li><Link href="/legal/terms" className="text-white/40 hover:text-white transition-colors font-medium">CGU / CGV</Link></li>
                <li><Link href="/legal/cookies" className="text-white/40 hover:text-white transition-colors font-medium">Cookies</Link></li>
                <li><Link href="/legal/confidentialite" className="text-white/40 hover:text-white transition-colors font-medium">Confidentialité</Link></li>
                <li><Link href="/legal/refund" className="text-white/40 hover:text-white transition-colors font-medium">Remboursement</Link></li>
              </ul>
            </div>

            {/* Réseaux */}
            <div>
              <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/20 mb-5">Suivez-nous</p>
              <div className="flex flex-col gap-4">
                <div className="flex gap-2">
                  <a href="https://facebook.com/profile.php?id=61550897802074" target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 flex items-center justify-center text-white/40 hover:text-white transition-all">
                    <Facebook className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://instagram.com/bookzy_ai" target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 flex items-center justify-center text-white/40 hover:text-white transition-all">
                    <Instagram className="w-3.5 h-3.5" />
                  </a>
                  <a href="https://www.tiktok.com/@bookzyia?_r=1&_t=ZS-94fdq3k4Mr6" target="_blank" rel="noopener noreferrer"
                    className="w-8 h-8 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 hover:border-white/20 flex items-center justify-center text-white/40 hover:text-white transition-all">
                    <svg className="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                    </svg>
                  </a>
                </div>
                <a href="mailto:support@bookzy.io"
                  className="inline-flex items-center gap-1.5 text-[10px] font-black text-white/30 hover:text-white transition-colors uppercase tracking-widest">
                  <Mail className="w-3 h-3" />
                  support@bookzy.io
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom bar */}
        <div className="border-t border-white/[0.06] py-7 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-white/20">
            © {currentYear} Bookzy. Tous droits réservés.
          </p>
          <div className="flex items-center gap-2">
            {[
              { hex: "#f97316", label: "Orange Money" },
              { hex: "#facc15", label: "MTN" },
              { hex: "#60a5fa", label: "Moov" },
              { hex: "#22d3ee", label: "Wave" },
            ].map(m => (
              <div key={m.label}
                className="h-4 w-8 rounded border border-white/10 opacity-30 hover:opacity-70 transition-opacity"
                style={{ background: m.hex }}
                title={m.label}
              />
            ))}
          </div>
        </div>

      </div>
    </footer>
  );
}