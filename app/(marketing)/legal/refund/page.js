"use client";

import Link from "next/link";
import {
  RefreshCcw, ShieldCheck, XCircle, CheckCircle2,
  HelpCircle, Mail, ArrowLeft, FileText,
  Smartphone, Layout, Clock, Wallet, Coins
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

export default function RefundPolicy() {
  return (
    <div className="min-h-screen font-sans" style={{ background: "#F5F2ED" }}>

      {/* Grain global */}
      <div className="fixed inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      {/* NAV */}
      <nav className="sticky top-0 z-50 bg-[#F5F2ED]/90 backdrop-blur-md border-b border-[#C8BFB0]"
        style={{ paddingTop: "env(safe-area-inset-top, 0px)" }}>
        <div className="max-w-6xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2.5 group">
            <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center">
              <BookOpenSVG className="w-4 h-4 text-white" />
            </div>
            <div>
              <span className="font-black text-slate-900 tracking-tight">Bookzy</span>
              <span className="text-slate-400 font-bold"> Refund</span>
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
            <ShieldCheck className="w-3.5 h-3.5 text-slate-500" />
            <span className="text-[10px] font-black uppercase tracking-[0.25em] text-slate-500">Garantie de Service</span>
          </div>
          <h1 className="font-black text-slate-900 tracking-tight leading-[0.92] mb-6" style={{ fontSize: "clamp(2.5rem, 7vw, 5rem)" }}>
            Transparence sur<br />
            <span className="text-blue-500">nos remboursements.</span>
          </h1>
          <p className="text-lg text-slate-500 leading-relaxed max-w-xl">
            Notre priorité est votre succès. Bookzy fonctionne avec un système de crédits.
            En cas de problème avéré, nous remboursons les <strong className="text-slate-900">crédits utilisés</strong> directement sur votre compte , pas l'argent de votre achat initial.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-12 lg:gap-16">

          {/* CONTENU PRINCIPAL */}
          <div className="flex-1 max-w-4xl space-y-16">

            {/* 1. COMMENT ÇA MARCHE */}
            <section id="credits">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Comprendre le système</p>
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">1. Remboursement en crédits</h2>
              <div className="bg-slate-900 rounded-2xl p-6 lg:p-8 relative overflow-hidden">
                <div className="absolute inset-0 opacity-[0.06] pointer-events-none"
                  style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
                <div className="relative z-10">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-white/30 mb-6">Principe important</p>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
                    {[
                      { icon: Coins, t: "Crédits remboursés", d: "Pas l'argent payé pour les crédits" },
                      { icon: RefreshCcw, t: "Remise immédiate", d: "Les crédits reviennent sur votre compte" },
                      { icon: FileText, t: "Après enquête", d: "Vérification du problème signalé" },
                      { icon: CheckCircle2, t: "Si vous avez raison", d: "Crédits restitués intégralement" },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-xl border border-white/10">
                        <item.icon className="w-5 h-5 text-blue-400 flex-shrink-0" />
                        <div>
                          <p className="font-black text-white text-sm">{item.t}</p>
                          <p className="text-[10px] text-white/40 font-bold uppercase tracking-widest mt-0.5">{item.d}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                  <div className="bg-white/5 border border-white/10 rounded-xl p-4">
                    <p className="text-white/60 text-sm leading-relaxed">
                      Exemple : vous avez acheté 330 crédits pour 19 125 FCFA et utilisé 20 crédits pour générer un ebook défectueux.
                      Après enquête favorable, nous restituons les <strong className="text-white">20 crédits</strong> sur votre solde.
                      L'argent des 19 125 FCFA ne fait pas l'objet d'un remboursement monétaire.
                    </p>
                  </div>
                </div>
              </div>
            </section>

            {/* 2. CONDITIONS */}
            <section id="conditions">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Éligibilité</p>
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">2. Conditions de remboursement</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-5">

                {/* ÉLIGIBLE */}
                <div className="bg-white border border-[#C8BFB0] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-500" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Crédits remboursés</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {[
                      "Échec technique de génération prouvé",
                      "Fichiers corrompus ou illisibles",
                      "Double débit de crédits par erreur système",
                      "Demande soumise sous 48h après le problème",
                    ].map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 flex-shrink-0 mt-1.5" />
                        <span className="text-sm text-slate-600 font-medium">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

                {/* REFUSÉ */}
                <div className="bg-white border border-[#C8BFB0] rounded-2xl overflow-hidden">
                  <div className="px-6 py-4 border-b border-[#E8E2D9] flex items-center gap-2">
                    <XCircle className="w-4 h-4 text-red-400" />
                    <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400">Crédits non remboursés</p>
                  </div>
                  <div className="p-6 space-y-3">
                    {[
                      "Génération réussie et PDF téléchargé",
                      "Insatisfaction subjective du style ou du contenu",
                      "Changement d'avis après génération",
                      "Erreur de sujet ou de titre saisie par l'utilisateur",
                    ].map((t, i) => (
                      <div key={i} className="flex items-start gap-3">
                        <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0 mt-1.5" />
                        <span className="text-sm text-slate-600 font-medium">{t}</span>
                      </div>
                    ))}
                  </div>
                </div>

              </div>

              {/* Note importante */}
              <div className="mt-5 bg-amber-50 border border-amber-200 rounded-2xl p-5 flex items-start gap-3">
                <ShieldCheck className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
                <p className="text-sm text-amber-800 leading-relaxed">
                  <strong>Important :</strong> L'achat de crédits (Pass Solo, Pack Créateur, Pack Agence) ne fait en aucun cas l'objet d'un remboursement monétaire. Les crédits non utilisés restent valables indéfiniment sur votre compte.
                </p>
              </div>
            </section>

            {/* 3. PROCÉDURE */}
            <section id="delais">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Procédure</p>
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">3. Délais et étapes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {[
                  { icon: Clock,  num: "01", t: "48 Heures", d: "Pour soumettre votre demande après le problème" },
                  { icon: Mail,   num: "02", t: "48 Heures", d: "Temps moyen de réponse et d'enquête" },
                  { icon: Coins,  num: "03", t: "Immédiat",  d: "Crédits remis sur votre solde si éligible" },
                ].map((item, i) => (
                  <div key={i} className="bg-white border border-[#C8BFB0] rounded-2xl p-6 hover:border-slate-400 transition-all">
                    <div className="flex items-center justify-between mb-5">
                      <span className="text-[10px] font-black text-slate-300 uppercase tracking-widest">{item.num}</span>
                      <item.icon className="w-4 h-4 text-slate-300" />
                    </div>
                    <p className="text-2xl font-black text-slate-900 mb-1">{item.t}</p>
                    <p className="text-xs text-slate-500 leading-relaxed">{item.d}</p>
                  </div>
                ))}
              </div>
            </section>

            {/* 4. ALTERNATIVE */}
            <section id="alternative">
              <p className="text-[10px] font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Alternative rapide</p>
              <h2 className="text-3xl font-black text-slate-900 mb-8 tracking-tight">4. Relance gratuite</h2>
              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 lg:p-8 flex flex-col md:flex-row items-start gap-6 hover:border-slate-400 transition-all">
                <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center flex-shrink-0">
                  <RefreshCcw className="w-5 h-5 text-white" />
                </div>
                <div>
                  <p className="font-black text-slate-900 text-lg mb-2 tracking-tight">Régénération sans frais de crédits</p>
                  <p className="text-slate-500 text-sm leading-relaxed">
                    Si votre ebook présente un défaut technique avéré, nous relançons la génération <strong className="text-slate-900">immédiatement et gratuitement</strong>, sans déduire de crédits supplémentaires. C'est l'option la plus rapide pour obtenir votre produit final.
                  </p>
                </div>
              </div>
            </section>

            {/* CONTACT */}
            <section className="pt-4">
              <div className="w-full h-px bg-[#C8BFB0] mb-10" />
              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 lg:p-8 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                <div>
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-2">Support</p>
                  <p className="font-black text-slate-900 text-xl tracking-tight mb-1">Besoin d'aide ?</p>
                  <p className="text-slate-500 text-sm">Contactez notre équipe support.</p>
                </div>
                <a href="mailto:support@bookzy.io"
                  className="inline-flex items-center gap-2 px-6 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-black rounded-xl text-xs uppercase tracking-widest transition-all flex-shrink-0">
                  <Mail className="w-3.5 h-3.5" />
                  support@bookzy.io
                </a>
              </div>
            </section>

          </div>

          {/* SIDEBAR */}
          <aside className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24 space-y-4">
              <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6">
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Juridique</p>
                <p className="font-black text-slate-900 text-sm mb-5">Mise à jour : Jan. 2026</p>
                <div className="w-full h-px bg-[#E8E2D9] mb-5" />
                <div className="space-y-3">
                  {[
                    { label: "Confidentialité", href: "/legal/confidentialite" },
                    { label: "Cookies", href: "/legal/cookies" },
                    { label: "CGU / CGV", href: "/legal/terms" },
                  ].map(l => (
                    <Link key={l.href} href={l.href}
                      className="block text-xs font-bold text-slate-500 hover:text-slate-900 transition-colors uppercase tracking-widest">
                      {l.label}
                    </Link>
                  ))}
                </div>
              </div>

              <div className="bg-amber-50 border border-amber-200 rounded-2xl p-5">
                <Coins className="w-5 h-5 text-amber-600 mb-3" />
                <p className="text-xs font-black text-amber-900 uppercase tracking-widest mb-2">Rappel</p>
                <p className="text-xs text-amber-800 leading-relaxed">
                  Nous remboursons les <strong>crédits</strong>, pas l'argent. Les crédits n'expirent jamais.
                </p>
              </div>
            </div>
          </aside>

        </div>
      </div>
    </div>
  );
}