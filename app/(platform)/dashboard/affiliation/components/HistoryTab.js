import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function HistoryTab() {
  const [payouts, setPayouts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch("/api/affiliation/payout")
      .then(res => res.json())
      .then(json => {
        if(json.success) setPayouts(json.data);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="flex justify-center py-8"><Loader2 className="w-6 h-6 animate-spin text-slate-400"/></div>;

  return (
    <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
      {payouts.length === 0 ? (
        <div className="p-12 text-center text-slate-400">Aucun historique de retrait.</div>
      ) : (
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-5 py-3 font-semibold text-slate-500">Date</th>
                <th className="px-5 py-3 font-semibold text-slate-500">Méthode</th>
                <th className="px-5 py-3 font-semibold text-slate-500 text-right">Montant</th>
                <th className="px-5 py-3 font-semibold text-slate-500 text-center">Statut</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100 bg-white">
              {payouts.map((p) => (
                <tr key={p._id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-5 py-4 text-slate-500">{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td className="px-5 py-4">
                    <div className="font-medium text-slate-900">{p.method}</div>
                    <div className="text-xs text-slate-400">{p.phoneNumber} • {p.country}</div>
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-slate-900">{p.amount} FCFA</td>
                  <td className="px-5 py-4 text-center">
                    <StatusBadge status={p.status} />
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}

function StatusBadge({ status }) {
  const styles = {
    PENDING: "bg-amber-50 text-amber-700 border-amber-100",
    PAID: "bg-green-50 text-green-700 border-green-100",
    REJECTED: "bg-red-50 text-red-700 border-red-100"
  };
  const labels = { PENDING: "En attente", PAID: "Payé", REJECTED: "Rejeté" };
  
  return (
    <span className={`px-2.5 py-1 rounded-full text-xs font-bold border ${styles[status]}`}>
      {labels[status]}
    </span>
  );
}