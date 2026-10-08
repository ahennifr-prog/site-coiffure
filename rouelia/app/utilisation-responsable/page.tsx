import type { Metadata } from "next";
import { TriangleAlert } from "lucide-react";
import { responsiblePage as p } from "@/textes/utilisation-responsable";
import { fr } from "@/lib/format";
import { faqJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/pages/PageShell";
import { Blocks, FaqList, PageHero } from "@/components/pages/Blocks";
import { CtaBand } from "@/components/pages/CtaBand";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = pageMeta(p);

export default function Page() {
  return (
    <PageShell crumbs={[{ name: "Utilisation responsable", href: p.path }]} jsonLd={p.faq?.length ? [faqJsonLd(p.faq)] : []}>
      <Container>
        <div className="mx-auto max-w-3xl">
          <PageHero eyebrow={p.eyebrow} h1={p.h1} lead={p.lead} />
          <p role="note" className="mb-12 flex gap-2.5 rounded-lg bg-safran-soft p-4 text-sm font-semibold ring-1 ring-safran">
            <TriangleAlert aria-hidden size={18} className="mt-0.5 shrink-0" />
            {fr(p.disclaimer)}
          </p>
          <Blocks sections={p.sections} />
          {p.faq?.length ? (
            <section aria-labelledby="questions" className="mt-16">
              <h2 id="questions" className="mb-4 font-display text-[1.65rem] leading-tight font-semibold sm:text-[2.1rem]">
                Questions fréquentes
              </h2>
              <FaqList items={p.faq} />
            </section>
          ) : null}
          <section aria-labelledby="sources" className="mt-16 border-t border-line pt-8">
            <h2 id="sources" className="text-lg font-bold">
              Sources officielles
            </h2>
            <ul className="mt-3 space-y-2">
              {p.sources.map((s) => (
                <li key={s.url}>
                  <a href={s.url} target="_blank" rel="noopener noreferrer" className="font-semibold text-tomette-deep underline underline-offset-4">
                    {fr(s.label)}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-6 text-sm text-ink-soft">{fr(p.disclaimer)}</p>
          </section>
        </div>
      </Container>
      <CtaBand title="Une roue qui fait revenir vos clients, dans les règles." />
    </PageShell>
  );
}
