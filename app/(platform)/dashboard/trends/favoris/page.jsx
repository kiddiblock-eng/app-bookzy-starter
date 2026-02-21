"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TrendCard from "../../../components/TrendCard";
import { Heart, Loader2, ArrowLeft } from "lucide-react";

export default function FavorisPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        const res = await fetch("/api/trends/get?filter=favorites", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          setFavorites(data.trends || []);
        }
      } catch (error) {
        console.error("❌ Erreur favoris:", error);
      } finally {
        setLoading(false);
      }
    }

    loadFavorites();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <Loader2 className="w-6 h-6 text-slate-400 animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-5xl mx-auto px-4 py-8">
        
        {/* Header */}
        <div className="mb-8">
          <button
            onClick={() => router.push("/dashboard/trends")}
            className="flex items-center gap-2 text-slate-500 hover:text-slate-900 transition-colors mb-6"
          >
            <ArrowLeft className="w-4 h-4" />
            <span className="text-sm font-medium">Retour aux tendances</span>
          </button>

          <div className="flex items-center gap-4">
            <div className="w-12 h-12 bg-slate-900 rounded-xl flex items-center justify-center">
              <Heart className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-slate-900">Favoris</h1>
              <p className="text-sm text-slate-500">
                {favorites.length} idée{favorites.length > 1 ? "s" : ""} sauvegardée{favorites.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>

        {/* Content */}
        {favorites.length === 0 ? (
          <div className="text-center py-20">
            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <Heart className="w-8 h-8 text-slate-400" />
            </div>
            <h2 className="text-lg font-semibold text-slate-900 mb-2">
              Aucun favori
            </h2>
            <p className="text-slate-500 mb-6">
              Sauvegarde des tendances pour les retrouver ici
            </p>
            <button
              onClick={() => router.push("/dashboard/trends")}
              className="px-6 py-3 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-medium transition-colors"
            >
              Découvrir les tendances
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {favorites.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}