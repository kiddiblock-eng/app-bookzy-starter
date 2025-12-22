"use client";

import { useEffect, useState } from "react";
import useSWR from "swr";
import {
  FileText,
  Download,
  Image as ImageIcon,
  Sparkles,
  Search,
  Calendar,
  Package,
  Eye,
  MoreVertical,
  Filter,
  MessageCircle,
  PenTool
} from "lucide-react";

// ✅ Fetcher pour SWR
const fetcher = (url) => fetch(url, { 
  credentials: "include",
  headers: { "Content-Type": "application/json" }
}).then(r => r.ok ? r.json() : null);

export default function FichiersPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("all");

  // ✅ SWR pour ebooks (cache 1 min)
  const { data: ebooksData, isLoading: loading } = useSWR("/api/ebooks/user", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 60000,
  });

  const ebooks = ebooksData?.ebooks || [];

  const kits = ebooks.map((e) => ({
    id: e._id,
    title: e.title || "Projet sans titre",
    template: e.template || "Standard",
    createdAt: e.createdAt,
    pages: e.pages || 0,
    fileUrl: e.fileUrl || "",
    coverUrl: e.coverUrl || null,
    
    // 🔥 C'EST ICI LA CORRECTION 🔥
    // On utilise les indicateurs (Vrai/Faux) envoyés par ton API optimisée
    // Au lieu de chercher le texte (qui est vide pour la vitesse)
    hasAds: e.hasMarketing, 
    hasImages: e.hasVisuels, 
    
    hasPdf: !!e.fileUrl
  })).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));

  const filteredKits = kits.filter((k) => {
    const matchSearch = k.title.toLowerCase().includes(search.toLowerCase());
    if (filter === "ebook") return matchSearch && k.hasPdf;
    if (filter === "marketing") return matchSearch && (k.hasAds || k.hasImages);
    return matchSearch;
  });

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans pb-20">
      
      {/* ✅ HEADER CORRIGÉ : sticky top-16 z-20 */}
      <div className="sticky top-16 z-20 bg-white/80 backdrop-blur-md border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 h-16 flex items-center justify-between">
            <h1 className="text-xl font-black text-slate-900 tracking-tight flex items-center gap-2">
                <Package className="w-5 h-5 text-indigo-600"/> Mes Kits
            </h1>
            <a href="https://app.bookzy.io/dashboard/projets/nouveau" className="bg-slate-900 hover:bg-slate-800 text-white px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-lg shadow-slate-200 flex items-center gap-2">
                <Sparkles className="w-3 h-3" /> <span className="hidden sm:inline">Nouveau Kit</span> <span className="sm:hidden">Créer</span>
            </a>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 pt-24 pb-8">
        
        <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="flex-1 relative group">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-indigo-500 transition-colors w-4 h-4" />
                <input
                    type="text"
                    placeholder="Rechercher un fichier..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-3 bg-white border border-slate-200 rounded-xl text-sm font-medium focus:outline-none focus:ring-2 focus:ring-indigo-100 focus:border-indigo-500 transition-all shadow-sm"
                />
            </div>

            <div className="flex gap-2 bg-slate-100 p-1 rounded-xl w-full md:w-auto">
                {['all', 'ebook', 'marketing'].map(f => (
                    <button 
                        key={f}
                        onClick={() => setFilter(f)}
                        className={`flex-1 md:flex-none px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all ${filter === f ? 'bg-white text-slate-900 shadow-sm' : 'text-slate-500 hover:text-slate-700'}`}
                    >
                        {f === 'all' ? 'Tout' : f}
                    </button>
                ))}
            </div>
        </div>

        {loading && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[1,2,3].map(i => (
                    <div key={i} className="h-48 bg-slate-100 rounded-2xl animate-pulse"></div>
                ))}
            </div>
        )}

        {!loading && filteredKits.length === 0 && (
            <div className="text-center py-20 bg-white border border-dashed border-slate-200 rounded-3xl">
                <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Package className="w-8 h-8 text-slate-300" />
                </div>
                <h3 className="text-lg font-bold text-slate-900">Aucun fichier trouvé</h3>
                <p className="text-slate-500 text-sm mb-6">Créez votre premier pack complet.</p>
                <a href="https://app.bookzy.io/dashboard/projets/nouveau" className="text-indigo-600 font-bold text-sm hover:underline">Générer un kit</a>
            </div>
        )}

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredKits.map((kit) => (
                <FileCard key={kit.id} kit={kit} />
            ))}
        </div>

      </div>
    </div>
  );
}

function FileCard({ kit }) {
    const gradients = ["from-blue-500 to-indigo-600", "from-emerald-500 to-teal-600", "from-orange-500 to-red-600", "from-purple-500 to-pink-600"];
    const colorIndex = parseInt(kit.id.substring(kit.id.length - 1), 16) % gradients.length;
    
    return (
        <div className="group bg-white border border-slate-200 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-300 flex flex-col h-full hover:-translate-y-1">
            
            <div className={`h-32 relative bg-gradient-to-br ${gradients[colorIndex]} p-4 flex flex-col justify-end overflow-hidden`}>
                <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-20"></div>
                
                <div className="absolute top-3 right-3 bg-black/20 backdrop-blur-md px-2 py-1 rounded-md text-[10px] text-white font-medium flex items-center gap-1">
                    <Calendar className="w-3 h-3"/> {new Date(kit.createdAt).toLocaleDateString()}
                </div>

                <div className="relative z-10">
                    <h3 className="text-white font-bold text-lg leading-tight line-clamp-2 drop-shadow-md">{kit.title}</h3>
                </div>
            </div>

            <div className="p-5 flex-1 flex flex-col">
                
                <div className="flex flex-wrap gap-2 mb-4">
                    {kit.hasPdf && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-red-50 text-red-700 text-[10px] font-bold border border-red-100">
                            <FileText className="w-3 h-3"/> PDF
                        </span>
                    )}
                    
                    {/* Les badges s'afficheront maintenant correctement 👇 */}
                    {kit.hasAds && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-blue-50 text-blue-700 text-[10px] font-bold border border-blue-100">
                            <MessageCircle className="w-3 h-3"/> Marketing
                        </span>
                    )}
                    {kit.hasImages && (
                        <span className="inline-flex items-center gap-1 px-2 py-1 rounded-md bg-green-50 text-green-700 text-[10px] font-bold border border-green-100">
                            <ImageIcon className="w-3 h-3"/> Visuels
                        </span>
                    )}
                </div>

                <div className="mt-auto flex items-center gap-2 pt-4 border-t border-slate-100">
                    <a href={`/dashboard/fichiers/${kit.id}`} className="flex-1 bg-slate-50 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 py-2 rounded-lg text-xs font-bold text-center transition-colors flex items-center justify-center gap-2 border border-slate-200 hover:border-indigo-200">
                        <Eye className="w-3.5 h-3.5"/> Ouvrir
                    </a>
                    
                    {kit.hasPdf && (
                         <a href={kit.fileUrl} download className="p-2 bg-slate-900 text-white rounded-lg hover:bg-slate-800 transition-colors" title="Télécharger PDF">
                            <Download className="w-3.5 h-3.5"/>
                         </a>
                    )}
                </div>
            </div>
        </div>
    )
}