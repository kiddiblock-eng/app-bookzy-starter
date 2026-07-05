"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Youtube, Loader2, AlertCircle, ArrowRight } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";
import InsufficientCreditsModal from "@/components/ui/InsufficientCreditsModal";

export default function YoubookPage() {
  const router = useRouter();

  const [url, setUrl] = useState("");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [error, setError] = useState("");
  const [errorType, setErrorType] = useState("");
  const [progress, setProgress] = useState(0);

  const { balance, showModal, setShowModal, modalAction, mutateBalance } = useCredits();

  const handleAnalyze = async () => {
    if (!url || isAnalyzing) return;

    if (!url.includes("youtube.com") && !url.includes("youtu.be")) {
      setError("Entre un lien YouTube valide.");
      setErrorType("general");
      return;
    }

    setIsAnalyzing(true);
    setError("");
    setErrorType("");
    setProgress(0);

    const progressInterval = setInterval(() => {
      setProgress(prev => {
        if (prev >= 90) { clearInterval(progressInterval); return prev; }
        return prev + Math.random() * 15;
      });
    }, 300);

    try {
      const res = await fetch("/api/content/analyze-youtube", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url }),
      });
      const data = await res.json();
      if (data?.locked) { clearInterval(progressInterval); window.location.href = data.redirectTo || "/dashboard/tarifs"; return; }

      clearInterval(progressInterval);
      setProgress(100);

      if (data.success) {
        mutateBalance();
        sessionStorage.setItem("youbookResult", JSON.stringify(data.analysis));
        setTimeout(() => router.push("/dashboard/youbook/result"), 500);
      } else if (data.needsOffer) {
        window.dispatchEvent(new CustomEvent("bookzy:upgrade", { detail: { title: data.message } }));
        setIsAnalyzing(false);
        setProgress(0);
      } else {
        if (data.quotaExceeded) {
          setErrorType("quota");
          setError(data.message || "Quota journalier épuisé.");
        } else if (data.insufficientCredits) {
          setErrorType("credits");
          setError("Crédits insuffisants pour analyser cette vidéo.");
        } else {
          setErrorType("general");
          setError(data.message || "Impossible d'analyser cette vidéo");
        }
        setIsAnalyzing(false);
        setProgress(0);
      }
    } catch (err) {
      clearInterval(progressInterval);
      setError("Erreur de connexion au serveur");
      setErrorType("general");
      setIsAnalyzing(false);
      setProgress(0);
    }
  };

  return (
    <div className="min-h-[calc(100dvh-56px)] bg-white flex items-center justify-center px-4 py-12">
      <InsufficientCreditsModal
        open={showModal}
        onClose={() => setShowModal(false)}
        action={modalAction}
        balance={balance}
      />

      <div className="w-full max-w-xl">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="inline-flex items-center justify-center w-12 h-12 rounded-2xl bg-neutral-900 mb-5">
            <Youtube className="w-6 h-6 text-white" />
          </div>
          <h1 className="text-2xl sm:text-3xl font-semibold text-neutral-900 mb-2">Youbook</h1>
          <p className="text-neutral-500 text-sm">Transforme une vidéo YouTube en ebook structuré.</p>
        </div>

        {/* Input */}
        <form onSubmit={(e) => { e.preventDefault(); handleAnalyze(); }}>
          <input
            type="url"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            placeholder="Colle le lien YouTube ici"
            disabled={isAnalyzing}
            className="w-full px-5 py-4 bg-white border border-neutral-200 rounded-[28px] text-[15px] text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all disabled:opacity-50"
          />
        </form>

        {/* Progress */}
        {isAnalyzing && (
          <div className="mt-5 space-y-2">
            <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
              <div className="h-full bg-neutral-900 rounded-full transition-all duration-500" style={{ width: `${progress}%` }} />
            </div>
            <p className="text-xs text-neutral-500 text-center">Analyse en cours… {Math.round(progress)}%</p>
          </div>
        )}

        {/* Bouton */}
        <button
          type="button"
          onClick={handleAnalyze}
          disabled={isAnalyzing || !url}
          className="mt-4 w-full py-3.5 bg-neutral-900 hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 text-white rounded-xl text-sm font-semibold transition-colors flex items-center justify-center gap-2"
        >
          {isAnalyzing ? (
            <><Loader2 className="w-4 h-4 animate-spin" />Analyse en cours…</>
          ) : (
            <>Transformer en ebook<ArrowRight className="w-4 h-4" /></>
          )}
        </button>

        {/* Error */}
        {error && (
          <div className="mt-5 p-4 bg-red-50 border border-red-200 rounded-xl flex items-start gap-3">
            <AlertCircle className="w-5 h-5 text-red-600 shrink-0 mt-0.5" />
            <div className="flex-1">
              <p className="text-sm text-red-700">{error}</p>
              {(errorType === "credits" || errorType === "quota") && (
                <button
                  onClick={() => router.push("/dashboard/tarifs")}
                  className="mt-3 inline-flex items-center gap-1.5 px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white text-xs font-semibold rounded-lg transition-colors"
                >
                  Voir les offres <ArrowRight size={12} />
                </button>
              )}
            </div>
          </div>
        )}

        <p className="mt-6 text-center text-xs text-neutral-400">
          Colle un lien, l'IA en fait un ebook structuré prêt à éditer.
        </p>
      </div>
    </div>
  );
}
