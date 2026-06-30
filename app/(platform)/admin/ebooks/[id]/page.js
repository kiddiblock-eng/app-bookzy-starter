"use client";

import { useEffect, useState } from "react";
import { 
  BookOpen, 
  Loader2, 
  User, 
  Calendar, 
  Info,
  Download,
  ArrowLeft,
  Globe,
  Mail,
  Hash,
  Clock,
  Layers,
  FileText
} from "lucide-react";
import { useRouter } from "next/navigation";

export default function EbookDetails({ params }) {
  const { id } = params;
  const router = useRouter();
  const [ebook, setEbook] = useState(null);
  const [loading, setLoading] = useState(true);

  // --- LOGIQUE (STRICTEMENT INTACTE) ---
  useEffect(() => { load(); }, []);

  const load = async () => {
    try {
      const res = await fetch(`/api/admin/ebooks/get?id=${id}`, {
        credentials: "include",  
      });

      if (!res.ok) {
        console.error("Erreur API admin", res.status);
        setLoading(false);
        return;
      }

      const data = await res.json();
      setEbook(data.ebook);
    } catch (e) {
      console.error("Erreur fetch ebook :", e);
    }
    setLoading(false);
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4 text-neutral-500">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-xs font-mono tracking-widest uppercase">Chargement détails...</p>
      </div>
    );
  }

  if (!ebook) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center p-8 text-center">
        <BookOpen className="w-16 h-16 text-neutral-300 mb-4" />
        <h2 className="text-xl font-bold text-neutral-900">Aucun eBook trouvé</h2>
        <p className="text-sm text-neutral-500 mb-6">L'ID demandé n'existe pas ou a été supprimé.</p>
        <button
          onClick={() => router.back()}
          className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-xl text-sm transition-colors"
        >
          Retour
        </button>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-8 font-sans text-neutral-900">
      <div className="max-w-6xl mx-auto space-y-8">

        {/* HEADER NAVIGATION */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
          <div className="flex items-center gap-4">
             <button
                onClick={() => router.back()}
                className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all"
             >
                <ArrowLeft size={18} />
             </button>
             <div>
                <h1 className="text-2xl font-bold text-neutral-900 tracking-tight mb-1">{ebook.title || "Sans titre"}</h1>
                <p className="text-xs text-neutral-500 font-mono flex items-center gap-2">
                   <Hash size={12} /> {ebook._id}
                </p>
             </div>
          </div>

          <div className="flex items-center gap-3">
             {/* ✅ BOUTON DE TÉLÉCHARGEMENT SÉCURISÉ */}
             {ebook.fileUrl && (
               <a
                  href={ebook.fileUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-sm rounded-xl flex items-center gap-2 transition-all"
               >
                  <Download size={16} /> Télécharger le PDF
               </a>
             )}
          </div>
        </div>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* COLONNE PRINCIPALE (Metadata & Stats) */}
          <div className="lg:col-span-2 space-y-6">

             {/* Main Info Card */}
             <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
                <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-6 flex items-center gap-2">
                   <Info size={16} className="text-emerald-600" /> Métadonnées
                </h3>

                <div className="grid grid-cols-2 gap-4 mb-6">
                   <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Template</p>
                      <div className="flex items-center gap-2">
                         <Layers size={14} className="text-emerald-600" />
                         <span className="text-neutral-900 font-mono">{ebook.template || "Standard"}</span>
                      </div>
                   </div>
                   <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                      <p className="text-xs text-neutral-500 uppercase font-bold mb-1">Langue</p>
                      <div className="flex items-center gap-2">
                         <Globe size={14} className="text-emerald-600" />
                         <span className="text-neutral-900 font-mono">Français</span>
                      </div>
                   </div>
                </div>

                {/* ⚡ Grille ajustée à 2 colonnes (Chapitres retiré) */}
                <div className="grid grid-cols-2 gap-4 pt-6 border-t border-neutral-200">
                   <div>
                      <p className="text-xs text-neutral-500 mb-1">Pages</p>
                      <p className="text-2xl font-black text-neutral-900">{ebook.pages || 0}</p>
                   </div>
                   <div>
                      <p className="text-xs text-neutral-500 mb-1">Mots (est.)</p>
                      <p className="text-2xl font-black text-neutral-900">{(ebook.pages || 0) * 250}</p>
                   </div>
                </div>
             </div>

             {/* Dates Card */}
             <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex items-center justify-between shadow-sm">
                <div>
                   <p className="text-xs text-neutral-500 uppercase font-bold mb-2 flex items-center gap-1.5"><Clock size={12}/> Création</p>
                   <p className="text-sm font-mono text-neutral-900">{new Date(ebook.createdAt).toLocaleString("fr-FR")}</p>
                </div>
                <div className="w-px h-10 bg-neutral-200"></div>
                <div>
                   <p className="text-xs text-neutral-500 uppercase font-bold mb-2 flex items-center gap-1.5"><Clock size={12}/> Modification</p>
                   <p className="text-sm font-mono text-neutral-900">{new Date(ebook.updatedAt).toLocaleString("fr-FR")}</p>
                </div>
             </div>
          </div>

          {/* SIDEBAR (User Info) */}
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-fit shadow-sm">
             <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-6 flex items-center gap-2">
                <User size={16} className="text-emerald-600" /> Créateur
             </h3>

             <div className="flex items-center gap-4 mb-6">
                <div className="w-12 h-12 bg-neutral-100 rounded-lg border border-neutral-200 flex items-center justify-center text-lg font-bold text-neutral-500">
                   {ebook.user?.name?.charAt(0) || ebook.user?.email?.charAt(0) || "?"}
                </div>
                <div>
                   <p className="text-sm font-bold text-neutral-900">{ebook.user?.name || "Utilisateur"}</p>
                   <p className="text-xs text-neutral-500">Auteur</p>
                </div>
             </div>

             <div className="space-y-3">
                <div className="p-3 bg-neutral-50 rounded border border-neutral-200 flex items-center gap-3">
                   <Mail size={14} className="text-neutral-500" />
                   <span className="text-xs text-neutral-700 truncate">{ebook.user?.email || "N/A"}</span>
                </div>
                <div className="p-3 bg-neutral-50 rounded border border-neutral-200 flex items-center gap-3">
                   <Globe size={14} className="text-neutral-500" />
                   <span className="text-xs text-neutral-700">{ebook.user?.country || "Non défini"}</span>
                </div>
             </div>
          </div>

        </div>
      </div>
    </div>
  );
}