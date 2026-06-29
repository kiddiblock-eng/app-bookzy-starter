// app/(marketing)/page.js
"use client";

import { useEffect, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import Hero from "@/app/(marketing)/components/Hero";
import Usages from "@/app/(marketing)/components/Usages";
import HowitWork from "@/app/(marketing)/components/HowitWork";
import Pricing from "@/app/(marketing)/components/Pricing";
import FAQ from "@/app/(marketing)/components/FAQ";
import CTA from "@/app/(marketing)/components/CTA";

function AffiliateTracker() {
  const searchParams = useSearchParams();

  useEffect(() => {
    const refCode = searchParams.get("ref");

    if (refCode) {
      const date = new Date();
      date.setTime(date.getTime() + (30 * 24 * 60 * 60 * 1000));
      const expires = "expires=" + date.toUTCString();
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
      <Usages />
      <HowitWork />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}
