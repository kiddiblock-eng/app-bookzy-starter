"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Mail, Loader2, CheckCircle2, ArrowLeft, AlertCircle } from "lucide-react";

export default function ChangerEmailPage() {
  const router = useRouter();

  const [formData, setFormData] = useState({
    email: "",
    confirmEmail: ""
  });
  
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(""); // Reset erreur à la frappe
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess(false);

    const { email, confirmEmail } = formData;

    // 1. Validation basique
    if (!email || !confirmEmail) {
      return setError("Veuillez remplir tous les champs.");
    }

    if (email !== confirmEmail) {
      return setError("Les adresses e-mail ne correspondent pas.");
    }

    // 2. Validation format email (Regex simple)
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      return setError("Veuillez entrer une adresse e-mail valide.");
    }

    setLoading(true);

    try {
      const res = await fetch("/api/user/update-email", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.message || "Erreur lors de la mise à jour.");
      }

      setSuccess(true);
      setFormData({ email: "", confirmEmail: "" }); // Reset form
    } catch (err) {
      console.error("Erreur mise à jour :", err);
      setError(err.message || "Impossible de mettre à jour l'e-mail.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      
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
            <div className="w-12 h-12 bg-blue-50 text-blue-600 rounded-xl flex items-center justify-center mx-auto mb-4">
                <Mail size={24} />
            </div>
            <h1 className="text-xl font-bold text-slate-900">Changer d'adresse e-mail</h1>
            <p className="text-sm text-slate-500 mt-1 max-w-xs mx-auto">
              Nous vous enverrons un lien de confirmation pour valider votre nouvelle adresse.
            </p>
          </div>

          {/* Formulaire */}
          <form onSubmit={handleSubmit} className="space-y-5">
            
            {/* Nouvelle adresse */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Nouvelle adresse e-mail</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white border border-slate-200 rounded-xl text-slate-900 text-sm focus:border-slate-900 focus:ring-4 focus:ring-slate-50 outline-none transition-all"
                placeholder="nouveau@email.com"
              />
            </div>

            {/* Confirmation */}
            <div>
              <label className="block text-xs font-bold text-slate-500 uppercase mb-2">Confirmer l'adresse</label>
              <input
                type="email"
                name="confirmEmail"
                value={formData.confirmEmail}
                onChange={handleChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl text-slate-900 text-sm focus:ring-4 focus:ring-slate-50 outline-none transition-all ${
                    formData.confirmEmail && formData.email !== formData.confirmEmail
                    ? "border-red-300 focus:border-red-500" 
                    : "border-slate-200 focus:border-slate-900"
                }`}
                placeholder="nouveau@email.com"
              />
            </div>

            {/* Messages Feedback */}
            {error && (
              <div className="flex items-start gap-2 bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                <AlertCircle size={16} className="mt-0.5 shrink-0" />
                <span>{error}</span>
              </div>
            )}

            {success && (
              <div className="bg-emerald-50 border border-emerald-100 rounded-xl p-4 text-center">
                <div className="flex justify-center mb-2">
                    <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-emerald-800 font-bold text-sm">Vérifiez votre boîte mail !</h3>
                <p className="text-emerald-600 text-xs mt-1">
                    Un lien de confirmation a été envoyé à votre nouvelle adresse.
                </p>
              </div>
            )}

            {/* Bouton Action */}
            <button
              type="submit"
              disabled={loading || success}
              className="w-full py-3.5 bg-slate-900 text-white font-bold rounded-xl hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center justify-center gap-2 mt-2"
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                "Envoyer le lien de confirmation"
              )}
            </button>

          </form>
        </div>
      </div>
    </div>
  );
}