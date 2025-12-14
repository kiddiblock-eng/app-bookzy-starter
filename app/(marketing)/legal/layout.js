// app/(legal)/layout.jsx

import Link from "next/link";

export default function LegalLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* NAVBAR SIMPLIFIÉE (partagée par toutes les pages légales) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Logo noir */}
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-9 h-9 rounded-lg bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 transition-transform group-hover:scale-105">
              <svg className="w-4 h-4 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
                <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
                <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
              </svg>
            </div>
            <span className="text-xl font-extrabold tracking-tight text-slate-900">
              Bookzy
            </span>
          </Link>

          {/* Navigation légale */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/legal/confidentialite" className="text-gray-600 hover:text-slate-900 transition-colors font-semibold">
              Confidentialité
            </Link>
            <Link href="/legal/terms" className="text-gray-600 hover:text-slate-900 transition-colors font-semibold">
              CGU
            </Link>
            <Link href="/legal/refund" className="text-gray-600 hover:text-slate-900 transition-colors font-semibold">
              Remboursement
            </Link>
            <Link href="/legal/cookies" className="text-gray-600 hover:text-slate-900 transition-colors font-semibold">
              Cookies
            </Link>
          </nav>

          {/* Retour */}
          <Link 
            href="/"
            className="text-slate-900 hover:text-slate-700 font-bold text-sm transition-colors"
          >
            ← Retour
          </Link>
        </div>
      </header>

      {/* CONTENU (différent pour chaque page) */}
      <main>
        {children}
      </main>

      {/* FOOTER SIMPLIFIÉ (partagé par toutes les pages légales) */}
      <footer className="bg-white border-t border-gray-200 py-8 mt-16">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <p className="text-sm text-gray-600 mb-3">
            © 2024 Bookzy. Tous droits réservés.
          </p>
          <div className="flex items-center justify-center gap-4 text-xs text-gray-500">
            <Link href="/legal/confidentialite" className="hover:text-slate-900 font-medium">Confidentialité</Link>
            <span>•</span>
            <Link href="/legal/terms" className="hover:text-slate-900 font-medium">CGU</Link>
            <span>•</span>
            <Link href="/legal/refund" className="hover:text-slate-900 font-medium">Remboursement</Link>
            <span>•</span>
            <Link href="/legal/cookies" className="hover:text-slate-900 font-medium">Cookies</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}