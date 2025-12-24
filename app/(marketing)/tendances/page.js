"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowRight, Eye, Database, TrendingUp, Zap, Filter, 
  Sparkles, Target, Users, Globe, Check, Star, Play,
  ChevronRight, BarChart3, Clock, DollarSign, Flame,
  ShoppingBag, Menu, X, CheckCircle2, Search, Lock
} from "lucide-react";

/* ============================================
   NAVBAR PREMIUM - Style Stripe
   ============================================ */
function NavbarTendances() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const navLinks = [
    { name: "Base de données", href: "#database" },
    { name: "Comment ça marche", href: "#workflow" },
    { name: "Témoignages", href: "#success" },
    { name: "Tarifs", href: "#pricing" }
  ];

  const handleScroll = (e, href) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.querySelector(href);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.pageYOffset - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled 
        ? "bg-white/80 backdrop-blur-xl border-b border-slate-200 shadow-sm" 
        : "bg-transparent"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 flex items-center justify-center shadow-lg group-hover:shadow-indigo-500/25 transition-all">
              <Database className="w-5 h-5 text-white" />
            </div>
            <div className="flex flex-col">
              <span className="text-xl font-bold text-slate-900">Bookzy</span>
              <span className="text-[10px] font-semibold text-indigo-600 uppercase tracking-wider">Tendances</span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a
                key={link.name}
                href={link.href}
                onClick={(e) => handleScroll(e, link.href)}
                className="text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          {/* CTA */}
          <div className="hidden md:flex items-center gap-4">
            <Link 
              href="/auth/login"
              className="text-sm font-medium text-slate-600 hover:text-slate-900 px-4 py-2"
            >
              Connexion
            </Link>
            <Link
              href="/auth/register"
              className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-6 py-2.5 rounded-full font-medium text-sm shadow-lg shadow-indigo-500/25 transition-all hover:shadow-xl hover:shadow-indigo-500/40"
            >
              Voir la base
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>

          {/* Mobile Menu Button */}
          <button
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            className="md:hidden p-2 text-slate-600 hover:text-slate-900"
          >
            {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="lg:hidden py-6 border-t border-slate-200 bg-white/95 backdrop-blur-xl">
            <div className="flex flex-col gap-4">
              {navLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  onClick={(e) => handleScroll(e, link.href)}
                  className="text-base font-medium text-slate-600 hover:text-slate-900 py-2"
                >
                  {link.name}
                </a>
              ))}
              <Link
                href="/auth/register"
                className="flex items-center justify-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 text-white px-6 py-3 rounded-full font-medium mt-4 shadow-lg"
              >
                Voir la base
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* ============================================
   HERO SECTION - Style Stripe Premium
   ============================================ */
function HeroSection() {
  return (
    <section className="relative pt-32 sm:pt-40 pb-20 sm:pb-32 overflow-hidden bg-gradient-to-b from-slate-50 to-white">
      
      {/* Background Grid */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#e2e8f0_1px,transparent_1px),linear-gradient(to_bottom,#e2e8f0_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_110%)]" />
      
      {/* Gradient Orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-indigo-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob" />
      <div className="absolute top-0 right-1/4 w-96 h-96 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000" />

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-4xl mx-auto">
          
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-8">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
            <span className="text-sm font-medium text-slate-700">31 000+ ebooks trackés en temps réel</span>
          </div>

          {/* Headline */}
          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tighter mb-8 leading-[0.95]">
            Le <span className="text-transparent bg-clip-text bg-gradient-to-r from-orange-600 to-red-600">Minea</span> des <br/>
            Produits Digitaux.
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 max-w-3xl mx-auto mb-12 leading-relaxed font-medium">
            Arrêtez de deviner. Espionnez les 31 000+ ebooks qui génèrent du cash en ce moment même. Copiez, créez, encaissez.
          </p>

          {/* CTA Buttons */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
            <Link
              href="/auth/register"
              className="group flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl shadow-indigo-500/25 transition-all hover:shadow-2xl hover:shadow-indigo-500/40 hover:scale-105"
            >
              Accéder à la base
              <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
            </Link>
            <a
              href="#workflow"
              className="group flex items-center gap-2 px-8 py-4 rounded-full font-semibold text-lg text-slate-700 hover:text-slate-900 border-2 border-slate-200 hover:border-slate-300 transition-all"
            >
              <Play className="w-5 h-5" />
              Comment ça marche
            </a>
          </div>

          {/* Live Stats */}
          <div className="grid grid-cols-3 gap-6 sm:gap-12 max-w-3xl mx-auto">
            {[
              { value: "31K+", label: "Ebooks trackés", icon: Database },
              { value: "8.0K", label: "Ultra-HOT", icon: Flame },
              { value: "2.9K+", label: "En hausse", icon: TrendingUp }
            ].map((stat, i) => {
              const Icon = stat.icon;
              return (
                <div key={i} className="group">
                  <Icon className="w-8 h-8 mx-auto mb-3 text-indigo-600 group-hover:scale-110 transition-transform" />
                  <div className="text-3xl sm:text-4xl font-bold text-slate-900 mb-1">{stat.value}</div>
                  <div className="text-sm font-medium text-slate-600">{stat.label}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   WORKFLOW VISUEL - LE COMBO GAGNANT
   ============================================ */
function WorkflowSection() {
  return (
    <section id="workflow" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 border border-indigo-200 mb-6">
            <Zap className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-indigo-900">Le combo parfait</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Trouve l'idée qui marche.
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              Crée l'ebook en 1 min.
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            Plus besoin de passer des heures. Tendances trouve, notre IA crée.
          </p>
        </div>

        {/* Workflow Steps */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Left - Step 1 */}
          <div>
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                1
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Espionne sur Tendances</h3>
            </div>
            <p className="text-lg text-slate-600 mb-6">
              Trouve un ebook qui explose : <strong className="text-slate-900">847 ventes, 8 470€ de revenus.</strong> Tu sais exactement ce qui marche.
            </p>
            <div className="space-y-3">
              {[
                "Volume de recherche : 41K/mois",
                "Croissance : +83% cette semaine",
                "Difficulté : Facile",
                "Concurrence : Faible"
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-indigo-600" />
                  <span className="text-slate-700">{item}</span>
                </div>
              ))}
            </div>
          </div>

          {/* Right - Screenshot Tendances */}
          <div className="relative group">
            <div className="absolute -inset-4 bg-gradient-to-r from-indigo-500 to-purple-500 rounded-3xl opacity-20 group-hover:opacity-30 blur-2xl transition-opacity" />
            <div className="relative bg-white rounded-2xl border-2 border-slate-200 shadow-2xl overflow-hidden">
              <img 
                src="/images/tendance.png" 
                alt="Interface Tendances - Ebooks qui cartonnent"
                className="w-full h-auto"
              />
              <div className="absolute top-4 right-4 px-3 py-1.5 bg-green-500 text-white rounded-full font-bold text-xs flex items-center gap-1.5 shadow-lg">
                <div className="w-2 h-2 bg-white rounded-full animate-pulse" />
                EN DIRECT
              </div>
            </div>
          </div>
        </div>

        {/* Step 2 */}
        <div className="grid md:grid-cols-2 gap-12 items-center mb-20">
          
          {/* Left - Mockup Générateur */}
          <div className="relative group order-2 md:order-1">
            <div className="absolute -inset-4 bg-gradient-to-r from-purple-500 to-pink-500 rounded-3xl opacity-20 group-hover:opacity-30 blur-2xl transition-opacity" />
            <div className="relative">
              {/* MacBook Mockup */}
              <div className="bg-slate-900 rounded-t-2xl pt-3 pb-1 px-4">
                <div className="flex items-center gap-2 mb-3">
                  <div className="w-3 h-3 rounded-full bg-red-500" />
                  <div className="w-3 h-3 rounded-full bg-yellow-500" />
                  <div className="w-3 h-3 rounded-full bg-green-500" />
                </div>
              </div>
              <div className="bg-white border-2 border-slate-900 rounded-b-2xl p-8 shadow-2xl">
                {/* Mini Preview */}
                <div className="space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-indigo-500 to-purple-500 flex items-center justify-center">
                      <Sparkles className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-slate-900">Générateur IA</div>
                      <div className="text-xs text-slate-500">Design professionnel inclus</div>
                    </div>
                  </div>
                  
                  <div className="bg-slate-50 rounded-xl p-4 border border-slate-200">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm font-semibold text-slate-700">Génération en cours...</span>
                      <span className="text-xs font-bold text-indigo-600">57 sec</span>
                    </div>
                    <div className="w-full bg-slate-200 rounded-full h-2 overflow-hidden">
                      <div className="bg-gradient-to-r from-indigo-600 to-purple-600 h-full rounded-full animate-progress" style={{width: '85%'}} />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-2">
                    {["PDF A4", "50 pages", "Textes vente"].map((item, i) => (
                      <div key={i} className="bg-green-50 border border-green-200 rounded-lg p-2 text-center">
                        <CheckCircle2 className="w-4 h-4 text-green-600 mx-auto mb-1" />
                        <div className="text-xs font-semibold text-green-900">{item}</div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right - Step 2 */}
          <div className="order-1 md:order-2">
            <div className="inline-flex items-center gap-3 mb-6">
              <div className="w-12 h-12 rounded-full bg-gradient-to-br from-purple-600 to-pink-600 flex items-center justify-center text-white font-bold text-xl shadow-lg">
                2
              </div>
              <h3 className="text-2xl font-bold text-slate-900">Crée avec notre IA en 1 min</h3>
            </div>
            <p className="text-lg text-slate-600 mb-6">
              <strong className="text-slate-900">Pas besoin de ChatGPT ni de designer.</strong> Notre générateur crée un ebook ultra-pro en 1 minute : design magazine, mise en page parfaite, textes de vente inclus.
            </p>
            
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-200 rounded-2xl p-6 mb-6">
              <div className="flex items-center gap-3 mb-4">
                <Sparkles className="w-6 h-6 text-purple-600" />
                <span className="font-bold text-purple-900">Ce que tu reçois :</span>
              </div>
              <div className="space-y-2">
                {[
                  "eBook PDF pro (30-50 pages)",
                  "Design magazine premium",
                  "Posts Facebook + Instagram",
                  "Messages WhatsApp",
                  "Page de vente complète"
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-2 text-sm text-purple-900">
                    <div className="w-1.5 h-1.5 rounded-full bg-purple-600" />
                    {item}
                  </div>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 text-sm">
              <Clock className="w-5 h-5 text-slate-400" />
              <span className="text-slate-600">Temps total : <strong className="text-slate-900">1 minute chrono</strong></span>
            </div>
          </div>
        </div>

        {/* Comparison Before/After */}
        <div className="bg-slate-50 rounded-3xl border border-slate-200 p-8 sm:p-12">
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 text-center mb-12">
            Avant vs Avec Bookzy
          </h3>
          
          <div className="grid md:grid-cols-2 gap-8">
            {/* Avant */}
            <div className="bg-white rounded-2xl border border-red-200 p-8">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-red-100 flex items-center justify-center">
                  <X className="w-5 h-5 text-red-600" />
                </div>
                <span className="font-bold text-red-900">Sans Bookzy</span>
              </div>
              <div className="space-y-4 text-slate-600">
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">3-5 heures de recherche</div>
                    <div className="text-sm">Pour trouver une niche qui marche</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">2-3 jours de rédaction</div>
                    <div className="text-sm">ChatGPT + relecture + corrections</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Clock className="w-5 h-5 text-red-500 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">1 jour de design</div>
                    <div className="text-sm">Canva + mise en page amateur</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-slate-200">
                  <div className="text-2xl font-bold text-red-600">Total : 4-5 jours</div>
                </div>
              </div>
            </div>

            {/* Avec */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 rounded-2xl border-2 border-green-300 p-8 relative overflow-hidden">
              <div className="absolute top-4 right-4 px-3 py-1 bg-green-500 text-white rounded-full font-bold text-xs">
                RECOMMANDÉ
              </div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-full bg-green-500 flex items-center justify-center">
                  <Check className="w-5 h-5 text-white" />
                </div>
                <span className="font-bold text-green-900">Avec Bookzy</span>
              </div>
              <div className="space-y-4 text-slate-600">
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">30 secondes de recherche</div>
                    <div className="text-sm">Tendances te montre ce qui marche</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">1 minute de génération</div>
                    <div className="text-sm">IA rédige + design pro automatique</div>
                  </div>
                </div>
                <div className="flex items-start gap-3">
                  <Zap className="w-5 h-5 text-green-600 mt-0.5 flex-shrink-0" />
                  <div>
                    <div className="font-semibold text-slate-900">0 minute de design</div>
                    <div className="text-sm">Tout est déjà parfait</div>
                  </div>
                </div>
                <div className="pt-4 border-t border-green-200">
                  <div className="text-2xl font-bold text-green-600">Total : 1 min 30 sec</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   DATABASE PREVIEW - Style Minea avec Screenshot
   ============================================ */
function DatabaseSection() {
  const products = [
    {
      title: "Comment lancer un business de Dropservicing",
      category: "💻 Tech",
      gradient: "from-blue-500 to-cyan-500",
      badge: "HOT",
      growth: "+83%",
      potential: "$6,200",
      difficulty: "Facile",
      volume: "41.0K",
      competition: "Faible",
      country: "🇸🇳"
    },
    {
      title: "Monétiser son compte TikTok depuis l'Afrique",
      category: "💸 Finance",
      gradient: "from-emerald-500 to-green-500",
      badge: "TENDANCE",
      growth: "+50%",
      potential: "$8,200",
      difficulty: "Facile",
      volume: "17.3K",
      competition: "Moyenne",
      country: "🇨🇮"
    },
    {
      title: "Lancer un micro-business digital rentable",
      category: "🚀 Business",
      gradient: "from-purple-500 to-pink-500",
      badge: "NOUVEAU",
      growth: "+50%",
      potential: "$4,500",
      difficulty: "Facile",
      volume: "56.0K",
      competition: "Moyenne",
      country: "🇫🇷"
    }
  ];

  return (
    <section id="database" className="py-20 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white border border-slate-200 shadow-sm mb-6">
            <Eye className="w-4 h-4 text-indigo-600" />
            <span className="text-sm font-semibold text-slate-700">Aperçu de la base</span>
          </div>
          
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Les ebooks qui explosent
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              en ce moment
            </span>
          </h2>
          <p className="text-xl text-slate-600 mb-12">
            Voici 3 exemples sur 31 000+ produits trackés
          </p>

          {/* Screenshot Interface */}
          
        </div>

        {/* Products Grid */}
        <div className="grid md:grid-cols-3 gap-6 mb-12">
          {products.map((product, i) => (
            <div key={i} className="group bg-white rounded-2xl border border-slate-200 overflow-hidden hover:shadow-2xl hover:border-slate-300 transition-all">
              
              {/* Header */}
              <div className={`bg-gradient-to-br ${product.gradient} p-6 text-white`}>
                <div className="flex items-center justify-between mb-4">
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold">
                    {product.badge}
                  </span>
                  <span className="px-3 py-1 rounded-full bg-white/20 backdrop-blur-sm text-xs font-bold">
                    {product.growth}
                  </span>
                </div>
                <div className="text-xs font-semibold mb-2">{product.category}</div>
                <h3 className="text-lg font-bold leading-tight">{product.title}</h3>
              </div>

              {/* Metrics */}
              <div className="p-6 space-y-4">
                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-emerald-50 border border-emerald-200">
                    <div className="text-xs font-semibold text-emerald-600 mb-1">POTENTIEL</div>
                    <div className="text-2xl font-bold text-slate-900">{product.potential}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-blue-50 border border-blue-200">
                    <div className="text-xs font-semibold text-blue-600 mb-1">DIFFICULTÉ</div>
                    <div className="text-2xl font-bold text-slate-900">{product.difficulty}</div>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-3">
                  <div className="p-3 rounded-xl bg-purple-50 border border-purple-200">
                    <div className="text-xs font-semibold text-purple-600 mb-1">VOLUME</div>
                    <div className="text-xl font-bold text-slate-900">{product.volume}</div>
                  </div>
                  <div className="p-3 rounded-xl bg-orange-50 border border-orange-200">
                    <div className="text-xs font-semibold text-orange-600 mb-1">CONCURRENCE</div>
                    <div className="text-xl font-bold text-slate-900">{product.competition}</div>
                  </div>
                </div>

                <div className="flex items-center justify-center gap-2 p-3 rounded-xl bg-slate-50 border border-slate-200">
                  <span className="text-2xl">{product.country}</span>
                  <span className="text-sm font-medium text-slate-600">Marché local</span>
                </div>

                <Link
                  href="/auth/register"
                  className="flex items-center justify-center gap-2 w-full py-3 rounded-xl bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-semibold transition-all group"
                >
                  Voir les détails
                  <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>
              </div>
            </div>
          ))}
        </div>

        {/* CTA */}
        <div className="text-center bg-white rounded-3xl border border-slate-200 p-12 shadow-xl">
          <Lock className="w-12 h-12 mx-auto mb-6 text-indigo-600" />
          <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 mb-4">
            Tu n'as vu que 3 ebooks sur <span className="text-indigo-600">31 000+</span>
          </h3>
          <p className="text-lg text-slate-600 mb-8 max-w-2xl mx-auto">
            Accède à la base complète avec filtres avancés, historique de croissance et analyses détaillées
          </p>
          <Link
            href="/auth/register"
            className="inline-flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white px-8 py-4 rounded-full font-semibold text-lg shadow-xl transition-all hover:scale-105"
          >
            Débloquer la base complète
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   SUCCESS STORIES - Clean & Simple
   ============================================ */
function SuccessSection() {
  const stories = [
    {
      name: "Mamadou K.",
      country: "🇸🇳 Sénégal",
      avatar: "/images/garcon3.jpg",
      revenue: "8 450€",
      days: 19,
      quote: "J'ai trouvé un ebook à 847 ventes sur Tendances. J'ai créé ma version avec Bookzy. Résultat : 8 450€ en 19 jours."
    },
    {
      name: "Aïcha D.",
      country: "🇨🇮 Côte d'Ivoire",
      avatar: "/images/fillenoir.jpg",
      revenue: "12 780€",
      days: 31,
      quote: "Tendances m'a montré l'idée. Le générateur Bookzy a créé un ebook tellement pro. 1 278 ventes."
    },
    {
      name: "Lucas M.",
      country: "🇫🇷 France",
      avatar: "/images/garcon2.jpg",
      revenue: "23 450€",
      days: 42,
      quote: "J'espionne avec Tendances, je crée avec Bookzy. Je vends 3x plus cher que mes concurrents. 23 450€ en 6 semaines."
    }
  ];

  return (
    <section id="success" className="py-20 sm:py-32 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Ils utilisent Tendances
            <br />
            <span className="bg-gradient-to-r from-indigo-600 to-pink-600 bg-clip-text text-transparent">
              pour savoir quoi créer
            </span>
          </h2>
          <p className="text-xl text-slate-600">
            Des milliers d'€ générés en trouvant les bonnes niches
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid md:grid-cols-3 gap-8">
          {stories.map((story, i) => (
            <div key={i} className="group bg-white rounded-2xl border border-slate-200 p-8 hover:shadow-2xl hover:border-slate-300 transition-all">
              
              <div className="flex items-center gap-4 mb-6">
                <img
                  src={story.avatar}
                  alt={story.name}
                  className="w-16 h-16 rounded-full object-cover border-2 border-slate-200 group-hover:scale-110 transition-transform"
                />
                <div>
                  <div className="font-bold text-slate-900 text-lg">{story.name}</div>
                  <div className="text-sm text-slate-600">{story.country}</div>
                </div>
              </div>

              <div className="bg-gradient-to-br from-emerald-50 to-green-50 border border-emerald-200 rounded-xl p-6 mb-6">
                <div className="text-4xl font-bold text-emerald-600 mb-2">{story.revenue}</div>
                <div className="text-sm text-slate-600">en {story.days} jours</div>
              </div>

              <div className="flex gap-1 mb-4">
                {[...Array(5)].map((_, j) => (
                  <Star key={j} className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                ))}
              </div>

              <p className="text-slate-600 italic leading-relaxed">
                "{story.quote}"
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

/* ============================================
   PRICING - Style Stripe Simple
   ============================================ */
function PricingSection() {
  return (
    <section id="pricing" className="py-20 sm:py-32 bg-slate-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-bold text-slate-900 mb-6">
            Tarification simple
          </h2>
          <p className="text-xl text-slate-600">
            Accès gratuit à la base. Payez uniquement pour créer vos ebooks.
          </p>
        </div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-5xl mx-auto">
          
          {/* Free Plan */}
          <div className="bg-white rounded-3xl border-2 border-slate-200 p-8">
            <div className="mb-8">
              <h3 className="text-2xl font-bold text-slate-900 mb-2">Gratuit</h3>
              <p className="text-slate-600">Accès complet à la base de données</p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-bold text-slate-900 mb-2">0€</div>
              <div className="text-slate-600">Pour toujours</div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "31 000+ ebooks trackés",
                "Tous les filtres",
                "Metrics en temps réel",
                "Historique de croissance"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <Check className="w-5 h-5 text-indigo-600" />
                  <span className="text-slate-700">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/register"
              className="block w-full py-3 rounded-full border-2 border-slate-300 hover:border-slate-400 text-slate-900 font-semibold text-center transition-all"
            >
              Commencer gratuitement
            </Link>
          </div>

          {/* Pro Plan */}
          <div className="relative bg-gradient-to-br from-indigo-600 to-purple-600 rounded-3xl p-8 text-white shadow-2xl">
            <div className="absolute -top-4 -right-4 bg-pink-500 text-white px-4 py-2 rounded-full font-bold text-sm shadow-lg">
              POPULAIRE
            </div>

            <div className="mb-8">
              <h3 className="text-2xl font-bold mb-2">Créateur</h3>
              <p className="text-indigo-100">Trouvez + Créez + Vendez</p>
            </div>

            <div className="mb-8">
              <div className="text-5xl font-bold mb-2">2 000 FCFA</div>
              <div className="text-indigo-100">par ebook généré</div>
            </div>

            <div className="space-y-4 mb-8">
              {[
                "Tout du plan Gratuit",
                "Générateur ebook PRO",
                "Design professionnel inclus",
                "Kit marketing complet",
                "Licence commerciale 100%"
              ].map((feature, i) => (
                <div key={i} className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-white" />
                  <span className="text-white">{feature}</span>
                </div>
              ))}
            </div>

            <Link
              href="/auth/register"
              className="block w-full py-3 rounded-full bg-white hover:bg-slate-50 text-indigo-600 font-semibold text-center transition-all"
            >
              Créer mon premier ebook
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

/* ============================================
   FINAL CTA - Powerful & Clean
   ============================================ */
function FinalCTA() {
  return (
    <section className="py-20 sm:py-32 bg-gradient-to-br from-slate-900 to-slate-800 text-white relative overflow-hidden">
      
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#4f46e520_1px,transparent_1px),linear-gradient(to_bottom,#4f46e520_1px,transparent_1px)] bg-[size:4rem_4rem]" />

      <div className="relative max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <h2 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6">
          Arrêtez de deviner.
          <br />
          <span className="bg-gradient-to-r from-indigo-400 to-pink-400 bg-clip-text text-transparent">
            Copiez ce qui marche.
          </span>
        </h2>

        <p className="text-xl text-slate-300 mb-12 max-w-2xl mx-auto">
          31 000+ ebooks qui cartonnent. Filtres avancés. Accès gratuit.
        </p>

        <Link
          href="/auth/register"
          className="inline-flex items-center gap-3 bg-white hover:bg-slate-50 text-slate-900 px-10 py-5 rounded-full font-bold text-lg shadow-2xl transition-all hover:scale-105"
        >
          <Database className="w-6 h-6" />
          Accéder à la base maintenant
          <ArrowRight className="w-6 h-6" />
        </Link>

        <p className="mt-8 text-slate-400 text-sm">
          ✓ Gratuit · ✓ Sans carte bancaire · ✓ Accès immédiat
        </p>
      </div>
    </section>
  );
}

/* ============================================
   FOOTER - Clean Stripe Style
   ============================================ */
function Footer() {
  const scrollToSection = (id) => {
    const el = document.getElementById(id);
    if (!el) return;
    const offset = 80;
    const top = el.getBoundingClientRect().top + window.pageYOffset - offset;
    window.scrollTo({ top, behavior: "smooth" });
  };

  return (
    <footer className="bg-slate-50 border-t border-slate-200 pt-16 pb-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-12">
          
          {/* Logo */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-indigo-600 to-purple-600 flex items-center justify-center">
                <Database className="w-5 h-5 text-white" />
              </div>
              <span className="text-xl font-bold text-slate-900">Bookzy</span>
            </Link>
            <p className="text-sm text-slate-600 leading-relaxed">
              La base de données des ebooks qui cartonnent.
            </p>
          </div>

          {/* Produit */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Produit</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection("database")} className="text-sm text-slate-600 hover:text-slate-900">
                  Base de données
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("workflow")} className="text-sm text-slate-600 hover:text-slate-900">
                  Comment ça marche
                </button>
              </li>
              <li>
                <button onClick={() => scrollToSection("pricing")} className="text-sm text-slate-600 hover:text-slate-900">
                  Tarifs
                </button>
              </li>
            </ul>
          </div>

          {/* Ressources */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Ressources</h3>
            <ul className="space-y-3">
              <li>
                <button onClick={() => scrollToSection("success")} className="text-sm text-slate-600 hover:text-slate-900">
                  Success Stories
                </button>
              </li>
              <li>
                <Link href="/blog" className="text-sm text-slate-600 hover:text-slate-900">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-bold text-slate-900 mb-4 text-sm">Contact</h3>
            <ul className="space-y-3">
              <li>
                <a href="mailto:support@bookzy.io" className="text-sm text-slate-600 hover:text-slate-900">
                  support@bookzy.io
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-slate-200 pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-sm text-slate-600">
            © 2025 Bookzy. Tous droits réservés.
          </p>
          <div className="flex gap-6">
            <Link href="/legal/confidentialite" className="text-sm text-slate-600 hover:text-slate-900">
              Confidentialité
            </Link>
            <Link href="/legal/terms" className="text-sm text-slate-600 hover:text-slate-900">
              CGU
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

/* ============================================
   MAIN PAGE COMPONENT
   ============================================ */
export default function TendancesPage() {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    );
  }

  return (
    <>
      <NavbarTendances />
      <HeroSection />
      <WorkflowSection />
      <DatabaseSection />
      <SuccessSection />
      <PricingSection />
      <FinalCTA />
      <Footer />

      {/* Animations CSS */}
      <style jsx global>{`
        @keyframes blob {
          0%, 100% { transform: translate(0, 0) scale(1); }
          33% { transform: translate(30px, -50px) scale(1.1); }
          66% { transform: translate(-20px, 20px) scale(0.9); }
        }

        @keyframes progress {
          0% { width: 0%; }
          100% { width: 85%; }
        }

        .animate-blob {
          animation: blob 7s infinite;
        }

        .animation-delay-2000 {
          animation-delay: 2s;
        }

        .animate-progress {
          animation: progress 2s ease-in-out infinite;
        }
      `}</style>
    </>
  );
}