"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr"; 
import {
  Search,
  ChevronDown,
  LogOut,
  UserCircle2,
  Settings,
  Menu,
  FileText,
  Sparkles,
  X,
  Moon,
  Sun,
} from "lucide-react";
import NotificationBell from "./NotificationBell";
import { useTheme } from "./ThemeProvider";

const fetcher = (url) =>
  fetch(url, { credentials: "include" }).then((r) => r.json());

export default function DashboardHeader({ onMenuClick }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const { theme, toggleTheme } = useTheme();
  const [showMenu, setShowMenu] = useState(false);
  const [visible, setVisible] = useState(false);
  
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  const { data: ebooksData } = useSWR("/api/ebooks/user", fetcher);
  const ebooks = ebooksData?.ebooks || [];

  const searchResults = searchQuery.trim().length > 0
    ? ebooks.filter((ebook) =>
        ebook.fileUrl &&
        (ebook.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         ebook.niche?.toLowerCase().includes(searchQuery.toLowerCase()))
      )
    : [];

  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSearchResults(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const { data: userData } = useSWR("/api/profile/get", fetcher, {
    revalidateOnFocus: true,
    dedupingInterval: 5000,
  });

  const user = userData?.user || userData;

  const displayName =
    user?.displayName ||
    (user ? `${user.firstName ?? ""} ${user.lastName ?? ""}`.trim() : "Invité");

  const handleLogout = async () => {
    try {
      await fetch("/api/auth/logout", { 
        method: "POST", 
        credentials: "include" 
      });
      
      // ✅ Vider tout le cache
      await mutate(() => true, undefined, { revalidate: false });
      sessionStorage.clear();
      localStorage.clear();
      
      window.location.href = "/auth/login";
    } catch (error) {
      console.error("Erreur logout", error);
      sessionStorage.clear();
      localStorage.clear();
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
      <div className="w-full bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl border-b border-neutral-200 dark:border-slate-800 shadow-sm">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between">
          
          {/* LEFT - MENU BURGER */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2.5 -ml-1 rounded-xl hover:bg-neutral-100 dark:hover:bg-slate-800 active:scale-95 transition-all"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-neutral-700 dark:text-slate-300" />
            </button>
          </div>

          {/* CENTER - BARRE DE RECHERCHE */}
          <div className="flex-1 flex justify-center px-4">
            <div ref={searchRef} className="hidden md:block relative w-full max-w-[480px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 dark:text-slate-500 pointer-events-none" />
              
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setShowSearchResults(true);
                }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Rechercher un projet..."
                className="w-full pl-12 pr-10 py-2 rounded-2xl bg-neutral-100 dark:bg-slate-800 
                text-sm font-medium text-neutral-900 dark:text-white placeholder:text-neutral-400 dark:placeholder:text-slate-500 
                focus:outline-none focus:ring-2 focus:ring-slate-500/20 dark:focus:ring-slate-400/20 transition-all duration-200"
              />

              {searchQuery && (
                <button
                  onClick={() => {
                    setSearchQuery("");
                    setShowSearchResults(false);
                  }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600 dark:text-slate-500 dark:hover:text-slate-300"
                >
                  <X className="w-4 h-4" />
                </button>
              )}

              {/* DROPDOWN RÉSULTATS */}
              {showSearchResults && searchQuery.trim().length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs font-bold text-neutral-400 dark:text-slate-500 uppercase tracking-wide">
                        {searchResults.length} résultat{searchResults.length > 1 ? 's' : ''}
                      </p>
                      {searchResults.map((ebook) => (
                        <button
                          key={ebook._id}
                          onClick={() => {
                            router.push(`/dashboard/fichiers/${ebook._id}`);
                            setSearchQuery("");
                            setShowSearchResults(false);
                          }}
                          className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-700 transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-900 dark:bg-slate-700 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 dark:text-white truncate">
                              {ebook.title}
                            </p>
                            <p className="text-xs text-neutral-500 dark:text-slate-400 truncate">
                              {ebook.niche || 'Sans catégorie'} • {new Date(ebook.createdAt).toLocaleDateString('fr-FR')}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <Sparkles className="w-12 h-12 text-neutral-300 dark:text-slate-600 mx-auto mb-3" />
                      <p className="text-sm font-medium text-neutral-600 dark:text-slate-300">Aucun projet trouvé</p>
                      <p className="text-xs text-neutral-400 dark:text-slate-500 mt-1">
                        Essayez un autre terme de recherche
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT - THEME TOGGLE + NOTIFICATIONS + PROFIL */}
          <div className="flex items-center gap-2 flex-shrink-0">
            
            {/* THEME TOGGLE */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl bg-neutral-100 dark:bg-slate-800 hover:bg-neutral-200 dark:hover:bg-slate-700 transition-colors"
              aria-label="Toggle theme"
            >
              {theme === "light" ? (
                <Moon className="w-5 h-5 text-neutral-600 dark:text-slate-300" />
              ) : (
                <Sun className="w-5 h-5 text-neutral-600 dark:text-slate-300" />
              )}
            </button>

            <NotificationBell />

            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-neutral-100 dark:hover:bg-slate-800 transition-all"
              >
                {!user ? (
                   <div className="w-9 h-9 rounded-full bg-neutral-200 dark:bg-slate-700 animate-pulse"></div>
                ) : user.photo ? (
                  <img
                    src={user.photo}
                    alt={displayName}
                    className="w-9 h-9 rounded-full object-cover border-2 border-white dark:border-slate-800 shadow-sm"
                  />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {displayName?.charAt(0)?.toUpperCase()}
                  </div>
                )}

                <div className="hidden md:flex flex-col items-start leading-tight">
                  {!user ? (
                      <div className="h-4 w-20 bg-neutral-200 dark:bg-slate-700 rounded animate-pulse mb-1"></div>
                  ) : (
                      <span className="text-sm font-medium text-neutral-900 dark:text-white max-w-[140px] truncate">
                        {displayName}
                      </span>
                  )}
                  <span className="text-[11px] text-neutral-400 dark:text-slate-500 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                    En ligne
                  </span>
                </div>

                <ChevronDown
                  className={`hidden sm:block w-4 h-4 text-neutral-400 dark:text-slate-500 transition-transform ${
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
                  
                  <div className="absolute right-0 mt-3 w-64 bg-white dark:bg-slate-800 border border-neutral-200 dark:border-slate-700 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slideDown">
                    <div className="p-4 bg-slate-50 dark:bg-slate-900 border-b border-neutral-200 dark:border-slate-700">
                      <div className="flex items-center gap-3">
                        {user?.photo ? (
                          <img
                            src={user.photo}
                            alt={displayName}
                            className="w-12 h-12 rounded-full object-cover border-2 border-white dark:border-slate-700 shadow-sm"
                          />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-900 dark:bg-slate-700 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {displayName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-neutral-900 dark:text-white truncate">
                            {displayName}
                          </p>
                          <p className="text-xs text-neutral-600 dark:text-slate-400 truncate">
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
                        className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                      >
                        <UserCircle2 className="w-4 h-4" /> Mon profil
                      </button>
                      <button
                        onClick={() => {
                          router.push("/dashboard/parametres");
                          setShowMenu(false);
                        }}
                        className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-all"
                      >
                        <Settings className="w-4 h-4" /> Paramètres
                      </button>
                    </div>

                    <div className="p-2 border-t border-neutral-200 dark:border-slate-700">
                      <button
                        onClick={() => {
                           handleLogout(); 
                           setShowMenu(false);
                        }}
                        className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-all"
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