"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Loader2, ArrowLeft, Check, HelpCircle, Zap } from "lucide-react";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

function fmt(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, "\u202f");
}

const PLANS = [
  {
    id: "solo",
    packIds: { monthly: "solo_monthly", quarterly: "solo_quarterly" },
    name: "Pass Solo",
    description: "Pour démarrer",
    price: 5100,
    credits: 60,
    badge: null,
    color: "#0f172a",
    colorLight: "#f8fafc",
    colorBorder: "#e2e8f0",
    colorText: "#334155",
    quotas: { youtubeAnalysis: 2, nicheHunter: 3, nicheAnalysis: 3 },
  },
  {
    id: "createur",
    packIds: { monthly: "createur_monthly", quarterly: "createur_quarterly" },
    name: "Pack Créateur",
    description: "Le plus populaire",
    price: 19125,
    credits: 330,
    badge: "Recommandé",
    color: "#2563eb",
    colorLight: "#eff6ff",
    colorBorder: "#bfdbfe",
    colorText: "#1d4ed8",
    quotas: { youtubeAnalysis: 8, nicheHunter: 8, nicheAnalysis: 8 },
  },
  {
    id: "agence",
    packIds: { monthly: "agence_monthly", quarterly: "agence_quarterly" },
    name: "Pack Agence",
    description: "Pour les équipes",
    price: 31500,
    credits: 700,
    badge: null,
    color: "#065f46",
    colorLight: "#f0fdf4",
    colorBorder: "#a7f3d0",
    colorText: "#047857",
    quotas: { youtubeAnalysis: 15, nicheHunter: 20, nicheAnalysis: 20 },
  },
];

const FEATURES = [
  {
    label: "Générer des ebooks complet avec l'IA",
    solo: true, createur: true, agence: true,
  },
  {
    label: "Transformer des brouillons Word en ebook designé",
    solo: true, createur: true, agence: true,
  },
  {
    label: "Publier votre boutique Smart Shop en ligne",
    solo: true, createur: true, agence: true,
  },
  {
    label: "Transformer des vidéos YouTube en ebooks complets",
    sub: "Extrait le contenu clé avant de générer",
    solo: true, createur: true, agence: true,
  },
  {
    label: "Trouver des niches rentables",
    sub: "Idées de sujets qui vendent",
    solo: true, createur: true, agence: true,
  },
  {
    label: "Analyser des niches en profondeur",
    sub: "Données de marché, concurrence, potentiel",
    solo: true, createur: true, agence: true,
  },
  {
    label: "Tendances ebooks en temps réel",
    sub: "Les sujets qui buzzent en ce moment",
    solo: true, createur: true, agence: true,
  },
  {
    label: "Boutique en ligne pour vendre ses ebooks",
    sub: "Smart Shop personnalisable et prêt à vendre",
    solo: "Créer + Publier", createur: "Créer + Publier", agence: "Multi boutiques",
  },
  {
    label: "Kit marketing automatique",
    sub: "Posts, scripts, visuels inclus à chaque ebook",
    solo: "Complet", createur: "Complet", agence: "Total",
  },
  {
    label: "Support",
    solo: "Email", createur: "Email", agence: "WhatsApp prioritaire",
  },
];

// ─── TOOLTIP ──────────────────────────────────────────────────────────────────
function CreditTooltip({ plan }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const h = (e) => { if (ref.current && !ref.current.contains(e.target)) setOpen(false); };
    document.addEventListener("mousedown", h);
    return () => document.removeEventListener("mousedown", h);
  }, []);

  const q = plan.quotas;
  const items = [
    { label: "Générer un ebook",   cost: "20 cr." },
    { label: "Mise en page",       cost: "10 cr." },
    { label: "Smart Shop",         cost: "5 cr."  },
    { label: "Niche Hunter",       cost: `${q.nicheHunter} gratuits/j puis 1 cr.` },
    { label: "Youbook",            cost: `${q.youtubeAnalysis} gratuits/j puis 2 cr.` },
    { label: "Analyse niche",      cost: `${q.nicheAnalysis} gratuits/j puis 1 cr.` },
  ];

  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 4 }}>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(!open); }}
        style={{ background: "none", border: "none", cursor: "pointer", padding: 0, lineHeight: 0, display: "flex" }}
      >
        <HelpCircle size={13} color={plan.color} opacity={0.6} />
      </button>
      {open && (
        <div style={{
          position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)",
          background: "#0f172a", borderRadius: 12, padding: "14px 16px", zIndex: 100,
          boxShadow: "0 12px 40px rgba(0,0,0,0.22)", width: 230, pointerEvents: "none",
        }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>
            Coût par action
          </p>
          {items.map((item, i) => (
            <div key={i} style={{ display: "flex", justifyContent: "space-between", alignItems: "baseline", gap: 8, marginBottom: i < items.length - 1 ? 7 : 0 }}>
              <span style={{ fontSize: 12, color: "rgba(255,255,255,0.55)", flexShrink: 0 }}>{item.label}</span>
              <span style={{ fontSize: 11, fontWeight: 600, color: "#fff", textAlign: "right" }}>{item.cost}</span>
            </div>
          ))}
          <div style={{ position: "absolute", bottom: -5, left: "50%", transform: "translateX(-50%) rotate(45deg)", width: 10, height: 10, background: "#0f172a" }} />
        </div>
      )}
    </span>
  );
}

// ─── PLAN CARD ────────────────────────────────────────────────────────────────
function PlanCard({ plan, billing, loading, currentPlan, onBuy }) {
  const isQ = billing === "quarterly";
  const packId = plan.packIds[billing];
  const priceDisplay = isQ ? Math.round(plan.price * 3 * 0.85) : plan.price;
  const creditsDisplay = isQ ? plan.credits * 3 : plan.credits;
  const isCurrentPlan = currentPlan === plan.id;
  const isLoadingThis = loading === packId;
  const isDisabled = !!loading;
  const isReco = !!plan.badge;

  return (
    <div style={{
      position: "relative",
      flex: "1 1 280px",
      minWidth: 240,
      border: `${isReco ? 2 : 1.5}px solid ${isReco ? plan.color : "#e2e8f0"}`,
      borderRadius: 16,
      background: "#fff",
      padding: "24px 20px 20px",
      display: "flex",
      flexDirection: "column",
      boxShadow: isReco ? `0 6px 30px ${plan.color}22` : "0 1px 6px rgba(0,0,0,0.05)",
    }}>

      {/* Badge */}
      {isReco && (
        <div style={{
          position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)",
          background: plan.color, color: "#fff",
          fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase",
          padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap",
        }}>
          {plan.badge}
        </div>
      )}

      {/* Nom + description */}
      <p style={{ fontSize: 11, fontWeight: 700, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 2px" }}>
        {plan.name}
      </p>
      <p style={{ fontSize: 12, color: "#cbd5e1", margin: "0 0 18px" }}>{plan.description}</p>

      {/* Prix */}
      {isQ && (
        <p style={{ fontSize: 11, color: "#cbd5e1", textDecoration: "line-through", margin: "0 0 1px" }}>
          {fmt(plan.price * 3)} FCFA
        </p>
      )}
      <div style={{ display: "flex", alignItems: "baseline", gap: 4, marginBottom: 2 }}>
        <span style={{ fontSize: "2rem", fontWeight: 800, color: plan.color, letterSpacing: "-0.03em", lineHeight: 1 }}>
          {fmt(priceDisplay)}
        </span>
        <span style={{ fontSize: 12, color: "#94a3b8" }}>FCFA{isQ ? "/trim." : "/mois"}</span>
      </div>

      {/* Crédits + tooltip */}
      <div style={{ display: "flex", alignItems: "center", marginBottom: 20 }}>
        <span style={{ fontSize: 12, fontWeight: 600, color: "#475569", marginLeft: 4 }}>
          {fmt(creditsDisplay)} crédits{isQ ? " / 3 mois" : " / mois"}
        </span>
        <CreditTooltip plan={plan} />
      </div>

      {/* Séparateur */}
      <div style={{ height: 1, background: "#f1f5f9", margin: "0 0 16px" }} />

      {/* Features */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", gap: 10, marginBottom: 20 }}>
        {FEATURES.map((f, i) => {
          const val = f[plan.id];
          if (!val) return null;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8 }}>
              <div style={{
                width: 17, height: 17, borderRadius: "50%", flexShrink: 0, marginTop: 1,
                background: val === true ? plan.color : plan.colorLight,
                border: val === true ? "none" : `1.5px solid ${plan.colorBorder}`,
                display: "flex", alignItems: "center", justifyContent: "center",
              }}>
                <Check size={9} color={val === true ? "#fff" : plan.color} strokeWidth={3} />
              </div>
              <div style={{ lineHeight: 1.3 }}>
                <div style={{ display: "flex", alignItems: "baseline", flexWrap: "wrap", gap: 3 }}>
                  <span style={{ fontSize: 12, color: "#374151" }}>{f.label}</span>
                  {val !== true && (
                    <span style={{ fontSize: 11, fontWeight: 700, color: plan.color }}>· {val}</span>
                  )}
                </div>
                {f.sub && (
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: "2px 0 0", lineHeight: 1.4 }}>{f.sub}</p>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Bouton */}
      <button
        onClick={() => !isCurrentPlan && !isDisabled && onBuy(packId)}
        disabled={isDisabled || isCurrentPlan}
        style={{
          width: "100%", padding: "12px 0", borderRadius: 10,
          fontSize: 13, fontWeight: 700, cursor: isCurrentPlan || isDisabled ? "default" : "pointer",
          border: isReco ? "none" : `1.5px solid ${plan.colorBorder}`,
          opacity: isDisabled && !isCurrentPlan ? 0.4 : 1,
          background: isCurrentPlan ? "#f1f5f9" : isReco ? plan.color : "#fff",
          color: isCurrentPlan ? "#94a3b8" : isReco ? "#fff" : plan.color,
          display: "flex", alignItems: "center", justifyContent: "center", gap: 6,
          transition: "opacity .15s",
        }}
      >
        {isLoadingThis ? <Loader2 size={14} className="animate-spin" /> : isCurrentPlan ? "Plan actuel" : "Choisir ce plan"}
      </button>
    </div>
  );
}

// ─── PAGE ─────────────────────────────────────────────────────────────────────
export default function TarifsPage() {
  const router = useRouter();
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, { revalidateOnFocus: false });
  const balance = balanceData?.credits?.balance ?? null;
  const currentPlan = balanceData?.plan ?? null;

  const handleBuy = async (packId) => {
    setLoading(packId);
    setError("");
    try {
      const res = await fetch("/api/credits/purchase", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ packId, returnUrl: `${window.location.origin}/dashboard/credits` }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Erreur paiement");
      window.location.href = data.paymentUrl;
    } catch (err) {
      setError(err.message);
      setLoading(null);
    }
  };

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc" }}>

      {/* NAV */}
      <div style={{ position: "sticky", top: 0, zIndex: 30, background: "#fff", borderBottom: "1px solid #e2e8f0" }}>
        <div style={{ maxWidth: 1020, margin: "0 auto", padding: "0 20px", height: 52, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <button
            onClick={() => router.push("/dashboard/credits")}
            style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}
          >
            <ArrowLeft size={15} /> Retour
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {balance !== null && (
              <span style={{ fontSize: 12, color: "#94a3b8" }}>
                Solde : <strong style={{ color: "#1e293b" }}>{balance} cr.</strong>
              </span>
            )}
            <button
              onClick={() => router.push("/dashboard/credits/recharge")}
              style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: "#2563eb", color: "#fff" }}
            >
            Recharger
            </button>
          </div>
        </div>
      </div>

      <div style={{ maxWidth: 1020, margin: "0 auto", padding: "40px 20px 60px" }}>

        {/* Titre */}
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <h1 style={{ fontSize: "clamp(1.4rem,4vw,1.9rem)", fontWeight: 800, color: "#0f172a", letterSpacing: "-0.02em", margin: "0 0 8px" }}>
            Choisissez votre plan
          </h1>
          <p style={{ fontSize: 14, margin: 0 }}>
            <span style={{ color: "#0f172a", fontWeight: 700 }}>Les crédits s'accumulent</span>
            <span style={{ color: "#94a3b8" }}> et </span>
            <span style={{ color: "#2563eb", fontWeight: 700 }}>n'expirent jamais.</span>
          </p>
        </div>

        {/* Toggle */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", background: "#f1f5f9", borderRadius: 999, padding: 4, gap: 2 }}>
            {[
              { id: "monthly",   label: "Mensuel" },
              { id: "quarterly", label: "Trimestriel", badge: "−15%" },
            ].map((opt) => {
              const active = billing === opt.id;
              return (
                <button
                  key={opt.id}
                  onClick={() => setBilling(opt.id)}
                  style={{
                    display: "flex", alignItems: "center", gap: 5,
                    padding: "8px 20px", borderRadius: 999, border: "none",
                    fontSize: 13, fontWeight: 600, cursor: "pointer",
                    background: active ? "#fff" : "transparent",
                    color: active ? "#0f172a" : "#64748b",
                    boxShadow: active ? "0 1px 4px rgba(0,0,0,.08)" : "none",
                    transition: "all .15s",
                  }}
                >
                  {opt.label}
                  {opt.badge && (
                    <span style={{ background: "#10b981", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>
                      {opt.badge}
                    </span>
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Erreur */}
        {error && (
          <div style={{ maxWidth: 420, margin: "0 auto 24px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#b91c1c", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Cards */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch" }}>
          {PLANS.map((plan) => (
            <PlanCard
              key={plan.id}
              plan={plan}
              billing={billing}
              loading={loading}
              currentPlan={currentPlan}
              onBuy={handleBuy}
            />
          ))}
        </div>

        {/* Footer note */}
        <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "center", marginTop: 28 }}>
          Paiement sécurisé · 13 pays · Aucun prélèvement automatique
        </p>

      </div>
    </div>
  );
}