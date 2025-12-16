// app/(marketing)/layout.js

import Navbar from '@/app/(marketing)/components/Navbar';
import Footer from '@/app/(marketing)/components/Footer';

export const metadata = {
  metadataBase: new URL('https://www.bookzy.io'),
  title: "Bookzy - Créez vos ebooks professionnels en 1 minute avec l'IA",
  description: "Générez automatiquement votre ebook complet en 60 secondes : contenu rédigé par IA, PDF professionnel A4, textes marketing Facebook/WhatsApp inclus. 2000 FCFA seulement.",
  keywords: "ebook gratuit, créer ebook IA, générateur ebook automatique, vendre ebook en ligne, ebook Afrique, business digital, infoproduit, marketing digital, eBook PDF professionnel, génération contenu IA",
  authors: [{ name: "Bookzy" }],
  creator: "Bookzy",
  publisher: "Bookzy",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.bookzy.io',
    siteName: 'Bookzy',
    title: "Bookzy - Créez vos ebooks professionnels en 1 minute avec l'IA",
    description: "Générez automatiquement votre ebook complet en 60 secondes : contenu rédigé par IA, PDF professionnel A4, textes marketing inclus.",
    images: [
      {
        url: '/images/og-image.jpg', // Chemin relatif avec metadataBase
        width: 1200,
        height: 630,
        alt: 'Bookzy - Générateur eBook IA',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Bookzy - Créez vos ebooks professionnels en 1 minute avec l'IA",
    description: "Générez automatiquement votre ebook complet en 60 secondes avec l'IA.",
    images: ['/images/twitter-image.jpg'], // Chemin relatif
    creator: '@bookzy_io', // Optionnel : ton handle Twitter
  },
  alternates: {
    canonical: 'https://www.bookzy.io',
  },
  // ✅ PLUS BESOIN - Vérifié par DNS
  // verification: {
  //   google: '...',
  // },
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