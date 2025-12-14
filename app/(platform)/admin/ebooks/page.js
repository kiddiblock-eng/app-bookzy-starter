"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import {
  BookOpen,
  BarChart3,
  Users,
  FileText,
  Loader2,
  Globe,
  Calendar,
  Search,
  Eye,
  Download,
  Filter,
  X,
  Sparkles,
  TrendingUp,
  Clock,
  Award,
  RefreshCw,
  FileDown,
  Layers,
} from "lucide-react";

import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler,
} from "chart.js";

import { Line, Bar, Doughnut } from "react-chartjs-2";

// ChartJS registration (inchangé)
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
   COMPOSANTS UI (Design "Mission Control" - Épuré)
   ========================================================= */

function StatCard({ icon: Icon, label, value, color, subtitle }) {
  const themes = {
    purple: "text-purple-400 bg-purple-500/10 border-purple-500/20",
    blue: "text-blue-400 bg-blue-500/10 border-blue-500/20",
    green: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    yellow: "text-amber-400 bg-amber-500/10 border-amber-500/20",
  };
  const theme = themes[color] || themes.purple;

  return (
    <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-5 hover:border-slate-700 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg ${theme}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
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
   PAGE ADMIN EBOOKS
   ========================================================= */

export default function AdminEbooksPage() {
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState(null);
  const [ebooks, setEbooks] = useState([]);
  const [range, setRange] = useState("7d");
  const [chartData, setChartData] = useState(null);
  const [countryChart, setCountryChart] = useState(null);
  const [templateChart, setTemplateChart] = useState(null);
  const [search, setSearch] = useState("");
  const [filterTemplate, setFilterTemplate] = useState("all");
  const [filterCountry, setFilterCountry] = useState("all");
  const [filterUser, setFilterUser] = useState("all");
  const [exporting, setExporting] = useState(false);

  useEffect(() => {
    loadStats();
  }, [range]);

  // --- LOGIQUE (STRICTEMENT INTACTE) ---
  const loadStats = async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/ebooks/stats?range=${range}`, { credentials: "include" });
      const data = await res.json();
      if (!data.success) throw new Error("Erreur API");

      setStats(data.stats);
      setEbooks(data.ebooks);

      // Line Chart
      const labels = data.stats.usageOverTime.map((d) => d.date);
      const values = data.stats.usageOverTime.map((d) => d.count);
      setChartData({
        labels,
        datasets: [{
            label: "eBooks générés",
            data: values,
            borderColor: "#a855f7",
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, "rgba(168, 85, 247, 0.2)");
              gradient.addColorStop(1, "rgba(168, 85, 247, 0)");
              return gradient;
            },
            borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: "#a855f7", pointBorderColor: "#fff", pointBorderWidth: 2, tension: 0.4, fill: true,
        }],
      });

      // Bar Chart (Countries)
      const countryLabels = data.stats.topCountries.map((c) => c.country);
      const countryValues = data.stats.topCountries.map((c) => c.count);
      setCountryChart({
        labels: countryLabels,
        datasets: [{
            label: "eBooks",
            data: countryValues,
            backgroundColor: ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
            borderColor: "transparent", borderWidth: 0, borderRadius: 4, barThickness: 20,
        }],
      });

      // Doughnut (Templates)
      const templateMap = {};
      data.ebooks.forEach((e) => { const t = e.template || "Autre"; templateMap[t] = (templateMap[t] || 0) + 1; });
      const templateLabels = Object.keys(templateMap);
      const templateValues = Object.values(templateMap);
      setTemplateChart({
        labels: templateLabels,
        datasets: [{
            data: templateValues,
            backgroundColor: ["#a855f7", "#3b82f6", "#10b981", "#f59e0b", "#ef4444"],
            borderColor: "#0f1623", borderWidth: 4,
        }],
      });
    } catch (e) { console.error("Erreur chargement stats:", e); }
    setLoading(false);
  };

  const filteredEbooks = useMemo(() => {
    return ebooks.filter((e) => {
      const term = search.toLowerCase();
      if (term && !(e.title.toLowerCase().includes(term) || e.user.email.toLowerCase().includes(term) || e.user.name.toLowerCase().includes(term))) return false;
      if (filterTemplate !== "all" && (e.template || "autre") !== filterTemplate) return false;
      if (filterCountry !== "all" && e.user.country !== filterCountry) return false;
      if (filterUser !== "all" && e.user.email !== filterUser) return false;
      return true;
    });
  }, [ebooks, search, filterTemplate, filterCountry, filterUser]);

  const templateOptions = useMemo(() => { const set = new Set(); ebooks.forEach((e) => { if (e.template) set.add(e.template); }); return Array.from(set); }, [ebooks]);
  const countryOptions = useMemo(() => { const set = new Set(); ebooks.forEach((e) => { if (e.user.country) set.add(e.user.country); }); return Array.from(set); }, [ebooks]);

  const handleExportCSV = () => {
    if (!filteredEbooks.length) return;
    setExporting(true);
    try {
      const headers = ["ID","Titre","Utilisateur","Email","Pays","Template","Pages","Date","URL fichier"];
      const rows = filteredEbooks.map((e) => [e.id, e.title.replace(/"/g, '""'), (e.user.name || "").replace(/"/g, '""'), e.user.email, e.user.country, e.template || "", e.pages || 0, new Date(e.createdAt).toISOString(), e.fileUrl]);
      const csvContent = headers.join(";") + "\n" + rows.map((r) => r.map((cell) => `"${cell}"`).join(";")).join("\n");
      const blob = new Blob([csvContent], { type: "text/csv;charset=utf-8;" });
      const url = URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download",`ebooks-admin-${new Date().toISOString().slice(0, 10)}.csv`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      URL.revokeObjectURL(url);
    } catch (e) { console.error("Erreur export CSV:", e); } 
    finally { setExporting(false); }
  };

  // --- RENDER ---

  if (loading) {
    return (
      <div className="min-h-screen bg-[#020617] flex flex-col items-center justify-center gap-4 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-purple-500" />
        <p className="text-xs font-mono tracking-widest uppercase">Chargement bibliothèque...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-8 font-sans text-slate-200">
      
      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
            Dashboard eBooks
          </h1>
          <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
             <BookOpen size={14} className="text-purple-500" />
             Production et catalogue de contenus
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
              <button onClick={handleExportCSV} disabled={exporting || !filteredEbooks.length} className="p-2 text-emerald-500 hover:text-emerald-400 hover:bg-emerald-500/10 rounded-lg transition-colors border border-transparent hover:border-emerald-500/20 disabled:opacity-50">
                 <Download size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      {!stats ? (
         <p className="text-slate-500 text-center py-10">Aucune statistique disponible.</p>
      ) : (
         <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
            <StatCard icon={BookOpen} label="Total eBooks" value={stats.totalEbooks} color="purple" subtitle="Depuis le début" />
            <StatCard icon={Calendar} label="Aujourd'hui" value={stats.ebooksToday} color="blue" subtitle="Générations 24h" />
            <StatCard icon={FileText} label="Total Pages" value={stats.totalPages} color="yellow" subtitle="Volume contenu" />
            <StatCard icon={Users} label="Créateurs Actifs" value={stats.totalUsers} color="green" subtitle="Utilisateurs uniques" />
         </div>
      )}

      {/* 3. CHARTS GRID */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
         
         {/* Main Chart */}
         <div className="xl:col-span-2 bg-[#0f1623] border border-slate-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-white uppercase tracking-wide">Production eBooks</h3>
               <div className="flex items-center gap-2 px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs font-bold text-purple-400">
                  <Sparkles size={12} /> Live
               </div>
            </div>
            <div className="h-[300px] w-full">
               {chartData && chartData.labels.length ? (
                  <Line 
                     data={chartData} 
                     options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#020617', borderColor: '#334155', borderWidth: 1, titleColor: '#94a3b8', bodyColor: '#f1f5f9', padding: 10 } },
                        scales: { x: { grid: { display: false }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } }, y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } } }
                     }} 
                  />
               ) : <div className="h-full flex items-center justify-center text-slate-600 text-xs">Pas de données</div>}
            </div>
         </div>

         {/* Templates Donut */}
         <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6">Templates Populaires</h3>
            <div className="h-[250px] flex items-center justify-center relative">
               {templateChart ? (
                  <Doughnut 
                     data={templateChart} 
                     options={{ 
                        responsive: true, maintainAspectRatio: false, cutout: '75%',
                        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, color: '#94a3b8', font: { size: 11 }, padding: 20 } } } 
                     }} 
                  />
               ) : <div className="text-slate-600 text-xs">Pas de données</div>}
               {/* Center Text */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                  <span className="text-2xl font-black text-white">{stats?.totalEbooks || 0}</span>
                  <span className="text-[10px] text-slate-500 uppercase tracking-wider">Total</span>
               </div>
            </div>
         </div>
      </div>

      {/* 4. SECONDARY GRID (Countries + Top Creators) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
         <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6 flex items-center gap-2">
               <Globe size={16} className="text-blue-400" /> Géographie
            </h3>
            <div className="h-[250px]">
               {countryChart && countryChart.labels.length ? (
                  <Bar 
                     data={countryChart} 
                     options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { x: { grid: { display: false }, ticks: { color: '#94a3b8', font: { size: 10 } }, border: { display: false } }, y: { grid: { color: '#1e293b' }, ticks: { color: '#64748b', font: { size: 10 } }, border: { display: false } } }
                     }} 
                  />
               ) : <div className="h-full flex items-center justify-center text-slate-600 text-xs">Pas de données</div>}
            </div>
         </div>

         <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6 flex items-center gap-2">
               <Award size={16} className="text-yellow-400" /> Top Créateurs
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
               {stats?.topUsers?.length ? (
                  stats.topUsers.map((u, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-slate-800/30 border border-slate-800/50 hover:border-slate-700 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i===0?'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20': i===1?'bg-slate-400/10 text-slate-400 border border-slate-400/20': i===2?'bg-orange-700/10 text-orange-700 border border-orange-700/20':'bg-slate-800 text-slate-500 border border-slate-700'}`}>#{i+1}</div>
                           <div>
                              <p className="text-sm font-medium text-slate-200">{u.name || "Utilisateur"}</p>
                              <p className="text-[10px] text-slate-500">{u.email}</p>
                           </div>
                        </div>
                        <div className="px-2 py-1 bg-purple-500/10 border border-purple-500/20 rounded text-xs font-bold text-purple-400">{u.count}</div>
                     </div>
                  ))
               ) : <p className="text-slate-500 text-xs text-center">Aucun créateur</p>}
            </div>
         </div>
      </div>

      {/* 5. EBOOKS LIST */}
      <div className="bg-[#0f1623] border border-slate-800 rounded-xl p-6">
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h3 className="text-sm font-bold text-white uppercase tracking-wide flex items-center gap-2">
               <FileText size={16} className="text-indigo-400" /> Bibliothèque ({filteredEbooks.length})
            </h3>
            
            <div className="flex gap-2 w-full sm:w-auto">
               <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full sm:w-64 bg-[#1a202c] border border-slate-800 text-slate-200 text-xs rounded-lg pl-9 pr-3 py-2 focus:border-indigo-500 focus:outline-none" />
               </div>
               <select value={filterTemplate} onChange={(e) => setFilterTemplate(e.target.value)} className="bg-[#1a202c] border border-slate-800 text-slate-200 text-xs rounded-lg px-3 py-2 focus:border-indigo-500 focus:outline-none">
                  <option value="all">Templates</option>
                  {templateOptions.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
         </div>

         <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {filteredEbooks.length === 0 ? <div className="text-center py-10 text-slate-500 text-xs">Aucun eBook trouvé</div> : 
               filteredEbooks.map((e) => (
                  <div key={e.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-slate-800/50 hover:bg-slate-800/30 hover:border-slate-700 transition-all">
                     <div className="flex items-center gap-4 mb-2 sm:mb-0">
                        <div className="w-10 h-10 bg-slate-900 border border-slate-800 rounded flex items-center justify-center text-slate-500 shrink-0">
                           <BookOpen size={18} />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-slate-200 group-hover:text-indigo-400 transition-colors line-clamp-1">{e.title}</h4>
                           <div className="flex items-center gap-3 text-[10px] text-slate-500 mt-0.5">
                              <span className="flex items-center gap-1"><Users size={10}/> {e.user?.email}</span>
                              <span className="flex items-center gap-1"><Layers size={10}/> {e.template || "N/A"}</span>
                           </div>
                        </div>
                     </div>
                     
                     <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-slate-400 pl-14 sm:pl-0">
                        <span className="font-mono bg-slate-900 px-2 py-1 rounded border border-slate-800">{e.pages || 0} p.</span>
                        <Link href={`/admin/ebooks/${e.id}`} className="flex items-center gap-1 text-indigo-400 hover:text-indigo-300 font-medium transition-colors">
                           Détails <Eye size={14} />
                        </Link>
                     </div>
                  </div>
               ))
            }
         </div>
      </div>

    </div>
  );
}