"use client";

import { useState, useEffect } from "react";
import useSWR from "swr";
import {
  BookOpen, ArrowRight, Plus, History, ChevronRight,
  CheckCircle2, Clock, BarChart2, Search, TrendingUp,
  Youtube, Layers, Target, DollarSign, Users, Eye,
  Calendar, Store, Coins, Lightbulb, BarChart3,
} from "lucide-react";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());
const PLAN_LABELS = { free: "Gratuit", solo: "Pass Solo", createur: "Pack Créateur", agence: "Pack Agence" };

export default function DashboardHome() {
  const [greeting, setGreeting] = useState("");

  const { data: userData,   isLoading: userLoading   } = useSWR("/api/profile/get",           fetcher, { revalidateOnFocus: true });
  const { data: ebooksData, isLoading: ebooksLoading } = useSWR("/api/ebooks/user",            fetcher, { revalidateOnFocus: true });
  const { data: creditsData                          } = useSWR("/api/credits/balance",         fetcher, { revalidateOnFocus: true });
  const { data: historyData                          } = useSWR("/api/credits/history?limit=3", fetcher, { revalidateOnFocus: true });
  const { data: analyseurData                        } = useSWR("/api/analyseur/count",         fetcher, { revalidateOnFocus: true });

  const user    = userData?.user || userData;
  const ebooks  = ebooksData?.ebooks || [];
  const balance = creditsData?.credits?.balance ?? creditsData?.balance ?? null;
  const plan    = creditsData?.plan || user?.plan || "free";
  const history = historyData?.transactions || [];
  const total       = ebooks.length;
  const kits        = ebooks.filter(e => e.fileUrl).length;
  const enCours     = total - kits;
  const analysesCount = analyseurData?.count ?? 0;

  useEffect(() => {
    const h = new Date().getHours();
    setGreeting(h < 12 ? "Bonjour" : h < 18 ? "Bon après-midi" : "Bonsoir");
  }, []);

  const userName = user
    ? (user.displayName || user.firstName || user.email?.split("@")[0] || "Créateur")
    : "Créateur";
  const name = userName.charAt(0).toUpperCase() + userName.slice(1);

  if (userLoading || ebooksLoading) return <Skeleton />;

  return (
    <div className="bg-slate-50 min-h-screen pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">

        {/* ── HERO ─────────────────────────────────────────────────────── */}
        <section className="bg-slate-900 rounded-2xl p-6 sm:p-8">
          <div className="flex flex-col lg:flex-row justify-between gap-8">

            {/* Left */}
            <div className="flex-1 space-y-5">
              <div>
                <p className="text-xs text-slate-400 mb-1">{greeting},</p>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Bienvenue {name}</h1>
                <p className="text-sm text-slate-400 max-w-xl">
                  Valide ton idée, crée ton produit en moins d'une minute, et lance ta vente en quelques clics.
                </p>
              </div>
              <div className="flex flex-wrap gap-3">
                <a href="/dashboard/projets/nouveau" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white text-slate-900 rounded-xl font-bold text-sm transition-all hover:bg-slate-100 active:scale-[0.98]">
                  <BookOpen className="w-4 h-4" /> Générer un ebook Pro <ArrowRight className="w-4 h-4" />
                </a>
                <a href="/dashboard/analyseur" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 text-white rounded-xl font-bold text-sm transition-all hover:bg-white/20">
                  <Search className="w-4 h-4" /> Valider mon idée d'ebook <ChevronRight className="w-4 h-4" />
                </a>
              </div>
            </div>

            {/* Right — crédits */}
            <div className="lg:w-72 bg-slate-800 border border-slate-700 rounded-xl p-5 flex flex-col gap-4">
              <div className="flex items-center justify-between">
                <span className="text-xs text-slate-400 uppercase tracking-widest font-semibold">Plan actuel</span>
                <span className="text-xs font-bold bg-indigo-600 text-white px-3 py-1 rounded-full">
                  {PLAN_LABELS[plan] || "Gratuit"}
                </span>
              </div>
              <div className="border-t border-slate-700 pt-4">
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Crédits disponibles</p>
                <p className="text-5xl font-black text-white leading-none">
                  {balance !== null ? balance : "—"}
                  <span className="text-sm text-slate-400 font-medium ml-1">crédits</span>
                </p>
              </div>
              <div className="flex gap-2 mt-auto">
                <a href="/dashboard/tarifs" className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-indigo-600 text-white rounded-lg text-xs font-black hover:bg-indigo-700 transition-all">
                  <Plus className="w-3.5 h-3.5" /> Acheter
                </a>
                <a href="/dashboard/credits" className="flex items-center justify-center px-3 py-2.5 bg-slate-700 text-slate-300 rounded-lg hover:bg-slate-600 transition-all">
                  <History className="w-4 h-4" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── 3 PHASES ─────────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

          <Phase
            bgLight="#e0f2fe" color="#0891b2"
            icon={<Search className="w-4 h-4" style={{ color: "#0891b2" }} />}
            title="Trouver ton idée"
            sub="Valide avant de créer"
            tools={[
              { icon: <BarChart2 className="w-3.5 h-3.5" style={{ color: "#0891b2" }} />, bg: "#e0f2fe", name: "Validateur d'idée", desc: "Vérifie si ton idée va cartonner ", href: "/dashboard/analyseur" },
              { icon: <Target className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />, bg: "#dcfce7", name: "Niche Hunter", desc: "Trouve les niches rentables", href: "/dashboard/niche-hunter" },
              { icon: <TrendingUp className="w-3.5 h-3.5" style={{ color: "#c026d3" }} />, bg: "#fae8ff", name: "Radar Cash", desc: "Pubs qui cartonnent en ce moment sur facebook", href: "/dashboard/radar-cash" },
            ]}
          />

          <Phase
            bgLight="#f3e8ff" color="#7c3aed"
            icon={<BookOpen className="w-4 h-4" style={{ color: "#7c3aed" }} />}
            title="Créer ton produit"
            sub="Transforme ton idée"
            tools={[
              { icon: <BookOpen className="w-3.5 h-3.5" style={{ color: "#7c3aed" }} />, bg: "#f3e8ff", name: "Générer un ebook", desc: "Création complète par IA", href: "/dashboard/projets/nouveau" },
              { icon: <Youtube className="w-3.5 h-3.5" style={{ color: "#dc2626" }} />, bg: "#fef2f2", name: "Youbook", desc: "Ebook depuis une vidéo", href: "/dashboard/youbook" },
              { icon: <Layers className="w-3.5 h-3.5" style={{ color: "#2563eb" }} />, bg: "#eff6ff", name: "Ebook Designer", desc: "Mise en page pro", href: "/dashboard/express" },
            ]}
          />

          <Phase
            bgLight="#eef2ff" color="#4f46e5"
            icon={<DollarSign className="w-4 h-4" style={{ color: "#4f46e5" }} />}
            title="Vendre & encaisser"
            sub="Lance via Mobile Money"
            tools={[
              { icon: <Store className="w-3.5 h-3.5" style={{ color: "#4f46e5" }} />, bg: "#eef2ff", name: "Taliopay", desc: "Orange Money, Wave, MTN", href: "https://taliopay.com" },
              { icon: <Users className="w-3.5 h-3.5" style={{ color: "#16a34a" }} />, bg: "#dcfce7", name: "Affiliation", desc: "Fais vendre par tes abonnés", href: "/dashboard/affiliation" },
            ]}
          />
        </div>

        {/* ── CONTENU BAS ──────────────────────────────────────────────── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Activité récente */}
          <section className="lg:col-span-2 bg-white border border-slate-200 rounded-2xl p-5">
            <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-100">
              <div>
                <h2 className="text-base font-bold text-slate-900">Activité récente</h2>
                <p className="text-xs text-slate-500 mt-0.5">{total} projet(s) créé(s) au total</p>
              </div>
              {ebooks.length > 0 && (
                <a href="/dashboard/projets" className="flex items-center gap-1 text-xs font-semibold text-slate-700 hover:text-slate-900">
                  Voir tout <ArrowRight className="w-3 h-3" />
                </a>
              )}
            </div>
            {ebooks.length > 0 ? (
              <div className="space-y-2">
                {ebooks.slice(0, 4).map(e => <ProjectCard key={e._id} ebook={e} />)}
              </div>
            ) : <EmptyState />}
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">

            {/* Parcours */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-slate-900 mb-4">Ton parcours</h3>
              <div className="space-y-3 mb-4">
                <ProgressRow label="Idées analysées" value={analysesCount} max={Math.max(analysesCount, 10)} color="#0891b2" />
                <ProgressRow label="Produits créés" value={kits} max={Math.max(kits, 10)} color="#7c3aed" />
                <ProgressRow label="En cours" value={enCours} max={Math.max(enCours, 5)} color="#4f46e5" />
              </div>
              <div className="space-y-1">
                <StatRow label="Projets terminés" value={kits} />
                <StatRow label="Crédits restants" value={balance !== null ? `${balance} cr.` : "—"} />
              </div>
            </div>

            {/* Prochaine étape */}
            <div className="bg-slate-900 rounded-2xl p-5">
              <h3 className="text-sm font-bold text-white mb-2">Prochaine étape</h3>
              <p className="text-xs text-slate-400 leading-relaxed mb-4">
                {kits === 0
                  ? "Tu n'as pas encore créé de produit. Lance ton premier ebook en moins de 2 minutes."
                  : `Tu as ${kits} produit${kits > 1 ? "s" : ""} créé${kits > 1 ? "s" : ""}. Passe à la vente via Taliopay.`
                }
              </p>
              <a href={kits === 0 ? "/dashboard/projets/nouveau" : "https://taliopay.com"}
                className="flex items-center justify-center gap-2 w-full py-2.5 bg-indigo-600 text-white rounded-xl text-xs font-black hover:bg-indigo-500 transition-all">
                {kits === 0 ? "Créer mon premier ebook" : "Configurer Taliopay"} <ArrowRight className="w-3.5 h-3.5" />
              </a>
            </div>

            {/* Historique crédits */}
            {history.length > 0 && (
              <div className="bg-white border border-slate-200 rounded-2xl p-5">
                <h3 className="text-sm font-bold text-slate-900 mb-3">Dernières opérations</h3>
                {history.map((tx, i) => (
                  <div key={i} className="flex items-center justify-between py-2 border-b border-slate-50 last:border-0">
                    <span className="text-xs text-slate-500 truncate max-w-[160px]">{tx.description || tx.purpose}</span>
                    <span className={`text-xs font-bold ${tx.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                      {tx.amount > 0 ? "+" : ""}{tx.amount}
                    </span>
                  </div>
                ))}
              </div>
            )}
          </aside>
        </div>
      </div>
    </div>
  );
}

function Phase({ bgLight, color, icon, title, sub, tools }) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 flex flex-col gap-4">
      <div>
        <p className="text-sm font-bold text-slate-900">{title}</p>
        <p className="text-xs text-slate-400">{sub}</p>
      </div>
      <div className="flex flex-col gap-2">
        {tools.map((t, i) => (
          <a key={i} href={t.href} className="flex items-center gap-3 p-2.5 bg-slate-50 border border-slate-100 rounded-xl hover:border-slate-300 transition-all group">
            <div className="w-7 h-7 rounded-lg flex items-center justify-center flex-shrink-0" style={{ background: t.bg }}>{t.icon}</div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold text-slate-900 group-hover:text-slate-700">{t.name}</p>
              <p className="text-[10px] text-slate-400">{t.desc}</p>
            </div>
            <ChevronRight className="w-3 h-3 text-slate-300 group-hover:text-slate-500 flex-shrink-0" />
          </a>
        ))}
      </div>
    </div>
  );
}

function ProgressRow({ label, value, max, color }) {
  const pct = max > 0 ? Math.min(100, Math.round((value / max) * 100)) : 0;
  return (
    <div>
      <div className="flex justify-between mb-1">
        <span className="text-xs text-slate-500">{label}</span>
        <span className="text-xs font-bold text-slate-900">{value}</span>
      </div>
      <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
        <div className="h-full rounded-full transition-all" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
}

function StatRow({ label, value }) {
  return (
    <div className="flex justify-between py-1.5 border-b border-slate-50 last:border-0">
      <span className="text-xs text-slate-500">{label}</span>
      <span className="text-xs font-bold text-slate-900">{value}</span>
    </div>
  );
}

function ProjectCard({ ebook }) {
  const done = !!ebook.fileUrl;
  return (
    <div className="flex items-center gap-3 p-3 rounded-xl hover:bg-slate-50 transition-all">
      <div className={`w-9 h-9 rounded-lg flex items-center justify-center flex-shrink-0 ${done ? "bg-emerald-50" : "bg-indigo-50"}`}>
        <BookOpen className={`w-4 h-4 ${done ? "text-emerald-600" : "text-indigo-600"}`} />
      </div>
      <div className="flex-1 min-w-0">
        <p className="text-sm font-semibold text-slate-900 truncate">{ebook.title}</p>
        <div className="flex items-center gap-2 mt-0.5">
          <span className={`text-[10px] font-bold ${done ? "text-emerald-600" : "text-indigo-600"}`}>
            {done ? "Terminé" : "En cours"}
          </span>
          <span className="text-[10px] text-slate-400">
            {new Date(ebook.createdAt).toLocaleDateString("fr-FR")}
          </span>
        </div>
      </div>
      <a href={`/dashboard/fichiers/${ebook._id}`} className="flex items-center gap-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-600 rounded-lg text-xs font-semibold transition-all flex-shrink-0">
        <Eye className="w-3 h-3" /> Détails
      </a>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="text-center py-10">
      <div className="w-12 h-12 bg-slate-100 rounded-xl flex items-center justify-center mx-auto mb-3">
        <BookOpen className="w-6 h-6 text-slate-400" />
      </div>
      <p className="text-sm font-bold text-slate-900 mb-1">Aucun projet pour l'instant</p>
      <p className="text-xs text-slate-500 mb-4">Lance ton premier ebook en moins de 2 minutes.</p>
      <a href="/dashboard/projets/nouveau" className="inline-flex items-center gap-2 px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold hover:bg-slate-700 transition-all">
        Créer maintenant
      </a>
    </div>
  );
}

function Skeleton() {
  return (
    <div className="bg-slate-50 min-h-screen pb-16 animate-pulse">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <div className="h-52 bg-slate-200 rounded-2xl" />
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {[1,2,3].map(i => <div key={i} className="h-48 bg-slate-200 rounded-2xl" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-80 bg-slate-200 rounded-2xl" />
          <div className="space-y-4">
            <div className="h-48 bg-slate-200 rounded-2xl" />
            <div className="h-32 bg-slate-200 rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
}