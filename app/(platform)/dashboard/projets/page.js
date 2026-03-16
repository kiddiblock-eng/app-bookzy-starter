"use client";

import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import {
  FileText, Clock, Plus, Search, LayoutGrid, List,
  Download, CheckCircle2, AlertCircle, MoreVertical,
  Loader2, RefreshCw, BookOpen
} from "lucide-react";

const fetcher = (url) => fetch(url, {
  credentials: "include",
  cache: "no-store",
  headers: { "Content-Type": "application/json", "Pragma": "no-cache" }
}).then(r => r.ok ? r.json() : null);

export default function ProjetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  const { data: ebooksData, isLoading: loading } = useSWR("/api/ebooks/user", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 0,
  });

  const ebooks = ebooksData?.ebooks || [];

  const { projets, statsApi } = useMemo(() => {
    const completed = ebooks.filter(e => e.fileUrl || e.status === "COMPLETED");
    const enCours = ebooks.filter(e => !e.fileUrl && e.status !== "COMPLETED");
    const stats = { total: ebooks.length, kits: completed.length, enCours: enCours.length };

    const mapped = ebooks.map((e) => {
      const timeElapsed = e.updatedAt ? Date.now() - new Date(e.updatedAt).getTime() : 0;
      const isStuck = (e.status === "processing" || e.status === "generated_text" || e.status === "DRAFT") && timeElapsed > 10 * 60 * 1000;
      return {
        _id: e._id,
        titre: e.title || "Livre sans titre",
        description: e.description,
        pages: e.pages,
        createdAt: e.createdAt,
        fileUrl: e.fileUrl,
        retryCount: e.retryCount || 0,
        isPaid: e.isPaid,
        statut: e.status === "COMPLETED" && e.fileUrl ? "terminé"
              : e.status === "ERROR" || isStuck ? "erreur"
              : "en cours"
      };
    });

    return { projets: mapped, statsApi: stats };
  }, [ebooks]);

  const filteredProjets = projets.filter((p) => {
    const titre = (p.titre || "").toLowerCase();
    const matchesSearch = titre.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" ? true : p.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-[#FAFAFA]">
        <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">
          <div className="h-8 w-48 bg-slate-100 rounded mb-10 animate-pulse" />
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {[...Array(8)].map(i => (
              <div key={i} className="h-56 bg-slate-100 rounded-xl animate-pulse" />
            ))}
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#FAFAFA] font-sans">
      <main className="max-w-6xl mx-auto px-5 sm:px-8 py-10">

        {/* Header */}
        <div className="flex items-center justify-between mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900 tracking-tight">Mes projets</h1>
            <p className="text-sm text-slate-400 mt-0.5">{statsApi.total} ebook{statsApi.total > 1 ? "s" : ""}</p>
          </div>
          <a
            href="/dashboard/projets/nouveau"
            className="flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-4 py-2.5 rounded-lg text-sm font-semibold transition-colors"
          >
            <Plus className="w-4 h-4" />
            <span className="hidden sm:inline">Nouveau ebook</span>
            <span className="sm:hidden">Créer</span>
          </a>
        </div>

        {/* Stats + filtres */}
        {projets.length > 0 && (
          <div className="flex flex-col sm:flex-row sm:items-center gap-4 mb-7">
            {/* Stats pills */}
            <div className="flex items-center gap-2">
              <StatPill label="Tous" value={statsApi.total} active={filterStatus === "all"} onClick={() => setFilterStatus("all")} />
              <StatPill label="Prêts" value={statsApi.kits} active={filterStatus === "terminé"} onClick={() => setFilterStatus("terminé")} accent />
              <StatPill label="En cours" value={statsApi.enCours} active={filterStatus === "en cours"} onClick={() => setFilterStatus("en cours")} />
              <StatPill label="Erreurs" value={projets.filter(p => p.statut === "erreur").length} active={filterStatus === "erreur"} onClick={() => setFilterStatus("erreur")} danger />
            </div>

            {/* Spacer */}
            <div className="flex-1" />

            {/* Search + view toggle */}
            <div className="flex items-center gap-2">
              <div className="flex items-center gap-2 bg-white border border-slate-200 rounded-lg px-3 py-2 focus-within:ring-2 focus-within:ring-slate-200 transition-all">
                <Search className="w-3.5 h-3.5 text-slate-400 flex-shrink-0" />
                <input
                  type="text"
                  placeholder="Rechercher..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="bg-transparent outline-none text-sm text-slate-700 placeholder:text-slate-400 w-36"
                />
              </div>
              <div className="flex items-center bg-white border border-slate-200 rounded-lg p-1">
                <button
                  onClick={() => setViewMode("grid")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "grid" ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <LayoutGrid className="w-3.5 h-3.5" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={`p-1.5 rounded-md transition-colors ${viewMode === "list" ? "bg-slate-100 text-slate-700" : "text-slate-400 hover:text-slate-600"}`}
                >
                  <List className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Grille ou liste */}
        {filteredProjets.length > 0 ? (
          <div className={`grid gap-3 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
            {filteredProjets.map((projet) => (
              <ProjectCard key={projet._id} projet={projet} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-24 border border-dashed border-slate-200 rounded-2xl bg-white">
            <BookOpen className="w-10 h-10 text-slate-200 mx-auto mb-4" />
            <h3 className="text-base font-semibold text-slate-700 mb-1">Aucun projet</h3>
            <p className="text-sm text-slate-400 mb-5">Créez votre premier ebook en quelques secondes.</p>
            <a href="/dashboard/projets/nouveau" className="text-sm font-semibold text-slate-900 underline underline-offset-4 hover:text-slate-600">
              Commencer →
            </a>
          </div>
        )}
      </main>
    </div>
  );
}

/* ── Stat pill cliquable ── */
function StatPill({ label, value, active, onClick, accent, danger }) {
  let base = "flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold cursor-pointer transition-all border select-none";
  if (active) {
    base += " bg-slate-900 text-white border-slate-900";
  } else if (accent) {
    base += " bg-white text-slate-600 border-slate-200 hover:border-slate-300";
  } else if (danger) {
    base += " bg-white text-slate-600 border-slate-200 hover:border-slate-300";
  } else {
    base += " bg-white text-slate-600 border-slate-200 hover:border-slate-300";
  }
  return (
    <button className={base} onClick={onClick}>
      {value > 0 && accent && !active && <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 flex-shrink-0" />}
      {value > 0 && danger && !active && <span className="w-1.5 h-1.5 rounded-full bg-red-400 flex-shrink-0" />}
      <span>{label}</span>
      <span className={`${active ? "bg-white/20 text-white" : "bg-slate-100 text-slate-500"} px-1.5 py-0.5 rounded text-[10px] font-bold`}>{value}</span>
    </button>
  );
}

/* ── Card projet ── */
function ProjectCard({ projet, viewMode }) {
  const [isRetrying, setIsRetrying] = useState(false);
  const [retryError, setRetryError] = useState(null);
  const [showProgressModal, setShowProgressModal] = useState(false);
  const [progressData, setProgressData] = useState({ progress: 0, status: "processing" });
  const isList = viewMode === "list";

  useEffect(() => {
    if (!showProgressModal) return;
    const poll = async () => {
      try {
        const res = await fetch(`/api/ebooks/progress/${projet._id}`);
        const data = await res.json();
        if (data.success) {
          setProgressData({ progress: data.progress || 0, status: data.status, pdfUrl: data.pdfUrl });
          if (data.status === "ERROR") {
            setTimeout(() => { setShowProgressModal(false); setRetryError("Échec. Réessaie."); setIsRetrying(false); }, 2000);
          }
        }
      } catch {}
    };
    const iv = setInterval(poll, 2000);
    poll();
    return () => clearInterval(iv);
  }, [showProgressModal, projet._id]);

  const handleRetry = async () => {
    if (isRetrying) return;
    setIsRetrying(true);
    setRetryError(null);
    try {
      const res = await fetch(`/api/projets/${projet._id}/retry`, { method: "POST", credentials: "include" });
      const data = await res.json();
      if (!res.ok) { setRetryError(data.error); setIsRetrying(false); return; }
      setShowProgressModal(true);
      setProgressData({ progress: 5, status: "processing" });
    } catch { setRetryError("Erreur réseau."); setIsRetrying(false); }
  };

  const canRetry = projet.isPaid && projet.statut === "erreur" && projet.retryCount < 3 && !projet.fileUrl;

  if (isList) {
    return (
      <div className="bg-white border border-slate-200 rounded-xl flex items-center gap-4 px-4 py-3.5 hover:border-slate-300 transition-colors group">
        {/* Icône mini */}
        <div className="w-9 h-12 rounded-md bg-slate-100 border border-slate-200 flex items-center justify-center flex-shrink-0">
          <FileText className="w-4 h-4 text-slate-400" />
        </div>
        {/* Titre */}
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-slate-900 truncate">{projet.titre}</p>
          <p className="text-xs text-slate-400 mt-0.5">{projet.pages} pages · {new Date(projet.createdAt).toLocaleDateString("fr-FR")}</p>
        </div>
        {/* Badge statut */}
        <StatusChip status={projet.statut} />
        {/* Action */}
        <div className="flex items-center gap-1.5 flex-shrink-0">
          {projet.statut === "terminé" && projet.fileUrl && (
            <a href={projet.fileUrl} download className="flex items-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors">
              <Download className="w-3.5 h-3.5" /> Télécharger
            </a>
          )}
          {projet.statut === "erreur" && canRetry && (
            <button onClick={handleRetry} disabled={isRetrying}
              className="flex items-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 px-3 py-1.5 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
              {isRetrying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
              Relancer
            </button>
          )}
          <button className="p-1.5 text-slate-300 hover:text-slate-500 transition-colors"><MoreVertical className="w-4 h-4" /></button>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden hover:border-slate-300 hover:shadow-sm transition-all group flex flex-col">

        {/* Cover minimaliste — juste la couleur du statut et le titre */}
        <div className="relative h-40 bg-slate-50 border-b border-slate-100 flex flex-col justify-between p-4">
          {/* Motif de fond subtil */}
          <div className="absolute inset-0 opacity-[0.03]"
            style={{ backgroundImage: "radial-gradient(circle, #94a3b8 1px, transparent 1px)", backgroundSize: "18px 18px" }}
          />

          {/* Badge statut */}
          <div className="relative z-10 flex justify-between items-start">
            <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest">Ebook</span>
            <StatusChip status={projet.statut} />
          </div>

          {/* Titre centré */}
          <div className="relative z-10">
            <p className="text-sm font-bold text-slate-800 leading-snug line-clamp-3">{projet.titre}</p>
          </div>
        </div>

        {/* Bas de la card */}
        <div className="p-4 flex flex-col gap-3 flex-1">
          {/* Meta */}
          <div className="flex items-center gap-3 text-xs text-slate-400">
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{projet.pages} pages</span>
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(projet.createdAt).toLocaleDateString("fr-FR")}</span>
          </div>

          {/* Actions */}
          <div className="flex items-center gap-2 mt-auto">
            {projet.statut === "terminé" && projet.fileUrl ? (
              <a href={projet.fileUrl} download
                className="flex-1 flex items-center justify-center gap-1.5 bg-slate-900 hover:bg-slate-800 text-white py-2 rounded-lg text-xs font-semibold transition-colors">
                <Download className="w-3.5 h-3.5" /> Télécharger
              </a>
            ) : projet.statut === "en cours" ? (
              <div className="flex-1 flex items-center justify-center gap-1.5 bg-slate-50 text-slate-500 py-2 rounded-lg text-xs font-medium">
                <Loader2 className="w-3.5 h-3.5 animate-spin" /> En cours...
              </div>
            ) : projet.statut === "erreur" && canRetry ? (
              <div className="flex-1 flex flex-col gap-1">
                {retryError && <p className="text-[10px] text-red-500 text-center">{retryError}</p>}
                <button onClick={handleRetry} disabled={isRetrying}
                  className="w-full flex items-center justify-center gap-1.5 border border-slate-200 hover:bg-slate-50 text-slate-700 py-2 rounded-lg text-xs font-semibold transition-colors disabled:opacity-50">
                  {isRetrying ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <RefreshCw className="w-3.5 h-3.5" />}
                  {isRetrying ? "Relance..." : `Relancer (${3 - projet.retryCount} restant${3 - projet.retryCount > 1 ? "s" : ""})`}
                </button>
              </div>
            ) : projet.statut === "erreur" && projet.retryCount >= 3 ? (
              <a href="mailto:support@bookzy.io?subject=Problème génération eBook"
                className="flex-1 flex items-center justify-center gap-1.5 border border-red-200 text-red-500 hover:bg-red-50 py-2 rounded-lg text-xs font-semibold transition-colors">
                <AlertCircle className="w-3.5 h-3.5" /> Support
              </a>
            ) : (
              <div className="flex-1 flex items-center justify-center gap-1.5 bg-red-50 text-red-400 py-2 rounded-lg text-xs font-medium">
                <AlertCircle className="w-3.5 h-3.5" /> Erreur
              </div>
            )}
            <button className="p-2 text-slate-300 hover:text-slate-500 border border-slate-200 rounded-lg transition-colors">
              <MoreVertical className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {showProgressModal && (
        <ProgressModal
          titre={projet.titre}
          progress={progressData.progress}
          status={progressData.status}
          pdfUrl={progressData.pdfUrl}
          onClose={() => { setShowProgressModal(false); window.location.reload(); }}
        />
      )}
    </>
  );
}

/* ── Chip statut ── */
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

/* ── Modal progress ── */
function ProgressModal({ titre, progress, status, pdfUrl, onClose }) {
  const msg = () => {
    if (status === "COMPLETED" && pdfUrl) return "Génération terminée !";
    if (status === "ERROR") return "Erreur lors de la génération";
    if (progress < 30) return "Génération du plan...";
    if (progress < 70) return "Rédaction des chapitres...";
    if (progress < 90) return "Création du PDF...";
    return "Finalisation...";
  };

  return (
    <div className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[9999] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-xl max-w-sm w-full p-7">
        {/* Icon */}
        <div className="flex justify-center mb-5">
          <div className="w-12 h-12 rounded-full bg-slate-100 flex items-center justify-center">
            {status === "COMPLETED" && pdfUrl
              ? <CheckCircle2 className="w-6 h-6 text-emerald-500" />
              : status === "ERROR"
              ? <AlertCircle className="w-6 h-6 text-red-400" />
              : <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />}
          </div>
        </div>

        <h3 className="text-base font-bold text-slate-900 text-center mb-1">{msg()}</h3>
        <p className="text-sm text-slate-400 text-center line-clamp-1 mb-5">{titre}</p>

        {/* Progress bar */}
        {status !== "COMPLETED" && status !== "ERROR" && (
          <div className="mb-5">
            <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
              <div className="h-full bg-slate-800 rounded-full transition-all duration-500"
                style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <p className="text-xs text-slate-400 text-right mt-1.5 font-medium">{Math.min(progress, 100)}%</p>
          </div>
        )}

        {status === "COMPLETED" && pdfUrl && (
          <a href={pdfUrl} download onClick={() => setTimeout(onClose, 800)}
            className="flex items-center justify-center gap-2 w-full bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-xl text-sm font-semibold transition-colors mb-3">
            <Download className="w-4 h-4" /> Télécharger l'ebook
          </a>
        )}

        <button onClick={onClose}
          className="w-full py-2.5 text-sm font-medium text-slate-500 hover:text-slate-700 transition-colors">
          {status !== "COMPLETED" && status !== "ERROR" ? "Continuer en arrière-plan" : "Fermer"}
        </button>
      </div>
    </div>
  );
}