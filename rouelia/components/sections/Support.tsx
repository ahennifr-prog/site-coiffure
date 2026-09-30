import { Laptop, MapPin, Video } from "lucide-react";
import { support } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";

const icons = [Laptop, Video, MapPin];

export function Support() {
  return (
    <Section labelledBy="accompagnement-title">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{support.eyebrow}</Eyebrow>
          <SectionTitle id="accompagnement-title">{support.title}</SectionTitle>
        </div>
        <ul className="mt-12 grid gap-5 md:grid-cols-3">
          {support.options.map((o, i) => {
            const Icon = icons[i];
            return (
              <li key={o.title} className="flex flex-col rounded-xl bg-paper p-6 ring-1 ring-line sm:p-7">
                <div className="flex items-center justify-between">
                  <span aria-hidden className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-tomette-soft text-tomette-deep">
                    <Icon size={22} />
                  </span>
                  <p className="text-right">
                    <span className="font-display text-2xl font-semibold">{fr(o.price)}</span>
                  </p>
                </div>
                <h3 className="mt-5 text-xl font-bold">{fr(o.title)}</h3>
                {"priceNote" in o && o.priceNote ? <p className="mt-1 text-sm font-medium text-tomette-deep">{fr(o.priceNote)}</p> : null}
                <p className="mt-2 text-ink-soft">{fr(o.text)}</p>
                <p className="mt-auto pt-5 text-sm font-semibold">{fr(o.packs)}</p>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
