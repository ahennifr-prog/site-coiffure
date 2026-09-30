import { cta, finalCta } from "@/content";
import { fr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Awning } from "@/components/brand/Awning";
import { HeroWheel } from "./HeroWheel";

export function FinalCta() {
  return (
    <section aria-labelledby="final-title" className="relative overflow-hidden bg-tomette pb-20 text-white">
      <Awning className="h-10 w-full" stripe="#A33317" base="#FBF6EE" />
      <Container className="grid items-center gap-10 pt-14 lg:grid-cols-[1.2fr_1fr]">
        <div>
          <h2 id="final-title" className="font-display text-4xl leading-[1.08] font-semibold text-balance sm:text-6xl">
            {fr(finalCta.title)}
          </h2>
          <p className="mt-5 max-w-xl text-lg text-white sm:text-xl">{fr(finalCta.text)}</p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-center">
            <ButtonLink href="#demo" size="lg" variant="light" className="text-lg shadow-lg">
              {cta.primary}
            </ButtonLink>
            <p className="text-sm font-medium text-white">{fr(finalCta.note)}</p>
          </div>
        </div>
        <div className="mx-auto w-full max-w-[380px] [&_p]:text-white [&_p_span]:bg-night">
          <HeroWheel />
        </div>
      </Container>
    </section>
  );
}
