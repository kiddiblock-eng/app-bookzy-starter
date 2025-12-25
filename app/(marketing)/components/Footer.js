"use client";

import Link from "next/link";
import { Mail, Facebook, Instagram, Send } from "lucide-react";
import { usePathname } from 'next/navigation';

export default function Footer() {
  const currentYear = new Date().getFullYear();
  const pathname = usePathname();

  const EXCLUDE_PATHS = [
    '/niche-hunter',
    '/tendances',
    '/youbook',
    '/blog',
    '/legal',
    '/auth',
    '/dashboard',
  ];

  const isExcluded = EXCLUDE_PATHS.some(path => pathname.startsWith(path));

  if (isExcluded) {
    return null; 
  }

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <footer className="relative bg-slate-950 text-white overflow-hidden border-t border-slate-900">

      {/* BACKGROUND SIMPLIFIÉ */}
      <div className="absolute inset-0 bg-gradient-to-b from-slate-950 via-slate-950 to-blue-950/20"></div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">

        {/* Main Footer Content */}
        <div className="py-16 md:py-20">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-6 gap-10 lg:gap-8">

            {/* Column 1: Logo & Mission */}
            <div className="lg:col-span-2">
              <Link href="/" className="inline-block mb-6 group">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-blue-600 flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform">
                    <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
                    </svg>
                  </div>
                  <span className="text-2xl font-black text-white tracking-tight group-hover:text-blue-200 transition-colors">
                    Bookzy
                  </span>
                </div>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-6 max-w-xs">
                La plateforme IA n°1 en Afrique pour créer et vendre des ebooks sans écrire un seul mot.
              </p>
              
              {/* Badge Status */}
              <div className="flex items-center gap-2 text-xs font-medium text-emerald-400 bg-emerald-950/30 px-3 py-1.5 rounded-full w-fit border border-emerald-900/50">
                <span className="relative flex h-2 w-2">
                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
                  <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
                </span>
                Système opérationnel 24/7
              </div>
            </div>

            {/* Column 2: Produit */}
            <div>
              <h4 className="font-bold text-white mb-6">Produit</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><button onClick={() => scrollToSection("features")} className="hover:text-blue-400 transition-colors">Fonctionnalités</button></li>
                <li><button onClick={() => scrollToSection("pricing")} className="hover:text-blue-400 transition-colors">Tarifs</button></li>
                <li><button onClick={() => scrollToSection("examples")} className="hover:text-blue-400 transition-colors">Exemples</button></li>
                <li><button onClick={() => scrollToSection("howitWorks")} className="hover:text-blue-400 transition-colors">Comment ça marche</button></li>
              </ul>
            </div>
            

            {/* Column 3: Outils */}
            <div>
              <h4 className="font-bold text-white mb-6">Outils Gratuits</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/niche-hunter" className="hover:text-pink-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-pink-500"></span>Niche Hunter</Link></li>
                <li><Link href="/tendances" className="hover:text-orange-400 transition-colors flex items-center gap-2"><span className="w-1.5 h-1.5 rounded-full bg-orange-500"></span>Tendances</Link></li>
                <li><button onClick={() => scrollToSection("faq")} className="hover:text-blue-400 transition-colors">FAQ</button></li>
              </ul>
            </div>

            {/* Column 4: Légal */}
            <div>
              <h4 className="font-bold text-white mb-6">Légal</h4>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><Link href="/legal/terms" className="hover:text-white transition-colors">CGU / CGV</Link></li>
               <li><Link href="/legal/cookies" className="hover:text-white transition-colors">cookies</Link></li>
                <li><Link href="/legal/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link></li>
                <li><Link href="/legal/refund" className="hover:text-white transition-colors">Remboursement</Link></li>
              </ul>
            </div>

            {/* Column 5: Réseaux */}
            <div>
              <h4 className="font-bold text-white mb-6">Suivez-nous</h4>
              <div className="flex flex-col gap-3">
                {/* Telegram */}
                <a href="https://t.me/+Yad7Hj17d445Mzdk" target="_blank" rel="noopener noreferrer" className="flex items-center gap-3 p-2 rounded-lg bg-white/5 hover:bg-blue-600 transition-all border border-white/5 hover:border-blue-500">
                  <Send className="w-4 h-4 text-slate-400 group-hover:text-white" />
                  <span className="text-sm text-slate-300 group-hover:text-white">Telegram</span>
                </a>
                
                {/* Autres Réseaux */}
                <div className="flex gap-2">
                  <a href="https://facebook.com/profile.php?id=61550897802074&mibextid=wwXIfr" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-blue-700 transition-colors text-slate-400 hover:text-white"><Facebook className="w-4 h-4"/></a>
                  <a href="https://instagram.com/bookzy_ai?igsh=MWlmdG05cjc1cGY1Zg==" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-pink-600 transition-colors text-slate-400 hover:text-white"><Instagram className="w-4 h-4"/></a>
                  <a href="https://www.tiktok.com/@bookzy4?_r=1&_t=ZM-925gFDO9zey" target="_blank" rel="noopener noreferrer" className="p-2 rounded-lg bg-white/5 hover:bg-black hover:border-slate-600 border border-transparent transition-colors text-slate-400 hover:text-white">
                    <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24"><path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/></svg>
                  </a>
                </div>
                
                <a href="mailto:support@bookzy.io" className="text-xs text-slate-500 hover:text-white mt-2 transition-colors flex items-center gap-2">
                  <Mail className="w-3 h-3"/> support@bookzy.io
                </a>
              </div>
            </div>

          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-slate-900 py-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-slate-500 text-xs">
            © {currentYear} Bookzy. Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
             <div className="flex gap-3 grayscale opacity-30 hover:grayscale-0 hover:opacity-100 transition-all duration-500">
                <div className="h-4 w-8 bg-orange-500 rounded-sm" title="Orange Money"></div>
                <div className="h-4 w-8 bg-yellow-400 rounded-sm" title="MTN"></div>
                <div className="h-4 w-8 bg-blue-400 rounded-sm" title="Moov"></div>
                <div className="h-4 w-8 bg-cyan-400 rounded-sm" title="Wave"></div>
             </div>
          </div>
        </div>
      </div>
    </footer>
  );
}