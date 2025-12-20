"use client";

import Link from "next/link";
import { 
  Cookie, 
  ShieldCheck, 
  BarChart3, 
  Settings2, 
  Target, 
  Clock, 
  ArrowLeft,
  Info,
  ChevronRight,
  Globe
} from "lucide-react";

const cookieTypes = [
  { 
    id: "essentiels", 
    title: "Cookies Essentiels", 
    icon: ShieldCheck, 
    color: "emerald", 
    desc: "Obligatoires pour la connexion et la sécurité.",
    list: ["Session utilisateur", "Sécurité anti-CSRF", "Choix de consentement"]
  },
  { 
    id: "analytiques", 
    title: "Performance", 
    icon: BarChart3, 
    color: "blue", 
    desc: "Nous aident à améliorer l'outil Bookzy.",
    list: ["Pages consultées", "Temps par session", "Parcours de navigation"]
  },
  { 
    id: "fonctionnels", 
    title: "Préférences", 
    icon: Settings2, 
    color: "indigo", 
    desc: "Mémorisent vos réglages personnels.",
    list: ["Langue", "Mode sombre/clair", "Paramètres Dashboard"]
  },
  { 
    id: "marketing", 
    title: "Marketing", 
    icon: Target, 
    color: "rose", 
    desc: "Suivi publicitaire pour offres ciblées.",
    list: ["Annonces pertinentes", "Performance pub", "Réseaux sociaux"]
  }
];

export default function CookiePolicy() {
  
  const scrollTo = (id) => {
    const element = document.getElementById(id);
    if (element) {
      window.scrollTo({ top: element.offsetTop - 100, behavior: "smooth" });
    }
  };

  return (
    <div className="min-h-screen bg-[#FDFDFD] font-sans selection:bg-blue-100">
      
      {/* --- MINI HEADER --- */}
      <nav className="sticky top-0 z-50 bg-white/80 backdrop-blur-md border-b border-slate-100">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
             <div className="w-8 h-8 rounded-lg bg-slate-900 flex items-center justify-center transition-transform group-hover:scale-105">
                <Cookie className="w-4 h-4 text-white" />
             </div>
             <span className="font-bold text-slate-900">Bookzy <span className="text-slate-400 font-medium">Policy</span></span>
          </Link>
          <Link href="/" className="text-sm font-bold text-slate-500 hover:text-slate-900 flex items-center gap-1.5 transition-colors">
            <ArrowLeft className="w-4 h-4" /> Retour
          </Link>
        </div>
      </nav>

      <div className="max-w-7xl mx-auto px-6 py-12 lg:py-20">
        
        {/* --- HERO SECTION --- */}
        <div className="max-w-3xl mb-20">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-[10px] font-bold uppercase tracking-wider mb-6">
                <Info className="w-3 h-3" /> Transparence Totale
            </div>
            <h1 className="text-4xl lg:text-6xl font-black text-slate-900 tracking-tight mb-6 leading-tight">
                Comment nous utilisons <br /><span className="text-blue-600">les cookies.</span>
            </h1>
            <p className="text-xl text-slate-500 leading-relaxed font-medium">
                Bookzy utilise des cookies pour assurer le bon fonctionnement du service, 
                analyser notre trafic et personnaliser votre expérience utilisateur.
            </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16">
          
          {/* --- CONTENT --- */}
          <div className="flex-1 max-w-4xl space-y-24">
            
            {/* Section 1 : C'est quoi ? */}
            <section id="definition">
                <h2 className="text-2xl font-black text-slate-900 mb-6">1. Qu'est-ce qu'un cookie ?</h2>
                <div className="p-8 bg-white border border-slate-100 rounded-3xl shadow-sm text-slate-600 font-medium leading-relaxed">
                    Un cookie est un petit fichier texte stocké sur votre appareil lors de votre navigation. 
                    Il agit comme une "mémoire" temporaire qui nous permet de vous reconnaître d'une page à l'autre.
                </div>
            </section>

            {/* Section 2 : Types (GRID) */}
            <section id="types">
                <h2 className="text-2xl font-black text-slate-900 mb-8">2. Types de cookies utilisés</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {cookieTypes.map((type) => (
                        <div key={type.id} className="p-8 bg-white border border-slate-100 rounded-3xl hover:border-blue-200 transition-all group">
                            <div className={`w-12 h-12 rounded-2xl bg-${type.color}-50 text-${type.color}-600 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform`}>
                                <type.icon className="w-6 h-6" />
                            </div>
                            <h3 className="text-lg font-black text-slate-900 mb-2">{type.title}</h3>
                            <p className="text-sm text-slate-500 font-medium mb-6 leading-relaxed">{type.desc}</p>
                            <ul className="space-y-2">
                                {type.list.map((li, i) => (
                                    <li key={i} className="flex items-center gap-2 text-xs font-bold text-slate-700">
                                        <div className={`w-1 h-1 rounded-full bg-${type.color}-400`}></div>
                                        {li}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 3 : Tiers */}
            <section id="tiers" className="p-10 bg-slate-900 rounded-[40px] text-white">
                <h2 className="text-2xl font-black mb-8 flex items-center gap-3">
                    <Globe className="w-6 h-6 text-blue-400" /> Services tiers
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
                    {[
                        { name: "Google Analytics", role: "Mesure d'audience" },
                        { name: "Stripe", role: "Paiement sécurisé" },
                        { name: "Vercel", role: "Performance réseau" }
                    ].map((s, i) => (
                        <div key={i} className="p-5 bg-white/5 border border-white/10 rounded-2xl">
                            <p className="font-bold text-white text-sm mb-1">{s.name}</p>
                            <p className="text-slate-400 text-xs font-medium">{s.role}</p>
                        </div>
                    ))}
                </div>
            </section>

            {/* Section 4 : Conservation */}
            <section id="conservation">
                <h2 className="text-2xl font-black text-slate-900 mb-6">4. Durée de conservation</h2>
                <div className="overflow-hidden border border-slate-100 rounded-3xl bg-white shadow-sm">
                    <table className="w-full text-left text-sm font-medium">
                        <thead className="bg-slate-50 border-b border-slate-100">
                            <tr>
                                <th className="px-6 py-4 text-slate-900 font-black">Type</th>
                                <th className="px-6 py-4 text-slate-900 font-black">Durée Max.</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-slate-50">
                            <tr>
                                <td className="px-6 py-4 text-slate-600">Session</td>
                                <td className="px-6 py-4 font-bold text-blue-600">Durée de visite</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-slate-600">Essentiels</td>
                                <td className="px-6 py-4 font-bold text-blue-600">12 mois</td>
                            </tr>
                            <tr>
                                <td className="px-6 py-4 text-slate-600">Marketing</td>
                                <td className="px-6 py-4 font-bold text-blue-600">13 mois</td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </section>

            {/* Section 5 : Gestion */}
            <section id="gestion">
                <h2 className="text-2xl font-black text-slate-900 mb-6">5. Gestion des cookies</h2>
                <div className="bg-blue-600 rounded-3xl p-10 text-white flex flex-col md:flex-row items-center gap-8">
                    <div className="flex-1">
                        <h3 className="text-xl font-bold mb-3">Contrôlez votre vie privée</h3>
                        <p className="text-blue-100 font-medium">
                            Vous pouvez modifier vos choix à tout moment. Notez que le refus des cookies 
                            analytiques nous empêche d'améliorer votre expérience sur Bookzy.
                        </p>
                    </div>
                    <button className="whitespace-nowrap px-8 py-4 bg-white text-blue-600 rounded-2xl font-black shadow-xl hover:scale-105 transition-transform">
                        Réglages cookies
                    </button>
                </div>
            </section>

            {/* Footer Contact */}
            <section className="pt-12 border-t border-slate-100">
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6">
                    <div>
                        <p className="font-black text-slate-900 mb-1">Besoin d'aide ?</p>
                        <p className="text-slate-500 font-medium">privacy@bookzy.io</p>
                    </div>
                    <Link href="/legal/confidentialite" className="text-sm font-bold text-blue-600 flex items-center gap-2 group">
                        Politique de Confidentialité <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </Link>
                </div>
            </section>

          </div>

          {/* --- SIDEBAR INFO --- */}
          <aside className="hidden lg:block w-72 flex-shrink-0 sticky top-32 h-fit">
              <div className="p-8 bg-slate-50 rounded-[32px] border border-slate-100">
                  <Clock className="w-6 h-6 text-slate-400 mb-4" />
                  <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest mb-2">Version Actuelle</p>
                  <p className="text-sm font-black text-slate-900 mb-6">Mise à jour le 26/11/2024</p>
                  
                  <div className="space-y-4 pt-6 border-t border-slate-200">
                      <p className="text-xs text-slate-500 font-medium leading-relaxed italic">
                        "Conformément à la directive ePrivacy de l'UE et au RGPD."
                      </p>
                  </div>
              </div>
          </aside>

        </div>
      </div>
    </div>
  );
}