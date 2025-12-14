"use client";

import { useEffect, useState, useMemo } from "react";
import {
  CreditCard,
  TrendingUp,
  TrendingDown,
  AlertCircle,
  Globe,
  Users,
  BarChart3,
  Loader2,
  Download,
  Search,
  Clock,
  CheckCircle2,
  XCircle,
  Eye,
  Calendar,
  ArrowUpRight,
  ArrowDownRight,
  DollarSign,
  RefreshCw,
  ArrowDownCircle,
  Wallet
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  BarElement,
  LineElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
);

// --- FONCTION UTILITAIRE (Gardée telle quelle) ---
function formatCurrency(amount = 0, currency = "XOF") {
  try {
    return new Intl.NumberFormat("fr-FR", {
      style: "currency",
      currency,
      maximumFractionDigits: 0,
    }).format(amount);
  } catch {
    return `${amount?.toLocaleString("fr-FR")} ${currency}`;
  }
}

/* =========================================================
   COMPOSANTS UI (Design "Mission Control")
   ========================================================= */

function StatIndicator({ icon: Icon, label, value, subtitle, trend, color = "indigo" }) {
  const colors = {
    indigo: "text-indigo-400 bg-indigo-500/10 border-indigo-500/20",
    emerald: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    amber: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    red: "text-red-400 bg-red-500/10 border-red-500/20",
  };
  const theme = colors[color] || colors.indigo;

  return (
    <div className="flex flex-col gap-1 px-4 border-l border-slate-800 first:border-l-0 min-h-[90px]">
      <div className="flex items-center justify-between mb-2">
         <div className={`p-1.5 rounded-md border ${theme}`}>
            <Icon size={16} />
         </div>
         {trend !== undefined && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${trend >= 0 ? 'text-emerald-400 bg-emerald-500/10' : 'text-red-400 bg-red-500/10'}`}>
               {trend >= 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {Math.abs(trend)}%
            </span>
         )}
      </div>
      <div className="text-sm font-bold uppercase tracking-wider text-slate-500">{label}</div>
      <div className="text-2xl font-black text-white tracking-tight">{value}</div>
      {subtitle && <div className="text-xs text-slate-600 font-medium mt-auto pt-1">{subtitle}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed: { label: "Validé", icon: CheckCircle2, className: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20" },
    pending: { label: "En attente", icon: Clock, className: "text-amber-400 bg-amber-500/10 border-amber-500/20" },
    failed: { label: "Échoué", icon: XCircle, className: "text-red-400 bg-red-500/10 border-red-500/20" },
    refunded: { label: "Remboursé", icon: ArrowDownCircle, className: "text-blue-400 bg-blue-500/10 border-blue-500/20" },
  };

  const cfg = map[status] || { label: status || "Inconnu", icon: AlertCircle, className: "text-slate-400 bg-slate-500/10 border-slate-500/20" };
  const IconComponent = cfg.icon;

  return (
    <span className={`inline-flex items-center gap-1.5 px-2.5 py-1 rounded border text-xs font-bold uppercase tracking-wide ${cfg.className}`}>
      <IconComponent size={12} /> {cfg.label}
    </span>
  );
}

/* =========================================================
   PAGE PAIEMENTS
   ========================================================= */

export default function AdminPaiementsPage() {
  // --- ETATS & LOGIQUE (STRICTEMENT IDENTIQUES) ---
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [stats, setStats] = useState(null);
  const [transactions, setTransactions] = useState([]);
  const [range, setRange] = useState("7d");
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const [revenueChart, setRevenueChart] = useState(null);
  const [countryChart, setCountryChart] = useState(null);
  const [statusChart, setStatusChart] = useState(null);

  useEffect(() => { loadStats(); }, [range]);

  const loadStats = async (isRefresh = false) => {
    try {
      if (isRefresh) setRefreshing(true); else setLoading(true);
      setError("");

      const res = await fetch(`/api/admin/paiements?range=${range}`, { credentials: "include", headers: { "Content-Type": "application/json" } });
      if (res.status === 401) throw new Error("Non autorisé.");
      const data = await res.json();
      if (!res.ok || !data.success) throw new Error(data.message || "Erreur lors du chargement");

      setStats(data.stats);
      setTransactions(data.transactions || []);

      // 1. Revenue Chart Data
      const completed = (data.transactions || []).filter((t) => t.status === "completed");
      const revenueByDay = {};
      completed.forEach((t) => {
        const d = new Date(t.createdAt); d.setHours(0, 0, 0, 0); const key = d.toISOString().split("T")[0];
        if (!revenueByDay[key]) revenueByDay[key] = { date: key, amount: 0 };
        revenueByDay[key].amount += t.amount || 0;
      });
      const sortedDays = Object.values(revenueByDay).sort((a, b) => a.date.localeCompare(b.date));

      setRevenueChart({
        labels: sortedDays.map((d) => new Date(d.date).toLocaleDateString("fr-FR", { day: "2-digit", month: "short" })),
        datasets: [{
            label: "CA (XOF)",
            data: sortedDays.map((d) => d.amount),
            borderColor: "#10b981", // Emerald 500
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, "rgba(16, 185, 129, 0.2)");
              gradient.addColorStop(1, "rgba(16, 185, 129, 0)");
              return gradient;
            },
            borderWidth: 2, tension: 0.4, pointRadius: 0, pointHoverRadius: 4, fill: true,
        }],
      });

      // 2. Country Chart Data
      const topCountries = data.stats?.topCountries || [];
      setCountryChart({
        labels: topCountries.map((c) => c.country || "Inconnu"),
        datasets: [{
            label: "Transactions",
            data: topCountries.map((c) => c.count),
            backgroundColor: ["#3b82f6", "#8b5cf6", "#10b981", "#f59e0b", "#ef4444"], // Blue, Purple, Green, Amber, Red
            borderWidth: 0, borderRadius: 4, barThickness: 20,
        }],
      });

      // 3. Status Chart Data
      const statusCounts = { completed: 0, pending: 0, failed: 0, refunded: 0 };
      (data.transactions || []).forEach((t) => { if (statusCounts.hasOwnProperty(t.status)) statusCounts[t.status]++; });
      setStatusChart({
        labels: ["Validé", "Attente", "Échec", "Remboursé"],
        datasets: [{
            data: [statusCounts.completed, statusCounts.pending, statusCounts.failed, statusCounts.refunded],
            backgroundColor: ["#10b981", "#f59e0b", "#ef4444", "#3b82f6"],
            borderWidth: 0, hoverOffset: 4,
        }],
      });

    } catch (err) { console.error(err); setError(err.message || "Erreur inconnue"); } 
    finally { setLoading(false); setRefreshing(false); }
  };

  const filteredTransactions = useMemo(() => {
    let list = [...transactions];
    if (statusFilter !== "all") list = list.filter((t) => t.status === statusFilter);
    if (search.trim()) {
      const s = search.toLowerCase();
      list = list.filter((t) => {
        const email = t.userId?.email?.toLowerCase() || "";
        const name = t.userId?.name?.toLowerCase() || "";
        const txid = t.transactionId?.toLowerCase() || "";
        return email.includes(s) || name.includes(s) || txid.includes(s);
      });
    }
    return list.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [transactions, search, statusFilter]);

  const handleExportCSV = () => {
    if (!filteredTransactions.length) return;
    const headers = ["ID Transaction", "Nom", "Email", "Pays", "Montant", "Devise", "Statut", "Date création", "Date complétion"];
    const rows = filteredTransactions.map((t) => [
      t.transactionId || "", t.userId?.name || "", t.userId?.email || "", t.userId?.country || "", t.amount ?? "",
      t.currency || "XOF", t.status || "", t.createdAt ? new Date(t.createdAt).toISOString() : "", t.completedAt ? new Date(t.completedAt).toISOString() : "",
    ]);
    const csvContent = [headers.join(";"), ...rows.map((r) => r.join(";"))].join("\n");
    const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
    const url = URL.createObjectURL(blob);
    const a = document.createElement("a"); a.href = url; a.download = `transactions-${range}-${new Date().toISOString().split("T")[0]}.csv`; a.click(); URL.revokeObjectURL(url);
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-500" />
        <p className="text-xs font-mono tracking-widest uppercase">Analyse des flux financiers...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-8 font-sans text-slate-200">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            Flux Financiers
          </h1>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
             <Wallet size={14} className="text-emerald-500" />
             Revenus et transactions en temps réel
          </p>
        </div>

        <div className="flex items-center gap-4">
           {/* Period Selector */}
           <div className="flex p-1 bg-slate-900/50 border border-slate-800 rounded-lg">
              {[
                 { label: "24h", value: "24h" }, { label: "7j", value: "7d" },
                 { label: "30j", value: "30d" }, { label: "90j", value: "90d" },
              ].map((f) => (
                 <button
                    key={f.value}
                    onClick={() => setRange(f.value)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                       range === f.value ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                    }`}
                 >
                    {f.label}
                 </button>
              ))}
           </div>

           {/* Actions */}
           <div className="flex items-center gap-2">
              <button onClick={() => loadStats(true)} disabled={refreshing} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                 <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              </button>
              <button onClick={handleExportCSV} className="p-2 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors border border-transparent hover:border-emerald-500/20">
                 <Download size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* 2. KPIS */}
      {!stats ? (
         <div className="text-center py-10 text-slate-500">Aucune donnée disponible.</div>
      ) : (
         <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               <StatIndicator icon={DollarSign} label="Chiffre d'Affaires" value={formatCurrency(stats.totalRevenue)} subtitle={`${stats.successfulTransactions} transactions`} trend={12.5} color="emerald" />
               <StatIndicator icon={TrendingUp} label="Revenu du Jour" value={formatCurrency(stats.todayRevenue)} subtitle="Depuis minuit" trend={8.3} color="blue" />
               <StatIndicator icon={CreditCard} label="Total Transactions" value={stats.totalTransactions} subtitle={`${stats.failedTransactions} échouées`} trend={-3.2} color="purple" />
               <StatIndicator icon={Users} label="Clients Actifs" value={stats.topUsers?.length || 0} subtitle="Top acheteurs" trend={15.7} color="amber" />
            </div>

            {/* 3. CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* MAIN REVENUE CHART */}
               <div className="lg:col-span-2 border border-slate-800 rounded-xl p-6 relative">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-bold text-white uppercase tracking-wide">Courbe des Revenus</h3>
                     <span className="text-xs text-emerald-400 font-mono flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></div> Live</span>
                  </div>
                  <div className="h-[300px] w-full">
                     {revenueChart ? (
                        <Line 
                           data={revenueChart} 
                           options={{
                              responsive: true, maintainAspectRatio: false,
                              plugins: { legend: { display: false }, tooltip: { backgroundColor: '#020617', borderColor: '#334155', borderWidth: 1, titleColor: '#94a3b8', bodyColor: '#f1f5f9', padding: 10 } },
                              scales: {
                                 x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } },
                                 y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } }
                              }
                           }} 
                        />
                     ) : <div className="h-full flex items-center justify-center text-slate-600 text-xs">Pas de données</div>}
                  </div>
               </div>

               {/* STATUS & COUNTRY (Stacked) */}
               <div className="space-y-6">
                  {/* Status Donut */}
                  <div className="border border-slate-800 rounded-xl p-6 flex flex-col h-[200px]">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Répartition Statuts</h3>
                     <div className="flex-1 relative">
                        {statusChart ? (
                           <Doughnut 
                              data={statusChart} 
                              options={{ 
                                 responsive: true, maintainAspectRatio: false, cutout: '70%', 
                                 plugins: { legend: { position: 'right', labels: { boxWidth: 8, color: '#94a3b8', font: { size: 10 } } } } 
                              }} 
                           />
                        ) : <div className="h-full flex items-center justify-center text-slate-600 text-xs">Pas de données</div>}
                     </div>
                  </div>

                  {/* Country Bars */}
                  <div className="border border-slate-800 rounded-xl p-6 flex flex-col h-[200px]">
                     <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wide mb-2">Top Pays</h3>
                     <div className="flex-1 relative">
                        {countryChart ? (
                           <Bar 
                              data={countryChart} 
                              options={{ 
                                 responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                                 plugins: { legend: { display: false } },
                                 scales: { x: { display: false }, y: { ticks: { color: '#94a3b8', font: { size: 10 } }, grid: { display: false }, border: { display: false } } }
                              }} 
                           />
                        ) : <div className="h-full flex items-center justify-center text-slate-600 text-xs">Pas de données</div>}
                     </div>
                  </div>
               </div>
            </div>

            {/* 4. TRANSACTIONS TABLE */}
            <div className="border border-slate-800 rounded-xl overflow-hidden">
               {/* Toolbar */}
               <div className="p-4 border-b border-slate-800 flex flex-col sm:flex-row gap-4 justify-between items-center bg-[#0f1623]">
                  <h3 className="text-sm font-bold text-white uppercase tracking-wide">Dernières Transactions</h3>
                  
                  <div className="flex gap-2 w-full sm:w-auto">
                     <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                        <input
                           type="text"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           placeholder="Rechercher..."
                           className="w-full bg-[#020617] border border-slate-700 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600"
                        />
                     </div>
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-[#020617] border border-slate-700 text-slate-200 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-indigo-500 cursor-pointer"
                     >
                        <option value="all">Tout</option>
                        <option value="completed">Validés</option>
                        <option value="pending">En cours</option>
                        <option value="failed">Échoués</option>
                     </select>
                  </div>
               </div>

               {/* Table */}
               <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                     <thead>
                        <tr className="bg-[#020617] border-b border-slate-800 text-[10px] uppercase text-slate-500 font-bold tracking-wider">
                           <th className="px-6 py-3">Client</th>
                           <th className="px-6 py-3">Montant</th>
                           <th className="px-6 py-3">Statut</th>
                           <th className="px-6 py-3">Pays</th>
                           <th className="px-6 py-3">Date</th>
                           <th className="px-6 py-3 text-right">ID</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-slate-800 text-sm">
                        {filteredTransactions.length === 0 ? (
                           <tr><td colSpan={6} className="p-8 text-center text-slate-500 text-xs">Aucune transaction trouvée</td></tr>
                        ) : (
                           filteredTransactions.map((t) => (
                              <tr key={t._id} className="hover:bg-slate-800/30 transition-colors group">
                                 <td className="px-6 py-3">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded bg-slate-800 flex items-center justify-center text-xs font-bold text-slate-400 border border-slate-700">
                                          {(t.userId?.name || t.userId?.email || "U").charAt(0).toUpperCase()}
                                       </div>
                                       <div className="flex flex-col">
                                          <span className="font-medium text-slate-200">{t.userId?.name || "Inconnu"}</span>
                                          <span className="text-[10px] text-slate-500">{t.userId?.email}</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-3 font-mono font-bold text-white">
                                    {formatCurrency(t.amount, t.currency)}
                                 </td>
                                 <td className="px-6 py-3">
                                    <StatusBadge status={t.status} />
                                 </td>
                                 <td className="px-6 py-3 text-slate-400 text-xs">
                                    <div className="flex items-center gap-1.5"><Globe size={12} /> {t.userId?.country || "-"}</div>
                                 </td>
                                 <td className="px-6 py-3 text-slate-500 text-xs">
                                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
                                 </td>
                                 <td className="px-6 py-3 text-right">
                                    <code className="text-[10px] text-slate-600 bg-slate-900 px-1.5 py-0.5 rounded border border-slate-800">
                                       {t.transactionId?.substring(0, 8)}...
                                    </code>
                                 </td>
                              </tr>
                           ))
                        )}
                     </tbody>
                  </table>
               </div>
            </div>
         </div>
      )}
    </div>
  );
}