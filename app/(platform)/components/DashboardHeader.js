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
  X,
  Users,
  CreditCard,
  Lightbulb,
} from "lucide-react";
import Link from "next/link";
import NotificationBell from "./NotificationBell";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

export default function DashboardHeader({ onMenuClick }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [showMenu, setShowMenu] = useState(false);
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [showSearchResults, setShowSearchResults] = useState(false);
  const searchRef = useRef(null);

  const { data: ebooksData } = useSWR("/api/ebooks/user", fetcher);
  const ebooks = ebooksData?.ebooks || [];

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });
  const balance = balanceData?.credits?.balance ?? null;

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
      await fetch("/api/auth/logout", { method: "POST", credentials: "include" });
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
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${visible ? "opacity-100 translate-y-0" : "opacity-0 -translate-y-2"}`}>
      <div className="w-full bg-white/95 backdrop-blur-xl border-b border-neutral-200 shadow-sm">
        <div className="h-16 px-4 md:px-6 flex items-center justify-between">

          {/* LEFT — BURGER */}
          <div className="flex items-center flex-shrink-0">
            <button
              onClick={onMenuClick}
              className="lg:hidden p-2.5 -ml-1 rounded-xl hover:bg-neutral-100 active:scale-95 transition-all"
              aria-label="Menu"
            >
              <Menu className="w-6 h-6 text-neutral-700" />
            </button>
          </div>

          {/* CENTER — RECHERCHE */}
          <div className="flex-1 flex justify-center px-4">
            <div ref={searchRef} className="hidden md:block relative w-full max-w-[480px]">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-neutral-400 pointer-events-none" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => { setSearchQuery(e.target.value); setShowSearchResults(true); }}
                onFocus={() => setShowSearchResults(true)}
                placeholder="Rechercher un projet..."
                className="w-full pl-12 pr-10 py-2 rounded-2xl bg-neutral-100 text-sm font-medium text-neutral-900 placeholder:text-neutral-400 focus:outline-none focus:ring-2 focus:ring-slate-500/20 transition-all duration-200"
              />
              {searchQuery && (
                <button
                  onClick={() => { setSearchQuery(""); setShowSearchResults(false); }}
                  className="absolute right-4 top-1/2 -translate-y-1/2 text-neutral-400 hover:text-neutral-600"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              {showSearchResults && searchQuery.trim().length > 0 && (
                <div className="absolute top-full mt-2 w-full bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-50 max-h-[400px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    <div className="p-2">
                      <p className="px-3 py-2 text-xs font-bold text-neutral-400 uppercase tracking-wide">
                        {searchResults.length} résultat{searchResults.length > 1 ? "s" : ""}
                      </p>
                      {searchResults.map((ebook) => (
                        <button
                          key={ebook._id}
                          onClick={() => { router.push(`/dashboard/fichiers/${ebook._id}`); setSearchQuery(""); setShowSearchResults(false); }}
                          className="w-full flex items-start gap-3 px-3 py-2.5 rounded-xl hover:bg-slate-100 transition-all text-left"
                        >
                          <div className="w-10 h-10 rounded-lg bg-slate-900 flex items-center justify-center flex-shrink-0">
                            <FileText className="w-5 h-5 text-white" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <p className="text-sm font-semibold text-neutral-900 truncate">{ebook.title}</p>
                            <p className="text-xs text-neutral-500 truncate">
                              {ebook.niche || "Sans catégorie"} · {new Date(ebook.createdAt).toLocaleDateString("fr-FR")}
                            </p>
                          </div>
                        </button>
                      ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center">
                      <p className="text-sm font-medium text-neutral-600">Aucun projet trouvé</p>
                      <p className="text-xs text-neutral-400 mt-1">Essayez un autre terme</p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* RIGHT — CRÉDITS + COMMUNAUTÉ + SUGGESTIONS + NOTIFS + PROFIL */}
          <div className="flex items-center gap-2 flex-shrink-0">

            {/* SOLDE CRÉDITS */}
            <Link
              href="/dashboard/credits"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-slate-900 hover:bg-slate-700 text-white rounded-xl transition-all"
              title="Mes crédits"
            >
              <CreditCard className="w-3.5 h-3.5 text-slate-300 flex-shrink-0" />
              {balance !== null ? (
                <span className="text-xs font-bold whitespace-nowrap">{balance} cr.</span>
              ) : (
                <span className="text-xs font-bold text-slate-400">—</span>
              )}
            </Link>

            {/* COMMUNAUTÉ */}
            <Link
              href="/dashboard/communaute"
              className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors"
              title="Communauté"
            >
              <Users className="w-5 h-5 text-neutral-600" />
            </Link>

            {/* SUGGESTIONS */}
            <Link
              href="/dashboard/suggestions"
              className="p-2.5 rounded-xl bg-neutral-100 hover:bg-neutral-200 transition-colors"
              title="Suggérer une fonctionnalité"
            >
              <Lightbulb className="w-5 h-5 text-neutral-600" />
            </Link>

            <NotificationBell />

            {/* PROFIL */}
            <div className="relative">
              <button
                onClick={() => setShowMenu(!showMenu)}
                className="flex items-center gap-2 px-2 py-1.5 rounded-full hover:bg-neutral-100 transition-all"
              >
                {!user ? (
                  <div className="w-9 h-9 rounded-full bg-neutral-200 animate-pulse" />
                ) : user.photo ? (
                  <img src={user.photo} alt={displayName} className="w-9 h-9 rounded-full object-cover border-2 border-white shadow-sm" />
                ) : (
                  <div className="w-9 h-9 rounded-full bg-slate-900 flex items-center justify-center text-white font-semibold text-sm shadow-md">
                    {displayName?.charAt(0)?.toUpperCase()}
                  </div>
                )}
                <div className="hidden md:flex flex-col items-start leading-tight">
                  {!user ? (
                    <div className="h-4 w-20 bg-neutral-200 rounded animate-pulse mb-1" />
                  ) : (
                    <span className="text-sm font-medium text-neutral-900 max-w-[140px] truncate">{displayName}</span>
                  )}
                  <span className="text-[11px] text-neutral-400 flex items-center gap-1">
                    <span className="inline-block w-2 h-2 bg-green-500 rounded-full" />
                    En ligne
                  </span>
                </div>
                <ChevronDown className={`hidden sm:block w-4 h-4 text-neutral-400 transition-transform ${showMenu ? "rotate-180" : ""}`} />
              </button>

              {showMenu && (
                <>
                  <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
                  <div className="absolute right-0 mt-3 w-64 bg-white border border-neutral-200 rounded-2xl shadow-2xl overflow-hidden z-50 animate-slideDown">
                    
                    {/* Profil header */}
                    <div className="p-4 bg-slate-50 border-b border-neutral-200">
                      <div className="flex items-center gap-3">
                        {user?.photo ? (
                          <img src={user.photo} alt={displayName} className="w-12 h-12 rounded-full object-cover border-2 border-white shadow-sm" />
                        ) : (
                          <div className="w-12 h-12 rounded-full bg-slate-900 flex items-center justify-center text-white font-bold text-lg shadow-md">
                            {displayName?.charAt(0)?.toUpperCase() || "?"}
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-sm font-bold text-neutral-900 truncate">{displayName}</p>
                          <p className="text-xs text-neutral-600 truncate">{user?.email || ""}</p>
                        </div>
                      </div>

                      {balance !== null && (
                        <Link
                          href="/dashboard/credits"
                          onClick={() => setShowMenu(false)}
                          className="mt-3 flex items-center justify-between w-full px-3 py-2 bg-white border border-slate-200 rounded-xl hover:border-blue-200 hover:bg-blue-50 transition-all"
                        >
                          <div className="flex items-center gap-2">
                            <CreditCard className="w-4 h-4 text-blue-500" />
                            <span className="text-xs font-semibold text-slate-700">Mes crédits</span>
                          </div>
                          <span className="text-xs font-bold text-blue-600">{balance} disponibles</span>
                        </Link>
                      )}
                    </div>

                    <div className="p-2">
                      <button
                        onClick={() => { router.push("/dashboard/parametres?tab=profil"); setShowMenu(false); }}
                        className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-slate-100 transition-all"
                      >
                        <UserCircle2 className="w-4 h-4" /> Mon profil
                      </button>
                      <button
                        onClick={() => { router.push("/dashboard/parametres"); setShowMenu(false); }}
                        className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-slate-100 transition-all"
                      >
                        <Settings className="w-4 h-4" /> Paramètres
                      </button>
                      {/* SUGGESTIONS dans le menu déroulant */}
                      <button
                        onClick={() => { router.push("/dashboard/suggestions"); setShowMenu(false); }}
                        className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-slate-100 transition-all"
                      >
                        <Lightbulb className="w-4 h-4" /> Suggérer une fonctionnalité
                      </button>
                    </div>

                    <div className="p-2 border-t border-neutral-200">
                      <button
                        onClick={() => { handleLogout(); setShowMenu(false); }}
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