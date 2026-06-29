import { redirect } from "next/navigation";

// La page "crédits" est supprimée : tout passe par les offres (en ebooks).
export default function CreditsPage() {
  redirect("/dashboard/tarifs");
}
