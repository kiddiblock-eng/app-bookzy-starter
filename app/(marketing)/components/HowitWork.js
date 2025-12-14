"use client";

import React, { useState, useEffect, useRef } from "react";
import { 
  Pencil, Download, Zap, 
  ArrowRight, X, Clock, Users, Check, FileText, Sliders, Keyboard, PackageCheck, Sparkles
} from "lucide-react";
import Link from "next/link";
import { motion, AnimatePresence, useInView, useSpring, useMotionValue, useTransform } from "framer-motion";

// --- DATA ---
const steps = [
  {
    id: 1,
    icon: Keyboard,
    title: "Entrez votre sujet",
    short: "Une simple phrase suffit. Donnez un titre ou décrivez brièvement ce que vous voulez.",
    modalContent: {
      title: "Le Brief Ultra-rapide",
      items: [
        "Entrez le titre (ex: 'Dresser son chien')",
        "L'IA analyse le marché instantanément",
        "L'IA Génère le plan logique automatique"
      ],
      info: "C'est la seule chose que vous avez à écrire, le titre.",
    },
    // On reste dans les tons de la marque (Bleu)
    color: "blue",
    bonus: [
      { icon: Zap, text: "Analyse Instantanée" },
      { icon: Check, text: "Plan Auto" }
    ]
  },
  {
    id: 2,
    icon: Sliders,
    title: "Cochez vos options",
    short: "Pas de rédaction technique. Sélectionnez le ton, la cible et la longueur via des menus simples.",
    modalContent: {
      title: "Personnalisation",
      items: [
        "Choisissez l'audience (Débutants, Experts...)",
        "Sélectionnez le ton (Pro, Empathique...)",
        "Définissez le nombre de pages",
      ],
      info: "Aucune compétence requise. Vous cliquez, l'IA s'adapte."
    },
    // Ton Violet
    color: "violet",
    bonus: [
        { icon: Sliders, text: "Menus Simples" },
        { icon: Users, text: "Ciblage Précis" }
    ]
  },
  {
    id: 3,
    icon: PackageCheck,
    title: "Téléchargez le Pack",
    short: "C'est fini. Récupérez votre Ebook PDF complet et vos textes de vente prêts à l'emploi.",
    modalContent: {
      title: "Livraison du Business",
      items: [
        "Ebook PDF complet (Mise en page incluse)",
        "Posts Facebook & Instagram rédigés",
        "Séquences WhatsApp & Emails",
        "Page de vente complète"
      ],
      info: "Prêt à être vendu en moins de 60 secondes."
    },
    // Ton Rose/Pink pour la finalité
    color: "pink",
    bonus: [
        { icon: FileText, text: "PDF Final" },
        { icon: Download, text: "Textes Marketing" }
    ]
  }
];

// --- COMPTEUR ANIMÉ ---
const AnimatedCounter = ({ value }) => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true });
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 50, stiffness: 100 });
  const rounded = useTransform(springValue, (latest) => Math.round(latest));
  const displayValue = useTransform(rounded, (latest) => new Intl.NumberFormat('fr-FR').format(latest));

  useEffect(() => {
    if (isInView) motionValue.set(value);
  }, [isInView, value, motionValue]);

  return <motion.span ref={ref}>{displayValue}</motion.span>;
};

export default function HowItWorks() {
  const [activeStep, setActiveStep] = useState(null);

  useEffect(() => {
    const handleEsc = (e) => { if (e.key === "Escape") setActiveStep(null); };
    window.addEventListener("keydown", handleEsc);
    return () => window.removeEventListener("keydown", handleEsc);
  }, []);

  return (
    <section id="howitWorks" className="relative bg-white py-24 md:py-32 overflow-hidden border-t border-slate-100">
      
      {/* --- FOND AURORA (Cohérence parfaite) --- */}
      <div className="absolute top-1/3 left-0 w-[800px] h-[800px] bg-blue-50/60 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply" />
      <div className="absolute bottom-0 right-0 w-[800px] h-[800px] bg-violet-50/60 rounded-full blur-[120px] pointer-events-none -z-10 mix-blend-multiply" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        
        {/* HEADER */}
        <div className="text-center mb-20 md:mb-28">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 bg-white border border-slate-200 px-4 py-1.5 rounded-full mb-8 shadow-sm cursor-default"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
            </span>
            <span className="text-slate-600 text-xs font-bold uppercase tracking-wider">Mode d'emploi (Outil Pro)</span>
          </motion.div>

          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl lg:text-6xl font-black text-slate-900 mb-8 tracking-tight leading-[1.1]"
          >
            Comment créer votre livre <br className="hidden md:block"/>
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-600 via-violet-600 to-pink-500">
              sans l'écrire ?
            </span>
          </motion.h2>

          {/* Stats Bar */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="inline-flex flex-wrap items-center justify-center gap-8 bg-white/50 backdrop-blur-sm border border-slate-200 px-8 py-4 rounded-2xl shadow-sm"
          >
            <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-50 rounded-lg"><Clock className="w-5 h-5 text-blue-600" /></div>
                <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Temps Requis</div>
                    <div className="text-lg font-black text-slate-900">1 minute</div>
                </div>
            </div>
            <div className="w-px h-8 bg-slate-200 hidden sm:block" />
            <div className="flex items-center gap-3">
                <div className="p-2 bg-violet-50 rounded-lg"><Users className="w-5 h-5 text-violet-600" /></div>
                <div className="text-left">
                    <div className="text-[10px] text-slate-400 font-bold uppercase tracking-wide">Utilisateurs</div>
                    <div className="text-lg font-black text-slate-900"><AnimatedCounter value={2450} />+</div>
                </div>
            </div>
          </motion.div>
        </div>

        {/* TIMELINE */}
        <div className="relative">
          {/* Ligne Verticale (Gradient Marque) */}
          <div className="absolute left-8 md:left-1/2 top-0 bottom-0 w-[2px] bg-slate-100 md:transform md:-translate-x-1/2 rounded-full overflow-hidden">
            <motion.div 
                className="w-full bg-gradient-to-b from-blue-500 via-violet-500 to-pink-500 origin-top"
                initial={{ height: 0 }}
                whileInView={{ height: '100%' }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, ease: "easeInOut" }}
            />
          </div>

          <div className="space-y-24">
            {steps.map((step, index) => {
              const Icon = step.icon;
              const isEven = index % 2 === 0;
              // Mapping des couleurs pour Tailwind
              const colors = {
                blue: { bg: "bg-blue-600", light: "bg-blue-50", text: "text-blue-600", border: "group-hover:border-blue-200" },
                violet: { bg: "bg-violet-600", light: "bg-violet-50", text: "text-violet-600", border: "group-hover:border-violet-200" },
                pink: { bg: "bg-pink-600", light: "bg-pink-50", text: "text-pink-600", border: "group-hover:border-pink-200" },
              };
              const theme = colors[step.color];
              
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 50 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ duration: 0.5, delay: index * 0.2 }}
                  className={`relative flex flex-col md:flex-row items-start md:items-center gap-8 ${
                    isEven ? '' : 'md:flex-row-reverse'
                  }`}
                >
                  {/* Icône Centrale (Style Glass) */}
                  <div className="absolute left-8 md:left-1/2 transform -translate-x-1/2 z-10">
                    <div className={`w-16 h-16 rounded-2xl bg-white flex items-center justify-center shadow-[0_8px_30px_rgb(0,0,0,0.12)] border-4 border-white relative group overflow-hidden`}>
                        <div className={`absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity ${theme.light}`} />
                        <Icon className={`w-7 h-7 ${theme.text} relative z-10 transition-transform group-hover:scale-110`} />
                        <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center text-[10px] text-white font-bold border-2 border-white">
                            {step.id}
                        </div>
                    </div>
                  </div>

                  {/* Espaceur */}
                  <div className="w-16 md:hidden" />
                  <div className="hidden md:block md:w-1/2" />

                  {/* Carte Contenu (Style Bento/Premium) */}
                  <div className={`flex-1 w-full md:w-1/2 ${isEven ? 'md:pr-24 pl-16 md:pl-0' : 'md:pl-24 pl-16 md:pr-0'}`}>
                    <div 
                        onClick={() => setActiveStep(index)}
                        className={`group cursor-pointer bg-white rounded-3xl p-8 border border-slate-100 shadow-[0_8px_30px_rgb(0,0,0,0.04)] hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 relative overflow-hidden ${theme.border}`}
                    >
                        {/* Glow au survol */}
                        <div className={`absolute top-0 right-0 w-32 h-32 ${theme.light} rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity`} />

                        <h3 className="text-xl font-bold text-slate-900 mb-3 relative z-10">
                            {step.title}
                        </h3>
                        <p className="text-slate-500 text-sm leading-relaxed mb-6 relative z-10 font-medium">
                            {step.short}
                        </p>

                        {/* Badges Bonus */}
                        <div className="flex gap-2 flex-wrap relative z-10">
                            {step.bonus.map((b, i) => (
                                <span key={i} className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-50 text-[10px] font-bold text-slate-600 uppercase tracking-wide border border-slate-100 group-hover:bg-white transition-colors">
                                    <b.icon className={`w-3 h-3 ${theme.text}`} /> {b.text}
                                </span>
                            ))}
                        </div>
                        
                        <div className="absolute top-8 right-8 opacity-0 group-hover:opacity-100 transition-opacity transform group-hover:translate-x-1">
                            <ArrowRight className={`w-5 h-5 ${theme.text}`} />
                        </div>
                    </div>
                  </div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* CTA Final */}
        <motion.div 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-center mt-32"
        >
          <Link href="/auth/register" className="inline-flex items-center justify-center gap-2 px-8 py-4 bg-slate-900 text-white rounded-xl font-bold text-lg shadow-xl shadow-slate-900/10 hover:bg-slate-800 hover:-translate-y-1 transition-all">
             <span>Générer mon premier ebook</span>
          </Link>
        </motion.div>
      </div>

      {/* --- MODAL CLEAN (Style Apple/Stripe) --- */}
      <AnimatePresence>
        {activeStep !== null && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[100] flex items-center justify-center bg-slate-900/40 backdrop-blur-sm p-4"
            onClick={() => setActiveStep(null)}
          >
            <motion.div 
              initial={{ scale: 0.95, opacity: 0, y: 10 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.95, opacity: 0, y: 10 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white w-full max-w-lg rounded-3xl shadow-2xl overflow-hidden relative ring-1 ring-black/5"
            >
                {/* Header Modal (Clean White) */}
                <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
                    <div className="flex items-center gap-4">
                         {/* Icône dynamique selon la couleur */}
                         <div className={`p-3 rounded-xl ${activeStep === 0 ? 'bg-blue-50 text-blue-600' : activeStep === 1 ? 'bg-violet-50 text-violet-600' : 'bg-pink-50 text-pink-600'}`}>
                             {React.createElement(steps[activeStep].icon, { className: "w-6 h-6" })}
                         </div>
                         <div>
                            <h3 className="text-xl font-bold text-slate-900">{steps[activeStep].modalContent.title}</h3>
                            <p className="text-slate-500 text-xs font-bold uppercase tracking-wider">Étape {steps[activeStep].id}</p>
                         </div>
                    </div>
                    <button onClick={() => setActiveStep(null)} className="p-2 bg-slate-50 hover:bg-slate-100 rounded-full transition-colors text-slate-400 hover:text-slate-600">
                        <X className="w-5 h-5" />
                    </button>
                </div>

                {/* Body Modal */}
                <div className="p-8 bg-slate-50/50">
                    <ul className="space-y-4 mb-8">
                        {steps[activeStep].modalContent.items.map((item, idx) => (
                        <li key={idx} className="flex items-start gap-3">
                            <div className="flex-shrink-0 w-5 h-5 rounded-full bg-white border border-slate-200 shadow-sm flex items-center justify-center mt-0.5">
                                <Check className="w-3 h-3 text-emerald-500" />
                            </div>
                            <span className="text-slate-700 text-sm font-medium leading-relaxed">{item}</span>
                        </li>
                        ))}
                    </ul>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100 flex gap-3 items-start">
                        <Zap className="w-5 h-5 text-amber-500 flex-shrink-0 mt-0.5" />
                        <p className="text-sm text-amber-900 italic font-medium">{steps[activeStep].modalContent.info}</p>
                    </div>

                    <div className="mt-8 flex justify-end">
                        <Link href="/auth/register" className="bg-slate-900 text-white px-6 py-2.5 rounded-xl font-bold text-sm hover:bg-slate-800 transition-colors shadow-lg flex items-center gap-2">
                            Essayer cette étape <ArrowRight className="w-4 h-4" />
                        </Link>
                    </div>
                </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}