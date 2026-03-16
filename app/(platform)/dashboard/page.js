"use client";

import { useState, useEffect } from "react";
import useSWR from "swr"; 
import { 
  BookOpen, ArrowRight, Rocket, Package, 
  CheckCircle2, Clock, BarChart3, Target as TargetIcon, 
  TrendingUp, Settings, Lightbulb, AlertCircle,
  Eye, Calendar, ChevronRight, CreditCard, Store, Youtube, 
  Layers, Plus, History, Coins, 
} from "lucide-react";

const fetcher = (url) => fetch(url).then((r) => r.json());

const PLAN_LABELS = { free: "Gratuit", solo: "Pass Solo", creator: "Pack Créateur", agency: "Pack Agence" };
const PLAN_BADGE  = {
  free:    "bg-slate-100 text-slate-600 border-slate-200",
  solo:    "bg-indigo-50 text-indigo-700 border-indigo-200",
  creator: "bg-violet-50 text-violet-700 border-violet-200",
  agency:  "bg-amber-50 text-amber-700 border-amber-200",
};

export default function DashboardHome() {
  const [greeting, setGreeting] = useState("");

  const { data: userData,   isLoading: userLoading    } = useSWR("/api/profile/get",            fetcher, { revalidateOnFocus: true });
  const { data: ebooksData, isLoading: ebooksLoading  } = useSWR("/api/ebooks/user",             fetcher, { revalidateOnFocus: true });
  const { data: creditsData                           } = useSWR("/api/credits/balance",          fetcher, { revalidateOnFocus: true });
  const { data: historyData                           } = useSWR("/api/credits/history?limit=3",  fetcher, { revalidateOnFocus: true });
  const { data: shopData                              } = useSWR("/api/smart-shop/boutique",      fetcher, { revalidateOnFocus: true });

  const user    = userData?.user || userData;
  const ebooks  = ebooksData?.ebooks || [];
  const balance = creditsData?.credits?.balance ?? creditsData?.balance ?? null;
  const plan    = creditsData?.plan || user?.plan || "free";
  const history = historyData?.transactions || [];
  const shop    = shopData?.shop || null;

  const total       = ebooks.length;
  const kits        = ebooks.filter(e => e.fileUrl).length;
  const enCours     = total - kits;

  useEffect(() => {
    const hour = new Date().getHours();
    if (hour < 12) setGreeting("Bonjour");
    else if (hour < 18) setGreeting("Bon après-midi");
    else setGreeting("Bonsoir");
  }, []);

  const userName = user 
    ? (user.displayName || user.firstName || user.email?.split('@')[0] || "Créateur")
    : "Créateur";
  const formattedName = userName.charAt(0).toUpperCase() + userName.slice(1);

  const creditsReady = balance !== null;
  if (userLoading || ebooksLoading) return <DashboardSkeleton />;

  return (
    <div className="bg-slate-50 pb-20 animate-fadeIn"> 
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">

        {/* ── HERO ── */}
        <section className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/50">
          <div className="absolute inset-0 opacity-10 rounded-2xl" style={{ backgroundImage: 'linear-gradient(rgba(255,255,255,0.05) 1px,transparent 1px),linear-gradient(90deg,rgba(255,255,255,0.05) 1px,transparent 1px)', backgroundSize: '30px 30px' }} />
          <div className="relative z-10 flex flex-col lg:flex-row justify-between gap-8">

            {/* Left */}
            <div className="flex-1 space-y-6">
              <div>
                <p className="text-sm text-slate-400 mb-1">{greeting},</p>
                <h1 className="text-3xl sm:text-4xl font-black text-white mb-3">Bienvenue {formattedName}</h1>
                <p className="text-base text-slate-300 max-w-xl">Préparez-vous à lancer votre prochain produit gagnant en un temps record.</p>
              </div>
              <div className="flex flex-wrap gap-2">
                <a href="/dashboard/projets/nouveau" className="group inline-flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-[0.98]">
                  <BookOpen className="w-4 h-4" /> Générer un ebook <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </a>
                <a href="/dashboard/smart-shop/boutique" className="inline-flex items-center gap-2 px-5 py-2.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all">
                  <Store className="w-4 h-4" /> Créer sa boutique
                </a>
              </div>
            </div>

            {/* Right — Plan & Crédits */}
            <div className="lg:w-80 border border-slate-700 rounded-xl p-5 bg-slate-800 shadow-inner flex flex-col gap-4">
              {/* Plan */}
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-1">Plan actuel</p>
                  <span className={`text-sm font-black px-3 py-1 rounded-full border ${PLAN_BADGE[plan] || PLAN_BADGE.free}`}>
                    {PLAN_LABELS[plan] || "Gratuit"}
                  </span>
                </div>
                <a href="/dashboard/tarifs"
                  className="flex items-center gap-1.5 px-3 py-2 bg-indigo-600 hover:bg-indigo-500 text-white rounded-lg text-xs font-bold transition-all">
                  <ArrowRight className="w-3.5 h-3.5" /> Upgrader
                </a>
              </div>
              {/* Séparateur */}
              <div className="border-t border-slate-700" />
              {/* Crédits */}
              <div>
                <p className="text-xs text-slate-400 uppercase tracking-widest font-semibold mb-2">Crédits disponibles</p>
                <div className="flex items-end gap-2">
                  {creditsReady ? (
                    <span className="text-5xl font-black text-white tabular-nums">{balance}</span>
                  ) : (
                    <div className="w-20 h-12 bg-slate-700 rounded-lg animate-pulse" />
                  )}
                  <span className="text-slate-400 text-sm mb-1">crédits</span>
                </div>
              </div>
              {/* Boutons */}
              <div className="flex gap-2 mt-auto">
                <a href="/dashboard/tarifs"
                  className="flex-1 flex items-center justify-center gap-1.5 py-2.5 bg-white text-slate-900 hover:bg-slate-100 rounded-lg text-xs font-black transition-all">
                  <Plus className="w-3.5 h-3.5" /> Acheter des crédits
                </a>
                <a href="/dashboard/credits"
                  className="flex items-center justify-center gap-1.5 px-3 py-2.5 bg-slate-700 hover:bg-slate-600 text-slate-300 rounded-lg text-xs font-bold transition-all border border-slate-600">
                  <History className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        </section>

        {/* ── QUICK LINKS ── */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickLink icon={TargetIcon} title="Niche Hunter"       subtitle="Trouver des idées rentables"  href="/dashboard/niche-hunter"         color="text-emerald-600" />
          <QuickLink icon={Youtube}    title="Youbook"            subtitle="eBook depuis YouTube"          href="/dashboard/youbook"              color="text-red-500" />
          <QuickLink icon={TrendingUp} title="Tendances Virales"  subtitle="Détecter les sujets porteurs" href="/dashboard/trends"               color="text-orange-600" />
          <QuickLink icon={Layers}     title="Ebook Designer"     subtitle="Transformer votre brouillon Word en ebook designé" href="/dashboard/express"              color="text-cyan-600" />
        </section>

        {/* ── CONTENT GRID ── */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Activité récente */}
          <section className="lg:col-span-2 space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h2 className="text-xl font-bold text-slate-900">Activité Récente</h2>
                <p className="text-xs text-slate-500 mt-0.5">{total} projet(s) créé(s) au total</p>
              </div>
              {ebooks.length > 0 && (
                <a href="/dashboard/projets" className="group flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">
                  Voir tout <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
                </a>
              )}
            </div>
            {ebooks.length > 0 ? (
              <div className="space-y-3">
                {ebooks.slice(0, 4).map((ebook) => <ProjectCard key={ebook._id} ebook={ebook} />)}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>

          {/* Sidebar */}
          <aside className="space-y-4">

            {/* Crédits & Plan */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-base text-neutral-900">
                <Coins className="w-4 h-4 text-indigo-600" /> Crédits & Plan
              </h3>
              <div className="flex items-center justify-between mb-3">
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full border ${PLAN_BADGE[plan] || PLAN_BADGE.free}`}>
                  {PLAN_LABELS[plan] || "Gratuit"}
                </span>
                <a href="/dashboard/tarifs" className="text-xs text-indigo-600 hover:underline">Changer →</a>
              </div>
              <div className="flex items-center justify-between p-3 bg-indigo-50 border border-indigo-100 rounded-xl mb-3">
                <span className="text-sm text-indigo-700 font-medium">Solde</span>
                {creditsReady ? (
                  <span className="text-2xl font-black text-indigo-700">{balance} <span className="text-sm font-medium">cr.</span></span>
                ) : (
                  <div className="w-16 h-7 bg-indigo-200 rounded animate-pulse" />
                )}
              </div>
              {history.length > 0 && (
                <div className="mb-3 space-y-1.5">
                  <p className="text-[10px] text-slate-400 uppercase tracking-wider font-semibold">Dernières opérations</p>
                  {history.map((tx, i) => (
                    <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-slate-50 last:border-0">
                      <span className="text-slate-500 truncate max-w-[140px]">{tx.description || tx.purpose}</span>
                      <span className={`font-bold ${tx.amount > 0 ? "text-emerald-600" : "text-red-500"}`}>
                        {tx.amount > 0 ? "+" : ""}{tx.amount}
                      </span>
                    </div>
                  ))}
                </div>
              )}
              <div className="flex gap-2">
                <a href="/dashboard/tarifs" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold transition-all">
                  <Plus className="w-3.5 h-3.5" /> Acheter
                </a>
                <a href="/dashboard/credits" className="flex-1 flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
                  <History className="w-3.5 h-3.5" /> Historique
                </a>
              </div>
            </div>

            {/* Vue d'ensemble */}
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-base text-neutral-900">
                <BarChart3 className="w-4 h-4 text-purple-600" /> Vue d'ensemble
              </h3>
              <div className="space-y-2">
                <StatRow label="Projets Terminés"  value={kits}    icon={CheckCircle2} color="text-emerald-600" />
                <StatRow label="Projets En Cours"   value={enCours} icon={Clock}        color="text-amber-600" />
                <StatRow label="Crédits restants"   value={creditsReady ? balance : "…"} icon={Coins} color="text-indigo-600" />
                <StatRow
                  label="Boutique"
                  value={shop?.isPublished ? "Publiée ✓" : shop ? "Brouillon" : "—"}
                  icon={Store}
                  color={shop?.isPublished ? "text-emerald-600" : "text-slate-400"}
                />
              </div>
              {shop ? (
                <a href="/dashboard/smart-shop/boutique" className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-bold transition-all">
                  Gérer ma boutique <ChevronRight className="w-3 h-3" />
                </a>
              ) : (
                <a href="/dashboard/smart-shop/boutique" className="mt-3 w-full flex items-center justify-center gap-1.5 py-2 bg-fuchsia-600 hover:bg-fuchsia-700 text-white rounded-lg text-xs font-bold transition-all">
                  <Plus className="w-3.5 h-3.5" /> Créer ma boutique
                </a>
              )}
            </div>

            <TipCard />
          </aside>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────
// SOUS-COMPOSANTS
// ─────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-pulse">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        <div className="h-64 bg-slate-200 rounded-2xl w-full border border-slate-300" />
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1,2,3,4,5,6,7,8].map((i) => <div key={i} className="h-24 bg-slate-200 rounded-xl border border-slate-300" />)}
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl border border-slate-300" />
          <div className="space-y-4">
            <div className="h-52 bg-slate-200 rounded-2xl border border-slate-300" />
            <div className="h-40 bg-slate-200 rounded-2xl border border-slate-300" />
          </div>
        </div>
      </div>
    </div>
  );
}

function QuickLink({ href, icon: Icon, title, subtitle, color }) {
  return (
    <a href={href} className="group bg-white border border-slate-200 rounded-xl p-4 hover:shadow-lg hover:border-indigo-300 transition-all flex items-center gap-4 hover:-translate-y-0.5">
      <div className={`w-10 h-10 ${color} bg-opacity-10 rounded-lg flex items-center justify-center flex-shrink-0`}>
        <Icon className="w-5 h-5" />
      </div>
      <div>
        <h3 className="font-bold text-sm text-slate-900 group-hover:text-indigo-600">{title}</h3>
        <p className="text-xs text-slate-500 mt-0.5">{subtitle}</p>
      </div>
      <ChevronRight className="w-4 h-4 text-slate-400 ml-auto group-hover:translate-x-1 transition-transform" />
    </a>
  );
}

function ProjectCard({ ebook }) {
  const isCompleted = !!ebook.fileUrl;
  const statusConfig = isCompleted
    ? { icon: CheckCircle2, gradient: "from-emerald-500 to-emerald-600", text: "text-emerald-700" }
    : { icon: Clock,        gradient: "from-amber-500 to-amber-600",    text: "text-amber-700" };
  const StatusIcon = statusConfig.icon;
  return (
    <div className="group bg-white border border-neutral-200 rounded-xl p-4 hover:shadow-md transition-all flex items-center justify-between">
      <div className="flex items-center gap-4 flex-1 min-w-0">
        <div className={`w-10 h-10 bg-gradient-to-br ${statusConfig.gradient} rounded-lg flex items-center justify-center text-white flex-shrink-0`}>
          <BookOpen className="w-5 h-5" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="font-semibold text-sm text-neutral-900 truncate group-hover:text-indigo-600 transition-colors">{ebook.title}</h3>
          <div className="flex items-center gap-2 mt-0.5">
            <span className={`inline-flex items-center gap-1 text-[10px] font-bold ${statusConfig.text}`}>
              <StatusIcon className="w-3 h-3" />
              {isCompleted ? "Terminé" : "En cours"}
            </span>
            <span className="text-[10px] text-neutral-500 flex items-center gap-1">
              <Calendar className="w-3 h-3" />
              {new Date(ebook.createdAt).toLocaleDateString("fr-FR")}
            </span>
          </div>
        </div>
      </div>
      <a href={`/dashboard/fichiers/${ebook._id}`} className="flex items-center gap-1.5 px-3 py-1.5 bg-neutral-100 hover:bg-neutral-200 text-neutral-700 rounded-lg font-medium text-xs transition-all flex-shrink-0">
        <Eye className="w-3.5 h-3.5" /> Détails
      </a>
    </div>
  );
}

function StatRow({ label, value, icon: Icon, color }) {
  return (
    <div className="flex items-center justify-between p-2 bg-neutral-50/50 rounded-lg hover:bg-neutral-100/50 transition-colors border border-neutral-100">
      <div className="flex items-center gap-2">
        <Icon className={`w-4 h-4 ${color}`} />
        <span className="text-sm text-neutral-700 font-medium">{label}</span>
      </div>
      <span className="text-sm font-bold text-neutral-900">{value}</span>
    </div>
  );
}

function TipCard() {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
      <h3 className="font-bold mb-3 flex items-center gap-2 text-base text-neutral-900">
        <Lightbulb className="w-4 h-4 text-yellow-500" /> Conseils stratégiques
      </h3>
      <div className="space-y-3">
        <TipRow text="Utilise l'Analyseur de Niche pour garantir la rentabilité avant de commencer." icon={TargetIcon} color="text-blue-600" />
        <TipRow text="Publie ta boutique Smart Shop pour activer ton lien de vente (5 crédits)." icon={Store} color="text-fuchsia-600" />
      </div>
    </div>
  );
}

function TipRow({ text, icon: Icon, color }) {
  return (
    <div className="flex items-start gap-3 p-2 bg-neutral-50 rounded-lg border border-neutral-100">
      <div className={`w-6 h-6 flex items-center justify-center rounded-md flex-shrink-0 ${color} bg-opacity-10`}>
        <Icon className="w-3.5 h-3.5" />
      </div>
      <p className="text-xs text-neutral-700 leading-relaxed font-medium">{text}</p>
    </div>
  );
}

function EmptyState() {
  return (
    <div className="relative bg-white border-2 border-dashed border-neutral-300 rounded-xl p-8 text-center">
      <div className="w-12 h-12 mx-auto mb-3 bg-indigo-100 rounded-xl flex items-center justify-center">
        <Rocket className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">Aucun projet trouvé</h3>
      <p className="text-neutral-600 mb-4 max-w-sm mx-auto text-sm">Lancez votre premier projet d'eBook pour voir l'activité récente.</p>
      <a href="/dashboard/projets/nouveau" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg">
        <Rocket className="w-4 h-4" /> Créer maintenant
      </a>
    </div>
  );
}