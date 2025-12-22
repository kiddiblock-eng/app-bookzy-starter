// app/(marketing)/tendances/page.js (ou metadata.js)

export const metadata = {
  title: "Tendances eBook 2025 : Niches Rentables & Idées Business | Bookzy",
  description: "Découvrez les 1250+ niches eBook les plus rentables en 2025-2026 : business digital, développement personnel, santé, cuisine. Analyse complète avec volume de recherche et concurrence.",
  
  keywords: [
    "tendances ebook 2025",
    "niches rentables ebook",
    "idées business digital",
    "niche infoproduit",
    "business en ligne Afrique",
    "vendre ebook rentable",
    "meilleure niche 2025",
    "créer ebook succès",
  ],
  
  openGraph: {
    title: "Top 50+ Niches eBook Rentables en 2025-2026 - Bookzy",
    description: "Découvrez les niches eBook les plus rentables : business, développement personnel, santé. Volume de recherche + analyse concurrence inclus.",
    url: "https://www.bookzy.io/tendances",
    type: "article",
    images: [
      {
        url: "/images/tendances-og.jpg",
        width: 1200,
        height: 630,
        alt: "Tendances eBook 2025 - Niches Rentables",
      },
    ],
  },
  
  twitter: {
    card: "summary_large_image",
    title: "Top 50+ Niches eBook Rentables en 2025",
    description: "Analyse complète des niches eBook les plus rentables avec volume de recherche et concurrence.",
    images: ["/images/tendances-twitter.jpg"],
  },
  
  alternates: {
    canonical: "https://www.bookzy.io/tendances",
  },
  
  // ✅ Article Schema
  other: {
    "article:published_time": new Date().toISOString(),
    "article:modified_time": new Date().toISOString(),
    "article:author": "Bookzy",
    "article:section": "Business & Entrepreneurship",
  },
};

// Dans le composant, ajoutez aussi un JSON-LD spécifique
export default function TendancesPage() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Article",
            "headline": "Tendances eBook 2025-2026 : Les 1250+ Niches les Plus Rentables",
            "description": "Analyse complète des niches eBook rentables en 2025 avec volume de recherche et niveau de concurrence.",
            "author": {
              "@type": "Organization",
              "name": "Bookzy"
            },
            "publisher": {
              "@type": "Organization",
              "name": "Bookzy",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.bookzy.io/images/logo.png"
              }
            },
            "datePublished": new Date().toISOString(),
            "dateModified": new Date().toISOString(),
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": "https://www.bookzy.io/tendances"
            }
          })
        }}
      />
      
      {/* Votre contenu existant */}
    </>
  );
}