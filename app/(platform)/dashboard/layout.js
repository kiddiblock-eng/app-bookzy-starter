"use client";

import { useState, useEffect } from "react";
import DashboardSidebar from "@/app/(platform)/components/DashboardSidebar";
import DashboardHeader from "@/app/(platform)/components/DashboardHeader";
import EmailVerificationBanner from "@/app/(platform)/components/EmailVerificationBanner";

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

// 🔥 Hook OPTIMISÉ pour récupérer le user (Inchangé)
function useCurrentUser() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let intervalId = null;

    const fetchData = async () => {
      try {
        const res = await fetch("/api/auth/me");
        const data = await res.json();

        if (data.id) {
          setUser((prevUser) => {
            if (!prevUser || prevUser.emailVerified !== data.emailVerified) {
              return data;
            }
            return prevUser;
          });

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

    fetchData();
    intervalId = setInterval(fetchData, 30_000);

    return () => {
      if (intervalId) clearInterval(intervalId);
    };
  }, []);

  return { user, loading };
}

export default function DashboardLayout({ children }) {
  const [open, setOpen] = useState(false);

  useActiveUserPing();
  const { user, loading } = useCurrentUser();

  return (
    // ✅ FIX MOBILE 1: 'w-full' et 'overflow-x-hidden' empêchent le site de dépasser la largeur de l'écran
    <div className="min-h-screen bg-neutral-50 dark:bg-neutral-950 flex w-full overflow-x-hidden">
      
      {/* ─── SIDEBAR ─── */}
      <div className="fixed left-0 top-0 h-full z-40">
        <DashboardSidebar open={open} setOpen={setOpen} />
      </div>

      {/* ─── CONTENU PRINCIPAL ─── */}
      {/* ✅ FIX MOBILE 2: 'max-w-full' force le conteneur à rester dans les clous */}
      <div className="flex-1 flex flex-col lg:ml-[256px] relative max-w-full">
        
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

        {/* BANNER VERIFICATION EMAIL */}
        <div className="pt-[56px] lg:ml-0">
          {!loading && user && <EmailVerificationBanner user={user} />}
        </div>

        {/* MAIN CONTENT */}
        {/* ✅ FIX MOBILE 3: 'overflow-x-hidden' coupe tout tableau ou image qui serait trop large */}
        <main className="bg-neutral-50 dark:bg-neutral-950 min-h-screen overflow-x-hidden">
          <div className="p-4 md:p-6 lg:p-8 w-full max-w-full">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}