"use client";
import { Suspense } from "react";
import { useEffect, useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  CheckCircle2, 
  XCircle, 
  Loader2, 
  Mail,
  ArrowLeft,
  RefreshCw,
  ShieldCheck,
  AlertOctagon
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

function VerifyEmailPageContent() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [status, setStatus] = useState("loading"); // loading, success, error, alreadyVerified
  const [message, setMessage] = useState("");
  const [countdown, setCountdown] = useState(3);
  const [resending, setResending] = useState(false);

  // --- LOGIQUE API INTACTE ---
  // Vérification du token au chargement
  useEffect(() => {
    if (!token) {
      setStatus("error");
      setMessage("Token manquant. Lien invalide.");
      return;
    }

    verifyEmail(token);
  }, [token]);

  // Countdown avant redirect (si success)
  useEffect(() => {
    if (status === "success" && countdown > 0) {
      const timer = setTimeout(() => {
        setCountdown(countdown - 1);
      }, 1000);
      return () => clearTimeout(timer);
    }
    
    if (status === "success" && countdown === 0) {
      router.push("/dashboard");
    }
  }, [status, countdown, router]);

  // Fonction de vérification
  const verifyEmail = async (verifyToken) => {
    try {
      const response = await fetch(`/api/auth/verify-email?token=${verifyToken}`);
      const data = await response.json();

      if (response.ok && data.success) {
        if (data.alreadyVerified) {
          setStatus("alreadyVerified");
          setMessage("Ton email est déjà vérifié.");
        } else {
          setStatus("success");
          setMessage("Email vérifié avec succès !");
        }
      } else {
        setStatus("error");
        setMessage(data.error || "Une erreur est survenue.");
      }
    } catch (error) {
      console.error("Erreur verification:", error);
      setStatus("error");
      setMessage("Erreur de connexion au serveur.");
    }
  };

  // Fonction de renvoi d'email
  const handleResend = async () => {
    setResending(true);
    try {
      const response = await fetch("/api/auth/resend-verification", {
        method: "POST",
        headers: { "Content-Type": "application/json" }
      });

      const data = await response.json();

      if (response.ok && data.success) {
        alert("Email de vérification renvoyé ! Vérifie ta boîte mail.");
      } else {
        alert(data.error || "Erreur lors du renvoi.");
      }
    } catch (error) {
      console.error("Erreur resend:", error);
      alert("Erreur de connexion.");
    } finally {
      setResending(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-12">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-md z-10">
        
        {/* Card */}
        <div className="relative bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 text-center">

            {/* HEADER LOGO */}
            <div className="flex justify-center mb-8">
                <Link href="/" className="inline-flex items-center gap-2 group">
                    <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 transition-transform group-hover:scale-105">
                        <BookOpenSVG className="w-5 h-5 text-white" />
                    </div>
                    <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Bookzy</span>
                </Link>
            </div>

          {/* ==================== */}
          {/* ÉTAT: LOADING */}
          {/* ==================== */}
          {status === "loading" && (
            <div className="flex flex-col items-center">
              <div className="relative w-20 h-20 mb-6 flex items-center justify-center">
                 <div className="absolute inset-0 bg-slate-100 rounded-full animate-ping opacity-75"></div>
                 <div className="relative bg-white rounded-full p-4 border border-slate-100 shadow-sm">
                    <Loader2 className="w-10 h-10 text-slate-900 animate-spin" />
                 </div>
              </div>
              
              <h1 className="text-2xl font-bold text-slate-900 mb-2">
                Vérification en cours...
              </h1>
              <p className="text-slate-500 text-sm">
                Nous validons votre lien sécurisé.
              </p>
            </div>
          )}

          {/* ==================== */}
          {/* ÉTAT: SUCCESS */}
          {/* ==================== */}
          {status === "success" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
              <div className="w-20 h-20 bg-emerald-50 rounded-full flex items-center justify-center mb-6 border border-emerald-100 shadow-sm">
                <CheckCircle2 className="w-10 h-10 text-emerald-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Compte vérifié !
              </h1>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                Félicitations ! Votre adresse email a été confirmée avec succès. Vous avez maintenant accès à toutes les fonctionnalités.
              </p>
              
              <div className="w-full bg-emerald-50 border border-emerald-100 rounded-xl p-4 mb-6">
                <p className="text-emerald-800 text-xs font-semibold">
                  Redirection automatique dans <span className="text-lg font-black ml-1">{countdown}</span>s
                </p>
              </div>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
              >
                Accéder au Dashboard
              </button>
            </div>
          )}

          {/* ==================== */}
          {/* ÉTAT: ALREADY VERIFIED */}
          {/* ==================== */}
          {status === "alreadyVerified" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
              <div className="w-20 h-20 bg-blue-50 rounded-full flex items-center justify-center mb-6 border border-blue-100 shadow-sm">
                <ShieldCheck className="w-10 h-10 text-blue-600" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Déjà vérifié
              </h1>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                Ce compte est déjà actif et vérifié. Vous pouvez vous connecter en toute sécurité.
              </p>

              <button
                onClick={() => router.push("/dashboard")}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] mb-4"
              >
                Accéder au Dashboard
              </button>

              <Link
                href="/auth/login"
                className="text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                Retour à la connexion
              </Link>
            </div>
          )}

          {/* ==================== */}
          {/* ÉTAT: ERROR */}
          {/* ==================== */}
          {status === "error" && (
            <div className="animate-in fade-in slide-in-from-bottom-4 duration-500 flex flex-col items-center">
              <div className="w-20 h-20 bg-red-50 rounded-full flex items-center justify-center mb-6 border border-red-100 shadow-sm">
                <AlertOctagon className="w-10 h-10 text-red-500" />
              </div>
              <h1 className="text-2xl font-bold text-slate-900 mb-3">
                Lien invalide
              </h1>
              <p className="text-slate-500 mb-8 leading-relaxed text-sm">
                {message || "Ce lien de vérification a expiré ou est invalide. Veuillez en demander un nouveau."}
              </p>

              <button
                onClick={handleResend}
                disabled={resending}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mb-4"
              >
                {resending ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Envoi en cours...</span>
                  </>
                ) : (
                  <>
                    <RefreshCw className="w-4 h-4" />
                    <span>Renvoyer un email</span>
                  </>
                )}
              </button>

              <Link
                href="/auth/login"
                className="inline-flex items-center gap-2 text-sm font-medium text-slate-400 hover:text-slate-600 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Retour à la connexion
              </Link>
            </div>
          )}

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
            <p className="text-xs text-slate-400 font-medium">
               Problème ? <a href="mailto:support@bookzy.io" className="text-slate-600 hover:underline">Contactez le support</a>
            </p>
        </div>

      </div>
    </main>
  );
}
export default function VerifyEmailPage() {
  return (
    <Suspense fallback={<div className="flex items-center justify-center min-h-screen"><div className="text-lg">Chargement...</div></div>}>
      <VerifyEmailPageContent />
    </Suspense>
  );
}