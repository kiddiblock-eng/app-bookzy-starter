"use client";

import { useState } from "react";
import useSWR from "swr";
import { 
  Users, Download, Search, Mail, Phone, 
  MessageCircle, Loader2, ChevronDown
} from "lucide-react";

const fetcher = (url) => fetch(url, { credentials: "include" }).then(r => r.ok ? r.json() : null);

export default function LeadsPage() {
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("");
  const [updating, setUpdating] = useState(null);

  const { data, isLoading, mutate } = useSWR("/api/smart-shop/leads", fetcher);
  const leads = data?.leads || [];

  // Filtre local
  const filtered = leads.filter(lead => {
    if (filter && lead.status !== filter) return false;
    if (search) {
      const s = search.toLowerCase();
      return lead.contact.toLowerCase().includes(s) || lead.productTitle?.toLowerCase().includes(s);
    }
    return true;
  });

  const updateStatus = async (id, status) => {
    setUpdating(id);
    mutate({ ...data, leads: leads.map(l => l._id === id ? { ...l, status } : l) }, false);
    await fetch(`/api/smart-shop/leads/${id}`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ status })
    });
    setUpdating(null);
  };

  const exportCSV = () => {
    const rows = [["Contact", "Produit", "Statut", "Date"]];
    filtered.forEach(l => rows.push([l.contact, l.productTitle, l.status, new Date(l.createdAt).toLocaleDateString("fr-FR")]));
    const csv = rows.map(r => r.map(c => `"${c}"`).join(",")).join("\n");
    const blob = new Blob([csv], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "leads.csv";
    link.click();
  };

  if (isLoading) {
    return <div className="min-h-screen bg-[#F8FAFC] flex items-center justify-center"><Loader2 className="w-8 h-8 animate-spin text-gray-400" /></div>;
  }

  return (
    <div className="min-h-screen bg-[#F8FAFC]">
      <div className="max-w-4xl mx-auto px-4 py-6">
        
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-xl font-bold text-gray-900">Leads</h1>
          {leads.length > 0 && (
            <button onClick={exportCSV} className="flex items-center gap-2 px-3 py-2 text-sm text-gray-600 bg-white rounded-lg border border-gray-200 hover:bg-gray-50">
              <Download className="w-4 h-4" /> Exporter en CSV
            </button>
          )}
        </div>

        {/* Stats */}
        <div className="grid grid-cols-4 gap-3 mb-6">
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <p className="text-2xl font-bold text-gray-900">{leads.length}</p>
            <p className="text-xs text-gray-500">Total</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <p className="text-2xl font-bold text-blue-600">{leads.filter(l => l.status === "new").length}</p>
            <p className="text-xs text-gray-500">Nouveaux</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <p className="text-2xl font-bold text-yellow-600">{leads.filter(l => l.status === "contacted").length}</p>
            <p className="text-xs text-gray-500">Contactés</p>
          </div>
          <div className="bg-white p-4 rounded-xl border border-gray-200 text-center">
            <p className="text-2xl font-bold text-green-600">{leads.filter(l => l.status === "converted").length}</p>
            <p className="text-xs text-gray-500">Convertis</p>
          </div>
        </div>

        {/* Filtres */}
        <div className="flex gap-2 mb-4">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Rechercher..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-lg focus:outline-none focus:border-gray-400 bg-white"
            />
          </div>
          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-200 rounded-lg bg-white focus:outline-none"
          >
            <option value="">Tous</option>
            <option value="new">Nouveau</option>
            <option value="contacted">Contacté</option>
            <option value="converted">Converti</option>
            <option value="lost">Perdu</option>
          </select>
        </div>

        {/* Liste */}
        <div className="bg-white rounded-xl border border-gray-200 divide-y divide-gray-100">
          {filtered.length === 0 ? (
            <div className="py-12 text-center">
              <Users className="w-10 h-10 text-gray-300 mx-auto mb-2" />
              <p className="text-gray-500">Aucun lead</p>
            </div>
          ) : (
            filtered.map(lead => (
              <div key={lead._id} className="p-4 flex items-center gap-4">
                
                {/* Contact */}
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-gray-900 truncate">{lead.contact}</p>
                  <p className="text-sm text-gray-500 truncate">{lead.productTitle}</p>
                </div>

                {/* Statut */}
                <select
                  value={lead.status}
                  onChange={(e) => updateStatus(lead._id, e.target.value)}
                  disabled={updating === lead._id}
                  className={`text-xs font-medium px-2 py-1 rounded border cursor-pointer ${
                    lead.status === "new" ? "bg-blue-50 text-blue-600 border-blue-200" :
                    lead.status === "contacted" ? "bg-yellow-50 text-yellow-600 border-yellow-200" :
                    lead.status === "converted" ? "bg-green-50 text-green-600 border-green-200" :
                    "bg-gray-50 text-gray-500 border-gray-200"
                  }`}
                >
                  <option value="new">Nouveau</option>
                  <option value="contacted">Contacté</option>
                  <option value="converted">Converti</option>
                  <option value="lost">Perdu</option>
                </select>

                {/* Date */}
                <span className="text-xs text-gray-400 hidden sm:block w-20 text-right">
                  {new Date(lead.createdAt).toLocaleDateString("fr-FR")}
                </span>

                {/* Action */}
                <a
                  href={lead.contactType === "email" ? `mailto:${lead.contact}` : `https://wa.me/${lead.contact.replace(/\D/g, '')}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`w-8 h-8 rounded-lg flex items-center justify-center ${
                    lead.contactType === "email" ? "bg-gray-100 text-gray-600" : "bg-green-100 text-green-600"
                  }`}
                >
                  {lead.contactType === "email" ? <Mail className="w-4 h-4" /> : <MessageCircle className="w-4 h-4" />}
                </a>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}