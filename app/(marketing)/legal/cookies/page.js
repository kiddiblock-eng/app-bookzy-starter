"use client";

import Link from "next/link";
import {
  Cookie, ShieldCheck, BarChart3, Settings2,
  Target, Clock, ArrowLeft, Info, ChevronRight, Globe
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

const cookieTypes = [
  {
    id: "essentiels", title: "Essentiels", icon: ShieldCheck,
    desc: "Obligatoires pour la connexion et la sécurité.",
    list: ["Session utilisateur", "Sécurité anti-CSRF", "Choix de consentement"],
    dot: "bg-emerald-500",
  },
  {
    id: "analytiques", title: "Performance", icon: BarChart3,
    desc: "Nous aident à améliorer l'outil Bookzy.",
    list: ["Pages consultées", "Temps par session", "Parcours de navigation"],
    dot: "bg-blue-500",
  },
  {
    id: "fonctionnels", title: "Préférences", icon: Settings2,
    desc: "Mémorisent vos réglages personnels.",
    list: ["Langue", "Mode sombre/clair", "Paramètres Dashboard"],
    dot: "bg-violet-500",
  },
  {
    id: "marketing", title: "Marketing", icon: Target,
    desc: "Suivi publicitaire pour offres ciblées.",
    list: ["Annonces pertinentes", "Performance pub", "Réseaux sociaux"],
    dot: "bg-rose-500",
  },
];

export default function CookiePolicy() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#F5F2ED" }}>

      {/* Grain */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#F5F2ED]/90 backdrop-blur-md border-b border-[#C8BFB0]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <BookOpenSVG className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-slate-900 tracking-tight">Bookzy</span>
              <span className="text-slate-400 font-bold"> Policy</span>
            </div>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-24">

        {/* HERO */}
        <div className="max-w-3xl mb-16 pb-12 border-b border-[#C8BFB0]">
          <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C8BFB0] rounded-full bg-white/60 mb-8">
            <Info className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Transparence totale</span>
          </div>
          <h1 className="font-black text-slate-900 tracking-tight leading-[0.92] mb-6" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
            Comment nous utilisons<br />
            <span className="text-blue-500">les cookies.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
            Bookzy utilise des cookies pour assurer le bon fonctionnement du service, analyser notre trafic et personnaliser votre expérience utilisateur.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* CONTENU */}
          <div className="flex-1 max-w-4xl space-y-16">

            {/* 1. Définition */}
            <section id="definition">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Définition</p>
              <h2 className="text-3xl font-black text-slate-900 mb-6 tracking-tight">1. Qu'est-ce qu'un cookie ?</h2>
              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 lg:p-8 text-slate-500 text-sm leading-relaxed">
                Un cookie est un petit fichier texte stocké sur votre appareil lors de votre navigation.
                Il agit comme une mémoire temporaire qui nous permet de vous reconnaître d'une page à l'autre
                et d'améliorer votre expérience sur Bookzy.
              </div>
            </section>

            {/* 2. Types */}
            <section id="types">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Catégories</p>
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">2. Types de cookies utilisés</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-5">
                {cookieTypes.map(type => (
                  <div key={type.id} className="bg-white border border-[#C8BFB0] rounded-2xl p-6 hover:border-slate-400 transition-all">
                    <div className="flex items-center gap-3 mb-5">
                      <div className="w-9 h-9 bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl flex items-center justify-center flex-shrink-0">
                        <type.icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <h3 className="font-black text-slate-900 tracking-tight">{type.title}</h3>
                    </div>
                    <p className="text-sm text-slate-500 mb-5 leading-relaxed">{type.desc}</p>
                    <div className="w-full h-px bg-[#E8E2D9] mb-4" />
                    <ul className="space-y-2">
                      {type.list.map((li, i) => (
                        <li key={i} className="flex items-center gap-2.5">
                          <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${type.dot}`} />
                          <span className="text-xs font-bold text-slate-600 uppercase tracking-widest">{li}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </section>

            {/* 3. Tiers */}
            <section id="tiers">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Partenaires</p>
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">3. Services tiers</h2>
              <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
                <div className="relative z-10">
                  <div className="flex items-center gap-2 mb-6">
                    <Globe className="w-4 h-4 text-blue-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Intégrations externes</p>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    {[
                      { name: "Google Analytics", role: "Mesure d'audience" },
                      { name: "Moneroo", role: "Paiement sécurisé" },
                      { name: "Cloudinary", role: "Stockage médias" },
                    ].map((s, i) => (
                      <div key={i} className="bg-white/5 border border-white/10 rounded-xl p-4">
                        <p className="font-black text-white text-sm mb-1">{s.name}</p>
                        <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest">{s.role}</p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </section>

            {/* 4. Conservation */}
            <section id="conservation">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Durée</p>
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">4. Durée de conservation</h2>
              <div className="bg-white border border-[#C8BFB0] rounded-2xl overflow-hidden">
                <table className="w-full text-left text-sm">
                  <thead className="border-b border-[#E8E2D9]">
                    <tr>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Type</th>
                      <th className="px-6 py-4 text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Durée max.</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#F5F2ED]">
                    {[
                      { type: "Session",     duree: "Durée de visite" },
                      { type: "Essentiels",  duree: "12 mois" },
                      { type: "Marketing",   duree: "13 mois" },
                    ].map((row, i) => (
                      <tr key={i} className="hover:bg-[#F5F2ED]/50 transition-colors">
                        <td className="px-6 py-4 font-bold text-slate-700">{row.type}</td>
                        <td className="px-6 py-4 font-black text-slate-900">{row.duree}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </section>

            {/* 5. Gestion */}
            <section id="gestion">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Contrôle</p>
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">5. Gestion des cookies</h2>
              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-start md:items-center gap-6 hover:border-slate-400 transition-all">
                <div className="flex-1">
                  <p className="font-black text-slate-900 text-lg mb-2 tracking-tight">Contrôlez votre vie privée</p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Vous pouvez modifier vos choix à tout moment. Le refus des cookies analytiques nous empêche d'améliorer votre expérience sur Bookzy.
                  </p>
                </div>
                <button className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all flex-shrink-0">
                  Réglages cookies
                </button>
              </div>
            </section>

            {/* Contact */}
            <section>
              <div className="w-full h-px bg-[#C8BFB0] mb-10" />
              <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 bg-white border border-[#C8BFB0] rounded-2xl p-6 lg:p-8">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Contact</p>
                  <p className="font-black text-slate-900 tracking-tight mb-1">Besoin d'aide ?</p>
                  <p className="text-slate-500 text-sm">privacy@bookzy.io</p>
                </div>
                <Link href="/legal/confidentialite"
                  className="inline-flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest hover:gap-3 transition-all">
                  Politique de confidentialité <ChevronRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </section>

          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Version actuelle</p>
                <p className="font-black text-slate-900 text-sm mb-5">Mise à jour : Jan. 2026</p>
                <div className="w-full h-px bg-[#E8E2D9] mb-5" />
                <div className="space-y-3">
                  {[
                    { label: "Confidentialité", href: "/legal/confidentialite" },
                    { label: "Remboursement",   href: "/legal/refund" },
                    { label: "CGU / CGV",       href: "/legal/terms" },
                  ].map(l => (
                    <Link key={l.href} href={l.href}
                      className="block text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-[#EDE8E0] border border-[#C8BFB0] rounded-2xl p-5">
                <Clock className="w-4 h-4 text-slate-400 mb-3" />
                <p className="text-[10px] text-slate-500 leading-relaxed italic">
                  Conforme à la directive ePrivacy de l'UE et au RGPD.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}