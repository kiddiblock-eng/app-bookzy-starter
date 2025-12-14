"use client";

import { useState, useEffect, useMemo } from "react";
import {
  Loader2,
  Camera,
  Mail,
  Lock,
  ChevronRight,
  Activity,
  BarChart3,
  User,
  Shield,
  CheckCircle2,
  Package,
  FileText,
  Settings,
} from "lucide-react";
import {
  ResponsiveContainer,
  CartesianGrid,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  Tooltip,
} from "recharts";

import countriesJson from "../../../utils/countries.json";

/* ──────────────────────────────────────────────
   Utils & Composants UI
────────────────────────────────────────────── */
function normaliseCountries(raw) {
  if (!Array.isArray(raw)) return [];
  return raw
    .map((c) => ({
      name: c.name || "",
      code: c.code || "",
    }))
    .filter((c) => c.name);
}

function StatCard({ icon, badge, value, subtitle, trend }) {
  return (
    <div className="bg-white rounded-xl p-5 border border-slate-200 shadow-sm hover:border-slate-300 transition-all">
      <div className="flex items-start justify-between mb-4">
        <div className="p-2 bg-slate-50 rounded-lg text-slate-600 border border-slate-100">
          {icon}
        </div>
        {badge && (
          <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 bg-slate-100 px-2 py-1 rounded">
            {badge}
          </span>
        )}
      </div>
      <div className="flex items-baseline gap-2">
         <h3 className="text-2xl font-bold text-slate-900">{value}</h3>
         {typeof trend === 'number' && (
            <span className={`text-xs font-medium ${trend > 0 ? "text-emerald-600" : trend < 0 ? "text-rose-600" : "text-slate-500"}`}>
                {trend > 0 ? "+" : ""}{trend}%
            </span>
         )}
      </div>
      <p className="text-sm text-slate-500 mt-1">{subtitle}</p>
    </div>
  );
}

/* ──────────────────────────────────────────────
   PAGE PARAMÈTRES (CODE COMPLET)
────────────────────────────────────────────── */
export default function ParametresPage() {
  // --- ETATS ---
  const [user, setUser] = useState(null);
  const [userName, setUserName] = useState("");
  const [photo, setPhoto] = useState("");
  const [langue, setLangue] = useState("fr");
  const [pays, setPays] = useState("");
  const [activeTab, setActiveTab] = useState("profil");

  // Par défaut "mois" pour avoir une vue d'ensemble
  const [periode, setPeriode] = useState("mois");

  const [stats, setStats] = useState({
    total: 0,
    ebooks: 0,
    kits: 0,
    trends: { total: 0, ebooks: 0, kits: 0 },
    data: [],
  });

  const [loading, setLoading] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(false);

  const normalisedCountries = useMemo(() => normaliseCountries(countriesJson), []);
  const flatCountries = useMemo(() => normalisedCountries.sort((a, b) => a.name.localeCompare(b.name, "fr")), [normalisedCountries]);

  // 1. CHARGEMENT PROFIL
  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("/api/profile/get", { credentials: "include" });
        if (!res.ok || cancelled) return;
        const data = await res.json();
        const u = data.user;
        if (cancelled) return;
        
        setUser(u);
        setUserName(u?.displayName || `${u?.firstName || ""} ${u?.lastName || ""}`.trim() || "");
        setPhoto(u?.photo || "");
        setLangue(u?.lang || "fr");
        setPays(u?.country || "");
      } catch (e) {
        console.error("Erreur profile get:", e);
      }
    })();
    return () => { cancelled = true; };
  }, []);

  // 2. AUTO-DETECTION PAYS
  useEffect(() => {
    if (pays || !user) return;
    let cancelled = false;
    (async () => {
      try {
        const res = await fetch("https://ipapi.co/json/");
        const data = await res.json();
        if (cancelled) return;
        const found = flatCountries.find(c => c.name?.toLowerCase() === (data?.country_name || "").toLowerCase());
        setPays(found?.name || "France");
      } catch {
        if (!cancelled) setPays("France");
      }
    })();
    return () => { cancelled = true; };
  }, [user, flatCountries, pays]);

  // 3. CHARGEMENT STATS (AVEC FILTRAGE COMPLET CHIFFRES + COURBE)
  useEffect(() => {
    if (activeTab !== "stats") return;
    let cancelled = false;

    (async () => {
      try {
        const res = await fetch("/api/ebooks/user", {
          cache: "no-store",
          credentials: "include",
          headers: { "Content-Type": "application/json" }
        });
        if (!res.ok || cancelled) throw new Error("Erreur API stats");
        
        const json = await res.json();
        if (cancelled) return;

        if (json.success && Array.isArray(json.ebooks)) {
          const allEbooks = json.ebooks;
          const now = new Date();

          // A. FILTRAGE : On garde uniquement les ebooks de la période sélectionnée
          const filteredEbooks = allEbooks.filter(e => {
             if (!e.createdAt) return false;
             const d = new Date(e.createdAt);
             
             if (periode === 'jour') {
                // Seulement aujourd'hui
                return d.getDate() === now.getDate() && 
                       d.getMonth() === now.getMonth() && 
                       d.getFullYear() === now.getFullYear();
             }
             if (periode === 'mois') {
                // Seulement ce mois-ci
                return d.getMonth() === now.getMonth() && 
                       d.getFullYear() === now.getFullYear();
             }
             if (periode === 'annee') {
                // Seulement cette année
                return d.getFullYear() === now.getFullYear();
             }
             return true;
          });

          // B. CALCUL DES CHIFFRES (Basé sur le tableau FILTRÉ)
          const totalPeriode = filteredEbooks.length;
          const finishedPeriode = filteredEbooks.filter(e => e.fileUrl).length;
          const kitsPeriode = totalPeriode - finishedPeriode;

          // C. REGROUPEMENT POUR LE GRAPHIQUE
          const dataMap = {};
          
          filteredEbooks.forEach(e => {
             const d = new Date(e.createdAt);
             let key;
             let sortKey; // Pour le tri chronologique

             if (periode === 'jour') {
                // Grouper par heure (ex: 14h)
                key = `${String(d.getHours()).padStart(2, '0')}h`; 
                sortKey = d.getTime(); 
             } else if (periode === 'mois') {
                // Grouper par jour du mois (ex: 13/12)
                key = `${String(d.getDate()).padStart(2, '0')}/${String(d.getMonth()+1).padStart(2, '0')}`;
                sortKey = d.getDate();
             } else {
                // Grouper par mois (Jan, Fév...)
                const mois = ["Jan", "Fév", "Mar", "Avr", "Mai", "Juin", "Juil", "Août", "Sep", "Oct", "Nov", "Déc"];
                key = mois[d.getMonth()];
                sortKey = d.getMonth();
             }

             if (!dataMap[key]) {
                 dataMap[key] = { date: key, montant: 0, sortKey: sortKey };
             }
             dataMap[key].montant += 1;
          });
          
          // D. TRI DES DONNÉES
          const chartData = Object.values(dataMap).sort((a, b) => a.sortKey - b.sortKey);

          // E. MISE À JOUR DE L'ÉTAT
          setStats({
            total: totalPeriode,      // ✅ Mis à jour selon filtre
            ebooks: finishedPeriode,  // ✅ Mis à jour selon filtre
            kits: kitsPeriode,        // ✅ Mis à jour selon filtre
            trends: { total: 0, ebooks: 0, kits: 0 },
            data: chartData.length > 0 ? chartData : []
          });
        }
      } catch (err) {
        console.error(err);
      }
    })();
    return () => { cancelled = true; };
  }, [activeTab, periode]); // Se relance quand on change la période

  // 4. UPLOAD PHOTO
  async function handlePhotoUpload(e) {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadProgress(true);
    const formData = new FormData();
    formData.append("file", file);
    
    try {
      const res = await fetch("/api/profile/upload", { method: "POST", body: formData });
      const data = await res.json();
      
      if (res.ok) {
        setPhoto(data.imageUrl);
        setUser((prev) => (prev ? { ...prev, photo: data.imageUrl } : prev));
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        alert("Erreur upload : " + data.error);
      }
    } catch {
      alert("Erreur réseau upload");
    } finally {
      setUploadProgress(false);
    }
  }

  // 5. SAUVEGARDE
  async function handleSave() {
    setLoading(true);
    try {
      const res = await fetch("/api/profile/update", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ displayName: userName, country: pays, lang: langue }),
      });
      const data = await res.json();
      
      if (res.ok) {
        setUser(data.user);
        setSaveSuccess(true);
        setTimeout(() => setSaveSuccess(false), 2500);
      } else {
        alert("Erreur update : " + (data?.error || "Inconnue"));
      }
    } catch (e) {
      alert("Erreur réseau update");
    } finally {
      setLoading(false);
    }
  }

  const displayPhoto = photo || `https://ui-avatars.com/api/?name=${encodeURIComponent(userName || "User")}&background=0f172a&color=fff&size=256`;

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#F8FAFC]">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
          <p className="text-sm text-slate-500 font-medium">Chargement du compte...</p>
        </div>
      </div>
    );
  }

  const tabs = [
    { id: "profil", label: "Général & Profil", icon: User },
    { id: "stats", label: "Analytiques", icon: BarChart3 },
    { id: "securite", label: "Connexion", icon: Shield },
  ];

  return (
    <div className="min-h-screen bg-[#F8FAFC] font-sans text-slate-900 pb-20">
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-8">
        
        {/* En-tête de page simple */}
        <div className="flex items-center justify-between mb-8">
           <h1 className="text-2xl font-bold text-slate-900">Paramètres</h1>
           {saveSuccess && (
              <div className="flex items-center gap-2 text-sm font-medium text-emerald-600 bg-emerald-50 px-3 py-1.5 rounded-full animate-fadeIn border border-emerald-100">
                 <CheckCircle2 size={16} /> Modifications enregistrées
              </div>
           )}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            
            {/* NAVIGATION LATÉRALE */}
            <div className="lg:col-span-3">
                <nav className="space-y-1 sticky top-8">
                    {tabs.map((tab) => {
                        const Icon = tab.icon;
                        const isActive = activeTab === tab.id;
                        return (
                        <button
                            key={tab.id}
                            onClick={() => setActiveTab(tab.id)}
                            className={`w-full flex items-center gap-3 px-4 py-2.5 rounded-lg text-sm font-medium transition-all ${
                                isActive
                                    ? "bg-white text-slate-900 shadow-sm border border-slate-200 font-semibold"
                                    : "text-slate-500 hover:bg-slate-100/80"
                            }`}
                        >
                            <Icon size={18} className={isActive ? "text-slate-900" : "text-slate-400"} />
                            {tab.label}
                        </button>
                        );
                    })}
                </nav>
            </div>

            {/* ZONE DE CONTENU */}
            <div className="lg:col-span-9 space-y-6">
                
                {/* ─── ONGLET PROFIL ─── */}
                {activeTab === "profil" && (
                    <div className="space-y-6 animate-fadeIn">
                        
                        {/* Section Avatar */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-base font-bold text-slate-900 mb-6 pb-4 border-b border-slate-50">Identité publique</h2>
                            <div className="flex items-center gap-6">
                                <div className="relative group w-20 h-20 shrink-0">
                                    <div className="w-full h-full rounded-full overflow-hidden border border-slate-100 bg-slate-50">
                                        <img src={displayPhoto} alt="Avatar" className="w-full h-full object-cover" />
                                        {uploadProgress && <div className="absolute inset-0 bg-black/40 flex items-center justify-center"><Loader2 className="text-white animate-spin w-6 h-6"/></div>}
                                    </div>
                                    <label className="absolute -bottom-1 -right-1 bg-white border border-slate-200 text-slate-600 p-1.5 rounded-full cursor-pointer hover:bg-slate-50 transition shadow-sm">
                                        <Camera size={14} />
                                        <input type="file" accept="image/*" className="hidden" onChange={handlePhotoUpload} />
                                    </label>
                                </div>
                                <div>
                                    <div className="text-sm font-semibold text-slate-900">Photo de profil</div>
                                    <p className="text-xs text-slate-500 mt-1 max-w-[280px]">
                                        Formats acceptés : JPG, PNG. Max 5MB.
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Formulaire Info */}
                        <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6">
                            <h2 className="text-base font-bold text-slate-900 mb-6 pb-4 border-b border-slate-50">Détails du compte</h2>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Nom complet</label>
                                    <input
                                        type="text"
                                        value={userName}
                                        onChange={(e) => setUserName(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                                        placeholder="Ex: Jean Dupont"
                                    />
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Email</label>
                                    <div className="relative">
                                        <Mail className="absolute left-3 top-2.5 text-slate-400 w-4 h-4" />
                                        <input
                                            type="email"
                                            value={user?.email || ""}
                                            disabled
                                            className="w-full pl-9 pr-3 py-2.5 bg-slate-50 border border-slate-200 rounded-lg text-slate-500 text-sm cursor-not-allowed"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Pays</label>
                                    <select
                                        value={pays}
                                        onChange={(e) => setPays(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                                    >
                                        <option value="">Sélectionner...</option>
                                        {flatCountries.map((c) => <option key={c.code} value={c.name}>{c.name}</option>)}
                                    </select>
                                </div>
                                <div>
                                    <label className="block text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Langue</label>
                                    <select
                                        value={langue}
                                        onChange={(e) => setLangue(e.target.value)}
                                        className="w-full px-3 py-2.5 bg-white border border-slate-200 rounded-lg text-slate-900 text-sm focus:border-slate-400 focus:ring-4 focus:ring-slate-100 outline-none transition-all"
                                    >
                                        <option value="fr">Français</option>
                                        <option value="en">English</option>
                                        <option value="es">Espagnol</option>
                                    </select>
                                </div>
                            </div>

                            <div className="mt-8 pt-6 border-t border-slate-50 flex justify-end">
                                <button
                                    onClick={handleSave}
                                    disabled={loading}
                                    className="px-6 py-2.5 bg-slate-900 text-white text-sm font-bold rounded-lg hover:bg-slate-800 disabled:opacity-70 transition-all flex items-center gap-2 shadow-sm"
                                >
                                    {loading && <Loader2 size={16} className="animate-spin" />}
                                    Sauvegarder
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* ─── ONGLET STATS ─── */}
                {activeTab === "stats" && (
                    <div className="space-y-6 animate-fadeIn">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-bold text-slate-900">Performance</h2>
                            <div className="flex bg-white border border-slate-200 rounded-lg p-1 shadow-sm">
                                {["jour", "mois", "annee"].map((p) => (
                                    <button
                                        key={p}
                                        onClick={() => setPeriode(p)}
                                        className={`px-3 py-1 text-xs font-bold rounded transition-colors ${periode === p ? "bg-slate-100 text-slate-900" : "text-slate-500 hover:text-slate-700"}`}
                                    >
                                        {p.charAt(0).toUpperCase() + p.slice(1)}
                                    </button>
                                ))}
                            </div>
                        </div>

                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                            <StatCard icon={<Package size={20}/>} badge="TOTAL" value={stats.total} subtitle="Projets créés" trend={null} />
                            <StatCard icon={<FileText size={20}/>} badge="FINIS" value={stats.ebooks} subtitle="eBooks terminés" trend={null} />
                            <StatCard icon={<Activity size={20}/>} badge="WIP" value={stats.kits} subtitle="En cours" trend={null} />
                        </div>

                        <div className="bg-white rounded-xl border border-slate-200 p-6 shadow-sm">
                            <h3 className="text-sm font-bold text-slate-900 mb-6">Activité de création ({periode})</h3>
                            <div className="h-64 w-full">
                                <ResponsiveContainer width="100%" height="100%">
                                    <AreaChart data={stats.data.length ? stats.data : []}>
                                        <defs>
                                            <linearGradient id="colorGraph" x1="0" y1="0" x2="0" y2="1">
                                                <stop offset="5%" stopColor="#0f172a" stopOpacity={0.1}/>
                                                <stop offset="95%" stopColor="#0f172a" stopOpacity={0}/>
                                            </linearGradient>
                                        </defs>
                                        <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                                        <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} dy={10} />
                                        <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#64748b'}} allowDecimals={false} />
                                        <Tooltip contentStyle={{ borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.05)' }} />
                                        <Area type="monotone" dataKey="montant" stroke="#0f172a" strokeWidth={2} fill="url(#colorGraph)" />
                                    </AreaChart>
                                </ResponsiveContainer>
                                {stats.data.length === 0 && (
                                    <div className="flex h-full items-center justify-center text-sm text-slate-400 pb-10">Aucune donnée pour cette période</div>
                                )}
                            </div>
                        </div>
                    </div>
                )}
                
                {/* ─── ONGLET SÉCURITÉ ─── */}
                {activeTab === "securite" && (
                     <div className="bg-white rounded-xl border border-slate-200 divide-y divide-slate-100 animate-fadeIn shadow-sm">
                        <a href="/dashboard/parametres/email" className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                             <div className="flex items-center gap-4">
                                 <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Mail size={20} /></div>
                                 <div>
                                     <h3 className="text-sm font-bold text-slate-900">Adresse E-mail</h3>
                                     <p className="text-xs text-slate-500 mt-0.5">{user?.email}</p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 group-hover:bg-white transition-colors">Modifier</span>
                                <ChevronRight size={16} className="text-slate-300" />
                             </div>
                        </a>

                        <a href="/dashboard/parametres/motdepasse" className="p-6 flex items-center justify-between hover:bg-slate-50 transition-colors cursor-pointer group">
                             <div className="flex items-center gap-4">
                                 <div className="p-2 bg-slate-100 text-slate-600 rounded-lg"><Lock size={20} /></div>
                                 <div>
                                     <h3 className="text-sm font-bold text-slate-900">Mot de passe</h3>
                                     <p className="text-xs text-slate-500 mt-0.5">Dernière modification il y a 3 mois</p>
                                 </div>
                             </div>
                             <div className="flex items-center gap-2">
                                <span className="text-xs font-semibold text-slate-400 bg-slate-50 px-2 py-1 rounded border border-slate-100 group-hover:bg-white transition-colors">Mettre à jour</span>
                                <ChevronRight size={16} className="text-slate-300" />
                             </div>
                        </a>
                     </div>
                )}

            </div>
        </div>
      </div>
      
      <style jsx>{`
        @keyframes fadeIn { from { opacity: 0; transform: translateY(5px); } to { opacity: 1; transform: translateY(0); } }
        .animate-fadeIn { animation: fadeIn 0.3s ease-out; }
      `}</style>
    </div>
  );
}