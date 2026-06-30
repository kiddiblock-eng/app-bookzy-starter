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

import dynamic from "next/dynamic";

const RevenueChart = dynamic(
  () => import("./_charts/PaiementsCharts").then((m) => m.RevenueChart),
  { ssr: false, loading: () => <div className="w-full h-[300px] bg-neutral-100 rounded-xl animate-pulse" /> }
);
const StatusChart = dynamic(
  () => import("./_charts/PaiementsCharts").then((m) => m.StatusChart),
  { ssr: false, loading: () => <div className="w-full h-[140px] bg-neutral-100 rounded-xl animate-pulse" /> }
);
const CountryChart = dynamic(
  () => import("./_charts/PaiementsCharts").then((m) => m.CountryChart),
  { ssr: false, loading: () => <div className="w-full h-[140px] bg-neutral-100 rounded-xl animate-pulse" /> }
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

function StatIndicator({ icon: Icon, label, value, subtitle, trend, color = "emerald" }) {
  const colors = {
    indigo: "text-emerald-600 bg-emerald-50 border-emerald-100",
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-100",
    amber: "text-amber-600 bg-amber-50 border-amber-100",
    blue: "text-emerald-600 bg-emerald-50 border-emerald-100",
    purple: "text-emerald-600 bg-emerald-50 border-emerald-100",
    red: "text-red-600 bg-red-50 border-red-100",
  };
  const theme = colors[color] || colors.emerald;

  return (
    <div className="flex flex-col gap-1 bg-white border border-neutral-200 rounded-2xl p-4 min-h-[90px]">
      <div className="flex items-center justify-between mb-2">
         <div className={`p-1.5 rounded-md border ${theme}`}>
            <Icon size={16} />
         </div>
         {trend !== undefined && (
            <span className={`text-[10px] font-bold px-1.5 py-0.5 rounded flex items-center gap-1 ${trend >= 0 ? 'text-emerald-600 bg-emerald-50' : 'text-red-600 bg-red-50'}`}>
               {trend >= 0 ? <TrendingUp size={10}/> : <TrendingDown size={10}/>} {Math.abs(trend)}%
            </span>
         )}
      </div>
      <div className="text-sm font-bold uppercase tracking-wider text-neutral-500">{label}</div>
      <div className="text-2xl font-bold text-neutral-900 tracking-tight">{value}</div>
      {subtitle && <div className="text-xs text-neutral-500 font-medium mt-auto pt-1">{subtitle}</div>}
    </div>
  );
}

function StatusBadge({ status }) {
  const map = {
    completed: { label: "Validé", icon: CheckCircle2, className: "text-emerald-700 bg-emerald-50 border-emerald-200" },
    pending: { label: "En attente", icon: Clock, className: "text-amber-700 bg-amber-50 border-amber-200" },
    failed: { label: "Échoué", icon: XCircle, className: "text-red-700 bg-red-50 border-red-200" },
    refunded: { label: "Remboursé", icon: ArrowDownCircle, className: "text-neutral-700 bg-neutral-100 border-neutral-200" },
  };

  const cfg = map[status] || { label: status || "Inconnu", icon: AlertCircle, className: "text-neutral-600 bg-neutral-100 border-neutral-200" };
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
            borderColor: "#059669", // Emerald 600
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, "rgba(5, 150, 105, 0.15)");
              gradient.addColorStop(1, "rgba(5, 150, 105, 0)");
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
            backgroundColor: "#059669", // Emerald 600
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
            backgroundColor: ["#059669", "#f59e0b", "#ef4444", "#a3a3a3"],
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
      <div className="min-h-screen bg-neutral-50 p-6 md:p-8">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6 mb-8">
          <div className="space-y-2">
            <div className="h-8 w-56 bg-neutral-100 rounded-lg animate-pulse" />
            <div className="h-4 w-72 bg-neutral-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-64 bg-neutral-100 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 mb-8">
          {[1,2,3,4].map((i) => <div key={i} className="h-[90px] bg-neutral-100 rounded-2xl animate-pulse" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-8">
          <div className="lg:col-span-2 h-[372px] bg-neutral-100 rounded-2xl animate-pulse" />
          <div className="space-y-6">
            <div className="h-[200px] bg-neutral-100 rounded-2xl animate-pulse" />
            <div className="h-[200px] bg-neutral-100 rounded-2xl animate-pulse" />
          </div>
        </div>
        <div className="h-64 bg-neutral-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-8 font-sans text-neutral-900">

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2 flex items-center gap-3">
            Flux Financiers
          </h1>
          <p className="text-sm text-neutral-600 font-medium flex items-center gap-2">
             <Wallet size={14} className="text-emerald-600" />
             Revenus et transactions en temps réel
          </p>
        </div>

        <div className="flex items-center gap-4">
           {/* Period Selector */}
           <div className="flex p-1 bg-white border border-neutral-200 rounded-lg">
              {[
                 { label: "24h", value: "24h" }, { label: "7j", value: "7d" },
                 { label: "30j", value: "30d" }, { label: "90j", value: "90d" },
              ].map((f) => (
                 <button
                    key={f.value}
                    onClick={() => setRange(f.value)}
                    className={`px-3 py-1.5 text-xs font-bold rounded-md transition-all ${
                       range === f.value ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-900"
                    }`}
                 >
                    {f.label}
                 </button>
              ))}
           </div>

           {/* Actions */}
           <div className="flex items-center gap-2">
              <button onClick={() => loadStats(true)} disabled={refreshing} className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-neutral-200">
                 <RefreshCw size={16} className={refreshing ? "animate-spin" : ""} />
              </button>
              <button onClick={handleExportCSV} className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-neutral-200 hover:border-emerald-200">
                 <Download size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* 2. KPIS */}
      {!stats ? (
         <div className="text-center py-10 text-neutral-500">Aucune donnée disponible.</div>
      ) : (
         <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
               <StatIndicator icon={DollarSign} label="Chiffre d'Affaires" value={formatCurrency(stats.totalRevenue)} subtitle={`${stats.successfulTransactions} transactions`} trend={12.5} color="emerald" />
               <StatIndicator icon={TrendingUp} label="Revenu du Jour" value={formatCurrency(stats.todayRevenue)} subtitle="Depuis minuit" trend={8.3} color="emerald" />
               <StatIndicator icon={CreditCard} label="Total Transactions" value={stats.totalTransactions} subtitle={`${stats.failedTransactions} échouées`} trend={-3.2} color="emerald" />
               <StatIndicator icon={Users} label="Clients Actifs" value={stats.topUsers?.length || 0} subtitle="Top acheteurs" trend={15.7} color="emerald" />
            </div>

            {/* 3. CHARTS ROW */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
               
               {/* MAIN REVENUE CHART */}
               <div className="lg:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6 relative">
                  <div className="flex justify-between items-center mb-6">
                     <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Courbe des Revenus</h3>
                     <span className="text-xs text-emerald-600 font-mono flex items-center gap-1"><div className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></div> Live</span>
                  </div>
                  <div className="h-[300px] w-full">
                     {revenueChart ? (
                        <RevenueChart
                           data={revenueChart}
                           options={{
                              responsive: true, maintainAspectRatio: false,
                              plugins: { legend: { display: false }, tooltip: { backgroundColor: '#ffffff', borderColor: '#e5e5e5', borderWidth: 1, titleColor: '#525252', bodyColor: '#171717', padding: 10 } },
                              scales: {
                                 x: { grid: { display: false }, ticks: { color: '#737373', font: { size: 10 } }, border: { display: false } },
                                 y: { grid: { color: '#f5f5f5' }, ticks: { color: '#737373', font: { size: 10 } }, border: { display: false } }
                              }
                           }}
                        />
                     ) : <div className="h-full flex items-center justify-center text-neutral-400 text-xs">Pas de données</div>}
                  </div>
               </div>

               {/* STATUS & COUNTRY (Stacked) */}
               <div className="space-y-6">
                  {/* Status Donut */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col h-[200px]">
                     <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Répartition Statuts</h3>
                     <div className="flex-1 relative">
                        {statusChart ? (
                           <StatusChart
                              data={statusChart}
                              options={{
                                 responsive: true, maintainAspectRatio: false, cutout: '70%',
                                 plugins: { legend: { position: 'right', labels: { boxWidth: 8, color: '#737373', font: { size: 10 } } } }
                              }}
                           />
                        ) : <div className="h-full flex items-center justify-center text-neutral-400 text-xs">Pas de données</div>}
                     </div>
                  </div>

                  {/* Country Bars */}
                  <div className="bg-white border border-neutral-200 rounded-xl p-6 flex flex-col h-[200px]">
                     <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wide mb-2">Top Pays</h3>
                     <div className="flex-1 relative">
                        {countryChart ? (
                           <CountryChart
                              data={countryChart}
                              options={{
                                 responsive: true, maintainAspectRatio: false, indexAxis: 'y',
                                 plugins: { legend: { display: false } },
                                 scales: { x: { display: false }, y: { ticks: { color: '#737373', font: { size: 10 } }, grid: { display: false }, border: { display: false } } }
                              }}
                           />
                        ) : <div className="h-full flex items-center justify-center text-neutral-400 text-xs">Pas de données</div>}
                     </div>
                  </div>
               </div>
            </div>

            {/* 4. TRANSACTIONS TABLE */}
            <div className="border border-neutral-200 rounded-xl overflow-hidden">
               {/* Toolbar */}
               <div className="p-4 border-b border-neutral-200 flex flex-col sm:flex-row gap-4 justify-between items-center bg-neutral-50">
                  <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Dernières Transactions</h3>

                  <div className="flex gap-2 w-full sm:w-auto">
                     <div className="relative flex-1 sm:flex-none">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                        <input
                           type="text"
                           value={search}
                           onChange={(e) => setSearch(e.target.value)}
                           placeholder="Rechercher..."
                           className="w-full bg-white border border-neutral-200 text-neutral-900 text-xs rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-emerald-500 placeholder:text-neutral-400"
                        />
                     </div>
                     <select
                        value={statusFilter}
                        onChange={(e) => setStatusFilter(e.target.value)}
                        className="bg-white border border-neutral-200 text-neutral-900 text-xs rounded-lg px-3 py-2 focus:outline-none focus:border-emerald-500 cursor-pointer"
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
                        <tr className="bg-neutral-50 border-b border-neutral-200 text-[10px] uppercase text-neutral-500 font-bold tracking-wider">
                           <th className="px-6 py-3">Client</th>
                           <th className="px-6 py-3">Montant</th>
                           <th className="px-6 py-3">Statut</th>
                           <th className="px-6 py-3">Pays</th>
                           <th className="px-6 py-3">Date</th>
                           <th className="px-6 py-3 text-right">ID</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-neutral-200 text-sm">
                        {filteredTransactions.length === 0 ? (
                           <tr><td colSpan={6} className="p-8 text-center text-neutral-500 text-xs">Aucune transaction trouvée</td></tr>
                        ) : (
                           filteredTransactions.map((t) => (
                              <tr key={t._id} className="hover:bg-neutral-50 transition-colors group">
                                 <td className="px-6 py-3">
                                    <div className="flex items-center gap-3">
                                       <div className="w-8 h-8 rounded bg-neutral-100 flex items-center justify-center text-xs font-bold text-neutral-500 border border-neutral-200">
                                          {(t.userId?.name || t.userId?.email || "U").charAt(0).toUpperCase()}
                                       </div>
                                       <div className="flex flex-col">
                                          <span className="font-medium text-neutral-900">{t.userId?.name || "Inconnu"}</span>
                                          <span className="text-[10px] text-neutral-500">{t.userId?.email}</span>
                                       </div>
                                    </div>
                                 </td>
                                 <td className="px-6 py-3 font-mono font-bold text-neutral-900">
                                    {formatCurrency(t.amount, t.currency)}
                                 </td>
                                 <td className="px-6 py-3">
                                    <StatusBadge status={t.status} />
                                 </td>
                                 <td className="px-6 py-3 text-neutral-500 text-xs">
                                    <div className="flex items-center gap-1.5"><Globe size={12} /> {t.userId?.country || "-"}</div>
                                 </td>
                                 <td className="px-6 py-3 text-neutral-500 text-xs">
                                    {t.createdAt ? new Date(t.createdAt).toLocaleDateString() : "-"}
                                 </td>
                                 <td className="px-6 py-3 text-right">
                                    <code className="text-[10px] text-neutral-600 bg-neutral-100 px-1.5 py-0.5 rounded border border-neutral-200">
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