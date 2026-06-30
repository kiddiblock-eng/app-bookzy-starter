"use client";

import { useState, useEffect } from "react";
import { 
  FileText, TrendingUp, Clock, CheckCircle,
  Loader2, Download, Search, ChevronLeft, ChevronRight,
  Eye, XCircle, DollarSign
} from "lucide-react";
import Link from "next/link";

// ============================================
// STATS CARD COMPONENT
// ============================================

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-white rounded-2xl border border-neutral-200 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-neutral-600 mb-1">{title}</p>
          <p className="text-3xl font-bold tracking-tight text-neutral-900">{value}</p>
          {subtitle && (
            <p className="text-xs text-neutral-500 mt-1">{subtitle}</p>
          )}
        </div>
        <div className={`w-12 h-12 ${color} rounded-xl flex items-center justify-center`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
      </div>
    </div>
  );
}

// ============================================
// STATUS BADGE
// ============================================

function StatusBadge({ status }) {
  const config = {
    COMPLETED: { label: "Terminé", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    processing: { label: "En cours", bg: "bg-emerald-50", text: "text-emerald-700", border: "border-emerald-200" },
    DRAFT: { label: "Brouillon", bg: "bg-neutral-100", text: "text-neutral-600", border: "border-neutral-200" },
    ERROR: { label: "Erreur", bg: "bg-red-50", text: "text-red-700", border: "border-red-200" },
    PREVIEW_READY: { label: "Aperçu", bg: "bg-amber-50", text: "text-amber-700", border: "border-amber-200" },
  };

  const { label, bg, text, border } = config[status] || config.DRAFT;

  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium ${bg} ${text} border ${border}`}>
      {label}
    </span>
  );
}

// ============================================
// MAIN COMPONENT
// ============================================

export default function AdminExpressPage() {
  const [loading, setLoading] = useState(true);
  const [projets, setProjets] = useState([]);
  const [globalStats, setGlobalStats] = useState(null);
  const [pagination, setPagination] = useState({ page: 1, totalPages: 1, totalCount: 0 });
  
  // Filtres
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [page, setPage] = useState(1);

  // Charger les données
  const loadData = async () => {
    setLoading(true);
    try {
      let url = `/api/admin/express?page=${page}&limit=20`;
      if (search) url += `&search=${encodeURIComponent(search)}`;
      if (status) url += `&status=${status}`;
      
      const res = await fetch(url, { credentials: "include" });
      const data = await res.json();
      
      if (data.success) {
        setProjets(data.projets || []);
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

  // Export CSV
  const exportCSV = () => {
    if (projets.length === 0) return;
    
    const headers = ["Titre", "Email", "Statut", "Payé", "Chapitres", "IA utilisées", "Créé le"];
    const rows = projets.map(p => [
      `"${p.titre}"`,
      p.user?.email || "—",
      p.status,
      p.isPaid ? "Oui" : "Non",
      p.expressChapters?.length || 0,
      p.aiImprovementsUsed || 0,
      new Date(p.createdAt).toLocaleDateString("fr-FR")
    ]);

    const csv = [headers.join(","), ...rows.map(row => row.join(","))].join("\n");
    
    const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = `mises-en-page-${new Date().toISOString().split("T")[0]}.csv`;
    link.click();
  };

  // Formatage revenue
  const formatRevenue = (amount) => {
    if (!amount) return "0 FCFA";
    return `${amount.toLocaleString()} FCFA`;
  };

  return (
    <div className="min-h-screen">
      <div className="max-w-7xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
          <div>
            <h1 className="text-2xl font-bold text-neutral-900">Mises en Page</h1>
            <p className="text-neutral-500 text-sm mt-1">Bookzy Express - Import Word / Éditeur Pro</p>
          </div>

          <button
            onClick={exportCSV}
            disabled={projets.length === 0}
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
              title="Total mises en page"
              value={globalStats.total?.toLocaleString() || 0}
              icon={FileText}
              color="bg-emerald-500"
            />
            <StatCard
              title="Payées"
              value={globalStats.paid?.toLocaleString() || 0}
              subtitle={`${globalStats.total > 0 ? Math.round((globalStats.paid / globalStats.total) * 100) : 0}% de conversion`}
              icon={CheckCircle}
              color="bg-emerald-500"
            />
            <StatCard
              title="En attente"
              value={globalStats.pending?.toLocaleString() || 0}
              icon={Clock}
              color="bg-yellow-500"
            />
            <StatCard
              title="Revenue généré"
              value={formatRevenue(globalStats.revenue)}
              icon={DollarSign}
              color="bg-emerald-500"
            />
          </div>
        )}

        {/* Filters */}
        <div className="flex flex-col sm:flex-row gap-3 mb-6">
          {/* Search */}
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher par titre ou email..."
              className="w-full pl-10 pr-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 focus:outline-none text-neutral-900 placeholder-neutral-400"
            />
          </div>

          {/* Status filter */}
          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="px-4 py-2.5 bg-white border border-neutral-200 rounded-xl focus:border-emerald-500 focus:outline-none text-neutral-900"
          >
            <option value="">Tous les statuts</option>
            <option value="COMPLETED">Terminés</option>
            <option value="processing">En cours</option>
            <option value="DRAFT">Brouillons</option>
            <option value="ERROR">Erreurs</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-white rounded-2xl border border-neutral-200 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-neutral-500" />
            </div>
          ) : projets.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-neutral-400 mx-auto mb-3" />
              <p className="text-neutral-500">Aucune mise en page trouvée</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-neutral-50 border-b border-neutral-200">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Projet</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Utilisateur</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Statut</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Payé</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Chapitres</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">IA</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Créé le</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-neutral-500 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-neutral-200">
                    {projets.map((projet) => (
                      <tr key={projet._id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-neutral-100 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-neutral-500" />
                            </div>
                            <div>
                              <p className="font-medium text-neutral-900 truncate max-w-[200px]">{projet.titre}</p>
                              <p className="text-xs text-neutral-500">{projet.template || "modern"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-neutral-900">{projet.user?.firstName || "—"}</p>
                          <p className="text-xs text-neutral-500">{projet.user?.email || "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={projet.status} />
                        </td>
                        <td className="px-5 py-4">
                          {projet.isPaid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-600 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Oui
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-neutral-500 text-sm">
                              <XCircle className="w-4 h-4" />
                              Non
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-neutral-900">{projet.expressChapters?.length || 0}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-neutral-900">
                            {projet.aiImprovementsUsed || 0}
                            {projet.aiImprovementsUsed > 5 && (
                              <span className="text-amber-600 ml-1">(+{projet.aiImprovementsUsed - 5})</span>
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-neutral-500">
                            {new Date(projet.createdAt).toLocaleDateString("fr-FR", {
                              day: "numeric",
                              month: "short",
                              year: "numeric"
                            })}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          {projet.pdfUrl ? (
                            <a
                              href={projet.pdfUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-neutral-700 hover:text-neutral-900 bg-neutral-100 hover:bg-neutral-200 rounded-lg transition-colors border border-neutral-200"
                            >
                              <Eye className="w-4 h-4" />
                              PDF
                            </a>
                          ) : (
                            <span className="text-neutral-500 text-sm">—</span>
                          )}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between px-5 py-4 border-t border-neutral-200">
                  <p className="text-sm text-neutral-500">
                    Page {pagination.page} sur {pagination.totalPages} ({pagination.totalCount} projets)
                  </p>
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                      className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-500"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => setPage(p => Math.min(pagination.totalPages, p + 1))}
                      disabled={page === pagination.totalPages}
                      className="p-2 rounded-lg border border-neutral-200 hover:bg-neutral-100 disabled:opacity-50 disabled:cursor-not-allowed text-neutral-500"
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