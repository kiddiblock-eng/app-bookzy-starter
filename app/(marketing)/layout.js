// app/(marketing)/layout.js

import Navbar from '@/app/(marketing)/components/Navbar';
import Footer from '@/app/(marketing)/components/Footer'; // <-- Ligne 1 : Import du Footer

export const metadata = {
  title: "Bookzy - Créez vos ebooks professionnels en 1 minutes avec l'IA",
  description: "Générez automatiquement votre ebook complet, mockup 3D, visuels marketing et textes de vente.",
};

export default function MarketingLayout({ children }) {
  // Le Footer est maintenant "intelligent", il n'y a plus de logique ici.
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {children}
      </main>
      <Footer /> {/* <-- Ligne 2 : Appel du Footer (il se masquera lui-même) */}
    </>
  );
}