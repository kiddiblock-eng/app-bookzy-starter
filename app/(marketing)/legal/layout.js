// app/(legal)/layout.jsx

import Link from "next/link";

export default function LegalLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50">
      
      {/* NAVBAR SIMPLIFIÉE (partagée par toutes les pages légales) */}
      <header className="bg-white border-b border-gray-200 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2">
            <img src="/images/logo.svg" alt="Bookzy" className="h-8" />
          </Link>

          {/* Navigation légale */}
          <nav className="hidden md:flex items-center gap-4 text-sm">
            <Link href="/legal/confidentialite" className="text-gray-600 hover:text-purple-600 transition-colors">
              Confidentialité
            </Link>
            <Link href="/legal/terms" className="text-gray-600 hover:text-purple-600 transition-colors">
              UGC
            </Link>
            <Link href="/legal/refund" className="text-gray-600 hover:text-purple-600 transition-colors">
              Remboursement
            </Link>
            <Link href="/legal/cookies" className="text-gray-600 hover:text-purple-600 transition-colors">
              Cookies
            </Link>
          </nav>

          {/* Retour */}
          <Link 
            href="/"
            className="text-purple-600 hover:text-purple-700 font-semibold text-sm"
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
            <Link href="/legal/confidentialite" className="hover:text-purple-600">Confidentialité</Link>
            <span>•</span>
            <Link href="/legal/terms" className="hover:text-purple-600">UGC</Link>
            <span>•</span>
            <Link href="/legal/refund" className="hover:text-purple-600">Remboursement</Link>
            <span>•</span>
            <Link href="/legal/cookies" className="hover:text-purple-600">Cookies</Link>
          </div>
        </div>
      </footer>

    </div>
  );
}
