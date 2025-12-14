'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Loader2, CreditCard, CheckCircle, XCircle, Eye, EyeOff, DollarSign } from 'lucide-react';

export default function PaymentSettingsPage() {
  const [providers, setProviders] = useState([]);
  const [activeProvider, setActiveProvider] = useState('');
  const [globalPrice, setGlobalPrice] = useState(2100);
  const [loading, setLoading] = useState(true);
  const [editingProvider, setEditingProvider] = useState(null);
  const [saving, setSaving] = useState(false);
  const [savingPrice, setSavingPrice] = useState(false);

  useEffect(() => {
    fetchProviders();
  }, []);

  const fetchProviders = async () => {
    try {
      const res = await fetch('/api/admin/payment-providers', {
        credentials: 'include'
      });
      const data = await res.json();
      
      if (data.success) {
        setProviders(data.providers);
        setActiveProvider(data.activeProvider);
        setGlobalPrice(data.ebookPrice || 2100);
      }
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSavePrice = async () => {
    setSavingPrice(true);
    try {
      const res = await fetch('/api/admin/payment-providers/price', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ price: globalPrice })
      });

      const data = await res.json();
      
      if (data.success) {
        alert('✅ Prix mis à jour !');
        fetchProviders();
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la sauvegarde du prix');
    } finally {
      setSavingPrice(false);
    }
  };

  const handleToggleProvider = async (providerName, currentStatus) => {
    try {
      const res = await fetch(`/api/admin/payment-providers/${providerName}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ enabled: !currentStatus })
      });

      if (res.ok) {
        fetchProviders();
      }
    } catch (error) {
      console.error('Erreur:', error);
    }
  };

  const handleSetActive = async (providerName) => {
    try {
      const res = await fetch('/api/admin/payment-providers/active', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerName })
      });

      const data = await res.json();

      if (res.ok) {
        setActiveProvider(providerName);
        fetchProviders();
        alert(`✅ ${providerName} est maintenant le provider actif`);
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors du changement de provider');
    }
  };

  const handleSaveConfig = async (providerName, config) => {
    setSaving(true);
    try {
      const res = await fetch(`/api/admin/payment-providers/${providerName}`, {
        method: 'PATCH',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(config)
      });

      if (res.ok) {
        setEditingProvider(null);
        fetchProviders();
        alert('✅ Configuration sauvegardée !');
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur lors de la sauvegarde');
    } finally {
      setSaving(false);
    }
  };

  const handleTestConnection = async (providerName) => {
    try {
      const res = await fetch('/api/admin/payment-providers/test', {
        method: 'POST',
        credentials: 'include',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ provider: providerName })
      });

      const data = await res.json();

      if (data.success) {
        alert('✅ Connexion réussie !');
      } else {
        alert(`❌ ${data.error}`);
      }
    } catch (error) {
      console.error('Erreur:', error);
      alert('❌ Erreur de test');
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <Loader2 className="animate-spin w-10 h-10 text-purple-400" />
      </div>
    );
  }

  return (
    <div className="max-w-5xl space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <CreditCard className="text-purple-400" />
          Providers de Paiement
        </h1>
        <p className="text-gray-400 mt-2">
          Gérez vos différents providers et choisissez le provider actif
        </p>
      </div>

      {/* Prix Global */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-gradient-to-r from-emerald-600/20 to-teal-600/20 rounded-2xl p-6 border-2 border-emerald-500/30"
      >
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-bold flex items-center gap-2 mb-2">
              <DollarSign className="text-emerald-400" />
              Prix Global des eBooks
            </h3>
            <p className="text-sm text-gray-400">
              Ce prix s'applique à tous les providers de paiement
            </p>
          </div>
          <div className="flex items-center gap-4">
            <input
              type="number"
              value={globalPrice}
              onChange={(e) => setGlobalPrice(parseInt(e.target.value))}
              className="px-6 py-3 bg-black/30 border-2 border-white/10 rounded-xl font-bold text-2xl w-48 text-right"
              min="0"
            />
            <span className="text-xl font-bold text-gray-400">FCFA</span>
            <button
              onClick={handleSavePrice}
              disabled={savingPrice}
              className="px-6 py-3 bg-emerald-600 hover:bg-emerald-700 rounded-xl font-bold transition disabled:opacity-50"
            >
              {savingPrice ? 'Sauvegarde...' : '💾 Sauvegarder'}
            </button>
          </div>
        </div>
      </motion.div>

      {/* Provider Cards */}
      <div className="space-y-6">
        {providers.map((provider) => (
          <motion.div
            key={provider.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className={`bg-white/5 rounded-2xl border-2 overflow-hidden ${
              provider.isActive ? 'border-green-500/50' : 'border-white/10'
            }`}
          >
            {/* Header */}
            <div className="p-6 bg-gradient-to-r from-purple-600/20 to-blue-600/20 border-b border-white/10">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="bg-white/10 p-3 rounded-xl">
                    <span className="text-3xl">{provider.icon}</span>
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold">{provider.label}</h3>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-3 py-1 rounded-full text-xs font-medium ${
                        provider.enabled 
                          ? 'bg-green-600/30 text-green-300' 
                          : 'bg-red-600/30 text-red-300'
                      }`}>
                        {provider.enabled ? <CheckCircle size={12} className="inline mr-1" /> : <XCircle size={12} className="inline mr-1" />}
                        {provider.enabled ? 'Activé' : 'Désactivé'}
                      </span>
                      {provider.isActive && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-yellow-600/30 text-yellow-300">
                          ⭐ Actif
                        </span>
                      )}
                      {provider.configured && (
                        <span className="px-3 py-1 rounded-full text-xs font-medium bg-blue-600/30 text-blue-300">
                          ✓ Configuré
                        </span>
                      )}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleToggleProvider(provider.name, provider.enabled)}
                    className={`px-4 py-2 rounded-lg font-medium transition ${
                      provider.enabled
                        ? 'bg-red-600 hover:bg-red-700'
                        : 'bg-green-600 hover:bg-green-700'
                    }`}
                  >
                    {provider.enabled ? 'Désactiver' : 'Activer'}
                  </button>

                  {provider.enabled && provider.configured && !provider.isActive && (
                    <button
                      onClick={() => handleSetActive(provider.name)}
                      className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 rounded-lg font-medium transition"
                    >
                      Définir comme actif
                    </button>
                  )}
                </div>
              </div>
            </div>

            {/* Body */}
            <div className="p-6">
              {editingProvider === provider.name ? (
                <ProviderConfigForm
                  provider={provider}
                  onSave={(config) => handleSaveConfig(provider.name, config)}
                  onCancel={() => setEditingProvider(null)}
                  saving={saving}
                />
              ) : (
                <div>
                  <div className="grid grid-cols-2 gap-4 mb-4">
                    {provider.config?.environment && (
                      <div>
                        <p className="text-sm text-gray-400">Environnement</p>
                        <p className="font-medium capitalize">{provider.config.environment}</p>
                      </div>
                    )}
                    <div>
                      <p className="text-sm text-gray-400">Devise</p>
                      <p className="font-medium">{provider.config?.defaultCurrency || 'XOF'}</p>
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <button
                      onClick={() => setEditingProvider(provider.name)}
                      className="px-4 py-2 bg-purple-600 hover:bg-purple-700 rounded-lg transition"
                    >
                      📝 Configurer
                    </button>
                    
                    {provider.configured && (
                      <button
                        onClick={() => handleTestConnection(provider.name)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition"
                      >
                        🧪 Tester
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>
    </div>
  );
}

// Formulaire de configuration
function ProviderConfigForm({ provider, onSave, onCancel, saving }) {
  const [config, setConfig] = useState({});
  const [showSecrets, setShowSecrets] = useState(false);

  // Initialiser les champs selon le provider
  useEffect(() => {
    const initialConfig = {
      defaultCurrency: provider.config?.defaultCurrency || 'XOF'
    };

    // Environment (sauf PawaPay)
    if (provider.name !== 'pawapay') {
      initialConfig.environment = provider.config?.environment || 'test';
    }

    // Champs spécifiques par provider (VIDES par défaut)
    if (provider.name === 'moneroo' || provider.name === 'pawapay') {
      initialConfig.apiKey = '';
    } else if (provider.name === 'fedapay') {
      initialConfig.publicKey = '';
      initialConfig.secretKey = '';
    } else if (provider.name === 'kkiapay') {
      initialConfig.publicKey = '';
      initialConfig.privateKey = '';
      initialConfig.secret = '';
    }

    initialConfig.webhookSecret = '';

    setConfig(initialConfig);
  }, [provider]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // 🔥 CORRECTION : Filtrer intelligemment
    const cleanConfig = {};
    
    Object.entries(config).forEach(([key, value]) => {
      // Garder enabled et environment toujours
      if (key === 'enabled' || key === 'environment' || key === 'defaultCurrency') {
        cleanConfig[key] = value;
        return;
      }
      
      // Pour les autres champs, ignorer si vide ou masqué
      if (value && value !== '' && value !== '••••••••') {
        cleanConfig[key] = value;
      }
    });

    console.log("📤 Envoi config:", cleanConfig);
    onSave(cleanConfig);
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Environment (sauf PawaPay) */}
      {provider.name !== 'pawapay' && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">Environnement</label>
          <select
            value={config.environment || 'test'}
            onChange={(e) => setConfig({ ...config, environment: e.target.value })}
            className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white"
          >
            <option value="test">Test / Sandbox</option>
            <option value="live">Production / Live</option>
          </select>
        </div>
      )}

      {/* Champs Moneroo */}
      {provider.name === 'moneroo' && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Clé API
            {provider.configured && <span className="text-green-400 text-xs ml-2">(déjà configurée)</span>}
          </label>
          <div className="flex gap-2">
            <input
              type={showSecrets ? "text" : "password"}
              value={config.apiKey || ''}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder={provider.configured ? "Laisser vide pour garder l'actuelle" : "Votre clé API Moneroo"}
              className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowSecrets(!showSecrets)}
              className="px-3 bg-white/5 border border-white/10 rounded-lg"
            >
              {showSecrets ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
          <p className="text-xs text-gray-500 mt-1">
            {provider.configured ? "Laissez vide pour conserver la clé actuelle" : "Entrez votre clé API"}
          </p>
        </div>
      )}

      {/* Champs FedaPay */}
      {provider.name === 'fedapay' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Clé Publique
              {provider.configured && <span className="text-green-400 text-xs ml-2">(déjà configurée)</span>}
            </label>
            <input
              type="text"
              value={config.publicKey || ''}
              onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
              placeholder={provider.configured ? "Laisser vide pour garder l'actuelle" : "pk_sandbox_..."}
              className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Clé Secrète
              {provider.configured && <span className="text-green-400 text-xs ml-2">(déjà configurée)</span>}
            </label>
            <div className="flex gap-2">
              <input
                type={showSecrets ? "text" : "password"}
                value={config.secretKey || ''}
                onChange={(e) => setConfig({ ...config, secretKey: e.target.value })}
                placeholder={provider.configured ? "Laisser vide pour garder l'actuelle" : "sk_sandbox_..."}
                className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowSecrets(!showSecrets)}
                className="px-3 bg-white/5 border border-white/10 rounded-lg"
              >
                {showSecrets ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Champs KkiaPay */}
      {provider.name === 'kkiapay' && (
        <>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Public API Key
              {provider.configured && <span className="text-green-400 text-xs ml-2">(déjà configurée)</span>}
            </label>
            <input
              type="text"
              value={config.publicKey || ''}
              onChange={(e) => setConfig({ ...config, publicKey: e.target.value })}
              placeholder={provider.configured ? "Laisser vide pour garder l'actuelle" : "Votre public key"}
              className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Private API Key
              {provider.configured && <span className="text-green-400 text-xs ml-2">(déjà configurée)</span>}
            </label>
            <div className="flex gap-2">
              <input
                type={showSecrets ? "text" : "password"}
                value={config.privateKey || ''}
                onChange={(e) => setConfig({ ...config, privateKey: e.target.value })}
                placeholder={provider.configured ? "Laisser vide pour garder l'actuelle" : "Votre private key"}
                className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowSecrets(!showSecrets)}
                className="px-3 bg-white/5 border border-white/10 rounded-lg"
              >
                {showSecrets ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-2">
              Secret
              {provider.configured && <span className="text-green-400 text-xs ml-2">(déjà configuré)</span>}
            </label>
            <div className="flex gap-2">
              <input
                type={showSecrets ? "text" : "password"}
                value={config.secret || ''}
                onChange={(e) => setConfig({ ...config, secret: e.target.value })}
                placeholder={provider.configured ? "Laisser vide pour garder l'actuel" : "Votre secret"}
                className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
              />
              <button
                type="button"
                onClick={() => setShowSecrets(!showSecrets)}
                className="px-3 bg-white/5 border border-white/10 rounded-lg"
              >
                {showSecrets ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>
        </>
      )}

      {/* Champs PawaPay */}
      {provider.name === 'pawapay' && (
        <div>
          <label className="block text-sm font-medium text-gray-400 mb-2">
            Clé API
            {provider.configured && <span className="text-green-400 text-xs ml-2">(déjà configurée)</span>}
          </label>
          <div className="flex gap-2">
            <input
              type={showSecrets ? "text" : "password"}
              value={config.apiKey || ''}
              onChange={(e) => setConfig({ ...config, apiKey: e.target.value })}
              placeholder={provider.configured ? "Laisser vide pour garder l'actuelle" : "Votre clé API PawaPay"}
              className="flex-1 px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
            />
            <button
              type="button"
              onClick={() => setShowSecrets(!showSecrets)}
              className="px-3 bg-white/5 border border-white/10 rounded-lg"
            >
              {showSecrets ? <EyeOff size={18} /> : <Eye size={18} />}
            </button>
          </div>
        </div>
      )}

      {/* Webhook Secret (tous) */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Webhook Secret (optionnel)</label>
        <input
          type={showSecrets ? "text" : "password"}
          value={config.webhookSecret || ''}
          onChange={(e) => setConfig({ ...config, webhookSecret: e.target.value })}
          placeholder={provider.configured ? "Laisser vide pour garder l'actuel" : "whsec_..."}
          className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
        />
      </div>

      {/* Devise (tous) */}
      <div>
        <label className="block text-sm font-medium text-gray-400 mb-2">Devise par défaut</label>
        <input
          type="text"
          value={config.defaultCurrency || 'XOF'}
          onChange={(e) => setConfig({ ...config, defaultCurrency: e.target.value })}
          placeholder="XOF"
          className="w-full px-4 py-2 bg-black/30 border border-white/10 rounded-lg text-white placeholder:text-gray-500"
        />
      </div>

      {/* Boutons */}
      <div className="flex gap-2 pt-4">
        <button
          type="submit"
          disabled={saving}
          className="px-6 py-2 bg-green-600 hover:bg-green-700 rounded-lg transition disabled:opacity-50 text-white font-medium"
        >
          {saving ? 'Sauvegarde...' : '💾 Sauvegarder'}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded-lg transition text-white font-medium"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}