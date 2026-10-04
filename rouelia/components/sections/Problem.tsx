import { ArrowRight } from "lucide-react";
import { problem, ui } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, Section, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";

export function Problem() {
  return (
    <Section labelledBy="probleme-title" className="bg-paper">
      <Container>
        <div className="max-w-4xl">
          <Eyebrow>{problem.eyebrow}</Eyebrow>
          <SectionTitle id="probleme-title" fill className="sm:text-[3.4rem] lg:text-[4rem]">{problem.title}</SectionTitle>
        </div>
        <ol className="mt-16 grid gap-12 md:mt-24 md:grid-cols-3 md:gap-10">
          {problem.pains.map((p, i) => (
            <li key={p.title}>
              <Reveal delay={i * 120}>
                <span aria-hidden data-fx className="fx-parallax block font-display text-[5.5rem] leading-none font-semibold tracking-[-0.04em] text-transparent [-webkit-text-stroke:1.5px_var(--color-tomette)]" style={{ ["--depth" as string]: `${-50 - i * 45}px` }}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <span aria-hidden className="mt-6 block h-px w-full bg-line" />
                <h3 className="mt-6 text-xl font-bold text-balance">{fr(p.title)}</h3>
                <p className="mt-2 text-ink-soft">{fr(p.text)}</p>
              </Reveal>
            </li>
          ))}
        </ol>
        <p className="mt-20 flex flex-wrap items-center gap-x-3 gap-y-2 text-lg font-medium">
          {fr(problem.transition)}
          <a href="#demo" className="group inline-flex min-h-11 items-center gap-1.5 font-semibold text-tomette-deep">
            {ui.tryDemo} <ArrowRight aria-hidden size={18} className="transition-transform duration-300 group-hover:translate-x-1" />
          </a>
        </p>
      </Container>
    </Section>
  );
}
