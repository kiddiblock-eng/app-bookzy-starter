// app/(marketing)/tendances/layout.js

export const metadata = {
  title: "Tendances Ebooks IA 2025 : Niches Rentables & Idées Business | Bookzy",
  description: "Découvrez les niches ebooks les plus rentables du moment. Créez un ebook avec l'IA en 60 secondes, vendez-le en ligne. Bookzy — la plateforme IA #1 pour créer et vendre des ebooks en Afrique.",

  keywords: [
    // Ebook général
    "créer ebook IA",
    "générer ebook automatique",
    "ebook intelligence artificielle",
    "faire un ebook en ligne",
    "créer ebook gratuit",
    "logiciel création ebook",
    // Vendre
    "vendre ebook en ligne",
    "vendre ebook Afrique",
    "gagner argent ebook",
    "business ebook rentable",
    // Niches
    "tendances ebook 2025",
    "niches rentables ebook",
    "idées business digital",
    "niche infoproduit rentable",
    "meilleure niche 2025",
    // Afrique
    "business en ligne Afrique",
    "gagner argent internet Afrique",
    "infoproduit Côte d'Ivoire",
    "business digital Sénégal",
    // IA
    "IA rédaction ebook",
    "ChatGPT ebook",
    "intelligence artificielle contenu",
    "automatiser création contenu",
    // Bookzy
    "Bookzy",
    "plateforme ebook IA",
    "créer ebook professionnel",
  ],

  openGraph: {
    title: "Créez & Vendez des Ebooks avec l'IA en 60s — Bookzy Tendances",
    description: "Découvrez les niches ebooks qui cartonnent en ce moment. Générez votre ebook avec l'IA, obtenez un design pro et vendez instantanément.",
    url: "https://www.bookzy.io/tendances",
    type: "website",
    siteName: "Bookzy",
    images: [
      {
        url: "https://www.bookzy.io/tendances.png",
        width: 1200,
        height: 630,
        alt: "Bookzy — Créer et vendre des ebooks avec l'IA",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Tendances Ebooks IA 2025 — Bookzy",
    description: "Niches rentables du moment + créez votre ebook avec l'IA en 60 secondes.",
    images: ["https://www.bookzy.io/tendances.png"],
    creator: "@bookzy_io",
  },

  alternates: {
    canonical: "https://www.bookzy.io/tendances",
  },

  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
    },
  },
};

export default function TendancesLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebPage",
            "name": "Tendances Ebooks IA 2025 — Bookzy",
            "description": "Découvrez les niches ebooks rentables du moment et créez votre ebook avec l'IA en 60 secondes.",
            "url": "https://www.bookzy.io/tendances",
            "author": {
              "@type": "Organization",
              "name": "Bookzy",
              "url": "https://www.bookzy.io",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.bookzy.io/images/logo.png"
              },
              "sameAs": [
                "https://twitter.com/bookzy_io",
                "https://www.instagram.com/bookzy.io"
              ]
            },
            "publisher": {
              "@type": "Organization",
              "name": "Bookzy",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.bookzy.io/images/logo.png"
              }
            },
            "datePublished": "2025-01-01T00:00:00Z",
            "dateModified": new Date().toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.bookzy.io/tendances"
            },
            "about": {
              "@type": "Thing",
              "name": "Création d'ebooks avec intelligence artificielle",
              "description": "Plateforme SaaS permettant de créer des ebooks professionnels avec l'IA en moins de 60 secondes"
            },
            "offers": {
              "@type": "Offer",
              "description": "Créez votre premier ebook gratuitement avec 4 crédits offerts",
              "price": "0",
              "priceCurrency": "XOF",
              "url": "https://www.bookzy.io/auth/register"
            }
          })
        }}
      />
      {children}
    </>
  );
}