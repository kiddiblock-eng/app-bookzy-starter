"use client";

import { useEffect } from "react";
import { useSWRConfig } from "swr";

// Au retour d'un paiement (URL ...?status=success), on revalide le solde et le profil
// plusieurs fois pour attraper le crédit du webhook (asynchrone) → compteur à jour tout de suite.
export default function BalanceSync() {
  const { mutate } = useSWRConfig();

  useEffect(() => {
    if (typeof window === "undefined") return;
    const params = new URLSearchParams(window.location.search);
    if (params.get("status") !== "success") return;

    const refresh = () => {
      mutate("/api/credits/balance");
      mutate("/api/profile/get");
    };
    refresh();
    const t1 = setTimeout(refresh, 2500);
    const t2 = setTimeout(refresh, 6000);
    return () => { clearTimeout(t1); clearTimeout(t2); };
  }, [mutate]);

  return null;
}
