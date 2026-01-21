// app/(marketing)/page.js
"use client";

import { useEffect, Suspense } from "react"; // ✅ IMPORT 1
import { useSearchParams } from "next/navigation"; // ✅ IMPORT 2

import Hero from "@/app/(marketing)/components/Hero";
import Demo from "@/app/(marketing)/components/Demo";
import FeaturesSection from "@/app/(marketing)/components/FeaturesSection";
import Exemplesection from "@/app/(marketing)/components/Exemplesection";
import HowitWork from "@/app/(marketing)/components/HowitWork";
import Pricing from "@/app/(marketing)/components/Pricing";
import PourquoiBookzy from "@/app/(marketing)/components/PourquoiBookzy";
import FAQ from "@/app/(marketing)/components/FAQ";
import Testimonials from "@/app/(marketing)/components/Testimonials";
import CTA from "@/app/(marketing)/components/CTA";

// ✅ COMPOSANT INVISIBLE QUI GÈRE LE COOKIE
// On le sépare pour ne pas ralentir le chargement de la page principale
function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    
    if (refCode) {
      // On crée un cookie qui expire dans 30 jours
      const date = new Date();
      date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      
      // Le cookie s'appelle "bookzy_ref" (comme dans l'API register)
      document.cookie = `bookzy_ref=${refCode}; ${expires}; path=/; SameSite=Lax`;
      
      console.log("🍪 Cookie Affiliation installé :", refCode);
    }
  }, [searchParams]);

  return null; // Ce composant n'affiche rien
}

export default function HomePage() {
  return (
    <>
      {/* ✅ ON PLACE LE TRACKER ICI AVEC SUSPENSE */}
      {/* Suspense est obligatoire quand on utilise useSearchParams sur la home */}
      <Suspense fallback={null}>
        <AffiliateTracker />
      </Suspense>

      <Hero />
      <Demo />
      <Exemplesection />
      <FeaturesSection />
      <HowitWork />
      <PourquoiBookzy />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}