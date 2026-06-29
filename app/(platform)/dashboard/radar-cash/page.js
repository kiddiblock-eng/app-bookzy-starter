"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import {
  Search, Lock, Clock, ExternalLink, RefreshCw,
  X, ChevronRight, Loader2, Radio, TrendingUp,
  Film, Image, AlignLeft, Filter, DollarSign, ShoppingBag,
} from "lucide-react";

const COUNTRY_GROUPS = [
  { label: "Tous", items: [{ code: "ALL", label: "Tous les pays", flag: "🌍" }] },
  { label: "Afrique francophone", items: [
    { code: "CI", label: "Côte d'Ivoire", flag: "🇨🇮" },
    { code: "SN", label: "Sénégal", flag: "🇸🇳" },
    { code: "CM", label: "Cameroun", flag: "🇨🇲" },
    { code: "BJ", label: "Bénin", flag: "🇧🇯" },
    { code: "ML", label: "Mali", flag: "🇲🇱" },
    { code: "TG", label: "Togo", flag: "🇹🇬" },
    { code: "BF", label: "Burkina Faso", flag: "🇧🇫" },
    { code: "NE", label: "Niger", flag: "🇳🇪" },
    { code: "GN", label: "Guinée", flag: "🇬🇳" },
    { code: "CD", label: "RD Congo", flag: "🇨🇩" },
    { code: "CG", label: "Congo", flag: "🇨🇬" },
    { code: "GA", label: "Gabon", flag: "🇬🇦" },
    { code: "MG", label: "Madagascar", flag: "🇲🇬" },
    { code: "TD", label: "Tchad", flag: "🇹🇩" },
    { code: "RW", label: "Rwanda", flag: "🇷🇼" },
    { code: "MU", label: "Maurice", flag: "🇲🇺" },
  ]},
  { label: "Afrique (autres)", items: [
    { code: "GH", label: "Ghana", flag: "🇬🇭" },
    { code: "NG", label: "Nigeria", flag: "🇳🇬" },
    { code: "MA", label: "Maroc", flag: "🇲🇦" },
    { code: "DZ", label: "Algérie", flag: "🇩🇿" },
    { code: "TN", label: "Tunisie", flag: "🇹🇳" },
    { code: "EG", label: "Égypte", flag: "🇪🇬" },
    { code: "ZA", label: "Afrique du Sud", flag: "🇿🇦" },
    { code: "KE", label: "Kenya", flag: "🇰🇪" },
  ]},
  { label: "Europe", items: [
    { code: "FR", label: "France", flag: "🇫🇷" },
    { code: "BE", label: "Belgique", flag: "🇧🇪" },
    { code: "CH", label: "Suisse", flag: "🇨🇭" },
    { code: "LU", label: "Luxembourg", flag: "🇱🇺" },
    { code: "DE", label: "Allemagne", flag: "🇩🇪" },
    { code: "GB", label: "Royaume-Uni", flag: "🇬🇧" },
    { code: "ES", label: "Espagne", flag: "🇪🇸" },
    { code: "IT", label: "Italie", flag: "🇮🇹" },
    { code: "PT", label: "Portugal", flag: "🇵🇹" },
    { code: "NL", label: "Pays-Bas", flag: "🇳🇱" },
    { code: "SE", label: "Suède", flag: "🇸🇪" },
    { code: "PL", label: "Pologne", flag: "🇵🇱" },
  ]},
  { label: "Autres", items: [
    { code: "CA", label: "Canada", flag: "🇨🇦" },
    { code: "US", label: "États-Unis", flag: "🇺🇸" },
  ]},
];

const MEDIA_TYPES = [
  { code: "ALL", label: "Tous", icon: Filter },
  { code: "IMAGE", label: "Images", icon: Image },
  { code: "VIDEO", label: "Vidéos", icon: Film },
  { code: "MEME", label: "Texte", icon: AlignLeft },
];

const DURATIONS = [
  { code: "ALL", label: "Toutes" },
  { code: "7", label: "+7j" },
  { code: "30", label: "+30j" },
  { code: "60", label: "+60j" },
  { code: "90", label: "+90j" },
];

const TICKER = [
  "🇨🇮 245 pubs actives sur «Formation en ligne» en Côte d'Ivoire",
  "🇸🇳 «Freelance Digital» en hausse de 180% au Sénégal",
  "🇨🇲 Forte demande sur «Visa Canada» au Cameroun",
  "🇧🇯 «Dropshipping» — 89 annonceurs actifs au Bénin",
  "🇲🇱 «Business en ligne» cartonne sur Instagram",
];

export default function RadarCashPage() {
  const router = useRouter();
  const [query, setQuery] = useState("");
  const [country, setCountry] = useState("CI");
  const [mediaType, setMediaType] = useState("ALL");
  const [minDays, setMinDays] = useState("ALL");
  const [ads, setAds] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingMore, setLoadingMore] = useState(false);
  const [totalCount, setTotalCount] = useState(0);
  const [nextCursor, setNextCursor] = useState(null);
  const [isPremium, setIsPremium] = useState(false);
  const [tickerIdx, setTickerIdx] = useState(0);
  const [error, setError] = useState("");
  const [showFilters, setShowFilters] = useState(false);

  const [modalAd, setModalAd] = useState(null);
  const [modalLoading, setModalLoading] = useState(false);
  const [modalResult, setModalResult] = useState(null);

  useEffect(() => {
    const i = setInterval(() => setTickerIdx(x => (x + 1) % TICKER.length), 3500);
    return () => clearInterval(i);
  }, []);

  const fetchedRef = useRef(false);
  useEffect(() => {
    if (fetchedRef.current) return;
    fetchedRef.current = true;
    fetchAds();
  }, []);

  const fetchAds = async (loadMore = false) => {
    if (loadMore) setLoadingMore(true);
    else { setLoading(true); setAds([]); }
    setError("");
    try {
      const params = new URLSearchParams({ q: query, country, media_type: mediaType });
      if (loadMore && nextCursor) params.set("cursor", nextCursor);
      const res = await fetch(`/api/radar-cash/search?${params}`, { credentials: "include" });
      const data = await res.json();
      if (!data.success) throw new Error(data.message);

      const filtered = minDays === "ALL"
        ? data.data.ads
        : data.data.ads.filter(ad => ad.daysRunning && ad.daysRunning >= parseInt(minDays));

      const sorted = [...filtered].sort((a, b) => {
        if (b.potential !== a.potential) return b.potential - a.potential;
        return (b.daysRunning || 0) - (a.daysRunning || 0);
      });

      setAds(prev => loadMore ? [...prev, ...sorted] : sorted);
      setTotalCount(data.data.totalCount);
      setNextCursor(data.data.nextCursor);
      setIsPremium(data.data.isPremium);
    } catch (e) { setError(e.message); }
    finally { setLoading(false); setLoadingMore(false); }
  };

  const openModal = async (ad) => {
    setModalAd(ad);
    setModalResult(null);
    setModalLoading(true);
    try {
      const res = await fetch("/api/radar-cash/transform", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ subject: ad.title || ad.bodyText?.substring(0, 100), pageName: ad.pageName, bodyText: ad.bodyText }),
      });
      const data = await res.json();
      if (data?.locked) { window.location.href = data.redirectTo || "/dashboard/tarifs"; return; }
      if (data.success) setModalResult(data.data);
    } catch (e) { console.error(e); }
    finally { setModalLoading(false); }
  };

  const handleContinue = () => {
    if (!modalResult) return;
    router.push(`/dashboard/projets/nouveau?suggestion=${encodeURIComponent(modalResult.titre)}&description=${encodeURIComponent(modalResult.description)}`);
  };

  const potInfo = (p) => {
    if (p >= 3) return { label: "Très élevé", color: "#dc2626", flame: "🔥🔥🔥" };
    if (p >= 2) return { label: "Élevé", color: "#d97706", flame: "🔥🔥" };
    return { label: "Moyen", color: "#16a34a", flame: "🔥" };
  };

  const FilterPanel = ({ mobile = false }) => (
    <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
      <div>
        <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "6px" }}>PAYS</p>
        <select value={country} onChange={e => setCountry(e.target.value)} size={8}
          style={{ width: "100%", height: "180px", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", color: "#0f172a", background: "white", cursor: "pointer", outline: "none", overflowY: "auto" }}>
          {COUNTRY_GROUPS.map(group => (
            <optgroup key={group.label} label={group.label}>
              {group.items.map(c => (
                <option key={c.code} value={c.code}>{c.flag} {c.label}</option>
              ))}
            </optgroup>
          ))}
        </select>
      </div>

      <div>
        <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "6px" }}>TYPE DE CRÉATIF</p>
        <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
          {MEDIA_TYPES.map(m => (
            <button key={m.code} onClick={() => setMediaType(m.code)}
              style={{ display: "flex", alignItems: "center", gap: "8px", padding: "6px 8px", borderRadius: "7px", border: "none", cursor: "pointer", background: mediaType === m.code ? "#eff6ff" : "transparent", color: mediaType === m.code ? "#1d4ed8" : "#475569", fontSize: "12px", fontWeight: mediaType === m.code ? "600" : "400", textAlign: "left", width: "100%" }}>
              <m.icon size={12} /><span>{m.label}</span>
            </button>
          ))}
        </div>
      </div>

      <div>
        <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "6px" }}>DURÉE ACTIVE</p>
        <div style={{ display: "flex", flexWrap: "wrap", gap: "4px" }}>
          {DURATIONS.map(d => (
            <button key={d.code} onClick={() => setMinDays(d.code)}
              style={{ padding: "4px 10px", borderRadius: "6px", border: "1px solid", cursor: "pointer", fontSize: "12px", fontWeight: "500", background: minDays === d.code ? "#0f172a" : "white", color: minDays === d.code ? "white" : "#475569", borderColor: minDays === d.code ? "#0f172a" : "#e2e8f0" }}>
              {d.label}
            </button>
          ))}
        </div>
      </div>

      <button onClick={() => { if (!isPremium) { router.push("/dashboard/tarifs"); return; } fetchAds(); if (mobile) setShowFilters(false); }}
        style={{ width: "100%", padding: "9px", background: "#0f172a", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "6px" }}>
        <Search size={13} />{isPremium ? "Lancer l'analyse" : "🔒 Solo requis"}
      </button>
    </div>
  );

  return (
    <div style={{ display: "flex", flexDirection: "column", height: "calc(100vh - 56px)", overflow: "hidden", background: "#f1f5f9" }}>

      {/* HEADER */}
      <div style={{ background: "white", borderBottom: "1px solid #e2e8f0", padding: "14px 20px 0", flexShrink: 0 }}>
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "12px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <Radio size={18} color="#6366f1" />
            <div>
              <h1 style={{ fontSize: "16px", fontWeight: "800", color: "#0f172a", margin: 0 }}>Radar Cash</h1>
              <p style={{ fontSize: "11px", color: "#94a3b8", margin: 0 }}>Repérez ce qui marche et transformez-le en ebook qui se vend.</p>
            </div>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            {totalCount > 0 && (
              <div style={{ background: "#f0fdf4", border: "1px solid #bbf7d0", borderRadius: "20px", padding: "3px 10px", display: "flex", alignItems: "center", gap: "5px" }}>
                <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e" }} />
                <span style={{ fontSize: "11px", fontWeight: "600", color: "#16a34a" }}>+50 000 opportunités</span>
              </div>
            )}
            <button onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden"
              style={{ padding: "6px 10px", background: "#f8fafc", border: "1px solid #e2e8f0", borderRadius: "8px", fontSize: "12px", fontWeight: "600", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
              <Filter size={13} />Filtres
            </button>
          </div>
        </div>

        <div style={{ display: "flex", gap: "8px", marginBottom: "0" }}>
          <div style={{ flex: 1, position: "relative" }}>
            <Search size={15} style={{ position: "absolute", left: "12px", top: "50%", transform: "translateY(-50%)", color: "#94a3b8" }} />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchAds()}
              placeholder="Ex: formation, visa, coaching, agriculture..."
              style={{ width: "100%", paddingLeft: "38px", paddingRight: "12px", height: "40px", border: "1.5px solid #e2e8f0", borderRadius: "9px", fontSize: "13px", color: "#0f172a", outline: "none", boxSizing: "border-box", background: "#f8fafc" }} />
          </div>
          <button onClick={() => { if (!isPremium) { router.push("/dashboard/tarifs"); return; } fetchAds(); }} disabled={loading}
            style={{ height: "40px", padding: "0 16px", background: "#0f172a", color: "white", border: "none", borderRadius: "9px", fontSize: "13px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "5px", opacity: loading ? 0.7 : 1, whiteSpace: "nowrap" }}>
            {loading ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <Search size={13} />}
            {isPremium ? "Analyser" : "🔒 Analyser"}
          </button>
        </div>

        <div style={{ padding: "8px 0", display: "flex", alignItems: "center", gap: "8px" }}>
          <div style={{ width: "5px", height: "5px", borderRadius: "50%", background: "#22c55e", flexShrink: 0 }} />
          <span style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", flexShrink: 0 }}>LIVE</span>
          <p style={{ fontSize: "11px", color: "#64748b", margin: 0, overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{TICKER[tickerIdx]}</p>
        </div>
      </div>

      {/* FILTRES MOBILE */}
      {showFilters && (
        <div style={{ position: "fixed", inset: 0, zIndex: 50, display: "flex" }} className="lg:hidden">
          <div style={{ position: "absolute", inset: 0, background: "rgba(0,0,0,0.3)" }} onClick={() => setShowFilters(false)} />
          <div style={{ position: "relative", width: "280px", height: "100%", background: "white", padding: "20px 16px", overflowY: "auto", zIndex: 1 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
              <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Filtres</p>
              <button onClick={() => setShowFilters(false)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={18} /></button>
            </div>
            <FilterPanel mobile />
          </div>
        </div>
      )}

      {/* LAYOUT */}
      <div style={{ display: "flex", flex: 1, overflow: "hidden" }}>

        <aside style={{ width: "200px", flexShrink: 0, background: "white", borderRight: "1px solid #e2e8f0", padding: "16px 12px", overflowY: "auto" }} className="hidden lg:block">
          <FilterPanel />
        </aside>

        <div style={{ flex: 1, overflowY: "auto", padding: "14px", minWidth: 0 }}>

          {/* BANDEAU PAYWALL */}
          {!isPremium && !loading && ads.length > 0 && (
            <div style={{ background: "#0f172a", borderRadius: "10px", padding: "12px 16px", marginBottom: "14px", display: "flex", alignItems: "center", justifyContent: "space-between", gap: "10px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "8px", minWidth: 0 }}>
                <Lock size={14} color="#6366f1" style={{ flexShrink: 0 }} />
                <p style={{ fontSize: "13px", color: "white", margin: 0, lineHeight: "1.4" }}>
                  Accédez aux idées qui génèrent de l'argent en ce moment sur les réseaux
                </p>
              </div>
              <button onClick={() => router.push("/dashboard/tarifs")}
                style={{ padding: "7px 14px", background: "#6366f1", color: "white", border: "none", borderRadius: "8px", fontSize: "12px", fontWeight: "700", cursor: "pointer", flexShrink: 0, whiteSpace: "nowrap" }}>
                Débloquer
              </button>
            </div>
          )}

          {error && <div style={{ background: "#fef2f2", border: "1px solid #fecaca", borderRadius: "8px", padding: "10px 14px", marginBottom: "12px", color: "#dc2626", fontSize: "12px" }}>{error}</div>}

          {loading && (
            <div style={{ display: "flex", flexDirection: "column", alignItems: "center", padding: "60px 0", gap: "12px" }}>
              <Loader2 size={28} color="#6366f1" style={{ animation: "spin 1s linear infinite" }} />
              <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Scan des pubs Facebook...</p>
            </div>
          )}

          {!loading && ads.length > 0 && (
            <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))", gap: "10px" }}>
              {ads.map((ad, idx) => {
                const isBlurred = !isPremium && idx >= 2;
                const pot = potInfo(ad.potential);
                return (
                  <div key={ad.id || idx}
                    style={{ background: "white", borderRadius: "10px", border: "1px solid #e8edf2", overflow: "hidden", transition: "box-shadow 0.15s" }}
                    onMouseEnter={e => e.currentTarget.style.boxShadow = "0 2px 12px rgba(0,0,0,0.07)"}
                    onMouseLeave={e => e.currentTarget.style.boxShadow = "none"}>

                    <div style={{ position: "relative", height: "130px", background: "#f1f5f9", overflow: "hidden" }}>
                      {ad.imageUrl ? (
                        <img src={ad.imageUrl} alt="" style={{ width: "100%", height: "100%", objectFit: "cover", filter: isBlurred ? "blur(10px) brightness(0.6)" : "none", transform: isBlurred ? "scale(1.08)" : "scale(1)" }} />
                      ) : (
                        <div style={{ width: "100%", height: "100%", display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <TrendingUp size={24} color="#cbd5e1" />
                        </div>
                      )}
                      {ad.daysRunning && (
                        <span style={{ position: "absolute", top: "7px", left: "7px", background: "rgba(0,0,0,0.72)", borderRadius: "5px", padding: "2px 6px", fontSize: "10px", fontWeight: "600", color: "white", display: "flex", alignItems: "center", gap: "3px", filter: isBlurred ? "blur(4px)" : "none" }}>
                          <Clock size={8} color="white" />{ad.daysRunning}j
                        </span>
                      )}
                      <span style={{ position: "absolute", top: "7px", right: "7px", background: "rgba(0,0,0,0.72)", borderRadius: "5px", padding: "2px 6px", fontSize: "10px", filter: isBlurred ? "blur(4px)" : "none" }}>
                        {pot.flame}
                      </span>
                      {isBlurred && (
                        <div style={{ position: "absolute", inset: 0, display: "flex", alignItems: "center", justifyContent: "center" }}>
                          <button onClick={() => router.push("/dashboard/tarifs")}
                            style={{ background: "#0f172a", color: "white", border: "none", borderRadius: "8px", padding: "7px 12px", fontSize: "11px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", gap: "4px" }}>
                            <Lock size={11} />Débloquer
                          </button>
                        </div>
                      )}
                    </div>

                    <div style={{ padding: "10px" }}>
                      <div style={{ display: "flex", alignItems: "center", gap: "6px", marginBottom: "6px", filter: isBlurred ? "blur(5px)" : "none" }}>
                        {ad.pagePhoto
                          ? <img src={ad.pagePhoto} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover", flexShrink: 0 }} />
                          : <div style={{ width: "20px", height: "20px", borderRadius: "50%", background: "#e2e8f0", flexShrink: 0 }} />}
                        <span style={{ fontSize: "11px", fontWeight: "600", color: "#0f172a", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap", flex: 1 }}>
                          {isBlurred ? "███████████" : ad.pageName}
                        </span>
                        {ad.id && !isBlurred && (
                          <a href={`https://www.facebook.com/ads/library/?id=${ad.id}`} target="_blank" rel="noopener noreferrer" style={{ color: "#94a3b8", flexShrink: 0 }}>
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>

                      <div style={{ filter: isBlurred ? "blur(5px)" : "none", marginBottom: "8px" }}>
                        {ad.title && <p style={{ fontSize: "11px", fontWeight: "700", color: "#0f172a", margin: "0 0 3px", lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{isBlurred ? "████████████████" : ad.title}</p>}
                        {ad.bodyText && <p style={{ fontSize: "11px", color: "#64748b", margin: 0, lineHeight: "1.4", display: "-webkit-box", WebkitLineClamp: 2, WebkitBoxOrient: "vertical", overflow: "hidden" }}>{isBlurred ? "████████ ████ ████████" : ad.bodyText}</p>}
                      </div>

                      <div style={{ display: "flex", gap: "4px", marginBottom: "8px", filter: isBlurred ? "blur(4px)" : "none", flexWrap: "wrap" }}>
                        <span style={{ fontSize: "10px", fontWeight: "600", color: pot.color, background: pot.color + "15", padding: "2px 6px", borderRadius: "5px" }}>
                          {pot.label}
                        </span>
                        {ad.daysRunning >= 20 && (
                          <span style={{ fontSize: "10px", fontWeight: "600", color: "#16a34a", background: "#f0fdf4", padding: "2px 6px", borderRadius: "5px" }}>✓ Rentable</span>
                        )}
                      </div>

                      {!isBlurred ? (
                        <button onClick={() => openModal(ad)}
                          style={{ width: "100%", padding: "8px", background: "#0f172a", color: "white", border: "none", borderRadius: "7px", fontSize: "11px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                          <Search size={11} />Reproduire cette opportunité
                        </button>
                      ) : (
                        <button onClick={() => router.push("/dashboard/tarifs")}
                          style={{ width: "100%", padding: "8px", background: "#f8fafc", color: "#94a3b8", border: "1px solid #e2e8f0", borderRadius: "7px", fontSize: "11px", fontWeight: "600", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "4px" }}>
                          <Lock size={11} />Voir l'opportunité
                        </button>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}

          {nextCursor && !loading && (
            <div style={{ display: "flex", justifyContent: "center", marginTop: "16px", paddingBottom: "16px" }}>
              <button onClick={() => isPremium ? fetchAds(true) : router.push("/dashboard/tarifs")} disabled={loadingMore}
                style={{ padding: "10px 24px", background: "white", border: "1px solid #e2e8f0", borderRadius: "9px", fontSize: "13px", fontWeight: "600", color: "#475569", cursor: "pointer", display: "flex", alignItems: "center", gap: "7px", opacity: loadingMore ? 0.7 : 1 }}>
                {loadingMore ? <Loader2 size={13} style={{ animation: "spin 1s linear infinite" }} /> : <RefreshCw size={13} />}
                {loadingMore ? "Chargement..." : isPremium ? "Charger plus" : "🔒 Charger plus"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalAd && (
        <div style={{ position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", zIndex: 100, display: "flex", alignItems: "center", justifyContent: "center", padding: "16px" }}
          onClick={e => e.target === e.currentTarget && setModalAd(null)}>
          <div style={{ background: "white", borderRadius: "14px", width: "100%", maxWidth: "440px", overflow: "hidden", boxShadow: "0 20px 40px rgba(0,0,0,0.2)" }}>

            <div style={{ padding: "14px 18px", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <div>
                <p style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a", margin: 0 }}>Reproduire cette opportunité</p>
                <p style={{ fontSize: "11px", color: "#64748b", margin: 0 }}>L'IA génère une idée d'ebook sur ce sujet</p>
              </div>
              <button onClick={() => setModalAd(null)} style={{ background: "none", border: "none", cursor: "pointer", color: "#94a3b8" }}><X size={16} /></button>
            </div>

            <div style={{ padding: "10px 18px", background: "#f8fafc", borderBottom: "1px solid #f1f5f9", display: "flex", alignItems: "center", gap: "7px" }}>
              {modalAd.pagePhoto && <img src={modalAd.pagePhoto} alt="" style={{ width: "20px", height: "20px", borderRadius: "50%", objectFit: "cover" }} />}
              <p style={{ fontSize: "12px", fontWeight: "600", color: "#475569", margin: 0 }}>{modalAd.pageName}</p>
            </div>

            <div style={{ padding: "18px" }}>
              {modalLoading ? (
                <div style={{ display: "flex", flexDirection: "column", alignItems: "center", gap: "10px", padding: "20px 0" }}>
                  <Loader2 size={24} color="#6366f1" style={{ animation: "spin 1s linear infinite" }} />
                  <p style={{ fontSize: "13px", color: "#64748b", margin: 0 }}>Génération en cours...</p>
                </div>
              ) : modalResult ? (
                <div>
                  <p style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "8px" }}>IDÉE D'EBOOK</p>
                  <p style={{ fontSize: "15px", fontWeight: "700", color: "#0f172a", margin: "0 0 6px", lineHeight: "1.4" }}>{modalResult.titre}</p>
                  <p style={{ fontSize: "13px", color: "#475569", margin: "0 0 14px", lineHeight: "1.5" }}>{modalResult.description}</p>

                  {(modalResult.gainEstime || modalResult.ouVendre) && (
                    <div style={{ background: "#f8fafc", borderRadius: "8px", padding: "12px", marginBottom: "14px", display: "flex", flexDirection: "column", gap: "8px" }}>
                      {modalResult.gainEstime && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <DollarSign size={14} color="#16a34a" style={{ flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: "10px", fontWeight: "600", color: "#94a3b8", margin: 0 }}>GAIN ESTIMÉ</p>
                            <p style={{ fontSize: "13px", fontWeight: "700", color: "#0f172a", margin: 0 }}>{modalResult.gainEstime}</p>
                          </div>
                        </div>
                      )}
                      {modalResult.ouVendre && (
                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                          <ShoppingBag size={14} color="#6366f1" style={{ flexShrink: 0 }} />
                          <div>
                            <p style={{ fontSize: "10px", fontWeight: "600", color: "#94a3b8", margin: 0 }}>OÙ VENDRE</p>
                            <p style={{ fontSize: "13px", color: "#475569", margin: 0 }}>{modalResult.ouVendre}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button onClick={handleContinue}
                    style={{ width: "100%", padding: "11px", background: "#0f172a", color: "white", border: "none", borderRadius: "9px", fontSize: "14px", fontWeight: "700", cursor: "pointer", display: "flex", alignItems: "center", justifyContent: "center", gap: "7px" }}>
                    Créer cet ebook maintenant <ChevronRight size={15} />
                  </button>
                </div>
              ) : (
                <p style={{ textAlign: "center", fontSize: "13px", color: "#94a3b8", padding: "20px 0" }}>Une erreur est survenue.</p>
              )}
            </div>
          </div>
        </div>
      )}

      <style>{`@keyframes spin { to { transform: rotate(360deg); } }`}</style>
    </div>
  );
}