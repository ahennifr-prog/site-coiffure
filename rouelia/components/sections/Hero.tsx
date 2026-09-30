import { Check } from "lucide-react";
import { cta, hero } from "@/content";
import { fr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";
import { Awning } from "@/components/brand/Awning";
import { HeroWheel } from "./HeroWheel";

export function Hero() {
  // Le titre met en valeur la seconde moitié : ce que gagne le commerçant.
  const [first, second] = hero.title.split(". ");
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-5 pb-16 sm:pt-12 lg:pt-10 lg:pb-24">
      <Container className="grid grid-cols-[minmax(0,1fr)] items-center gap-x-12 gap-y-6 lg:grid-cols-[1.05fr_1fr] lg:grid-rows-[auto_auto_auto]">
        {/* Téléphone : titre, roue, puis texte. Ordinateur : texte à gauche, roue à droite. */}
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="mb-4 inline-flex items-center gap-2 rounded-full bg-paper px-3 py-1.5 text-xs font-bold tracking-[0.1em] text-tomette-deep uppercase shadow-sm ring-1 ring-line sm:mb-5">
            <span aria-hidden className="h-2 w-2 rounded-full bg-tomette" />
            {fr(hero.eyebrow)}
          </p>
          <h1 id="hero-title" className="font-display text-[2.2rem] leading-[1.04] font-semibold text-balance sm:text-6xl lg:text-[3.6rem] xl:text-[3.9rem]">
            {fr(first)}.{" "}
            <span className="text-tomette-deep italic">{fr(second)}</span>
          </h1>
        </div>

        <div className="relative mx-auto w-full max-w-[340px] sm:max-w-[480px] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:max-w-[520px]">
          <div aria-hidden className="absolute inset-x-3 top-7 bottom-14 rounded-[40px] bg-tomette-soft sm:top-10" />
          <Awning className="relative mx-auto h-7 w-[calc(100%-0.5rem)] drop-shadow-sm sm:h-9" />
          <div className="relative px-5 pt-3 sm:px-6 sm:pt-4">
            <HeroWheel />
          </div>
        </div>

        <p className="max-w-xl text-lg text-ink-soft sm:text-xl lg:col-start-1 lg:row-start-2">{fr(hero.lead)}</p>

        <div className="lg:col-start-1 lg:row-start-3 lg:self-start">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-4">
            <ButtonLink href="#demo" size="lg">
              {cta.primary}
            </ButtonLink>
            <ButtonLink href="#tarifs" variant="ghost" className="self-center sm:self-auto">
              {cta.secondary}
            </ButtonLink>
          </div>
          <ul className="mt-6 grid gap-2 text-sm font-medium sm:grid-cols-3 sm:gap-3">
            {hero.reassurance.map((r) => (
              <li key={r} className="flex items-center gap-2">
                <span aria-hidden className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sauge text-white">
                  <Check size={13} strokeWidth={3} />
                </span>
                {fr(r)}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
