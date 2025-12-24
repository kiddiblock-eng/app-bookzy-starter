export const metadata = {
  title: "Niche Hunter : Trouvez Votre idée d'eBook Rentable en 3 Clics | Bookzy",
  description: "Analyseur de niche gratuit : trouvez instantanément les idées d'eBooks rentables avec volume de recherche, concurrence et potentiel de revenus. Outil 100% gratuit.",
  
  keywords: [
    "trouver niche rentable",
    "analyseur niche gratuit",
    "idées business digital",
    "niche hunter ebook",
    "analyser concurrence niche",
    "business en ligne rentable",
    "outil recherche niche",
    "meilleure niche infoproduit",
  ],
  
  openGraph: {
    title: "Niche Hunter : Trouvez Votre idée eBook Rentable Instantanément",
    description: "Analyseur gratuit de niches eBook : volume de recherche, concurrence, potentiel de revenus. Trouvez votre niche en 3 clics.",
    url: "https://www.bookzy.io/niche-hunter",
    type: "website",
    images: [
      {
        url: "/images/niche-hunter-og.jpg",
        width: 1200,
        height: 630,
        alt: "Niche Hunter - Analyseur de Niches Gratuit",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Niche Hunter : Trouvez Votre idée Rentable en 3 Clics",
    description: "Analyseur gratuit de niches eBook avec volume, concurrence et potentiel de revenus.",
    images: ["/images/niche-hunter-twitter.jpg"],
  },
  
  alternates: {
    canonical: "https://www.bookzy.io/niche-hunter",
  },
};

export default function NicheHunterLayout({ children }) {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "WebApplication",
            "name": "Niche Hunter by Bookzy",
            "description": "Analyseur gratuit de niches eBook rentables avec volume de recherche, niveau de concurrence et estimation de revenus.",
            "url": "https://www.bookzy.io/niche-hunter",
            "applicationCategory": "BusinessApplication",
            "operatingSystem": "Web",
            "offers": {
              "@type": "Offer",
              "price": "0",
              "priceCurrency": "XOF"
            },
            "featureList": [
              "Analyse de volume de recherche",
              "Niveau de concurrence",
              "Estimation de revenus",
              "Suggestions de niches",
              "Export PDF des résultats"
            ],
            "screenshot": "https://www.bookzy.io/images/niche-hunter-screenshot.jpg"
          })
        }}
      />
      
      {children}
    </>
  );
}