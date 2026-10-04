import { Bell, FileBarChart, MessageSquareReply, Radar, type LucideIcon } from "lucide-react";
import { features, ui } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { GlowTile } from "@/components/ui/GlowTile";

const icons: LucideIcon[] = [Bell, MessageSquareReply, FileBarChart, Radar];
/** Grille « bento » : deux grandes tuiles, deux petites, en quinconce. */
const spans = ["lg:col-span-4", "lg:col-span-2", "lg:col-span-2", "lg:col-span-4"];

export function Features() {
  return (
    <Section labelledBy="fonctions-title" className="relative overflow-hidden bg-night text-cream">
      <div aria-hidden className="pointer-events-none absolute top-[-20%] left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-tomette/20 blur-[120px]" />
      <Container className="relative">
        <div className="max-w-2xl">
          <Eyebrow tone="light">{features.eyebrow}</Eyebrow>
          <SectionTitle id="fonctions-title">{features.title}</SectionTitle>
        </div>
        <ul className="mt-16 grid gap-4 sm:grid-cols-2 lg:grid-cols-6">
          {features.items.map((f, i) => {
            const Icon = icons[i % icons.length];
            return (
              <li key={f.title} data-fx className={`fx-parallax ${spans[i]}`} style={{ ["--depth" as string]: `${[-30, -70, -50, -90][i]}px` }}>
                <Reveal delay={(i % 2) * 120} className="h-full">
                  <GlowTile className="flex h-full min-h-56 flex-col rounded-[24px] bg-night-soft p-7 ring-1 ring-white/10 transition-transform duration-500 hover:-translate-y-1 sm:p-8">
                    <span aria-hidden className="inline-flex h-12 w-12 items-center justify-center rounded-2xl bg-tomette text-white shadow-[0_10px_30px_-8px_rgb(196_64_31/0.7)]">
                      <Icon size={22} />
                    </span>
                    <h3 className="mt-auto pt-10 font-display text-2xl font-semibold text-white">{fr(f.title)}</h3>
                    <p className="mt-2 text-cream/75">{fr(f.text)}</p>
                    <p className="mt-5 text-xs font-semibold tracking-wide text-safran uppercase">
                      <span className="sr-only">{ui.packsLabel} : </span>
                      {fr(f.packs)}
                    </p>
                  </GlowTile>
                </Reveal>
              </li>
            );
          })}
        </ul>
      </Container>
    </Section>
  );
}
