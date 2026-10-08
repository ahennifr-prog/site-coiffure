import type { Metadata } from "next";
import { faqPage } from "@/textes/faq";
import { fr } from "@/lib/format";
import { faqJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/pages/PageShell";
import { FaqList, PageHero } from "@/components/pages/Blocks";
import { CtaBand } from "@/components/pages/CtaBand";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = pageMeta(faqPage);

const slug = (s: string) => s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "");

export default function Page() {
  const all = faqPage.groups.flatMap((g) => g.items);
  return (
    <PageShell crumbs={[{ name: "FAQ", href: faqPage.path }]} jsonLd={[faqJsonLd(all)]}>
      <Container>
        <PageHero eyebrow={faqPage.eyebrow} h1={faqPage.h1} lead={faqPage.lead} />
        <div className="grid gap-12 lg:grid-cols-[240px_minmax(0,1fr)] lg:gap-16">
          <nav aria-label="Thèmes" className="lg:sticky lg:top-24 lg:self-start">
            <ul className="flex flex-wrap gap-2 lg:flex-col lg:gap-1">
              {faqPage.groups.map((g) => (
                <li key={g.title}>
                  <a href={`#${slug(g.title)}`} className="inline-flex min-h-11 items-center rounded-full bg-paper px-4 text-sm font-semibold ring-1 ring-line hover:ring-ink/40 lg:bg-transparent lg:px-0 lg:ring-0 lg:hover:underline">
                    {fr(g.title)}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
          <div className="max-w-3xl space-y-14">
            {faqPage.groups.map((g) => (
              <section key={g.title} id={slug(g.title)} aria-labelledby={`${slug(g.title)}-t`} className="scroll-mt-24">
                <h2 id={`${slug(g.title)}-t`} className="mb-4 font-display text-[1.65rem] leading-tight font-semibold sm:text-[2.1rem]">
                  {fr(g.title)}
                </h2>
                <FaqList items={g.items} />
              </section>
            ))}
          </div>
        </div>
      </Container>
      <CtaBand title="Une autre question ? Parlons-en cinq minutes." text="On vous rappelle au créneau de votre choix, ou écrivez-nous sur WhatsApp." />
    </PageShell>
  );
}
