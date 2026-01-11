import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog";

export default async function sitemap() {
  const baseUrl = 'https://www.bookzy.io';
  const currentDate = new Date().toISOString();

  let blogPosts = [];
  try {
    await dbConnect();
    
    // CORRECTION ICI : J'ai enlevé { published: true }
    const blogs = await Blog.find({})
      .select('slug updatedAt createdAt')
      .lean()
      .exec();
    
    blogPosts = blogs.map(blog => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      // Utilise updatedAt s'il existe (timestamps: true), sinon createdAt
      lastModified: blog.updatedAt || blog.createdAt || currentDate,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Erreur sitemap blog:', error);
  }

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
    // ... tes autres pages statiques (auth, legal, etc.) ...
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
    // On ajoute tes articles dynamiques ici
    ...blogPosts,
  ];
}