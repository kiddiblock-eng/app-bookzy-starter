"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Search, ChevronDown, Heart, Flame, CreditCard,
  Lock, Menu, X, Star, Check, Filter, Database as DatabaseIcon,
  TrendingUp, Eye, Zap, Clock
} from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

function BookOpenSVG(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
    </svg>
  );
}

// ── DONNÉES MOCKUP ────────────────────────────────────────────────────────────
const LATEST_TRENDS = [
  { title: "L'Armée Digitale : Créez vos propres Agents IA autonomes", network: "Facebook" },
  { title: "No-Code : Créez votre App sans coder", network: "Facebook" },
  { title: "Revenu Passif : L'Empire du Print-on-Demand", network: "Facebook" },
  { title: "Gagner sa vie avec la 3D pour débutants", network: "Instagram" },
  { title: "Comment créer un business SaaS en solo", network: "YouTube" },
];

const TREND_CARDS = [
  { title: "Comment lancer un business de Dropservicing automatisé depuis l'Afrique", network: "Multi-plateformes", age: "Il y a 3 mois", desc: "Le dropservicing consiste à vendre un service digital (ex : création de site,…", potential: 6000, growth: 83, difficulty: "Facile", isFav: true },
  { title: "Comment monétiser son compte TikTok depuis l'Afrique", network: "Multi-plateformes", age: "Il y a 3 mois", desc: "Monétiser un compte TikTok depuis l'Afrique est devenu bien plus accessibl…", potential: 8000, growth: null, difficulty: "Facile", isFav: false },
  { title: "Comment lancer un micro-business digital rentable (Afrique…", network: "Multi-plateformes", age: "Il y a 3 mois", desc: "Créer et vendre un produit digital (ebook, templates, mini-formulaire IA) est deven…", potential: 5000, growth: 50, difficulty: "Facile", isFav: false },
  { title: "IA Business : Automatisez 80% de votre job", network: "TikTok", age: "Il y a 1 sem", desc: "101 Prompts et outils IA pour déléguer vos tâches répétitives et gagner 2h par jour…", potential: 3000, growth: null, difficulty: "Facile", isFav: false },
  { title: "Maître du Solaire : Dépannez et gagnez gros", network: "TikTok", age: "Il y a 1 sem", desc: "Apprenez à installer et réparer les kits solaires domestiques. Un métier en or…", potential: 2000, growth: null, difficulty: "Facile", isFav: false },
];

// ── NAV ──────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "La base", href: "#dashboard" },
    { label: "Comment ça marche", href: "#workflow" },
    { label: "Tarifs", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const scrollTo = (e, href) => {
    e.preventDefault();
    setOpen(false);
    document.querySelector(href)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#F5F2ED]/90 backdrop-blur-md border-b border-[#C8BFB0]" : "bg-transparent"}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">
        <Link href="/" className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <BookOpenSVG className="w-4 h-4 text-white" />
          </div>
          <div className="flex flex-col leading-none">
            <span className="font-bold text-slate-900 text-base">Bookzy</span>
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Tendances</span>
          </div>
        </Link>

        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)}
              className="text-sm font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest">Connexion</Link>
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-700 transition-colors text-xs uppercase tracking-widest">
            Accès gratuit <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="md:hidden p-2 text-slate-600">
          {open ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {open && (
        <div className="md:hidden bg-[#F5F2ED] border-t border-[#C8BFB0] px-6 py-6 flex flex-col gap-4">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)}
              className="text-sm font-black text-slate-700 uppercase tracking-widest py-1">{l.label}</a>
          ))}
          <Link href="/auth/register"
            className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest mt-2">
            Accès gratuit <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      )}
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative bg-[#F5F2ED] pt-28 md:pt-36 pb-16 px-6 overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto text-center">

        <div className="inline-flex items-center gap-2.5 px-4 py-2 border border-[#C8BFB0] rounded-full text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8 bg-white/60">
          <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
          Mis à jour quotidiennement
        </div>

        <h1 className="font-black text-slate-900 tracking-tighter leading-[0.88] mb-6"
          style={{ fontSize: "clamp(3rem, 9vw, 7rem)" }}>
          Le radar des ebooks<br />
          <span className="text-amber-600">qui cartonnent.</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-10 leading-relaxed">
          31 000+ ebooks trackés en temps réel. Filtrez par niche, pays, croissance.
          Repérez ce qui se vend , créez votre version en 60 secondes avec l'IA.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-700 transition-colors text-sm uppercase tracking-widest">
            Accéder gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <a href="#dashboard" onClick={e => { e.preventDefault(); document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" }); }}
            className="inline-flex items-center gap-2 px-8 py-4 border border-[#C8BFB0] text-slate-700 font-bold rounded-xl hover:border-slate-400 transition-colors text-sm uppercase tracking-widest">
            <Eye className="w-4 h-4" /> Voir le dashboard
          </a>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 max-w-2xl mx-auto">
          {[
            { val: "31 000+", label: "Ebooks trackés" },
            { val: "8 000+",  label: "Ultra-HOT" },
            { val: "2 900+",  label: "En hausse" },
            { val: "Gratuit", label: "Pour démarrer" },
          ].map(s => (
            <div key={s.label} className="bg-white/60 border border-[#D6CFC4] rounded-2xl py-4 px-3">
              <p className="text-2xl md:text-3xl font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-1">{s.label}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── DASHBOARD MOCKUP ─────────────────────────────────────────────────────────
function DashboardMockup() {
  const [activeFilter, setActiveFilter] = useState("all");
  const filters = [
    { val: "all", label: "Tous" },
    { val: "hot", label: "Hot 🔥" },
    { val: "rising", label: "En hausse" },
    { val: "profitable", label: "Rentable" },
  ];

  return (
    <section id="dashboard" className="bg-[#EDE8E0] py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="relative z-10 max-w-7xl mx-auto">
        {/* Titre section */}
        <div className="mb-10 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Aperçu du dashboard</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Exactement ce que vous<br />voyez une fois connecté.
            </h2>
            <p className="text-slate-500 text-sm md:max-w-xs">
              Filtres avancés, métriques temps réel, top 5 du moment — tout est là dès la connexion.
            </p>
          </div>
        </div>

        {/* Fenêtre navigateur */}
        <div className="bg-white rounded-2xl border border-[#C8BFB0] shadow-xl overflow-hidden">

          {/* Chrome bar */}
          <div className="bg-slate-100 border-b border-slate-200 px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-emerald-400" />
            </div>
            <div className="flex-1 max-w-sm mx-auto bg-white border border-slate-200 rounded-md px-3 py-1 flex items-center gap-2">
              <div className="w-2.5 h-2.5 rounded-full bg-emerald-400 flex-shrink-0" />
              <span className="text-xs text-slate-400 font-mono truncate">app.bookzy.io/dashboard/trends</span>
            </div>
          </div>

          {/* Header sticky dashboard */}
          <div className="bg-white border-b border-slate-200">
            <div className="max-w-7xl mx-auto px-4">
              <div className="h-12 flex items-center justify-between gap-4">
                <h1 className="text-base font-bold text-slate-900 whitespace-nowrap">Tendances</h1>

                {/* Search bar */}
                <div className="flex-1 max-w-sm">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                    <div className="w-full pl-9 pr-4 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-400">
                      Rechercher une tendance...
                    </div>
                  </div>
                </div>

                {/* Actions */}
                <div className="flex items-center gap-2">
                  <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-100 rounded-lg">
                    <CreditCard size={11} className="text-slate-500" />
                    <span className="text-xs font-semibold text-slate-700">60 cr.</span>
                  </div>
                  <div className="flex items-center gap-1.5 px-2.5 py-1.5 text-slate-600 bg-slate-100 rounded-lg">
                    <Heart className="w-3.5 h-3.5" />
                    <span className="hidden sm:inline text-xs font-medium">Favoris</span>
                  </div>
                </div>
              </div>

              {/* Filter pills */}
              <div className="py-2.5 flex items-center gap-2 overflow-x-auto">
                {filters.map(f => (
                  <button key={f.val} onClick={() => setActiveFilter(f.val)}
                    className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${
                      activeFilter === f.val
                        ? "bg-slate-900 text-white border-slate-900"
                        : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
                    }`}>
                    {f.label}
                    <ChevronDown className="w-3 h-3" />
                  </button>
                ))}
                {["Réseau", "Catégorie", "Période", "Difficulté"].map(f => (
                  <button key={f}
                    className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border bg-white text-slate-700 border-slate-200 hover:border-slate-300">
                    {f} <ChevronDown className="w-3 h-3" />
                  </button>
                ))}
              </div>
            </div>
          </div>

          {/* Contenu dashboard */}
          <div className="max-w-7xl mx-auto px-4 py-5 bg-white">

            {/* Top 5 tendances du moment */}
            <div className="mb-6">
              <div className="flex items-center gap-2 mb-3">
                <Flame className="w-4 h-4 text-orange-500" />
                <h2 className="text-sm font-semibold text-slate-900">Tendances du moment</h2>
                <span className="text-xs text-slate-400">• Dernières ajoutées</span>
              </div>

              <div className="grid grid-cols-5 gap-4 border-b border-slate-100 pb-5">
                {LATEST_TRENDS.map((t, i) => (
                  <div key={i} className={`${i >= 3 ? "opacity-30 blur-[3px] pointer-events-none select-none relative" : ""}`}>
                    {i === 3 && (
                      <div className="absolute inset-0 flex items-start justify-end z-10 pt-0.5 pr-0.5">
                        <span className="inline-flex items-center gap-1 bg-slate-900 text-white text-[9px] font-bold px-2 py-1 rounded-lg whitespace-nowrap">
                          <Lock className="w-2.5 h-2.5" /> Débloquer — 2 cr.
                        </span>
                      </div>
                    )}
                    <p className="text-xs font-semibold text-slate-900 leading-snug line-clamp-3 mb-0.5">{t.title}</p>
                    <p className="text-[10px] text-slate-400">{t.network}</p>
                  </div>
                ))}
              </div>
            </div>

            {/* Compteur */}
            <div className="flex items-center justify-between mb-3">
              <p className="text-xs text-slate-500">10 tendances affichées sur des centaines</p>
            </div>

            {/* Grille principale */}
            <div className="relative">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 pointer-events-none select-none">
                {TREND_CARDS.map((t, i) => (
                  <TrendCardMockup key={i} t={t} blurred={i >= 3} />
                ))}
                {/* Placeholder flouté supplémentaire pour remplir la rangée */}
                <div className="blur-sm opacity-30 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="flex justify-between mb-2.5">
                    <div className="flex gap-1.5">
                      <div className="w-20 h-2.5 bg-slate-200 rounded" />
                      <div className="w-14 h-2.5 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded mb-1.5" />
                  <div className="w-3/4 h-3 bg-slate-200 rounded mb-3" />
                  <div className="w-full h-2 bg-slate-200 rounded mb-1" />
                  <div className="w-2/3 h-2 bg-slate-200 rounded mb-3" />
                  <div className="flex justify-between">
                    <div className="w-12 h-4 bg-slate-200 rounded-full" />
                    <div className="w-20 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="blur-sm opacity-30 rounded-xl border border-slate-100 bg-slate-50 p-3.5">
                  <div className="flex justify-between mb-2.5">
                    <div className="flex gap-1.5">
                      <div className="w-16 h-2.5 bg-slate-200 rounded" />
                      <div className="w-16 h-2.5 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded mb-1.5" />
                  <div className="w-4/5 h-3 bg-slate-200 rounded mb-3" />
                  <div className="w-full h-2 bg-slate-200 rounded mb-1" />
                  <div className="w-1/2 h-2 bg-slate-200 rounded mb-3" />
                  <div className="flex justify-between">
                    <div className="w-12 h-4 bg-slate-200 rounded-full" />
                    <div className="w-20 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
                <div className="blur-sm opacity-30 rounded-xl border border-slate-100 bg-slate-50 p-3.5 hidden lg:block">
                  <div className="flex justify-between mb-2.5">
                    <div className="flex gap-1.5">
                      <div className="w-12 h-2.5 bg-slate-200 rounded" />
                      <div className="w-18 h-2.5 bg-slate-200 rounded" />
                    </div>
                  </div>
                  <div className="w-full h-3 bg-slate-200 rounded mb-1.5" />
                  <div className="w-full h-3 bg-slate-200 rounded mb-3" />
                  <div className="w-full h-2 bg-slate-200 rounded mb-1" />
                  <div className="w-3/4 h-2 bg-slate-200 rounded mb-3" />
                  <div className="flex justify-between">
                    <div className="w-12 h-4 bg-slate-200 rounded-full" />
                    <div className="w-20 h-3 bg-slate-200 rounded" />
                  </div>
                </div>
              </div>

              {/* Overlay gradient + CTA — fidèle au vrai dashboard */}
              <div
                className="absolute bottom-0 left-0 right-0 h-64 flex flex-col items-center justify-end pb-5"
                style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 35%, white 70%)" }}
              >
                <div className="text-center px-4 max-w-xs">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl mb-2.5">
                    <Lock size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Des centaines de tendances vous attendent</h3>
                  <p className="text-xs text-slate-500 mb-3">Débloquez 50 tendances supplémentaires maintenant, ou passez au plan payant pour un accès illimité.</p>
                  <div className="flex flex-col gap-2">
                    <button className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold w-full">
                      Débloquer 50 tendances
                    </button>
                    <button className="inline-flex items-center justify-center gap-1.5 text-xs text-slate-500 hover:text-slate-900">
                      Ou passer au plan payant <ArrowRight size={11} />
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Badge "C'est le vrai dashboard" */}
        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 mt-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Interface réelle — ce que vous voyez dès la connexion
        </p>
      </div>
    </section>
  );
}

// TrendCard fidèle au vrai dashboard (capture d'écran)
function TrendCardMockup({ t, blurred }) {
  const potentialK = t.potential >= 1000 ? `$${Math.round(t.potential / 1000)}K` : `$${t.potential}`;
  return (
    <div className={`rounded-xl border border-slate-200 bg-white overflow-hidden transition-all ${blurred ? "blur-sm opacity-40 pointer-events-none" : "hover:shadow-sm hover:border-slate-300"}`}>
      <div className="p-3.5">
        {/* Ligne 1 : réseau · date · cœur */}
        <div className="flex items-center justify-between mb-2.5">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] text-slate-500">{t.network}</span>
            <span className="text-slate-200">·</span>
            <span className="text-[10px] text-slate-400">{t.age}</span>
          </div>
          <Heart className={`w-3.5 h-3.5 flex-shrink-0 ${t.isFav ? "fill-red-500 text-red-500" : "text-slate-300"}`} />
        </div>

        {/* Titre */}
        <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-1.5">{t.title}</h3>

        {/* Description */}
        <p className="text-[10px] text-slate-400 leading-relaxed line-clamp-2 mb-3">{t.desc}</p>

        {/* Potentiel + growth */}
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-bold text-slate-900">{potentialK}</span>
          <span className="text-[10px] text-slate-400">potentiel</span>
          {t.growth && (
            <span className="text-[10px] font-bold text-emerald-600 flex items-center gap-0.5">
              <TrendingUp className="w-2.5 h-2.5" />+{t.growth}%
            </span>
          )}
        </div>

        {/* Footer : badge difficulté + Créer un ebook */}
        <div className="flex items-center justify-between">
          <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-100">
            {t.difficulty}
          </span>
          <span className="text-[10px] text-slate-400 flex items-center gap-0.5">
            Créer un ebook <ArrowRight className="w-2.5 h-2.5" />
          </span>
        </div>
      </div>
    </div>
  );
}

// ── WORKFLOW ──────────────────────────────────────────────────────────────────
function Workflow() {
  const steps = [
    {
      num: "01", label: "Repérer",
      title: "Filtre, trouve, valide en 30 secondes",
      desc: "Filtres par niche, pays, niveau de concurrence, croissance. En 30 secondes tu sais exactement quoi créer.",
      points: ["Volume de recherche mensuel", "Score de croissance sur 30 jours", "Niveau de concurrence : Faible / Moyen / Fort", "Potentiel de revenus estimé"],
      dark: false,
    },
    {
      num: "02", label: "Créer",
      title: "L'IA génère l'ebook en 60 secondes",
      desc: "Bookzy rédige, met en page et génère un PDF professionnel. Kit marketing WhatsApp et posts réseaux sociaux inclus.",
      points: ["PDF A4 · 30 à 50 pages · Design magazine", "Textes de vente automatiques", "Posts Facebook + Instagram prêts", "Messages WhatsApp prêts à l'envoi"],
      dark: true,
    },
    {
      num: "03", label: "Vendre",
      title: "Boutique Smart Shop en ligne en 5 minutes",
      desc: "Configure ta boutique en quelques clics. Publie avec 5 crédits. Checkout intégré, aucune plateforme externe.",
      points: ["13 templates pro personnalisables", "Checkout intégré WhatsApp", "FOMO · témoignages · FAQ inclus", "Modifications gratuites après publication"],
      dark: false,
    },
  ];

  return (
    <section id="workflow" className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="mb-14 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Le combo gagnant</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Trouve. Crée. Vends.<br />En 1 heure top chrono.
          </h2>
        </div>

        {/* Avant / Après en haut */}
        <div className="bg-white border border-[#D6CFC4] rounded-2xl overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D9]">
            <div className="p-8">
              <p className="text-xs font-black uppercase tracking-widest text-slate-300 mb-5">Sans Bookzy</p>
              <div className="space-y-3">
                {[
                  ["5–7 jours", "Recherche · rédaction · design · marketing"],
                  ["Résultat incertain", "Peut-être personne n'en veut"],
                ].map(([time, desc]) => (
                  <div key={desc} className="flex items-start gap-4">
                    <span className="text-sm font-black text-slate-300 w-24 flex-shrink-0">{time}</span>
                    <span className="text-sm text-slate-500">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 bg-slate-900">
              <p className="text-xs font-black uppercase tracking-widest text-amber-500/60 mb-5">Avec Bookzy + Tendances</p>
              <div className="space-y-3">
                {[
                  ["7 minutes", "Repérer + Générer + Publier"],
                  ["Validé avant de créer", "Vous copiez ce qui se vend déjà"],
                ].map(([time, desc]) => (
                  <div key={desc} className="flex items-start gap-4">
                    <span className="text-sm font-black text-amber-400 w-24 flex-shrink-0">{time}</span>
                    <span className="text-sm text-white/60">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 étapes */}
        <div className="grid md:grid-cols-3 gap-5">
          {steps.map((s, i) => (
            <div key={i} className={`rounded-2xl p-8 border ${s.dark ? "bg-slate-900 border-slate-800" : "bg-white border-[#D6CFC4]"}`}>
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-xs font-black uppercase tracking-[0.3em] ${s.dark ? "text-white/20" : "text-slate-300"}`}>{s.num}</span>
                <span className={`text-xs font-black uppercase tracking-[0.2em] px-3 py-1 rounded-full ${s.dark ? "bg-amber-500/20 text-amber-400" : "bg-slate-100 text-slate-500"}`}>{s.label}</span>
              </div>
              <h3 className={`text-xl font-black tracking-tight mb-3 ${s.dark ? "text-white" : "text-slate-900"}`}>{s.title}</h3>
              <p className={`text-sm leading-relaxed mb-5 ${s.dark ? "text-white/50" : "text-slate-500"}`}>{s.desc}</p>
              <div className="space-y-2">
                {s.points.map(pt => (
                  <div key={pt} className="flex items-start gap-2.5">
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${s.dark ? "text-amber-400" : "text-emerald-500"}`} />
                    <span className={`text-xs font-bold ${s.dark ? "text-white/60" : "text-slate-600"}`}>{pt}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ──────────────────────────────────────────────────────────────
const TESTIMONIALS = [
  { name: "Mamadou K.",   role: "Créateur d'ebooks",      location: "Sénégal",       avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "J'ai trouvé un ebook à 847 ventes sur Tendances. J'ai créé ma version avec Bookzy. 850 000 FCFA en 19 jours.", revenue: "850K FCFA" },
  { name: "Aïcha D.",     role: "Auteure indépendante",   location: "Côte d'Ivoire",  avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",                         quote: "Tendances m'a montré l'idée. Le générateur a créé un ebook tellement pro. 1 278 ventes en un mois.", revenue: "1,2M FCFA" },
  { name: "Jean-Marc T.", role: "Formateur en ligne",     location: "France",         avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg", quote: "J'espionne avec Tendances, je crée avec Bookzy. Je vends 3× plus cher que mes concurrents.", revenue: "2,3M FCFA" },
  { name: "Clara M.",     role: "Consultante digitale",   location: "Belgique",       avatar: "https://sucesspro.io/wp-content/uploads/2025/10/7fef677cbafd1e0f1f474ad0fa14a341.jpg", quote: "La combinaison Tendances + Smart Shop est redoutable. Mon lien de vente a tourné en 48h.", revenue: "620K FCFA" },
  { name: "Kofi M.",      role: "Entrepreneur numérique", location: "Ghana",          avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "En 1 semaine j'avais 3 ebooks en vente. Tendances m'a dit quoi créer, Bookzy a tout fait.", revenue: "490K FCFA" },
  { name: "Fatou S.",     role: "Coach bien-être",        location: "Mali",           avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",                         quote: "Je ne savais pas quelle niche choisir. Tendances m'a ouvert les yeux sur la santé naturelle.", revenue: "730K FCFA" },
];
const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

function Testimonials() {
  return (
    <section className="bg-[#EDE8E0] py-24 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 mb-12 px-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Témoignages</p>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
          Ils ont trouvé la niche.<br />Ils ont encaissé.
        </h2>
      </div>
      {[0, 1].map(row => (
        <div key={row} className={`flex gap-5 mb-5 ${row === 1 ? "flex-row-reverse" : ""}`}
          style={{ animation: `marquee${row === 0 ? "" : "Rev"} 42s linear infinite`, width: "max-content" }}>
          {DOUBLED.map((t, i) => (
            <div key={i} className="w-80 flex-shrink-0 bg-white border border-[#C8BFB0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                {[0,1,2,3,4].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                <span className="ml-auto text-xs font-black text-emerald-600">{t.revenue}</span>
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-[#C8BFB0]" />
                <div>
                  <p className="text-xs font-black text-slate-900">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <style jsx>{`
        @keyframes marquee    { from { transform: translateX(0) }    to { transform: translateX(-50%) } }
        @keyframes marqueeRev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      `}</style>
    </section>
  );
}

// ── PRICING ───────────────────────────────────────────────────────────────────
function fmt(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
}

const PLANS_DATA = [
  {
    id: "solo", name: "Pass Solo", desc: "Pour démarrer",
    price: 5100, credits: 60, badge: null, dark: false,
    features: [
      { label: "Générer un ebook", cost: "20 cr." },
      { label: "Mise en page (Ebook Designer)", cost: "10 cr." },
      { label: "Publier Smart Shop", cost: "5 cr." },
      { label: "Youbook (vidéo YouTube)", cost: "2 gratuits/j puis 2 cr." },
      { label: "Niche Hunter", cost: "3 gratuits/j puis 1 cr." },
      { label: "Analyse niche", cost: "3 gratuits/j puis 1 cr." },
      { label: "Tendances", cost: "Inclus" },
      { label: "Support", cost: "Email" },
    ],
  },
  {
    id: "createur", name: "Pack Créateur", desc: "Le plus populaire",
    price: 19125, credits: 330, badge: "Recommandé", dark: true,
    features: [
      { label: "Générer un ebook", cost: "20 cr." },
      { label: "Mise en page (Ebook Designer)", cost: "10 cr." },
      { label: "Publier Smart Shop", cost: "5 cr." },
      { label: "Youbook (vidéo YouTube)", cost: "8 gratuits/j puis 2 cr." },
      { label: "Niche Hunter", cost: "8 gratuits/j puis 1 cr." },
      { label: "Analyse niche", cost: "8 gratuits/j puis 1 cr." },
      { label: "Tendances", cost: "Inclus" },
      { label: "Support", cost: "Email" },
    ],
  },
  {
    id: "agence", name: "Pack Agence", desc: "Pour les équipes",
    price: 31500, credits: 700, badge: null, dark: false,
    features: [
      { label: "Générer un ebook", cost: "20 cr." },
      { label: "Mise en page (Ebook Designer)", cost: "10 cr." },
      { label: "Publier Smart Shop", cost: "5 cr. · Multi boutiques" },
      { label: "Youbook (vidéo YouTube)", cost: "15 gratuits/j puis 2 cr." },
      { label: "Niche Hunter", cost: "20 gratuits/j puis 1 cr." },
      { label: "Analyse niche", cost: "20 gratuits/j puis 1 cr." },
      { label: "Tendances", cost: "Inclus" },
      { label: "Support", cost: "WhatsApp prioritaire" },
    ],
  },
];

function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const isQ = billing === "quarterly";

  return (
    <section id="pricing" className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-10 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Tarification</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Tendances est gratuit.<br />Payez uniquement pour créer.
            </h2>
            {/* Toggle mensuel / trimestriel */}
            <div className="inline-flex bg-white border border-[#D6CFC4] rounded-full p-1 gap-1 self-start md:self-auto">
              {[
                { id: "monthly", label: "Mensuel", badge: null },
                { id: "quarterly", label: "Trimestriel", badge: "−15%" },
              ].map(opt => (
                <button key={opt.id} onClick={() => setBilling(opt.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${billing === opt.id ? "bg-slate-900 text-white shadow-sm" : "text-slate-500 hover:text-slate-900"}`}>
                  {opt.label}
                  {opt.badge && <span className="bg-emerald-500 text-white text-[9px] font-black px-1.5 py-0.5 rounded-full">{opt.badge}</span>}
                </button>
              ))}
            </div>
          </div>
          <p className="text-slate-500 mt-3 text-sm">
            <span className="font-bold text-slate-900">Les crédits s'accumulent</span> et <span className="font-bold text-slate-900">n'expirent jamais.</span> · Paiement sécurisé · 13 pays · Aucun prélèvement automatique
          </p>
        </div>

        {/* Gratuit + 3 plans */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">

          {/* Plan gratuit */}
          <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 flex flex-col">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">Gratuit</p>
            <p className="text-[10px] text-slate-300 mb-4">Pour explorer</p>
            <p className="text-3xl font-black text-slate-900 mb-1">0 <span className="text-base font-bold">FCFA</span></p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">4 crédits offerts</p>
            <div className="space-y-2 flex-1 mb-6">
              {[
                { label: "Tendances", cost: "10 résultats gratuits · +50 pour 2 cr." },
                
                
                { label: "Générer un ebook", cost: "20 cr." },
                { label: "Mise en page", cost: "10 cr." },
                { label: "Smart Shop", cost: "5 cr." },
              ].map(f => (
                <div key={f.label} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-slate-600 flex-shrink-0">{f.label}</span>
                  <span className="text-[10px] font-bold text-slate-400 text-right">{f.cost}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/register"
              className="block w-full text-center py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-700 transition-colors">
              Commencer gratuitement
            </Link>
          </div>

          {/* 3 plans payants */}
          {PLANS_DATA.map(plan => {
            const priceDisplay = isQ ? Math.round(plan.price * 3 * 0.85) : plan.price;
            const creditsDisplay = isQ ? plan.credits * 3 : plan.credits;
            return (
              <div key={plan.id} className={`relative rounded-2xl p-6 border flex flex-col ${plan.dark ? "bg-slate-900 border-slate-800" : "bg-white border-[#C8BFB0]"}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}
                <p className={`text-xs font-black uppercase tracking-widest mb-0.5 ${plan.dark ? "text-white/30" : "text-slate-400"}`}>{plan.name}</p>
                <p className={`text-[10px] mb-4 ${plan.dark ? "text-white/20" : "text-slate-300"}`}>{plan.desc}</p>

                {isQ && (
                  <p className={`text-xs line-through mb-0.5 ${plan.dark ? "text-white/20" : "text-slate-300"}`}>
                    {fmt(plan.price * 3)} FCFA
                  </p>
                )}
                <p className={`text-3xl font-black mb-0.5 ${plan.dark ? "text-white" : "text-slate-900"}`}>
                  {fmt(priceDisplay)} <span className="text-base font-bold">FCFA</span>
                </p>
                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${plan.dark ? "text-white/20" : "text-slate-400"}`}>
                  {isQ ? "/ trimestre" : "/ mois"}
                </p>
                <p className={`text-xs font-bold mb-5 ${plan.dark ? "text-amber-400/70" : "text-slate-500"}`}>
                  {fmt(creditsDisplay)} crédits{isQ ? " / 3 mois" : " / mois"}
                </p>

                <div className="space-y-2 flex-1 mb-6">
                  {plan.features.map(f => (
                    <div key={f.label} className="flex items-start justify-between gap-2">
                      <span className={`text-xs flex-shrink-0 ${plan.dark ? "text-white/60" : "text-slate-600"}`}>{f.label}</span>
                      <span className={`text-[10px] font-bold text-right ${plan.dark ? "text-amber-400/60" : "text-slate-400"}`}>{f.cost}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/register"
                  className={`block w-full text-center py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors ${plan.dark ? "bg-white text-slate-900 hover:bg-white/90" : "bg-slate-900 text-white hover:bg-slate-700"}`}>
                  Choisir ce plan
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Les crédits s'accumulent et n'expirent pas · Tendances inclus dans tous les plans
        </p>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    {
      q: "Comment fonctionne la base de données Tendances ?",
      a: "Tendances agrège et analyse en temps réel les données de vente, de recherche et de tendances sur les marchés ebooks francophones. Chaque produit est scoré selon son volume de recherche mensuel, sa croissance sur 30 jours, son niveau de concurrence et son potentiel de revenus estimé. La base est mise à jour quotidiennement.",
    },
    {
      q: "L'accès à Tendances est vraiment gratuit ?",
      a: "Oui. Sans abonnement vous voyez 10 tendances avec tous les filtres. Vous pouvez débloquer 50 tendances supplémentaires pour 2 crédits (valable 24h glissantes). Vous recevez 4 crédits offerts à l'inscription. Les plans payants donnent un accès illimité à toute la base.",
    },
    {
      q: "Combien coûte chaque action en crédits ?",
      a: "Générer un ebook complet : 20 cr. · Mise en page Ebook Designer : 10 cr. · Publier une boutique Smart Shop : 5 cr. · Youbook (analyse vidéo YouTube) : gratuit selon quota du plan, puis 2 cr. · Niche Hunter : gratuit selon quota, puis 1 cr. · Analyse niche approfondie : gratuit selon quota, puis 1 cr. Débloquer 50 tendances : 2 cr.",
    },
    {
      q: "Quels sont les quotas gratuits par plan ?",
      a: "Pass Solo : Youbook 2/j · Niche Hunter 3/j · Analyse niche 3/j. Pack Créateur : 8/j pour chacun. Pack Agence : Youbook 15/j · Niche Hunter 20/j · Analyse niche 20/j. Sans abonnement : Niche Hunter 3/j · Analyse niche 3/j · Youbook non disponible.",
    },
    {
      q: "Quels filtres sont disponibles dans la base ?",
      a: "Vous filtrez par type (Hot 🔥, En hausse, Rentable), réseau (TikTok, Instagram, Facebook, YouTube), catégorie (Business, Finance, Santé, Tech…), période (aujourd'hui / 7 jours / 30 jours) et difficulté (Facile / Moyen / Difficile). Barre de recherche plein texte disponible.",
    },
    {
      q: "Les données sont-elles adaptées aux marchés africains ?",
      a: "Oui. L'algorithme est calibré pour les marchés francophones africains — Côte d'Ivoire, Sénégal, Cameroun, Mali, Bénin, Burkina Faso — et la diaspora africaine en France et en Belgique. Les volumes de recherche et niveaux de concurrence reflètent ces marchés spécifiques.",
    },
    {
      q: "Quelle différence entre Tendances, Niche Hunter et Bookzy ?",
      a: "Tendances = base de 31 000+ ebooks qui cartonnent déjà (ce que les autres vendent). Niche Hunter = IA qui analyse un mot-clé et génère 10 opportunités scorées (ce que vous pourriez créer). Bookzy = le générateur qui crée l'ebook complet en 60 secondes (20 cr.). Les trois sont complémentaires : repérez avec Tendances, affinez avec Niche Hunter, créez avec Bookzy.",
    },
    {
      q: "Les crédits expirent-ils ?",
      a: "Non. Les crédits s'accumulent et n'expirent jamais. Si vous avez 60 cr. ce mois et n'en utilisez que 30, les 30 restants s'ajoutent aux crédits du mois suivant.",
    },
  ];

  return (
    <section id="faq" className="bg-[#EDE8E0] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-12 pb-10 border-b border-[#C8BFB0] text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Questions fréquentes</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">FAQ</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-[#D6CFC4] rounded-xl overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left gap-4">
                <span className={`font-bold text-sm ${openIdx === i ? "text-amber-600" : "text-slate-900"}`}>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openIdx === i ? "rotate-180 text-amber-600" : "text-slate-300"}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${openIdx === i ? "max-h-64 opacity-100" : "max-h-0 opacity-0"}`}>
                <div className="px-5 pb-5 text-sm text-slate-500 leading-relaxed">{faq.a}</div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── CTA FINAL ─────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-6">Gratuit · Sans carte bancaire · Accès immédiat</p>
        <h2 className="font-black text-white tracking-tight leading-[0.9] mb-6"
          style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
          Arrêtez de deviner.<br />
          <span className="text-amber-400">Copiez ce qui marche.</span>
        </h2>
        <p className="text-white/40 text-lg max-w-xl mx-auto mb-12">
          31 000+ ebooks analysés. Filtres avancés. Créez votre ebook en 60 secondes.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register"
            className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 font-black rounded-xl hover:bg-white/90 transition-colors text-sm uppercase tracking-widest">
            <DatabaseIcon className="w-4 h-4" /> Accéder gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/niche-hunter"
            className="inline-flex items-center gap-2 px-10 py-4 border border-white/10 text-white/60 font-black rounded-xl hover:border-white/20 hover:text-white/80 transition-colors text-sm uppercase tracking-widest">
            Voir Niche Hunter
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#EDE8E0] border-t border-[#C8BFB0] pt-16 pb-8 px-6">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <BookOpenSVG className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">Bookzy</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">Le radar des ebooks qui cartonnent en Afrique francophone.</p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Produit</h3>
            <ul className="space-y-3">
              {[["Tendances", "/tendances"], ["Ebook Designer", "/ebook-designer"], ["Smart Shop", "/smart-shop"], ["Niche Hunter", "/niche-hunter"]].map(([l, h]) => (
                <li key={l}><Link href={h} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Communauté</h3>
            <ul className="space-y-3">
              {[["Suggestions", "/suggestions"], ["Nouveautés", "/changelog"], ["Blog", "/blog"]].map(([l, h]) => (
                <li key={l}><Link href={h} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li><a href="mailto:support@bookzy.io" className="text-sm text-slate-500 hover:text-slate-900">support@bookzy.io</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#C8BFB0] pt-8 flex flex-col sm:flex-row justify-between items-center gap-4">
          <p className="text-xs text-slate-400">© 2026 Bookzy. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/legal/confidentialite" className="text-xs text-slate-400 hover:text-slate-900">Confidentialité</Link>
            <Link href="/legal/terms" className="text-xs text-slate-400 hover:text-slate-900">CGU</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function TendancesPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) {
    return (
      <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-[#C8BFB0] border-t-slate-900 rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <>
      <Nav />
      <Hero />
      <DashboardMockup />
      <Workflow />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  );
}