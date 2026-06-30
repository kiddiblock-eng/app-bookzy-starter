"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import dynamic from "next/dynamic";
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

// Graphes en lazy-load (ssr:false) pour accélérer le 1er affichage
const Line = dynamic(
  () => import("./_charts/EbooksCharts").then((m) => m.LineChart),
  { ssr: false, loading: () => <div className="w-full h-[300px] bg-neutral-100 rounded-xl animate-pulse" /> }
);
const Bar = dynamic(
  () => import("./_charts/EbooksCharts").then((m) => m.BarChart),
  { ssr: false, loading: () => <div className="w-full h-[250px] bg-neutral-100 rounded-xl animate-pulse" /> }
);
const Doughnut = dynamic(
  () => import("./_charts/EbooksCharts").then((m) => m.DoughnutChart),
  { ssr: false, loading: () => <div className="w-full h-[250px] bg-neutral-100 rounded-xl animate-pulse" /> }
);

/* =========================================================
   COMPOSANTS UI (Design "Mission Control" - Épuré)
   ========================================================= */

function StatCard({ icon: Icon, label, value, color, subtitle }) {
  const themes = {
    purple: "text-emerald-600 bg-emerald-50 border-emerald-100",
    blue: "text-emerald-600 bg-emerald-50 border-emerald-100",
    green: "text-emerald-600 bg-emerald-50 border-emerald-100",
    yellow: "text-amber-600 bg-amber-50 border-amber-100",
  };
  const theme = themes[color] || themes.purple;

  return (
    <div className="bg-white border border-neutral-200 rounded-2xl p-5 hover:border-neutral-300 transition-all group shadow-sm">
      <div className="flex justify-between items-start mb-4">
        <div className={`p-2.5 rounded-lg ${theme}`}>
          <Icon size={20} strokeWidth={2} />
        </div>
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
            borderColor: "#059669",
            backgroundColor: (context) => {
              const ctx = context.chart.ctx;
              const gradient = ctx.createLinearGradient(0, 0, 0, 300);
              gradient.addColorStop(0, "rgba(5, 150, 105, 0.2)");
              gradient.addColorStop(1, "rgba(5, 150, 105, 0)");
              return gradient;
            },
            borderWidth: 2, pointRadius: 0, pointHoverRadius: 4, pointBackgroundColor: "#059669", pointBorderColor: "#fff", pointBorderWidth: 2, tension: 0.4, fill: true,
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
            backgroundColor: ["#059669", "#34d399", "#10b981", "#6ee7b7", "#a7f3d0"],
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
            backgroundColor: ["#059669", "#34d399", "#10b981", "#6ee7b7", "#a7f3d0"],
            borderColor: "#ffffff", borderWidth: 4,
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
      <div className="min-h-screen bg-neutral-50 p-6 md:p-8 font-sans">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6 mb-8">
          <div className="space-y-3">
            <div className="h-8 w-64 bg-neutral-100 rounded-lg animate-pulse" />
            <div className="h-4 w-48 bg-neutral-100 rounded animate-pulse" />
          </div>
          <div className="h-10 w-72 bg-neutral-100 rounded-lg animate-pulse" />
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4 mb-8">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="h-32 bg-neutral-100 rounded-2xl animate-pulse" />
          ))}
        </div>
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 mb-8">
          <div className="xl:col-span-2 h-80 bg-neutral-100 rounded-2xl animate-pulse" />
          <div className="h-80 bg-neutral-100 rounded-2xl animate-pulse" />
        </div>
        <div className="h-96 bg-neutral-100 rounded-2xl animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-8 font-sans text-neutral-900">

      {/* 1. HEADER */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6 mb-8">
        <div>
          <h1 className="text-3xl font-bold text-neutral-900 tracking-tight mb-2 flex items-center gap-3">
            Dashboard eBooks
          </h1>
          <p className="text-sm text-neutral-500 font-medium flex items-center gap-2">
             <BookOpen size={14} className="text-emerald-600" />
             Production et catalogue de contenus
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
              <button onClick={loadStats} className="p-2 text-neutral-500 hover:text-neutral-900 hover:bg-neutral-100 rounded-lg transition-colors border border-transparent hover:border-neutral-200">
                 <RefreshCw size={16} />
              </button>
              <button onClick={handleExportCSV} disabled={exporting || !filteredEbooks.length} className="p-2 text-emerald-600 hover:text-emerald-700 hover:bg-emerald-50 rounded-lg transition-colors border border-transparent hover:border-emerald-100 disabled:opacity-50">
                 <Download size={16} />
              </button>
           </div>
        </div>
      </div>

      {/* 2. STATS CARDS */}
      {!stats ? (
         <p className="text-neutral-500 text-center py-10">Aucune statistique disponible.</p>
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
         <div className="xl:col-span-2 bg-white border border-neutral-200 rounded-2xl p-6">
            <div className="flex justify-between items-center mb-6">
               <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide">Production eBooks</h3>
               <div className="flex items-center gap-2 px-2 py-1 bg-emerald-50 border border-emerald-100 rounded text-xs font-bold text-emerald-600">
                  <Sparkles size={12} /> Live
               </div>
            </div>
            <div className="h-[300px] w-full">
               {chartData && chartData.labels.length ? (
                  <Line
                     data={chartData}
                     options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false }, tooltip: { backgroundColor: '#171717', borderColor: '#e5e5e5', borderWidth: 1, titleColor: '#a3a3a3', bodyColor: '#ffffff', padding: 10 } },
                        scales: { x: { grid: { display: false }, ticks: { color: '#737373', font: { size: 10 } }, border: { display: false } }, y: { grid: { color: '#f5f5f5' }, ticks: { color: '#737373', font: { size: 10 } }, border: { display: false } } }
                     }}
                  />
               ) : <div className="h-full flex items-center justify-center text-neutral-400 text-xs">Pas de données</div>}
            </div>
         </div>

         {/* Templates Donut */}
         <div className="bg-white border border-neutral-200 rounded-2xl p-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-6">Templates Populaires</h3>
            <div className="h-[250px] flex items-center justify-center relative">
               {templateChart ? (
                  <Doughnut
                     data={templateChart}
                     options={{
                        responsive: true, maintainAspectRatio: false, cutout: '75%',
                        plugins: { legend: { position: 'bottom', labels: { boxWidth: 10, color: '#525252', font: { size: 11 }, padding: 20 } } }
                     }}
                  />
               ) : <div className="text-neutral-400 text-xs">Pas de données</div>}
               {/* Center Text */}
               <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none pb-8">
                  <span className="text-2xl font-bold text-neutral-900">{stats?.totalEbooks || 0}</span>
                  <span className="text-[10px] text-neutral-500 uppercase tracking-wider">Total</span>
               </div>
            </div>
         </div>
      </div>

      {/* 4. SECONDARY GRID (Countries + Top Creators) */}
      <div className="grid grid-cols-1 xl:grid-cols-2 gap-6 mb-8">
         <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-6 flex items-center gap-2">
               <Globe size={16} className="text-emerald-600" /> Géographie
            </h3>
            <div className="h-[250px]">
               {countryChart && countryChart.labels.length ? (
                  <Bar
                     data={countryChart}
                     options={{
                        responsive: true, maintainAspectRatio: false,
                        plugins: { legend: { display: false } },
                        scales: { x: { grid: { display: false }, ticks: { color: '#737373', font: { size: 10 } }, border: { display: false } }, y: { grid: { color: '#f5f5f5' }, ticks: { color: '#737373', font: { size: 10 } }, border: { display: false } } }
                     }}
                  />
               ) : <div className="h-full flex items-center justify-center text-neutral-400 text-xs">Pas de données</div>}
            </div>
         </div>

         <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-6 flex items-center gap-2">
               <Award size={16} className="text-amber-600" /> Top Créateurs
            </h3>
            <div className="space-y-3 max-h-[250px] overflow-y-auto custom-scrollbar pr-2">
               {stats?.topUsers?.length ? (
                  stats.topUsers.map((u, i) => (
                     <div key={i} className="flex items-center justify-between p-3 rounded-lg bg-neutral-50 border border-neutral-200 hover:border-neutral-300 transition-colors">
                        <div className="flex items-center gap-3">
                           <div className={`w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold ${i===0?'bg-amber-50 text-amber-600 border border-amber-100': i===1?'bg-neutral-100 text-neutral-500 border border-neutral-200': i===2?'bg-orange-50 text-orange-700 border border-orange-100':'bg-neutral-100 text-neutral-500 border border-neutral-200'}`}>#{i+1}</div>
                           <div>
                              <p className="text-sm font-medium text-neutral-900">{u.name || "Utilisateur"}</p>
                              <p className="text-[10px] text-neutral-500">{u.email}</p>
                           </div>
                        </div>
                        <div className="px-2 py-1 bg-emerald-50 border border-emerald-100 rounded text-xs font-bold text-emerald-600">{u.count}</div>
                     </div>
                  ))
               ) : <p className="text-neutral-500 text-xs text-center">Aucun créateur</p>}
            </div>
         </div>
      </div>

      {/* 5. EBOOKS LIST */}
      <div className="bg-white border border-neutral-200 rounded-2xl p-6 shadow-sm">
         <div className="flex flex-col sm:flex-row justify-between items-center gap-4 mb-6">
            <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide flex items-center gap-2">
               <FileText size={16} className="text-emerald-600" /> Bibliothèque ({filteredEbooks.length})
            </h3>

            <div className="flex gap-2 w-full sm:w-auto">
               <div className="relative flex-1 sm:flex-none">
                  <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                  <input type="text" value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Rechercher..." className="w-full sm:w-64 bg-white border border-neutral-200 text-neutral-900 text-xs rounded-lg pl-9 pr-3 py-2 focus:ring-2 focus:ring-neutral-900 focus:outline-none" />
               </div>
               <select value={filterTemplate} onChange={(e) => setFilterTemplate(e.target.value)} className="bg-white border border-neutral-200 text-neutral-900 text-xs rounded-lg px-3 py-2 focus:ring-2 focus:ring-neutral-900 focus:outline-none">
                  <option value="all">Templates</option>
                  {templateOptions.map(t => <option key={t} value={t}>{t}</option>)}
               </select>
            </div>
         </div>

         <div className="space-y-2 max-h-[500px] overflow-y-auto custom-scrollbar pr-2">
            {filteredEbooks.length === 0 ? <div className="text-center py-10 text-neutral-500 text-xs">Aucun eBook trouvé</div> :
               filteredEbooks.map((e) => (
                  <div key={e.id} className="group flex flex-col sm:flex-row sm:items-center justify-between p-3 rounded-lg border border-neutral-200 hover:bg-neutral-50 hover:border-neutral-300 transition-all">
                     <div className="flex items-center gap-4 mb-2 sm:mb-0">
                        <div className="w-10 h-10 bg-neutral-50 border border-neutral-200 rounded flex items-center justify-center text-neutral-500 shrink-0">
                           <BookOpen size={18} />
                        </div>
                        <div>
                           <h4 className="text-sm font-bold text-neutral-900 group-hover:text-emerald-600 transition-colors line-clamp-1">{e.title}</h4>
                           <div className="flex items-center gap-3 text-[10px] text-neutral-500 mt-0.5">
                              <span className="flex items-center gap-1"><Users size={10}/> {e.user?.email}</span>
                              <span className="flex items-center gap-1"><Layers size={10}/> {e.template || "N/A"}</span>
                           </div>
                        </div>
                     </div>

                     <div className="flex items-center justify-between sm:justify-end gap-6 text-xs text-neutral-700 pl-14 sm:pl-0">
                        <span className="font-mono bg-neutral-50 px-2 py-1 rounded border border-neutral-200">{e.pages || 0} p.</span>
                        <Link href={`/admin/ebooks/${e.id}`} className="flex items-center gap-1 text-emerald-600 hover:text-emerald-700 font-medium transition-colors">
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