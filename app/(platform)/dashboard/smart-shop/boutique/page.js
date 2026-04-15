"use client";

import { useRouter } from "next/navigation";
import { ExternalLink, ArrowLeft } from "lucide-react";

export default function SmartShopMigrationPage() {
  const router = useRouter();

  return (
    <div style={{ minHeight: "100vh", background: "#f8fafc", display: "flex", alignItems: "center", justifyContent: "center", padding: "20px" }}>
      <div style={{ background: "white", borderRadius: "20px", border: "1px solid #e2e8f0", padding: "48px 40px", maxWidth: "480px", width: "100%", textAlign: "center" }}>

        {/* Logo Bookzy */}
        <div style={{ width: "52px", height: "52px", background: "#0f172a", borderRadius: "14px", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 24px" }}>
          <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/>
            <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/>
          </svg>
        </div>

        <h1 style={{ fontSize: "22px", fontWeight: "900", color: "#0f172a", margin: "0 0 12px", lineHeight: "1.3" }}>
          Smart Shop a migré vers Taliopay
        </h1>

        <p style={{ fontSize: "14px", color: "#64748b", margin: "0 0 32px", lineHeight: "1.7" }}>
          Nous avons conclu une collaboration officielle avec Taliopay pour t'offrir une meilleure expérience de vente. Boutique en ligne, encaissement Mobile Money, livraison automatique, tout est inclus.
        </p>

        <a
          href="https://taliopay.com"
          target="_blank"
          rel="noopener noreferrer"
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "14px", background: "#6366f1", color: "white", borderRadius: "12px", fontSize: "14px", fontWeight: "700", textDecoration: "none", marginBottom: "12px" }}>
          Créer ma boutique sur Taliopay
          <ExternalLink size={14} />
        </a>

        <button
          onClick={() => router.push("/dashboard")}
          style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", width: "100%", padding: "12px", background: "transparent", color: "#64748b", borderRadius: "12px", fontSize: "13px", fontWeight: "600", border: "1px solid #e2e8f0", cursor: "pointer" }}>
          <ArrowLeft size={13} />
          Retour au tableau de bord
        </button>

      </div>
    </div>
  );
}