"use client";
import React, { useState } from "react";
import { Check, X, Sparkles, Flame, Search, Zap, Shield, ChevronDown, Star } from "lucide-react";
import Link from "next/link";

export default function Pricing() {
  const [currency] = useState({ code: "FCFA", symbol: "FCFA" });
  const [openFaq, setOpenFaq] = useState(null);

 

  return (
    <section id="pricing" className="bg-white py-24 font-sans border-t border-slate-200">
      <div className="max-w-5xl mx-auto px-6">
        
        {/* HEADER */}
        <div className="text-center mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-blue-50 border border-blue-200 rounded-full mb-6">
            <span className="text-blue-700 font-semibold text-sm">Tarification transparente</span>
          </div>

          <h2 className="text-4xl md:text-5xl font-bold text-slate-900 mb-4 tracking-tight">
            Testez gratuitement.<br />
            <span className="text-blue-600">Créez quand vous êtes prêt.</span>
          </h2>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Explorez toutes nos analyses <strong>sans payer</strong>. Ne payez que pour générer votre produit final.
          </p>
        </div>

        {/* GRID PRICING */}
        <div className="grid md:grid-cols-2 gap-8 items-stretch max-w-4xl mx-auto mb-16">
            
            {/* PLAN DÉCOUVERTE */}
            <div className="flex flex-col bg-white rounded-2xl border-2 border-slate-200 transition-all duration-300 hover:border-slate-300 shadow-sm">
                <div className="h-[48px] w-full"></div>

                <div className="p-8 pt-4 flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Explorateur</h3>
                    <p className="text-slate-600 text-sm mb-6 min-h-[40px]">
                        Trouvez votre niche rentable sans risque
                    </p>

                    <div className="mb-6 h-[60px] flex items-baseline">
                        <span className="text-5xl font-bold text-slate-900 tracking-tight">0</span>
                        <span className="text-sm font-medium text-slate-500 ml-1">{currency.symbol}</span>
                        <span className="text-xs text-slate-400 ml-2">Gratuit à vie</span>
                    </div>

                    <Link href="/auth/register" className="block w-full py-3 rounded-full border-2 border-slate-300 text-slate-900 font-bold text-center hover:bg-slate-900 hover:text-white transition-all mb-8">
                        Commencer l'exploration
                    </Link>

                    <div className="flex-1">
                        <p className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Outils d'analyse inclus :</p>
                        <ul className="space-y-4">
                            <li className="flex items-start gap-3">
                                <Search className="w-5 h-5 text-blue-600 shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <span className="text-sm font-bold text-slate-900">30 Idées / jour</span>
                                    <p className="text-xs text-slate-500">Niche Hunter (3 recherches • Renouvelé chaque jour)</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Flame className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <span className="text-sm font-bold text-slate-900">Tendances Illimitées</span>
                                    <p className="text-xs text-slate-500">Espionnez ce qui se vend maintenant</p>
                                </div>
                            </li>
                            {/* ✅ YOUBOOK AJOUTÉ */}
                            <li className="flex items-start gap-3">
                                <Zap className="w-5 h-5 text-red-600 shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                        3 Analyses YouTube / jour
                                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-black rounded">NEW</span>
                                    </span>
                                    <p className="text-xs text-slate-500">Youbook • Transformez des vidéos en ebook</p>
                                </div>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" strokeWidth={2} />
                                <span className="text-sm text-slate-700 font-medium">Génération du sommaire complet</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-slate-900 shrink-0 mt-0.5" strokeWidth={2} />
                                <span className="text-sm text-slate-700 font-medium">Couverture 3D générée par l'IA</span>
                            </li>
                            <li className="border-t border-slate-100 my-2"></li>
                            <li className="pt-2">
                                <p className="text-xs text-slate-400 italic">Pour créer le produit final :</p>
                            </li>

                            <li className="flex items-start gap-3 opacity-40">
                                <X className="w-5 h-5 text-slate-400 shrink-0" strokeWidth={2} />
                                <span className="text-sm text-slate-500">eBook PDF complet</span>
                            </li>
                            <li className="flex items-start gap-3 opacity-40">
                                <X className="w-5 h-5 text-slate-400 shrink-0" strokeWidth={2} />
                                <span className="text-sm text-slate-500">Kit marketing inclus</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

            {/* PLAN CRÉATEUR */}
            <div className="flex flex-col bg-white rounded-2xl border-2 border-emerald-500 shadow-2xl relative overflow-hidden transform md:scale-105 transition-all duration-300">
                
                

                {/* Bandeau */}
                <div className="bg-[#d4f7d6] text-[#004d0d] text-sm font-bold h-[48px] flex items-center justify-center uppercase tracking-wide">
                    🔥 Offre de lancement : -64%
                </div>

                <div className="p-8 pt-4 flex flex-col h-full">
                    <h3 className="text-2xl font-bold text-slate-900 mb-2">Créateur</h3>
                    <p className="text-slate-600 text-sm mb-6 min-h-[40px]">
                        Le pack complet pour créer votre ebook pro en 60s
                    </p>

                    <div className="mb-6 h-[60px]">
                        <div className="flex items-center gap-2 mb-1">
                            <p className="text-slate-400 text-sm line-through decoration-slate-300">5 500 {currency.symbol}</p>
                            <span className="px-2 py-0.5 bg-red-100 text-red-700 text-xs font-bold rounded">-64%</span>
                        </div>
                        <div className="flex items-baseline gap-1">
                             <span className="text-5xl font-bold text-slate-900 tracking-tight">2 000</span>
                             <div className="flex flex-col">
                                <span className="text-sm font-bold text-slate-900">{currency.symbol}</span>
                                <span className="text-xs text-slate-500 font-normal">par eBook généré</span>
                             </div>
                        </div>
                    </div>

                    <Link href="/auth/register" className="block w-full py-3.5 rounded-full bg-gradient-to-r from-blue-600 to-violet-600 hover:from-blue-700 hover:to-violet-700 text-white font-bold text-center transition-all mb-4 shadow-lg hover:shadow-xl hover:scale-105">
                        Créer mon eBook
                    </Link>

                    <div className="flex items-center justify-center gap-2 mb-6 text-xs text-slate-500">
                        <Shield className="w-3.5 h-3.5 text-emerald-500" />
                        <span>Satisfait ou remboursé 7 jours</span>
                    </div>

                    <div className="flex-1">
                        <p className="text-xs font-bold text-emerald-700 uppercase tracking-wider mb-4">Pack complet inclus :</p>
                        <ul className="space-y-3.5">
                            
                            <li className="flex items-start gap-3">
                                <Zap className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <span className="text-sm font-bold text-slate-900">100+ Idées / jour</span>
                                    <p className="text-xs text-slate-500">Niche Hunter illimité</p>
                                </div>
                            </li>

                            <li className="flex items-start gap-3">
                                <Flame className="w-5 h-5 text-orange-500 shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <span className="text-sm font-bold text-slate-900">Tendances Premium</span>
                                    <p className="text-xs text-slate-500">Données en temps réel</p>
                                </div>
                            </li>

                            {/* ✅ YOUBOOK ILLIMITÉ */}
                            <li className="flex items-start gap-3">
                                <Zap className="w-5 h-5 text-red-600 shrink-0 mt-0.5" strokeWidth={2} />
                                <div>
                                    <span className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
                                        Youbook Illimité
                                        <span className="px-1.5 py-0.5 bg-red-100 text-red-700 text-[9px] font-black rounded">NEW</span>
                                    </span>
                                    <p className="text-xs text-slate-500">Analyses YouTube sans limite</p>
                                </div>
                            </li>

                            <li className="border-t border-emerald-100 my-2"></li>

                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                                <span className="text-sm text-slate-900 font-semibold">eBook complet (20-90 pages)</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                                <span className="text-sm text-slate-900 font-medium">PDF pro format A4</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                                <span className="text-sm text-slate-900 font-medium">Couverture 3D</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                                <span className="text-sm text-slate-900 font-medium">Rédaction IA Premium </span>
                            </li>
                            
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                                <span className="text-sm text-slate-900 font-medium">Posts Facebook + Instagram</span>
                            </li>
                            <li className="flex items-start gap-3">
                                <Check className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" strokeWidth={3} />
                                <span className="text-sm text-slate-900 font-medium">Messages WhatsApp prêts</span>
                            </li>
                            
                            <li className="border-t border-emerald-100 my-2"></li>

                            <li className="flex items-start gap-3">
                                <Sparkles className="w-5 h-5 text-emerald-600 shrink-0 mt-0.5" />
                                <span className="text-sm text-slate-900 font-bold">Licence Commerciale 100%</span>
                            </li>
                        </ul>
                    </div>
                </div>
            </div>

        </div>

        

       

        {/* FOOTER */}
        <div className="mt-16 text-center">
            <div className="inline-flex items-center gap-6 text-sm text-slate-500">
                <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> Sans engagement
                </span>
                <span className="w-px h-4 bg-slate-300" />
                <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> Paiement sécurisé
                </span>
                <span className="w-px h-4 bg-slate-300" />
                <span className="flex items-center gap-2">
                    <Check className="w-4 h-4 text-emerald-500" /> Support 24/7
                </span>
            </div>
        </div>

      </div>
    </section>
  );
}