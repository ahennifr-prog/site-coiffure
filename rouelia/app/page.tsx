import type { Metadata } from "next";
import { indexedPage } from "@/lib/seo";
import { faqJsonLd, ldString, softwareJsonLd } from "@/lib/jsonld";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { DemoBlock } from "@/components/sections/DemoBlock";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { Founder } from "@/components/sections/Founder";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { VideoShowcase } from "@/components/sections/VideoShowcase";
import { Marquee } from "@/components/sections/Marquee";
import { ScrollFx, fxBoot } from "@/components/ui/ScrollFx";

export const metadata: Metadata = indexedPage("/");

export default function Home() {
  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(softwareJsonLd()) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(faqJsonLd()) }} />
      <script dangerouslySetInnerHTML={{ __html: fxBoot }} />
      <ScrollFx />
      <div aria-hidden data-fx="progress" className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-tomette" style={{ transform: "scaleX(0)" }} />
      <Nav />
      <main id="contenu">
        <Hero />
        <VideoShowcase />
        <Marquee />
        <DemoBlock />
        <HowItWorks />
        <Founder />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
