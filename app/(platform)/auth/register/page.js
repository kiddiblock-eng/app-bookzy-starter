"use client";
import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  Loader2, 
  Mail, 
  Lock, 
  User, 
  Eye, 
  EyeOff, 
  ArrowRight, 
  CheckCircle2, 
  AlertCircle 
} from "lucide-react";

/* --- TON LOGO ORIGINAL --- */
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

export default function RegisterPage() {
  const router = useRouter();
  const [form, setForm] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  useEffect(() => {
    localStorage.removeItem("onboardingStep");
  }, []);

  const validate = () => {
    const e = {};
    if (!form.firstName.trim()) e.firstName = "Le prénom est requis.";
    if (!form.lastName.trim()) e.lastName = "Le nom est requis.";
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email))
      e.email = "Adresse e-mail invalide.";
    if (form.password.length < 8)
      e.password = "Le mot de passe doit contenir au moins 8 caractères.";
    if (form.password !== form.confirmPassword)
      e.confirmPassword = "Les mots de passe ne correspondent pas.";
    return e;
  };

  const submit = async (e) => {
    e.preventDefault();
    setMessage("");
    const v = validate();
    setErrors(v);
    if (Object.keys(v).length) return;

    setLoading(true);
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          firstName: form.firstName,
          lastName: form.lastName,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setMessage(data.error || "Une erreur est survenue.");
      } else {
        setMessage("Compte créé avec succès !");
        setSuccess(true);
        localStorage.setItem("onboardingStep", "1");
        setTimeout(() => router.push("/setup/step1"), 1000);
      }
    } catch (err) {
      setMessage("Erreur de connexion au serveur.");
    } finally {
      setLoading(false);
    }
  };

  const onChange = (e) =>
    setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

  return (
    <main className="min-h-screen flex items-center justify-center bg-slate-50 relative overflow-hidden px-4 py-8">
      
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
         <div className="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] bg-indigo-50/50 rounded-full blur-3xl"></div>
         <div className="absolute top-[20%] right-[10%] w-[30%] h-[30%] bg-blue-50/50 rounded-full blur-3xl"></div>
      </div>

      {/* Main Container */}
      <div className="relative w-full max-w-[520px] z-10">
        
        {/* Card */}
        <div className="relative bg-white border border-slate-100 rounded-2xl shadow-xl shadow-slate-200/50 p-8 sm:p-10">
          
          {/* Header */}
          <div className="text-center mb-8">
            <Link href="/" className="inline-flex items-center gap-2 mb-6 group">
              <div className="w-10 h-10 rounded-xl bg-slate-900 flex items-center justify-center shadow-lg shadow-slate-900/20 transition-transform group-hover:scale-105">
                <BookOpenSVG className="w-5 h-5 text-white" />
              </div>
              <span className="text-2xl font-extrabold text-slate-900 tracking-tight">Bookzy</span>
            </Link>
            <h1 className="text-2xl font-bold text-slate-900 mb-2">
              Créer un compte
            </h1>
            <p className="text-slate-500 text-sm">
              Rejoignez Bookzy en quelques secondes
            </p>
          </div>

          {/* Success Message */}
          {success && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 rounded-xl flex items-center gap-3">
              <CheckCircle2 className="w-5 h-5 text-emerald-600 flex-shrink-0" />
              <p className="text-emerald-800 text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Error Message */}
          {message && !success && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 rounded-xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0" />
              <p className="text-red-800 text-sm font-medium">{message}</p>
            </div>
          )}

          {/* Form */}
          <form onSubmit={submit} className="space-y-5">
            {/* Prénom & Nom */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 ml-1">
                  Prénom
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <input
                    name="firstName"
                    value={form.firstName}
                    onChange={onChange}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                      errors.firstName ? "border-red-300 bg-red-50/50" : "border-slate-200"
                    } rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all`}
                    placeholder="John"
                  />
                </div>
                {errors.firstName && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{errors.firstName}</p>
                )}
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 ml-1">
                  Nom
                </label>
                <div className="relative group">
                  <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                  <input
                    name="lastName"
                    value={form.lastName}
                    onChange={onChange}
                    className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                      errors.lastName ? "border-red-300 bg-red-50/50" : "border-slate-200"
                    } rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all`}
                    placeholder="Doe"
                  />
                </div>
                {errors.lastName && (
                  <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{errors.lastName}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 ml-1">
                Email
              </label>
              <div className="relative group">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  name="email"
                  type="email"
                  value={form.email}
                  onChange={onChange}
                  className={`w-full pl-11 pr-4 py-3 bg-slate-50 border ${
                    errors.email ? "border-red-300 bg-red-50/50" : "border-slate-200"
                  } rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all`}
                  placeholder="vous@exemple.com"
                />
              </div>
              {errors.email && (
                <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{errors.email}</p>
              )}
            </div>

            {/* Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 ml-1">
                Mot de passe
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  value={form.password}
                  onChange={onChange}
                  className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${
                    errors.password ? "border-red-300 bg-red-50/50" : "border-slate-200"
                  } rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all`}
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
              {errors.password && (
                <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{errors.password}</p>
              )}
            </div>

            {/* Confirm Password */}
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wide mb-1.5 ml-1">
                Confirmer
              </label>
              <div className="relative group">
                <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-400 group-focus-within:text-slate-900 transition-colors" />
                <input
                  name="confirmPassword"
                  type={showConfirmPassword ? "text" : "password"}
                  value={form.confirmPassword}
                  onChange={onChange}
                  className={`w-full pl-11 pr-12 py-3 bg-slate-50 border ${
                    errors.confirmPassword ? "border-red-300 bg-red-50/50" : "border-slate-200"
                  } rounded-xl text-slate-900 text-sm font-medium placeholder:text-slate-400 focus:bg-white focus:border-slate-900 focus:ring-0 transition-all`}
                  placeholder="••••••••"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 transition-colors"
                >
                  {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                </button>
              </div>
              {errors.confirmPassword && (
                <p className="mt-1.5 text-xs text-red-500 font-medium ml-1">{errors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loading || success}
              className="group w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-slate-900/20 hover:shadow-slate-900/30 active:scale-[0.98] mt-4"
            >
              <span className="flex items-center justify-center gap-2">
                {loading ? (
                  <>
                    <Loader2 className="w-5 h-5 animate-spin" />
                    <span>Création...</span>
                  </>
                ) : success ? (
                  <>
                    <CheckCircle2 className="w-5 h-5" />
                    <span>Compte créé !</span>
                  </>
                ) : (
                  <>
                    <span>Créer mon compte</span>
                    <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />
                  </>
                )}
              </span>
            </button>
          </form>

          {/* Séparateur */}
          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200"></div>
            </div>
            <div className="relative flex justify-center text-xs uppercase">
              <span className="bg-white px-2 text-slate-500 font-bold">Ou</span>
            </div>
          </div>

          {/* Bouton Google */}
          <button
            onClick={() => {
              window.location.href = '/api/auth/google';
            }}
            type="button"
            className="w-full py-3 bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold rounded-xl flex items-center justify-center gap-3 transition-all hover:shadow-md mb-6"
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            S'inscrire avec Google
          </button>

          {/* Login Link */}
          <div className="text-center">
            <p className="text-sm text-slate-500">
              Vous avez déjà un compte ?{" "}
              <Link href="/auth/login" className="font-bold text-slate-900 hover:underline">
                Se connecter
              </Link>
            </p>
          </div>
        </div>

        {/* Footer */}
        <div className="mt-6 text-center">
          <p className="text-xs text-slate-400 font-medium">
            En créant un compte, vous acceptez nos CGU.
          </p>
        </div>
      </div>
    </main>
  );
}