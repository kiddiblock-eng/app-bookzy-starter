import { redirect } from "next/navigation";

// Onboarding supprimé : on va directement au dashboard.
export default function SetupStep2() {
  redirect("/dashboard");
}
