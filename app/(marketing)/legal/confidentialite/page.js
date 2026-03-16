"use client";

import Link from "next/link";
import {
  ShieldCheck, Lock, Eye, UserCheck,
  Mail, ArrowLeft, ChevronRight, Clock, ExternalLink
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
  { id: "intro",       title: "1. Introduction" },
  { id: "responsable", title: "2. Responsable" },
  { id: "collecte",    title: "3. Données collectées" },
  { id: "finalites",   title: "4. Finalités" },
  { id: "partage",     title: "5. Partage" },
  { id: "droits",      title: "6. Vos droits" },
  { id: "contact",     title: "7. Contact" },
];

export default function PrivacyPolicy() {
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
              <span className="text-slate-400 font-bold"> Legal</span>
            </div>
          </Link>
          <Link href="/" className="inline-flex items-center gap-1.5 text-xs font-black text-slate-500 hover:text-slate-900 uppercase tracking-widest transition-colors">
            <ArrowLeft className="w-3.5 h-3.5" /> Retour
          </Link>
        </div>
      </nav>

      <div className="relative z-10 max-w-6xl mx-auto px-6 py-16 lg:py-24">
        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-400 mb-5">Sommaire</p>
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
                <Lock className="w-4 h-4 text-slate-400 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-2">Protection</p>
                <p className="text-xs text-slate-500 leading-relaxed">
                  Données chiffrées de bout en bout. Conforme au RGPD.
                </p>
              </div>

              <div className="bg-[#EDE8E0] border border-[#C8BFB0] rounded-2xl p-5">
                <Clock className="w-4 h-4 text-slate-400 mb-3" />
                <p className="text-[10px] font-black uppercase tracking-widest text-slate-400 mb-1">Mise à jour</p>
                <p className="text-xs font-bold text-slate-700">Jan. 2026</p>
              </div>
            </div>
          </aside>

          {/* CONTENU */}
          <main className="flex-1 max-w-3xl">

            {/* Header */}
            <div className="mb-14 pb-10 border-b border-[#C8BFB0]">
              <div className="inline-flex items-center gap-2 px-4 py-2 border border-[#C8BFB0] rounded-full bg-white/60 mb-8">
                <Clock className="w-3.5 h-3.5 text-slate-500" />
                <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Mise à jour : Jan. 2026</span>
              </div>
              <h1 className="font-black text-slate-900 tracking-tight leading-[0.92] mb-6" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
                Politique de<br />
                <span className="text-blue-500">Confidentialité.</span>
              </h1>
              <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
                Chez Bookzy, la protection de votre vie privée n'est pas une option. Voici comment nous traitons vos données avec transparence et respect.
              </p>
            </div>

            <div className="space-y-14">

              {/* 1. Intro */}
              <section id="intro" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">01</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Introduction</h2>
                </div>
                <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 text-slate-500 text-sm leading-relaxed">
                  Bookzy s'engage à protéger la confidentialité de vos données personnelles.
                  Cette politique explique comment nous collectons, utilisons et protégeons vos informations
                  conformément au <strong className="text-slate-900">Règlement Général sur la Protection des Données (RGPD)</strong>.
                </div>
              </section>

              {/* 2. Responsable */}
              <section id="responsable" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">02</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Responsable du traitement</h2>
                </div>
                <div className="bg-white border border-[#C8BFB0] rounded-2xl overflow-hidden">
                  {[
                    { label: "Entreprise",           val: "Blinko LLC" },
                    { label: "Siège Social",          val: "Bronx, NY 10454, USA" },
                    { label: "Délégué Protection",    val: "privacy@bookzy.io", link: true },
                  ].map((row, i) => (
                    <div key={i} className={`flex items-center justify-between px-6 py-4 ${i < 2 ? "border-b border-[#E8E2D9]" : ""}`}>
                      <span className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">{row.label}</span>
                      {row.link
                        ? <a href="mailto:privacy@bookzy.io" className="text-sm font-black text-blue-500 hover:text-blue-600 transition-colors">{row.val}</a>
                        : <span className="text-sm font-bold text-slate-900">{row.val}</span>
                      }
                    </div>
                  ))}
                </div>
              </section>

              {/* 3. Collecte */}
              <section id="collecte" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">03</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Données collectées</h2>
                </div>
                <div className="space-y-3">
                  {[
                    { title: "Identité",  desc: "Nom, Email, Photo de profil",           icon: UserCheck },
                    { title: "Paiement",  desc: "Transactions sécurisées (PCI-DSS)",      icon: ShieldCheck },
                    { title: "Technique", desc: "Adresse IP, Navigateur, Session",        icon: Eye },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white border border-[#C8BFB0] rounded-xl hover:border-slate-400 transition-all">
                      <div className="w-9 h-9 bg-[#F5F2ED] border border-[#D6CFC4] rounded-xl flex items-center justify-center flex-shrink-0">
                        <item.icon className="w-4 h-4 text-slate-500" />
                      </div>
                      <div>
                        <p className="font-black text-slate-900 text-sm">{item.title}</p>
                        <p className="text-xs text-slate-500 mt-0.5">{item.desc}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </section>

              {/* 4. Finalités */}
              <section id="finalites" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">04</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Pourquoi vos données ?</h2>
                </div>
                <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 space-y-3">
                  {[
                    "Fourniture du service de génération IA",
                    "Traitement sécurisé des transactions",
                    "Amélioration continue des algorithmes",
                    "Support technique personnalisé",
                  ].map((text, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <span className="w-5 h-5 rounded-full bg-[#F5F2ED] border border-[#C8BFB0] flex items-center justify-center flex-shrink-0">
                        <span className="text-[9px] font-black text-emerald-600">✓</span>
                      </span>
                      <span className="text-sm text-slate-600 font-medium">{text}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* 5. Partage */}
              <section id="partage" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">05</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Partage et vente</h2>
                </div>
                <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                  <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                    style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
                  <div className="absolute top-0 right-0 p-6 opacity-[0.05]">
                    <ShieldCheck size={100} />
                  </div>
                  <div className="relative z-10">
                    <p className="text-[10px] font-black uppercase tracking-[0.25em] text-white/30 mb-4">Engagement</p>
                    <h3 className="text-xl font-black text-white mb-4 tracking-tight">Zéro revente de données</h3>
                    <p className="text-white/50 text-sm leading-relaxed">
                      Nous ne vendons <strong className="text-white">jamais</strong> vos données personnelles à des tiers.
                      Le partage se limite exclusivement aux prestataires techniques indispensables
                      sous contrats de confidentialité stricts.
                    </p>
                  </div>
                </div>
              </section>

              {/* 6. Droits */}
              <section id="droits" className="scroll-mt-24">
                <div className="flex items-center gap-3 mb-5">
                  <span className="w-8 h-8 bg-slate-900 text-white rounded-xl flex items-center justify-center text-[10px] font-black">06</span>
                  <h2 className="text-2xl font-black text-slate-900 tracking-tight">Vos droits fondamentaux</h2>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {["Droit d'accès", "Droit de suppression", "Portabilité des données", "Droit d'opposition"].map((droit, i) => (
                    <div key={i} className="flex items-center justify-between p-4 bg-white border border-[#C8BFB0] rounded-xl hover:border-slate-400 transition-all group cursor-pointer">
                      <span className="text-sm font-bold text-slate-700">{droit}</span>
                      <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-slate-900 group-hover:translate-x-0.5 transition-all" />
                    </div>
                  ))}
                </div>
              </section>

              {/* 7. Contact */}
              <section id="contact" className="scroll-mt-24">
                <div className="w-full h-px bg-[#C8BFB0] mb-8" />
                <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 hover:border-slate-400 transition-all">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">DPO</p>
                    <p className="font-black text-slate-900 text-xl tracking-tight mb-1">Une question ?</p>
                    <p className="text-slate-500 text-sm">Notre équipe vous répond sous 48h.</p>
                  </div>
                  <a href="mailto:privacy@bookzy.io"
                    className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all flex-shrink-0">
                    <Mail className="w-3.5 h-3.5" /> privacy@bookzy.io
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
              { label: "CGU", href: "/legal/terms" },
              { label: "Cookies", href: "/legal/cookies" },
              { label: "Remboursement", href: "/legal/refund" },
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