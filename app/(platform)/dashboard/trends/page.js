"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import useSWR from "swr"; 
import TrendCard from '@/app/(platform)/components/TrendCard';
import { 
  Search, Filter, Calendar, Tag, Network, Target, 
  Loader2, AlertCircle, Zap, Flame, TrendingUp, CheckCircle, 
  RefreshCw, Heart
} from "lucide-react";

// Fetcher pour SWR
const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

// Hook Debounce (Attendre la fin de la frappe)
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
  
  // États Filtres
  const [filters, setFilters] = useState({
    type: "all",
    network: "all",
    category: "all",
    dateRange: "all",
    difficulty: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");
  
  // Attendre 500ms avant de valider la recherche
  const debouncedSearch = useDebounce(searchQuery, 500);

  // Construction URL API
  const queryParams = new URLSearchParams({
    filter: filters.type,
    network: filters.network,
    category: filters.category,
    difficulty: filters.difficulty,
    search: debouncedSearch, // Envoi au serveur
  }).toString();

  // Appel SWR
  const { data, isLoading, mutate } = useSWR(`/api/trends/get?${queryParams}`, fetcher, {
    keepPreviousData: true, 
    revalidateOnFocus: false
  });

  const trends = data?.trends || [];
  const favoriteCount = data?.stats?.favorites || 0;

  // Filtrage Dates (Local)
  const finalDisplayTrends = trends.filter((trend) => {
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
      } else if (filters.dateRange === "3months") {
          if (trendDate < new Date(now - 90 * 86400000)) return false;
      }
    }
    return true;
  });

  const updateFilter = (key, value) => setFilters({ ...filters, [key]: value });
  
  const resetFilters = () => {
    setFilters({ type: "all", network: "all", category: "all", dateRange: "all", difficulty: "all" });
    setSearchQuery("");
  };

  const hotTrends = trends.filter(t => t.isHot).length;
  const risingTrends = trends.filter(t => t.isRising).length;

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* HEADER */}
        <div className="mb-6">
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                 <Zap className="w-6 h-6 text-indigo-600"/> Analyse Tendances
             </h1>
             <p className="text-sm text-slate-500 mt-1">Détectez les produits gagnants parmi nos analyses mondiales.</p>
        </div>

        {/* STATS */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
             <StatCardAnalytic label="Résultats" value={data?.stats?.total || 0} icon={Target} color="indigo" />
             <StatCardAnalytic label="Tendance HOT" value={hotTrends} icon={Flame} color="red" />
             <StatCardAnalytic label="En Croissance" value={risingTrends} icon={TrendingUp} color="green" />
             <StatCardAnalytic label="Favoris" value={favoriteCount} icon={Heart} color="rose" />
        </div>

        {/* TOOLBAR */}
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 mb-8">
            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Search size={20} className="text-indigo-600" /> Outils de Détection
            </h3>
            
            <div className="flex flex-col md:flex-row gap-3 mb-4 border-b border-slate-100 pb-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Rechercher (ex: Yoga, iPhone, Dropshipping...)" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full pl-12 pr-4 py-3 bg-slate-50 hover:bg-white focus:bg-white border border-slate-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-indigo-500/20 focus:border-indigo-500 transition-all font-medium text-slate-900"
                    />
                </div>
                <div className="flex gap-3">
                    <button
                        onClick={() => router.push("/dashboard/trends/favoris")}
                        className={`px-4 py-3 rounded-lg font-bold text-sm flex items-center gap-2 transition-all ${
                            pathname.includes('/favoris') 
                                ? "bg-rose-600 text-white shadow-md"
                                : "bg-white border border-slate-200 text-slate-600 hover:bg-slate-100"
                        }`}
                    >
                        <Heart size={16} />
                        <span className="hidden sm:inline">Favoris</span>
                        <span className="sm:hidden">{favoriteCount}</span>
                    </button>
                    <button onClick={() => mutate()} className="p-3 bg-slate-100 rounded-lg hover:bg-slate-200" title="Rafraîchir">
                        <RefreshCw size={18} className={isLoading ? "animate-spin" : ""} />
                    </button>
                </div>
            </div>

            {/* FILTRES SELECT */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                <FilterSelectAdvanced icon={Zap} label="Type" value={filters.type} onChange={(v) => updateFilter("type", v)} options={[
                    {val: "all", label: "Tout"}, {val: "hot", label: "🔥 Hot"}, {val: "rising", label: "📈 Hausse"}, 
                    {val: "profitable", label: "💰 Rentable"}, {val: "easy", label: "🟢 Facile"}
                ]} />
                <FilterSelectAdvanced icon={Network} label="Réseau" value={filters.network} onChange={(v) => updateFilter("network", v)} options={[
                    {val: "all", label: "Tous"}, {val: "TikTok", label: "TikTok"}, {val: "Instagram", label: "Instagram"}, 
                    {val: "Facebook", label: "Facebook"}, {val: "YouTube", label: "YouTube"},
                    {val: "Twitter/X", label: "Twitter / X"}, {val: "LinkedIn", label: "LinkedIn"}
                ]} />
                <FilterSelectAdvanced icon={Tag} label="Catégorie" value={filters.category} onChange={(v) => updateFilter("category", v)} options={[
                    {val: "all", label: "Toutes"}, {val: "Business", label: "Business"}, {val: "Marketing", label: "Marketing"}, 
                    {val: "Technologie", label: "Tech"}, {val: "Finance", label: "Finance"}, {val: "Santé", label: "Santé"}, 
                    {val: "Divertissement", label: "Divertissement"}, {val: "Lifestyle", label: "Lifestyle"}
                ]} />
                <FilterSelectAdvanced icon={Calendar} label="Période" value={filters.dateRange} onChange={(v) => updateFilter("dateRange", v)} options={[
                    {val: "all", label: "Toutes"}, {val: "today", label: "Aujourd'hui"}, {val: "week", label: "Cette semaine"}, 
                    {val: "month", label: "Ce mois"}, {val: "3months", label: "3 derniers mois"}
                ]} />
                 <FilterSelectAdvanced icon={Target} label="Difficulté" value={filters.difficulty} onChange={(v) => updateFilter("difficulty", v)} options={[
                    {val: "all", label: "Toutes"}, {val: "Facile", label: "Facile"}, {val: "Moyen", label: "Moyen"}, {val: "Difficile", label: "Difficile"}
                ]} />
            </div>
        </div>

        {/* INFO RÉSULTATS */}
        {!isLoading && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span className="font-extrabold">{finalDisplayTrends.length}</span>
                        <span className="text-sm font-medium text-slate-500">résultats</span>
                    </h2>
                    <div className="text-xs font-medium text-slate-400 hidden sm:block">Recherche globale activée</div>
                </div>
            </div>
        )}

        {/* LISTE OU LOADER */}
        {isLoading && trends.length === 0 ? (
           <LoaderState />
        ) : finalDisplayTrends.length === 0 ? (
            <EmptyState resetFilters={resetFilters} />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 animate-in fade-in slide-in-from-bottom-4 duration-500">
                {finalDisplayTrends.map((trend) => (
                    <TrendCard key={trend.id} trend={trend} />
                ))}
            </div>
        )}

      </div>
    </div>
  );
}

// COMPOSANTS UI
function StatCardAnalytic({ label, value, icon: Icon, color }) {
    const colorMap = {
        indigo: "text-indigo-600 bg-indigo-50",
        red: "text-rose-600 bg-rose-50",
        green: "text-emerald-600 bg-emerald-50",
        rose: "text-rose-600 bg-rose-50",
        orange: "text-orange-600 bg-orange-50",
    };
    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colorMap[color]} flex-shrink-0`}><Icon className="w-5 h-5" /></div>
            <div>
                <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                <p className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">{label}</p>
            </div>
        </div>
    )
}

function FilterSelectAdvanced({ icon: Icon, label, value, onChange, options }) {
    return (
        <div className="relative">
            <label className="text-[10px] font-extrabold text-slate-600 mb-1 uppercase tracking-wider block">{label}</label>
            <div className="relative">
                <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select value={value} onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-indigo-100 transition-all truncate">
                    {options.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
                </select>
            </div>
        </div>
    )
}

function LoaderState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-lg">
            <Loader2 className="w-10 h-10 text-indigo-600 animate-spin mb-4" />
            <p className="text-xl font-black text-slate-900 mb-2">Recherche globale...</p>
        </div>
    )
}

function EmptyState({ resetFilters }) {
    return (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300 shadow-lg">
            <AlertCircle className="w-8 h-8 text-indigo-600 mx-auto mb-6" />
            <h3 className="2xl font-black text-slate-900 mb-3">Aucune tendance trouvée</h3>
            <p className="text-slate-600 mb-8 text-sm">Essaie d&apos;autres mots-clés ou réinitialise les filtres.</p>
            <button onClick={resetFilters} className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xl transition-all">
                <RefreshCw size={18} /> Réinitialiser
            </button>
        </div>
    )
}