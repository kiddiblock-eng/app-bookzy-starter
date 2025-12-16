// app/(marketing)/blog/[slug]/page.js

import { notFound } from 'next/navigation';
import BlogArticleClient from './BlogArticleClient';

// Fonction pour récupérer l'article
async function getBlog(slug) {
  try {
    const baseUrl = process.env.NEXT_PUBLIC_URL || 'https://www.bookzy.io';
    const res = await fetch(`${baseUrl}/api/blogs/${slug}`, {
      next: { revalidate: 60 } // Revalidation toutes les 60 secondes
    });
    
    if (!res.ok) return null;
    
    const data = await res.json();
    return data.success ? data.blog : null;
  } catch (error) {
    console.error('Erreur fetch blog:', error);
    return null;
  }
}

// METADATA DYNAMIQUES (CRUCIAL POUR SEO)
export async function generateMetadata({ params }) {
  const blog = await getBlog(params.slug);
  
  if (!blog) {
    return {
      title: 'Article non trouvé',
      description: 'Cet article n\'existe pas ou a été supprimé.',
    };
  }

  const url = `https://www.bookzy.io/blog/${params.slug}`;
  const imageUrl = blog.cover || 'https://www.bookzy.io/images/blog-default.jpg';

  return {
    title: blog.seoTitle || blog.title,
    description: blog.seoDescription || blog.excerpt || blog.title,
    keywords: blog.seoKeywords || '',
    authors: [{ name: "Équipe Bookzy" }],
    creator: "Bookzy",
    publisher: "Bookzy",
    openGraph: {
      type: 'article',
      locale: 'fr_FR',
      url: url,
      siteName: 'Bookzy Blog',
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt || blog.title,
      publishedTime: blog.createdAt,
      modifiedTime: blog.updatedAt || blog.createdAt,
      authors: ["Équipe Bookzy"],
      images: [
        {
          url: imageUrl,
          width: 1200,
          height: 630,
          alt: blog.title,
        },
      ],
    },
    twitter: {
      card: 'summary_large_image',
      title: blog.seoTitle || blog.title,
      description: blog.seoDescription || blog.excerpt || blog.title,
      images: [imageUrl],
    },
    alternates: {
      canonical: url,
    },
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
  };
}

// PAGE SERVEUR
export default async function BlogArticlePage({ params }) {
  const blog = await getBlog(params.slug);

  if (!blog) {
    notFound();
  }

  // Calculer le temps de lecture
  const getReadTime = (content) => {
    const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    return Math.ceil(words / 200);
  };

  const readTime = getReadTime(blog.content);

  return (
    <>
      {/* Schema.org Article (CRUCIAL POUR GOOGLE) */}
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "BlogPosting",
            "headline": blog.title,
            "description": blog.excerpt || blog.title,
            "image": blog.cover || "https://www.bookzy.io/images/blog-default.jpg",
            "datePublished": blog.createdAt,
            "dateModified": blog.updatedAt || blog.createdAt,
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
            },
            "mainEntityOfPage": {
              "@type": "WebPage",
              "@id": `https://www.bookzy.io/blog/${params.slug}`
            },
            "timeRequired": `PT${readTime}M`,
            "wordCount": blog.content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0,
            "articleBody": blog.content?.replace(/<[^>]*>/g, '').substring(0, 500) + '...'
          })
        }}
      />

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
              },
              {
                "@type": "ListItem",
                "position": 3,
                "name": blog.title,
                "item": `https://www.bookzy.io/blog/${params.slug}`
              }
            ]
          })
        }}
      />

      {/* Composant Client */}
      <BlogArticleClient blog={blog} readTime={readTime} />
    </>
  );
}