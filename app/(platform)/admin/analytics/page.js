"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  BookOpen,
  DollarSign,
  Activity,
  Globe2,
  BarChart3,
  PieChart as PieIcon,
  Trophy,
  Loader2,
  TrendingUp,
  TrendingDown,
  Crown,
  Medal,
  Award,
  AlertTriangle,
  RefreshCw,
  Calendar,
  Smartphone,
  Clock,
  Layers
} from "lucide-react";

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  PieChart,
  Pie,
  Cell,
} from "recharts";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

function getAdminHeaders() {
  if (!ADMIN_SECRET) return {};
  return { "x-admin-secret": ADMIN_SECRET };
}

/* =========================================================
   COMPOSANTS UI (Design "Mission Control" - Thème clair)
   ========================================================= */

function StatCard({ icon: Icon, label, value, sub, trend, color = "emerald" }) {
  const themes = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    amber: "text-amber-600 bg-amber-50 border-amber-200",
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    red: "text-red-600 bg-red-50 border-red-200",
  };
  const theme = themes[color] || themes.emerald;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg ${theme}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        {typeof trend === "number" && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
            trend > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            {trend > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(trend)}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</h3>
        <div className="text-2xl font-bold text-neutral-900 tracking-tight">{value}</div>
        {sub && <p className="text-neutral-500 text-xs mt-1">{sub}</p>}
      </div>
    </div>
  );
}

function SectionHeader({ title, subtitle, icon: Icon, color = "emerald" }) {
  const colors = {
    emerald: "text-emerald-600", amber: "text-amber-600", blue: "text-blue-600", red: "text-red-600"
  };
  return (
    <div className="flex items-center gap-3 mb-6">
      <div className={`p-2 rounded-lg bg-neutral-50 border border-neutral-200 ${colors[color]}`}>
        <Icon size={18} />
      </div>
      <div>
        <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">{title}</h3>
        <p className="text-xs text-neutral-500">{subtitle}</p>
      </div>
    </div>
  );
}

function CustomTooltip({ active, payload, label }) {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-neutral-200 rounded-lg p-3 shadow-xl">
        <p className="text-neutral-700 text-xs font-bold mb-2 border-b border-neutral-200 pb-1">{label}</p>
        {payload.map((entry, index) => (
          <div key={index} className="flex items-center justify-between gap-4 text-xs mb-1">
            <span className="text-neutral-500 flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full" style={{ backgroundColor: entry.color || entry.fill }} />
              {entry.name}
            </span>
            <span className="text-neutral-900 font-mono font-bold">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

// Couleurs Charts
const PIE_COLORS = ["#059669", "#10b981", "#f59e0b", "#3b82f6", "#34d399", "#ec4899", "#f43f5e"];

/* =========================================================
   PAGE ANALYTICS
   ========================================================= */

export default function AnalyticsPage() {
  const [period, setPeriod] = useState("30");
  const [loading, setLoading] = useState(true);

  // --- ETATS DE DONNEES ---
  const [stats, setStats] = useState({ totalUsers: 0, activeUsers: 0, totalEbooks: 0, totalRevenue: 0, totalSales: 0 });
  const [usersDaily, setUsersDaily] = useState([]);
  const [ebooksDaily, setEbooksDaily] = useState([]);
  const [revenueDaily, setRevenueDaily] = useState([]);
  const [usersByCountry, setUsersByCountry] = useState([]);
  const [templatesStats, setTemplatesStats] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [activityByHour, setActivityByHour] = useState([]);
  const [deviceStats, setDeviceStats] = useState([]);
  const [abandonStats, setAbandonStats] = useState(null);
  const [ebooksDistribution, setEbooksDistribution] = useState([]);

  // --- LOGIQUE API (RESTAURÉE EXACTEMENT COMME L'ORIGINAL) ---
  async function loadStats() {
    try {
      setLoading(true);

      // 1. Stats principales
      const res = await fetch(`/api/admin/analytics/stats?days=${period}`, { headers: getAdminHeaders(), cache: "no-store" });
      const json = await res.json();
      if (json.success && json.data) {
        const { kpis, usersDaily, ebooksDaily, revenueDaily, usersByCountry, templatesStats, topUsers } = json.data;
        setStats({
          totalUsers: kpis.totalUsers || 0,
          activeUsers: kpis.activeUsers || 0,
          totalEbooks: kpis.totalEbooks || 0,
          totalRevenue: kpis.totalRevenue || 0,
          totalSales: kpis.totalSales || 0,
        });
        setUsersDaily(usersDaily || []);
        setEbooksDaily(ebooksDaily || []);
        setRevenueDaily(revenueDaily || []);
        setUsersByCountry(usersByCountry || []);
        setTemplatesStats(templatesStats || []);
        setTopUsers(topUsers || []);
      }

      // 2. 🔥 Heatmap des heures (Connexion rétablie à 100%)
      try {
        const resHours = await fetch("/api/admin/analytics/hourly", {
          headers: getAdminHeaders(),
          cache: "no-store",
        });
        const jsonHours = await resHours.json();
        if (jsonHours.success && Array.isArray(jsonHours.data)) {
          setActivityByHour(jsonHours.data);
        } else {
          setActivityByHour([]);
        }
      } catch (e) {
        console.error("Erreur activity-hours:", e);
        setActivityByHour([]);
      }

      // 3. 📱 Appareils
      try {
        const resDev = await fetch("/api/admin/analytics/devices", { headers: getAdminHeaders(), cache: "no-store" });
        const jsonDev = await resDev.json();
        if (jsonDev.success && Array.isArray(jsonDev.data)) setDeviceStats(jsonDev.data);
      } catch (e) { console.error("Erreur devices:", e); }

      // 4. ⚠️ Abandon
      try {
        const resAb = await fetch("/api/admin/analytics/abandoned", { headers: getAdminHeaders(), cache: "no-store" });
        const jsonAb = await resAb.json();
        if (jsonAb.success && jsonAb.abandonStats) setAbandonStats(jsonAb.abandonStats);
      } catch (e) { console.error("Erreur abandon:", e); }

      // 5. 📚 Distribution
      try {
        const resDist = await fetch("/api/admin/analytics/ebooks-distribution", { headers: getAdminHeaders(), cache: "no-store" });
        const jsonDist = await resDist.json();
        if (jsonDist.success && Array.isArray(jsonDist.data)) setEbooksDistribution(jsonDist.data);
      } catch (e) { console.error("Erreur distribution:", e); }

    } catch (e) { console.error("loadStats error:", e); }
    finally { setLoading(false); }
  }

  useEffect(() => { loadStats(); }, [period]);

  // --- CALCULS (INCHANGÉS) ---
  const combinedDaily = useMemo(() => {
    const map = new Map();
    usersDaily.forEach(d => map.set(d.date, { date: d.date, users: d.count, ebooks: 0, revenue: 0 }));
    ebooksDaily.forEach(d => { const e = map.get(d.date) || { date: d.date, users: 0, ebooks: 0, revenue: 0 }; e.ebooks = d.count; map.set(d.date, e); });
    revenueDaily.forEach(d => { const e = map.get(d.date) || { date: d.date, users: 0, ebooks: 0, revenue: 0 }; e.revenue = d.total || d.count || 0; map.set(d.date, e); });
    return Array.from(map.values()).sort((a, b) => {
        const [da, ma] = a.date.split("-").map(Number); const [db, mb] = b.date.split("-").map(Number);
        if (ma === mb) return da - db; return ma - mb;
    });
  }, [usersDaily, ebooksDaily, revenueDaily]);

  const totalTemplates = useMemo(() => templatesStats.reduce((sum, t) => sum + t.count, 0), [templatesStats]);

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4 text-neutral-500">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-xs font-mono tracking-widest uppercase">Analyse des données...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-8 space-y-8 text-neutral-700 font-sans">

      {/* 1. HEADER & PERIOD SELECTOR */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Rapports & Analyses</h1>
          <p className="text-sm text-neutral-500 mt-1 flex items-center gap-2">
             <Activity size={14} className="text-emerald-600" />
             Système opérationnel • Mise à jour en temps réel
          </p>
        </div>

        <div className="bg-white border border-neutral-200 p-1 rounded-lg flex items-center">
          {["7", "30", "90"].map((p) => (
            <button
              key={p}
              onClick={() => setPeriod(p)}
              className={`px-4 py-1.5 text-xs font-bold rounded-md transition-all ${
                period === p ? "bg-neutral-900 text-white" : "text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100"
              }`}
            >
              {p} Jours
            </button>
          ))}
        </div>
      </div>

      {/* 2. KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} label="Total Utilisateurs" value={stats.totalUsers.toLocaleString()} sub={`${stats.activeUsers} actifs`} trend={12} color="emerald" />
        <StatCard icon={BookOpen} label="Ebooks Générés" value={stats.totalEbooks.toLocaleString()} sub={`${stats.totalSales} ventes`} trend={8} color="blue" />
        <StatCard icon={DollarSign} label="Revenus (FCFA)" value={stats.totalRevenue.toLocaleString()} sub="Volume total" trend={15} color="amber" />
        <StatCard icon={Calendar} label="Période" value={`${period} Jours`} sub="Plage d'analyse" color="emerald" />
      </div>

      {/* 3. MAIN CHART (Area) */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
        <div className="flex justify-between items-center mb-6">
           <div>
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Performance Globale</h3>
              <p className="text-xs text-neutral-500">Utilisateurs, Ebooks et Revenus</p>
           </div>
           <div className="flex gap-4 text-xs font-medium">
              <span className="flex items-center gap-1.5 text-emerald-600"><div className="w-2 h-2 rounded-full bg-emerald-500"></div> Utilisateurs</span>
              <span className="flex items-center gap-1.5 text-blue-600"><div className="w-2 h-2 rounded-full bg-blue-500"></div> eBooks</span>
              <span className="flex items-center gap-1.5 text-amber-600"><div className="w-2 h-2 rounded-full bg-amber-500"></div> Revenus</span>
           </div>
        </div>

        <div className="h-[350px] w-full">
           {combinedDaily.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-neutral-500">
                 <BarChart3 className="w-10 h-10 mb-2 opacity-20" />
                 <p className="text-xs">Aucune donnée sur cette période</p>
              </div>
           ) : (
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={combinedDaily} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                  <defs>
                    <linearGradient id="gradUsers" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/><stop offset="95%" stopColor="#10b981" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gradEbooks" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#3b82f6" stopOpacity={0.3}/><stop offset="95%" stopColor="#3b82f6" stopOpacity={0}/></linearGradient>
                    <linearGradient id="gradRev" x1="0" y1="0" x2="0" y2="1"><stop offset="5%" stopColor="#f59e0b" stopOpacity={0.3}/><stop offset="95%" stopColor="#f59e0b" stopOpacity={0}/></linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis dataKey="date" stroke="#a3a3a3" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a3a3a3" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke: '#d4d4d4', strokeWidth: 1 }} />
                  <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fill="url(#gradUsers)" />
                  <Area type="monotone" dataKey="ebooks" stroke="#3b82f6" strokeWidth={2} fill="url(#gradEbooks)" />
                  <Area type="monotone" dataKey="revenue" stroke="#f59e0b" strokeWidth={2} fill="url(#gradRev)" />
                </AreaChart>
              </ResponsiveContainer>
           )}
        </div>
      </div>

      {/* 4. DETAILS GRID (Geo + Templates) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

         {/* GEO MAP (List style) */}
         <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <SectionHeader title="Géographie" subtitle={`Top ${usersByCountry.length} Pays`} icon={Globe2} color="blue" />
            <div className="space-y-3 max-h-[300px] overflow-y-auto custom-scrollbar pr-2">
               {usersByCountry.length === 0 ? <p className="text-neutral-500 text-xs text-center py-10">Aucune donnée</p> :
                  usersByCountry.map((c, i) => (
                     <div key={i} className="flex items-center gap-3 p-3 bg-neutral-50 rounded-lg border border-neutral-200 hover:border-neutral-300 transition-colors">
                        <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500 border border-neutral-200">
                           #{i + 1}
                        </div>
                        <div className="flex-1">
                           <div className="flex justify-between items-center mb-1.5">
                              <span className="text-sm font-medium text-neutral-900">{c.country}</span>
                              <span className="text-xs font-mono text-neutral-500">{c.count} users</span>
                           </div>
                           <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                              <div className="h-full bg-blue-500 rounded-full" style={{ width: `${Math.min((c.count / (stats.totalUsers || 1)) * 100, 100)}%` }}></div>
                           </div>
                        </div>
                     </div>
                  ))
               }
            </div>
         </div>

         {/* TEMPLATES PIE */}
         <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <SectionHeader title="Templates" subtitle="Répartition des choix" icon={Layers} color="emerald" />
            {templatesStats.length === 0 ? (
               <div className="h-[250px] flex items-center justify-center text-neutral-500 text-xs">Aucun template utilisé</div>
            ) : (
               <div className="flex items-center">
                  <div className="h-[250px] w-1/2">
                     <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                           <Pie data={templatesStats} dataKey="count" nameKey="template" cx="50%" cy="50%" innerRadius={60} outerRadius={80} paddingAngle={5}>
                              {templatesStats.map((_, idx) => <Cell key={idx} fill={PIE_COLORS[idx % PIE_COLORS.length]} stroke="rgba(0,0,0,0)" />)}
                           </Pie>
                           <Tooltip content={<CustomTooltip />} />
                        </PieChart>
                     </ResponsiveContainer>
                  </div>
                  <div className="w-1/2 space-y-2 pl-4">
                     {templatesStats.map((t, idx) => (
                        <div key={idx} className="flex items-center justify-between text-xs">
                           <div className="flex items-center gap-2">
                              <div className="w-2.5 h-2.5 rounded-full" style={{ backgroundColor: PIE_COLORS[idx % PIE_COLORS.length] }}></div>
                              <span className="text-neutral-500">{t.template || "Défaut"}</span>
                           </div>
                           <span className="text-neutral-900 font-mono">{t.count}</span>
                        </div>
                     ))}
                  </div>
               </div>
            )}
         </div>
      </div>

      {/* 5. TOP USERS TABLE */}
      <div className="bg-white border border-neutral-200 rounded-xl p-6">
         <SectionHeader title="Top Créateurs" subtitle="Classement par activité" icon={Trophy} color="amber" />
         <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
               <thead>
                  <tr className="border-b border-neutral-200 text-xs uppercase text-neutral-500">
                     <th className="px-4 py-3 font-semibold">Rang</th>
                     <th className="px-4 py-3 font-semibold">Utilisateur</th>
                     <th className="px-4 py-3 font-semibold">Pays</th>
                     <th className="px-4 py-3 font-semibold text-right">eBooks</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-200 text-sm">
                  {topUsers.length === 0 ? (
                     <tr><td colSpan={4} className="p-8 text-center text-neutral-500 text-xs">Aucun créateur actif</td></tr>
                  ) : (
                     topUsers.map((u, i) => (
                        <tr key={i} className="hover:bg-neutral-50 transition-colors">
                           <td className="px-4 py-3">
                              {i === 0 ? <Crown size={16} className="text-amber-500" /> :
                               i === 1 ? <Medal size={16} className="text-neutral-400" /> :
                               i === 2 ? <Award size={16} className="text-orange-700" /> :
                               <span className="font-mono text-neutral-500">#{i + 1}</span>}
                           </td>
                           <td className="px-4 py-3">
                              <div className="font-medium text-neutral-900">{u.name}</div>
                              <div className="text-xs text-neutral-500">{u.email}</div>
                           </td>
                           <td className="px-4 py-3 text-neutral-500 text-xs">{u.country || "—"}</td>
                           <td className="px-4 py-3 text-right font-mono font-bold text-neutral-900">{u.ebooksCount}</td>
                        </tr>
                     ))
                  )}
               </tbody>
            </table>
         </div>
      </div>

      {/* 6. ADVANCED METRICS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">

         {/* Heatmap (CORRIGÉE) */}
         <div className="bg-white border border-neutral-200 rounded-xl p-6 lg:col-span-2">
            <SectionHeader title="Horaires d'activité" subtitle="Fréquence par heure" icon={Clock} color="emerald" />
            <div className="grid grid-cols-6 sm:grid-cols-12 gap-1 h-32">
               {Array.from({length: 24}).map((_, h) => {
                  const data = activityByHour.find(x => x.hour === h) || { count: 0 };
                  const intensity = Math.min(data.count / 5, 1); // Scale simple
                  return (
                     <div key={h} className="flex flex-col gap-1 items-center group relative">
                        <div
                           className="w-full h-full rounded-md transition-all hover:border hover:border-emerald-400/50"
                           style={{ backgroundColor: `rgba(16, 185, 129, ${Math.max(intensity, 0.05)})` }}
                        ></div>
                        <span className="text-[9px] text-neutral-400 font-mono group-hover:text-neutral-700">{h}h</span>
                        {data.count > 0 && (
                           <div className="absolute bottom-full mb-2 bg-neutral-900 text-xs text-white px-2 py-1 rounded border border-neutral-700 hidden group-hover:block z-10 whitespace-nowrap">
                              {data.count} actions
                           </div>
                        )}
                     </div>
                  )
               })}
            </div>
         </div>

         {/* Device Stats */}
         <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <SectionHeader title="Appareils" subtitle="Usage mobile vs desktop" icon={Smartphone} color="blue" />
            <div className="space-y-4">
               {deviceStats.length === 0 ? <p className="text-neutral-500 text-xs">Aucune donnée</p> :
                  deviceStats.map((d, i) => (
                     <div key={i}>
                        <div className="flex justify-between text-xs mb-1">
                           <span className="text-neutral-700">{d.device}</span>
                           <span className="text-neutral-500 font-mono">{d.count}</span>
                        </div>
                        <div className="w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                           <div className="h-full bg-blue-500" style={{ width: `${Math.min(d.count * 5, 100)}%` }}></div>
                        </div>
                     </div>
                  ))
               }
            </div>
         </div>

         {/* Abandon Rates */}
         {abandonStats && (
            <div className="bg-white border border-neutral-200 rounded-xl p-6">
               <SectionHeader title="Abandons" subtitle="Tunnel de création" icon={AlertTriangle} color="red" />
               <div className="flex items-center justify-between text-center gap-2">
                  <div className="p-3 bg-neutral-50 rounded-lg flex-1">
                     <p className="text-xs text-neutral-500 uppercase">Brouillons</p>
                     <p className="text-xl font-bold text-neutral-900">{abandonStats.drafts}</p>
                  </div>
                  <div className="p-3 bg-neutral-50 rounded-lg flex-1">
                     <p className="text-xs text-neutral-500 uppercase">Finis</p>
                     <p className="text-xl font-bold text-emerald-600">{abandonStats.completed}</p>
                  </div>
                  <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex-1">
                     <p className="text-xs text-red-600 uppercase">Taux</p>
                     <p className="text-xl font-bold text-red-600">{abandonStats.abandonRate}%</p>
                  </div>
               </div>
            </div>
         )}

      </div>
    </div>
  );
}
