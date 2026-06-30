export const dynamic = 'force-dynamic';
import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";
import { ALL_TOPICS } from "@/lib/seoTopics";
import { getAllGuideSlugs } from "@/lib/guides";
import { getAllNicheSlugs } from "@/lib/niches";

export default async function sitemap() {
  const baseUrl = 'https://www.bookzy.io';
  const currentDate = new Date().toISOString();

  let blogPosts = [];
  
  try {
    console.log("🔄 Tentative de connexion DB pour le Sitemap...");
    await dbConnect();
    
    // On récupère TOUS les blogs (pas de filtre)
    const blogs = await Blog.find({})
      .select('slug updatedAt createdAt')
      .lean()
      .exec();
    
    console.log(`✅ Blogs trouvés dans la DB : ${blogs.length}`);

    blogPosts = blogs.map(blog => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.createdAt || currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));

  } catch (error) {
    console.error('❌ ERREUR CRITIQUE SITEMAP :', error);
  }

  // Voici la liste COMPLÈTE avec les pages légales remises
  return [
    {
      url: baseUrl,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 1,
    },
    {
      url: `${baseUrl}/niche-hunter`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.9,
    },
    {
      url: `${baseUrl}/tendances`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/blog`,
      lastModified: currentDate,
      changeFrequency: 'daily',
      priority: 0.8,
    },
    {
      url: `${baseUrl}/auth/register`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    },
    {
      url: `${baseUrl}/auth/login`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.5,
    },
    // --- LES PAGES LÉGALES SONT ICI ---
    {
      url: `${baseUrl}/legal/terms`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/confidentialite`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    {
      url: `${baseUrl}/legal/refund`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.3,
    },
    // --- HUB SEO + 300+ PAGES SUJETS ---
    {
      url: `${baseUrl}/creer-un-ebook`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...ALL_TOPICS.map((t) => ({
      url: `${baseUrl}/creer-un-ebook/${t.slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
    // --- GUIDES LONG-FORM ---
    {
      url: `${baseUrl}/guides`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.8,
    },
    ...getAllGuideSlugs().map((slug) => ({
      url: `${baseUrl}/guides/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    })),
    // --- MARCHÉ DES EBOOKS (data-driven) ---
    ...(getAllNicheSlugs().length > 0 ? [{
      url: `${baseUrl}/marche-ebook`,
      lastModified: currentDate,
      changeFrequency: 'weekly',
      priority: 0.7,
    }] : []),
    ...getAllNicheSlugs().map((slug) => ({
      url: `${baseUrl}/marche-ebook/${slug}`,
      lastModified: currentDate,
      changeFrequency: 'monthly',
      priority: 0.6,
    })),
    // --- LES BLOGS DYNAMIQUES ---
    ...blogPosts,
  ];
}