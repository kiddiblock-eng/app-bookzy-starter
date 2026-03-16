"use client";

import { useState, useEffect } from "react";
import { 
  FileText, TrendingUp, Clock, CheckCircle,
  Loader2, Download, Search, ChevronLeft, ChevronRight,
  Eye, XCircle, DollarSign
} from "lucide-react";
import Link from "next/link";

// ============================================
// STATS CARD COMPONENT - DARK
// ============================================

function StatCard({ title, value, subtitle, icon: Icon, color }) {
  return (
    <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 p-5">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-slate-400 mb-1">{title}</p>
          <p className="text-3xl font-bold text-white">{value}</p>
          {subtitle && (
            <p className="text-xs text-slate-500 mt-1">{subtitle}</p>
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
    COMPLETED: { label: "Terminé", bg: "bg-emerald-500/20", text: "text-emerald-400", border: "border-emerald-500/30" },
    processing: { label: "En cours", bg: "bg-blue-500/20", text: "text-blue-400", border: "border-blue-500/30" },
    DRAFT: { label: "Brouillon", bg: "bg-slate-600/20", text: "text-slate-400", border: "border-slate-600/30" },
    ERROR: { label: "Erreur", bg: "bg-red-500/20", text: "text-red-400", border: "border-red-500/30" },
    PREVIEW_READY: { label: "Aperçu", bg: "bg-yellow-500/20", text: "text-yellow-400", border: "border-yellow-500/30" },
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
            <h1 className="text-2xl font-bold text-white">Mises en Page</h1>
            <p className="text-slate-400 text-sm mt-1">Bookzy Express - Import Word / Éditeur Pro</p>
          </div>
          
          <button 
            onClick={exportCSV}
            disabled={projets.length === 0}
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
              title="Total mises en page"
              value={globalStats.total?.toLocaleString() || 0}
              icon={FileText}
              color="bg-indigo-500"
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
              placeholder="Rechercher par titre ou email..."
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
            <option value="COMPLETED">Terminés</option>
            <option value="processing">En cours</option>
            <option value="DRAFT">Brouillons</option>
            <option value="ERROR">Erreurs</option>
          </select>
        </div>

        {/* Table */}
        <div className="bg-slate-800/50 rounded-2xl border border-slate-700/50 overflow-hidden">
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="w-8 h-8 animate-spin text-slate-500" />
            </div>
          ) : projets.length === 0 ? (
            <div className="text-center py-20">
              <FileText className="w-12 h-12 text-slate-600 mx-auto mb-3" />
              <p className="text-slate-400">Aucune mise en page trouvée</p>
            </div>
          ) : (
            <>
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-slate-900/50 border-b border-slate-700">
                    <tr>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Projet</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Utilisateur</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Statut</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Payé</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Chapitres</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">IA</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Créé le</th>
                      <th className="px-5 py-3 text-left text-xs font-medium text-slate-400 uppercase">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-700/50">
                    {projets.map((projet) => (
                      <tr key={projet._id} className="hover:bg-slate-700/30 transition-colors">
                        <td className="px-5 py-4">
                          <div className="flex items-center gap-3">
                            <div className="w-10 h-10 rounded-lg bg-slate-700 flex items-center justify-center">
                              <FileText className="w-5 h-5 text-slate-400" />
                            </div>
                            <div>
                              <p className="font-medium text-white truncate max-w-[200px]">{projet.titre}</p>
                              <p className="text-xs text-slate-500">{projet.template || "modern"}</p>
                            </div>
                          </div>
                        </td>
                        <td className="px-5 py-4">
                          <p className="text-sm text-white">{projet.user?.firstName || "—"}</p>
                          <p className="text-xs text-slate-500">{projet.user?.email || "—"}</p>
                        </td>
                        <td className="px-5 py-4">
                          <StatusBadge status={projet.status} />
                        </td>
                        <td className="px-5 py-4">
                          {projet.isPaid ? (
                            <span className="inline-flex items-center gap-1 text-emerald-400 text-sm">
                              <CheckCircle className="w-4 h-4" />
                              Oui
                            </span>
                          ) : (
                            <span className="inline-flex items-center gap-1 text-slate-500 text-sm">
                              <XCircle className="w-4 h-4" />
                              Non
                            </span>
                          )}
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm font-medium text-white">{projet.expressChapters?.length || 0}</span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-white">
                            {projet.aiImprovementsUsed || 0}
                            {projet.aiImprovementsUsed > 5 && (
                              <span className="text-orange-400 ml-1">(+{projet.aiImprovementsUsed - 5})</span>
                            )}
                          </span>
                        </td>
                        <td className="px-5 py-4">
                          <span className="text-sm text-slate-400">
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
                              className="inline-flex items-center gap-1 px-3 py-1.5 text-sm text-slate-300 hover:text-white bg-slate-700/50 hover:bg-slate-700 rounded-lg transition-colors border border-slate-600/50"
                            >
                              <Eye className="w-4 h-4" />
                              PDF
                            </a>
                          ) : (
                            <span className="text-slate-600 text-sm">—</span>
                          )}
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
                    Page {pagination.page} sur {pagination.totalPages} ({pagination.totalCount} projets)
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