"use client";

import { useState, useEffect } from "react";
import { 
  Check, X, Loader2, Phone, Trash2, Plus, 
  Image as ImageIcon, FileText, Trophy, Banknote, LayoutGrid 
} from "lucide-react";
import { toast } from "react-hot-toast";

export default function AdminAffiliationPage() {
  const [activeTab, setActiveTab] = useState("payouts");

  return (
    <div className="min-h-screen bg-slate-950 text-slate-200 p-6 md:p-8">
      <div className="max-w-7xl mx-auto space-y-8">
        
        {/* HEADER */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
              <span className="bg-violet-600/20 p-2 rounded-lg border border-violet-500/30">
                <LayoutGrid className="w-6 h-6 text-violet-400" />
              </span>
              Gestion Affiliation
            </h1>
            <p className="text-slate-500 mt-1">Supervisez les paiements et les ressources marketing.</p>
          </div>
          
          {/* TABS DARK MODE */}
          <div className="flex bg-slate-900 p-1 rounded-xl border border-slate-800 shadow-xl">
            <TabBtn id="payouts" label="Retraits" icon={Banknote} active={activeTab} set={setActiveTab} />
            <TabBtn id="resources" label="Ressources" icon={ImageIcon} active={activeTab} set={setActiveTab} />
            <TabBtn id="sponsors" label="Top Parrains" icon={Trophy} active={activeTab} set={setActiveTab} />
          </div>
        </div>

        {/* CONTENU */}
        <div className="animate-in fade-in slide-in-from-bottom-2 duration-300">
          {activeTab === "payouts" && <PayoutsManager />}
          {activeTab === "resources" && <ResourcesManager />}
          {activeTab === "sponsors" && <SponsorsManager />}
        </div>

      </div>
    </div>
  );
}

// --- ONGLET 1 : GESTION DES RETRAITS (DARK) ---
function PayoutsManager() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [processingId, setProcessingId] = useState(null);

  const fetchPayouts = async () => {
    const res = await fetch("/api/admin/affiliation/payouts");
    const json = await res.json();
    if (json.success) setPayouts(json.data);
    setLoading(false);
  };

  useEffect(() => { fetchPayouts(); }, []);

  const handleAction = async (payoutId, status) => {
    if (!confirm(status === "PAID" ? "Valider le paiement ?" : "Rejeter et rembourser ?")) return;
    setProcessingId(payoutId);
    try {
      await fetch("/api/admin/affiliation/payouts", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ payoutId, status })
      });
      toast.success(status === "PAID" ? "Paiement validé" : "Rejeté");
      fetchPayouts();
    } catch (e) { toast.error("Erreur"); }
    setProcessingId(null);
  };

  if (loading) return <div className="text-center py-10 text-slate-500 animate-pulse">Chargement des données...</div>;

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-950/50 border-b border-slate-800 uppercase text-xs font-bold text-slate-500">
          <tr>
            <th className="px-6 py-4">Utilisateur</th>
            <th className="px-6 py-4">Montant</th>
            <th className="px-6 py-4">Infos Paiement</th>
            <th className="px-6 py-4">Statut</th>
            <th className="px-6 py-4 text-right">Action</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {payouts.map(p => (
            <tr key={p._id} className="hover:bg-slate-800/50 transition-colors group">
              <td className="px-6 py-4 font-medium text-slate-200">
                <div className="text-white font-bold">{p.userId?.firstName} {p.userId?.lastName}</div>
                <div className="text-xs text-slate-500 font-mono">{p.userId?.email}</div>
              </td>
              <td className="px-6 py-4">
                 <span className="text-green-400 font-mono font-bold text-lg bg-green-400/10 px-2 py-1 rounded">
                    {p.amount} F
                 </span>
              </td>
              <td className="px-6 py-4">
                <div className="flex items-center gap-2">
                  <span className="font-bold text-slate-300">{p.method}</span>
                  <span className="text-[10px] bg-slate-800 border border-slate-700 text-slate-400 px-1.5 py-0.5 rounded uppercase tracking-wide">{p.country}</span>
                </div>
                <div className="flex items-center gap-1.5 text-xs mt-1 text-slate-400 font-mono">
                  <Phone size={12} className="text-blue-500"/> {p.phoneNumber}
                </div>
              </td>
              <td className="px-6 py-4">
                 <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${
                   p.status === 'PENDING' ? 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20' : 
                   p.status === 'PAID' ? 'bg-green-500/10 text-green-500 border-green-500/20' : 
                   'bg-red-500/10 text-red-500 border-red-500/20'
                 }`}>
                   {p.status === 'PENDING' ? 'En attente' : p.status === 'PAID' ? 'Payé' : 'Rejeté'}
                 </span>
              </td>
              <td className="px-6 py-4 text-right">
                {p.status === "PENDING" ? (
                  <div className="flex justify-end gap-2 opacity-100 transition-opacity">
                    <button 
                      onClick={() => handleAction(p._id, "REJECTED")} 
                      disabled={processingId === p._id} 
                      className="p-2 text-red-400 bg-red-400/10 border border-red-400/20 rounded-lg hover:bg-red-400/20 transition-colors"
                      title="Rejeter"
                    >
                      <X size={16}/>
                    </button>
                    <button 
                      onClick={() => handleAction(p._id, "PAID")} 
                      disabled={processingId === p._id} 
                      className="p-2 text-green-400 bg-green-400/10 border border-green-400/20 rounded-lg hover:bg-green-400/20 transition-colors shadow-[0_0_10px_rgba(74,222,128,0.1)]"
                      title="Valider Paiement"
                    >
                      {processingId === p._id ? <Loader2 size={16} className="animate-spin"/> : <Check size={16}/>}
                    </button>
                  </div>
                ) : (
                  <span className="text-xs text-slate-600 font-medium italic">Clôturé</span>
                )}
              </td>
            </tr>
          ))}
          {payouts.length === 0 && (
            <tr>
              <td colSpan="5" className="p-12 text-center text-slate-500">
                <div className="flex flex-col items-center gap-3">
                  <div className="w-12 h-12 rounded-full bg-slate-800 flex items-center justify-center">
                    <Check className="text-slate-600"/>
                  </div>
                  Aucune demande de retrait en attente.
                </div>
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// --- ONGLET 2 : GESTION DES RESSOURCES (DARK) ---
function ResourcesManager() {
  const [assets, setAssets] = useState([]);
  const [form, setForm] = useState({ title: "", type: "TEXT", imageUrl: "", textContent: "", format: "" });
  const [loading, setLoading] = useState(false);

  const fetchAssets = async () => {
    const res = await fetch("/api/affiliation/resources");
    const json = await res.json();
    if (json.success) setAssets(json.data);
  };

  useEffect(() => { fetchAssets(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch("/api/admin/affiliation/resources", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form)
      });
      if (res.ok) {
        toast.success("Ressource ajoutée !");
        setForm({ title: "", type: "TEXT", imageUrl: "", textContent: "", format: "" });
        fetchAssets();
      }
    } catch (e) { toast.error("Erreur"); }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    if(!confirm("Supprimer cette ressource ?")) return;
    await fetch(`/api/admin/affiliation/resources?id=${id}`, { method: "DELETE" });
    fetchAssets();
    toast.success("Supprimé");
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      
      {/* FORMULAIRE (DARK) */}
      <div className="bg-slate-900 p-6 rounded-2xl border border-slate-800 shadow-xl h-fit sticky top-6">
        <h3 className="font-bold text-lg mb-6 text-white flex items-center gap-2">
          <Plus className="w-5 h-5 text-violet-500" /> Ajouter
        </h3>
        <form onSubmit={handleSubmit} className="space-y-5">
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Titre</label>
            <input 
              className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none transition-all" 
              value={form.title} 
              onChange={e => setForm({...form, title: e.target.value})} 
              placeholder="Ex: Story Instagram" 
              required 
            />
          </div>
          <div>
            <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Type</label>
            <div className="grid grid-cols-2 gap-2">
              <button 
                type="button"
                onClick={() => setForm({...form, type: "TEXT"})}
                className={`p-2 rounded-lg text-sm font-bold border transition-all ${form.type === "TEXT" ? "bg-violet-600 border-violet-600 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"}`}
              >
                Texte
              </button>
              <button 
                type="button"
                onClick={() => setForm({...form, type: "IMAGE"})}
                className={`p-2 rounded-lg text-sm font-bold border transition-all ${form.type === "IMAGE" ? "bg-blue-600 border-blue-600 text-white" : "bg-slate-950 border-slate-800 text-slate-400 hover:border-slate-700"}`}
              >
                Image
              </button>
            </div>
          </div>
          
          {form.type === "IMAGE" ? (
            <div className="space-y-4 animate-in fade-in">
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">URL Image (Cloudinary)</label>
                <input 
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 outline-none" 
                  value={form.imageUrl} 
                  onChange={e => setForm({...form, imageUrl: e.target.value})} 
                  placeholder="https://..." 
                  required 
                />
              </div>
              <div>
                <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Format</label>
                <input 
                  className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl text-white placeholder-slate-600 focus:border-blue-500 outline-none" 
                  value={form.format} 
                  onChange={e => setForm({...form, format: e.target.value})} 
                  placeholder="Ex: 1080x1920" 
                />
              </div>
            </div>
          ) : (
            <div className="animate-in fade-in">
              <label className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1.5 block">Contenu du texte</label>
              <textarea 
                className="w-full p-3 bg-slate-950 border border-slate-800 rounded-xl h-32 text-white placeholder-slate-600 focus:border-violet-500 focus:ring-1 focus:ring-violet-500 outline-none resize-none font-mono text-sm" 
                value={form.textContent} 
                onChange={e => setForm({...form, textContent: e.target.value})} 
                placeholder="Utilisez {{LINK}} pour insérer le lien affilié..." 
                required 
              />
              <p className="text-[10px] text-slate-500 mt-2 bg-slate-950 p-2 rounded border border-slate-800">
                <span className="text-yellow-500 font-bold">Astuce :</span> <code>{'{{LINK}}'}</code> sera remplacé automatiquement par le lien unique du parrain.
              </p>
            </div>
          )}

          <button disabled={loading} className="w-full bg-white text-slate-900 py-3 rounded-xl font-bold hover:bg-slate-200 transition-colors flex justify-center items-center gap-2 shadow-[0_0_20px_rgba(255,255,255,0.1)]">
            {loading ? <Loader2 className="animate-spin"/> : <Plus size={18} strokeWidth={3} />}
            Ajouter la ressource
          </button>
        </form>
      </div>

      {/* LISTE (DARK) */}
      <div className="lg:col-span-2 space-y-6">
        <h3 className="font-bold text-lg text-white flex items-center gap-2">
           <LayoutGrid className="w-5 h-5 text-blue-500" />
           Ressources actives <span className="text-slate-500 text-sm font-normal">({assets.length})</span>
        </h3>
        
        <div className="grid gap-4">
          {assets.map(asset => (
            <div key={asset._id} className="bg-slate-900 p-5 border border-slate-800 rounded-2xl flex justify-between items-start group hover:border-slate-700 transition-colors">
              <div className="flex gap-5 w-full">
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg ${asset.type === "IMAGE" ? "bg-blue-500/10 text-blue-500" : "bg-violet-500/10 text-violet-500"}`}>
                  {asset.type === "IMAGE" ? <ImageIcon size={24}/> : <FileText size={24}/>}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                     <h4 className="font-bold text-white text-lg truncate">{asset.title}</h4>
                     <span className="text-[10px] font-bold bg-slate-950 text-slate-400 px-2 py-0.5 rounded border border-slate-800 uppercase">{asset.type}</span>
                  </div>
                  
                  {asset.type === "TEXT" && (
                     <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-slate-400 text-sm font-mono line-clamp-2 mt-2">
                        {asset.textContent}
                     </div>
                  )}
                  {asset.type === "IMAGE" && (
                    <div className="mt-2 flex items-center gap-3">
                       <span className="text-xs text-slate-500">{asset.format || "Format inconnu"}</span>
                       <a href={asset.imageUrl} target="_blank" className="text-xs font-bold text-blue-400 hover:text-blue-300 underline">Voir l'image</a>
                    </div>
                  )}
                </div>
              </div>
              <button onClick={() => handleDelete(asset._id)} className="text-slate-600 hover:text-red-500 p-2 transition-colors ml-4 bg-slate-950 rounded-lg border border-slate-800 hover:border-red-500/30 hover:bg-red-500/10">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
          {assets.length === 0 && (
             <div className="p-8 border-2 border-dashed border-slate-800 rounded-xl text-center text-slate-500">
               Aucune ressource pour le moment.
             </div>
          )}
        </div>
      </div>
    </div>
  );
}

// --- ONGLET 3 : TOP PARRAINS (DARK) ---
function SponsorsManager() {
  const [sponsors, setSponsors] = useState([]);
  
  useEffect(() => {
    fetch("/api/admin/affiliation/sponsors").then(r => r.json()).then(d => d.success && setSponsors(d.data));
  }, []);

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden shadow-2xl">
      <table className="w-full text-sm text-left">
        <thead className="bg-slate-950/50 border-b border-slate-800 uppercase text-xs font-bold text-slate-500">
          <tr>
            <th className="px-6 py-4">Rang</th>
            <th className="px-6 py-4">Parrain</th>
            <th className="px-6 py-4">Filleuls</th>
            <th className="px-6 py-4 text-right">Gains Totaux</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-slate-800/50">
          {sponsors.map((s, i) => (
            <tr key={s._id} className="hover:bg-slate-800/30 transition-colors">
              <td className="px-6 py-4">
                 <div className={`w-8 h-8 flex items-center justify-center rounded-full font-black text-xs ${
                   i === 0 ? "bg-yellow-500 text-black" : 
                   i === 1 ? "bg-slate-300 text-black" : 
                   i === 2 ? "bg-orange-700 text-white" : "bg-slate-800 text-slate-400"
                 }`}>
                   #{i + 1}
                 </div>
              </td>
              <td className="px-6 py-4 font-medium text-slate-200">
                <div className="text-white font-bold">{s.firstName} {s.lastName}</div>
                <div className="text-xs text-slate-500 font-mono">{s.email}</div>
              </td>
              <td className="px-6 py-4 font-bold">
                 <div className="flex items-center gap-2 text-blue-400">
                    <Trophy size={14} />
                    {s.referralCount}
                 </div>
              </td>
              <td className="px-6 py-4 text-right">
                 <span className="font-mono font-bold text-violet-400 bg-violet-400/10 px-2 py-1 rounded">
                   {s.wallet?.totalEarned || 0} F
                 </span>
              </td>
            </tr>
          ))}
          {sponsors.length === 0 && (
             <tr>
               <td colSpan="4" className="p-12 text-center text-slate-500">Aucune donnée disponible.</td>
             </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

// BOUTON TAB (STYLE DARK & NEON)
function TabBtn({ id, label, icon: Icon, active, set }) {
  const isActive = active === id;
  return (
    <button 
      onClick={() => set(id)} 
      className={`
        flex items-center gap-2 px-5 py-2.5 rounded-lg text-sm font-bold transition-all relative overflow-hidden
        ${isActive 
          ? "text-white shadow-[0_0_20px_rgba(124,58,237,0.3)] bg-violet-600" 
          : "text-slate-400 hover:text-white hover:bg-slate-800"
        }
      `}
    >
      <Icon size={16} className={isActive ? "text-white" : "text-slate-500"} /> 
      {label}
    </button>
  );
}