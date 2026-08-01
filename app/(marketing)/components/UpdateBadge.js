"use client";

import Link from "next/link";
import { ChevronRight } from "lucide-react";

// Badge "Nouvelle mise à jour" — bordure dégradée animée + texte dégradé qui défile.
// Recréé sans dépendance (équivalent Magic UI AnimatedGradientText). Cliquable → connexion.
export default function UpdateBadge() {
  return (
    <Link
      href="/auth/login"
      className="group relative inline-flex items-center justify-center rounded-full bg-white px-4 py-1.5 shadow-[inset_0_-8px_10px_#8fdfff1f] transition-shadow duration-500 ease-out hover:shadow-[inset_0_-5px_10px_#8fdfff3f]"
    >
      <style>{`
        @keyframes bzgrad { to { background-position: 200% center; } }
        .bz-grad { background-size: 300% 100%; animation: bzgrad 4s linear infinite; }
      `}</style>

      {/* Bordure dégradée animée (masque : on ne garde que le contour de 1px) */}
      <span
        aria-hidden
        className="bz-grad pointer-events-none absolute inset-0 block h-full w-full rounded-[inherit] bg-gradient-to-r from-emerald-500 via-neutral-900 to-emerald-500 p-[1px]"
        style={{
          WebkitMask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          WebkitMaskComposite: "destination-out",
          mask: "linear-gradient(#fff 0 0) content-box, linear-gradient(#fff 0 0)",
          maskComposite: "subtract",
        }}
      />

      {/* Texte dégradé animé */}
      <span className="bz-grad bg-gradient-to-r from-emerald-600 via-neutral-900 to-emerald-600 bg-clip-text text-sm font-medium text-transparent">
        Nouvelle mise à jour disponible
      </span>

      <ChevronRight className="ml-1 size-4 stroke-neutral-500 transition-transform duration-300 ease-in-out group-hover:translate-x-0.5" />
    </Link>
  );
}
