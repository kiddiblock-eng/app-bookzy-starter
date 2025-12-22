// app/(marketing)/components/JsonLd.js

export default function JsonLd() {
  const schemaOrg = {
    "@context": "https://schema.org",
    "@graph": [
      // 1. Organization
      {
        "@type": "Organization",
        "@id": "https://www.bookzy.io/#organization",
        "name": "Bookzy",
        "url": "https://www.bookzy.io",
        "logo": {
          "@type": "ImageObject",
          "url": "https://www.bookzy.io/images/logo.png",
          "width": 512,
          "height": 512
        },
        "sameAs": [
          "https://twitter.com/bookzy_io",
          "https://facebook.com/bookzy",
          "https://linkedin.com/company/bookzy"
        ]
      },
      
      // 2. WebSite
      {
        "@type": "WebSite",
        "@id": "https://www.bookzy.io/#website",
        "url": "https://www.bookzy.io",
        "name": "Bookzy",
        "publisher": {
          "@id": "https://www.bookzy.io/#organization"
        },
        "potentialAction": {
          "@type": "SearchAction",
          "target": "https://www.bookzy.io/search?q={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      
      // 3. WebPage
      {
        "@type": "WebPage",
        "@id": "https://www.bookzy.io/#webpage",
        "url": "https://www.bookzy.io",
        "name": "Créer un eBook professionnel en 1 minute avec l'IA - Bookzy",
        "isPartOf": {
          "@id": "https://www.bookzy.io/#website"
        },
        "about": {
          "@id": "https://www.bookzy.io/#organization"
        },
        "description": "Créez votre eBook professionnel en 60 secondes avec l'IA. PDF A4, textes marketing, visuels 3D inclus."
      },
      
      // 4. SoftwareApplication
      {
        "@type": "SoftwareApplication",
        "name": "Bookzy",
        "operatingSystem": "Web",
        "applicationCategory": "BusinessApplication",
        "offers": {
          "@type": "Offer",
          "price": "2000",
          "priceCurrency": "XOF",
          "availability": "https://schema.org/InStock"
        },
        "aggregateRating": {
          "@type": "AggregateRating",
          "ratingValue": "4.9",
          "ratingCount": "234",
          "bestRating": "5",
          "worstRating": "1"
        }
      },
      
      // 5. FAQPage (si vous avez une FAQ)
      {
        "@type": "FAQPage",
        "mainEntity": [
          {
            "@type": "Question",
            "name": "Comment créer un eBook avec Bookzy ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Choisissez votre niche, l'IA génère le contenu en 60 secondes, téléchargez votre PDF A4 professionnel avec textes marketing inclus."
            }
          },
          {
            "@type": "Question",
            "name": "Combien coûte Bookzy ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "2000 FCFA par eBook complet incluant PDF, mockups 3D et textes marketing Facebook/WhatsApp."
            }
          },
          {
            "@type": "Question",
            "name": "Puis-je essayer Bookzy gratuitement ?",
            "acceptedAnswer": {
              "@type": "Answer",
              "text": "Oui, créez votre premier eBook gratuitement pour tester la qualité de l'IA et du rendu PDF professionnel."
            }
          }
        ]
      }
    ]
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaOrg) }}
    />
  );
}