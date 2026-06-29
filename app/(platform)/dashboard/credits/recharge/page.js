import { redirect } from "next/navigation";

// Ancienne page de recharge supprimée : tout passe par les offres (en ebooks).
export default function RechargeRedirect() {
  redirect("/dashboard/tarifs");
}
