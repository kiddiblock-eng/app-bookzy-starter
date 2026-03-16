"use client";

import { useState } from "react";
import useSWR from "swr";
import { useRouter } from "next/navigation";
import {
  ShoppingCart, Clock, CheckCircle, XCircle, Loader2,
  BookOpen, Palette, Store, ChevronRight, ArrowUpRight,CreditCard,
} from "lucide-react";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

// ─── CONSTANTES ──────────────────────────────────────────────────────────────

const PACK_LABELS = {
  solo_monthly:       "Pass Solo — Mensuel",
  solo_quarterly:     "Pass Solo — Trimestriel",
  createur_monthly:   "Pack Créateur — Mensuel",
  createur_quarterly: "Pack Créateur — Trimestriel",
  agence_monthly:     "Pack Agence — Mensuel",
  agence_quarterly:   "Pack Agence — Trimestriel",
};

const PACK_CREDITS = {
  solo_monthly:        20,
  solo_quarterly:      60,
  createur_monthly:   110,
  createur_quarterly: 330,
  agence_monthly:     315,
  agence_quarterly:   945,
};

const PLAN_LABELS = {
  free:     "Gratuit",
  solo:     "Pass Solo",
  createur: "Pack Créateur",
  agence:   "Pack Agence",
};

const CREDIT_ACTIONS = [
  { icon: BookOpen, label: "Générer un ebook complet",       cost: 20, color: "text-blue-600",   bg: "bg-blue-50" },
  { icon: Palette,  label: "Designer un brouillon Word",     cost: 10, color: "text-violet-600", bg: "bg-violet-50" },
  { icon: Store,    label: "Publier votre boutique Smart Shop", cost: 5, color: "text-emerald-600", bg: "bg-emerald-50" },
];

function fmt(n) {
  return Math.round(n).toString().replace(/\B(?=(\d{3})+(?!\d))/g, " ");
}

function timeAgo(dateStr) {
  const date = new Date(dateStr);
  const now = new Date();
  const diff = Math.floor((now - date) / 1000);
  if (diff < 60) return "À l'instant";
  if (diff < 3600) return `Il y a ${Math.floor(diff / 60)} min`;
  if (diff < 86400) return `Il y a ${Math.floor(diff / 3600)}h`;
  return date.toLocaleDateString("fr-FR", { day: "numeric", month: "short", year: "numeric" });
}

// ─── PAGE PRINCIPALE ─────────────────────────────────────────────────────────

export default function CreditsPage() {
  const router = useRouter();
  const [page, setPage] = useState(1);

  const { data: balanceData } = useSWR("/api/credits/balance", fetcher, {
    revalidateOnFocus: false,
  });

  const { data: historyData, isLoading: historyLoading } = useSWR(
    `/api/credits/history?page=${page}&limit=10`,
    fetcher,
    { revalidateOnFocus: false }
  );

  const balance     = balanceData?.credits?.balance     ?? 0;
  const totalSpent  = balanceData?.credits?.totalSpent  ?? 0;
  const totalPurchased = balanceData?.credits?.totalPurchased ?? 0;
  const plan        = balanceData?.plan ?? "free";

  const transactions  = historyData?.data?.transactions  || [];
  const pagination    = historyData?.data?.pagination    || {};

  return (
    <div className="min-h-screen bg-white">

      {/* HEADER */}
      <div className="sticky top-0 z-20 bg-white border-b border-slate-200">
        <div className="max-w-4xl mx-auto px-4 h-14 flex items-center justify-between">
          <h1 className="text-lg font-bold text-slate-900">Mes crédits</h1>
          <button
            onClick={() => router.push("/dashboard/tarifs")}
            className="flex items-center gap-1.5 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-lg text-sm font-medium transition-all"
          >
            <ShoppingCart className="w-4 h-4" />
            Acheter des crédits
          </button>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-6 space-y-6">

        {/* ─── SOLDE + STATS ─────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">

          {/* Solde principal */}
          <div className="sm:col-span-1 bg-slate-900 rounded-2xl p-6 flex flex-col justify-between">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 bg-white/10 rounded-lg flex items-center justify-center">
                <CreditCard className="w-4 h-4 text-white" />
              </div>
              <span className="text-slate-400 text-sm">Solde actuel</span>
            </div>
            <div>
              <p className="text-5xl font-bold text-white tracking-tight">
                {balanceData ? balance : "—"}
              </p>
              <p className="text-slate-400 text-sm mt-1">crédits disponibles</p>
            </div>
            <div className="mt-4 pt-4 border-t border-white/10">
              <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-white/10 rounded-full text-xs text-white font-medium">
                {PLAN_LABELS[plan] || "Gratuit"}
              </span>
            </div>
          </div>

          {/* Stats */}
          <div className="sm:col-span-2 grid grid-cols-2 gap-4">
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <p className="text-xs text-slate-500 mb-1">Total acheté</p>
              <p className="text-3xl font-bold text-slate-900">{balanceData ? totalPurchased : "—"}</p>
              <p className="text-xs text-slate-400 mt-1">crédits à vie</p>
            </div>
            <div className="bg-slate-50 border border-slate-100 rounded-2xl p-5">
              <p className="text-xs text-slate-500 mb-1">Total utilisé</p>
              <p className="text-3xl font-bold text-slate-900">{balanceData ? totalSpent : "—"}</p>
              <p className="text-xs text-slate-400 mt-1">crédits dépensés</p>
            </div>

            {/* Coût des actions */}
            <div className="col-span-2 bg-slate-50 border border-slate-100 rounded-2xl p-4">
              <p className="text-xs font-semibold text-slate-500 mb-3 uppercase tracking-wider">Coût des actions</p>
              <div className="space-y-2">
                {CREDIT_ACTIONS.map((action, i) => (
                  <div key={i} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`w-7 h-7 ${action.bg} rounded-lg flex items-center justify-center`}>
                        <action.icon className={`w-3.5 h-3.5 ${action.color}`} />
                      </div>
                      <span className="text-sm text-slate-700">{action.label}</span>
                    </div>
                    <span className="text-sm font-semibold text-slate-900">{action.cost} crédits</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* ─── HISTORIQUE ────────────────────────────────────────────────── */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-base font-semibold text-slate-900">Historique des achats</h2>
            {pagination.total > 0 && (
              <span className="text-sm text-slate-400">{pagination.total} achat{pagination.total > 1 ? "s" : ""}</span>
            )}
          </div>

          {historyLoading ? (
            <div className="flex items-center justify-center py-16">
              <Loader2 className="w-6 h-6 animate-spin text-slate-300" />
            </div>
          ) : transactions.length === 0 ? (
            <EmptyHistory onBuy={() => router.push("/dashboard/tarifs")} />
          ) : (
            <div className="space-y-2">
              {transactions.map((tx) => (
                <TransactionRow key={tx.id} tx={tx} />
              ))}

              {/* Pagination */}
              {pagination.totalPages > 1 && (
                <div className="flex items-center justify-between pt-4">
                  <button
                    onClick={() => setPage(p => Math.max(1, p - 1))}
                    disabled={page === 1}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all"
                  >
                    Précédent
                  </button>
                  <span className="text-sm text-slate-500">
                    Page {page} / {pagination.totalPages}
                  </span>
                  <button
                    onClick={() => setPage(p => p + 1)}
                    disabled={!pagination.hasMore}
                    className="px-4 py-2 text-sm font-medium text-slate-600 bg-slate-100 hover:bg-slate-200 disabled:opacity-40 disabled:cursor-not-allowed rounded-lg transition-all"
                  >
                    Suivant
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ─── CTA ACHETER ───────────────────────────────────────────────── */}
        <div className="bg-slate-50 border border-slate-200 rounded-2xl p-6 flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <p className="font-semibold text-slate-900">Besoin de plus de crédits ?</p>
            <p className="text-sm text-slate-500 mt-0.5">
              Les crédits n'expirent jamais. Ce que vous achetez vous appartient.
            </p>
          </div>
          <button
            onClick={() => router.push("/dashboard/tarifs")}
            className="shrink-0 flex items-center gap-2 px-5 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-semibold transition-all"
          >
            Voir les packs
            <ArrowUpRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}

// ─── TRANSACTION ROW ─────────────────────────────────────────────────────────

function TransactionRow({ tx }) {
  const isCompleted = tx.status === "completed";
  const isFailed    = tx.status === "failed";

  return (
    <div className="flex items-center justify-between p-4 bg-white border border-slate-100 rounded-xl hover:border-slate-200 transition-all">
      <div className="flex items-center gap-3">

        {/* Icône statut */}
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isCompleted ? "bg-emerald-50" : isFailed ? "bg-red-50" : "bg-amber-50"
        }`}>
          {isCompleted
            ? <CheckCircle className="w-4 h-4 text-emerald-500" />
            : isFailed
            ? <XCircle className="w-4 h-4 text-red-400" />
            : <Clock className="w-4 h-4 text-amber-500" />
          }
        </div>

        {/* Info */}
        <div>
          <p className="text-sm font-medium text-slate-900">{tx.label}</p>
          <p className="text-xs text-slate-400 mt-0.5">{timeAgo(tx.createdAt)}</p>
        </div>
      </div>

      {/* Droite */}
      <div className="text-right shrink-0 ml-4">
        <p className="text-sm font-semibold text-slate-900">
          +{tx.credits} crédits
        </p>
        <p className="text-xs text-slate-400">{fmt(tx.amount)} FCFA</p>
      </div>
    </div>
  );
}

// ─── EMPTY STATE ─────────────────────────────────────────────────────────────

function EmptyHistory({ onBuy }) {
  return (
    <div className="text-center py-14 border border-dashed border-slate-200 rounded-2xl">
      <div className="w-12 h-12 bg-slate-100 rounded-2xl flex items-center justify-center mx-auto mb-4">
        
      </div>
      <p className="font-medium text-slate-900 mb-1">Aucun achat pour l'instant</p>
      <p className="text-sm text-slate-500 mb-5">Achetez votre premier pack de crédits</p>
      <button
        onClick={onBuy}
        className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-sm font-medium transition-all"
      >
        Voir les packs
        <ChevronRight className="w-4 h-4" />
      </button>
    </div>
  );
}