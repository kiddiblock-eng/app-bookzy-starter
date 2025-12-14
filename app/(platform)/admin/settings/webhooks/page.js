"use client";

import { useEffect, useState } from "react";
import {
  Network,
  Loader2,
  Copy,
  Check,
  Link2,
  RefreshCcw,
  AlertTriangle,
} from "lucide-react";

export default function WebhooksSettingsPage() {
  const [loading, setLoading] = useState(true);
  const [settings, setSettings] = useState(null);
  const [providers, setProviders] = useState([]);

  const [copiedStates, setCopiedStates] = useState({});
  const [saving, setSaving] = useState(false);

  const [webhookSecrets, setWebhookSecrets] = useState({
    moneroo: "",
    fedapay: "",
    kkiapay: "",
    pawapay: "",
  });

  const load = async () => {
    try {
      // Charger les settings généraux
      const resSettings = await fetch("/api/admin/settings/get", {
        credentials: "include",
      });
      const jsonSettings = await resSettings.json();

      if (jsonSettings.success) {
        setSettings(jsonSettings.settings);

        // Charger les secrets actuels
        setWebhookSecrets({
          moneroo: jsonSettings.settings.payment?.moneroo?.webhookSecret || "",
          fedapay: jsonSettings.settings.payment?.fedapay?.webhookSecret || "",
          kkiapay: jsonSettings.settings.payment?.kkiapay?.webhookSecret || "",
          pawapay: jsonSettings.settings.payment?.pawapay?.webhookSecret || "",
        });
      }

      // Charger la liste des providers
      const resProviders = await fetch("/api/admin/payment-providers", {
        credentials: "include",
      });
      const jsonProviders = await resProviders.json();

      if (jsonProviders.success) {
        setProviders(jsonProviders.providers);
      }
    } catch (e) {
      console.error(e);
    }
    setLoading(false);
  };

  useEffect(() => {
    load();
  }, []);

  const appDomain = settings?.appDomain || "";

  const getWebhookUrl = (providerName) => {
    if (!appDomain) return "";
    return `${appDomain.replace(/\/$/, "")}/api/webhooks/${providerName}`;
  };

  const handleCopy = (value, key) => {
    navigator.clipboard.writeText(value);
    setCopiedStates({ ...copiedStates, [key]: true });
    setTimeout(() => {
      setCopiedStates({ ...copiedStates, [key]: false });
    }, 1500);
  };

  const regenerateSecret = (providerName) => {
    const newSecret = crypto.randomUUID().replace(/-/g, "");
    setWebhookSecrets({
      ...webhookSecrets,
      [providerName]: newSecret,
    });
  };

  const save = async () => {
    if (!settings) return;
    setSaving(true);

    try {
      await fetch("/api/admin/settings/update", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          payment: {
            moneroo: { webhookSecret: webhookSecrets.moneroo },
            fedapay: { webhookSecret: webhookSecrets.fedapay },
            kkiapay: { webhookSecret: webhookSecrets.kkiapay },
            pawapay: { webhookSecret: webhookSecrets.pawapay },
          },
        }),
      });

      alert("✅ Secrets webhook sauvegardés !");
    } catch (e) {
      console.error(e);
      alert("❌ Erreur lors de la sauvegarde");
    }

    setSaving(false);
  };

  if (loading) {
    return (
      <div className="flex justify-center py-20">
        <Loader2 className="w-10 h-10 animate-spin text-purple-400" />
      </div>
    );
  }

  const providerIcons = {
    moneroo: "💳",
    fedapay: "🔵",
    kkiapay: "🟣",
    pawapay: "🟢",
  };

  const providerNames = {
    moneroo: "Moneroo",
    fedapay: "FedaPay",
    kkiapay: "KkiaPay",
    pawapay: "PawaPay",
  };

  return (
    <div className="max-w-4xl space-y-10">
      <h1 className="text-3xl font-bold flex items-center gap-3">
        <Network className="text-purple-400" />
        Configuration des Webhooks
      </h1>

      {!appDomain && (
        <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-yellow-500/40 bg-yellow-900/20 text-sm text-yellow-100">
          <AlertTriangle className="w-4 h-4" />
          <span>
            Tu dois définir le domaine de ton application (appDomain) dans les
            paramètres généraux pour générer des URLs de webhook valides.
          </span>
        </div>
      )}

      {/* Provider Webhooks */}
      <div className="space-y-6">
        {providers.map((provider) => {
          const providerName = provider.name;
          const webhookUrl = getWebhookUrl(providerName);

          return (
            <div
              key={providerName}
              className={`bg-white/5 border rounded-2xl p-6 space-y-5 ${
                provider.enabled
                  ? "border-white/10"
                  : "border-white/5 opacity-50"
              }`}
            >
              <div className="flex items-center justify-between">
                <h2 className="text-lg font-semibold flex items-center gap-2">
                  <span className="text-2xl">
                    {providerIcons[providerName]}
                  </span>
                  Webhook {providerNames[providerName]}
                </h2>

                {!provider.enabled && (
                  <span className="text-xs px-3 py-1 rounded-full bg-gray-700/50 text-gray-400">
                    Provider désactivé
                  </span>
                )}

                {provider.isActive && (
                  <span className="text-xs px-3 py-1 rounded-full bg-yellow-600/30 text-yellow-300">
                    ⭐ Provider actif
                  </span>
                )}
              </div>

              {/* URL */}
              <div>
                <label className="text-sm text-gray-400 flex items-center gap-2">
                  <Link2 className="w-4 h-4" /> URL à configurer dans{" "}
                  {providerNames[providerName]}
                </label>

                <div className="mt-1 flex items-center gap-2">
                  <input
                    readOnly
                    value={
                      webhookUrl || "Configure appDomain d'abord"
                    }
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm"
                  />
                  {webhookUrl && (
                    <button
                      onClick={() =>
                        handleCopy(webhookUrl, `url-${providerName}`)
                      }
                      className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                      {copiedStates[`url-${providerName}`] ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Configure cette URL dans le dashboard de{" "}
                  {providerNames[providerName]}
                </p>
              </div>

              {/* SECRET */}
              <div>
                <label className="text-sm text-gray-400">
                  Webhook secret
                </label>

                <div className="mt-1 flex items-center gap-2">
                  <input
                    type="text"
                    readOnly
                    value={webhookSecrets[providerName]}
                    className="w-full bg-black/30 border border-white/10 rounded-lg p-3 text-sm"
                  />

                  <button
                    onClick={() => regenerateSecret(providerName)}
                    className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    title="Régénérer le secret"
                  >
                    <RefreshCcw className="w-4 h-4" />
                  </button>

                  {webhookSecrets[providerName] && (
                    <button
                      onClick={() =>
                        handleCopy(
                          webhookSecrets[providerName],
                          `secret-${providerName}`
                        )
                      }
                      className="p-3 bg-white/5 border border-white/10 rounded-lg hover:bg-white/10 transition"
                    >
                      {copiedStates[`secret-${providerName}`] ? (
                        <Check className="w-4 h-4 text-green-400" />
                      ) : (
                        <Copy className="w-4 h-4" />
                      )}
                    </button>
                  )}
                </div>

                <p className="text-xs text-gray-500 mt-1">
                  Colle ce secret dans la configuration webhook de{" "}
                  {providerNames[providerName]}. Il sert à vérifier que les
                  notifications viennent bien du provider.
                </p>
              </div>
            </div>
          );
        })}
      </div>

      {/* Save Button */}
      <button
        onClick={save}
        disabled={saving}
        className="bg-purple-600 hover:bg-purple-700 px-6 py-3 rounded-lg font-semibold transition disabled:opacity-50"
      >
        {saving ? "Enregistrement..." : "Enregistrer tous les secrets"}
      </button>

      {/* Info Box */}
      <div className="bg-blue-900/20 border border-blue-500/30 rounded-xl p-4">
        <h3 className="font-semibold text-blue-300 mb-2">
          📘 Comment configurer les webhooks
        </h3>
        <ol className="text-sm text-gray-300 space-y-2 list-decimal list-inside">
          <li>
            Active et configure le provider dans l'onglet "Paiements"
          </li>
          <li>Copie l'URL de webhook ci-dessus</li>
          <li>
            Va dans le dashboard du provider (Moneroo, FedaPay, etc.)
          </li>
          <li>Trouve la section "Webhooks" ou "Notifications"</li>
          <li>Ajoute l'URL et le secret webhook</li>
          <li>
            Sélectionne les événements à recevoir (payment.success,
            payment.failed, etc.)
          </li>
        </ol>
      </div>
    </div>
  );
}
