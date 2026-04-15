"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import {
  ArrowRight, Menu, X, Star, Check, ChevronDown,
  TrendingUp, Target, BarChart2, Search, Lock,
  Zap, Globe, DollarSign
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

const TESTIMONIALS = [
  { name: "Amadou K.", role: "Infopreneur", location: "Dakar, SN", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "J'avais une idée depuis 3 mois. Le Validateur m'a donné 91/100. J'ai créé l'ebook et vendu 847 fois. Sans le score je n'aurais jamais osé.", result: "847 ventes" },
  { name: "Aïcha D.", role: "Créatrice Food", location: "Abidjan, CI", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg", quote: "Score 78/100 avec concurrence faible. J'ai suivi les recommandations et lancé. 1 278 ventes en un mois.", result: "1 278 ventes" },
  { name: "Jean-Marc T.", role: "Formateur", location: "Douala, CM", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg", quote: "Le rapport m'a montré que mon sujet initial avait une saturation de 8/10. J'ai pris l'alternative suggérée. 9 180€ de revenus.", result: "9 180€" },
  { name: "Clara M.", role: "Coach Business", location: "Paris, FR", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/7fef677cbafd1e0f1f474ad0fa14a341.jpg", quote: "Les pays qui achètent le plus m'ont surprise. Je ciblais la France, le rapport a montré que CI et SN convertissaient 3× mieux.", result: "3× plus de ventes" },
  { name: "Kofi M.", role: "Digital Marketer", location: "Accra, GH", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "L'angle unique suggéré par l'IA était exactement ce qui manquait. 200+ DMs en 24h après le lancement.", result: "200+ DMs en 24h" },
  { name: "Fatou S.", role: "Entrepreneuse", location: "Bamako, ML", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg", quote: "Revenus estimés : 180 000 FCFA/mois. Réalité : 210 000 FCFA le premier mois. Le modèle est précis.", result: "210K FCFA/mois" },
];
const DOUBLED = [...TESTIMONIALS, ...TESTIMONIALS];

// ── ILLUSTRATION ANIMÉE SCORE ─────────────────────────────────────────────────
function ScoreIllustration() {
  const [score, setScore] = useState(0);
  const [phase, setPhase] = useState(0);
  const targetScore = 82;

  useEffect(() => {
    const inc = setInterval(() => {
      setScore(s => {
        if (s >= targetScore) { clearInterval(inc); setPhase(1); return targetScore; }
        return s + 2;
      });
    }, 30);
    const loop = setInterval(() => {
      setScore(0);
      setPhase(0);
      setTimeout(() => {
        const inc2 = setInterval(() => {
          setScore(s => {
            if (s >= targetScore) { clearInterval(inc2); setPhase(1); return targetScore; }
            return s + 2;
          });
        }, 30);
      }, 500);
    }, 5000);
    return () => { clearInterval(inc); clearInterval(loop); };
  }, []);

  const circumference = 2 * Math.PI * 54;
  const offset = circumference - (score / 100) * circumference;
  const color = score >= 80 ? '#10b981' : score >= 60 ? '#3b82f6' : '#f59e0b';

  return (
    <div style={{ background: 'white', borderRadius: 16, padding: 20, border: '1px solid #e2e8f0', width: '100%', maxWidth: 320 }}>
      <style>{`@keyframes fade-in-up { from{opacity:0;transform:translateY(6px)} to{opacity:1;transform:translateY(0)} }`}</style>
      <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 16 }}>
        <div style={{ position: 'relative', width: 120, height: 120, flexShrink: 0 }}>
          <svg viewBox="0 0 120 120" style={{ transform: 'rotate(-90deg)', width: '100%', height: '100%' }}>
            <circle cx="60" cy="60" r="54" fill="none" stroke="#f1f5f9" strokeWidth="8"/>
            <circle cx="60" cy="60" r="54" fill="none" stroke={color} strokeWidth="8"
              strokeDasharray={circumference} strokeDashoffset={offset}
              strokeLinecap="round" style={{ transition: 'stroke-dashoffset 0.05s linear, stroke 0.3s' }}/>
          </svg>
          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span style={{ fontSize: 28, fontWeight: 900, color: '#0f172a', lineHeight: 1 }}>{score}</span>
            <span style={{ fontSize: 11, color: '#94a3b8', fontWeight: 600 }}>/100</span>
          </div>
        </div>
        <div>
          <div style={{ fontSize: 10, fontWeight: 700, color: '#94a3b8', textTransform: 'uppercase', letterSpacing: 1, marginBottom: 4 }}>Verdict</div>
          <div style={{ fontSize: 14, fontWeight: 800, color: phase === 1 ? '#10b981' : '#94a3b8', transition: 'color 0.3s' }}>
            {phase === 1 ? '🔥 Fonce !' : '⏳ Analyse...'}
          </div>
          <div style={{ fontSize: 11, color: '#64748b', marginTop: 4 }}>Marketing digital</div>
        </div>
      </div>
      {phase === 1 && (
        <div style={{ animation: 'fade-in-up 0.4s ease' }}>
          {[
            { label: 'Concurrence', val: 'Faible', color: '#10b981' },
            { label: 'Revenus estimés', val: '180K FCFA/mois', color: '#7c3aed' },
            { label: 'Annonceurs FB actifs', val: '14 annonceurs', color: '#0891b2' },
          ].map((item, i) => (
            <div key={i} style={{ display: 'flex', justifyContent: 'space-between', padding: '6px 0', borderBottom: i < 2 ? '1px solid #f1f5f9' : 'none' }}>
              <span style={{ fontSize: 11, color: '#6b7280' }}>{item.label}</span>
              <span style={{ fontSize: 11, fontWeight: 700, color: item.color }}>{item.val}</span>
            </div>
          ))}
        </div>
      )}
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
    { label: "Le rapport", href: "#rapport" },
    { label: "Tarifs", href: "#pricing" },
    { label: "FAQ", href: "#faq" },
  ];

  const scrollTo = (e, href) => {
    e.preventDefault(); setOpen(false);
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
            <span className="text-[9px] font-black uppercase tracking-[0.2em] text-violet-600">Validateur d'idée</span>
          </div>
        </Link>
        <div className="hidden md:flex items-center gap-8">
          {links.map(l => (
            <a key={l.label} href={l.href} onClick={e => scrollTo(e, l.href)} className="text-sm font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">{l.label}</a>
          ))}
        </div>
        <div className="hidden md:flex items-center gap-4">
          <Link href="/auth/login" className="text-sm font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest">Connexion</Link>
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-6 py-2.5 bg-violet-600 text-white font-black rounded-xl hover:bg-violet-700 transition-colors text-xs uppercase tracking-widest">
            Valider mon idée <ArrowRight className="w-3.5 h-3.5" />
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
          <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-6 py-3 bg-violet-600 text-white font-black rounded-xl text-xs uppercase tracking-widest mt-2">
            Valider mon idée <ArrowRight className="w-3.5 h-3.5" />
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
              <span className="w-2 h-2 rounded-full bg-violet-500 animate-pulse" />
              Facebook Ads + Google Trends + IA
            </div>
            <h1 className="font-black text-slate-900 tracking-tighter leading-[0.88] mb-6" style={{ fontSize: "clamp(3rem, 9vw, 6.5rem)" }}>
              Votre idée va-t-elle<br />
              <span className="text-violet-600">se vendre ?</span>
            </h1>
            <p className="text-lg md:text-xl text-slate-500 max-w-xl mb-4 leading-relaxed">
              Entrez votre sujet. Le Validateur croise les pubs Facebook actives, Google Trends et les données de marché. Vous obtenez un score sur 100, les revenus estimés et l'angle unique pour dominer votre niche.
            </p>
            <p className="text-slate-400 text-xs uppercase tracking-[0.25em] font-bold mb-10">Facebook Ads Library · Google Trends · Gemini AI · Données réelles</p>
            <div className="flex flex-col sm:flex-row items-center lg:items-start gap-4">
              <Link href="/auth/register" className="inline-flex items-center gap-2 px-8 py-4 bg-violet-600 text-white font-black rounded-xl hover:bg-violet-700 transition-colors text-sm uppercase tracking-widest">
                Valider gratuitement <ArrowRight className="w-4 h-4" />
              </Link>
              <a href="#rapport" onClick={e => { e.preventDefault(); document.getElementById("rapport")?.scrollIntoView({ behavior: "smooth" }); }} className="inline-flex items-center gap-2 px-8 py-4 border border-[#C8BFB0] text-slate-700 font-bold rounded-xl hover:border-slate-400 transition-colors text-sm uppercase tracking-widest">
                Voir un rapport
              </a>
            </div>
          </div>
          <div className="flex-shrink-0 flex flex-col items-center gap-4">
            <ScoreIllustration />
            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {[
                { val: "4 cr.", label: "Par analyse" },
                { val: "30s", label: "Résultat" },
                { val: "3/jour", label: "Quota gratuit" },
                { val: "100%", label: "Données réelles" },
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

// ── LOGIQUE ───────────────────────────────────────────────────────────────────
function Logique() {
  return (
    <section className="bg-slate-900 py-16 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-3">Comment on calcule le score</p>
          <h2 className="text-3xl md:text-4xl font-black text-white tracking-tight">3 sources de données. 1 score sur 100.</h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            { icon: "📡", color: '#f59e0b', title: "Facebook Ads Library", desc: "On cherche les annonceurs actifs sur votre sujet. Chaque pub active depuis 30+ jours = preuve que le sujet se vend. On compte les annonceurs, analyse leurs profils et estime la durée des campagnes." },
            { icon: "📈", color: '#10b981', title: "Google Trends", desc: "On analyse le volume de recherche mensuel et la tendance sur 12 mois. Un sujet en croissance sur Google = demande réelle et croissante. On score la tendance : montante, stable ou descendante." },
            { icon: "🤖", color: '#7c3aed', title: "Gemini IA", desc: "On passe toutes les données à Gemini. L'IA calcule le score final, estime les revenus, identifie le niveau de concurrence, recommande les pays cibles et suggère un angle unique pour se différencier." },
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

// ── COMMENT ÇA MARCHE ─────────────────────────────────────────────────────────
function Workflow() {
  return (
    <section id="workflow" className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-14 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Le flow</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Entrez votre idée.<br />Recevez la vérité.
          </h2>
        </div>
        <div className="grid md:grid-cols-3 gap-6">
          {[
            {
              num: "01", dark: false, accent: '#7c3aed',
              title: "Entrez votre sujet",
              desc: "Tapez le titre ou le sujet de votre ebook. Le Validateur extrait automatiquement les mots-clés pertinents pour interroger les APIs.",
              points: ["Titre complet ou sujet général", "L'IA extrait les mots-clés", "Résultat en moins de 30 secondes", "Sauvegardé dans votre historique"],
            },
            {
              num: "02", dark: true, accent: '#a78bfa',
              title: "Les données sont croisées",
              desc: "En parallèle : Facebook Ads Library scanne les pubs actives, Google Trends analyse le volume. Gemini synthétise tout en un rapport structuré.",
              points: ["Annonceurs FB actifs sur votre niche", "Tendance Google sur 12 mois", "Score de rentabilité /100", "Niveau de saturation /10"],
            },
            {
              num: "03", dark: false, accent: '#7c3aed',
              title: "Vous recevez le rapport",
              desc: "Un rapport complet avec le score, le verdict, les revenus estimés, les pays qui achètent le plus et l'angle unique pour dominer votre marché.",
              points: ["Score global /100 + verdict", "Revenus estimés semaine/mois/an", "Pays qui cartonnent avec scores", "Angle unique pour se différencier"],
            },
          ].map((s, i) => (
            <div key={i} className={`rounded-2xl p-8 border ${s.dark ? "bg-slate-900 border-slate-800" : "bg-white border-[#D6CFC4]"}`}>
              <div className="flex items-center gap-3 mb-5">
                <span className={`text-xs font-black uppercase tracking-[0.3em] ${s.dark ? "text-white/20" : "text-slate-300"}`}>{s.num}</span>
              </div>
              <h3 className={`text-xl font-black tracking-tight mb-3 ${s.dark ? "text-white" : "text-slate-900"}`}>{s.title}</h3>
              <p className={`text-sm leading-relaxed mb-5 ${s.dark ? "text-white/50" : "text-slate-500"}`}>{s.desc}</p>
              <div className="space-y-2">
                {s.points.map(pt => (
                  <div key={pt} className="flex items-start gap-2.5">
                    <Check className={`w-3.5 h-3.5 flex-shrink-0 mt-0.5 ${s.dark ? "text-violet-400" : "text-violet-500"}`} />
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

// ── APERÇU DU RAPPORT ─────────────────────────────────────────────────────────
function AperçuRapport() {
  return (
    <section id="rapport" className="bg-[#EDE8E0] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Le rapport</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              Ce que vous recevez<br />en 30 secondes.
            </h2>
            <p className="text-slate-500 text-sm md:max-w-xs">Le rapport complet est réservé aux abonnés. Les non-abonnés voient le score et le verdict — le reste est flouté.</p>
          </div>
        </div>

        <div className="grid md:grid-cols-2 gap-6">
          {/* Toujours visible */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="text-xs font-black uppercase tracking-widest text-emerald-700">Toujours visible — gratuit</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: "🎯", title: "Score global /100", desc: "Le score de rentabilité calculé à partir des données FB Ads et Google Trends.", preview: <div className="flex items-center gap-3 mt-2"><div className="flex-1 h-3 bg-slate-100 rounded-full overflow-hidden"><div style={{ width: '82%', background: '#10b981' }} className="h-full rounded-full" /></div><span className="text-sm font-black text-slate-900">82/100</span></div> },
                { icon: "🔥", title: "Verdict", desc: "Fonce / Attends / Évite — avec une phrase d'explication.", preview: <div className="mt-2 inline-flex items-center gap-2 px-3 py-1.5 bg-emerald-50 border border-emerald-200 rounded-full"><span className="text-sm font-black text-emerald-700">🔥 Fonce ! Ce sujet se vend déjà.</span></div> },
                { icon: "🔑", title: "Mots-clés + Audience", desc: "Les mots-clés détectés et le profil de l'audience cible.", preview: <div className="mt-2 flex flex-wrap gap-1.5">{['marketing digital', 'ebook whatsapp', 'business ligne'].map(k => <span key={k} className="text-[10px] px-2 py-1 bg-slate-100 text-slate-600 rounded-full font-bold">{k}</span>)}</div> },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-[#D6CFC4] rounded-2xl p-5">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div className="flex-1">
                      <p className="font-black text-slate-900 text-sm">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                      {item.preview}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Réservé abonnés */}
          <div>
            <div className="flex items-center gap-2 mb-4">
              <div className="w-2 h-2 rounded-full bg-violet-500" />
              <span className="text-xs font-black uppercase tracking-widest text-violet-700">Réservé aux abonnés</span>
            </div>
            <div className="space-y-3">
              {[
                { icon: "📡", title: "Stats Facebook Ads", desc: "Annonceurs actifs avec photos de profil, durée des campagnes, budget estimé." },
                { icon: "🌍", title: "Pays qui cartonnent", desc: "Score /100 par pays avec barres de progression. CI, SN, CM, ML, BJ et diaspora." },
                { icon: "⚔️", title: "Analyse concurrence + angle unique", desc: "Comment se positionnent les concurrents et quel angle adopter pour les dépasser." },
                { icon: "💰", title: "Revenus estimés", desc: "Prix recommandé, revenus semaine / mois / an avec hypothèses de vente." },
                { icon: "📊", title: "Saturation du marché /10", desc: "Barre visuelle de saturation avec explication. 0 = vide, 10 = ultra-saturé." },
                { icon: "🚀", title: "4 pratiques pour vendre vite", desc: "Actions concrètes recommandées par l'IA selon votre niche spécifique." },
              ].map((item, i) => (
                <div key={i} className="bg-white border border-[#D6CFC4] rounded-2xl p-5 relative overflow-hidden">
                  <div className="flex items-start gap-3">
                    <span className="text-xl">{item.icon}</span>
                    <div>
                      <p className="font-black text-slate-900 text-sm">{item.title}</p>
                      <p className="text-xs text-slate-400 mt-0.5">{item.desc}</p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="mt-8 bg-violet-50 border border-violet-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-black text-violet-900 text-base">Rapport complet dès le Pass Solo</p>
            <p className="text-violet-600 text-sm mt-0.5">3 analyses gratuites par jour incluses. 4 crédits au-delà du quota.</p>
          </div>
          <Link href="/auth/register" className="flex-shrink-0 inline-flex items-center gap-2 px-6 py-3 bg-violet-600 text-white font-black rounded-xl text-xs uppercase tracking-widest hover:bg-violet-700 transition-colors">
            Voir mon rapport <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </section>
  );
}

// ── COMPARATIF ────────────────────────────────────────────────────────────────
function Comparatif() {
  return (
    <section className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-12 pb-8 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Avant / Après</p>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
            Créer sans valider<br />= risque inutile.
          </h2>
        </div>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="bg-white border-2 border-red-200 rounded-2xl overflow-hidden">
            <div className="bg-red-50 px-6 py-4 border-b border-red-200">
              <p className="font-black text-slate-900 text-sm uppercase tracking-wider">Sans le Validateur</p>
              <p className="text-red-500 text-xs font-bold mt-0.5">Vous pariez à l'aveugle</p>
            </div>
            <div className="p-6 space-y-3">
              {[
                "Vous passez 20 crédits à générer un ebook",
                "Vous ne savez pas si quelqu'un en veut",
                "Vous lancez sur une niche saturée sans le savoir",
                "Vous ciblez le mauvais pays, les mauvaises personnes",
                "0 vente. 20 crédits perdus.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <X className="w-4 h-4 text-red-400 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white border-2 border-violet-300 rounded-2xl overflow-hidden">
            <div className="bg-violet-600 px-6 py-4 border-b border-violet-700">
              <p className="font-black text-white text-sm uppercase tracking-wider">Avec le Validateur</p>
              <p className="text-violet-200 text-xs font-bold mt-0.5">Vous créez en sachant que ça vend</p>
            </div>
            <div className="p-6 space-y-3">
              {[
                "4 crédits pour valider votre idée en 30s",
                "Score 82/100 → vous savez que c'est rentable",
                "Saturation 3/10 → concurrence faible, opportunité réelle",
                "Côte d'Ivoire + Sénégal → vous ciblez les bons pays",
                "Vous créez l'ebook avec confiance. Vous vendez.",
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <Check className="w-4 h-4 text-violet-500 flex-shrink-0 mt-0.5" />
                  <span className="text-sm text-slate-600">{item}</span>
                </div>
              ))}
            </div>
          </div>
        </div>
        <div className="mt-6 bg-slate-900 rounded-2xl p-6 text-center">
          <p className="text-white font-black text-lg">4 crédits maintenant. Ou 20 crédits gaspillés.</p>
          <p className="text-white/50 text-sm mt-1">Le Validateur coûte 4 crédits. Générer un ebook qui ne se vend pas en coûte 20.</p>
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
        <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">Ils ont validé. Ils ont vendu.</h2>
      </div>
      {[0, 1].map(row => (
        <div key={row} className={`flex gap-5 mb-5 ${row === 1 ? "flex-row-reverse" : ""}`}
          style={{ animation: `marquee${row === 0 ? "" : "Rev"} 42s linear infinite`, width: "max-content" }}>
          {DOUBLED.map((t, i) => (
            <div key={i} className="w-80 flex-shrink-0 bg-white border border-[#C8BFB0] rounded-2xl p-6">
              <div className="flex items-center gap-2 mb-3">
                {[0,1,2,3,4].map(s => <Star key={s} className="w-3 h-3 text-amber-400 fill-amber-400" />)}
                <span className="ml-auto text-xs font-black text-violet-600">{t.result}</span>
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
    { id: "free",     name: "Gratuit",      desc: "Pour découvrir",    price: 0,     credits: null, badge: null,        dark: false },
    { id: "solo",     name: "Pass Solo",    desc: "Pour démarrer",     price: 7500,  credits: 100,  badge: null,        dark: false },
    { id: "createur", name: "Pack Créateur",desc: "Le plus populaire", price: 22000, credits: 400,  badge: "Recommandé", dark: true  },
    { id: "agence",   name: "Pack Agence",  desc: "Pour les équipes",  price: 45000, credits: 900,  badge: null,        dark: false },
  ];

  const quotas = { free: "Score + verdict seulement", solo: "3 analyses/jour gratuites", createur: "8 analyses/jour gratuites", agence: "20 analyses/jour gratuites" };

  function fmt(n) { return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f"); }

  return (
    <section id="pricing" className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-6xl mx-auto">
        <div className="mb-10 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Tarification</p>
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 tracking-tight">
              4 crédits par analyse.<br />
              <span className="text-violet-600">3 gratuites par jour</span> en abonnement.
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
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 mb-6">
          {PLANS.map((plan) => {
            const priceDisplay = !plan.price ? 0 : isQ ? Math.round(plan.price * 3 * 0.85) : plan.price;
            const creditsDisplay = !plan.credits ? null : isQ ? plan.credits * 3 : plan.credits;
            return (
              <div key={plan.id} className={`relative rounded-2xl p-6 border flex flex-col ${plan.dark ? "bg-slate-900 border-slate-800" : "bg-white border-[#C8BFB0]"}`}>
                {plan.badge && <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-3 py-1 bg-violet-600 text-white text-[10px] font-black uppercase tracking-widest rounded-full whitespace-nowrap">{plan.badge}</div>}
                <p className={`text-xs font-black uppercase tracking-widest mb-0.5 ${plan.dark ? "text-white/30" : "text-slate-400"}`}>{plan.name}</p>
                <p className={`text-[10px] mb-4 ${plan.dark ? "text-white/20" : "text-slate-300"}`}>{plan.desc}</p>
                {isQ && plan.price > 0 && <p className={`text-xs line-through mb-0.5 ${plan.dark ? "text-white/20" : "text-slate-300"}`}>{fmt(plan.price * 3)} FCFA</p>}
                <p className={`text-3xl font-black mb-1 ${plan.dark ? "text-white" : "text-slate-900"}`}>
                  {plan.price === 0 ? "Gratuit" : <>{fmt(priceDisplay)} <span className="text-base font-bold">FCFA</span></>}
                </p>
                {creditsDisplay && <p className={`text-xs font-bold mb-2 ${plan.dark ? "text-violet-400/70" : "text-slate-500"}`}>{fmt(creditsDisplay)} crédits{isQ ? " / 3 mois" : " / mois"}</p>}
                {!creditsDisplay && <p className="text-xs font-bold mb-2 text-slate-400">4 crédits offerts</p>}

                <div className={`rounded-xl p-3 mb-5 ${plan.dark ? "bg-white/5" : "bg-violet-50 border border-violet-100"}`}>
                  <p className={`text-[10px] font-black uppercase tracking-widest mb-1 ${plan.dark ? "text-white/30" : "text-violet-400"}`}>Validateur d'idée</p>
                  <p className={`text-sm font-black ${plan.dark ? "text-violet-300" : "text-violet-700"}`}>{quotas[plan.id]}</p>
                  {plan.id !== "free" && <p className={`text-[10px] mt-0.5 ${plan.dark ? "text-white/20" : "text-slate-400"}`}>puis 4 cr. par analyse</p>}
                </div>

                <div className="space-y-2 flex-1 mb-6">
                  {[
                    { label: "Générer un ebook", val: "20 cr." },
                    { label: "Radar Cash", val: "Inclus" },
                    { label: "Niche Hunter", val: plan.id === "free" ? "3/mois" : plan.id === "solo" ? "3/jour" : plan.id === "createur" ? "8/jour" : "20/jour" },
                    { label: "Youbook", val: plan.id === "free" || plan.id === "solo" ? "2/jour" : plan.id === "createur" ? "8/jour" : "15/jour" },
                  ].map(f => (
                    <div key={f.label} className="flex items-start justify-between gap-2">
                      <span className={`text-xs flex-shrink-0 ${plan.dark ? "text-white/60" : "text-slate-600"}`}>{f.label}</span>
                      <span className={`text-[10px] font-bold text-right ${plan.dark ? "text-violet-400/60" : "text-slate-400"}`}>{f.val}</span>
                    </div>
                  ))}
                </div>

                <Link href="/auth/register" className={`block w-full text-center py-3 rounded-xl font-black text-xs uppercase tracking-widest transition-colors ${plan.dark ? "bg-violet-600 hover:bg-violet-700 text-white" : "bg-slate-900 text-white hover:bg-slate-800"}`}>
                  {plan.id === "free" ? "Commencer gratuitement" : "Choisir ce plan"}
                </Link>
              </div>
            );
          })}
        </div>
        <p className="text-center text-xs text-slate-400 flex items-center justify-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 inline-block" />
          Les crédits s'accumulent et n'expirent jamais · Validateur inclus dans tous les plans
        </p>
      </div>
    </section>
  );
}

// ── FAQ ───────────────────────────────────────────────────────────────────────
function FAQ() {
  const [openIdx, setOpenIdx] = useState(0);
  const faqs = [
    { q: "Comment fonctionne le Validateur d'idée ?", a: "Vous entrez le sujet ou titre de votre ebook. Le Validateur extrait les mots-clés, interroge simultanément la Facebook Ads Library (annonceurs actifs sur votre niche) et Google Trends (volume + tendance). Gemini synthétise toutes les données en un rapport structuré avec score /100, revenus estimés, analyse de la concurrence et recommandations." },
    { q: "Quelle différence avec Radar Cash et Niche Hunter ?", a: "Radar Cash = vous voyez les pubs Facebook actives sur votre niche (ce que les autres vendent). Niche Hunter = l'IA génère 10 idées de niches scorées à partir d'un mot-clé général. Validateur d'idée = vous avez déjà une idée précise et voulez savoir si elle va se vendre avec un rapport détaillé. Les trois se complètent : Radar Cash pour s'inspirer, Niche Hunter pour explorer, Validateur pour confirmer." },
    { q: "C'est vraiment 4 crédits par analyse ?", a: "Oui. Avec les plans payants, vous avez un quota d'analyses gratuites par jour (3/jour Solo, 8/jour Créateur, 20/jour Agence). Au-delà du quota, chaque analyse coûte 4 crédits. Sans abonnement, vous voyez uniquement le score et le verdict — le rapport complet nécessite un abonnement." },
    { q: "Les données Facebook Ads sont-elles vraiment réelles ?", a: "Oui. On interroge la Facebook Ads Library officielle via l'API RapidAPI. Ce sont les mêmes données publiques que vous pouvez voir sur facebook.com/ads/library. On récupère les annonceurs actifs, leurs profils, la durée de leurs campagnes et le contenu de leurs pubs." },
    { q: "Le score est-il fiable ?", a: "Le score est basé sur des données réelles (pubs actives + volume de recherche), pas des estimations. Un score élevé signifie qu'il y a de la demande prouvée (annonceurs qui dépensent) et une tendance Google positive. Ce n'est pas une garantie de ventes, mais c'est la validation la plus solide disponible sans études de marché coûteuses." },
    { q: "Les crédits expirent-ils ?", a: "Non. Les crédits s'accumulent et n'expirent jamais. Même si votre abonnement expire, vos crédits restants sont conservés." },
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
                <span className={`font-bold text-sm ${openIdx === i ? "text-violet-600" : "text-slate-900"}`}>{faq.q}</span>
                <ChevronDown className={`w-5 h-5 flex-shrink-0 transition-transform duration-200 ${openIdx === i ? "rotate-180 text-violet-600" : "text-slate-300"}`} />
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
      <div className="absolute top-0 right-0 w-64 h-64 rounded-full bg-violet-600/10 blur-3xl pointer-events-none" />
      <div className="relative z-10 max-w-4xl mx-auto text-center">
        <p className="text-xs font-black uppercase tracking-[0.3em] text-white/20 mb-6">4 crédits · 30 secondes · Données réelles</p>
        <h2 className="font-black text-white tracking-tight leading-[0.9] mb-6" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
          Arrêtez de créer<br />
          <span className="text-violet-400">sans savoir si ça vend.</span>
        </h2>
        <p className="text-white/40 text-lg max-w-xl mx-auto mb-12">4 crédits. 30 secondes. Vous savez exactement si votre idée va se vendre — avant de dépenser 20 crédits à créer.</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register" className="inline-flex items-center gap-2 px-10 py-4 bg-violet-600 hover:bg-violet-700 text-white font-black rounded-xl transition-colors text-sm uppercase tracking-widest">
            Valider mon idée gratuitement <ArrowRight className="w-4 h-4" />
          </Link>
          <Link href="/" className="inline-flex items-center gap-2 px-10 py-4 border border-white/10 text-white/60 font-black rounded-xl hover:border-white/20 hover:text-white/80 transition-colors text-sm uppercase tracking-widest">
            Voir Bookzy
          </Link>
        </div>
        <p className="mt-6 text-xs text-white/20 uppercase tracking-widest">✓ Radar Cash · ✓ Niche Hunter · ✓ Validateur d'idée — tout dans Bookzy</p>
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
            <p className="text-sm text-slate-500 leading-relaxed">Validez vos idées. Créez des ebooks rentables.</p>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Outils</h3>
            <ul className="space-y-3">
              {[["Validateur d'idée", "/dashboard/analyseur"], ["Radar Cash", "/radar-cash"], ["Niche Hunter", "/niche-hunter"], ["Youbook", "/youbook"]].map(([l, h]) => (
                <li key={l}><Link href={h} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Communauté</h3>
            <ul className="space-y-3">
              {[["Suggestions", "/suggestions"], ["Nouveautés", "/changelog"]].map(([l, h]) => (
                <li key={l}><Link href={h} className="text-sm text-slate-500 hover:text-slate-900 transition-colors">{l}</Link></li>
              ))}
            </ul>
          </div>
          <div>
            <h3 className="text-xs font-black uppercase tracking-widest text-slate-900 mb-4">Contact</h3>
            <ul className="space-y-3">
              <li className="flex items-center gap-2 text-sm text-slate-500"><span className="w-1.5 h-1.5 bg-emerald-500 rounded-full" />Support 7j/7</li>
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
export default function ValidateurPage() {
  const [mounted, setMounted] = useState(false);
  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return <div className="min-h-screen bg-[#F5F2ED] flex items-center justify-center"><div className="w-8 h-8 border-2 border-[#C8BFB0] border-t-slate-900 rounded-full animate-spin" /></div>;

  return (
    <>
      <Nav />
      <Hero />
      <Logique />
      <Workflow />
      <AperçuRapport />
      <Comparatif />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTAFinal />
      <Footer />
    </>
  );
}