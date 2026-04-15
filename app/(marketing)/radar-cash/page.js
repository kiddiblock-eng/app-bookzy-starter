"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Search, ChevronDown, Heart, Flame, CreditCard,
  Lock, Menu, X, Star, Check, TrendingUp, Eye, Zap, Target,
  Radio, DollarSign, BarChart2
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
const AD_CARDS = [
  {
    advertiser: "DigiLearn Academy",
    avatar: "DL",
    color: "#3b82f6",
    title: "Comment générer 500€/mois avec un ebook sur WhatsApp",
    running: "Actif depuis 47 jours",
    budget: "Élevé",
    niche: "Business en ligne",
    score: 94,
    isFav: true,
  },
  {
    advertiser: "SantéNaturelle CI",
    avatar: "SN",
    color: "#10b981",
    title: "Les 7 plantes africaines qui font maigrir sans régime",
    running: "Actif depuis 63 jours",
    budget: "Très élevé",
    niche: "Santé & bien-être",
    score: 91,
    isFav: false,
  },
  {
    advertiser: "FemmePower SN",
    avatar: "FP",
    color: "#ec4899",
    title: "Guide complet : lancer sa boutique en ligne depuis Dakar",
    running: "Actif depuis 31 jours",
    budget: "Moyen",
    niche: "Entrepreneuriat féminin",
    score: 87,
    isFav: false,
  },
  {
    advertiser: "CryptoAfrique",
    avatar: "CA",
    color: "#f59e0b",
    title: "Investir en crypto depuis l'Afrique sans risquer ses économies",
    running: "Actif depuis 19 jours",
    budget: "Élevé",
    niche: "Finance",
    score: 83,
    isFav: false,
  },
  {
    advertiser: "CoachSport Douala",
    avatar: "CS",
    color: "#ef4444",
    title: "Programme musculation 30 jours sans salle ni matériel",
    running: "Actif depuis 28 jours",
    budget: "Moyen",
    niche: "Sport & fitness",
    score: 79,
    isFav: false,
  },
];

const TESTIMONIALS = [
  { name: "Mamadou K.", role: "Créateur d'ebooks", location: "Sénégal", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "Radar Cash m'a montré une pub active depuis 60 jours sur WhatsApp Business. J'ai créé ma version avec Bookzy. 850 000 FCFA en 19 jours.", revenue: "850K FCFA" },
  { name: "Aïcha D.", role: "Auteure indépendante", location: "Côte d'Ivoire", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg", quote: "J'ai vu une pub sur les plantes africaines active depuis 2 mois — signe que ça vend. J'ai copié l'angle, créé l'ebook, 1 278 ventes.", revenue: "1,2M FCFA" },
  { name: "Jean-Marc T.", role: "Formateur en ligne", location: "France", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg", quote: "Si quelqu'un paie pour une pub depuis 3 mois, c'est qu'il vend. Radar Cash m'a donné cette info. Je vends 3× plus cher que mes concurrents.", revenue: "2,3M FCFA" },
  { name: "Clara M.", role: "Consultante digitale", location: "Belgique", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/7fef677cbafd1e0f1f474ad0fa14a341.jpg", quote: "La logique est simple : une pub active depuis longtemps = un produit qui vend. Radar Cash me donne exactement ça.", revenue: "620K FCFA" },
  { name: "Kofi M.", role: "Entrepreneur numérique", location: "Ghana", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "En 1 semaine j'avais 3 ebooks en vente basés sur des pubs actives trouvées avec Radar Cash.", revenue: "490K FCFA" },
  { name: "Fatou S.", role: "Coach bien-être", location: "Mali", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg", quote: "Je cherchais une niche. Radar Cash m'a montré que la santé naturelle africaine avait des annonceurs actifs depuis des mois.", revenue: "730K FCFA" },
];
const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

// ── ILLUSTRATION ANIMÉE RADAR ─────────────────────────────────────────────────
function RadarIllustration() {
  return (
    <div style={{ position: 'relative', width: 180, height: 180, flexShrink: 0 }}>
      <style>{`
        @keyframes radar-spin3 { 0%{transform:rotate(0deg)} 100%{transform:rotate(360deg)} }
        @keyframes ping3 { 0%{transform:scale(0.8);opacity:1} 100%{transform:scale(2.5);opacity:0} }
        @keyframes pulse-ad { 0%,100%{opacity:0.4} 50%{opacity:1} }
      `}</style>
      {[1, 0.66, 0.33].map((s, i) => (
        <div key={i} style={{ position: 'absolute', inset: `${i * 30}px`, borderRadius: '50%', border: '1px solid rgba(245,158,11,0.2)' }} />
      ))}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', animation: 'radar-spin3 4s linear infinite', transformOrigin: 'center' }}>
        <div style={{ position: 'absolute', width: '50%', height: 1.5, background: 'linear-gradient(90deg, transparent, rgba(245,158,11,0.8))', right: '50%', top: '50%', transformOrigin: 'right center' }} />
      </div>
      {[[30, 35], [110, 55], [50, 110], [125, 100], [75, 65]].map(([x, y], i) => (
        <div key={i} style={{ position: 'absolute', left: x, top: y }}>
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', animation: `ping3 2.5s ${i * 0.5}s infinite` }} />
          <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#f59e0b', position: 'absolute', top: 0 }} />
        </div>
      ))}
      <div style={{ position: 'absolute', inset: 0, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
        <div style={{ width: 12, height: 12, borderRadius: '50%', background: '#f59e0b', boxShadow: '0 0 12px rgba(245,158,11,0.6)' }} />
      </div>
    </div>
  );
}

// ── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const links = [
    { label: "Comment ça marche", href: "#workflow" },
    { label: "Démo", href: "#dashboard" },
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
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-amber-600">Radar Cash</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)} className="text-sm font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">{l.label}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest">Connexion</Link>
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-700 transition-colors text-xs uppercase tracking-widest">
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
            <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)} className="text-sm font-black text-slate-700 uppercase tracking-widest py-1">{l.label}</a>
          ))}
          <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-slate-900 text-white font-black rounded-xl text-xs uppercase tracking-widest mt-2">
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
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex flex-col lg:flex-row items-center gap-12">
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2.5 px-4 py-2 border border-[#C8BFB0] rounded-full text-xs font-black uppercase tracking-[0.2em] text-slate-500 mb-8 bg-white/60">
              <span className="w-2 h-2 rounded-full bg-amber-500 animate-pulse" />
              Pubs Facebook actives en ce moment
            </div>
            <h1 className="font-black text-slate-900 tracking-tighter leading-[0.88] mb-6" style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}>
              Espionnez les pubs<br />
              <span className="text-amber-600">qui vendent.</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-xl mb-4 leading-relaxed">
              Une pub active depuis des semaines = un produit qui vend. Radar Cash scanne la Facebook Ads Library et vous montre exactement quoi créer.
            </p>
            <p className="text-slate-400 text-xs uppercase tracking-[0.25em] font-bold mb-10">Facebook Ads Library · Données réelles · Mis à jour en temps réel</p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-700 transition-colors text-sm uppercase tracking-widest">
                Espionner gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#dashboard" onClick={e => { e.preventDefault(); document.getElementById("dashboard")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex items-center gap-2 px-8 py-4 border border-[#C8BFB0] text-slate-700 font-bold rounded-xl hover:border-slate-400 transition-colors text-sm uppercase tracking-widest">
                <Eye className="w-4 h-4" /> Voir la démo
              </a>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <RadarIllustration />
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {[
                { val: "Gratuit", label: "Pour démarrer" },
                { val: "Réelles", label: "Données FB Ads" },
                { val: "24h", label: "Mis à jour" },
                { val: "100%", label: "Afrique ciblée" },
              ].map(s => (
                <div key={s.label} className="bg-white/60 border border-[#D6CFC4] rounded-xl py-3 px-3 text-center">
                  <p className="text-lg font-black text-slate-900">{s.val}</p>
                  <p className="text-[9px] text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── LOGIQUE DERRIÈRE ──────────────────────────────────────────────────────────
function LogiqueSection() {
  return (
    <section className="bg-slate-900 py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "📡", title: "Une pub active depuis 30+ jours", desc: "Facebook Ads coûte de l'argent. Si quelqu'un continue de diffuser, c'est qu'il rentre dans ses frais. C'est la preuve la plus fiable qu'un sujet vend." },
            { icon: "🎯", title: "Radar Cash scanne pour vous", desc: "On interroge la Facebook Ads Library en temps réel. On extrait les annonceurs actifs, la durée de leurs campagnes, et le contenu de leurs pubs." },
            { icon: "⚡", title: "Vous créez votre version", desc: "Vous voyez ce qui marche. Vous créez votre ebook sur le même sujet avec Bookzy en 60 secondes. Vous vendez à votre audience." },
          ].map((item, i) => (
            <div key={i} className="bg-white/5 border border-white/10 rounded-2xl p-6">
              <div className="text-3xl mb-4">{item.icon}</div>
              <h3 className="font-black text-white text-base mb-2 tracking-tight">{item.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed">{item.desc}</p>
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
    { val: "all", label: "Toutes" },
    { val: "hot", label: "Longue durée 🔥" },
    { val: "rising", label: "Récentes" },
    { val: "niche", label: "Par niche" },
  ];

  return (
    <section id="dashboard" className="bg-[#EDE8E0] py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-7xl mx-auto">
        <div className="mb-10 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Aperçu du dashboard</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Les pubs actives,<br />en clair devant vous.
            </h2>
            <p className="text-slate-500 text-sm md:max-w-xs">Filtrez par niche, durée, budget. Repérez les sujets qui vendent. Créez en un clic.</p>
          </div>
        </div>

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
              <span className="text-xs text-slate-400 font-mono truncate">app.bookzy.io/dashboard/radar-cash</span>
            </div>
          </div>

          {/* Header dashboard */}
          <div className="bg-white border-b border-slate-200 px-4">
            <div className="h-12 flex items-center justify-between gap-4">
              <h1 className="text-base font-bold text-slate-900 whitespace-nowrap flex items-center gap-2">
                <Radio className="w-4 h-4 text-amber-500" /> Radar Cash
              </h1>
              <div className="flex-1 max-w-sm">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-slate-400" />
                  <div className="w-full pl-9 pr-4 py-1.5 bg-slate-100 rounded-lg text-xs text-slate-400">Rechercher un sujet ou annonceur...</div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <div className="hidden sm:flex items-center gap-1.5 px-2.5 py-1.5 bg-amber-50 border border-amber-200 rounded-lg">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
                  <span className="text-xs font-semibold text-amber-700">Live</span>
                </div>
              </div>
            </div>
            <div className="py-2.5 flex items-center gap-2 overflow-x-auto">
              {filters.map(f => (
                <button key={f.val} onClick={() => setActiveFilter(f.val)}
                  className={`flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border transition-all ${activeFilter === f.val ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"}`}>
                  {f.label}
                </button>
              ))}
              {["Niche", "Durée", "Budget"].map(f => (
                <button key={f} className="flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-medium whitespace-nowrap border bg-white text-slate-700 border-slate-200 hover:border-slate-300">
                  {f} <ChevronDown className="w-3 h-3" />
                </button>
              ))}
            </div>
          </div>

          {/* Contenu */}
          <div className="max-w-7xl mx-auto px-4 py-5 bg-white">
            <div className="flex items-center gap-2 mb-4">
              <Flame className="w-4 h-4 text-amber-500" />
              <h2 className="text-sm font-semibold text-slate-900">Pubs actives en ce moment</h2>
              <span className="text-xs text-slate-400">• Facebook Ads Library</span>
            </div>

            <div className="relative">
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
                {AD_CARDS.map((ad, i) => (
                  <AdCardMockup key={i} ad={ad} blurred={i >= 3} />
                ))}
              </div>

              <div className="absolute bottom-0 left-0 right-0 h-48 flex flex-col items-center justify-end pb-5"
                style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 35%, white 70%)" }}>
                <div className="text-center px-4 max-w-xs">
                  <div className="inline-flex items-center justify-center w-10 h-10 bg-slate-900 rounded-xl mb-2.5">
                    <Lock size={16} className="text-white" />
                  </div>
                  <h3 className="text-sm font-bold text-slate-900 mb-1">Des centaines de pubs actives vous attendent</h3>
                  <p className="text-xs text-slate-500 mb-3">Créez un compte gratuit pour accéder aux pubs actives sur Facebook Ads Library.</p>
                  <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-slate-900 text-white rounded-xl text-xs font-bold w-full">
                    Accéder gratuitement
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2 mt-5">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Données réelles issues de la Facebook Ads Library — mises à jour quotidiennement
        </p>
      </div>
    </section>
  );
}

function AdCardMockup({ ad, blurred }) {
  return (
    <div className={`rounded-xl border border-slate-200 bg-white overflow-hidden ${blurred ? "blur-sm opacity-40 pointer-events-none" : "hover:shadow-sm hover:border-slate-300"}`}>
      <div className="p-3.5">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-full flex items-center justify-center text-[9px] font-black text-white flex-shrink-0" style={{ background: ad.color }}>{ad.avatar}</div>
            <span className="text-[10px] font-bold text-slate-700 truncate max-w-[80px]">{ad.advertiser}</span>
          </div>
          <Heart className={`w-3.5 h-3.5 flex-shrink-0 ${ad.isFav ? "fill-red-500 text-red-500" : "text-slate-300"}`} />
        </div>
        <h3 className="text-xs font-bold text-slate-900 leading-snug line-clamp-2 mb-2">{ad.title}</h3>
        <div className="space-y-1.5 mb-3">
          <div className="flex items-center gap-1.5">
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
            <span className="text-[10px] text-slate-500">{ad.running}</span>
          </div>
          <div className="flex items-center gap-1.5">
            <BarChart2 className="w-3 h-3 text-amber-500" />
            <span className="text-[10px] text-slate-500">Budget {ad.budget}</span>
          </div>
        </div>
        <div className="flex items-center justify-between">
          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-slate-100 text-slate-600">{ad.niche}</span>
          <span className="text-[10px] font-black text-amber-600">{ad.score}/100</span>
        </div>
        <div className="mt-2.5 text-[10px] text-slate-400 flex items-center gap-0.5 hover:text-slate-700 cursor-pointer">
          Créer un ebook <ArrowRight className="w-2.5 h-2.5" />
        </div>
      </div>
    </div>
  );
}

// ── COMMENT ÇA MARCHE ─────────────────────────────────────────────────────────
function Workflow() {
  return (
    <section id="workflow" className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-14 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Le flow complet</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Espionnez. Validez.<br />Créez en 60 secondes.
          </h2>
        </div>

        {/* Avant / Après */}
        <div className="bg-white border border-[#D6CFC4] rounded-2xl overflow-hidden mb-8">
          <div className="grid md:grid-cols-2 divide-y md:divide-y-0 md:divide-x divide-[#E8E2D9]">
            <div className="p-8">
              <p className="text-xs font-black uppercase tracking-widest text-slate-300 mb-5">Sans Radar Cash</p>
              <div className="space-y-3">
                {[["5–7 jours", "Recherche manuelle, incertitude totale"], ["Résultat risqué", "Personne ne sait si ça va vendre"]].map(([time, desc]) => (
                  <div key={desc} className="flex items-start gap-4">
                    <span className="text-sm font-black text-slate-300 w-28 flex-shrink-0">{time}</span>
                    <span className="text-sm text-slate-500">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
            <div className="p-8 bg-slate-900">
              <p className="text-xs font-black uppercase tracking-widest text-amber-500/60 mb-5">Avec Radar Cash</p>
              <div className="space-y-3">
                {[["30 secondes", "Vous voyez ce qui se vend en ce moment"], ["Validé par les données", "Si la pub tourne, le sujet vend"]].map(([time, desc]) => (
                  <div key={desc} className="flex items-start gap-4">
                    <span className="text-sm font-black text-amber-400 w-28 flex-shrink-0">{time}</span>
                    <span className="text-sm text-white/60">{desc}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* 3 étapes */}
        <div className="grid md:grid-cols-3 gap-5">
          {[
            {
              num: "01", label: "Espionner", dark: false,
              title: "Trouvez les pubs actives",
              desc: "Radar Cash scanne la Facebook Ads Library. Vous voyez les annonceurs qui diffusent activement des pubs sur votre niche, depuis combien de temps et avec quel budget.",
              points: ["Durée de diffusion de la pub", "Budget estimé de l'annonceur", "Contenu et angle de la pub", "Score de rentabilité /100"],
            },
            {
              num: "02", label: "Valider", dark: true,
              title: "Confirmez avec le Validateur",
              desc: "Avant de créer, validez votre idée avec le Validateur d'idée. Score sur 100, concurrence, revenus estimés, pays qui achètent le plus.",
              points: ["Score de rentabilité /100", "Niveau de concurrence", "Revenus estimés/mois", "Meilleurs pays cibles"],
            },
            {
              num: "03", label: "Créer", dark: false,
              title: "Ebook pro en 60 secondes",
              desc: "Sujet validé ? Bookzy génère votre ebook complet. PDF professionnel avec cover 3D, kit marketing WhatsApp et posts réseaux sociaux inclus.",
              points: ["PDF A4 · 30 à 50 pages", "Cover 3D automatique", "Posts Facebook + Instagram", "Scripts WhatsApp prêts"],
            },
          ].map((s, i) => (
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
function Testimonials() {
  return (
    <section className="bg-[#EDE8E0] py-24 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 mb-12 px-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Témoignages</p>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Ils ont espionné.<br />Ils ont encaissé.</h2>
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
function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const isQ = billing === "quarterly";

  const PLANS = [
    { id: "solo",     name: "Pass Solo",     desc: "Pour démarrer",    price: 7500,  credits: 100, badge: null,        dark: false },
    { id: "createur", name: "Pack Créateur", desc: "Le plus populaire", price: 22000, credits: 400, badge: "Recommandé", dark: true  },
    { id: "agence",   name: "Pack Agence",   desc: "Pour les équipes", price: 45000, credits: 900, badge: null,        dark: false },
  ];

  function fmt(n) {
    return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
  }

  return (
    <section id="pricing" className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-10 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Tarification</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Radar Cash est gratuit.<br />Payez uniquement pour créer.
            </h2>
            <div className="inline-flex bg-white border border-[#D6CFC4] rounded-full p-1 gap-1 self-start">
              {[{ id: "monthly", label: "Mensuel" }, { id: "quarterly", label: "Trimestriel", badge: "−15%" }].map(opt => (
                <button key={opt.id} onClick={() => setBilling(opt.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs font-black uppercase tracking-widest transition-all ${billing === opt.id ? "bg-slate-900 text-white" : "text-slate-500 hover:text-slate-900"}`}>
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

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {/* Gratuit */}
          <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 flex flex-col">
            <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-0.5">Gratuit</p>
            <p className="text-[10px] text-slate-300 mb-4">Pour explorer</p>
            <p className="text-3xl font-black text-slate-900 mb-1">0 <span className="text-base font-bold">FCFA</span></p>
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-5">4 crédits offerts</p>
            <div className="space-y-2 flex-1 mb-6">
              {[
                { label: "Radar Cash", cost: "Accès gratuit" },
                { label: "Générer un ebook", cost: "20 cr." },
                { label: "Ebook Designer", cost: "10 cr." },
                { label: "Validateur d'idée", cost: "4 cr." },
              ].map(f => (
                <div key={f.label} className="flex items-start justify-between gap-2">
                  <span className="text-xs text-slate-600 flex-shrink-0">{f.label}</span>
                  <span className="text-[10px] font-bold text-slate-400 text-right">{f.cost}</span>
                </div>
              ))}
            </div>
            <Link href="/auth/register" className="block w-full text-center py-3 rounded-xl font-black text-xs uppercase tracking-widest bg-slate-900 text-white hover:bg-slate-700 transition-colors">
              Commencer gratuitement
            </Link>
          </div>

          {PLANS.map(plan => {
            const priceDisplay = isQ ? Math.round(plan.price * 3 * 0.85) : plan.price;
            const creditsDisplay = isQ ? plan.credits * 3 : plan.credits;
            return (
              <div key={plan.id} className={`relative rounded-2xl p-6 border flex flex-col ${plan.dark ? "bg-slate-900 border-slate-800" : "bg-white border-[#C8BFB0]"}`}>
                {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-amber-500 text-white text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">{plan.badge}</div>}
                <p className={`text-xs font-black uppercase tracking-widest mb-0.5 ${plan.dark ? "text-white/30" : "text-slate-400"}`}>{plan.name}</p>
                <p className={`text-[10px] mb-4 ${plan.dark ? "text-white/20" : "text-slate-300"}`}>{plan.desc}</p>
                {isQ && <p className={`text-xs line-through mb-0.5 ${plan.dark ? "text-white/20" : "text-slate-300"}`}>{fmt(plan.price * 3)} FCFA</p>}
                <p className={`text-3xl font-black mb-0.5 ${plan.dark ? "text-white" : "text-slate-900"}`}>{fmt(priceDisplay)} <span className="text-base font-bold">FCFA</span></p>
                <p className={`text-[9px] font-black uppercase tracking-widest mb-1 ${plan.dark ? "text-white/20" : "text-slate-400"}`}>{isQ ? "/ trimestre" : "/ mois"}</p>
                <p className={`text-xs font-bold mb-5 ${plan.dark ? "text-amber-400/70" : "text-slate-500"}`}>{fmt(creditsDisplay)} crédits{isQ ? " / 3 mois" : " / mois"}</p>
                <div className="space-y-2 flex-1 mb-6">
                  {[
                    { label: "Radar Cash", cost: "Inclus" },
                    { label: "Générer un ebook", cost: "20 cr." },
                    { label: "Ebook Designer", cost: "10 cr." },
                    { label: "Validateur d'idée", cost: "4 cr." },
                    { label: "Niche Hunter", cost: plan.id === "solo" ? "3/jour" : plan.id === "createur" ? "8/jour" : "20/jour" },
                    { label: "Youbook", cost: plan.id === "solo" ? "2/jour" : plan.id === "createur" ? "8/jour" : "15/jour" },
                    { label: "Recharge crédits", cost: plan.id === "solo" ? "100 FCFA/cr" : "100 FCFA/cr" },
                  ].map(f => (
                    <div key={f.label} className="flex items-start justify-between gap-2">
                      <span className={`text-xs flex-shrink-0 ${plan.dark ? "text-white/60" : "text-slate-600"}`}>{f.label}</span>
                      <span className={`text-[10px] font-bold text-right ${plan.dark ? "text-amber-400/60" : "text-slate-400"}`}>{f.cost}</span>
                    </div>
                  ))}
                </div>
                <Link href="/auth/register" className={`block w-full text-center py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors ${plan.dark ? "bg-white text-slate-900 hover:bg-white/90" : "bg-slate-900 text-white hover:bg-slate-700"}`}>
                  Choisir ce plan
                </Link>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Les crédits s'accumulent et n'expirent pas · Radar Cash inclus dans tous les plans
        </p>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Comment fonctionne Radar Cash ?", a: "Radar Cash interroge la Facebook Ads Library en temps réel. On récupère les annonceurs actifs sur votre niche, la durée de leurs campagnes, le contenu de leurs pubs et le budget estimé. Une pub active depuis plusieurs semaines est la preuve qu'un sujet génère des ventes — c'est le signal le plus fiable qui existe." },
    { q: "Pourquoi une pub longue durée = sujet rentable ?", a: "Diffuser une pub sur Facebook coûte de l'argent. Si un annonceur continue de payer depuis 30, 60 ou 90 jours, c'est obligatoirement parce qu'il rentre dans ses frais. C'est une validation par le marché réel, bien plus fiable que les tendances Google ou TikTok." },
    { q: "L'accès est vraiment gratuit ?", a: "Oui. Radar Cash est accessible sans abonnement. Vous voyez les pubs actives avec les données principales. Les plans payants donnent accès à plus de résultats, aux filtres avancés et à des données plus détaillées." },
    { q: "Quelle différence avec Niche Hunter et le Validateur d'idée ?", a: "Radar Cash = pubs Facebook actives (ce que les autres vendent maintenant). Niche Hunter = IA qui génère 10 niches scorées à partir d'un mot-clé. Validateur d'idée = analyse approfondie d'une idée précise avec score, revenus, concurrence. Les trois se complètent : Radar Cash pour trouver, Niche Hunter pour explorer, Validateur pour confirmer." },
    { q: "Combien de crédits pour générer un ebook ?", a: "20 crédits par ebook complet. Avec le Pass Solo (100 crédits) : 5 ebooks/mois. Pack Créateur (400 crédits) : 20 ebooks/mois. Pack Agence (900 crédits) : 45 ebooks/mois. Les crédits s'accumulent et n'expirent jamais." },
    { q: "Les données sont-elles adaptées à l'Afrique ?", a: "Oui. On filtre les annonceurs qui ciblent les marchés francophones africains : Côte d'Ivoire, Sénégal, Cameroun, Mali, Bénin, Burkina Faso et la diaspora africaine. Les niches affichées sont celles qui convertissent sur ces marchés spécifiques." },
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
              <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)} className="w-full flex items-center justify-between p-5 text-left gap-4">
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
        <h2 className="font-black text-white tracking-tight leading-[0.9] mb-6" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
          Arrêtez de deviner.<br />
          <span className="text-amber-400">Copiez ce qui marche.</span>
        </h2>
        <p className="text-white/40 text-lg max-w-xl mx-auto mb-12">Pubs Facebook actives. Données réelles. Créez votre ebook en 60 secondes.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-10 py-4 bg-white text-slate-900 font-black rounded-xl hover:bg-white/90 transition-colors text-sm uppercase tracking-widest">
            <Radio className="w-4 h-4" /> Espionner gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 px-10 py-4 border border-white/10 text-white/60 font-black rounded-xl hover:border-white/20 hover:text-white/80 transition-colors text-sm uppercase tracking-widest">
            Voir Bookzy
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/20 uppercase tracking-widest">✓ Gratuit · ✓ Sans carte bancaire · ✓ Données Facebook Ads Library</p>
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
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center"><BookOpenSVG className="w-4 h-4 text-white" /></div>
              <span className="font-bold text-slate-900">Bookzy</span>
            </Link>
            <p className="text-sm text-slate-500 leading-relaxed">Espionnez les pubs Facebook actives. Créez des ebooks rentables.</p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Outils</h3>
            <ul className="space-y-3">
              {[["Radar Cash", "/radar-cash"], ["Niche Hunter", "/niche-hunter"], ["Validateur d'idée", "/dashboard/analyseur"], ["Ebook Designer", "/ebook-designer"]].map(([l, h]) => (
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
export default function RadarCashPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);

  if (!mounted) return <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C8BFB0] border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <>
      <Nav />
      <Hero />
      <LogiqueSection />
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