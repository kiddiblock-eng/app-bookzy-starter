"use client";

import { useEffect, useState } from "react";
import UpgradeModal from "./UpgradeModal";

/**
 * Hôte global du modal d'upgrade. Placé une seule fois dans le layout dashboard.
 * N'importe quelle page peut l'ouvrir via :
 *   window.dispatchEvent(new CustomEvent("bookzy:upgrade", { detail: { title, subtitle } }))
 */
export default function UpgradeModalHost() {
  const [open, setOpen] = useState(false);
  const [opts, setOpts] = useState({});

  useEffect(() => {
    const handler = (e) => {
      setOpts(e.detail || {});
      setOpen(true);
    };
    window.addEventListener("bookzy:upgrade", handler);
    return () => window.removeEventListener("bookzy:upgrade", handler);
  }, []);

  return (
    <UpgradeModal
      open={open}
      onClose={() => setOpen(false)}
      title={opts.title}
      subtitle={opts.subtitle}
    />
  );
}
