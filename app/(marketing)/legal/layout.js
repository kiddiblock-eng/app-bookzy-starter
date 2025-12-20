"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export default function LegalLayout({ children }) {
  const pathname = usePathname();

  // Reset le scroll en haut de page lors d'un changement de page légale
  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return (
    <div className="legal-root">
      {/* On retire le header et le footer ici car ils sont déjà inclus 
         avec un design plus riche dans chaque page individuelle.
         Le layout sert maintenant de "conteneur de confiance".
      */}
      
      <main className="animate-in fade-in duration-700">
        {children}
      </main>

      {/* Style global pour les pages légales si nécessaire */}
      <style jsx global>{`
        .legal-root {
          scroll-behavior: smooth !important;
        }
      `}</style>
    </div>
  );
}