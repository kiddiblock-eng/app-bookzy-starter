"use client";

import { useState, useRef, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import { Loader2, ArrowLeft, Check, HelpCircle } from "lucide-react";

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
    price: 7500,
    credits: 100,
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
    price: 22000,
    credits: 400,
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
    price: 45000,
    credits: 900,
    badge: null,
    color: "#065f46",
    colorLight: "#f0fdf4",
    colorBorder: "#a7f3d0",
    colorText: "#047857",
    quotas: { youtubeAnalysis: 15, nicheHunter: 20, nicheAnalysis: 20 },
  },
];

const RECHARGES = [
  { credits: 30,  price: 4500  },
  { credits: 60,  price: 9000  },
  { credits: 100, price: 15000 },
  { credits: 200, price: 30000 },
];

const FEATURES = [
  { label: "Générez des ebooks pro en 1 minute", sub: "L'IA écrit, structure et met en page pour vous", solo: true, createur: true, agence: true },
  { label: "Transformez votre Word en PDF vendable", sub: "Importez votre brouillon, ressortez un ebook designé", solo: true, createur: true, agence: true },
  { label: "Transformez une vidéo YouTube en ebook", sub: "Le contenu est extrait et restructuré automatiquement", solo: true, createur: true, agence: true },
  { label: "Écrivez des romans avec l'IA", sub: "Fiction, développement personnel, guides pratiques", solo: true, createur: true, agence: true },
  { label: "Trouvez des niches qui vendent sur facebook", sub: "Idées validées par les données du marché", solo: true, createur: true, agence: true },
  { label: "Suivez les tendances en temps réel (facebook , google)", sub: "Sachez ce qui se vend avant tout le monde", solo: true, createur: true, agence: true },
  { label: "Validez votre idée avant de créer votre ebook", sub: "Score de rentabilité, concurrence, potentiel revenus , annonceurs facebook , tendances google", solo: true, createur: true, agence: true },
  { label: "Transformez une vidéo YouTube en ebook", sub: "Le contenu est extrait et restructuré automatiquement", solo: true, createur: true, agence: true },
  { label: "Rechargez quand vous voulez", sub: "Ajoutez exactement le montant dont vous avez besoin", solo: true, createur: true, agence: true },
  { label: "Kit marketing prêt à publier", sub: "Posts réseaux sociaux, scripts vidéo et visuels inclus", solo: "Complet", createur: "Complet", agence: "Total" },
  { label: "Support", solo: "Email", createur: "Email prioritaire", agence: "WhatsApp dédié" },
];

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
    { label: "Générer un ebook",              cost: "20 cr." },
    { label: "Ebook Designer (Word)",         cost: "10 cr." },
    { label: "Youbook",                       cost: `${q.youtubeAnalysis} gratuits/j puis 2 cr.` },
    { label: "Romans IA",                     cost: "À partir de 20 cr." },
    { label: "Niche Hunter",                  cost: `${q.nicheHunter} gratuits/j puis 1 cr.` },
    { label: "Radar Cash",                    cost: "Illimité" },
    { label: "Validateur d'idée",             cost: `${q.nicheAnalysis} gratuits/j puis 1 cr.` },
  ];
  return (
    <span ref={ref} style={{ position: "relative", display: "inline-flex", alignItems: "center", marginLeft: 4 }}>
      <button onClick={(e) => { e.stopPropagation(); setOpen(!open); }} style={{ background: plan.colorLight, border: `1px solid ${plan.colorBorder || plan.color + "40"}`, borderRadius: 6, cursor: "pointer", padding: "2px 7px", lineHeight: 0, display: "flex", alignItems: "center", gap: 4 }}>
        <HelpCircle size={12} color={plan.color} />
        <span style={{ fontSize: 10, fontWeight: 700, color: plan.color }}>Détail d'utilisation</span>
      </button>
      {open && (
        <div style={{ position: "absolute", bottom: "calc(100% + 10px)", left: "50%", transform: "translateX(-50%)", background: "#0f172a", borderRadius: 12, padding: "14px 16px", zIndex: 100, boxShadow: "0 12px 40px rgba(0,0,0,0.22)", width: 240, pointerEvents: "none" }}>
          <p style={{ fontSize: 10, fontWeight: 700, color: "rgba(255,255,255,0.35)", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px" }}>Coût par action</p>
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
    <div style={{ position: "relative", flex: "1 1 280px", minWidth: 240, border: `${isReco ? 2 : 1.5}px solid ${isReco ? plan.color : "#e2e8f0"}`, borderRadius: 16, background: "#fff", padding: "24px 20px 20px", display: "flex", flexDirection: "column", boxShadow: isReco ? `0 6px 30px ${plan.color}22` : "0 1px 6px rgba(0,0,0,0.05)" }}>
      {isReco && (
        <div style={{ position: "absolute", top: -12, left: "50%", transform: "translateX(-50%)", background: plan.color, color: "#fff", fontSize: 10, fontWeight: 700, letterSpacing: "0.1em", textTransform: "uppercase", padding: "4px 14px", borderRadius: 999, whiteSpace: "nowrap" }}>
          {plan.badge}
        </div>
      )}
      <div style={{ marginBottom: 16 }}>
        <p style={{ fontSize: 12, fontWeight: 700, color: plan.colorText, margin: "0 0 2px", textTransform: "uppercase", letterSpacing: "0.06em" }}>{plan.name}</p>
        <p style={{ fontSize: 13, color: "#94a3b8", margin: 0 }}>{plan.description}</p>
      </div>
      <div style={{ marginBottom: 6 }}>
        <span style={{ fontSize: "1.9rem", fontWeight: 900, color: "#0f172a", letterSpacing: "-0.03em" }}>{fmt(priceDisplay)}</span>
        <span style={{ fontSize: 13, color: "#94a3b8", marginLeft: 4 }}>FCFA/{isQ ? "trim." : "mois"}</span>
      </div>
      <div style={{ display: "flex", alignItems: "center", gap: 4, marginBottom: 20 }}>
        <span style={{ fontSize: 13, fontWeight: 700, color: plan.color }}>{creditsDisplay} crédits</span>
        <CreditTooltip plan={plan} />
        <span style={{ fontSize: 12, color: "#94a3b8" }}>· {Math.round(priceDisplay / creditsDisplay)} FCFA/cr</span>
      </div>
      <div style={{ flex: 1, marginBottom: 20 }}>
        {FEATURES.map((f, i) => {
          const val = f[plan.id];
          if (!val) return null;
          return (
            <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: 8, marginBottom: 10 }}>
              <div style={{ width: 16, height: 16, borderRadius: "50%", background: `${plan.color}18`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
                <Check size={9} color={plan.color} strokeWidth={3} />
              </div>
              <div>
                <span style={{ fontSize: 12, color: "#374151", fontWeight: val === true ? 400 : 600 }}>
                  {val === true ? f.label : <>{f.label}<br/><span style={{fontWeight:700,color:"inherit"}}>{val}</span></>}
                </span>
                {f.sub && val === true && <p style={{ fontSize: 11, color: "#94a3b8", margin: "1px 0 0" }}>{f.sub}</p>}
              </div>
            </div>
          );
        })}
      </div>
      {isCurrentPlan ? (
        <div style={{ width: "100%", padding: "11px 0", borderRadius: 10, background: `${plan.color}12`, border: `1.5px solid ${plan.color}40`, fontSize: 13, fontWeight: 700, color: plan.color, textAlign: "center" }}>
          Plan actuel ✓
        </div>
      ) : (
        <button onClick={() => onBuy(packId)} disabled={isDisabled} style={{ width: "100%", padding: "12px 0", borderRadius: 10, background: isReco ? plan.color : "#0f172a", color: "#fff", fontSize: 13, fontWeight: 700, border: "none", cursor: isDisabled ? "default" : "pointer", opacity: isDisabled && !isLoadingThis ? 0.5 : 1, display: "flex", alignItems: "center", justifyContent: "center", gap: 6 }}>
          {isLoadingThis ? "Redirection..." : "Choisir ce plan"}
        </button>
      )}
    </div>
  );
}

export default function TarifsPage() {
  const router = useRouter();
  const [billing, setBilling] = useState("monthly");
  const [loading, setLoading] = useState(null);
  const [error, setError] = useState("");

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, { revalidateOnFocus: false });
  const balance = balanceData?.credits?.balance ?? null;
  const currentPlan = balanceData?.plan ?? null;
  const isFree = !currentPlan || currentPlan === "free";

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
          <button onClick={() => router.push("/dashboard/credits")} style={{ display: "flex", alignItems: "center", gap: 6, fontSize: 13, color: "#64748b", background: "none", border: "none", cursor: "pointer" }}>
            <ArrowLeft size={15} /> Retour
          </button>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            {balance !== null && (
              <span style={{ fontSize: 12, color: "#94a3b8" }}>Solde : <strong style={{ color: "#1e293b" }}>{balance} cr.</strong></span>
            )}
            {!isFree && (
              <button onClick={() => router.push("/dashboard/credits/recharge")} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 8, border: "none", fontSize: 12, fontWeight: 700, cursor: "pointer", background: "#2563eb", color: "#fff" }}>
                Recharger
              </button>
            )}
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

        {/* Toggle mensuel / trimestriel */}
        <div style={{ display: "flex", justifyContent: "center", marginBottom: 32 }}>
          <div style={{ display: "inline-flex", background: "#f1f5f9", borderRadius: 999, padding: 4, gap: 2 }}>
            {[{ id: "monthly", label: "Mensuel" }, { id: "quarterly", label: "Trimestriel", badge: "−15%" }].map((opt) => {
              const active = billing === opt.id;
              return (
                <button key={opt.id} onClick={() => setBilling(opt.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "8px 20px", borderRadius: 999, border: "none", fontSize: 13, fontWeight: 600, cursor: "pointer", background: active ? "#fff" : "transparent", color: active ? "#0f172a" : "#64748b", boxShadow: active ? "0 1px 4px rgba(0,0,0,.08)" : "none", transition: "all .15s" }}>
                  {opt.label}
                  {opt.badge && <span style={{ background: "#10b981", color: "#fff", fontSize: 10, fontWeight: 700, padding: "2px 7px", borderRadius: 999 }}>{opt.badge}</span>}
                </button>
              );
            })}
          </div>
        </div>

        {error && (
          <div style={{ maxWidth: 420, margin: "0 auto 24px", background: "#fef2f2", border: "1px solid #fecaca", borderRadius: 12, padding: "12px 16px", fontSize: 13, color: "#b91c1c", textAlign: "center" }}>
            {error}
          </div>
        )}

        {/* Recharges fixes — free uniquement / abonnés → page recharge */}
        {!isFree ? (
          <div style={{ textAlign: "center", marginBottom: 28 }}>
            <p style={{ fontSize: 14, color: "#64748b", marginBottom: 12 }}>Vous avez un abonnement actif — rechargez à <strong style={{ color: "#2563eb" }}>100 FCFA/crédit</strong></p>
            <button onClick={() => router.push("/dashboard/credits/recharge")} style={{ padding: "12px 28px", background: "#2563eb", color: "#fff", fontWeight: 700, fontSize: 14, border: "none", borderRadius: 12, cursor: "pointer" }}>
              Recharger mes crédits
            </button>
          </div>
        ) : (
          <>
            <div style={{ textAlign: "center", marginBottom: 28 }}>
              <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>
                Recharge rapide sans abonnement
              </span>
             
            </div>
            <div style={{ display: "flex", gap: 12, flexWrap: "wrap", justifyContent: "center", marginBottom: 16 }}>
              {RECHARGES.map((r) => {
                const packId = `recharge_${r.credits}_free`;
                return (
                  <button key={r.credits} onClick={() => handleBuy(packId)} disabled={!!loading} style={{ position: "relative", flex: "1 1 160px", maxWidth: 200, background: "#fff", border: "1.5px solid #e2e8f0", borderRadius: 14, padding: "16px 14px", cursor: loading ? "default" : "pointer", textAlign: "center", opacity: loading && loading !== packId ? 0.5 : 1, boxShadow: "0 1px 4px rgba(0,0,0,0.05)", transition: "all .15s" }}>
                    <p style={{ fontSize: 15, fontWeight: 800, color: "#0f172a", margin: "0 0 6px" }}>{r.credits} crédits</p>
                    <p style={{ fontSize: 16, fontWeight: 800, color: "#0f172a", margin: 0 }}>{fmt(r.price)} FCFA</p>
                    {loading === packId && <Loader2 size={14} style={{ margin: "6px auto 0", animation: "spin 1s linear infinite" }} />}
                  </button>
                );
              })}
            </div>
            <p style={{ textAlign: "center", fontSize: 12, color: "#94a3b8", marginBottom: 8 }}>
              💡 Abonne-toi pour économiser 33% et avoir accès à toutes les fonctionnalités de bookzy, y compris les outils de validation d'idée, de recherche de niche et d'analyse de marché.
            </p>
          </>
        )}

        {/* Ou économisez avec un abonnement */}
        <div style={{ textAlign: "center", marginBottom: 24, marginTop: 40 }}>
          <span style={{ fontSize: 12, color: "#94a3b8", fontWeight: 600, letterSpacing: "0.05em", textTransform: "uppercase" }}>Ou économisez avec un abonnement</span>
        </div>

{/* Plans */}
        <div style={{ display: "flex", gap: 16, flexWrap: "wrap", alignItems: "stretch", marginBottom: 48 }}>
          {PLANS.map((plan) => (
            <PlanCard key={plan.id} plan={plan} billing={billing} loading={loading} currentPlan={currentPlan} onBuy={handleBuy} />
          ))}
        </div>



        <p style={{ fontSize: 11, color: "#cbd5e1", textAlign: "center", marginTop: 28 }}>
          Paiement sécurisé · 13 pays · Aucun prélèvement automatique
        </p>

      </div>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}