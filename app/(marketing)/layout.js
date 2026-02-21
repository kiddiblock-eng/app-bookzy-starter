// app/(marketing)/layout.js

import Navbar from '@/app/(marketing)/components/Navbar';
import Footer from '@/app/(marketing)/components/Footer';

export const metadata = {
  metadataBase: new URL('https://www.bookzy.io'),
  
  // ✅ OPTIMISÉ : Titre plus court et impactant (55-60 chars)
  title: {
    default: "Bookzy - Créer un eBook professionnel en 1 minute avec l'IA",
    template: "%s | Bookzy - Générateur eBook Pro"
  },
  
  // ✅ OPTIMISÉ : Description plus action-oriented (150-160 chars)
  description: "Générez votre eBook professionnel en 60 secondes avec l'IA. PDF A4, textes marketing Facebook/WhatsApp, visuels 3D inclus. Essayez gratuitement dès maintenant !",
  
  // ✅ OPTIMISÉ : Keywords ciblés Afrique francophone
  keywords: [
    // Mots-clés principaux
    "créer ebook IA",
    "générateur ebook automatique",
    "ebook professionnel",
    
    // Mots-clés business
    "vendre ebook en ligne",
    "business digital Afrique",
    "infoproduit rentable",
    "gagner argent ebook",
    
    // Mots-clés géo
    "ebook Côte d'Ivoire",
    "ebook Sénégal",
    "ebook Cameroun",
    "business digital francophone",
    
    // Mots-clés techniques
    "PDF professionnel A4",
    "textes marketing IA",
    "mockup 3D ebook",
    "ChatGPT ebook",
  ],
  
  authors: [{ name: "Bookzy", url: "https://www.bookzy.io" }],
  creator: "Bookzy",
  publisher: "Bookzy",
  
  // ✅ AJOUTÉ : Application Name pour iOS/Android
  applicationName: "Bookzy",
  
  // ✅ AJOUTÉ : Référent policy (sécurité)
  referrer: "origin-when-cross-origin",
  
  // ✅ OPTIMISÉ : Robots plus complet
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  
  // ✅ OPTIMISÉ : OpenGraph plus détaillé
  openGraph: {
    type: 'website',
    locale: 'fr_FR',
    url: 'https://www.bookzy.io',
    siteName: 'Bookzy',
    title: "Créer un eBook professionnel en 1 minute avec l'IA - Bookzy",
    description: "Générez automatiquement votre eBook complet : contenu IA, PDF A4 pro, textes marketing Facebook/WhatsApp, mockups 3D. Essai gratuit disponible.",
    images: [
      {
        url: '/images/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bookzy - Générateur eBook IA professionnel',
        type: 'image/jpeg',
      },
    ],
  },
  
  // ✅ OPTIMISÉ : Twitter Card plus complet
  twitter: {
    card: 'summary_large_image',
    site: '@bookzy_io',
    creator: '@bookzy_io',
    title: "Créer un eBook professionnel en 1 minute avec l'IA",
    description: "Générez votre eBook complet en 60 secondes : contenu IA, PDF pro, textes marketing inclus. Essai gratuit.",
    images: {
      url: '/images/twitter-image.jpg',
      alt: 'Bookzy - Générateur eBook IA',
    },
  },
  
  // ✅ AJOUTÉ : App Links (pour partages mobiles)
  appLinks: {
    web: {
      url: 'https://www.bookzy.io',
      should_fallback: true,
    },
  },
  
  alternates: {
    canonical: 'https://www.bookzy.io',
    languages: {
      'fr-FR': 'https://www.bookzy.io',
      'fr-CI': 'https://www.bookzy.io', // Côte d'Ivoire
      'fr-SN': 'https://www.bookzy.io', // Sénégal
      'fr-CM': 'https://www.bookzy.io', // Cameroun
    },
  },
  
  // ✅ AJOUTÉ : Category (aide Google à comprendre votre niche)
  category: 'technology',
  
  // ✅ AJOUTÉ : Classification
  classification: 'Business Tools, AI Tools, Content Creation',
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