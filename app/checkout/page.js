'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { Loader2, CheckCircle2, ShieldCheck, Sparkles, Lock, CreditCard } from 'lucide-react';

function CheckoutContent({ kkiapayReady }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('tx');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [widgetConfig, setWidgetConfig] = useState(null);
  const [step, setStep] = useState('initializing');

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
    if (widgetConfig && kkiapayReady && typeof window.openKkiapayWidget === 'function') {
      openWidget();
    }
  }, [widgetConfig, kkiapayReady]);

  function openWidget() {
    try {
      setStep('opening');
      
      const config = {
        amount: widgetConfig.amount,
        key: widgetConfig.api_key,
        sandbox: widgetConfig.sandbox,
        email: widgetConfig.email || '',
        phone: widgetConfig.phone || '',
        name: widgetConfig.name || '',
        position: 'center'
      };

      if (typeof window.addSuccessListener === 'function') {
        window.addSuccessListener(handleSuccess);
      }

      if (typeof window.addFailedListener === 'function') {
        window.addFailedListener(handleFailed);
      }

      window.openKkiapayWidget(config);

    } catch (err) {
      setError(`Erreur widget: ${err.message}`);
    }
  }

  async function handleSuccess(response) {
    setStep('processing');
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

  function handleFailed(error) {
    setError('Le paiement a échoué ou a été annulé');
    setLoading(false);
  }

  if (error) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-slate-200 rounded-2xl p-8 max-w-md w-full text-center shadow-sm">
          <div className="w-16 h-16 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <span className="text-4xl">❌</span>
          </div>
          <h2 className="text-2xl font-black text-slate-900 mb-3">Paiement échoué</h2>
          <p className="text-slate-600 mb-8 leading-relaxed">{error}</p>
          
          <div className="space-y-3">
            <button
              onClick={() => window.location.reload()}
              className="w-full px-6 py-3.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-[0.98]"
            >
              Réessayer le paiement
            </button>
            <button
              onClick={() => router.push('/dashboard')}
              className="w-full px-6 py-3.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-xl font-bold text-sm transition-all border border-slate-200"
            >
              Retour au tableau de bord
            </button>
          </div>
        </div>
      </div>
    );
  }

  if (step === 'processing' || loading) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="bg-white border border-emerald-200 rounded-2xl p-12 max-w-md w-full text-center shadow-sm">
          <div className="relative w-20 h-20 mx-auto mb-8">
            <div className="absolute inset-0 border-4 border-emerald-100 rounded-full"></div>
            <div className="absolute inset-0 border-4 border-emerald-600 rounded-full border-t-transparent animate-spin"></div>
            <CheckCircle2 className="absolute inset-0 m-auto w-10 h-10 text-emerald-600 animate-pulse" />
          </div>
          
          <h2 className="text-2xl font-black text-slate-900 mb-3">Vérification en cours...</h2>
          <p className="text-emerald-700 mb-6 font-medium">Votre paiement est en cours de traitement</p>
          
          <div className="flex items-center justify-center gap-2 text-sm text-slate-500 bg-slate-50 py-3 px-4 rounded-xl border border-slate-200">
            <ShieldCheck className="w-4 h-4 text-emerald-600" />
            <span className="font-medium">Paiement 100% sécurisé</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
      <div className="bg-white border border-slate-200 rounded-2xl p-8 sm:p-12 max-w-md w-full text-center shadow-sm">
        
        {step === 'initializing' ? (
          <>
            <div className="w-16 h-16 mx-auto mb-6 bg-indigo-50 rounded-full flex items-center justify-center">
              <Loader2 className="w-8 h-8 animate-spin text-indigo-600" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              Préparation du paiement...
            </h2>
            <p className="text-slate-600">Veuillez patienter un instant</p>
          </>
        ) : (
          <>
            <div className="w-16 h-16 bg-gradient-to-br from-indigo-600 to-indigo-700 rounded-full flex items-center justify-center mx-auto mb-6">
              <CreditCard className="w-8 h-8 text-white" />
            </div>
            
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              Fenêtre de paiement ouverte
            </h2>
            <p className="text-slate-600 mb-8 leading-relaxed">
              Complétez votre paiement dans la fenêtre KkiaPay pour accéder à votre eBook professionnel
            </p>
            
            {/* Info sécurité */}
            <div className="bg-indigo-50 border border-indigo-100 rounded-xl p-4 mb-6">
              <div className="flex items-center justify-center gap-2 text-indigo-700 text-sm font-medium">
                <Lock className="w-4 h-4" />
                <span>Paiement sécurisé par KkiaPay</span>
              </div>
            </div>

            {/* Infos montant si disponible */}
            {widgetConfig && (
              <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 mb-6">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-500 uppercase tracking-wide">Montant</span>
                  <span className="text-2xl font-black text-slate-900">{widgetConfig.amount} <span className="text-sm text-slate-500 font-medium">FCFA</span></span>
                </div>
              </div>
            )}

            <p className="text-xs text-slate-500">
              La fenêtre ne s'affiche pas ? 
              <button 
                onClick={() => window.location.reload()} 
                className="text-indigo-600 hover:text-indigo-700 ml-1 underline font-medium"
              >
                Actualiser la page
              </button>
            </p>
          </>
        )}
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [kkiapayReady, setKkiapayReady] = useState(false);

  useEffect(() => {
    if (typeof window.openKkiapayWidget === 'function') {
      setKkiapayReady(true);
      return;
    }

    const script = document.createElement('script');
    script.src = 'https://cdn.kkiapay.me/k.js';
    script.async = true;
    
    script.onload = () => {
      setTimeout(() => {
        setKkiapayReady(true);
      }, 500);
    };
    
    script.onerror = () => {
      console.error('Erreur chargement SDK KkiaPay');
    };
    
    document.body.appendChild(script);
    
    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, []);

  return (
    <Suspense fallback={
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <Loader2 className="w-12 h-12 animate-spin text-indigo-600" />
      </div>
    }>
      <CheckoutContent kkiapayReady={kkiapayReady} />
    </Suspense>
  );
}