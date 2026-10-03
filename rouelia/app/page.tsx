import type { Metadata } from "next";
import { indexedPage } from "@/lib/seo";
import { faqJsonLd, ldString, softwareJsonLd } from "@/lib/jsonld";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { Problem } from "@/components/sections/Problem";
import { DemoBlock } from "@/components/sections/DemoBlock";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Features } from "@/components/sections/Features";
import { SimulatorBlock } from "@/components/sections/SimulatorBlock";
import { Founder } from "@/components/sections/Founder";
import { Pricing } from "@/components/sections/Pricing";
import { Support } from "@/components/sections/Support";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";

export const metadata: Metadata = indexedPage("/");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(softwareJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(faqJsonLd()) }} />
      <Nav />
      <main id="contenu">
        <Hero />
        <Problem />
        <DemoBlock />
        <HowItWorks />
        <Features />
        <SimulatorBlock />
        <Founder />
        <Pricing />
        <Support />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
