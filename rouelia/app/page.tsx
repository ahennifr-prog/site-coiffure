import type { Metadata } from "next";
import { indexedPage } from "@/lib/seo";
import { faqJsonLd, ldString, productJsonLd, websiteJsonLd } from "@/lib/jsonld";
import { Nav } from "@/components/sections/Nav";
import { Hero } from "@/components/sections/Hero";
import { FromWheelWelcome } from "@/components/sections/FromWheelWelcome";
import { MerchantLogos } from "@/components/sections/MerchantLogos";
import { HowItWorks } from "@/components/sections/HowItWorks";
import { WhoTeaser } from "@/components/sections/WhoTeaser";
import { MerchantReviews } from "@/components/sections/MerchantReviews";
import { Pricing } from "@/components/sections/Pricing";
import { Faq } from "@/components/sections/Faq";
import { FinalCta } from "@/components/sections/FinalCta";
import { Footer } from "@/components/sections/Footer";
import { VideoShowcase } from "@/components/sections/VideoShowcase";
import { Marquee } from "@/components/sections/Marquee";
import { ScrollFx, fxBoot } from "@/components/ui/ScrollFx";

export const metadata: Metadata = indexedPage("/");

/**
 * Page d'accueil centrée sur la conversion : comprendre l'offre, ses avantages, les prix, puis contacter.
 * La personnalisation de la roue est sur /creer-ma-roue, le détail sur les pages dédiées.
 */
export default function Home() {
  return (
    <>
      {[websiteJsonLd(), productJsonLd(), faqJsonLd()].map((d, i) => (
        <script key={i} type="application/ld+json" dangerouslySetInnerHTML={{ __html: ldString(d) }} />
      ))}
      <script dangerouslySetInnerHTML={{ __html: fxBoot }} />
      <ScrollFx />
      <div aria-hidden data-fx="progress" className="fixed inset-x-0 top-0 z-[70] h-[3px] origin-left bg-tomette" style={{ transform: "scaleX(0)" }} />
      <Nav />
      <main id="contenu">
        <FromWheelWelcome />
        <Hero />
        <VideoShowcase />
        {/* Les deux bandes qui défilent, l'une sous l'autre : les commerces, puis les avantages. */}
        <MerchantLogos />
        <Marquee />
        <HowItWorks />
        <MerchantReviews />
        <WhoTeaser />
        <Pricing />
        <Faq />
        <FinalCta />
      </main>
      <Footer />
    </>
  );
}
