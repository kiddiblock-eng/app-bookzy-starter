"use client";
import { useState } from "react";
import { ChevronDown, Mail, ArrowRight } from "lucide-react";

const GRAIN = `url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noise'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noise)' opacity='1'/%3E%3C/svg%3E")`;

export default function FAQ() {
  const [openIndex, setOpenIndex] = useState(0);

  const faqs = [
    {
      question: "Puis-je tester gratuitement ?",
      answer: "Oui. L'inscription est 100% gratuite et vous recevez 4 crédits à l'inscription. Vous pouvez explorer Radar Cash, valider une idée avec le Validateur d'idée et voir un aperçu gratuit de votre ebook avant de dépenser le moindre crédit."
    },
    {
      question: "C'est quoi la différence entre Radar Cash, Niche Hunter et le Validateur d'idée ?",
      answer: "Radar Cash surveille les publicités Facebook actives pour voir ce qui se vend en ce moment. Niche Hunter analyse Facebook Ads, Google Trends et le marché pour trouver des idées rentables à partir d'un mot-clé. Le Validateur d'idée prend une idée précise et vous donne un score de rentabilité sur 100, le niveau de concurrence, les revenus estimés et les pays qui achètent le plus. Les trois se complètent : Radar Cash et Niche Hunter pour trouver, le Validateur pour confirmer."
    },
    {
      question: "Qu'est-ce que l'aperçu gratuit ?",
      answer: "Avant de dépenser vos crédits, Bookzy génère gratuitement la couverture, le sommaire avec les vrais titres de vos chapitres, l'introduction complète et le début du chapitre 1. Vous voyez exactement ce que vous allez obtenir. Si ça vous plaît, vous débloquez l'ebook complet en un clic."
    },
    {
      question: "Qu'est-ce que je reçois après avoir généré mon ebook ?",
      answer: "Vous recevez l'ebook complet en PDF avec un design professionnel et une cover 3D, le texte entier rédigé par l'IA, les posts réseaux sociaux prêts à publier, les scripts WhatsApp pour vendre, et une version Word éditable. Tout est inclus dans les 20 crédits."
    },
    {
      question: "Les crédits expirent-ils ?",
      answer: "Non, jamais. Vos crédits vous appartiennent pour toujours. Même si votre abonnement expire, vos crédits restants sont conservés et vous pouvez continuer à générer des ebooks avec. Il n'y a aucun prélèvement automatique et aucune remise à zéro."
    },
    {
      question: "Puis-je revendre l'ebook généré ?",
      answer: "Oui, c'est le but. Vous obtenez une licence commerciale complète. L'ebook vous appartient entièrement. Vous pouvez le vendre, le modifier, le signer de votre nom et garder 100% des bénéfices."
    },
    {
      question: "Ça marche sur mobile ?",
      answer: "Oui. Bookzy est entièrement optimisé pour smartphone. Vous pouvez chercher votre niche, valider votre idée, générer votre ebook et télécharger le PDF directement depuis votre téléphone Android ou iPhone."
    },
    {
      question: "Comment encaisser mes ventes ?",
      answer: "Bookzy s'intègre avec Taliopay, notre partenaire de paiement conçu pour l'Afrique. Créez votre boutique en 1 minute, partagez votre lien et encaissez via Mobile Money (Wave, Orange Money, MTN, Moov) dans 25 pays, ou par carte bancaire dans 150+ pays."
    },
  ];

  return (
    <section id="faq" className="relative py-24 lg:py-32 overflow-hidden" style={{ background: "#FAFAFA" }}>

      <div className="absolute inset-0 opacity-[0.03] pointer-events-none z-0"
        style={{ backgroundImage: GRAIN, backgroundRepeat: "repeat", backgroundSize: "128px" }} />

      <div className="relative z-10 max-w-6xl mx-auto px-6">
        <div className="grid lg:grid-cols-12 gap-12 lg:gap-20 items-start">

          {/* GAUCHE */}
          <div className="lg:col-span-4 lg:sticky lg:top-32">
            <p className="text-xs font-black uppercase tracking-[0.3em] text-slate-400 mb-3">Centre d'aide</p>
            <h2 className="text-4xl md:text-5xl font-black text-slate-900 mb-5 tracking-tight leading-[0.92]">
              Questions<br />fréquentes
            </h2>
            <p className="text-slate-500 mb-8 leading-relaxed text-base">
              Tout ce qu'il faut savoir avant de lancer votre premier ebook rentable.
            </p>
            <div className="w-full h-px bg-[#E8E8E8] mb-8" />
            <div className="bg-white border border-[#E8E8E8] rounded-2xl p-6">
              <div className="w-10 h-10 bg-slate-50 border border-[#E8E8E8] rounded-xl flex items-center justify-center mb-4">
                <Mail className="w-5 h-5 text-slate-500" />
              </div>
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-1">Support</p>
              <h4 className="font-black text-slate-900 text-base tracking-tight mb-2">Une autre question ?</h4>
              <p className="text-sm text-slate-500 mb-5 leading-relaxed">
                Notre équipe est basée à Abidjan et répond en français.
              </p>
              <div className="w-full h-px bg-[#E8E8E8] mb-4" />
              <a href="mailto:support@bookzy.io" className="inline-flex items-center gap-2 text-xs font-black text-slate-900 uppercase tracking-widest hover:gap-3 transition-all">
                Contacter le support <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

          {/* DROITE */}
          <div className="lg:col-span-8 space-y-3">
            {faqs.map((faq, index) => (
              <div key={index} className={`rounded-2xl border transition-all duration-300 overflow-hidden ${openIndex === index ? "bg-white border-slate-300 shadow-sm" : "bg-white border-[#E8E8E8] hover:border-slate-300"}`}>
                <button onClick={() => setOpenIndex(openIndex === index ? null : index)} className="flex items-center justify-between w-full p-6 text-left gap-4">
                  <span className={`text-base font-black tracking-tight leading-snug transition-colors ${openIndex === index ? "text-slate-900" : "text-slate-700"}`}>
                    {faq.question}
                  </span>
                  <span className={`flex-shrink-0 w-7 h-7 rounded-lg border flex items-center justify-center transition-all duration-300 ${openIndex === index ? "bg-slate-900 border-slate-900 text-white rotate-180" : "bg-slate-50 border-[#E8E8E8] text-slate-400"}`}>
                    <ChevronDown className="w-4 h-4" />
                  </span>
                </button>
                <div className={`overflow-hidden transition-all duration-300 ${openIndex === index ? "max-h-96 opacity-100" : "max-h-0 opacity-0"}`}>
                  <div className="px-6 pb-6">
                    <div className="h-px w-full bg-[#E8E8E8] mb-4" />
                    <p className="text-slate-500 leading-relaxed text-sm">{faq.answer}</p>
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