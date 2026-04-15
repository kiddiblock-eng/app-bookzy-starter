"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { Search, ChevronRight, Flame, Gem, TrendingUp, Clock, BarChart2, ArrowLeft } from "lucide-react";

export default function ResultatsPage() {
  const router = useRouter();
  const [analyses, setAnalyses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [search, setSearch] = useState("");

  useEffect(() => {
    fetchHistory();
  }, [page]);

  const fetchHistory = async () => {
    try {
      setLoading(true);
      const res = await fetch(`/api/niche-hunter/history?page=${page}`, {
        credentials: "include",
      });
      const data = await res.json();
      if (data.success) {
        setAnalyses(data.data);
        setTotalPages(data.pagination.totalPages);
      }
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  const getBadgeIcon = (badge) => {
    if (badge === "gem") return <Gem className="w-3 h-3" />;
    if (badge === "trending") return <TrendingUp className="w-3 h-3" />;
    return <Flame className="w-3 h-3" />;
  };

  const getBadgeStyle = (badge) => {
    if (badge === "gem") return "bg-purple-50 text-purple-700 border-purple-200";
    if (badge === "trending") return "bg-blue-50 text-blue-700 border-blue-200";
    return "bg-orange-50 text-orange-700 border-orange-200";
  };

  const filtered = analyses.filter(a =>
    a.theme.toLowerCase().includes(search.toLowerCase())
  );

  const formatDate = (date) => {
    return new Date(date).toLocaleDateString("fr-FR", {
      day: "numeric", month: "short", year: "numeric"
    });
  };

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Header */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="max-w-3xl mx-auto px-4 py-3 flex items-center gap-3">
          <button onClick={() => router.back()} className="p-2 text-slate-400 hover:text-slate-600 hover:bg-slate-100 rounded-lg transition-all">
            <ArrowLeft className="w-5 h-5" />
          </button>
          <div className="flex-1">
            <h1 className="text-sm font-bold text-slate-900">Mes résultats</h1>
            <p className="text-xs text-slate-400">Toutes tes recherches de niches</p>
          </div>
          <button
            onClick={() => router.push("/dashboard/niche-hunter")}
            className="px-3 py-2 bg-slate-900 text-white text-xs font-semibold rounded-lg hover:bg-slate-800 transition-all"
          >
            + Nouvelle recherche
          </button>
        </div>
      </div>

      <div className="max-w-3xl mx-auto px-4 py-6">

        {/* Search */}
        <div className="relative mb-5">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
          <input
            type="text"
            value={search}
            onChange={e => setSearch(e.target.value)}
            placeholder="Rechercher un thème..."
            className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:ring-2 focus:ring-slate-900 transition-all"
          />
        </div>

        {/* Loading */}
        {loading && (
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-white border border-slate-200 rounded-2xl p-5 animate-pulse">
                <div className="h-4 bg-slate-100 rounded w-1/3 mb-3" />
                <div className="h-3 bg-slate-100 rounded w-1/4 mb-4" />
                <div className="flex gap-2">
                  <div className="h-6 bg-slate-100 rounded-full w-24" />
                  <div className="h-6 bg-slate-100 rounded-full w-32" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty */}
        {!loading && filtered.length === 0 && (
          <div className="text-center py-16">
            <div className="text-4xl mb-3">🔍</div>
            <p className="text-slate-900 font-semibold mb-1">Aucune recherche trouvée</p>
            <p className="text-sm text-slate-500 mb-6">Lance ta première analyse de niche</p>
            <button
              onClick={() => router.push("/dashboard/niche-hunter")}
              className="px-5 py-2.5 bg-slate-900 text-white text-sm font-medium rounded-xl"
            >
              Commencer
            </button>
          </div>
        )}

        {/* Liste */}
        {!loading && filtered.length > 0 && (
          <div className="space-y-3">
            {filtered.map(a => (
              <button
                key={a.id}
                onClick={() => router.push(`/dashboard/niche-hunter/resultats/${a.id}`)}
                className="w-full bg-white border border-slate-200 rounded-2xl p-5 hover:border-slate-300 hover:shadow-sm transition-all text-left"
              >
                <div className="flex items-start justify-between mb-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="font-semibold text-slate-900 capitalize mb-0.5 truncate">{a.theme}</h3>
                    <div className="flex items-center gap-2 text-xs text-slate-400">
                      <Clock className="w-3 h-3" />
                      <span>{formatDate(a.createdAt)}</span>
                      <span>·</span>
                      <BarChart2 className="w-3 h-3" />
                      <span>{a.totalNiches} idées</span>
                      {a.analyzedCount > 0 && (
                        <>
                          <span>·</span>
                          <span className="text-emerald-600 font-medium">{a.analyzedCount} analysées</span>
                        </>
                      )}
                    </div>
                  </div>
                  <ChevronRight className="w-4 h-4 text-slate-400 flex-shrink-0 mt-0.5" />
                </div>

                {/* Top niches aperçu */}
                {a.topNiches?.length > 0 && (
                  <div className="flex flex-wrap gap-2">
                    {a.topNiches.map((n, i) => (
                      <div key={i} className={`inline-flex items-center gap-1 px-2 py-1 text-xs font-medium rounded-full border ${getBadgeStyle(n.badge)}`}>
                        {getBadgeIcon(n.badge)}
                        <span className="max-w-[140px] truncate">{n.title}</span>
                        {n.analyzed && <span className="text-emerald-500">✓</span>}
                      </div>
                    ))}
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Pagination */}
        {totalPages > 1 && (
          <div className="flex items-center justify-center gap-3 mt-6">
            <button
              onClick={() => setPage(p => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-all"
            >
              Précédent
            </button>
            <span className="text-sm text-slate-500">{page} / {totalPages}</span>
            <button
              onClick={() => setPage(p => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-4 py-2 text-sm font-medium text-slate-700 bg-white border border-slate-200 rounded-lg disabled:opacity-40 hover:bg-slate-50 transition-all"
            >
              Suivant
            </button>
          </div>
        )}
      </div>
    </div>
  );
}