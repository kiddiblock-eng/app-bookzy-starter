"use client";

import { useState, useEffect } from "react";
import {
  Megaphone,
  Send,
  Bell,
  Sparkles,
  Info,
  ShoppingCart,
  AlertCircle,
  Users,
  User,
  Clock,
  CheckCircle2,
  XCircle,
  Loader2,
  Mail,
  Calendar,
  Filter,
  Search,
  ArrowUpRight,
  BarChart3,
  Check,
  History,
  LayoutDashboard
} from "lucide-react";

export default function AdminNotificationsPage() {
  const [tab, setTab] = useState("send");

  return (
    <div className="min-h-screen bg-neutral-50 p-6 md:p-8 font-sans text-neutral-700">
      <div className="max-w-7xl mx-auto space-y-8">

        {/* HEADER */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-neutral-200 pb-6">
          <div>
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight mb-2 flex items-center gap-3">
              Centre de Notifications
            </h1>
            <p className="text-sm text-neutral-500 font-medium flex items-center gap-2">
              <Megaphone size={14} className="text-emerald-600" />
              Diffusion et communication utilisateurs
            </p>
          </div>

          {/* TABS (Style Segmented) */}
          <div className="flex p-1 bg-white border border-neutral-200 rounded-lg">
            <button
              onClick={() => setTab("send")}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
                tab === "send" ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <Send size={14} /> Envoyer
            </button>
            <button
              onClick={() => setTab("history")}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
                tab === "history" ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <History size={14} /> Historique
            </button>
            <button
              onClick={() => setTab("stats")}
              className={`px-4 py-2 text-xs font-bold rounded-md transition-all flex items-center gap-2 ${
                tab === "stats" ? "bg-neutral-900 text-white shadow-sm" : "text-neutral-500 hover:text-neutral-700"
              }`}
            >
              <BarChart3 size={14} /> Stats
            </button>
          </div>
        </div>

        {/* CONTENT AREA */}
        <div className="min-h-[600px]">
           {tab === "send" && <SendForm />}
           {tab === "history" && <NotificationsHistory />}
           {tab === "stats" && <NotificationsStats />}
        </div>
      </div>
    </div>
  );
}

/* ===========================
   FORMULAIRE D’ENVOI
   =========================== */
function SendForm() {
  // --- ETATS & LOGIQUE (STRICTEMENT CONSERVÉS) ---
  const [users, setUsers] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);
  const [sending, setSending] = useState(false);
  const [success, setSuccess] = useState(false);

  const [form, setForm] = useState({
    toAll: false,
    userId: "",
    type: "system",
    title: "",
    message: "",
    icon: "bell",
    color: "blue",
    link: "",
  });

  useEffect(() => {
    const loadUsers = async () => {
      try {
        const res = await fetch("/api/admin/users/list?limit=500", { headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET } });
        const data = await res.json();
        if (data.success) setUsers(data.users || []);
      } catch (err) { console.error("Erreur users:", err); }
      setLoadingUsers(false);
    };
    loadUsers();
  }, []);

  const iconOptions = {
    bell: { icon: <Bell className="w-4 h-4" />, label: "Cloche" },
    sparkles: { icon: <Sparkles className="w-4 h-4" />, label: "Étoiles" },
    info: { icon: <Info className="w-4 h-4" />, label: "Info" },
    alert: { icon: <AlertCircle className="w-4 h-4" />, label: "Alerte" },
    "shopping-cart": { icon: <ShoppingCart className="w-4 h-4" />, label: "Panier" },
    megaphone: { icon: <Megaphone className="w-4 h-4" />, label: "Mégaphone" },
  };

  const colorOptions = {
    blue: { bg: "bg-blue-500/10", border: "border-blue-500/30", text: "text-blue-600", dot: "bg-blue-500" },
    green: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600", dot: "bg-emerald-500" },
    purple: { bg: "bg-emerald-500/10", border: "border-emerald-500/30", text: "text-emerald-600", dot: "bg-emerald-500" },
    orange: { bg: "bg-amber-500/10", border: "border-amber-500/30", text: "text-amber-600", dot: "bg-amber-500" },
    red: { bg: "bg-red-500/10", border: "border-red-500/30", text: "text-red-600", dot: "bg-red-500" },
  };

  const sendNotification = async () => {
    if (!form.title || !form.message) { alert("Titre et message obligatoires"); return; }
    if (!form.toAll && !form.userId) { alert("Sélectionnez un utilisateur"); return; }

    setSending(true); setSuccess(false);
    try {
      const res = await fetch("/api/admin/notifications/send", {
        method: "POST",
        headers: { "Content-Type": "application/json", "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET },
        body: JSON.stringify(form),
      });
      const data = await res.json();
      if (data.success) {
        setSuccess(true); setTimeout(() => setSuccess(false), 3000);
        setForm({ ...form, title: "", message: "", link: "" });
      } else { alert("Erreur : " + data.message); }
    } catch (err) { console.error("Erreur envoi:", err); alert("Erreur lors de l'envoi"); }
    setSending(false);
  };

  const selectedColor = colorOptions[form.color];

  return (
    <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

      {/* FORMULAIRE */}
      <div className="xl:col-span-2 space-y-6">

        {/* Cible */}
        <div className="p-5 border border-neutral-200 rounded-xl bg-white">
           <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-4">Destinataire</h3>
           <div className="space-y-4">
              <label className="flex items-center gap-3 p-3 border border-neutral-200 rounded-lg hover:border-emerald-500/50 transition cursor-pointer bg-neutral-50">
                <input type="checkbox" checked={form.toAll} onChange={(e) => setForm({ ...form, toAll: e.target.checked, userId: "" })} className="w-4 h-4 accent-emerald-600 cursor-pointer rounded bg-white border-neutral-300" />
                <div>
                   <span className="block text-sm font-medium text-neutral-700">Envoyer à tous (Broadcast)</span>
                   <span className="block text-xs text-neutral-500">Touchez l'ensemble de la base utilisateurs</span>
                </div>
              </label>

              {!form.toAll && (
                <div className="relative">
                   <select
                      value={form.userId}
                      onChange={(e) => setForm({ ...form, userId: e.target.value })}
                      className="w-full bg-neutral-50 border border-neutral-200 text-neutral-700 text-sm rounded-lg p-3 focus:outline-none focus:border-emerald-500 transition appearance-none"
                   >
                      <option value="">Cibler un utilisateur spécifique...</option>
                      {loadingUsers ? <option>Chargement...</option> : users.map((u) => (
                         <option key={u._id} value={u._id}>{u.email} {u.firstName ? `(${u.firstName})` : ""}</option>
                      ))}
                   </select>
                   <div className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none text-neutral-500"><User size={14}/></div>
                </div>
              )}
           </div>
        </div>

        {/* Contenu */}
        <div className="p-5 border border-neutral-200 rounded-xl bg-white">
           <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-4">Contenu du message</h3>
           <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
              <div>
                 <label className="text-xs font-semibold text-neutral-500 uppercase mb-2 block">Type</label>
                 <select value={form.type} onChange={(e) => setForm({ ...form, type: e.target.value })} className="w-full bg-neutral-50 border border-neutral-200 text-neutral-700 text-sm rounded-lg p-3 focus:outline-none focus:border-emerald-500">
                    <option value="system">Système</option>
                    <option value="admin">Admin</option>
                    <option value="purchase">Achat</option>
                    <option value="ebook_ready">eBook prêt</option>
                 </select>
              </div>
              <div>
                 <label className="text-xs font-semibold text-neutral-500 uppercase mb-2 block">Icône</label>
                 <div className="flex gap-2">
                    {Object.entries(iconOptions).map(([key, { icon }]) => (
                       <button key={key} onClick={() => setForm({ ...form, icon: key })} className={`p-2.5 rounded-lg border transition-all ${form.icon === key ? "bg-emerald-500/20 border-emerald-500 text-emerald-600" : "bg-neutral-50 border-neutral-200 text-neutral-500 hover:border-neutral-400"}`}>
                          {icon}
                       </button>
                    ))}
                 </div>
              </div>
           </div>

           <div className="space-y-4">
              <div>
                 <label className="text-xs font-semibold text-neutral-500 uppercase mb-2 block">Titre</label>
                 <input type="text" value={form.title} onChange={(e) => setForm({ ...form, title: e.target.value })} placeholder="Ex: Maintenance prévue" className="w-full bg-neutral-50 border border-neutral-200 text-neutral-700 text-sm rounded-lg p-3 focus:outline-none focus:border-emerald-500 placeholder:text-neutral-400" />
              </div>
              <div>
                 <label className="text-xs font-semibold text-neutral-500 uppercase mb-2 block">Message</label>
                 <textarea value={form.message} onChange={(e) => setForm({ ...form, message: e.target.value })} rows={4} placeholder="Votre message..." className="w-full bg-neutral-50 border border-neutral-200 text-neutral-700 text-sm rounded-lg p-3 focus:outline-none focus:border-emerald-500 placeholder:text-neutral-400 resize-none" />
              </div>
              <div>
                 <label className="text-xs font-semibold text-neutral-500 uppercase mb-2 block">Lien (Action)</label>
                 <div className="relative">
                    <input type="text" value={form.link} onChange={(e) => setForm({ ...form, link: e.target.value })} placeholder="/dashboard/..." className="w-full bg-neutral-50 border border-neutral-200 text-neutral-700 text-sm rounded-lg p-3 pl-10 focus:outline-none focus:border-emerald-500 placeholder:text-neutral-400" />
                    <ArrowUpRight className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
                 </div>
              </div>
           </div>
        </div>

        {/* Style */}
        <div className="p-5 border border-neutral-200 rounded-xl bg-white">
           <h3 className="text-sm font-bold text-neutral-900 uppercase tracking-wide mb-4">Style & Urgence</h3>
           <div className="flex gap-3">
              {Object.entries(colorOptions).map(([key, { dot }]) => (
                 <button key={key} onClick={() => setForm({ ...form, color: key })} className={`w-10 h-10 rounded-full border-2 flex items-center justify-center transition-all ${form.color === key ? "border-neutral-900 bg-neutral-100" : "border-transparent hover:bg-neutral-100"}`}>
                    <div className={`w-4 h-4 rounded-full ${dot}`} />
                 </button>
              ))}
           </div>
        </div>

        {/* Submit */}
        <div className="flex justify-end">
           <button onClick={sendNotification} disabled={sending} className="px-8 py-3 bg-neutral-900 hover:bg-neutral-800 text-white text-sm font-bold rounded-xl transition-all disabled:opacity-50 flex items-center gap-2">
              {sending ? <Loader2 className="w-4 h-4 animate-spin" /> : success ? <CheckCircle2 className="w-4 h-4" /> : <Send className="w-4 h-4" />}
              {sending ? "Envoi..." : success ? "Envoyé !" : "Diffuser la notification"}
           </button>
        </div>

      </div>

      {/* PREVIEW */}
      <div className="xl:col-span-1">
         <div className="sticky top-8 space-y-4">
            <h3 className="text-xs font-bold text-neutral-500 uppercase tracking-wider">Aperçu en direct</h3>

            {/* Notification Card Preview */}
            <div className={`border ${selectedColor.border} ${selectedColor.bg} rounded-xl p-4 flex gap-4 transition-all`}>
               <div className={`p-2 rounded-lg bg-white border border-neutral-200 ${selectedColor.text}`}>
                  {iconOptions[form.icon]?.icon}
               </div>
               <div className="flex-1 min-w-0">
                  <div className="flex justify-between items-start">
                     <h4 className="text-sm font-bold text-neutral-900 mb-1">{form.title || "Titre de la notification"}</h4>
                     <span className="text-[10px] text-neutral-500">Maintenant</span>
                  </div>
                  <p className="text-xs text-neutral-500 leading-relaxed mb-2">{form.message || "Le contenu de votre message s'affichera ici..."}</p>
                  {form.link && (
                     <span className="text-[10px] font-mono text-emerald-600 flex items-center gap-1 bg-emerald-500/10 px-2 py-1 rounded w-fit">
                        LINK: {form.link} <ArrowUpRight size={10}/>
                     </span>
                  )}
               </div>
            </div>

            <div className="p-4 border border-neutral-200 rounded-xl bg-white text-xs text-neutral-500 space-y-2 font-mono">
               <div className="flex justify-between"><span>TARGET:</span> <span className="text-neutral-700">{form.toAll ? "ALL_USERS" : form.userId || "UNDEFINED"}</span></div>
               <div className="flex justify-between"><span>TYPE:</span> <span className="text-neutral-700 uppercase">{form.type}</span></div>
               <div className="flex justify-between"><span>STATUS:</span> <span className={sending ? "text-amber-600" : "text-emerald-600"}>{sending ? "SENDING..." : "READY"}</span></div>
            </div>
         </div>
      </div>
    </div>
  );
}

/* ===========================
   HISTORIQUE (Design Clean List)
   =========================== */
function NotificationsHistory() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    const loadHistory = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/notifications/history", { headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET } });
        const data = await res.json();
        if (data.success) setHistory(data.history);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    loadHistory();
  }, []);

  const filteredHistory = history.filter(item =>
    item._id.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item._id.message.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <div className="relative">
         <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-neutral-500 w-4 h-4" />
         <input type="text" value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} placeholder="Rechercher dans les logs..." className="w-full bg-white border border-neutral-200 text-neutral-700 text-sm rounded-lg pl-10 pr-4 py-2.5 focus:outline-none focus:border-emerald-500 placeholder:text-neutral-400" />
      </div>

      <div className="border border-neutral-200 rounded-xl overflow-hidden bg-white">
         {loading ? (
            <div className="p-12 text-center text-neutral-500"><Loader2 className="w-8 h-8 animate-spin mx-auto mb-2" />Chargement...</div>
         ) : filteredHistory.length === 0 ? (
            <div className="p-12 text-center text-neutral-500">Aucun historique trouvé.</div>
         ) : (
            <div className="divide-y divide-neutral-200">
               {filteredHistory.map((item, idx) => {
                  const notif = item._id;
                  return (
                     <div key={idx} className="p-4 hover:bg-neutral-50 transition-colors flex flex-col md:flex-row gap-4 items-start md:items-center">
                        <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-3 mb-1">
                              <span className="text-sm font-bold text-neutral-900">{notif.title}</span>
                              <span className="text-[10px] uppercase font-bold text-neutral-500 border border-neutral-200 px-1.5 rounded">{notif.type}</span>
                           </div>
                           <p className="text-xs text-neutral-500 truncate">{notif.message}</p>
                        </div>

                        <div className="flex items-center gap-6 text-xs text-neutral-500">
                           <div className="flex items-center gap-1.5">
                              <Users size={14} className="text-emerald-600" />
                              <span>{item.totalUsers} cible{item.totalUsers > 1 ? 's' : ''}</span>
                           </div>
                           <div className="flex items-center gap-1.5 font-mono">
                              <Clock size={14} />
                              <span>{new Date(notif.createdAt).toLocaleDateString()}</span>
                           </div>
                           <div className="flex items-center gap-1.5 text-emerald-600">
                              <Check size={14} /> Sent
                           </div>
                        </div>
                     </div>
                  );
               })}
            </div>
         )}
      </div>
    </div>
  );
}

/* ===========================
   STATISTIQUES (Design No-Block)
   =========================== */
function NotificationsStats() {
  const [stats, setStats] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadStats = async () => {
      setLoading(true);
      try {
        const res = await fetch("/api/admin/notifications/stats", { headers: { "x-admin-secret": process.env.NEXT_PUBLIC_ADMIN_SECRET } });
        const data = await res.json();
        if (data.success) setStats(data.stats);
      } catch (e) { console.error(e); }
      setLoading(false);
    };
    loadStats();
  }, []);

  if (loading) return <div className="p-12 text-center text-neutral-500"><Loader2 className="w-8 h-8 animate-spin mx-auto" /></div>;
  if (stats.length === 0) return <div className="p-12 text-center text-neutral-500">Aucune donnée statistique.</div>;

  return (
    <div className="grid grid-cols-1 gap-8">
      {stats.map((item, idx) => (
        <div key={idx} className="border-l-2 border-neutral-200 pl-6 py-2 hover:border-emerald-500 transition-colors">
           <div className="flex justify-between items-start mb-2">
              <h3 className="text-lg font-bold text-neutral-900">{item.title}</h3>
              <span className="text-[10px] font-mono text-neutral-500">{new Date(item.createdAt).toLocaleDateString()}</span>
           </div>
           <p className="text-sm text-neutral-500 mb-4 max-w-2xl">{item.message}</p>

           <div className="flex items-center gap-8">
              <div>
                 <p className="text-[10px] uppercase text-neutral-500 font-bold">Portée</p>
                 <p className="text-xl font-mono text-neutral-900">{item.totalRecipients}</p>
              </div>
              <div>
                 <p className="text-[10px] uppercase text-neutral-500 font-bold">Vus</p>
                 <p className="text-xl font-mono text-emerald-600">{item.totalReads}</p>
              </div>
              <div>
                 <p className="text-[10px] uppercase text-neutral-500 font-bold">Taux d'ouverture</p>
                 <div className="flex items-center gap-2">
                    <div className="w-24 h-1.5 bg-neutral-200 rounded-full overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: `${item.totalRecipients > 0 ? (item.totalReads / item.totalRecipients) * 100 : 0}%` }}></div>
                    </div>
                    <span className="text-sm font-bold text-emerald-600">{item.totalRecipients > 0 ? ((item.totalReads / item.totalRecipients) * 100).toFixed(0) : 0}%</span>
                 </div>
              </div>
           </div>
        </div>
      ))}
    </div>
  );
}
