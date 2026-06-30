"use client";

import { useEffect, useState } from "react";
import {
  BarChart3,
  Users,
  Activity,
  Calendar,
  Search,
  Loader2,
  Brain,
  Globe,
  TrendingUp,
  TrendingDown,
  Sparkles,
  Target,
  Zap,
  Clock,
  Award,
  Filter,
  Download,
  RefreshCw,
} from "lucide-react";

import dynamic from "next/dynamic";

// Lazy charts (client-only) pour accélérer le 1er affichage
const VolumeLineChart = dynamic(
  () => import("./_charts/AiStatsCharts").then((m) => m.VolumeLineChart),
  { ssr: false, loading: () => <div className="w-full h-[300px] bg-neutral-100 rounded-xl animate-pulse" /> }
);
const StatusDoughnutChart = dynamic(
  () => import("./_charts/AiStatsCharts").then((m) => m.StatusDoughnutChart),
  { ssr: false, loading: () => <div className="w-full h-[250px] bg-neutral-100 rounded-xl animate-pulse" /> }
);
const CountryBarChart = dynamic(
  () => import("./_charts/AiStatsCharts").then((m) => m.CountryBarChart),
  { ssr: false, loading: () => <div className="w-full h-[250px] bg-neutral-100 rounded-xl animate-pulse" /> }
);

/* =========================================================
   COMPOSANTS UI (Design Mission Control)
   ========================================================= */

function StatCard({ icon: Icon, label, value, trend, color = "emerald", subtitle }) {
  const themes = {
    emerald: "text-emerald-600 bg-emerald-50 border-emerald-200",
    blue: "text-blue-600 bg-blue-50 border-blue-200",
    green: "text-emerald-600 bg-emerald-50 border-emerald-200",
    orange: "text-amber-600 bg-amber-50 border-amber-200",
  };
  const theme = themes[color] || themes.emerald;

  return (
    <div className="bg-white border border-neutral-200 rounded-xl p-5 hover:border-neutral-300 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg ${theme}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        {trend !== null && trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
            Number(trend) > 0 ? "bg-emerald-50 text-emerald-600 border border-emerald-200" : "bg-red-50 text-red-600 border border-red-200"
          }`}>
            {Number(trend) > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(Number(trend))}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-neutral-500 text-xs font-bold uppercase tracking-wider mb-1">{label}</h3>
        <div className="text-2xl font-bold text-neutral-900 tracking-tight">{Number(value).toLocaleString()}</div>
        {subtitle && <p className="text-neutral-500 text-xs mt-1">{subtitle}</p>}
      </div>
    </div>
  );
}

/* =========================================================
   PAGE ADMIN AI STATS
   ========================================================= */

export default function AdminAIStatsPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [analyses, setAnalyses] = useState([]);
  const [chartData, setChartData] = useState(null);
  const [countryChart, setCountryChart] = useState(null);
  const [statusChart, setStatusChart] = useState(null);
  const [range, setRange] = useState("7d");

  useEffect(() => {
    loadStats();
  }, [range]);

  // --- LOGIQUE DE CHARGEMENT (INTACTE) ---
  const loadStats = async () => {
    setLoading(true);

    try {
      console.log("📡 Chargement des stats...");
      
      const res = await fetch(
        `/api/admin/niche-hunter/ai-stats?range=${range}`,
        {
          headers: {
            "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET,
          },
        }
      );

      if (!res.ok) throw new Error(`Erreur ${res.status}: ${res.statusText}`);

      const data = await res.json();

      if (!data.success) throw new Error(data.message || "Erreur API");
      if (!data.stats) throw new Error("Données stats manquantes");

      setStats(data.stats);
      setAnalyses(data.analyses || []);

      // LINE CHART
      if (data.stats.usageOverTime && data.stats.usageOverTime.length > 0) {
        const labels = data.stats.usageOverTime.map((d) => d.date);
        const values = data.stats.usageOverTime.map((d) => d.count);

        setChartData({
          labels,
          datasets: [
            {
              label: "Analyses IA",
              data: values,
              borderColor: "#059669", // Emerald 600
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, "rgba(5, 150, 105, 0.2)");
                gradient.addColorStop(1, "rgba(5, 150, 105, 0)");
                return gradient;
              },
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointBackgroundColor: "#059669",
              pointBorderColor: "#fff",
              pointBorderWidth: 2,
              tension: 0.4,
              fill: true,
            },
          ],
        });
      }

      // BAR CHART
      if (data.stats.topCountries && data.stats.topCountries.length > 0) {
        const countryLabels = data.stats.topCountries.map((c) => c.country);
        const countryValues = data.stats.topCountries.map((c) => c.count);

        setCountryChart({
          labels: countryLabels,
          datasets: [
            {
              label: "Utilisateurs",
              data: countryValues,
              backgroundColor: ["#059669", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
              borderColor: "transparent",
              borderWidth: 0,
              borderRadius: 4,
              barThickness: 20,
            },
          ],
        });
      }

      // DOUGHNUT CHART
      if (data.stats.statusStats) {
        setStatusChart({
          labels: ["Complétées", "En cours", "Échouées", "En attente"],
          datasets: [
            {
              data: [
                data.stats.statusStats.completed || 0,
                data.stats.statusStats.processing || 0,
                data.stats.statusStats.failed || 0,
                data.stats.statusStats.pending || 0,
              ],
              backgroundColor: ["#059669", "#3b82f6", "#ef4444", "#94a3b8"],
              borderColor: "#ffffff",
              borderWidth: 4,
            },
          ],
        });
      }

    } catch (err) {
      console.error("❌ Erreur chargement stats:", err);
    }

    setLoading(false);
  };

  const calculateTrend = () => {
    if (!stats?.todayAnalyses || !stats?.totalAnalyses) return 0;
    const avg = stats.totalAnalyses / 30;
    const diff = stats.todayAnalyses - avg;
    return ((diff / avg) * 100).toFixed(1);
  };

  const trend = calculateTrend();

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-neutral-50 flex flex-col items-center justify-center gap-4 text-neutral-500">
        <Loader2 className="w-10 h-10 animate-spin text-emerald-600" />
        <p className="text-xs font-mono tracking-widest uppercase">Analyse IA en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-8 font-sans text-neutral-700">

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2 flex items-center gap-3">
            Dashboard IA
          </h1>
          <p className="text-sm text-neutral-500 font-medium flex items-center gap-2">
             <Brain size={14} className="text-emerald-600" />
             Métriques du moteur d'analyse de niches
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
                       range === f.value ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"
                    }`}
                 >
                    {f.label}
                 </button>
              ))}
           </div>

           {/* Actions */}
           <div className="flex items-center gap-2">
              <button onClick={loadStats} className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-transparent hover:border-neutral-200">
                 <RefreshCw size={16} />
              </button>
              <button className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-200">
                 <Download size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
        <StatCard
          icon={Zap}
          label="Total Analyses"
          value={stats?.totalAnalyses || 0}
          trend={null}
          color="emerald"
          subtitle="Depuis le lancement"
        />
        <StatCard
          icon={Activity}
          label="Analyses (24h)"
          value={stats?.todayAnalyses || 0}
          trend={trend}
          color="blue"
          subtitle="Activité journalière"
        />
        <StatCard
          icon={Users}
          label="Utilisateurs Actifs"
          value={stats?.topUsers?.length || 0}
          trend={stats?.activeUsersTrend || null}
          color="green"
          subtitle="Sur la période"
        />
        <StatCard
          icon={Target}
          label="Niches Générées"
          value={stats?.totalNichesGenerated || analyses.reduce((acc, a) => acc + (a.totalNiches || 0), 0)}
          trend={stats?.nichesTrend || null}
          color="orange"
          subtitle="Production totale"
        />
      </div>

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
        
        {/* Main Chart */}
        <div className="xl:col-span-2 bg-white border border-neutral-200 rounded-xl p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Volume d'Analyses</h3>
              <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-xs font-bold text-emerald-600">
                 <Sparkles size={12} /> Live
              </div>
           </div>
           
           <div className="h-[300px] w-full">
              {chartData ? (
                 <VolumeLineChart
                    data={chartData}
                    options={{
                       responsive: true,
                       maintainAspectRatio: false,
                       plugins: { legend: { display: false }, tooltip: { backgroundColor: '#ffffff', borderColor: '#e5e7eb', borderWidth: 1, titleColor: '#6b7280', bodyColor: '#111827', padding: 10 } },
                       scales: {
                          x: { grid: { display: false }, ticks: { color: '#6b7280', font: { size: 10 } }, border: { display: false } },
                          y: { grid: { color: '#f1f5f9' }, ticks: { color: '#6b7280', font: { size: 10 } }, border: { display: false } }
                       }
                    }}
                 />
              ) : (
                 <div className="h-full flex items-center justify-center text-neutral-400 text-xs">Pas de données</div>
              )}
           </div>
        </div>

        {/* Status Donut */}
        <div className="bg-white border border-neutral-200 rounded-xl p-6">
           <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-6">État du système</h3>
           <div className="h-[250px] flex items-center justify-center relative">
              {statusChart ? (
                 <StatusDoughnutChart
                    data={statusChart}
                    options={{
                       responsive: true,
                       maintainAspectRatio: false,
                       cutout: '75%',
                       plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, color: '#6b7280', font: { size: 11 }, padding: 20 } } }
                    }}
                 />
              ) : (
                 <div className="text-neutral-400 text-xs">Pas de données</div>
              )}
              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                 <span className="text-2xl font-black text-neutral-900">{stats?.totalAnalyses || 0}</span>
                 <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Total</span>
              </div>
           </div>
        </div>
      </div>

      {/* 4. SECONDARY GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         
         {/* GEO MAP (Bar Chart) */}
         <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-6 flex items-center gap-2">
               <Globe size={16} className="text-blue-600" /> Répartition Géographique
            </h3>
            <div className="h-[250px]">
               {countryChart ? (
                  <CountryBarChart
                     data={countryChart}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                           x: { grid: { display: false }, ticks: { color: '#6b7280', font: { size: 10 } }, border: { display: false } },
                           y: { grid: { color: '#f1f5f9' }, ticks: { color: '#6b7280', font: { size: 10 } }, border: { display: false } }
                        }
                     }}
                  />
               ) : (
                  <div className="h-full flex items-center justify-center text-neutral-400 text-xs">Pas de données</div>
               )}
            </div>
         </div>

         {/* TOP USERS LIST */}
         <div className="bg-white border border-neutral-200 rounded-xl p-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-6 flex items-center gap-2">
               <Award size={16} className="text-amber-500" /> Top Utilisateurs
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
               {stats?.topUsers?.slice(0, 10).map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                           i === 0 ? "bg-amber-50 text-amber-500 border border-amber-200" :
                           i === 1 ? "bg-neutral-100 text-neutral-500 border border-neutral-200" :
                           i === 2 ? "bg-orange-50 text-orange-700 border border-orange-200" :
                           "bg-neutral-100 text-neutral-500 border border-neutral-200"
                        }`}>
                           #{i + 1}
                        </div>
                        <div>
                           <p className="text-sm font-medium text-neutral-900">{u.fullName || "Utilisateur"}</p>
                           <p className="text-[10px] text-neutral-500">{u.email}</p>
                        </div>
                     </div>
                     <div className="px-2 py-1 bg-emerald-50 border border-emerald-200 rounded text-xs font-bold text-emerald-600">
                        {u.count}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 5. HISTORY TABLE */}
      <div className="mt-8 bg-white border border-neutral-200 rounded-xl overflow-hidden">
         <div className="px-6 py-4 border-b border-neutral-200 flex justify-between items-center bg-white">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
               <Search size={16} className="text-neutral-500" /> Historique récent
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-mono text-neutral-500 bg-neutral-50 px-2 py-1 rounded border border-neutral-200">
               <Clock size={10} /> LIVE LOGS
            </div>
         </div>
         <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead className="bg-neutral-50 sticky top-0 z-10">
                  <tr className="text-[10px] uppercase text-neutral-500 font-semibold tracking-wider">
                     <th className="px-6 py-3 border-b border-neutral-200">Thème</th>
                     <th className="px-6 py-3 border-b border-neutral-200">Utilisateur</th>
                     <th className="px-6 py-3 border-b border-neutral-200 text-center">Niches</th>
                     <th className="px-6 py-3 border-b border-neutral-200 text-right">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-neutral-200 text-sm">
                  {analyses.map((a) => (
                     <tr key={a.id} className="hover:bg-neutral-50 transition-colors">
                        <td className="px-6 py-3 font-medium text-neutral-700">
                           <div className="flex items-center gap-2">
                              <Brain size={14} className="text-emerald-600" />
                              {a.theme}
                           </div>
                        </td>
                        <td className="px-6 py-3 text-neutral-500 text-xs">
                           {a.user?.email || "Anonyme"}
                        </td>
                        <td className="px-6 py-3 text-center">
                           <span className="inline-block px-2 py-0.5 bg-emerald-50 text-emerald-600 rounded text-xs font-bold border border-emerald-200">
                              {a.totalNiches}
                           </span>
                        </td>
                        <td className="px-6 py-3 text-right text-xs text-neutral-500 font-mono">
                           {new Date(a.generatedAt).toLocaleString("fr-FR")}
                        </td>
                     </tr>
                  ))}
               </tbody>
            </table>
         </div>
      </div>

    </div>
  );
}