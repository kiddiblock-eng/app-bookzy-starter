// app/sitemap.js

import { dbConnect } from "@/lib/db";
import Blog from "@/models/Blog"; // Assure-toi que le chemin est correct

export default async function sitemap() {
  const baseUrl = 'https://www.bookzy.io';
  const currentDate = new Date().toISOString();

  // Récupérer tous les articles de blog directement depuis MongoDB
  let blogPosts = [];
  try {
    await dbConnect();
    const blogs = await Blog.find({ published: true })
      .select('slug updatedAt createdAt')
      .lean()
      .exec();
    
    blogPosts = blogs.map(blog => ({
      url: `${baseUrl}/blog/${blog.slug}`,
      lastModified: blog.updatedAt || blog.createdAt,
      changeFrequency: 'monthly',
      priority: 0.7,
    }));
  } catch (error) {
    console.error('Erreur sitemap blog:', error);
    // Continue sans les articles de blog
  }

  return [
    // Pages statiques
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
    // Articles de blog (dynamiques)
    ...blogPosts,
  ];
}