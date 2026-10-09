import { howItWorks, ui } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { Reveal } from "@/components/ui/Reveal";
import { Tilt } from "@/components/ui/Tilt";
import { stepArts } from "./StepArt";

/**
 * Le parcours du client en trois étapes, lisible d'un coup d'œil.
 * Ordinateur : trois colonnes, un tracé horizontal qui se remplit au défilement et des scènes en relief
 * (qui suivent la souris), qui arrivent l'une après l'autre. Téléphone : un rail vertical qui se remplit,
 * chaque étape en une ligne (texte et illustration côte à côte). Sans animation (préférence système), tout est fixe.
 */
export function HowItWorks() {
  return (
    <section id="fonctionnement" aria-labelledby="fonctionnement-title" className="py-(--section-y)">
      <Container>
        <div className="max-w-xl">
          <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
          <SectionTitle id="fonctionnement-title">{howItWorks.title}</SectionTitle>
          <p className="mt-4 text-lg text-ink-soft">{fr(howItWorks.answer)}</p>
        </div>

        {/* Téléphone et tablette */}
        <ol className="relative mt-10 space-y-7 lg:hidden">
          <span aria-hidden data-fx="rail" className="absolute top-2 bottom-2 left-[15px] w-0.5 rounded-full bg-line">
            <span className="tl-fill absolute inset-0 origin-top rounded-full bg-tomette" />
          </span>
          {howItWorks.steps.map((s, i) => {
            const Art = stepArts[i];
            return (
              <li key={s.title} className="relative pl-12">
                <span aria-hidden className="absolute top-0 left-0 flex h-8 w-8 items-center justify-center rounded-full bg-tomette text-sm font-bold text-white shadow-[0_0_0_6px_var(--color-cream)]">
                  {i + 1}
                </span>
                <Reveal className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 sm:gap-6">
                  <div>
                    <h3 className="text-lg leading-snug font-bold sm:text-xl">
                      <span className="sr-only">{ui.step(i + 1)} : </span>
                      {fr(s.title)}
                    </h3>
                    <p className="mt-1 text-[15px] text-ink-soft sm:text-base">{fr(s.text)}</p>
                  </div>
                  <div aria-hidden className="flex h-28 w-32 items-center justify-center overflow-hidden rounded-[20px] bg-paper shadow-md ring-1 ring-line sm:h-40 sm:w-52">
                    <div className="scale-[0.64] sm:scale-100">
                      <Art />
                    </div>
                  </div>
                </Reveal>
              </li>
            );
          })}
        </ol>

        {/* Ordinateur : trois colonnes reliées par un tracé */}
        <ol className="relative mt-16 hidden grid-cols-3 gap-10 lg:grid xl:gap-14">
          <span aria-hidden data-fx="railx" className="absolute top-[18px] right-[16.5%] left-[16.5%] h-0.5 rounded-full bg-line">
            <span className="tl-fillx absolute inset-0 origin-left rounded-full bg-tomette" />
          </span>
          {howItWorks.steps.map((s, i) => {
            const Art = stepArts[i];
            return (
              <li key={s.title} className="relative text-center">
                <span aria-hidden className="relative mx-auto flex h-9 w-9 items-center justify-center rounded-full bg-tomette text-sm font-bold text-white shadow-[0_0_0_8px_var(--color-cream)]">
                  {i + 1}
                </span>
                <Reveal delay={i * 140} className="mt-8">
                  <Tilt max={8}>
                    <div aria-hidden className="relative aspect-[5/4] overflow-hidden rounded-[28px] bg-paper shadow-lg ring-1 ring-line">
                      <div className="awning absolute inset-x-0 top-0 h-3 opacity-90" />
                      <div className="absolute inset-[10%] rounded-full bg-[radial-gradient(closest-side,var(--color-tomette-soft),transparent)]" />
                      <span className="absolute right-4 bottom-1 font-display text-[5.5rem] leading-none font-semibold tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-line)]">
                        {String(i + 1).padStart(2, "0")}
                      </span>
                      <div className="absolute inset-0 flex items-center justify-center [@media(hover:hover)]:[transform:translateZ(40px)]">
                        <div className="scale-[1.35] xl:scale-150">
                          <Art />
                        </div>
                      </div>
                    </div>
                  </Tilt>
                  <h3 className="mt-6 text-xl font-bold text-balance">
                    <span className="sr-only">{ui.step(i + 1)} : </span>
                    {fr(s.title)}
                  </h3>
                  <p className="mx-auto mt-2 max-w-xs text-ink-soft">{fr(s.text)}</p>
                </Reveal>
              </li>
            );
          })}
        </ol>
      </Container>
    </section>
  );
}
