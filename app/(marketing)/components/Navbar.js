"use client";

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { Menu, X, Target, TrendingUp } from 'lucide-react';
import { usePathname } from 'next/navigation'; // <-- AJOUTÉ

/* --- LOGO OFFICIEL (Style Login) --- */
function BookOpenSVG(props) {
  return (
      <svg 
          {...props}
          viewBox="0 0 24 24" 
          fill="none" 
          stroke="currentColor" 
          strokeWidth="2.5" 
          strokeLinecap="round" 
          strokeLinejoin="round"
      >
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const pathname = usePathname(); // <-- AJOUTÉ : Récupère la route actuelle

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const offset = 80;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;

      window.scrollTo({
        top: offsetPosition,
        behavior: "smooth"
      });
      setIsMobileMenuOpen(false);
    }
  };

  const menuItems = [
    { label: 'Fonctionnalités', href: 'features' },
    { label: 'Comment ça marche', href: 'howitWorks' },
    { label: 'Exemples', href: 'examples' },
    { label: 'Tarifs', href: 'pricing' },
    { label: 'Blog', href: '/blog', isLink: true },
  ];

  // ====================================================================
  // LOGIQUE D'EXCLUSION (La solution à ton problème)
  // ====================================================================
  const EXCLUDE_PATHS = [
    '/tendances',
    '/blog',
    '/niche-hunter',
    '/legal', // Inclut toutes les pages sous /legal
    '/auth', // Exclut la page de connexion/inscription
    '/dashboard', // Exclut le dashboard (même si le middleware le gère déjà)
  ];

  // On vérifie si la route actuelle commence par un des chemins exclus
  const isExcluded = EXCLUDE_PATHS.some(path => pathname.startsWith(path));

  if (isExcluded) {
    // Si l'utilisateur est sur une page exclue, on ne retourne rien.
    return null;
  }
  // ====================================================================


  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-3'
            : 'bg-transparent py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          <div className="flex items-center justify-between">
            
            {/* --- LOGO --- */}
            <Link href="/" className="flex items-center gap-2.5 group" onClick={() => setIsMobileMenuOpen(false)}>
              <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 transition-transform group-hover:scale-105">
                <BookOpenSVG className="w-4 h-4 text-white" />
              </div>
              <span className="text-xl font-extrabold tracking-tight text-slate-900">
                Bookzy
              </span>
            </Link>

            {/* --- MENU DESKTOP --- */}
            <div className="hidden xl:flex items-center gap-8">
              {/* Liens ancres */}
              <div className="flex items-center gap-6">
                {menuItems.map((item) => (
                  item.isLink ? (
                    <Link
                      key={item.label}
                      href={item.href}
                      className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {item.label}
                    </Link>
                  ) : (
                    <button
                      key={item.label}
                      onClick={() => scrollToSection(item.href)}
                      className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors"
                    >
                      {item.label}
                    </button>
                  )
                ))}
              </div>

              {/* Séparateur */}
              <div className="h-4 w-px bg-slate-200"></div>

              {/* Outils Gratuits */}
              <div className="flex items-center gap-4">
                <Link 
                  href="/niche-hunter" 
                  className="text-sm font-bold text-slate-900 flex items-center gap-1.5 hover:text-pink-600 transition-colors"
                >
                  <Target className="w-4 h-4 text-pink-500" />
                  Niche Hunter
                </Link>

                <Link 
                  href="/tendances" 
                  className="text-sm font-bold text-slate-900 flex items-center gap-1.5 hover:text-orange-600 transition-colors"
                >
                  <TrendingUp className="w-4 h-4 text-orange-500" />
                  Tendances
                </Link>
              </div>
            </div>

            {/* --- BOUTONS D'ACTION (Desktop) --- */}
            <div className="hidden md:flex items-center gap-3">
              <Link
                href="/auth/login"
                className="px-4 py-2 text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors"
              >
                Connexion
              </Link>
              
              <Link
                href="/auth/register"
                className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg shadow-slate-900/20 transition-all duration-300 active:scale-95"
              >
                Commencer
              </Link>
            </div>

            {/* --- BOUTON MENU MOBILE --- */}
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="xl:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg transition-colors"
              aria-label="Menu"
            >
              {isMobileMenuOpen ? (
                <X className="w-6 h-6" />
              ) : (
                <Menu className="w-6 h-6" />
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* --- MENU MOBILE (OVERLAY) --- */}
      <div
        className={`fixed inset-0 z-40 bg-white transition-transform duration-300 xl:hidden ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
        style={{ top: '0', paddingTop: '80px' }}
      >
        <div className="flex flex-col p-6 gap-6 h-full overflow-y-auto">
          
          <div className="flex flex-col">
            {menuItems.map((item) => (
              item.isLink ? (
                <Link
                  key={item.label}
                  href={item.href}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-lg font-bold text-slate-900 py-4 border-b border-slate-100 text-left"
                >
                  {item.label}
                </Link>
              ) : (
                <button
                  key={item.label}
                  onClick={() => scrollToSection(item.href)}
                  className="text-lg font-bold text-slate-900 py-4 border-b border-slate-100 text-left"
                >
                  {item.label}
              </button>
              )
            ))}
            
            {/* Outils Mobile */}
            <div className="mt-6 space-y-3">
                <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">Outils Gratuits</p>
                
                <Link
                    href="/niche-hunter"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-pink-50 text-pink-900 font-bold border border-pink-100"
                >
                    <Target className="w-5 h-5 text-pink-600" />
                    Niche Hunter
                </Link>

                <Link
                    href="/tendances"
                    onClick={() => setIsMobileMenuOpen(false)}
                    className="flex items-center gap-3 p-3 rounded-xl bg-orange-50 text-orange-900 font-bold border border-orange-100"
                >
                    <TrendingUp className="w-5 h-5 text-orange-600" />
                    Tendances
                </Link>
            </div>
          </div>

          <div className="mt-auto flex flex-col gap-3 pb-8">
            <Link
              href="/auth/login"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full px-5 py-4 text-center text-base font-bold text-slate-700 border-2 border-slate-100 rounded-xl"
            >
              Se connecter
            </Link>
            <Link
              href="/auth/register"
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full px-5 py-4 text-center text-base font-bold text-white rounded-xl bg-slate-900 shadow-lg"
            >
              Créer mon compte
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}