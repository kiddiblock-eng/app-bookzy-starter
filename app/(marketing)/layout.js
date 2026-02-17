// app/(marketing)/layout.js
import Navbar from '@/app/(marketing)/components/Navbar';
import Footer from '@/app/(marketing)/components/Footer';
import ReferralLinkHandler from './ReferralLinkHandler'; // ✅ NOUVEAU

export const metadata = {
  metadataBase: new URL('https://www.bookzy.io'),
  
  title: {
    default: "Bookzy - Créer un eBook professionnel en 1 minute avec l'IA",
    template: "%s | Bookzy - Générateur eBook Pro"
  },
  
  description: "Générez votre eBook professionnel en 60 secondes avec l'IA. PDF A4, textes marketing Facebook/WhatsApp, visuels 3D inclus. Essayez gratuitement dès maintenant !",
  
  keywords: [
    "créer ebook IA",
    "générateur ebook automatique",
    "ebook professionnel",
    "vendre ebook en ligne",
    "business digital Afrique",
    "infoproduit rentable",
    "gagner argent ebook",
    "ebook Côte d'Ivoire",
    "ebook Sénégal",
    "ebook Cameroun",
    "business digital francophone",
    "PDF professionnel A4",
    "textes marketing IA",
    "mockup 3D ebook",
    "ChatGPT ebook",
  ],
  
  authors: [{ name: "Bookzy", url: "https://www.bookzy.io" }],
  creator: "Bookzy",
  publisher: "Bookzy",
  applicationName: "Bookzy",
  referrer: "origin-when-cross-origin",
  
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
      'fr-CI': 'https://www.bookzy.io',
      'fr-SN': 'https://www.bookzy.io',
      'fr-CM': 'https://www.bookzy.io',
    },
  },
  
  category: 'technology',
  classification: 'Business Tools, AI Tools, Content Creation',
};

export default function MarketingLayout({ children }) {
  return (
    <>
      <ReferralLinkHandler /> {/* ✅ NOUVEAU : Composant client séparé */}
      <Navbar />
      <main className="min-h-screen bg-white">
        {children}
      </main>
      <Footer />
    </>
  );
}