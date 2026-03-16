"use client";
import { useState } from "react";
import { ChevronDown, Mail, ArrowRight } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Puis-je tester gratuitement ?",
      answer: "Absolument. L'inscription est 100% gratuite. Avec le plan Explorateur, vous pouvez utiliser le Niche Hunter, analyser les tendances du marché et générer le sommaire de votre livre sans rien payer. Vous ne payez que si vous voulez télécharger le PDF final."
    },
    {
      question: "Qu'est-ce que je reçois exactement après le paiement ?",
      answer: "Le pack complet Bookzy comprend : votre ebook PDF prêt à vendre (Design Pro A4), le texte complet rédigé par l'IA, les scripts de publicité Facebook et Instagram, les séquences WhatsApp de relance, et l'argumentaire de vente complet."
    },
    {
      question: "L'offre à 2 000 FCFA est-elle un abonnement ?",
      answer: "Non, jamais. C'est un paiement unique par projet. Vous payez 2 000 FCFA, vous générez votre ebook, et c'est tout. Aucun prélèvement automatique caché, aucune surprise."
    },
    {
      question: "Puis-je revendre l'ebook généré ?",
      answer: "Oui, c'est le but. Vous obtenez une Licence Commerciale à 100%. L'ebook vous appartient entièrement. Vous pouvez le vendre, le modifier, le signer de votre nom et garder 100% des bénéfices."
    },
    {
      question: "Je n'ai pas d'ordinateur, ça marche sur mobile ?",
      answer: "Oui. Bookzy est optimisé pour smartphone. Vous pouvez chercher votre niche, générer votre ebook et télécharger le PDF directement depuis votre téléphone Android ou iPhone."
    }
  ];

  return (
    <section id="faq" className="relative py-24 lg:py-32 overflow-hidden" style={{ background: "#F5F2ED" }}>

      {/* Grain */}
      <div className="absolute inset-0 opacity-[0.035] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* COLONNE GAUCHE */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">

            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Centre d'aide</p>

            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight leading-[0.92]">
              Questions<br />fréquentes
            </h2>

            <p className="text-slate-500 mb-8 leading-relaxed text-base">
              Tout ce qu'il faut savoir avant de lancer votre empire digital.
            </p>

            <div className="w-full h-px bg-[#C8BFB0] mb-8" />

            {/* Carte Support */}
            <div className="bg-white border border-[#C8BFB0] rounded-2xl p-6 relative overflow-hidden">
              <div className="absolute inset-0 opacity-[0.03] pointer-events-none"
                style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />
              <div className="relative z-10">
                <div className="w-10 h-10 bg-[#F5F2ED] border border-[#C8BFB0] rounded-xl flex items-center justify-center mb-4">
                  <Mail className="w-5 h-5 text-slate-500" />
                </div>
                <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Support</p>
                <h4 className="font-black text-slate-900 text-base tracking-tight mb-2">Une autre question ?</h4>
                <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                  Notre équipe est basée à Abidjan et répond en français.
                </p>
                <div className="w-full h-px bg-[#E8E2D9] mb-4" />
                <a
                  href="mailto:support@bookzy.io"
                  className="inline-flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest hover:gap-3 transition-all"
                >
                  Contacter le support
                  <ArrowRight className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>

          {/* COLONNE DROITE : ACCORDÉON */}
          <div className="lg:col-span-8 space-y-3">
            {faqs.map((faq, index) => (
              <div
                key={index}
                className={`rounded-2xl border transition-all duration-300 overflow-hidden ${
                  openIndex === index
                    ? "bg-white border-slate-400 shadow-sm"
                    : "bg-white border-[#C8BFB0] hover:border-slate-400"
                }`}
              >
                <button
                  onClick={() => setOpenIndex(openIndex === index ? null : index)}
                  className="flex items-center justify-between w-full p-6 text-left gap-4"
                >
                  <span className={`text-base font-black tracking-tight leading-snug transition-colors ${
                    openIndex === index ? "text-slate-900" : "text-slate-700"
                  }`}>
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-300 ${
                    openIndex === index
                      ? "bg-slate-900 border-slate-900 text-white rotate-180"
                      : "bg-[#F5F2ED] border-[#C8BFB0] text-slate-400"
                  }`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>

                <div className={`overflow-hidden transition-all duration-300 ${
                  openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
                }`}>
                  <div className="px-6 pb-6">
                    <div className="h-px w-full bg-[#E8E2D9] mb-4" />
                    <p className="text-slate-500 leading-relaxed text-sm">
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