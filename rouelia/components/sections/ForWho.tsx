import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { forWho } from "@/content";
import { fr } from "@/lib/format";
import { prizeIcons } from "@/components/wheel/icons";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";

/** Les métiers, chacun vers sa page dédiée. */
export function ForWho() {
  return (
    <Section id="pour-qui" labelledBy="pour-qui-title">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>{forWho.eyebrow}</Eyebrow>
          <SectionTitle id="pour-qui-title">{forWho.title}</SectionTitle>
          <p className="mt-4 text-lg text-ink-soft">{fr(forWho.answer)}</p>
        </div>
        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {forWho.items.map((t) => {
            const { Icon } = prizeIcons[t.icon];
            return (
              <li key={t.href}>
                <Link href={t.href} className="group flex h-full flex-col rounded-xl bg-paper p-5 ring-1 ring-line transition-[box-shadow,transform] duration-300 hover:-translate-y-1 hover:shadow-md">
                  <span aria-hidden className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-tomette-soft text-tomette-deep">
                    <Icon size={22} />
                  </span>
                  <h3 className="mt-4 text-lg font-bold">{fr(t.label)}</h3>
                  <p className="mt-1 text-ink-soft">{fr(t.text)}</p>
                  <span className="mt-auto inline-flex items-center gap-1.5 pt-4 text-sm font-semibold text-tomette-deep">
                    {forWho.more}
                    <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-1" />
                  </span>
                </Link>
              </li>
            );
          })}
        </ul>
        <p className="mt-6 text-ink-soft">
          {fr(forWho.others)}{" "}
          <Link href={forWho.othersLink.href} className="font-semibold text-tomette-deep underline underline-offset-4">
            {forWho.othersLink.label}
          </Link>
        </p>
      </Container>
    </Section>
  );
}
