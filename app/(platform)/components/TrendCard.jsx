"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Heart, ArrowUpRight, TrendingUp } from "lucide-react";

export default function TrendCard({ trend }) {
  const router = useRouter();
  const [isFavorite, setIsFavorite] = useState(trend?.isFavorite || false);

  const safeTrend = {
    id: trend?.id || trend?._id,
    title: trend?.title || 'Sans titre',
    description: trend?.description || '',
    network: trend?.network || '',
    potential: trend?.potential || 0,
    difficulty: trend?.difficulty || 'Moyen',
    growth: trend?.growth || 0,
    isHot: Boolean(trend?.isHot),
    isRising: Boolean(trend?.isRising),
    trendDate: trend?.trendDate || null,
  };

  const getDifficultyStyle = (difficulty) => {
    const diff = difficulty.toLowerCase();
    if (diff.includes('facile') || diff.includes('easy')) return 'text-emerald-600 bg-emerald-50';
    if (diff.includes('difficile') || diff.includes('hard')) return 'text-red-600 bg-red-50';
    return 'text-amber-600 bg-amber-50';
  };

  const formatPotential = (value) => {
    if (value >= 1000000) return `${(value / 1000000).toFixed(1)}M`;
    if (value >= 1000) return `${(value / 1000).toFixed(0)}K`;
    return value.toLocaleString();
  };

  const handleClick = () => {
    const params = new URLSearchParams({
      suggestion: safeTrend.title,
      description: safeTrend.description,
    });
    router.push(`/dashboard/projets/nouveau?${params.toString()}`);
  };

  const toggleFavorite = async (e) => {
    e.stopPropagation();
    try {
      const res = await fetch("/api/trends/favorites", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({
          trendId: safeTrend.id,
          action: isFavorite ? "remove" : "add",
        }),
      });
      const data = await res.json();
      if (data.success) setIsFavorite(!isFavorite);
    } catch (error) {
      console.error("Erreur toggle favori:", error);
    }
  };

  const timeAgo = (date) => {
    if (!date) return '';
    const now = new Date();
    const diff = now - new Date(date);
    const days = Math.floor(diff / (1000 * 60 * 60 * 24));
    if (days === 0) return "Aujourd'hui";
    if (days === 1) return "Hier";
    if (days < 7) return `Il y a ${days}j`;
    if (days < 30) return `Il y a ${Math.floor(days / 7)} sem`;
    return `Il y a ${Math.floor(days / 30)} mois`;
  };

  return (
    <div 
      onClick={handleClick}
      className="bg-white border border-slate-200 rounded-xl p-4 hover:border-slate-300 hover:shadow-md transition-all cursor-pointer group"
    >
      {/* Top row - Network + Date + Favorite */}
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          {safeTrend.network && (
            <span className="text-xs text-slate-500">{safeTrend.network}</span>
          )}
          {safeTrend.trendDate && (
            <>
              <span className="text-slate-300">·</span>
              <span className="text-xs text-slate-400">{timeAgo(safeTrend.trendDate)}</span>
            </>
          )}
        </div>
        <button
          onClick={toggleFavorite}
          className={`p-1.5 rounded-lg transition-all ${
            isFavorite 
              ? "text-red-500" 
              : "text-slate-300 hover:text-slate-500"
          }`}
        >
          <Heart className="w-4 h-4" fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </div>

      {/* Title */}
      <h3 className="font-semibold text-slate-900 mb-1.5 line-clamp-2 group-hover:text-blue-600 transition-colors">
        {safeTrend.title}
      </h3>

      {/* Description */}
      {safeTrend.description && (
        <p className="text-sm text-slate-500 line-clamp-2 mb-4">
          {safeTrend.description}
        </p>
      )}

      {/* Stats row */}
      <div className="flex items-center gap-3 mb-4">
        {safeTrend.potential > 0 && (
          <div className="text-sm">
            <span className="font-semibold text-slate-900">${formatPotential(safeTrend.potential)}</span>
            <span className="text-slate-400 text-xs ml-1">potentiel</span>
          </div>
        )}
        
        {safeTrend.isRising && safeTrend.growth > 0 && (
          <div className="flex items-center gap-1 text-emerald-600 text-sm">
            <TrendingUp className="w-3.5 h-3.5" />
            <span className="font-medium">+{safeTrend.growth}%</span>
          </div>
        )}
      </div>

      {/* Bottom row - Difficulty + CTA */}
      <div className="flex items-center justify-between">
        <span className={`text-xs font-medium px-2 py-1 rounded-md ${getDifficultyStyle(safeTrend.difficulty)}`}>
          {safeTrend.difficulty}
        </span>
        
        <div className="flex items-center gap-1 text-sm text-slate-400 group-hover:text-blue-600 transition-colors">
          <span>Créer un ebook</span>
          <ArrowUpRight className="w-4 h-4" />
        </div>
      </div>
    </div>
  );
}