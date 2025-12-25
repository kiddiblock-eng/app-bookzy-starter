"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Target, TrendingUp, Youtube, ChevronDown } from 'lucide-react';
import { usePathname } from 'next/navigation';

/* --- LOGO ORIGINAL --- */
function BookOpenSVG(props) {
  return (
      <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
          <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
          <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
      </svg>
  );
}

export default function Navbar() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showTools, setShowTools] = useState(false);
  const dropdownRef = useRef(null);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 10);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    const handleClickOutside = (e) => {
        if (dropdownRef.current && !dropdownRef.current.contains(e.target)) setShowTools(false);
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 80, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const EXCLUDE_PATHS = ['/tendances', '/blog', '/niche-hunter', '/youbook', '/legal', '/auth', '/dashboard'];
  if (EXCLUDE_PATHS.some(path => pathname.startsWith(path))) return null;

  return (
    <>
      <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? 'bg-white/80 backdrop-blur-xl border-b border-slate-100 py-3' : 'bg-transparent py-5'}`}>
        <div className="max-w-7xl mx-auto px-6 lg:px-8">
          
          <div className="flex items-center justify-between xl:grid xl:grid-cols-3">
            
            {/* --- 1. GAUCHE : LOGO --- */}
            <div className="flex justify-start items-center">
              <Link href="/" className="flex items-center gap-2.5 group">
                <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20">
                  <BookOpenSVG className="w-4 h-4 text-white" />
                </div>
                <span className="text-xl font-extrabold tracking-tight text-slate-900 whitespace-nowrap">Bookzy</span>
              </Link>
            </div>

            {/* --- 2. CENTRE : NAVIGATION (EXEMPLES AJOUTÉ) --- */}
            <div className="hidden xl:flex items-center justify-center gap-7 whitespace-nowrap">
              <button onClick={() => scrollToSection('features')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center">Fonctionnalités</button>
              <button onClick={() => scrollToSection('howitWorks')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center">Comment ça marche</button>
              {/* ✅ EXEMPLES RÉ-AJOUTÉ ICI */}
              <button onClick={() => scrollToSection('examples')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center">Exemples</button>
              <button onClick={() => scrollToSection('pricing')} className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center">Tarifs</button>
              <Link href="/blog" className="text-sm font-semibold text-slate-600 hover:text-slate-900 transition-colors flex items-center">Blog</Link>
              
              <div className="relative flex items-center" ref={dropdownRef}>
                <button 
                    onClick={() => setShowTools(!showTools)}
                    className={`flex items-center gap-1.5 text-sm font-bold transition-all ${showTools ? 'text-indigo-600' : 'text-slate-900 hover:text-indigo-600'}`}
                >
                    Outils Gratuits <ChevronDown size={14} className={`transition-transform duration-200 ${showTools ? 'rotate-180' : ''}`} />
                </button>

                {showTools && (
                    <div className="absolute top-full left-0 mt-6 w-56 bg-white border border-slate-100 shadow-xl rounded-xl p-2 animate-in fade-in slide-in-from-top-2">
                        <Link href="/niche-hunter" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700">
                            <Target size={16} className="text-pink-500" /> Niche Hunter
                        </Link>
                        <Link href="/youbook" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700">
                            <Youtube size={16} className="text-red-500" /> Youbook
                        </Link>
                        <Link href="/tendances" className="flex items-center gap-3 p-3 hover:bg-slate-50 rounded-lg text-sm font-bold text-slate-700">
                            <TrendingUp size={16} className="text-orange-500" /> Tendances
                        </Link>
                    </div>
                )}
              </div>
            </div>

            {/* --- 3. DROITE : ACTIONS --- */}
            <div className="hidden xl:flex items-center justify-end gap-5">
              <Link href="/auth/login" className="text-sm font-bold text-slate-700 hover:text-slate-900 transition-colors whitespace-nowrap">Connexion</Link>
              <Link href="/auth/register" className="px-5 py-2.5 text-sm font-bold text-white bg-slate-900 hover:bg-slate-800 rounded-lg shadow-lg transition-all active:scale-95 whitespace-nowrap">Commencer</Link>
            </div>

            <div className="xl:hidden flex items-center">
              <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="p-2 text-slate-700">
                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
              </button>
            </div>
          </div>
        </div>
      </nav>

      {/* --- MENU MOBILE (EXEMPLES AJOUTÉ AUSSI) --- */}
      <div className={`fixed inset-0 z-40 bg-white transition-transform duration-300 xl:hidden ${isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'}`} style={{ paddingTop: '80px' }}>
        <div className="flex flex-col p-6 gap-2 h-full overflow-y-auto">
          <button onClick={() => scrollToSection('features')} className="text-lg font-bold text-slate-900 py-4 border-b border-slate-100 text-left">Fonctionnalités</button>
          <button onClick={() => scrollToSection('howitWorks')} className="text-lg font-bold text-slate-900 py-4 border-b border-slate-100 text-left">Comment ça marche</button>
          {/* ✅ AJOUTÉ SUR MOBILE */}
          <button onClick={() => scrollToSection('examples')} className="text-lg font-bold text-slate-900 py-4 border-b border-slate-100 text-left">Exemples</button>
          <button onClick={() => scrollToSection('pricing')} className="text-lg font-bold text-slate-900 py-4 border-b border-slate-100 text-left">Tarifs</button>
          <Link href="/blog" className="text-lg font-bold text-slate-900 py-4 border-b border-slate-100">Blog</Link>
          
          <div className="py-4">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-4">Outils Gratuits</p>
            <div className="grid grid-cols-1 gap-2">
                <Link href="/niche-hunter" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100"><Target size={20} className="text-pink-500" /> Niche Hunter</Link>
                <Link href="/youbook" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100"><Youtube size={20} className="text-red-500" /> Youbook</Link>
                <Link href="/tendances" onClick={() => setIsMobileMenuOpen(false)} className="flex items-center gap-3 p-4 bg-slate-50 rounded-xl font-bold text-slate-900 border border-slate-100"><TrendingUp size={20} className="text-orange-500" /> Tendances</Link>
            </div>
          </div>
          <div className="mt-auto flex flex-col gap-3 pb-8">
            <Link href="/auth/login" className="w-full px-5 py-4 text-center font-bold text-slate-700 border-2 border-slate-100 rounded-xl">Connexion</Link>
            <Link href="/auth/register" className="w-full px-5 py-4 text-center font-bold text-white bg-slate-900 rounded-xl shadow-lg">Créer mon compte</Link>
          </div>
        </div>
      </div>
    </>
  );
}