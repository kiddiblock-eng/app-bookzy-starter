// app/(marketing)/suggestions/page.js
"use client";

import { useState, useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowUp, Clock, TrendingUp, ArrowRight, Lightbulb, ChevronDown } from "lucide-react";
import SuggestionsNav from "./Components/SuggestionsNav";

const STATUS_CONFIG = {
  approved:  { label: "En attente", color: "#94a3b8", bg: "#f1f5f9" },
  planned:   { label: "Prévu",      color: "#2563eb", bg: "#eff6ff" },
  delivered: { label: "Livré ✓",    color: "#16a34a", bg: "#f0fdf4" },
};

function Avatar({ name, photo, size = 32 }) {
  const initials = name ? name.split(" ").map((n) => n[0]).join("").toUpperCase().slice(0, 2) : "?";
  if (photo) return (
    <div style={{ width: size, height: size, borderRadius: "50%", overflow: "hidden", flexShrink: 0, border: "2px solid #e2e8f0" }}>
      <img src={photo} alt={name} style={{ width: "100%", height: "100%", objectFit: "cover" }} />
    </div>
  );
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: "#e2e8f0", display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, fontSize: size * 0.35, fontWeight: 700, color: "#64748b" }}>
      {initials}
    </div>
  );
}

function SuggestionCard({ suggestion, userVotes, onVote, isLoggedIn }) {
  const hasVoted = userVotes.includes(suggestion._id);
  const status = STATUS_CONFIG[suggestion.status] || STATUS_CONFIG.approved;
  const displayName = suggestion.isPublic ? suggestion.userSnapshot?.name : "Anonyme";
  const displayPhoto = suggestion.isPublic ? suggestion.userSnapshot?.photo : null;
  const [bounce, setBounce] = useState(false);

  const handleVote = () => {
    if (!isLoggedIn) {
      window.location.href = "/auth/login?redirect=/suggestions";
      return;
    }
    setBounce(true);
    setTimeout(() => setBounce(false), 300);
    onVote(suggestion._id);
  };

  return (
    <div style={{ background: "#fff", border: "1px solid #E8E6E0", borderRadius: 16, padding: "16px 18px", display: "flex", gap: 14, alignItems: "center", transition: "box-shadow .2s, transform .2s" }}
      onMouseEnter={(e) => { e.currentTarget.style.boxShadow = "0 6px 24px rgba(0,0,0,0.07)"; e.currentTarget.style.transform = "translateY(-1px)"; }}
      onMouseLeave={(e) => { e.currentTarget.style.boxShadow = "none"; e.currentTarget.style.transform = "none"; }}
    >
      {/* Bouton vote texte */}
      <button
        onClick={handleVote}
        style={{
          display: "flex", flexDirection: "column", alignItems: "center", justifyContent: "center",
          gap: 3, padding: "10px 14px", borderRadius: 12,
          border: `1.5px solid ${hasVoted ? "#0D0D0D" : "#E8E6E0"}`,
          background: hasVoted ? "#0D0D0D" : "#FAFAF8",
          cursor: "pointer", flexShrink: 0, minWidth: 60,
          transition: "all .15s",
          transform: bounce ? "scale(0.88)" : "scale(1)",
          boxShadow: hasVoted ? "0 2px 12px rgba(0,0,0,0.15)" : "none",
        }}
        onMouseEnter={(e) => { if (!hasVoted) { e.currentTarget.style.borderColor = "#0D0D0D"; e.currentTarget.style.background = "#F0EFEB"; } }}
        onMouseLeave={(e) => { if (!hasVoted) { e.currentTarget.style.borderColor = "#E8E6E0"; e.currentTarget.style.background = "#FAFAF8"; } }}
      >
        <span style={{ fontSize: 13, fontWeight: 800, color: hasVoted ? "#fff" : "#111", lineHeight: 1 }}>
          {suggestion.votesCount || 0}
        </span>
        <span style={{ fontSize: 10, fontWeight: 700, color: hasVoted ? "rgba(255,255,255,0.7)" : "#9CA3AF", letterSpacing: "0.04em", textTransform: "uppercase" }}>
          {hasVoted ? "Voté ✓" : "Voter ici"}
        </span>
      </button>

      {/* Contenu */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 4, flexWrap: "wrap" }}>
          <h3 style={{ fontSize: 14, fontWeight: 700, color: "#0D0D0D", margin: 0, letterSpacing: "-0.01em" }}>{suggestion.title}</h3>
          <span style={{ fontSize: 10, fontWeight: 700, color: status.color, background: status.bg, padding: "2px 8px", borderRadius: 999, letterSpacing: "0.04em", flexShrink: 0 }}>{status.label}</span>
        </div>
        <p style={{ fontSize: 12.5, color: "#888", margin: "0 0 8px", lineHeight: 1.55, overflow: "hidden", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical" }}>{suggestion.description}</p>
        <div style={{ display: "flex", alignItems: "center", gap: 6 }}>
          <Avatar name={displayName} photo={displayPhoto} size={18} />
          <span style={{ fontSize: 11, color: "#B0AFAC", fontWeight: 500 }}>{displayName}</span>
          <span style={{ fontSize: 11, color: "#D0CFCC" }}>·</span>
          <span style={{ fontSize: 11, color: "#D0CFCC" }}>{new Date(suggestion.createdAt).toLocaleDateString("fr-FR", { day: "numeric", month: "short" })}</span>
        </div>
      </div>
    </div>
  );
}

export default function SuggestionsPublicPage() {
  const [suggestions, setSuggestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sort, setSort] = useState("votes");
  const [userVotes, setUserVotes] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [mounted, setMounted] = useState(false);
  const listRef = useRef(null);

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    if (!mounted) return;
    // Charger suggestions + votes user en parallèle
    const init = async () => {
      setLoading(true);
      try {
        const [sugRes, votesRes] = await Promise.all([
          fetch(`/api/suggestions?sort=${sort}`, { credentials: "include" }),
          fetch("/api/suggestions/my-votes", { credentials: "include" }),
        ]);
        const sugData = await sugRes.json();
        if (sugData.success) setSuggestions(sugData.suggestions);

        const votesData = await votesRes.json();
        if (votesData.isLoggedIn) {
          setIsLoggedIn(true);
          setUserVotes(votesData.votedIds || []);

          // Vote en attente après login ?
          const pendingVote = sessionStorage.getItem("pendingVote");
          if (pendingVote) {
            sessionStorage.removeItem("pendingVote");
            try {
              const vRes = await fetch(`/api/suggestions/${pendingVote}/vote`, { method: "POST", credentials: "include" });
              const vData = await vRes.json();
              if (vData.success) {
                setUserVotes((prev) => vData.voted ? [...prev, pendingVote] : prev.filter((v) => v !== pendingVote));
                setSuggestions((prev) => prev.map((s) => s._id === pendingVote ? { ...s, votesCount: vData.votesCount } : s));
              }
            } catch {}
          }
        }
      } finally { setLoading(false); }
    };
    init();
  }, [sort, mounted]);

  const fetchSuggestions = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/suggestions?sort=${sort}`, { credentials: "include" });
      const data = await res.json();
      if (data.success) setSuggestions(data.suggestions);
    } finally { setLoading(false); }
  };

  const handleVote = async (id) => {
    if (!isLoggedIn) {
      // Sauvegarder l'id à voter pour après le login
      sessionStorage.setItem("pendingVote", id);
      window.location.href = "/auth/login?redirect=/suggestions";
      return;
    }
    try {
      const res = await fetch(`/api/suggestions/${id}/vote`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (data.success) {
        setUserVotes((prev) => data.voted ? [...prev, id] : prev.filter((v) => v !== id));
        setSuggestions((prev) => prev.map((s) => s._id === id ? { ...s, votesCount: data.votesCount } : s));
      } else if (res.status === 401) {
        sessionStorage.setItem("pendingVote", id);
        window.location.href = "/auth/login?redirect=/suggestions";
      }
    } catch {}
  };

  const scrollToList = () => {
    listRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (!mounted) return null;

  return (
    <div style={{ minHeight: "100vh", background: "#F2F0EB", fontFamily: "-apple-system,'Helvetica Neue',sans-serif", overflowX: "hidden" }}>
      <SuggestionsNav />

      {/* ── HERO ── */}
      <div style={{ position: "relative", width: "100%", height: "100svh", overflow: "hidden" }}>
        {/* Images responsive via CSS inline */}
        <img
          src="/marsmobil.png"
          alt="Mars"
          fetchPriority="high"
          decoding="async"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "block" }}
          className="sp-img-mobile"
        />
        <img
          src="/marspc.png"
          alt="Mars"
          fetchPriority="high"
          decoding="async"
          style={{ position: "absolute", inset: 0, width: "100%", height: "100%", objectFit: "cover", objectPosition: "center", display: "none" }}
          className="sp-img-desktop"
        />

        {/* Overlay */}
        <div style={{ position: "absolute", inset: 0, background: "linear-gradient(to bottom, rgba(0,0,0,0.12) 0%, rgba(0,0,0,0.08) 40%, rgba(0,0,0,0.6) 100%)" }} />

        {/* Contenu hero */}
        <div style={{ position: "absolute", bottom: 0, left: 0, right: 0, padding: "40px 24px 52px", maxWidth: 900, margin: "0 auto" }} className="sp-hero-content">
          <p style={{ fontSize: 10, fontWeight: 700, letterSpacing: "0.14em", textTransform: "uppercase", color: "rgba(255,255,255,0.55)", marginBottom: 14 }}>
            Bookzy — Roadmap
          </p>
          <h1 style={{ fontSize: "clamp(30px, 6vw, 62px)", fontWeight: 800, color: "#fff", lineHeight: 1.05, letterSpacing: "-0.03em", marginBottom: 16 }}>
            Bâtissons MARS<br />ensemble.
          </h1>
          <p style={{ fontSize: "clamp(14px, 2vw, 16px)", color: "rgba(255,255,255,0.72)", lineHeight: 1.65, fontWeight: 300, maxWidth: 440, marginBottom: 32 }}>
            Soumettez vos idées. Votez pour le futur.<br />Priorisez la roadmap.
          </p>

          {/* Boutons CTA */}
          <div style={{ display: "flex", gap: 10, flexWrap: "wrap" }}>
            <Link href="/dashboard/suggestions" style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", background: "#fff", color: "#0D0D0D", borderRadius: 11, fontSize: 13, fontWeight: 700, textDecoration: "none", transition: "opacity .15s" }}>
              Proposer une idée
              <ArrowRight size={13} />
            </Link>
            <button
              onClick={scrollToList}
              style={{ display: "inline-flex", alignItems: "center", gap: 8, padding: "13px 24px", background: "rgba(255,255,255,0.14)", color: "#fff", border: "1px solid rgba(255,255,255,0.25)", borderRadius: 11, fontSize: 13, fontWeight: 600, cursor: "pointer", backdropFilter: "blur(8px)", transition: "background .15s" }}
              onMouseEnter={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.22)"}
              onMouseLeave={(e) => e.currentTarget.style.background = "rgba(255,255,255,0.14)"}
            >
              Voir les idées
              <ChevronDown size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* ── CORPS ── */}
      <div ref={listRef} style={{ maxWidth: 860, margin: "0 auto", padding: "56px 20px 80px" }} className="sp-body">

        {/* Header */}
        <div style={{ display: "flex", alignItems: "flex-end", justifyContent: "space-between", gap: 16, marginBottom: 32, flexWrap: "wrap" }}>
          <div>
            <h2 style={{ fontSize: "clamp(22px, 4vw, 30px)", fontWeight: 800, color: "#0D0D0D", letterSpacing: "-0.03em", lineHeight: 1.1, margin: 0 }}>
              Les suggestions
            </h2>
            <p style={{ fontSize: 13, color: "#B0AFAC", marginTop: 4 }}>
              {loading ? "Chargement..." : `${suggestions.length} idée${suggestions.length !== 1 ? "s" : ""} soumise${suggestions.length !== 1 ? "s" : ""}`}
            </p>
          </div>
          <div style={{ display: "flex", gap: 6 }}>
            {[
              { id: "votes", label: "Populaires", icon: <TrendingUp size={11} /> },
              { id: "recent", label: "Récents",   icon: <Clock size={11} /> },
            ].map((tab) => (
              <button key={tab.id} onClick={() => setSort(tab.id)} style={{ display: "flex", alignItems: "center", gap: 5, padding: "7px 14px", borderRadius: 999, border: `1.5px solid ${sort === tab.id ? "#0D0D0D" : "#E8E6E0"}`, background: sort === tab.id ? "#0D0D0D" : "#fff", color: sort === tab.id ? "#fff" : "#888", fontSize: 12, fontWeight: 600, cursor: "pointer", fontFamily: "inherit", transition: "all .15s" }}>
                {tab.icon}{tab.label}
              </button>
            ))}
          </div>
        </div>

        <div style={{ width: "100%", height: 1, background: "#E8E6E0", marginBottom: 28 }} />

        {/* Liste */}
        {loading ? (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {[1,2,3,4].map((i) => (
              <div key={i} style={{ background: "#fff", border: "1px solid #E8E6E0", borderRadius: 16, height: 90, animation: "sp-pulse 1.4s ease infinite" }} />
            ))}
          </div>
        ) : suggestions.length === 0 ? (
          <div style={{ textAlign: "center", padding: "64px 0" }}>
            <div style={{ width: 52, height: 52, borderRadius: 14, background: "#EDEAE3", display: "flex", alignItems: "center", justifyContent: "center", margin: "0 auto 16px" }}>
              <Lightbulb size={22} color="#B0AFAC" />
            </div>
            <p style={{ fontSize: 14, color: "#B0AFAC", lineHeight: 1.6 }}>Aucune suggestion pour l'instant.<br />Soyez le premier à proposer une idée.</p>
          </div>
        ) : (
          <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
            {suggestions.map((s) => (
              <SuggestionCard key={s._id} suggestion={s} userVotes={userVotes} onVote={handleVote} isLoggedIn={isLoggedIn} />
            ))}
          </div>
        )}

        {/* CTA bas */}
        <div style={{ marginTop: 56, background: "#0D0D0D", borderRadius: 20, padding: "36px 28px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: 20, flexWrap: "wrap" }}>
          <div>
            <h3 style={{ fontSize: "clamp(17px, 3vw, 22px)", fontWeight: 700, color: "#fff", letterSpacing: "-0.02em", marginBottom: 6 }}>Votre idée n'est pas là ?</h3>
            <p style={{ fontSize: 13, color: "rgba(255,255,255,0.38)", fontWeight: 300 }}>Soumettez-la et laissez la communauté voter.</p>
          </div>
          <Link href="/dashboard/suggestions" style={{ display: "inline-flex", alignItems: "center", gap: 7, padding: "12px 22px", background: "#fff", color: "#0D0D0D", borderRadius: 10, fontSize: 13, fontWeight: 700, textDecoration: "none", flexShrink: 0, transition: "opacity .15s" }}>
            Proposer une idée <ArrowRight size={13} />
          </Link>
        </div>
      </div>

      <style>{`
        @keyframes sp-pulse { 0%,100%{opacity:1} 50%{opacity:.4} }
        @media (min-width: 700px) {
          .sp-img-mobile { display: none !important; }
          .sp-img-desktop { display: block !important; }
          .sp-hero-content { padding: 60px 60px 72px !important; }
          .sp-body { padding: 72px 40px 100px !important; }
        }
      `}</style>
    </div>
  );
}