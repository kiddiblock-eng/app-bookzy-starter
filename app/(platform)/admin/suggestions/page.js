// app/(admin)/admin/suggestions/page.js
"use client";

import { useState, useEffect } from "react";
import { Check, X, Clock, Rocket, Lightbulb, ArrowUp, TrendingUp, Users } from "lucide-react";

const STATUS_OPTIONS = [
  { value: "pending",   label: "En attente", color: "#737373", bg: "rgba(115,115,115,0.1)",  border: "rgba(115,115,115,0.2)" },
  { value: "approved",  label: "Approuvé",   color: "#059669", bg: "rgba(5,150,105,0.1)",    border: "rgba(5,150,105,0.2)" },
  { value: "rejected",  label: "Rejeté",     color: "#dc2626", bg: "rgba(220,38,38,0.1)",    border: "rgba(220,38,38,0.2)" },
  { value: "planned",   label: "Prévu",      color: "#059669", bg: "rgba(5,150,105,0.1)",    border: "rgba(5,150,105,0.2)" },
  { value: "delivered", label: "Livré ✓",    color: "#b45309", bg: "rgba(180,83,9,0.1)",     border: "rgba(180,83,9,0.2)" },
];

function StatusBadge({ status }) {
  const s = STATUS_OPTIONS.find((o) => o.value === status) || STATUS_OPTIONS[0];
  return (
    <span style={{ fontSize: 10, fontWeight: 700, color: s.color, background: s.bg, border: `1px solid ${s.border}`, padding: "3px 10px", borderRadius: 999, letterSpacing: "0.06em", textTransform: "uppercase" }}>
      {s.label}
    </span>
  );
}

function Avatar({ name, photo, size = 24 }) {
  if (photo) return <img src={photo} alt={name} style={{ width: size, height: size, borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />;
  const initials = (name || "?").split(" ").map((w) => w[0]).join("").slice(0, 2).toUpperCase();
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.2)", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: size * 0.38, fontWeight: 700, color: "#059669" }}>
      {initials}
    </div>
  );
}

// Modal liste des votants
function VotersModal({ suggestion, onClose }) {
  if (!suggestion) return null;
  const voters = suggestion.voters || [];

  return (
    <div style={{ position: "fixed", inset: 0, zIndex: 1000, display: "flex", alignItems: "center", justifyContent: "center", padding: 20 }}
      onClick={onClose}
    >
      <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.4)", backdropFilter: "blur(4px)" }} />
      <div style={{ position: "relative", background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: 18, padding: 28, width: "100%", maxWidth: 420, maxHeight: "80vh", display: "flex", flexDirection: "column" }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 20 }}>
          <div>
            <h3 style={{ fontSize: 15, fontWeight: 700, color: "#171717", margin: "0 0 4px", letterSpacing: "-0.02em" }}>
              {voters.length} vote{voters.length !== 1 ? "s" : ""}
            </h3>
            <p style={{ fontSize: 12, color: "#737373", margin: 0 }}>{suggestion.title}</p>
          </div>
          <button onClick={onClose} style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e5e5", background: "#f5f5f5", color: "#737373", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <X size={14} />
          </button>
        </div>

        {/* Liste votants */}
        <div style={{ overflowY: "auto", flex: 1 }}>
          {voters.length === 0 ? (
            <p style={{ fontSize: 13, color: "#737373", textAlign: "center", padding: "30px 0" }}>Aucun vote pour l'instant.</p>
          ) : (
            <div style={{ display: "flex", flexDirection: "column", gap: 6 }}>
              {voters.map((v, i) => {
                const name = v.displayName || v.name || `${v.firstName || ""} ${v.lastName || ""}`.trim() || "Anonyme";
                return (
                  <div key={v._id || i} style={{ display: "flex", alignItems: "center", gap: 10, padding: "8px 12px", borderRadius: 10, background: "#fafafa", border: "1px solid #e5e5e5" }}>
                    <Avatar name={name} photo={v.photo || v.avatar} size={30} />
                    <span style={{ fontSize: 13, fontWeight: 500, color: "#404040" }}>{name}</span>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function AdminSuggestionsPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [filter, setFilter] = useState("pending");
  const [sort, setSort] = useState("votes");
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(null);
  const [votersModal, setVotersModal] = useState(null); // suggestion sélectionnée

  useEffect(() => { fetchSuggestions(); }, [filter, sort]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/suggestions?status=${filter}&sort=${sort}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setSuggestions(data.suggestions);
    } finally { setLoading(false); }
  };

  const updateStatus = async (id, status) => {
    setUpdating(id);
    try {
      const res = await fetch(`/api/admin/suggestions/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ status }),
      });
      const data = await res.json();
      if (data.success) setSuggestions((prev) => prev.filter((s) => s._id !== id));
    } finally { setUpdating(null); }
  };

  const deleteSuggestion = async (id) => {
    if (!confirm("Supprimer cette suggestion ?")) return;
    try {
      await fetch(`/api/admin/suggestions/${id}`, { method: "DELETE", credentials: "include" });
      setSuggestions((prev) => prev.filter((s) => s._id !== id));
    } catch {}
  };

  return (
    <div style={{ minHeight: "100vh", background: "#fafafa", padding: "32px 24px", fontFamily: "-apple-system,'Helvetica Neue',sans-serif" }}>
      <div style={{ maxWidth: 900, margin: "0 auto" }}>

        {/* Header */}
        <div style={{ display: "flex", alignItems: "center", gap: 12, marginBottom: 28 }}>
          <div style={{ width: 40, height: 40, borderRadius: 10, background: "rgba(5,150,105,0.1)", border: "1px solid rgba(5,150,105,0.2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
            <Lightbulb size={18} color="#059669" />
          </div>
          <div>
            <h1 style={{ fontSize: 20, fontWeight: 700, color: "#171717", margin: 0, letterSpacing: "-0.02em" }}>Suggestions</h1>
            <p style={{ fontSize: 12, color: "#737373", margin: 0 }}>{suggestions.length} résultat{suggestions.length !== 1 ? "s" : ""}</p>
          </div>
        </div>

        {/* Filtres status + tri */}
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", gap: 12, marginBottom: 20, flexWrap: "wrap" }}>
          {/* Status */}
          <div style={{ display: "flex", gap: 5, flexWrap: "wrap" }}>
            {[{ value: "all", label: "Toutes" }, ...STATUS_OPTIONS].map((opt) => (
              <button key={opt.value} onClick={() => setFilter(opt.value)} style={{
                padding: "5px 13px", borderRadius: 999,
                border: `1px solid ${filter === opt.value ? "rgba(5,150,105,0.4)" : "#e5e5e5"}`,
                background: filter === opt.value ? "rgba(5,150,105,0.1)" : "transparent",
                color: filter === opt.value ? "#059669" : "#737373",
                fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s",
              }}>
                {opt.label || "Toutes"}
              </button>
            ))}
          </div>

          {/* Tri */}
          <div style={{ display: "flex", gap: 5 }}>
            <button onClick={() => setSort("votes")} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 13px", borderRadius: 999,
              border: `1px solid ${sort === "votes" ? "rgba(5,150,105,0.4)" : "#e5e5e5"}`,
              background: sort === "votes" ? "rgba(5,150,105,0.1)" : "transparent",
              color: sort === "votes" ? "#059669" : "#737373",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              <TrendingUp size={11} /> Populaires
            </button>
            <button onClick={() => setSort("recent")} style={{
              display: "flex", alignItems: "center", gap: 5, padding: "5px 13px", borderRadius: 999,
              border: `1px solid ${sort === "recent" ? "rgba(5,150,105,0.4)" : "#e5e5e5"}`,
              background: sort === "recent" ? "rgba(5,150,105,0.1)" : "transparent",
              color: sort === "recent" ? "#059669" : "#737373",
              fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit",
            }}>
              <Clock size={11} /> Récentes
            </button>
          </div>
        </div>

        <div style={{ height: 1, background: "#e5e5e5", marginBottom: 16 }} />

        {/* Liste */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {[1,2,3].map((i) => <div key={i} style={{ height: 80, borderRadius: 12, background: "#f5f5f5", animation: "pulse 1.4s ease infinite" }} />)}
          </div>
        ) : suggestions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <p style={{ fontSize: 14, color: "#737373" }}>Aucune suggestion dans cette catégorie.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 8 }}>
            {suggestions.map((s) => (
              <div key={s._id}
                style={{ background: "#ffffff", border: "1px solid #e5e5e5", borderRadius: 14, padding: "16px 18px", display: "flex", gap: 14, alignItems: "flex-start", transition: "border-color .15s" }}
                onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(5,150,105,0.4)"}
                onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e5e5e5"}
              >
                {/* Votes — cliquable pour voir qui a voté */}
                <button
                  onClick={() => setVotersModal(s)}
                  title="Voir qui a voté"
                  style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: 2, padding: "8px 10px", borderRadius: 10, background: "#fafafa", border: "1px solid #e5e5e5", flexShrink: 0, minWidth: 44, cursor: "pointer", transition: "border-color .15s" }}
                  onMouseEnter={(e) => e.currentTarget.style.borderColor = "rgba(5,150,105,0.4)"}
                  onMouseLeave={(e) => e.currentTarget.style.borderColor = "#e5e5e5"}
                >
                  <ArrowUp size={12} color="#059669" />
                  <span style={{ fontSize: 13, fontWeight: 800, color: "#059669" }}>{s.votesCount || 0}</span>
                  <Users size={9} color="#737373" />
                </button>

                {/* Contenu */}
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 5, flexWrap: "wrap" }}>
                    <StatusBadge status={s.status} />
                    <span style={{ fontSize: 11, color: "#737373" }}>{s.isPublic ? s.userSnapshot?.name : "Anonyme"}</span>
                    <span style={{ fontSize: 11, color: "#a3a3a3" }}>·</span>
                    <span style={{ fontSize: 11, color: "#a3a3a3" }}>{new Date(s.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" })}</span>
                  </div>
                  <h3 style={{ fontSize: 14, fontWeight: 600, color: "#171717", margin: "0 0 4px", letterSpacing: "-0.01em" }}>{s.title}</h3>
                  <p style={{ fontSize: 12, color: "#737373", margin: 0, lineHeight: 1.55 }}>{s.description}</p>
                </div>

                {/* Actions */}
                <div style={{ display: "flex", gap: 5, flexShrink: 0 }}>
                  {s.status === "pending" && (
                    <>
                      <button onClick={() => updateStatus(s._id, "approved")} disabled={updating === s._id} title="Approuver"
                        style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(5,150,105,0.2)", background: "rgba(5,150,105,0.1)", color: "#059669", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <Check size={13} />
                      </button>
                      <button onClick={() => updateStatus(s._id, "rejected")} disabled={updating === s._id} title="Rejeter"
                        style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(220,38,38,0.2)", background: "rgba(220,38,38,0.1)", color: "#dc2626", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        <X size={13} />
                      </button>
                    </>
                  )}
                  {s.status === "approved" && (
                    <button onClick={() => updateStatus(s._id, "planned")} disabled={updating === s._id} title="Marquer Prévu"
                      style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(5,150,105,0.2)", background: "rgba(5,150,105,0.1)", color: "#059669", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Clock size={13} />
                    </button>
                  )}
                  {s.status === "planned" && (
                    <button onClick={() => updateStatus(s._id, "delivered")} disabled={updating === s._id} title="Marquer Livré"
                      style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid rgba(180,83,9,0.2)", background: "rgba(180,83,9,0.1)", color: "#b45309", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center" }}>
                      <Rocket size={13} />
                    </button>
                  )}
                  <button onClick={() => deleteSuggestion(s._id)} title="Supprimer"
                    style={{ width: 30, height: 30, borderRadius: 8, border: "1px solid #e5e5e5", background: "transparent", color: "#a3a3a3", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", transition: "color .12s" }}
                    onMouseEnter={(e) => e.currentTarget.style.color = "#dc2626"}
                    onMouseLeave={(e) => e.currentTarget.style.color = "#a3a3a3"}
                  >
                    <X size={13} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Modal votants */}
      {votersModal && <VotersModal suggestion={votersModal} onClose={() => setVotersModal(null)} />}

      <style>{`@keyframes pulse { 0%,100%{opacity:1} 50%{opacity:.4} }`}</style>
    </div>
  );
}
