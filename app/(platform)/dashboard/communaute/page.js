"use client";

import { useState } from "react";
import {
  Sparkles,
  Trophy,
  MessageCircle,
  Video,
  Gift,
  TrendingUp,
  CheckCircle2,
  ArrowRight,
  Zap,
  Target,
  Send,
  Lock
} from "lucide-react";

export default function CommunautePage() {
  const [telegramLink] = useState("https://t.me/+Yad7Hj17d445Mzdk"); 

  const features = [
    {
      icon: Zap,
      title: "Idées de Contenus HOT",
      description: "Découvrez des titres et thèmes validés, prêts à exploiter immédiatement.",
      color: "from-red-500 to-red-600"
    },
    {
      icon: Sparkles,
      title: "Conseils Experts Quotidiens",
      description: "Recevez des stratégies éprouvées et des astuces pour créer des eBooks ultra-rentables.",
      color: "from-blue-500 to-blue-600"
    },
    {
      icon: Gift,
      title: "Ressources PREMIUM Gratuites",
      description: "Téléchargez des templates, checklists et outils pour booster vos ventes d'eBooks.",
      color: "from-amber-500 to-orange-600"
    },
    {
      icon: TrendingUp,
      title: "Tendances du Marché",
      description: "Restez informé des niches porteuses et opportunités du moment via nos analyses rapides.",
      color: "from-green-500 to-emerald-600"
    },
    {
      icon: Video,
      title: "Mini-Formations Actionnables",
      description: "Accédez à des vidéos courtes et astuces marketing pour passer à l'action.",
      color: "from-indigo-500 to-purple-600"
    },
    {
      icon: Trophy,
      title: "Inspiration et Motivation",
      description: "Inspirez-vous des résultats concrets d'autres créateurs (Success Stories).",
      color: "from-pink-500 to-rose-600"
    }
  ];

  const handleJoinCommunity = () => {
    window.open(telegramLink, "_blank");
  };

  return (
    // AJOUT DE overflow-x-hidden POUR ÉVITER LE SCROLL HORIZONTAL
    <div className="min-h-screen bg-slate-50 font-sans text-neutral-900 pb-20 overflow-x-hidden">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6 sm:py-8 space-y-12">

        {/* 1. HERO SECTION */}
        <div className="relative overflow-hidden bg-[#24A1DE] border border-blue-400/50 rounded-2xl sm:rounded-3xl p-6 sm:p-12 md:p-16 text-white shadow-xl sm:shadow-2xl shadow-blue-500/30">
          
          {/* Pattern background */}
          <div className="absolute inset-0 opacity-[0.05] pointer-events-none" style={{
            backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100"><text y=".9em" font-size="20" fill="rgba(255,255,255,0.4)">✈️</text></svg>')`,
            backgroundSize: '60px 60px'
          }}></div>

          <div className="relative z-10 text-center max-w-4xl mx-auto space-y-5">
            
            {/* Badge */}
            <div className="inline-flex items-center gap-2 px-3 py-1.5 sm:px-4 sm:py-2 bg-white/20 backdrop-blur-sm border border-white/30 rounded-full">
              <MessageCircle className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              <span className="text-[10px] sm:text-xs font-bold uppercase tracking-wider">CANAL TÉLÉGRAM OFFICIEL</span>
            </div>

            {/* Title - Ajustement tailles mobiles */}
            <h1 className="text-3xl sm:text-5xl md:text-6xl font-black leading-tight drop-shadow-lg">
              Rejoignez le <br className="sm:hidden" /> Club Secret Bookzy
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg md:text-xl text-white/90 max-w-2xl mx-auto leading-relaxed px-2">
              Accédez gratuitement aux <strong>stratégies d'experts</strong> et aux <strong>idées de contenus</strong> les plus rentables.
            </p>

            {/* CTA */}
            <div className="pt-4 w-full sm:w-auto">
              <button
                onClick={handleJoinCommunity}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-6 py-4 bg-white hover:bg-slate-100 text-blue-700 rounded-xl font-bold text-base sm:text-lg shadow-xl hover:scale-105 transition-all active:scale-95 touch-manipulation"
              >
                <Send className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Accès Gratuit & Immédiat</span>
                <ArrowRight className="w-4 h-4 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
            </div>
            
            {/* Small Proof - Flex wrap important ici */}
            <div className="flex flex-wrap items-center justify-center gap-x-4 gap-y-2 pt-2 text-[10px] sm:text-xs font-semibold text-white/80">
              <div className="flex items-center gap-1.5"><Lock className="w-3 h-3" /> 100% sans pub</div>
              <div className="flex items-center gap-1.5"><CheckCircle2 className="w-3 h-3 text-green-300" /> Validation experte</div>
            </div>

          </div>
        </div>

        {/* 2. CE QUE VOUS ALLEZ RECEVOIR */}
        <div className="space-y-6 pt-2 sm:pt-6">
          <div className="text-center px-2">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-2">
              Votre Avantage Compétitif
            </h2>
            <p className="text-base sm:text-lg text-neutral-600">
              Des idées qui font la différence, livrées directement sur votre téléphone.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6">
            {features.map((feature, index) => (
              <FeatureCardV2 key={index} {...feature} />
            ))}
          </div>
        </div>

        {/* 3. POURQUOI REJOINDRE */}
        <div className="bg-white border border-neutral-200 rounded-2xl sm:rounded-3xl p-6 sm:p-8 shadow-lg sm:shadow-xl">
          <div className="max-w-4xl mx-auto text-center">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-6">
              Plus qu'un canal, <br className="sm:hidden" /> c'est votre mentor IA
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
              <BenefitItem icon={Zap} title="Boost Productivité" text="Idées déjà filtrées par l'IA pour ne plus perdre de temps." />
              <BenefitItem icon={Trophy} title="Progression" text="Restez motivé et suivez les challenges réguliers." />
              <BenefitItem icon={Target} title="Ciblage Parfait" text="Identifiez les niches de micro-marché les plus chaudes." />
            </div>
          </div>
        </div>

        {/* 4. CTA FINAL */}
        <div className="text-center pt-4 sm:pt-8 px-2">
            <h2 className="text-2xl sm:text-3xl font-black text-neutral-900 mb-3">
              Ne ratez pas les prochaines pépites.
            </h2>
            <p className="text-base sm:text-lg text-neutral-600 mb-6">
              Rejoignez maintenant et recevez votre première stratégie exclusive.
            </p>
            <button
                onClick={handleJoinCommunity}
                className="group w-full sm:w-auto inline-flex items-center justify-center gap-3 px-8 py-5 bg-slate-900 hover:bg-blue-700 text-white rounded-xl font-bold text-base sm:text-lg shadow-2xl hover:scale-105 transition-all active:scale-95 touch-manipulation"
              >
                <Send className="w-5 h-5 flex-shrink-0" />
                <span className="truncate">Je Rejoins le Canal Telegram</span>
                <ArrowRight className="w-5 h-5 flex-shrink-0 group-hover:translate-x-1 transition-transform" />
              </button>
        </div>

      </div>
    </div>
  );
}

/* --- COMPONENTS ADAPTÉS MOBILE --- */

function FeatureCardV2({ icon: Icon, title, description, color }) {
  return (
    <div className="group bg-white border border-neutral-200 rounded-2xl p-5 hover:shadow-xl transition-all duration-300 flex flex-col active:scale-[0.98]">
      <div className={`inline-flex w-10 h-10 sm:w-12 sm:h-12 bg-gradient-to-br ${color} rounded-xl items-center justify-center mb-3 sm:mb-4 transition-transform`}>
        <Icon className="w-5 h-5 sm:w-6 sm:h-6 text-white" />
      </div>
      <h3 className="font-extrabold text-base sm:text-lg text-neutral-900 mb-1.5">{title}</h3>
      <p className="text-sm text-neutral-600 leading-relaxed">{description}</p>
    </div>
  );
}

function BenefitItem({ icon: Icon, title, text }) {
    return (
        <div className="space-y-2 p-4 border border-neutral-100 rounded-xl bg-slate-50">
            <div className={`flex items-center justify-center mx-auto w-10 h-10 bg-indigo-100 rounded-lg text-indigo-600 mb-2`}>
                <Icon className="w-5 h-5" />
            </div>
            <h3 className="font-bold text-lg text-neutral-900">{title}</h3>
            <p className="text-sm text-neutral-600 leading-relaxed">{text}</p>
        </div>
    );
}