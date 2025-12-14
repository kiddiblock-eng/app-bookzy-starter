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

  // --- LOGIQUE INTACTE ---
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

  // --- RENDER (DESIGN CLEAN & WHITE) ---
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

          {/* Divider */}
          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-4 bg-white text-slate-500 font-medium">
                Déjà inscrit ?
              </span>
            </div>
          </div>

          {/* Login Link */}
          <Link
            href="/auth/login"
            className="group flex items-center justify-center gap-2 w-full py-3.5 bg-white hover:bg-slate-50 border border-slate-200 text-slate-900 font-bold rounded-xl transition-all"
          >
            <span>Se connecter</span>
            <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-slate-900 group-hover:translate-x-1 transition-all" />
          </Link>
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