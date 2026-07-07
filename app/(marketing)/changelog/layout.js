export const metadata = {
  title: "Changelog Bookzy — Mises à jour & Nouvelles fonctionnalités | V1.1 VENUS",
  description: "Découvrez toutes les mises à jour de Bookzy : nouvelles fonctionnalités, améliorations et corrections. Version actuelle V1.1 VENUS — Système de crédits, Youbook, Affiliation 10%, Smart Shop.",

  keywords: [
    "bookzy mise a jour",
    "bookzy changelog",
    "bookzy nouvelles fonctionnalités",
    "bookzy version",
    "générateur ebook ia afrique",
    "bookzy venus",
    "bookzy crédits",
    "youbook youtube ebook",
    "affiliation ebook afrique",
    "niche hunter mise a jour",
  ],

  openGraph: {
    title: "Changelog Bookzy — V1.1 VENUS est disponible",
    description: "Système de crédits, Youbook, Affiliation 10% dynamique, Smart Shop, Tendances refondues. Découvrez tout ce qui a changé dans Bookzy V1.1 VENUS.",
    url: "https://www.bookzy.io/changelog",
    type: "website",
    images: [
      {
        url: "/planets/Venuspc.png",
        width: 1200,
        height: 630,
        alt: "Bookzy V1.1 VENUS — Nouvelle mise à jour",
      },
    ],
  },

  twitter: {
    card: "summary_large_image",
    title: "Bookzy V1.1 VENUS est disponible",
    description: "Système de crédits, Youbook, Affiliation 10%, Smart Shop. Tout ce qui a changé dans cette mise à jour.",
    images: ["/planets/Venuspc.png"],
  },

  alternates: {
    canonical: "https://www.bookzy.io/changelog",
  },

  robots: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
  },
};

export default function ChangelogLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify([
            {
              "@context": "https://schema.org",
              "@type": "WebPage",
              "name": "Changelog Bookzy — Mises à jour",
              "description": "Historique complet des mises à jour de la plateforme Bookzy. Nouvelles fonctionnalités, améliorations et corrections par version.",
              "url": "https://www.bookzy.io/changelog",
              "publisher": {
                "@type": "Organization",
                "name": "Bookzy",
                "url": "https://www.bookzy.io",
                "logo": {
                  "@type": "ImageObject",
                  "url": "https://www.bookzy.io/logo.png",
                },
              },
              "dateModified": new Date().toISOString(),
              "inLanguage": "fr-FR",
            },
            {
              "@context": "https://schema.org",
              "@type": "SoftwareApplication",
              "name": "Bookzy",
              "applicationCategory": "BusinessApplication",
              "operatingSystem": "Web",
              "url": "https://www.bookzy.io",
              "softwareVersion": "1.1",
              "releaseNotes": "https://www.bookzy.io/changelog/venus",
              "description": "Plateforme SaaS de génération d'ebooks par IA pour les marchés francophones africains.",
              "offers": [
                {
                  "@type": "Offer",
                  "name": "Gratuit",
                  "price": "0",
                  "priceCurrency": "XOF",
                  "description": "Aperçu gratuit à l'inscription",
                },
                {
                  "@type": "Offer",
                  "name": "Pass Solo",
                  "price": "5100",
                  "priceCurrency": "XOF",
                  "description": "60 crédits par mois",
                },
                {
                  "@type": "Offer",
                  "name": "Pack Créateur",
                  "price": "19125",
                  "priceCurrency": "XOF",
                  "description": "330 crédits par mois",
                },
                {
                  "@type": "Offer",
                  "name": "Pack Agence",
                  "price": "31500",
                  "priceCurrency": "XOF",
                  "description": "700 crédits par mois",
                },
              ],
            },
            {
              "@context": "https://schema.org",
              "@type": "BreadcrumbList",
              "itemListElement": [
                {
                  "@type": "ListItem",
                  "position": 1,
                  "name": "Bookzy",
                  "item": "https://www.bookzy.io",
                },
                {
                  "@type": "ListItem",
                  "position": 2,
                  "name": "Changelog",
                  "item": "https://www.bookzy.io/changelog",
                },
              ],
            },
          ]),
        }}
      />
      {children}
    </>
  );
}