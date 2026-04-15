"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ArrowLeft, Download, Loader2, X, BookOpen, ChevronDown, ChevronUp } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

// ── Mini aperçu PDF style selon template ─────────────────────────────────────
const TEMPLATE_STYLES = {
  classique: { bg: "#ffffff", text: "#1a1a1a", accent: "#0f172a", font: "Georgia, serif", headerBg: "#0f172a", headerText: "white" },
  sombre:    { bg: "#0a0a0a", text: "#e2e8f0", accent: "#d4af37", font: "Georgia, serif", headerBg: "#0a0a0a", headerText: "#d4af37" },
  romance:   { bg: "#fdf8f3", text: "#3d2b1f", accent: "#be185d", font: "Georgia, serif", headerBg: "#fdf8f3", headerText: "#be185d" },
  moderne:   { bg: "#ffffff", text: "#111111", accent: "#2563eb", font: "Helvetica, Arial, sans-serif", headerBg: "#ffffff", headerText: "#2563eb" },
};

export default function RomanDetailPage() {
  const { id } = useParams();
  const router = useRouter();
  const { mutateBalance } = useCredits();

  const [roman, setRoman] = useState(null);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState("");
  const [downloadError, setDownloadError] = useState("");
  const [chapterOpen, setChapterOpen] = useState(true);

  useEffect(() => {
    if (!id) return;
    fetch(`/api/romans/${id}`, { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (data.success) setRoman(data.data); })
      .finally(() => setLoading(false));
  }, [id]);

  const handleDownload = async () => {
    setDownloading(true);
    setDownloadError("");
    setDownloadProgress("Génération des chapitres en cours...");

    try {
      const res = await fetch(`/api/romans/${id}/download`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        if (data.insufficientCredits) {
          setDownloadError(`Crédits insuffisants. Il vous faut ${data.required} crédits (solde: ${data.balance} cr.)`);
        } else {
          setDownloadError(data.message || "Erreur lors de la génération.");
        }
        setDownloading(false);
        return;
      }

      setDownloadProgress("Création du PDF...");

      const blob = await res.blob();
      const newBalance = res.headers.get("X-New-Balance");
      if (newBalance) mutateBalance();

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${roman?.title || "roman"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowModal(false);
      setDownloading(false);
      setDownloadProgress("");

    } catch (e) {
      setDownloadError("Erreur serveur. Réessayez.");
      setDownloading(false);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px" }}>
      <Loader2 size={24} color="#6366f1" style={{ animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  if (!roman) return (
    <div style={{ textAlign: "center", padding: "60px 20px" }}>
      <p style={{ color: "#64748b", marginBottom: "16px" }}>Roman introuvable.</p>
      <button onClick={() => router.push("/dashboard/romans")}
        style={{ padding: "10px 20px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", cursor: "pointer", fontSize: "13px" }}>
        Retour
      </button>
    </div>
  );

  const style = TEMPLATE_STYLES[roman.template] || TEMPLATE_STYLES.classique;
  const ch1 = roman.chapters?.[0];

  return (
    <div style={{ maxWidth: "900px", margin: "0 auto", padding: "24px 16px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
        <button onClick={() => router.push("/dashboard/romans")}
          style={{ padding: "8px", background: "#f1f5f9", border: "none", borderRadius: "8px", cursor: "pointer" }}>
          <ArrowLeft size={16} color="#475569" />
        </button>
        <div style={{ flex: 1 }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "2px" }}>
            <span style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.08em" }}>{roman.genre}</span>
            <span style={{ color: "#e2e8f0" }}>·</span>
            <span style={{ fontSize: "11px", color: "#94a3b8" }}>Aperçu — Chapitre 1/{roman.chapterPlans?.length || "?"}</span>
          </div>
          <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: 0 }}>{roman.title}</h1>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ padding: "10px 18px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
          <Download size={14} />
          Roman complet
        </button>
      </div>

      {/* Synopsis */}
      <div style={{ background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "10px", padding: "14px 18px", marginBottom: "20px" }}>
        <p style={{ fontSize: "11px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "6px" }}>SYNOPSIS</p>
        <p style={{ fontSize: "14px", color: "#475569", margin: 0, lineHeight: "1.6", fontStyle: "italic" }}>{roman.synopsis}</p>
      </div>

      {/* Chapitre 1 avec vrai style PDF */}
      {ch1 && (
        <div style={{ border: `2px solid ${style.accent}20`, borderRadius: "12px", overflow: "hidden", marginBottom: "20px" }}>
          {/* En-tête chapitre */}
          <div style={{ background: style.headerBg, padding: "16px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <div>
              <p style={{ fontSize: "10px", fontWeight: "700", color: style.headerText === "white" ? "#94a3b8" : style.accent, letterSpacing: "0.2em", margin: "0 0 4px", opacity: 0.7 }}>CHAPITRE 1</p>
              <h2 style={{ fontSize: "18px", fontWeight: "700", color: style.headerText, margin: 0, fontFamily: style.font }}>{ch1.title}</h2>
            </div>
            <button onClick={() => setChapterOpen(!chapterOpen)}
              style={{ background: "none", border: "none", cursor: "pointer", color: style.headerText, opacity: 0.6 }}>
              {chapterOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
            </button>
          </div>

          {/* Contenu */}
          {chapterOpen && (
            <div style={{ background: style.bg, padding: "32px 40px", maxHeight: "600px", overflowY: "auto" }}>
              <div style={{ fontFamily: style.font, fontSize: "15px", lineHeight: "1.9", color: style.text }}>
                {ch1.content?.split("\n\n").filter(p => p.trim()).map((para, i) => (
                  <p key={i} style={{ marginBottom: "0.4em", textIndent: i === 0 ? "0" : "2em" }}>
                    {i === 0 ? (
                      <>
                        <span style={{ fontSize: "3em", fontWeight: "700", color: style.accent, display: "inline-block", lineHeight: "1", marginRight: "2px", verticalAlign: "baseline" }}>
                          {para[0]}
                        </span>
                        {para.slice(1)}
                      </>
                    ) : para}
                  </p>
                ))}
              </div>
            </div>
          )}

          {/* Footer */}
          <div style={{ background: style.headerBg, padding: "10px 24px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "11px", color: style.headerText, opacity: 0.4 }}>{roman.title}</span>
            <span style={{ fontSize: "11px", color: style.headerText, opacity: 0.4 }}>Chapitre 1</span>
          </div>
        </div>
      )}

      {/* CTA suite */}
      <div style={{ background: "linear-gradient(135deg, #0f172a, #1e293b)", borderRadius: "12px", padding: "20px 24px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "16px" }}>
        <div>
          <p style={{ fontSize: "15px", fontWeight: "700", color: "white", margin: "0 0 4px" }}>
            + {(roman.chapterPlans?.length || 1) - 1} chapitres vous attendent
          </p>
          <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>
            Téléchargez le roman complet en PDF avec le template {roman.template}
          </p>
        </div>
        <button onClick={() => setShowModal(true)}
          style={{ padding: "12px 20px", background: "white", color: "#0f172a", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px", whiteSpace: "nowrap" }}>
          <Download size={14} />
          Télécharger ({roman.creditsRequired} cr.)
        </button>
      </div>

      {/* ── MODAL TÉLÉCHARGEMENT ──────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          onClick={e => !downloading && e.target === e.currentTarget && setShowModal(false)}>
          <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "420px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>

            {/* Header modal */}
            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={16} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Roman complet</p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>{roman.chapterPlans?.length || "?"} chapitres · Template {roman.template}</p>
                </div>
              </div>
              {!downloading && (
                <button onClick={() => setShowModal(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  <X size={16} />
                </button>
              )}
            </div>

            <div style={{ padding: "20px" }}>
              {downloading ? (
                /* Progress */
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Loader2 size={32} color="#6366f1" style={{ animation: "spin 1s linear infinite", marginBottom: "16px" }} />
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: "0 0 6px" }}>Génération en cours...</p>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{downloadProgress}</p>
                  <p style={{ fontSize: "12px", color: "#94a3b8", margin: "10px 0 0" }}>Cela peut prendre 2-4 minutes selon la longueur</p>
                </div>
              ) : (
                <>
                  {/* Récap */}
                  <div style={{ background: "#f8fafc", borderRadius: "10px", padding: "14px", marginBottom: "16px" }}>
                    {[
                      ["Roman", roman.title],
                      ["Genre", roman.genre],
                      ["Longueur", `${roman.chapterPlans?.length || "?"} chapitres`],
                      ["Template", roman.template],
                      ["Format", "PDF (A5)"],
                    ].map(([label, value]) => (
                      <div key={label} style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #f1f5f9" }}>
                        <span style={{ fontSize: "12px", color: "#64748b" }}>{label}</span>
                        <span style={{ fontSize: "12px", fontWeight: "600", color: "#0f172a" }}>{value}</span>
                      </div>
                    ))}
                  </div>

                  {/* Coût */}
                  <div style={{ background: "#0f172a", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Coût de téléchargement</p>
                    <p style={{ fontSize: "20px", fontWeight: "800", color: "white", margin: 0 }}>{roman.creditsRequired} crédits</p>
                  </div>

                  {downloadError && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", color: "#dc2626", fontSize: "12px" }}>
                      {downloadError}
                    </div>
                  )}

                  <button onClick={handleDownload}
                    style={{ width: "100%", padding: "13px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Download size={16} />
                    Confirmer et télécharger
                  </button>
                  <p style={{ fontSize: "11px", color: "#94a3b8", textAlign: "center", margin: "10px 0 0" }}>
                    Les crédits sont déduits au moment du téléchargement
                  </p>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}