"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import useSWR from "swr";
import {
  Search,
  ChevronDown,
  LogOut,
  UserCircle2,
  Settings,
  Menu,
} from "lucide-react";
import NotificationBell from "./NotificationBell"; // ✅ IMPORT

const fetcher = (url) =>
  fetch(url, { credentials: "include" })
    .then((r) => (r.ok ? r.json() : null))
    .then((d) => d?.user || null);

export default function DashboardHeader({ onMenuClick }) {
  const router = useRouter();
  const [showMenu, setShowMenu] = useState(false);
  const [visible, setVisible] = useState(false);

  const { data: user } = useSWR("/api/profile/get", fetcher, {
    revalidateOnFocus: true,
  });

  const displayName =
    user?.displayName ||
    (user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "Invité");

  const handleLogout = async () => {
    await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
    router.push("/auth/login");
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
          {/* LEFT SECTION - Menu burger tout à gauche */}
          <div className="flex items-center gap-3 flex-1">
            {/* ✅ BOUTON MENU MOBILE - Tout à gauche */}
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2.5 -ml-1 rounded-xl hover:bg-neutral-100 active:scale-95 transition-all"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-neutral-700" />
            </button>

            {/* 🔍 Barre de recherche - Desktop seulement */}
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

          {/* RIGHT SECTION - Notifications + Avatar */}
          <div className="flex items-center gap-2">
            {/* ✅ COMPOSANT NOTIFICATION BELL */}
            <NotificationBell />

            {/* Avatar + Menu */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-neutral-100 transition-all"
              >
                {/* Avatar */}
                {user?.photo ? (
                  <img
                    src={user.photo}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {displayName?.charAt(0)?.toUpperCase() || "?"}
                  </div>
                )}

                {/* Nom - Desktop seulement */}
                <div className="hidden md:flex flex-col items-start leading-tight">
                  <span className="text-sm font-medium text-neutral-900 max-w-[140px] truncate">
                    {displayName}
                  </span>
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                    En ligne
                  </span>
                </div>

                {/* Chevron - Tablette+ */}
                <ChevronDown
                  className={`hidden sm:block w-4 h-4 text-neutral-400 transition-transform ${
                    showMenu ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* Menu déroulant */}
              {showMenu && (
                <>
                  {/* Backdrop */}
                  <div
                    className="fixed inset-0 z-10"
                    onClick={() => setShowMenu(false)}
                  />
                  
                  {/* Dropdown */}
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slideDown">
                    {/* Info user - Mobile */}
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

                    {/* Menu items */}
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

                    {/* Logout */}
                    <div className="p-2 border-t border-neutral-200">
                      <button
                        onClick={async () => {
                          await handleLogout();
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
        @keyframes slideDown {
          from {
            opacity: 0;
            transform: translateY(-10px);
          }
          to {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-slideDown {
          animation: slideDown 0.2s ease-out;
        }
      `}</style>
    </header>
  );
}