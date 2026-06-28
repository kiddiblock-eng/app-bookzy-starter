"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import useSWR, { useSWRConfig } from "swr";
import { ChevronDown, LogOut, UserCircle2, Settings, Menu, Lightbulb, Users, CreditCard, Sparkles, BookOpen } from "lucide-react";
import Link from "next/link";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

// Avatar cartoon (DiceBear) déterministe par compte (seed = email). Photo prioritaire.
const AVATAR_STYLE = "adventurer";
function avatarUrl(user) {
  if (user?.photo && !user.photo.includes("ui-avatars.com")) return user.photo;
  const seed = user?.email || user?.displayName || `${user?.firstName || ""}${user?.lastName || ""}`.trim() || "bookzy";
  return `https://api.dicebear.com/9.x/${AVATAR_STYLE}/svg?seed=${encodeURIComponent(seed)}`;
}

export default function DashboardHeader({ onMenuClick }) {
  const router = useRouter();
  const { mutate } = useSWRConfig();
  const [showMenu, setShowMenu] = useState(false);

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 30000,
  });
  const balance = balanceData?.credits?.balance ?? null;

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
    } catch (error) {
      console.error("Erreur logout", error);
    } finally {
      sessionStorage.clear();
      localStorage.clear();
      window.location.href = "/auth/login";
    }
  };

  return (
    <header className="h-full w-full px-3 md:px-4 flex items-center justify-between">

      {/* Left — burger (mobile) + sélecteur de plan / abonnement */}
      <div className="flex items-center gap-1">
        <button
          onClick={onMenuClick}
          className="lg:hidden w-10 h-10 -ml-1 rounded-lg flex items-center justify-center text-neutral-700 hover:bg-neutral-100 transition-colors"
          aria-label="Menu"
        >
          <Menu className="w-5 h-5" />
        </button>
        <PlanSwitcher plan={user?.plan} />
      </div>

      {/* Right — crédits + profil */}
      <div className="flex items-center gap-2">
        <Link
          href="/dashboard/credits"
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-neutral-100 hover:bg-neutral-200 transition-colors"
          title="Mes crédits"
        >
          <CreditCard className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-xs font-semibold text-neutral-800">{balance !== null ? `${balance} cr.` : "—"}</span>
        </Link>

        <div className="relative">
          <button
            onClick={() => setShowMenu(!showMenu)}
            className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-neutral-100 transition-colors"
          >
            {!user ? (
              <div className="w-8 h-8 rounded-full bg-neutral-200 animate-pulse" />
            ) : (
              <img src={avatarUrl(user)} alt={displayName} className="w-8 h-8 rounded-full object-cover bg-neutral-100" />
            )}
            <ChevronDown className={`hidden sm:block w-4 h-4 text-neutral-400 transition-transform ${showMenu ? "rotate-180" : ""}`} />
          </button>

          {showMenu && (
            <>
              <div className="fixed inset-0 z-10" onClick={() => setShowMenu(false)} />
              <div className="absolute right-0 mt-2 w-64 bg-white border border-neutral-200 rounded-2xl shadow-xl overflow-hidden z-50">
                <div className="p-4 border-b border-neutral-100">
                  <div className="flex items-center gap-3">
                    <img src={avatarUrl(user)} alt={displayName} className="w-11 h-11 rounded-full object-cover bg-neutral-100" />
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-bold text-neutral-900 truncate">{displayName}</p>
                      <p className="text-xs text-neutral-500 truncate">{user?.email || ""}</p>
                    </div>
                  </div>
                </div>

                <div className="p-2">
                  <MenuItem onClick={() => { router.push("/dashboard/parametres?tab=profil"); setShowMenu(false); }} icon={UserCircle2} label="Mon profil" />
                  <MenuItem onClick={() => { router.push("/dashboard/parametres"); setShowMenu(false); }} icon={Settings} label="Paramètres" />
                  <MenuItem onClick={() => { router.push("/dashboard/communaute"); setShowMenu(false); }} icon={Users} label="Communauté" />
                  <MenuItem onClick={() => { router.push("/dashboard/suggestions"); setShowMenu(false); }} icon={Lightbulb} label="Suggérer une fonctionnalité" />
                </div>

                <div className="p-2 border-t border-neutral-100">
                  <button
                    onClick={() => { handleLogout(); setShowMenu(false); }}
                    className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-colors"
                  >
                    <LogOut className="w-4 h-4" /> Déconnexion
                  </button>
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </header>
  );
}

function MenuItem({ onClick, icon: Icon, label }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center w-full gap-3 px-3 py-2.5 rounded-xl text-sm font-medium text-neutral-700 hover:bg-neutral-100 transition-colors"
    >
      <Icon className="w-4 h-4 text-neutral-500" /> {label}
    </button>
  );
}

const PLAN_LABELS = { free: "Free", unit: "À l'unité", createur: "Créateur", pro: "Pro" };

function PlanSwitcher({ plan }) {
  const [open, setOpen] = useState(false);
  const current = PLAN_LABELS[plan] || "Free";

  return (
    <div className="relative">
      <button
        onClick={() => setOpen(!open)}
        className="flex items-center gap-1.5 pl-1.5 pr-2 py-1.5 rounded-lg hover:bg-neutral-100 transition-colors"
      >
        <img src="/logonew.webp" alt="Bookzy" className="h-6 w-auto object-contain" />
        <ChevronDown className={`w-4 h-4 text-neutral-400 transition-transform ${open ? "rotate-180" : ""}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-10" onClick={() => setOpen(false)} />
          <div className="absolute left-0 mt-2 w-72 bg-white border border-neutral-200 rounded-2xl shadow-xl p-2 z-50">
            <div className="flex items-start gap-3 p-2">
              <Sparkles className="w-5 h-5 text-neutral-700 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">Passe à l'abonnement</p>
                <p className="text-xs text-neutral-500">Crée plus d'ebooks et débloque tous les outils</p>
              </div>
              <Link
                href="/dashboard/tarifs"
                onClick={() => setOpen(false)}
                className="shrink-0 px-3 py-1.5 rounded-full bg-neutral-900 text-white text-xs font-semibold hover:bg-neutral-800 transition-colors"
              >
                Mettre à niveau
              </Link>
            </div>
            <div className="flex items-start gap-3 p-2 rounded-xl bg-neutral-50 mt-1">
              <BookOpen className="w-5 h-5 text-neutral-700 mt-0.5 shrink-0" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-semibold text-neutral-900">
                  Plan {current} <span className="text-xs font-normal text-neutral-400">· actuel</span>
                </p>
                <p className="text-xs text-neutral-500">Ton offre en cours</p>
              </div>
            </div>
          </div>
        </>
      )}
    </div>
  );
}
