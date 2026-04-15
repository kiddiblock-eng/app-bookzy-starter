"use client";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { ArrowRight, Search, BarChart2, BookOpen } from "lucide-react";

function BookOpenSVG(props) {
  return (
    <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
      <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
    </svg>
  );
}

const options = [
  {
    id: "valider",
    icon: BarChart2,
    color: "#7c3aed",
    title: "J'ai une idée à valider",
    desc: "Je veux savoir si mon idée va se vendre avant de créer.",
    href: "/dashboard/analyseur",
  },
  {
    id: "chercher",
    icon: Search,
    color: "#0891b2",
    title: "Je cherche une idée",
    desc: "Je veux espionner ce qui se vend et trouver une niche rentable.",
    href: "/dashboard/radar-cash",
  },
  {
    id: "creer",
    icon: BookOpen,
    color: "#2563eb",
    title: "Je veux créer directement",
    desc: "J'ai mon sujet, je veux générer mon ebook maintenant.",
    href: "/dashboard/projets/nouveau",
  },
];

export default function Step2() {
  const [choice, setChoice] = useState("");
  const router = useRouter();

  useEffect(() => {
    const step = localStorage.getItem("onboardingStep");
    if (step !== "2") router.push("/setup/step1");
  }, [router]);

  const handleContinue = () => {
    if (!choice) return;
    localStorage.setItem("onboardingStep", "done");
    const selected = options.find(o => o.id === choice);
    router.push(selected.href);
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
        <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Étape 2 / 2</span>
        <div className="w-20 h-1.5 bg-slate-200 rounded-full overflow-hidden">
          <div className="h-full w-full bg-slate-900 rounded-full" />
        </div>
      </div>

      <div className="w-full max-w-2xl mt-8">

        {/* Titre */}
        <div className="text-center mb-10">
          <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight mb-3">
            Par où voulez-vous commencer ?
          </h1>
          <p className="text-slate-500 text-base">
            Vous pouvez changer à tout moment depuis le dashboard.
          </p>
        </div>

        {/* Options */}
        <div className="flex flex-col gap-3 mb-10">
          {options.map((o) => {
            const Icon = o.icon;
            const selected = choice === o.id;
            return (
              <button
                key={o.id}
                onClick={() => setChoice(o.id)}
                className={`w-full flex items-center gap-5 p-5 rounded-2xl border-2 bg-white text-left transition-all duration-200 ${
                  selected ? "border-slate-900 shadow-md" : "border-[#E8E8E8] hover:border-slate-300"
                }`}
              >
                <div className="w-12 h-12 rounded-xl flex items-center justify-center flex-shrink-0" style={{ background: `${o.color}18` }}>
                  <Icon className="w-6 h-6" style={{ color: o.color }} strokeWidth={2} />
                </div>
                <div className="flex-1">
                  <p className={`font-black text-base ${selected ? "text-slate-900" : "text-slate-700"}`}>{o.title}</p>
                  <p className="text-sm text-slate-400 mt-0.5">{o.desc}</p>
                </div>
                <div className={`w-5 h-5 rounded-full border-2 flex-shrink-0 transition-all ${selected ? "bg-slate-900 border-slate-900" : "border-slate-300"}`}>
                  {selected && <div className="w-full h-full rounded-full flex items-center justify-center"><div className="w-2 h-2 rounded-full bg-white" /></div>}
                </div>
              </button>
            );
          })}
        </div>

        {/* Crédits offerts */}
        <div className="bg-white border border-[#E8E8E8] rounded-2xl p-4 flex items-center gap-4 mb-8">
          <div className="w-10 h-10 rounded-xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <span className="text-lg">🎁</span>
          </div>
          <div>
            <p className="font-black text-slate-900 text-sm">4 crédits offerts sur votre compte</p>
            <p className="text-xs text-slate-400 mt-0.5">Suffisant pour valider une idée ou voir un aperçu gratuit de votre ebook.</p>
          </div>
        </div>

        {/* CTA */}
        <div className="flex justify-center">
          <button
            onClick={handleContinue}
            disabled={!choice}
            className={`inline-flex items-center gap-3 px-10 py-4 rounded-xl font-black text-sm uppercase tracking-widest transition-all ${
              choice ? "bg-slate-900 text-white hover:bg-slate-800" : "bg-slate-200 text-slate-400 cursor-not-allowed"
            }`}
          >
            Accéder à Bookzy
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </main>
  );
}