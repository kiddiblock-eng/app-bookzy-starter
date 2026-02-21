"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr";
import ReactDOM from "react-dom";
import TrendCard from '@/app/(platform)/components/TrendCard';
import { 
  Search, ChevronDown, Loader2, Heart, X, Flame, ArrowRight
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

export default function TrendsPage() {
  const router = useRouter();
  const pathname = usePathname();
  
  const [filters, setFilters] = useState({
    type: "all",
    network: "all",
    category: "all",
    dateRange: "all",
    difficulty: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  const [showFilters, setShowFilters] = useState(false);
  
  const debouncedSearch = useDebounce(searchQuery, 500);

  const queryParams = new URLSearchParams({
    filter: filters.type,
    network: filters.network,
    category: filters.category,
    difficulty: filters.difficulty,
    search: debouncedSearch,
  }).toString();

  const { data, isLoading, mutate } = useSWR(`/api/trends/get?${queryParams}`, fetcher, {
    keepPreviousData: true,
    revalidateOnFocus: false
  });

  const trends = data?.trends || [];
  const favoriteCount = data?.stats?.favorites || 0;

  // Filtrage dates (local)
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

  // 5 dernières tendances (les plus récentes)
  const latestTrends = [...filteredTrends]
    .sort((a, b) => new Date(b.trendDate) - new Date(a.trendDate))
    .slice(0, 5);

  // Le reste des tendances (sans les 5 premières)
  const latestIds = new Set(latestTrends.map(t => t.id));
  const otherTrends = filteredTrends.filter(t => !latestIds.has(t.id));

  const updateFilter = (key, value) => setFilters({ ...filters, [key]: value });
  
  const resetFilters = () => {
    setFilters({ type: "all", network: "all", category: "all", dateRange: "all", difficulty: "all" });
    setSearchQuery("");
  };

  const hasActiveFilters = Object.values(filters).some(v => v !== "all") || searchQuery.length > 0;

  return (
    <div className="min-h-screen bg-white">
      
      {/* HEADER STICKY */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4">
          
          {/* Top bar */}
          <div className="h-14 flex items-center justify-between gap-4">
            <h1 className="text-lg font-bold text-slate-900 whitespace-nowrap">Tendances</h1>
            
            {/* Search */}
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
                  <button 
                    onClick={() => setSearchQuery("")}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => router.push("/dashboard/trends/favoris")}
                className={`flex items-center gap-1.5 px-3 py-2 rounded-lg text-sm font-medium transition-all ${
                  pathname.includes('/favoris')
                    ? "bg-slate-900 text-white"
                    : "text-slate-600 hover:bg-slate-100"
                }`}
              >
                <Heart className="w-4 h-4" />
                <span className="hidden sm:inline">Favoris</span>
                {favoriteCount > 0 && (
                  <span className="bg-slate-200 text-slate-700 text-xs px-1.5 py-0.5 rounded-full">
                    {favoriteCount}
                  </span>
                )}
              </button>
            </div>
          </div>

          {/* Filters bar */}
          <div className="py-3 flex items-center gap-2 overflow-x-auto scrollbar-hide">
            <FilterPill 
              label="Type" 
              value={filters.type} 
              options={[
                { val: "all", label: "Tous" },
                { val: "hot", label: "Hot 🔥" },
                { val: "rising", label: "En hausse" },
                { val: "profitable", label: "Rentable" },
              ]}
              onChange={(v) => updateFilter("type", v)}
            />
            <FilterPill 
              label="Réseau" 
              value={filters.network} 
              options={[
                { val: "all", label: "Tous" },
                { val: "TikTok", label: "TikTok" },
                { val: "Instagram", label: "Instagram" },
                { val: "Facebook", label: "Facebook" },
                { val: "YouTube", label: "YouTube" },
              ]}
              onChange={(v) => updateFilter("network", v)}
            />
            <FilterPill 
              label="Catégorie" 
              value={filters.category} 
              options={[
                { val: "all", label: "Toutes" },
                { val: "Business", label: "Business" },
                { val: "Marketing", label: "Marketing" },
                { val: "Technologie", label: "Tech" },
                { val: "Finance", label: "Finance" },
                { val: "Santé", label: "Santé" },
                { val: "Lifestyle", label: "Lifestyle" },
              ]}
              onChange={(v) => updateFilter("category", v)}
            />
            <FilterPill 
              label="Période" 
              value={filters.dateRange} 
              options={[
                { val: "all", label: "Toutes" },
                { val: "today", label: "Aujourd'hui" },
                { val: "week", label: "7 jours" },
                { val: "month", label: "30 jours" },
              ]}
              onChange={(v) => updateFilter("dateRange", v)}
            />
            <FilterPill 
              label="Difficulté" 
              value={filters.difficulty} 
              options={[
                { val: "all", label: "Toutes" },
                { val: "Facile", label: "Facile" },
                { val: "Moyen", label: "Moyen" },
                { val: "Difficile", label: "Difficile" },
              ]}
              onChange={(v) => updateFilter("difficulty", v)}
            />
            
            {hasActiveFilters && (
              <button 
                onClick={resetFilters}
                className="px-3 py-1.5 text-xs text-slate-500 hover:text-slate-900 whitespace-nowrap"
              >
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
            {/* TOP 5 - Ce qui cartonne */}
            {latestTrends.length > 0 && !searchQuery && (
              <div className="mb-8">
                <div className="flex items-center gap-2 mb-4">
                  <Flame className="w-5 h-5 text-orange-500" />
                  <h2 className="text-base font-semibold text-slate-900">Tendances du moment</h2>
                  <span className="text-xs text-slate-400">• Dernières ajoutées</span>
                </div>
                
                {/* Horizontal scroll on mobile, grid on desktop */}
                <div className="flex gap-3 overflow-x-auto pb-2 scrollbar-hide sm:grid sm:grid-cols-5 sm:overflow-visible">
                  {latestTrends.map((trend) => (
                    <LatestTrendCard key={trend.id} trend={trend} />
                  ))}
                </div>
              </div>
            )}

            {/* Résultats count */}
            <div className="flex items-center justify-between mb-4">
              <p className="text-sm text-slate-500">
                {filteredTrends.length} tendance{filteredTrends.length > 1 ? 's' : ''}
              </p>
            </div>

            {/* GRILLE PRINCIPALE */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
              {(searchQuery ? filteredTrends : otherTrends).map((trend) => (
                <TrendCard key={trend.id} trend={trend} />
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}

/* FILTER PILL - Bottom sheet on mobile */
function FilterPill({ label, value, options, onChange }) {
  const [open, setOpen] = useState(false);
  const selectedLabel = options.find(o => o.val === value)?.label || label;
  const isActive = value !== "all";

  // Fermer si on clique ailleurs
  useEffect(() => {
    if (!open) return;
    const handleEsc = (e) => { if (e.key === 'Escape') setOpen(false); };
    document.addEventListener('keydown', handleEsc);
    // Empêcher le scroll du body
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', handleEsc);
      document.body.style.overflow = '';
    };
  }, [open]);

  return (
    <>
      <button
        onClick={(e) => { e.stopPropagation(); setOpen(true); }}
        className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
          isActive 
            ? "bg-slate-900 text-white" 
            : "bg-slate-100 text-slate-700 hover:bg-slate-200"
        }`}
      >
        {isActive ? selectedLabel : label}
        <ChevronDown className="w-3.5 h-3.5" />
      </button>

      {/* Bottom Sheet Modal - Only render when open */}
      {open && typeof document !== 'undefined' && ReactDOM.createPortal(
        <div className="fixed inset-0 z-[9999]">
          {/* Backdrop */}
          <div 
            className="absolute inset-0 bg-black/50"
            onClick={() => setOpen(false)} 
          />
          
          {/* Sheet */}
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl max-h-[60vh] overflow-hidden">
            {/* Handle */}
            <div className="flex justify-center pt-3 pb-2">
              <div className="w-10 h-1 bg-slate-300 rounded-full" />
            </div>
            
            {/* Header */}
            <div className="px-4 pb-3 border-b border-slate-100 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-slate-900">{label}</h3>
              <button onClick={() => setOpen(false)} className="p-2 text-slate-400 hover:text-slate-600">
                <X className="w-5 h-5" />
              </button>
            </div>
            
            {/* Options */}
            <div className="p-2 pb-8 overflow-y-auto max-h-[45vh]">
              {options.map(opt => (
                <button
                  key={opt.val}
                  onClick={() => { onChange(opt.val); setOpen(false); }}
                  className={`w-full px-4 py-3.5 text-left text-base rounded-xl mb-1 flex items-center justify-between transition-colors ${
                    value === opt.val 
                      ? "bg-slate-100 text-slate-900 font-medium" 
                      : "text-slate-600 active:bg-slate-50"
                  }`}
                >
                  {opt.label}
                  {value === opt.val && (
                    <span className="text-blue-600 text-lg">✓</span>
                  )}
                </button>
              ))}
            </div>
          </div>
        </div>,
        document.body
      )}
    </>
  );
}

/* LATEST TREND CARD - Clean, no frame */
function LatestTrendCard({ trend }) {
  const router = useRouter();
  
  const handleClick = () => {
    const params = new URLSearchParams();
    if (trend.title) params.set("suggestion", encodeURIComponent(trend.title));
    if (trend.description) params.set("description", encodeURIComponent(trend.description));
    router.push(`/dashboard/projets/nouveau?${params.toString()}`);
  };
  
  return (
    <div 
      onClick={handleClick}
      className="flex-shrink-0 w-[130px] sm:w-auto cursor-pointer group"
    >
      {/* Image */}
      {trend.imageUrl && (
        <div className="aspect-[4/3] rounded-lg overflow-hidden mb-2">
          <img 
            src={trend.imageUrl} 
            alt={trend.title} 
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
        </div>
      )}
      
      {/* Title */}
      <h3 className="text-sm font-medium text-slate-900 line-clamp-2 leading-snug group-hover:text-slate-600 transition-colors">
        {trend.title}
      </h3>
      
      {/* Network */}
      <p className="text-xs text-slate-400 mt-0.5">{trend.network}</p>
    </div>
  );
}

/* EMPTY STATE */
function EmptyState({ resetFilters }) {
  return (
    <div className="text-center py-16">
      <p className="text-slate-500 mb-4">Aucune tendance trouvée</p>
      <button 
        onClick={resetFilters}
        className="text-sm text-slate-900 font-medium hover:underline"
      >
        Réinitialiser les filtres
      </button>
    </div>
  );
}