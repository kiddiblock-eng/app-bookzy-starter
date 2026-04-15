"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { ArrowLeft, Loader2 } from "lucide-react";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

function fmt(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
}

const MIN_CREDITS = 30;
const MAX_CREDITS = 3000;
const PRESETS = [30, 60, 100, 200];

export default function RechargePage() {
  const router = useRouter();
  const [amount, setAmount] = useState(30);
  const [inputVal, setInputVal] = useState("30");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, { revalidateOnFocus: false });
  const balance = balanceData?.credits?.balance ?? null;
  const plan = balanceData?.plan ?? "free";
  const isFree = !plan || plan === "free";

  // Rediriger les free vers tarifs
  if (balanceData && isFree) {
    router.replace("/dashboard/tarifs");
    return null;
  }

  const pricePerCredit = 100; // Abonnés uniquement → 100 FCFA/cr
  const total = amount * pricePerCredit;

  const handleInput = (val) => {
    setInputVal(val);
    const n = parseInt(val);
    if (!isNaN(n) && n >= MIN_CREDITS && n <= MAX_CREDITS) setAmount(n);
  };

  const handlePreset = (n) => { setAmount(n); setInputVal(String(n)); };

  const handlePay = async () => {
    if (amount < MIN_CREDITS || amount > MAX_CREDITS) return;
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

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 520, margin: "0 auto", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button onClick={() => router.back()} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={15} /> Retour
          </button>
          {balance !== null && (
            <div style={{ fontSize: 12, color: "#94a3b8" }}>
              Solde : <strong style={{ color: "#1e293b" }}>{balance} cr.</strong>
            </div>
          )}
        </div>
      </div>

      <div style={{ maxWidth: 520, margin: "0 auto", padding: "32px 20px 60px" }}>

        <div style={{ marginBottom: 24 }}>
          <h1 style={{ fontSize: "1.5rem", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 6px" }}>
            Recharger mes crédits
          </h1>
          <p style={{ color: "#94a3b8", fontSize: 14, margin: 0 }}>
            Rechargez le montant exact que vous souhaitez.
          </p>
        </div>

        {/* Badge plan + prix préférentiel */}
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 24, flexWrap: "wrap" }}>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#eff6ff", border: "1px solid #93c5fd", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#2563eb" }}>
            Plan {plan.charAt(0).toUpperCase() + plan.slice(1)}
          </div>
          <div style={{ display: "inline-flex", alignItems: "center", gap: 6, background: "#f0fdf4", border: "1px solid #86efac", borderRadius: 999, padding: "5px 12px", fontSize: 12, fontWeight: 600, color: "#16a34a" }}>
            100 FCFA/crédit ✓
          </div>
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
              style={{ width: 120, height: 52, borderRadius: 12, border: "2px solid #e2e8f0", fontSize: "1.3rem", fontWeight: 700, color: "#0f172a", textAlign: "center", outline: "none", background: "#f8fafc" }}
            />
            <span style={{ fontSize: 13, color: "#94a3b8" }}>crédits · min. {MIN_CREDITS} · max. 3 000</span>
          </div>

          <div style={{ display: "flex", gap: 8, flexWrap: "wrap", marginBottom: 24 }}>
            {PRESETS.map((n) => (
              <button key={n} onClick={() => handlePreset(n)} style={{ padding: "7px 16px", borderRadius: 8, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: amount === n ? "#0f172a" : "#f1f5f9", color: amount === n ? "#fff" : "#475569", transition: "all .15s" }}>
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

          <button onClick={handlePay} disabled={loading || amount < MIN_CREDITS || amount > MAX_CREDITS} style={{ width: "100%", padding: "14px 0", borderRadius: 12, fontSize: 14, fontWeight: 700, border: "none", cursor: loading ? "default" : "pointer", opacity: loading ? 0.6 : 1, background: "#2563eb", color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", gap: 8 }}>
            {loading ? <><Loader2 size={16} style={{ animation: "spin 1s linear infinite" }} /> Redirection...</> : `Payer ${fmt(total)} FCFA`}
          </button>
        </div>

        <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "center" }}>
          Paiement sécurisé · Les crédits s'ajoutent immédiatement · N'expirent jamais
        </p>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}