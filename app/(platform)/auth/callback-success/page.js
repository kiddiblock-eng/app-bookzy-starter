"use client";
import { useEffect } from "react";
import { useRouter } from "next/navigation";

export default function CallbackSuccess() {
  const router = useRouter();

  useEffect(() => {
    // Nouveaux comptes (notamment Google) → onboarding "Par où commencer ?"
    router.push("/setup/step1");
  }, [router]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-neutral-50">
      <div className="text-center">
        <div className="w-16 h-16 border-4 border-neutral-900 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
        <p className="text-neutral-600 font-medium">Connexion réussie…</p>
      </div>
    </div>
  );
}
