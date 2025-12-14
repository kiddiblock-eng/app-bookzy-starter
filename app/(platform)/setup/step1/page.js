"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { 
  User2, 
  Users, 
  Video, 
  Briefcase, 
  ArrowRight, 
  Sparkles, 
  Check
} from "lucide-react";

/* --- LOGO ORIGINAL --- */
function BookOpenSVG(props) {
    return (
        <svg 
            {...props}
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2.5" 
            strokeLinecap="round" 
            strokeLinejoin="round"
        >
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    );
}

export default function Step1() {
  const [type, setType] = useState("");
  const router = useRouter();

  useEffect(() => {
    const step = localStorage.getItem("onboardingStep");
    if (step !== "1") router.push("/auth/register");
  }, [router]);

  const profiles = [
    {
      id: "individuel",
      label: "Individuel",
      icon: User2,
      desc: "Personnel",
      gradient: "from-blue-500 to-cyan-400",
    },
    {
      id: "freelance",
      label: "Freelance",
      icon: Briefcase,
      desc: "Projets",
      gradient: "from-violet-500 to-purple-400",
    },
    {
      id: "createur",
      label: "Créateur",
      icon: Video,
      desc: "Contenu",
      gradient: "from-pink-500 to-rose-400",
    },
    {
      id: "agence",
      label: "Agence",
      icon: Users,
      desc: "Équipe",
      gradient: "from-emerald-500 to-teal-400",
    },
  ];

  const handleContinue = () => {
    if (!type) return;
    localStorage.setItem("bookzyProfileType", type);
    localStorage.setItem("onboardingStep", "2");
    router.push("/setup/step2");
  };

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-6">
      
      {/* --- AMBIANCE DYNAMIQUE --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 left-1/4 w-[600px] h-[600px] bg-indigo-200/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-0 right-1/4 w-[600px] h-[600px] bg-blue-200/20 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* --- HEADER --- */}
      <div className="absolute top-6 left-6 md:top-8 md:left-8 flex items-center gap-2">
         <div className="w-8 h-8 md:w-10 md:h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg shadow-slate-900/10">
            <BookOpenSVG className="w-4 h-4 md:w-5 md:h-5 text-white" />
         </div>
         <span className="font-extrabold text-lg md:text-xl text-slate-900 tracking-tight hidden sm:block">Bookzy</span>
      </div>

      {/* --- PROGRESS --- */}
      <div className="absolute top-8 right-6 md:right-8 flex flex-col items-end">
         <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2">Étape 01 / 02</span>
         <div className="w-16 md:w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden">
            <div className="h-full w-1/2 bg-slate-900 rounded-full"></div>
         </div>
      </div>

      {/* --- CONTENU PRINCIPAL --- */}
      <div className="w-full max-w-5xl relative z-10 mt-16 md:mt-0">
        
        <div className="text-center mb-8 md:mb-12 space-y-3 md:space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-2">
             <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-amber-500 fill-amber-500" />
             <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wide">Bienvenue à bord</span>
          </div>
          <h1 className="text-3xl md:text-5xl font-black text-slate-900 tracking-tight px-4">
            Quel est votre objectif ?
          </h1>
          <p className="text-sm md:text-lg text-slate-500 max-w-lg mx-auto leading-relaxed px-4">
            Nous allons personnaliser votre tableau de bord.
          </p>
        </div>

        {/* --- GRID INTERACTIVE (2 colonnes mobile / 4 desktop) --- */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 md:gap-6 mb-8 md:mb-12 px-2 md:px-0">
          {profiles.map((p) => {
            const Icon = p.icon;
            const active = type === p.id;

            return (
              <button
                key={p.id}
                onClick={() => setType(p.id)}
                className={`
                  group relative h-48 md:h-64 rounded-2xl md:rounded-3xl border-2 text-left transition-all duration-300 flex flex-col justify-between p-4 md:p-6 overflow-hidden
                  ${active 
                    ? "border-slate-900 bg-white ring-2 md:ring-4 ring-slate-100 scale-[1.02] shadow-xl" 
                    : "border-transparent bg-white hover:border-slate-200 hover:shadow-lg hover:-translate-y-1 shadow-sm"
                  }
                `}
              >
                {/* Gradient Background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${p.gradient} opacity-0 transition-opacity duration-500 ${active ? 'opacity-[0.04]' : 'group-hover:opacity-[0.02]'}`}></div>

                <div className="relative z-10 w-full">
                   {/* Icon Box */}
                   <div className={`
                      w-10 h-10 md:w-14 md:h-14 rounded-xl md:rounded-2xl flex items-center justify-center mb-3 md:mb-4 transition-all duration-300 shadow-sm
                      ${active 
                        ? `bg-gradient-to-br ${p.gradient} text-white scale-110 shadow-md` 
                        : "bg-slate-50 text-slate-500 group-hover:bg-slate-100 group-hover:scale-105"
                      }
                   `}>
                      <Icon strokeWidth={2.5} className="w-5 h-5 md:w-7 md:h-7" />
                   </div>
                   
                   <h3 className={`text-sm md:text-lg font-bold transition-colors truncate ${active ? "text-slate-900" : "text-slate-700"}`}>
                      {p.label}
                   </h3>
                   <p className="text-[11px] md:text-sm text-slate-400 font-medium mt-0.5 md:mt-1 leading-snug truncate">
                      {p.desc}
                   </p>
                </div>

                {/* Checkmark animation (Responsive) */}
                <div className={`
                   flex items-center gap-1.5 md:gap-2 text-[10px] md:text-xs font-bold uppercase tracking-wider transition-all duration-300
                   ${active ? "text-slate-900 translate-y-0 opacity-100" : "text-slate-300 translate-y-4 opacity-0"}
                `}>
                   <div className="w-4 h-4 md:w-5 md:h-5 rounded-full bg-slate-900 flex items-center justify-center">
                      <Check className="w-2.5 h-2.5 md:w-3 md:h-3 text-white" />
                   </div>
                   <span className="hidden md:inline">Sélectionné</span>
                </div>
              </button>
            );
          })}
        </div>

        {/* --- ACTIONS --- */}
        <div className="flex justify-center pb-8 md:pb-0">
          <button
            onClick={handleContinue}
            disabled={!type}
            className={`
              relative group overflow-hidden rounded-2xl px-8 py-4 md:px-10 md:py-5 font-bold text-base md:text-lg transition-all duration-300 w-full md:w-auto
              ${type 
                ? "bg-slate-900 text-white shadow-xl shadow-slate-900/30 hover:shadow-2xl hover:scale-[1.02] cursor-pointer" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed"
              }
            `}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
               <span>Continuer l'aventure</span>
               <ArrowRight className={`w-4 h-4 md:w-5 md:h-5 transition-transform duration-300 ${type ? "group-hover:translate-x-1" : ""}`} />
            </div>
            
            {type && (
               <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            )}
          </button>
        </div>

      </div>
    </main>
  );
}