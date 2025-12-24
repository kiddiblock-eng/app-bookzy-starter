"use client";

import { useState, useEffect } from "react";
import useSWR from "swr"; 
import { 
  BookOpen, Sparkles, ArrowRight, Rocket, Package, 
  CheckCircle2, Clock, BarChart3, Target as TargetIcon, 
  TrendingUp, Settings, Lightbulb, AlertCircle, Star, Crown, Eye, Calendar, ChevronRight
} from "lucide-react";

// Fetcher simple
const fetcher = (url) => fetch(url).then((r) => r.json());

export default function DashboardHome() {
  const [greeting, setGreeting] = useState("");

  // ✅ SWR : Chargement des données en parallèle
  const { data: userData, isLoading: userLoading } = useSWR("/api/profile/get", fetcher, { revalidateOnFocus: true });
  const { data: ebooksData, isLoading: ebooksLoading } = useSWR("/api/ebooks/user", fetcher, { revalidateOnFocus: true });

  const user = userData?.user || userData; 
  const ebooks = ebooksData?.ebooks || [];
  
  const total = ebooks.length;
  const kits = ebooks.filter(e => e.fileUrl).length;
  const enCours = total - kits;
  const progression = Math.min((total / 5) * 100, 100);

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
  const niveau = total < 3 ? "Débutant" : total < 5 ? "Intermédiaire" : "Expert";

  // ✅ Affichage du Skeleton PENDANT le chargement (Rapide)
  if (userLoading || ebooksLoading) {
    return <DashboardSkeleton />;
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-fadeIn"> 
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* HERO SECTION */}
        <section className="relative bg-slate-900 border border-slate-700 rounded-2xl p-6 sm:p-8 shadow-xl shadow-slate-900/50">
           <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'linear-gradient(rgba(255, 255, 255, 0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255, 255, 255, 0.05) 1px, transparent 1px)', backgroundSize: '30px 30px' }}></div>
           <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-indigo-600/30 rounded-full blur-[150px] pointer-events-none"></div>
           <div className="relative z-10">
            <div className="flex flex-col lg:flex-row justify-between gap-8">
              <div className="flex-1 space-y-6">
                <div>
                  <p className="text-sm text-slate-400 mb-1">{greeting},</p>
                  <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 drop-shadow-lg">Bienvenue {formattedName}</h1>
                  <p className="text-base sm:text-lg text-slate-300 max-w-xl">Préparez-vous à lancer votre prochain produit gagnant en un temps record.</p>
                </div>
                <div className="flex flex-col sm:flex-row gap-3">
                  <a href="/dashboard/projets/nouveau" className="group inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl font-bold text-sm transition-all shadow-lg active:scale-[0.98]">
                    <Rocket className="w-4 h-4" /> Générer un ebook Pro <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </a>
                  <a href="/dashboard/fichiers" className="inline-flex items-center justify-center gap-2 px-6 py-3.5 bg-white/10 border border-white/20 hover:bg-white/20 text-white rounded-xl font-bold text-sm transition-all">
                    <Package className="w-4 h-4" /> Mes fichiers
                  </a>
                </div>
              </div>
              <div className="lg:w-80 border border-slate-700 rounded-xl p-5 bg-slate-800 shadow-inner">
                <div className="flex items-center justify-between mb-4">
                  <div>
                    <p className="text-sm font-bold text-slate-400 mb-1">NIVEAU DE MAÎTRISE</p>
                    <p className="text-2xl font-black text-white flex items-center gap-2">{niveau}
                      <div className="w-6 h-6 text-yellow-500">{total < 5 ? <Star className="w-full h-full fill-yellow-500" /> : <Crown className="w-full h-full fill-yellow-500" />}</div>
                    </p>
                  </div>
                  <span className="text-3xl font-black text-cyan-400">{Math.round(progression)}%</span>
                </div>
                <div className="relative h-2.5 bg-slate-700 rounded-full overflow-hidden mb-2"><div className="absolute inset-0 bg-cyan-400 rounded-full transition-all duration-700 shadow-lg shadow-cyan-400/50" style={{ width: `${progression}%` }}></div></div>
                <p className="text-xs text-slate-500 font-medium flex items-center gap-1.5"><TargetIcon className="w-3 h-3 text-slate-500" />{total < 5 ? `Encore ${5 - total} projets pour atteindre le niveau Expert.` : "Félicitations, niveau Expert atteint !"}</p>
              </div>
            </div>
           </div>
        </section>

        {/* QUICK LINKS */}
        <section className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <QuickLink icon={BarChart3} title="Mes Projets" subtitle="Historique des créations" href="/dashboard/projets" color="text-indigo-600" />
          <QuickLink icon={TargetIcon} title="Analyseur de Niche" subtitle="Trouver des idées rentables" href="/dashboard/niche-hunter" color="text-emerald-600" />
          <QuickLink icon={TrendingUp} title="Tendances Virales" subtitle="Détecter les sujets porteurs" href="/dashboard/trends" color="text-orange-600" />
          <QuickLink icon={Settings} title="Paramètres" subtitle="Gérer mon compte & facturation" href="/dashboard/parametres" color="text-slate-600" />
        </section>

        {/* CONTENT GRID */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <section className="lg:col-span-2 space-y-4 bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div><h2 className="text-xl font-bold text-slate-900">Activité Récente</h2><p className="text-xs text-slate-500 mt-0.5">{total} projet(s) créé(s) au total</p></div>
              {ebooks.length > 0 && (<a href="/dashboard/projets" className="group flex items-center gap-1 px-3 py-1.5 text-xs font-medium text-indigo-600 hover:bg-indigo-50 rounded-lg transition-all">Voir tout <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" /></a>)}
            </div>
            {ebooks.length > 0 ? (
              <div className="space-y-3">
                {ebooks.slice(0, 4).map((ebook) => (
                  <ProjectCard key={ebook._id} ebook={ebook} />
                ))}
              </div>
            ) : (
              <EmptyState />
            )}
          </section>

          <aside className="space-y-4">
            <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm">
              <h3 className="font-bold mb-3 flex items-center gap-2 text-base text-neutral-900"><BarChart3 className="w-4 h-4 text-purple-600" />Vue d'ensemble</h3>
              <div className="space-y-2">
                <StatRow label="Projets Terminés" value={kits} icon={CheckCircle2} color="text-emerald-600" />
                <StatRow label="Projets En Cours" value={enCours} icon={Clock} color="text-amber-600" />
                <StatRow label="Nouveaux depuis 7j" value={0} icon={Calendar} color="text-blue-600" />
              </div>
            </div>
            <TipCard />
          </aside>
        </div>
      </div>
    </div>
  );
}

// ──────────────────────────────────────────────
// SOUS-COMPOSANTS & SKELETON (Tout est ici)
// ──────────────────────────────────────────────

function DashboardSkeleton() {
  return (
    <div className="min-h-screen bg-slate-50 pb-20 animate-pulse">
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 space-y-8">
        
        {/* HERO SKELETON */}
        <div className="h-64 bg-slate-200 rounded-2xl w-full border border-slate-300"></div>

        {/* QUICK LINKS SKELETON */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl border border-slate-300"></div>
          ))}
        </div>

        {/* MAIN CONTENT SKELETON */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 h-96 bg-slate-200 rounded-2xl border border-slate-300"></div>
          <div className="space-y-4">
             <div className="h-40 bg-slate-200 rounded-2xl border border-slate-300"></div>
             <div className="h-40 bg-slate-200 rounded-2xl border border-slate-300"></div>
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
    : { icon: Clock, gradient: "from-amber-500 to-amber-600", text: "text-amber-700" };
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
        <Eye className="w-3.5 h-3.5" />
        Détails
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
        <Lightbulb className="w-4 h-4 text-yellow-500" />
        Conseils stratégiques
      </h3>
      <div className="space-y-3">
        <TipRow text="Utilise l'Analyseur de Niche pour garantir la rentabilité avant de commencer." icon={TargetIcon} color="text-blue-600"/>
        <TipRow text="Vérifie les scripts marketing générés pour maximiser tes conversions." icon={AlertCircle} color="text-green-600"/>
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
        <Sparkles className="w-6 h-6 text-indigo-600" />
      </div>
      <h3 className="text-lg font-bold text-neutral-900 mb-2">Aucun projet trouvé</h3>
      <p className="text-neutral-600 mb-4 max-w-sm mx-auto text-sm">Lancez votre premier projet d'eBook pour voir l'activité récente.</p>
      <a href="/dashboard/projets/nouveau" className="inline-flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-indigo-600 text-white rounded-xl font-bold text-sm transition-all shadow-lg">
        <Rocket className="w-4 h-4" />
        Créer maintenant
      </a>
    </div>
  );
}