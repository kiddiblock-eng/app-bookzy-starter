// app/(marketing)/page.js
"use client";

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

export default function HomePage() {
  return (
    <>
      <Hero />
      <Demo />
      <FeaturesSection />
      <Exemplesection />
      <HowitWork />
      <PourquoiBookzy />
      <Testimonials />
      <Pricing />
      <FAQ />
      <CTA />
    </>
  );
}