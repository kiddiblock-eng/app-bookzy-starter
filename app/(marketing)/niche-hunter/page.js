"use client";

import React, { useState, useRef, useEffect } from "react";
import Link from "next/link";
import { 
  Sparkles, Target, TrendingUp, Zap, Check, X, ArrowRight, Star, 
  Rocket, Timer, Users, Lightbulb, BookOpen, Crown, Clock, 
  ChevronDown, Gauge, Menu, DollarSign, Play, CheckCircle2, Flame, Eye, Search, 
  BarChart3, Wallet, Trophy, Lock, MousePointer2
} from "lucide-react";

/* =========================================
   1. COMPOSANTS UTILITAIRES & UI - OPTIMISÉS
   ========================================= */

// Vidéo Premium avec Cloudinary (OPTIMISÉ)
function PremiumVideoPlayer({ videoId }) {
  const videoRef = useRef(null);
  const cloudName = "dcmlw5hak";
  const videoUrl = `https://res.cloudinary.com/${cloudName}/video/upload/q_auto,f_auto,w_1200/${videoId}.mp4`;
  
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) video.play().catch(() => {});
        else video.pause();
      },
      { threshold: 0.5 }
    );
    observer.observe(video);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="relative group mx-auto max-w-5xl mt-12">
      {/* Glow simplifié */}
      <div className="absolute -inset-2 bg-gradient-to-r from-blue-200 to-pink-200 rounded-[24px] opacity-20 group-hover:opacity-30 transition duration-500"></div>
      
      {/* Cadre de la vidéo */}
      <div className="relative rounded-2xl overflow-hidden shadow-2xl border-[8px] border-white bg-white aspect-video">
        <video 
          ref={videoRef} 
          src={videoUrl} 
          className="w-full h-full object-cover" 
          muted 
          loop 
          playsInline 
          preload="metadata" 
        />
      </div>
    </div>
  );
}

// Badge de confiance
function SocialProofAvatars() {
  const avatars = [
    "/images/garcon1.jpg",
    "/images/filleblanche1.jpg",
    "/images/garcon2.jpg",
    "/images/garcon3.jpg"
  ];

  return (
    <div className="flex items-center gap-4 mt-8 justify-center">
      <div className="flex -space-x-4">
        {avatars.map((src, i) => (
          <div key={i} className="w-12 h-12 rounded-full border-4 border-white shadow-md overflow-hidden relative">
             <img src={src} alt={`User ${i}`} className="w-full h-full object-cover" loading="lazy" />
          </div>
        ))}
      </div>
      <div className="text-left ml-2">
        <div className="flex items-center gap-1">
          {[1, 2, 3, 4, 5].map((star) => (
            <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
          ))}
        </div>
        <p className="text-slate-500 text-sm font-medium mt-1">
          <span className="text-slate-900 font-bold">4.9/5</span> par 2,450+ créateurs
        </p>
      </div>
    </div>
  );
}

/* =========================================
   2. NAVBAR SPÉCIFIQUE (Light & Clean)
   ========================================= */

function NavbarNicheHunter() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const smoothScrollTo = (e, id) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const navLinks = [
    { name: "Comment ça marche", id: "features" },
    { name: "Résultats", id: "results" },
    { name: "Essayer", id: "demo" },
    { name: "FAQ", id: "faq" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/90 backdrop-blur-xl border-b border-slate-100 py-3 shadow-sm" : "bg-transparent py-6"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-blue-600 via-violet-600 to-indigo-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-all">
              <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
            </div>
            <div className="flex flex-col">
                <span className="text-xl font-black text-slate-900 leading-none tracking-tight">Bookzy</span>
                <span className="text-[10px] font-bold text-pink-600 uppercase tracking-widest bg-pink-50 px-1.5 py-0.5 rounded mt-1 w-fit border border-pink-100">Niche Hunter</span>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={`#${link.id}`} 
                onClick={(e) => smoothScrollTo(e, link.id)} 
                className="text-sm font-bold text-slate-600 hover:text-blue-600 transition-colors relative group"
              >
                {link.name}
                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-blue-600 transition-all duration-300 group-hover:w-full"></span>
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="https://app.bookzy.io/auth/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2">
                Connexion
            </Link>
            <Link href="https://app.bookzy.io/auth/register" className="group relative px-6 py-2.5 bg-slate-900 text-white font-bold rounded-xl shadow-lg hover:-translate-y-0.5 transition-all flex items-center gap-2">
                <span className="relative z-10 text-sm">Analyser gratuitement</span>
                <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform"/>
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-700 hover:bg-slate-50 rounded-lg">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 shadow-2xl flex flex-col gap-4 lg:hidden">
            {navLinks.map((link) => (
              <a key={link.name} href={`#${link.id}`} onClick={(e) => smoothScrollTo(e, link.id)} className="text-base font-bold text-slate-700 py-3 border-b border-slate-50 hover:text-blue-600">
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4">
                <Link href="https://app.bookzy.io/auth/login" className="w-full text-center py-3 font-bold text-slate-600 border border-slate-200 rounded-xl hover:bg-slate-50">
                    Se connecter
                </Link>
                <Link href="https://app.bookzy.io/auth/register" className="flex items-center justify-center gap-2 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg">
                    <Rocket className="w-5 h-5 text-yellow-300" /> Analyser gratuitement
                </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* =========================================
   3. PAGE PRINCIPALE COMPLÈTE
   ========================================= */

export default function NicheHunterPage() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);
  
  const [ebookPrice, setEbookPrice] = useState(15);
  const [salesPerMonth, setSalesPerMonth] = useState(100);

  useEffect(() => { setMounted(true); }, []);

  const monthlyRevenue = ebookPrice * salesPerMonth;
  const yearlyRevenue = monthlyRevenue * 12;
  const cost = 3; 
  const roi = Math.round(((monthlyRevenue - cost) / cost) * 100);
  
  const getMotivationalMessage = () => {
      if (monthlyRevenue > 5000) return "🔥 Vous êtes un futur top vendeur !";
      if (monthlyRevenue > 2000) return "🚀 Excellent revenu complémentaire !";
      return "👍 Bon début pour tester !";
  };

  const smoothScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  const successStories = [
    { 
      name: "Amadou S.", 
      country: "🇸🇳 Sénégal", 
      avatar: "/images/garcon1.jpg", 
      niche: "Élevage de poulets", 
      sales: 847, 
      price: 10, 
      revenue: 8470, 
      days: 47, 
      quote: "J'ai trouvé ma niche en 30 secondes. L'ebook s'est vendu à 847 personnes en moins de 2 mois !" 
    },
    { 
      name: "Marie K.", 
      country: "🇨🇮 Côte d'Ivoire", 
      avatar: "/images/filleblanche1.jpg", 
      niche: "Jus Naturels & Détox", 
      sales: 1234, 
      price: 5, 
      revenue: 6170, 
      days: 63, 
      quote: "ROI de fou. Je ne savais pas quoi vendre, l'outil m'a tout dit. J'ai lancé ma pub Facebook le soir même." 
    },
    { 
      name: "Jean-Marc T.", 
      country: "🇨🇲 Cameroun", 
      avatar: "/images/garcon2.jpg", 
      niche: "Marketing Digital PME", 
      sales: 612, 
      price: 15, 
      revenue: 9180, 
      days: 51, 
      quote: "Niche Hunter + Bookzy = la combinaison parfaite. 9 180€ de revenus en partant de zéro." 
    }
  ];

  const faqs = [
    { 
      question: "Comment fonctionne l'analyse de niche ?", 
      answer: "Niche Hunter scanne en temps réel plus de 10 000 marchés (TikTok, Google Trends, Amazon) et vous donne les 10 meilleures opportunités avec un score de rentabilité sur 100, le volume de recherche et le niveau de concurrence." 
    },
    { 
      question: "L'analyse est-elle vraiment gratuite ?", 
      answer: "Oui, 100% gratuit avec 3 recherches par jour (renouvelées quotidiennement). Vous ne payez que si vous décidez de créer l'eBook complet avec Bookzy (2 000 FCFA par eBook)." 
    },
    { 
      question: "Combien peut-on gagner avec une bonne niche ?", 
      answer: "Avec un eBook à 5 000 FCFA et 100 ventes par mois (très faisable avec les bonnes niches), vous générez 500 000 FCFA/mois. Le potentiel est illimité car vous gardez 100% des bénéfices." 
    },
    { 
      question: "Dois-je avoir des compétences techniques ?", 
      answer: "Absolument pas. Niche Hunter trouve QUOI vendre. Si vous décidez de créer l'eBook, Bookzy le rédige automatiquement avec l'IA. Vous n'avez besoin d'aucune compétence en écriture ou en design." 
    },
    {
      question: "Quelle est la différence entre Niche Hunter et Bookzy ?",
      answer: "Niche Hunter (gratuit) = Analyse de marché pour trouver les niches rentables. Bookzy (2 000 FCFA/eBook) = Génération automatique de l'eBook complet + textes marketing. Utilisez d'abord Niche Hunter pour valider votre idée, puis Bookzy pour créer le produit."
    }
  ];

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      <NavbarNicheHunter />
      
      {/* HERO SECTION - OPTIMISÉ */}
      <section id="home" className="relative pt-32 pb-24 lg:pt-48 lg:pb-32 overflow-hidden bg-white">
        
        {/* Background simplifié */}
        <div className="absolute inset-0 pointer-events-none">
           <div className="absolute inset-0 bg-[radial-gradient(#e5e7eb_1px,transparent_1px)] [background-size:20px_20px]"></div>
           <div className="absolute inset-0 bg-gradient-to-b from-blue-50/50 via-white to-purple-50/30"></div>
        </div>

        <div className="relative z-10 max-w-7xl mx-auto px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gradient-to-r from-orange-50 to-red-50 border-2 border-orange-200 shadow-sm text-orange-700 mb-8">
            <Flame className="w-4 h-4" />
            <span className="text-xs sm:text-sm font-bold tracking-wide">
              <span className="text-orange-900">147 niches</span> analysées aujourd'hui
            </span>
          </div>

          <h1 className="text-5xl md:text-7xl lg:text-8xl font-black text-slate-900 tracking-tight leading-[1.1] mb-8 max-w-6xl mx-auto">
            L'IA qui trouve <br/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500">
              VOTRE niche à 10k€/mois
            </span>
            <br/>en 30 secondes.
          </h1>

          <p className="text-xl md:text-2xl text-slate-500 mb-12 max-w-3xl mx-auto leading-relaxed font-medium">
            Arrêtez de deviner. Notre IA analyse <strong className="text-slate-900">10 000 marchés</strong> et vous révèle les niches les plus rentables avec un score de potentiel sur 100.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12">
            <Link href="https://app.bookzy.io/auth/register" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white text-lg font-bold rounded-2xl transition-all hover:scale-105 shadow-xl">
              <Target className="w-5 h-5" />
              <span>Trouver ma niche (Gratuit)</span>
            </Link>
            
            <button onClick={() => smoothScrollTo('demo')} className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-white border-2 border-slate-200 text-slate-700 text-lg font-bold rounded-2xl hover:border-blue-300 hover:text-blue-600 transition-all shadow-sm">
              Voir la démo <Play className="w-5 h-5" />
            </button>
          </div>

          <SocialProofAvatars />

          {/* Vidéo Cloudinary */}
          <PremiumVideoPlayer videoId="nichehunternew_psydjb" />

        </div>
      </section>

      {/* TRUST BAR */}
      <div className="py-10 border-y border-slate-100 bg-slate-50/50">
        <div className="max-w-7xl mx-auto px-6 text-center">
            <p className="text-sm font-bold text-slate-400 uppercase tracking-widest mb-8">Sources de données en temps réel</p>
            <div className="flex flex-wrap justify-center gap-8 md:gap-16 opacity-60 hover:opacity-100 transition-all duration-500">
                <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><Eye className="w-6 h-6 text-blue-600"/> TikTok</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><Search className="w-6 h-6 text-pink-600"/> Google Trends</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><Users className="w-6 h-6 text-purple-600"/> Amazon KDP</div>
                <div className="flex items-center gap-2 text-xl font-bold text-slate-600"><Target className="w-6 h-6 text-green-600"/> Facebook Ads</div>
            </div>
        </div>
      </div>

      {/* FEATURES */}
      <section id="features" className="py-24 bg-white relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              3 étapes. 30 secondes. <span className="text-blue-600">Votre niche trouvée.</span>
            </h2>
            <p className="text-xl text-slate-600 max-w-3xl mx-auto">
              L'outil qui fait le travail d'analyse de marché à votre place.
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            <div className="group relative p-10 bg-white rounded-[2.5rem] border-2 border-blue-200 shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-blue-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg">
                1
              </div>
              <div className="mb-6">
                <Target className="w-12 h-12 text-blue-600 mb-4" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Analyse 10k Marchés</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Entrez un mot-clé (ex: "Fitness"). L'IA scanne TikTok, Google, Amazon et vous donne <strong className="text-blue-600">10 niches rentables</strong> avec leur score.
              </p>
              
              <div className="bg-blue-50 border-2 border-blue-200 rounded-xl p-4 space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Yoga pour seniors</span>
                  <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-bold">92/100</span>
                </div>
                <div className="flex items-center justify-between text-sm">
                  <span className="font-semibold text-slate-700">Nutrition sportive</span>
                  <span className="px-2 py-1 bg-green-500 text-white rounded text-xs font-bold">88/100</span>
                </div>
                <div className="text-xs text-blue-600 font-bold text-center pt-2">
                  + 8 autres niches...
                </div>
              </div>
            </div>

            <div className="group relative p-10 bg-white rounded-[2.5rem] border-2 border-violet-200 shadow-xl hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-violet-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg">
                2
              </div>
              <div className="mb-6">
                <BarChart3 className="w-12 h-12 text-violet-600 mb-4" />
              </div>
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Validez Votre Idée</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Pour chaque niche, obtenez : volume de recherche, niveau de concurrence, public cible et tendance sur 12 mois.
              </p>
              
              <ul className="space-y-3">
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">Score rentabilité /100</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">Analyse concurrence</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">Public cible défini</span>
                </li>
                <li className="flex items-center gap-3">
                  <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                  <span className="text-sm font-semibold text-slate-700">Tendance 12 mois</span>
                </li>
              </ul>
            </div>

            <div className="group relative p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[2.5rem] shadow-2xl hover:-translate-y-2 transition-all duration-300 text-white overflow-hidden border-2 border-slate-700">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-blue-500 to-violet-500 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg">
                3
              </div>
              
              <div className="relative z-10">
                <div className="mb-6">
                  <Rocket className="w-12 h-12 text-blue-400 mb-4" />
                </div>
                <h3 className="text-2xl font-bold mb-4">Créez & Vendez (Option)</h3>
                <p className="text-slate-300 leading-relaxed mb-6">
                  Niche trouvée ? Générez votre eBook complet + textes marketing en 1 clic avec <strong className="text-white">Bookzy</strong>.
                </p>
                
                <div className="bg-white/10 border border-white/20 rounded-xl p-4 backdrop-blur-sm mb-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Lock className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-blue-400 uppercase">Optionnel</span>
                  </div>
                  <p className="text-sm text-slate-200">
                    2 000 FCFA par eBook généré
                  </p>
                </div>

                <ul className="space-y-2 text-sm text-slate-300">
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    eBook 30-50 pages
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    PDF professionnel
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-green-400" />
                    Textes de vente inclus
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* DÉMO INTERACTIVE */}
      <section id="demo" className="py-24 bg-gradient-to-br from-blue-50 to-violet-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white border border-blue-200 text-blue-700 text-xs font-bold uppercase mb-6">
              <Play className="w-4 h-4" /> Essai gratuit
            </div>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Testez maintenant (Gratuit)
            </h2>
            <p className="text-lg text-slate-600">
              Entrez un mot-clé et découvrez les meilleures niches
            </p>
          </div>

          <div className="bg-white rounded-3xl shadow-2xl p-8 md:p-12 border-2 border-slate-200">
            <div className="flex flex-col md:flex-row gap-4 mb-8">
              <input 
                type="text" 
                placeholder="Ex: Fitness, Cuisine, Business..." 
                className="flex-1 px-6 py-4 border-2 border-slate-200 rounded-xl text-lg font-semibold focus:border-blue-500 focus:outline-none"
              />
              <Link href="https://app.bookzy.io/auth/register" className="px-8 py-4 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold rounded-xl hover:scale-105 transition-transform shadow-lg whitespace-nowrap">
                <span className="flex items-center gap-2">
                  <Search className="w-5 h-5" />
                  Analyser
                </span>
              </Link>
            </div>

            <div className="bg-slate-50 rounded-2xl p-6 border border-slate-200">
              <div className="text-sm font-bold text-slate-400 uppercase mb-4">Exemple de résultats :</div>
              <div className="space-y-3">
                {[
                  { niche: "Yoga pour seniors", score: 92, volume: "12k/mois", concurrence: "Faible" },
                  { niche: "Nutrition sportive", score: 88, volume: "8k/mois", concurrence: "Moyenne" },
                  { niche: "Fitness à domicile", score: 85, volume: "15k/mois", concurrence: "Forte" }
                ].map((item, i) => (
                  <div key={i} className="flex items-center justify-between p-4 bg-white rounded-xl border border-slate-200 hover:border-blue-300 transition-colors">
                    <div className="flex-1">
                      <div className="font-bold text-slate-900 mb-1">{item.niche}</div>
                      <div className="flex gap-4 text-xs text-slate-500">
                        <span>📈 {item.volume}</span>
                        <span>🎯 {item.concurrence}</span>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 bg-green-100 text-green-700 rounded-lg font-bold text-sm">
                        {item.score}/100
                      </span>
                      <ChevronDown className="w-5 h-5 text-slate-400 -rotate-90" />
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 p-4 bg-blue-50 border-2 border-blue-200 rounded-xl text-center">
                <p className="text-sm font-bold text-blue-900">
                  🎁 Créez un compte pour voir les 7 autres niches + analyses complètes
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* COMPARATIF */}
      <section id="comparaison" className="py-24 bg-white">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-black text-slate-900">Pourquoi Niche Hunter ?</h2>
            <p className="text-slate-500 mt-4 text-lg">La méthode intelligente vs méthode manuelle</p>
          </div>
          
          <div className="bg-white rounded-3xl shadow-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr>
                  <th className="p-6 md:p-8 text-sm text-slate-500 font-bold uppercase tracking-wider border-b border-slate-100 w-1/3">Critère</th>
                  <th className="p-6 md:p-8 text-center bg-blue-50/50 text-blue-700 font-black border-b border-blue-100 w-1/3 text-lg md:text-xl border-x border-blue-100 relative">
                    Niche Hunter
                    <span className="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded shadow-sm">RECOMMANDÉ</span>
                  </th>
                  <th className="p-6 md:p-8 text-center text-slate-400 font-bold border-b border-slate-100 w-1/3 bg-slate-50/50">Méthode Manuelle</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6 md:p-8 font-bold text-slate-700">Temps de recherche</td>
                  <td className="p-6 md:p-8 text-center bg-blue-50/30 font-black text-slate-900 text-lg border-x border-blue-50">30 secondes</td>
                  <td className="p-6 md:p-8 text-center text-slate-500 bg-slate-50/30">3-5 heures</td>
                </tr>
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6 md:p-8 font-bold text-slate-700">Score de Rentabilité</td>
                  <td className="p-6 md:p-8 text-center bg-blue-50/30 border-x border-blue-50"><Check className="w-8 h-8 text-green-500 mx-auto"/></td>
                  <td className="p-6 md:p-8 text-center bg-slate-50/30"><X className="w-8 h-8 text-slate-300 mx-auto"/></td>
                </tr>
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6 md:p-8 font-bold text-slate-700">Analyse Concurrence</td>
                  <td className="p-6 md:p-8 text-center bg-blue-50/30 border-x border-blue-50"><Check className="w-8 h-8 text-green-500 mx-auto"/></td>
                  <td className="p-6 md:p-8 text-center bg-slate-50/30"><X className="w-8 h-8 text-slate-300 mx-auto"/></td>
                </tr>
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6 md:p-8 font-bold text-slate-700">Données en temps réel</td>
                  <td className="p-6 md:p-8 text-center bg-blue-50/30 border-x border-blue-50"><Check className="w-8 h-8 text-green-500 mx-auto"/></td>
                  <td className="p-6 md:p-8 text-center bg-slate-50/30"><X className="w-8 h-8 text-slate-300 mx-auto"/></td>
                </tr>
                <tr className="hover:bg-slate-50/30 transition-colors">
                  <td className="p-6 md:p-8 font-bold text-slate-700">Coût</td>
                  <td className="p-6 md:p-8 text-center bg-blue-50/30 font-black text-green-600 text-lg border-x border-blue-50">Gratuit</td>
                  <td className="p-6 md:p-8 text-center text-slate-500 bg-slate-50/30">Votre temps</td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* SUCCESS STORIES */}
      <section id="results" className="py-24 bg-slate-50 border-y border-slate-200">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Ils ont trouvé leur pépite</h2>
            <p className="text-slate-600 text-lg">Des niches découvertes avec Niche Hunter, des eBooks vendus avec Bookzy</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {successStories.map((story, i) => (
              <div key={i} className="group bg-white p-8 rounded-[2rem] border border-slate-200 shadow-sm hover:shadow-2xl hover:border-blue-300 hover:-translate-y-1 transition-all duration-300">
                <div className="flex items-center gap-4 mb-6">
                  <img src={story.avatar} alt={story.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100 shadow-sm" loading="lazy" />
                  <div>
                    <div className="font-bold text-slate-900 text-lg">{story.name}</div>
                    <div className="text-sm text-slate-500 font-medium">{story.country}</div>
                  </div>
                </div>
                
                <div className="bg-slate-50 rounded-xl p-4 mb-6 border border-slate-100 group-hover:bg-blue-50 group-hover:border-blue-100 transition-colors">
                  <div className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Niche Trouvée</div>
                  <div className="font-black text-slate-900 text-lg">{story.niche}</div>
                </div>

                <div className="flex justify-between items-center py-4 border-t border-slate-100 mb-4">
                  <div className="text-center">
                    <div className="text-2xl font-black text-slate-900">{story.sales}</div>
                    <div className="text-xs font-bold text-slate-400">Ventes</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-green-600">{story.revenue}€</div>
                    <div className="text-xs font-bold text-slate-400">Revenus</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-black text-blue-600">{story.days}j</div>
                    <div className="text-xs font-bold text-slate-400">Durée</div>
                  </div>
                </div>

                <div className="flex gap-1 mb-3">
                    {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-600 italic text-sm leading-relaxed">"{story.quote}"</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Questions Fréquentes</h2>
            <p className="text-slate-600">Tout ce que vous devez savoir sur Niche Hunter</p>
          </div>
          <div className="space-y-4">
            {faqs.map((faq, index) => (
              <div key={index} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-bold text-lg ${openFaq === index ? "text-blue-600" : "text-slate-900"}`}>
                    {faq.question}
                  </span>
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center transition-colors ${openFaq === index ? "bg-blue-100 text-blue-600" : "bg-slate-100 text-slate-500"}`}>
                    <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === index ? "rotate-180" : ""}`} />
                  </div>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed border-t border-slate-100 bg-slate-50/50">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 bg-slate-900 text-center px-6 relative overflow-hidden border-t border-white/5">
        <div className="absolute inset-0 bg-gradient-to-b from-slate-900 via-blue-950/20 to-slate-900"></div>
        
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="inline-flex items-center gap-2 px-6 py-3 bg-orange-500/20 border-2 border-orange-500/50 rounded-full text-orange-400 mb-8">
            <Clock className="w-5 h-5" />
            <span className="font-bold">
              Analyse gratuite : <span className="text-white">3 recherches/jour</span>
            </span>
          </div>

          <h2 className="text-5xl md:text-7xl font-black text-white mb-6 tracking-tight">
            Votre niche vous attend.
          </h2>
          
          <p className="text-xl text-slate-400 mb-12 max-w-2xl mx-auto leading-relaxed">
            Pendant que vous hésitez, d'autres trouvent leur pépite et lancent leur business. 
            <strong className="text-white"> Ne ratez plus aucune opportunité.</strong>
          </p>

          <Link href="https://app.bookzy.io/auth/register" className="inline-flex items-center gap-3 px-12 py-6 bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-500 hover:to-violet-500 text-white text-xl font-black rounded-2xl shadow-2xl hover:scale-105 transition-all">
            <Target className="w-6 h-6" />
            Analyser 10 000 niches MAINTENANT
          </Link>

          <p className="mt-6 text-sm text-slate-500">
            ✓ Gratuit · ✓ Sans carte bancaire · ✓ Résultats en 30 sec
          </p>

          <div className="mt-12 flex items-center justify-center gap-6">
            <div className="flex -space-x-2">
              {[
                "/images/garcon1.jpg",
                "/images/filleblanche1.jpg",
                "/images/garcon2.jpg",
                "/images/fillenoir.jpg",
                "/images/garcon3.jpg"
              ].map((src, i) => (
                <div key={i} className="w-10 h-10 rounded-full border-2 border-slate-900 overflow-hidden">
                  <img src={src} alt={`User ${i + 1}`} className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 fill-yellow-400 text-yellow-400" />)}
              </div>
              <p className="text-sm text-slate-400 mt-1">
                <strong className="text-white">2,450+</strong> niches découvertes cette semaine
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white pt-24 pb-12 border-t border-white/5">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-20">
            
            <div className="col-span-2 md:col-span-1">
              <Link href="/" className="flex items-center gap-3 mb-6 group">
                <span className="text-2xl font-black tracking-tight">Bookzy</span>
              </Link>
              <p className="text-slate-400 text-sm leading-relaxed mb-6">
                La plateforme IA n°1 en Afrique pour trouver des niches rentables et créer des produits digitaux.
              </p>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Produit</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#features" onClick={(e) => { e.preventDefault(); smoothScrollTo('features'); }} className="hover:text-blue-400 transition-colors">Comment ça marche</a></li>
                <li><a href="#demo" onClick={(e) => { e.preventDefault(); smoothScrollTo('demo'); }} className="hover:text-blue-400 transition-colors">Essayer gratuitement</a></li>
                <li><a href="#comparaison" onClick={(e) => { e.preventDefault(); smoothScrollTo('comparaison'); }} className="hover:text-blue-400 transition-colors">Pourquoi Niche Hunter</a></li>
                <li><Link href="https://app.bookzy.io/auth/register" className="hover:text-blue-400 transition-colors">Créer un compte</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Ressources</h3>
              <ul className="space-y-4 text-sm text-slate-400">
                <li><a href="#results" onClick={(e) => { e.preventDefault(); smoothScrollTo('results'); }} className="hover:text-blue-400 transition-colors">Success Stories</a></li>
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); smoothScrollTo('faq'); }} className="hover:text-blue-400 transition-colors">FAQ</a></li>
                <li><Link href="/" className="hover:text-blue-400 transition-colors">Créer un eBook</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold text-white mb-6 uppercase text-sm tracking-wider">Contact</h3>
              <ul className="space-y-4 text-sm text-slate-400 mb-8">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Support 7j/7</li>
                <li><a href="mailto:support@bookzy.io" className="hover:text-white transition-colors border-b border-slate-800 pb-1">support@bookzy.io</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/5 pt-10 flex flex-col md:flex-row justify-between items-center gap-6 text-xs text-slate-500 font-medium">
            <p>© 2025 Bookzy Inc. Tous droits réservés.</p>
            <div className="flex gap-8">
              <Link href="/legal/terms" className="hover:text-white transition-colors">Conditions Générales</Link>
              <Link href="/legal/confidentialite" className="hover:text-white transition-colors">Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}