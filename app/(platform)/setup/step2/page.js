"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { 
  Globe, 
  MapPin, 
  Layers, 
  ArrowRight, 
  Sparkles, 
  Loader2, 
  Briefcase, 
  Heart, 
  Lightbulb, 
  TrendingUp, 
  Smartphone, 
  Palette,
  CheckCircle2
} from "lucide-react";
import countriesData from "../../utils/countries.json";

/* --- LOGO --- */
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

const languages = [
  { value: "fr", label: "Français", flag: "🇫🇷" },
  { value: "en", label: "Anglais", flag: "🇬🇧" },
  { value: "es", label: "Espagnol", flag: "🇪🇸" },
  { value: "pt", label: "Portugais", flag: "🇵🇹" },
  { value: "de", label: "Allemand", flag: "🇩🇪" },
];

/* 🔥 NOUVEAU : LES NICHES (Plus pertinent que les objectifs) */
const niches = [
  {
    id: "business",
    label: "Business & Argent",
    icon: TrendingUp,
    color: "text-emerald-600",
    bg: "bg-emerald-50",
    border: "border-emerald-200",
    activeBorder: "border-emerald-600"
  },
  {
    id: "sante",
    label: "Santé & Bien-être",
    icon: Heart,
    color: "text-rose-600",
    bg: "bg-rose-50",
    border: "border-rose-200",
    activeBorder: "border-rose-600"
  },
  {
    id: "tech",
    label: "Tech & IA",
    icon: Smartphone,
    color: "text-blue-600",
    bg: "bg-blue-50",
    border: "border-blue-200",
    activeBorder: "border-blue-600"
  },
  {
    id: "dev_perso",
    label: "Dév. Personnel",
    icon: Lightbulb,
    color: "text-amber-600",
    bg: "bg-amber-50",
    border: "border-amber-200",
    activeBorder: "border-amber-600"
  },
  {
    id: "marketing",
    label: "Marketing & Vente",
    icon: Briefcase,
    color: "text-purple-600",
    bg: "bg-purple-50",
    border: "border-purple-200",
    activeBorder: "border-purple-600"
  },
  {
    id: "lifestyle",
    label: "Lifestyle & Art",
    icon: Palette,
    color: "text-pink-600",
    bg: "bg-pink-50",
    border: "border-pink-200",
    activeBorder: "border-pink-600"
  },
];

export default function Step2() {
  const [form, setForm] = useState({ country: "", language: "", niche: "" });
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    const step = localStorage.getItem("onboardingStep");
    if (step !== "2") router.push("/setup/step1");
  }, [router]);

  useEffect(() => {
    const detectLocation = async () => {
      setIsLoading(true);
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          async (position) => {
            const { latitude, longitude } = position.coords;
            try {
              const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=fr`);
              const data = await response.json();
              const detected = countriesData.find((c) => c.name.toLowerCase() === data.countryName?.toLowerCase() || c.code === data.countryCode);
              setForm({ country: detected?.name || data.countryName || "", language: detected?.lang || "fr", niche: "" });
            } catch (error) {
              setForm({ country: "France", language: "fr", niche: "" });
            }
            setIsLoading(false);
          },
          () => {
            setForm({ country: "France", language: "fr", niche: "" });
            setIsLoading(false);
          }
        );
      } else { setIsLoading(false); }
    };
    detectLocation();
  }, []);

  const handleSubmit = () => {
    if (!form.country || !form.language || !form.niche) return;
    localStorage.setItem("bookzyUserNiche", form.niche); // On sauvegarde la niche
    localStorage.setItem("onboardingStep", "done");
    router.push("https://app.bookzy.io/dashboard");
  };

  const isComplete = form.country && form.language && form.niche;

  return (
    <main className="min-h-screen bg-slate-50 relative overflow-hidden flex flex-col items-center justify-center p-4 md:p-6">
      
      {/* --- BACKGROUND --- */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-0 right-1/4 w-[600px] h-[600px] bg-emerald-100/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse"></div>
        <div className="absolute bottom-0 left-1/4 w-[600px] h-[600px] bg-blue-100/30 rounded-full blur-[120px] mix-blend-multiply animate-pulse" style={{ animationDelay: '2s' }}></div>
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
         <span className="text-[10px] md:text-xs font-bold text-slate-400 uppercase tracking-widest mb-1.5 md:mb-2">Étape 02 / 02</span>
         <div className="w-16 md:w-24 h-1.5 bg-slate-200 rounded-full overflow-hidden flex">
            <div className="h-full w-full bg-slate-900 rounded-full animate-in slide-in-from-left duration-1000"></div>
         </div>
      </div>

      {/* --- CONTENT --- */}
      <div className="w-full max-w-5xl relative z-10 mt-16 md:mt-0">
        
        <div className="text-center mb-10 space-y-3">
          <div className="inline-flex items-center gap-2 px-3 py-1 md:px-4 md:py-1.5 rounded-full bg-white border border-slate-200 shadow-sm mb-2">
             <Sparkles className="w-3 h-3 md:w-4 md:h-4 text-purple-500 fill-purple-500" />
             <span className="text-[10px] md:text-xs font-bold text-slate-600 uppercase tracking-wide">Personnalisation</span>
          </div>
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight px-4">
            Calibrons votre IA
          </h1>
          <p className="text-sm md:text-lg text-slate-500 max-w-lg mx-auto px-4">
            Choisissez votre domaine de prédilection pour adapter les modèles de génération.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 md:gap-8 mb-10 px-2 md:px-0">
            
            {/* LEFT: LOCATION (30%) */}
            <div className="lg:col-span-4 space-y-6">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 h-full flex flex-col">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6 flex items-center gap-2">
                        <MapPin size={16} className="text-blue-500" /> Paramètres Régionaux
                    </h3>
                    
                    <div className="space-y-5 flex-1">
                        {/* Pays */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-2 block">Pays de résidence</label>
                            {isLoading ? (
                                <div className="h-12 bg-slate-50 rounded-xl flex items-center justify-center text-slate-400 gap-2 text-sm border border-slate-200 border-dashed">
                                    <Loader2 size={16} className="animate-spin" /> Détection...
                                </div>
                            ) : (
                                <select 
                                    value={form.country}
                                    onChange={(e) => setForm({...form, country: e.target.value})}
                                    className="w-full h-12 px-4 rounded-xl border border-slate-200 bg-slate-50 text-slate-900 text-sm font-medium focus:ring-2 focus:ring-slate-900 focus:border-transparent outline-none transition-all cursor-pointer hover:bg-white"
                                >
                                    <option value="">Choisir...</option>
                                    {countriesData.map((c) => (
                                        <option key={c.code} value={c.name}>{c.flag} {c.name}</option>
                                    ))}
                                </select>
                            )}
                        </div>

                        {/* Langue (Grille Compacte) */}
                        <div>
                            <label className="text-xs font-semibold text-slate-500 mb-2 block">Langue de l'interface</label>
                            <div className="grid grid-cols-3 gap-2">
                                {languages.map((lang) => (
                                    <button
                                        key={lang.value}
                                        onClick={() => setForm({...form, language: lang.value})}
                                        className={`
                                            flex flex-col items-center justify-center py-2 px-1 rounded-xl border transition-all duration-200
                                            ${form.language === lang.value 
                                                ? "bg-slate-900 border-slate-900 text-white shadow-md transform scale-[1.05]" 
                                                : "bg-slate-50 border-slate-200 text-slate-500 hover:bg-white hover:text-slate-700"
                                            }
                                        `}
                                    >
                                        <span className="text-lg mb-1">{lang.flag}</span>
                                        <span className="text-[10px] font-bold uppercase">{lang.value}</span>
                                    </button>
                                ))}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* RIGHT: NICHES (70%) */}
            <div className="lg:col-span-8">
                <div className="bg-white p-6 rounded-3xl border border-slate-100 shadow-xl shadow-slate-200/50 h-full">
                    <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wide mb-6 flex items-center gap-2">
                        <Layers size={16} className="text-purple-500" /> Votre Domaine (Niche)
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4">
                        {niches.map((niche) => {
                            const Icon = niche.icon;
                            const isSelected = form.niche === niche.id;
                            return (
                                <button
                                    key={niche.id}
                                    onClick={() => setForm({...form, niche: niche.id})}
                                    className={`
                                        relative group p-4 md:p-5 rounded-2xl border-2 text-left transition-all duration-200 flex flex-col items-center text-center justify-center gap-3
                                        ${isSelected 
                                            ? `bg-white ${niche.activeBorder} ring-4 ring-slate-50 scale-[1.02] shadow-lg` 
                                            : `bg-slate-50 border-transparent hover:bg-white hover:border-slate-200 hover:shadow-md`
                                        }
                                    `}
                                >
                                    {/* Icon Bubble */}
                                    <div className={`
                                        w-12 h-12 rounded-full flex items-center justify-center transition-colors
                                        ${isSelected ? niche.bg : "bg-white group-hover:scale-110 duration-300"}
                                    `}>
                                        <Icon size={22} className={isSelected ? niche.color : "text-slate-400 group-hover:text-slate-600"} strokeWidth={2.5} />
                                    </div>

                                    {/* Label */}
                                    <span className={`text-sm font-bold transition-colors ${isSelected ? "text-slate-900" : "text-slate-600"}`}>
                                        {niche.label}
                                    </span>

                                    {/* Checkmark Absolute */}
                                    {isSelected && (
                                        <div className="absolute top-3 right-3 animate-in zoom-in duration-200">
                                            <CheckCircle2 size={18} className={`${niche.color} fill-current text-white`} />
                                        </div>
                                    )}
                                </button>
                            );
                        })}
                    </div>
                    <p className="text-xs text-slate-400 mt-6 text-center italic">
                        * Ce choix aidera l'IA à suggérer des sujets pertinents.
                    </p>
                </div>
            </div>

        </div>

        {/* --- ACTIONS --- */}
        <div className="flex justify-center pb-8 md:pb-0">
          <button
            onClick={handleSubmit}
            disabled={!isComplete}
            className={`
              relative group overflow-hidden rounded-2xl px-12 py-4 md:py-5 font-bold text-base md:text-lg transition-all duration-300 w-full md:w-auto shadow-xl
              ${isComplete 
                ? "bg-slate-900 text-white hover:shadow-2xl hover:scale-[1.02] cursor-pointer shadow-slate-900/20" 
                : "bg-slate-200 text-slate-400 cursor-not-allowed shadow-none"
              }
            `}
          >
            <div className="relative z-10 flex items-center justify-center gap-3">
               <span>Accéder au Dashboard</span>
               <ArrowRight className={`w-5 h-5 transition-transform duration-300 ${isComplete ? "group-hover:translate-x-1" : ""}`} />
            </div>
            
            {/* Animation brillance */}
            {isComplete && (
               <div className="absolute inset-0 -translate-x-full group-hover:translate-x-full transition-transform duration-700 bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-12"></div>
            )}
          </button>
        </div>

      </div>
    </main>
  );
}