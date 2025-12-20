"use client";

import Link from "next/link";
import { 
  RefreshCcw, 
  ShieldCheck, 
  XCircle, 
  CheckCircle2, 
  HelpCircle, 
  Mail, 
  ArrowLeft,
  FileText,
  Smartphone,
  Layout,
  Clock,
  Wallet
} from "lucide-react";

export default function RefundPolicy() {
  
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-red-50">
      
      {/* --- MINI HEADER --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105">
                <RefreshCcw className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-slate-900">Bookzy <span className="text-slate-400 font-medium">Refund</span></span>
          </Link>
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-3xl mb-16">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-50 text-red-700 text-[10px] font-bold uppercase tracking-wider mb-6">
                <ShieldCheck className="w-3 h-3" /> Garantie de Service
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                Transparence sur <br /><span className="text-red-600">nos remboursements.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
                Notre priorité est votre succès. En raison de la nature numérique instantanée 
                de nos produits (IA), voici les règles qui encadrent nos services.
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          <div className="flex-1 max-w-4xl space-y-20">
            
            {/* 1. OFFRE COMPLÈTE */}
            <section id="offre">
                <h2 className="text-2xl font-black text-slate-900 mb-6">1. Ce que comprend votre achat</h2>
                <div className="p-8 bg-slate-900 rounded-[32px] text-white">
                    <p className="text-slate-400 text-sm font-bold mb-6 uppercase tracking-widest">Le Pack Bookzy à 2 000 FCFA :</p>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {[
                            { icon: FileText, t: "Ebook Pro PDF", d: "Design & Contenu IA" },
                            { icon: Layout, t: "Page de Vente", d: "Copywriting complet" },
                            { icon: Smartphone, t: "Pack Réseaux", d: "Facebook & WhatsApp" },
                            { icon: CheckCircle2, t: "Prêt à l'emploi", d: "Téléchargement immédiat" }
                        ].map((item, i) => (
                            <div key={i} className="flex items-center gap-4 p-4 bg-white/5 rounded-2xl border border-white/10">
                                <item.icon className="w-5 h-5 text-red-400" />
                                <div>
                                    <p className="font-bold text-sm">{item.t}</p>
                                    <p className="text-[10px] text-slate-400 font-medium">{item.d}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </section>

            {/* 2. CONDITIONS (VERTS / ROUGE) */}
            <section id="conditions">
                <h2 className="text-2xl font-black text-slate-900 mb-8">2. Conditions de remboursement</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {/* ÉLIGIBLE */}
                    <div className="p-8 bg-emerald-50/50 border border-emerald-100 rounded-[32px]">
                        <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-xl flex items-center justify-center mb-6">
                            <CheckCircle2 className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-black text-emerald-900 mb-4">Remboursement accepté</h3>
                        <ul className="space-y-3">
                            {["Échec technique de génération", "Double facturation système", "Fichiers corrompus/illisibles", "Demande sous 24h avant téléchargement"].map((t, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-emerald-700 font-semibold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-emerald-400 mt-1.5 flex-shrink-0"></div>
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* REFUSÉ */}
                    <div className="p-8 bg-red-50/50 border border-red-100 rounded-[32px]">
                        <div className="w-10 h-10 bg-red-100 text-red-600 rounded-xl flex items-center justify-center mb-6">
                            <XCircle className="w-6 h-6" />
                        </div>
                        <h3 className="text-lg font-black text-red-900 mb-4">Remboursement refusé</h3>
                        <ul className="space-y-3">
                            {["Génération réussie", "Insatisfaction subjective du style", "Changement d'avis après téléchargement", "Erreur de titre/sujet par l'utilisateur"].map((t, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-red-700 font-semibold">
                                    <div className="w-1.5 h-1.5 rounded-full bg-red-400 mt-1.5 flex-shrink-0"></div>
                                    {t}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>
            </section>

            {/* 3. DÉLAIS (TIMELINE) */}
            <section id="delais">
                <h2 className="text-2xl font-black text-slate-900 mb-8">3. Délais et Procédure</h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { icon: Clock, t: "24 Heures", d: "Pour soumettre votre demande" },
                        { icon: Mail, t: "48 Heures", d: "Temps moyen de réponse" },
                        { icon: Wallet, t: "3 à 7 Jours", d: "Remboursement effectif" }
                    ].map((item, i) => (
                        <div key={i} className="p-6 bg-white border border-slate-100 rounded-3xl text-center">
                            <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-full flex items-center justify-center mx-auto mb-4">
                                <item.icon className="w-5 h-5" />
                            </div>
                            <p className="font-black text-slate-900 mb-1">{item.t}</p>
                            <p className="text-xs text-slate-500 font-medium">{item.d}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* 4. ALTERNATIVE */}
            <section id="alternative">
                <div className="p-10 bg-indigo-50 rounded-[40px] border border-indigo-100 flex flex-col md:flex-row items-center gap-8">
                    <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center flex-shrink-0 shadow-lg shadow-indigo-200">
                        <RefreshCcw className="w-8 h-8 text-white" />
                    </div>
                    <div>
                        <h3 className="text-xl font-bold text-indigo-900 mb-2">Relance gratuite de génération</h3>
                        <p className="text-indigo-700 font-medium leading-relaxed">
                            Si votre ebook présente un défaut technique, nous relançons la génération 
                            immédiatement et <strong>gratuitement</strong>. C'est l'option la plus rapide pour obtenir votre produit.
                        </p>
                    </div>
                </div>
            </section>

            {/* CONTACT */}
            <section className="pt-12 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-center gap-8 p-10 bg-slate-50 rounded-[32px]">
                    <div>
                        <p className="text-xl font-black text-slate-900 mb-2">Besoin d'aide ?</p>
                        <p className="text-slate-500 font-medium">Contactez notre support client dédié.</p>
                    </div>
                    <a 
                      href="mailto:support@bookzy.io" 
                      className="px-8 py-4 bg-slate-900 text-white rounded-2xl font-black shadow-xl hover:scale-105 transition-transform"
                    >
                        support@bookzy.io
                    </a>
                </div>
            </section>

          </div>

          {/* --- SIDEBAR --- */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-fit">
              <div className="p-8 bg-white border border-slate-100 rounded-[32px] shadow-sm">
                  <HelpCircle className="w-6 h-6 text-slate-300 mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Juridique</p>
                  <p className="text-sm font-black text-slate-900 mb-6">Mise à jour : Nov. 2024</p>
                  
                  <div className="space-y-4 pt-6 border-t border-slate-50">
                      <Link href="/legal/confidentialite" className="text-xs font-bold text-slate-500 hover:text-slate-900 block">Politique de confidentialité</Link>
                      <Link href="/legal/cookies" className="text-xs font-bold text-slate-500 hover:text-slate-900 block">Gestion des cookies</Link>
                  </div>
              </div>
          </aside>

        </div>
      </div>
    </div>
  );
}