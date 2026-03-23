"use client";

import { useState, useEffect, useRef } from "react";
import ReactDOM from "react-dom";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import TrendCard from '@/app/(platform)/components/TrendCard';
import { useCredits } from "@/hooks/useCredits";
import { 
  Search, ChevronDown, Loader2, Heart, X, Flame, CreditCard, Lock, ArrowRight
} from "lucide-react";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

function useDebounce(value, delay) {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(() => {
    const handler = setTimeout(() => setDebouncedValue(value), delay);
    return () => clearTimeout(handler);
  }, [value, delay]);
  return debouncedValue;
}

const BLUR_PLACEHOLDER_COUNT = 6;

export default function TrendsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const { balance, mutateBalance } = useCredits();

  const [filters, setFilters] = useState({
    type: "all", network: "all", category: "all", dateRange: "all", difficulty: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [unlocking, setUnlocking] = useState(false);
  const [unlockError, setUnlockError] = useState("");
  const debouncedSearch = useDebounce(searchQuery, 500);

  const queryParams = new URLSearchParams({
    filter: filters.type, network: filters.network, category: filters.category,
    difficulty: filters.difficulty, search: debouncedSearch,
  }).toString();

  const { data, isLoading, mutate } = useSWR(`/api/trends/get?${queryParams}`, fetcher, {
    keepPreviousData: true, revalidateOnFocus: false,
  });

  const trends           = data?.trends     || [];
  const isPaidPlan       = data?.isPaidPlan ?? true;
  const isUnlocked       = data?.isUnlocked ?? false;
  const unlockedCount    = data?.unlockedCount ?? 0;
  const unlockedExpiresIn = data?.unlockedExpiresIn ?? null;
  const favoriteCount    = data?.stats?.favorites || 0;

  const filteredTrends = trends.filter((trend) => {
    if (filters.dateRange !== "all") {
      const trendDate = new Date(trend.trendDate);
      const now = new Date();
      if (filters.dateRange === "today") {
        const today = new Date(); today.setHours(0, 0, 0, 0);
        if (trendDate < today) return false;
      } else if (filters.dateRange === "week") {
        if (trendDate < new Date(now - 7 * 86400000)) return false;
      } else if (filters.dateRange === "month") {
        if (trendDate < new Date(now - 30 * 86400000)) return false;
      }
    }
    return true;
  });

  const now = new Date();
  const todayStart = new Date(now); todayStart.setHours(0, 0, 0, 0);

  // Tendances ajoutées aujourd'hui — triées par date desc (plus récente en premier)
  const todayTrends = [...filteredTrends]
    .filter(t => new Date(t.createdAt || t.trendDate) >= todayStart)
    .sort((a, b) => new Date(b.createdAt || b.trendDate) - new Date(a.createdAt || a.trendDate));

  const todayIds = new Set(todayTrends.map(t => t.id));

  // Les 5 plus récentes hors aujourd'hui pour le carousel "Tendances du moment"
  const latestTrends = [...filteredTrends]
    .filter(t => !todayIds.has(t.id))
    .sort((a, b) => new Date(b.createdAt || b.trendDate) - new Date(a.createdAt || a.trendDate))
    .slice(0, 5);

  const latestIds = new Set(latestTrends.map(t => t.id));

  // Le reste — récentes intercalées avec anciennes (1 ancienne toutes les 4 récentes)
  const restSorted = filteredTrends
    .filter(t => !todayIds.has(t.id) && !latestIds.has(t.id))
    .sort((a, b) => new Date(b.createdAt || b.trendDate) - new Date(a.createdAt || a.trendDate));

  const recentRest = restSorted.slice(0, Math.floor(restSorted.length * 0.7));
  const oldRest    = restSorted.slice(Math.floor(restSorted.length * 0.7));

  const otherTrends = [];
  let oldIdx = 0;
  for (let i = 0; i < recentRest.length; i++) {
    otherTrends.push(recentRest[i]);
    if ((i + 1) % 4 === 0 && oldIdx < oldRest.length) {
      otherTrends.push(oldRest[oldIdx++]);
    }
  }
  while (oldIdx < oldRest.length) otherTrends.push(oldRest[oldIdx++]);

  const updateFilter  = (key, value) => setFilters({ ...filters, [key]: value });
  const resetFilters  = () => { setFilters({ type: "all", network: "all", category: "all", dateRange: "all", difficulty: "all" }); setSearchQuery(""); };
  const hasActiveFilters = Object.values(filters).some(v => v !== "all") || searchQuery.length > 0;

  // ✅ Débloquer 50 tendances — 2 crédits
  const handleUnlock = async () => {
    setUnlockError("");
    setUnlocking(true);
    try {
      const res = await fetch("/api/trends/unlock", { method: "POST", credentials: "include" });
      const json = await res.json();
      if (!res.ok || !json.success) {
        if (json.insufficientCredits) {
          setUnlockError("Crédits insuffisants. Rechargez votre solde.");
        } else {
          setUnlockError(json.error || "Erreur lors du déblocage.");
        }
        return;
      }
      await mutate();       // refetch trends → isUnlocked = true depuis le serveur
      mutateBalance();      // rafraîchir le solde dans le header
    } catch (e) {
      setUnlockError("Erreur réseau, réessayez.");
    } finally {
      setUnlocking(false);
    }
  };

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER STICKY */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          <div className="h-14 flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold text-slate-900 whitespace-nowrap">Tendances</h1>

            <div className="flex-1 max-w-xl">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
                <input
                  type="text"
                  placeholder="Rechercher une tendance..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-10 pr-4 py-2 bg-slate-100 border-0 rounded-lg text-sm focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all"
                />
                {searchQuery && (
                  <button onClick={() => setSearchQuery("")} className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600">
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            <div className="flex items-center gap-2">
              {balance !== null && (
                <button
                  onClick={() => router.push("/dashboard/credits")}
                  className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors"
                >
                  <CreditCard size={13} className="text-slate-500" />
                  <span className="text-xs font-semibold text-slate-700">{balance} cr.</span>
                </button>
              )}
              <button
                onClick={() => router.push("/dashboard/trends/favoris")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname.includes("/favoris") ? "bg-slate-900 text-white" : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Favoris</span>
                {favoriteCount > 0 && (
                  <span className="bg-slate-200 text-slate-700 text-xs px-1.5 py-0.5 rounded-full">{favoriteCount}</span>
                )}
              </button>
            </div>
          </div>

          {/* Filters */}
          <div className="py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <FilterPill label="Type"       value={filters.type}       options={[{val:"all",label:"Tous"},{val:"hot",label:"Hot 🔥"},{val:"rising",label:"En hausse"},{val:"profitable",label:"Rentable"}]}       onChange={(v) => updateFilter("type", v)} />
            <FilterPill label="Réseau"     value={filters.network}    options={[{val:"all",label:"Tous"},{val:"TikTok",label:"TikTok"},{val:"Instagram",label:"Instagram"},{val:"Facebook",label:"Facebook"},{val:"YouTube",label:"YouTube"}]} onChange={(v) => updateFilter("network", v)} />
            <FilterPill label="Catégorie"  value={filters.category}   options={[{val:"all",label:"Toutes"},{val:"Business",label:"Business"},{val:"Marketing",label:"Marketing"},{val:"Technologie",label:"Tech"},{val:"Finance",label:"Finance"},{val:"Santé",label:"Santé"},{val:"Lifestyle",label:"Lifestyle"}]} onChange={(v) => updateFilter("category", v)} />
            <FilterPill label="Période"    value={filters.dateRange}  options={[{val:"all",label:"Toutes"},{val:"today",label:"Aujourd'hui"},{val:"week",label:"7 jours"},{val:"month",label:"30 jours"}]}  onChange={(v) => updateFilter("dateRange", v)} />
            <FilterPill label="Difficulté" value={filters.difficulty} options={[{val:"all",label:"Toutes"},{val:"Facile",label:"Facile"},{val:"Moyen",label:"Moyen"},{val:"Difficile",label:"Difficile"}]}   onChange={(v) => updateFilter("difficulty", v)} />
            {hasActiveFilters && (
              <button onClick={resetFilters} className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 whitespace-nowrap">
                Réinitialiser
              </button>
            )}
          </div>
        </div>
      </div>

      {/* CONTENT */}
      <div className="max-w-7xl mx-auto px-4 py-6">

        {isLoading && trends.length === 0 ? (
          <div className="flex items-center justify-center py-20">
            <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          </div>
        ) : filteredTrends.length === 0 ? (
          <EmptyState resetFilters={resetFilters} />
        ) : (
          <>
            {/* NOUVELLES AUJOURD'HUI */}
            {todayTrends.length > 0 && !searchQuery && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-base">✨</span>
                  <h2 className="text-base font-semibold text-slate-900">Nouvelles aujourd'hui</h2>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[11px] font-bold">
                    {todayTrends.length} ajoutée{todayTrends.length > 1 ? "s" : ""}
                  </span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                  {todayTrends.map((trend, i) => (
                    <div key={trend.id} className={!isPaidPlan && i >= 3 ? "blur-sm opacity-60 pointer-events-none select-none" : ""}>
                      <TrendCard trend={trend} />
                    </div>
                  ))}
                </div>
                <div className="mt-6 border-b border-slate-100" />
              </div>
            )}

            {/* TOP 5 tendances du moment */}
            {latestTrends.length > 0 && !searchQuery && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h2 className="text-base font-semibold text-slate-900">Tendances du moment</h2>
                  <span className="text-xs text-slate-400">• Dernières ajoutées</span>
                </div>

                <div className="relative">
                  <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-5 sm:overflow-visible">
                    {latestTrends.map((trend, i) => (
                      <div key={trend.id} className={`flex-shrink-0 w-[130px] sm:w-auto ${!isPaidPlan && i >= 3 ? "blur-sm opacity-60 pointer-events-none select-none" : ""}`}>
                        <LatestTrendCard trend={trend} disabled={!isPaidPlan && i >= 3} />
                      </div>
                    ))}
                  </div>

                  {!isPaidPlan && (
                    <div className="absolute inset-0 flex items-center justify-end pr-2 sm:pr-0 sm:justify-end pointer-events-none">
                      <button
                        onClick={handleUnlock}
                        disabled={unlocking}
                        className="pointer-events-auto bg-white/90 backdrop-blur-sm border border-slate-200 rounded-xl px-3 py-2 flex items-center gap-2 shadow-md hover:bg-slate-50 transition-colors disabled:opacity-60"
                      >
                        <Lock size={13} className="text-slate-500" />
                        <span className="text-xs font-semibold text-slate-700">
                          {unlocking ? "..." : `Débloquer — 2 cr.`}
                        </span>
                      </button>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* Compteur */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                {isPaidPlan
                  ? `${filteredTrends.length} tendance${filteredTrends.length > 1 ? "s" : ""}`
                  : isUnlocked
                    ? `${filteredTrends.length} tendances débloquées${unlockedExpiresIn ? ` · expire dans ${unlockedExpiresIn}h` : ""}`
                    : `10 tendances affichées sur des centaines`}
              </p>
            </div>

            {/* GRILLE PRINCIPALE */}
            <div className="relative">
              <div className={`grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 ${!isPaidPlan && !isUnlocked ? "pointer-events-none select-none" : ""}`}>
                {(searchQuery ? filteredTrends : otherTrends).map((trend) => (
                  <TrendCard key={trend.id} trend={trend} />
                ))}

                {/* Cards floutées fictives pour les gratuits non débloqués */}
                {!isPaidPlan && !isUnlocked && Array.from({ length: BLUR_PLACEHOLDER_COUNT }).map((_, i) => (
                  <BlurredPlaceholderCard key={`blur-${i}`} />
                ))}
              </div>

              {/* ✅ Overlay CTA — gratuit, toujours visible */}
              {!isPaidPlan && (
                <div
                  className="absolute bottom-0 left-0 right-0 h-80 flex flex-col items-center justify-end pb-6"
                  style={{ background: "linear-gradient(to bottom, transparent 0%, rgba(255,255,255,0.85) 35%, white 70%)" }}
                >
                  <div className="text-center px-4 max-w-md">
                    <div className="inline-flex items-center justify-center w-12 h-12 bg-slate-900 rounded-2xl mb-3">
                      <Lock size={20} className="text-white" />
                    </div>
                    <h3 className="text-lg font-bold text-slate-900 mb-1">
                      {isUnlocked ? "Voir 50 tendances de plus pour 2cr" : "Des centaines de tendances vous attendent"}
                    </h3>
                    <p className="text-sm text-slate-500 mb-4">
                      {isUnlocked
                        ? `Vous avez débloqué ${unlockedCount} tendances${unlockedExpiresIn ? ` · expire dans ${unlockedExpiresIn}h` : ""}.`
                        : "Débloquez 50 tendances supplémentaires maintenant, ou passez au plan payant pour un accès illimité."}
                    </p>

                    {unlockError && (
                      <p className="text-xs text-red-500 mb-3">{unlockError}</p>
                    )}

                    <button
                      onClick={handleUnlock}
                      disabled={unlocking}
                      className="inline-flex items-center gap-2 px-6 py-3 bg-slate-900 hover:bg-slate-800 disabled:opacity-60 text-white rounded-xl text-sm font-bold transition-all shadow-lg mb-3 w-full justify-center"
                    >
                      {unlocking ? (
                        <><Loader2 size={15} className="animate-spin" /> Déblocage en cours...</>
                      ) : (
                        <>Débloquer 50 tendances </>
                      )}
                    </button>

                    <button
                      onClick={() => router.push("/dashboard/tarifs")}
                      className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-slate-900 transition-colors"
                    >
                      Ou passer au plan payant pour une utilisation illimitée <ArrowRight size={13} />
                    </button>
                    <p className="text-xs text-slate-400 mt-1">À partir de 5 100 FCFA / mois</p>
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* Card floutée placeholder */
function BlurredPlaceholderCard() {
  return (
    <div className="blur-sm opacity-50 pointer-events-none select-none rounded-xl border border-slate-100 bg-slate-50 p-4 h-40">
      <div className="w-3/4 h-4 bg-slate-200 rounded mb-2" />
      <div className="w-full h-3 bg-slate-200 rounded mb-1" />
      <div className="w-2/3 h-3 bg-slate-200 rounded mb-4" />
      <div className="flex gap-2">
        <div className="w-16 h-5 bg-slate-200 rounded-full" />
        <div className="w-12 h-5 bg-slate-200 rounded-full" />
      </div>
    </div>
  );
}

/* FILTER PILL — dropdown portal style Minea */
function FilterPill({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const [pos, setPos] = useState({ top: 0, left: 0 });
  const btnRef = useRef(null);
  const selectedLabel = options.find(o => o.val === value)?.label || label;
  const isActive = value !== "all";

  const handleOpen = () => {
    if (!open && btnRef.current) {
      const rect = btnRef.current.getBoundingClientRect();
      setPos({ top: rect.bottom + window.scrollY + 6, left: rect.left + window.scrollX });
    }
    setOpen(!open);
  };

  useEffect(() => {
    if (!open) return;
    const handleClick = (e) => {
      if (!btnRef.current?.contains(e.target) && !e.target.closest(`[data-dropdown="${label}"]`)) {
        setOpen(false);
      }
    };
    const handleEsc = (e) => { if (e.key === "Escape") setOpen(false); };
    document.addEventListener("mousedown", handleClick);
    document.addEventListener("keydown", handleEsc);
    return () => {
      document.removeEventListener("mousedown", handleClick);
      document.removeEventListener("keydown", handleEsc);
    };
  }, [open, label]);

  return (
    <div className="relative">
      <button
        ref={btnRef}
        onClick={handleOpen}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all border ${
          isActive
            ? "bg-slate-900 text-white border-slate-900"
            : open
            ? "bg-white text-slate-900 border-slate-300 shadow-sm"
            : "bg-white text-slate-700 border-slate-200 hover:border-slate-300"
        }`}
      >
        {isActive ? selectedLabel : label}
        <ChevronDown className={`w-3.5 h-3.5 transition-transform duration-200 ${open ? "rotate-180" : ""}`} />
      </button>

      {open && typeof window !== "undefined" && ReactDOM.createPortal(
        <div
          data-dropdown={label}
          className="fixed z-[9999] bg-white border border-slate-200 rounded-xl shadow-xl overflow-hidden min-w-[160px]"
          style={{ top: pos.top, left: pos.left }}
        >
          {options.map(opt => (
            <button
              key={opt.val}
              onClick={() => { onChange(opt.val); setOpen(false); }}
              className={`w-full px-3 py-2.5 text-left text-sm flex items-center justify-between transition-colors ${
                value === opt.val
                  ? "bg-slate-50 text-slate-900 font-semibold"
                  : "text-slate-600 hover:bg-slate-50 hover:text-slate-900"
              }`}
            >
              {opt.label}
              {value === opt.val && (
                <span className="w-4 h-4 rounded-full bg-slate-900 flex items-center justify-center flex-shrink-0">
                  <svg className="w-2.5 h-2.5 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={3}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M5 13l4 4L19 7" />
                  </svg>
                </span>
              )}
            </button>
          ))}
        </div>,
        document.body
      )}
    </div>
  );
}

/* LATEST TREND CARD */
function LatestTrendCard({ trend, disabled }) {
  const router = useRouter();
  const handleClick = () => {
    if (disabled) return;
    const params = new URLSearchParams();
    if (trend.title) params.set("suggestion", encodeURIComponent(trend.title));
    if (trend.description) params.set("description", encodeURIComponent(trend.description));
    router.push(`/dashboard/projets/nouveau?${params.toString()}`);
  };
  return (
    <div onClick={handleClick} className={`flex-shrink-0 w-[130px] sm:w-auto ${disabled ? "cursor-not-allowed" : "cursor-pointer group"}`}>
      {trend.imageUrl && (
        <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2">
          <img src={trend.imageUrl} alt={trend.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300" />
        </div>
      )}
      <h3 className="text-sm font-medium text-slate-900 line-clamp-2 leading-snug group-hover:text-slate-600 transition-colors">{trend.title}</h3>
      <p className="text-xs text-slate-400 mt-0.5">{trend.network}</p>
    </div>
  );
}

/* EMPTY STATE */
function EmptyState({ resetFilters }) {
  return (
    <div className="text-center py-16">
      <p className="text-slate-500 mb-4">Aucune tendance trouvée</p>
      <button onClick={resetFilters} className="text-sm text-slate-900 font-medium hover:underline">
        Réinitialiser les filtres
      </button>
    </div>
  );
}