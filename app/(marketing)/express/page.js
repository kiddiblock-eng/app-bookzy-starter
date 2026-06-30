"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, ArrowRight, Check, Star, X, Menu } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

const TEMPLATES = [
  { id: "modern",    label: "Moderne",   primary: "#667eea", accent: "#764ba2" },
  { id: "luxe",      label: "Luxe",      primary: "#d4af37", accent: "#ffd700" },
  { id: "educatif",  label: "Éducatif",  primary: "#0f766e", accent: "#14b8a6" },
  { id: "energie",   label: "Énergique", primary: "#f97316", accent: "#dc2626" },
  { id: "tech",      label: "Tech",      primary: "#0a0e27", accent: "#00d4ff" },
  { id: "creative",  label: "Créatif",   primary: "#a855f7", accent: "#ec4899" },
  { id: "nature",    label: "Nature",    primary: "#166534", accent: "#22c55e" },
  { id: "corporate", label: "Corporate", primary: "#1e40af", accent: "#3b82f6" },
  { id: "fashion",   label: "Fashion",   primary: "#9f1239", accent: "#ec4899" },
  { id: "retro",     label: "Rétro",     primary: "#92400e", accent: "#d97706" },
  { id: "futuriste", label: "Futuriste", primary: "#5b21b6", accent: "#a78bfa" },
  { id: "minimal",   label: "Minimal",   primary: "#334155", accent: "#94a3b8" },
];

const TESTIMONIALS = [
  { name: "Marc Kouadio", role: "Infopreneur", location: "Abidjan, CI", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "J'ai arrêté de payer mon graphiste. Le PDF qui sort de Bookzy est plus propre que ce que je faisais sur Canva en 3h.", result: "12 ebooks vendus en 2 semaines" },
  { name: "Aïcha Koné", role: "Créatrice Food", location: "Dakar, SN", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg", quote: "J'ai copié le script WhatsApp généré par l'IA et envoyé à ma liste. Première vente le soir même.", result: "Première vente en 6h" },
  { name: "Yann Dubois", role: "Formateur", location: "Douala, CM", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/ef7c836ef8bee61bfcb4d5ff4bde5702.jpg", quote: "Le Niche Hunter m'a trouvé une idée de niche que je n'aurais jamais cherchée. 15 ventes dès le premier jour.", result: "15 ventes le jour 1" },
  { name: "Clara Martin", role: "Coach Business", location: "Paris, FR", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/7fef677cbafd1e0f1f474ad0fa14a341.jpg", quote: "L'ebook de 80 pages est pertinent et bien structuré. Le kit marketing m'a fait économiser des heures.", result: "3 ebooks créés en 1 jour" },
  { name: "Kofi Mensah", role: "Digital Marketer", location: "Accra, GH", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/bc04d7c785a05a60584b5edc85860f47.jpg", quote: "En 60 secondes j'avais un ebook complet avec cover. J'ai partagé le lien sur mon Instagram et les DMs ont explosé.", result: "200+ DMs en 24h" },
  { name: "Fatou Diallo", role: "Entrepreneuse", location: "Bamako, ML", avatar: "https://sucesspro.io/wp-content/uploads/2025/10/IMG_4306.jpg", quote: "J'ai mis en page mon Word en 20 secondes. Le PDF est sorti professionnel, j'ai vendu le soir même sur WhatsApp.", result: "5 ventes le 1er jour" },
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

// ─── NAV ───────────────────────────────────────────────────────────────────────
function Nav() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  useEffect(() => {
    const fn = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", fn);
    return () => window.removeEventListener("scroll", fn);
  }, []);
  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${scrolled ? "bg-[#F5F2ED]/95 backdrop-blur-md border-b border-[#D6CFC4] py-3 shadow-sm" : "bg-transparent py-5"}`}>
      <div className="absolute inset-0 opacity-[0.03] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-5">
          <Link href="/" className="group flex items-center gap-2 text-neutral-500 hover:text-neutral-900 transition-colors">
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            <span className="text-xs font-bold uppercase tracking-widest hidden sm:block">Bookzy</span>
          </Link>
          <div className="w-px h-5 bg-[#C8BFB0] hidden sm:block" />
          <div>
            <p className="text-xs font-black uppercase tracking-[0.2em] text-neutral-900 leading-none">Ebook Designer</p>
            <p className="text-[9px] font-semibold text-neutral-400 uppercase tracking-widest mt-0.5">Mise en page pro</p>
          </div>
        </div>
        <div className="flex items-center gap-3">
          <Link href="/auth/login" className="hidden lg:block px-4 py-2 border border-[#C8BFB0] bg-white text-neutral-600 text-[11px] font-bold rounded-lg uppercase tracking-widest hover:border-neutral-400 transition-colors">Connexion</Link>
          <Link href="/auth/register" className="px-4 py-2 bg-neutral-900 text-white text-[11px] font-bold rounded-lg uppercase tracking-widest hover:bg-neutral-800 transition-colors">Commencer</Link>
          <button onClick={() => setOpen(!open)} className="lg:hidden p-2 rounded-lg hover:bg-[#E8E2D9]">
            {open ? <X className="w-5 h-5 text-neutral-700" /> : <Menu className="w-5 h-5 text-neutral-700" />}
          </button>
        </div>
      </div>
      {open && (
        <div className="absolute top-full left-0 right-0 bg-[#F5F2ED] border-b border-[#D6CFC4] p-6 shadow-xl flex flex-col gap-4 lg:hidden">
          <Link href="/auth/login" onClick={() => setOpen(false)} className="text-sm font-bold text-neutral-700 uppercase tracking-widest py-2 border-b border-[#E8E2D9]">Connexion</Link>
          <Link href="/auth/register" onClick={() => setOpen(false)} className="text-center px-4 py-3 bg-neutral-900 text-white text-sm font-bold rounded-xl uppercase tracking-widest">Commencer gratuitement</Link>
        </div>
      )}
    </nav>
  );
}

// ─── HERO ──────────────────────────────────────────────────────────────────────
function Hero() {
  return (
    <section className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden bg-[#F5F2ED] px-6 pt-24 pb-16">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="absolute top-20 right-[-100px] w-[500px] h-[500px] rounded-full border border-[#D6CFC4] opacity-30 pointer-events-none" />
      <div className="absolute bottom-[-100px] left-[-150px] w-[400px] h-[400px] rounded-full bg-emerald-50 opacity-40 pointer-events-none" />

      <div className="relative z-10 max-w-5xl mx-auto text-center">
        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full border border-[#C8BFB0] bg-white/60 backdrop-blur-sm mb-8">
          <div className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-[0.25em] text-neutral-500">Mise en page ebook par IA</span>
        </div>

        <h1 className="font-black leading-[0.88] tracking-tight mb-8">
          <span className="block text-6xl md:text-8xl lg:text-[108px] text-neutral-900">Ebook</span>
          <span className="block text-6xl md:text-8xl lg:text-[108px] text-[#059669]">Designer</span>
        </h1>

        <p className="text-neutral-500 text-lg md:text-xl max-w-2xl mx-auto leading-relaxed mb-3">
          Votre texte brut ou votre Word transformé en PDF professionnel en 20 secondes.
          <span className="text-neutral-900 font-semibold"> Sans graphiste. Sans Canva. Sans attente.</span>
        </p>
        <p className="text-neutral-400 text-sm mb-10 uppercase tracking-widest font-bold">Éditeur riche · Import Word · 12 templates · Aperçu gratuit</p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-16">
          <Link href="/auth/register" className="group inline-flex items-center gap-3 px-8 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition-all text-sm uppercase tracking-widest shadow-lg">
            Créer mon ebook maintenant
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <div className="inline-flex items-center gap-2 px-5 py-4 border border-[#C8BFB0] rounded-xl bg-white/60">
            <span className="text-xs font-black text-neutral-900 uppercase tracking-widest">1 ebook pro</span>
            <span className="text-xs text-neutral-400">= 1 mise en page complète</span>
          </div>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-6 max-w-xl mx-auto">
          {[
            { value: "20s", label: "Mise en page" },
            { value: "12", label: "Templates" },
            { value: "100%", label: "Gratuit à l'aperçu" },
            { value: "PDF", label: "prêt à vendre" },
          ].map((s) => (
            <div key={s.label} className="text-center">
              <div className="text-3xl md:text-4xl font-black text-neutral-900 tracking-tight">{s.value}</div>
              <div className="text-[10px] font-bold uppercase tracking-widest text-neutral-400 mt-1">{s.label}</div>
            </div>
          ))}
        </div>
      </div>

      <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-40">
        <div className="w-px h-8 bg-neutral-400 animate-pulse" />
      </div>
    </section>
  );
}

// ─── DASHBOARD IMAGE ───────────────────────────────────────────────────────────
function DashboardPreview() {
  return (
    <section className="bg-neutral-900 py-20 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="text-center mb-12">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-3">Interface</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight mb-4">Simple. Puissant. Pro.</h2>
          <p className="text-white/50 text-base max-w-xl mx-auto">Un éditeur conçu pour aller vite. Pas de courbe d'apprentissage.</p>
        </div>
        <div className="relative rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
          <div className="absolute inset-0 bg-gradient-to-t from-neutral-900/70 via-transparent to-transparent z-10 pointer-events-none" />
          <img src="/ebookdesigneres.png" alt="Ebook Designer Dashboard" className="w-full h-auto object-cover object-top" />
          <div className="absolute bottom-6 left-6 z-20 flex flex-wrap gap-3">
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-white text-xs font-bold">✓ Éditeur riche TipTap</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-emerald-500/20 backdrop-blur-md border border-emerald-400/30">
              <span className="text-emerald-300 text-xs font-bold">✓ IA inline intégrée</span>
            </div>
            <div className="px-4 py-2 rounded-xl bg-white/10 backdrop-blur-md border border-white/20">
              <span className="text-white text-xs font-bold">✓ Aperçu live du template</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── WORD VS BOOKZY ─────────────────────────────────────────────────────────────
function WordVsBookzy() {
  return (
    <section className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-16 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 mb-3">La réalité</p>
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">Word vs Ebook Designer</h2>
          <p className="text-neutral-500 mt-3 text-base max-w-xl">Ce que vous perdez vraiment à faire votre mise en page sur Word.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* WORD */}
          <div className="rounded-2xl border-2 border-red-200 bg-red-50/50 overflow-hidden">
            <div className="bg-red-100 px-8 py-5 flex items-center gap-3 border-b border-red-200">
              <div className="w-8 h-8 rounded-lg bg-red-500 flex items-center justify-center">
                <X className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-black text-neutral-900 text-base uppercase tracking-wider">Microsoft Word</p>
                <p className="text-red-500 text-xs font-bold">La galère habituelle</p>
              </div>
            </div>
            <div className="p-8 space-y-5">
              {/* SVG simulation Word */}
              <div className="bg-white rounded-xl border border-red-100 p-4 shadow-sm">
                <svg viewBox="0 0 400 200" className="w-full h-auto" fill="none">
                  {/* Barre outils Word */}
                  <rect width="400" height="28" fill="#f0f0f0"/>
                  <rect x="8" y="7" width="28" height="14" rx="2" fill="#d1d5db"/>
                  <rect x="42" y="7" width="22" height="14" rx="2" fill="#d1d5db"/>
                  <rect x="70" y="7" width="22" height="14" rx="2" fill="#d1d5db"/>
                  <rect x="100" y="7" width="18" height="14" rx="2" fill="#d1d5db"/>
                  <rect x="125" y="7" width="18" height="14" rx="2" fill="#d1d5db"/>
                  <rect x="150" y="7" width="18" height="14" rx="2" fill="#d1d5db"/>
                  <rect x="175" y="7" width="35" height="14" rx="2" fill="#ef4444" opacity="0.7"/>
                  <text x="183" y="18" fill="white" fontSize="7" fontWeight="bold">Format?</text>
                  {/* Zone texte */}
                  <rect x="40" y="36" width="320" height="155" fill="white" rx="2"/>
                  {/* Texte brut avec mauvaise mise en page */}
                  <rect x="55" y="50" width="200" height="8" rx="2" fill="#374151" opacity="0.8"/>
                  <rect x="55" y="64" width="280" height="5" rx="2" fill="#9ca3af"/>
                  <rect x="55" y="74" width="265" height="5" rx="2" fill="#9ca3af"/>
                  <rect x="55" y="84" width="270" height="5" rx="2" fill="#9ca3af"/>
                  <rect x="55" y="94" width="248" height="5" rx="2" fill="#9ca3af"/>
                  {/* Flèche rouge problème */}
                  <rect x="55" y="108" width="280" height="5" rx="2" fill="#9ca3af"/>
                  <rect x="55" y="118" width="240" height="5" rx="2" fill="#9ca3af"/>
                  {/* Badge "3h de travail" */}
                  <rect x="230" y="150" width="110" height="24" rx="12" fill="#fef2f2" stroke="#fca5a5" strokeWidth="1"/>
                  <text x="250" y="165" fill="#ef4444" fontSize="8" fontWeight="700">⚠ 3h de mise en page</text>
                  {/* Icône sablier */}
                  <text x="260" y="140" fontSize="18">😫</text>
                </svg>
              </div>
              {[
                { pain: "3–5h de mise en page manuelle", sub: "Marges, polices, espacements... tout à la main" },
                { pain: "Résultat non-professionnel", sub: "PDF généré par Word = aspect Word, pas ebook premium" },
                { pain: "Zéro aperçu avant export", sub: "Vous découvrez le résultat final trop tard" },
                { pain: "Cover inexistante", sub: "Pas de couverture, pas de page de titre design" },
                { pain: "Aucun template marketing", sub: "Vous devez tout créer : posts, scripts, visuels" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-red-100 border border-red-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <X className="w-3 h-3 text-red-500" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-800">{item.pain}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* BOOKZY */}
          <div className="rounded-2xl border-2 border-emerald-200 bg-emerald-50/30 overflow-hidden">
            <div className="bg-emerald-600 px-8 py-5 flex items-center gap-3 border-b border-emerald-700">
              <div className="w-8 h-8 rounded-lg bg-white/20 flex items-center justify-center">
                <BookOpenSVG className="w-4 h-4 text-white" />
              </div>
              <div>
                <p className="font-black text-white text-base uppercase tracking-wider">Bookzy Ebook Designer</p>
                <p className="text-emerald-200 text-xs font-bold">20 secondes. Résultat pro.</p>
              </div>
            </div>
            <div className="p-8 space-y-5">
              {/* SVG simulation Bookzy */}
              <div className="bg-white rounded-xl border border-emerald-100 p-4 shadow-sm">
                <svg viewBox="0 0 400 200" className="w-full h-auto" fill="none">
                  {/* Interface Bookzy */}
                  <rect width="400" height="200" fill="#f8fafc" rx="8"/>
                  {/* Sidebar templates */}
                  <rect width="90" height="200" fill="#1e293b" rx="8 0 0 8"/>
                  <text x="10" y="22" fill="white" fontSize="7" fontWeight="700" opacity="0.5">TEMPLATES</text>
                  {TEMPLATES.slice(0, 6).map((t, i) => (
                    <g key={t.id}>
                      <rect x="8" y={30 + i*26} width="74" height="18" rx="4" fill={i === 0 ? t.primary : "#334155"}/>
                      {i === 0 && <rect x="8" y={30} width="74" height="18" rx="4" fill={t.primary} opacity="0.9"/>}
                      <text x="16" y={43 + i*26} fill={i === 0 ? "white" : "#94a3b8"} fontSize="7" fontWeight="600">{t.label}</text>
                    </g>
                  ))}
                  {/* Zone preview ebook */}
                  <rect x="100" y="10" width="90" height="130" rx="4" fill="#667eea"/>
                  <rect x="100" y="10" width="90" height="130" rx="4" fill="url(#grad)"/>
                  <defs>
                    <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                      <stop offset="0%" stopColor="#667eea"/>
                      <stop offset="100%" stopColor="#764ba2"/>
                    </linearGradient>
                  </defs>
                  <rect x="108" y="20" width="50" height="4" rx="2" fill="white" opacity="0.4"/>
                  <rect x="108" y="30" width="70" height="7" rx="2" fill="white" opacity="0.9"/>
                  <rect x="108" y="42" width="62" height="3" rx="1" fill="white" opacity="0.5"/>
                  <rect x="108" y="50" width="68" height="3" rx="1" fill="white" opacity="0.4"/>
                  <rect x="108" y="58" width="60" height="3" rx="1" fill="white" opacity="0.4"/>
                  {/* Badge "APERÇU" */}
                  <rect x="104" y="118" width="78" height="16" rx="8" fill="rgba(0,0,0,0.4)"/>
                  <text x="115" y="129" fill="white" fontSize="7" fontWeight="700">👁 Aperçu gratuit</text>
                  {/* Éditeur */}
                  <rect x="200" y="10" width="190" height="180" rx="4" fill="white" stroke="#e2e8f0" strokeWidth="1"/>
                  {/* Toolbar TipTap */}
                  <rect x="205" y="15" width="180" height="20" rx="3" fill="#f8fafc" stroke="#e2e8f0" strokeWidth="0.5"/>
                  {["B","I","U","AI"].map((t, i) => (
                    <g key={t}>
                      <rect x={210 + i*22} y="18" width="16" height="14" rx="3" fill={t === "AI" ? "#059669" : "#e2e8f0"}/>
                      <text x={212 + i*22} y="28" fill={t === "AI" ? "white" : "#374151"} fontSize="7" fontWeight="700">{t}</text>
                    </g>
                  ))}
                  {/* Contenu éditeur */}
                  <rect x="208" y="42" width="120" height="6" rx="2" fill="#334155" opacity="0.8"/>
                  <rect x="208" y="54" width="175" height="4" rx="2" fill="#d1d5db"/>
                  <rect x="208" y="63" width="165" height="4" rx="2" fill="#d1d5db"/>
                  <rect x="208" y="72" width="170" height="4" rx="2" fill="#d1d5db"/>
                  <rect x="208" y="81" width="155" height="4" rx="2" fill="#d1d5db"/>
                  {/* Bouton IA */}
                  <rect x="208" y="95" width="80" height="20" rx="10" fill="#ecfdf5" stroke="#a7f3d0" strokeWidth="1"/>
                  <text x="218" y="108" fill="#059669" fontSize="7" fontWeight="700">Améliorer avec l'IA</text>
                  {/* Badge "20 sec" */}
                  <rect x="290" y="165" width="90" height="20" rx="10" fill="#dcfce7" stroke="#86efac" strokeWidth="1"/>
                  <text x="300" y="178" fill="#16a34a" fontSize="8" fontWeight="700">✓ Prêt en 20s</text>
                </svg>
              </div>
              {[
                { win: "Mise en page automatique en 20s", sub: "Template appliqué, margins, polices, tout inclus" },
                { win: "PDF professionnel haute qualité", sub: "Rendu de  qualité impression, pas Word" },
                { win: "Aperçu gratuit avant de payer", sub: "Vous voyez le résultat page par page avant de débiter" },
                { win: "Cover + page de titre automatique", sub: "Générée selon votre template, prête à vendre" },
                { win: "IA inline : améliorez chaque section", sub: "Reformulez, enrichissez, corrigez sans quitter l'éditeur" },
              ].map((item, i) => (
                <div key={i} className="flex items-start gap-3">
                  <div className="w-5 h-5 rounded-full bg-emerald-100 border border-emerald-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                    <Check className="w-3 h-3 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-neutral-800">{item.win}</p>
                    <p className="text-xs text-neutral-400 mt-0.5">{item.sub}</p>
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

// ─── LES 2 MODES ────────────────────────────────────────────────────────────────
function DeuxModes() {
  const [activeMode, setActiveMode] = useState("editeur");

  return (
    <section className="bg-neutral-900 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-12 pb-10 border-b border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-3">Deux façons de créer</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Vous choisissez votre mode</h2>
        </div>

        {/* Tabs */}
        <div className="flex gap-3 mb-10 flex-wrap">
          {[
            { id: "editeur", label: "Éditeur Pro", sub: "Je rédige dans Bookzy" },
            { id: "import", label: "Import Word", sub: "J'ai déjà un .docx" },
          ].map((tab) => (
            <button key={tab.id} onClick={() => setActiveMode(tab.id)}
              className={`px-6 py-3 rounded-xl transition-all text-left ${activeMode === tab.id ? "bg-white text-neutral-900" : "bg-white/10 text-white/60 hover:bg-white/15"}`}>
              <p className="text-sm font-black uppercase tracking-wider leading-none">{tab.label}</p>
              <p className={`text-xs mt-1 ${activeMode === tab.id ? "text-neutral-500" : "text-white/40"}`}>{tab.sub}</p>
            </button>
          ))}
        </div>

        {activeMode === "editeur" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Capture réelle éditeur */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/edit.png"
                alt="Éditeur Pro Bookzy"
                className="w-full h-auto object-cover object-top"
              />
            </div>
            {/* Explication */}
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">L'éditeur qui foudroie Word</h3>
                <p className="text-white/50 text-base leading-relaxed">Rédigez directement dans Bookzy avec un éditeur riche de type Notion. Titre, introduction, N chapitres, conclusion , structure d'ebook complète.</p>
              </div>
              {[
                { label: "TipTap : éditeur riche professionnel", sub: "Gras, italique, titres H1/H2, listes, alignement tout ce qu'il faut, rien de superflu", color: "blue" },
                { label: "IA inline sur chaque section", sub: "Cliquez 'Améliorer avec l'IA' sur n'importe quel bloc. Reformulation, enrichissement, correction sans quitter l'éditeur", color: "violet" },
                { label: "12 templates : du minimal au luxueux", sub: "Moderne, Luxe, Tech, Nature, Corporate, Fashion... Changez de template en un clic et regenerez l'aperçu gratuitement", color: "orange" },

                { label: "Preview live du template", sub: "Votre couverture se met à jour en temps réel pendant que vous tapez votre titre", color: "emerald" },
                { label: "Protection anti-perte", sub: "Bookzy vous alerte si vous essayez de fermer l'onglet sans avoir généré votre PDF", color: "orange" },
                { label: "De 3 à 10 chapitres", sub: "Ajustez le nombre de chapitres en un clic. L'éditeur s'adapte instantanément", color: "blue" },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${f.color === "blue" ? "bg-emerald-400" : f.color === "violet" ? "bg-emerald-400" : f.color === "emerald" ? "bg-emerald-400" : "bg-emerald-400"}`} />
                  <div>
                    <p className="text-sm font-bold text-white">{f.label}</p>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeMode === "import" && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
            {/* Capture réelle import */}
            <div className="rounded-2xl overflow-hidden border border-white/10 shadow-2xl">
              <img
                src="/import.png"
                alt="Import Word Bookzy"
                className="w-full h-auto object-cover object-top"
              />
            </div>
            {/* Explication Import */}
            <div className="space-y-5">
              <div>
                <h3 className="text-2xl md:text-3xl font-black text-white tracking-tight mb-2">Votre Word devient un ebook pro</h3>
                <p className="text-white/50 text-base leading-relaxed">Vous avez déjà rédigé votre contenu sur Word ? Parfait. Uploadez, choisissez un template, générez. C'est tout.</p>
              </div>
              {[
                { label: "Détection auto du titre et des chapitres", sub: "Bookzy lit votre structure Word : titre en gras, chapitres en MAJUSCULES. Zéro configuration manuelle", color: "blue" },
                { label: "Import .docx en un clic", sub: "Glissez-déposez votre fichier. Extraction du contenu en quelques secondes, sans perte de texte", color: "emerald" },
                { label: "Aperçu gratuit watermarked avant de payer", sub: "Voyez votre ebook page par page avec votre template avant de générer le PDF final. Changez de template si besoin", color: "violet" },
                { label: "12 templates : du minimal au luxueux", sub: "Moderne, Luxe, Tech, Nature, Corporate, Fashion... Changez de template en un clic et regenerez l'aperçu gratuitement", color: "orange" },
                { label: "PDF haute qualité rendu par Puppeteer", sub: "Pas un export Word. Un vrai PDF généré par moteur de rendu Chrome. Qualité impression. Prêt à vendre.", color: "blue" },
              ].map((f, i) => (
                <div key={i} className="flex items-start gap-4 p-4 rounded-xl bg-white/5 border border-white/10">
                  <div className={`w-2 h-2 rounded-full flex-shrink-0 mt-1.5 ${f.color === "blue" ? "bg-emerald-400" : f.color === "violet" ? "bg-emerald-400" : f.color === "emerald" ? "bg-emerald-400" : "bg-emerald-400"}`} />
                  <div>
                    <p className="text-sm font-bold text-white">{f.label}</p>
                    <p className="text-xs text-white/40 mt-0.5 leading-relaxed">{f.sub}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>
    </section>
  );
}

// ─── 12 TEMPLATES ─────────────────────────────────────────────────────────────
function Templates() {
  const [active, setActive] = useState("modern");
  const current = TEMPLATES.find(t => t.id === active) || TEMPLATES[0];

  return (
    <section className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-16 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 mb-3">Design</p>
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">12 templates, 12 univers.</h2>
          <p className="text-neutral-500 mt-3 text-base">Cliquez pour voir le rendu. Changeable à l'infini avant de générer.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-start">
          {/* Preview du template */}
          <div className="sticky top-24">
            <div className="relative" style={{ perspective: "1000px" }}>
              <div className="mx-auto w-52">
                {/* Livre 3D */}
                <div className="relative w-52 h-72 mx-auto">
                  <div className="absolute inset-0 rounded-r-lg overflow-hidden shadow-2xl" style={{ background: `linear-gradient(135deg, ${current.primary}, ${current.accent})` }}>
                    <div className="absolute left-0 top-0 bottom-0 w-2 bg-gradient-to-r from-black/30 to-transparent" />
                    <div className="p-5 text-white h-full flex flex-col">
                      <div className="text-[8px] uppercase tracking-[0.2em] opacity-50 mb-2">Bookzy · Ebook Designer</div>
                      <div className="text-xs font-black uppercase tracking-wide mb-1 opacity-60">{current.label}</div>
                      <div className="text-lg font-black leading-tight mb-3">Guide de l'Infopreneur 2025</div>
                      <div className="flex-1">
                        {[70, 85, 60, 80, 55, 75].map((w, i) => (
                          <div key={i} className="h-1 rounded-full bg-white/20 mb-1.5" style={{ width: `${w}%` }} />
                        ))}
                      </div>
                      <div className="text-[9px] opacity-40 uppercase tracking-widest">Par Marc Kouadio</div>
                    </div>
                  </div>
                  {/* Tranche du livre */}
                  <div className="absolute top-1 -right-1 bottom-1 w-2 rounded-r-sm" style={{ background: `linear-gradient(to right, ${current.accent}, ${current.primary})`, opacity: 0.5 }} />
                </div>
                <p className="text-center text-sm font-bold text-neutral-600 mt-4 uppercase tracking-widest">{current.label}</p>
              </div>
            </div>
          </div>

          {/* Grille templates */}
          <div>
            <div className="grid grid-cols-4 gap-3 mb-6">
              {TEMPLATES.map((t) => (
                <button key={t.id} onClick={() => setActive(t.id)}
                  className={`flex flex-col items-center gap-2 transition-all group`}>
                  <div className={`w-full aspect-[3/4] rounded-lg transition-all overflow-hidden ${active === t.id ? "ring-2 ring-neutral-900 ring-offset-2 scale-105 shadow-lg" : "hover:scale-105"}`}
                    style={{ background: `linear-gradient(135deg, ${t.primary}, ${t.accent})` }}>
                    {active === t.id && (
                      <div className="w-full h-full flex items-center justify-center bg-black/20">
                        <Check className="w-4 h-4 text-white" />
                      </div>
                    )}
                  </div>
                  <span className={`text-[10px] font-bold uppercase tracking-wider ${active === t.id ? "text-neutral-900" : "text-neutral-400"}`}>{t.label}</span>
                </button>
              ))}
            </div>
            <div className="bg-[#EDE8E0] rounded-2xl p-5 border border-[#C8BFB0]">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-2">Comment ça marche</p>
              <p className="text-neutral-600 text-sm leading-relaxed">Choisissez un template → cliquez <strong className="text-neutral-900">Voir l'aperçu (GRATUIT)</strong> → parcourez vos pages → satisfait ? Cliquez <strong className="text-neutral-900">Générer le PDF</strong>. Pas satisfait ? Changez de template et recommencez gratuitement.</p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── APERÇU GRATUIT ─────────────────────────────────────────────────────────────
function ApercuGratuit() {
  return (
    <section className="bg-neutral-900 py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.04] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-16 pb-10 border-b border-white/10">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-white/30 mb-3">Zéro risque</p>
          <h2 className="text-4xl md:text-5xl font-black text-white tracking-tight">Vous voyez avant de payer</h2>
          <p className="text-white/50 mt-3 text-base max-w-xl">L'aperçu watermarked est 100% gratuit. Vous ne générez le PDF final que si vous êtes satisfait.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10 items-center">
          {/* SVG aperçu modal */}
          <div className="bg-[#0f172a] rounded-2xl border border-white/10 overflow-hidden shadow-2xl">
            <svg viewBox="0 0 400 420" className="w-full h-auto" fill="none">
              {/* Header modal */}
              <rect width="400" height="420" fill="#1e293b" rx="12"/>
              <rect width="400" height="48" fill="#0f172a" rx="12 12 0 0"/>
              <rect x="10" y="10" width="32" height="28" rx="6" fill="#059669"/>
              <rect x="16" y="16" width="18" height="3" rx="1" fill="white" opacity="0.8"/>
              <rect x="16" y="22" width="14" height="3" rx="1" fill="white" opacity="0.5"/>
              <rect x="16" y="28" width="16" height="3" rx="1" fill="white" opacity="0.5"/>
              <text x="50" y="28" fill="white" fontSize="11" fontWeight="800">Aperçu de votre ebook</text>
              <text x="50" y="40" fill="#64748b" fontSize="8">Avec watermark · Version finale après paiement</text>
              {/* Pagination */}
              <rect x="305" y="15" width="60" height="20" rx="10" fill="rgba(255,255,255,0.1)"/>
              <text x="318" y="28" fill="white" fontSize="9" fontWeight="700">3 / 12</text>
              {/* Bouton fermer */}
              <rect x="370" y="14" width="22" height="22" rx="6" fill="rgba(255,255,255,0.1)"/>
              <text x="376" y="28" fill="white" fontSize="10">✕</text>

              {/* Pages PDF simulées */}
              {/* Page courante (grande) */}
              <rect x="60" y="58" width="280" height="200" rx="6" fill="white" stroke="#334155" strokeWidth="0.5"/>
              {/* Simulation page ebook avec watermark */}
              <rect x="60" y="58" width="280" height="200" rx="6" fill="white"/>
              {/* Header page */}
              <rect x="60" y="58" width="280" height="40" rx="6 6 0 0" fill="#667eea"/>
              <defs><linearGradient id="ph" x1="0" y1="0" x2="1" y2="0"><stop offset="0%" stopColor="#667eea"/><stop offset="100%" stopColor="#764ba2"/></linearGradient></defs>
              <rect x="60" y="58" width="280" height="40" rx="6 6 0 0" fill="url(#ph)"/>
              <text x="74" y="75" fill="white" fontSize="8" fontWeight="800" opacity="0.6">CHAPITRE 1</text>
              <text x="74" y="88" fill="white" fontSize="10" fontWeight="900">Trouver sa niche rentable</text>
              {/* Contenu */}
              {[180, 160, 170, 155, 165, 140, 150, 160].map((w, i) => (
                <rect key={i} x="74" y={106 + i*14} width={w} height="5" rx="2" fill="#e2e8f0"/>
              ))}
              {/* WATERMARK diagonal */}
              <text x="100" y="230" fill="#9ca3af" fontSize="22" fontWeight="900" opacity="0.15" transform="rotate(-30, 200, 180)">APERÇU BOOKZY</text>
              <text x="80" y="160" fill="#9ca3af" fontSize="18" fontWeight="900" opacity="0.1" transform="rotate(-30, 200, 180)">WATERMARK</text>
              {/* Badge page */}
              <rect x="66" y="64" width="36" height="14" rx="7" fill="rgba(0,0,0,0.6)"/>
              <text x="71" y="74" fill="white" fontSize="7" fontWeight="700">Page 3</text>

              {/* Pages suivantes visibles */}
              <rect x="340" y="70" width="50" height="70" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="0.5" opacity="0.7"/>
              <rect x="344" y="74" width="42" height="6" rx="2" fill="#334155"/>
              <rect x="344" y="84" width="38" height="3" rx="1" fill="#475569"/>
              <rect x="344" y="90" width="36" height="3" rx="1" fill="#475569"/>

              <rect x="8" y="70" width="50" height="70" rx="4" fill="#1e293b" stroke="#334155" strokeWidth="0.5" opacity="0.7"/>
              <rect x="12" y="74" width="42" height="6" rx="2" fill="#334155"/>
              <rect x="12" y="84" width="38" height="3" rx="1" fill="#475569"/>

              {/* Progress pages */}
              <rect x="60" y="268" width="280" height="4" rx="2" fill="#334155"/>
              <rect x="60" y="268" width="75" height="4" rx="2" fill="#059669"/>

              {/* Avertissement */}
              <rect x="10" y="282" width="380" height="48" rx="8" fill="rgba(234,179,8,0.15)" stroke="rgba(234,179,8,0.4)" strokeWidth="1"/>
              <text x="20" y="298" fill="#fbbf24" fontSize="8" fontWeight="700">⚠ Aperçu limité (12 premières pages avec watermark)</text>
              <text x="20" y="312" fill="#fbbf24" fontSize="7" opacity="0.7">Après paiement → ebook complet sans watermark, haute qualité impression.</text>

              {/* Boutons footer */}
              <rect x="10" y="342" width="185" height="40" rx="10" fill="#334155"/>
              <text x="40" y="357" fill="#94a3b8" fontSize="9" fontWeight="700">Modifier le template</text>
              <rect x="202" y="342" width="188" height="40" rx="10" fill="#16a34a"/>
              <text x="222" y="357" fill="white" fontSize="9" fontWeight="800">Générer mon ebook</text>
              <text x="222" y="372" fill="rgba(255,255,255,0.6)" fontSize="7">PDF haute qualité, prêt à vendre</text>
            </svg>
          </div>

          <div className="space-y-6">
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
                  <Check className="w-5 h-5 text-emerald-400" />
                </div>
                <div>
                  <p className="text-white font-black text-base mb-1">Aperçu 100% gratuit</p>
                  <p className="text-white/50 text-sm leading-relaxed">Générez l'aperçu autant de fois que vous voulez avec n'importe quel template. Aucun crédit débité jusqu'à ce que vous validiez.</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-400/20 flex items-center justify-center flex-shrink-0">
                  <span className="text-emerald-400 text-sm font-black">12</span>
                </div>
                <div>
                  <p className="text-white font-black text-base mb-1">Parcourez vos pages</p>
                  <p className="text-white/50 text-sm leading-relaxed">Le viewer affiche vos 12 premières pages une par une. Scrollez pour naviguer. Un compteur de page s'affiche en temps réel.</p>
                </div>
              </div>
            </div>
            <div className="p-6 rounded-2xl bg-white/5 border border-white/10">
              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-[rgba(5,150,105,0.12)] border border-[rgba(5,150,105,0.14)] flex items-center justify-center flex-shrink-0">
                  <span className="text-[#059669] text-lg">→</span>
                </div>
                <div>
                  <p className="text-white font-black text-base mb-1">Satisfait ? Générez. Sinon ? Changez.</p>
                  <p className="text-white/50 text-sm leading-relaxed">Bouton "Modifier le template" pour changer de thème et regénérer l'aperçu gratuitement. Bouton "Générer le PDF" pour recevoir votre ebook final, prêt à vendre.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TARIFICATION ──────────────────────────────────────────────────────────────
function Tarification() {
  return (
    <section className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="relative z-10 max-w-5xl mx-auto">
        <div className="mb-16 pb-10 border-b border-[#C8BFB0]">
          <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 mb-3">Tarification</p>
          <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">Un ebook pro. En quelques minutes.</h2>
          <p className="text-neutral-500 mt-3 text-base">Tu démarres gratuitement et tu génères ton ebook complet, prêt à vendre.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-start mb-12">
          {/* Card principale */}
          <div className="bg-white rounded-2xl border border-[#C8BFB0] shadow-md overflow-hidden">
            <div className="bg-neutral-900 px-8 py-6">
              <p className="text-white/40 text-xs font-black uppercase tracking-widest mb-2">Ebook Designer</p>
              <div className="flex items-end gap-2">
                <span className="text-5xl font-extrabold text-white leading-none tracking-tight">1 ebook</span>
                <span className="text-emerald-400 font-black text-2xl mb-1">pro</span>
              </div>
              <p className="text-white/30 text-sm mt-1">mise en page complète, prête à vendre</p>
            </div>
            <div className="p-8">
              <div className="space-y-3 mb-8">
                {[
                  "Mise en page avec template premium",
                  "Cover + page de titre automatique",
                  "Sommaire généré automatiquement",
                  "Export PDF haute qualité ",
                  "Aperçu gratuit watermarked inclus",
                  "Import Word .docx ou éditeur intégré",
                ].map((item, i) => (
                  <div key={i} className="flex items-center gap-3">
                    <Check className="w-4 h-4 text-[#059669] flex-shrink-0" />
                    <span className="text-sm text-neutral-700 font-medium">{item}</span>
                  </div>
                ))}
              </div>
              <Link href="/auth/register" className="group w-full flex items-center justify-center gap-2 py-4 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition-all text-sm uppercase tracking-widest">
                Créer mon ebook maintenant
                <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
              </Link>
            </div>
          </div>

          {/* Valeur */}
          <div className="space-y-4">
            <div className="bg-[#EDE8E0] rounded-2xl border border-[#C8BFB0] p-6">
              <p className="text-xs font-black uppercase tracking-widest text-neutral-400 mb-4">Pourquoi ça change tout</p>
              <div className="space-y-3">
                {[
                  { t: "Aucun graphiste à payer", d: "Un PDF plus propre que 3h sur Canva." },
                  { t: "Aperçu gratuit avant de payer", d: "Tu vois le résultat page par page d'abord." },
                  { t: "Prêt à vendre tout de suite", d: "Cover, sommaire et kit marketing inclus." },
                ].map((row, i) => (
                  <div key={i} className="flex items-start gap-3 p-3 rounded-xl border bg-white border-[#C8BFB0]">
                    <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                    <div>
                      <span className="text-sm font-bold text-neutral-900">{row.t}</span>
                      <p className="text-xs text-neutral-400 mt-0.5">{row.d}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            <div className="bg-[rgba(5,150,105,0.10)] rounded-2xl border border-[rgba(5,150,105,0.14)] p-5">
              <p className="text-xs font-black uppercase tracking-widest text-[#059669] mb-2">Le bon calcul</p>
              <p className="text-neutral-700 text-sm leading-relaxed">
                Tu paies l'équivalent d'un Canva Pro, mais avec des <strong className="text-neutral-900">PDFs qui se vendent vraiment</strong> et zéro heure de mise en page.
              </p>
            </div>
            <Link href="/auth/register" className="flex items-center justify-center gap-2 py-3 rounded-xl border border-[#C8BFB0] bg-white text-neutral-600 text-sm font-bold hover:border-neutral-400 transition-colors">
              Créer mon ebook <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

// ─── TÉMOIGNAGES ───────────────────────────────────────────────────────────────
function TestimonialCard({ t }) {
  return (
    <div className="w-[300px] sm:w-[340px] flex-shrink-0 bg-white rounded-2xl p-5 border border-[#C8BFB0] shadow-sm hover:shadow-md transition-shadow">
      <div className="flex gap-0.5 mb-3">{[1,2,3,4,5].map(i => <Star key={i} className="w-3.5 h-3.5 text-amber-400 fill-amber-400" />)}</div>
      <p className="text-neutral-700 text-sm leading-relaxed mb-4">"{t.quote}"</p>
      <div className="mb-4"><span className="inline-block px-2.5 py-1 bg-emerald-50 text-emerald-600 text-[11px] font-semibold rounded-full border border-emerald-100">→ {t.result}</span></div>
      <div className="flex items-center gap-3 pt-3 border-t border-[#E8E2D9]">
        <img src={t.avatar} alt={t.name} className="w-9 h-9 rounded-full object-cover flex-shrink-0" />
        <div>
          <p className="font-semibold text-neutral-900 text-sm leading-tight">{t.name}</p>
          <p className="text-xs text-neutral-400">{t.role} · {t.location}</p>
        </div>
      </div>
    </div>
  );
}

function Testimonials() {
  return (
    <section className="py-24 overflow-hidden bg-[#EDE8E0]">
      <div className="text-center mb-12 px-5">
        <div className="inline-flex items-center gap-2 mb-4">
          <div className="flex">{[1,2,3,4,5].map(i => <Star key={i} className="w-4 h-4 text-amber-400 fill-amber-400" />)}</div>
          <span className="text-neutral-500 text-sm font-medium">4.9/5 · 7 300+ utilisateurs</span>
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 mb-3">Témoignages</p>
        <h2 className="text-4xl md:text-5xl font-black text-neutral-900 tracking-tight">Aimé par notre communauté</h2>
        <p className="text-neutral-500 mt-3 text-base">Ils ont créé, vendu et monétisé avec Bookzy.</p>
      </div>
      <div className="relative mb-4">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, #EDE8E0, transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, #EDE8E0, transparent)" }} />
        <div className="flex gap-4 animate-marquee-left" style={{ width: "max-content" }}>
          {DOUBLED.map((t, i) => <TestimonialCard key={`r1-${i}`} t={t} />)}
        </div>
      </div>
      <div className="relative">
        <div className="pointer-events-none absolute left-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to right, #EDE8E0, transparent)" }} />
        <div className="pointer-events-none absolute right-0 top-0 bottom-0 w-24 z-10" style={{ background: "linear-gradient(to left, #EDE8E0, transparent)" }} />
        <div className="flex gap-4 animate-marquee-right" style={{ width: "max-content" }}>
          {[...DOUBLED].reverse().map((t, i) => <TestimonialCard key={`r2-${i}`} t={t} />)}
        </div>
      </div>
      <style jsx>{`
        @keyframes marquee-left { 0% { transform: translateX(0); } 100% { transform: translateX(-50%); } }
        @keyframes marquee-right { 0% { transform: translateX(-50%); } 100% { transform: translateX(0); } }
        .animate-marquee-left { animation: marquee-left 30s linear infinite; }
        .animate-marquee-right { animation: marquee-right 30s linear infinite; }
        .animate-marquee-left:hover, .animate-marquee-right:hover { animation-play-state: paused; }
      `}</style>
    </section>
  );
}

// ─── CTA FINAL ─────────────────────────────────────────────────────────────────
function CTAFinal() {
  return (
    <section className="bg-[#F5F2ED] py-24 px-6 relative overflow-hidden">
      <div className="absolute inset-0 opacity-[0.025] pointer-events-none" style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
      <div className="absolute top-[-100px] left-[-100px] w-[400px] h-[400px] rounded-full border border-[#D6CFC4] opacity-40 pointer-events-none" />
      <div className="absolute bottom-[-100px] right-[-100px] w-[300px] h-[300px] rounded-full border border-[#D6CFC4] opacity-30 pointer-events-none" />
      <div className="relative z-10 max-w-3xl mx-auto text-center">
        <div className="w-16 h-16 rounded-2xl bg-neutral-900 flex items-center justify-center mx-auto mb-8 shadow-xl">
          <BookOpenSVG className="w-8 h-8 text-white" />
        </div>
        <p className="text-xs font-black uppercase tracking-[0.3em] text-neutral-400 mb-4">Prêt à commencer ?</p>
        <h2 className="text-4xl md:text-6xl font-black text-neutral-900 tracking-tight leading-tight mb-6">
          Votre Word devient<br /><span className="text-[#059669]">un ebook pro en 20s.</span>
        </h2>
        <p className="text-neutral-500 text-lg mb-3 max-w-md mx-auto">Aperçu gratuit. Tu génères le PDF final seulement si tu valides. Aucun risque.</p>
        <p className="text-neutral-400 text-xs mb-10 uppercase tracking-widest font-bold">Démarrage gratuit · Sans carte bancaire · PDF prêt à vendre</p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link href="/auth/register" className="group inline-flex items-center gap-3 px-10 py-5 bg-neutral-900 hover:bg-neutral-800 text-white font-bold rounded-xl transition-all text-sm uppercase tracking-widest shadow-xl">
            Créer mon ebook maintenant
            <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </Link>
          <Link href="/dashboard/express" className="inline-flex items-center gap-2 px-8 py-5 border border-[#C8BFB0] hover:border-neutral-400 bg-white text-neutral-700 font-bold rounded-xl transition-all text-sm uppercase tracking-widest">
            Voir la démo
          </Link>
        </div>
      </div>
    </section>
  );
}

// ─── PAGE ──────────────────────────────────────────────────────────────────────
export default function EbookDesignerPage() {
  return (
    <div className="font-sans">
      <Nav />
      <Hero />
      <DashboardPreview />
      <DeuxModes />
      <WordVsBookzy />
      <Templates />
      <ApercuGratuit />
      <Tarification />
      <Testimonials />
      <CTAFinal />
    </div>
  );
}