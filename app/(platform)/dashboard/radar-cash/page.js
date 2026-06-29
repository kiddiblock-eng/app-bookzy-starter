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
    <div className="flex flex-col gap-4">
      <div>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1.5">Pays</p>
        <select value={country} onChange={e => setCountry(e.target.value)} size={8}
          className="w-full h-44 border border-neutral-200 rounded-lg text-xs text-neutral-900 bg-white cursor-pointer outline-none focus:ring-2 focus:ring-neutral-900">
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
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1.5">Type de créatif</p>
        <div className="flex flex-col gap-0.5">
          {MEDIA_TYPES.map(m => {
            const on = mediaType === m.code;
            return (
              <button key={m.code} onClick={() => setMediaType(m.code)}
                className={`flex items-center gap-2 px-2 py-1.5 rounded-lg text-xs text-left w-full transition-colors ${on ? "bg-neutral-900 text-white font-semibold" : "text-neutral-600 hover:bg-neutral-100"}`}>
                <m.icon size={12} /><span>{m.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div>
        <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-1.5">Durée active</p>
        <div className="flex flex-wrap gap-1">
          {DURATIONS.map(d => {
            const on = minDays === d.code;
            return (
              <button key={d.code} onClick={() => setMinDays(d.code)}
                className={`px-2.5 py-1 rounded-md text-xs font-medium border transition-colors ${on ? "bg-neutral-900 text-white border-neutral-900" : "bg-white text-neutral-600 border-neutral-200 hover:border-neutral-300"}`}>
                {d.label}
              </button>
            );
          })}
        </div>
      </div>

      <button onClick={() => { if (!isPremium) { router.push("/dashboard/tarifs"); return; } fetchAds(); if (mobile) setShowFilters(false); }}
        className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-xs font-bold flex items-center justify-center gap-1.5 transition-colors">
        {isPremium ? <><Search size={13} />Lancer l'analyse</> : <><Lock size={13} />Débloquer</>}
      </button>
    </div>
  );

  return (
    <div className="flex flex-col h-[calc(100vh-56px)] overflow-hidden bg-neutral-50">

      {/* HEADER */}
      <div className="bg-white border-b border-neutral-200 px-5 pt-3.5 shrink-0">
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2.5">
            <div className="w-9 h-9 rounded-xl bg-neutral-900 flex items-center justify-center shrink-0">
              <Radio size={17} className="text-white" />
            </div>
            <div>
              <h1 className="text-base font-bold text-neutral-900 leading-tight">Radar Cash</h1>
              <p className="text-[11px] text-neutral-400 leading-tight">Repère ce qui marche et transforme-le en ebook qui se vend.</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            {totalCount > 0 && (
              <div className="hidden sm:flex items-center gap-1.5 bg-emerald-50 border border-emerald-100 rounded-full px-2.5 py-1">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                <span className="text-[11px] font-semibold text-emerald-600">+50 000 opportunités</span>
              </div>
            )}
            <button onClick={() => setShowFilters(!showFilters)}
              className="lg:hidden flex items-center gap-1 px-2.5 py-1.5 bg-neutral-100 hover:bg-neutral-200 rounded-lg text-xs font-semibold text-neutral-600 transition-colors">
              <Filter size={13} />Filtres
            </button>
          </div>
        </div>

        <div className="flex gap-2">
          <div className="flex-1 relative">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-400" />
            <input type="text" value={query} onChange={e => setQuery(e.target.value)}
              onKeyDown={e => e.key === "Enter" && fetchAds()}
              placeholder="Ex : formation, visa, coaching, agriculture…"
              className="w-full pl-10 pr-3 h-10 border border-neutral-200 rounded-xl text-[13px] text-neutral-900 placeholder:text-neutral-400 bg-neutral-50 outline-none focus:ring-2 focus:ring-neutral-900 focus:border-transparent transition-all" />
          </div>
          <button onClick={() => { if (!isPremium) { router.push("/dashboard/tarifs"); return; } fetchAds(); }} disabled={loading}
            className="h-10 px-4 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-[13px] font-bold flex items-center gap-1.5 whitespace-nowrap disabled:opacity-70 transition-colors">
            {loading ? <Loader2 size={13} className="animate-spin" /> : isPremium ? <Search size={13} /> : <Lock size={13} />}
            Analyser
          </button>
        </div>

        <div className="py-2 flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 shrink-0 animate-pulse" />
          <span className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide shrink-0">Live</span>
          <p className="text-[11px] text-neutral-500 truncate">{TICKER[tickerIdx]}</p>
        </div>
      </div>

      {/* FILTRES MOBILE */}
      {showFilters && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          <div className="absolute inset-0 bg-black/30" onClick={() => setShowFilters(false)} />
          <div className="relative w-72 h-full bg-white p-5 overflow-y-auto z-10">
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm font-bold text-neutral-900">Filtres</p>
              <button onClick={() => setShowFilters(false)} className="text-neutral-400 hover:text-neutral-700"><X size={18} /></button>
            </div>
            <FilterPanel mobile />
          </div>
        </div>
      )}

      {/* LAYOUT */}
      <div className="flex flex-1 overflow-hidden">

        <aside className="hidden lg:block w-52 shrink-0 bg-white border-r border-neutral-200 px-3 py-4 overflow-y-auto">
          <FilterPanel />
        </aside>

        <div className="flex-1 overflow-y-auto p-3.5 min-w-0">

          {/* BANDEAU PAYWALL */}
          {!isPremium && !loading && ads.length > 0 && (
            <div className="bg-neutral-900 rounded-xl px-4 py-3 mb-3.5 flex items-center justify-between gap-2.5">
              <div className="flex items-center gap-2 min-w-0">
                <Lock size={14} className="text-white shrink-0" />
                <p className="text-[13px] text-white leading-snug">Accède aux idées qui génèrent de l'argent en ce moment sur les réseaux.</p>
              </div>
              <button onClick={() => router.push("/dashboard/tarifs")}
                className="px-3.5 py-1.5 bg-white text-neutral-900 rounded-lg text-xs font-bold shrink-0 whitespace-nowrap hover:bg-neutral-100 transition-colors">
                Débloquer
              </button>
            </div>
          )}

          {error && <div className="bg-red-50 border border-red-200 rounded-lg px-4 py-2.5 mb-3 text-xs text-red-700">{error}</div>}

          {loading && (
            <div className="flex flex-col items-center py-16 gap-3">
              <Loader2 size={28} className="text-neutral-400 animate-spin" />
              <p className="text-[13px] text-neutral-500">Scan des pubs Facebook…</p>
            </div>
          )}

          {!loading && ads.length > 0 && (
            <div className="grid gap-2.5" style={{ gridTemplateColumns: "repeat(auto-fill, minmax(220px, 1fr))" }}>
              {ads.map((ad, idx) => {
                const isBlurred = !isPremium && idx >= 2;
                const pot = potInfo(ad.potential);
                return (
                  <div key={ad.id || idx} className="bg-white rounded-xl border border-neutral-200 overflow-hidden hover:shadow-md transition-shadow">

                    <div className="relative h-[130px] bg-neutral-100 overflow-hidden">
                      {ad.imageUrl ? (
                        <img src={ad.imageUrl} alt="" className="w-full h-full object-cover" style={{ filter: isBlurred ? "blur(10px) brightness(0.6)" : "none", transform: isBlurred ? "scale(1.08)" : "scale(1)" }} />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <TrendingUp size={24} className="text-neutral-300" />
                        </div>
                      )}
                      {ad.daysRunning && (
                        <span className="absolute top-1.5 left-1.5 bg-black/70 rounded px-1.5 py-0.5 text-[10px] font-semibold text-white flex items-center gap-1" style={{ filter: isBlurred ? "blur(4px)" : "none" }}>
                          <Clock size={8} className="text-white" />{ad.daysRunning}j
                        </span>
                      )}
                      <span className="absolute top-1.5 right-1.5 bg-black/70 rounded px-1.5 py-0.5 text-[10px]" style={{ filter: isBlurred ? "blur(4px)" : "none" }}>
                        {pot.flame}
                      </span>
                      {isBlurred && (
                        <div className="absolute inset-0 flex items-center justify-center">
                          <button onClick={() => router.push("/dashboard/tarifs")}
                            className="bg-neutral-900 text-white rounded-lg px-3 py-1.5 text-[11px] font-bold flex items-center gap-1">
                            <Lock size={11} />Débloquer
                          </button>
                        </div>
                      )}
                    </div>

                    <div className="p-2.5">
                      <div className="flex items-center gap-1.5 mb-1.5" style={{ filter: isBlurred ? "blur(5px)" : "none" }}>
                        {ad.pagePhoto
                          ? <img src={ad.pagePhoto} alt="" className="w-5 h-5 rounded-full object-cover shrink-0" />
                          : <div className="w-5 h-5 rounded-full bg-neutral-200 shrink-0" />}
                        <span className="text-[11px] font-semibold text-neutral-900 truncate flex-1">
                          {isBlurred ? "███████████" : ad.pageName}
                        </span>
                        {ad.id && !isBlurred && (
                          <a href={`https://www.facebook.com/ads/library/?id=${ad.id}`} target="_blank" rel="noopener noreferrer" className="text-neutral-400 shrink-0">
                            <ExternalLink size={11} />
                          </a>
                        )}
                      </div>

                      <div className="mb-2" style={{ filter: isBlurred ? "blur(5px)" : "none" }}>
                        {ad.title && <p className="text-[11px] font-bold text-neutral-900 mb-0.5 leading-snug line-clamp-2">{isBlurred ? "████████████████" : ad.title}</p>}
                        {ad.bodyText && <p className="text-[11px] text-neutral-500 leading-snug line-clamp-2">{isBlurred ? "████████ ████ ████████" : ad.bodyText}</p>}
                      </div>

                      <div className="flex gap-1 mb-2 flex-wrap" style={{ filter: isBlurred ? "blur(4px)" : "none" }}>
                        <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded" style={{ color: pot.color, background: pot.color + "15" }}>
                          {pot.label}
                        </span>
                        {ad.daysRunning >= 20 && (
                          <span className="text-[10px] font-semibold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">✓ Rentable</span>
                        )}
                      </div>

                      {!isBlurred ? (
                        <button onClick={() => openModal(ad)}
                          className="w-full py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-[11px] font-bold flex items-center justify-center gap-1 transition-colors">
                          <Search size={11} />Reproduire cette opportunité
                        </button>
                      ) : (
                        <button onClick={() => router.push("/dashboard/tarifs")}
                          className="w-full py-2 bg-neutral-50 text-neutral-400 border border-neutral-200 rounded-lg text-[11px] font-semibold flex items-center justify-center gap-1">
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
            <div className="flex justify-center mt-4 pb-4">
              <button onClick={() => isPremium ? fetchAds(true) : router.push("/dashboard/tarifs")} disabled={loadingMore}
                className="px-6 py-2.5 bg-white border border-neutral-200 rounded-xl text-[13px] font-semibold text-neutral-600 flex items-center gap-2 hover:border-neutral-300 disabled:opacity-70 transition-colors">
                {loadingMore ? <Loader2 size={13} className="animate-spin" /> : isPremium ? <RefreshCw size={13} /> : <Lock size={13} />}
                {loadingMore ? "Chargement…" : "Charger plus"}
              </button>
            </div>
          )}
        </div>
      </div>

      {/* MODAL */}
      {modalAd && (
        <div className="fixed inset-0 bg-black/45 z-[100] flex items-center justify-center p-4"
          onClick={e => e.target === e.currentTarget && setModalAd(null)}>
          <div className="bg-white rounded-2xl w-full max-w-md overflow-hidden shadow-xl">

            <div className="px-5 py-3.5 border-b border-neutral-100 flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-neutral-900">Reproduire cette opportunité</p>
                <p className="text-[11px] text-neutral-500">L'IA génère une idée d'ebook sur ce sujet</p>
              </div>
              <button onClick={() => setModalAd(null)} className="text-neutral-400 hover:text-neutral-700"><X size={16} /></button>
            </div>

            <div className="px-5 py-2.5 bg-neutral-50 border-b border-neutral-100 flex items-center gap-2">
              {modalAd.pagePhoto && <img src={modalAd.pagePhoto} alt="" className="w-5 h-5 rounded-full object-cover" />}
              <p className="text-xs font-semibold text-neutral-600">{modalAd.pageName}</p>
            </div>

            <div className="p-5">
              {modalLoading ? (
                <div className="flex flex-col items-center gap-2.5 py-5">
                  <Loader2 size={24} className="text-neutral-400 animate-spin" />
                  <p className="text-[13px] text-neutral-500">Génération en cours…</p>
                </div>
              ) : modalResult ? (
                <div>
                  <p className="text-[10px] font-bold text-neutral-400 uppercase tracking-wide mb-2">Idée d'ebook</p>
                  <p className="text-[15px] font-bold text-neutral-900 mb-1.5 leading-snug">{modalResult.titre}</p>
                  <p className="text-[13px] text-neutral-600 mb-3.5 leading-relaxed">{modalResult.description}</p>

                  {(modalResult.gainEstime || modalResult.ouVendre) && (
                    <div className="bg-neutral-50 rounded-xl p-3 mb-3.5 flex flex-col gap-2">
                      {modalResult.gainEstime && (
                        <div className="flex items-center gap-2.5">
                          <DollarSign size={14} className="text-emerald-600 shrink-0" />
                          <div>
                            <p className="text-[10px] font-semibold text-neutral-400">Gain estimé</p>
                            <p className="text-[13px] font-bold text-neutral-900">{modalResult.gainEstime}</p>
                          </div>
                        </div>
                      )}
                      {modalResult.ouVendre && (
                        <div className="flex items-center gap-2.5">
                          <ShoppingBag size={14} className="text-neutral-700 shrink-0" />
                          <div>
                            <p className="text-[10px] font-semibold text-neutral-400">Où vendre</p>
                            <p className="text-[13px] text-neutral-600">{modalResult.ouVendre}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  )}

                  <button onClick={handleContinue}
                    className="w-full py-2.5 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 transition-colors">
                    Créer cet ebook maintenant <ChevronRight size={15} />
                  </button>
                </div>
              ) : (
                <p className="text-center text-[13px] text-neutral-400 py-5">Une erreur est survenue.</p>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
