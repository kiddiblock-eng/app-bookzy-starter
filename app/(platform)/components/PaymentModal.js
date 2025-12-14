"use client";

import { useState, useEffect } from "react";
import { X, Loader2, CheckCircle2 } from "lucide-react";

export default function PaymentModal({ open, onClose, projetId, onSuccess }) {
  const [loading, setLoading] = useState(false);
  const [paid, setPaid] = useState(false);

  // Simule la validation du paiement pour les tests (avant d’intégrer Kkiapay)
  async function handlePay() {
    setLoading(true);
    setTimeout(async () => {
      setLoading(false);
      setPaid(true);

      // 🔥 Appelle ton API pour marquer le projet comme payé
      await fetch(`/api/projets/${projetId}/pay`, {
        method: "POST",
        credentials: "include",
      });

      // Ferme le modal + notifie la page par callback
      setTimeout(() => {
        onSuccess();
        onClose();
      }, 1000);
    }, 2000);
  }

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm">
      <div className="relative bg-white dark:bg-neutral-900 rounded-3xl w-full max-w-md shadow-2xl border border-neutral-200 dark:border-neutral-800 p-6 animate-fadeIn">
        {/* Fermer */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-neutral-400 hover:text-neutral-700 dark:hover:text-neutral-200"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Contenu */}
        {!paid ? (
          <>
            <h2 className="text-xl font-bold mb-2 text-center text-neutral-900 dark:text-white">
              Débloquer ton kit 📦
            </h2>
            <p className="text-center text-neutral-500 dark:text-neutral-400 mb-6">
              Accède à tous les fichiers (ebook, couverture, affiches) après paiement.
            </p>

            {/* Prix */}
            <div className="bg-neutral-100 dark:bg-neutral-800 rounded-2xl py-4 mb-6 flex items-center justify-center">
              <span className="text-3xl font-bold text-blue-600">2500 F CFA</span>
            </div>

            {/* Bouton de paiement */}
            <button
              onClick={handlePay}
              disabled={loading}
              className="w-full py-3 bg-gradient-to-r from-blue-600 to-indigo-600 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-indigo-700 transition-all flex items-center justify-center gap-2"
            >
              {loading ? (
                <>
                  <Loader2 className="w-5 h-5 animate-spin" />
                  Paiement en cours...
                </>
              ) : (
                "Payer et débloquer maintenant"
              )}
            </button>

            <p className="text-xs text-center mt-4 text-neutral-400">
              Paiement 100% sécurisé — Accès instantané après validation.
            </p>
          </>
        ) : (
          <div className="flex flex-col items-center justify-center py-10">
            <CheckCircle2 className="w-12 h-12 text-green-500 mb-4" />
            <p className="text-lg font-semibold text-green-600">
              Paiement réussi 🎉
            </p>
            <p className="text-sm text-neutral-500 mt-1">
              Ton kit est maintenant débloqué.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
