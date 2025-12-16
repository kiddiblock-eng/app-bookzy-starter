// app/(marketing)/blog/layout.js

export const metadata = {
  title: {
    default: "Blog Bookzy - Guides pour créer et vendre des ebooks",
    template: "%s | Blog Bookzy"
  },
  description: "Découvrez nos guides pratiques pour créer, vendre et promouvoir vos ebooks. Stratégies marketing, niches rentables, IA et infoproduits.",
  keywords: "blog ebook, vendre ebook, créer ebook, marketing digital Afrique, infoproduit rentable, business en ligne, niche rentable, générer revenus passifs, ebook IA, tutoriel ebook",
  authors: [{ name: "Équipe Bookzy" }],
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
    url: 'https://www.bookzy.io/blog',
    siteName: 'Bookzy Blog',
    title: "Blog Bookzy - Guides pour créer et vendre des ebooks",
    description: "Guides pratiques, stratégies marketing et conseils pour réussir avec les ebooks et infoproduits.",
    images: [
      {
        url: 'https://www.bookzy.io/images/blog-og.jpg',
        width: 1200,
        height: 630,
        alt: 'Bookzy Blog',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: "Blog Bookzy - Guides pour créer et vendre des ebooks",
    description: "Guides pratiques et stratégies pour réussir avec les ebooks.",
    images: ['https://www.bookzy.io/images/blog-twitter.jpg'],
  },
  alternates: {
    canonical: 'https://www.bookzy.io/blog',
  },
};

export default function BlogLayout({ children }) {
  return (
    <>
      {/* Schema.org Breadcrumb */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BreadcrumbList",
            "itemListElement": [
              {
                "@type": "ListItem",
                "position": 1,
                "name": "Accueil",
                "item": "https://www.bookzy.io"
              },
              {
                "@type": "ListItem",
                "position": 2,
                "name": "Blog",
                "item": "https://www.bookzy.io/blog"
              }
            ]
          })
        }}
      />
      
      {/* Schema.org Blog */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Blog",
            "name": "Blog Bookzy",
            "description": "Guides pratiques pour créer et vendre des ebooks",
            "url": "https://www.bookzy.io/blog",
            "publisher": {
              "@type": "Organization",
              "name": "Bookzy",
              "logo": {
                "@type": "ImageObject",
                "url": "https://www.bookzy.io/logo.png"
              }
            }
          })
        }}
      />
      
      {children}
    </>
  );
}