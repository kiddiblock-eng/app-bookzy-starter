"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Heart, TrendingUp, Smartphone, Lightbulb, Briefcase, Palette, ArrowRight, Check } from "lucide-react";

function BookOpenSVG(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

const niches = [
  { id: "business",   label: "Business & Argent",    icon: TrendingUp, color: "#10b981" },
  { id: "sante",      label: "Santé & Bien-être",     icon: Heart,      color: "#ef4444" },
  { id: "tech",       label: "Tech & IA",             icon: Smartphone, color: "#3b82f6" },
  { id: "dev_perso",  label: "Développement personnel", icon: Lightbulb, color: "#f59e0b" },
  { id: "marketing",  label: "Marketing & Vente",     icon: Briefcase,  color: "#8b5cf6" },
  { id: "lifestyle",  label: "Lifestyle & Art",       icon: Palette,    color: "#ec4899" },
];

export default function Step1() {
  const [niche, setNiche] = useState("");
  const router = useRouter();

  useEffect(() => {
    const step = localStorage.getItem("onboardingStep");
    if (step !== "1") router.push("/auth/register");
  }, [router]);

  const handleContinue = () => {
    if (!niche) return;
    localStorage.setItem("bookzyUserNiche", niche);
    localStorage.setItem("onboardingStep", "2");
    router.push("/setup/step2");
  };

  return (
    <main className="min-h-screen bg-[#F5F2ED] flex flex-col items-center justify-center px-5 py-12">

      {/* Header */}
      <div className="absolute top-6 left-6 flex items-center gap-2">
        <div className="w-8 h-8 bg-slate-900 rounded-xl flex items-center justify-center">
          <BookOpenSVG className="w-4 h-4 text-white" />
        </div>
        <span className="font-bold text-slate-900">Bookzy</span>
      </div>

      {/* Progress */}
      <div className="absolute top-8 right-6 flex flex-col items-end gap-1.5">
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Étape 1 / 2</span>
        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-slate-900 rounded-full" />
        </div>
      </div>

      <div className="w-full max-w-2xl mt-8">

        {/* Titre */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Quel est votre domaine ?
          </h1>
          <p className="text-slate-500 text-base">
            Cela permet à Bookzy de vous suggérer des produits digitaux qui cartonnent dans votre domaine.
          </p>
        </div>

        {/* Niches */}
        <div className="grid grid-cols-2 md:grid-cols-3 gap-3 mb-10">
          {niches.map((n) => {
            const Icon = n.icon;
            const selected = niche === n.id;
            return (
              <button
                key={n.id}
                onClick={() => setNiche(n.id)}
                className={`relative p-5 rounded-2xl border-2 text-left transition-all duration-200 bg-white ${
                  selected ? "border-slate-900 shadow-md" : "border-[#E8E8E8] hover:border-slate-300"
                }`}
              >
                <div className="w-10 h-10 rounded-xl flex items-center justify-center mb-3" style={{ background: `${n.color}18` }}>
                  <Icon className="w-5 h-5" style={{ color: n.color }} strokeWidth={2.5} />
                </div>
                <p className={`text-sm font-bold ${selected ? "text-slate-900" : "text-slate-600"}`}>{n.label}</p>
                {selected && (
                  <div className="absolute top-3 right-3 w-5 h-5 rounded-full bg-slate-900 flex items-center justify-center">
                    <Check className="w-3 h-3 text-white" strokeWidth={3} />
                  </div>
                )}
              </button>
            );
          })}
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!niche}
            className={`inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
              niche ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Continuer
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </main>
  );
}