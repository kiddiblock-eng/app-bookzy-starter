"use client";

import { useState, useEffect } from "react";
import { X, Mail, Loader2, CheckCircle2, AlertCircle, AlertTriangle } from "lucide-react";

export default function EmailVerificationBanner({ user }) {
  const [isVisible, setIsVisible] = useState(false); // Caché par défaut pour éviter le flash
  const [resending, setResending] = useState(false);
  const [message, setMessage] = useState(null);

  // Vérifier le localStorage au montage seulement
  useEffect(() => {
    if (user && !user.emailVerified) {
      const dismissed = localStorage.getItem("emailBannerDismissed");
      if (!dismissed) {
        setIsVisible(true);
      }
    }
  }, [user]);

  // Si pas visible, on ne rend rien
  if (!isVisible) return null;

  const handleResend = async () => {
    setResending(true);
    setMessage(null);

    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        setMessage({
          type: "success",
          text: "Lien envoyé ! Vérifiez vos spams."
        });
        // On masque le message après 5 secondes
        setTimeout(() => setMessage(null), 5000);
      } else {
        setMessage({
          type: "error",
          text: data.error || "Erreur lors de l'envoi."
        });
      }
    } catch (error) {
      console.error("Erreur resend:", error);
      setMessage({
        type: "error",
        text: "Erreur de connexion."
      });
    } finally {
      setResending(false);
    }
  };

  const handleClose = () => {
    setIsVisible(false);
    if (typeof window !== "undefined") {
      localStorage.setItem("emailBannerDismissed", "true");
    }
  };

  return (
    // Design "Warning" subtil (Standard SaaS)
    <div className="bg-amber-50 border-b border-amber-200/60 relative">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-3">
        <div className="flex flex-col sm:flex-row items-start sm:items-center gap-3 sm:gap-6">
          
          {/* Icone & Texte Principal */}
          <div className="flex items-start gap-3 flex-1">
            <div className="p-2 bg-amber-100 text-amber-600 rounded-lg shrink-0 mt-0.5 sm:mt-0">
               <AlertTriangle size={18} />
            </div>
            <div className="text-sm text-slate-700">
              <p className="font-semibold text-slate-900">Vérification requise</p>
              <p className="mt-0.5">
                Validez votre adresse <span className="font-medium text-slate-900">{user.email}</span> pour débloquer toutes les fonctionnalités.
              </p>
            </div>
          </div>

          {/* Actions & Feedback */}
          <div className="flex items-center gap-3 w-full sm:w-auto pl-10 sm:pl-0">
            
            {/* Feedback Message (remplace le bouton temporairement ou s'affiche à côté) */}
            {message ? (
               <div className={`flex items-center gap-2 text-xs font-bold px-3 py-1.5 rounded-lg animate-fadeIn ${
                  message.type === 'success' ? 'bg-emerald-100 text-emerald-700' : 'bg-red-100 text-red-700'
               }`}>
                  {message.type === 'success' ? <CheckCircle2 size={14}/> : <AlertCircle size={14}/>}
                  {message.text}
               </div>
            ) : (
                <button
                    onClick={handleResend}
                    disabled={resending}
                    className="text-xs font-bold text-slate-600 hover:text-slate-900 bg-white border border-slate-200 hover:border-slate-300 px-3 py-1.5 rounded-lg transition-all flex items-center gap-2 disabled:opacity-50"
                >
                    {resending ? <Loader2 size={14} className="animate-spin"/> : <Mail size={14}/>}
                    {resending ? "Envoi..." : "Renvoyer l'email"}
                </button>
            )}

            {/* Bouton Fermer */}
            <button
              onClick={handleClose}
              className="p-1.5 text-slate-400 hover:text-slate-600 hover:bg-amber-100/50 rounded-lg transition-colors"
              aria-label="Fermer"
            >
              <X size={16} />
            </button>
          </div>

        </div>
      </div>
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(-2px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}