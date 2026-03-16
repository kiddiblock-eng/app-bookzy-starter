// app/(marketing)/page.js
"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Hero from "@/app/(marketing)/components/Hero";
import Exemplesection from "@/app/(marketing)/components/Exemplesection";
import HowitWork from "@/app/(marketing)/components/HowitWork";
import Pricing from "@/app/(marketing)/components/Pricing";
import PourquoiBookzy from "@/app/(marketing)/components/PourquoiBookzy";
import FAQ from "@/app/(marketing)/components/FAQ";
import Testimonials from "@/app/(marketing)/components/Testimonials";
import CTA from "@/app/(marketing)/components/CTA";
import TemplatesSection from "./components/TemplatesSection";
 
function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");
    
    if (refCode) {
      const date = new Date();
      date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
      
      // ✅ CORRIGÉ : Ajout de domain=.bookzy.io
      document.cookie = `bookzy_ref=${refCode}; ${expires}; path=/; domain=.bookzy.io; SameSite=Lax`;
      
      console.log("🍪 Cookie Affiliation installé :", refCode);
    }
  }, [searchParams]);

  return null;
}

export default function HomePage() {
  return (
    <>
      <Suspense fallback={null}>
        <AffiliateTracker />
      </Suspense>

      <Hero />

      <HowitWork />
      <TemplatesSection />
     <Exemplesection />
      <PourquoiBookzy />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}