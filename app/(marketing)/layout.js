// app/(marketing)/layout.js

import Navbar from './components/Navbar';
import Footer from './components/Footer';

export const metadata = {
  title: "Bookzy - Créez vos ebooks professionnels en 5 minutes avec l'IA",
  description: "Générez automatiquement votre ebook complet, mockup 3D, visuels marketing et textes de vente.",
};

export default function MarketingLayout({ children }) {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-white">
        {children}
      </main>
      <Footer />
    </>
  );
}