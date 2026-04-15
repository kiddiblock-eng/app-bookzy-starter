"use client";

import { useState, useEffect } from "react";
import { useParams, useSearchParams, useRouter } from "next/navigation";
import { useSWRConfig } from "swr";
import {
  TrendingUp, ArrowLeft, Lock, Loader2, ExternalLink,
  Target, Globe, Users, DollarSign, BarChart2, ShoppingBag,
  ChevronRight, RefreshCw, AlertTriangle, CheckCircle,
  TrendingDown, Minus, Edit3, X, Calendar, BookOpen
} from "lucide-react";

const VERDICT_CONFIG = {
  fonce:   { label: "🔥 Fonce !", color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", textColor: "#15803d" },
  attends: { label: "⏳ Attends", color: "#d97706", bg: "#fffbeb", border: "#fde68a", textColor: "#92400e" },
  evite:   { label: "❌ Évite",   color: "#dc2626", bg: "#fef2f2", border: "#fecaca", textColor: "#991b1b" },
};

const TIMING_CONFIG = {
  excellent: { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: "🚀" },
  bon:       { color: "#16a34a", bg: "#f0fdf4", border: "#bbf7d0", icon: "✅" },
  attendre:  { color: "#d97706", bg: "#fffbeb", border: "#fde68a", icon: "⏳" },
  risque:    { color: "#dc2626", bg: "#fef2f2", border: "#fecaca", icon: "⚠️" },
};

function getSatColor(s) {
  if (s <= 3) return { color: "#16a34a" };
  if (s <= 6) return { color: "#d97706" };
  return { color: "#dc2626" };
}
function getPaysColor(s) {
  if (s >= 80) return "#16a34a";
  if (s >= 60) return "#d97706";
  return "#dc2626";
}
function TendanceIcon({ tendance }) {
  if (tendance === "montante")    return <TrendingUp size={13} color="#16a34a" />;
  if (tendance === "descendante") return <TrendingDown size={13} color="#dc2626" />;
  return <Minus size={13} color="#94a3b8" />;
}

function BlurSection({ children, isPremium, router, title, icon }) {
  if (isPremium) return <>{children}</>;
  return (
    <div className="card" style={{ padding: 0, overflow: "hidden" }}>
      {/* Titre visible même pour les free */}
      {title && (
        <div style={{ display: "flex", alignItems: "center", gap: "8px", padding: "16px 20px 12px", borderBottom: "1px solid #f1f5f9" }}>
          {icon && <span style={{ flexShrink: 0 }}>{icon}</span>}
          <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{title}</h3>
          <span style={{ marginLeft: "auto", fontSize: "11px", fontWeight: "600", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "20px", flexShrink: 0 }}>Premium</span>
        </div>
      )}
      {/* Contenu flouté */}
      <div style={{ position: "relative" }}>
        <div style={{ filter: "blur(5px)", userSelect: "none", pointerEvents: "none", padding: title ? "16px 20px" : 0 }}>
          {children}
        </div>
        <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "rgba(255,255,255,0.75)", backdropFilter: "blur(2px)", borderRadius: title ? "0 0 14px 14px" : "14px" }}>
          <Lock size={16} color="#0f172a" style={{ marginBottom: "6px" }} />
          <p style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", margin: "0 0 10px", textAlign: "center" }}>Plan Solo ou supérieur</p>
          <button onClick={() => router.push("/dashboard/tarifs")} style={{ padding: "7px 14px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>Voir les plans →</button>
        </div>
      </div>
    </div>
  );
}

function AnglerModal({ sujet, onClose, router }) {
  const [newSujet, setNewSujet] = useState(sujet);
  const [loading, setLoading] = useState(false);
  async function handleSubmit() {
    if (!newSujet.trim() || newSujet.trim() === sujet) return;
    setLoading(true);
    try {
      const res = await fetch("/api/analyseur/analyse", { method: "POST", headers: { "Content-Type": "application/json" }, credentials: "include", body: JSON.stringify({ sujet: newSujet.trim() }) });
      const d = await res.json();
      if (d.success && d.data?.id) { router.push(`/dashboard/analyseur/${d.data.id}?premium=${d.isPremium ? "true" : "false"}`); onClose(); }
    } catch (e) { console.error(e); } finally { setLoading(false); }
  }
  return (
    <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.55)", zIndex: 9999, display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "16px", padding: "28px", width: "100%", maxWidth: "520px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start", marginBottom: "20px" }}>
          <div>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", textTransform: "uppercase", margin: "0 0 4px" }}>Tester un autre angle</p>
            <h3 style={{ fontSize: "18px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Modifier le sujet</h3>
          </div>
          <button onClick={onClose} style={{ padding: "6px", background: "none", border: "none", cursor: "pointer" }}><X size={18} color="#94a3b8" /></button>
        </div>
        <textarea value={newSujet} onChange={e => setNewSujet(e.target.value)} rows={3}
          style={{ width: "100%", padding: "12px", border: "1.5px solid #e2e8f0", borderRadius: "10px", fontSize: "14px", color: "#0f172a", resize: "none", fontFamily: "inherit", outline: "none", lineHeight: "1.5", boxSizing: "border-box" }} />
        <div style={{ display: "flex", gap: "8px", marginTop: "14px" }}>
          <button onClick={onClose} style={{ flex: 1, padding: "10px", background: "#f1f5f9", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "600", color: "#475569", cursor: "pointer" }}>Annuler</button>
          <button onClick={handleSubmit} disabled={loading || !newSujet.trim()}
            style={{ flex: 2, padding: "10px", background: "#0f172a", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", opacity: loading ? 0.7 : 1 }}>
            {loading ? <Loader2 size={14} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={14} />}
            {loading ? "Analyse en cours..." : "Analyser ce nouvel angle"}
          </button>
        </div>
      </div>
    </div>
  );
}

function ScoreRing({ score, color, size = 110 }) {
  const r = (size / 2) - 8;
  const circ = 2 * Math.PI * r;
  return (
    <svg width={size} height={size} viewBox={`0 0 ${size} ${size}`} style={{ flexShrink: 0 }}>
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke="#f1f5f9" strokeWidth="9" />
      <circle cx={size/2} cy={size/2} r={r} fill="none" stroke={color} strokeWidth="9"
        strokeDasharray={`${circ * score / 100} ${circ}`} strokeLinecap="round"
        style={{ transform: `rotate(-90deg)`, transformOrigin: `${size/2}px ${size/2}px` }} />
      <text x={size/2} y={size/2 - 5} textAnchor="middle" fontSize="22" fontWeight="800" fill="#0f172a">{score}</text>
      <text x={size/2} y={size/2 + 12} textAnchor="middle" fontSize="10" fill="#94a3b8">/100</text>
    </svg>
  );
}

export default function AnalyseurResultPage() {
  const { id } = useParams();
  const searchParams = useSearchParams();
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const isPremium = searchParams.get("premium") === "true";
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showAnglerModal, setShowAnglerModal] = useState(false);
  const [selectedTitre, setSelectedTitre] = useState(null);

  const [isPremiumReal, setIsPremiumReal] = useState(isPremium);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/analyseur/${id}`, { credentials: "include" })
      .then(r => r.json())
      .then(d => {
        if (d.success) {
          setData(d.data);
          // isPremium depuis le serveur = source de vérité (évite le ?premium=true hardcodé)
          if (typeof d.isPremium === "boolean") setIsPremiumReal(d.isPremium);
          mutate("/api/credits/balance");
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "70vh", flexDirection: "column", gap: "12px" }}>
      <Loader2 size={28} color="#0f172a" style={{ animation: "spin 1s linear infinite" }} />
      <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Chargement du rapport...</p>
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
  if (!data) return <div style={{ textAlign: "center", padding: "80px", color: "#94a3b8" }}>Analyse introuvable.</div>;

  const verdict = VERDICT_CONFIG[data.verdict] || VERDICT_CONFIG.attends;
  const satInfo = getSatColor(data.saturation?.score || 0);
  const timingCfg = TIMING_CONFIG[data.timing?.statut] || TIMING_CONFIG.bon;
  const paysTop = (data.pays || []).filter(p => p.score >= 70).sort((a, b) => b.score - a.score);
  const paysCaution = (data.pays || []).filter(p => p.score < 70).sort((a, b) => b.score - a.score);
  const semFormatted = (data.revenus?.semaine || 0).toLocaleString("fr-FR");
  const moisFormatted = (data.revenus?.mois || 0).toLocaleString("fr-FR");
  const anneeFormatted = (data.revenus?.annee || 0).toLocaleString("fr-FR");
  const titrePourCreation = selectedTitre || data.sujet;

  return (
    <div style={{ maxWidth: "1100px", margin: "0 auto", padding: "24px 20px 48px" }}>
      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .result-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }
        .result-grid-3 { display: grid; grid-template-columns: 1fr 1fr 1fr; gap: 12px; }
        .result-layout { display: grid; grid-template-columns: 1fr 360px; gap: 16px; align-items: start; }
        .card { background: white; border: 1px solid #e2e8f0; border-radius: 14px; padding: 20px; }
        .card-dark { background: #0f172a; border: none; border-radius: 14px; padding: 20px; }
        .pays-bar { height: 5px; background: #f1f5f9; border-radius: 3px; overflow: hidden; margin: 5px 0 3px; }
        .slabel { font-size: 10px; font-weight: 700; color: #94a3b8; text-transform: uppercase; letter-spacing: 0.1em; margin-bottom: 14px; }
        .pill { display: inline-flex; align-items: center; gap: 5px; padding: 3px 10px; border-radius: 20px; font-size: 11px; font-weight: 600; }
        @media (max-width: 900px) { .result-layout { grid-template-columns: 1fr; } .result-grid { grid-template-columns: 1fr; } .result-grid-3 { grid-template-columns: 1fr 1fr; } .sidebar-sticky { position: static !important; display: none; } }
        @media (max-width: 600px) { .result-grid-3 { grid-template-columns: 1fr; } .hero-card { flex-direction: column !important; } .hero-revenus { width: 100% !important; min-width: unset !important; } }
        .mobile-teaser { display: none; }
        @media (max-width: 900px) { .mobile-teaser { display: block; } }
      `}</style>

      {/* HEADER */}
      <div style={{ marginBottom: "20px" }}>
        <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
          <button onClick={() => router.push("/dashboard/analyseur")} style={{ padding: "7px 9px", background: "#f1f5f9", border: "none", borderRadius: "9px", cursor: "pointer", flexShrink: 0 }}><ArrowLeft size={15} color="#475569" /></button>
          <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", margin: 0, letterSpacing: "0.1em", textTransform: "uppercase" }}>Analyseur de produit digital</p>
        </div>
        <h1 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: "0 0 12px", lineHeight: "1.4" }}>{data.sujet}</h1>
        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
          <button onClick={() => setShowAnglerModal(true)} style={{ padding: "9px 14px", background: "white", color: "#0f172a", border: "1px solid #e2e8f0", borderRadius: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}><Edit3 size={13} /> Autre angle</button>
          <button onClick={() => router.push(`/dashboard/projets/nouveau?suggestion=${encodeURIComponent(titrePourCreation)}`)} style={{ padding: "9px 16px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>Créer l'ebook <ChevronRight size={13} /></button>
        </div>
      </div>

      {/* PAYWALL banner supprimé - le hero gère l'upsell pour les free */}

      {/* HERO */}
      <div className="card hero-card" style={{ marginBottom: "14px", display: "flex", gap: "24px", alignItems: "flex-start", flexWrap: "wrap" }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "8px", flexShrink: 0 }}>
          {isPremiumReal ? (
            <>
              <ScoreRing score={data.scoreGlobal} color={verdict.color} size={110} />
              <div style={{ padding: "5px 14px", borderRadius: "20px", background: verdict.bg, border: `1px solid ${verdict.border}` }}>
                <span style={{ fontSize: "13px", fontWeight: "800", color: verdict.textColor }}>{verdict.label}</span>
              </div>
            </>
          ) : (
            <>
              {/* Score caché pour free */}
              <div style={{ width: "110px", height: "110px", borderRadius: "50%", border: "9px solid #f1f5f9", display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center", background: "white" }}>
                <Lock size={22} color="#94a3b8" />
                <span style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "700", marginTop: "4px" }}>??/100</span>
              </div>
            </>
          )}
        </div>
        <div style={{ flex: 1, minWidth: "200px", paddingTop: "4px" }}>
          {isPremiumReal ? (
            <>
              <p style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 6px", lineHeight: "1.3" }}>{data.verdictTexte}</p>
              {data.raisonVerdict && (
                <p style={{ fontSize: "13px", color: data.verdict === "evite" ? "#dc2626" : data.verdict === "attends" ? "#d97706" : "#64748b", margin: "0 0 10px", lineHeight: "1.6", fontStyle: "italic" }}>{data.raisonVerdict}</p>
              )}
            </>
          ) : (
            <div style={{ marginBottom: "12px" }}>
              <p style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 8px", lineHeight: "1.3" }}>
                Votre idée a été analysée — mais le verdict est caché 🔒
              </p>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px", lineHeight: "1.7" }}>
                Votre sujet a été comparé à des milliers d'annonceurs Facebook et aux tendances Google. Débloquez pour savoir si votre idée va cartonner ou vous faire perdre du temps.
              </p>
              <button onClick={() => router.push("/dashboard/tarifs")}
                style={{ padding: "10px 20px", background: "#f59e0b", color: "#0f172a", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
                Voir mon score et verdict →
              </button>
            </div>
          )}
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 12px", lineHeight: "1.7" }}>{data.audience}</p>
          <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
            {data.keywords?.map(k => (<span key={k} className="pill" style={{ background: "#f8fafc", border: "1px solid #e2e8f0", color: "#475569" }}>{k}</span>))}
          </div>
          <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
            {isPremiumReal && data.timing && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "8px", padding: "6px 12px", background: timingCfg.bg, border: `1px solid ${timingCfg.border}`, borderRadius: "8px" }}>
                <span style={{ fontSize: "14px" }}>{timingCfg.icon}</span>
                <div>
                  <p style={{ fontSize: "11px", fontWeight: "700", color: timingCfg.color, margin: 0 }}>{data.timing.label}</p>
                  <p style={{ fontSize: "11px", color: timingCfg.color, margin: 0, opacity: 0.8 }}>{data.timing.explication}</p>
                </div>
              </div>
            )}
            {data.fbAds?.tendance && (
              <div style={{ display: "inline-flex", alignItems: "center", gap: "6px", padding: "5px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px" }}>
                <TendanceIcon tendance={data.fbAds.tendance} />
                <span style={{ fontSize: "11px", color: "#475569", fontWeight: "600" }}>Tendance : <strong style={{ color: "#0f172a" }}>{data.fbAds.tendance}</strong></span>
              </div>
            )}
          </div>
        </div>
        {/* Teaser pour free — remplace potentiel estimé */}
        {!isPremiumReal ? (
          <div style={{ flex: 1 }}>
            <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.1em", margin: "0 0 10px", textAlign: "center" }}>
              Ton rapport contient
            </p>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "8px" }}>
              {[
                { Icon: BarChart2, color: "#0f172a", label: "Score de marché", sub: "Sur 100 points" },
                { Icon: Target, color: "#7c3aed", label: "Verdict honnête", sub: "Fonce / Attends / Évite" },
                { Icon: Users, color: "#1877f2", label: "Facebook Ads", sub: "Annonceurs actifs" },
                { Icon: Globe, color: "#0891b2", label: "Carte des marchés", sub: "Pays les + rentables" },
                { Icon: DollarSign, color: "#f59e0b", label: "Revenus estimés", sub: "Semaine / Mois / Année" },
                { Icon: TrendingUp, color: "#16a34a", label: "Battre la concurrence", sub: "Ton angle gagnant" },
                { Icon: Calendar, color: "#7c3aed", label: "Plan de lancement", sub: "4 semaines d'actions" },
                { Icon: BookOpen, color: "#0f172a", label: "Titres pour se démarquer", sub: "Prêts à utiliser" },
                { Icon: Target, color: "#dc2626", label: "Concurrents décryptés", sub: "Leur stratégie exacte" },
                { Icon: ShoppingBag, color: "#f59e0b", label: "Pratiques de vente", sub: "Pour vendre rapidement" },
              ].map((s, i) => (
                <div key={i} onClick={() => router.push("/dashboard/tarifs")}
                  style={{ display: "flex", alignItems: "center", gap: "10px", padding: "10px 12px", background: "white", border: "1px solid #e2e8f0", borderRadius: "10px", cursor: "pointer" }}>
                  <div style={{ width: "30px", height: "30px", borderRadius: "8px", background: `${s.color}15`, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0 }}>
                    <s.Icon size={15} color={s.color} />
                  </div>
                  <div style={{ minWidth: 0, flex: 1 }}>
                    <p style={{ fontSize: "12px", fontWeight: "700", color: "#0f172a", margin: 0, lineHeight: "1.3" }}>{s.label}</p>
                    <p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>{s.sub}</p>
                  </div>
                  <Lock size={11} color="#cbd5e1" style={{ flexShrink: 0 }} />
                </div>
              ))}
            </div>
            <button onClick={() => router.push("/dashboard/tarifs")}
              style={{ width: "100%", marginTop: "10px", padding: "12px", background: "#f59e0b", color: "#0f172a", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer" }}>
              Débloquer tout le rapport →
            </button>
          </div>
        ) : (
          <BlurSection isPremium={isPremiumReal} router={router} title="Potentiel estimé">
            <div className="hero-revenus" style={{ background: "#0f172a", borderRadius: "12px", padding: "16px 20px", minWidth: "180px", flexShrink: 0 }}>
              <p style={{ fontSize: "10px", fontWeight: "700", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 4px" }}>Potentiel estimé</p>
              <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 10px" }}>si vous exécutez bien</p>
              <p style={{ fontSize: "11px", color: "#64748b", margin: "0 0 1px" }}>Semaine</p>
              <p style={{ fontSize: "22px", fontWeight: "800", color: "#f59e0b", margin: "0 0 10px" }}>{semFormatted} <span style={{ fontSize: "12px", fontWeight: "600" }}>FCFA</span></p>
              <div style={{ borderTop: "1px solid #1e293b", paddingTop: "10px" }}>
                {[["Mois", moisFormatted], ["Année", anneeFormatted]].map(([l, v]) => (
                  <div key={l} style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}>
                    <span style={{ fontSize: "11px", color: "#64748b" }}>{l}</span>
                    <span style={{ fontSize: "12px", fontWeight: "700", color: "white" }}>{v} FCFA</span>
                  </div>
                ))}
                <p style={{ fontSize: "10px", color: "#334155", margin: "8px 0 0", fontStyle: "italic", lineHeight: "1.4" }}>{data.revenus?.hypothese}</p>
              </div>
            </div>
          </BlurSection>
        )}
      </div>
      <div className="result-layout">
        <div style={{ display: "flex", flexDirection: "column", gap: "14px" }}>

          {/* 3 STATS */}
          <div className="result-grid-3">
            <BlurSection isPremium={isPremiumReal} router={router} title="Facebook Ads">
              <div className="card" style={{ height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "28px", height: "28px", background: "#1877f2", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}><Users size={13} color="white" /></div>
                  <span className="slabel" style={{ marginBottom: 0 }}>Facebook Ads</span>
                </div>
                <p style={{ fontSize: "32px", fontWeight: "800", color: "#0f172a", margin: "0 0 2px", lineHeight: 1 }}>{data.fbAds?.totalAnnonceurs || 0}</p>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px" }}>annonceurs actifs</p>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 10px" }}>Durée moy. : <strong style={{ color: "#475569" }}>{data.fbAds?.dureemoyenne || "—"}</strong></p>
                <div style={{ display: "flex" }}>
                  {data.fbAds?.annonceurs?.slice(0, 6).map((a, i) => (
                    <div key={i} style={{ width: "28px", height: "28px", borderRadius: "50%", background: "#e2e8f0", overflow: "hidden", border: "2px solid white", marginLeft: i > 0 ? "-8px" : "0", flexShrink: 0 }}>
                      {a.photo && <img src={a.photo} alt={a.nom} style={{ width: "100%", height: "100%", objectFit: "cover" }} />}
                    </div>
                  ))}
                </div>
              </div>
            </BlurSection>

            <BlurSection isPremium={isPremiumReal} router={router} title="Saturation du marché">
              <div className="card" style={{ height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "28px", height: "28px", background: satInfo.color, borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}><BarChart2 size={13} color="white" /></div>
                  <span className="slabel" style={{ marginBottom: 0 }}>Saturation</span>
                </div>
                <p style={{ fontSize: "32px", fontWeight: "800", color: satInfo.color, margin: "0 0 2px", lineHeight: 1 }}>{data.saturation?.score || 0}<span style={{ fontSize: "16px", fontWeight: "600", color: "#94a3b8" }}>/10</span></p>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 10px" }}>{data.saturation?.label || getSatColor(data.saturation?.score || 0).label}</p>
                <div style={{ display: "flex", gap: "3px", marginBottom: "8px" }}>
                  {Array.from({ length: 10 }).map((_, i) => (<div key={i} style={{ flex: 1, height: "6px", borderRadius: "3px", background: i < (data.saturation?.score || 0) ? satInfo.color : "#f1f5f9" }} />))}
                </div>
                <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, lineHeight: "1.5" }}>{data.saturation?.description}</p>
              </div>
            </BlurSection>

            <BlurSection isPremium={isPremiumReal} router={router} title="Prix recommandé & revenus">
              <div className="card" style={{ height: "100%" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "12px" }}>
                  <div style={{ width: "28px", height: "28px", background: "#0f172a", borderRadius: "7px", display: "flex", alignItems: "center", justifyContent: "center" }}><DollarSign size={13} color="#f59e0b" /></div>
                  <span className="slabel" style={{ marginBottom: 0 }}>Prix recommandé</span>
                </div>
                <p style={{ fontSize: "28px", fontWeight: "800", color: "#0f172a", margin: "0 0 2px", lineHeight: 1 }}>{(data.revenus?.prixRecommande || 0).toLocaleString("fr-FR")}</p>
                <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px" }}>FCFA par ebook</p>
                <div style={{ display: "flex", flexDirection: "column", gap: "5px" }}>
                  {[{ label: "Semaine", val: semFormatted, star: true }, { label: "Mois", val: moisFormatted }, { label: "Année", val: anneeFormatted }].map(({ label, val, star }) => (
                    <div key={label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "5px 8px", borderRadius: "6px", background: star ? "#fffbeb" : "transparent" }}>
                      <span style={{ fontSize: "11px", color: "#64748b" }}>{label}</span>
                      <span style={{ fontSize: "12px", fontWeight: "700", color: star ? "#d97706" : "#0f172a" }}>{val} FCFA</span>
                    </div>
                  ))}
                </div>
              </div>
            </BlurSection>
          </div>

          {data.verdict !== 'fonce' && (
            <>
          {/* TITRES SUGGÉRÉS */}
          {(data.titresSuggeres?.length > 0) && (
            <BlurSection isPremium={isPremiumReal} router={router} title="Utilise l'un de ces titres pour te démarquer immédiatement">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <BookOpen size={15} color="#0f172a" />
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  {(!isPremiumReal || data.verdict !== "fonce") ? "Utilise l'un de ces titres pour te démarquer immédiatement" : "3 titres accrocheurs suggérés"}
                </h3>
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 14px" }}>
                {data.verdict === "fonce"
                  ? "Clique sur un titre pour l'utiliser lors de la création"
                  : "Basés sur l'angle gagnant — clique pour générer l'ebook directement"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(data.titresSuggeres || []).map((titre, i) => (
                  data.verdict === "fonce" ? (
                    // Fonce : sélectionner puis bouton en bas
                    <button key={i} onClick={() => setSelectedTitre(selectedTitre === titre ? null : titre)}
                      style={{ padding: "12px 14px", borderRadius: "10px", cursor: "pointer", border: selectedTitre === titre ? "2px solid #0f172a" : "1px solid #e2e8f0", background: selectedTitre === titre ? "#0f172a" : "#f8fafc", textAlign: "left", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0, background: selectedTitre === titre ? "#f59e0b" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: selectedTitre === titre ? "#0f172a" : "#94a3b8" }}>{i + 1}</span>
                      <span style={{ fontSize: "13px", fontWeight: "500", color: selectedTitre === titre ? "white" : "#0f172a", lineHeight: "1.4" }}>{titre}</span>
                      {selectedTitre === titre && <span style={{ marginLeft: "auto", fontSize: "11px", color: "#f59e0b", fontWeight: "700", flexShrink: 0 }}>Sélectionné ✓</span>}
                    </button>
                  ) : (
                    // Attends/Evite : bouton direct vers création
                    <button key={i} onClick={() => router.push(`/dashboard/projets/nouveau?suggestion=${encodeURIComponent(titre)}`)}
                      style={{ padding: "12px 14px", borderRadius: "10px", cursor: "pointer", border: "1px solid #e2e8f0", background: "#f8fafc", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.borderColor = "#0f172a"; e.currentTarget.querySelector('.titre-text').style.color = "white"; e.currentTarget.querySelector('.titre-num').style.background = "#f59e0b"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.querySelector('.titre-text').style.color = "#0f172a"; e.currentTarget.querySelector('.titre-num').style.background = "#e2e8f0"; }}>
                      <span className="titre-num" style={{ width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#94a3b8" }}>{i + 1}</span>
                      <span className="titre-text" style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a", lineHeight: "1.4", flex: 1 }}>{titre}</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0, whiteSpace: "nowrap" }}>Générer →</span>
                    </button>
                  )
                ))}
              </div>
              {data.verdict === "fonce" && selectedTitre && (
                <button onClick={() => router.push(`/dashboard/projets/nouveau?suggestion=${encodeURIComponent(selectedTitre)}`)}
                  style={{ width: "100%", marginTop: "12px", padding: "10px", background: "#f59e0b", color: "#0f172a", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                  Créer avec ce titre →
                </button>
              )}
            </div>
          </BlurSection>
          )}

            </>
          )}
          {/* PAYS */}
          <BlurSection isPremium={isPremiumReal} router={router} title="Carte des marchés">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "18px" }}>
                <Globe size={15} color="#0f172a" />
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0, flex: 1 }}>Carte des marchés</h3>
              </div>
              {paysTop.length > 0 && (
                <div style={{ marginBottom: "18px" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}><CheckCircle size={13} color="#16a34a" /><p style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Priorité — foncez ici</p></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {paysTop.map(p => (
                      <div key={p.nom} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "22px", flexShrink: 0 }}>{p.flag}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><span style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{p.nom}</span><span style={{ fontSize: "13px", fontWeight: "800", color: getPaysColor(p.score) }}>{p.score}/100</span></div>
                          <div className="pays-bar"><div style={{ height: "100%", width: `${p.score}%`, background: getPaysColor(p.score), borderRadius: "3px" }} /></div>
                          <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>{p.raison}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
              {paysCaution.length > 0 && (
                <div style={{ paddingTop: "16px", borderTop: "1px solid #f1f5f9" }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "12px" }}><AlertTriangle size={13} color="#d97706" /><p style={{ fontSize: "11px", fontWeight: "700", color: "#d97706", margin: 0, textTransform: "uppercase", letterSpacing: "0.08em" }}>Marché secondaire</p></div>
                  <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                    {paysCaution.map(p => (
                      <div key={p.nom} style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                        <span style={{ fontSize: "22px", flexShrink: 0 }}>{p.flag}</span>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div style={{ display: "flex", justifyContent: "space-between", marginBottom: "4px" }}><span style={{ fontSize: "13px", fontWeight: "600", color: "#475569" }}>{p.nom}</span><span style={{ fontSize: "12px", fontWeight: "700", color: getPaysColor(p.score) }}>{p.score}/100</span></div>
                          <div className="pays-bar"><div style={{ height: "100%", width: `${p.score}%`, background: getPaysColor(p.score), borderRadius: "3px" }} /></div>
                          <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0, lineHeight: "1.4" }}>{p.raison}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </BlurSection>

          {/* CALENDRIER */}
          {(data.calendrierLancement?.length > 0) && (
            <BlurSection isPremium={isPremiumReal} router={router} title="Plan de lancement — 4 semaines">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                <Calendar size={15} color="#0f172a" />
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Plan de lancement — 4 semaines</h3>
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {(data.calendrierLancement || []).map((sem, i) => (
                  <div key={i} style={{ display: "flex", gap: "14px", alignItems: "flex-start" }}>
                    <div style={{ flexShrink: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: "4px" }}>
                      <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: i === 0 ? "#0f172a" : "#f1f5f9", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <span style={{ fontSize: "11px", fontWeight: "700", color: i === 0 ? "#f59e0b" : "#94a3b8" }}>S{sem.semaine}</span>
                      </div>
                      {i < (data.calendrierLancement?.length - 1) && <div style={{ width: "1px", height: "20px", background: "#e2e8f0" }} />}
                    </div>
                    <div style={{ flex: 1, paddingBottom: "10px" }}>
                      <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px", paddingTop: "6px" }}>{sem.titre}</p>
                      <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
                        {(sem.actions || []).map((action, j) => (
                          <div key={j} style={{ display: "flex", alignItems: "flex-start", gap: "8px" }}>
                            <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#94a3b8", flexShrink: 0, marginTop: "6px" }} />
                            <span style={{ fontSize: "12px", color: "#64748b", lineHeight: "1.5" }}>{action}</span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </BlurSection>
          )}

          {data.verdict === 'fonce' && (
            <>
          {/* TITRES SUGGÉRÉS */}
          {(data.titresSuggeres?.length > 0) && (
            <BlurSection isPremium={isPremiumReal} router={router} title="Utilise l'un de ces titres pour te démarquer immédiatement">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                <BookOpen size={15} color="#0f172a" />
                <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>
                  {(!isPremiumReal || data.verdict !== "fonce") ? "Utilise l'un de ces titres pour te démarquer immédiatement" : "3 titres accrocheurs suggérés"}
                </h3>
              </div>
              <p style={{ fontSize: "12px", color: "#94a3b8", margin: "0 0 14px" }}>
                {data.verdict === "fonce"
                  ? "Clique sur un titre pour l'utiliser lors de la création"
                  : "Basés sur l'angle gagnant — clique pour générer l'ebook directement"}
              </p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
                {(data.titresSuggeres || []).map((titre, i) => (
                  data.verdict === "fonce" ? (
                    // Fonce : sélectionner puis bouton en bas
                    <button key={i} onClick={() => setSelectedTitre(selectedTitre === titre ? null : titre)}
                      style={{ padding: "12px 14px", borderRadius: "10px", cursor: "pointer", border: selectedTitre === titre ? "2px solid #0f172a" : "1px solid #e2e8f0", background: selectedTitre === titre ? "#0f172a" : "#f8fafc", textAlign: "left", display: "flex", alignItems: "center", gap: "10px" }}>
                      <span style={{ width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0, background: selectedTitre === titre ? "#f59e0b" : "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: selectedTitre === titre ? "#0f172a" : "#94a3b8" }}>{i + 1}</span>
                      <span style={{ fontSize: "13px", fontWeight: "500", color: selectedTitre === titre ? "white" : "#0f172a", lineHeight: "1.4" }}>{titre}</span>
                      {selectedTitre === titre && <span style={{ marginLeft: "auto", fontSize: "11px", color: "#f59e0b", fontWeight: "700", flexShrink: 0 }}>Sélectionné ✓</span>}
                    </button>
                  ) : (
                    // Attends/Evite : bouton direct vers création
                    <button key={i} onClick={() => router.push(`/dashboard/projets/nouveau?suggestion=${encodeURIComponent(titre)}`)}
                      style={{ padding: "12px 14px", borderRadius: "10px", cursor: "pointer", border: "1px solid #e2e8f0", background: "#f8fafc", textAlign: "left", display: "flex", alignItems: "center", gap: "10px", transition: "all 0.15s" }}
                      onMouseEnter={e => { e.currentTarget.style.background = "#0f172a"; e.currentTarget.style.borderColor = "#0f172a"; e.currentTarget.querySelector('.titre-text').style.color = "white"; e.currentTarget.querySelector('.titre-num').style.background = "#f59e0b"; }}
                      onMouseLeave={e => { e.currentTarget.style.background = "#f8fafc"; e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.querySelector('.titre-text').style.color = "#0f172a"; e.currentTarget.querySelector('.titre-num').style.background = "#e2e8f0"; }}>
                      <span className="titre-num" style={{ width: "22px", height: "22px", borderRadius: "6px", flexShrink: 0, background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "11px", fontWeight: "700", color: "#94a3b8" }}>{i + 1}</span>
                      <span className="titre-text" style={{ fontSize: "13px", fontWeight: "500", color: "#0f172a", lineHeight: "1.4", flex: 1 }}>{titre}</span>
                      <span style={{ fontSize: "11px", color: "#94a3b8", flexShrink: 0, whiteSpace: "nowrap" }}>Générer →</span>
                    </button>
                  )
                ))}
              </div>
              {data.verdict === "fonce" && selectedTitre && (
                <button onClick={() => router.push(`/dashboard/projets/nouveau?suggestion=${encodeURIComponent(selectedTitre)}`)}
                  style={{ width: "100%", marginTop: "12px", padding: "10px", background: "#f59e0b", color: "#0f172a", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
                  Créer avec ce titre →
                </button>
              )}
            </div>
          </BlurSection>
          )}

            </>
          )}
          {/* ANGLE GAGNANT */}
          {(data.angleGagnant?.titre || data.angleGagnant?.strategie || data.concurrents?.angleUnique) && (
            <BlurSection isPremium={isPremiumReal} router={router} title="Comment battre la concurrence">
              <div className="card">
                <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
                  <Target size={15} color="#0f172a" />
                  <h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Comment battre la concurrence</h3>
                </div>

                {/* Titre stratégie */}
                {(data.angleGagnant?.titre || data.concurrents?.angleUnique) && (
                  <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>Ton angle gagnant</p>
                    <p style={{ fontSize: "15px", fontWeight: "800", color: "#0f172a", margin: 0, lineHeight: "1.4" }}>
                      {data.angleGagnant?.titre || data.concurrents?.angleUnique}
                    </p>
                  </div>
                )}

                {/* Stratégie détaillée */}
                {data.angleGagnant?.strategie && (
                  <p style={{ fontSize: "13px", color: "#374151", margin: "0 0 14px", lineHeight: "1.8" }}>{data.angleGagnant.strategie}</p>
                )}

                {/* Face aux concurrents */}
                {data.angleGagnant?.positionnemment && (
                  <div style={{ padding: "12px 14px", background: "#f8fafc", borderRadius: "8px", marginBottom: "12px" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 4px" }}>Face aux {data.fbAds?.totalAnnonceurs || 0} concurrents FB</p>
                    <p style={{ fontSize: "13px", color: "#475569", margin: 0, lineHeight: "1.5" }}>{data.angleGagnant.positionnemment}</p>
                  </div>
                )}

                {/* Sujet reformulé */}
                {data.angleGagnant?.sujetReformule && (
                  <div style={{ background: "#fffbeb", border: "1px solid #fde68a", borderRadius: "10px", padding: "14px 16px" }}>
                    <p style={{ fontSize: "11px", fontWeight: "700", color: "#d97706", textTransform: "uppercase", letterSpacing: "0.08em", margin: "0 0 6px" }}>
                      {data.verdict === "fonce" ? "Autre angle possible" : "Angle recommandé pour ce marché"}
                    </p>
                    <p style={{ fontSize: "14px", color: "#92400e", margin: "0 0 12px", fontWeight: "600", lineHeight: "1.4" }}>{data.angleGagnant.sujetReformule}</p>
                    <div style={{ display: "flex", gap: "8px", flexWrap: "wrap" }}>
                      <button onClick={() => router.push(`/dashboard/projets/nouveau?suggestion=${encodeURIComponent(data.angleGagnant.sujetReformule)}`)}
                        style={{ padding: "8px 16px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer" }}>
                        Générer l'ebook avec cet angle →
                      </button>
                      <button onClick={() => setShowAnglerModal(true)}
                        style={{ padding: "8px 14px", background: "transparent", color: "#d97706", border: "1px solid #fde68a", borderRadius: "8px", fontSize: "12px", fontWeight: "600", cursor: "pointer" }}>
                        Modifier
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </BlurSection>
          )}

          {/* CONCURRENTS */}
          <BlurSection isPremium={isPremiumReal} router={router} title="Comment les concurrents se positionnent">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}><Target size={15} color="#0f172a" /><h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Comment les concurrents se positionnent</h3></div>
              <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 16px", lineHeight: "1.7" }}>{data.concurrents?.description}</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "8px", marginBottom: "16px" }}>
                {data.concurrents?.strategies?.map((s, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "10px 14px", background: "#f8fafc", border: "1px solid #f1f5f9", borderRadius: "10px" }}>
                    <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", background: "#e2e8f0", borderRadius: "4px", padding: "2px 6px", flexShrink: 0, marginTop: "1px" }}>0{i + 1}</span>
                    <span style={{ fontSize: "13px", color: "#374151", lineHeight: "1.5" }}>{s}</span>
                  </div>
                ))}
              </div>
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "14px 16px" }}>
                <p style={{ fontSize: "11px", fontWeight: "700", color: "#16a34a", margin: "0 0 6px", textTransform: "uppercase", letterSpacing: "0.08em" }}>Ton angle unique</p>
                <p style={{ fontSize: "13px", color: "#166534", margin: 0, lineHeight: "1.6", fontWeight: "500" }}>{data.concurrents?.angleUnique}</p>
              </div>
            </div>
          </BlurSection>

          {/* PRATIQUES */}
          <BlurSection isPremium={isPremiumReal} router={router} title="Pratiques pour vendre rapidement">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}><TrendingUp size={15} color="#f59e0b" /><h3 style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Pratiques pour vendre rapidement</h3></div>
              <div className="result-grid">
                {data.pratiques?.map((p, i) => (
                  <div key={i} style={{ padding: "14px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px" }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "6px" }}>
                      <div style={{ width: "22px", height: "22px", borderRadius: "6px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "10px", fontWeight: "700", color: "#f59e0b", flexShrink: 0 }}>{i + 1}</div>
                      <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{p.titre}</p>
                    </div>
                    <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 0 30px", lineHeight: "1.6" }}>{p.description}</p>
                  </div>
                ))}
              </div>
            </div>
          </BlurSection>

          {/* ALTERNATIVES SI EVITE */}
          {data.verdict === "evite" && data.alternativesSiMauvais?.length > 0 && (
            <div className="card" style={{ borderColor: "#fecaca", background: "#fef2f2" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}><AlertTriangle size={15} color="#dc2626" /><h3 style={{ fontSize: "14px", fontWeight: "700", color: "#dc2626", margin: 0 }}>Ces sujets marchent mieux</h3></div>
              <p style={{ fontSize: "12px", color: "#991b1b", margin: "0 0 14px" }}>Votre sujet actuel n'est pas optimal. Voici des alternatives qui cartonnent davantage :</p>
              <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
                {data.alternativesSiMauvais.map((alt, i) => (
                  <div key={i} style={{ display: "flex", alignItems: "flex-start", gap: "12px", padding: "12px 14px", background: "white", border: "1px solid #fecaca", borderRadius: "10px" }}>
                    <ChevronRight size={13} color="#dc2626" style={{ flexShrink: 0, marginTop: "2px" }} />
                    <div style={{ flex: 1 }}>
                      <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: "0 0 3px" }}>{alt.sujet}</p>
                      <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.5" }}>{alt.raison}</p>
                    </div>
                    <button onClick={() => setShowAnglerModal(true)} style={{ marginLeft: "auto", padding: "5px 10px", background: "#0f172a", color: "white", border: "none", borderRadius: "7px", fontSize: "11px", fontWeight: "600", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>Tester →</button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* SIDEBAR */}
        <div className="sidebar-sticky" style={{ display: "flex", flexDirection: "column", gap: "14px", position: "sticky", top: "20px" }}>
          <div className="card-dark">
            <p style={{ fontSize: "10px", fontWeight: "700", color: "#475569", letterSpacing: "0.1em", textTransform: "uppercase", margin: "0 0 6px" }}>Prochaine étape</p>
            <p style={{ fontSize: "16px", fontWeight: "800", color: "white", margin: "0 0 6px", lineHeight: "1.3" }}>Créer votre ebook sur ce sujet</p>
            <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 16px", lineHeight: "1.6" }}>Sujet analysé, angle identifié — il ne reste plus qu'à exécuter.</p>
            <button onClick={() => router.push(`/dashboard/projets/nouveau?suggestion=${encodeURIComponent(titrePourCreation)}`)}
              style={{ width: "100%", padding: "12px", background: "#f59e0b", color: "#0f172a", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "800", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              Créer l'ebook maintenant <ChevronRight size={14} />
            </button>
            <button onClick={() => setShowAnglerModal(true)}
              style={{ width: "100%", padding: "10px", marginTop: "8px", background: "transparent", color: "#475569", border: "1px solid #1e293b", borderRadius: "10px", fontSize: "12px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
              <Edit3 size={13} /> Tester un autre angle
            </button>
          </div>

          <BlurSection isPremium={isPremiumReal} router={router} title="Estimation réaliste">
            <div className="card">
              <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "14px" }}><DollarSign size={14} color="#0f172a" /><h3 style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Estimation réaliste</h3></div>
              <div style={{ background: "#0f172a", borderRadius: "10px", padding: "14px", marginBottom: "12px" }}>
                <p style={{ fontSize: "10px", color: "#475569", margin: "0 0 3px", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.08em" }}>Si vous vendez à</p>
                <p style={{ fontSize: "24px", fontWeight: "800", color: "#f59e0b", margin: "0 0 2px", lineHeight: 1 }}>{(data.revenus?.prixRecommande || 0).toLocaleString("fr-FR")} FCFA</p>
                <p style={{ fontSize: "11px", color: "#475569", margin: 0 }}>par client</p>
              </div>
              {[
                { label: "Conservateur", ventes: `${Math.max(1, Math.round((data.revenus?.ventesParSemaine || 10) * 0.5))}/sem`, rev: Math.round((data.revenus?.prixRecommande || 0) * Math.max(1, (data.revenus?.ventesParSemaine || 10) * 0.5)).toLocaleString("fr-FR"), color: "#94a3b8" },
                { label: "Réaliste", ventes: `${data.revenus?.ventesParSemaine || 10}/sem`, rev: semFormatted, color: "#d97706" },
                { label: "Ambitieux", ventes: `${Math.round((data.revenus?.ventesParSemaine || 10) * 2)}/sem`, rev: Math.round((data.revenus?.prixRecommande || 0) * (data.revenus?.ventesParSemaine || 10) * 2).toLocaleString("fr-FR"), color: "#16a34a" },
              ].map(s => (
                <div key={s.label} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 0", borderBottom: "1px solid #f1f5f9" }}>
                  <div><p style={{ fontSize: "11px", fontWeight: "600", color: "#0f172a", margin: 0 }}>{s.label}</p><p style={{ fontSize: "10px", color: "#94a3b8", margin: 0 }}>{s.ventes}</p></div>
                  <span style={{ fontSize: "13px", fontWeight: "700", color: s.color }}>{s.rev} FCFA</span>
                </div>
              ))}
              <p style={{ fontSize: "10px", color: "#94a3b8", margin: "10px 0 0", fontStyle: "italic", lineHeight: "1.5" }}>{data.revenus?.hypothese}</p>
            </div>
          </BlurSection>

          <BlurSection isPremium={isPremiumReal} router={router} title="Niveau de concurrence">
            <div className="card">
              <p className="slabel">Niveau de concurrence</p>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "44px", height: "44px", borderRadius: "10px", background: data.concurrents?.niveau === "faible" ? "#f0fdf4" : data.concurrents?.niveau === "fort" ? "#fef2f2" : "#fffbeb", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <span style={{ fontSize: "20px" }}>{data.concurrents?.niveau === "faible" ? "😊" : data.concurrents?.niveau === "fort" ? "😰" : "😐"}</span>
                </div>
                <div>
                  <p style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0, textTransform: "capitalize" }}>{data.concurrents?.niveau || "Moyen"}</p>
                  <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>{data.fbAds?.totalAnnonceurs || 0} annonceurs actifs sur FB</p>
                </div>
              </div>
              <p style={{ fontSize: "12px", color: "#64748b", margin: 0, lineHeight: "1.6" }}>{data.saturation?.description}</p>
            </div>
          </BlurSection>

          <BlurSection isPremium={isPremiumReal} router={router} title="Vendez avec Taliopay">
            <div style={{ background: "#0f172a", borderRadius: "14px", padding: "18px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "10px" }}>
                <div style={{ width: "36px", height: "36px", background: "#1e293b", borderRadius: "9px", display: "flex", alignItems: "center", justifyContent: "center" }}><ShoppingBag size={16} color="#f59e0b" /></div>
                <div><p style={{ fontSize: "13px", fontWeight: "700", color: "white", margin: 0 }}>Vendez avec Taliopay</p><p style={{ fontSize: "11px", color: "#475569", margin: 0 }}>Mobile Money · 15+ pays</p></div>
              </div>
              <p style={{ fontSize: "12px", color: "#64748b", margin: "0 0 12px", lineHeight: "1.6" }}>Encaissez via Orange Money, Wave, MTN — sans compte bancaire requis.</p>
              <a href="https://taliopay.com" target="_blank" rel="noopener noreferrer"
                style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "6px", padding: "9px", background: "#f59e0b", color: "#0f172a", borderRadius: "9px", fontSize: "12px", fontWeight: "700", textDecoration: "none" }}>
                Créer ma boutique <ExternalLink size={12} />
              </a>
            </div>
          </BlurSection>
        </div>
      </div>

      {showAnglerModal && <AnglerModal sujet={data.sujet} onClose={() => setShowAnglerModal(false)} router={router} />}

      <style>{`
        @keyframes spin { to { transform: rotate(360deg); } }
        .mobile-upsell-bar { display: none; }
        @media (max-width: 900px) { .mobile-upsell-bar { display: flex; } }
        /* Padding bas pour éviter que le contenu soit caché derrière la barre */
        @media (max-width: 900px) { .result-layout { padding-bottom: 80px; } }
      `}</style>
    </div>
  );
}