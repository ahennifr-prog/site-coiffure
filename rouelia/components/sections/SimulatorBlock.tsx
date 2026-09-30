import { simulator } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { SimulatorLazy } from "@/components/demo/DemoSection";

export function SimulatorBlock() {
  return (
    <Section id="simulateur" labelledBy="simulateur-title" className="bg-tomette-soft/45">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{simulator.eyebrow}</Eyebrow>
          <SectionTitle id="simulateur-title">{simulator.title}</SectionTitle>
          <p className="mt-4 text-lg text-ink-soft">{fr(simulator.lead)}</p>
        </div>
        <div className="mt-10">
          <SimulatorLazy />
        </div>
      </Container>
    </Section>
  );
}
