import { Bell, FileBarChart, MapPin, MessageSquareReply, Radar, Receipt, Timer, type LucideIcon } from "lucide-react";
import { features, ui } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

const icons: LucideIcon[] = [Bell, Receipt, MessageSquareReply, FileBarChart, Radar, Timer, MapPin];

export function Features() {
  return (
    <Section labelledBy="fonctions-title" className="bg-night text-cream">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow tone="light">{features.eyebrow}</Eyebrow>
          <SectionTitle id="fonctions-title">{features.title}</SectionTitle>
        </div>
        <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {features.items.map((f, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={f.title} className={i === features.items.length - 1 ? "sm:col-span-2 lg:col-span-3" : ""}>
                <Reveal delay={(i % 3) * 80} className="h-full">
                  <article className="flex h-full flex-col rounded-xl bg-night-soft p-6 ring-1 ring-white/10">
                    <span aria-hidden className="inline-flex h-11 w-11 items-center justify-center rounded-lg bg-tomette text-white">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-5 text-lg font-bold text-white">{fr(f.title)}</h3>
                    <p className="mt-2 text-cream/85">{fr(f.text)}</p>
                    <p className="mt-auto pt-5 text-xs font-semibold text-safran">
                      <span className="sr-only">{ui.packsLabel} : </span>
                      {fr(f.packs)}
                    </p>
                  </article>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
