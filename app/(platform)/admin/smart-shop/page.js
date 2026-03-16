"use client";

import { useState, useEffect } from "react";
import { 
  Store, TrendingUp, Users, Package,
  Loader2, Download, Search, ChevronLeft, ChevronRight,
  Eye
} from "lucide-react";
import Link from "next/link";

// ============================================
// STATS CARD COMPONENT - DARK
// ============================================

function StatCard({ title, value, icon: Icon, color }) {
  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value?.toLocaleString() || 0}</p>
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminSmartShopPage() {
  const [loading, setLoading] = useState(true);
  const [shops, setShops] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  
  // Filtres
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState(""); // "", "active", "inactive"
  const [page, setPage] = useState(1);

  // Charger les données
  const loadData = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/smart-shop/boutiques?page=${page}&limit=20`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&status=${status}`;
      
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      
      if (data.success) {
        setShops(data.shops || []);
        setGlobalStats(data.globalStats || {});
        setPagination(data.pagination || { page: 1, totalPages: 1, totalCount: 0 });
      }
    } catch (error) {
      console.error("Erreur chargement:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, [page, status]);

  // Recherche avec debounce
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1);
      loadData();
    }, 300);
    return () => clearTimeout(timer);
  }, [search]);

  // Export CSV simple
  const exportCSV = () => {
    if (shops.length === 0) return;
    
    const headers = ["Nom", "Slug", "Email", "Produits", "Leads", "Statut", "Créée le"];
    const rows = shops.map(shop => [
      `"${shop.name}"`,
      shop.slug,
      shop.userId?.email || "—",
      shop.stats?.totalProducts || 0,
      shop.stats?.totalLeads || 0,
      shop.isActive ? "Active" : "Inactive",
      new Date(shop.createdAt).toLocaleDateString("fr-FR")
    ]);

    const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `boutiques-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white">Smart Shop</h1>
            <p className="text-slate-400 text-sm mt-1">Gestion des boutiques utilisateurs</p>
          </div>
          
          <button 
            onClick={exportCSV}
            disabled={shops.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-slate-700 text-white rounded-xl font-medium text-sm hover:bg-slate-600 disabled:opacity-50 border border-slate-600"
          >
            <Download className="w-4 h-4" />
            Exporter CSV
          </button>
        </div>

        {/* Stats Grid */}
        {globalStats && (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            <StatCard
              title="Total boutiques"
              value={globalStats.totalShops}
              icon={Store}
              color="bg-indigo-500"
            />
            <StatCard
              title="Boutiques actives"
              value={globalStats.activeShops}
              icon={TrendingUp}
              color="bg-emerald-500"
            />
            <StatCard
              title="Total produits"
              value={globalStats.totalProducts || 0}
              icon={Package}
              color="bg-blue-500"
            />
            <StatCard
              title="Total leads"
              value={globalStats.totalLeads || 0}
              icon={Users}
              color="bg-purple-500"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une boutique..."
              className="w-full pl-10 pr-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none text-white placeholder-slate-500"
            />
          </div>
          
          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-slate-800/50 border border-slate-700 rounded-xl focus:border-indigo-500 focus:outline-none text-white"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-20">
              <Store className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucune boutique trouvée</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Boutique</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Propriétaire</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Statut</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Produits</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Leads</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Créée le</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {shops.map((shop) => (
                      <tr key={shop._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {shop.logo ? (
                              <img src={shop.logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-slate-700 flex items-center justify-center">
                                <Store className="w-5 h-5 text-slate-400" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-white">{shop.name}</p>
                              <p className="text-xs text-slate-500">/{shop.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-white">{shop.userId?.firstName || "—"}</p>
                          <p className="text-xs text-slate-500">{shop.userId?.email || "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            shop.isActive 
                              ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/30" 
                              : "bg-slate-600/20 text-slate-400 border border-slate-600/30"
                          }`}>
                            {shop.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-white">{shop.stats?.totalProducts || 0}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-white">{shop.stats?.totalLeads || 0}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-400">
                            {new Date(shop.createdAt).toLocaleDateString("fr-FR", { 
                              day: "numeric", 
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <Link
                            href={`/shop/${shop.slug}`}
                            target="_blank"
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600/50"
                          >
                            <Eye className="w-4 h-4" />
                            Voir
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-slate-700">
                  <p className="text-sm text-slate-400">
                    Page {pagination.page} sur {pagination.totalPages} ({pagination.totalCount} boutiques)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-400"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="p-2 rounded-lg border border-slate-700 hover:bg-slate-700 disabled:opacity-50 disabled:cursor-not-allowed text-slate-400"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}