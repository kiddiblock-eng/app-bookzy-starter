"use client";

import { useEffect, useState } from "react";
import { useRouter, useParams } from "next/navigation";
import {
  ArrowLeft,
  Mail,
  Globe,
  CheckCircle2,
  Ban,
  Loader2,
  BookOpen,
  User2,
  Calendar,
  Languages,
  Shield,
  Crown,
  Clock,
  FileText,
  ExternalLink,
  Activity,
  MoreVertical,
  Terminal,
  Hash
} from "lucide-react";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

function getAdminHeaders() {
  if (!ADMIN_SECRET) return {};
  return { "x-admin-secret": ADMIN_SECRET };
}

export default function AdminUserDetailsPage({ params }) {
  const router = useRouter();
  const routeParams = params || useParams();
  const userId = routeParams?.id;

  // --- 1. ETATS & LOGIQUE (STRICTEMENT IDENTIQUE A TON CODE) ---
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);
  const [user, setUser] = useState(null);
  const [ebooks, setEbooks] = useState([]);

  async function loadUser() {
    if (!userId) return;
    try {
      setLoading(true);
      const res = await fetch(`/api/admin/users/${userId}`, {
        headers: { ...getAdminHeaders() },
        cache: "no-store",
      });
      const data = await res.json();

      if (data.success) {
        setUser(data.user || null);
        // Sécurité maximale pour récupérer le tableau d'ebooks
        setEbooks(Array.isArray(data.ebooks) ? data.ebooks : []);
      } else {
        setUser(null);
        setEbooks([]);
      }
    } catch (e) {
      console.error("Erreur loadUser:", e);
      setUser(null);
      setEbooks([]);
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => {
    loadUser();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId]);

  async function handleToggleActive() {
    if (!user?._id || toggling) return;

    try {
      setToggling(true);
      const res = await fetch("/api/admin/users/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAdminHeaders() },
        body: JSON.stringify({ userId: user._id, isActive: !(user.isActive ?? true) }),
      });

      const data = await res.json();

      if (data.success && data.user) {
        setUser(data.user);
      } else {
        console.error("Toggle non appliqué:", data);
      }
    } catch (e) {
      console.error("Erreur toggle-active:", e);
    } finally {
      setToggling(false);
    }
  }

  // --- 2. RENDER (DESIGN REFONDU) ---

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500" />
        <p className="text-xs font-mono tracking-widest uppercase">Récupération des données...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-[#020617] p-8 flex flex-col items-center justify-center">
        <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-12 text-center max-w-md w-full">
          <Ban className="w-12 h-12 text-slate-600 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-white mb-2">Utilisateur introuvable</h2>
          <p className="text-slate-500 text-sm mb-6">L'ID demandé n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => router.push("https://app.bookzy.io/admin/users")}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-white rounded-lg text-sm transition-colors"
          >
            Retour à la liste
          </button>
        </div>
      </div>
    );
  }

  // Préparation des données d'affichage
  const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || user.email;
  const initials = displayName.trim().split(" ").map((p) => p.charAt(0).toUpperCase()).slice(0, 2).join("");
  const country = user.country || user.pays || "—";
  const lang = user.lang || user.language || "—";
  const role = user.role || "user";
  const createdAt = user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR", { day: "2-digit", month: "long", year: "numeric" }) : "—";
  const isActive = user.isActive ?? true;
  const ebooksCount = ebooks.length || user.ebooksCreated || 0;

  return (
    <div className="min-h-screen bg-[#020617] text-slate-200 p-6 md:p-8 font-sans">
      
      {/* HEADER NAVIGATION */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("https://app.bookzy.io/admin/users")}
          className="p-2 rounded-lg bg-[#0f1623] border border-slate-800 text-slate-400 hover:text-white hover:border-slate-700 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
           <h1 className="text-xl font-bold text-white tracking-tight">Détails Utilisateur</h1>
           <p className="text-xs text-slate-500 font-mono flex items-center gap-2">
              <Hash size={12} /> {user._id}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* COLONNE GAUCHE : INFOS PRINCIPALES */}
        <div className="lg:col-span-2 space-y-6">
           
           {/* CARTE D'IDENTITÉ */}
           <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-6 relative overflow-hidden">
              {/* Fond décoratif */}
              <div className="absolute top-0 right-0 p-32 bg-indigo-600/5 rounded-full blur-3xl -translate-y-1/2 translate-x-1/2 pointer-events-none"></div>

              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                 {/* Avatar */}
                 <div className="w-20 h-20 rounded-xl bg-slate-800 border border-slate-700 flex items-center justify-center text-2xl font-bold text-slate-400 shadow-inner">
                    {initials || <User2 size={32}/>}
                 </div>
                 
                 <div className="flex-1">
                    <h2 className="text-2xl font-bold text-white mb-1">{displayName}</h2>
                    
                    <div className="flex items-center gap-2 text-slate-400 text-sm mb-4">
                       <Mail size={14} className="text-indigo-400" /> {user.email}
                    </div>
                    
                    <div className="flex flex-wrap gap-2">
                       {/* Badge Rôle */}
                       <div className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${
                          role === 'super_admin' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' :
                          role === 'admin' ? 'bg-purple-500/10 border-purple-500/20 text-purple-400' :
                          'bg-slate-800 border-slate-700 text-slate-400'
                       }`}>
                          {role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Utilisateur'}
                       </div>

                       {/* Badge Statut */}
                       <div className={`px-2.5 py-1 rounded text-xs font-bold uppercase border flex items-center gap-1.5 ${
                          isActive ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : 'bg-red-500/10 border-red-500/20 text-red-400'
                       }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                          {isActive ? 'Actif' : 'Suspendu'}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Détails Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-slate-800/50">
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><Globe size={12}/> Pays</p>
                    <p className="text-slate-200 font-medium">{country}</p>
                 </div>
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><Languages size={12}/> Langue</p>
                    <p className="text-slate-200 font-medium">{lang}</p>
                 </div>
                 <div className="bg-slate-900/50 p-3 rounded-lg border border-slate-800/50">
                    <p className="text-xs text-slate-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><Calendar size={12}/> Inscrit le</p>
                    <p className="text-slate-200 font-medium">{createdAt}</p>
                 </div>
              </div>
           </div>

           {/* LISTE DES EBOOKS (Refaite pour garantir l'affichage) */}
           <div className="bg-[#0f1623] border border-slate-800 rounded-xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-slate-800 bg-[#0f1623] flex justify-between items-center">
                 <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
                    <BookOpen size={16} className="text-indigo-400" />
                    Bibliothèque ({ebooksCount})
                 </h3>
              </div>

              <div className="flex-1">
                {ebooks.length === 0 ? (
                   <div className="p-12 text-center">
                      <div className="w-12 h-12 bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-3 text-slate-600">
                         <BookOpen size={20} />
                      </div>
                      <p className="text-slate-500 text-sm">Aucun eBook généré.</p>
                   </div>
                ) : (
                   <div className="divide-y divide-slate-800">
                      {ebooks.map((ebook, i) => (
                         <div key={ebook._id || i} className="p-4 flex items-center justify-between hover:bg-slate-800/30 transition-colors">
                            <div className="flex items-center gap-4 overflow-hidden">
                               {/* Icone Ebook */}
                               <div className="w-10 h-10 bg-slate-800 border border-slate-700 rounded-lg flex items-center justify-center text-slate-400 shrink-0">
                                  <FileText size={18} />
                               </div>
                               
                               {/* Infos Ebook */}
                               <div className="min-w-0">
                                  <h4 className="text-sm font-bold text-slate-200 truncate pr-4">
                                     {ebook.title ? ebook.title : "Projet sans titre"}
                                  </h4>
                                  <div className="flex items-center gap-3 text-xs text-slate-500 mt-0.5">
                                     <span className="flex items-center gap-1"><Clock size={10}/> {ebook.createdAt ? new Date(ebook.createdAt).toLocaleDateString() : "-"}</span>
                                     <span className="flex items-center gap-1"><FileText size={10}/> {ebook.pages || 0} pages</span>
                                  </div>
                               </div>
                            </div>

                            {/* Lien Fichier */}
                            {ebook.fileUrl && (
                               <a 
                                  href={ebook.fileUrl} 
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="p-2 bg-slate-800 hover:bg-indigo-600 text-slate-400 hover:text-white rounded-lg transition-all border border-slate-700 hover:border-indigo-500"
                                  title="Télécharger PDF"
                               >
                                  <ExternalLink size={16} />
                               </a>
                            )}
                         </div>
                      ))}
                   </div>
                )}
              </div>
           </div>
        </div>

        {/* COLONNE DROITE : ACTIONS & STATS */}
        <div className="space-y-6">
           
           {/* Actions Rapides */}
           <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Gestion du Compte</h3>
              
              <div className="space-y-3">
                 <button
                    onClick={handleToggleActive}
                    disabled={toggling}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold border transition-all ${
                       isActive 
                       ? "bg-transparent border-red-500/30 text-red-400 hover:bg-red-500/10" 
                       : "bg-emerald-600 border-emerald-600 text-white hover:bg-emerald-500"
                    }`}
                 >
                    {toggling ? (
                       <Loader2 size={16} className="animate-spin" /> 
                    ) : isActive ? (
                       <> <Ban size={16} /> Suspendre l'accès </>
                    ) : (
                       <> <CheckCircle2 size={16} /> Réactiver l'accès </>
                    )}
                 </button>
                 
                 <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium bg-slate-800 text-slate-300 hover:bg-slate-700 border border-slate-700 transition-all">
                    <Mail size={16} /> Envoyer un email
                 </button>
              </div>
           </div>

           {/* Mini Stats */}
           <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-5">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Activity size={14} className="text-indigo-400" /> Métriques
              </h3>
              
              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1.5">
                       <span className="text-slate-400">Production eBooks</span>
                       <span className="text-white font-mono font-bold">{ebooksCount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-indigo-500 rounded-full" style={{ width: `${Math.min(ebooksCount * 5, 100)}%` }}></div>
                    </div>
                 </div>
                 
                 <div>
                    <div className="flex justify-between text-sm mb-1.5">
                       <span className="text-slate-400">Santé du Compte</span>
                       <span className="text-emerald-400 font-mono font-bold">100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-800 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Données Brutes (Debug) */}
           <div className="bg-black/30 border border-slate-800 rounded-xl p-4 font-mono text-[10px] text-slate-500 overflow-hidden">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-slate-800 text-slate-400 font-bold">
                 <Terminal size={12} /> SYSTEM_DATA
              </div>
              <p>ID: <span className="text-slate-300">{user._id}</span></p>
              <p>CREATED: <span className="text-slate-300">{new Date(user.createdAt).toISOString()}</span></p>
              <p>ROLE: <span className="text-slate-300">{user.role}</span></p>
           </div>

        </div>
      </div>
    </div>
  );
}