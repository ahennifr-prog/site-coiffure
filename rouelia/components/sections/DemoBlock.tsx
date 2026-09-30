import { demo } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { DemoLazy } from "@/components/demo/DemoSection";

export function DemoBlock() {
  return (
    <Section id="demo" labelledBy="demo-title">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{demo.eyebrow}</Eyebrow>
          <SectionTitle id="demo-title">{demo.title}</SectionTitle>
          <p className="mt-4 text-lg text-ink-soft">{fr(demo.lead)}</p>
        </div>
        <div className="mt-10">
          <DemoLazy />
        </div>
      </Container>
    </Section>
  );
}
