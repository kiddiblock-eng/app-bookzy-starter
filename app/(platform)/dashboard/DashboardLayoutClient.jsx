"use client";
import { useState, useEffect } from "react";
import DashboardSidebar from "@/components/DashboardSidebar";
import DashboardHeader from "@/components/DashboardHeader";
import FloatingCreateButton from "@/components/FloatingCreateButton";

export default function DashboardLayoutClient({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [annonce, setAnnonce] = useState(null);

  // 🔄 Récupération automatique de l’annonce depuis ton backend
  useEffect(() => {
    async function fetchAnnonce() {
      try {
        const res = await fetch("/api/annonce");
        const data = await res.json();
        if (data.active) setAnnonce(data);
      } catch (error) {
        console.error("Erreur lors du chargement de l’annonce :", error);
      }
    }
    fetchAnnonce();
  }, []);

  return (
    <div className="flex min-h-screen overflow-hidden bg-gray-50 dark:bg-black">
      {/* 🧭 Barre latérale */}
      <DashboardSidebar open={sidebarOpen} setOpen={setSidebarOpen} />

      {/* 🧱 Contenu principal */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        {/* 🔝 En-tête */}
        <DashboardHeader onToggleSidebar={() => setSidebarOpen(!sidebarOpen)} />

        {/* 🔔 Bannière d’annonce (affichée si active) */}
        {annonce && annonce.type === "banner" && (
          <div
            className="text-white text-sm text-center py-2 cursor-pointer"
            style={{ backgroundColor: annonce.color || "#2563eb" }}
            onClick={() => annonce.link && window.open(annonce.link, "_blank")}
          >
            {annonce.message}
          </div>
        )}

        {/* 💡 Contenu principal */}
        <main className="flex-1 p-4 sm:p-6 overflow-y-auto overflow-x-hidden">
          <div className="max-w-3xl mx-auto w-full">{children}</div>
        </main>

        {/* 🪟 Popup d’annonce (si type = popup) */}
        {annonce && annonce.type === "popup" && (
          <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center">
            <div className="bg-white dark:bg-neutral-900 p-6 rounded-lg shadow-xl max-w-sm text-center">
              <h3 className="text-lg font-semibold mb-2">Annonce Bookzy</h3>
              <p className="text-sm text-neutral-600 dark:text-neutral-400 mb-4">
                {annonce.message}
              </p>
              {annonce.link && (
                <a
                  href={annonce.link}
                  target="_blank"
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
                >
                  En savoir plus
                </a>
              )}
            </div>
          </div>
        )}

        {/* ➕ Bouton flottant (fixe et stable sur mobile) */}
        <FloatingCreateButton />
      </div>
    </div>
  );
}