// app/(marketing)/suggestions/layout.js
import Script from "next/script";

export const metadata = {
  title: "Suggestions & Roadmap — Bâtissons MARS ensemble | Bookzy",
  description: "Soumettez vos idées de fonctionnalités, votez pour le futur de Bookzy et priorisez la roadmap. La prochaine version MARS se construit avec vous.",
  keywords: [
    "Bookzy roadmap",
    "suggestions fonctionnalités ebook",
    "roadmap ebook IA",
    "voter fonctionnalités Bookzy",
    "plateforme ebook Afrique francophone",
    "générateur ebook IA",
    "Bookzy MARS",
    "idées utilisateurs SaaS",
    "ebook automatique francophone",
    "Bookzy communauté"
  ],
  authors: [{ name: "Bookzy" }],
  creator: "Bookzy",
  publisher: "Bookzy",
  metadataBase: new URL("https://bookzy.io"),
  alternates: { canonical: "/suggestions" },
  openGraph: {
    title: "Suggestions & Roadmap — Bâtissons MARS ensemble | Bookzy",
    description: "Soumettez vos idées, votez pour le futur, priorisez la roadmap. La prochaine version de Bookzy se construit avec vous.",
    url: "https://bookzy.io/suggestions",
    siteName: "Bookzy",
    images: [{ url: "/marspc.png", width: 1200, height: 630, alt: "Bookzy Roadmap — Bâtissons MARS ensemble" }],
    locale: "fr_FR",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Suggestions & Roadmap — Bâtissons MARS ensemble | Bookzy",
    description: "Soumettez vos idées, votez pour le futur de Bookzy. La version MARS se construit avec la communauté.",
    images: ["/marspc.png"],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: { index: true, follow: true, "max-image-preview": "large", "max-snippet": -1 },
  },
};

const jsonLdWebPage = {
  "@context": "https://schema.org",
  "@type": "WebPage",
  "name": "Suggestions & Roadmap Bookzy",
  "description": "Soumettez vos idées de fonctionnalités et votez pour prioriser la roadmap de Bookzy.",
  "url": "https://bookzy.io/suggestions",
  "inLanguage": "fr-FR",
  "publisher": { "@type": "Organization", "name": "Bookzy", "url": "https://bookzy.io" },
  "dateModified": "2026-03-12T00:00:00.000Z",
};

const jsonLdApp = {
  "@context": "https://schema.org",
  "@type": "SoftwareApplication",
  "name": "Bookzy",
  "applicationCategory": "BusinessApplication",
  "operatingSystem": "Web",
  "url": "https://bookzy.io",
  "description": "Plateforme SaaS de génération d'ebooks par IA pour les marchés francophones africains.",
  "inLanguage": "fr-FR",
  "offers": [
    { "@type": "Offer", "name": "Pass Solo",      "price": "0",    "priceCurrency": "XOF" },
    { "@type": "Offer", "name": "Pack Créateur",  "price": "4900", "priceCurrency": "XOF" },
    { "@type": "Offer", "name": "Pack Agence",    "price": "9900", "priceCurrency": "XOF" },
  ],
};

const jsonLdBreadcrumb = {
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    { "@type": "ListItem", "position": 1, "name": "Accueil",             "item": "https://bookzy.io" },
    { "@type": "ListItem", "position": 2, "name": "Suggestions Roadmap", "item": "https://bookzy.io/suggestions" },
  ],
};

export default function SuggestionsLayout({ children }) {
  return (
    <>
      <Script
        id="ld-webpage"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdWebPage) }}
      />
      <Script
        id="ld-app"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdApp) }}
      />
      <Script
        id="ld-breadcrumb"
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLdBreadcrumb) }}
      />
      {children}
    </>
  );
}