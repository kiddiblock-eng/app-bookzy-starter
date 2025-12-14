"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import TrendCard from "../../../../components/TrendCard"; 
import { 
  Search, Filter, Calendar, Tag, Network, Target, 
  Loader2, AlertCircle, Zap, Flame, TrendingUp, CheckCircle, 
  DollarSign, RefreshCw, Activity, Heart, Target as TargetIcon
} from "lucide-react";

function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;');
}

export default function TrendsPage() {
  const router = useRouter();
  const pathname = usePathname();
  const [trends, setTrends] = useState([]);
  const [loading, setLoading] = useState(true);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [filters, setFilters] = useState({
    type: "all",
    network: "all",
    category: "all",
    dateRange: "all",
    difficulty: "all",
  });
  const [searchQuery, setSearchQuery] = useState("");

  useEffect(() => {
    fetchTrends();
  }, [filters]);

  const fetchTrends = async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams({
        filter: sanitizeText(filters.type),
        source: "manual",
        network: sanitizeText(filters.network),
        category: sanitizeText(filters.category),
        difficulty: sanitizeText(filters.difficulty),
      });

      const res = await fetch(`/api/trends/get?${params}`, { credentials: "include" });
      const data = await res.json();

      if (data.success) {
        setTrends(data.trends || []);
        const favCount = (data.trends || []).filter(t => t.isFavorite).length;
        setFavoriteCount(favCount);
      }
    } catch (error) {
      console.error("Erreur:", error);
    } finally {
      setLoading(false);
    }
  };

  const filteredTrends = trends.filter((trend) => {
    if (searchQuery) {
      const search = sanitizeText(searchQuery.toLowerCase());
      const matchSearch =
        trend.title?.toLowerCase().includes(search) ||
        trend.description?.toLowerCase().includes(search) ||
        trend.tags?.some((tag) => tag.toLowerCase().includes(search)) ||
        trend.network?.toLowerCase().includes(search);
      if (!matchSearch) return false;
    }
    
    // Logique de date
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

  const updateFilter = (key, value) => setFilters({ ...filters, [key]: sanitizeText(value) });
  
  const resetFilters = () => {
    setFilters({ type: "all", network: "all", category: "all", dateRange: "all", difficulty: "all" });
    setSearchQuery("");
  };

  const hotTrends = filteredTrends.filter(t => t.isHot).length;
  const risingTrends = filteredTrends.filter(t => t.isRising).length;

  return (
    // ✅ Suppression de style={{ fontFamily: 'Poppins' }} pour utiliser la police par défaut (font-sans)
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- CONTENU PRINCIPAL (DÉMARRE EN HAUT DE PAGE) --- */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {/* TITRE PRINCIPAL */}
        <div className="mb-6">
             <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight flex items-center gap-2">
                 <Zap className="w-6 h-6 text-indigo-600"/> Analyse Tendances
             </h1>
             <p className="text-sm text-slate-500 mt-1">Détectez les produits gagnants et les sujets chauds en temps réel.</p>
        </div>


        {/* STATS ANALYTIQUES */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
             <StatCardAnalytic label="Opportunités" value={filteredTrends.length} icon={Target} color="indigo" />
             <StatCardAnalytic label="Tendance HOT" value={hotTrends} icon={Flame} color="red" />
             <StatCardAnalytic label="En Croissance" value={risingTrends} icon={TrendingUp} color="green" />
             <StatCardAnalytic label="Favoris" value={favoriteCount} icon={Heart} color="rose" />
        </div>

        {/* BARRE DE RECHERCHE ET BOUTONS RAPIDES */}
        <div className="bg-white rounded-xl shadow-xl border border-slate-200 p-4 mb-8">
            
            <h3 className="text-xl font-black text-slate-900 mb-4 flex items-center gap-2">
                <Search size={20} className="text-indigo-600" /> Outils de Détection
            </h3>
            
            {/* Ligne 1 : Recherche + Réinitialiser */}
            <div className="flex flex-col md:flex-row gap-3 mb-4 border-b border-slate-100 pb-4">
                <div className="flex-1 relative group">
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 group-focus-within:text-indigo-600 transition-colors" />
                    <input 
                        type="text" 
                        placeholder="Recherche rapide (Niche, Hashtag...)" 
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
                    <button
                        onClick={resetFilters}
                        className="px-4 py-3 bg-white border border-slate-200 text-slate-600 font-extrabold flex items-center justify-center gap-2 transition-all hover:bg-slate-100 rounded-xl"
                        title="Réinitialiser les filtres"
                    >
                        <RefreshCw size={18} />
                        <span className="hidden sm:inline">Réinitialiser</span>
                    </button>
                </div>
            </div>

            {/* Ligne 2 : Filtres Détaillés (Sélections) */}
            <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-3">
                
                <FilterSelectAdvanced icon={Zap} label="Type" value={filters.type} onChange={(v) => updateFilter("type", v)} options={[
                    {val: "all", label: "Tout"}, {val: "hot", label: "🔥 Hot"}, {val: "rising", label: "📈 Hausse"}, 
                    {val: "profitable", label: "💰 Rentable"}, {val: "easy", label: "🟢 Facile"}
                ]} />
                
                <FilterSelectAdvanced icon={Network} label="Réseau" value={filters.network} onChange={(v) => updateFilter("network", v)} options={[
                    {val: "all", label: "Tous"}, {val: "TikTok", label: "TikTok"}, {val: "Instagram", label: "Instagram"}, 
                    {val: "Facebook", label: "Facebook"}, {val: "YouTube", label: "YouTube"},
                    {val: "Twitter/X", label: "Twitter / X"}, {val: "LinkedIn", label: "LinkedIn"}, 
                    {val: "Pinterest", label: "Pinterest"}, {val: "Multi-plateformes", label: "Multi"}
                ]} />

                <FilterSelectAdvanced icon={Tag} label="Catégorie" value={filters.category} onChange={(v) => updateFilter("category", v)} options={[
                    {val: "all", label: "Toutes"}, {val: "Business", label: "Business"}, {val: "Marketing", label: "Marketing"}, 
                    {val: "Technologie", label: "Tech"}, {val: "Finance", label: "Finance"}, {val: "Santé", label: "Santé"}, 
                    {val: "Éducation", label: "Éducation"}, {val: "Divertissement", label: "Divertissement"}, 
                    {val: "Lifestyle", label: "Lifestyle"}, {val: "Mode", label: "Mode"}, 
                    {val: "Beauté", label: "Beauté"}, {val: "Sport", label: "Sport"}, {val: "Gaming", label: "Gaming"}
                ]} />

                <FilterSelectAdvanced icon={Calendar} label="Période" value={filters.dateRange} onChange={(v) => updateFilter("dateRange", v)} options={[
                    {val: "all", label: "Toutes"}, {val: "today", label: "Aujourd'hui"}, {val: "week", label: "Cette semaine"}, 
                    {val: "month", label: "Ce mois"}, {val: "3months", label: "3 derniers mois"}
                ]} />

                 <FilterSelectAdvanced icon={Target} label="Difficulté" value={filters.difficulty} onChange={(v) => updateFilter("difficulty", v)} options={[
                    {val: "all", label: "Toutes"}, {val: "Facile", label: "Facile"}, {val: "Moyen", label: "Moyen"}, 
                    {val: "Difficile", label: "Difficile"}
                ]} />
            </div>
        </div>

        {/* LIGNE DES RÉSULTATS (Titre d'impact) */}
        {!loading && (
            <div className="bg-white rounded-xl border border-slate-200 p-4 mb-6 shadow-sm">
                <div className="flex justify-between items-center">
                    <h2 className="text-3xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                        <span className="font-extrabold">{filteredTrends.length}</span>
                        <span className="text-sm font-medium text-slate-500">résultats trouvés</span>
                    </h2>
                    <div className="text-xs font-medium text-slate-400 hidden sm:block">Trié par : Pertinence IA</div>
                </div>
            </div>
        )}

        {/* CONTENU */}
        {loading ? (
           <LoaderState />
        ) : filteredTrends.length === 0 ? (
            <EmptyState resetFilters={resetFilters} />
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {filteredTrends.map((trend) => (
                    <TrendCard key={trend._id || trend.id} trend={trend} />
                ))}
            </div>
        )}

      </div>
    </div>
  );
}

/* --- COMPOSANTS UI ANALYTIQUES --- */

function StatCardAnalytic({ label, value, icon: Icon, color }) {
    const colorMap = {
        indigo: "text-indigo-600 bg-indigo-50",
        red: "text-rose-600 bg-rose-50",
        green: "text-emerald-600 bg-emerald-50",
        rose: "text-rose-600 bg-rose-50",
        orange: "text-orange-600 bg-orange-50",
    };
    const colors = colorMap[color];

    return (
        <div className="bg-white p-4 rounded-xl border border-slate-200 shadow-md flex items-center gap-3">
            <div className={`p-2 rounded-lg ${colors} flex-shrink-0`}>
                <Icon className="w-5 h-5" />
            </div>
            <div>
                {/* Utilisation de font-extrabold pour les données clés */}
                <p className="text-2xl font-extrabold text-slate-900">{value}</p>
                <p className="text-[10px] uppercase font-extrabold text-slate-500 tracking-wider">{label}</p>
            </div>
        </div>
    )
}

function FilterSelectAdvanced({ icon: Icon, label, value, onChange, options }) {
    return (
        <div className="relative">
            <label className="text-[10px] font-extrabold text-slate-600 mb-1 uppercase tracking-wider block">
                {label}
            </label>
            <div className="relative">
                <Icon className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                <select 
                    value={value} 
                    onChange={(e) => onChange(e.target.value)}
                    className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-xs font-bold text-slate-700 appearance-none cursor-pointer outline-none focus:ring-2 focus:ring-indigo-100 transition-all truncate"
                >
                    {options.map(opt => <option key={opt.val} value={opt.val}>{opt.label}</option>)}
                </select>
            </div>
        </div>
    )
}

function LoaderState() {
    return (
        <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border border-dashed border-slate-300 shadow-lg">
            <div className="relative w-16 h-16 mb-6">
                <div className="absolute inset-0 border-4 border-indigo-200 rounded-full"></div>
                <div className="absolute inset-0 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin"></div>
            </div>
            <p className="text-xl font-black text-slate-900 mb-2">Analyse des Tendances en cours...</p>
            <p className="text-slate-600">Recherche des meilleures opportunités pour toi</p>
        </div>
    )
}

function EmptyState({ resetFilters }) {
    return (
        <div className="bg-white rounded-2xl p-12 text-center border-2 border-dashed border-slate-300 shadow-lg">
            <div className="w-16 h-16 rounded-full bg-indigo-100 flex items-center justify-center mx-auto mb-6">
                <AlertCircle className="w-8 h-8 text-indigo-600" />
            </div>
            <h3 className="2xl font-black text-slate-900 mb-3">Aucune tendance trouvée</h3>
            <p className="text-slate-600 mb-8 max-w-md mx-auto">
                Modifie tes filtres ou ta recherche pour découvrir d&apos;autres opportunités.
            </p>
            <button
                onClick={resetFilters}
                className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-xl transition-all"
            >
                <RefreshCw size={18} />
                Réinitialiser les filtres
            </button>
        </div>
    )
}