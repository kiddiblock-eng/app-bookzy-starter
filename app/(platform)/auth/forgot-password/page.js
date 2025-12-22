"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  Mail, 
  Loader2, 
  CheckCircle2, 
  AlertCircle, 
  ArrowRight,
  ArrowLeft,
  KeyRound
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

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  // --- LOGIQUE API INTACTE ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);
    setLoading(true);

    try {
      const res = await fetch("/api/auth/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      
      if (!res.ok) throw new Error(data.message || "Erreur lors de l'envoi du lien");
      
      setSuccess(true);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
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
                    <KeyRound className="w-7 h-7 text-slate-400" />
                </div>
            </div>
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Mot de passe oublié ?
            </h1>
            <p className="text-slate-500 text-sm">
               Entrez votre email pour recevoir les instructions de réinitialisation.
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl animate-in fade-in slide-in-from-top-2 duration-300">
              <div className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-emerald-800 text-sm font-semibold mb-1">Email envoyé !</p>
                  <p className="text-emerald-700 text-xs">Vérifiez votre boîte de réception (et vos spams).</p>
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
            {/* Email Input */}
            <div className="space-y-1.5">
              <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all"
                  placeholder="nom@exemple.com"
                  disabled={success}
                />
              </div>
            </div>

            {/* Submit Button */}
            {!success && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Envoi...</span>
                  </>
                ) : (
                  <>
                    <span>Envoyer le lien</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            )}

            {/* Resend Button */}
            {success && (
              <button
                type="submit"
                disabled={loading}
                className="w-full py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl transition-all flex items-center justify-center gap-2"
              >
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin text-slate-400" />
                    <span className="text-slate-500">Patientez...</span>
                  </>
                ) : (
                  <>
                    <Mail className="w-4 h-4 text-slate-500" />
                    <span>Renvoyer l&apos;email</span>
                  </>
                )}
              </button>
            )}
          </form>

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">
                Retrouvé la mémoire ?
              </span>
            </div>
          </div>

          {/* Back to Login */}
          <Link
            href="https://app.bookzy.io/auth/login"
            className="flex items-center justify-center gap-2 w-full py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl transition-all group"
          >
            <ArrowLeft className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:-translate-x-1 transition-all" />
            <span>Retour à la connexion</span>
          </Link>
        </div>

        {/* Bottom info */}
        <p className="text-xs text-slate-400 text-center mt-6 font-medium">
          Lien sécurisé expire dans 60 min.
        </p>
      </div>
    </main>
  );
}