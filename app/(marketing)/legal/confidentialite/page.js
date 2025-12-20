"use client";

import Link from "next/link";
import { 
  ShieldCheck, 
  Lock, 
  Eye, 
  UserCheck, 
  Mail, 
  ArrowLeft,
  ChevronRight,
  Clock,
  ExternalLink
} from "lucide-react";

const sections = [
  { id: "intro", title: "1. Introduction" },
  { id: "responsable", title: "2. Responsable" },
  { id: "collecte", title: "3. Données collectées" },
  { id: "finalites", title: "4. Finalités" },
  { id: "partage", title: "5. Partage" },
  { id: "securite", title: "6. Sécurité" },
  { id: "droits", title: "7. Vos droits" },
  { id: "contact", title: "8. Contact" },
];

export default function PrivacyPolicy() {
  
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      const offset = 100;
      const elementPosition = element.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - offset;
      window.scrollTo({ top: offsetPosition, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-indigo-100">
      
      {/* --- MINI HEADER --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105">
                <ShieldCheck className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-slate-900">Bookzy <span className="text-slate-400 font-medium">Legal</span></span>
          </Link>
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- SOMMAIRE (SIDEBAR) --- */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-32 h-fit">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6">Sommaire</p>
            <ul className="space-y-4">
              {sections.map((s) => (
                <li key={s.id}>
                  <button 
                    onClick={() => scrollTo(s.id)}
                    className="text-sm font-semibold text-slate-500 hover:text-indigo-600 flex items-center gap-2 transition-colors group"
                  >
                    <div className="w-1.5 h-1.5 rounded-full bg-slate-200 group-hover:bg-indigo-600 transition-colors"></div>
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-12 p-6 bg-slate-50 rounded-2xl border border-slate-100">
               <Lock className="w-5 h-5 text-slate-400 mb-3" />
               <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Vos données sont protégées par le chiffrement de bout en bout conforme au RGPD.
               </p>
            </div>
          </aside>

          {/* --- CONTENU PRINCIPAL --- */}
          <main className="flex-1 max-w-3xl">
            
            {/* Header Content */}
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-50 text-indigo-700 text-[10px] font-bold uppercase tracking-wider mb-6">
                <Clock className="w-3 h-3" /> Mise à jour : 26 Nov. 2024
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6">
                Politique de <br /><span className="text-indigo-600">Confidentialité</span>
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                Chez Bookzy, la protection de votre vie privée n'est pas une option. 
                Voici comment nous traitons vos données avec transparence et respect.
              </p>
            </div>

            <div className="prose prose-slate prose-lg max-w-none">
              
              <section id="intro" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-sm">01</div>
                   Introduction
                </h2>
                <p className="text-slate-600 font-medium leading-relaxed">
                  Bookzy s'engage à protéger la confidentialité de vos données personnelles. 
                  Cette politique explique comment nous collectons, utilisons et protégeons vos informations 
                  conformément au <strong>Règlement Général sur la Protection des Données (RGPD)</strong>.
                </p>
              </section>

              <section id="responsable" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-sm">02</div>
                   Responsable du traitement
                </h2>
                <div className="p-8 bg-white border border-slate-200 rounded-3xl shadow-sm space-y-4">
                   <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                      <span className="text-sm font-bold text-slate-400">Entreprise</span>
                      <span className="text-sm font-bold text-slate-900">Blinko LLC</span>
                   </div>
                   <div className="flex justify-between items-center border-b border-slate-50 pb-4">
                      <span className="text-sm font-bold text-slate-400">Siège Social</span>
                      <span className="text-sm font-bold text-slate-900 text-right">Bronx, NY 10454, USA</span>
                   </div>
                   <div className="flex justify-between items-center">
                      <span className="text-sm font-bold text-slate-400">Délégué Protection</span>
                      <span className="text-sm font-bold text-indigo-600 underline">privacy@bookzy.io</span>
                   </div>
                </div>
              </section>

              <section id="collecte" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-sm">03</div>
                   Données collectées
                </h2>
                <div className="grid gap-4">
                   {[
                     { title: "Identité", desc: "Nom, Email, Photo de profil", icon: UserCheck, color: "blue" },
                     { title: "Paiement", desc: "Transactions sécurisées (PCI-DSS)", icon: ShieldCheck, color: "green" },
                     { title: "Technique", desc: "Adresse IP, Navigateur, Session", icon: Eye, color: "indigo" }
                   ].map((item, i) => (
                      <div key={i} className="flex items-center gap-6 p-6 rounded-2xl bg-white border border-slate-100 hover:border-indigo-100 transition-colors">
                         <div className={`w-12 h-12 rounded-xl bg-${item.color}-50 text-${item.color}-600 flex items-center justify-center flex-shrink-0`}>
                            <item.icon className="w-6 h-6" />
                         </div>
                         <div>
                            <h4 className="font-bold text-slate-900 text-base">{item.title}</h4>
                            <p className="text-sm text-slate-500 font-medium">{item.desc}</p>
                         </div>
                      </div>
                   ))}
                </div>
              </section>

              <section id="finalites" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-3">
                   <div className="w-8 h-8 rounded-lg bg-slate-100 flex items-center justify-center text-slate-900 text-sm">04</div>
                   Pourquoi vos données ?
                </h2>
                <ul className="space-y-4">
                   {["Fourniture du service de génération IA", "Traitement sécurisé des transactions", "Amélioration continue des algorithmes", "Support technique personnalisé"].map((text, i) => (
                      <li key={i} className="flex items-center gap-3 text-slate-600 font-medium">
                         <div className="w-5 h-5 rounded-full bg-green-50 text-green-600 flex items-center justify-center flex-shrink-0">
                            <span className="text-[10px] font-bold">✓</span>
                         </div>
                         {text}
                      </li>
                   ))}
                </ul>
              </section>

              <section id="partage" className="mb-16 scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6">Partage et Vente</h2>
                <div className="p-8 bg-indigo-900 rounded-3xl text-white relative overflow-hidden">
                   <div className="absolute top-0 right-0 p-8 opacity-10">
                      <ShieldCheck size={120} />
                   </div>
                   <h3 className="text-xl font-bold mb-4 relative z-10">Engagement Zéro Revente</h3>
                   <p className="text-indigo-100 leading-relaxed font-medium relative z-10">
                      Nous ne vendons <strong>JAMAIS</strong> vos données personnelles à des tiers. 
                      Le partage de données se limite exclusivement aux prestataires techniques indispensables 
                      (Hébergeur, Processeur de paiement) sous contrats de confidentialité stricts.
                   </p>
                </div>
              </section>

              <section id="droits" className="mb-16 scroll-mt-32">
                 <h2 className="text-2xl font-black text-slate-900 mb-6">Vos droits fondamentaux</h2>
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {["Droit d'accès", "Droit de suppression", "Portabilité des données", "Droit d'opposition"].map((droit, i) => (
                      <div key={i} className="p-5 rounded-2xl border border-slate-100 flex items-center justify-between group hover:bg-slate-50 transition-all cursor-pointer">
                         <span className="font-bold text-slate-700">{droit}</span>
                         <ChevronRight className="w-4 h-4 text-slate-300 group-hover:text-indigo-600 transition-colors" />
                      </div>
                    ))}
                 </div>
              </section>

              <section id="contact" className="mb-16 scroll-mt-32 p-8 rounded-3xl bg-slate-900 text-white">
                 <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
                    <div>
                       <h3 className="text-2xl font-bold mb-2">Une question ?</h3>
                       <p className="text-slate-400 font-medium">Notre équipe DPO vous répond sous 48h.</p>
                    </div>
                    <a 
                      href="mailto:privacy@bookzy.io" 
                      className="inline-flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-500 rounded-xl font-bold transition-all"
                    >
                       <Mail className="w-4 h-4" /> Nous écrire
                    </a>
                 </div>
              </section>

            </div>
          </main>
        </div>
      </div>
      
      {/* Footer minimal */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-sm text-slate-400 font-medium">© 2024 Bookzy - Tous droits réservés.</p>
           <div className="flex gap-8">
              <Link href="/legal/cgu" className="text-sm font-bold text-slate-500 hover:text-slate-900">CGU</Link>
              <Link href="/legal/mentions" className="text-sm font-bold text-slate-500 hover:text-slate-900">Mentions Légales</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}