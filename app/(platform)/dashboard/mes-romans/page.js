"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { BookOpen, Download, Plus, Loader2, Clock, CheckCircle, Eye, X } from "lucide-react";
import { useCredits } from "@/hooks/useCredits";

const TEMPLATE_COLORS = {
  classique: { bg: "#0f172a", accent: "#d4af37", label: "Classique" },
  sombre:    { bg: "#0a0a0a", accent: "#dc2626", label: "Sombre" },
  romance:   { bg: "#fdf8f3", accent: "#be185d", label: "Romance" },
  moderne:   { bg: "#2563eb", accent: "#ffffff", label: "Moderne" },
};

const GENRE_LABELS = {
  thriller: "Thriller", romance: "Romance", aventure: "Aventure",
  drame: "Drame", fantasy: "Fantasy", policier: "Policier",
};

export default function MesRomansPage() {
  const router = useRouter();
  const { mutateBalance } = useCredits();

  const [romans, setRomans] = useState([]);
  const [loading, setLoading] = useState(true);
  const [downloadingId, setDownloadingId] = useState(null);
  const [showModal, setShowModal] = useState(null); // roman object
  const [downloadError, setDownloadError] = useState("");
  const [downloadProgress, setDownloadProgress] = useState("");

  useEffect(() => {
    fetch("/api/romans", { credentials: "include" })
      .then(r => r.json())
      .then(data => { if (data.success) setRomans(data.data); })
      .finally(() => setLoading(false));
  }, []);

  const handleDownload = async (roman) => {
    setDownloadingId(roman._id);
    setDownloadError("");
    setDownloadProgress(roman.status === "completed" ? "Récupération du PDF..." : "Génération des chapitres...");

    try {
      const res = await fetch(`/api/romans/${roman._id}/download`, {
        method: "POST",
        credentials: "include",
      });

      if (!res.ok) {
        const data = await res.json();
        setDownloadError(data.insufficientCredits
          ? `Crédits insuffisants. Il vous faut ${data.required} crédits.`
          : data.message || "Erreur.");
        setDownloadingId(null);
        return;
      }

      // Si la réponse est JSON avec pdfUrl → ouvrir l'URL Cloudinary directement
      const contentType = res.headers.get("Content-Type") || "";
      if (contentType.includes("application/json")) {
        const data = await res.json();
        if (data.pdfUrl) {
          window.open(data.pdfUrl, "_blank");
          setShowModal(null);
          setDownloadingId(null);
          return;
        }
      }

      // Sinon blob PDF direct
      const blob = await res.blob();
      const newBalance = res.headers.get("X-New-Balance");
      if (newBalance) mutateBalance();

      const updated = await fetch("/api/romans", { credentials: "include" }).then(r => r.json());
      if (updated.success) setRomans(updated.data);

      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `${roman.title || "roman"}.pdf`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setShowModal(null);
      setDownloadingId(null);
      setDownloadProgress("");

    } catch (e) {
      setDownloadError("Erreur serveur. Réessayez.");
      setDownloadingId(null);
    }
  };

  if (loading) return (
    <div style={{ display: "flex", alignItems: "center", justifyContent: "center", minHeight: "60vh", gap: "12px" }}>
      <Loader2 size={24} color="#6366f1" style={{ animation: "spin 1s linear infinite" }} />
      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );

  return (
    <div style={{ maxWidth: "1000px", margin: "0 auto", padding: "28px 20px" }}>

      {/* Header */}
      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "24px" }}>
        <div>
          <h1 style={{ fontSize: "20px", fontWeight: "800", color: "#0f172a", margin: "0 0 4px" }}>Mes Romans</h1>
          <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>
            {romans.length} roman{romans.length > 1 ? "s" : ""} · Aperçus et romans complets
          </p>
        </div>
        <button onClick={() => router.push("/dashboard/romans")}
          style={{ padding: "10px 16px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "6px" }}>
          <Plus size={14} /> Nouveau roman
        </button>
      </div>

      {/* Empty state */}
      {romans.length === 0 && (
        <div style={{ textAlign: "center", padding: "80px 20px" }}>
          <div style={{ width: "64px", height: "64px", background: "#f1f5f9", borderRadius: "16px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
            <BookOpen size={28} color="#94a3b8" />
          </div>
          <h2 style={{ fontSize: "16px", fontWeight: "700", color: "#0f172a", margin: "0 0 8px" }}>Aucun roman pour l'instant</h2>
          <p style={{ fontSize: "13px", color: "#64748b", margin: "0 0 20px" }}>Créez votre premier roman avec l'IA</p>
          <button onClick={() => router.push("/dashboard/romans")}
            style={{ padding: "11px 20px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "13px", fontWeight: "700", cursor: "pointer" }}>
            Créer un roman
          </button>
        </div>
      )}

      {/* Liste */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))", gap: "14px" }}>
        {romans.map(roman => {
          const tpl = TEMPLATE_COLORS[roman.template] || TEMPLATE_COLORS.classique;
          const isCompleted = roman.status === "completed";
          const isDownloading = downloadingId === roman._id;
          const chapitresTotal = roman.chapterPlans?.length || roman.chapters?.length || "?";

          return (
            <div key={roman._id}
              style={{ background: "white", border: "1px solid #e2e8f0", borderRadius: "14px", overflow: "hidden", display: "flex", flexDirection: "column" }}>

              {/* Mini couverture */}
              <div style={{ height: "100px", background: tpl.bg, padding: "16px 20px", display: "flex", flexDirection: "column", justifyContent: "flex-end", position: "relative" }}>
                {/* Statut badge */}
                <div style={{ position: "absolute", top: "12px", right: "12px" }}>
                  {isCompleted ? (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", background: "#dcfce7", color: "#16a34a", fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "20px" }}>
                      <CheckCircle size={10} /> Complet
                    </span>
                  ) : (
                    <span style={{ display: "flex", alignItems: "center", gap: "4px", background: "#fef9c3", color: "#92400e", fontSize: "10px", fontWeight: "700", padding: "3px 8px", borderRadius: "20px" }}>
                      <Eye size={10} /> Aperçu
                    </span>
                  )}
                </div>
                {/* Accent line */}
                <div style={{ width: "30px", height: "2px", background: tpl.accent, marginBottom: "8px" }} />
                <p style={{ fontSize: "10px", color: tpl.accent, letterSpacing: "0.15em", margin: "0 0 4px", opacity: 0.8, textTransform: "uppercase" }}>
                  {GENRE_LABELS[roman.genre] || roman.genre}
                </p>
                <p style={{ fontSize: "14px", fontWeight: "700", color: tpl.bg === "#fdf8f3" ? "#1e1b4b" : "white", margin: 0, lineHeight: "1.2", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>
                  {roman.title}
                </p>
              </div>

              {/* Infos */}
              <div style={{ padding: "14px 16px", flex: 1, display: "flex", flexDirection: "column" }}>
                <p style={{ fontSize: "12px", color: "#475569", margin: "0 0 10px", lineHeight: "1.5", overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", fontStyle: "italic" }}>
                  {roman.synopsis}
                </p>

                <div style={{ display: "flex", gap: "6px", flexWrap: "wrap", marginBottom: "12px" }}>
                  {[
                    `${chapitresTotal} chapitres`,
                    roman.totalWords ? `${Math.round(roman.totalWords / 1000)}k mots` : null,
                    tpl.label,
                  ].filter(Boolean).map(tag => (
                    <span key={tag} style={{ fontSize: "10px", fontWeight: "600", color: "#64748b", background: "#f1f5f9", padding: "3px 8px", borderRadius: "20px" }}>
                      {tag}
                    </span>
                  ))}
                </div>

                <p style={{ fontSize: "11px", color: "#94a3b8", margin: "0 0 12px" }}>
                  <Clock size={10} style={{ marginRight: "4px", verticalAlign: "middle" }} />
                  {new Date(roman.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" })}
                </p>

                {/* Actions */}
                <div style={{ display: "flex", gap: "8px", marginTop: "auto" }}>
                  {isCompleted ? (
                    <button onClick={() => { setShowModal(roman); setDownloadError(""); }}
                      disabled={isDownloading}
                      style={{ flex: 1, padding: "9px", background: "#0f172a", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px", opacity: isDownloading ? 0.7 : 1 }}>
                      {isDownloading
                        ? <><Loader2 size={12} style={{ animation: "spin 1s linear infinite" }} /> En cours...</>
                        : <><Download size={13} /> Retélécharger</>}
                    </button>
                  ) : (
                    <button onClick={() => router.push(`/dashboard/romans/${roman._id}`)}
                      style={{ flex: 1, padding: "9px", background: "#0f172a", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", color: "white", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "5px" }}>
                      <Download size={13} /> Finaliser ({roman.creditsRequired} cr.)
                    </button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* ── MODAL TÉLÉCHARGEMENT ──────────────────────────────────────────────── */}
      {showModal && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.5)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          onClick={e => !downloadingId && e.target === e.currentTarget && setShowModal(null)}>
          <div style={{ background: "white", borderRadius: "16px", width: "100%", maxWidth: "400px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>

            <div style={{ padding: "16px 20px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "#0f172a", display: "flex", alignItems: "center", justifyContent: "center" }}>
                  <BookOpen size={16} color="white" />
                </div>
                <div>
                  <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{showModal.title}</p>
                  <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>
                    {showModal.status === "completed" ? "Retélécharger le PDF" : "Finaliser le roman"}
                  </p>
                </div>
              </div>
              {!downloadingId && (
                <button onClick={() => setShowModal(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}>
                  <X size={16} />
                </button>
              )}
            </div>

            <div style={{ padding: "20px" }}>
              {downloadingId === showModal._id ? (
                <div style={{ textAlign: "center", padding: "20px 0" }}>
                  <Loader2 size={32} color="#6366f1" style={{ animation: "spin 1s linear infinite", marginBottom: "16px" }} />
                  <p style={{ fontSize: "14px", fontWeight: "600", color: "#0f172a", margin: "0 0 6px" }}>
                    {showModal.status === "completed" ? "Création du PDF..." : "Génération en cours..."}
                  </p>
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>{downloadProgress}</p>
                  {showModal.status !== "completed" && (
                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "10px 0 0" }}>Cela peut prendre 2-4 minutes</p>
                  )}
                </div>
              ) : (
                <>
                  {showModal.status === "completed" ? (
                    <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px" }}>
                      <p style={{ fontSize: "13px", fontWeight: "600", color: "#15803d", margin: "0 0 4px" }}>Roman déjà généré</p>
                      <p style={{ fontSize: "12px", color: "#16a34a", margin: 0 }}>Le retéléchargement est gratuit — le PDF sera recréé depuis vos chapitres sauvegardés.</p>
                    </div>
                  ) : (
                    <div style={{ background: "#0f172a", borderRadius: "10px", padding: "14px 16px", marginBottom: "16px", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <p style={{ fontSize: "13px", color: "#94a3b8", margin: 0 }}>Coût de finalisation</p>
                      <p style={{ fontSize: "20px", fontWeight: "800", color: "white", margin: 0 }}>{showModal.creditsRequired} crédits</p>
                    </div>
                  )}

                  {downloadError && (
                    <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", color: "#dc2626", fontSize: "12px" }}>
                      {downloadError}
                    </div>
                  )}

                  <button onClick={() => handleDownload(showModal)}
                    style={{ width: "100%", padding: "13px", background: "#0f172a", color: "white", border: "none", borderRadius: "10px", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "8px" }}>
                    <Download size={16} />
                    {showModal.status === "completed" ? "Télécharger le PDF" : "Confirmer et finaliser"}
                  </button>
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