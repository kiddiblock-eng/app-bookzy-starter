"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowRight, Check, Star, MessageCircle, Link as LinkIcon, Download, CreditCard, Package, Instagram, Youtube, Globe, Flame, HelpCircle, MessageSquare } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

// ── TEMPLATES (copie exacte du dashboard) ────────────────────────────────────
const TEMPLATES = [
  { id: "clean",     name: "Clean",     category: "classic",  bg: "bg-white",                                        text: "text-gray-900",   card: "bg-gray-50",         accent: "bg-gray-200" },
  { id: "stone",     name: "Stone",     category: "classic",  bg: "bg-gray-900",                                     text: "text-white",      card: "bg-gray-800",        accent: "bg-gray-700" },
  { id: "gradient",  name: "Gradient",  category: "classic",  bg: "bg-gradient-to-br from-violet-600 to-indigo-700", text: "text-white",      card: "bg-white/10",        accent: "bg-white/20" },
  { id: "warm",      name: "Warm",      category: "classic",  bg: "bg-gradient-to-br from-amber-50 to-orange-50",    text: "text-amber-900",  card: "bg-white",           accent: "bg-amber-100" },
  { id: "neon",      name: "Neon",      category: "modern",   bg: "bg-black",                                        text: "text-white",      card: "bg-gray-900/50",     accent: "bg-fuchsia-500/20", special: "neon" },
  { id: "minimal",   name: "Minimal",   category: "modern",   bg: "bg-neutral-50",                                   text: "text-neutral-900",card: "bg-white",           accent: "bg-neutral-100",    special: "minimal" },
  { id: "brutalist", name: "Brutalist", category: "modern",   bg: "bg-yellow-300",                                   text: "text-black",      card: "bg-white",           accent: "bg-black",          special: "brutalist" },
  { id: "glass",     name: "Glass",     category: "modern",   bg: "bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900", text: "text-white", card: "bg-white/10", accent: "bg-white/20", special: "glass" },
  { id: "love",      name: "Love",      category: "premium",  bg: "bg-gradient-to-b from-pink-100 to-rose-200",      text: "text-rose-900",   card: "bg-white",           accent: "bg-rose-200",       special: "love" },
  { id: "elegant",   name: "Elegant",   category: "premium",  bg: "bg-stone-200",                                    text: "text-stone-800",  card: "bg-white",           accent: "bg-amber-400",      special: "elegant" },
  { id: "playful",   name: "Playful",   category: "premium",  bg: "bg-gradient-to-r from-violet-200 via-pink-200 to-orange-200", text: "text-gray-800", card: "bg-white", accent: "bg-pink-300",      special: "playful" },
  { id: "nature",    name: "Nature",    category: "premium",  bg: "bg-gradient-to-b from-green-100 to-emerald-200",  text: "text-green-900",  card: "bg-white",           accent: "bg-green-300",      special: "nature" },
  { id: "midnight",  name: "Midnight",  category: "premium",  bg: "bg-gradient-to-b from-slate-900 to-indigo-950",   text: "text-white",      card: "bg-indigo-900/50",   accent: "bg-indigo-500/30",  special: "midnight" },
];

// Mockups ebooks pour le preview
// Covers ebooks — vraies couvertures style africain (CDN stable)
const EBOOK_COVERS = [
  "https://images.unsplash.com/photo-1547036967-23d11aacaee0?auto=format&fit=crop&w=120&h=160&q=80", // sombre/africain
  "https://images.unsplash.com/photo-1578662996442-48f60103fc96?auto=format&fit=crop&w=120&h=160&q=80", // chaleureux/or
  "https://images.unsplash.com/photo-1504198266287-1659872e6590?auto=format&fit=crop&w=120&h=160&q=80", // digital/tech
];

// Banners premium — Unsplash avec paramètres optimisés
const PREMIUM_BANNERS = {
  love:     "https://images.unsplash.com/photo-1518199266791-5375a83190b7?auto=format&fit=crop&w=400&h=120&q=80",
  elegant:  "https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?auto=format&fit=crop&w=400&h=120&q=80",
  playful:  "https://images.unsplash.com/photo-1523240795612-9a054b0db644?auto=format&fit=crop&w=400&h=120&q=80",
  nature:   "https://images.unsplash.com/photo-1441974231531-c6227db76b6e?auto=format&fit=crop&w=400&h=120&q=80",
  midnight: "https://images.unsplash.com/photo-1419242902214-272b3f66ee7a?auto=format&fit=crop&w=400&h=120&q=80",
};

// Produits démo pour le preview
const DEMO_PRODUCTS = [
  { _id: "p1", title: "Déblocage Africain : Attirez Ch...", description: "Marre de stagner pendant que les autres...", price: 500,  checkoutType: "whatsapp", buttonText: "Commander via WhatsApp", cover: EBOOK_COVERS[0], isActive: true },
  { _id: "p2", title: "Comment monétiser son com...",        description: "Vous avez le contenu, vous avez l'audien...", price: 1000, checkoutType: "link",      buttonText: "Accéder au guide",          cover: EBOOK_COVERS[1], isActive: true },
  { _id: "p3", title: "Pourquoi le digital est la mine...",  description: "🚀 De l'idée au eBook en 60 secondes c...", price: 0,    checkoutType: "free",      buttonText: "Télécharger gratuitement",   cover: EBOOK_COVERS[2], isActive: true },
];

const DEMO_FORM = {
  name: "Kofi Digital", slug: "kofi.digital", bio: "Entrepreneur | Formateur en business numérique 🚀",
  logo: "/bio.png", banner: null,
  socials: { instagram: "kofi.digital", youtube: "KofiDigital", tiktok: "", website: "" },
};

const TESTIMONIALS = [
  { name: "Marc Kouadio",  role: "Infopreneur",      location: "Abidjan",  avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "J'ai partagé mon lien Smart Shop sur WhatsApp et eu 5 ventes en 2 heures. Zéro technique, juste du contenu." },
  { name: "Aïcha Koné",    role: "Créatrice Food",   location: "Dakar",    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",                          quote: "Ma boutique est plus belle que les sites de mes concurrents qui ont payé des développeurs à 500 000 FCFA." },
  { name: "Yann Dubois",   role: "Formateur",        location: "Douala",   avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",  quote: "Le checkout WhatsApp est un génie. Les gens voient le bouton, cliquent, et me contactent directement. Taux de conversion incroyable." },
  { name: "Clara Martin",  role: "Coach Business",   location: "Paris",    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/7fef677cbafd1e0f1f474ad0fa14a341.jpg",  quote: "En 10 minutes j'avais une boutique pro avec mes 3 ebooks, un template Elegant, et un lien prêt à partager." },
  { name: "Kofi Mensah",   role: "Digital Marketer", location: "Accra",    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "Le FOMO '🔥 47 personnes ont acheté' a boosté mes conversions de façon notable. La preuve sociale ça marche." },
  { name: "Fatou Diallo",  role: "Entrepreneuse",    location: "Bamako",   avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",                          quote: "Mon premier lien Smart Shop a fait 5 ventes le jour même. Je n'aurais jamais cru que c'était si simple." },
];
const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

function BookOpenSVG(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

// ── PHONE PREVIEW (reproduction exacte du dashboard) ──────────────────────────
function PhonePreview({ templateId }) {
  const template = TEMPLATES.find(t => t.id === templateId) || TEMPLATES[4];
  const form = DEMO_FORM;
  const products = DEMO_PRODUCTS;

  return (
    <div className="relative mx-auto select-none" style={{ width: 260 }}>
      {/* Ombre portée */}
      <div className="absolute inset-0 rounded-[3rem] blur-2xl opacity-40" style={{ background: "rgba(0,0,0,0.5)", transform: "scale(0.95) translateY(8px)" }} />
      <div className="relative bg-black rounded-[3rem] p-3 shadow-2xl">
        {/* Notch */}
        <div className="absolute top-4 left-1/2 -translate-x-1/2 w-[80px] h-[26px] bg-black rounded-full z-20" />
        <div className={`w-full h-[500px] ${template.bg} rounded-[2.3rem] overflow-hidden relative`}>

          {/* Effets spéciaux */}
          {template.special === "neon" && (
            <>
              <div className="absolute inset-0 opacity-20 pointer-events-none" style={{ backgroundImage: `linear-gradient(rgba(217,70,239,0.3) 1px, transparent 1px), linear-gradient(90deg, rgba(217,70,239,0.3) 1px, transparent 1px)`, backgroundSize: "20px 20px" }} />
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-40 h-40 bg-fuchsia-500/30 rounded-full blur-[60px] pointer-events-none" />
            </>
          )}
          {template.special === "glass" && (
            <>
              <div className="absolute top-10 -left-10 w-32 h-32 bg-purple-500/30 rounded-full blur-[50px] pointer-events-none" />
              <div className="absolute bottom-10 -right-10 w-32 h-32 bg-blue-500/30 rounded-full blur-[50px] pointer-events-none" />
            </>
          )}

          <div className="h-full overflow-y-auto relative z-10">

            {/* Header premium */}
            {template.category === "premium" && (
              <div className="relative">
                <div className="h-20 overflow-hidden">
                  {PREMIUM_BANNERS[template.special] ? (
                    <img src={PREMIUM_BANNERS[template.special]} alt="" className="w-full h-full object-cover" />
                  ) : (
                    <div className={`w-full h-full ${
                      template.special === "love"     ? "bg-gradient-to-r from-pink-400 to-rose-400" :
                      template.special === "elegant"  ? "bg-gradient-to-b from-stone-700 to-stone-800" :
                      template.special === "playful"  ? "bg-gradient-to-r from-violet-500 via-pink-500 to-orange-400" :
                      template.special === "nature"   ? "bg-gradient-to-br from-green-500 to-emerald-600" :
                      template.special === "midnight" ? "bg-gradient-to-b from-indigo-800 to-slate-900" :
                      "bg-gray-300"
                    }`} />
                  )}
                </div>
                <div className="flex justify-center -mt-8">
                  {form.logo ? (
                    <img src={form.logo} alt="" className="w-16 h-16 object-cover shadow-xl rounded-full border-4 border-white" />
                  ) : (
                  <div className={`w-16 h-16 ${template.accent} flex items-center justify-center shadow-xl rounded-full border-4 border-white`}>
                    <span className={`text-xl font-bold ${template.text}`}>{form.name.charAt(0)}</span>
                  </div>
                  )}
                </div>
                <div className="text-center px-4 mt-2 mb-4">
                  <h2 className={`text-base font-bold ${template.text}`}>{form.name}</h2>
                  <p className={`text-[10px] ${template.text} opacity-50`}>@{form.slug}</p>
                  <p className={`text-[9px] ${template.text} opacity-70 mt-1 px-2`}>{form.bio}</p>
                </div>
              </div>
            )}

            {/* Header classic/modern */}
            {template.category !== "premium" && (
              <div className="text-center px-4 pt-12 mb-5">
                {form.logo ? (
                  <img src={form.logo} alt="" className={`w-16 h-16 mx-auto mb-2 object-cover shadow-lg ${template.special === "brutalist" ? "border-4 border-black" : "rounded-full border-2 border-white/20"}`} />
                ) : (
                <div className={`w-16 h-16 mx-auto mb-2 ${template.accent} flex items-center justify-center shadow-lg ${template.special === "brutalist" ? "border-4 border-black" : "rounded-full"}`}>
                  <span className={`text-xl font-bold ${template.text}`}>{form.name.charAt(0)}</span>
                </div>
                )}
                <h2 className={`text-base font-bold ${template.text}`}>{form.name}</h2>
                <p className={`text-[10px] ${template.text} opacity-50`}>@{form.slug}</p>
                <p className={`text-[9px] ${template.text} opacity-70 mt-2 px-2`}>{form.bio}</p>
                <div className="flex items-center justify-center gap-2 mt-3">
                  <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                    <Instagram className={`w-3 h-3 ${template.text} opacity-70`} />
                  </div>
                  <div className={`w-6 h-6 rounded-full ${template.accent} flex items-center justify-center`}>
                    <Youtube className={`w-3 h-3 ${template.text} opacity-70`} />
                  </div>
                </div>
              </div>
            )}

            {/* Produits */}
            <div className="px-4 pb-6 space-y-2">
              {products.map((product) => (
                <div key={product._id} className={`${template.card} ${template.special === "brutalist" ? "border-2 border-black" : "rounded-xl"} overflow-hidden shadow-sm`}>
                  {/* Ligne principale cover + infos */}
                  <div className="p-2.5 flex gap-2.5">
                    <div className={`w-10 h-14 overflow-hidden flex-shrink-0 ${template.special === "brutalist" ? "border-2 border-black" : "rounded-lg"}`}>
                      {product.cover
                        ? <img src={product.cover} alt="" className="w-full h-full object-cover" />
                        : <div className={`w-full h-full ${template.accent} flex items-center justify-center`}><Package className={`w-4 h-4 ${template.text} opacity-40`} /></div>
                      }
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className={`text-[10px] font-semibold ${template.text} truncate`}>{product.title}</p>
                      <p className={`text-[8px] ${template.text} opacity-50 truncate`}>{product.description}</p>
                      <p className={`text-[11px] font-bold mt-1 ${template.text}`}>
                        {product.checkoutType === "free" ? "Gratuit" : `${product.price.toLocaleString()} FCFA`}
                      </p>
                    </div>
                  </div>
                  {/* Bouton + En savoir plus */}
                  <div className={`flex gap-1.5 px-2.5 pb-2.5`}>
                    <div className={`flex-1 py-1 rounded-lg text-center ${template.special === "brutalist" ? "border-2 border-black bg-black" : `${template.accent} opacity-80`}`}>
                      <p className={`text-[8px] font-bold truncate px-1 ${template.special === "brutalist" || template.bg.includes("900") || template.bg.includes("black") || template.bg.includes("slate") || template.bg.includes("indigo") ? "text-white" : template.text}`}>
                        {product.buttonText}
                      </p>
                    </div>
                    <div className={`px-2 py-1 rounded-lg border ${template.special === "brutalist" ? "border-black" : "border-current opacity-30"}`}>
                      <p className={`text-[7px] font-medium ${template.text} opacity-70 whitespace-nowrap`}>En savoir +</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

// ── NAV ────────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#F5F2ED]/90 backdrop-blur-md border-b border-[#C8BFB0]" : "bg-transparent"}`}>
      <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <BookOpenSVG className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">Bookzy</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          <Link href="/express" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Ebook Designer</Link>
          <Link href="/suggestions" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Roadmap</Link>
          <Link href="/changelog" className="text-sm text-slate-500 hover:text-slate-900 transition-colors">Nouveautés</Link>
        </div>
        <Link href="/dashboard/smart-shop/boutique" className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors">
          Créer ma boutique <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </nav>
  );
}

// ── HERO ───────────────────────────────────────────────────────────────────────
function Hero() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F5F2ED]" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 80px)", paddingBottom: "80px" }}>
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C8BFB0] rounded-full text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse inline-block" />
          Smart Shop — Boutique en ligne
        </div>

        <h1 className="font-black text-slate-900 tracking-tighter leading-[0.88] mb-8" style={{ fontSize: "clamp(3.5rem, 10vw, 7.5rem)" }}>
          <span className="block">Votre boutique</span>
          <span className="block italic">pro en 2 min</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-xl mx-auto mb-12 leading-relaxed">
          Créez une page de vente professionnelle pour vos ebooks, guides et formations. Partagez un lien. Vendez.
        </p>

        {/* Stats */}
        <div className="flex flex-wrap justify-center gap-8 sm:gap-12 mb-14">
          {[
            { val: "2 min",    label: "Boutique créée" },
            { val: "13",       label: "Templates" },
            { val: "0 cr.",    label: "Configuration" },
            { val: "5 cr.",    label: "Pour publier" },
          ].map((s) => (
            <div key={s.val} className="text-center">
              <p className="text-2xl sm:text-4xl font-black text-slate-900">{s.val}</p>
              <p className="text-xs text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard/smart-shop/boutique" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-700 transition-colors text-sm uppercase tracking-widest">
            Créer ma boutique gratuite <ArrowRight className="w-4 h-4" />
          </Link>
          <button onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 px-8 py-4 border border-[#C8BFB0] text-slate-700 font-bold rounded-xl hover:border-slate-400 transition-colors text-sm uppercase tracking-widest">
            Voir la démo
          </button>
        </div>
      </div>
    </section>
  );
}

// ── DASHBOARD PREVIEW ──────────────────────────────────────────────────────────
function DashboardPreview() {
  return (
    <section className="bg-slate-900 py-14 lg:py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-1">Le dashboard</p>
            <h2 className="text-2xl font-black text-white tracking-tight">Tout depuis un seul écran</h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <p className="text-xs font-bold text-white">Preview live</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <p className="text-xs font-bold text-white">13 templates · 1 clic</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img src="/smartpn.png" alt="Dashboard Smart Shop" className="w-full h-auto object-cover" />
        </div>
      </div>
    </section>
  );
}

// ── INTERACTIVE PREVIEW ────────────────────────────────────────────────────────
function InteractivePreview() {
  const [activeTemplate, setActiveTemplate] = useState("neon");
  const [activeCategory, setActiveCategory] = useState("all");

  const categories = ["all", "classic", "modern", "premium"];
  const filtered = activeCategory === "all" ? TEMPLATES : TEMPLATES.filter(t => t.category === activeCategory);

  return (
    <section id="demo" className="bg-[#F5F2ED] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Essayez maintenant</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">13 templates. Changez en live.</h2>
          <p className="text-slate-500 mt-3 max-w-xl">Cliquez sur un template — votre boutique change instantanément. Exactement comme dans le vrai dashboard.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">

          {/* Phone Preview */}
          <div className="flex justify-center lg:justify-start lg:sticky lg:top-24">
            <div className="transition-all duration-500">
              <PhonePreview templateId={activeTemplate} />
              {/* Nom du template actif */}
              <div className="mt-6 text-center">
                <span className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white text-xs font-black uppercase tracking-widest rounded-full">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 inline-block" />
                  {TEMPLATES.find(t => t.id === activeTemplate)?.name}
                </span>
              </div>
            </div>
          </div>

          {/* Sélecteur templates */}
          <div>
            {/* Filtre catégories */}
            <div className="flex gap-2 flex-wrap mb-6">
              {categories.map(cat => (
                <button key={cat} onClick={() => setActiveCategory(cat)}
                  className={`px-4 py-2 rounded-lg text-xs font-black uppercase tracking-widest transition-all ${activeCategory === cat ? "bg-slate-900 text-white" : "bg-white border border-[#C8BFB0] text-slate-500 hover:border-slate-400"}`}>
                  {cat === "all" ? "Tous" : cat}
                </button>
              ))}
            </div>

            {/* Grille templates */}
            <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
              {filtered.map(t => (
                <button key={t.id} onClick={() => setActiveTemplate(t.id)}
                  className={`relative group rounded-xl overflow-hidden transition-all duration-200 ${activeTemplate === t.id ? "ring-2 ring-slate-900 ring-offset-2 ring-offset-[#F5F2ED] scale-105" : "hover:scale-105"}`}>
                  {/* Mini preview boutique */}
                  <div className={`${t.bg} h-24 relative flex flex-col items-center justify-start pt-2`}>
                    {t.special === "neon" && <div className="absolute inset-0 opacity-30" style={{ backgroundImage: `linear-gradient(rgba(217,70,239,0.4) 1px, transparent 1px), linear-gradient(90deg, rgba(217,70,239,0.4) 1px, transparent 1px)`, backgroundSize: "8px 8px" }} />}
                    {t.special === "glass" && <div className="absolute top-0 left-1/2 -translate-x-1/2 w-12 h-12 bg-purple-400/40 rounded-full blur-xl" />}

                    {/* Avatar miniature avec /bio.png */}
                    <div className={`w-6 h-6 rounded-full overflow-hidden ${t.special === "brutalist" ? "border-2 border-black rounded-none" : "border border-white/30"} flex-shrink-0`}>
                      <img src="/bio.png" alt="" className="w-full h-full object-cover" />
                    </div>
                    <p className={`text-[6px] font-bold ${t.text} mt-0.5 opacity-80`}>prisma</p>

                    {/* Produit miniature avec cover */}
                    <div className={`${t.card} mx-1.5 mt-1 rounded p-1 w-full flex items-center gap-1 ${t.special === "brutalist" ? "border border-black" : ""}`}>
                      <div className="w-4 h-5 rounded overflow-hidden flex-shrink-0">
                        <img src={EBOOK_COVERS[0]} alt="" className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className={`h-1 w-full rounded ${t.accent} mb-0.5 opacity-70`} />
                        <div className={`h-1 w-2/3 rounded ${t.accent} opacity-40`} />
                      </div>
                    </div>
                  </div>
                  {/* Label */}
                  <div className={`py-1.5 px-2 ${activeTemplate === t.id ? "bg-slate-900" : "bg-white border-t border-[#E0D8CC]"}`}>
                    <p className={`text-[9px] font-black uppercase tracking-wider text-center ${activeTemplate === t.id ? "text-white" : "text-slate-600"}`}>{t.name}</p>
                  </div>
                  {t.isNew && (
                    <div className="absolute top-1.5 right-1.5 bg-emerald-500 text-white text-[7px] font-black px-1.5 py-0.5 rounded-full uppercase tracking-wider">New</div>
                  )}
                </button>
              ))}
            </div>

            {/* Note */}
            <p className="text-xs text-slate-400 mt-6 flex items-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
              Changement en temps réel dans votre vrai dashboard — exactement comme ici
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── FEATURES ───────────────────────────────────────────────────────────────────
function Features() {
  const features = [
    {
      tag: "Checkout",
      title: "Vendez via WhatsApp, lien ou téléchargement gratuit",
      desc: "Pas besoin de passerelle de paiement complexe. Redirigez vos clients vers votre WhatsApp, un lien externe, ou proposez un téléchargement gratuit. Le paiement intégré arrive bientôt.",
      details: [
        { icon: MessageCircle, label: "WhatsApp checkout", sub: "Le client clique → il vous envoie un message pré-rempli avec le nom du produit. Vous confirmez, vous encaissez.", color: "text-emerald-600" },
        { icon: LinkIcon,       label: "Lien externe",      sub: "Redirigez vers votre Gumroad, Payhip, PayDunya ou n'importe quelle plateforme existante.", color: "text-blue-600" },
        { icon: Download,       label: "Gratuit",           sub: "Proposez un lead magnet gratuit pour construire votre liste. Téléchargement direct, zéro friction.", color: "text-violet-600" },
        { icon: CreditCard,     label: "Paiement intégré",  sub: "Wave, Orange Money, MTN MoMo — bientôt disponible directement dans Bookzy.", color: "text-slate-400", soon: true },
      ]
    },
    {
      tag: "Conversion",
      title: "FOMO, FAQ, témoignages — tout pour convertir",
      desc: "Chaque outil de conversion classique, intégré nativement dans votre page produit. Activez en un clic.",
      details: [
        { icon: Flame,         label: "FOMO automatique",  sub: "Affichez '🔥 47 personnes ont téléchargé'. Entrez juste le chiffre — Bookzy affiche le badge sur la page.", color: "text-orange-500" },
        { icon: HelpCircle,    label: "FAQ intégrée",       sub: "Ajoutez vos questions/réponses directement dans l'éditeur produit. S'affiche en accordéon sur la page.", color: "text-blue-500" },
        { icon: MessageSquare, label: "Témoignages",        sub: "Ajoutez nom, note sur 5 et texte. Les étoiles et avis s'affichent sur votre page de vente.", color: "text-purple-500" },
        { icon: Star,          label: "Prix barré",         sub: "Prix original + prix réduit avec badge de réduction calculé automatiquement. Urgence visuelle.", color: "text-yellow-500" },
      ]
    },
  ];

  return (
    <section className="bg-slate-900 py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto space-y-20">
        {features.map((feat, fi) => (
          <div key={fi} className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            <div className={fi % 2 === 1 ? "lg:order-2" : ""}>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 border border-white/10 rounded-full text-xs font-black uppercase tracking-widest text-white/40 mb-6">{feat.tag}</div>
              <h3 className="text-3xl md:text-4xl font-black text-white tracking-tight mb-4">{feat.title}</h3>
              <p className="text-white/50 text-base leading-relaxed">{feat.desc}</p>
            </div>
            <div className={`space-y-3 ${fi % 2 === 1 ? "lg:order-1" : ""}`}>
              {feat.details.map((d, di) => (
                <div key={di} className={`flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/8 ${d.soon ? "opacity-50" : ""}`}>
                  <d.icon className={`w-5 h-5 flex-shrink-0 mt-0.5 ${d.color}`} />
                  <div>
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-bold text-white">{d.label}</p>
                      {d.soon && <span className="text-[9px] bg-white/10 text-white/40 px-2 py-0.5 rounded-full font-black uppercase tracking-wider">Bientôt</span>}
                    </div>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{d.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ── LANDING PAGE PRODUIT ───────────────────────────────────────────────────────
function LandingPage() {
  const steps = [
    {
      num: "01",
      title: "Vous ajoutez le produit",
      desc: "Titre, description riche, prix, photo de couverture, checkout (WhatsApp, lien, gratuit). Tout depuis votre dashboard en 3 minutes.",
      tags: ["Titre & description", "Photo couverture", "Prix + prix barré", "Type de checkout"],
      color: "from-slate-900 to-slate-800",
    },
    {
      num: "02",
      title: "Bookzy génère la page de vente",
      desc: "Chaque produit a automatiquement sa propre landing page publique avec tout ce qu'il faut pour convertir — sans développeur.",
      tags: ["FOMO automatique", "FAQ accordéon", "Témoignages + étoiles", "Bouton d'achat"],
      color: "from-indigo-900 to-slate-900",
    },
    {
      num: "03",
      title: "Vous partagez le lien",
      desc: "bookzy.io/shop/voustre-boutique — une URL. Mettez-la dans votre bio Instagram, WhatsApp, TikTok. Les clients voient votre boutique + chaque produit.",
      tags: ["1 lien pour tout", "Mobile-first", "Rapide à charger", "Pas de compte requis"],
      color: "from-emerald-900 to-slate-900",
    },
  ];

  return (
    <section className="bg-[#F5F2ED] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Landing page automatique</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Chaque produit a sa page de vente</h2>
          <p className="text-slate-500 mt-3 max-w-xl text-base leading-relaxed">
            Vous ne créez pas juste une fiche produit. Bookzy génère une vraie landing page de vente pour chaque produit — avec FOMO, FAQ, témoignages, bouton d'achat. Vous remplissez. Bookzy vend.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
          {steps.map((s) => (
            <div key={s.num} className={`bg-gradient-to-b ${s.color} rounded-2xl p-7 relative overflow-hidden`}>
              <div className="absolute top-4 right-4 text-6xl font-black text-white/5 leading-none select-none">{s.num}</div>
              <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-4">{s.num}</p>
              <h3 className="text-xl font-black text-white mb-3 leading-tight">{s.title}</h3>
              <p className="text-white/50 text-sm leading-relaxed mb-5">{s.desc}</p>
              <div className="flex flex-wrap gap-2">
                {s.tags.map(tag => (
                  <span key={tag} className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-white/10 text-white/60">{tag}</span>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Mockup landing page produit */}
        <div className="bg-white border border-[#C8BFB0] rounded-2xl overflow-hidden shadow-sm">
          <div className="border-b border-[#E0D8CC] px-6 py-4 flex items-center gap-3">
            <div className="flex gap-1.5"><div className="w-3 h-3 rounded-full bg-red-400"/><div className="w-3 h-3 rounded-full bg-yellow-400"/><div className="w-3 h-3 rounded-full bg-green-400"/></div>
            <div className="flex-1 bg-[#F5F2ED] rounded-lg px-4 py-1.5 text-xs text-slate-400 font-mono">bookzy.io/shop/kofi.digital/guide-infopreneur</div>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
            {/* Gauche — cover + infos produit */}
            <div className="p-8 border-r border-[#E0D8CC]">
              <div className="aspect-[3/4] max-w-[200px] mx-auto mb-6 rounded-xl overflow-hidden shadow-2xl">
                <img src={EBOOK_COVERS[0]} alt="Ebook cover" className="w-full h-full object-cover" />
              </div>
              <div className="text-center">
                <div className="inline-flex items-center gap-1 mb-3">
                  {[0,1,2,3,4].map(s => <Star key={s} className="w-4 h-4 text-yellow-400 fill-yellow-400" />)}
                  <span className="text-xs text-slate-400 ml-1">(47 avis)</span>
                </div>
                <h3 className="text-xl font-black text-slate-900 mb-1">Guide Infopreneur 2025</h3>
                <p className="text-sm text-slate-500 mb-4">Lancez votre business en ligne en 30 jours</p>
                <div className="flex items-center justify-center gap-3 mb-6">
                  <span className="text-3xl font-black text-slate-900">4 500 FCFA</span>
                  <span className="text-lg text-slate-300 line-through">9 000 FCFA</span>
                  <span className="text-xs font-black bg-red-500 text-white px-2 py-0.5 rounded-full">-50%</span>
                </div>
                <button className="w-full py-3.5 bg-slate-900 text-white font-black rounded-xl text-sm uppercase tracking-widest flex items-center justify-center gap-2">
                  <MessageCircle className="w-4 h-4" /> Commander via WhatsApp
                </button>
              </div>
            </div>
            {/* Droite — landing page éléments */}
            <div className="p-8 space-y-6">
              {/* FOMO */}
              <div className="flex items-center gap-2 p-3 bg-orange-50 border border-orange-100 rounded-xl">
                <Flame className="w-4 h-4 text-orange-500 flex-shrink-0" />
                <p className="text-sm font-bold text-orange-800">🔥 47 personnes ont acheté ce guide</p>
              </div>
              {/* Description */}
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Description</p>
                <p className="text-sm text-slate-600 leading-relaxed">Dans ce guide de 80 pages, vous découvrez comment lancer votre premier produit digital en Afrique francophone. Niche, création, vente, marketing — tout est couvert.</p>
              </div>
              {/* FAQ */}
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">FAQ</p>
                {[
                  { q: "C'est pour quel niveau ?", a: "Débutant complet. Aucune expérience requise." },
                  { q: "Format du guide ?",         a: "PDF téléchargeable, 80 pages, accès immédiat." },
                ].map((faq, i) => (
                  <div key={i} className="border border-[#E0D8CC] rounded-xl px-4 py-3 mb-2">
                    <p className="text-sm font-bold text-slate-900">{faq.q}</p>
                    <p className="text-xs text-slate-500 mt-1">{faq.a}</p>
                  </div>
                ))}
              </div>
              {/* Témoignages */}
              <div>
                <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-2">Avis clients</p>
                <div className="bg-[#F5F2ED] rounded-xl p-4">
                  <div className="flex gap-1 mb-1">{[0,1,2,3,4].map(s => <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}</div>
                  <p className="text-sm text-slate-700">"J'ai lancé mon premier ebook dans la semaine. Le guide est concret et actionnable."</p>
                  <p className="text-xs text-slate-400 mt-2">— Fatou D., Bamako</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 mt-6 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Tout ce que vous voyez ci-dessus, c'est vous qui le remplissez dans votre dashboard — Bookzy génère la page automatiquement
        </p>
      </div>
    </section>
  );
}


function Tarification() {
  return (
    <section className="bg-[#F5F2ED] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-4xl mx-auto">
        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Tarification</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Tout gratuit. Payez juste pour publier.</h2>
          <p className="text-slate-500 mt-3 max-w-2xl text-base leading-relaxed">
            Configurez votre boutique, ajoutez vos produits, importez des ebooks Bookzy, personnalisez tout — <span className="font-bold text-slate-700">gratuitement</span>. Vous payez 5 crédits uniquement au moment de publier et rendre votre boutique visible.
          </p>
        </div>

        {/* Gratuit vs Publier */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-10">
          <div className="bg-white border border-[#C8BFB0] rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-4">
              <Check className="w-3.5 h-3.5 text-emerald-500" />
              <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">100% Gratuit</span>
            </div>
            <p className="text-4xl font-black text-slate-900 mb-1">0 cr.</p>
            <p className="text-slate-400 text-sm mb-6">Pour tout configurer, sans limite de temps.</p>
            <div className="space-y-2.5">
              {[
                "Créer et configurer votre boutique",
                "13 templates — changer à volonté",
                "Logo, bio, réseaux sociaux",
                "Ajouter et modifier vos produits",
                "Importer des ebooks générés sur Bookzy",
                "Configurer checkout, FOMO, FAQ, témoignages",
                "Prévisualiser en direct avant de publier",
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-500 flex-shrink-0" />
                  <p className="text-sm text-slate-600">{f}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="bg-slate-900 rounded-2xl p-8">
            <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-white/10 border border-white/20 rounded-full mb-4">
              <span className="text-xs font-black text-white/70 uppercase tracking-wider">Publication</span>
            </div>
            <p className="text-4xl font-black text-white mb-1">5 cr.</p>
            <p className="text-white/40 text-sm mb-6">Une seule fois pour rendre votre boutique publique et accessible via votre lien.</p>
            <div className="space-y-2.5 mb-8">
              {[
                "Boutique publiée sur bookzy.io/shop/votrelien",
                "Lien partageable Instagram, WhatsApp, TikTok",
                "Landing page produit générée automatiquement",
                "Mises à jour gratuites après publication",
              ].map(f => (
                <div key={f} className="flex items-center gap-2.5">
                  <Check className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                  <p className="text-sm text-white/70">{f}</p>
                </div>
              ))}
            </div>
            {/* Prix selon plan */}
            <div className="border-t border-white/10 pt-6">
              <p className="text-xs font-black uppercase tracking-widest text-white/30 mb-3">Coût réel selon votre plan</p>
              <div className="grid grid-cols-2 gap-2">
                {[
                  { plan: "Sans abonnement", prix: "750 FCFA" },
                  { plan: "Pass Solo",       prix: "425 FCFA" },
                  { plan: "Pack Créateur",   prix: "290 FCFA", best: true },
                  { plan: "Pack Agence",     prix: "225 FCFA" },
                ].map(p => (
                  <div key={p.plan} className={`rounded-xl px-3 py-2.5 ${p.best ? "bg-emerald-500/20 border border-emerald-500/30" : "bg-white/5 border border-white/10"}`}>
                    <p className={`text-[10px] font-bold uppercase tracking-wider mb-0.5 ${p.best ? "text-emerald-400" : "text-white/40"}`}>{p.plan}</p>
                    <p className={`text-base font-black ${p.best ? "text-emerald-300" : "text-white"}`}>{p.prix}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Pas de frais mensuels pour la boutique — vous payez une seule fois pour publier, les modifications restent gratuites
        </p>
      </div>
    </section>
  );
}

// ── TESTIMONIALS ───────────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="bg-[#EDE8E0] py-16 lg:py-24 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 mb-12 px-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Ils utilisent Smart Shop</p>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Vrais vendeurs. Vrais résultats.</h2>
      </div>
      {[0, 1].map(row => (
        <div key={row} className={`flex gap-5 mb-5 ${row === 1 ? "flex-row-reverse" : ""}`}
          style={{ animation: `marquee${row === 0 ? "" : "Rev"} 35s linear infinite`, width: "max-content" }}>
          {DOUBLED.map((t, i) => (
            <div key={i} className="w-72 flex-shrink-0 bg-white border border-[#C8BFB0] rounded-2xl p-6 shadow-sm">
              <div className="flex gap-1 mb-3">{[0,1,2,3,4].map(s => <Star key={s} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}</div>
              <p className="text-sm text-slate-700 leading-relaxed mb-4">"{t.quote}"</p>
              <div className="flex items-center gap-3">
                <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover border border-[#C8BFB0]" />
                <div>
                  <p className="text-xs font-bold text-slate-900">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.role} · {t.location}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      ))}
      <style jsx>{`
        @keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }
        @keyframes marqueeRev { from { transform: translateX(-50%) } to { transform: translateX(0) } }
      `}</style>
    </section>
  );
}

// ── CTA FINAL ──────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="bg-slate-900 py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-white/[0.02] blur-3xl" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-6">Prêt à vendre ?</p>
        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.9] mb-6">
          Boutique créée.<br />
          <span className="text-white/40">Lien partagé.</span><br />
          Ventes.
        </h2>
        <p className="text-white/40 text-lg mb-12 max-w-lg mx-auto">
          Configurez tout gratuitement. Publiez pour <span className="text-white/70 font-bold">5 crédits</span> — soit <span className="text-white/70 font-bold">225 FCFA</span> avec Pack Agence. Vos clients reçoivent une boutique pro, vous recevez des ventes.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/dashboard/smart-shop/boutique" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-slate-900 font-black rounded-xl hover:bg-white/90 transition-colors text-sm uppercase tracking-widest">
            Créer ma boutique <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/tarifs" className="inline-flex items-center justify-center gap-2 px-8 py-5 border border-white/20 hover:border-white/40 text-white/60 hover:text-white font-bold rounded-xl transition-all text-sm uppercase tracking-widest">
            Voir les tarifs
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── PAGE ───────────────────────────────────────────────────────────────────────
export default function SmartShopPage() {
  return (
    <div className="font-sans">
      <Nav />
      <Hero />
      <DashboardPreview />
      <InteractivePreview />
      <Features />
      <LandingPage />
      <Tarification />
      <Testimonials />
      <CTAFinal />
    </div>
  );
}