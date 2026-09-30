"use client";

import { Check, ChevronDown, Minus, ShieldCheck } from "lucide-react";
import { pricing, trades } from "@/content";
import { formatPrice, fr } from "@/lib/format";
import { pricePerDay, visitsToCoverPack } from "@/lib/simulator";
import { Button } from "@/components/ui/Button";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { useAppState } from "@/components/AppState";

function Cell({ v }: { v: boolean | string }) {
  if (v === true)
    return (
      <span className="inline-flex items-center gap-1.5 text-sauge">
        <Check aria-hidden size={18} strokeWidth={3} />
        <span className="sr-only">{pricing.included}</span>
      </span>
    );
  if (v === false)
    return (
      <span className="inline-flex items-center text-ink-soft">
        <Minus aria-hidden size={18} />
        <span className="sr-only">{pricing.notIncluded}</span>
      </span>
    );
  return <span className="text-sm font-medium">{fr(v)}</span>;
}

export function Pricing() {
  const { openSignup, demo } = useAppState();
  const trade = trades.find((t) => t.id === demo.trade) ?? trades[0];

  return (
    <Section id="tarifs" labelledBy="tarifs-title" className="bg-paper">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{pricing.eyebrow}</Eyebrow>
          <SectionTitle id="tarifs-title">{pricing.title}</SectionTitle>
          <p className="mt-4 text-lg text-ink-soft">{fr(pricing.lead)}</p>
        </div>

        <ul className="mt-12 grid items-stretch gap-5 lg:grid-cols-3">
          {pricing.packs.map((p) => {
            const featured = !!p.badge;
            const visits = visitsToCoverPack(p.price, trade.simulator.averageBasket, trade.simulator.grossMargin);
            return (
              <li
                key={p.id}
                className={`relative flex flex-col rounded-xl p-6 sm:p-8 ${
                  featured ? "bg-night text-cream shadow-lg ring-2 ring-tomette lg:-my-3 lg:py-11" : "bg-cream ring-1 ring-line"
                }`}
              >
                {p.badge ? (
                  <p className="absolute -top-3.5 left-6 rounded-full bg-tomette px-3 py-1 text-xs font-bold tracking-wide text-white uppercase">
                    {p.badge}
                  </p>
                ) : null}
                <h3 className="font-display text-2xl font-semibold">{p.name}</h3>
                <p className={`mt-1 min-h-12 ${featured ? "text-cream/85" : "text-ink-soft"}`}>{fr(p.tagline)}</p>
                <p className="mt-5 flex items-baseline gap-1.5">
                  <span className="font-display text-5xl font-semibold tabular">{formatPrice(p.price)}</span>
                  <span className={featured ? "text-cream/85" : "text-ink-soft"}>{pricing.perMonth}</span>
                </p>
                <p className={`mt-1 text-sm font-semibold ${featured ? "text-safran" : "text-tomette-deep"}`}>
                  {fr(pricing.perDay(formatPrice(pricePerDay(p.price))))}
                </p>
                <ul className="mt-6 space-y-3">
                  {p.highlights.map((h) => (
                    <li key={h} className="flex gap-2.5">
                      <Check aria-hidden size={18} strokeWidth={3} className={`mt-0.5 shrink-0 ${featured ? "text-safran" : "text-sauge"}`} />
                      <span>{fr(h)}</span>
                    </li>
                  ))}
                </ul>
                <div className="mt-auto pt-8">
                  <Button
                    size="lg"
                    variant={featured ? "primary" : "secondary"}
                    className="w-full"
                    onClick={() => openSignup(p.id)}
                    aria-label={`${pricing.choose(p.name)}, ${formatPrice(p.price)} ${pricing.perMonth}`}
                  >
                    {pricing.choose(p.name)}
                  </Button>
                  {Number.isFinite(visits) ? (
                    <p className={`mt-3 text-center text-xs ${featured ? "text-cream/80" : "text-ink-soft"}`}>
                      {fr(pricing.cover(visits, formatPrice(trade.simulator.averageBasket), trade.label))}
                    </p>
                  ) : null}
                </div>
              </li>
            );
          })}
        </ul>
        <p className="mt-4 text-center text-xs text-ink-soft">{fr(pricing.coverNote)}</p>

        <div className="mt-10 grid gap-6 rounded-xl bg-sauge-soft p-6 sm:p-8 md:grid-cols-[auto_1fr] md:items-center">
          <span aria-hidden className="inline-flex h-14 w-14 items-center justify-center rounded-full bg-sauge text-white">
            <ShieldCheck size={28} />
          </span>
          <div>
            <h3 className="text-xl font-bold">{fr(pricing.guarantee.title)}</h3>
            <ul className="mt-3 grid gap-2 md:grid-cols-3 md:gap-5">
              {pricing.guarantee.items.map((g) => (
                <li key={g} className="flex gap-2">
                  <Check aria-hidden size={18} strokeWidth={3} className="mt-0.5 shrink-0 text-sauge" />
                  <span>{fr(g)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        <details className="group mt-8 rounded-xl ring-1 ring-line">
          <summary className="flex min-h-14 items-center justify-center gap-2 rounded-xl px-5 font-semibold text-tomette-deep hover:bg-cream">
            <span className="group-open:hidden">{pricing.tableToggle.open}</span>
            <span className="hidden group-open:inline">{pricing.tableToggle.close}</span>
            <ChevronDown aria-hidden size={20} className="chevron" />
          </summary>

          {/* Ordinateur et tablette : vrai tableau, sans défilement horizontal. */}
          <div className="hidden px-4 pb-6 md:block">
            <table className="w-full table-fixed border-collapse text-left">
              <caption className="sr-only">{pricing.tableCaption}</caption>
              <thead>
                <tr className="border-b border-line">
                  <th scope="col" className="w-[40%] py-4 pr-4 text-sm font-semibold text-ink-soft">
                    <span className="sr-only">{pricing.featureColumn}</span>
                  </th>
                  {pricing.packs.map((p) => (
                    <th key={p.id} scope="col" className={`px-3 py-4 font-display text-lg font-semibold ${p.badge ? "bg-tomette-soft/60" : ""}`}>
                      {p.name}
                      <span className="block font-sans text-sm font-medium text-ink-soft">
                        {formatPrice(p.price)} {pricing.perMonth}
                      </span>
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {pricing.table.map((row) => (
                  <tr key={row.feature} className="border-b border-line last:border-0">
                    <th scope="row" className="py-3.5 pr-4 text-sm font-medium">
                      {fr(row.feature)}
                    </th>
                    {row.values.map((v, i) => (
                      <td key={i} className={`px-3 py-3.5 align-top ${pricing.packs[i].badge ? "bg-tomette-soft/60" : ""}`}>
                        <Cell v={v} />
                      </td>
                    ))}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Téléphone : un accordéon par pack, jamais de tableau qui défile. */}
          <div className="space-y-3 px-3 pb-4 md:hidden">
            {pricing.packs.map((p, pi) => (
              <details key={p.id} className="rounded-lg bg-cream" open={!!p.badge}>
                <summary className="flex min-h-13 items-center justify-between px-4 font-semibold">
                  <span>
                    {p.name} <span className="font-normal text-ink-soft">{formatPrice(p.price)} {pricing.perMonth}</span>
                  </span>
                  <ChevronDown aria-hidden size={20} className="chevron" />
                </summary>
                <dl className="divide-y divide-line px-4 pb-3">
                  {pricing.table.map((row) => (
                    <div key={row.feature} className="flex items-start justify-between gap-4 py-3">
                      <dt className="text-sm">{fr(row.feature)}</dt>
                      <dd className="max-w-[45%] text-right">
                        <Cell v={row.values[pi]} />
                      </dd>
                    </div>
                  ))}
                </dl>
              </details>
            ))}
          </div>
        </details>

        <p className="mt-6 text-center text-sm text-ink-soft">{fr(pricing.printNote)}</p>
      </Container>
    </Section>
  );
}
