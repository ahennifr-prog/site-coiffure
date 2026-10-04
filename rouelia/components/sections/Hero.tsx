import { Gift } from "lucide-react";
import { cta, hero } from "@/content";
import { fr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Words } from "@/components/ui/Section";
import { Awning } from "@/components/brand/Awning";
import { Tilt } from "@/components/ui/Tilt";
import { HeroWheel } from "./HeroWheel";

/** Positions des étiquettes flottantes autour de la roue (décoratives). */
const TAGS = [
  { className: "-left-3 top-[22%] sm:-left-10", rotate: "-6deg", delay: "0s" },
  { className: "-right-2 top-[48%] sm:-right-8", rotate: "5deg", delay: "-2s" },
  { className: "left-[6%] bottom-[10%] sm:-left-4", rotate: "-3deg", delay: "-4s" },
];

export function Hero() {
  // Le titre met en valeur la seconde moitié : ce que gagne le commerçant.
  const [first, second] = hero.title.split(". ");
  return (
    <section aria-labelledby="hero-title" className="relative overflow-hidden pt-8 pb-24 sm:pt-16 lg:pt-20 lg:pb-36">
      {/* Halo chaud derrière la roue : profondeur sans image lourde. */}
      <div aria-hidden className="pointer-events-none absolute -top-40 right-[-20%] h-[640px] w-[640px] rounded-full bg-[radial-gradient(closest-side,var(--color-tomette-soft),transparent)] lg:right-[-6%]" />
      <div aria-hidden className="pointer-events-none absolute bottom-[-30%] left-[-15%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(closest-side,var(--color-safran-soft),transparent)]" />
      <Container className="relative grid grid-cols-[minmax(0,1fr)] items-center gap-x-16 gap-y-8 lg:grid-cols-[1fr_1fr] lg:grid-rows-[auto_auto_auto]">
        {/* Téléphone : titre, roue, puis texte. Ordinateur : texte à gauche, roue à droite. */}
        <div className="lg:col-start-1 lg:row-start-1 lg:self-end">
          <p className="mb-6 inline-flex items-center gap-2 text-xs font-bold tracking-[0.16em] text-tomette-deep uppercase">
            <span aria-hidden className="h-px w-8 bg-tomette" />
            {fr(hero.eyebrow)}
          </p>
          <h1 id="hero-title" data-split className="split font-display text-[2.15rem] leading-[1.04] font-semibold tracking-[-0.03em] text-balance sm:text-5xl lg:text-[3.35rem]">
            <Words text={`${first}.`} />{" "}
            <span className="text-tomette-deep italic">
              <Words text={second} offset={first.split(" ").length} />
            </span>
          </h1>
        </div>

        <div data-fx="parallax" data-depth="-140" className="relative mx-auto w-full max-w-[330px] sm:max-w-[440px] lg:col-start-2 lg:row-span-3 lg:row-start-1 lg:max-w-[500px]">
          <Tilt max={6}>
            <div aria-hidden className="absolute inset-x-4 top-8 bottom-12 rounded-[44px] bg-paper/80 shadow-lg ring-1 ring-line/70 sm:top-10 [@media(hover:hover)]:[transform:translateZ(-40px)]" />
            <Awning className="relative mx-auto h-7 w-[calc(100%-0.5rem)] drop-shadow-sm sm:h-9" />
            <div className="relative px-5 pt-3 sm:px-6 sm:pt-4 [@media(hover:hover)]:[transform:translateZ(30px)]">
              <HeroWheel />
            </div>
          </Tilt>
          {hero.floating.map((label, i) => (
            <span
              key={label}
              aria-hidden
              className={`float pointer-events-none absolute z-10 inline-flex items-center gap-2 rounded-full bg-paper px-3.5 py-2 text-sm font-semibold shadow-md ring-1 ring-line ${TAGS[i].className}`}
              style={{ ["--r" as string]: TAGS[i].rotate, animationDelay: TAGS[i].delay }}
            >
              <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-tomette text-white">
                <Gift size={13} strokeWidth={2.5} />
              </span>
              {fr(label)}
            </span>
          ))}
        </div>

        <p className="max-w-md text-lg text-ink-soft sm:text-xl lg:col-start-1 lg:row-start-2">{fr(hero.lead)}</p>

        <div className="lg:col-start-1 lg:row-start-3 lg:self-start">
          <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:gap-5">
            <ButtonLink href="#demo" size="lg">
              {cta.primary}
            </ButtonLink>
          </div>
          <ul className="mt-8 flex flex-wrap gap-x-5 gap-y-2 text-sm font-medium text-ink-soft">
            {hero.reassurance.map((r) => (
              <li key={r} className="flex items-center gap-2">
                <span aria-hidden className="h-1.5 w-1.5 rounded-full bg-sauge" />
                {fr(r)}
              </li>
            ))}
          </ul>
        </div>
      </Container>
    </section>
  );
}
