import { redirect } from "next/navigation";

// Onboarding supprimé : on va directement au dashboard.
export default function SetupStep1() {
  redirect("/dashboard");
}
