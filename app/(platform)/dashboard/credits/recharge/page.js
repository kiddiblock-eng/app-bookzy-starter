"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, Zap, X, TrendingUp, Check } from "lucide-react";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

function fmt(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
}

const PRICE_PER_CREDIT = { free: 150, solo: 100, createur: 100, agence: 100 };
const MIN_CREDITS = 10;
const MAX_CREDITS = 3000;

const PLANS_INFO = [
  { id: "solo_monthly",       name: "Pass Solo",               price: 5100,  credits: 60,   pricePerCr: 85, color: "#0f172a", period: "mensuel"      },
  { id: "solo_quarterly",     name: "Pass Solo Trimestriel",   price: 13005, credits: 180,  pricePerCr: 72, color: "#0f172a", period: "trimestriel"   },
  { id: "createur_monthly",   name: "Pack Créateur",           price: 19125, credits: 330,  pricePerCr: 58, color: "#2563eb", period: "mensuel"       },
  { id: "createur_quarterly", name: "Pack Créateur Trim.",     price: 48769, credits: 990,  pricePerCr: 49, color: "#2563eb", period: "trimestriel"   },
  { id: "agence_monthly",     name: "Pack Agence",             price: 31500, credits: 700,  pricePerCr: 45, color: "#065f46", period: "mensuel"       },
  { id: "agence_quarterly",   name: "Pack Agence Trimestriel", price: 80325, credits: 2100, pricePerCr: 38, color: "#065f46", period: "trimestriel"   },
];

// Trouve le meilleur plan UNIQUEMENT si moins cher que la recharge
function getBestPlan(creditsWanted, totalSpend) {
  // Uniquement les plans moins chers que ce que l'utilisateur allait payer
  const cheaper = PLANS_INFO.filter(p => p.price < totalSpend);
  if (cheaper.length === 0) return null; // Aucun plan moins cher → pas de modal

  // Parmi les plans moins chers, celui qui donne le plus de crédits
  // en priorité ceux qui couvrent le besoin
  const coverAndCheaper = cheaper.filter(p => p.credits >= creditsWanted);
  if (coverAndCheaper.length > 0) return coverAndCheaper[0];

  // Sinon le plus généreux parmi les moins chers
  return cheaper[cheaper.length - 1];
}

// ─── MODAL COMPARAISON ────────────────────────────────────────────────────────
function UpgradeModal({ amount, total, onClose, onContinue, onUpgrade }) {
  const best = getBestPlan(amount, total);
  // Combien il faut ajouter pour atteindre le plan
  const toAdd = Math.max(0, best.price - total);
  // Crédits bonus par rapport à ce qu'il voulait
  const extraCredits = best.credits - amount;

  return (
    <div style={{
      position: "fixed", inset: 0, zIndex: 100,
      background: "rgba(0,0,0,0.5)", backdropFilter: "blur(4px)",
      display: "flex", alignItems: "center", justifyContent: "center",
      padding: "20px",
    }}>
      <div style={{
        background: "#fff", borderRadius: 20, width: "100%", maxWidth: 460,
        boxShadow: "0 20px 60px rgba(0,0,0,0.2)", overflow: "hidden",
      }}>

        {/* Header */}
        <div style={{ background: best.color, padding: "22px 24px 20px", position: "relative" }}>
          <button onClick={onClose} style={{
            position: "absolute", top: 14, right: 14,
            background: "rgba(255,255,255,0.15)", border: "none",
            borderRadius: "50%", width: 28, height: 28, cursor: "pointer",
            display: "flex", alignItems: "center", justifyContent: "center",
          }}>
            <X size={14} color="#fff" />
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
            <TrendingUp size={16} color="rgba(255,255,255,0.8)" />
            <span style={{ fontSize: 11, fontWeight: 700, color: "rgba(255,255,255,0.7)", textTransform: "uppercase", letterSpacing: "0.1em" }}>
              Attendez une meilleure offre disponible
            </span>
          </div>
          {/* Message principal dynamique */}
          {toAdd > 0 ? (
            <p style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 800, margin: 0, lineHeight: 1.4 }}>
              Ajoutez seulement{" "}
              <span style={{ background: "rgba(255,255,255,0.2)", padding: "1px 8px", borderRadius: 6 }}>
                {fmt(toAdd)} FCFA
              </span>
              {" "}de plus et obtenez{" "}
              <strong>{best.credits} crédits</strong> avec le {best.name}.
            </p>
          ) : (
            <p style={{ color: "#fff", fontSize: "1.05rem", fontWeight: 800, margin: 0, lineHeight: 1.4 }}>
              Le {best.name} à {fmt(best.price)} FCFA vous donne{" "}
              <strong>{best.credits} crédits</strong>, bien plus avantageux !
            </p>
          )}
        </div>

        {/* Contenu */}
        <div style={{ padding: "22px 24px" }}>

          {/* Comparaison chiffrée */}
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>

            {/* Recharge seule */}
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "14px" }}>
              <p style={{ fontSize: 10, fontWeight: 700, color: "#ef4444", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>
                Recharge seule
              </p>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "0 0 2px", letterSpacing: "-0.02em" }}>
                {amount} cr.
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: "#ef4444", margin: "0 0 6px", letterSpacing: "-0.02em" }}>{fmt(total)} <span style={{ fontSize: 12, fontWeight: 600 }}>FCFA</span></p>
              <p style={{ fontSize: 11, color: "#ef4444", fontWeight: 600, margin: 0 }}>150 FCFA / crédit</p>
            </div>

            {/* Plan recommandé */}
            <div style={{ background: `${best.color}12`, border: `2px solid ${best.color}`, borderRadius: 12, padding: "14px", position: "relative" }}>
              <div style={{
                position: "absolute", top: -10, left: "50%", transform: "translateX(-50%)",
                background: best.color, color: "#fff", fontSize: 9, fontWeight: 700,
                padding: "2px 10px", borderRadius: 999, whiteSpace: "nowrap",
                textTransform: "uppercase", letterSpacing: "0.08em",
              }}>
{toAdd > 0 ? `+ ${fmt(toAdd)} FCFA` : best.period === "trimestriel" ? "Trimestriel" : "Meilleur deal"}
              </div>
              <p style={{ fontSize: 10, fontWeight: 700, color: best.color, textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 8px" }}>
                {best.name}
              </p>
              <p style={{ fontSize: "1.4rem", fontWeight: 800, color: "#0f172a", margin: "0 0 2px", letterSpacing: "-0.02em" }}>
                {best.credits} cr.
              </p>
              <p style={{ fontSize: "1.5rem", fontWeight: 800, color: best.color, margin: "0 0 6px", letterSpacing: "-0.02em" }}>{fmt(best.price)} <span style={{ fontSize: 12, fontWeight: 600 }}>FCFA</span></p>
              <p style={{ fontSize: 11, color: best.color, fontWeight: 600, margin: 0 }}>{best.pricePerCr} FCFA / crédit</p>
            </div>
          </div>

          {/* Points clés */}
          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "14px 16px", marginBottom: 20 }}>
            {extraCredits > 0 && (
              <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
                <Check size={13} color="#10b981" strokeWidth={3} />
                <span style={{ fontSize: 13, color: "#374151" }}>
                  <strong style={{ color: "#10b981" }}>{extraCredits} crédits de plus</strong> qu'avec la recharge
                </span>
              </div>
            )}
            <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 8 }}>
              <Check size={13} color="#10b981" strokeWidth={3} />
              <span style={{ fontSize: 13, color: "#374151" }}>Quotas gratuits par jour : Niche Hunter, Youbook, Analyses</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
              <Check size={13} color="#10b981" strokeWidth={3} />
              <span style={{ fontSize: 13, color: "#374151" }}>Crédits accumulables, n'expirent jamais</span>
            </div>
          </div>

          {/* Boutons */}
          <button
            onClick={() => onUpgrade(best.id)}
            style={{
              width: "100%", padding: "13px 0", borderRadius: 12,
              fontSize: 14, fontWeight: 700, border: "none", cursor: "pointer",
              background: best.color, color: "#fff", marginBottom: 10,
            }}
          >
{toAdd > 0 ? `Choisir le ${best.name}` : `Choisir le ${best.name}`}
          </button>
          <p style={{ fontSize: 11, color: "#94a3b8", textAlign: "center", margin: "0 0 10px" }}>
            Paiement unique · Aucun prélèvement automatique
          </p>
          <button
            onClick={onContinue}
            style={{
              width: "100%", padding: "11px 0", borderRadius: 12,
              fontSize: 13, fontWeight: 600, border: "1px solid #e2e8f0",
              cursor: "pointer", background: "#fff", color: "#64748b",
            }}
          >
            Continuer avec la recharge ({fmt(total)} FCFA)
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function RechargePage() {
  const router = useRouter();
  const [amount, setAmount] = useState(30);
  const [inputVal, setInputVal] = useState("30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [showModal, setShowModal] = useState(false);

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, { revalidateOnFocus: false });
  const balance = balanceData?.credits?.balance ?? null;
  const plan = balanceData?.plan ?? "free";
  const isFree = plan === "free";

  const pricePerCredit = PRICE_PER_CREDIT[plan] ?? 150;
  const total = amount * pricePerCredit;

  const PRESETS = [20, 50, 100, 200];

  const handleInput = (val) => {
    setInputVal(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= MIN_CREDITS && n <= MAX_CREDITS) setAmount(n);
  };

  const handlePreset = (n) => { setAmount(n); setInputVal(String(n)); };

  const handlePayClick = () => {
    if (amount < MIN_CREDITS || amount > MAX_CREDITS) return;
    if (isFree) {
      const best = getBestPlan(amount, total);
      if (best) {
        setShowModal(true); // Modal comparaison seulement si un plan est moins cher
      } else {
        doPurchase(); // Aucun plan moins cher → paiement direct
      }
    } else {
      doPurchase();
    }
  };

  const doPurchase = async () => {
    setShowModal(false);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          packId: `recharge_${amount}_${plan}`,
          returnUrl: `${window.location.origin}/dashboard/credits`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Erreur paiement");
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  const handleUpgrade = async (packId) => {
    setShowModal(false);
    setLoading(true);
    setError("");
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          packId,
          returnUrl: `${window.location.origin}/dashboard/credits`,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Erreur paiement");
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {showModal && (
        <UpgradeModal
          amount={amount}
          total={total}
          onClose={() => setShowModal(false)}
          onContinue={doPurchase}
          onUpgrade={handleUpgrade}
        />
      )}

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => router.back()}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
          >
            <ArrowLeft size={15} />
            Retour
          </button>
          {balance !== null && (
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Solde : <strong style={{ color: "#1e293b" }}>{balance} cr.</strong>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px 60px" }}>

        <div style={{ marginBottom: 28 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 6px" }}>
            Recharger mes crédits
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
            Choisissez le nombre de crédits à ajouter à votre solde.
          </p>
        </div>

        {/* Badge plan */}
        <div style={{
          display: "inline-flex", alignItems: "center", gap: 6,
          background: isFree ? "#f1f5f9" : "#eff6ff",
          border: `1px solid ${isFree ? "#e2e8f0" : "#93c5fd"}`,
          borderRadius: 999, padding: "5px 12px", marginBottom: 24,
          fontSize: 12, fontWeight: 600,
          color: isFree ? "#64748b" : "#2563eb",
        }}>
          
          {isFree ? "Compte gratuit" : `Plan ${plan.charAt(0).toUpperCase() + plan.slice(1)}`}
        </div>

        {/* Card */}
        <div style={{ background: "#fff", borderRadius: 20, border: "1px solid #e2e8f0", padding: "28px 24px", boxShadow: "0 2px 12px rgba(0,0,0,0.05)", marginBottom: 16 }}>

          <p style={{ fontSize: 13, fontWeight: 600, color: "#374151", margin: "0 0 10px" }}>Nombre de crédits</p>
          <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 16 }}>
            <input
              type="number"
              value={inputVal}
              min={MIN_CREDITS}
              max={MAX_CREDITS}
              onChange={(e) => handleInput(e.target.value)}
              style={{
                width: 120, height: 52, borderRadius: 12,
                border: "2px solid #e2e8f0", fontSize: "1.3rem",
                fontWeight: 700, color: "#0f172a", textAlign: "center",
                outline: "none", background: "#f8fafc",
              }}
            />
            <span style={{ fontSize: 13, color: "#94a3b8" }}>crédits · min. {MIN_CREDITS} · max. 3 000</span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {PRESETS.map((n) => (
              <button key={n} onClick={() => handlePreset(n)} style={{
                padding: "7px 16px", borderRadius: 8, border: "none",
                fontSize: 13, fontWeight: 600, cursor: "pointer",
                background: amount === n ? "#0f172a" : "#f1f5f9",
                color: amount === n ? "#fff" : "#475569",
                transition: "all .15s",
              }}>
                {n} cr.
              </button>
            ))}
          </div>

          <div style={{ background: "#f8fafc", borderRadius: 12, padding: "16px 18px", marginBottom: 20 }}>
            <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 8 }}>
              <span style={{ fontSize: 13, color: "#64748b" }}>{amount} crédits × {fmt(pricePerCredit)} FCFA</span>
              <span style={{ fontSize: 13, fontWeight: 600, color: "#1e293b" }}>{fmt(total)} FCFA</span>
            </div>
            <div style={{ height: 1, background: "#e2e8f0", margin: "10px 0" }} />
            <div style={{ display: "flex", justifyContent: "space-between" }}>
              <span style={{ fontSize: 14, fontWeight: 700, color: "#0f172a" }}>Total</span>
              <span style={{ fontSize: "1.3rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em" }}>{fmt(total)} FCFA</span>
            </div>
          </div>

          {error && (
            <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 10, padding: "10px 14px", fontSize: 13, color: "#b91c1c", marginBottom: 14 }}>
              {error}
            </div>
          )}
          <button
            onClick={handlePayClick}
            disabled={loading || amount < MIN_CREDITS || amount > MAX_CREDITS}
            style={{
              width: "100%", padding: "14px 0", borderRadius: 12,
              fontSize: 14, fontWeight: 700, border: "none",
              cursor: loading ? "default" : "pointer",
              opacity: loading ? 0.6 : 1,
              background: "#2563eb", color: "#fff",
            }}
          >
            {loading ? "Redirection..." : `Payer ${fmt(total)} FCFA`}
          </button>
        </div>

        <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "center", marginTop: 20 }}>
          Paiement sécurisé · Les crédits s'ajoutent immédiatement · N'expirent jamais
        </p>

      </div>
    </div>
  );
}