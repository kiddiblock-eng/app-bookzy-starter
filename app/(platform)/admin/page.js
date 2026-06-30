"use client";

import { useEffect, useState, useMemo } from "react";
import {
  Users,
  FileText,
  DollarSign,
  Activity,
  UserPlus,
  BookOpen,
  Clock,
  RefreshCw,
  ArrowUp,
  ArrowDown,
  Bell,
  Download,
  Calendar,
  Search,
  Target,
  Trophy,
  CheckCircle,
  AlertCircle,
  TrendingUp,
  TrendingDown,
  Award,
  Star,
  Crown,
  MoreHorizontal
} from "lucide-react";

import {
  AreaChart,
  Area,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  Legend
} from "recharts";

const ADMIN_SECRET = process.env.NEXT_PUBLIC_ADMIN_SECRET || "";

function getAdminHeaders() {
  if (!ADMIN_SECRET) return {};
  return { "x-admin-secret": ADMIN_SECRET };
}

/* =========================================================
   COMPOSANTS UI (DESIGN MISSION CONTROL REFAIT)
   ========================================================= */

// 1. STAT CARD
function StatCard({ icon: Icon, title, value, subtitle, trend, trendValue, color, sparkline }) {
  const colors = {
    blue: "text-neutral-600 bg-neutral-100 border-neutral-200",
    indigo: "text-emerald-600 bg-emerald-50 border-emerald-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    purple: "text-emerald-600 bg-emerald-50 border-emerald-100",
    orange: "text-neutral-600 bg-neutral-100 border-neutral-200",
  };
  const theme = colors[color] || colors.blue;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 transition-all group relative overflow-hidden">
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div className={`p-2.5 rounded-lg ${theme}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        {trend && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
            trend === 'up' ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'
          }`}>
            {trend === 'up' ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {trendValue}%
          </div>
        )}
      </div>
      <div className="relative z-10">
        <h3 className="text-neutral-500 text-sm font-medium mb-1">{title}</h3>
        <div className="text-2xl font-bold text-neutral-900 tracking-tight">{value}</div>
        {subtitle && <p className="text-neutral-500 text-xs mt-1">{subtitle}</p>}
      </div>

      {/* Sparkline subtile en fond */}
      {sparkline && sparkline.length > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-16 opacity-10 pointer-events-none text-emerald-600">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={sparkline}>
                <Area type="monotone" dataKey="value" stroke="currentColor" fill="currentColor" strokeWidth={2} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
      )}
    </div>
  );
}

// 2. EXPORT BUTTON
function ExportButton({ onExport, type }) {
  const [isExporting, setIsExporting] = useState(false);
  const handleExport = async () => {
    setIsExporting(true);
    await onExport(type);
    setIsExporting(false);
  };
  return (
    <button
      onClick={handleExport}
      disabled={isExporting}
      className="px-4 py-2 bg-neutral-100 hover:bg-neutral-200 border border-neutral-200 rounded-lg font-medium text-xs text-neutral-700 transition-all flex items-center gap-2"
    >
      <Download size={14} className={isExporting ? "animate-bounce" : ""} />
      {isExporting ? "..." : type.toUpperCase()}
    </button>
  );
}

// 3. NOTIFICATION CENTER
function NotificationCenter({ notifications }) {
  const [isOpen, setIsOpen] = useState(false);
  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="relative">
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="relative p-2.5 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-transparent hover:border-neutral-200"
      >
        <Bell size={18} strokeWidth={2} />
        {unreadCount > 0 && (
          <span className="absolute top-2 right-2.5 w-2 h-2 bg-emerald-600 rounded-full border border-white"></span>
        )}
      </button>

      {isOpen && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setIsOpen(false)} />
          <div className="absolute right-0 top-12 w-80 bg-white border border-neutral-200 rounded-2xl shadow-lg z-50 overflow-hidden">
            <div className="px-4 py-3 border-b border-neutral-200 flex justify-between items-center bg-white">
              <h3 className="text-sm font-semibold text-neutral-900">Notifications</h3>
              <span className="text-[10px] bg-neutral-100 text-neutral-500 px-1.5 py-0.5 rounded">{unreadCount} new</span>
            </div>
            <div className="max-h-[300px] overflow-y-auto custom-scrollbar p-1">
              {notifications.length === 0 ? (
                <div className="p-8 text-center text-neutral-500 text-xs">Rien à signaler.</div>
              ) : (
                notifications.map((n, i) => (
                  <div key={i} className={`p-3 border-b border-neutral-100 hover:bg-neutral-50 rounded-lg mb-1 transition-colors flex gap-3 ${!n.read ? 'bg-emerald-50' : ''}`}>
                    <div className={`mt-0.5 w-1.5 h-1.5 rounded-full shrink-0 ${n.type === 'success' ? 'bg-emerald-500' : n.type === 'warning' ? 'bg-amber-500' : 'bg-emerald-600'}`} />
                    <div>
                      <p className="text-xs text-neutral-600 leading-snug">{n.message}</p>
                      <p className="text-[10px] text-neutral-500 mt-1">{n.time}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}

// 4. CHART CARD GENERIC
function ChartCard({ title, children, action }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 flex flex-col h-full">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide">{title}</h3>
        {action}
      </div>
      <div className="flex-1 w-full min-h-[250px]">
        {children}
      </div>
    </div>
  );
}

// 5. GOALS SECTION
function GoalsSection({ goals }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-full">
      <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-6 flex items-center gap-2">
        <Target size={16} className="text-emerald-600" /> Objectifs Mensuels
      </h3>
      <div className="space-y-5">
        {goals.map((goal, i) => {
          const percentage = (goal.current / goal.target) * 100;
          const isCompleted = percentage >= 100;
          return (
            <div key={i} className="space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="text-neutral-600 font-medium">{goal.name}</span>
                <span className={isCompleted ? "text-emerald-600 font-bold" : "text-neutral-500"}>
                  {goal.current.toLocaleString()} / {goal.target.toLocaleString()}
                </span>
              </div>
              <div className="relative w-full h-1.5 bg-neutral-100 rounded-full overflow-hidden">
                <div
                  className={`absolute inset-y-0 left-0 rounded-full transition-all duration-500 ${
                    isCompleted ? "bg-emerald-500" : "bg-emerald-600"
                  }`}
                  style={{ width: `${Math.min(percentage, 100)}%` }}
                />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// 6. LEADERBOARD
function Leaderboard({ users }) {
  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6">
      <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide mb-6 flex items-center gap-2">
        <Trophy size={16} className="text-amber-500" /> Top Performers
      </h3>
      <div className="space-y-3">
        {users.map((user, i) => (
          <div key={i} className="flex items-center gap-4 p-3 rounded-lg bg-neutral-50 border border-neutral-100">
             <div className={`w-8 h-8 rounded flex items-center justify-center font-bold text-sm ${
                i === 0 ? "bg-amber-50 text-amber-500" :
                i === 1 ? "bg-neutral-100 text-neutral-500" :
                i === 2 ? "bg-orange-50 text-orange-700" : "bg-neutral-100 text-neutral-500"
             }`}>
                {i === 0 ? <Crown size={14}/> : i + 1}
             </div>
             <div className="flex-1">
                <p className="text-xs font-bold text-neutral-900">{user.name}</p>
                <p className="text-[10px] text-neutral-500">{user.email}</p>
             </div>
             <div className="text-right">
                <p className="text-xs font-bold text-neutral-900">{user.ebooks}</p>
                <p className="text-[10px] text-neutral-500">eBooks</p>
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// 7. ACTIVITY CALENDAR
function ActivityCalendar({ data }) {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    const dayData = data.find(d => d.date === date.toLocaleDateString("fr-FR")) || { count: 0 };
    days.push({ day: date.toLocaleDateString("fr-FR", { weekday: "short" }), count: dayData.count });
  }
  const maxCount = Math.max(...days.map(d => d.count), 1);

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-full">
      <div className="flex items-center justify-between mb-6">
         <h3 className="text-sm font-semibold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
            <Calendar size={16} className="text-emerald-600" /> Activité (7J)
         </h3>
      </div>
      <div className="flex justify-between items-end gap-2 h-[100px]">
        {days.map((d, i) => {
           const height = Math.max((d.count / maxCount) * 100, 10);
           return (
             <div key={i} className="flex-1 flex flex-col items-center gap-2 group">
                <div className="relative w-full bg-neutral-100 rounded-md overflow-hidden h-full flex items-end">
                   <div style={{ height: `${height}%` }} className={`w-full transition-all duration-500 ${d.count > 0 ? 'bg-emerald-600 group-hover:bg-emerald-500' : 'bg-neutral-200'}`} />
                </div>
                <span className="text-[10px] text-neutral-500 uppercase">{d.day}</span>
             </div>
           )
        })}
      </div>
    </div>
  );
}


/* =========================================================
   MAIN COMPONENT
   ========================================================= */

export default function AdminDashboard() {
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const interval = setInterval(() => setCurrentTime(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [period, setPeriod] = useState("30");
  const [searchQuery, setSearchQuery] = useState("");

  // --- ETATS DE DONNEES (TOUS CONSERVÉS) ---
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalEbooks: 0,
    revenue: 0,
    totalSales: 0,
    activeNow: 0,
  });

  const [timeline, setTimeline] = useState([]);
  const [recentUsers, setRecentUsers] = useState([]);
  const [recentEbooks, setRecentEbooks] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [goals, setGoals] = useState([]);
  const [topUsers, setTopUsers] = useState([]);
  const [activityData, setActivityData] = useState([]);
  const [revenueData, setRevenueData] = useState([]);
  const [performanceData, setPerformanceData] = useState([]);

  // --- EXPORT LOGIC ---
  const handleExport = async (type) => {
    await new Promise(resolve => setTimeout(resolve, 2000));
    if (type === "pdf") {
      alert("Export PDF en cours de développement...");
    } else if (type === "csv") {
      const csvContent = "Date,Ventes,Utilisateurs\n" + 
        timeline.map(d => `${d.date},${d.sales},${d.users}`).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv" });
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = `bookzy-stats-${new Date().toISOString().split("T")[0]}.csv`;
      a.click();
    }
  };

  // --- API CALLS (TOUTES CONSERVÉES) ---
  async function fetchDashboard() { try { const res = await fetch("/api/admin/analytics/dashboard", { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success) setStats(data.data); } catch (err) { console.error("Erreur dashboard:", err); } }
  async function fetchTimeline() { try { const res = await fetch(`/api/admin/analytics/timeline?period=${period}`, { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success && Array.isArray(data.data)) { setTimeline(data.data.map((item) => ({ date: `${item._id.day}-${item._id.month}`, users: item.users || 0, sales: item.sales || 0, total: item.total || 0 }))); } } catch (err) { console.error("Erreur timeline:", err); } }
  async function fetchRecentUsers() { try { const res = await fetch("/api/admin/users/list?limit=5", { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success && Array.isArray(data.data)) setRecentUsers(data.data); } catch (err) { console.error("Erreur users:", err); } }
  async function fetchRecentEbooks() { try { const res = await fetch("/api/admin/ebooks/list?limit=5", { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success && Array.isArray(data.data)) setRecentEbooks(data.data); } catch (err) { console.error("Erreur ebooks:", err); } }
  async function fetchNotifications() { try { const res = await fetch("/api/admin/analytics/notifications", { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success && Array.isArray(data.data)) setNotifications(data.data); } catch (err) { console.error("Erreur notifications:", err); } }
  async function fetchGoals() { try { const res = await fetch("/api/admin/analytics/goals", { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success && Array.isArray(data.data)) setGoals(data.data); } catch (err) { console.error("Erreur goals:", err); } }
  async function fetchLeaderboard() { try { const res = await fetch("/api/admin/analytics/leaderboard?limit=5", { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success && Array.isArray(data.data)) setTopUsers(data.data); } catch (err) { console.error("Erreur leaderboard:", err); } }
  async function fetchActivity() { try { const res = await fetch("/api/admin/analytics/activity?days=7", { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success && Array.isArray(data.data)) setActivityData(data.data); } catch (err) { console.error("Erreur activity:", err); } }
  async function fetchRevenue() { try { const res = await fetch("/api/admin/analytics/revenue-monthly?months=6", { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success && Array.isArray(data.data)) setRevenueData(data.data); } catch (err) { console.error("Erreur revenue:", err); } }
  async function fetchPerformance() { try { const res = await fetch("/api/admin/analytics/performance", { headers: getAdminHeaders(), cache: "no-store" }); const data = await res.json(); if (data.success && Array.isArray(data.data)) setPerformanceData(data.data); } catch (err) { console.error("Erreur performance:", err); } }

  async function loadAllData() {
    await Promise.all([ fetchDashboard(), fetchTimeline(), fetchRecentUsers(), fetchRecentEbooks(), fetchNotifications(), fetchGoals(), fetchLeaderboard(), fetchActivity(), fetchRevenue(), fetchPerformance() ]);
  }

  async function handleRefresh() { setIsRefreshing(true); await loadAllData(); setIsRefreshing(false); }

  useEffect(() => { setLoading(true); loadAllData().then(() => setLoading(false)); }, [period]);

  const sparklineData = useMemo(() => {
    if (!timeline || timeline.length === 0) return [];
    return timeline.slice(-7).map((d) => ({ value: d.sales || 0 }));
  }, [timeline]);

  // Data prep pour le chart principal
  const chartData = useMemo(() => {
    return timeline.map((d) => {
      const [day, month] = d.date.split("-").map(Number);
      return {
        date: `${String(day).padStart(2, "0")}/${String(month).padStart(2, "0")}`,
        sales: d.sales || 0,
        users: d.users || 0,
      };
    });
  }, [timeline]);

  if (loading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="space-y-2">
            <div className="h-7 w-56 bg-neutral-100 rounded-lg animate-pulse" />
            <div className="h-4 w-40 bg-neutral-100 rounded animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-9 w-64 bg-neutral-100 rounded-lg animate-pulse hidden md:block" />
            <div className="h-9 w-9 bg-neutral-100 rounded-lg animate-pulse" />
            <div className="h-9 w-20 bg-neutral-100 rounded-lg animate-pulse" />
            <div className="h-9 w-9 bg-neutral-100 rounded-lg animate-pulse" />
          </div>
        </div>
        {/* KPI skeleton */}
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="bg-white border border-neutral-200 rounded-2xl p-5">
              <div className="h-10 w-10 bg-neutral-100 rounded-lg animate-pulse mb-4" />
              <div className="h-4 w-24 bg-neutral-100 rounded animate-pulse mb-2" />
              <div className="h-7 w-20 bg-neutral-100 rounded animate-pulse" />
            </div>
          ))}
        </div>
        {/* Charts skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 h-[330px]">
            <div className="h-4 w-32 bg-neutral-100 rounded animate-pulse mb-6" />
            <div className="h-[250px] bg-neutral-50 rounded-lg animate-pulse" />
          </div>
          <div className="space-y-6">
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-[150px] animate-pulse" />
            <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-[150px] animate-pulse" />
          </div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-[380px] animate-pulse" />
          <div className="bg-white border border-neutral-200 rounded-2xl p-6 h-[380px] animate-pulse" />
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 text-neutral-600">

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-neutral-900 tracking-tight">Tableau de Bord</h1>
          <p className="text-neutral-500 text-sm font-mono mt-1 flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
            LIVE • {currentTime.toLocaleTimeString("fr-FR")}
          </p>
        </div>

        <div className="flex items-center gap-3">
          <div className="hidden md:flex items-center bg-white border border-neutral-200 rounded-lg px-3 py-1.5 w-64 focus-within:border-emerald-500/50 transition-colors">
              <Search size={14} className="text-neutral-500 mr-2" />
              <input
                type="text" placeholder="Rechercher..."
                className="bg-transparent border-none text-sm text-neutral-900 w-full focus:outline-none placeholder:text-neutral-400"
                value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)}
              />
           </div>
           <NotificationCenter notifications={notifications} />
           <ExportButton onExport={handleExport} type="csv" />
           <button onClick={handleRefresh} disabled={isRefreshing} className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-all border border-transparent hover:border-neutral-200">
              <RefreshCw size={18} className={isRefreshing ? "animate-spin" : ""} />
           </button>
        </div>
      </div>

      {/* 2. KPIs GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard icon={Users} title="Total Utilisateurs" value={stats.totalUsers?.toLocaleString() || "0"} subtitle="Global" trend="up" trendValue="12" color="indigo" sparkline={sparklineData} />
        <StatCard icon={FileText} title="eBooks Créés" value={stats.totalEbooks?.toLocaleString() || "0"} subtitle="Production" trend="up" trendValue="8" color="purple" sparkline={sparklineData} />
        <StatCard icon={DollarSign} title="Revenus (FCFA)" value={stats.revenue?.toLocaleString() || "0"} subtitle="Total" trend="up" trendValue="23" color="emerald" sparkline={sparklineData} />
        <StatCard icon={Activity} title="Actifs (Now)" value={stats.activeNow?.toLocaleString() || "0"} subtitle="En ligne" color="orange" />
      </div>

      {/* 3. CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart */}
        <div className="lg:col-span-2">
           <ChartCard title="Performance" action={
             <div className="flex gap-1 bg-neutral-100 p-1 rounded-lg">
                {["7", "30", "90"].map(p => (
                   <button key={p} onClick={() => setPeriod(p)} className={`px-3 py-1 text-xs font-medium rounded-md transition-all ${period === p ? 'bg-emerald-600 text-white' : 'text-neutral-500 hover:text-neutral-900'}`}>{p}J</button>
                ))}
             </div>
           }>
              <ResponsiveContainer width="100%" height="100%">
                <AreaChart data={chartData}>
                  <defs>
                    <linearGradient id="colorSales" x1="0" y1="0" x2="0" y2="1">
                      <stop offset="5%" stopColor="#059669" stopOpacity={0.3}/>
                      <stop offset="95%" stopColor="#059669" stopOpacity={0}/>
                    </linearGradient>
                  </defs>
                  <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                  <XAxis dataKey="date" stroke="#a3a3a3" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
                  <YAxis stroke="#a3a3a3" tick={{fontSize: 11}} tickLine={false} axisLine={false} />
                  <Tooltip contentStyle={{backgroundColor: '#ffffff', borderColor: '#e5e5e5', color: '#171717'}} itemStyle={{color: '#059669'}} />
                  <Area type="monotone" dataKey="sales" stroke="#059669" strokeWidth={2} fillOpacity={1} fill="url(#colorSales)" />
                  <Area type="monotone" dataKey="users" stroke="#10b981" strokeWidth={2} fillOpacity={0} />
                </AreaChart>
              </ResponsiveContainer>
           </ChartCard>
        </div>

        {/* Side Charts */}
        <div className="space-y-6">
            <GoalsSection goals={goals} />
            <ActivityCalendar data={activityData} />
        </div>
      </div>

      {/* 4. SECONDARY CHARTS ROW */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <ChartCard title="Revenus Mensuels">
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={revenueData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" vertical={false} />
                <XAxis dataKey="month" stroke="#a3a3a3" tick={{fontSize: 11}} axisLine={false} tickLine={false} />
                <Tooltip contentStyle={{backgroundColor: '#ffffff', borderColor: '#e5e5e5', color: '#171717'}} cursor={{fill: '#f5f5f5'}} />
                <Bar dataKey="revenue" fill="#10b981" radius={[4, 4, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
          
          <ChartCard title="Radar Performance">
            <ResponsiveContainer width="100%" height={300}>
              <RadarChart cx="50%" cy="50%" outerRadius="80%" data={performanceData}>
                <PolarGrid stroke="#e5e5e5" />
                <PolarAngleAxis dataKey="metric" tick={{ fill: '#737373', fontSize: 11 }} />
                <PolarRadiusAxis angle={30} domain={[0, 100]} tick={false} axisLine={false} />
                <Radar name="Score" dataKey="value" stroke="#059669" strokeWidth={2} fill="#059669" fillOpacity={0.4} />
                <Tooltip contentStyle={{backgroundColor: '#ffffff', borderColor: '#e5e5e5', color: '#171717'}} />
              </RadarChart>
            </ResponsiveContainer>
          </ChartCard>
      </div>

      {/* 5. LISTS & TABLES */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
          {/* Leaderboard */}
          <div className="xl:col-span-1">
             <Leaderboard users={topUsers} />
          </div>

          {/* Tables Combinées */}
          <div className="xl:col-span-2 space-y-6">
             {/* New Users */}
             <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                   <h3 className="text-sm font-semibold text-neutral-900">Derniers Inscrits</h3>
                   <button className="text-xs text-emerald-600 hover:text-emerald-700">Voir tout</button>
                </div>
                <div className="p-2 space-y-1">
                   {recentUsers.map((u, i) => (
                      <div key={i} className="flex items-center gap-3 p-2 hover:bg-neutral-50 rounded-lg transition-colors">
                         <div className="w-8 h-8 rounded-full bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500">{u.firstName?.[0] || u.name?.[0] || "?"}</div>
                         <div className="flex-1">
                            <p className="text-sm text-neutral-700 font-medium">{u.firstName || u.name || "User"}</p>
                            <p className="text-[10px] text-neutral-500">{u.email}</p>
                         </div>
                         <div className="text-xs text-neutral-500">{new Date().toLocaleDateString()}</div>
                      </div>
                   ))}
                </div>
             </div>

             {/* Recent Ebooks */}
             <div className="bg-white border border-neutral-200 rounded-xl overflow-hidden">
                <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center">
                   <h3 className="text-sm font-semibold text-neutral-900">Production Récente</h3>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-neutral-50 text-xs text-neutral-500 uppercase">
                         <tr><th className="px-4 py-2">Titre</th><th className="px-4 py-2">Pages</th><th className="px-4 py-2 text-right">Action</th></tr>
                      </thead>
                      <tbody className="divide-y divide-neutral-200">
                         {recentEbooks.map((e, i) => (
                            <tr key={i} className="hover:bg-neutral-50">
                               <td className="px-4 py-3 text-sm text-neutral-700 flex items-center gap-2">
                                  <BookOpen size={14} className="text-neutral-500"/> {e.title || "Sans titre"}
                               </td>
                               <td className="px-4 py-3 text-sm text-neutral-500">{e.pages}</td>
                               <td className="px-4 py-3 text-right"><MoreHorizontal size={14} className="text-neutral-500 inline cursor-pointer hover:text-neutral-900"/></td>
                            </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
      </div>

    </div>
  );
}