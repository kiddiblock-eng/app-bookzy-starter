"use client";

import { useEffect, useMemo, useState } from "react";
import {
  Search,
  Globe,
  Mail,
  Eye,
  Ban,
  CheckCircle2,
  Loader2,
  User2,
  Users,
  UserCheck,
  Languages,
  Shield,
  Crown,
  Calendar,
  Filter,
  RefreshCw,
  MoreVertical,
  ChevronDown,
  Download // ✅ Import icône Download
} from "lucide-react";
import { useRouter } from "next/navigation";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

function getAdminHeaders() {
  if (!ADMIN_SECRET) return {};
  return { "x-admin-secret": ADMIN_SECRET };
}

/* =========================================================
   COMPOSANT STAT CARD (Minimaliste)
   ========================================================= */
function StatCard({ icon: Icon, label, value, sublabel, color }) {
  const colors = {
    blue: "text-blue-400 bg-blue-400/10 border-blue-400/20",
    green: "text-emerald-400 bg-emerald-400/10 border-emerald-400/20",
    red: "text-red-400 bg-red-400/10 border-red-400/20",
    amber: "text-amber-400 bg-amber-400/10 border-amber-400/20",
  };
  const theme = colors[color] || colors.blue;

  return (
    <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-4 flex items-center gap-4">
      <div className={`p-3 rounded-lg ${theme}`}>
        <Icon size={20} strokeWidth={2} />
      </div>
      <div>
        <p className="text-slate-400 text-xs font-medium uppercase tracking-wider">{label}</p>
        <div className="flex items-baseline gap-2">
           <span className="text-xl font-bold text-white">{value}</span>
           {sublabel && <span className="text-xs text-slate-500">{sublabel}</span>}
        </div>
      </div>
    </div>
  );
}

/* =========================================================
   PAGE UTILISATEURS
   ========================================================= */

export default function UsersPage() {
  const router = useRouter();

  // --- ETATS & DONNEES ---
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [togglingId, setTogglingId] = useState(null);
  const [search, setSearch] = useState("");
  const [filters, setFilters] = useState({ role: "all", country: "all", lang: "all", status: "all" });

  // --- LOGIQUE API ---
  async function loadUsers() {
    try {
      setLoading(true);
      const res = await fetch("/api/admin/users/list", { headers: getAdminHeaders(), cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.users)) setUsers(data.users);
      else setUsers([]);
    } catch (e) { console.error("Erreur loadUsers:", e); setUsers([]); } 
    finally { setLoading(false); }
  }

  useEffect(() => { loadUsers(); }, []);

  async function handleToggleStatus(user) {
    if (!user?._id || togglingId) return;
    setTogglingId(user._id);
    try {
      const res = await fetch("/api/admin/users/toggle-active", {
        method: "POST",
        headers: { "Content-Type": "application/json", ...getAdminHeaders() },
        body: JSON.stringify({ userId: user._id, isActive: !(user.isActive ?? true) }),
      });
      const data = await res.json();
      if (data.success) {
        setUsers((prev) => prev.map((u) => u._id === user._id ? { ...u, isActive: data.user.isActive } : u));
      }
    } catch (e) { console.error("Erreur toggle:", e); } 
    finally { setTogglingId(null); }
  }

  // --- CALCULS & FILTRES ---
  const countries = useMemo(() => Array.from(new Set(users.map((u) => u.country || u.pays || null).filter(Boolean))).sort(), [users]);
  const langs = useMemo(() => Array.from(new Set(users.map((u) => u.lang || u.language || null).filter(Boolean))).sort(), [users]);
  const roles = useMemo(() => Array.from(new Set(users.map((u) => u.role || "user"))).sort(), [users]);

  const filteredUsers = useMemo(() => {
    let list = Array.isArray(users) ? [...users] : [];
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((u) => {
        const fullName = `${u.firstName || ""} ${u.lastName || ""}`.toLowerCase();
        return fullName.includes(s) || (u.email || "").toLowerCase().includes(s) || (u.country || u.pays || "").toLowerCase().includes(s);
      });
    }
    if (filters.role !== "all") list = list.filter((u) => (u.role || "user") === filters.role);
    if (filters.country !== "all") list = list.filter((u) => (u.country || u.pays) === filters.country);
    if (filters.lang !== "all") list = list.filter((u) => (u.lang || u.language) === filters.lang);
    if (filters.status !== "all") {
      const isActive = filters.status === "active";
      list = list.filter((u) => (u.isActive === undefined || u.isActive === true) === isActive);
    }
    return list;
  }, [users, search, filters]);

  const totalUsers = users.length;
  const activeUsers = users.filter((u) => u.isActive === undefined || u.isActive === true).length;
  const inactiveUsers = totalUsers - activeUsers;
  const newUsersToday = users.filter((u) => {
    if (!u.createdAt) return false;
    return new Date(u.createdAt).toDateString() === new Date().toDateString();
  }).length;

  // ✅ NOUVELLE FONCTION D'EXPORT CSV
  const exportToCSV = () => {
    if (filteredUsers.length === 0) return alert("Aucun utilisateur à exporter.");

    // 1. Définir les en-têtes
    const headers = ["Nom Complet", "Email", "Rôle", "Pays", "Langue", "Date Inscription", "Statut"];

    // 2. Transformer les données
    const rows = filteredUsers.map(user => {
        const fullName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Inconnu";
        const role = user.role || "user";
        const country = user.country || user.pays || "";
        const lang = user.lang || user.language || "";
        const date = user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "";
        const status = (user.isActive ?? true) ? "Actif" : "Inactif";

        // Nettoyage pour éviter les problèmes de CSV (virgules, guillemets)
        return [
            `"${fullName}"`,
            `"${user.email}"`,
            role,
            `"${country}"`,
            lang,
            date,
            status
        ].join(",");
    });

    // 3. Créer le contenu CSV
    const csvContent = "data:text/csv;charset=utf-8," 
        + headers.join(",") + "\n" 
        + rows.join("\n");

    // 4. Déclencher le téléchargement
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", `bookzy_users_${new Date().toISOString().slice(0,10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <div className="space-y-6">
      
      {/* 1. HEADER & STATS */}
      <div className="flex flex-col gap-6">
         <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
            <h1 className="text-2xl font-bold text-white tracking-tight">Gestion Utilisateurs</h1>
            
            <div className="flex items-center gap-3 self-start md:self-auto">
                {/* ✅ BOUTON EXPORT */}
                <button 
                   onClick={exportToCSV}
                   className="flex items-center gap-2 px-4 py-2 bg-[#0f1623] hover:bg-[#1a202c] border border-slate-700 text-slate-300 hover:text-white rounded-lg text-sm font-medium transition-colors"
                >
                   <Download size={16} /> Exporter CSV
                </button>

                <button 
                   onClick={loadUsers} 
                   disabled={loading}
                   className="flex items-center gap-2 px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-sm font-medium transition-colors disabled:opacity-50 shadow-lg shadow-indigo-500/20"
                >
                   <RefreshCw size={16} className={loading ? "animate-spin" : ""} /> Actualiser
                </button>
            </div>
         </div>

         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <StatCard icon={Users} label="Total" value={totalUsers} sublabel="Comptes" color="blue" />
            <StatCard icon={UserCheck} label="Actifs" value={activeUsers} sublabel="En ligne" color="green" />
            <StatCard icon={Ban} label="Inactifs" value={inactiveUsers} sublabel="Désactivés" color="red" />
            <StatCard icon={Calendar} label="Nouveaux" value={newUsersToday} sublabel="Aujourd'hui" color="amber" />
         </div>
      </div>

      {/* 2. FILTERS & SEARCH */}
      <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-4 space-y-4">
         {/* Search */}
         <div className="relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
            <input 
               type="text" 
               placeholder="Rechercher par nom, email, pays..." 
               value={search}
               onChange={(e) => setSearch(e.target.value)}
               className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 transition-colors placeholder:text-slate-600"
            />
         </div>

         {/* Filter Badges Row */}
         <div className="flex flex-wrap gap-2 items-center">
            <Filter size={16} className="text-slate-500 mr-2" />
            
            {/* Role Filter */}
            <div className="relative group">
               <select 
                  value={filters.role} 
                  onChange={(e) => setFilters(f => ({ ...f, role: e.target.value }))}
                  className="appearance-none bg-[#1a202c] border border-slate-700 text-slate-300 text-xs font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none cursor-pointer hover:border-slate-600"
               >
                  <option value="all">Tous les rôles</option>
                  {roles.map(r => <option key={r} value={r}>{r === 'super_admin' ? 'Super Admin' : r}</option>)}
               </select>
               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
            </div>

            {/* Country Filter */}
            <div className="relative">
               <select 
                  value={filters.country} 
                  onChange={(e) => setFilters(f => ({ ...f, country: e.target.value }))}
                  className="appearance-none bg-[#1a202c] border border-slate-700 text-slate-300 text-xs font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none cursor-pointer hover:border-slate-600"
               >
                  <option value="all">Tous les pays</option>
                  {countries.map(c => <option key={c} value={c}>{c}</option>)}
               </select>
               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
            </div>

            {/* Status Filter */}
            <div className="relative">
               <select 
                  value={filters.status} 
                  onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
                  className="appearance-none bg-[#1a202c] border border-slate-700 text-slate-300 text-xs font-medium rounded-lg pl-3 pr-8 py-2 focus:outline-none cursor-pointer hover:border-slate-600"
               >
                  <option value="all">Tous les statuts</option>
                  <option value="active">Actifs</option>
                  <option value="inactive">Inactifs</option>
               </select>
               <ChevronDown className="absolute right-2 top-1/2 -translate-y-1/2 w-3 h-3 text-slate-500 pointer-events-none" />
            </div>

            {/* Reset Filter Button */}
            {(filters.role !== 'all' || filters.country !== 'all' || filters.status !== 'all' || search) && (
               <button 
                  onClick={() => { setSearch(""); setFilters({ role: "all", country: "all", lang: "all", status: "all" }); }}
                  className="text-xs text-red-400 hover:text-red-300 ml-auto font-medium"
               >
                  Réinitialiser
               </button>
            )}
         </div>
      </div>

      {/* 3. USERS LIST */}
      <div className="bg-[#0f1623] border border-slate-800 rounded-xl overflow-hidden">
         {loading ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500">
               <Loader2 className="w-8 h-8 animate-spin mb-2 text-indigo-500" />
               <p className="text-sm">Chargement des données...</p>
            </div>
         ) : filteredUsers.length === 0 ? (
            <div className="p-12 flex flex-col items-center justify-center text-slate-500">
               <User2 className="w-10 h-10 mb-2 opacity-20" />
               <p className="text-sm">Aucun utilisateur trouvé.</p>
            </div>
         ) : (
            <>
               {/* DESKTOP TABLE */}
               <div className="hidden lg:block overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#131b2e] border-b border-slate-800 text-xs uppercase text-slate-400 font-semibold tracking-wide">
                           <th className="px-6 py-4">Utilisateur</th>
                           <th className="px-6 py-4">Rôle</th>
                           <th className="px-6 py-4">Pays</th>
                           <th className="px-6 py-4">Date Inscription</th>
                           <th className="px-6 py-4">Statut</th>
                           <th className="px-6 py-4 text-right">Actions</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800">
                        {filteredUsers.map(user => {
                           const isActive = user.isActive ?? true;
                           const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Inconnu";
                           
                           return (
                              <tr key={user._id} className="hover:bg-slate-800/30 transition-colors group">
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                       <div className="w-9 h-9 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 border border-slate-700">
                                          {displayName.charAt(0).toUpperCase()}
                                       </div>
                                       <div>
                                          <p className="text-sm font-medium text-slate-200">{displayName}</p>
                                          <p className="text-xs text-slate-500">{user.email}</p>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-4">
                                    {user.role === 'super_admin' ? (
                                       <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-amber-500/10 text-amber-400 border border-amber-500/20"><Crown size={12}/> Super Admin</span>
                                    ) : user.role === 'admin' ? (
                                       <span className="inline-flex items-center gap-1 px-2 py-1 rounded text-xs font-medium bg-purple-500/10 text-purple-400 border border-purple-500/20"><Shield size={12}/> Admin</span>
                                    ) : (
                                       <span className="text-xs text-slate-400">Utilisateur</span>
                                    )}
                                 </td>
                                 <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-sm text-slate-400">
                                       <Globe size={14} className="text-slate-600" />
                                       {user.country || user.pays || "—"}
                                    </div>
                                 </td>
                                 <td className="px-6 py-4 text-sm text-slate-500 font-mono text-xs">
                                    {user.createdAt ? new Date(user.createdAt).toLocaleDateString("fr-FR") : "—"}
                                 </td>
                                 <td className="px-6 py-4">
                                    {isActive ? (
                                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-500"></span> Actif
                                       </span>
                                    ) : (
                                       <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium bg-red-500/10 text-red-400 border border-red-500/20">
                                          <span className="w-1.5 h-1.5 rounded-full bg-red-500"></span> Inactif
                                       </span>
                                    )}
                                 </td>
                                 <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                       <button 
                                          onClick={() => router.push(`/admin/users/${user._id}`)}
                                          className="p-1.5 text-slate-400 hover:text-white hover:bg-slate-700 rounded transition-colors"
                                          title="Voir profil"
                                       >
                                          <Eye size={16} />
                                       </button>
                                       <button 
                                          onClick={() => handleToggleStatus(user)}
                                          disabled={togglingId === user._id}
                                          className={`p-1.5 rounded transition-colors ${isActive ? 'text-red-400 hover:bg-red-500/10' : 'text-emerald-400 hover:bg-emerald-500/10'}`}
                                          title={isActive ? "Désactiver" : "Activer"}
                                       >
                                          {togglingId === user._id ? <Loader2 size={16} className="animate-spin" /> : isActive ? <Ban size={16} /> : <CheckCircle2 size={16} />}
                                       </button>
                                    </div>
                                 </td>
                              </tr>
                           );
                        })}
                     </tbody>
                  </table>
               </div>

               {/* MOBILE CARDS */}
               <div className="lg:hidden divide-y divide-slate-800">
                  {filteredUsers.map(user => {
                     const isActive = user.isActive ?? true;
                     const displayName = `${user.firstName || ""} ${user.lastName || ""}`.trim() || user.name || "Inconnu";

                     return (
                        <div key={user._id} className="p-4 flex flex-col gap-3">
                           <div className="flex justify-between items-start">
                              <div className="flex items-center gap-3">
                                 <div className="w-10 h-10 rounded-lg bg-slate-800 flex items-center justify-center text-sm font-bold text-slate-300 border border-slate-700">
                                    {displayName.charAt(0).toUpperCase()}
                                 </div>
                                 <div>
                                    <p className="text-sm font-medium text-slate-200">{displayName}</p>
                                    <p className="text-xs text-slate-500">{user.email}</p>
                                 </div>
                              </div>
                              <button onClick={() => router.push(`/admin/users/${user._id}`)} className="text-slate-400 p-2"><MoreVertical size={16}/></button>
                           </div>
                           
                           <div className="flex items-center justify-between text-xs text-slate-400 bg-slate-800/50 p-2 rounded-lg">
                              <div className="flex items-center gap-2"><Globe size={12}/> {user.country || "—"}</div>
                              <div className="flex items-center gap-2"><Calendar size={12}/> {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : "—"}</div>
                           </div>

                           <div className="flex items-center justify-between mt-1">
                              {isActive ? (
                                 <span className="text-xs font-medium text-emerald-400 flex items-center gap-1"><CheckCircle2 size={12}/> Compte Actif</span>
                              ) : (
                                 <span className="text-xs font-medium text-red-400 flex items-center gap-1"><Ban size={12}/> Compte Suspendu</span>
                              )}
                              
                              <button 
                                 onClick={() => handleToggleStatus(user)}
                                 disabled={togglingId === user._id}
                                 className={`text-xs px-3 py-1.5 rounded border ${isActive ? 'border-red-500/30 text-red-400' : 'border-emerald-500/30 text-emerald-400'}`}
                              >
                                 {togglingId === user._id ? "..." : isActive ? "Désactiver" : "Activer"}
                              </button>
                           </div>
                        </div>
                     )
                  })}
               </div>
            </>
         )}
      </div>
    </div>
  );
}