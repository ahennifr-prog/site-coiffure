import Link from "next/link";
import { Gift } from "lucide-react";
import { cta } from "@/content";
import { fr } from "@/lib/format";
import { faqJsonLd } from "@/lib/jsonld";
import { tradePages } from "@/textes/metiers";
import type { TradePage } from "@/textes/types";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Blocks, FaqList, PageHero } from "./Blocks";
import { CtaBand } from "./CtaBand";
import { PageShell } from "./PageShell";

export const tradePage = (path: string) => tradePages.find((t) => t.path === path) as TradePage;

/** Page métier : problème, solution, exemples de lots, mini FAQ, appel à l'action. */
export function TradeView({ page: p }: { page: TradePage }) {
  const others = tradePages.filter((t) => t.path !== p.path);
  return (
    <PageShell crumbs={[{ name: "Pour qui ?", href: "/pour-qui" }, { name: p.label, href: p.path }]} jsonLd={p.faq?.length ? [faqJsonLd(p.faq)] : []}>
      <Container>
        <PageHero eyebrow={p.eyebrow} h1={p.h1} lead={p.lead}>
          <ButtonLink href={cta.href} size="lg">
            {cta.primary}
          </ButtonLink>
          <ButtonLink href={cta.callHref} size="lg" variant="secondary">
            {cta.callShort}
          </ButtonLink>
        </PageHero>
        <div className="grid gap-14 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-16">
          <div className="max-w-3xl">
            <Blocks sections={p.sections} />

            <section aria-labelledby="lots" className="mt-16">
              <h2 id="lots" className="font-display text-[1.65rem] leading-tight font-semibold tracking-[-0.02em] sm:text-[2.1rem]">
                Des exemples de lots
              </h2>
              <ul className="mt-6 grid gap-3 sm:grid-cols-2">
                {p.prizes.map((z) => (
                  <li key={z.name} className="flex gap-3 rounded-xl bg-paper p-4 ring-1 ring-line">
                    <span aria-hidden className="inline-flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-tomette-soft text-tomette-deep">
                      <Gift size={20} />
                    </span>
                    <span>
                      <span className="block font-bold">{fr(z.name)}</span>
                      <span className="mt-0.5 block text-sm text-ink-soft">{fr(z.note)}</span>
                    </span>
                  </li>
                ))}
              </ul>
            </section>

            {p.faq?.length ? (
              <section aria-labelledby="questions" className="mt-16">
                <h2 id="questions" className="mb-4 font-display text-[1.65rem] leading-tight font-semibold tracking-[-0.02em] sm:text-[2.1rem]">
                  Vos questions
                </h2>
                <FaqList items={p.faq} />
              </section>
            ) : null}
          </div>

          <aside aria-label="Autres métiers" className="lg:sticky lg:top-24 lg:self-start">
            <div className="rounded-xl bg-paper p-5 ring-1 ring-line">
              <p className="text-xs font-bold tracking-[0.14em] text-tomette-deep uppercase">Autres métiers</p>
              <ul className="mt-2">
                {others.map((o) => (
                  <li key={o.path}>
                    <Link href={o.path} className="flex min-h-11 items-center font-semibold underline-offset-4 hover:underline">
                      {fr(o.label)}
                    </Link>
                  </li>
                ))}
              </ul>
              <Link href="/tarifs" className="mt-3 flex min-h-11 items-center font-semibold text-tomette-deep underline underline-offset-4">
                Voir les tarifs
              </Link>
            </div>
          </aside>
        </div>
      </Container>
      <CtaBand title={p.cta} />
    </PageShell>
  );
}
