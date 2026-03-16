"use client";

import { useState } from "react";
import useSWR from "swr";

const fetcher = (url) => fetch(url, { credentials: "include" }).then((r) => r.json());

// Coût de chaque action
export const CREDIT_COSTS = {
  ebook_generate:  20,
  express_layout:  10,
  smart_shop:       5,
  niche_hunter:     1, // quota journalier, pas de débit crédit
  niche_analyze:    1, // idem
  youbook:          1, // idem
};

export function useCredits() {
  const [showModal, setShowModal] = useState(false);
  const [modalAction, setModalAction] = useState(null);

  const { data, mutate } = useSWR("/api/credits/balance", fetcher, {
    revalidateOnFocus: false,
    dedupingInterval: 10000,
  });

  const balance = data?.credits?.balance ?? null;
  const plan    = data?.plan ?? null;

  /**
   * Vérifie si l'utilisateur a assez de crédits pour une action.
   * Si oui → exécute fn()
   * Si non → ouvre la modal
   * @param {string} action — clé de CREDIT_COSTS
   * @param {Function} fn — callback à exécuter si OK
   */
  const requireCredits = (action, fn) => {
    const cost = CREDIT_COSTS[action] ?? 0;

    // Pas de débit crédit pour les outils à quota journalier
    if (cost === 0 || cost === 1) {
      fn();
      return;
    }

    if (balance === null) {
      // Données pas encore chargées — on laisse passer, l'API vérifiera
      fn();
      return;
    }

    if (balance < cost) {
      setModalAction({ action, cost });
      setShowModal(true);
      return;
    }

    fn();
  };

  /**
   * Vérifie côté client uniquement (pour griser un bouton par exemple)
   */
  const canAfford = (action) => {
    const cost = CREDIT_COSTS[action] ?? 0;
    if (cost <= 1) return true;
    if (balance === null) return true;
    return balance >= cost;
  };

  return {
    balance,
    plan,
    mutateBalance: mutate,
    requireCredits,
    canAfford,
    showModal,
    setShowModal,
    modalAction,
  };
}