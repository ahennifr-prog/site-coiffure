import { Check, ChevronDown } from "lucide-react";
import type { Block, Faq } from "@/textes/types";
import { fr } from "@/lib/format";
import { Eyebrow } from "@/components/ui/Section";
import { RichText } from "./RichText";

/** En-tête de page : un seul H1. */
export function PageHero({ eyebrow, h1, lead, children }: { eyebrow: string; h1: string; lead: string; children?: React.ReactNode }) {
  return (
    <header className="pt-8 pb-10 sm:pt-12 sm:pb-14">
      <Eyebrow>{eyebrow}</Eyebrow>
      <h1 className="max-w-3xl font-display text-[2.1rem] leading-[1.06] font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:text-[3.4rem]">{fr(h1)}</h1>
      <p className="mt-5 max-w-2xl text-lg text-ink-soft sm:text-xl">
        <RichText text={lead} />
      </p>
      {children ? <div className="mt-7 flex flex-col gap-3 sm:flex-row sm:flex-wrap sm:items-center">{children}</div> : null}
    </header>
  );
}

const slug = (s: string) =>
  s.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 60);

function List({ items }: { items: string[] }) {
  return (
    <ul className="mt-4 space-y-2.5">
      {items.map((t) => (
        <li key={t} className="flex gap-2.5">
          <Check aria-hidden size={18} strokeWidth={3} className="mt-1 shrink-0 text-sauge" />
          <span>
            <RichText text={t} />
          </span>
        </li>
      ))}
    </ul>
  );
}

/** Sections de texte : H2, réponse courte mise en avant, puis le détail. */
export function Blocks({ sections }: { sections: Block[] }) {
  return (
    <div className="space-y-14 sm:space-y-16">
      {sections.map((b) => (
        <section key={b.h2} id={slug(b.h2)} aria-labelledby={`${slug(b.h2)}-t`} className="scroll-mt-24">
          <h2 id={`${slug(b.h2)}-t`} className="font-display text-[1.65rem] leading-tight font-semibold tracking-[-0.02em] text-balance sm:text-[2.1rem]">
            {fr(b.h2)}
          </h2>
          {b.answer ? (
            <p className="mt-4 rounded-lg border-l-4 border-tomette bg-paper px-4 py-3 text-lg font-medium text-ink ring-1 ring-line">
              <RichText text={b.answer} />
            </p>
          ) : null}
          {b.p?.map((t) => (
            <p key={t} className="mt-4 text-ink-soft sm:text-lg">
              <RichText text={t} />
            </p>
          ))}
          {b.list ? <List items={b.list} /> : null}
          {b.sub?.map((s) => (
            <div key={s.h3} className="mt-7">
              <h3 className="text-lg font-bold sm:text-xl">{fr(s.h3)}</h3>
              {s.p.map((t) => (
                <p key={t} className="mt-2 text-ink-soft sm:text-lg">
                  <RichText text={t} />
                </p>
              ))}
              {s.list ? <List items={s.list} /> : null}
            </div>
          ))}
        </section>
      ))}
    </div>
  );
}

/** Questions en accordéon natif (contenu présent dans le HTML même fermé). */
export function FaqList({ items, headingLevel = 3 }: { items: Faq[]; headingLevel?: 2 | 3 }) {
  const H = headingLevel === 2 ? "h2" : "h3";
  return (
    <div className="divide-y divide-line border-y border-line">
      {items.map((item) => (
        <details key={item.q} className="group">
          <summary className="flex min-h-16 items-center justify-between gap-4 py-4 text-left text-lg font-semibold transition-colors hover:text-tomette-deep">
            <H className="text-[1.05rem] sm:text-lg">{fr(item.q)}</H>
            <span aria-hidden className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream ring-1 ring-line group-open:bg-tomette group-open:text-white">
              <ChevronDown size={20} className="chevron" />
            </span>
          </summary>
          <p className="pb-5 pr-4 text-ink-soft sm:pr-12">
            <RichText text={item.a} />
          </p>
        </details>
      ))}
    </div>
  );
}
