"use client";

import { useRouter } from "next/navigation";
import { CheckCircle2, ArrowRight, ShieldCheck } from "lucide-react";

export default function EmailConfirmedPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-[#F8FAFC] flex flex-col items-center justify-center p-4">
      
      {/* Carte Centrée */}
      <div className="w-full max-w-sm bg-white rounded-2xl border border-slate-200 shadow-sm p-8 text-center">
        
        {/* Icône Succès */}
        <div className="w-16 h-16 bg-emerald-50 rounded-full flex items-center justify-center mx-auto mb-6 animate-bounce-slow">
          <CheckCircle2 className="w-8 h-8 text-emerald-600" />
        </div>

        {/* Titre & Description */}
        <h1 className="text-xl font-bold text-slate-900 mb-2">
          E-mail confirmé !
        </h1>

        <p className="text-sm text-slate-500 mb-6 leading-relaxed">
          Votre adresse e-mail a été mise à jour avec succès. Vous pouvez désormais utiliser cette adresse pour vous connecter.
        </p>

        {/* Petit encart sécurité (Touche Pro) */}
        <div className="bg-slate-50 border border-slate-100 rounded-xl p-3 mb-8 flex items-start gap-3 text-left">
             <ShieldCheck className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
             <p className="text-xs text-slate-500">
                Par sécurité, un e-mail de notification a également été envoyé à votre ancienne adresse.
             </p>
        </div>

        {/* Bouton Action */}
        <button
          onClick={() => router.push("/dashboard")}
          className="w-full py-3.5 bg-slate-900 hover:bg-slate-800 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 shadow-sm hover:shadow-md active:scale-95"
        >
          Retour au tableau de bord <ArrowRight size={18} />
        </button>

      </div>
      
      {/* Footer discret */}
      <p className="mt-8 text-xs text-slate-400 font-medium">
        © Bookzy Security
      </p>

      {/* Petite animation CSS personnalisée pour l'icône */}
      <style jsx>{`
        @keyframes bounce-slow {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .animate-bounce-slow {
          animation: bounce-slow 2s infinite ease-in-out;
        }
      `}</style>
    </div>
  );
}