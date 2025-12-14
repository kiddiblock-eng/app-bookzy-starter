// app/(marketing)/page.js
"use client";

import Hero from "./components/Hero";
import Demo from "./components/Demo";
import FeaturesSection from "./components/FeaturesSection";
import ExamplesSection from "./components/Exemplesection";
import HowItWorks from "./components/HowitWork";
import Pricing from "./components/Pricing";
import PourquoiBookzy from "./components/PourquoiBookzy";
import FAQ from "./components/FAQ";
import Testimonials from "./components/Testimonials";
import CTA from "./components/CTA";
export default function HomePage() {
  return (
    <>
      <Hero />
      <Demo />
      <FeaturesSection />
      <ExamplesSection />
      <HowItWorks />
      <PourquoiBookzy />
       <Testimonials />
      <Pricing />
     
      <FAQ />
     <CTA/>
    </>
  );
}