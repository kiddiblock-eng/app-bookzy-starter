import { useState } from "react";
import { ArrowRight, Info, Check } from "lucide-react";
import { toast } from "react-hot-toast";

export default function WithdrawTab({ balance, onSuccess, isFirstWithdraw = true }) {
  const [amount, setAmount] = useState("");
  const [method, setMethod] = useState("WAVE");
  const [phone, setPhone] = useState("");
  const [country, setCountry] = useState("CI");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/affiliation/payout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ amount, method, phoneNumber: phone, country })
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json.error);
      
      toast.success("Demande envoyée");
      setAmount("");
      setPhone("");
      onSuccess();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  const minAmount = isFirstWithdraw ? 600 : 5000;

  return (
    <div className="max-w-2xl">
      
      {/* HEADER */}
      <div className="mb-8">
        <h2 className="text-3xl font-bold text-slate-900 mb-2 tracking-tight">
          Demander un retrait
        </h2>
        <p className="text-slate-600">
          Retirez vos gains vers votre compte mobile money
        </p>
      </div>

      {/* LAYOUT 2 COLONNES */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE - Formulaire (2/3) */}
        <div className="lg:col-span-2">
          <form onSubmit={handleSubmit} className="bg-white border border-slate-200 rounded-2xl p-8 shadow-sm space-y-6">
            
            {/* MONTANT */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Montant à retirer
              </label>
              <div className="relative">
                <input 
                  type="number" 
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="0"
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-5 py-4 text-slate-900 text-2xl font-bold tabular-nums focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
                />
                <span className="absolute right-5 top-1/2 -translate-y-1/2 text-slate-400 text-lg font-semibold">
                  FCFA
                </span>
              </div>
              <div className="flex items-center justify-end mt-2">
                <p className="text-xs text-slate-700 font-semibold">
                  Disponible : {balance?.toLocaleString()} FCFA
                </p>
              </div>
            </div>

            {/* PAYS & SERVICE */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Pays
                </label>
                <select 
                  value={country} 
                  onChange={e => setCountry(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="CI">🇨🇮 Côte d'Ivoire</option>
                  <option value="SN">🇸🇳 Sénégal</option>
                  <option value="BJ">🇧🇯 Bénin</option>
                  <option value="TG">🇹🇬 Togo</option>
                  <option value="ML">🇲🇱 Mali</option>
                  <option value="BF">🇧🇫 Burkina Faso</option>
                </select>
              </div>
              
              <div>
                <label className="block text-sm font-semibold text-slate-900 mb-2">
                  Service
                </label>
                <select 
                  value={method} 
                  onChange={e => setMethod(e.target.value)}
                  className="w-full bg-white border-2 border-slate-200 rounded-xl px-4 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none appearance-none cursor-pointer"
                >
                  <option value="WAVE">Wave</option>
                  <option value="ORANGE_MONEY">Orange Money</option>
                  <option value="MTN_MOMO">MTN Mobile Money</option>
                  <option value="MOOV_MONEY">Moov Money</option>
                </select>
              </div>
            </div>

            {/* TÉLÉPHONE */}
            <div>
              <label className="block text-sm font-semibold text-slate-900 mb-2">
                Numéro de téléphone
              </label>
              <input 
                type="tel" 
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                placeholder="Ex: 0701020304"
                className="w-full bg-white border-2 border-slate-200 rounded-xl px-5 py-3 text-slate-900 font-medium focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-all"
              />
            </div>

            {/* BOUTON SUBMIT */}
            <button 
              type="submit"
              disabled={loading || !amount || Number(amount) > balance || Number(amount) < minAmount || !phone}
              className="w-full bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 disabled:from-slate-300 disabled:to-slate-300 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl transition-all flex items-center justify-center gap-2 shadow-lg disabled:shadow-none"
            >
              {loading ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Traitement en cours...
                </>
              ) : (
                <>
                  Confirmer le retrait
                  <ArrowRight className="w-5 h-5" />
                </>
              )}
            </button>
          </form>
        </div>

        {/* COLONNE DROITE - UN SEUL BLOC INFOS */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
            
            {/* Titre du bloc */}
            <div className="flex items-center gap-2 mb-5 pb-4 border-b border-slate-100">
              <Info className="w-5 h-5 text-indigo-600" />
              <div className="text-base font-bold text-slate-900">
                Informations importantes
              </div>
            </div>

            {/* Toutes les infos */}
            <div className="space-y-4">
              
              {/* Délai */}
              <div>
                <div className="text-xs font-bold text-slate-900 mb-2">
                  ⏱️ Délai de traitement
                </div>
                <div className="text-xs text-slate-600 leading-relaxed">
                  Validation en 24h après demande, maximum 48h. Uniquement les jours ouvrables.
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Montants */}
              <div>
                <div className="text-xs font-bold text-slate-900 mb-2">
                  💰 Montants minimums
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <div className="text-xs text-slate-600">
                      Premier retrait : <span className="font-semibold text-slate-900">600 FCFA</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <div className="text-xs text-slate-600">
                      Retraits suivants : <span className="font-semibold text-slate-900">5 000 FCFA</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Crypto */}
              <div>
                <div className="text-xs font-bold text-slate-900 mb-2">
                  ₿ Retrait en crypto
                </div>
                <div className="text-xs text-slate-600 leading-relaxed mb-2">
                  Retrait possible par crypto (USDT, BTC, etc.) sur demande au support.
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Conditions */}
              <div>
                <div className="text-xs font-bold text-slate-900 mb-2">
                  ✓ À savoir
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <div className="text-xs text-slate-600">
                      Aucun frais de retrait
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Check className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                    <div className="text-xs text-slate-600">
                      Vérifiez bien votre numéro
                    </div>
                  </div>
                </div>
              </div>

              <div className="h-px bg-slate-100"></div>

              {/* Support */}
              <div>
                <div className="text-xs font-bold text-slate-900 mb-2">
                  💬 Besoin d'aide ?
                </div>
                <a 
                  href="mailto:support@bookzy.io"
                  className="inline-flex items-center gap-1 text-xs font-semibold text-indigo-600 hover:text-indigo-700 transition-colors"
                >
                  support@bookzy.io
                  <ArrowRight className="w-3 h-3" />
                </a>
              </div>

            </div>
          </div>
        </div>

      </div>
    </div>
  );
}