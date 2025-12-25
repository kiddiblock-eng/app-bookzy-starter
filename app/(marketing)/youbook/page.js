"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import { 
  Youtube, Play, Zap, Check, X, ArrowRight, Star, Clock, 
  ChevronDown, Menu, Wand2, FileText, Sparkles, 
  TrendingUp, Users, CheckCircle2, Video, Target, Download, Crown
} from "lucide-react";

/* =========================================
   NAVBAR
   ========================================= */

function NavbarYoubook() {
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
    { name: "Démo", id: "demo" },
    { name: "Fonctionnement", id: "how" },
    { name: "Tarifs", id: "pricing" },
    { name: "FAQ", id: "faq" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${isScrolled ? "bg-white/95 backdrop-blur-xl border-b border-slate-200 py-3 shadow-sm" : "bg-white py-5"}`}>
      <div className="max-w-7xl mx-auto px-6">
        <div className="flex items-center justify-between">
          
          <Link href="/" className="flex items-center gap-3 group">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-600 to-rose-600 flex items-center justify-center shadow-lg group-hover:scale-105 transition-transform">
              <Youtube className="w-5 h-5 text-white" />
            </div>
            <div>
                <span className="text-xl font-black text-slate-900">Youbook</span>
                <p className="text-[8px] font-bold text-red-600 uppercase tracking-widest">by Bookzy</p>
            </div>
          </Link>

          <div className="hidden lg:flex items-center gap-8">
            {navLinks.map((link) => (
              <a 
                key={link.name} 
                href={`#${link.id}`} 
                onClick={(e) => smoothScrollTo(e, link.id)} 
                className="text-sm font-bold text-slate-600 hover:text-red-600 transition-colors"
              >
                {link.name}
              </a>
            ))}
          </div>

          <div className="hidden lg:flex items-center gap-4">
            <Link href="/auth/login" className="text-sm font-bold text-slate-600 hover:text-slate-900 px-4 py-2">
                Connexion
            </Link>
            <Link href="/auth/register" className="group relative px-6 py-3 bg-gradient-to-r from-red-600 to-rose-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl transition-all flex items-center gap-2">
                <span className="text-sm">Essayer gratuit</span>
                <Play className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" fill="currentColor"/>
            </Link>
          </div>

          <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden p-2 text-slate-700 hover:bg-slate-100 rounded-lg">
            {isMobileMenuOpen ? <X /> : <Menu />}
          </button>
        </div>

        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 right-0 bg-white border-b border-slate-100 p-6 shadow-2xl flex flex-col gap-4 lg:hidden">
            {navLinks.map((link) => (
              <a key={link.name} href={`#${link.id}`} onClick={(e) => smoothScrollTo(e, link.id)} className="text-base font-bold text-slate-700 py-3 border-b border-slate-50">
                {link.name}
              </a>
            ))}
            <div className="flex flex-col gap-3 mt-4">
                <Link href="/auth/login" className="w-full text-center py-3 font-bold text-slate-600 border border-slate-200 rounded-xl">
                    Se connecter
                </Link>
                <Link href="/auth/register" className="flex items-center justify-center gap-2 bg-gradient-to-r from-red-600 to-rose-600 text-white px-6 py-4 rounded-xl font-bold shadow-lg">
                    <Play className="w-5 h-5" fill="currentColor" /> Essayer gratuit
                </Link>
            </div>
          </div>
        )}
      </div>
    </nav>
  );
}

/* =========================================
   PAGE PRINCIPALE
   ========================================= */

export default function YoubookPage() {
  const [mounted, setMounted] = useState(false);
  const [openFaq, setOpenFaq] = useState(0);

  useEffect(() => { setMounted(true); }, []);

  const smoothScrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 80;
      const top = element.getBoundingClientRect().top + window.scrollY - offset;
      window.scrollTo({ top, behavior: "smooth" });
    }
  };

  if (!mounted) return <div className="min-h-screen bg-white" />;

  return (
    <div className="min-h-screen bg-white font-sans text-slate-900 overflow-x-hidden">
      
      <NavbarYoubook />
      
      {/* HERO */}
      <section className="relative pt-32 pb-24 lg:pt-40 lg:pb-32 bg-gradient-to-br from-red-50 via-white to-orange-50">
        <div className="max-w-7xl mx-auto px-6 text-center">
          
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-100 border border-red-200 text-red-700 mb-8">
            <Video className="w-4 h-4" />
            <span className="text-sm font-bold">447 vidéos converties aujourd'hui</span>
          </div>

          <h1 className="text-5xl md:text-6xl lg:text-7xl font-black text-slate-900 mb-6 leading-[1.1] max-w-5xl mx-auto">
            Transformez des vidéos YouTube en{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-600 to-rose-600">
              eBooks rentables
            </span>
          </h1>

          <p className="text-xl md:text-2xl text-slate-600 mb-12 max-w-3xl mx-auto leading-relaxed">
Ajoutez l'URL d'une vidéo et obtenez un eBook complet avec structure, chapitres et contenu extrait automatiquement.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-5 mb-12">
            <Link href="/auth/register" className="group relative inline-flex items-center justify-center gap-3 px-10 py-5 bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-700 hover:to-rose-700 text-white text-lg font-bold rounded-2xl transition-all hover:scale-105 shadow-2xl shadow-red-500/30">
              <Play className="w-5 h-5" fill="currentColor" />
              <span>Convertir gratuitement</span>
            </Link>
            
            <button onClick={() => smoothScrollTo('demo')} className="inline-flex items-center justify-center gap-2 px-8 py-5 bg-white border-2 border-slate-200 text-slate-700 text-lg font-bold rounded-2xl hover:border-red-300 hover:text-red-600 transition-all shadow-sm">
              Voir la démo <ArrowRight className="w-5 h-5" />
            </button>
          </div>

          {/* Social proof */}
          <div className="flex items-center gap-4 justify-center">
            <div className="flex -space-x-3">
              {["/images/garcon1.jpg", "/images/filleblanche1.jpg", "/images/garcon2.jpg", "/images/garcon3.jpg"].map((src, i) => (
                <div key={i} className="w-12 h-12 rounded-full border-4 border-white shadow-md overflow-hidden">
                   <img src={src} alt="" className="w-full h-full object-cover" loading="lazy" />
                </div>
              ))}
            </div>
            <div className="text-left">
              <div className="flex items-center gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="w-4 h-4 text-yellow-400 fill-yellow-400" />
                ))}
              </div>
              <p className="text-sm text-slate-600 font-medium mt-1">
                <strong className="text-slate-900">4.9/5</strong> par 1,850+ créateurs
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* DÉMO VIDÉO */}
      <section id="demo" className="py-24 bg-white">
        <div className="max-w-6xl mx-auto px-6">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-black text-slate-900 mb-4">
              Voyez Youbook en action
            </h2>
            <p className="text-xl text-slate-600">
              De la vidéo YouTube au concept d'eBook en 30 secondes
            </p>
          </div>

          {/* Vidéo Cloudinary */}
          <div className="relative bg-slate-900 rounded-3xl overflow-hidden shadow-2xl">
            <video 
              src="https://res.cloudinary.com/dcmlw5hak/video/upload/v1766645103/youbook_xurmq0.mov" 
              className="w-full h-full object-cover rounded-3xl" 
              controls 
              autoPlay 
              muted 
              loop 
              playsInline
            />
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section id="how" className="py-24 bg-slate-50">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Comment ça marche
            </h2>
            <p className="text-xl text-slate-600">
              3 étapes pour passer de YouTube à votre eBook
            </p>
          </div>

          <div className="grid lg:grid-cols-3 gap-8">
            
            {/* Étape 1 */}
            <div className="relative p-10 bg-white rounded-3xl border-2 border-red-200 shadow-lg hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-red-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg">
                1
              </div>
              <Youtube className="w-12 h-12 text-red-600 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">Collez l'URL YouTube</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Entrez simplement le lien de n'importe quelle vidéo YouTube. Notre IA récupère automatiquement la transcription.
              </p>
              <div className="bg-red-50 border border-red-200 rounded-xl p-4 font-mono text-sm flex items-center gap-2">
                <Youtube className="w-4 h-4 text-red-600" />
                <span className="truncate text-slate-700">youtube.com/watch?v=...</span>
              </div>
            </div>

            {/* Étape 2 */}
            <div className="relative p-10 bg-white rounded-3xl border-2 border-orange-200 shadow-lg hover:-translate-y-2 transition-all duration-300">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-orange-600 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg">
                2
              </div>
              <Wand2 className="w-12 h-12 text-orange-600 mb-6" />
              <h3 className="text-2xl font-bold text-slate-900 mb-4">L'IA analyse le contenu</h3>
              <p className="text-slate-600 leading-relaxed mb-6">
                Gemini extrait les points clés, identifie le ton et l'audience, puis génère titre + description optimisés.
              </p>
              <ul className="space-y-3">
                {["Titre accrocheur", "Description vendeuse", "Ton & Audience"].map((item) => (
                  <li key={item} className="flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-green-500" />
                    <span className="text-sm font-semibold text-slate-700">{item}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Étape 3 */}
            <div className="relative p-10 bg-gradient-to-br from-slate-900 to-slate-800 rounded-3xl shadow-2xl hover:-translate-y-2 transition-all duration-300 text-white border-2 border-slate-700">
              <div className="absolute -top-4 -right-4 w-16 h-16 bg-gradient-to-br from-red-500 to-rose-500 text-white rounded-full flex items-center justify-center font-black text-2xl shadow-lg">
                3
              </div>
              <FileText className="w-12 h-12 text-red-400 mb-6" />
              <h3 className="text-2xl font-bold mb-4">Créez l'eBook (optionnel)</h3>
              <p className="text-slate-300 leading-relaxed mb-6">
                Utilisez le concept ou générez l'eBook complet en 1 clic avec Bookzy (2 000 FCFA).
              </p>
              <div className="bg-white/10 border border-white/20 rounded-xl p-4">
                <p className="text-sm text-slate-200 mb-2">
                  ✓ eBook 30-50 pages<br/>
                  ✓ PDF professionnel<br/>
                  ✓ Kit marketing inclus
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* POURQUOI YOUBOOK */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-6">
              Pourquoi Youbook ?
            </h2>
            <p className="text-xl text-slate-600">
              La solution la plus rapide et efficace pour monétiser des vidéos youtube
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            
            {/* Avantage 1 */}
            <div className="bg-gradient-to-br from-red-50 to-orange-50 p-8 rounded-2xl border-2 border-red-100 hover:border-red-300 transition-all">
              <div className="w-14 h-14 bg-red-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Zap className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Ultra-rapide</h3>
              <p className="text-slate-700 leading-relaxed">
                <strong className="text-red-600">30 secondes chrono</strong> pour passer d'une vidéo YouTube à un concept d'eBook validé. Fini les heures de brainstorming.
              </p>
            </div>

            {/* Avantage 2 */}
            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 p-8 rounded-2xl border-2 border-blue-100 hover:border-blue-300 transition-all">
              <div className="w-14 h-14 bg-blue-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Sparkles className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">IA de pointe</h3>
              <p className="text-slate-700 leading-relaxed">
                Propulsé par <strong className="text-blue-600">Bookzy AI</strong>. Analyse sémantique avancée qui comprend vraiment le contenu de vos vidéos.
              </p>
            </div>

            {/* Avantage 3 */}
            <div className="bg-gradient-to-br from-green-50 to-emerald-50 p-8 rounded-2xl border-2 border-green-100 hover:border-green-300 transition-all">
              <div className="w-14 h-14 bg-green-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Target className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Optimisé vente</h3>
              <p className="text-slate-700 leading-relaxed">
                Titres <strong className="text-green-600">testés pour convertir</strong>. Descriptions qui donnent envie d'acheter. Marketing intégré dès le départ.
              </p>
            </div>

            {/* Avantage 4 */}
            <div className="bg-gradient-to-br from-purple-50 to-pink-50 p-8 rounded-2xl border-2 border-purple-100 hover:border-purple-300 transition-all">
              <div className="w-14 h-14 bg-purple-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <Users className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Audience détectée</h3>
              <p className="text-slate-700 leading-relaxed">
                L'IA identifie automatiquement <strong className="text-purple-600">qui achètera</strong> votre eBook (débutants, experts, entrepreneurs...).
              </p>
            </div>

            {/* Avantage 5 */}
            <div className="bg-gradient-to-br from-orange-50 to-yellow-50 p-8 rounded-2xl border-2 border-orange-100 hover:border-orange-300 transition-all">
              <div className="w-14 h-14 bg-orange-600 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <CheckCircle2 className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black text-slate-900 mb-4">Zéro compétence</h3>
              <p className="text-slate-700 leading-relaxed">
                Pas besoin d'être rédacteur ou marketeur. <strong className="text-orange-600">Collez l'URL, c'est tout</strong>. Le reste est automatique.
              </p>
            </div>

            {/* Avantage 6 */}
            <div className="bg-gradient-to-br from-slate-900 to-slate-800 p-8 rounded-2xl border-2 border-slate-700 text-white hover:border-slate-600 transition-all">
              <div className="w-14 h-14 bg-gradient-to-br from-red-500 to-rose-500 rounded-2xl flex items-center justify-center mb-6 shadow-lg">
                <TrendingUp className="w-7 h-7 text-white" />
              </div>
              <h3 className="text-xl font-black mb-4">ROI immédiat</h3>
              <p className="text-slate-300 leading-relaxed">
                <strong className="text-white">Gratuit pour tester</strong>, 2 000 FCFA pour créer l'eBook. Rentabilisé dès la 1ère vente à 5 000 FCFA.
              </p>
            </div>

          </div>

          {/* Stats bottom */}
          <div className="mt-16 grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            <div>
              <div className="text-4xl font-black text-red-600 mb-2">30s</div>
              <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">Temps d'analyse</div>
            </div>
            <div>
              <div className="text-4xl font-black text-blue-600 mb-2">1,850+</div>
              <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">Créateurs actifs</div>
            </div>
            <div>
              <div className="text-4xl font-black text-green-600 mb-2">98%</div>
              <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">Satisfaction</div>
            </div>
            <div>
              <div className="text-4xl font-black text-orange-600 mb-2">3/jour</div>
              <div className="text-sm font-bold text-slate-600 uppercase tracking-wide">Analyses gratuites</div>
            </div>
          </div>
        </div>
      </section>

      {/* TÉMOIGNAGES */}
      <section className="py-24 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-20">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Ce qu'ils en disent</h2>
            <p className="text-xl text-slate-600">Des créateurs comme vous qui ont converti leurs vidéos</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {[
              {
                name: "Koffi M.",
                avatar: "/images/garcon1.jpg",
                role: "Coach Marketing",
                quote: "J'ai converti ma vidéo la plus populaire. 423 ventes en 3 semaines. Youbook a changé mon business !",
                stats: "423 ventes"
              },
              {
                name: "Sarah D.",
                avatar: "/images/filleblanche1.jpg",
                role: "Nutritionniste",
                quote: "Le titre généré était 10x meilleur que le mien. J'ai doublé mes conversions. Incroyable outil.",
                stats: "612 ventes"
              },
              {
                name: "Ibrahim K.",
                avatar: "/images/garcon2.jpg",
                role: "Formateur",
                quote: "3 vidéos = 3 eBooks. 13 365€ de revenus passifs. C'est du délire, merci Youbook !",
                stats: "13 365€"
              }
            ].map((testimonial, i) => (
              <div key={i} className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm hover:shadow-xl hover:border-red-200 transition-all">
                <div className="flex items-center gap-4 mb-6">
                  <img src={testimonial.avatar} alt={testimonial.name} className="w-14 h-14 rounded-full object-cover border-2 border-slate-100" loading="lazy" />
                  <div>
                    <div className="font-bold text-slate-900">{testimonial.name}</div>
                    <div className="text-sm text-slate-500">{testimonial.role}</div>
                  </div>
                </div>
                <div className="flex gap-1 mb-4">
                  {[1,2,3,4,5].map(s => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                </div>
                <p className="text-slate-600 italic mb-4">"{testimonial.quote}"</p>
                <div className="pt-4 border-t border-slate-100">
                  <span className="text-2xl font-black text-red-600">{testimonial.stats}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* PRICING */}
      <section id="pricing" className="py-24 bg-slate-50">
        <div className="max-w-5xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-black text-slate-900 mb-4">Tarifs simples et transparents</h2>
            <p className="text-xl text-slate-600">Commencez gratuitement, payez seulement si vous créez l'eBook</p>
          </div>

          <div className="grid md:grid-cols-2 gap-8">
            
            {/* Gratuit */}
            <div className="bg-white p-10 rounded-3xl border-2 border-slate-200 shadow-lg">
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black text-slate-900 mb-2">Analyse Gratuite</h3>
                <div className="text-5xl font-black text-slate-900 mb-2">0 FCFA</div>
                <p className="text-slate-600">Pour toujours</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "3 analyses par jour",
                  "Titre optimisé généré",
                  "Description marketing",
                  "Ton & audience détectés",
                  "Support 7j/7"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-green-500 flex-shrink-0" />
                    <span className="text-slate-700">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/register" className="block w-full text-center py-4 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all">
                Commencer gratuitement
              </Link>
            </div>

            {/* Payant */}
            <div className="relative bg-gradient-to-br from-red-600 to-rose-600 p-10 rounded-3xl shadow-2xl text-white">
              <div className="absolute -top-4 right-8 bg-yellow-400 text-slate-900 px-4 py-1 rounded-full text-xs font-black uppercase flex items-center gap-1">
                <Crown className="w-3 h-3" /> Populaire
              </div>
              
              <div className="text-center mb-8">
                <h3 className="text-2xl font-black mb-2">eBook Complet</h3>
                <div className="text-5xl font-black mb-2">2 000 FCFA</div>
                <p className="text-red-100">Par eBook généré</p>
              </div>
              
              <ul className="space-y-4 mb-8">
                {[
                  "Tout du plan Gratuit",
                  "eBook 30-50 pages généré",
                  "PDF professionnel prêt",
                  "Kit marketing complet",
                  "Couverture 3D incluse",
                  "Textes de vente optimisés"
                ].map((feature) => (
                  <li key={feature} className="flex items-center gap-3">
                    <Check className="w-5 h-5 text-white flex-shrink-0" />
                    <span className="text-white">{feature}</span>
                  </li>
                ))}
              </ul>

              <Link href="/auth/register" className="block w-full text-center py-4 bg-white text-red-600 font-bold rounded-xl hover:bg-red-50 transition-all">
                Créer mon premier eBook
              </Link>
            </div>

          </div>
        </div>
      </section>

      {/* FAQ */}
      <section id="faq" className="py-24 bg-white">
        <div className="max-w-3xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-black text-slate-900 mb-4">Questions Fréquentes</h2>
          </div>
          <div className="space-y-4">
            {[
              {
                question: "Comment fonctionne Youbook ?",
                answer: "Vous collez une URL YouTube, notre IA récupère la transcription, analyse le contenu avec Gemini, et génère un titre + description optimisés pour un eBook en 30 secondes."
              },
              {
                question: "C'est vraiment gratuit ?",
                answer: "Oui ! L'analyse est 100% gratuite (3 par jour). Vous ne payez que si vous décidez de générer l'eBook complet avec Bookzy (2 000 FCFA)."
              },
              {
                question: "Quelles vidéos puis-je convertir ?",
                answer: "Toute vidéo YouTube avec sous-titres/transcription : tutoriels, formations, podcasts, conférences, vlogs éducatifs, interviews, etc."
              },
              {
                question: "Que comprend le kit marketing ?",
                answer: "Le pack à 2 000 FCFA inclut : eBook PDF professionnel, couverture 3D, page de vente optimisée, emails de promotion, et textes pour réseaux sociaux."
              },
              {
                question: "Puis-je modifier le titre et la description ?",
                answer: "Absolument ! Les suggestions sont pré-remplies dans le formulaire Bookzy où vous pouvez tout personnaliser avant de générer l'eBook."
              }
            ].map((faq, index) => (
              <div key={index} className="bg-white border-2 border-slate-200 rounded-2xl overflow-hidden shadow-sm hover:shadow-md transition-shadow">
                <button 
                  onClick={() => setOpenFaq(openFaq === index ? -1 : index)}
                  className="w-full flex items-center justify-between p-6 text-left"
                >
                  <span className={`font-bold text-lg ${openFaq === index ? "text-red-600" : "text-slate-900"}`}>
                    {faq.question}
                  </span>
                  <ChevronDown className={`w-5 h-5 transition-transform duration-300 ${openFaq === index ? "rotate-180 text-red-600" : "text-slate-400"}`} />
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openFaq === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                    {faq.answer}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* CTA FINAL */}
      <section className="py-32 bg-gradient-to-br from-red-600 to-rose-600 text-white text-center px-6">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-5xl md:text-6xl font-black mb-6">
            Prêt à transformer vos vidéos en revenus ?
          </h2>
          
          <p className="text-xl text-red-100 mb-12 max-w-2xl mx-auto">
            Rejoignez les 1 850+ créateurs qui utilisent Youbook pour monétiser leur contenu YouTube.
          </p>

          <Link href="/auth/register" className="inline-flex items-center gap-3 px-12 py-6 bg-white text-red-600 text-xl font-black rounded-2xl shadow-2xl hover:scale-105 transition-all">
            <Play className="w-6 h-6" fill="currentColor" />
            Commencer gratuitement
          </Link>

          <p className="mt-6 text-sm text-red-200">
            ✓ 0 FCFA · ✓ 3 analyses/jour · ✓ Sans carte bancaire
          </p>
        </div>
      </section>

      {/* FOOTER */}
      <footer className="bg-slate-950 text-white pt-20 pb-10">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-12 mb-16">
            
            <div className="col-span-2 md:col-span-1">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center">
                  <Youtube className="w-5 h-5" />
                </div>
                <span className="text-2xl font-black">Youbook</span>
              </div>
              <p className="text-slate-400 text-sm">
                Transformez vos vidéos YouTube en eBooks rentables avec l'IA.
              </p>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Produit</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#demo" onClick={(e) => { e.preventDefault(); smoothScrollTo('demo'); }} className="hover:text-white">Démo</a></li>
                <li><a href="#how" onClick={(e) => { e.preventDefault(); smoothScrollTo('how'); }} className="hover:text-white">Fonctionnement</a></li>
                <li><a href="#pricing" onClick={(e) => { e.preventDefault(); smoothScrollTo('pricing'); }} className="hover:text-white">Tarifs</a></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Ressources</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li><a href="#faq" onClick={(e) => { e.preventDefault(); smoothScrollTo('faq'); }} className="hover:text-white">FAQ</a></li>
                <li><Link href="/" className="hover:text-white">Bookzy</Link></li>
                <li><Link href="/niche-hunter" className="hover:text-white">Niche Hunter</Link></li>
              </ul>
            </div>

            <div>
              <h3 className="font-bold mb-4 text-sm uppercase tracking-wider">Contact</h3>
              <ul className="space-y-3 text-sm text-slate-400">
                <li className="flex items-center gap-2"><div className="w-2 h-2 bg-green-500 rounded-full"></div> Support 7j/7</li>
                <li><a href="mailto:support@bookzy.io" className="hover:text-white">support@bookzy.io</a></li>
              </ul>
            </div>

          </div>

          <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-500">
            <p>© 2025 Bookzy Inc. Tous droits réservés.</p>
            <div className="flex gap-6">
              <Link href="/legal/terms" className="hover:text-white">CGU</Link>
              <Link href="/legal/confidentialite" className="hover:text-white">Confidentialité</Link>
            </div>
          </div>
        </div>
      </footer>

    </div>
  );
}