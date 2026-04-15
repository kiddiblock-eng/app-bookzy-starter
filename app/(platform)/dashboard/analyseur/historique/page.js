"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BarChart2, Plus, Loader2, ChevronRight } from "lucide-react";

const VERDICT_CONFIG = {
  fonce:   { label: "🔥 Fonce", color: "#16a34a", bg: "#f0fdf4" },
  attends: { label: "⏳ Attends", color: "#d97706", bg: "#fffbeb" },
  evite:   { label: "❌ Évite", color: "#dc2626", bg: "#fef2f2" },
};

export default function AnalyseurHistoriquePage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState([]);
  const [isPremium, setIsPremium] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([
      fetch("/api/analyseur/list", { credentials: "include" }).then(r => r.json()),
      fetch("/api/auth/me", { credentials: "include" }).then(r => r.json()),
    ]).then(([listData, meData]) => {
      if (listData.success) setAnalyses(listData.data);
      const plan = meData?.user?.plan || meData?.plan || "free";
      setIsPremium(["solo", "createur", "agence"].includes(plan));
    }).finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh" }}>
      <Loader2 size={24} color="#0f172a" style={{ animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "28px 20px" }}>
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>Mes analyses</h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            {analyses.length} analyse{analyses.length > 1 ? "s" : ""} — historique complet
          </p>
        </div>
        <button onClick={() => router.push("/dashboard/analyseur")}
          style={{ padding: "10px 16px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <Plus size={14} /> Nouvelle analyse
        </button>
      </div>

      {analyses.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ width: "64px", height: "64px", background: "#f1f5f9", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <BarChart2 size={28} color="#94a3b8" />
          </div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>Aucune analyse pour l'instant</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px" }}>Analysez votre premier produit digital</p>
          <button onClick={() => router.push("/dashboard/analyseur")}
            style={{ padding: "11px 20px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            Analyser un produit
          </button>
        </div>
      )}

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {analyses.map(a => {
          const verdict = VERDICT_CONFIG[a.verdict] || VERDICT_CONFIG.attends;
          return (
            <div key={a._id}
              onClick={() => router.push(`/dashboard/analyseur/${a._id}?premium=${isPremium}`)}
              style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "12px", padding: "16px 20px", cursor: "pointer", display: "flex", alignItems: "center", gap: "16px", transition: "all 0.15s" }}
              onMouseEnter={e => { e.currentTarget.style.borderColor = "#0f172a"; e.currentTarget.style.boxShadow = "0 2px 8px rgba(0,0,0,0.06)"; }}
              onMouseLeave={e => { e.currentTarget.style.borderColor = "#e2e8f0"; e.currentTarget.style.boxShadow = "none"; }}>

              <div style={{ width: "52px", height: "52px", flexShrink: 0 }}>
                <svg width="52" height="52" viewBox="0 0 52 52">
                  <circle cx="26" cy="26" r="22" fill="none" stroke="#f1f5f9" strokeWidth="5" />
                  <circle cx="26" cy="26" r="22" fill="none"
                    stroke={isPremium ? verdict.color : "#e2e8f0"} strokeWidth="5"
                    strokeDasharray={`${2 * Math.PI * 22 * (a.scoreGlobal || 0) / 100} ${2 * Math.PI * 22}`}
                    strokeLinecap="round" strokeDashoffset={2 * Math.PI * 22 * 0.25}
                    style={{ transform: "rotate(-90deg)", transformOrigin: "26px 26px" }} />
                  <text x="26" y="30" textAnchor="middle" fontSize="11" fontWeight="900" fill={isPremium ? "#0f172a" : "#94a3b8"}>
                    {isPremium ? a.scoreGlobal : "??"}
                  </text>
                </svg>
              </div>

              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: "0 0 4px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{a.sujet}</p>
                <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                  {isPremium ? (
                    <span style={{ fontSize: "11px", fontWeight: "700", color: verdict.color, background: verdict.bg, padding: "2px 8px", borderRadius: "20px" }}>
                      {verdict.label}
                    </span>
                  ) : (
                    <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", background: "#f1f5f9", padding: "2px 8px", borderRadius: "20px" }}>
                      🔒 Verdict caché
                    </span>
                  )}
                  {isPremium && a.revenus?.prixRecommande && (
                    <span style={{ fontSize: "11px", color: "#64748b" }}>
                      {a.revenus.prixRecommande.toLocaleString()} FCFA
                    </span>
                  )}
                  {!isPremium && (
                    <span style={{ fontSize: "11px", color: "#f59e0b", fontWeight: "600", background: "#fffbeb", padding: "2px 8px", borderRadius: "20px" }}>
                      Rapport flouté
                    </span>
                  )}
                  <span style={{ fontSize: "11px", color: "#94a3b8" }}>
                    {new Date(a.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}
                  </span>
                </div>
              </div>

              <ChevronRight size={16} color="#94a3b8" style={{ flexShrink: 0 }} />
            </div>
          );
        })}
      </div>

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}