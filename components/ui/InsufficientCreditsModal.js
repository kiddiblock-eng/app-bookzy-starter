"use client";

import { useRouter } from "next/navigation";
import { CreditCard, X, ArrowRight, AlertCircle } from "lucide-react";

const ACTION_LABELS = {
  ebook_generate: { label: "Générer un ebook complet", cost: 20, description: "L'IA rédige et met en page votre ebook en 60 secondes" },
  express_layout: { label: "Mise en page Pro",         cost: 10, description: "Transformez votre brouillon Word en ebook designé" },
  smart_shop:     { label: "Publier votre boutique",   cost:  5, description: "Activez votre boutique Smart Shop en ligne" },
};

export default function InsufficientCreditsModal({ open, onClose, action, balance }) {
  const router = useRouter();

  if (!open) return null;

  const info = ACTION_LABELS[action?.action] ?? {
    label: "cette action",
    cost: action?.cost ?? 0,
    description: "",
  };

  const missing = Math.max(0, info.cost - (balance ?? 0));

  return (
    <>
      {/* Overlay */}
      <div
        onClick={onClose}
        style={{
          position: "fixed", inset: 0, zIndex: 9998,
          background: "rgba(15,23,42,0.5)",
          backdropFilter: "blur(4px)",
          animation: "fadeIn .15s ease",
        }}
      />

      {/* Modal */}
      <div style={{
        position: "fixed", inset: 0, zIndex: 9999,
        display: "flex", alignItems: "center", justifyContent: "center",
        padding: "20px",
        pointerEvents: "none",
      }}>
        <div style={{
          background: "#fff",
          borderRadius: 20,
          width: "100%",
          maxWidth: 420,
          boxShadow: "0 24px 60px rgba(0,0,0,0.2)",
          pointerEvents: "auto",
          animation: "slideUp .2s ease",
          overflow: "hidden",
        }}>

          {/* Header coloré */}
          <div style={{
            background: "linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)",
            padding: "28px 28px 24px",
            position: "relative",
          }}>
            <button
              onClick={onClose}
              style={{
                position: "absolute", top: 14, right: 14,
                width: 28, height: 28, borderRadius: "50%",
                background: "rgba(255,255,255,0.1)", border: "none",
                display: "flex", alignItems: "center", justifyContent: "center",
                cursor: "pointer", color: "rgba(255,255,255,0.7)",
              }}
            >
              <X size={14} />
            </button>

            {/* Icône */}
            <div style={{
              width: 48, height: 48, borderRadius: 14,
              background: "rgba(255,255,255,0.1)",
              display: "flex", alignItems: "center", justifyContent: "center",
              marginBottom: 14,
            }}>
              <CreditCard size={24} color="#93c5fd" />
            </div>

            <h2 style={{ color: "#fff", fontSize: 18, fontWeight: 700, margin: "0 0 6px", lineHeight: 1.3 }}>
              Crédits insuffisants
            </h2>
            <p style={{ color: "rgba(255,255,255,0.6)", fontSize: 13, margin: 0 }}>
              Il vous manque <strong style={{ color: "#93c5fd" }}>{missing} crédit{missing > 1 ? "s" : ""}</strong> pour {info.label.toLowerCase()}.
            </p>
          </div>

          {/* Corps */}
          <div style={{ padding: "22px 28px" }}>

            {/* Infos coût */}
            <div style={{
              background: "#f8fafc",
              border: "1px solid #e2e8f0",
              borderRadius: 12,
              padding: "14px 16px",
              marginBottom: 20,
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              gap: 12,
            }}>
              <div>
                <p style={{ fontSize: 13, fontWeight: 600, color: "#1e293b", margin: "0 0 2px" }}>
                  {info.label}
                </p>
                {info.description && (
                  <p style={{ fontSize: 11, color: "#94a3b8", margin: 0 }}>{info.description}</p>
                )}
              </div>
              <div style={{ textAlign: "right", flexShrink: 0 }}>
                <div style={{ fontSize: 18, fontWeight: 800, color: "#0f172a", lineHeight: 1 }}>
                  {info.cost}
                </div>
                <div style={{ fontSize: 10, color: "#94a3b8", fontWeight: 500 }}>crédits</div>
              </div>
            </div>

            {/* Solde actuel */}
            <div style={{
              display: "flex", alignItems: "center", gap: 8,
              padding: "10px 14px",
              background: "#fef2f2",
              border: "1px solid #fecaca",
              borderRadius: 10,
              marginBottom: 22,
            }}>
              <AlertCircle size={15} color="#ef4444" style={{ flexShrink: 0 }} />
              <p style={{ fontSize: 12, color: "#b91c1c", margin: 0 }}>
                Votre solde actuel : <strong>{balance ?? 0} crédit{(balance ?? 0) > 1 ? "s" : ""}</strong>
              </p>
            </div>

            {/* CTA */}
            <button
              onClick={() => { onClose(); router.push("/dashboard/tarifs"); }}
              style={{
                width: "100%", padding: "13px 0",
                background: "#2563eb", color: "#fff",
                border: "none", borderRadius: 12,
                fontSize: 14, fontWeight: 700,
                display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
                cursor: "pointer",
                marginBottom: 10,
              }}
            >
              Acheter des crédits
              <ArrowRight size={16} />
            </button>

            <button
              onClick={onClose}
              style={{
                width: "100%", padding: "11px 0",
                background: "transparent", color: "#64748b",
                border: "1px solid #e2e8f0", borderRadius: 12,
                fontSize: 13, fontWeight: 500,
                cursor: "pointer",
              }}
            >
              Annuler
            </button>
          </div>
        </div>
      </div>

      <style>{`
        @keyframes fadeIn  { from { opacity: 0 } to { opacity: 1 } }
        @keyframes slideUp { from { opacity: 0; transform: translateY(20px) } to { opacity: 1; transform: translateY(0) } }
      `}</style>
    </>
  );
}