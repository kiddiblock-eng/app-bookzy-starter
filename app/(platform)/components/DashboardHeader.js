"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr"; 
import {
  Search,
  ChevronDown,
  LogOut,
  UserCircle2,
  Settings,
  Menu,
} from "lucide-react";
import NotificationBell from "./NotificationBell";

// ✅ Fetcher Standardisé (Exactement comme le Dashboard)
// On retourne tout le JSON, pas juste user, pour partager le même cache.
const fetcher = (url) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

export default function DashboardHeader({ onMenuClick }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [showMenu, setShowMenu] = useState(false);
  const [visible, setVisible] = useState(false);

  // ✅ Utilisation du cache partagé
  // SWR va voir que "/api/profile/get" est déjà chargé par le Dashboard -> Affichage Immédiat
  const { data: userData } = useSWR("/api/profile/get", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000, // Ne pas refaire de requête si fait il y a moins de 5s
  });

  // Extraction sécurisée (compatible si l'API renvoie {user: ...} ou juste {...})
  const user = userData?.user || userData;

  const displayName =
    user?.displayName ||
    (user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "Invité");

  // ✅ LOGOUT "NUCLÉAIRE" (Nettoie tout)
  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
      
      // On vide le cache SWR
      await mutate(() => true, undefined, { revalidate: false });
      
      // On force le rechargement complet
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Erreur logout", error);
      window.location.href = "/auth/login";
    }
  };

  useEffect(() => {
    const timer = setTimeout(() => setVisible(true), 80);
    return () => clearTimeout(timer);
  }, []);

  return (
    <header
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
        visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"
      }`}
    >
      <div className="w-full bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-sm">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between">
          {/* LEFT SECTION */}
          <div className="flex items-center gap-3 flex-1">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2.5 -ml-1 rounded-xl hover:bg-neutral-100 active:scale-95 transition-all"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-neutral-700" />
            </button>

            <div className="hidden md:block relative w-[260px] lg:w-[380px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400" />
              <input
                type="text"
                placeholder="Rechercher un projet..."
                className="w-full pl-12 pr-4 py-2 rounded-2xl bg-neutral-100 dark:bg-neutral-900/70 
                text-sm font-medium placeholder:text-neutral-400 dark:placeholder:text-neutral-500 
                focus:outline-none focus:ring-2 focus:ring-blue-500/20 transition-all duration-200"
              />
            </div>
          </div>

          {/* RIGHT SECTION */}
          <div className="flex items-center gap-2">
            <NotificationBell />

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-neutral-100 transition-all"
              >
                {/* AVATAR : On affiche un squelette gris si pas encore chargé pour éviter le "?" moche */}
                {!user ? (
                   <div className="w-9 h-9 rounded-full bg-neutral-200 animate-pulse"></div>
                ) : user.photo ? (
                  <img
                    src={user.photo}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {displayName?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div className="hidden md:flex flex-col items-start leading-tight">
                  {!user ? (
                      <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse mb-1"></div>
                  ) : (
                      <span className="text-sm font-medium text-neutral-900 max-w-[140px] truncate">
                        {displayName}
                      </span>
                  )}
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                    En ligne
                  </span>
                </div>

                <ChevronDown
                  className={`hidden sm:block w-4 h-4 text-neutral-400 transition-transform ${
                    showMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {showMenu && (
                <>
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slideDown">
                    <div className="p-4 bg-gradient-to-br from-blue-50 to-purple-50 border-b border-neutral-200">
                      <div className="flex items-center gap-3">
                        {user?.photo ? (
                          <img
                            src={user.photo}
                            alt={displayName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {displayName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-neutral-900 truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-neutral-600 truncate">
                            {user?.email || ""}
                          </p>
                        </div>
                      </div>
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => {
                          router.push("/dashboard/parametres?tab=profil");
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <UserCircle2 className="w-4 h-4" /> Mon profil
                      </button>
                      <button
                        onClick={() => {
                          router.push("/dashboard/parametres");
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-blue-50 hover:text-blue-600 transition-all"
                      >
                        <Settings className="w-4 h-4" /> Paramètres
                      </button>
                    </div>

                    <div className="p-2 border-t border-neutral-200">
                      <button
                        onClick={() => {
                           handleLogout(); 
                           setShowMenu(false);
                        }}
                        className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                      >
                        <LogOut className="w-4 h-4" /> Déconnexion
                      </button>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
      <style jsx global>{`
        @keyframes slideDown { from { opacity: 0; transform: translateY(-10px); } to { opacity: 1; transform: translateY(0); } }
        .animate-slideDown { animation: slideDown 0.2s ease-out; }
      `}</style>
    </header>
  );
}