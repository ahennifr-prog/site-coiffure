import Link from "next/link";
import { ChevronDown } from "lucide-react";
import { RichText } from "@/components/pages/RichText";
import { faq } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";

export function Faq() {
  return (
    <Section id="faq" labelledBy="faq-title" className="bg-paper">
      <Container className="grid gap-12 lg:grid-cols-[1fr_1.6fr] lg:gap-20">
        <div>
          <Eyebrow>{faq.eyebrow}</Eyebrow>
          <SectionTitle id="faq-title">{faq.title}</SectionTitle>
          <Link href="/faq" className="mt-6 inline-flex min-h-11 items-center font-semibold text-tomette-deep underline underline-offset-4">
            {faq.all}
          </Link>
        </div>
        <div className="divide-y divide-line border-y border-line">
          {faq.items.map((item) => (
            <details key={item.q} className="group">
              <summary className="flex min-h-16 items-center justify-between gap-4 py-5 text-left text-lg font-semibold transition-colors hover:text-tomette-deep">
                <h3>{fr(item.q)}</h3>
                <span aria-hidden className="inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-cream group-open:bg-tomette group-open:text-white">
                  <ChevronDown size={20} className="chevron" />
                </span>
              </summary>
              <p className="pb-6 pr-4 text-ink-soft sm:pr-12">
                <RichText text={item.a} />
              </p>
            </details>
          ))}
        </div>
      </Container>
    </Section>
  );
}
