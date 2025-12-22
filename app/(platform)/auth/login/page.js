"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useSWRConfig } from "swr"; // ✅ Ajout pour nettoyer le cache
import { 
  Loader2, Mail, Lock, Eye, EyeOff, CheckCircle2, 
  AlertCircle, ArrowRight, ShieldCheck
} from "lucide-react";

/* --- LOGO SVG --- */
function BookOpenSVG(props) {
    return (
        <svg {...props} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
        </svg>
    );
}

export default function LoginPage() {
  const router = useRouter();
  const { mutate } = useSWRConfig(); // ✅ Pour gérer le cache

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState(false);
  
  // 2FA
  const [need2FA, setNeed2FA] = useState(false);
  const [twoFA, setTwoFA] = useState("");

  const errorMessages = {
    'Invalid credentials': 'Email ou mot de passe incorrect',
    'User not found': 'Aucun compte avec cet email',
    'Email not verified': 'Vérifie ton email avant de te connecter',
    'Too many attempts': 'Trop de tentatives. Réessaye dans 5 minutes',
    'Network error': 'Problème de connexion. Vérifie ta connexion internet'
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    const cleanEmail = email.trim().toLowerCase();

    try {
      const res = await fetch("/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          email: cleanEmail,
          password,
          twoFA: need2FA ? twoFA : undefined,
        }),
      });

      const data = await res.json();

      if (data.require2FA) {
        setNeed2FA(true);
        setLoading(false);
        return;
      }

      if (!data.success) {
        throw new Error(data.message);
      }

      // Succès
      localStorage.setItem("bookzyUserId", data.data.user.id);
      setSuccess(true);

      // ✅ OPTIMISATION : On vide le cache SWR pour forcer le rechargement propre des données
      // au cas où l'utilisateur se reconnecte avec un autre compte sur le même PC
      await mutate(() => true, undefined, { revalidate: false });

      // ✅ VITESSE : Redirection plus rapide (500ms au lieu de 800ms)
      setTimeout(() => {
        // On utilise window.location.href pour un hard reload qui "nettoie" la mémoire JS
        window.location.href = data.redirectTo || "/dashboard";
      }, 500);

    } catch (err) {
      setError(errorMessages[err.message] || err.message || 'Une erreur est survenue.');
    }

    setLoading(false);
  };

  return (
    // ✅ MOBILE SAFE : 'overflow-x-hidden' empêche le scroll horizontal
    <main className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-x-hidden px-4 py-12">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-3xl"></div>
        <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

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
            
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              {need2FA ? "Vérification 2FA" : "Bon retour parmi nous !"}
            </h1>
            <p className="text-slate-500 text-sm">
              {need2FA ? "Entrez le code de votre application d'authentification." : "Connectez-vous pour accéder à votre espace."}
            </p>
          </div>

          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-sm font-medium text-emerald-700">Connexion réussie ! Redirection...</p>
            </div>
          )}

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-start gap-3 animate-in fade-in slide-in-from-top-2 duration-300">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
              <p className="text-red-800 text-sm font-medium">{error}</p>
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-5">
            {!need2FA ? (
              <>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Email</label>
                  <div className="relative group">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all"
                      placeholder="nom@exemple.com"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <div className="flex items-center justify-between ml-1">
                    <label className="text-xs font-bold text-slate-700 uppercase tracking-wide">Mot de passe</label>
                    <Link href="https://app.bookzy.io/auth/forgot-password" className="text-xs font-medium text-slate-400 hover:text-slate-900 transition-colors">Oublié ?</Link>
                  </div>
                  <div className="relative group">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                    <input
                      type={showPassword ? "text" : "password"}
                      required
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="w-full pl-11 pr-12 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all"
                      placeholder="••••••••"
                    />
                    <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors">
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-700 uppercase tracking-wide ml-1">Code Authenticator</label>
                <div className="relative group">
                  <ShieldCheck className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <input
                    type="text"
                    maxLength={6}
                    autoFocus
                    value={twoFA}
                    onChange={(e) => setTwoFA(e.target.value.replace(/\D/g, ''))}
                    className="w-full pl-11 pr-4 py-3 bg-slate-50 border border-slate-200 rounded-xl text-slate-900 text-lg font-bold tracking-widest placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all"
                    placeholder="123456"
                  />
                </div>
              </div>
            )}

            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 disabled:bg-slate-200 disabled:text-slate-400 text-white font-bold rounded-xl shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 transition-all active:scale-[0.98] flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  <span>{need2FA ? "Vérification..." : "Connexion..."}</span>
                </>
              ) : success ? (
                <>
                  <CheckCircle2 className="w-5 h-5" />
                  <span>Connecté !</span>
                </>
              ) : (
                <>
                  <span>{need2FA ? "Valider le code" : "Se connecter"}</span>
                  <ArrowRight className="w-4 h-4" />
                </>
              )}
            </button>
          </form>

          {!need2FA && (
            <div className="mt-8 text-center">
              <p className="text-sm text-slate-500">
                Pas encore de compte ?{" "}
                <Link href="https://app.bookzy.io/auth/register" className="font-bold text-slate-900 hover:underline">
                  Créer un compte
                </Link>
              </p>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}