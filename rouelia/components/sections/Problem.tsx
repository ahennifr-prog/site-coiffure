import { ArrowRight } from "lucide-react";
import { problem, ui } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Problem() {
  return (
    <Section labelledBy="probleme-title" className="bg-paper">
      <Container>
        <div className="max-w-3xl">
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <SectionTitle id="probleme-title">{problem.title}</SectionTitle>
        </div>
        <ol className="mt-12 grid gap-5 md:grid-cols-3">
          {problem.pains.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 90} className="h-full">
                <article className="flex h-full flex-col rounded-xl bg-cream p-6 ring-1 ring-line sm:p-7">
                  <span aria-hidden className="font-display text-5xl leading-none font-semibold text-tomette">
                    {String(i + 1).padStart(2, "0")}
                  </span>
                  <h3 className="mt-5 text-xl font-bold text-balance">{fr(p.title)}</h3>
                  <p className="mt-3 text-ink-soft">{fr(p.text)}</p>
                </article>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="mt-10 flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-medium">
          {fr(problem.transition)}
          <a href="#demo" className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-tomette-deep underline-offset-4 hover:underline">
            {ui.tryDemo} <ArrowRight aria-hidden size={18} />
          </a>
        </p>
      </Container>
    </Section>
  );
}
