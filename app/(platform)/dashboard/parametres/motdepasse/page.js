"use client";

import { useState } from "react";
import { useRouter } from "next/navigation"; // Pour le bouton retour
import { Lock, Loader2, CheckCircle2, ArrowLeft, Eye, EyeOff, AlertCircle } from "lucide-react";

export default function ModifierMotDePassePage() {
  const router = useRouter();
  
  const [formData, setFormData] = useState({
    ancien: "",
    nouveau: "",
    confirm: ""
  });
  
  // États pour afficher/masquer les mots de passe
  const [showPwd, setShowPwd] = useState({
    ancien: false,
    nouveau: false,
    confirm: false
  });

  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // On efface l'erreur dès qu'il tape
  };

  const toggleShow = (field) => {
    setShowPwd({ ...showPwd, [field]: !showPwd[field] });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { ancien, nouveau, confirm } = formData;

    if (!ancien || !nouveau || !confirm) {
      return setError("Tous les champs sont obligatoires.");
    }

    // ✅ Validation Regex stricte (correspond à ton texte)
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d).{8,}$/;
    if (!passwordRegex.test(nouveau)) {
      return setError("Le mot de passe doit contenir 8 caractères, 1 majuscule et 1 chiffre.");
    }

    if (nouveau !== confirm) {
      return setError("Les nouveaux mots de passe ne correspondent pas.");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/update-password", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ancien, nouveau }),
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.message || "Le mot de passe actuel est incorrect.");
      }

      setSuccess(true);
      setFormData({ ancien: "", nouveau: "", confirm: "" }); // Reset form
    } catch (err) {
      setError(err.message || "Erreur lors de la mise à jour.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      
      {/* Container Centré */}
      <div className="w-full max-w-md">
        
        {/* Bouton Retour */}
        <button 
          onClick={() => router.back()} 
          className="flex items-center gap-2 text-slate-500 hover:text-slate-800 text-sm font-medium mb-6 transition-colors"
        >
          <ArrowLeft size={16} /> Retour aux paramètres
        </button>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-8">
          
          {/* En-tête Carte */}
          <div className="text-center mb-8">
            <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-4 text-slate-700">
                <Lock size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Sécurisez votre compte</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
              Choisissez un mot de passe fort avec au moins 8 caractères, une majuscule et un chiffre.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Ancien */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Mot de passe actuel</label>
              <div className="relative">
                <input
                  type={showPwd.ancien ? "text" : "password"}
                  name="ancien"
                  value={formData.ancien}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-50 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => toggleShow('ancien')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  {showPwd.ancien ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* Nouveau */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nouveau mot de passe</label>
              <div className="relative">
                <input
                  type={showPwd.nouveau ? "text" : "password"}
                  name="nouveau"
                  value={formData.nouveau}
                  onChange={handleChange}
                  className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-50 outline-none transition-all"
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => toggleShow('nouveau')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  {showPwd.nouveau ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* Confirm */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirmer le nouveau</label>
              <div className="relative">
                <input
                  type={showPwd.confirm ? "text" : "password"}
                  name="confirm"
                  value={formData.confirm}
                  onChange={handleChange}
                  className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:ring-4 focus:ring-slate-50 outline-none transition-all ${
                    formData.confirm && formData.nouveau !== formData.confirm 
                    ? "border-red-300 focus:border-red-500" 
                    : "border-slate-200 focus:border-slate-900"
                  }`}
                  placeholder="••••••••"
                />
                <button type="button" onClick={() => toggleShow('confirm')} className="absolute right-3 top-3 text-slate-400 hover:text-slate-600">
                  {showPwd.confirm ? <EyeOff size={18}/> : <Eye size={18}/>}
                </button>
              </div>
            </div>

            {/* Feedbacks */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="flex items-center gap-2 bg-emerald-50 text-emerald-600 p-3 rounded-lg text-sm font-medium">
                <CheckCircle2 size={16} />
                <span>Mot de passe mis à jour avec succès !</span>
              </div>
            )}

            {/* Bouton Action */}
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Modifier mon mot de passe"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}