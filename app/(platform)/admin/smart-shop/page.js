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
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-600 mb-1">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-neutral-900">{value?.toLocaleString() || 0}</p>
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
    <div className="min-h-screen bg-neutral-50">
      <div className="max-w-7xl mx-auto px-4 py-6">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-neutral-900">Smart Shop</h1>
            <p className="text-neutral-600 text-sm mt-1">Gestion des boutiques utilisateurs</p>
          </div>

          <button
            onClick={exportCSV}
            disabled={shops.length === 0}
            className="flex items-center gap-2 px-4 py-2 bg-neutral-900 text-white rounded-xl font-medium text-sm hover:bg-neutral-800 disabled:opacity-50"
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
              color="bg-neutral-900"
            />
            <StatCard
              title="Boutiques actives"
              value={globalStats.activeShops}
              icon={TrendingUp}
              color="bg-emerald-600"
            />
            <StatCard
              title="Total produits"
              value={globalStats.totalProducts || 0}
              icon={Package}
              color="bg-neutral-900"
            />
            <StatCard
              title="Total leads"
              value={globalStats.totalLeads || 0}
              icon={Users}
              color="bg-neutral-900"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher une boutique..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-600 focus:outline-none text-neutral-900 placeholder-neutral-400"
            />
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-600 focus:outline-none text-neutral-900"
          >
            <option value="">Tous les statuts</option>
            <option value="active">Actives</option>
            <option value="inactive">Inactives</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="p-5 space-y-3">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-neutral-100 animate-pulse" />
                  <div className="flex-1 space-y-2">
                    <div className="h-3 w-1/3 bg-neutral-100 rounded animate-pulse" />
                    <div className="h-3 w-1/4 bg-neutral-100 rounded animate-pulse" />
                  </div>
                  <div className="h-6 w-20 bg-neutral-100 rounded-full animate-pulse" />
                </div>
              ))}
            </div>
          ) : shops.length === 0 ? (
            <div className="text-center py-20">
              <Store className="w-12 h-12 text-neutral-300 mx-auto mb-3" />
              <p className="text-neutral-600">Aucune boutique trouvée</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Boutique</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Propriétaire</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Statut</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Produits</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Leads</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Créée le</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-100">
                    {shops.map((shop) => (
                      <tr key={shop._id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            {shop.logo ? (
                              <img src={shop.logo} alt="" className="w-10 h-10 rounded-full object-cover" />
                            ) : (
                              <div className="w-10 h-10 rounded-full bg-neutral-100 flex items-center justify-center">
                                <Store className="w-5 h-5 text-neutral-500" />
                              </div>
                            )}
                            <div>
                              <p className="font-medium text-neutral-900">{shop.name}</p>
                              <p className="text-xs text-neutral-500">/{shop.slug}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-neutral-900">{shop.userId?.firstName || "—"}</p>
                          <p className="text-xs text-neutral-500">{shop.userId?.email || "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${
                            shop.isActive
                              ? "bg-emerald-50 text-emerald-700 border border-emerald-200"
                              : "bg-neutral-100 text-neutral-600 border border-neutral-200"
                          }`}>
                            {shop.isActive ? "Active" : "Inactive"}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-neutral-900">{shop.stats?.totalProducts || 0}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-neutral-900">{shop.stats?.totalLeads || 0}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-neutral-600">
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
                            className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
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
                <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-600">
                    Page {pagination.page} sur {pagination.totalPages} ({pagination.totalCount} boutiques)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-600"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-600"
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