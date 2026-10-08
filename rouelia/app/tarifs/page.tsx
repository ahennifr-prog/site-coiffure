import type { Metadata } from "next";
import { pricingPage as p } from "@/textes/tarifs";
import { faqJsonLd, productJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/pages/PageShell";
import { Blocks, FaqList, PageHero } from "@/components/pages/Blocks";
import { CtaBand } from "@/components/pages/CtaBand";
import { Container } from "@/components/ui/Section";
import { Pricing } from "@/components/sections/Pricing";

export const metadata: Metadata = pageMeta(p);

export default function Page() {
  return (
    <PageShell crumbs={[{ name: "Tarifs", href: p.path }]} jsonLd={[productJsonLd(), ...(p.faq?.length ? [faqJsonLd(p.faq)] : [])]}>
      <Container>
        <PageHero eyebrow={p.eyebrow} h1={p.h1} lead={p.lead} />
      </Container>
      <Pricing standalone />
      <Container>
        <div className="mx-auto max-w-3xl pt-16 sm:pt-20">
          <Blocks sections={p.sections} />
          {p.faq?.length ? (
            <section aria-labelledby="questions" className="mt-16">
              <h2 id="questions" className="mb-4 font-display text-[1.65rem] leading-tight font-semibold sm:text-[2.1rem]">
                Questions sur les prix
              </h2>
              <FaqList items={p.faq} />
            </section>
          ) : null}
        </div>
      </Container>
      <CtaBand title="Essayez 14 jours, sans carte bancaire." text="Choisissez votre pack ensuite, ou arrêtez : rien n'est prélevé sans votre accord." />
    </PageShell>
  );
}
