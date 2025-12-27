'use client';

import { useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';

export default function CheckoutPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('tx');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [widgetConfig, setWidgetConfig] = useState(null);
  const [kkiapayReady, setKkiapayReady] = useState(false);

  useEffect(() => {
    if (transactionId) {
      initializePayment();
    }
  }, [transactionId]);

  async function initializePayment() {
    try {
      const res = await fetch(`/api/payments/info?id=${transactionId}`);
      const data = await res.json();

      if (data.success) {
        if (data.useWidget && data.widgetProvider === 'kkiapay') {
          setWidgetConfig(data.widgetConfig);
        } else if (data.paymentUrl) {
          window.location.href = data.paymentUrl;
        }
      } else {
        setError(data.message || 'Erreur initialisation');
      }
    } catch (err) {
      setError('Erreur de connexion');
    }
  }

  useEffect(() => {
    if (widgetConfig && kkiapayReady && window.kkiapay) {
      openKkiapayWidget();
    }
  }, [widgetConfig, kkiapayReady]);

  function openKkiapayWidget() {
    window.kkiapay.open({
      amount: widgetConfig.amount,
      api_key: widgetConfig.api_key,
      sandbox: widgetConfig.sandbox,
      email: widgetConfig.email,
      phone: widgetConfig.phone || '',
      name: widgetConfig.name
    });

    window.addEventListener('success', handleSuccess);
    window.addEventListener('failed', handleFailed);
  }

  async function handleSuccess(e) {
    console.log('✅ Paiement réussi:', e);
    setLoading(true);

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });

      const data = await res.json();

      if (data.success && data.paid) {
        router.push(`/dashboard/projets/nouveau?tx=${transactionId}`);
      } else {
        setError('Paiement non vérifié');
        setLoading(false);
      }
    } catch (err) {
      setError('Erreur vérification');
      setLoading(false);
    }
  }

  function handleFailed(e) {
    console.error('❌ Paiement échoué:', e);
    setError('Le paiement a échoué');
    setLoading(false);
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
    <>
      <Script 
        src="https://cdn.kkiapay.me/k.js" 
        onLoad={() => {
          console.log('✅ KkiaPay SDK chargé');
          setKkiapayReady(true);
        }}
      />
      
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-md w-full text-center border border-white/20">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-4" />
          <h2 className="text-2xl font-bold text-white mb-2">
            {loading ? 'Vérification...' : 'Initialisation...'}
          </h2>
          <p className="text-gray-300">Veuillez patienter...</p>
        </div>
      </div>
    </>
  );
}