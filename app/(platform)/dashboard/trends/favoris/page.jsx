"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import TrendCard from "../../../components/TrendCard";
import { Heart, Loader2, ArrowLeft, Sparkles, FolderOpen } from "lucide-react";

export default function FavorisPage() {
  const router = useRouter();
  const [favorites, setFavorites] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadFavorites() {
      try {
        // Charger toutes les tendances (qui incluent déjà isFavorite)
        const res = await fetch("/api/trends/get", {
          credentials: "include",
        });
        const data = await res.json();

        if (data.success) {
          // Filtrer uniquement les favoris
          const favs = data.trends.filter((t) => t.isFavorite);
          setFavorites(favs);
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
      <div className="min-h-screen bg-slate-50 flex items-center justify-center">
        <div className="flex flex-col items-center justify-center py-20">
          <Loader2 className="w-10 h-10 text-rose-600 animate-spin mb-4" />
          <p className="text-slate-600 font-medium text-sm">Chargement de votre collection...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 font-sans text-slate-900">
      
      {/* --- HEADER "COLLECTION PRIVÉE" --- */}
      <div className="bg-white border-b border-slate-200 shadow-sm pt-8 pb-12 mb-8">
        <div className="max-w-7xl mx-auto px-6">
          
          {/* Bouton retour propre */}
          <button
            onClick={() => router.push("/dashboard/trends")}
            className="group inline-flex items-center gap-2 px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold transition-all mb-6 active:scale-95 shadow-md"
          >
            <ArrowLeft size={16} />
            <span className="text-sm">Retour à l'Analyse</span>
          </button>

          {/* Titre fort */}
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 bg-rose-600/10 border border-rose-300 rounded-xl flex items-center justify-center flex-shrink-0 shadow-lg">
              <Heart className="w-8 h-8 text-rose-600 fill-rose-600" />
            </div>
            <div>
              <h1 className="text-3xl md:text-4xl font-black text-slate-900 tracking-tight">
                Collection Sauvegardée
              </h1>
              <p className="text-slate-600 text-sm mt-1">
                <span className="font-bold text-rose-600">{favorites.length}</span> idée{favorites.length > 1 ? "s" : ""} sélectionnée{favorites.length > 1 ? "s" : ""}
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-6 pb-12">
        {favorites.length === 0 ? (
          /* EMPTY STATE SPÉCIFIQUE ET IMPACTANT */
          <div className="flex flex-col items-center justify-center py-20 bg-white rounded-3xl border-2 border-dashed border-rose-200 shadow-xl">
            <div className="w-20 h-20 bg-rose-50 rounded-full flex items-center justify-center mb-6">
              <FolderOpen className="w-10 h-10 text-rose-500" />
            </div>
            <h2 className="text-2xl font-black text-slate-900 mb-3">
              Votre collection est vide
            </h2>
            <p className="text-slate-600 max-w-md text-center mb-8">
              Ajoutez vos meilleures opportunités pour les retrouver facilement ici.
            </p>
            <button
              onClick={() => router.push("/dashboard/trends")}
              className="inline-flex items-center gap-2 px-8 py-4 bg-slate-900 hover:bg-slate-800 text-white rounded-xl font-bold shadow-lg transition-all"
            >
              <Sparkles size={20} />
              Découvrir de nouvelles tendances
            </button>
          </div>
        ) : (
          /* GRILLE DES RÉSULTATS */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {favorites.map((trend) => (
              <TrendCard key={trend.id} trend={trend} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}