"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  TrendingUp,
  Target,
  ChevronDown,
  ChevronUp,
  Calendar,
  DollarSign,
  Users,
  BarChart3,
  Flame,
  Zap,
  ArrowRight,
  Eye,
  Heart, // ✅ Ajouter Heart
} from "lucide-react";

function sanitizeText(text) {
  if (!text || typeof text !== 'string') return '';
  return text.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&#x27;').replace(/\//g, '&#x2F;');
}

function safeNumber(value, defaultValue = 0) {
  const num = Number(value);
  return isNaN(num) || !isFinite(num) ? defaultValue : num;
}

export default function TrendCard({ trend }) {
  const router = useRouter();
  const [isExpanded, setIsExpanded] = useState(false);
  const [isFavorite, setIsFavorite] = useState(trend?.isFavorite || false); // ✅ État favori

  const safeTrend = {
    id: trend?.id || trend?._id,
    title: sanitizeText(trend?.title || 'Sans titre'),
    description: sanitizeText(trend?.description || 'Aucune description'),
    emoji: trend?.emoji || '📊',
    network: sanitizeText(trend?.network || ''),
    period: sanitizeText(trend?.period || ''),
    gradient: trend?.gradient || 'from-purple-500 to-fuchsia-500',
    potential: safeNumber(trend?.potential, 0),
    difficulty: sanitizeText(trend?.difficulty || 'Moyen'),
    searches: safeNumber(trend?.searches, 0),
    competition: sanitizeText(trend?.competition || 'Moyen'),
    growth: safeNumber(trend?.growth, 0),
    isHot: Boolean(trend?.isHot),
    isRising: Boolean(trend?.isRising),
    trendDate: trend?.trendDate || null,
    categories: Array.isArray(trend?.categories) ? trend.categories.slice(0, 10) : [],
    tags: Array.isArray(trend?.tags) ? trend.tags.slice(0, 15) : [],
    sources: Array.isArray(trend?.sources) ? trend.sources.slice(0, 5) : [],
  };

  const getDifficultyColor = (difficulty) => {
    const diff = difficulty.toLowerCase();
    if (diff.includes('facile') || diff.includes('easy') || diff.includes('bas')) return 'from-green-500 to-emerald-500';
    if (diff.includes('difficile') || diff.includes('hard') || diff.includes('élevé')) return 'from-red-500 to-pink-500';
    return 'from-amber-500 to-orange-500';
  };

  const formatSearchVolume = (volume) => {
    if (volume >= 1000000) return `${(volume / 1000000).toFixed(1)}M`;
    if (volume >= 1000) return `${(volume / 1000).toFixed(1)}K`;
    return volume.toString();
  };

  const handleCreateProject = () => {
    try {
      const params = new URLSearchParams({
        suggestion: safeTrend.title,
        description: safeTrend.description,
      });
      router.push(`/dashboard/projets/nouveau?${params.toString()}`);
    } catch (error) {
      console.error('Navigation error:', error);
    }
  };

  // ✅ Toggle Favori
  const toggleFavorite = async () => {
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

      if (data.success) {
        setIsFavorite(!isFavorite);
      } else {
        console.error("Erreur favori:", data.error);
      }
    } catch (error) {
      console.error("Erreur toggle favori:", error);
    }
  };

  return (
    <div className="group bg-gradient-to-br from-[#1a1a2e] to-[#16162a] rounded-2xl border border-white/10 shadow-xl hover:shadow-purple-500/20 transition-all duration-300 overflow-hidden">
      
      {/* Header */}
      <div className={`relative h-24 bg-gradient-to-br ${safeTrend.gradient} p-3`}>
        <div className="absolute inset-0 bg-black/10" />
        
        <div className="relative flex items-start justify-between mb-2">
          <div className="flex flex-wrap gap-1.5">
            {safeTrend.isHot && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-red-500 text-white rounded-lg text-[10px] font-bold">
                <Flame size={10} />
                HOT
              </span>
            )}
            {safeTrend.isRising && safeTrend.growth > 0 && (
              <span className="inline-flex items-center gap-1 px-2 py-0.5 bg-green-500 text-white rounded-lg text-[10px] font-bold">
                <TrendingUp size={10} />
                +{safeTrend.growth}%
              </span>
            )}
          </div>

          {safeTrend.network && (
            <span className="px-2 py-0.5 bg-white/20 backdrop-blur-md text-white rounded-lg text-[10px] font-bold">
              {safeTrend.network}
            </span>
          )}
        </div>

        <div className="relative flex items-center gap-2">
          <div className="w-10 h-10 bg-white/20 backdrop-blur-xl rounded-xl flex items-center justify-center shadow-lg">
            <span className="text-xl">{safeTrend.emoji}</span>
          </div>
          {safeTrend.period && (
            <span className="px-2 py-0.5 bg-black/30 backdrop-blur-md text-white rounded-lg text-[10px] font-bold">
              {safeTrend.period}
            </span>
          )}
        </div>
      </div>

      {/* Content */}
      <div className="p-4 space-y-3">
        
        {/* Title */}
        <div>
          <h3 className="font-bold text-base text-white mb-1 line-clamp-2 group-hover:text-purple-300 transition-colors">
            {safeTrend.title}
          </h3>
          <p className="text-xs text-gray-400 line-clamp-2">
            {safeTrend.description}
          </p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-2 gap-2">
          
          <div className="bg-gradient-to-br from-green-500/10 to-emerald-500/10 border border-green-500/30 rounded-xl p-2">
            <div className="flex items-center gap-1 mb-1">
              <DollarSign size={12} className="text-green-400" />
              <span className="text-[10px] text-green-200 font-semibold uppercase">Potentiel</span>
            </div>
            <p className="text-sm font-black text-white">
              ${safeTrend.potential.toLocaleString('en-US')}
            </p>
          </div>

          <div className={`bg-gradient-to-br ${getDifficultyColor(safeTrend.difficulty)}/10 border ${getDifficultyColor(safeTrend.difficulty).replace('from-', 'border-').split(' ')[0]}/30 rounded-xl p-2`}>
            <div className="flex items-center gap-1 mb-1">
              <Target size={12} className="text-amber-400" />
              <span className="text-[10px] text-amber-200 font-semibold uppercase">Difficulté</span>
            </div>
            <p className="text-xs font-black text-white">
              {safeTrend.difficulty}
            </p>
          </div>

          <div className="bg-gradient-to-br from-blue-500/10 to-cyan-500/10 border border-blue-500/30 rounded-xl p-2">
            <div className="flex items-center gap-1 mb-1">
              <Users size={12} className="text-blue-400" />
              <span className="text-[10px] text-blue-200 font-semibold uppercase">Volume</span>
            </div>
            <p className="text-sm font-black text-white">
              {formatSearchVolume(safeTrend.searches)}
              <span className="text-[10px] text-gray-400 font-normal">/m</span>
            </p>
          </div>

          <div className="bg-gradient-to-br from-purple-500/10 to-fuchsia-500/10 border border-purple-500/30 rounded-xl p-2">
            <div className="flex items-center gap-1 mb-1">
              <BarChart3 size={12} className="text-purple-400" />
              <span className="text-[10px] text-purple-200 font-semibold uppercase">Concurrence</span>
            </div>
            <p className="text-xs font-black text-white">
              {safeTrend.competition}
            </p>
          </div>
        </div>

        {/* Date */}
        {safeTrend.trendDate && (
          <div className="flex items-center gap-1.5 px-2 py-1 bg-white/5 border border-white/10 rounded-lg">
            <Calendar size={10} className="text-purple-400" />
            <span className="text-[10px] text-gray-400">
              {new Date(safeTrend.trendDate).toLocaleDateString("fr-FR", {
                day: "numeric",
                month: "short",
                year: "numeric",
              })}
            </span>
          </div>
        )}

        {/* Expanded Details */}
        {isExpanded && (
          <div className="space-y-2 pt-2 border-t border-white/10">
            
            {safeTrend.categories.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-white mb-1">Catégories</p>
                <div className="flex flex-wrap gap-1">
                  {safeTrend.categories.map((cat, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-blue-500/20 border border-blue-500/40 text-blue-200 text-[10px] font-semibold rounded-lg"
                    >
                      {sanitizeText(cat)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {safeTrend.tags.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-white mb-1">Tags</p>
                <div className="flex flex-wrap gap-1">
                  {safeTrend.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-0.5 bg-white/5 border border-white/10 text-gray-300 text-[10px] rounded-lg"
                    >
                      #{sanitizeText(tag)}
                    </span>
                  ))}
                </div>
              </div>
            )}

            {safeTrend.sources.length > 0 && (
              <div>
                <p className="text-[10px] font-bold text-white mb-1">Sources</p>
                <div className="flex flex-wrap gap-1">
                  {safeTrend.sources.map((src, idx) => (
                    <span
                      key={idx}
                      className="px-2 py-0.5 bg-green-500/20 border border-green-500/40 text-green-200 text-[10px] rounded-lg"
                    >
                      {sanitizeText(src)}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toggle Button */}
        <button
          onClick={() => setIsExpanded(!isExpanded)}
          className="w-full py-2 bg-white/5 hover:bg-white/10 border border-white/10 rounded-xl flex items-center justify-center gap-1 text-xs font-bold text-white transition-all"
        >
          {isExpanded ? (
            <>
              Voir moins
              <ChevronUp className="w-3 h-3" />
            </>
          ) : (
            <>
              Voir détails
              <ChevronDown className="w-3 h-3" />
            </>
          )}
        </button>

        {/* Action Buttons */}
        <div className="flex gap-2">
          <button
            onClick={handleCreateProject}
            className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 bg-gradient-to-r from-purple-600 to-fuchsia-600 hover:from-purple-700 hover:to-fuchsia-700 text-white rounded-xl text-xs font-bold shadow-lg shadow-purple-500/30 hover:shadow-purple-500/50 transition-all"
          >
            <Zap size={12} />
            Créer
            <ArrowRight size={10} />
          </button>

          {/* ✅ Bouton Favori */}
          <button
            onClick={toggleFavorite}
            className={`px-3 py-2 rounded-xl transition-all ${
              isFavorite
                ? "bg-red-500/20 border-2 border-red-500 text-red-400"
                : "bg-white/5 hover:bg-white/10 border border-white/10 text-white hover:text-red-400"
            }`}
            title={isFavorite ? "Retirer des favoris" : "Ajouter aux favoris"}
          >
            <Heart size={14} fill={isFavorite ? "currentColor" : "none"} />
          </button>
        </div>
      </div>
    </div>
  );
}