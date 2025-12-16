// app/(marketing)/components/SchemaOrg.jsx
"use client";

export default function SchemaOrg() {
  const schema = {
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "Bookzy",
    "applicationCategory": "BusinessApplication",
    "operatingSystem": "Web",
    "offers": {
      "@type": "Offer",
      "price": "2000",
      "priceCurrency": "XOF",
      "availability": "https://schema.org/InStock"
    },
    "aggregateRating": {
      "@type": "AggregateRating",
      "ratingValue": "4.9",
      "ratingCount": "2450"
    },
    "description": "Générateur automatique d'ebook avec IA. Créez votre ebook professionnel, PDF design et textes marketing en 60 secondes.",
    "url": "https://www.bookzy.io",
    "author": {
      "@type": "Organization",
      "name": "Bookzy",
      "url": "https://www.bookzy.io"
    },
    "publisher": {
      "@type": "Organization",
      "name": "Bookzy",
      "logo": {
        "@type": "ImageObject",
        "url": "https://www.bookzy.io/logo.png"
      }
    }
  };

  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
    />
  );
}