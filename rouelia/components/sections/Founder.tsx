import Image from "next/image";
import { founder, pilots } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { ExternalLink } from "lucide-react";

function Portrait() {
  if (founder.photo) {
    return (
      <Image
        src={founder.photo}
        alt={founder.photoAlt}
        width={320}
        height={400}
        className="h-full w-full rounded-xl object-cover"
        sizes="(min-width: 1024px) 320px, 60vw"
      />
    );
  }
  // Emplacement prévu pour la photo : un portrait graphique en attendant.
  return (
    <div role="img" aria-label={founder.photoAlt} className="relative flex aspect-[4/5] w-full items-end overflow-hidden rounded-xl bg-tomette">
      <div aria-hidden className="awning absolute inset-x-0 top-0 h-10 opacity-90" />
      <span aria-hidden className="absolute inset-0 flex items-center justify-center font-display text-[9rem] leading-none font-semibold text-cream/95">
        A
      </span>
    </div>
  );
}

function PilotResults() {
  const active = pilots.items.filter((p) => p.enabled && p.metrics.length > 0 && p.consentDate);
  if (active.length === 0) return null;
  return (
    <div className="mt-16">
      <h3 className="font-display text-3xl font-semibold">{fr(pilots.title)}</h3>
      <p className="mt-2 text-ink-soft">{fr(pilots.note)}</p>
      <ul className="mt-8 grid gap-5 md:grid-cols-3">
        {active.map((p) => (
          <li key={p.shopName} className="rounded-xl bg-paper p-6 ring-1 ring-line">
            <p className="font-bold">{p.shopName}</p>
            <p className="text-sm text-ink-soft">
              {p.trade}, {p.city}. {p.period}
            </p>
            <dl className="mt-4 grid grid-cols-2 gap-3">
              {p.metrics.map((m) => (
                <div key={m.label}>
                  <dt className="text-xs text-ink-soft">{m.label}</dt>
                  <dd className="font-display text-2xl font-semibold">{m.value}</dd>
                </div>
              ))}
            </dl>
            {p.quote ? <blockquote className="mt-4 text-ink-soft">{fr(p.quote)}</blockquote> : null}
            {p.googleUrl ? (
              <a href={p.googleUrl} target="_blank" rel="noopener noreferrer" className="mt-4 inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-tomette-deep underline-offset-4 hover:underline">
                {pilots.googleLink} <ExternalLink aria-hidden size={14} />
              </a>
            ) : null}
          </li>
        ))}
      </ul>
    </div>
  );
}

export function Founder() {
  return (
    <Section labelledBy="fondateur-title">
      <Container>
        <div className="grid items-center gap-10 md:grid-cols-[minmax(0,320px)_1fr] lg:gap-16">
          <div className="mx-auto w-3/5 max-w-[320px] md:w-full">
            <Portrait />
          </div>
          <div>
            <Eyebrow>{founder.eyebrow}</Eyebrow>
            <SectionTitle id="fondateur-title">{founder.title}</SectionTitle>
            <div className="mt-6 max-w-2xl space-y-4 text-lg text-ink-soft">
              {founder.text.map((t) => (
                <p key={t}>{fr(t)}</p>
              ))}
            </div>
            <p className="mt-6 font-display text-xl font-semibold italic">{fr(founder.signature)}</p>
          </div>
        </div>
        <PilotResults />
      </Container>
    </Section>
  );
}
