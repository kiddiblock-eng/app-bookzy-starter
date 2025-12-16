"use client";
import React, { useState } from "react";
import { Plus, Mail, HelpCircle, ArrowRight } from "lucide-react";

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Puis-je tester gratuitement  ?",
      answer: "Absolument. L'inscription est 100% gratuite. Avec le plan 'Explorateur', vous pouvez utiliser le Niche Hunter (30 idées/jour), analyser les tendances du marché et générer le sommaire (plan) de votre livre sans rien payer. Vous ne payez les 2 000 FCFA que si vous voulez télécharger le PDF final."
    },
    {
      question: "Qu'est-ce que je reçois exactement après le paiement ?",
      answer: "Le pack complet Bookzy comprend : 1) Votre Ebook PDF prêt à vendre (Design Pro A4), 2) Le texte complet rédigé par l'IA, 3) Les scripts de publicité (Facebook/Instagram), 4) Les séquences WhatsApp de relance, et 5) L'argumentaire de vente complet."
    },
    {
      question: "L'offre à 2 000 FCFA est-elle un abonnement ?",
      answer: "Non, jamais. C'est un paiement unique par projet. Vous payez 2 000 FCFA, vous générez votre Ebook, et c'est tout. Aucun prélèvement automatique caché, aucune surprise."
    },
    {
      question: "Puis-je revendre l'ebook généré ?",
      answer: "OUI. C'est le but ! Vous obtenez une Licence Commerciale à 100%. L'ebook vous appartient (Propriété Intellectuelle). Vous pouvez le vendre, le modifier, le signer de votre nom et garder 100% des bénéfices."
    },
    {
      question: "Je n'ai pas d'ordinateur, ça marche sur mobile ?",
      answer: "Oui ! Bookzy est optimisé pour smartphone. Vous pouvez chercher votre niche, générer votre ebook et télécharger le PDF directement depuis votre téléphone Android ou iPhone."
    }
  ];

  return (
    <section id="faq" className="relative bg-white py-24 lg:py-32 overflow-hidden">
      
      {/* FOND SIMPLIFIÉ */}
      <div className="absolute inset-0 bg-gradient-to-b from-blue-50/30 via-white to-violet-50/30"></div>

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">
          
          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 border border-blue-100 text-blue-700 text-xs font-bold uppercase tracking-wide mb-6">
              <HelpCircle className="w-3 h-3" /> Centre d'aide
            </div>
            
            <h2 className="text-3xl md:text-5xl font-black text-slate-900 mb-6 tracking-tight leading-[1.1]">
              Questions <br/> Fréquentes
            </h2>
            
            <p className="text-slate-600 mb-8 leading-relaxed font-medium">
              Tout ce qu'il faut savoir avant de lancer votre empire digital.
            </p>

            {/* Carte Support */}
            <div className="p-1 rounded-2xl bg-gradient-to-br from-slate-100 to-white border border-slate-200 shadow-sm">
                <div className="bg-white rounded-xl p-6 relative overflow-hidden group">
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-slate-50 border border-slate-100 rounded-xl flex items-center justify-center text-blue-600 mb-4 group-hover:scale-110 transition-transform">
                            <Mail className="w-6 h-6" />
                        </div>
                        <h4 className="font-bold text-slate-900 text-lg mb-1">Une autre question ?</h4>
                        <p className="text-sm text-slate-500 mb-4">
                            Notre équipe support est basée à Abidjan et répond en français.
                        </p>
                        <a 
                            href="mailto:support@bookzy.io" 
                            className="inline-flex items-center gap-2 text-sm font-bold text-blue-600 hover:gap-3 transition-all"
                        >
                            Contacter le support <ArrowRight className="w-4 h-4" />
                        </a>
                    </div>
                </div>
            </div>
          </div>

          {/* COLONNE DROITE : ACCORDÉON */}
          <div className="lg:col-span-8 space-y-4">
            {faqs.map((faq, index) => (
              <div 
                key={index} 
                className={`group rounded-2xl border transition-all duration-300 ${
                    openIndex === index 
                    ? 'bg-white border-blue-200 shadow-lg' 
                    : 'bg-white/50 border-slate-200 hover:border-slate-300 hover:bg-white'
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex items-start justify-between w-full p-6 text-left"
                >
                  <span className={`text-lg font-bold pr-8 transition-colors ${openIndex === index ? 'text-blue-600' : 'text-slate-900'}`}>
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-300 ${
                      openIndex === index ? 'bg-blue-100 text-blue-600 rotate-45' : 'bg-slate-100 text-slate-400 group-hover:bg-slate-200'
                  }`}>
                     <Plus className="w-4 h-4" />
                  </span>
                </button>
                
                <div
                  className={`overflow-hidden transition-all duration-300 ${
                    openIndex === index ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
                  }`}
                >
                  <div className="px-6 pb-6 pt-0">
                    <div className="h-px w-full bg-slate-100 mb-4"></div>
                    <p className="text-slate-600 leading-relaxed text-base">
                      {faq.answer}
                    </p>
                  </div>
                </div>
              </div>
            ))}
          </div>

        </div>
      </div>
    </section>
  );
}