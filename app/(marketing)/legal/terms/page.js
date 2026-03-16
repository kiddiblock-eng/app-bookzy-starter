"use client";

import Link from "next/link";
import {
  Scale, ShieldCheck, UserPlus, Ban, Globe,
  Copyright, CreditCard, AlertTriangle,
  ArrowLeft, ChevronRight, Clock, Briefcase
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

const sections = [
  { id: "acceptation",    title: "1. Acceptation" },
  { id: "description",   title: "2. Le Service" },
  { id: "compte",        title: "3. Votre Compte" },
  { id: "propriete",     title: "4. Propriété" },
  { id: "paiement",      title: "5. Tarification" },
  { id: "responsabilite",title: "6. Limitations" },
  { id: "contact",       title: "7. Juridique" },
];

export default function TermsOfService() {
  const scrollTo = (id) => {
    document.getElementById(id)?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

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
              <span className="text-slate-400 font-bold"> Terms</span>
            </div>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Accueil
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5">Navigation</p>
                <ul className="space-y-3">
                  {sections.map(s => (
                    <li key={s.id}>
                      <button onClick={() => scrollTo(s.id)}
                        className="flex items-center gap-2.5 text-xs font-bold text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors group w-full text-left">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#C8BFB0] group-hover:bg-slate-900 flex-shrink-0 transition-colors" />
                        {s.title}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-5">
                <ShieldCheck className="w-4 h-4 text-slate-400 mb-3" />
                <p className="text-xs text-slate-500 leading-relaxed">
                  Contrat d'utilisation conforme aux standards de l'économie numérique.
                </p>
              </div>

              <div className="bg-[#EDE8E0] border border-[#C8BFB0] rounded-2xl p-5">
                <Clock className="w-4 h-4 text-slate-400 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Version</p>
                <p className="text-xs font-bold text-slate-700">1.2 · Jan. 2026</p>
              </div>
            </div>
          </aside>

          {/* CONTENU */}
          <main className="flex-1 max-w-3xl">

            {/* Header */}
            <div className="mb-14 pb-10 border-b border-[#C8BFB0]">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C8BFB0] rounded-full bg-white/60 mb-8">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Version 1.2 · Jan. 2026</span>
              </div>
              <h1 className="font-black text-slate-900 tracking-tight leading-[0.92] mb-6" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
                Conditions Générales<br />
                <span className="text-blue-500">d'Utilisation.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
                En utilisant la plateforme Bookzy, vous acceptez sans réserve les conditions régissant l'accès et l'utilisation de nos services de création automatisée.
              </p>
            </div>

            <div className="space-y-14">

              {/* 1. Acceptation */}
              <section id="acceptation" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">01</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Acceptation</h2>
                </div>
                <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 text-slate-500 text-sm leading-relaxed">
                  L'utilisation de Bookzy implique l'acceptation pleine et entière des présentes CGU.
                  Si vous agissez pour le compte d'une entreprise, vous garantissez avoir le pouvoir d'engager celle-ci.
                </div>
              </section>

              {/* 2. Service */}
              <section id="description" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">02</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Le Service Bookzy</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    "Génération d'ebooks via IA",
                    "Création de couvertures 3D",
                    "Packs marketing publicitaires",
                    "Analyseur de niches rentables",
                    "Smart Shop (boutique en ligne)",
                    "Youbook (conversion YouTube)",
                  ].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 p-4 bg-white border border-[#C8BFB0] rounded-xl hover:border-slate-400 transition-all">
                      <ChevronRight className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
                      <span className="text-sm font-bold text-slate-700">{feature}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Compte */}
              <section id="compte" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">03</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Compte et Sécurité</h2>
                </div>
                <div className="space-y-3">
                  <div className="flex items-start gap-4 p-5 bg-white border border-[#C8BFB0] rounded-xl hover:border-slate-400 transition-all">
                    <div className="w-9 h-9 bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl flex items-center justify-center flex-shrink-0">
                      <UserPlus className="w-4 h-4 text-slate-500" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm mb-1">Âge requis</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Vous certifiez être majeur (18+ ans) pour accéder aux services payants.</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4 p-5 bg-white border border-[#C8BFB0] rounded-xl hover:border-slate-400 transition-all">
                    <div className="w-9 h-9 bg-red-50 border border-red-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Ban className="w-4 h-4 text-red-400" />
                    </div>
                    <div>
                      <p className="font-black text-slate-900 text-sm mb-1">Usages interdits</p>
                      <p className="text-xs text-slate-500 leading-relaxed">Toute tentative de reverse engineering, de scraping ou d'utilisation de bots entraînera la suppression immédiate du compte.</p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 4. Propriété */}
              <section id="propriete" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">04</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Propriété Intellectuelle</h2>
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-6">
                      <Copyright className="w-4 h-4 text-amber-400" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Qui possède quoi ?</p>
                    </div>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <span className="text-white/50 text-sm">Contenu généré (Ebook, Ads)</span>
                        <span className="bg-emerald-500/20 border border-emerald-500/30 text-emerald-400 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Vous</span>
                      </div>
                      <div className="flex items-center justify-between pb-4 border-b border-white/10">
                        <span className="text-white/50 text-sm">Algorithmes et Code Source</span>
                        <span className="bg-white/10 border border-white/10 text-white/60 text-[9px] px-3 py-1 rounded-full font-black uppercase tracking-widest">Bookzy</span>
                      </div>
                      <p className="text-white/30 text-xs leading-relaxed italic">
                        Vous disposez d'un droit d'exploitation commerciale totale sur les fichiers finaux générés par votre compte.
                      </p>
                    </div>
                  </div>
                </div>
              </section>

              {/* 5. Paiement */}
              <section id="paiement" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">05</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Paiement et Facturation</h2>
                </div>
                <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 flex flex-col md:flex-row gap-6 items-start md:items-center hover:border-slate-400 transition-all">
                  <div className="w-10 h-10 bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl flex items-center justify-center flex-shrink-0">
                    <CreditCard className="w-5 h-5 text-slate-500" />
                  </div>
                  <div className="flex-1">
                    <p className="text-slate-600 text-sm leading-relaxed mb-3">
                      Bookzy fonctionne sur un système de crédits. Les prix sont affichés en FCFA (XOF).
                      La facturation est traitée par des processeurs sécurisés (Mobile Money, Wave, Orange Money).
                    </p>
                    <Link href="/legal/refund" className="inline-flex items-center gap-1.5 text-xs font-black text-slate-900 uppercase tracking-widest hover:gap-2.5 transition-all">
                      Politique de Remboursement <ChevronRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </section>

              {/* 6. Responsabilité */}
              <section id="responsabilite" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">06</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Garanties et Responsabilité</h2>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div className="p-5 bg-amber-50 border border-amber-200 rounded-xl">
                    <AlertTriangle className="w-4 h-4 text-amber-600 mb-3" />
                    <p className="font-black text-amber-900 text-sm mb-2">Service "As-Is"</p>
                    <p className="text-xs text-amber-700 leading-relaxed">
                      Bookzy fournit des outils d'IA. La qualité finale dépend des instructions de l'utilisateur. Nous ne garantissons pas de succès commercial automatique.
                    </p>
                  </div>
                  <div className="p-5 bg-white border border-[#C8BFB0] rounded-xl hover:border-slate-400 transition-all">
                    <Briefcase className="w-4 h-4 text-slate-400 mb-3" />
                    <p className="font-black text-slate-900 text-sm mb-2">Usage légal</p>
                    <p className="text-xs text-slate-500 leading-relaxed">
                      L'utilisateur est seul responsable de la vérification des droits d'auteur sur les titres ou sujets qu'il choisit de traiter.
                    </p>
                  </div>
                </div>
              </section>

              {/* 7. Contact */}
              <section id="contact" className="scroll-mt-24">
                <div className="w-full h-px bg-[#C8BFB0] mb-8" />
                <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
                  <div className="relative z-10">
                    <div className="flex items-center gap-2 mb-2">
                      <Globe className="w-4 h-4 text-blue-400" />
                      <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30">Contact légal</p>
                    </div>
                    <p className="font-black text-white text-xl tracking-tight mb-1">Une question ?</p>
                    <p className="text-white/40 text-sm">Notre équipe légale vous répond sous 48h.</p>
                  </div>
                  <a href="mailto:legal@bookzy.io"
                    className="relative z-10 inline-flex items-center gap-2 px-6 py-3.5 bg-white hover:bg-slate-100 text-slate-900 font-black rounded-xl text-xs uppercase tracking-widest transition-all flex-shrink-0">
                    legal@bookzy.io
                  </a>
                </div>
              </section>

            </div>
          </main>

        </div>
      </div>

      {/* Footer */}
      <footer className="relative border-t border-[#C8BFB0] mt-16" style={{ background: "#EDE8E0" }}>
        <div className="absolute inset-0 opacity-[0.035] pointer-events-none"
          style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
        <div className="relative z-10 max-w-6xl mx-auto px-6 py-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-slate-400">© 2026 Bookzy Inc. Tous droits réservés.</p>
          <div className="flex gap-6">
            {[
              { label: "Confidentialité", href: "/legal/confidentialite" },
              { label: "Cookies",         href: "/legal/cookies" },
              { label: "Remboursement",   href: "/legal/refund" },
            ].map(l => (
              <Link key={l.href} href={l.href} className="text-[10px] font-bold uppercase tracking-widest text-slate-400 hover:text-slate-900 transition-colors">
                {l.label}
              </Link>
            ))}
          </div>
        </div>
      </footer>
    </div>
  );
}