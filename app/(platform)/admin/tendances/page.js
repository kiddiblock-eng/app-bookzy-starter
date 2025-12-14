"use client";

import { useEffect, useState } from "react";
import {
  PlusCircle,
  TrendingUp,
  Flame,
  Trash2,
  Globe,
  Loader2,
  Eye,
  CheckCircle2,
  Search,
  Calendar,
  DollarSign,
  Target,
  BarChart3,
  Sparkles,
  RefreshCw,
  Tag,
  Network,
  AlertCircle,
  X,
  List,
  Layers,
  ArrowRight
} from "lucide-react";

export default function AdminTendancesPage() {
  const [tab, setTab] = useState("list");
  const [loading, setLoading] = useState(true);
  const [tendances, setTendances] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filterNetwork, setFilterNetwork] = useState("all");

  useEffect(() => {
    loadTendances();
  }, []);

  const loadTendances = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/admin/tendances/list", {
        headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET }
      });
      const data = await res.json();
      if (data.success) setTendances(data.trends || []);
    } catch (err) {
      console.error("Erreur load tendances:", err);
    }
    setLoading(false);
  };

  const deleteTendance = async (id) => {
    if (!confirm("Supprimer cette tendance ?")) return;
    try {
      const res = await fetch(`/api/admin/tendances/delete/${id}`, {
        method: "DELETE",
        headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET }
      });
      const data = await res.json();
      if (data.success) {
        setTendances((prev) => prev.filter((t) => t._id !== id));
      }
    } catch (err) {
      console.error("Erreur suppression:", err);
    }
  };

  const filteredTendances = tendances.filter((t) => {
    const matchSearch = searchTerm === "" || 
      t.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      t.description?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchNetwork = filterNetwork === "all" || t.network === filterNetwork;
    return matchSearch && matchNetwork;
  });

  return (
    <div className="min-h-screen bg-[#020617] p-6 md:p-8 font-sans text-slate-200">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-slate-800/50 pb-6">
          <div>
            <h1 className="text-3xl font-black text-white tracking-tight mb-2 flex items-center gap-3">
              Gestion des Tendances
            </h1>
            <p className="text-sm text-slate-500 font-medium flex items-center gap-2">
              <TrendingUp size={14} className="text-indigo-500" />
              Catalogue et opportunités virales
            </p>
          </div>

          <div className="flex items-center gap-3">
             <div className="flex items-center gap-2 px-3 py-1.5 bg-emerald-500/10 border border-emerald-500/20 rounded-md text-xs font-bold text-emerald-400">
               <CheckCircle2 size={12} />
               {tendances.length} ACTIVES
             </div>
             
             {/* TABS SEGMENTED */}
             <div className="flex p-1 bg-slate-900/50 border border-slate-800 rounded-lg">
                <button
                  onClick={() => setTab("list")}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
                    tab === "list" ? "bg-slate-800 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <List size={14} /> Catalogue
                </button>
                <button
                  onClick={() => setTab("create")}
                  className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
                    tab === "create" ? "bg-indigo-600 text-white shadow-sm" : "text-slate-500 hover:text-slate-300"
                  }`}
                >
                  <PlusCircle size={14} /> Nouvelle
                </button>
             </div>
             
             <button onClick={loadTendances} className="p-2 text-slate-500 hover:text-white hover:bg-slate-800 rounded-lg transition-colors border border-transparent hover:border-slate-700">
               <RefreshCw size={16} />
             </button>
          </div>
        </div>

        {/* CONTENT */}
        <div className="min-h-[600px]">
           {tab === "list" && (
             <TendancesList
               tendances={filteredTendances}
               loading={loading}
               deleteTendance={deleteTendance}
               searchTerm={searchTerm}
               setSearchTerm={setSearchTerm}
               filterNetwork={filterNetwork}
               setFilterNetwork={setFilterNetwork}
             />
           )}

           {tab === "create" && <CreateTendanceForm reload={loadTendances} />}
        </div>
      </div>
    </div>
  );
}

/* ==========================================
   LISTE DES TENDANCES (Design Grid Technical)
   ========================================== */
function TendancesList({ tendances, loading, deleteTendance, searchTerm, setSearchTerm, filterNetwork, setFilterNetwork }) {
  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-slate-500">
        <Loader2 className="w-10 h-10 animate-spin text-indigo-500 mb-4" />
        <p className="text-xs font-mono tracking-widest uppercase">Synchronisation du catalogue...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Filters Bar */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500 w-4 h-4" />
          <input
            type="text"
            placeholder="Rechercher par titre, description..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-[#0f1623] border border-slate-800 text-slate-200 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-indigo-500 placeholder:text-slate-600 transition-all"
          />
        </div>

        <select
          value={filterNetwork}
          onChange={(e) => setFilterNetwork(e.target.value)}
          className="bg-[#0f1623] border border-slate-800 text-slate-200 text-sm rounded-lg px-4 py-2.5 focus:outline-none focus:border-indigo-500 cursor-pointer min-w-[200px]"
        >
          <option value="all">Tous les réseaux</option>
          <option value="TikTok">TikTok</option>
          <option value="Instagram">Instagram</option>
          <option value="YouTube">YouTube</option>
          <option value="Multi-plateformes">Multi-plateformes</option>
        </select>
      </div>

      {/* Grid */}
      {tendances.length === 0 ? (
        <div className="text-center py-20 border border-dashed border-slate-800 rounded-xl">
          <Flame className="w-12 h-12 text-slate-700 mx-auto mb-4" />
          <h3 className="text-sm font-bold text-slate-400 uppercase tracking-wide">Aucune tendance</h3>
          <p className="text-xs text-slate-600 mt-1">
            {searchTerm || filterNetwork !== "all" ? "Ajustez vos filtres." : "Commencez par en créer une."}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {tendances.map((trend) => (
            <div
              key={trend._id}
              className="bg-[#0f1623] border border-slate-800 rounded-xl overflow-hidden hover:border-indigo-500/50 transition-all group flex flex-col"
            >
              {/* Header / Gradient Strip */}
              <div className={`h-1.5 w-full bg-gradient-to-r ${trend.gradient || 'from-indigo-500 to-purple-500'}`} />
              
              <div className="p-5 flex-1 flex flex-col">
                <div className="flex justify-between items-start mb-3">
                  <div className="text-3xl">{trend.emoji}</div>
                  <button
                    onClick={() => deleteTendance(trend._id)}
                    className="p-1.5 rounded-md text-slate-600 hover:text-red-400 hover:bg-red-500/10 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>

                <h2 className="text-lg font-bold text-white mb-2 line-clamp-1">{trend.title}</h2>
                <p className="text-slate-400 text-xs line-clamp-2 mb-4 flex-1">{trend.description}</p>

                {/* Metrics Grid */}
                <div className="grid grid-cols-2 gap-3 mb-4">
                   <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-2">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Potentiel</div>
                      <div className="text-sm font-mono font-bold text-emerald-400">{trend.potential}€</div>
                   </div>
                   <div className="bg-slate-900/50 border border-slate-800 rounded-lg p-2">
                      <div className="text-[10px] text-slate-500 uppercase font-bold mb-0.5">Volume</div>
                      <div className="text-sm font-mono font-bold text-blue-400">{trend.searches}</div>
                   </div>
                </div>

                {/* Badges Footer */}
                <div className="flex items-center justify-between pt-3 border-t border-slate-800/50">
                   <div className="flex gap-2">
                      {trend.isHot && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">HOT</span>}
                      {trend.isRising && <span className="px-1.5 py-0.5 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">RISING</span>}
                   </div>
                   <div className="text-[10px] text-slate-600 font-mono">
                      {trend.network}
                   </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ==========================================
   FORMULAIRE CREATION (Design Tech Form)
   ========================================== */
function CreateTendanceForm({ reload }) {
  // --- ETATS & LOGIQUE (STRICTEMENT CONSERVÉS) ---
  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    title: "", description: "", emoji: "🔥", gradient: "from-blue-500 to-cyan-500", network: "Multi-plateformes",
    potential: 1000, searches: 10000, difficulty: "Moyen", competition: "Moyenne", growth: 50,
    isHot: false, isRising: false, isProfitable: false, isTrending: true,
    period: "Mois", region: "Global", categories: [], monetizationPotential: "Moyen", estimatedRevenue: "",
    monetizationMethods: [], targetAudience: "", contentType: "Vidéo courte", expiryDate: "", priority: 0,
    tags: [], sources: [], notes: "",
  });

  const gradients = [
    "from-blue-500 to-cyan-500", "from-purple-500 to-pink-500", "from-emerald-500 to-green-500",
    "from-orange-500 to-red-500", "from-indigo-500 to-blue-600", "from-yellow-500 to-orange-500",
  ];
  const networks = [ "TikTok", "Instagram", "YouTube", "YouTube Shorts", "Facebook", "Twitter/X", "Pinterest", "LinkedIn", "Snapchat", "Reddit", "Twitch", "Multi-plateformes", "Autre" ];
  const categoriesList = [ "Technologie", "Business", "Santé", "Fitness", "Alimentation", "Éducation", "Divertissement", "Lifestyle", "Finance", "Mode", "Beauté", "Voyage", "Gaming", "Sport", "Art & Design", "Musique", "Immobilier", "Entrepreneuriat", "Marketing", "Développement personnel", "Environnement", "Famille & Parentalité", "Autre" ];
  const difficulties = ["Facile", "Moyen", "Difficile"];
  const competitions = ["Faible", "Moyenne", "Élevée"];
  const periods = ["Jour", "Semaine", "Mois", "Trimestre", "Année", "Permanent"];
  const regions = [ "Global", "France", "USA", "UK", "Canada", "Afrique", "Europe", "Asie", "Autre" ];

  const toggleCategory = (cat) => {
    setForm(prev => ({ ...prev, categories: prev.categories.includes(cat) ? prev.categories.filter(c => c !== cat) : [...prev.categories, cat] }));
  };

  const send = async () => {
    if (!form.title || !form.description) { alert("Titre et description obligatoires"); return; }
    setSaving(true);
    try {
      const res = await fetch("/api/admin/tendances/create", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true); setTimeout(() => setSuccess(false), 3000); reload();
        setForm({ ...form, title: "", description: "", tags: [], sources: [], categories: [] });
      } else { alert(data.message); }
    } catch (err) { console.error(err); alert("Erreur lors de la création"); }
    setSaving(false);
  };

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
      
      {/* Form Area */}
      <div className="xl:col-span-2 space-y-8">
        
        {/* Section 1: Base Info */}
        <div className="p-6 border border-slate-800 rounded-xl bg-[#0f1623]">
           <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6 border-b border-slate-800 pb-2">Informations Générales</h3>
           <div className="space-y-5">
              <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Titre</label>
                 <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Titre de la tendance" className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg p-3 focus:border-indigo-500 focus:outline-none" />
              </div>
              <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Description</label>
                 <textarea rows={3} value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} placeholder="Détails..." className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg p-3 focus:border-indigo-500 focus:outline-none resize-none" />
              </div>
              <div className="grid grid-cols-2 gap-4">
                 <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Emoji</label>
                    <input type="text" value={form.emoji} onChange={(e) => setForm({ ...form, emoji: e.target.value })} className="w-full bg-[#1a202c] border border-slate-700 text-center text-xl rounded-lg p-3 focus:border-indigo-500 focus:outline-none" />
                 </div>
                 <div>
                    <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Style (Gradient)</label>
                    <div className="flex gap-2">
                       {gradients.slice(0, 4).map(g => (
                          <button key={g} onClick={() => setForm({ ...form, gradient: g })} className={`flex-1 h-10 rounded-lg bg-gradient-to-r ${g} border-2 transition-all ${form.gradient === g ? 'border-white' : 'border-transparent opacity-60 hover:opacity-100'}`} />
                       ))}
                    </div>
                 </div>
              </div>
           </div>
        </div>

        {/* Section 2: Metrics */}
        <div className="p-6 border border-slate-800 rounded-xl bg-[#0f1623]">
           <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6 border-b border-slate-800 pb-2">Métriques & Potentiel</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Potentiel (€)</label>
                 <div className="relative">
                    <DollarSign size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                    <input type="number" value={form.potential} onChange={(e) => setForm({ ...form, potential: Number(e.target.value) })} className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-3 py-3 focus:border-indigo-500 focus:outline-none" />
                 </div>
              </div>
              <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Volume (Rech/mois)</label>
                 <div className="relative">
                    <BarChart3 size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-500"/>
                    <input type="number" value={form.searches} onChange={(e) => setForm({ ...form, searches: Number(e.target.value) })} className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg pl-10 pr-3 py-3 focus:border-indigo-500 focus:outline-none" />
                 </div>
              </div>
           </div>
           
           <div className="grid grid-cols-3 gap-4">
              <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Difficulté</label>
                 <select value={form.difficulty} onChange={(e) => setForm({ ...form, difficulty: e.target.value })} className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg p-3 focus:border-indigo-500 focus:outline-none">
                    {difficulties.map(d => <option key={d} value={d}>{d}</option>)}
                 </select>
              </div>
              <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Concurrence</label>
                 <select value={form.competition} onChange={(e) => setForm({ ...form, competition: e.target.value })} className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg p-3 focus:border-indigo-500 focus:outline-none">
                    {competitions.map(c => <option key={c} value={c}>{c}</option>)}
                 </select>
              </div>
              <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Croissance (%)</label>
                 <input type="number" value={form.growth} onChange={(e) => setForm({ ...form, growth: Number(e.target.value) })} className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg p-3 focus:border-indigo-500 focus:outline-none" />
              </div>
           </div>
        </div>

        {/* Section 3: Targeting */}
        <div className="p-6 border border-slate-800 rounded-xl bg-[#0f1623]">
           <h3 className="text-sm font-bold text-white uppercase tracking-wide mb-6 border-b border-slate-800 pb-2">Ciblage & Catégories</h3>
           <div className="flex flex-wrap gap-2 mb-6">
              {categoriesList.map((cat) => (
                 <button key={cat} onClick={() => toggleCategory(cat)} className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${form.categories.includes(cat) ? "bg-indigo-500/20 border-indigo-500 text-indigo-300" : "bg-slate-900 border-slate-700 text-slate-500 hover:text-slate-300"}`}>
                    {cat}
                 </button>
              ))}
           </div>
           
           <div className="grid grid-cols-2 gap-6">
              <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Réseau Principal</label>
                 <select value={form.network} onChange={(e) => setForm({ ...form, network: e.target.value })} className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg p-3 focus:border-indigo-500 focus:outline-none">
                    {networks.map(n => <option key={n} value={n}>{n}</option>)}
                 </select>
              </div>
              <div>
                 <label className="text-xs font-semibold text-slate-500 uppercase mb-2 block">Région</label>
                 <select value={form.region} onChange={(e) => setForm({ ...form, region: e.target.value })} className="w-full bg-[#1a202c] border border-slate-700 text-slate-200 text-sm rounded-lg p-3 focus:border-indigo-500 focus:outline-none">
                    {regions.map(r => <option key={r} value={r}>{r}</option>)}
                 </select>
              </div>
           </div>
        </div>

        {/* Badges & Submit */}
        <div className="flex flex-col md:flex-row items-center gap-6">
           <div className="flex gap-4 p-4 border border-slate-800 rounded-xl bg-[#0f1623] w-full md:w-auto">
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm font-medium hover:text-white">
                 <input type="checkbox" checked={form.isHot} onChange={(e) => setForm({ ...form, isHot: e.target.checked })} className="accent-red-500" /> 🔥 Hot
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm font-medium hover:text-white">
                 <input type="checkbox" checked={form.isRising} onChange={(e) => setForm({ ...form, isRising: e.target.checked })} className="accent-green-500" /> 📈 Rising
              </label>
              <label className="flex items-center gap-2 cursor-pointer text-slate-300 text-sm font-medium hover:text-white">
                 <input type="checkbox" checked={form.isProfitable} onChange={(e) => setForm({ ...form, isProfitable: e.target.checked })} className="accent-amber-500" /> 💰 Profitable
              </label>
           </div>
           
           <button onClick={send} disabled={saving} className="flex-1 w-full py-4 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white font-bold transition-all disabled:opacity-50 shadow-lg shadow-indigo-900/20">
              {saving ? <span className="flex items-center justify-center gap-2"><Loader2 className="animate-spin" size={18}/> Enregistrement...</span> : "Publier la Tendance"}
           </button>
        </div>

      </div>

      {/* Preview */}
      <TendancePreview form={form} />
    </div>
  );
}

function TendancePreview({ form }) {
  return (
    <div className="xl:col-span-1">
      <div className="sticky top-8">
         <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-4">Aperçu Carte</h3>
         
         <div className="bg-[#0f1623] border border-slate-800 rounded-xl overflow-hidden flex flex-col shadow-xl">
            {/* Header Gradient */}
            <div className={`h-2 w-full bg-gradient-to-r ${form.gradient}`} />
            
            <div className="p-6">
               <div className="flex justify-between items-start mb-4">
                  <div className="text-4xl">{form.emoji}</div>
                  <div className="text-right">
                     <span className="block text-[10px] font-bold text-slate-500 uppercase tracking-wider">Potentiel</span>
                     <span className="block text-xl font-mono font-bold text-emerald-400">{form.potential}€</span>
                  </div>
               </div>

               <h2 className="text-xl font-bold text-white mb-2">{form.title || "Titre de la tendance"}</h2>
               <p className="text-sm text-slate-400 mb-6 line-clamp-3">{form.description || "La description apparaîtra ici..."}</p>

               <div className="flex flex-wrap gap-2 mb-6">
                  {form.isHot && <span className="px-2 py-1 rounded text-[10px] font-bold bg-red-500/10 text-red-400 border border-red-500/20">HOT</span>}
                  {form.isRising && <span className="px-2 py-1 rounded text-[10px] font-bold bg-green-500/10 text-green-400 border border-green-500/20">RISING</span>}
                  {form.network && <span className="px-2 py-1 rounded text-[10px] font-bold bg-slate-800 text-slate-300 border border-slate-700">{form.network}</span>}
               </div>

               <div className="space-y-3 pt-6 border-t border-slate-800">
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">Volume</span>
                     <span className="text-slate-200 font-mono">{form.searches}/m</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">Difficulté</span>
                     <span className="text-slate-200">{form.difficulty}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                     <span className="text-slate-500">Catégorie</span>
                     <span className="text-indigo-400">{form.categories[0] || "-"}</span>
                  </div>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}