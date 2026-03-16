"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, ArrowLeft, Check, X, Menu, Star,
  Youtube, Play, Wand2, FileText, ChevronDown,
  Zap, BookOpen, Sparkles, Copy, MousePointer,
  TrendingUp, Users, Clock, Lock
} from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

function BookOpenSVG(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

const TESTIMONIALS = [
  { name: "Marc Kouadio", role: "Infopreneur", location: "Abidjan, CI", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "J'ai collé le lien d'une vidéo de 47 minutes. L'IA a sorti un ebook de 62 pages. J'ai vendu ça 3 500 FCFA le soir même.", result: "3 500 FCFA la première vente" },
  { name: "Aïcha Koné", role: "Créatrice Food", location: "Dakar, SN", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg", quote: "Le titre généré était 10x meilleur que le mien. Le sommaire recommandé par l'IA était parfait, j'ai juste cliqué Générer.", result: "612 ventes en 1 mois" },
  { name: "Yann Dubois", role: "Formateur", location: "Douala, CM", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg", quote: "3 vidéos YouTube converties en 3 ebooks. 13 365 FCFA de revenus passifs en moins d'une semaine.", result: "13 365 FCFA en 7 jours" },
  { name: "Clara Martin", role: "Coach Business", location: "Paris, FR", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/7fef677cbafd1e0f1f474ad0fa14a341.jpg", quote: "L'analyse du contenu est bluffante. L'IA a détecté exactement les 7 chapitres que j'aurais écrits moi-même.", result: "3 ebooks créés en 1 journée" },
  { name: "Kofi Mensah", role: "Digital Marketer", location: "Accra, GH", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "En 60 secondes j'avais le concept complet. En 3 minutes l'ebook était généré. J'ai partagé le lien sur mon Instagram.", result: "200+ DMs en 24h" },
  { name: "Fatou Diallo", role: "Entrepreneuse", location: "Bamako, ML", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg", quote: "La boutique Smart Shop est incroyable. J'ai créé ma page en 10 minutes et partagé le lien sur WhatsApp.", result: "5 ventes le 1er jour" },
];
const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

// ─── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);

  const scrollTo = (e, id) => {
    e.preventDefault();
    setOpen(false);
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth" });
  };

  const links = [
    { label: "Comment ça marche", id: "flow" },
    { label: "Templates", id: "templates" },
    { label: "Tarifs", id: "pricing" },
    { label: "FAQ", id: "faq" },
  ];

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F5F2ED]/95 backdrop-blur-md border-b border-[#D6CFC4] shadow-sm" : "bg-transparent"}`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between h-16 md:h-20">

        <div className="flex items-center gap-5">
          <Link href="/" className="group flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Bookzy</span>
          </Link>
          <div className="w-px h-5 bg-[#C8BFB0] hidden sm:block" />
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center">
              <Youtube className="w-3.5 h-3.5 text-white" />
            </div>
            <div>
              <p className="text-xs font-black uppercase tracking-[0.2em] text-slate-900 leading-none">Youbook</p>
              <p className="text-[9px] font-semibold text-red-600 uppercase tracking-widest mt-0.5">by Bookzy</p>
            </div>
          </div>
        </div>

        <div className="hidden lg:flex items-center gap-8">
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={e => scrollTo(e, l.id)}
              className="text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
              {l.label}
            </a>
          ))}
        </div>

        <div className="hidden lg:flex items-center gap-3">
          <Link href="/auth/login" className="px-4 py-2 border border-[#C8BFB0] bg-white text-slate-600 text-[11px] font-bold rounded-lg uppercase tracking-widest hover:border-slate-400 transition-colors">Connexion</Link>
          <Link href="/auth/register" className="px-4 py-2 bg-red-600 text-white text-[11px] font-bold rounded-lg uppercase tracking-widest hover:bg-red-700 transition-colors flex items-center gap-1.5">
            Essayer gratuit <Play className="w-2.5 h-2.5" fill="currentColor" />
          </Link>
        </div>

        <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-[#E8E2D9]">
          {open ? <X className="w-5 h-5 text-slate-700" /> : <Menu className="w-5 h-5 text-slate-700" />}
        </button>
      </div>

      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#F5F2ED] border-b border-[#D6CFC4] p-6 shadow-xl flex flex-col gap-4 lg:hidden">
          {links.map(l => (
            <a key={l.id} href={`#${l.id}`} onClick={e => scrollTo(e, l.id)}
              className="text-sm font-black text-slate-700 uppercase tracking-widest py-2 border-b border-[#E8E2D9]">{l.label}</a>
          ))}
          <div className="flex flex-col gap-3 mt-1">
            <Link href="/auth/login" onClick={() => setOpen(false)} className="text-center py-3 font-bold text-slate-600 border border-[#C8BFB0] rounded-xl text-sm">Connexion</Link>
            <Link href="/auth/register" onClick={() => setOpen(false)} className="flex items-center justify-center gap-2 bg-red-600 text-white px-6 py-3.5 rounded-xl font-black text-sm uppercase tracking-widest">
              <Play className="w-3.5 h-3.5" fill="currentColor" /> Essayer gratuit
            </Link>
          </div>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ───────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F5F2ED] px-6 pt-24 pb-16">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      {/* Cercle déco */}
      <div className="absolute top-16 right-[-80px] w-[420px] h-[420px] rounded-full border border-[#D6CFC4] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-60px] left-[-100px] w-[320px] h-[320px] rounded-full bg-red-50 opacity-50 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">

        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C8BFB0] bg-white/60 backdrop-blur-sm mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-red-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">447 vidéos converties aujourd'hui</span>
        </div>

        <h1 className="font-black leading-[0.88] tracking-tight mb-8">
          <span className="block text-6xl md:text-8xl lg:text-[108px] text-slate-900">You</span>
          <span className="block text-6xl md:text-8xl lg:text-[108px] text-red-600">book</span>
        </h1>

        <p className="text-slate-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-2">
          Collez une URL YouTube. L'IA lit la vidéo, comprend le contenu, recommande le sommaire.
          <span className="text-slate-900 font-semibold"> Vous validez, l'ebook sort en 60 secondes.</span>
        </p>
        <p className="text-slate-400 text-sm mb-10 uppercase tracking-widest font-bold">
          Transcription · Analyse Gemini · Sommaire recommandé · 30 templates · PDF pro
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/auth/register" className="group inline-flex items-center gap-3 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl transition-all text-sm uppercase tracking-widest shadow-lg shadow-red-600/20">
            <Play className="w-4 h-4" fill="currentColor" />
            Convertir gratuitement
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <div className="inline-flex items-center gap-2 px-5 py-4 border border-[#C8BFB0] rounded-xl bg-white/60">
            <span className="text-xs font-black text-slate-900 uppercase tracking-widest">2 cr. après quota</span>
            <span className="text-xs text-slate-400">· gratuit selon plan</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto">
          {[
            { value: "30s", label: "Analyse IA" },
            { value: "30", label: "Templates" },
            { value: "4+", label: "Analyses offertes" },
            { value: "2 cr.", label: "Après quota" },
          ].map(s => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-slate-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-8 bg-slate-400 animate-pulse" />
      </div>
    </section>
  );
}

// ─── FLOW 4 ÉTAPES ─────────────────────────────────────────────────────────────
function Flow() {
  const [activeStep, setActiveStep] = useState(0);

  const steps = [
    {
      num: "01",
      label: "Copier",
      icon: Copy,
      title: "Copiez le lien depuis YouTube",
      desc: "N'importe quelle vidéo avec transcription : tutoriels, formations, podcasts, interviews, conférences. Collez l'URL dans Youbook.",
      visual: (
        <div className="bg-white rounded-2xl border border-[#D6CFC4] p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-3">URL YouTube</p>
          <div className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-xl p-3.5">
            <div className="w-7 h-7 rounded-lg bg-red-600 flex items-center justify-center flex-shrink-0">
              <Youtube className="w-3.5 h-3.5 text-white" />
            </div>
            <span className="text-xs text-slate-500 font-mono truncate flex-1">youtube.com/watch?v=dQw4w9WgXcQ</span>
            <div className="w-6 h-6 rounded bg-slate-200 flex items-center justify-center flex-shrink-0">
              <ArrowRight className="w-3 h-3 text-slate-500" />
            </div>
          </div>
          <div className="mt-4 space-y-1.5">
            {["Tutoriels & formations", "Podcasts & interviews", "Conférences & talks", "Vidéos éducatives"].map(t => (
              <div key={t} className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="text-xs text-slate-500">{t}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      color: "red",
    },
    {
      num: "02",
      label: "Analyser",
      icon: Wand2,
      title: "L'IA lit et comprend la vidéo",
      desc: "Gemini extrait la transcription complète, identifie les idées clés, le problème traité, la transformation promise et l'audience cible. Tout ça en 30 secondes.",
      visual: (
        <div className="bg-white rounded-2xl border border-[#D6CFC4] p-6 shadow-sm space-y-3">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Résultats de l'analyse IA</p>
          {[
            { label: "Titre généré", val: "Comment lancer un business digital rentable depuis l'Afrique", color: "slate" },
            { label: "Hook", val: "L'angle que personne n'a encore exploité sur ce marché", color: "blue" },
            { label: "Problème résolu", val: "Manque de revenus stables et de liberté géographique", color: "orange" },
            { label: "Transformation", val: "Après lecture, tu seras capable de générer 500€/mois en ligne", color: "emerald" },
            { label: "Audience", val: "Entrepreneurs 25-40 ans · Niveau débutant", color: "violet" },
          ].map(item => (
            <div key={item.label} className="flex items-start gap-2.5">
              <div className={`w-1.5 h-1.5 rounded-full flex-shrink-0 mt-1.5 ${item.color === "blue" ? "bg-blue-500" : item.color === "orange" ? "bg-orange-500" : item.color === "emerald" ? "bg-emerald-500" : item.color === "violet" ? "bg-violet-500" : "bg-slate-400"}`} />
              <div>
                <p className="text-[9px] font-black uppercase tracking-widest text-slate-400">{item.label}</p>
                <p className="text-xs text-slate-700 mt-0.5 leading-snug">{item.val}</p>
              </div>
            </div>
          ))}
        </div>
      ),
      color: "blue",
    },
    {
      num: "03",
      label: "Valider",
      icon: BookOpen,
      title: "Validez le sommaire recommandé par l'IA",
      desc: "L'IA propose un sommaire complet avec le nombre de chapitres optimal. Vous choisissez le nombre de chapitres, le titre, et sélectionnez votre thème parmi les 30 templates.",
      visual: (
        <div className="bg-white rounded-2xl border border-[#D6CFC4] p-6 shadow-sm">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[10px] font-black uppercase tracking-widest text-slate-400">Sommaire recommandé</p>
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-emerald-50 border border-emerald-200 rounded-full">
              <div className="w-1.5 h-1.5 rounded-full bg-emerald-500" />
              <span className="text-[9px] font-black text-emerald-700 uppercase tracking-wider">IA recommande 7 ch.</span>
            </div>
          </div>
          {/* Sélecteur chapitres */}
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xs text-slate-500 font-bold">Chapitres :</span>
            <div className="flex gap-1.5">
              {[3,4,5,6,7,8,9,10].map(n => (
                <div key={n} className={`w-7 h-7 rounded-lg flex items-center justify-center text-xs font-black ${n === 7 ? "bg-slate-900 text-white" : "bg-slate-100 text-slate-500"}`}>{n}</div>
              ))}
            </div>
          </div>
          <div className="space-y-1.5 mb-4">
            {[
              "Introduction : L'opportunité africaine",
              "Ch. 1 : Choisir sa niche rentable",
              "Ch. 2 : Créer son premier produit digital",
              "Ch. 3 : Construire sa présence en ligne",
              "Ch. 4 : Vendre sans budget pub",
              "Ch. 5 : Automatiser et scaler",
              "Conclusion + Plan d'action 30 jours",
            ].map((ch, i) => (
              <div key={i} className="flex items-center gap-2.5 py-1.5 px-2.5 rounded-lg bg-slate-50 border border-slate-100">
                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="text-xs text-slate-700">{ch}</span>
              </div>
            ))}
          </div>
          <div className="flex items-center gap-2 pt-3 border-t border-slate-100">
            <span className="text-xs text-slate-500 font-bold">Thème :</span>
            <div className="flex gap-1.5">
              {[
                { c1: "#667eea", c2: "#764ba2" },
                { c1: "#d4af37", c2: "#ffd700" },
                { c1: "#0f766e", c2: "#14b8a6" },
                { c1: "#f97316", c2: "#dc2626" },
                { c1: "#0a0e27", c2: "#00d4ff" },
              ].map((t, i) => (
                <div key={i} className={`w-7 h-7 rounded-lg ${i === 0 ? "ring-2 ring-slate-900 ring-offset-1" : ""}`}
                  style={{ background: `linear-gradient(135deg, ${t.c1}, ${t.c2})` }} />
              ))}
              <div className="w-7 h-7 rounded-lg bg-slate-100 border border-slate-200 flex items-center justify-center">
                <span className="text-[8px] font-black text-slate-500">+25</span>
              </div>
            </div>
          </div>
        </div>
      ),
      color: "violet",
    },
    {
      num: "04",
      label: "Générer",
      icon: FileText,
      title: "L'IA génère l'ebook pro en 60 secondes",
      desc: "Bookzy rédige chaque chapitre, applique le design du template, génère la couverture et produit un PDF haute qualité. Kit marketing WhatsApp et posts réseaux inclus.",
      visual: (
        <div className="bg-white rounded-2xl border border-[#D6CFC4] p-6 shadow-sm">
          <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-4">Ebook généré</p>
          {/* Mini ebook preview */}
          <div className="flex gap-4 items-start mb-4">
            <div className="w-24 h-32 rounded-xl flex-shrink-0 overflow-hidden shadow-lg"
              style={{ background: "linear-gradient(135deg, #667eea, #764ba2)" }}>
              <div className="p-2.5 text-white h-full flex flex-col">
                <div className="text-[6px] uppercase tracking-widest opacity-50 mb-1">Bookzy</div>
                <div className="text-[8px] font-black leading-tight flex-1">Comment lancer un business digital rentable depuis l'Afrique</div>
                <div className="text-[6px] opacity-40 uppercase">Par vous</div>
              </div>
            </div>
            <div className="flex-1 space-y-2">
              {[
                { label: "Pages", val: "38 pages" },
                { label: "Format", val: "PDF A4 pro" },
                { label: "Design", val: "Moderne" },
                { label: "Cover", val: "Incluse" },
              ].map(m => (
                <div key={m.label} className="flex items-center justify-between">
                  <span className="text-[10px] text-slate-400 uppercase tracking-wider font-bold">{m.label}</span>
                  <span className="text-xs font-bold text-slate-700">{m.val}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="border-t border-slate-100 pt-3 space-y-1.5">
            <p className="text-[9px] font-black uppercase tracking-widest text-slate-400 mb-2">Kit marketing inclus</p>
            {["Posts Instagram + Facebook prêts", "Scripts WhatsApp d'envoi", "Textes de vente optimisés"].map(k => (
              <div key={k} className="flex items-center gap-2">
                <Check className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span className="text-xs text-slate-600">{k}</span>
              </div>
            ))}
          </div>
        </div>
      ),
      color: "emerald",
    },
  ];

  const colorMap = {
    red: { dot: "bg-red-500", badge: "bg-red-50 text-red-700 border-red-200", active: "border-red-300 bg-red-50/50" },
    blue: { dot: "bg-blue-500", badge: "bg-blue-50 text-blue-700 border-blue-200", active: "border-blue-300 bg-blue-50/50" },
    violet: { dot: "bg-violet-500", badge: "bg-violet-50 text-violet-700 border-violet-200", active: "border-violet-300 bg-violet-50/50" },
    emerald: { dot: "bg-emerald-500", badge: "bg-emerald-50 text-emerald-700 border-emerald-200", active: "border-emerald-300 bg-emerald-50/50" },
  };

  return (
    <section id="flow" className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-14 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Le flow complet</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            De YouTube à l'ebook pro<br />en 4 étapes.
          </h2>
          <p className="text-slate-500 mt-3 text-base max-w-xl">Vous copiez le lien. L'IA fait le reste. Vous validez et téléchargez.</p>
        </div>

        {/* Tabs étapes */}
        <div className="flex flex-wrap gap-2 mb-10">
          {steps.map((s, i) => {
            const c = colorMap[s.color];
            return (
              <button key={i} onClick={() => setActiveStep(i)}
                className={`flex items-center gap-2.5 px-4 py-2.5 rounded-xl border transition-all ${activeStep === i ? c.active + " border-opacity-100" : "bg-white border-[#D6CFC4] hover:border-slate-300"}`}>
                <span className={`text-[10px] font-black ${activeStep === i ? "" : "text-slate-300"}`}>{s.num}</span>
                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-black uppercase tracking-wider border ${c.badge}`}>{s.label}</span>
                <s.icon className={`w-3.5 h-3.5 ${activeStep === i ? "text-slate-700" : "text-slate-400"}`} />
              </button>
            );
          })}
        </div>

        {/* Contenu actif */}
        {steps.map((s, i) => i === activeStep && (
          <div key={i} className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
            {/* Texte */}
            <div>
              <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full border text-[10px] font-black uppercase tracking-widest mb-6 ${colorMap[s.color].badge}`}>
                <s.icon className="w-3 h-3" />
                Étape {s.num} · {s.label}
              </div>
              <h3 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-4 leading-tight">{s.title}</h3>
              <p className="text-slate-500 text-base leading-relaxed mb-8">{s.desc}</p>

              {i === 0 && (
                <div className="space-y-3">
                  {["Toute vidéo YouTube avec sous-titres ou transcription", "Tutoriels, formations, podcasts, conférences", "Vidéos en français, anglais, arabe — toutes langues", "Pas de limite de durée · Jusqu'à 15 000 caractères analysés"].map(f => (
                    <div key={f} className="flex items-start gap-3">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <span className="text-sm text-slate-600">{f}</span>
                    </div>
                  ))}
                </div>
              )}
              {i === 1 && (
                <div className="grid grid-cols-2 gap-3">
                  {[
                    { icon: "📝", label: "Titre accrocheur", sub: "Optimisé pour vendre" },
                    { icon: "🎯", label: "Hook unique", sub: "L'angle différenciateur" },
                    { icon: "👥", label: "Audience détectée", sub: "Niveau + profil exact" },
                    { icon: "💡", label: "3 insights clés", sub: "Extraits mot pour mot" },
                    { icon: "🔄", label: "Transformation", sub: "Ce que le lecteur gagnera" },
                    { icon: "📖", label: "Verbatim", sub: "La citation la plus forte" },
                  ].map(f => (
                    <div key={f.label} className="p-3.5 bg-white border border-[#D6CFC4] rounded-xl">
                      <div className="text-base mb-1">{f.icon}</div>
                      <p className="text-xs font-bold text-slate-900">{f.label}</p>
                      <p className="text-[10px] text-slate-400 mt-0.5">{f.sub}</p>
                    </div>
                  ))}
                </div>
              )}
              {i === 2 && (
                <div className="space-y-3">
                  {[
                    { label: "De 3 à 10 chapitres au choix", sub: "L'IA recommande le nombre optimal selon le contenu" },
                    { label: "30 templates professionnels", sub: "Moderne, Luxe, Tech, Nature, Corporate, Fashion et plus" },
                    { label: "Titre et description pré-remplis", sub: "Modifiables avant de lancer la génération" },
                    { label: "Aperçu du template avant de payer", sub: "Changez de thème à l'infini gratuitement" },
                  ].map(f => (
                    <div key={f.label} className="flex items-start gap-3 p-3.5 bg-white border border-[#D6CFC4] rounded-xl">
                      <Check className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{f.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{f.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}
              {i === 3 && (
                <div className="space-y-3">
                  {[
                    { label: "PDF haute qualité rendu par Puppeteer", sub: "Moteur de rendu Chrome — qualité impression, pas Word" },
                    { label: "Couverture générée automatiquement", sub: "Selon votre template et votre titre" },
                    { label: "Kit marketing complet inclus", sub: "Posts, scripts WhatsApp, textes de vente" },
                    { label: "Téléchargement immédiat", sub: "Prêt à mettre en vente sur Smart Shop ou WhatsApp" },
                  ].map(f => (
                    <div key={f.label} className="flex items-start gap-3 p-3.5 bg-white border border-[#D6CFC4] rounded-xl">
                      <Check className="w-4 h-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                      <div>
                        <p className="text-sm font-bold text-slate-900">{f.label}</p>
                        <p className="text-xs text-slate-400 mt-0.5">{f.sub}</p>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {i < 3 && (
                <button onClick={() => setActiveStep(i + 1)}
                  className="mt-8 inline-flex items-center gap-2 text-xs font-black uppercase tracking-widest text-slate-500 hover:text-slate-900 transition-colors">
                  Étape suivante <ArrowRight className="w-3.5 h-3.5" />
                </button>
              )}
              {i === 3 && (
                <Link href="/auth/register"
                  className="mt-8 inline-flex items-center gap-2 px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-colors">
                  <Play className="w-3.5 h-3.5" fill="currentColor" /> Essayer maintenant
                </Link>
              )}
            </div>

            {/* Visuel */}
            <div>{s.visual}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

// ─── TEMPLATES ─────────────────────────────────────────────────────────────────
function Templates() {
  return (
    <section id="templates" className="bg-slate-900 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-12 pb-10 border-b border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-3">Design</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">
              30 templates.<br />30 univers.
            </h2>
            <p className="text-white/40 text-sm md:max-w-xs">Changez de template à l'infini avant de générer. Aperçu gratuit à chaque changement.</p>
          </div>
        </div>

        {/* Image des templates */}
        <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl mb-8">
          <div className="bg-slate-800/60 border-b border-white/10 px-4 py-2.5 flex items-center gap-3">
            <div className="flex gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-500/60" />
              <div className="w-3 h-3 rounded-full bg-amber-500/60" />
              <div className="w-3 h-3 rounded-full bg-emerald-500/60" />
            </div>
            <div className="flex-1 max-w-xs mx-auto bg-white/10 border border-white/10 rounded-md px-3 py-1 flex items-center gap-2">
              <div className="w-2 h-2 rounded-full bg-emerald-400" />
              <span className="text-[10px] text-white/40 font-mono">app.bookzy.io/dashboard/projets/nouveau</span>
            </div>
          </div>
          <img
            src="/templates.png"
            alt="Les 30 templates Youbook"
            className="w-full h-auto object-cover object-top"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[
            { icon: "🎨", title: "Changement instantané", desc: "Cliquez sur un template, l'aperçu se met à jour immédiatement. Gratuit à chaque changement." },
            { icon: "📐", title: "Couverture automatique", desc: "Chaque template génère une couverture unique avec votre titre, sous-titre et nom d'auteur." },
            { icon: "✨", title: "PDF haute qualité", desc: "Rendu Puppeteer — qualité impression professionnelle. Prêt à vendre dès le téléchargement." },
          ].map(f => (
            <div key={f.title} className="p-6 bg-white/5 border border-white/10 rounded-2xl">
              <div className="text-2xl mb-3">{f.icon}</div>
              <h3 className="text-base font-black text-white mb-2">{f.title}</h3>
              <p className="text-sm text-white/40 leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── AVANT / APRÈS ─────────────────────────────────────────────────────────────
function AvantApres() {
  return (
    <section className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">

        <div className="mb-16 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">La réalité</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Avant Youbook vs après.
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* SANS YOUBOOK */}
          <div className="rounded-2xl border-2 border-red-200 bg-red-50/30 overflow-hidden">
            <div className="bg-red-100 px-8 py-5 flex items-center gap-3 border-b border-red-200">
              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-black text-slate-900 text-base uppercase tracking-wider">Sans Youbook</p>
                <p className="text-red-500 text-xs font-bold">La galère habituelle</p>
              </div>
            </div>
            <div className="p-8 space-y-4">
              {[
                { pain: "2–4h pour regarder la vidéo en entier", sub: "Et prendre des notes à la main" },
                { pain: "1–2h pour structurer un plan", sub: "Souvent mal agencé, trop long ou trop court" },
                { pain: "3–5h de rédaction", sub: "Paraphraser ce que vous avez regardé, chapitre par chapitre" },
                { pain: "2h de mise en page sur Canva ou Word", sub: "Sans résultat professionnel au final" },
                { pain: "Aucun kit marketing", sub: "Vous devez tout créer : posts, scripts, visuels" },
                { pain: "Total : 10–15h de travail", sub: "Pour un résultat qui ne se vend pas forcément" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.pain}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* AVEC YOUBOOK */}
          <div className="rounded-2xl border-2 border-red-400 bg-white overflow-hidden">
            <div className="bg-red-600 px-8 py-5 flex items-center gap-3 border-b border-red-700">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <Youtube className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-black text-white text-base uppercase tracking-wider">Avec Youbook</p>
                <p className="text-red-200 text-xs font-bold">3 minutes. Résultat pro.</p>
              </div>
            </div>
            <div className="p-8 space-y-4">
              {[
                { win: "Collez l'URL YouTube — 5 secondes", sub: "Youbook récupère la transcription automatiquement" },
                { win: "L'IA analyse en 30 secondes", sub: "Titre, hook, plan, audience, insights — tout généré" },
                { win: "Validez le sommaire recommandé", sub: "Ajustez le nombre de chapitres en un clic (3 à 10)" },
                { win: "Choisissez parmi 30 templates", sub: "Aperçu gratuit avant de générer" },
                { win: "Ebook + cover + kit marketing générés", sub: "PDF professionnel en 60 secondes" },
                { win: "Total : moins de 3 minutes", sub: "Prêt à mettre en vente sur WhatsApp ou Smart Shop" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-50 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-red-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-800">{item.win}</p>
                    <p className="text-xs text-slate-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TÉMOIGNAGES MARQUEE ────────────────────────────────────────────────────────
function Testimonials() {
  return (
    <section className="bg-[#EDE8E0] py-20 px-0 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto px-6 mb-12">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Ils ont essayé</p>
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Ce qu'ils en disent.</h2>
      </div>

      <div className="overflow-hidden">
        <div className="flex gap-5 w-max" style={{ animation: "marquee 40s linear infinite" }}>
          {DOUBLED.map((t, i) => (
            <div key={i} className="w-72 flex-shrink-0 bg-white border border-[#D6CFC4] rounded-2xl p-6">
              <div className="flex items-center gap-3 mb-4">
                <img src={t.avatar} alt={t.name} className="w-10 h-10 rounded-full object-cover flex-shrink-0" />
                <div>
                  <p className="text-sm font-bold text-slate-900">{t.name}</p>
                  <p className="text-[10px] text-slate-400">{t.role} · {t.location}</p>
                </div>
              </div>
              <div className="flex gap-0.5 mb-3">
                {[1,2,3,4,5].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
              </div>
              <p className="text-sm text-slate-600 leading-relaxed mb-4 italic">"{t.quote}"</p>
              <div className="pt-3 border-t border-[#E8E2D9]">
                <span className="text-sm font-black text-red-600">{t.result}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      <style>{`@keyframes marquee { from { transform: translateX(0) } to { transform: translateX(-50%) } }`}</style>
    </section>
  );
}

// ─── PRICING ───────────────────────────────────────────────────────────────────
function Pricing() {
  const [billing, setBilling] = useState("monthly");
  const isQ = billing === "quarterly";

  const PLANS = [
    {
      name: "Gratuit", desc: "Pour découvrir", price: 0, credits: "4 crédits offerts",
      features: [
        { label: "Youbook", val: "Non disponible" },
        { label: "Niche Hunter", val: "3 gratuits/j puis 1 cr." },
        { label: "Analyse niche", val: "3 gratuits/j puis 1 cr." },
        { label: "Générer un ebook", val: "20 cr." },
        { label: "Mise en page", val: "10 cr." },
        { label: "Smart Shop", val: "5 cr." },
      ],
      cta: "Commencer gratuitement", dark: false, badge: null, id: null,
    },
    {
      name: "Pass Solo", desc: "Pour démarrer", price: 5100, credits: 60,
      features: [
        { label: "Youbook", val: "2 gratuits/j puis 2 cr." },
        { label: "Niche Hunter", val: "3 gratuits/j puis 1 cr." },
        { label: "Analyse niche", val: "3 gratuits/j puis 1 cr." },
        { label: "Générer un ebook", val: "20 cr." },
        { label: "Mise en page", val: "10 cr." },
        { label: "Smart Shop", val: "5 cr." },
        { label: "Support", val: "Email" },
      ],
      cta: "Choisir ce plan", dark: false, badge: null,
    },
    {
      name: "Pack Créateur", desc: "Le plus populaire", price: 19125, credits: 330,
      features: [
        { label: "Youbook", val: "8 gratuits/j puis 2 cr." },
        { label: "Niche Hunter", val: "8 gratuits/j puis 1 cr." },
        { label: "Analyse niche", val: "8 gratuits/j puis 1 cr." },
        { label: "Générer un ebook", val: "20 cr." },
        { label: "Mise en page", val: "10 cr." },
        { label: "Smart Shop", val: "5 cr." },
        { label: "Support", val: "Email" },
      ],
      cta: "Choisir ce plan", dark: true, badge: "Recommandé",
    },
    {
      name: "Pack Agence", desc: "Pour les équipes", price: 31500, credits: 700,
      features: [
        { label: "Youbook", val: "15 gratuits/j puis 2 cr." },
        { label: "Niche Hunter", val: "20 gratuits/j puis 1 cr." },
        { label: "Analyse niche", val: "20 gratuits/j puis 1 cr." },
        { label: "Générer un ebook", val: "20 cr." },
        { label: "Mise en page", val: "10 cr." },
        { label: "Smart Shop", val: "5 cr. · Multi boutiques" },
        { label: "Support", val: "WhatsApp prioritaire" },
      ],
      cta: "Choisir ce plan", dark: false, badge: null,
    },
  ];

  const fmt = n => Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");

  return (
    <section id="pricing" className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">

        <div className="mb-10 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Tarification</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Youbook gratuit selon votre plan.<br />Payez uniquement après le quota.
            </h2>
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
            <span className="font-bold text-slate-900">Les crédits s'accumulent</span> et <span className="font-bold text-slate-900">n'expirent jamais.</span> · Paiement sécurisé · 13 pays
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {PLANS.map((plan, i) => {
            const priceDisplay = !plan.price ? 0 : isQ ? Math.round(plan.price * 3 * 0.85) : plan.price;
            const creditsDisplay = !plan.credits ? null : isQ ? plan.credits * 3 : plan.credits;
            return (
              <div key={i} className={`relative rounded-2xl p-6 border flex flex-col ${plan.dark ? "bg-slate-900 border-slate-800" : "bg-white border-[#C8BFB0]"}`}>
                {plan.badge && (
                  <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-red-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">
                    {plan.badge}
                  </div>
                )}
                <p className={`text-xs font-black uppercase tracking-widest mb-0.5 ${plan.dark ? "text-white/30" : "text-slate-400"}`}>{plan.name}</p>
                <p className={`text-[10px] mb-4 ${plan.dark ? "text-white/20" : "text-slate-300"}`}>{plan.desc}</p>

                {isQ && plan.price > 0 && (
                  <p className={`text-xs line-through mb-0.5 ${plan.dark ? "text-white/20" : "text-slate-300"}`}>{fmt(plan.price * 3)} FCFA</p>
                )}
                <p className={`text-3xl font-black mb-0.5 ${plan.dark ? "text-white" : "text-slate-900"}`}>
                  {plan.price === 0 ? "Gratuit" : <>{fmt(priceDisplay)} <span className="text-base font-bold">FCFA</span></>}
                </p>
                {creditsDisplay && (
                  <p className={`text-xs font-bold mb-5 ${plan.dark ? "text-red-400/70" : "text-slate-500"}`}>
                    {fmt(creditsDisplay)} crédits{isQ ? " / 3 mois" : " / mois"}
                  </p>
                )}
                {!creditsDisplay && <p className="text-xs font-bold mb-5 text-slate-400">4 crédits offerts</p>}

                <div className="space-y-2 flex-1 mb-6">
                  {plan.features.map(f => (
                    <div key={f.label} className="flex items-start justify-between gap-2">
                      <span className={`text-xs flex-shrink-0 ${plan.dark ? "text-white/60" : "text-slate-600"}`}>{f.label}</span>
                      <span className={`text-[10px] font-bold text-right ${plan.dark ? "text-red-400/60" : "text-slate-400"}`}>{f.val}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/register"
                  className={`block w-full text-center py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors ${plan.dark ? "bg-red-600 hover:bg-red-700 text-white" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
                  {plan.cta}
                </Link>
              </div>
            );
          })}
        </div>

        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Les crédits s'accumulent et n'expirent pas · Youbook inclus dès le Pass Solo
        </p>
      </div>
    </section>
  );
}

// ─── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Comment fonctionne Youbook ?", a: "Vous collez une URL YouTube, Youbook récupère la transcription automatiquement via l'API, puis Gemini analyse le contenu et génère : titre, hook, description, problème résolu, transformation, audience, sommaire complet, insights clés et verbatim. En 30 secondes. Vous validez le sommaire, choisissez un template parmi les 30 disponibles, et l'IA génère l'ebook complet en 60 secondes." },
    { q: "C'est vraiment gratuit ?", a: "Youbook est inclus dans tous les plans payants avec un quota journalier gratuit : 2 analyses/jour (Pass Solo), 8/jour (Pack Créateur), 15/jour (Pack Agence). Au-delà du quota, chaque analyse coûte 2 crédits. Sans abonnement, Youbook n'est pas disponible. Vous recevez 4 crédits à l'inscription pour tester les autres outils." },
    { q: "Quelles vidéos peuvent être converties ?", a: "Toute vidéo YouTube avec sous-titres ou transcription automatique : tutoriels, formations, podcasts, interviews, conférences, talks TEDx. Fonctionne en français, anglais, arabe et autres langues. La vidéo doit avoir au minimum 1-2 minutes de contenu parlé." },
    { q: "Puis-je modifier le titre et le sommaire avant de générer ?", a: "Absolument. Après l'analyse, Youbook pré-remplit le formulaire avec le titre, la description et le sommaire recommandé. Vous pouvez tout modifier, choisir le nombre de chapitres (3 à 10), sélectionner votre template, puis lancer la génération." },
    { q: "Quelle différence entre Youbook et Bookzy standard ?", a: "Bookzy standard : vous rédigez vous-même le contenu dans l'éditeur ou importez un Word. Youbook : vous collez un lien YouTube et l'IA extrait le contenu, génère le plan et rédige l'ebook entier. Youbook est fait pour monétiser du contenu vidéo existant. Les deux utilisent les mêmes 30 templates et le même moteur PDF." },
    { q: "Combien de crédits pour générer l'ebook après l'analyse ?", a: "L'analyse Youbook coûte 2 cr. après quota. La génération de l'ebook complet coûte 20 cr. supplémentaires. Soit 22 cr. au total si vous n'avez plus de quota. Avec le Pack Créateur (330 cr./mois) : vous pouvez faire jusqu'à 15 ebooks complets via Youbook par mois." },
    { q: "Les crédits expirent-ils ?", a: "Non. Les crédits s'accumulent et n'expirent jamais. Si vous avez 60 crédits ce mois et n'en utilisez que 30, les 30 restants s'ajoutent aux crédits du mois suivant." },
  ];

  return (
    <section id="faq" className="bg-[#EDE8E0] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
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
                <span className={`font-bold text-sm ${openIdx === i ? "text-red-600" : "text-slate-900"}`}>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openIdx === i ? "rotate-180 text-red-600" : "text-slate-300"}`} />
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

// ─── CTA FINAL ─────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="bg-slate-900 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-red-600/10 blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-6">Gratuit selon votre plan · Sans carte bancaire · Accès immédiat</p>
        <h2 className="text-4xl md:text-5xl lg:text-6xl font-black text-white tracking-tight mb-6 leading-tight">
          Arrêtez de regarder des vidéos.<br />
          <span className="text-red-500">Monétisez-les.</span>
        </h2>
        <p className="text-white/40 text-lg mb-10 max-w-xl mx-auto">
          Rejoignez les créateurs qui transforment leur contenu YouTube en ebooks rentables — en 3 minutes.
        </p>
        <Link href="/auth/register"
          className="inline-flex items-center gap-3 px-10 py-5 bg-red-600 hover:bg-red-700 text-white text-base font-black rounded-2xl transition-colors shadow-xl shadow-red-600/20 uppercase tracking-widest">
          <Play className="w-5 h-5" fill="currentColor" />
          Commencer gratuitement
          <ArrowRight className="w-5 h-5" />
        </Link>
        <p className="mt-5 text-sm text-white/20 uppercase tracking-widest font-bold">
          Youbook · Niche Hunter · Tendances · Smart Shop — tout dans Bookzy
        </p>
      </div>
    </section>
  );
}

// ─── FOOTER ────────────────────────────────────────────────────────────────────
function Footer() {
  return (
    <footer className="bg-[#EDE8E0] border-t border-[#C8BFB0] pt-16 pb-10 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10 mb-12">
          <div className="col-span-2 md:col-span-1">
            <div className="flex items-center gap-2.5 mb-4">
              <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
                <BookOpenSVG className="w-4 h-4 text-white" />
              </div>
              <span className="font-bold text-slate-900">Bookzy</span>
            </div>
            <p className="text-slate-400 text-sm">Plateforme de génération d'ebooks par IA pour les marchés francophones africains.</p>
          </div>
          <div>
            <h3 className="font-black mb-4 text-xs uppercase tracking-widest text-slate-400">Produits</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/youbook" className="hover:text-slate-900 transition-colors">Youbook</Link></li>
              <li><Link href="/ebook-designer" className="hover:text-slate-900 transition-colors">Ebook Designer</Link></li>
              <li><Link href="/smart-shop" className="hover:text-slate-900 transition-colors">Smart Shop</Link></li>
              <li><Link href="/niche-hunter" className="hover:text-slate-900 transition-colors">Niche Hunter</Link></li>
              <li><Link href="/tendances" className="hover:text-slate-900 transition-colors">Tendances</Link></li>
            </ul>
          </div>
          <div>
            <h3 className="font-black mb-4 text-xs uppercase tracking-widest text-slate-400">Ressources</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li><Link href="/suggestions" className="hover:text-slate-900 transition-colors">Roadmap</Link></li>
              <li><Link href="/changelog" className="hover:text-slate-900 transition-colors">Nouveautés</Link></li>
              <li><a href="#faq" className="hover:text-slate-900 transition-colors">FAQ</a></li>
            </ul>
          </div>
          <div>
            <h3 className="font-black mb-4 text-xs uppercase tracking-widest text-slate-400">Contact</h3>
            <ul className="space-y-3 text-sm text-slate-500">
              <li className="flex items-center gap-2">
                <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" /> Support 7j/7
              </li>
              <li><a href="mailto:support@bookzy.io" className="hover:text-slate-900 transition-colors">support@bookzy.io</a></li>
            </ul>
          </div>
        </div>
        <div className="border-t border-[#C8BFB0] pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs text-slate-400">
          <p>© 2026 Bookzy Inc. Tous droits réservés.</p>
          <div className="flex gap-6">
            <Link href="/legal/terms" className="hover:text-slate-900 transition-colors">CGU</Link>
            <Link href="/legal/confidentialite" className="hover:text-slate-900 transition-colors">Confidentialité</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

// ─── PAGE ───────────────────────────────────────────────────────────────────────
export default function YoubookPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-[#F5F2ED]" />;

  return (
    <div className="min-h-screen bg-[#F5F2ED] font-sans text-slate-900 overflow-x-hidden">
      <Nav />
      <Hero />
      <Flow />
      <Templates />
      <AvantApres />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTAFinal />
      <Footer />
    </div>
  );
}