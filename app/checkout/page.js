'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { useKKiaPay } from 'kkiapay-react';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('tx');
  
  const [loading, setLoading] = useState(false);
  const [paymentData, setPaymentData] = useState(null);
  const [error, setError] = useState(null);

  const { openKkiapayWidget, addKkiapayListener, removeKkiapayListener } = useKKiaPay();

  // 🔥 Initialiser le paiement au chargement
  useEffect(() => {
    if (transactionId) {
      initializePayment();
    }
  }, [transactionId]);

  // 🔥 Gérer les callbacks KkiaPay
  useEffect(() => {
    function successHandler(response) {
      console.log('✅ Paiement KkiaPay réussi:', response);
      verifyPayment(response.transactionId);
    }

    function failedHandler(error) {
      console.error('❌ Paiement KkiaPay échoué:', error);
      setError('Le paiement a échoué. Veuillez réessayer.');
      setLoading(false);
    }

    addKkiapayListener('success', successHandler);
    addKkiapayListener('failed', failedHandler);

    return () => {
      removeKkiapayListener('success', successHandler);
      removeKkiapayListener('failed', failedHandler);
    };
  }, [addKkiapayListener, removeKkiapayListener]);

  async function initializePayment() {
    // Les données du paiement sont déjà créées
    // On récupère juste les infos de la transaction
    try {
      const res = await fetch(`/api/payments/info?id=${transactionId}`);
      const data = await res.json();

      if (data.success) {
        setPaymentData(data);

        // 🔥 Si c'est un widget, l'ouvrir automatiquement
        if (data.useWidget && data.widgetProvider === 'kkiapay') {
          openKkiapayWidget(data.widgetConfig);
        }
        // Sinon, rediriger vers l'URL de paiement
        else if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        }
      } else {
        setError(data.message || 'Erreur lors de l\'initialisation du paiement');
      }
    } catch (err) {
      console.error('Erreur init payment:', err);
      setError('Erreur de connexion');
    }
  }

  async function verifyPayment(kkiapayTransactionId) {
    setLoading(true);

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });

      const data = await res.json();

      if (data.success && data.paid) {
        // ✅ Paiement confirmé → Rediriger vers génération
        router.push(`/dashboard/projets/nouveau?tx=${transactionId}`);
      } else {
        setError('Le paiement n\'a pas pu être vérifié');
        setLoading(false);
      }
    } catch (err) {
      console.error('Erreur verify:', err);
      setError('Erreur lors de la vérification du paiement');
      setLoading(false);
    }
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Erreur de paiement</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          <button
            onClick={() => router.push('/dashboard')}
            className="px-6 py-3 bg-purple-600 hover:bg-purple-700 rounded-xl font-medium text-white transition"
          >
            Retour au tableau de bord
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
        <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          {loading ? 'Vérification du paiement...' : 'Initialisation du paiement...'}
        </h2>
        <p className="text-gray-300">
          {loading 
            ? 'Veuillez patienter pendant que nous vérifions votre paiement'
            : 'Veuillez patienter...'}
        </p>
      </div>
    </div>
  );
}