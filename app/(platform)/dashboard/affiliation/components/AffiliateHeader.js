import { Copy, Check, Zap, ArrowLeftFromLineIcon } from "lucide-react";
import { toast } from "react-hot-toast";
import { useState } from "react";

export default function AffiliateHeader({ wallet, referralLink, loading }) {
  const [copied, setCopied] = useState(false);

  const copyLink = () => {
    if (!referralLink) return;
    navigator.clipboard.writeText(referralLink);
    setCopied(true);
    toast.success("Lien copié");
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="mb-12">
      {/* TITRE */}
      <div className="mb-8">
        <h1 className="text-4xl font-bold text-slate-900 mb-2 tracking-tight">
          Affiliation
        </h1>
        <p className="text-slate-600 text-base">
          Gagnez 10% sur chaque achat de vos filleuls à vie.
        </p>
      </div>

      {/* LAYOUT */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* 💳 BOOKZY WALLET CARD - Réduite */}
        <div className="relative h-[200px] rounded-3xl overflow-hidden shadow-2xl group">
          
          {/* Background slate-900 style dashboard */}
          <div className="absolute inset-0 bg-slate-900"></div>
          <div className="absolute top-0 right-0 w-48 h-48 rounded-full opacity-10" style={{ background: "radial-gradient(circle, #6366f1 0%, transparent 70%)" }}></div>
          <div className="absolute inset-0 opacity-10 rounded-3xl" style={{
            backgroundImage: "linear-gradient(rgba(255,255,255,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.05) 1px, transparent 1px)",
            backgroundSize: "30px 30px"
          }}></div>

          {/* 💎 Contenu de la carte */}
          <div className="relative h-full flex flex-col justify-between p-6">
            
            {/* 🏷️ Header - Logo + Nom */}
            <div className="flex items-start justify-between">
              <div className="flex items-center gap-3">
                {/* Logo Bookzy avec glow */}
                <div className="relative">
                  <div className="absolute inset-0 bg-white/30 rounded-2xl blur-xl"></div>
                  <div className="relative w-10 h-10 bg-white/20 backdrop-blur-xl rounded-2xl border-2 border-white/40 flex items-center justify-center shadow-2xl">
                    <svg className="w-5 h-5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2.5}>
                      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                    </svg>
                  </div>
                </div>
                <div>
                  <div className="text-white/90 text-sm font-bold tracking-wide">
                    BOOKZY
                  </div>
                  <div className="text-white/70 text-xs font-medium">
                    Wallet
                  </div>
                </div>
              </div>

              {/* Chip NFC simulé */}
              <div className="w-9 h-7 rounded-md bg-gradient-to-br from-amber-200 to-amber-400 opacity-80 relative overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-amber-600/30"></div>
                <div className="absolute inset-[2px] rounded-sm bg-amber-300/50"></div>
              </div>
            </div>

            {/* 💰 Montant - Style carte bancaire */}
            <div>
              {loading ? (
                <div className="h-14 w-48 bg-white/20 rounded-xl animate-pulse backdrop-blur-sm"></div>
              ) : (
                <div className="space-y-1">
                  <div className="text-white/80 text-[11px] font-semibold tracking-widest uppercase">
                    Solde disponible
                  </div>
                  <div className="flex items-baseline gap-2">
                    <span className="text-5xl font-black text-white tracking-tight tabular-nums" style={{
                      textShadow: '0 4px 20px rgba(0,0,0,0.3), 0 0 40px rgba(255,255,255,0.1)'
                    }}>
                      {wallet?.balance?.toLocaleString()}
                    </span>
                    <span className="text-lg font-bold text-white/80">
                      FCFA
                    </span>
                  </div>
                </div>
              )}
            </div>

            {/* 📊 Footer - Stats */}
            <div className="flex items-end justify-between">
              <div>
                <div className="text-white/60 text-[10px] uppercase tracking-widest font-semibold mb-1">
                  Total gagné
                </div>
                <div className="text-white text-base font-bold tabular-nums">
                  {loading ? "---" : `${(wallet?.totalEarned || 0).toLocaleString()}`}
                </div>
              </div>

              {/* Programme badge */}
              <div className="text-right">
                <div className="text-white/60 text-[10px] uppercase tracking-widest font-semibold mb-1">
                  Programme
                </div>
                <div className="text-white text-xs font-mono font-bold tracking-wider flex items-center gap-1">
                 
                  AFFILIÉ
                </div>
              </div>
            </div>

          </div>

          <div className="absolute inset-0 rounded-3xl ring-1 ring-white/10 ring-inset"></div>
        </div>

        {/* 📋 LIEN DE PARRAINAGE - Sans icône, sans stats */}
        <div className="bg-white rounded-3xl p-8 border border-slate-200 shadow-lg flex flex-col justify-center">
          <div className="mb-6">
            <h3 className="text-xl font-bold text-slate-900 mb-2">
              Lien de parrainage
            </h3>
            <p className="text-sm text-slate-600">
              Copiez et partagez votre lien unique
            </p>
          </div>

          {loading ? (
            <div className="h-12 bg-slate-100 rounded-xl animate-pulse"></div>
          ) : (
            <div className="relative">
              <div className="flex items-center gap-2 p-4 bg-slate-50 border-2 border-slate-200 rounded-xl hover:border-indigo-300 hover:bg-slate-100 transition-all group">
                <code className="flex-1 text-sm text-slate-700 font-mono truncate">
                  {referralLink || "Génération..."}
                </code>
                <button 
                  onClick={copyLink}
                  disabled={loading}
                  className="p-2.5 bg-white hover:bg-indigo-50 rounded-lg transition-all text-slate-600 hover:text-indigo-600 disabled:opacity-50 flex-shrink-0 border border-slate-200 hover:border-indigo-300 shadow-sm hover:shadow"
                >
                  {copied ? <Check className="w-5 h-5" /> : <Copy className="w-5 h-5" />}
                </button>
              </div>
              {copied && (
                <div className="absolute -top-10 left-1/2 -translate-x-1/2 px-3 py-1.5 bg-slate-900 text-white text-xs font-semibold rounded-lg shadow-lg animate-in fade-in slide-in-from-bottom-2 duration-200">
                  Copié ! ✓
                </div>
              )}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}