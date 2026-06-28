"use client";
// L'accueil EST la page focus Claude : champ central de création d'ebook.
// On réutilise le flux de création (stepper conversationnel + aperçu + déblocage).
import CreateEbookFlow from "./projets/nouveau/page";

export default function DashboardHome() {
  return <CreateEbookFlow />;
}
