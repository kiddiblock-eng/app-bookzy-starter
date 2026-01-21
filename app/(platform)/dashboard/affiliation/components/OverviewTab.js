"use client";

import { Users, TrendingUp, DollarSign } from "lucide-react";
import { 
  AreaChart, Area, BarChart, Bar, XAxis, YAxis, 
  CartesianGrid, Tooltip, ResponsiveContainer 
} from 'recharts';

// On reçoit maintenant une prop "charts" en plus
export default function OverviewTab({ stats, wallet, history, charts, loading }) {
  
  if (loading) {
    return (
      <div className="space-y-8 animate-pulse">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
          <div className="h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
          <div className="h-32 bg-slate-100 rounded-xl border border-slate-200"></div>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          <div className="h-[300px] bg-slate-100 rounded-xl border border-slate-200"></div>
          <div className="h-[300px] bg-slate-100 rounded-xl border border-slate-200"></div>
        </div>
        <div className="h-64 bg-slate-100 rounded-xl border border-slate-200"></div>
      </div>
    );
  }

  // ✅ Utilisation des vraies données ou d'un tableau vide par sécurité
  const earningsData = charts?.earnings || [];
  const referralsData = charts?.referrals || [];

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      
      {/* KPIs */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <KpiCard 
          title="Filleuls Total"
          value={stats?.totalReferrals || 0}
          icon={Users}
        />
        <KpiCard 
          title="Gains Totaux"
          value={(wallet?.totalEarned || 0).toLocaleString() + " FCFA"}
          icon={TrendingUp}
        />
        <KpiCard 
          title="Commission actuelle"
          value="600 FCFA"
          sub="par vente confirmée"
          icon={DollarSign}
        />
      </div>

      {/* GRAPHIQUES RÉELS */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">Performance (7 jours)</h3>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          
          {/* GRAPHIQUE 1 : GAINS */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 h-[300px] shadow-sm">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Gains journaliers</h4>
             <ResponsiveContainer width="100%" height="85%">
               <AreaChart data={earningsData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                 <defs>
                   <linearGradient id="colorGains" x1="0" y1="0" x2="0" y2="1">
                     <stop offset="5%" stopColor="#8b5cf6" stopOpacity={0.3}/>
                     <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0}/>
                   </linearGradient>
                 </defs>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                 <Tooltip content={<CustomTooltip currency="FCFA" />} cursor={{ stroke: '#ddd', strokeWidth: 1 }} />
                 <Area type="monotone" dataKey="montant" stroke="#8b5cf6" strokeWidth={2} fillOpacity={1} fill="url(#colorGains)" />
               </AreaChart>
             </ResponsiveContainer>
          </div>

          {/* GRAPHIQUE 2 : INSCRITS */}
          <div className="bg-white border border-slate-200 rounded-xl p-5 h-[300px] shadow-sm">
             <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Nouveaux inscrits</h4>
             <ResponsiveContainer width="100%" height="85%">
               <BarChart data={referralsData} margin={{ top: 5, right: 0, left: -20, bottom: 0 }}>
                 <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#f1f5f9" />
                 <XAxis dataKey="date" axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} />
                 <YAxis axisLine={false} tickLine={false} tick={{fontSize: 12, fill: '#94a3b8'}} allowDecimals={false} />
                 <Tooltip content={<CustomTooltip />} cursor={{fill: '#f1f5f9'}} />
                 <Bar dataKey="inscrits" fill="#3b82f6" radius={[4, 4, 0, 0]} barSize={30} />
               </BarChart>
             </ResponsiveContainer>
          </div>

        </div>
      </div>

      {/* TABLEAU */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4 flex items-center gap-2">
          Activité récente
        </h3>
        <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
          {history?.length > 0 ? (
            <table className="w-full text-sm text-left">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="px-5 py-3 font-semibold text-slate-500 w-32">Date</th>
                  <th className="px-5 py-3 font-semibold text-slate-500">Filleul</th>
                  <th className="px-5 py-3 font-semibold text-slate-500 text-right">Gain</th>
                  <th className="px-5 py-3 font-semibold text-slate-500 text-center w-32">État</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 bg-white">
                {history.map((comm) => (
                  <tr key={comm._id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="px-5 py-4 text-slate-500 whitespace-nowrap">
                      {new Date(comm.createdAt).toLocaleDateString('fr-FR', {day: '2-digit', month: '2-digit'})}
                    </td>
                    <td className="px-5 py-4 font-medium text-slate-900">
                      {comm.referredUserId?.firstName || "Utilisateur"}
                    </td>
                    <td className="px-5 py-4 text-right font-mono font-bold text-slate-900 text-base">
                      +{comm.amount}
                    </td>
                    <td className="px-5 py-4 text-center">
                      <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-50 text-green-700 border border-green-100">
                        Validé
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="p-12 text-center">
              <p className="text-slate-400">Aucune commission pour le moment.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

// SOUS-COMPOSANTS
const CustomTooltip = ({ active, payload, label, currency = "" }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white border border-slate-200 p-3 rounded-lg shadow-xl shadow-slate-200/50 outline-none">
        <p className="text-xs text-slate-500 mb-1">{label}</p>
        <p className="text-sm font-bold text-slate-900">
          {payload[0].value.toLocaleString()} {currency}
        </p>
      </div>
    );
  }
  return null;
};

function KpiCard({ title, value, sub, icon: Icon }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl p-5 flex flex-col justify-between hover:border-violet-200 transition-all group h-full shadow-sm hover:shadow-md">
      <div className="flex justify-between items-start mb-4">
        <span className="text-slate-500 font-medium text-sm tracking-tight">{title}</span>
        <div className="p-2 bg-slate-50 rounded-lg group-hover:bg-violet-50 transition-colors">
          <Icon className="w-4.5 h-4.5 text-slate-400 group-hover:text-violet-600" />
        </div>
      </div>
      <div>
        <div className="text-2xl font-black text-slate-900 tracking-tight">{value}</div>
        {sub && <div className="text-xs font-medium text-slate-400 mt-1">{sub}</div>}
      </div>
    </div>
  );
}