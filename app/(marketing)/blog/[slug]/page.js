"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import { Calendar, ArrowLeft, Share2, Sparkles } from "lucide-react";
import Link from "next/link";

export default function BlogArticlePage() {
  const params = useParams();
  const [blog, setBlog] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(false);

  useEffect(() => {
    const fetchBlog = async () => {
      if (!params?.slug) return;

      try {
        const res = await fetch(`/api/blogs/${params.slug}`);
        const data = await res.json();

        if (data.success) {
          setBlog(data.blog);
          
          // Mise à jour dynamique des meta tags
          if (typeof window !== 'undefined') {
            document.title = data.blog.seoTitle || data.blog.title;
            
            // Meta description
            let metaDesc = document.querySelector('meta[name="description"]');
            if (!metaDesc) {
              metaDesc = document.createElement('meta');
              metaDesc.name = 'description';
              document.head.appendChild(metaDesc);
            }
            metaDesc.content = data.blog.seoDescription || data.blog.excerpt;
            
            // Meta keywords
            let metaKeywords = document.querySelector('meta[name="keywords"]');
            if (!metaKeywords) {
              metaKeywords = document.createElement('meta');
              metaKeywords.name = 'keywords';
              document.head.appendChild(metaKeywords);
            }
            metaKeywords.content = data.blog.seoKeywords || '';
            
            // Open Graph title
            let ogTitle = document.querySelector('meta[property="og:title"]');
            if (!ogTitle) {
              ogTitle = document.createElement('meta');
              ogTitle.setAttribute('property', 'og:title');
              document.head.appendChild(ogTitle);
            }
            ogTitle.content = data.blog.seoTitle || data.blog.title;
            
            // Open Graph description
            let ogDesc = document.querySelector('meta[property="og:description"]');
            if (!ogDesc) {
              ogDesc = document.createElement('meta');
              ogDesc.setAttribute('property', 'og:description');
              document.head.appendChild(ogDesc);
            }
            ogDesc.content = data.blog.seoDescription || data.blog.excerpt;
            
            // Open Graph image
            if (data.blog.cover) {
              let ogImage = document.querySelector('meta[property="og:image"]');
              if (!ogImage) {
                ogImage = document.createElement('meta');
                ogImage.setAttribute('property', 'og:image');
                document.head.appendChild(ogImage);
              }
              ogImage.content = data.blog.cover;
            }
          }
        } else {
          setError(true);
        }
      } catch (err) {
        console.error("Erreur:", err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    fetchBlog();
  }, [params?.slug]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: blog.title,
          url: window.location.href,
        });
      } catch (err) {
        console.log("Partage annulé");
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      alert("Lien copié !");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="inline-block w-16 h-16 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mb-4" />
          <p className="text-gray-600 font-medium">Chargement...</p>
        </div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center px-4">
        <div className="text-center max-w-md">
          <div className="text-6xl mb-6">😕</div>
          <h1 className="text-3xl font-black text-gray-900 mb-4">
            Article introuvable
          </h1>
          <p className="text-gray-600 mb-8">
            Cet article n'existe pas ou a été supprimé.
          </p>
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-all"
          >
            <ArrowLeft className="w-5 h-5" />
            Retour au blog
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      {/* Header avec hero bleu */}
      <div className="bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-blue-300 hover:text-blue-200 mb-8 transition-colors"
          >
            <ArrowLeft className="w-5 h-5" />
            <span className="font-semibold">Retour au blog</span>
          </Link>

          <h1 className="text-4xl sm:text-5xl md:text-6xl font-black mb-6 leading-tight">
            {blog.title}
          </h1>

          {blog.excerpt && (
            <p className="text-xl text-blue-100 mb-8 leading-relaxed">
              {blog.excerpt}
            </p>
          )}

          <div className="flex flex-wrap items-center gap-6 text-blue-200">
            <div className="flex items-center gap-2">
              <Calendar className="w-5 h-5" />
              <span className="font-medium">{formatDate(blog.createdAt)}</span>
            </div>
            <button
              onClick={handleShare}
              className="flex items-center gap-2 hover:text-blue-100 transition-colors"
            >
              <Share2 className="w-5 h-5" />
              <span className="font-medium">Partager</span>
            </button>
          </div>
        </div>
      </div>

      {/* Cover Image */}
      {blog.cover && (
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 -mt-12 mb-12">
          <div className="rounded-3xl overflow-hidden shadow-2xl">
            <img
              src={blog.cover}
              alt={blog.title}
              className="w-full h-auto"
            />
          </div>
        </div>
      )}

      {/* Article Content */}
      <article className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div
          className="article-content"
          dangerouslySetInnerHTML={{ __html: blog.content }}
        />
      </article>

      {/* CTA */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl md:text-4xl font-black mb-6">
            Prêt à créer ton ebook ?
          </h3>
          <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Génère ton kit complet en 5 minutes avec Bookzy
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-3 bg-white text-blue-600 px-8 py-4 rounded-full font-black text-lg hover:bg-blue-50 transition-all shadow-xl"
          >
            <Sparkles className="w-6 h-6" />
            Commencer maintenant
          </Link>
        </div>
      </section>

      {/* Back to blog */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-16 text-center">
        <Link
          href="/blog"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 font-semibold transition-colors"
        >
          <ArrowLeft className="w-5 h-5" />
          Voir tous les articles
        </Link>
      </div>

      {/* Custom CSS Premium pour le contenu */}
      <style jsx global>{`
        .article-content {
          font-size: 19px;
          line-height: 1.85;
          color: #1f2937;
        }

        /* H2 - GRADIENT BLEU MAJEUR */
        .article-content h2 {
          font-size: 2.5rem;
          font-weight: 900;
          background: linear-gradient(135deg, #2563eb 0%, #06b6d4 100%);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          background-clip: text;
          margin-top: 4rem;
          margin-bottom: 2rem;
          line-height: 1.2;
          position: relative;
          padding-bottom: 1rem;
        }

        .article-content h2::after {
          content: '';
          position: absolute;
          bottom: 0;
          left: 0;
          width: 80px;
          height: 4px;
          background: linear-gradient(90deg, #2563eb, #06b6d4);
          border-radius: 2px;
        }

        /* H3 - BLEU SOLIDE */
        .article-content h3 {
          font-size: 1.75rem;
          font-weight: 800;
          color: #1e40af;
          margin-top: 3rem;
          margin-bottom: 1.25rem;
          line-height: 1.3;
        }

        /* PARAGRAPHES */
        .article-content p {
          margin-bottom: 1.75rem;
          color: #374151;
          line-height: 1.85;
        }

        /* STRONG - BLEU FONCÉ */
        .article-content strong {
          font-weight: 800;
          color: #1e3a8a;
        }

        /* LISTES */
        .article-content ul,
        .article-content ol {
          margin: 2rem 0;
          padding-left: 0;
          list-style: none;
        }

        .article-content ul li,
        .article-content ol li {
          margin-bottom: 1rem;
          color: #374151;
          padding-left: 2rem;
          position: relative;
          line-height: 1.75;
        }

        /* PUCES CUSTOM BLEUES */
        .article-content ul li::before {
          content: '✓';
          position: absolute;
          left: 0;
          top: 0;
          width: 24px;
          height: 24px;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 900;
        }

        /* NUMÉROS CUSTOM BLEUS */
        .article-content ol {
          counter-reset: item;
        }

        .article-content ol li {
          counter-increment: item;
        }

        .article-content ol li::before {
          content: counter(item);
          position: absolute;
          left: 0;
          top: 0;
          width: 28px;
          height: 28px;
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
          color: white;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          font-size: 14px;
          font-weight: 900;
        }

        /* LIENS */
        .article-content a {
          color: #2563eb;
          font-weight: 700;
          text-decoration: none;
          border-bottom: 2px solid transparent;
          transition: border-color 0.3s;
        }

        .article-content a:hover {
          border-bottom-color: #2563eb;
        }

        /* BLOCKQUOTE - STYLE PREMIUM */
        .article-content blockquote {
          position: relative;
          margin: 3rem 0;
          padding: 2rem 2rem 2rem 3rem;
          background: linear-gradient(135deg, #eff6ff 0%, #dbeafe 100%);
          border-left: 5px solid #3b82f6;
          border-radius: 1rem;
          font-style: italic;
          color: #1e40af;
          font-size: 1.1rem;
          box-shadow: 0 4px 6px rgba(37, 99, 235, 0.1);
        }

        .article-content blockquote::before {
          content: '"';
          position: absolute;
          top: 1rem;
          left: 1rem;
          font-size: 3rem;
          color: #3b82f6;
          opacity: 0.3;
          font-family: Georgia, serif;
        }

        /* TABLEAUX PREMIUM */
        .article-content table {
          width: 100%;
          margin: 3rem 0;
          border-collapse: separate;
          border-spacing: 0;
          border-radius: 1rem;
          overflow: hidden;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.05);
          display: block;
          overflow-x: auto;
          -webkit-overflow-scrolling: touch;
        }

        /* Wrapper pour scroll sur mobile */
        @media (max-width: 768px) {
          .article-content table {
            font-size: 0.85rem;
          }
          
          .article-content th,
          .article-content td {
            padding: 0.75rem 1rem;
            white-space: nowrap;
          }
        }

        .article-content thead {
          background: linear-gradient(135deg, #3b82f6, #06b6d4);
        }

        .article-content th {
          padding: 1.25rem 1.5rem;
          text-align: left;
          font-weight: 900;
          color: white;
          font-size: 0.95rem;
          text-transform: uppercase;
          letter-spacing: 0.5px;
          border: none;
        }

        .article-content td {
          padding: 1.25rem 1.5rem;
          border-bottom: 1px solid #e5e7eb;
          background: white;
        }

        .article-content tbody tr:hover {
          background: #f9fafb;
        }

        .article-content tbody tr:last-child td {
          border-bottom: none;
        }

        /* IMAGES */
        .article-content img {
          border-radius: 1.5rem;
          box-shadow: 0 20px 50px rgba(0, 0, 0, 0.15);
          margin: 3rem 0;
          width: 100%;
          height: auto;
        }

        /* CODE INLINE */
        .article-content code {
          background: linear-gradient(135deg, #eff6ff, #dbeafe);
          color: #1e40af;
          padding: 0.35rem 0.65rem;
          border-radius: 0.5rem;
          font-family: 'Courier New', monospace;
          font-size: 0.9em;
          font-weight: 600;
          border: 1px solid #bfdbfe;
        }

        /* PREMIER PARAGRAPHE AGRANDI */
        .article-content > p:first-of-type {
          font-size: 1.25rem;
          font-weight: 500;
          color: #1f2937;
          line-height: 1.8;
        }

        /* SÉPARATEUR VISUEL AVANT H2 */
        .article-content h2:not(:first-child) {
          padding-top: 2rem;
          border-top: 1px solid #e5e7eb;
        }
      `}</style>
    </div>
  );
}