import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, Gift, Sparkles } from "lucide-react";
import { trades } from "@/content";
import { fr } from "@/lib/format";
import { faqJsonLd } from "@/lib/jsonld";
import { pageMeta } from "@/lib/seo";
import { whoPage as p } from "@/textes/pour-qui";
import { PageShell } from "@/components/pages/PageShell";
import { FaqList, PageHero } from "@/components/pages/Blocks";
import { CtaBand } from "@/components/pages/CtaBand";
import { Container } from "@/components/ui/Section";
import { prizeIcons } from "@/components/wheel/icons";
import { OtherActivityForm } from "@/components/forms/OtherActivityForm";

export const metadata: Metadata = pageMeta(p);

/** Quatre exemples de cadeaux par métier, tirés des modèles de lots de la démo. */
const giftsFor = (id: string) => (trades.find((t) => t.id === id)?.prizes ?? []).slice(0, 4).map((z) => z.name);

export default function Page() {
  return (
    <PageShell crumbs={[{ name: "Pour qui ?", href: p.path }]} jsonLd={[faqJsonLd(p.faq)]}>
      <Container>
        <PageHero eyebrow={p.eyebrow} h1={p.h1} lead={p.lead} />
        <p className="-mt-2 mb-10 max-w-2xl rounded-lg border-l-4 border-tomette bg-paper px-4 py-3 text-lg font-medium ring-1 ring-line">{fr(p.answer)}</p>

        <ul className="grid gap-5 md:grid-cols-2">
          {p.cards.map((c) => {
            const { Icon } = prizeIcons[c.icon];
            return (
              <li key={c.trade}>
                <article className="flex h-full flex-col rounded-xl bg-paper p-6 ring-1 ring-line transition-shadow duration-300 hover:shadow-md sm:p-7">
                  <div className="flex items-center gap-3">
                    <span aria-hidden className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-tomette-soft text-tomette-deep">
                      <Icon size={24} />
                    </span>
                    <h2 className="font-display text-2xl leading-tight font-semibold">{fr(c.title)}</h2>
                  </div>
                  <p className="mt-3 text-ink-soft">{fr(c.text)}</p>
                  <p className="mt-5 text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">{p.giftsLabel}</p>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {giftsFor(c.trade).map((g) => (
                      <li key={g} className="inline-flex items-center gap-1.5 rounded-full bg-cream px-3 py-1.5 text-sm font-medium ring-1 ring-line">
                        <Gift aria-hidden size={14} className="text-tomette-deep" />
                        {fr(g)}
                      </li>
                    ))}
                  </ul>
                  {c.href ? (
                    <Link href={c.href} className="group mt-auto inline-flex min-h-11 items-center gap-1.5 pt-5 font-semibold text-tomette-deep">
                      <span className="underline-offset-4 group-hover:underline">{p.more(c.title)}</span>
                      <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-1" />
                    </Link>
                  ) : null}
                </article>
              </li>
            );
          })}
        </ul>

        <section id="autre-activite" aria-labelledby="autre-title" className="mt-10 scroll-mt-24 rounded-xl bg-night p-6 text-cream sm:mt-14 sm:p-10">
          <div className="grid gap-8 lg:grid-cols-[1fr_1.25fr] lg:gap-12">
            <div>
              <span aria-hidden className="inline-flex h-12 w-12 items-center justify-center rounded-full bg-tomette text-white">
                <Sparkles size={24} />
              </span>
              <h2 id="autre-title" className="mt-4 font-display text-3xl leading-tight font-semibold sm:text-4xl">
                {fr(p.other.title)}
              </h2>
              <p className="mt-3 text-lg text-cream/85">{fr(p.other.text)}</p>
            </div>
            <div className="text-ink">
              <OtherActivityForm />
            </div>
          </div>
        </section>

        <section aria-labelledby="questions" className="mx-auto mt-16 max-w-3xl sm:mt-20">
          <h2 id="questions" className="mb-4 font-display text-[1.65rem] leading-tight font-semibold sm:text-[2.1rem]">
            Questions fréquentes
          </h2>
          <FaqList items={p.faq} />
        </section>
      </Container>
      <CtaBand title={p.ctaTitle} />
    </PageShell>
  );
}
