"use client";
import { useEffect, useState } from "react";
import { Loader2, CheckCircle2, Sparkles } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function GenerationPage() {
  const { id } = useParams();
  const router = useRouter();
  const [progress, setProgress] = useState(0);
  const [step, setStep] = useState(0);
  const [error, setError] = useState(null);

  const steps = [
    "Analyse du sujet et du ton d’écriture...",
    "Création du contenu principal de ton eBook...",
    "Génération de la couverture professionnelle...",
    "Création des textes publicitaires optimisés...",
    "Préparation du kit complet (eBook + visuels)...",
  ];

  useEffect(() => {
    // 🚀 Démarre la génération IA réelle
    async function startGeneration() {
      try {
        const res = await fetch("/api/ebooks/generate", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          credentials: "include",
          body: JSON.stringify({ projetId: id }),
        });

        const data = await res.json();
        if (!res.ok || !data.success) {
          throw new Error(data.message || "Erreur lors du démarrage de la génération IA.");
        }

        console.log("✅ Génération IA lancée avec succès :", data);
      } catch (err) {
        console.error("❌ Erreur génération IA :", err);
        setError(err.message);
      }
    }

    startGeneration();

    // ⏱️ Animation de la barre de progression
    const interval = setInterval(() => {
      setProgress((prev) => Math.min(prev + Math.random() * 12, 100));
      setStep((s) => (s < steps.length - 1 ? s + 1 : s));
    }, 1500);

    // 🔁 Redirection vers la page du kit après environ 12 secondes
    const redirectTimeout = setTimeout(() => {
      router.push(`/dashboard/projets/${id}/kit`);
    }, 12000);

    return () => {
      clearInterval(interval);
      clearTimeout(redirectTimeout);
    };
  }, [id, router]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 flex flex-col items-center justify-center text-center p-6">
      <div className="max-w-lg bg-white/90 backdrop-blur-xl border border-white/50 rounded-3xl p-10 shadow-2xl">
        <div className="animate-bounce mb-4">
          <Sparkles className="w-12 h-12 text-purple-600 mx-auto" />
        </div>

        <h1 className="text-2xl md:text-3xl font-bold text-slate-900 mb-3">
          Génération de ton eBook en cours...
        </h1>

        {/* 🔔 Message d’erreur éventuel */}
        {error ? (
          <p className="text-red-600 font-medium mb-8">
            ⚠️ {error} <br />
            Merci de réessayer plus tard.
          </p>
        ) : (
          <p className="text-slate-500 mb-8">{steps[step]}</p>
        )}

        <div className="w-full bg-slate-200 rounded-full h-3 overflow-hidden mb-6">
          <div
            className="h-full bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 transition-all duration-500"
            style={{ width: `${progress}%` }}
          ></div>
        </div>

        {progress < 100 ? (
          <div className="flex items-center justify-center gap-2 text-blue-600 font-medium">
            <Loader2 className="w-5 h-5 animate-spin" /> L’IA travaille...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2 text-green-600 font-semibold">
            <CheckCircle2 className="w-6 h-6" /> Génération terminée !
          </div>
        )}
      </div>

      <p className="mt-8 text-sm text-slate-500 animate-pulse">
        Préparation de ton kit en cours...
      </p>
    </div>
  );
}
