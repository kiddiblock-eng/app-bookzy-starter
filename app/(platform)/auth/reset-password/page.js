"use client";

import { useState } from "react";
import { useSearchParams, useRouter } from "next/navigation";
import Link from "next/link";
import { 
  Lock, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  ArrowRight,
  ShieldCheck,
  KeyRound,
  ArrowLeft
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

export default function ResetPasswordPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const token = searchParams.get("token");

  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // --- LOGIQUE API INTACTE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    if (!password || !confirm) {
      return setError("Tous les champs sont obligatoires.");
    }
    if (password.length < 8) {
      return setError("Le mot de passe doit contenir au moins 8 caractères.");
    }
    if (password !== confirm) {
      return setError("Les mots de passe ne correspondent pas.");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/auth/reset-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token, password }),
      });

      const data = await res.json();
      
      if (!res.ok) {
        throw new Error(data.message || "Erreur de réinitialisation.");
      }

      setSuccess(true);
      
      setTimeout(() => {
        router.push("/auth/login?reset=success");
      }, 2000);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // --- CAS TOKEN INVALIDE (Style Clean & White) ---
  if (!token) {
    return (
      <main className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-12">
        <div className="relative w-full max-w-md z-10">
            <div className="relative bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10 text-center">
                
                {/* Header Token Invalide */}
                <div className="flex justify-center mb-6">
                   <div className="w-16 h-16 bg-red-50 rounded-2xl flex items-center justify-center border border-red-100 shadow-sm">
                      <AlertCircle className="w-8 h-8 text-red-500" />
                   </div>
                </div>

                <h1 className="text-2xl font-bold text-slate-900 mb-2">Lien invalide ou expiré</h1>
                <p className="text-slate-500 text-sm mb-8">
                   Ce lien de réinitialisation ne semble plus fonctionner. Il a peut-être déjà été utilisé ou a expiré.
                </p>

                <Link
                  href="/auth/forgot-password"
                  className="w-full flex items-center justify-center gap-2 py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 transition-all active:scale-[0.98]"
                >
                  <span>Faire une nouvelle demande</span>
                  <ArrowRight className="w-4 h-4" />
                </Link>

                <div className="mt-6 pt-6 border-t border-slate-100">
                   <Link href="/" className="inline-flex items-center gap-2 text-sm font-semibold text-slate-400 hover:text-slate-600 transition-colors">
                      <ArrowLeft className="w-4 h-4" /> Retour à l'accueil
                   </Link>
                </div>
            </div>
        </div>
      </main>
    );
  }

  // --- PAGE PRINCIPALE (Style Clean & White) ---
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
        <div className="relative bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-8 md:p-10">

          {/* Header */}
          <div className="text-center mb-8">
             <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
                <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 transition-transform group-hover:scale-105">
                    <BookOpenSVG className="w-5 h-5 text-white" />
                </div>
                <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Bookzy</span>
             </Link>

            <div className="flex justify-center mb-4">
                <div className="w-14 h-14 bg-slate-50 rounded-full flex items-center justify-center border border-slate-100">
                    <Lock className="w-7 h-7 text-slate-400" />
                </div>
            </div>

            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Nouveau mot de passe
            </h1>
            <p className="text-slate-500 text-sm">
              Choisissez un mot de passe sécurisé pour protéger votre compte.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-800 text-sm font-semibold mb-1">Mot de passe mis à jour !</p>
                  <p className="text-emerald-700 text-xs">Redirection vers la connexion...</p>
                </div>
              </div>
            </div>
          )}

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* New Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">
                Nouveau mot de passe
              </label>
              <div className="relative group">
                <KeyRound className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all"
                  placeholder="8 caractères minimum"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Confirm Password */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">
                Confirmer
              </label>
              <div className="relative group">
                <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  type={showConfirm ? "text" : "password"}
                  required
                  value={confirm}
                  onChange={(e) => setConfirm(e.target.value)}
                  className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all"
                  placeholder="Répétez le mot de passe"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirm(!showConfirm)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirm ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-4"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>Mise à jour...</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Succès !</span>
                </>
              ) : (
                <>
                  <span>Réinitialiser le mot de passe</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

        </div>

        {/* Footer */}
        <div className="mt-8 text-center">
             <Link href="/auth/login" className="text-sm font-medium text-slate-500 hover:text-slate-900 transition-colors">
                Annuler et retourner à la connexion
             </Link>
        </div>

      </div>
    </main>
  );
}