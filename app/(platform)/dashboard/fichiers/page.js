"use client";

import { useState, useMemo } from "react";
import useSWR from "swr";
import {
  FileText, Download, Clock, Plus, Search,
  LayoutGrid, List, CheckCircle2, AlertCircle,
  Loader2, RefreshCw, BookOpen, MoreVertical, Package,
  Trash2, Eye, Store
} from "lucide-react";

const fetcher = (url) => fetch(url, {
  credentials: "include",
  cache: "no-store",
  headers: { "Content-Type": "application/json", "Pragma": "no-cache" }
}).then(r => r.ok ? r.json() : null);

export default function EbooksPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const { data, isLoading, mutate } = useSWR("/api/ebooks/user", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 0,
  });

  const ebooks = data?.ebooks || [];

  const { items, stats } = useMemo(() => {
    const mapped = ebooks.map((e) => {
      const timeElapsed = e.updatedAt ? Date.now() - new Date(e.updatedAt).getTime() : 0;
      const isStuck = ["processing", "generated_text", "DRAFT"].includes(e.status) && timeElapsed > 10 * 60 * 1000;
      const statut = e.status === "COMPLETED" && e.fileUrl ? "terminé"
        : e.status === "ERROR" || isStuck ? "erreur"
        : "en cours";
      return {
        id: e._id,
        titre: e.title || "Ebook sans titre",
        pages: e.pages || 0,
        template: e.template || "standard",
        createdAt: e.createdAt,
        fileUrl: e.fileUrl || "",
        isPaid: e.isPaid,
        retryCount: e.retryCount || 0,
        hasMarketing: e.hasMarketing,
        statut,
      };
    }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

    const stats = {
      total: mapped.length,
      prets: mapped.filter(e => e.statut === "terminé").length,
      enCours: mapped.filter(e => e.statut === "en cours").length,
      erreurs: mapped.filter(e => e.statut === "erreur").length,
    };

    return { items: mapped, stats };
  }, [ebooks]);

  const filtered = items.filter((e) => {
    const matchSearch = e.titre.toLowerCase().includes(search.toLowerCase());
    const matchFilter = filter === "all" || e.statut === filter;
    return matchSearch && matchFilter;
  });

  if (isLoading) return <PageSkeleton />;

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mes Ebooks</h1>
            <p className="text-sm text-slate-400 mt-0.5">{stats.total} ebook{stats.total > 1 ? "s" : ""}</p>
          </div>
          <a
            href="/dashboard/projets/nouveau"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Générer un ebook</span>
            <span className="sm:hidden">Créer</span>
          </a>
        </div>

        {/* Filtres + recherche */}
        {items.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-7">
            <div className="flex items-center gap-2 flex-wrap">
              <FilterPill label="Tous" count={stats.total} active={filter === "all"} onClick={() => setFilter("all")} />
              <FilterPill label="Prêts" count={stats.prets} active={filter === "terminé"} onClick={() => setFilter("terminé")} dot="emerald" />
              <FilterPill label="En cours" count={stats.enCours} active={filter === "en cours"} onClick={() => setFilter("en cours")} dot="slate" />
              {stats.erreurs > 0 && (
                <FilterPill label="Erreurs" count={stats.erreurs} active={filter === "erreur"} onClick={() => setFilter("erreur")} dot="red" />
              )}
            </div>
            <div className="flex-1" />
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-slate-200 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-32"
                />
              </div>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-600"}`}>
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grille */}
        {filtered.length > 0 ? (
          <div className={`grid gap-3 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filtered.map((e) => (
              <EbookCard key={e.id} ebook={e} viewMode={viewMode} onDeleted={mutate} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white">
            <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-700 mb-1">Aucun ebook</h3>
            <p className="text-sm text-slate-400 mb-5">Générez votre premier ebook en quelques secondes.</p>
            <a href="/dashboard/projets/nouveau" className="text-sm font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-600">
              Commencer →
            </a>
          </div>
        )}

      </main>
    </div>
  );
}

/* ── Filter pill ── */
function FilterPill({ label, count, active, onClick, dot }) {
  const dotColors = { emerald: "bg-emerald-400", slate: "bg-slate-400", red: "bg-red-400" };
  return (
    <button
      onClick={onClick}
      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all select-none ${
        active ? "bg-slate-900 text-white border-slate-900" : "bg-white text-slate-600 border-slate-200 hover:border-slate-300"
      }`}
    >
      {dot && !active && <span className={`w-1.5 h-1.5 rounded-full flex-shrink-0 ${dotColors[dot]}`} />}
      {label}
      <span className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"}`}>
        {count}
      </span>
    </button>
  );
}

/* ── Menu 3-points : actions ebook ── */
function KebabMenu({ ebook, onDeleted }) {
  const [open, setOpen] = useState(false);
  const [deleting, setDeleting] = useState(false);

  const handleDelete = async () => {
    if (deleting) return;
    if (!window.confirm(`Supprimer « ${ebook.titre} » ? Cette action est définitive.`)) return;
    setDeleting(true);
    try {
      const res = await fetch(`/api/projets/${ebook.id}`, { method: "DELETE", credentials: "include" });
      const data = await res.json();
      if (data.success) { setOpen(false); onDeleted?.(); }
      else { alert(data.message || "Erreur lors de la suppression."); setDeleting(false); }
    } catch { alert("Erreur réseau."); setDeleting(false); }
  };

  return (
    <div className="relative">
      <button
        onClick={() => setOpen((v) => !v)}
        className="p-2 text-slate-300 hover:text-slate-500 border border-slate-200 rounded-lg transition-colors"
        aria-label="Actions"
      >
        <MoreVertical className="w-3.5 h-3.5" />
      </button>
      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute right-0 mt-1 w-52 bg-white border border-slate-200 rounded-xl shadow-lg z-20 overflow-hidden py-1">
            <a href={`/dashboard/fichiers/${ebook.id}`} className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50">
              <Eye className="w-4 h-4 text-slate-400" /> Voir
            </a>
            <a
              href="https://taliopay.com"
              target="_blank"
              rel="noopener noreferrer"
              onClick={() => setOpen(false)}
              className="flex items-center gap-2 px-3 py-2.5 text-sm text-slate-700 hover:bg-slate-50"
            >
              <Store className="w-4 h-4 text-slate-400" /> Vendre sur Taliopay
            </a>
            <div className="my-1 border-t border-slate-100" />
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="flex items-center gap-2 w-full px-3 py-2.5 text-sm text-red-600 hover:bg-red-50 disabled:opacity-50"
            >
              <Trash2 className="w-4 h-4" /> {deleting ? "Suppression…" : "Supprimer"}
            </button>
          </div>
        </>
      )}
    </div>
  );
}

/* ── Card ebook ── */
function EbookCard({ ebook, viewMode, onDeleted }) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState(null);
  const [showProgress, setShowProgress] = useState(false);
  const [progressData, setProgressData] = useState({ progress: 0, status: "processing" });
  const isList = viewMode === "list";

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    setRetryError(null);
    try {
      const res = await fetch("/api/ebooks/generate", {
        method: "POST",
        credentials: "include",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ projetId: ebook.id }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setRetryError(data.message || data.error || "Erreur lors de la relance.");
        setIsRetrying(false);
        return;
      }
      setShowProgress(true);
      setProgressData({ progress: 5, status: "processing" });
    } catch { setRetryError("Erreur réseau."); setIsRetrying(false); }
  };

  const canRetry = ebook.isPaid && ebook.statut === "erreur" && ebook.retryCount < 3;

  /* Vue liste */
  if (isList) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl flex items-center gap-4 px-4 py-3.5 hover:border-slate-300 transition-colors">
        <div className="w-9 h-12 rounded-md bg-slate-100 flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-slate-400" />
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{ebook.titre}</p>
          <p className="text-xs text-slate-400 mt-0.5">{ebook.pages} pages · {new Date(ebook.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
        <StatusChip status={ebook.statut} />
        <div className="flex items-center gap-2 flex-shrink-0">
          {ebook.statut === "terminé" && ebook.fileUrl && (
            <>
              <a href={`/dashboard/fichiers/${ebook.id}`} className="text-xs font-semibold text-slate-500 hover:text-slate-900 transition-colors px-3 py-1.5 border border-slate-200 rounded-lg hover:border-slate-300">
                Voir le kit
              </a>
              <a href={ebook.fileUrl} download className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
                <Download className="w-3.5 h-3.5" /> PDF
              </a>
            </>
          )}
          {ebook.statut === "erreur" && canRetry && (
            <button onClick={handleRetry} disabled={isRetrying}
              className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
              {isRetrying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Relancer
            </button>
          )}
          <KebabMenu ebook={ebook} onDeleted={onDeleted} />
        </div>
      </div>
    );
  }

  /* Vue grille */
  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all flex flex-col">

        {/* Cover sobre */}
        <div className="relative h-40 bg-slate-50 border-b border-slate-100 flex flex-col justify-between p-4">
          <div className="absolute inset-0 opacity-[0.035]"
            style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "18px 18px" }} />
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ebook</span>
            <StatusChip status={ebook.statut} />
          </div>
          <p className="relative z-10 text-sm font-bold text-slate-800 leading-snug line-clamp-3">{ebook.titre}</p>
        </div>

        {/* Infos + actions */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{ebook.pages} pages</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(ebook.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>

          <div className="flex items-center gap-2 mt-auto">
            {ebook.statut === "terminé" && ebook.fileUrl ? (
              <>
                <a href={`/dashboard/fichiers/${ebook.id}`}
                  className="flex-1 flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-semibold transition-colors">
                  <Package className="w-3.5 h-3.5" /> Voir le kit
                </a>
                <a href={ebook.fileUrl} download
                  className="p-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg transition-colors" title="Télécharger PDF">
                  <Download className="w-3.5 h-3.5" />
                </a>
              </>
            ) : ebook.statut === "en cours" ? (
              <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 text-slate-500 py-2 rounded-lg text-xs font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> En cours...
              </div>
            ) : ebook.statut === "erreur" && canRetry ? (
              <div className="flex-1 flex flex-col gap-1">
                {retryError && <p className="text-[10px] text-red-500 text-center">{retryError}</p>}
                <button onClick={handleRetry} disabled={isRetrying}
                  className="w-full flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                  {isRetrying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  {isRetrying ? "Relance..." : `Relancer (${3 - ebook.retryCount} restant${3 - ebook.retryCount > 1 ? "s" : ""})`}
                </button>
              </div>
            ) : ebook.statut === "erreur" && ebook.retryCount >= 3 ? (
              <a href="mailto:support@bookzy.io?subject=Problème génération eBook"
                className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 py-2 rounded-lg text-xs font-semibold transition-colors">
                <AlertCircle className="w-3.5 h-3.5" /> Support
              </a>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-400 py-2 rounded-lg text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Erreur
              </div>
            )}
            <KebabMenu ebook={ebook} onDeleted={onDeleted} />
          </div>
        </div>
      </div>

      {showProgress && (
        <ProgressModal
          titre={ebook.titre}
          progress={progressData.progress}
          status={progressData.status}
          pdfUrl={progressData.pdfUrl}
          ebookId={ebook.id}
          onClose={() => { setShowProgress(false); window.location.reload(); }}
        />
      )}
    </>
  );
}

/* ── Status chip ── */
function StatusChip({ status }) {
  if (status === "terminé") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-emerald-50 text-emerald-600 border border-emerald-100">
      <CheckCircle2 className="w-2.5 h-2.5" /> Prêt
    </span>
  );
  if (status === "en cours") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-slate-100 text-slate-500 border border-slate-200">
      <Loader2 className="w-2.5 h-2.5 animate-spin" /> En cours
    </span>
  );
  if (status === "erreur") return (
    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-semibold bg-red-50 text-red-500 border border-red-100">
      <AlertCircle className="w-2.5 h-2.5" /> Erreur
    </span>
  );
  return null;
}

/* ── Progress modal (retry) ── */
function ProgressModal({ titre, progress, status, pdfUrl, ebookId, onClose }) {
  const [data, setData] = useState({ progress, status, pdfUrl });

  // Poll progress
  useState(() => {
    if (data.status === "COMPLETED" || data.status === "ERROR") return;
    const iv = setInterval(async () => {
      try {
        const res = await fetch(`/api/ebooks/progress/${ebookId}`);
        const d = await res.json();
        if (d.success) {
          setData({ progress: d.progress || 0, status: d.status, pdfUrl: d.pdfUrl });
          if (d.status === "COMPLETED" || d.status === "ERROR") clearInterval(iv);
        }
      } catch {}
    }, 2000);
    return () => clearInterval(iv);
  }, []);

  const msg = data.status === "COMPLETED" ? "Ebook prêt !"
    : data.status === "ERROR" ? "Génération échouée"
    : data.progress < 30 ? "Génération du plan..."
    : data.progress < 70 ? "Rédaction des chapitres..."
    : data.progress < 90 ? "Création du PDF..."
    : "Finalisation...";

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-7">
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            {data.status === "COMPLETED" ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              : data.status === "ERROR" ? <AlertCircle className="w-6 h-6 text-red-400" />
              : <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />}
          </div>
        </div>
        <h3 className="text-base font-bold text-slate-900 text-center mb-1">{msg}</h3>
        <p className="text-sm text-slate-400 text-center line-clamp-1 mb-5">{titre}</p>

        {data.status !== "COMPLETED" && data.status !== "ERROR" && (
          <div className="mb-5">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-800 rounded-full transition-all duration-500" style={{ width: `${Math.min(data.progress, 100)}%` }} />
            </div>
            <p className="text-xs text-slate-400 text-right mt-1.5 font-medium">{Math.min(data.progress, 100)}%</p>
          </div>
        )}

        {data.status === "COMPLETED" && data.pdfUrl && (
          <a href={data.pdfUrl} download onClick={() => setTimeout(onClose, 800)}
            className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors mb-3">
            <Download className="w-4 h-4" /> Télécharger
          </a>
        )}

        <button onClick={onClose} className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
          {data.status !== "COMPLETED" && data.status !== "ERROR" ? "Continuer en arrière-plan" : "Fermer"}
        </button>
      </div>
    </div>
  );
}

/* ── Skeleton ── */
function PageSkeleton() {
  return (
    <div className="min-h-screen bg-[#FAFAFA]">
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
        <div className="h-8 w-48 bg-slate-100 rounded mb-10 animate-pulse" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3">
          {[...Array(8)].map((_, i) => <div key={i} className="h-56 bg-slate-100 rounded-xl animate-pulse" />)}
        </div>
      </main>
    </div>
  );
}