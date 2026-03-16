"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
import {
  Target, Check, X, ArrowRight, Star,
  ChevronDown, Menu, BarChart3, Search,
  TrendingUp, Users, Clock, Zap, Eye,
  Flame, Award, Globe, Filter, Lightbulb,
  BookOpen, ShoppingBag, DollarSign
} from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

const TESTIMONIALS = [
  { name: "Amadou Sow",    role: "Entrepreneur digital", location: "Dakar",    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "J'ai trouvé ma niche en 30 secondes. L'ebook s'est vendu à 847 personnes en moins de 2 mois. Jamais j'aurais pensé à 'Élevage de poulets'." },
  { name: "Aïcha Koné",    role: "Créatrice Food",       location: "Abidjan",  avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",                          quote: "ROI de fou. Je ne savais pas quoi vendre. Niche Hunter m'a tout dit. J'ai lancé ma pub le soir même, 1 234 ventes en 2 mois." },
  { name: "Jean-Marc T.",  role: "Formateur",             location: "Douala",   avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",  quote: "Niche Hunter + Bookzy = la combinaison parfaite. 9 180€ de revenus en partant de zéro. Je cherchais une niche depuis 6 mois." },
  { name: "Clara Martin",  role: "Coach Business",        location: "Paris",    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/7fef677cbafd1e0f1f474ad0fa14a341.jpg",  quote: "Le score de rentabilité ne ment pas. J'ai choisi la niche à 92/100 et eu mes 3 premières ventes la semaine même." },
  { name: "Kofi Mensah",   role: "Digital Marketer",      location: "Accra",    avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg",  quote: "Avant je passais 3 jours sur Google Trends pour rien. Maintenant 30 secondes et j'ai 10 niches notées avec la concurrence." },
  { name: "Fatou Diallo",  role: "Entrepreneuse",         location: "Bamako",   avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",                          quote: "Les données TikTok intégrées sont incroyables. J'ai choisi une niche trending et mon ebook a explosé dès le premier jour." },
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

// ── RÉSULTAT NICHE ANIMÉ (mini UI interactive) ────────────────────────────────
function NicheResultCard({ rank, niche, score, volume, competition, trend, delay = 0 }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const t = setTimeout(() => setVisible(true), delay);
    return () => clearTimeout(t);
  }, [delay]);

  const scoreColor = score >= 85 ? "text-emerald-600 bg-emerald-50 border-emerald-200"
    : score >= 70 ? "text-blue-600 bg-blue-50 border-blue-200"
    : "text-orange-600 bg-orange-50 border-orange-200";

  const compColor = competition === "Faible" ? "text-emerald-600" : competition === "Moyenne" ? "text-orange-500" : "text-red-500";

  return (
    <div className={`bg-white border border-[#D6CFC4] rounded-xl p-5 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 translate-y-4"}`}>
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 flex-1 min-w-0">
          <span className="w-6 h-6 rounded-full bg-slate-100 flex-shrink-0 flex items-center justify-center text-[10px] font-black text-slate-400">{rank}</span>
          <div className="flex-1 min-w-0">
            <p className="font-black text-slate-900 text-sm truncate">{niche}</p>
            <div className="flex items-center gap-3 mt-1 flex-wrap">
              <span className="text-[10px] text-slate-400 font-semibold">{volume} rech./mois</span>
              <span className={`text-[10px] font-bold ${compColor}`}>Concurrence {competition}</span>
              <span className={`text-[10px] font-bold ${trend > 0 ? "text-emerald-600" : "text-red-500"}`}>
                {trend > 0 ? "↑" : "↓"} {Math.abs(trend)}% vs mois passé
              </span>
            </div>
          </div>
        </div>
        <div className={`flex-shrink-0 text-xs font-black px-2.5 py-1 rounded-lg border ${scoreColor}`}>
          {score}/100
        </div>
      </div>
      <div className="mt-3">
        <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
          <div
            className={`h-full rounded-full transition-all duration-1000 delay-300 ${score >= 85 ? "bg-emerald-500" : score >= 70 ? "bg-blue-500" : "bg-orange-400"}`}
            style={{ width: visible ? `${score}%` : "0%" }}
          />
        </div>
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

  const scrollTo = (id) => {
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${scrolled ? "bg-[#F5F2ED]/90 backdrop-blur-md border-b border-[#C8BFB0]" : "bg-transparent"}`}>
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
        <Link href="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
            <BookOpenSVG className="w-4 h-4 text-white" />
          </div>
          <span className="font-bold text-slate-900">Bookzy</span>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {[
            { label: "Comment ça marche", id: "features" },
            { label: "Démo live",         id: "demo" },
            { label: "Résultats",         id: "results" },
            { label: "Tarifs",            id: "pricing" },
            { label: "FAQ",               id: "faq" },
          ].map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">
              {l.label}
            </button>
          ))}
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden md:block text-sm text-slate-500 hover:text-slate-900 transition-colors px-3 py-2">
            Connexion
          </Link>
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-xl hover:bg-slate-700 transition-colors">
            Analyser gratuitement <ArrowRight className="w-3.5 h-3.5" />
          </Link>
          <button onClick={() => setOpen(!open)} className="md:hidden p-2 rounded-lg hover:bg-[#E8E2D9]">
            {open ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#F5F2ED] border-b border-[#D6CFC4] p-6 shadow-xl flex flex-col gap-4 md:hidden">
          {[
            { label: "Comment ça marche", id: "features" },
            { label: "Démo live",         id: "demo" },
            { label: "Résultats",         id: "results" },
            { label: "Tarifs",            id: "pricing" },
            { label: "FAQ",               id: "faq" },
          ].map(l => (
            <button key={l.id} onClick={() => scrollTo(l.id)} className="text-base font-semibold text-slate-700 py-3 border-b border-[#E8E2D9] text-left">
              {l.label}
            </button>
          ))}
          <Link href="/auth/register" className="flex items-center justify-center gap-2 bg-slate-900 text-white px-6 py-4 rounded-xl font-bold">
            Analyser gratuitement
          </Link>
        </div>
      )}
    </nav>
  );
}

// ── HERO ─────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F5F2ED]" style={{ paddingTop: "calc(env(safe-area-inset-top, 0px) + 80px)", paddingBottom: "80px" }}>
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="relative z-10 max-w-5xl mx-auto px-6 text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C8BFB0] rounded-full text-xs font-bold uppercase tracking-[0.2em] text-slate-500 mb-10">
          <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 animate-pulse inline-block" />
          147 niches analysées aujourd'hui
        </div>

        <h1 className="font-black text-slate-900 tracking-tighter leading-[0.88] mb-8" style={{ fontSize: "clamp(3.5rem, 10vw, 7.5rem)" }}>
          <span className="block">Trouvez votre</span>
          <span className="block italic text-indigo-600">niche rentable</span>
        </h1>

        <p className="text-lg md:text-xl text-slate-500 max-w-2xl mx-auto mb-6 leading-relaxed">
          Notre IA scanne 10 000 marchés et vous révèle les niches les plus rentables avec un score, le volume de recherche et le niveau de concurrence.
          <span className="text-slate-900 font-semibold"> En 30 secondes.</span>
        </p>
        <p className="text-slate-400 text-xs uppercase tracking-[0.25em] font-bold mb-12">
          TikTok · Google Trends · Amazon KDP · Facebook Ads
        </p>

        {/* Stats */}
        <div className="flex justify-center gap-8 sm:gap-12 mb-14 flex-wrap">
          {[
            { val: "30s",     label: "Analyse" },
            { val: "10k",     label: "Marchés" },
            { val: "100",     label: "Score /100" },
            { val: "Gratuit", label: "3/jour" },
          ].map((s, i) => (
            <div key={s.val} className="text-center">
              <p className="text-2xl sm:text-4xl font-black text-slate-900">{s.val}</p>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-700 transition-colors text-sm uppercase tracking-widest">
            Trouver ma niche <ArrowRight className="w-4 h-4" />
          </Link>
          <button onClick={() => document.getElementById("demo")?.scrollIntoView({ behavior: "smooth" })} className="inline-flex items-center gap-2 px-8 py-4 border border-[#C8BFB0] text-slate-700 font-bold rounded-xl hover:border-slate-400 transition-colors text-sm uppercase tracking-widest">
            Voir la démo
          </button>
        </div>

        {/* Social proof */}
        <div className="inline-flex items-center gap-3 px-4 py-2.5 bg-white/60 border border-[#C8BFB0] rounded-full">
          <div className="flex -space-x-2 flex-shrink-0">
            {TESTIMONIALS.slice(0, 4).map((t, i) => (
              <div key={i} className="w-7 h-7 rounded-full border-2 border-white shadow overflow-hidden flex-shrink-0">
                <img src={t.avatar} alt="" className="w-full h-full object-cover" loading="lazy" />
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5">
            <div className="flex gap-0.5">
              {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-yellow-400 fill-yellow-400" />)}
            </div>
            <p className="text-xs text-slate-600 whitespace-nowrap">
              <strong className="text-slate-900 font-black">4.9/5</strong>
              <span className="text-slate-400"> · 2 450+ créateurs</span>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── DÉMO SCREENSHOT ───────────────────────────────────────────────────────────
function DemoScreenshot() {
  return (
    <section className="bg-slate-900 py-14 lg:py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-1">Interface réelle</p>
            <h2 className="text-2xl font-black text-white tracking-tight">Le tableau de résultats en action</h2>
          </div>
          <div className="hidden md:flex items-center gap-3">
            <div className="bg-white/10 rounded-xl px-4 py-2 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-indigo-400 animate-pulse" />
              <p className="text-xs font-bold text-white">Score en temps réel</p>
            </div>
            <div className="bg-white/10 rounded-xl px-4 py-2">
              <p className="text-xs font-bold text-white">10 niches · 30 secondes</p>
            </div>
          </div>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <img src="/screenshots/niche-hunter.png" alt="Interface Niche Hunter" className="w-full h-auto object-cover" />
        </div>
      </div>
    </section>
  );
}

// ── SOURCES ───────────────────────────────────────────────────────────────────
function Sources() {
  return (
    <div className="py-12 border-y border-[#D6CFC4] bg-[#F5F2ED]">
      <div className="max-w-6xl mx-auto px-6">
        <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 text-center mb-5">
          Sources de données analysées en temps réel
        </p>
        <div className="flex flex-wrap justify-center gap-8 md:gap-14">
          {[
            { icon: Eye,      label: "TikTok Trends" },
            { icon: Search,   label: "Google Trends" },
            { icon: Users,    label: "Amazon KDP" },
            { icon: Target,   label: "Facebook Ads" },
          ].map(({ icon: Icon, label }) => (
            <div key={label} className="flex items-center gap-2 text-slate-500 font-semibold text-sm">
              <Icon className="w-4 h-4 text-slate-400" /> {label}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

// ── COMMENT ÇA MARCHE ─────────────────────────────────────────────────────────
function HowItWorks() {
  return (
    <section id="features" className="bg-[#F5F2ED] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">3 étapes · 30 secondes</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Comment ça marche</h2>
          <p className="text-slate-500 mt-3 max-w-xl text-base leading-relaxed">
            Pas de méthode compliquée. Entrez un mot. L'IA fait tout. Vous choisissez. Vous créez.
          </p>
        </div>

        <div className="grid lg:grid-cols-3 gap-6">
          <div className="bg-white border border-[#D6CFC4] rounded-2xl p-6 lg:p-8 hover:border-slate-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg mb-6">1</div>
            <Target className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">Entrez un mot-clé</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Tapez n'importe quel domaine — "santé", "finance", "élevage", "beauté". Ou même rien : notre IA vous suggère les opportunités du moment en Afrique francophone.
            </p>
            <div className="bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl p-4 flex items-center gap-3">
              <div className="flex-1 bg-white border border-[#D6CFC4] rounded-lg px-3 py-2 text-sm text-slate-400 font-mono">
                "business en ligne"
              </div>
              <button className="px-4 py-2 bg-slate-900 text-white text-xs font-black rounded-lg uppercase tracking-widest">
                Analyser
              </button>
            </div>
          </div>

          <div className="bg-white border border-[#D6CFC4] rounded-2xl p-6 lg:p-8 hover:border-slate-400 hover:shadow-md transition-all">
            <div className="w-10 h-10 bg-slate-900 text-white rounded-xl flex items-center justify-center font-black text-lg mb-6">2</div>
            <BarChart3 className="w-8 h-8 text-indigo-600 mb-4" />
            <h3 className="text-xl font-black text-slate-900 mb-3 tracking-tight">10 niches scorées</h3>
            <p className="text-slate-500 text-sm leading-relaxed mb-5">
              En 30 secondes, vous recevez les 10 meilleures niches avec un score sur 100, le volume de recherche mensuel, le niveau de concurrence et la tendance des 30 derniers jours.
            </p>
            <ul className="space-y-2">
              {[
                { label: "Score rentabilité /100", color: "bg-emerald-500" },
                { label: "Volume de recherche mensuel", color: "bg-blue-500" },
                { label: "Niveau de concurrence", color: "bg-orange-400" },
                { label: "Tendance +/- 30 jours", color: "bg-indigo-500" },
              ].map(f => (
                <li key={f.label} className="flex items-center gap-2 text-sm text-slate-700">
                  <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${f.color}`} />
                  {f.label}
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 hover:shadow-lg transition-all text-white">
            <div className="w-10 h-10 bg-indigo-600 text-white rounded-xl flex items-center justify-center font-black text-lg mb-6">3</div>
            <BookOpen className="w-8 h-8 text-indigo-400 mb-4" />
            <h3 className="text-xl font-black mb-3 tracking-tight">Générez l'ebook</h3>
            <p className="text-slate-400 text-sm leading-relaxed mb-5">
              Niche choisie ? Un clic pour lancer Bookzy. L'IA génère votre ebook 30–50 pages + cover + kit marketing. Prêt à vendre en 60 secondes.
            </p>
            <div className="bg-white/10 rounded-xl p-4 space-y-2 text-sm text-slate-300">
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Ebook 30–50 pages structuré</div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> PDF professionnel avec cover</div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Script WhatsApp + pub inclus</div>
              <div className="flex items-center gap-2"><Check className="w-3.5 h-3.5 text-indigo-400" /> Smart Shop prêt en 2 min</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── DÉMO INTERACTIVE ──────────────────────────────────────────────────────────
function DemoInteractive() {
  const [keyword, setKeyword] = useState("business en ligne");
  const [analysing, setAnalysing] = useState(false);
  const [showResults, setShowResults] = useState(true);

  const NICHES_BY_THEME = {
    default: [
      { rank: 1, niche: "Dropshipping produits africains",  score: 94, volume: "28 400", competition: "Faible",  trend: +34 },
      { rank: 2, niche: "Formation trading Forex Afrique",  score: 91, volume: "41 200", competition: "Moyenne", trend: +22 },
      { rank: 3, niche: "Freelance design mobile money",    score: 88, volume: "19 800", competition: "Faible",  trend: +41 },
      { rank: 4, niche: "Affiliation produits beauté CI",   score: 85, volume: "34 600", competition: "Faible",  trend: +18 },
      { rank: 5, niche: "Coaching entrepreneuriat féminin", score: 82, volume: "22 100", competition: "Moyenne", trend: +27 },
      { rank: 6, niche: "Vente de templates WhatsApp",      score: 78, volume: "15 300", competition: "Faible",  trend: +55 },
      { rank: 7, niche: "E-commerce vêtements Wax",         score: 75, volume: "38 900", competition: "Moyenne", trend: +12 },
      { rank: 8, niche: "Formation Excel pour PME",         score: 71, volume: "12 700", competition: "Faible",  trend: +8  },
      { rank: 9, niche: "Coaching prise de parole",         score: 68, volume: "9 400",  competition: "Faible",  trend: +19 },
      { rank: 10, niche: "Marketing digital restauration",  score: 65, volume: "18 200", competition: "Forte",   trend: -3  },
    ],
    sport: [
      { rank: 1, niche: "Programme musculation maison sans matériel", score: 96, volume: "52 300", competition: "Faible",  trend: +48 },
      { rank: 2, niche: "Nutrition sportive pour Africains",          score: 92, volume: "34 800", competition: "Faible",  trend: +31 },
      { rank: 3, niche: "Coaching football jeunes Afrique",           score: 89, volume: "28 100", competition: "Faible",  trend: +37 },
      { rank: 4, niche: "Yoga débutants francophones",                score: 86, volume: "41 500", competition: "Moyenne", trend: +22 },
      { rank: 5, niche: "Running et perte de poids rapide",           score: 83, volume: "39 200", competition: "Moyenne", trend: +19 },
      { rank: 6, niche: "Boxe autodéfense femmes",                    score: 79, volume: "17 400", competition: "Faible",  trend: +44 },
      { rank: 7, niche: "Plan d'entraînement basket Afrique",         score: 75, volume: "12 900", competition: "Faible",  trend: +28 },
      { rank: 8, niche: "Fitness postpartum",                         score: 72, volume: "22 600", competition: "Moyenne", trend: +15 },
      { rank: 9, niche: "Stretching et mobilité bureau",              score: 68, volume: "9 800",  competition: "Faible",  trend: +11 },
      { rank: 10, niche: "Natation débutants Côte d'Ivoire",          score: 64, volume: "7 200",  competition: "Faible",  trend: +6  },
    ],
    sante: [
      { rank: 1, niche: "Diabète alimentation Afrique",               score: 95, volume: "48 700", competition: "Faible",  trend: +52 },
      { rank: 2, niche: "Remèdes naturels plantes africaines",        score: 91, volume: "63 200", competition: "Faible",  trend: +38 },
      { rank: 3, niche: "Perte de poids régime africain",             score: 88, volume: "71 400", competition: "Moyenne", trend: +29 },
      { rank: 4, niche: "Santé mentale jeunes Afrique",               score: 85, volume: "31 800", competition: "Faible",  trend: +61 },
      { rank: 5, niche: "Grossesse accouchement naturel",             score: 82, volume: "44 100", competition: "Faible",  trend: +24 },
      { rank: 6, niche: "Hypertension prévention Afrique",            score: 79, volume: "28 500", competition: "Faible",  trend: +33 },
      { rank: 7, niche: "Méditation anti-stress",                     score: 76, volume: "52 300", competition: "Moyenne", trend: +18 },
      { rank: 8, niche: "Jeûne intermittent tropical",                score: 72, volume: "19 700", competition: "Moyenne", trend: +14 },
      { rank: 9, niche: "Soins peau noire naturels",                  score: 69, volume: "38 900", competition: "Forte",   trend: +9  },
      { rank: 10, niche: "Alimentation bébé 0-2 ans",                 score: 65, volume: "24 100", competition: "Faible",  trend: +7  },
    ],
    beaute: [
      { rank: 1, niche: "Soins cheveux crépus naturels",              score: 97, volume: "84 200", competition: "Faible",  trend: +67 },
      { rank: 2, niche: "Recettes cosmétiques maison",                score: 93, volume: "56 400", competition: "Faible",  trend: +44 },
      { rank: 3, niche: "Tresses et coiffures africaines",            score: 89, volume: "72 100", competition: "Faible",  trend: +38 },
      { rank: 4, niche: "Maquillage peau noire débutante",            score: 87, volume: "48 300", competition: "Moyenne", trend: +31 },
      { rank: 5, niche: "Skincare routine minimaliste Afrique",       score: 84, volume: "39 600", competition: "Moyenne", trend: +26 },
      { rank: 6, niche: "Ongles nail art tendance CI",                score: 80, volume: "27 800", competition: "Faible",  trend: +49 },
      { rank: 7, niche: "Huiles essentielles beauté africaine",       score: 76, volume: "21 400", competition: "Faible",  trend: +22 },
      { rank: 8, niche: "Anti-âge naturel peaux noires",              score: 73, volume: "18 900", competition: "Faible",  trend: +17 },
      { rank: 9, niche: "Mode wax tendances 2025",                    score: 69, volume: "34 500", competition: "Forte",   trend: +11 },
      { rank: 10, niche: "Bien-être spa maison",                      score: 65, volume: "14 200", competition: "Faible",  trend: +8  },
    ],
    finance: [
      { rank: 1, niche: "Épargne et investissement mobile money",     score: 95, volume: "67 300", competition: "Faible",  trend: +58 },
      { rank: 2, niche: "Crypto débutants Afrique francophone",       score: 92, volume: "91 400", competition: "Moyenne", trend: +43 },
      { rank: 3, niche: "Immobilier locatif Abidjan Dakar",           score: 88, volume: "38 700", competition: "Faible",  trend: +35 },
      { rank: 4, niche: "Gestion budget famille Afrique",             score: 85, volume: "44 200", competition: "Faible",  trend: +29 },
      { rank: 5, niche: "Revenus passifs en ligne Afrique",           score: 83, volume: "58 100", competition: "Moyenne", trend: +47 },
      { rank: 6, niche: "Trading actions débutant francophone",       score: 79, volume: "29 800", competition: "Moyenne", trend: +21 },
      { rank: 7, niche: "Financer son business sans banque",          score: 76, volume: "22 600", competition: "Faible",  trend: +33 },
      { rank: 8, niche: "Retraite anticipée FIRE Afrique",            score: 72, volume: "14 300", competition: "Faible",  trend: +18 },
      { rank: 9, niche: "Microfinance et tontine digitale",           score: 68, volume: "19 700", competition: "Faible",  trend: +12 },
      { rank: 10, niche: "NFT et actifs numériques Afrique",          score: 63, volume: "31 200", competition: "Forte",   trend: -8  },
    ],
    cuisine: [
      { rank: 1, niche: "Recettes cuisine ivoirienne moderne",        score: 94, volume: "74 100", competition: "Faible",  trend: +51 },
      { rank: 2, niche: "Pâtisserie africaine maison",                score: 91, volume: "48 300", competition: "Faible",  trend: +39 },
      { rank: 3, niche: "Repas sains rapides Afrique",                score: 88, volume: "62 700", competition: "Faible",  trend: +33 },
      { rank: 4, niche: "Recettes végétariennes africaines",          score: 85, volume: "31 400", competition: "Faible",  trend: +44 },
      { rank: 5, niche: "Business traiteur Abidjan Dakar",            score: 82, volume: "24 800", competition: "Moyenne", trend: +27 },
      { rank: 6, niche: "Jus smoothies fruits tropicaux",             score: 78, volume: "37 500", competition: "Faible",  trend: +38 },
      { rank: 7, niche: "Recettes Thermomix Afrique",                 score: 74, volume: "18 200", competition: "Faible",  trend: +22 },
      { rank: 8, niche: "Pain et viennoiseries sans four",            score: 71, volume: "21 900", competition: "Faible",  trend: +16 },
      { rank: 9, niche: "Cuisine diabétique Afrique",                 score: 67, volume: "16 400", competition: "Faible",  trend: +14 },
      { rank: 10, niche: "Street food entrepreneuriat",               score: 63, volume: "28 700", competition: "Forte",   trend: +5  },
    ],
  };

  const getNiches = () => {
    const kw = keyword.toLowerCase();
    if (kw.includes("sport") || kw.includes("fitness") || kw.includes("foot") || kw.includes("gym") || kw.includes("muscul")) return NICHES_BY_THEME.sport;
    if (kw.includes("santé") || kw.includes("sante") || kw.includes("médecin") || kw.includes("minceur") || kw.includes("bien-être") || kw.includes("yoga")) return NICHES_BY_THEME.sante;
    if (kw.includes("beauté") || kw.includes("beaute") || kw.includes("cheveux") || kw.includes("coiffure") || kw.includes("maquillage") || kw.includes("skincare")) return NICHES_BY_THEME.beaute;
    if (kw.includes("finance") || kw.includes("argent") || kw.includes("invest") || kw.includes("crypto") || kw.includes("bourse") || kw.includes("trading")) return NICHES_BY_THEME.finance;
    if (kw.includes("cuisine") || kw.includes("recette") || kw.includes("food") || kw.includes("pâtisserie") || kw.includes("culinaire")) return NICHES_BY_THEME.cuisine;
    return NICHES_BY_THEME.default;
  };

  const [currentNiches, setCurrentNiches] = useState(NICHES_BY_THEME.default);

  const KNOWN_KEYWORDS = ["sport", "fitness", "foot", "gym", "muscul", "santé", "sante", "médecin", "minceur", "bien-être", "yoga", "beauté", "beaute", "cheveux", "coiffure", "maquillage", "skincare", "finance", "argent", "invest", "crypto", "bourse", "trading", "cuisine", "recette", "food", "pâtisserie", "culinaire", "business", "en ligne", "dropshipping", "freelance", "marketing"];

  const isKnownKeyword = () => {
    const kw = keyword.toLowerCase();
    return KNOWN_KEYWORDS.some(k => kw.includes(k));
  };

  const handleAnalyse = () => {
    if (!isKnownKeyword()) {
      window.location.href = `/auth/register?suggestion=${encodeURIComponent(keyword)}`;
      return;
    }
    setShowResults(false);
    setAnalysing(true);
    setTimeout(() => {
      setCurrentNiches(getNiches());
      setAnalysing(false);
      setShowResults(true);
    }, 1800);
  };

  return (
    <section id="demo" className="bg-[#EDE8E0] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Essayez maintenant</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Démo live — résultats réels</h2>
          <p className="text-slate-500 mt-3 max-w-xl">
            Entrez un mot-clé ci-dessous et voyez le type de résultats que vous obtenez. Dans l'application, ce sont de vraies données en temps réel.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-5 gap-8">
          {/* Panneau gauche — contrôles */}
          <div className="lg:col-span-2 space-y-4">
            {/* Barre de recherche */}
            <div className="bg-white border border-[#D6CFC4] rounded-2xl p-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Votre mot-clé</p>
              <input
                type="text"
                value={keyword}
                onChange={e => setKeyword(e.target.value)}
                onKeyDown={e => e.key === "Enter" && handleAnalyse()}
                placeholder="Ex: santé, finance, beauté..."
                className="w-full px-4 py-3 bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl text-sm text-slate-900 placeholder-slate-400 font-mono focus:outline-none focus:border-indigo-400 transition-colors mb-3"
              />
              {/* Suggestions rapides */}
              <div className="flex flex-wrap gap-1.5 mb-4">
                {["sport", "beauté", "santé", "finance", "cuisine", "business"].map(tag => (
                  <button key={tag} onClick={() => setKeyword(tag)}
                    className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-widest border transition-all ${keyword === tag ? "bg-slate-900 text-white border-slate-900" : "bg-[#F5F2ED] border-[#D6CFC4] text-slate-500 hover:border-slate-400"}`}>
                    {tag}
                  </button>
                ))}
              </div>
              <button onClick={handleAnalyse} disabled={analysing}
                className="w-full py-3.5 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-700 transition-colors text-sm uppercase tracking-widest flex items-center justify-center gap-2 disabled:opacity-60">
                {analysing ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                    Analyse en cours...
                  </>
                ) : (
                  <><Target className="w-4 h-4" /> Analyser les niches</>
                )}
              </button>
            </div>

            {/* Filtres */}
            <div className="bg-white border border-[#D6CFC4] rounded-2xl p-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Filtres</p>
              <div className="space-y-3">
                {[
                  { label: "Score minimum", val: "70/100" },
                  { label: "Concurrence",   val: "Faible + Moyenne" },
                  { label: "Marché cible",  val: "Afrique francophone" },
                  { label: "Sources",       val: "Toutes (x4)" },
                ].map(f => (
                  <div key={f.label} className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">{f.label}</span>
                    <span className="text-xs font-bold text-slate-900 bg-[#F5F2ED] px-2 py-1 rounded-lg">{f.val}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Légende scores */}
            <div className="bg-white border border-[#D6CFC4] rounded-2xl p-5">
              <p className="text-xs font-black uppercase tracking-widest text-slate-400 mb-3">Légende des scores</p>
              <div className="space-y-2.5">
                {[
                  { range: "85–100", label: "Excellent",  color: "bg-emerald-500", text: "text-emerald-700" },
                  { range: "70–84",  label: "Bon",        color: "bg-blue-500",    text: "text-blue-700" },
                  { range: "50–69",  label: "Acceptable", color: "bg-orange-400",  text: "text-orange-700" },
                  { range: "< 50",   label: "Risqué",     color: "bg-red-400",     text: "text-red-700" },
                ].map(s => (
                  <div key={s.range} className="flex items-center gap-3">
                    <span className={`w-2 h-2 rounded-full flex-shrink-0 ${s.color}`} />
                    <span className="text-xs font-bold text-slate-500">{s.range}</span>
                    <span className={`text-xs font-black ${s.text} ml-auto`}>{s.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Panneau droit — résultats */}
          <div className="lg:col-span-3">
            <div className="bg-white border border-[#D6CFC4] rounded-2xl overflow-hidden">
              <div className="px-5 py-4 border-b border-[#E8E2D9] flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <div className={`w-2 h-2 rounded-full ${analysing ? "bg-orange-400 animate-pulse" : "bg-emerald-500"}`} />
                  <span className="text-xs font-bold text-slate-600">
                    {analysing ? "Analyse en cours..." : `10 niches trouvées pour "${keyword}"`}
                  </span>
                </div>
                <span className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">30s · 4 sources</span>
              </div>
              <div className="p-4 space-y-3 max-h-[520px] overflow-y-auto">
                {analysing ? (
                  <div className="flex flex-col items-center justify-center py-16 gap-4">
                    <div className="w-10 h-10 border-3 border-indigo-200 border-t-indigo-600 rounded-full animate-spin" />
                    <p className="text-sm text-slate-400">Scan TikTok · Google · Amazon · Meta...</p>
                  </div>
                ) : showResults && currentNiches.map((n, i) => (
                  <NicheResultCard key={n.rank} {...n} delay={i * 80} />
                ))}
              </div>
            </div>
            <p className="text-center text-xs text-slate-400 mt-3 flex items-center justify-center gap-2">
              <span className="w-1.5 h-1.5 rounded-full bg-indigo-500 inline-block" />
              Ces résultats sont simulés pour la démo — dans l'app, ce sont de vraies données en temps réel
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}

// ── COMPARATIF ────────────────────────────────────────────────────────────────
function Comparatif() {
  return (
    <section className="bg-[#F5F2ED] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Niche Hunter vs méthode manuelle</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Pourquoi passer des heures quand 30 secondes suffisent ?</h2>
        </div>

        <div className="bg-white border border-[#C8BFB0] rounded-2xl overflow-hidden shadow-sm">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr>
                <th className="p-5 text-[10px] text-slate-400 font-black uppercase tracking-[0.2em] border-b border-[#E8E2D9] w-1/3">Critère</th>
                <th className="p-5 text-center bg-indigo-50 text-indigo-700 font-black border-b border-indigo-100 border-x border-indigo-100 w-1/3 text-xs uppercase tracking-widest">Niche Hunter</th>
                <th className="p-5 text-center text-slate-400 font-black border-b border-[#E8E2D9] w-1/3 bg-[#F5F2ED] text-xs uppercase tracking-widest">Méthode manuelle</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#E8E2D9]">
              {[
                { label: "Temps de recherche",     nh: "30 secondes",  manual: "3–5 heures",    nhStyle: "font-black text-slate-900 text-sm" },
                { label: "Score de rentabilité",   nh: true,           manual: false },
                { label: "Analyse concurrence",    nh: true,           manual: false },
                { label: "Données temps réel",     nh: true,           manual: false },
                { label: "4 sources simultanées",  nh: true,           manual: false },
                { label: "Tendance 30 jours",      nh: true,           manual: false },
                { label: "Marché africain ciblé",  nh: true,           manual: false },
                { label: "Coût",                   nh: "Gratuit",      manual: "Votre temps",   nhStyle: "font-black text-emerald-600 text-sm" },
              ].map((row, i) => (
                <tr key={i} className="hover:bg-[#F5F2ED]/50 transition-colors">
                  <td className="p-5 font-semibold text-slate-700 text-sm">{row.label}</td>
                  <td className="p-5 text-center bg-indigo-50/30 border-x border-indigo-50">
                    {typeof row.nh === "boolean"
                      ? <Check className="w-5 h-5 text-emerald-500 mx-auto" />
                      : <span className={row.nhStyle}>{row.nh}</span>}
                  </td>
                  <td className="p-5 text-center bg-[#F5F2ED]/50">
                    {typeof row.manual === "boolean"
                      ? <X className="w-5 h-5 text-slate-300 mx-auto" />
                      : <span className="text-slate-400 text-sm">{row.manual}</span>}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </section>
  );
}

// ── RÉSULTATS ─────────────────────────────────────────────────────────────────
function Results() {
  const stories = [
    { name: "Amadou S.", country: "🇸🇳 Sénégal",      avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", niche: "Élevage de poulets en cage",   sales: 847,  revenue: "8 470",  days: 47, quote: "J'ai trouvé ma niche en 30 secondes. L'ebook s'est vendu à 847 personnes en moins de 2 mois. Jamais je n'aurais pensé à cette niche sans l'outil." },
    { name: "Marie K.",  country: "🇨🇮 Côte d'Ivoire", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg",                          niche: "Jus Naturels & Détox",         sales: 1234, revenue: "6 170",  days: 63, quote: "ROI de fou. Je ne savais pas quoi vendre, l'outil m'a tout dit. J'ai lancé ma pub le soir même." },
    { name: "Jean-Marc T.", country: "🇨🇲 Cameroun",   avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg",  niche: "Marketing Digital pour PME",  sales: 612,  revenue: "9 180",  days: 51, quote: "Niche Hunter + Bookzy = la combinaison parfaite. 9 180€ de revenus en partant de zéro." },
  ];

  return (
    <section id="results" className="bg-[#EDE8E0] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Résultats réels</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Ils ont trouvé leur pépite</h2>
          <p className="text-slate-500 mt-3 max-w-xl text-base leading-relaxed">
            Des niches découvertes avec Niche Hunter, des ebooks créés avec Bookzy, des boutiques Smart Shop. Le flow complet qui génère des revenus.
          </p>
        </div>

        <div className="grid md:grid-cols-3 gap-6 lg:gap-8 mb-16">
          {stories.map((s, i) => (
            <div key={i} className="bg-white border border-[#D6CFC4] rounded-2xl p-6 lg:p-8 hover:border-slate-400 hover:shadow-md transition-all">
              <div className="flex items-center gap-4 mb-6">
                <img src={s.avatar} alt={s.name} className="w-12 h-12 rounded-full object-cover border-2 border-[#E8E2D9]" loading="lazy" />
                <div>
                  <p className="font-black text-slate-900 text-sm">{s.name}</p>
                  <p className="text-xs text-slate-400">{s.country}</p>
                </div>
              </div>
              <div className="bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl p-3 mb-5">
                <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">Niche trouvée</p>
                <p className="font-black text-slate-900 text-sm">{s.niche}</p>
              </div>
              <div className="flex justify-between py-4 border-t border-[#E8E2D9] mb-5">
                <div className="text-center">
                  <p className="text-xl font-black text-slate-900">{s.sales}</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Ventes</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-emerald-600">{s.revenue}€</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Revenus</p>
                </div>
                <div className="text-center">
                  <p className="text-xl font-black text-indigo-600">{s.days}j</p>
                  <p className="text-[10px] text-slate-400 uppercase tracking-widest">Durée</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(n => <Star key={n} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
              </div>
              <p className="text-slate-500 italic text-sm leading-relaxed">"{s.quote}"</p>
            </div>
          ))}
        </div>

        {/* Métriques globales */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { val: "2 450+", label: "Créateurs actifs",      sub: "sur Bookzy" },
            { val: "94%",    label: "Taux de satisfaction",  sub: "note 4.9/5" },
            { val: "147",    label: "Niches analysées/jour", sub: "en moyenne" },
            { val: "30s",    label: "Pour analyser",         sub: "un marché complet" },
          ].map(m => (
            <div key={m.val} className="bg-white border border-[#D6CFC4] rounded-2xl p-5 text-center">
              <p className="text-3xl font-black text-slate-900">{m.val}</p>
              <p className="text-xs font-bold text-slate-600 mt-1">{m.label}</p>
              <p className="text-[10px] text-slate-400">{m.sub}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ── TARIFS ────────────────────────────────────────────────────────────────────
function Pricing() {
  return (
    <section id="pricing" className="bg-[#F5F2ED] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Tarification</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Niche Hunter est inclus dans tous les plans</h2>
          <p className="text-slate-500 mt-3 max-w-xl text-base leading-relaxed">
            3 à 20 analyses gratuites par jour selon votre plan. Au-delà, 1 crédit par analyse. Les 20 crédits par ebook ne concernent que la génération — pas les recherches de niches.
          </p>
        </div>

        {/* Cards 3 plans */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
          {[
            {
              plan: "Pass Solo",
              prix: "5 100",
              credits: "60 cr./mois",
              niche: "3 gratuits/jour",
              analyse: "3 gratuits/jour",
              then: "puis 1 cr. chacune",
              dark: false,
              badge: null,
            },
            {
              plan: "Pack Créateur",
              prix: "19 125",
              credits: "330 cr./mois",
              niche: "8 gratuits/jour",
              analyse: "8 gratuits/jour",
              then: "puis 1 cr. chacune",
              dark: true,
              badge: "Recommandé",
            },
            {
              plan: "Pack Agence",
              prix: "31 500",
              credits: "700 cr./mois",
              niche: "20 gratuits/jour",
              analyse: "20 gratuits/jour",
              then: "puis 1 cr. chacune",
              dark: false,
              badge: null,
            },
          ].map(p => (
            <div key={p.plan} className={`relative rounded-2xl p-7 border ${p.dark ? "bg-slate-900 border-slate-800" : "bg-white border-[#C8BFB0]"}`}>
              {p.badge && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-indigo-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">
                  {p.badge}
                </div>
              )}
              <p className={`text-xs font-black uppercase tracking-widest mb-1 ${p.dark ? "text-white/40" : "text-slate-400"}`}>{p.plan}</p>
              <p className={`text-3xl font-black mb-0.5 ${p.dark ? "text-white" : "text-slate-900"}`}>{p.prix} <span className="text-base font-bold">FCFA</span></p>
              <p className={`text-xs mb-6 ${p.dark ? "text-white/30" : "text-slate-400"}`}>{p.credits}</p>
              <div className="space-y-3">
                <div className={`rounded-xl p-3 ${p.dark ? "bg-white/5" : "bg-[#F5F2ED]"}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${p.dark ? "text-white/30" : "text-slate-400"}`}>Niche Hunter</p>
                  <p className={`text-sm font-black ${p.dark ? "text-indigo-300" : "text-indigo-600"}`}>{p.niche}</p>
                  <p className={`text-[10px] mt-0.5 ${p.dark ? "text-white/20" : "text-slate-400"}`}>{p.then}</p>
                </div>
                <div className={`rounded-xl p-3 ${p.dark ? "bg-white/5" : "bg-[#F5F2ED]"}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${p.dark ? "text-white/30" : "text-slate-400"}`}>Analyse niche</p>
                  <p className={`text-sm font-black ${p.dark ? "text-indigo-300" : "text-indigo-600"}`}>{p.analyse}</p>
                  <p className={`text-[10px] mt-0.5 ${p.dark ? "text-white/20" : "text-slate-400"}`}>{p.then}</p>
                </div>
                <div className={`rounded-xl p-3 ${p.dark ? "bg-white/5" : "bg-[#F5F2ED]"}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${p.dark ? "text-white/30" : "text-slate-400"}`}>Générer un ebook</p>
                  <p className={`text-sm font-black ${p.dark ? "text-white" : "text-slate-900"}`}>20 crédits / ebook</p>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Gratuit */}
        <div className="bg-white border border-[#C8BFB0] rounded-2xl p-7 mb-8">
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full mb-3">
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-xs font-black text-emerald-700 uppercase tracking-wider">Sans abonnement — Gratuit</span>
              </div>
              <p className="text-2xl font-black text-slate-900 mb-1">0 FCFA</p>
              <p className="text-slate-400 text-sm">4 crédits offerts à l'inscription · Niche Hunter inclus à vie</p>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:min-w-[420px]">
              {[
                { label: "Niche Hunter",    val: "1 gratuits/mois", sub: "puis 1 cr." },
                { label: "Analyse niche",   val: "1 gratuits/mois", sub: "puis 1 cr." },
                { label: "Générer ebook",   val: "20 cr./ebook",    sub: "recharge à 150 FCFA/cr" },
              ].map(f => (
                <div key={f.label} className="bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl p-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">{f.label}</p>
                  <p className="text-sm font-black text-slate-900">{f.val}</p>
                  <p className="text-[10px] text-slate-400 mt-0.5">{f.sub}</p>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white font-black rounded-xl hover:bg-slate-700 transition-colors text-sm uppercase tracking-widest">
            Commencer gratuitement
          </Link>
          <Link href="/tarifs" className="inline-flex items-center justify-center gap-2 px-8 py-4 border border-[#C8BFB0] text-slate-700 font-bold rounded-xl hover:border-slate-400 transition-colors text-sm uppercase tracking-widest">
            Voir tous les tarifs
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── TESTIMONIALS MARQUEE ──────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="bg-[#EDE8E0] py-16 lg:py-24 overflow-hidden relative">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 mb-12 px-6 text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Ils utilisent Niche Hunter</p>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Vrais créateurs. Vraies niches.</h2>
      </div>
      {[0, 1].map(row => (
        <div
          key={row}
          className={`flex gap-5 mb-5 ${row === 1 ? "flex-row-reverse" : ""}`}
          style={{ animation: `marquee${row === 0 ? "" : "Rev"} 38s linear infinite`, width: "max-content" }}
        >
          {DOUBLED.map((t, i) => (
            <div key={i} className="w-72 flex-shrink-0 bg-white border border-[#C8BFB0] rounded-2xl p-6 shadow-sm">
              <div className="flex gap-1 mb-3">
                {[0,1,2,3,4].map(s => <Star key={s} className="w-3.5 h-3.5 text-yellow-400 fill-yellow-400" />)}
              </div>
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
        @keyframes marquee    { from { transform: translateX(0)    } to { transform: translateX(-50%) } }
        @keyframes marqueeRev { from { transform: translateX(-50%) } to { transform: translateX(0)    } }
      `}</style>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    {
      q: "Comment fonctionne l'analyse de niche ?",
      a: "Niche Hunter scanne en temps réel 10 000+ marchés (TikTok, Google Trends, Amazon KDP, Facebook Ads) et vous retourne les 10 meilleures opportunités avec un score de rentabilité sur 100, le volume de recherche mensuel, le niveau de concurrence et la tendance des 30 derniers jours.",
    },
    {
      q: "C'est vraiment gratuit ?",
      a: "Oui. Sans abonnement, vous avez 1 recherche Niche Hunter gratuite par mois et 1 analyse de niche approfondies par mois  renouvelées mensuellement. Au-delà, chaque analyse coûte 1 crédit. Vous recevez 4 crédits offerts à l'inscription. Niche Hunter ne disparaît jamais derrière un paywall.",
    },
    {
      q: "Combien d'analyses par mois selon mon plan ?",
      a: "Les quotas gratuits augmentent avec le plan : Sans abonnement → 1/mois ; Pass Solo → 3/jours ; Pack Créateur → 8/jours ; Pack Agence → 20/jours. Au-delà du quota, chaque analyse supplémentaire (Niche Hunter ou analyse approfondie) coûte 1 crédit.",
    },
    {
      q: "Quels sont les plans disponibles ?",
      a: "4 options : Sans abonnement (4 crédits offerts, recharge à 150 FCFA/crédit), Pass Solo à 5 100 FCFA/mois (60 crédits), Pack Créateur à 19 125 FCFA/mois (330 crédits), Pack Agence à 31 500 FCFA/mois (700 crédits). Les crédits s'accumulent et ils n'expirent pas en fin de mois.",
    },
    {
      q: "Combien de crédits pour générer un ebook ?",
      a: "20 crédits par ebook complet généré. Avec le Pass Solo (60 crédits) : jusqu'à 3 ebooks/jours. Avec le Pack Créateur (330 crédits) : jusqu'à 16 ebooks/mois. Avec le Pack Agence (700 crédits) : jusqu'à 35 ebooks/mois. Les crédits restants peuvent servir aux analyses de niche supplémentaires.",
    },
    {
      q: "Les niches sont-elles adaptées à l'Afrique ?",
      a: "Oui. Nos algorithmes sont calibrés pour les marchés francophones africains : Côte d'Ivoire, Sénégal, Cameroun, Mali, Bénin, Burkina Faso et la diaspora africaine en France et en Belgique. Les volumes de recherche et les niveaux de concurrence reflètent ces marchés spécifiques.",
    },
    {
      q: "Quelle différence entre Niche Hunter et l'analyse de niche ?",
      a: "Niche Hunter = outil rapide pour trouver des idées de niches rentables en 30 secondes (liste de 10 niches scorées). L'analyse de niche = approfondissement d'une niche choisie avec des données détaillées sur le marché, la concurrence et le potentiel de revenus. Les deux sont inclus dans tous les plans.",
    },
    {
      q: "Dois-je avoir des compétences techniques ?",
      a: "Aucune. Niche Hunter trouve QUOI vendre. Bookzy rédige l'ebook automatiquement avec l'IA. Ebook Designer met en page le PDF. Smart Shop crée votre boutique en ligne. Vous n'avez besoin d'aucune compétence en technique, graphisme ou rédaction.",
    },
  ];

  return (
    <section id="faq" className="bg-[#F5F2ED] py-16 lg:py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-3xl mx-auto">
        <div className="mb-12 pb-10 border-b border-[#C8BFB0] text-center">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Questions fréquentes</p>
          <h2 className="text-4xl font-black text-slate-900 tracking-tight">FAQ</h2>
        </div>
        <div className="space-y-3">
          {faqs.map((faq, i) => (
            <div key={i} className="bg-white border border-[#D6CFC4] rounded-xl overflow-hidden">
              <button onClick={() => setOpenIdx(openIdx === i ? -1 : i)}
                className="w-full flex items-center justify-between p-5 text-left">
                <span className={`font-bold text-sm ${openIdx === i ? "text-indigo-600" : "text-slate-900"}`}>
                  {faq.q}
                </span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openIdx === i ? "rotate-180 text-indigo-600" : "text-slate-400"}`} />
              </button>
              <div className={`overflow-hidden transition-all duration-200 ${openIdx === i ? "max-h-56 opacity-100" : "max-h-0 opacity-0"}`}>
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
    <section className="bg-slate-900 py-28 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full bg-indigo-600/10 blur-3xl" />
      </div>
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-6">Prêt à trouver votre niche ?</p>
        <h2 className="text-5xl md:text-6xl font-black text-white tracking-tight leading-[0.9] mb-6">
          Votre niche.<br />
          <span className="text-white/40">Votre ebook.</span><br />
          Vos ventes.
        </h2>
        <p className="text-white/40 text-lg mb-12 max-w-lg mx-auto">
          3 analyses gratuites par jour. Aucune carte bancaire. En 30 secondes vous savez exactement quoi vendre et à qui.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-10 py-5 bg-white text-slate-900 font-black rounded-xl hover:bg-white/90 transition-colors text-sm uppercase tracking-widest">
            Analyser gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/smart-shop" className="inline-flex items-center justify-center gap-2 px-8 py-5 border border-white/20 hover:border-white/40 text-white/60 hover:text-white font-bold rounded-xl transition-all text-sm uppercase tracking-widest">
            Voir Smart Shop
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/20 uppercase tracking-widest">✓ Gratuit · ✓ Sans carte bancaire · ✓ 30 secondes</p>
      </div>
    </section>
  );
}

// ── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  const scrollTo = (id) => document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  return (
    <footer className="bg-[#EDE8E0] border-t border-[#D6CFC4] pt-16 pb-10 relative">
      <div className="absolute inset-0 opacity-[0.02] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative max-w-6xl mx-auto px-6">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <BookOpenSVG className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">Bookzy</span>
            </Link>
            <p className="text-slate-500 text-sm leading-relaxed">Trouvez des niches rentables et créez des produits digitaux avec l'IA.</p>
          </div>
          <div>
            <h3 className="font-black mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Produit</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><button onClick={() => scrollTo("features")} className="hover:text-slate-900 transition-colors">Comment ça marche</button></li>
              <li><button onClick={() => scrollTo("demo")} className="hover:text-slate-900 transition-colors">Démo live</button></li>
              <li><Link href="/auth/register" className="hover:text-slate-900 transition-colors">Créer un compte</Link></li>
              <li><Link href="/ebook-designer" className="hover:text-slate-900 transition-colors">Ebook Designer</Link></li>
              <li><Link href="/smart-shop" className="hover:text-slate-900 transition-colors">Smart Shop</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-black mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Ressources</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><button onClick={() => scrollTo("results")} className="hover:text-slate-900 transition-colors">Success Stories</button></li>
              <li><button onClick={() => scrollTo("faq")} className="hover:text-slate-900 transition-colors">FAQ</button></li>
              <li><Link href="/suggestions" className="hover:text-slate-900 transition-colors">Suggestions</Link></li>
              <li><Link href="/changelog" className="hover:text-slate-900 transition-colors">Nouveautés</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-black mb-4 text-xs uppercase tracking-[0.2em] text-slate-400">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Support 7j/7</li>
              <li><a href="mailto:support@bookzy.io" className="hover:text-slate-900 transition-colors">support@bookzy.io</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#C8BFB0] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2025 Bookzy Inc. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="hover:text-slate-900 transition-colors">CGU</Link>
            <Link href="/legal/confidentialite" className="hover:text-slate-900 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ── PAGE ──────────────────────────────────────────────────────────────────────
export default function NicheHunterPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-[#F5F2ED]" />;

  return (
    <div className="font-sans bg-[#F5F2ED] overflow-x-hidden">
      <Nav />
      <Hero />
      <DemoScreenshot />
      <Sources />
      <HowItWorks />
      <DemoInteractive />
      <Comparatif />
      <Results />
      <Pricing />
      <Testimonials />
      <FAQ />
      <CTAFinal />
      <Footer />
    </div>
  );
}