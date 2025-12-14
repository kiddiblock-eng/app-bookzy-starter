"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "../../../components/DashboardSidebar";
import DashboardHeader from "../../../components/DashboardHeader";
import EmailVerificationBanner from "../../../components/EmailVerificationBanner";

// ✅ Hook de tracking des utilisateurs actifs (Inchangé)
function useActiveUserPing() {
  useEffect(() => {
    const sendPing = () => {
      fetch("/api/activity/track", {
        method: "POST",
      }).catch(() => {});
    };

    sendPing();
    const interval = setInterval(sendPing, 30_000);

    return () => clearInterval(interval);
  }, []);
}

// 🔥 Hook OPTIMISÉ pour récupérer le user
function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId = null;

    // Fonction de récupération des données
    const fetchData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.id) {
          setUser((prevUser) => {
            // Mise à jour seulement si nécessaire
            if (!prevUser || prevUser.emailVerified !== data.emailVerified) {
              return data;
            }
            return prevUser;
          });

          // 🛑 OPTIMISATION : Si l'email est vérifié, on arrête le polling
          if (data.emailVerified && intervalId) {
            clearInterval(intervalId);
            intervalId = null;
          }
        }
      } catch (err) {
        console.error("Erreur fetch user:", err);
      } finally {
        setLoading(false);
      }
    };

    // 1. Appel immédiat
    fetchData();

    // 2. Polling toutes les 30s
    intervalId = setInterval(fetchData, 30_000);

    // Nettoyage
    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []); // Tableau vide pour ne lancer qu'au montage

  return { user, loading };
}

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  useActiveUserPing();
  const { user, loading } = useCurrentUser();

  return (
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex">
      {/* ─── SIDEBAR ─── */}
      <div className="fixed left-0 top-0 h-full z-40">
        <DashboardSidebar open={open} setOpen={setOpen} />
      </div>

      {/* ─── CONTENU PRINCIPAL ─── */}
      <div className="flex-1 flex flex-col lg:ml-[256px] relative">
        {/* HEADER */}
        <div
          className="fixed top-0 left-0 lg:left-[256px] right-0 z-30
          bg-white/80 dark:bg-neutral-950/80 
          border-b border-neutral-200 dark:border-neutral-800 
          backdrop-blur-xl shadow-sm"
          style={{ height: "56px" }}
        >
          <DashboardHeader onMenuClick={() => setOpen(true)} />
        </div>

        {/* 🔥 BANNER VERIFICATION EMAIL */}
        {/* S'affiche uniquement si le user est chargé et existe */}
        <div className="pt-[56px] lg:ml-0">
          {!loading && user && <EmailVerificationBanner user={user} />}
        </div>

        {/* MAIN CONTENT */}
        <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen overflow-y-auto">
          <div className="p-4 md:p-6 lg:p-8">{children}</div>
        </main>
      </div>
    </div>
  );
}