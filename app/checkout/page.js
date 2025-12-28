'use client';

import { Suspense, useState, useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import Script from 'next/script';
import { Loader2 } from 'lucide-react';

function CheckoutContent({ kkiapayReady }) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const transactionId = searchParams.get('tx');
  
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [widgetConfig, setWidgetConfig] = useState(null);
  const [debugLogs, setDebugLogs] = useState([]);

  const addLog = (message, data = null) => {
    const log = `[${new Date().toLocaleTimeString()}] ${message}`;
    console.log(log, data || '');
    setDebugLogs(prev => [...prev, { message, data, time: new Date().toLocaleTimeString() }]);
  };

  useEffect(() => {
    addLog('🎬 Component mounted');
    addLog('📋 Transaction ID:', transactionId);
    addLog('🎯 KkiaPay Ready:', kkiapayReady);
    
    if (transactionId) {
      initializePayment();
    }
  }, [transactionId]);

  async function initializePayment() {
    try {
      addLog('🔍 Fetching payment info for:', transactionId);
      
      const res = await fetch(`/api/payments/info?id=${transactionId}`);
      const data = await res.json();
      
      addLog('📦 Payment info received:', data);

      if (data.success) {
        if (data.useWidget && data.widgetProvider === 'kkiapay') {
          addLog('✅ Widget mode detected');
          addLog('🎯 Widget config:', data.widgetConfig);
          setWidgetConfig(data.widgetConfig);
        } else if (data.paymentUrl) {
          addLog('🔗 Redirect mode detected:', data.paymentUrl);
          window.location.href = data.paymentUrl;
        }
      } else {
        addLog('❌ API error:', data.message);
        setError(data.message || 'Erreur initialisation');
      }
    } catch (err) {
      addLog('❌ Init error:', err.message);
      setError('Erreur de connexion');
    }
  }

  useEffect(() => {
    addLog('🔄 useEffect triggered', {
      widgetConfig: !!widgetConfig,
      kkiapayReady,
      openKkiapayWidget: typeof window.openKkiapayWidget
    });

    if (widgetConfig && kkiapayReady && typeof window.openKkiapayWidget === 'function') {
      addLog('🚀 All conditions met, opening widget...');
      openWidget();
    } else {
      if (!widgetConfig) addLog('⏳ Waiting for widgetConfig...');
      if (!kkiapayReady) addLog('⏳ Waiting for kkiapayReady...');
      if (typeof window.openKkiapayWidget !== 'function') addLog('⏳ Waiting for openKkiapayWidget...');
    }
  }, [widgetConfig, kkiapayReady]);

  function openWidget() {
    addLog('🚀 openWidget called');
    addLog('📦 Widget config:', widgetConfig);
    addLog('🔧 openKkiapayWidget type:', typeof window.openKkiapayWidget);

    if (typeof window.openKkiapayWidget !== 'function') {
      addLog('❌ openKkiapayWidget is not a function!');
      setError('KkiaPay SDK non chargé');
      return;
    }

    try {
      addLog('📞 Calling openKkiapayWidget()...');
      
      const config = {
        amount: widgetConfig.amount,
        key: widgetConfig.api_key,
        sandbox: widgetConfig.sandbox,
        email: widgetConfig.email || '',
        phone: widgetConfig.phone || '',
        name: widgetConfig.name || 'Client Bookzy',
        position: 'center'
      };
      
      addLog('🎛️ Widget config to send:', config);

      // 🔥 Ajouter les listeners AVANT d'ouvrir le widget
      if (typeof window.addSuccessListener === 'function') {
        window.addSuccessListener(handleSuccess);
        addLog('✅ Success listener added');
      }

      if (typeof window.addFailedListener === 'function') {
        window.addFailedListener(handleFailed);
        addLog('✅ Failed listener added');
      }

      // 🔥 Ouvrir le widget
      window.openKkiapayWidget(config);

      addLog('✅ Widget opened successfully');

    } catch (err) {
      addLog('❌ Error opening widget:', err.message);
      console.error('Full widget error:', err);
      setError(`Erreur widget: ${err.message}`);
    }
  }

  async function handleSuccess(response) {
    addLog('✅ Payment SUCCESS:', response);
    setLoading(true);

    try {
      const res = await fetch('/api/payments/verify', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ transactionId })
      });

      const data = await res.json();
      addLog('🔍 Verify response:', data);

      if (data.success && data.paid) {
        addLog('✅ Payment verified, redirecting...');
        router.push(`/dashboard/projets/nouveau?tx=${transactionId}`);
      } else {
        addLog('❌ Payment not verified');
        setError('Paiement non vérifié');
        setLoading(false);
      }
    } catch (err) {
      addLog('❌ Verify error:', err.message);
      setError('Erreur vérification');
      setLoading(false);
    }
  }

  function handleFailed(error) {
    addLog('❌ Payment FAILED:', error);
    setError('Le paiement a échoué');
    setLoading(false);
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black p-4">
        <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full text-center border border-white/20">
          <div className="w-16 h-16 bg-red-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-3xl">❌</span>
          </div>
          <h2 className="text-2xl font-bold text-white mb-4">Erreur de paiement</h2>
          <p className="text-gray-300 mb-6">{error}</p>
          
          <details className="text-left mb-6">
            <summary className="text-sm text-purple-300 cursor-pointer mb-2">🐛 Debug logs</summary>
            <div className="bg-black/30 p-4 rounded-lg max-h-60 overflow-y-auto text-xs font-mono">
              {debugLogs.map((log, i) => (
                <div key={i} className="mb-2 border-b border-white/10 pb-2">
                  <span className="text-gray-400">[{log.time}]</span>{' '}
                  <span className="text-white">{log.message}</span>
                  {log.data && (
                    <pre className="text-purple-300 mt-1 ml-4 text-[10px]">
                      {typeof log.data === 'object' ? JSON.stringify(log.data, null, 2) : log.data}
                    </pre>
                  )}
                </div>
              ))}
            </div>
          </details>

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
      <div className="bg-white/10 backdrop-blur-xl rounded-2xl p-8 max-w-2xl w-full text-center border border-white/20">
        <Loader2 className="w-16 h-16 animate-spin text-purple-400 mx-auto mb-4" />
        <h2 className="text-2xl font-bold text-white mb-2">
          {loading ? 'Vérification...' : 'Initialisation...'}
        </h2>
        <p className="text-gray-300 mb-4">Veuillez patienter...</p>
        
        {widgetConfig && (
          <p className="text-xs text-green-300 mb-2">✅ Widget config chargé</p>
        )}
        {kkiapayReady && (
          <p className="text-xs text-green-300 mb-2">✅ KkiaPay SDK prêt</p>
        )}

        <details className="text-left mt-6">
          <summary className="text-sm text-purple-300 cursor-pointer mb-2">🐛 Debug logs ({debugLogs.length})</summary>
          <div className="bg-black/30 p-4 rounded-lg max-h-60 overflow-y-auto text-xs font-mono">
            {debugLogs.map((log, i) => (
              <div key={i} className="mb-2 border-b border-white/10 pb-2">
                <span className="text-gray-400">[{log.time}]</span>{' '}
                <span className="text-white">{log.message}</span>
                {log.data && (
                  <pre className="text-purple-300 mt-1 ml-4 text-[10px]">
                    {typeof log.data === 'object' ? JSON.stringify(log.data, null, 2) : String(log.data)}
                  </pre>
                )}
              </div>
            ))}
          </div>
        </details>
      </div>
    </div>
  );
}

export default function CheckoutPage() {
  const [kkiapayReady, setKkiapayReady] = useState(false);

  return (
    <>
      <Script 
        src="https://cdn.kkiapay.me/k.js" 
        strategy="beforeInteractive"
        onLoad={() => {
          console.log('✅ KkiaPay SDK chargé');
          console.log('🔧 openKkiapayWidget:', typeof window.openKkiapayWidget);
          console.log('🔧 addSuccessListener:', typeof window.addSuccessListener);
          console.log('🔧 addFailedListener:', typeof window.addFailedListener);
          setKkiapayReady(true);
        }}
        onError={(e) => {
          console.error('❌ Erreur chargement SDK KkiaPay:', e);
        }}
      />
      
      <Suspense fallback={
        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-purple-900 via-blue-900 to-black">
          <Loader2 className="w-16 h-16 animate-spin text-purple-400" />
        </div>
      }>
        <CheckoutContent kkiapayReady={kkiapayReady} />
      </Suspense>
    </>
  );
}