"use client";

import { useState, useEffect } from "react";
import AffiliateHeader from "./components/AffiliateHeader";
import AffiliateNav from "./components/AffiliateNav";
import OverviewTab from "./components/OverviewTab";
import ResourcesTab from "./components/ResourcesTab";
import WithdrawTab from "./components/WithdrawTab";
import HistoryTab from "./components/HistoryTab";

export default function AffiliationPage() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [data, setData] = useState(null);

  const fetchStats = async () => {
    // On ne remet pas setLoading(true) si on a déjà des données (pour éviter le flash)
    if (!data) setLoading(true); 
    
    try {
      const res = await fetch("/api/affiliation/stats");
      const json = await res.json();
      if (json.success) {
        setData(json.data);
      }
    } catch (error) {
      console.error("Erreur API Affiliation:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  return (
    <div className="pb-20 min-h-screen h-auto bg-slate-50/30">
      
      {/* Header avec solde et lien */}
      <AffiliateHeader 
        wallet={data?.wallet} 
        referralLink={data?.referralLink} 
        loading={loading} 
      />

      {/* Navigation des onglets */}
      <AffiliateNav 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
      />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8 animate-in fade-in slide-in-from-bottom-2 duration-300">
        
        {/* ONGLET VUE D'ENSEMBLE (Graphiques) */}
        {activeTab === "overview" && (
          <OverviewTab 
            stats={data?.stats} 
            wallet={data?.wallet} 
            history={data?.history}
            charts={data?.charts} // ✅ AJOUTÉ : C'est cette ligne qui débloque les graphiques !
            loading={loading} 
          />
        )}

        {/* ONGLET RESSOURCES */}
        {activeTab === "resources" && (
          <ResourcesTab 
            referralLink={data?.referralLink}
            loading={loading}
          />
        )}

        {/* ONGLET RETRAIT */}
        {activeTab === "withdraw" && (
          <WithdrawTab 
            balance={data?.wallet?.balance} 
            onSuccess={fetchStats} // Pour rafraîchir le solde après un retrait
            loading={loading}
          />
        )}

        {/* ONGLET HISTORIQUE COMPLET */}
        {activeTab === "history" && (
          <HistoryTab 
            history={data?.history} // Optionnel : passer l'historique ici aussi
            loading={loading}
          />
        )}

      </div>
    </div>
  );
}