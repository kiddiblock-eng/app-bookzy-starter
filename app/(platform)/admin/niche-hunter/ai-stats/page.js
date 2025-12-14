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

// Register chart.js modules
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

/* =========================================================
   COMPOSANTS UI (Design Mission Control)
   ========================================================= */

function StatCard({ icon: Icon, label, value, trend, color = "purple", subtitle }) {
  const themes = {
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    orange: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };
  const theme = themes[color] || themes.purple;

  return (
    <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg ${theme}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
        {trend !== null && trend !== undefined && (
          <div className={`flex items-center gap-1 text-xs font-medium px-2 py-1 rounded-md ${
            Number(trend) > 0 ? "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20" : "bg-red-500/10 text-red-400 border border-red-500/20"
          }`}>
            {Number(trend) > 0 ? <TrendingUp size={12} /> : <TrendingDown size={12} />}
            {Math.abs(Number(trend))}%
          </div>
        )}
      </div>
      <div>
        <h3 className="text-slate-400 text-xs font-bold uppercase tracking-wider mb-1">{label}</h3>
        <div className="text-2xl font-bold text-white tracking-tight">{Number(value).toLocaleString()}</div>
        {subtitle && <p className="text-slate-500 text-xs mt-1">{subtitle}</p>}
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
              borderColor: "#a855f7", // Purple 500
              backgroundColor: (context) => {
                const ctx = context.chart.ctx;
                const gradient = ctx.createLinearGradient(0, 0, 0, 300);
                gradient.addColorStop(0, "rgba(168, 85, 247, 0.2)");
                gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
                return gradient;
              },
              borderWidth: 2,
              pointRadius: 0,
              pointHoverRadius: 4,
              pointBackgroundColor: "#a855f7",
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
              backgroundColor: ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
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
              backgroundColor: ["#10b981", "#3b82f6", "#ef4444", "#64748b"],
              borderColor: "#0f1623",
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
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <p className="text-xs font-mono tracking-widest uppercase">Analyse IA en cours...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-8 font-sans text-slate-200">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            Dashboard IA
          </h1>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
             <Brain size={14} className="text-purple-500" />
             Métriques du moteur d'analyse de niches
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
              <button onClick={loadStats} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
                 <RefreshCw size={16} />
              </button>
              <button className="p-2 text-purple-500 hover:text-purple-400 hover:bg-purple-500/10 rounded-lg transition-colors border border-transparent hover:border-purple-500/20">
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
          color="purple"
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
        <div className="xl:col-span-2 bg-[#0f1623] border border-slate-800 rounded-xl p-6">
           <div className="flex justify-between items-center mb-6">
              <h3 className="text-sm font-bold text-white uppercase tracking-wide">Volume d'Analyses</h3>
              <div className="flex items-center gap-2 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs font-bold text-purple-400">
                 <Sparkles size={12} /> Live
              </div>
           </div>
           
           <div className="h-[300px] w-full">
              {chartData ? (
                 <Line
                    data={chartData}
                    options={{
                       responsive: true,
                       maintainAspectRatio: false,
                       plugins: { legend: { display: false }, tooltip: { backgroundColor: '#020617', borderColor: '#334155', borderWidth: 1, titleColor: '#94a3b8', bodyColor: '#f1f5f9', padding: 10 } },
                       scales: {
                          x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } },
                          y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } }
                       }
                    }}
                 />
              ) : (
                 <div className="h-full flex items-center justify-center text-slate-600 text-xs">Pas de données</div>
              )}
           </div>
        </div>

        {/* Status Donut */}
        <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-6">
           <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6">État du système</h3>
           <div className="h-[250px] flex items-center justify-center relative">
              {statusChart ? (
                 <Doughnut
                    data={statusChart}
                    options={{
                       responsive: true,
                       maintainAspectRatio: false,
                       cutout: '75%',
                       plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, color: '#94a3b8', font: { size: 11 }, padding: 20 } } }
                    }}
                 />
              ) : (
                 <div className="text-slate-600 text-xs">Pas de données</div>
              )}
              {/* Center Text Overlay */}
              <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                 <span className="text-2xl font-black text-white">{stats?.totalAnalyses || 0}</span>
                 <span className="text-[10px] text-slate-500 uppercase tracking-wider">Total</span>
              </div>
           </div>
        </div>
      </div>

      {/* 4. SECONDARY GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
         
         {/* GEO MAP (Bar Chart) */}
         <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6 flex items-center gap-2">
               <Globe size={16} className="text-blue-400" /> Répartition Géographique
            </h3>
            <div className="h-[250px]">
               {countryChart ? (
                  <Bar
                     data={countryChart}
                     options={{
                        responsive: true,
                        maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: {
                           x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } }, border: { display: false } },
                           y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } }
                        }
                     }}
                  />
               ) : (
                  <div className="h-full flex items-center justify-center text-slate-600 text-xs">Pas de données</div>
               )}
            </div>
         </div>

         {/* TOP USERS LIST */}
         <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6 flex items-center gap-2">
               <Award size={16} className="text-yellow-400" /> Top Utilisateurs
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
               {stats?.topUsers?.slice(0, 10).map((u, i) => (
                  <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-800/50 hover:border-slate-700 transition-colors">
                     <div className="flex items-center gap-3">
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${
                           i === 0 ? "bg-yellow-500/10 text-yellow-500 border border-yellow-500/20" : 
                           i === 1 ? "bg-slate-400/10 text-slate-400 border border-slate-400/20" : 
                           i === 2 ? "bg-orange-700/10 text-orange-700 border border-orange-700/20" : 
                           "bg-slate-800 text-slate-500 border border-slate-700"
                        }`}>
                           #{i + 1}
                        </div>
                        <div>
                           <p className="text-sm font-medium text-slate-200">{u.fullName || "Utilisateur"}</p>
                           <p className="text-[10px] text-slate-500">{u.email}</p>
                        </div>
                     </div>
                     <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs font-bold text-purple-400">
                        {u.count}
                     </div>
                  </div>
               ))}
            </div>
         </div>
      </div>

      {/* 5. HISTORY TABLE */}
      <div className="mt-8 bg-[#0f1623] border border-slate-800 rounded-xl overflow-hidden">
         <div className="px-6 py-4 border-b border-slate-800 flex justify-between items-center bg-[#0f1623]">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
               <Search size={16} className="text-slate-400" /> Historique récent
            </h3>
            <div className="flex items-center gap-1 text-[10px] font-mono text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
               <Clock size={10} /> LIVE LOGS
            </div>
         </div>
         <div className="max-h-[400px] overflow-y-auto custom-scrollbar">
            <table className="w-full text-left border-collapse">
               <thead className="bg-[#131b2e] sticky top-0 z-10">
                  <tr className="text-[10px] uppercase text-slate-500 font-semibold tracking-wider">
                     <th className="px-6 py-3 border-b border-slate-800">Thème</th>
                     <th className="px-6 py-3 border-b border-slate-800">Utilisateur</th>
                     <th className="px-6 py-3 border-b border-slate-800 text-center">Niches</th>
                     <th className="px-6 py-3 border-b border-slate-800 text-right">Date</th>
                  </tr>
               </thead>
               <tbody className="divide-y divide-slate-800 text-sm">
                  {analyses.map((a) => (
                     <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                        <td className="px-6 py-3 font-medium text-slate-300">
                           <div className="flex items-center gap-2">
                              <Brain size={14} className="text-purple-500" />
                              {a.theme}
                           </div>
                        </td>
                        <td className="px-6 py-3 text-slate-400 text-xs">
                           {a.user?.email || "Anonyme"}
                        </td>
                        <td className="px-6 py-3 text-center">
                           <span className="inline-block px-2 py-0.5 bg-emerald-500/10 text-emerald-400 rounded text-xs font-bold border border-emerald-500/20">
                              {a.totalNiches}
                           </span>
                        </td>
                        <td className="px-6 py-3 text-right text-xs text-slate-500 font-mono">
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