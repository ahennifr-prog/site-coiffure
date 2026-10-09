import type { Metadata } from "next";
import { comparePage as p } from "@/textes/comparatif";
import { faqJsonLd } from "@/lib/jsonld";
import { fr } from "@/lib/format";
import { pageMeta } from "@/lib/seo";
import { PageShell } from "@/components/pages/PageShell";
import { Blocks, FaqList, PageHero } from "@/components/pages/Blocks";
import { CtaBand } from "@/components/pages/CtaBand";
import { Container } from "@/components/ui/Section";

export const metadata: Metadata = pageMeta(p);

const t = p.table;

/** Tableau comparatif : vrai tableau sur tablette et ordinateur, une carte par critère sur téléphone (jamais de défilement horizontal). */
function CompareTable() {
  return (
    <section aria-labelledby="tableau" className="mt-14">
      <h2 id="tableau" className="font-display text-[1.65rem] leading-tight font-semibold sm:text-[2.1rem]">
        Le comparatif en un coup d&apos;œil
      </h2>
      <div className="mt-6 hidden overflow-hidden rounded-xl ring-1 ring-line md:block">
        <table className="w-full table-fixed border-collapse bg-paper text-left">
          <caption className="sr-only">{fr(t.caption)}</caption>
          <thead>
            <tr className="border-b border-line bg-cream">
              <th scope="col" className="w-[22%] px-4 py-3 text-sm font-semibold text-ink-soft">
                {t.criterionLabel}
              </th>
              {t.columns.map((c, i) => (
                <th key={c} scope="col" className={`px-4 py-3 font-semibold ${i === 2 ? "bg-tomette-soft/60" : ""}`}>
                  {c}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {t.rows.map((r) => (
              <tr key={r.criterion} className="border-b border-line align-top last:border-0">
                <th scope="row" className="px-4 py-3.5 text-sm font-semibold">
                  {fr(r.criterion)}
                </th>
                {r.values.map((v, i) => (
                  <td key={i} className={`px-4 py-3.5 text-sm text-ink-soft ${i === 2 ? "bg-tomette-soft/40 text-ink" : ""}`}>
                    {fr(v)}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <ul className="mt-6 space-y-3 md:hidden">
        {t.rows.map((r) => (
          <li key={r.criterion} className="rounded-xl bg-paper p-4 ring-1 ring-line">
            <h3 className="font-semibold">{fr(r.criterion)}</h3>
            <dl className="mt-2 divide-y divide-line text-sm">
              {r.values.map((v, i) => (
                <div key={i} className="grid grid-cols-[8.5rem_1fr] gap-3 py-2">
                  <dt className={`font-semibold ${i === 2 ? "text-tomette-deep" : "text-ink-soft"}`}>{t.columns[i]}</dt>
                  <dd>{fr(v)}</dd>
                </div>
              ))}
            </dl>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Page() {
  return (
    <PageShell crumbs={[{ name: "Comparatif", href: p.path }]} jsonLd={[faqJsonLd(p.faq)]}>
      <Container>
        <PageHero eyebrow={p.eyebrow} h1={p.h1} lead={p.lead} />
        <div className="mx-auto max-w-3xl pt-12 sm:pt-16">
          <Blocks sections={p.sections.slice(0, 1)} />
          <CompareTable />
          <div className="mt-14">
            <Blocks sections={p.sections.slice(1)} />
          </div>
          <section aria-labelledby="questions" className="mt-16">
            <h2 id="questions" className="mb-4 font-display text-[1.65rem] leading-tight font-semibold sm:text-[2.1rem]">
              Questions de commerçants
            </h2>
            <FaqList items={p.faq ?? []} />
          </section>
        </div>
      </Container>
      <CtaBand title={p.ctaTitle} text={p.ctaText} />
    </PageShell>
  );
}
