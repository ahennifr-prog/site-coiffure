import { Laptop, MapPin, Video } from "lucide-react";
import { support } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const icons = [Laptop, Video, MapPin];

export function Support() {
  return (
    <Section labelledBy="accompagnement-title">
      <Container>
        <div className="max-w-2xl">
          <Eyebrow>{support.eyebrow}</Eyebrow>
          <SectionTitle id="accompagnement-title">{support.title}</SectionTitle>
        </div>
        <ul className="mt-16 grid gap-12 md:grid-cols-3 md:gap-10">
          {support.options.map((o, i) => {
            const Icon = icons[i];
            return (
              <li key={o.title}>
                <Reveal delay={i * 120} className="flex h-full flex-col border-t border-ink/15 pt-6">
                  <div className="flex items-center justify-between">
                    <span aria-hidden className="inline-flex h-11 w-11 items-center justify-center rounded-full bg-tomette-soft text-tomette-deep">
                      <Icon size={20} />
                    </span>
                    <span className="font-display text-3xl font-semibold">{fr(o.price)}</span>
                  </div>
                  <h3 className="mt-6 text-xl font-bold">{fr(o.title)}</h3>
                  <p className="mt-2 text-ink-soft">{fr(o.text)}</p>
                  {"priceNote" in o && o.priceNote ? <p className="mt-2 text-sm text-ink-soft">{fr(o.priceNote)}</p> : null}
                  <p className="mt-auto pt-6 text-xs font-semibold tracking-wide text-tomette-deep uppercase">{fr(o.packs)}</p>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
