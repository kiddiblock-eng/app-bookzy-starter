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
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4 text-neutral-500">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-xs font-mono tracking-widest uppercase">Récupération des données...</p>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-neutral-50 p-8 flex flex-col items-center justify-center">
        <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center max-w-md w-full">
          <Ban className="w-12 h-12 text-neutral-400 mx-auto mb-4" />
          <h2 className="text-lg font-bold text-neutral-900 mb-2">Utilisateur introuvable</h2>
          <p className="text-neutral-500 text-sm mb-6">L'ID demandé n'existe pas ou a été supprimé.</p>
          <button
            onClick={() => router.push("/admin/users")}
            className="px-4 py-2 bg-neutral-900 hover:bg-neutral-800 text-white rounded-lg text-sm transition-colors"
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
  const plan = user.credits?.plan || user.plan || "free";
  const creditBalance = user.credits?.balance ?? 0;
  const creditTotal = user.credits?.totalAdded ?? 0;
  const PLAN_LABELS = { free: "Gratuit", solo: "Pass Solo", createur: "Pack Créateur", agence: "Pack Agence" };
  const PLAN_COLORS = { free: "text-neutral-500 border-neutral-200 bg-neutral-100", solo: "text-blue-600 border-blue-200 bg-blue-50", createur: "text-emerald-600 border-emerald-200 bg-emerald-50", agence: "text-emerald-600 border-emerald-200 bg-emerald-50" };

  return (
    <div className="min-h-screen bg-neutral-50 text-neutral-700 p-6 md:p-8 font-sans">

      {/* HEADER NAVIGATION */}
      <div className="flex items-center gap-4 mb-8">
        <button
          onClick={() => router.push("/admin/users")}
          className="p-2 rounded-lg bg-white border border-neutral-200 text-neutral-500 hover:text-neutral-900 hover:border-neutral-300 transition-all"
        >
          <ArrowLeft size={18} />
        </button>
        <div>
           <h1 className="text-xl font-bold text-neutral-900 tracking-tight">Détails Utilisateur</h1>
           <p className="text-xs text-neutral-500 font-mono flex items-center gap-2">
              <Hash size={12} /> {user._id}
           </p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* COLONNE GAUCHE : INFOS PRINCIPALES */}
        <div className="lg:col-span-2 space-y-6">

           {/* CARTE D'IDENTITÉ */}
           <div className="bg-white border border-neutral-200 rounded-xl p-6 relative overflow-hidden">

              <div className="flex flex-col sm:flex-row items-start gap-6 relative z-10">
                 {/* Avatar */}
                 <div className="w-20 h-20 rounded-xl bg-neutral-100 border border-neutral-200 flex items-center justify-center text-2xl font-bold text-neutral-500">
                    {initials || <User2 size={32}/>}
                 </div>

                 <div className="flex-1">
                    <h2 className="text-2xl font-bold text-neutral-900 mb-1">{displayName}</h2>

                    <div className="flex items-center gap-2 text-neutral-500 text-sm mb-4">
                       <Mail size={14} className="text-emerald-600" /> {user.email}
                    </div>

                    <div className="flex flex-wrap gap-2">
                       {/* Badge Rôle */}
                       <div className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${
                          role === 'super_admin' ? 'bg-amber-50 border-amber-200 text-amber-600' :
                          role === 'admin' ? 'bg-emerald-50 border-emerald-200 text-emerald-600' :
                          'bg-neutral-100 border-neutral-200 text-neutral-500'
                       }`}>
                          {role === 'super_admin' ? 'Super Admin' : role === 'admin' ? 'Admin' : 'Utilisateur'}
                       </div>

                       {/* Badge Statut */}
                       <div className={`px-2.5 py-1 rounded text-xs font-bold uppercase border flex items-center gap-1.5 ${
                          isActive ? 'bg-emerald-50 border-emerald-200 text-emerald-600' : 'bg-red-50 border-red-200 text-red-600'
                       }`}>
                          <span className={`w-1.5 h-1.5 rounded-full ${isActive ? 'bg-emerald-500 animate-pulse' : 'bg-red-500'}`}></span>
                          {isActive ? 'Actif' : 'Suspendu'}
                       </div>
                    </div>
                 </div>
              </div>

              {/* Détails Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-8 pt-6 border-t border-neutral-200">
                 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><Globe size={12}/> Pays</p>
                    <p className="text-neutral-900 font-medium">{country}</p>
                 </div>
                 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><Languages size={12}/> Langue</p>
                    <p className="text-neutral-900 font-medium">{lang}</p>
                 </div>
                 <div className="bg-neutral-50 p-3 rounded-lg border border-neutral-200">
                    <p className="text-xs text-neutral-500 uppercase font-semibold mb-1 flex items-center gap-1.5"><Calendar size={12}/> Inscrit le</p>
                    <p className="text-neutral-900 font-medium">{createdAt}</p>
                 </div>
              </div>
           </div>

           {/* LISTE DES EBOOKS (Refaite pour garantir l'affichage) */}
           <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden flex flex-col">
              <div className="px-6 py-4 border-b border-neutral-200 bg-white flex justify-between items-center">
                 <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
                    <BookOpen size={16} className="text-emerald-600" />
                    Bibliothèque ({ebooksCount})
                 </h3>
              </div>

              <div className="flex-1">
                {ebooks.length === 0 ? (
                   <div className="p-12 text-center">
                      <div className="w-12 h-12 bg-neutral-100 rounded-full flex items-center justify-center mx-auto mb-3 text-neutral-400">
                         <BookOpen size={20} />
                      </div>
                      <p className="text-neutral-500 text-sm">Aucun eBook généré.</p>
                   </div>
                ) : (
                   <div className="divide-y divide-neutral-200">
                      {ebooks.map((ebook, i) => (
                         <div key={ebook._id || i} className="p-4 flex items-center justify-between hover:bg-neutral-50 transition-colors">
                            <div className="flex items-center gap-4 overflow-hidden">
                               {/* Icone Ebook */}
                               <div className="w-10 h-10 bg-neutral-100 border border-neutral-200 rounded-lg flex items-center justify-center text-neutral-500 shrink-0">
                                  <FileText size={18} />
                               </div>

                               {/* Infos Ebook */}
                               <div className="min-w-0">
                                  <h4 className="text-sm font-bold text-neutral-900 truncate pr-4">
                                     {ebook.title ? ebook.title : "Projet sans titre"}
                                  </h4>
                                  <div className="flex items-center gap-3 text-xs text-neutral-500 mt-0.5">
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
                                  className="p-2 bg-neutral-100 hover:bg-emerald-600 text-neutral-500 hover:text-white rounded-lg transition-all border border-neutral-200 hover:border-emerald-600"
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
           <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4">Gestion du Compte</h3>

              <div className="space-y-3">
                 <button
                    onClick={handleToggleActive}
                    disabled={toggling}
                    className={`w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-bold border transition-all ${
                       isActive
                       ? "bg-transparent border-red-200 text-red-600 hover:bg-red-50"
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

                 <button className="w-full flex items-center justify-center gap-2 py-3 px-4 rounded-lg text-sm font-medium bg-neutral-100 text-neutral-700 hover:bg-neutral-200 border border-neutral-200 transition-all">
                    <Mail size={16} /> Envoyer un email
                 </button>
              </div>
           </div>

           {/* Plan & Crédits */}
           <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Crown size={14} className="text-amber-500" /> Plan & Crédits
              </h3>
              <div className="space-y-3">
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Plan actuel</span>
                    <span className={`px-2.5 py-1 rounded text-xs font-bold uppercase border ${PLAN_COLORS[plan] || PLAN_COLORS.free}`}>
                       {PLAN_LABELS[plan] || plan}
                    </span>
                 </div>
                 <div className="h-px bg-neutral-200"></div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Crédits restants</span>
                    <span className="text-neutral-900 font-mono font-bold">{creditBalance.toLocaleString()}</span>
                 </div>
                 <div className="flex items-center justify-between">
                    <span className="text-sm text-neutral-500">Total ajouté</span>
                    <span className="text-neutral-700 font-mono">{creditTotal.toLocaleString()}</span>
                 </div>
              </div>
           </div>

           {/* Mini Stats */}
           <div className="bg-white border border-neutral-200 rounded-xl p-5">
              <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider mb-4 flex items-center gap-2">
                 <Activity size={14} className="text-emerald-600" /> Métriques
              </h3>

              <div className="space-y-4">
                 <div>
                    <div className="flex justify-between text-sm mb-1.5">
                       <span className="text-neutral-500">Production eBooks</span>
                       <span className="text-neutral-900 font-mono font-bold">{ebooksCount}</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: `${Math.min(ebooksCount * 5, 100)}%` }}></div>
                    </div>
                 </div>

                 <div>
                    <div className="flex justify-between text-sm mb-1.5">
                       <span className="text-neutral-500">Santé du Compte</span>
                       <span className="text-emerald-600 font-mono font-bold">100%</span>
                    </div>
                    <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500 rounded-full" style={{ width: '100%' }}></div>
                    </div>
                 </div>
              </div>
           </div>

           {/* Données Brutes (Debug) */}
           <div className="bg-neutral-50 border border-neutral-200 rounded-xl p-4 font-mono text-[10px] text-neutral-500 overflow-hidden">
              <div className="flex items-center gap-2 mb-2 pb-2 border-b border-neutral-200 text-neutral-500 font-bold">
                 <Terminal size={12} /> SYSTEM_DATA
              </div>
              <p>ID: <span className="text-neutral-700">{user._id}</span></p>
              <p>CREATED: <span className="text-neutral-700">{new Date(user.createdAt).toISOString()}</span></p>
              <p>ROLE: <span className="text-neutral-700">{user.role}</span></p>
           </div>

        </div>
      </div>
    </div>
  );
}
