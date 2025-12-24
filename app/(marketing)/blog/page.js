"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import { Search, Calendar, ArrowRight, BookOpen, TrendingUp, Filter, Clock, Eye } from "lucide-react";
import Link from "next/link";

export default function BlogPage() {
  const [blogs, setBlogs] = useState([]);
  const [filteredBlogs, setFilteredBlogs] = useState([]);
  const [displayedBlogs, setDisplayedBlogs] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(true);
  const observer = useRef();
  const BLOGS_PER_PAGE = 9;

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const res = await fetch("/api/blogs");
        const data = await res.json();
        
        if (data.success) {
          setBlogs(data.blogs);
          setFilteredBlogs(data.blogs);
          setDisplayedBlogs(data.blogs.slice(0, BLOGS_PER_PAGE));
          setHasMore(data.blogs.length > BLOGS_PER_PAGE);
        }
      } catch (error) {
        console.error("Erreur lors du chargement des blogs:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBlogs();
  }, []);

  // Search filter
  useEffect(() => {
    if (searchQuery.trim() === "") {
      setFilteredBlogs(blogs);
      setDisplayedBlogs(blogs.slice(0, BLOGS_PER_PAGE));
      setPage(1);
      setHasMore(blogs.length > BLOGS_PER_PAGE);
    } else {
      const filtered = blogs.filter(
        (blog) =>
          blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
          blog.excerpt.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredBlogs(filtered);
      setDisplayedBlogs(filtered.slice(0, BLOGS_PER_PAGE));
      setPage(1);
      setHasMore(filtered.length > BLOGS_PER_PAGE);
    }
  }, [searchQuery, blogs]);

  // Load more blogs
  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    const startIndex = page * BLOGS_PER_PAGE;
    const endIndex = startIndex + BLOGS_PER_PAGE;
    const newBlogs = filteredBlogs.slice(startIndex, endIndex);
    
    if (newBlogs.length > 0) {
      setDisplayedBlogs(prev => [...prev, ...newBlogs]);
      setPage(nextPage);
      setHasMore(endIndex < filteredBlogs.length);
    } else {
      setHasMore(false);
    }
  }, [page, filteredBlogs]);

  // Intersection Observer for infinite scroll
  const lastBlogRef = useCallback(node => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasMore) {
        loadMore();
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, hasMore, loadMore]);

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric",
      month: "long",
      year: "numeric",
    });
  };

  const getReadTime = (content) => {
    const words = content?.replace(/<[^>]*>/g, '').split(/\s+/).length || 0;
    const minutes = Math.ceil(words / 200);
    return `${minutes} min de lecture`;
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Modern Hero with Visual Elements */}
      <section className="relative bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 text-white overflow-hidden">
        {/* Animated background */}
        <div className="absolute inset-0">
          {/* Gradient orbs */}
          <div className="absolute top-20 left-10 w-72 h-72 bg-blue-500/30 rounded-full blur-[100px] animate-float" />
          <div className="absolute top-40 right-20 w-96 h-96 bg-cyan-500/20 rounded-full blur-[120px] animate-float-delayed" />
          <div className="absolute bottom-20 left-1/3 w-80 h-80 bg-indigo-500/25 rounded-full blur-[110px] animate-pulse-slow" />
          
          {/* Grid pattern */}
          <div className="absolute inset-0 opacity-[0.05]" style={{
            backgroundImage: 'linear-gradient(rgba(59, 130, 246, 0.5) 1px, transparent 1px), linear-gradient(90deg, rgba(59, 130, 246, 0.5) 1px, transparent 1px)',
            backgroundSize: '50px 50px'
          }} />

          {/* Dots pattern */}
          <div className="absolute inset-0 opacity-10">
            {[...Array(30)].map((_, i) => (
              <div
                key={i}
                className="absolute w-1 h-1 bg-blue-400 rounded-full animate-twinkle"
                style={{
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  animationDelay: `${Math.random() * 3}s`
                }}
              />
            ))}
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center py-20 md:py-28">
            
            {/* Left: Content */}
            <div className="text-center lg:text-left">
              {/* Badge */}
              <div className="inline-flex items-center gap-2 bg-blue-500/10 backdrop-blur-sm border border-blue-400/20 px-5 py-2.5 rounded-full mb-8 group hover:bg-blue-500/20 transition-all">
                <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                <span className="font-bold text-sm text-blue-100">Blog Bookzy • Nouvelles ressources</span>
              </div>

              {/* Title */}
              <h1 className="text-5xl sm:text-6xl md:text-7xl lg:text-8xl font-black mb-8 leading-[0.95]">
                <span className="block text-white mb-2">Maîtrise</span>
                <span className="block text-white mb-2">l'art de</span>
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-cyan-400 via-blue-400 to-cyan-400 animate-gradient">
                  l'ebook
                </span>
              </h1>

              {/* Description */}
              <p className="text-xl md:text-2xl text-blue-100 mb-10 leading-relaxed max-w-2xl mx-auto lg:mx-0">
                Guides pratiques, stratégies de vente éprouvées et tendances du marché pour
                <span className="text-cyan-300 font-bold"> maximiser tes revenus</span>
              </p>

              {/* Search bar */}
              <div className="max-w-2xl mx-auto lg:mx-0">
                <div className="bg-white/10 backdrop-blur-md rounded-2xl p-2 border border-white/20 shadow-2xl">
                  <div className="relative">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-6 h-6 text-blue-200" />
                    <input
                      type="text"
                      placeholder="Cherche un guide, une astuce, un tutoriel..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      className="w-full pl-14 pr-4 py-5 rounded-xl bg-white text-gray-900 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-cyan-400 text-lg font-medium shadow-lg"
                    />
                  </div>
                </div>

                {/* Quick stats */}
                <div className="flex flex-wrap items-center justify-center lg:justify-start gap-6 mt-6 text-blue-100">
                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-blue-500/20 border border-blue-400/30 flex items-center justify-center">
                      <TrendingUp className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">{blogs.length}+</div>
                      <div className="text-xs text-blue-200">Articles</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-cyan-500/20 border border-cyan-400/30 flex items-center justify-center">
                      <Eye className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">Quotidien</div>
                      <div className="text-xs text-blue-200">Mis à jour</div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <div className="w-10 h-10 rounded-lg bg-indigo-500/20 border border-indigo-400/30 flex items-center justify-center">
                      <BookOpen className="w-5 h-5 text-cyan-400" />
                    </div>
                    <div>
                      <div className="text-2xl font-black text-white">100%</div>
                      <div className="text-xs text-blue-200">Gratuit</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Right: Visual Illustration */}
            <div className="relative hidden lg:block">
              {/* Main illustration container */}
              <div className="relative">
                {/* Floating cards */}
                <div className="absolute -top-10 -left-10 w-64 h-80 bg-gradient-to-br from-blue-500 to-cyan-500 rounded-3xl shadow-2xl transform rotate-[-5deg] animate-float opacity-90">
                  <div className="p-6 h-full flex flex-col">
                    <div className="w-12 h-12 bg-white/20 rounded-xl mb-4" />
                    <div className="flex-1 space-y-3">
                      <div className="h-4 bg-white/30 rounded-full" />
                      <div className="h-4 bg-white/20 rounded-full w-4/5" />
                      <div className="h-4 bg-white/20 rounded-full w-3/5" />
                    </div>
                    <div className="h-12 bg-white/30 rounded-xl" />
                  </div>
                </div>

                <div className="absolute top-20 right-0 w-56 h-72 bg-gradient-to-br from-indigo-500 to-blue-600 rounded-3xl shadow-2xl transform rotate-[8deg] animate-float-delayed opacity-90">
                  <div className="p-6 h-full flex flex-col">
                    <div className="w-10 h-10 bg-white/20 rounded-lg mb-4" />
                    <div className="flex-1 space-y-3">
                      <div className="h-3 bg-white/30 rounded-full" />
                      <div className="h-3 bg-white/20 rounded-full w-4/5" />
                      <div className="h-3 bg-white/20 rounded-full w-2/3" />
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-10 left-20 w-60 h-76 bg-gradient-to-br from-cyan-500 to-blue-500 rounded-3xl shadow-2xl transform rotate-[3deg] animate-pulse-slow opacity-90">
                  <div className="p-6 h-full flex flex-col">
                    <div className="flex items-center gap-3 mb-4">
                      <div className="w-10 h-10 bg-white/20 rounded-full" />
                      <div className="flex-1 space-y-2">
                        <div className="h-3 bg-white/30 rounded-full" />
                        <div className="h-2 bg-white/20 rounded-full w-2/3" />
                      </div>
                    </div>
                    <div className="flex-1 space-y-3">
                      <div className="h-3 bg-white/20 rounded-full" />
                      <div className="h-3 bg-white/20 rounded-full w-5/6" />
                    </div>
                  </div>
                </div>

                {/* Center glow */}
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-blue-400/30 to-cyan-400/30 rounded-full blur-[100px] animate-pulse-slow" />

                {/* Floating icons */}
                <div className="absolute top-10 left-1/4 w-16 h-16 bg-white/10 backdrop-blur-sm rounded-2xl flex items-center justify-center animate-float border border-white/20">
                  <BookOpen className="w-8 h-8 text-cyan-300" />
                </div>

                <div className="absolute bottom-20 right-10 w-14 h-14 bg-white/10 backdrop-blur-sm rounded-xl flex items-center justify-center animate-float-delayed border border-white/20">
                  <TrendingUp className="w-7 h-7 text-blue-300" />
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom wave */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg viewBox="0 0 1440 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="w-full h-auto">
            <path d="M0 0L60 10C120 20 240 40 360 46.7C480 53 600 47 720 43.3C840 40 960 40 1080 46.7C1200 53 1320 67 1380 73.3L1440 80V120H1380C1320 120 1200 120 1080 120C960 120 840 120 720 120C600 120 480 120 360 120C240 120 120 120 60 120H0V0Z" fill="white"/>
          </svg>
        </div>
      </section>

      {/* Blog Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 md:py-24">
        {loading ? (
          // Loading state
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[...Array(6)].map((_, i) => (
              <div
                key={i}
                className="bg-gray-50 rounded-3xl overflow-hidden animate-pulse"
              >
                <div className="w-full h-56 bg-gray-200" />
                <div className="p-6">
                  <div className="h-4 bg-gray-200 rounded mb-3 w-24" />
                  <div className="h-7 bg-gray-200 rounded mb-3" />
                  <div className="h-4 bg-gray-200 rounded mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-4" />
                  <div className="h-10 bg-gray-200 rounded-full" />
                </div>
              </div>
            ))}
          </div>
        ) : filteredBlogs.length === 0 ? (
          // No results
          <div className="text-center py-20">
            <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-full mb-8">
              <Search className="w-12 h-12 text-blue-600" />
            </div>
            <h3 className="text-3xl font-black text-gray-900 mb-4">
              Aucun article trouvé
            </h3>
            <p className="text-gray-600 text-lg mb-8">
              Essayez avec d'autres mots-clés ou explorez tous nos articles
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="inline-flex items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-all"
            >
              Voir tous les articles
            </button>
          </div>
        ) : (
          <>
            {/* Blog cards */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
              {displayedBlogs.map((blog, index) => (
                <Link
                  key={blog._id}
                  href={`/blog/${blog.slug}`}
                  ref={index === displayedBlogs.length - 1 ? lastBlogRef : null}
                  className="group"
                >
                  <article className="h-full bg-white rounded-3xl border-2 border-gray-100 hover:border-blue-300 hover:shadow-2xl hover:shadow-blue-500/10 transition-all duration-500 overflow-hidden">
                    {/* Cover image */}
                    {blog.cover ? (
                      <div className="relative h-56 overflow-hidden bg-gradient-to-br from-blue-50 to-cyan-50">
                        <img
                          src={blog.cover}
                          alt={blog.title}
                          className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                      </div>
                    ) : (
                      <div className="relative h-56 bg-gradient-to-br from-blue-500 to-cyan-500 flex items-center justify-center">
                        <BookOpen className="w-16 h-16 text-white opacity-50" />
                      </div>
                    )}

                    {/* Content */}
                    <div className="p-6">
                      {/* Meta */}
                      <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-4 h-4" />
                          <span className="font-medium">{formatDate(blog.createdAt)}</span>
                        </div>
                        <div className="flex items-center gap-1.5">
                          <Clock className="w-4 h-4" />
                          <span className="font-medium">{getReadTime(blog.content)}</span>
                        </div>
                      </div>

                      {/* Title */}
                      <h2 className="text-xl font-black text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2 leading-tight">
                        {blog.title}
                      </h2>

                      {/* Excerpt */}
                      <p className="text-gray-600 text-sm leading-relaxed mb-5 line-clamp-3">
                        {blog.excerpt || "Découvrez cet article pour en savoir plus sur ce sujet passionnant..."}
                      </p>

                      {/* Read more button */}
                      <div className="inline-flex items-center gap-2 bg-gradient-to-r from-blue-600 to-cyan-600 text-white px-5 py-2.5 rounded-full font-bold text-sm group-hover:gap-3 group-hover:shadow-lg transition-all">
                        <span>Lire l'article</span>
                        <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                      </div>
                    </div>

                    {/* Bottom accent */}
                    <div className="h-1.5 bg-gradient-to-r from-blue-600 via-cyan-500 to-blue-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  </article>
                </Link>
              ))}
            </div>

            {/* Loading more indicator */}
            {hasMore && (
              <div className="text-center py-8">
                <div className="inline-block w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin" />
                <p className="text-gray-600 mt-4 font-medium">Chargement d'autres articles...</p>
              </div>
            )}

            {/* End message */}
            {!hasMore && displayedBlogs.length > 0 && (
              <div className="text-center py-8">
                <div className="inline-flex items-center gap-2 bg-blue-50 border border-blue-200 px-6 py-3 rounded-full">
                  <span className="text-xl">✓</span>
                  <span className="text-blue-900 font-semibold">
                    Vous avez vu tous les {filteredBlogs.length} articles
                  </span>
                </div>
              </div>
            )}
          </>
        )}
      </section>

      {/* CTA Section */}
      <section className="bg-gradient-to-br from-blue-600 via-blue-700 to-indigo-800 text-white py-20 md:py-28">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 backdrop-blur-sm border border-white/20 px-5 py-2.5 rounded-full mb-8">
            <TrendingUp className="w-5 h-5" />
            <span className="font-bold text-sm">Prêt à passer à l'action ?</span>
          </div>

          <h3 className="text-4xl md:text-5xl lg:text-6xl font-black mb-6 leading-tight">
            Transforme tes idées en
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-blue-200">
              ebooks rentables
            </span>
          </h3>

          <p className="text-xl text-blue-100 mb-10 max-w-3xl mx-auto leading-relaxed">
            Génère ton kit complet en 5 minutes : ebook professionnel + mockup 3D + visuels publicitaires + textes marketing
          </p>

          <Link
            href="/auth/register"
            className="group inline-flex items-center gap-3 bg-white text-blue-600 px-10 py-5 rounded-full font-black text-lg shadow-2xl hover:shadow-white/20 transition-all duration-300 hover:scale-105"
          >
            <BookOpen className="w-6 h-6 group-hover:rotate-12 transition-transform" />
            <span>Créer mon premier ebook</span>
            <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
          </Link>

          <p className="text-blue-200 text-sm mt-6">
            🔥 <span className="font-bold">2000 FCFA</span> seulement pendant 3 mois
          </p>
        </div>
      </section>

      {/* CSS Animations - Moved to global styles */}
    </div>
  );
}