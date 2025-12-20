"use client";

import { useEffect, useState, useMemo } from "react";
import useSWR from "swr";
import {
  Folder, FileText, Clock, Plus, Search, LayoutGrid, List,
  ArrowRight, Download, CheckCircle2, AlertCircle, MoreVertical, Library, Loader2
} from "lucide-react";

// Fetcher optimisé
const fetcher = (url) => fetch(url, { 
  credentials: "include",
  cache: "no-store", 
  headers: { "Content-Type": "application/json", "Pragma": "no-cache", "Expires": "0" }
}).then(r => r.ok ? r.json() : null);

export default function ProjetsPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");
  const [viewMode, setViewMode] = useState("grid");

  // ✅ SWR pour la rapidité
  const { data: ebooksData, isLoading: loading } = useSWR("/api/ebooks/user", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 0,
  });

  const ebooks = ebooksData?.ebooks || [];

  const { projets, statsApi } = useMemo(() => {
    const completed = ebooks.filter(e => e.fileUrl || e.status === "COMPLETED");
    const enCours = ebooks.filter(e => !e.fileUrl && e.status !== "COMPLETED");

    const stats = { total: ebooks.length, kits: completed.length, enCours: enCours.length };

    const mapped = ebooks.map((e) => ({
      _id: e._id,
      titre: e.title || "Livre sans titre",
      description: e.description,
      pages: e.pages,
      createdAt: e.createdAt,
      fileUrl: e.fileUrl,
      colorSeed: e._id.substring(0, 6), 
      statut: e.status === "COMPLETED" || e.fileUrl ? "terminé" : e.status === "ERROR" ? "erreur" : "en cours"
    }));

    return { projets: mapped, statsApi: stats };
  }, [ebooks]);

  const filteredProjets = projets.filter((p) => {
    const titre = (p.titre || "").toLowerCase();
    const matchesSearch = titre.includes(searchTerm.toLowerCase());
    const matchesFilter = filterStatus === "all" ? true : p.statut === filterStatus;
    return matchesSearch && matchesFilter;
  });

  // ✅ Affichage du Skeleton LOCAL si chargement
  if (loading) {
    return (
      <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans">
        <header className="bg-white border-b border-slate-200 sticky top-0 z-30 opacity-50 pointer-events-none">
             <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center"></div>
        </header>
        <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
            <ProjectsSkeleton />
        </main>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-20 font-sans text-slate-900">
      
      <header className="bg-white border-b border-slate-200 sticky top-0 z-30">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 sm:h-20 flex items-center justify-between">
          <div className="flex items-center gap-3">
             <div className="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center text-white shadow-lg shadow-indigo-200">
                <Library className="w-5 h-5" />
             </div>
             <div>
                <h1 className="text-xl sm:text-2xl font-black tracking-tight text-slate-900">Mes Projets</h1>
                <p className="text-xs text-slate-500 font-medium hidden sm:block">Gérez vos ouvrages et contenus</p>
             </div>
          </div>
          
          <a href="/dashboard/projets/nouveau" className="group flex items-center gap-2 bg-slate-900 hover:bg-slate-800 text-white px-5 py-2.5 rounded-xl font-bold text-sm transition-all shadow-xl shadow-slate-200 active:scale-95">
             <Plus className="w-4 h-4" /> <span className="hidden sm:inline">Nouveau e-book</span> <span className="sm:hidden">Créer</span>
          </a>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-6 py-8">
        
        {projets.length > 0 && (
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
             <StatBox label="eBooks" value={statsApi.total} />
             <StatBox label="Prêts" value={statsApi.kits} highlight />
             <StatBox label="En cours" value={statsApi.enCours} />
             <div className="bg-white p-1 rounded-xl border border-slate-200 shadow-sm flex items-center px-3 focus-within:ring-2 focus-within:ring-indigo-100 transition-all col-span-2 md:col-span-1">
                <Search className="w-4 h-4 text-slate-400 mr-2" />
                <input type="text" placeholder="Chercher un titre..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} className="w-full bg-transparent outline-none text-sm font-medium placeholder:text-slate-400 h-full" />
             </div>
          </div>
        )}

        {projets.length > 0 && (
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-6">
             <div className="flex gap-1 bg-slate-100 p-1 rounded-lg overflow-x-auto max-w-full no-scrollbar">
                {['all', 'terminé', 'en cours', 'erreur'].map(status => (
                  <button key={status} onClick={() => setFilterStatus(status)} className={`px-4 py-1.5 rounded-md text-xs font-bold capitalize transition-all whitespace-nowrap ${filterStatus === status ? 'bg-white text-indigo-600 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}>
                    {status === 'all' ? 'Tout voir' : status}
                  </button>
                ))}
             </div>
             <div className="flex items-center gap-2 self-end sm:self-auto">
                <button onClick={() => setViewMode('grid')} className={`p-2 rounded-lg ${viewMode === 'grid' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}><LayoutGrid className="w-4 h-4"/></button>
                <button onClick={() => setViewMode('list')} className={`p-2 rounded-lg ${viewMode === 'list' ? 'bg-indigo-50 text-indigo-600' : 'text-slate-400 hover:bg-slate-100'}`}><List className="w-4 h-4"/></button>
             </div>
          </div>
        )}

        {filteredProjets.length > 0 ? (
          <div className={`grid gap-6 ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' : 'grid-cols-1'}`}>
            {filteredProjets.map((projet) => (
              <ProjectCard key={projet._id} projet={projet} viewMode={viewMode} />
            ))}
          </div>
        ) : (
          <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl">
             <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4"><Folder className="w-8 h-8 text-slate-300" /></div>
             <h3 className="text-lg font-bold text-slate-900">Aucun livre trouvé</h3>
             <p className="text-slate-500 text-sm mb-6">Lancez une nouvelle rédaction par IA.</p>
             <a href="/dashboard/projets/nouveau" className="text-indigo-600 font-bold text-sm hover:underline">Commencer un projet</a>
          </div>
        )}
      </main>
    </div>
  );
}

// ──────────────────────────────────────────────
// SOUS-COMPOSANTS & SKELETON (Tout est ici)
// ──────────────────────────────────────────────

function ProjectsSkeleton() {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 animate-pulse">
        {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
            <div key={i} className="h-72 bg-slate-200 rounded-2xl border border-slate-300"></div>
        ))}
    </div>
  );
}

function StatBox({ label, value, highlight = false }) {
  return (
    <div className={`p-4 rounded-2xl border ${highlight ? 'bg-slate-900 border-slate-900 text-white' : 'bg-white border-slate-200 text-slate-900'} shadow-sm flex flex-col justify-center`}>
      <div className={`text-2xl font-black mb-1 ${highlight ? 'text-white' : 'text-slate-900'}`}>{value}</div>
      <div className={`text-[10px] uppercase font-bold tracking-wider ${highlight ? 'text-slate-400' : 'text-slate-400'}`}>{label}</div>
    </div>
  );
}

function ProjectCard({ projet, viewMode }) {
  const gradients = [ "from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600", "from-orange-500 to-red-600", "from-pink-500 to-rose-600", "from-violet-500 to-purple-600" ];
  const colorIndex = parseInt(projet._id.substring(projet._id.length - 1), 16) % gradients.length;
  const bgGradient = gradients[colorIndex];
  const isList = viewMode === 'list';

  return (
    <div className={`group relative bg-white border border-slate-200 rounded-2xl overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 ${isList ? 'flex items-center p-4' : 'flex flex-col'}`}>
      <div className={`relative overflow-hidden ${isList ? 'w-16 h-20 rounded-lg flex-shrink-0 mr-6' : 'h-48 w-full'}`}>
         <div className={`absolute inset-0 bg-gradient-to-br ${bgGradient}`}></div>
         <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
         <div className="absolute inset-0 p-4 flex flex-col justify-center text-white">
            <div className="text-[8px] opacity-70 uppercase tracking-widest border-b border-white/20 pb-1 mb-2 w-fit">Ebook</div>
            <h3 className={`font-black leading-tight break-words ${isList ? 'text-[8px] line-clamp-3' : 'text-lg line-clamp-3'}`} style={{textShadow: '0 2px 4px rgba(0,0,0,0.2)'}}>{projet.titre}</h3>
         </div>
         <div className="absolute top-2 right-2"><StatusBadge status={projet.statut} mini={isList} /></div>
      </div>
      <div className={`flex-1 ${isList ? '' : 'p-5'}`}>
         {!isList && ( <div className="flex justify-between items-start mb-3"> <div className="text-xs text-slate-400 font-medium flex items-center gap-1"> <Clock className="w-3 h-3"/> {new Date(projet.createdAt).toLocaleDateString()} </div> </div> )}
         {isList && <h3 className="font-bold text-slate-900 mb-1 line-clamp-1">{projet.titre}</h3>}
         <div className="flex items-center gap-4 text-xs text-slate-500 font-medium mb-4"> <span className="flex items-center gap-1 bg-slate-50 px-2 py-1 rounded-md border border-slate-100"><FileText className="w-3 h-3 text-slate-400"/> {projet.pages} pages</span> </div>
         <div className="flex items-center gap-2 mt-auto">
            {projet.statut === "terminé" && projet.fileUrl ? ( <a href={projet.fileUrl} download className="flex-1 flex items-center justify-center gap-2 bg-slate-900 hover:bg-slate-800 text-white py-2.5 rounded-lg text-xs font-bold transition-all shadow-md group-hover:shadow-lg"> <Download className="w-3.5 h-3.5" /> Télécharger </a> ) : projet.statut === "en cours" ? ( <div className="flex-1 flex items-center justify-center gap-2 bg-indigo-50 text-indigo-600 py-2.5 rounded-lg text-xs font-bold animate-pulse"> <Loader2 className="w-3.5 h-3.5 animate-spin" /> Génération... </div> ) : ( <div className="flex-1 flex items-center justify-center gap-2 bg-red-50 text-red-600 py-2.5 rounded-lg text-xs font-bold"> <AlertCircle className="w-3.5 h-3.5" /> Erreur </div> )}
            <button className="p-2.5 rounded-lg border border-slate-200 text-slate-400 hover:text-slate-700 hover:bg-slate-50"> <MoreVertical className="w-4 h-4"/> </button>
         </div>
      </div>
    </div>
  );
}

function StatusBadge({ status, mini }) {
    if (status === "terminé") {
        return <div className={`bg-white/90 backdrop-blur-sm text-green-600 rounded-full flex items-center justify-center ${mini ? 'w-4 h-4' : 'px-2 py-1 text-[10px] font-bold shadow-sm'}`}> {mini ? <CheckCircle2 className="w-3 h-3"/> : <span className="flex items-center gap-1"><CheckCircle2 className="w-3 h-3"/> Prêt</span>} </div>
    }
    if (status === "en cours") {
        return <div className={`bg-white/90 backdrop-blur-sm text-indigo-600 rounded-full flex items-center justify-center ${mini ? 'w-4 h-4' : 'px-2 py-1 text-[10px] font-bold shadow-sm'}`}> {mini ? <Loader2 className="w-3 h-3 animate-spin"/> : <span className="flex items-center gap-1"><Loader2 className="w-3 h-3 animate-spin"/> En cours</span>} </div>
    }
    return null;
}