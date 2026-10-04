import { demo } from "@/content";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { DemoLazy } from "@/components/demo/DemoSection";

export function DemoBlock() {
  return (
    <Section id="demo" labelledBy="demo-title">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{demo.eyebrow}</Eyebrow>
          <SectionTitle id="demo-title">{demo.title}</SectionTitle>
        </div>
        <div className="mt-10">
          <DemoLazy />
        </div>
      </Container>
    </Section>
  );
}
