"use client";

import Link from "next/link";
import { 
  Scale, 
  ShieldCheck, 
  UserPlus, 
  Ban, 
  Globe, 
  Copyright, 
  CreditCard, 
  AlertTriangle,
  ArrowLeft,
  ChevronRight,
  Clock,
  Briefcase
} from "lucide-react";

const sections = [
  { id: "acceptation", title: "1. Acceptation" },
  { id: "description", title: "2. Le Service" },
  { id: "compte", title: "3. Votre Compte" },
  { id: "propriete", title: "4. Propriété" },
  { id: "paiement", title: "5. Tarification" },
  { id: "responsabilite", title: "6. Limitations" },
  { id: "contact", title: "7. Juridique" },
];

export default function TermsOfService() {
  
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-slate-900 selection:text-white">
      
      {/* --- MINI HEADER --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105">
                <Scale className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-slate-900">Bookzy <span className="text-slate-400 font-medium">Terms</span></span>
          </Link>
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Accueil
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- NAVIGATION LÉGALE (SIDEBAR) --- */}
          <aside className="hidden lg:block w-64 flex-shrink-0 sticky top-32 h-fit">
            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-6 text-center lg:text-left">Navigation</p>
            <ul className="space-y-4">
              {sections.map((s) => (
                <li key={s.id}>
                  <button 
                    onClick={() => scrollTo(s.id)}
                    className="text-sm font-semibold text-slate-500 hover:text-slate-900 flex items-center gap-3 transition-colors group"
                  >
                    <div className="h-px w-4 bg-slate-200 group-hover:w-6 group-hover:bg-slate-900 transition-all"></div>
                    {s.title}
                  </button>
                </li>
              ))}
            </ul>
            <div className="mt-12 p-6 bg-slate-50 rounded-3xl border border-slate-100">
               <ShieldCheck className="w-5 h-5 text-slate-400 mb-3" />
               <p className="text-xs text-slate-500 leading-relaxed font-medium">
                  Contrat d'utilisation conforme aux standards de l'économie numérique.
               </p>
            </div>
          </aside>

          {/* --- CONTENU PRINCIPAL --- */}
          <main className="flex-1 max-w-3xl">
            
            <div className="mb-16">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-slate-100 text-slate-700 text-[10px] font-bold uppercase tracking-wider mb-6">
                <Clock className="w-3 h-3" /> Version 1.2 • 26 Nov. 2024
              </div>
              <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-8 leading-tight">
                Conditions Générales <br /> d'Utilisation.
              </h1>
              <p className="text-xl text-slate-500 leading-relaxed font-medium">
                En utilisant la plateforme Bookzy, vous acceptez sans réserve les conditions régissant 
                l'accès et l'utilisation de nos services de création automatisée.
              </p>
            </div>

            <div className="space-y-20">
              
              {/* SECTION 1 */}
              <section id="acceptation" className="scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm shadow-lg">01</div>
                   Acceptation
                </h2>
                <div className="p-8 bg-white border border-slate-200 rounded-3xl text-slate-600 font-medium leading-relaxed">
                    L'utilisation de Bookzy implique l'acceptation pleine et entière des présentes CGU. 
                    Si vous agissez pour le compte d'une entreprise, vous garantissez avoir le pouvoir d'engager 
                    celle-ci.
                </div>
              </section>

              {/* SECTION 2 */}
              <section id="description" className="scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm shadow-lg">02</div>
                   Le Service Bookzy
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {[
                        "Génération d'ebooks via IA",
                        "Création de couvertures 3D",
                        "Packs marketing publicitaires",
                        "Analyseur de niches rentables"
                    ].map((feature, i) => (
                        <div key={i} className="flex items-center gap-3 p-4 rounded-2xl bg-slate-50 border border-slate-100 font-bold text-slate-700 text-sm">
                            <ChevronRight size={14} className="text-slate-400" />
                            {feature}
                        </div>
                    ))}
                </div>
              </section>

              {/* SECTION 3 */}
              <section id="compte" className="scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm shadow-lg">03</div>
                   Compte et Sécurité
                </h2>
                <div className="space-y-4">
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl flex items-start gap-4">
                        <UserPlus className="w-6 h-6 text-slate-400 mt-1" />
                        <div>
                            <p className="font-bold text-slate-900 mb-1">Âge requis</p>
                            <p className="text-sm text-slate-500 font-medium">Vous certifiez être majeur (18+ ans) pour accéder aux services payants.</p>
                        </div>
                    </div>
                    <div className="p-6 bg-white border border-slate-200 rounded-3xl flex items-start gap-4">
                        <Ban className="w-6 h-6 text-red-400 mt-1" />
                        <div>
                            <p className="font-bold text-slate-900 mb-1">Usages Interdits</p>
                            <p className="text-sm text-slate-500 font-medium">Toute tentative de "reverse engineering", de scraping ou d'utilisation de bots entraînera la suppression immédiate du compte.</p>
                        </div>
                    </div>
                </div>
              </section>

              {/* SECTION 4 : PROPRIÉTÉ */}
              <section id="propriete" className="scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm shadow-lg">04</div>
                   Propriété Intellectuelle
                </h2>
                <div className="p-8 bg-slate-900 rounded-[40px] text-white">
                    <div className="flex items-center gap-3 mb-8">
                        <Copyright className="w-6 h-6 text-yellow-400" />
                        <h3 className="text-xl font-bold">Qui possède quoi ?</h3>
                    </div>
                    <div className="space-y-6">
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-slate-400 text-sm font-medium">Contenu généré (Ebook, Ads)</span>
                            <span className="bg-emerald-500 text-white text-[10px] px-3 py-1 rounded-full font-bold">UTILISATEUR (VOUS)</span>
                        </div>
                        <div className="flex justify-between items-center pb-4 border-b border-white/10">
                            <span className="text-slate-400 text-sm font-medium">Algorithmes et Code Source</span>
                            <span className="bg-slate-700 text-white text-[10px] px-3 py-1 rounded-full font-bold">BOOKZY</span>
                        </div>
                        <p className="text-xs text-slate-400 leading-relaxed italic">
                            "Vous disposez d'un droit d'exploitation commerciale totale sur les fichiers finaux générés par votre compte."
                        </p>
                    </div>
                </div>
              </section>

              {/* SECTION 5 */}
              <section id="paiement" className="scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm shadow-lg">05</div>
                   Paiement et Facturation
                </h2>
                <div className="bg-slate-50 border border-slate-200 rounded-3xl p-8 flex flex-col md:flex-row gap-8 items-center">
                    <CreditCard size={48} className="text-slate-400" />
                    <div>
                        <p className="text-slate-600 font-medium leading-relaxed mb-4">
                            Toutes les transactions sont finales. Les prix sont affichés en FCFA (XOF). 
                            La facturation est traitée par des processeurs sécurisés (Mobile Money, Cartes).
                        </p>
                        <Link href="/legal/refund" className="text-sm font-black text-slate-900 underline">
                            Voir Politique de Remboursement
                        </Link>
                    </div>
                </div>
              </section>

              {/* SECTION 6 */}
              <section id="responsabilite" className="scroll-mt-32">
                <h2 className="text-2xl font-black text-slate-900 mb-6 flex items-center gap-4">
                   <div className="w-10 h-10 rounded-xl bg-slate-900 text-white flex items-center justify-center text-sm shadow-lg">06</div>
                   Garanties et Responsabilité
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="p-6 bg-amber-50 rounded-2xl border border-amber-100">
                        <AlertTriangle className="w-5 h-5 text-amber-600 mb-3" />
                        <h4 className="font-bold text-amber-900 text-sm mb-2">Service "As-Is"</h4>
                        <p className="text-xs text-amber-700 leading-relaxed font-medium">
                            Bookzy fournit des outils d'IA. La qualité finale dépend des instructions de l'utilisateur. Nous ne garantissons pas de succès commercial automatique.
                        </p>
                    </div>
                    <div className="p-6 bg-slate-50 rounded-2xl border border-slate-100">
                        <Briefcase className="w-5 h-5 text-slate-400 mb-3" />
                        <h4 className="font-bold text-slate-900 text-sm mb-2">Usage légal</h4>
                        <p className="text-xs text-slate-500 leading-relaxed font-medium">
                            L'utilisateur est seul responsable de la vérification des droits d'auteur sur les titres ou sujets qu'il choisit de traiter.
                        </p>
                    </div>
                </div>
              </section>

              {/* SECTION 7 */}
              <section id="contact" className="scroll-mt-32">
                <div className="p-10 bg-slate-900 rounded-[40px] text-white flex flex-col items-center text-center">
                    <Globe className="w-8 h-8 text-blue-400 mb-6" />
                    <h2 className="text-2xl font-bold mb-4">Contact Légal</h2>
                    <p className="text-slate-400 max-w-sm mb-8 font-medium leading-relaxed">
                        Pour toute question relative aux présentes conditions ou pour signaler un abus.
                    </p>
                    <a href="mailto:legal@bookzy.io" className="px-8 py-4 bg-white text-slate-900 rounded-2xl font-black hover:scale-105 transition-transform">
                        legal@bookzy.io
                    </a>
                </div>
              </section>

            </div>
          </main>
        </div>
      </div>
      
      {/* FOOTER */}
      <footer className="border-t border-slate-100 py-12 bg-white">
        <div className="max-w-7xl mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-6">
           <p className="text-sm text-slate-400 font-bold tracking-tight">© 2024 BOOKZY PLATFORM</p>
           <div className="flex gap-8">
              <Link href="/legal/confidentialite" className="text-sm font-bold text-slate-500 hover:text-slate-900">Vie Privée</Link>
              <Link href="/legal/refund" className="text-sm font-bold text-slate-500 hover:text-slate-900">Remboursements</Link>
           </div>
        </div>
      </footer>
    </div>
  );
}