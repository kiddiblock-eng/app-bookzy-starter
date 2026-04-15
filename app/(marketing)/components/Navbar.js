"use client";

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { Menu, X, Target, TrendingUp, Youtube, ChevronDown, Gift, ArrowRight, Book } from 'lucide-react';
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
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
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

  useEffect(() => {
    if (isMobileMenuOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isMobileMenuOpen]);

  const scrollToSection = (sectionId) => {
    const element = document.getElementById(sectionId);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
      setIsMobileMenuOpen(false);
    }
  };

  const EXCLUDE_PATHS = ['/radar-cash', '/blog', '/niche-hunter', '/youbook', '/legal', '/auth', '/dashboard', '/affiliation', '/changelog', '/suggestions','/express', '/smart-shop', '/exemples-ebooks', '/validateur', ];
  if (EXCLUDE_PATHS.some(path => pathname.startsWith(path))) return null;

  return (
    <>
      {/* ══════════════════════════════════════════════════════════════════
          NAVBAR STYLE DOKIE - TRANSPARENTE
      ══════════════════════════════════════════════════════════════════ */}
      <header
        className={`
          fixed top-0 left-0 right-0 z-50
          transition-all duration-300
          ${isScrolled
            ? 'bg-white/80 backdrop-blur-xl shadow-sm'
            : 'bg-transparent'
          }
        `}
        style={{ paddingTop: 'env(safe-area-inset-top, 0px)' }}
      >
        <nav className="max-w-6xl mx-auto px-5 sm:px-6">
          <div className="flex items-center justify-between h-16 lg:h-20">
            
            {/* ─── LOGO ─── */}
            <Link href="/" className="flex items-center gap-2.5">
              <div className="w-8 h-8 lg:w-9 lg:h-9 rounded-lg bg-slate-900 flex items-center justify-center">
                <BookOpenSVG className="w-4 h-4 lg:w-[18px] lg:h-[18px] text-white" />
              </div>
              <span className="text-[15px] lg:text-[17px] font-bold text-slate-900">
                Bookzy
              </span>
            </Link>

            {/* ─── NAVIGATION DESKTOP ─── */}
            <div className="hidden lg:flex items-center gap-1">
              
              <button 
                onClick={() => scrollToSection('features')} 
                className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Fonctionnalités
              </button>
              
              <button 
                onClick={() => scrollToSection('pricing')} 
                className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Tarifs
              </button>
              
              <Link 
                href="/blog" 
                className="px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Blog
              </Link>

              {/* Dropdown Outils */}
              <div className="relative" ref={dropdownRef}>
                <button 
                  onClick={() => setShowTools(!showTools)}
                  className={`
                    flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium transition-colors
                    ${showTools ? 'text-slate-900' : 'text-slate-600 hover:text-slate-900'}
                  `}
                >
                  Outils 
                  <ChevronDown size={14} className={`transition-transform duration-200 ${showTools ? 'rotate-180' : ''}`} />
                </button>

                {/* Dropdown */}
                <div className={`
                  absolute top-full left-1/2 -translate-x-1/2 mt-2 w-52 
                  bg-white border border-slate-200 rounded-xl p-1.5
                  shadow-xl shadow-slate-900/10
                  transition-all duration-200 origin-top
                  ${showTools 
                    ? 'opacity-100 scale-100' 
                    : 'opacity-0 scale-95 pointer-events-none'
                  }
                `}>
                  <Link 
                    href="/niche-hunter" 
                    onClick={() => setShowTools(false)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Target size={16} className="text-pink-500" />
                    <span className="text-[13px] font-medium text-slate-700">Niche Hunter</span>
                  </Link>
                   <Link 
                    href="/express" 
                    onClick={() => setShowTools(false)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Book size={16} className="text-pink-500" />
                    <span className="text-[13px] font-medium text-slate-700">Ebook Designer</span>
                  </Link>
                  <Link 
                    href="/youbook" 
                    onClick={() => setShowTools(false)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Youtube size={16} className="text-red-500" />
                    <span className="text-[13px] font-medium text-slate-700">Youbook</span>
                  </Link>
                  
                  <Link 
                    href="/validateur" 
                    onClick={() => setShowTools(false)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <TrendingUp size={16} className="text-orange-500" />
                    <span className="text-[13px] font-medium text-slate-700">Validateur</span>
                  </Link>
                </div>
              </div>

              {/* Affiliation */}
              <Link 
                href="/affiliation" 
                className="flex items-center gap-1.5 px-4 py-2 text-[14px] font-medium text-emerald-600 hover:text-emerald-700 transition-colors"
              >
                <Gift size={15} />
                Affiliation
              </Link>
            </div>

            {/* ─── ACTIONS DROITE ─── */}
            <div className="flex items-center gap-3">
              
              <Link 
                href="/auth/login" 
                className="hidden lg:block px-4 py-2 text-[14px] font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                Connexion
              </Link>
              
              <Link 
                href="/auth/register" 
                className="
                  inline-flex items-center gap-1.5 
                  px-5 py-2.5
                  text-[13px] sm:text-[14px] font-semibold text-white 
                  bg-slate-900 hover:bg-slate-800
                  rounded-full
                  transition-all duration-200
                  active:scale-[0.98]
                "
              >
                Commencer
              </Link>

              {/* Toggle Mobile */}
              <button 
                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
                className="lg:hidden p-2 text-slate-700 hover:text-slate-900 transition-colors"
              >
                {isMobileMenuOpen ? <X size={22} /> : <Menu size={22} />}
              </button>
            </div>
          </div>
        </nav>
      </header>

      {/* ══════════════════════════════════════════════════════════════════
          MENU MOBILE FULLSCREEN
      ══════════════════════════════════════════════════════════════════ */}
      <div className={`
        fixed inset-0 z-40 bg-white
        transition-all duration-300 lg:hidden
        ${isMobileMenuOpen 
          ? 'opacity-100 pointer-events-auto' 
          : 'opacity-0 pointer-events-none'
        }
      `}>
        <div className={`
          flex flex-col h-full pb-8 px-6 overflow-y-auto
          transition-transform duration-300
          ${isMobileMenuOpen ? 'translate-y-0' : '-translate-y-4'}
        `}
        style={{ paddingTop: 'calc(env(safe-area-inset-top, 0px) + 80px)' }}>
          
          {/* Navigation Links */}
          <div className="flex flex-col">
            <button 
              onClick={() => scrollToSection('features')} 
              className="py-4 text-left text-[16px] font-medium text-slate-900 border-b border-slate-100"
            >
              Fonctionnalités
            </button>
            
            <button 
              onClick={() => scrollToSection('pricing')} 
              className="py-4 text-left text-[16px] font-medium text-slate-900 border-b border-slate-100"
            >
              Tarifs
            </button>
            
            <Link 
              href="/blog" 
              onClick={() => setIsMobileMenuOpen(false)} 
              className="py-4 text-left text-[16px] font-medium text-slate-900 border-b border-slate-100"
            >
              Blog
            </Link>

            {/* Outils Section */}
            <div className="py-5 border-b border-slate-100">
              <div className="text-[11px] font-semibold text-slate-400 uppercase tracking-wider mb-3">Outils gratuits</div>
              <div className="flex flex-col gap-2">
                <Link 
                  href="/niche-hunter" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 active:bg-slate-100"
                >
                  <Target size={18} className="text-pink-500" />
                  <span className="text-[14px] font-medium text-slate-700">Niche Hunter</span>
                </Link>
                 <Link 
                    href="/express" 
                    onClick={() => setShowTools(false)}
                    className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-slate-50 transition-colors"
                  >
                    <Book size={16} className="text-pink-500" />
                    <span className="text-[13px] font-medium text-slate-700">Ebook Designer</span>
                  </Link>
                
                <Link 
                  href="/youbook" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 active:bg-slate-100"
                >
                  <Youtube size={18} className="text-red-500" />
                  <span className="text-[14px] font-medium text-slate-700">Youbook</span>
                </Link>
                
                <Link 
                  href="/validateur" 
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="flex items-center gap-3 p-3 rounded-xl bg-slate-50 active:bg-slate-100"
                >
                  <TrendingUp size={18} className="text-orange-500" />
                  <span className="text-[14px] font-medium text-slate-700">Validateur</span>
                </Link>
              </div>
            </div>

            {/* Affiliation */}
            <Link 
              href="/affiliation" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="py-4 flex items-center gap-2.5 text-[16px] font-medium text-emerald-600"
            >
              <Gift size={18} />
              Programme Affiliation
            </Link>
          </div>

          {/* CTA Buttons - Fixed at bottom */}
          <div className="flex flex-col gap-3 mt-auto pt-6">
            <Link 
              href="/auth/login" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3.5 text-center text-[14px] font-medium text-slate-600 border border-slate-200 rounded-full active:bg-slate-50"
            >
              Connexion
            </Link>
            
            <Link 
              href="/auth/register" 
              onClick={() => setIsMobileMenuOpen(false)}
              className="w-full py-3.5 text-center text-[14px] font-semibold text-white bg-slate-900 rounded-full active:bg-slate-800"
            >
              Commencer gratuitement
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}