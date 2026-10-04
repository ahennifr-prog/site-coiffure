"use client";

import { useEffect, useRef, useState } from "react";
import { howItWorks, ui } from "@/content";
import { fr } from "@/lib/format";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { stepArts } from "./StepArt";

const N = howItWorks.steps.length;
const clamp01 = (v: number) => Math.min(1, Math.max(0, v));

/**
 * Le parcours de la cliente, piloté par le défilement : la section reste épinglée,
 * chaque étape arrive en relief pendant que le tracé se remplit. Sans animation
 * (préférence système), on affiche une simple liste.
 */
export function HowItWorks() {
  const track = useRef<HTMLDivElement>(null);
  const [pos, setPos] = useState(0);
  const [still, setStill] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const sync = () => setStill(mq.matches);
    sync();
    mq.addEventListener("change", sync);
    return () => mq.removeEventListener("change", sync);
  }, []);

  useEffect(() => {
    if (still) return;
    let raf = 0;
    const measure = () => {
      raf = 0;
      const el = track.current;
      if (!el) return;
      const r = el.getBoundingClientRect();
      const pinned = el.firstElementChild as HTMLElement | null;
      const travel = r.height - (pinned?.offsetHeight ?? window.innerHeight);
      const p = travel > 0 ? clamp01(-r.top / travel) : 0;
      // Chaque étape occupe une part égale du trajet : elle reste posée, puis bascule
      // vers la suivante dans le tiers central du palier.
      const raw = Math.min(N - 1, Math.max(0, p * N - 0.5));
      const i = Math.floor(raw);
      const t = clamp01((raw - i - 0.33) / 0.34);
      setPos(Math.min(N - 1, i + t * t * (3 - 2 * t)));
    };
    const onScroll = () => {
      if (!raf) raf = requestAnimationFrame(measure);
    };
    measure();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, [still]);

  const active = Math.round(pos);
  const fill = (pos / (N - 1)) * 100;

  const header = (
    <div className="max-w-xl">
      <Eyebrow>{howItWorks.eyebrow}</Eyebrow>
      <SectionTitle id="fonctionnement-title">{howItWorks.title}</SectionTitle>
    </div>
  );

  if (still) {
    return (
      <section id="fonctionnement" aria-labelledby="fonctionnement-title" className="py-(--section-y)">
        <Container>
          {header}
          <ol className="mt-14 grid gap-10 sm:grid-cols-2">
            {howItWorks.steps.map((s, i) => {
              const Art = stepArts[i];
              return (
                <li key={s.title}>
                  <div className="flex h-44 items-center justify-center rounded-xl bg-paper ring-1 ring-line">
                    <Art />
                  </div>
                  <p className="mt-5 text-sm font-bold text-tomette-deep">{ui.step(i + 1)}</p>
                  <h3 className="mt-1 text-xl font-bold">{fr(s.title)}</h3>
                  <p className="mt-2 text-ink-soft">{fr(s.text)}</p>
                </li>
              );
            })}
          </ol>
          <p className="mt-14 text-lg font-medium">{fr(howItWorks.transition)}</p>
        </Container>
      </section>
    );
  }

  return (
    <section id="fonctionnement" aria-labelledby="fonctionnement-title" className="relative">
      <div ref={track} className="relative" style={{ height: `${N * 75 + 100}svh` }}>
        <div className="sticky top-(--nav-h) flex h-[calc(100svh-var(--nav-h))] items-center overflow-hidden">
          <Container className="grid h-full grid-rows-[auto_auto_1fr] content-center gap-y-6 py-6 lg:grid-cols-[1fr_1.05fr] lg:grid-rows-[auto_1fr] lg:gap-x-20 lg:gap-y-10 lg:py-12">
            <div className="lg:col-start-1 lg:row-start-1 lg:self-end">{header}</div>

            {/* Scène 3D : l'illustration de l'étape active arrive en relief. */}
            <div className="relative mx-auto aspect-[5/4] w-full max-w-[min(100%,34svh*1.25)] lg:col-start-2 lg:row-span-2 lg:row-start-1 lg:max-w-[520px] lg:self-center" style={{ perspective: "1400px" }}>
              <div aria-hidden className="absolute inset-0 rounded-[36px] bg-paper shadow-lg ring-1 ring-line" />
              <div aria-hidden className="absolute inset-[18%] rounded-full bg-tomette-soft/70 blur-3xl" />
              <div aria-hidden className="awning absolute inset-x-0 top-0 h-3 rounded-t-[36px] opacity-90" />
              <svg aria-hidden viewBox="0 0 500 400" className="absolute inset-0 h-full w-full" preserveAspectRatio="none">
                <path
                  d="M 40 340 C 140 260, 120 120, 250 110 S 420 200, 460 60"
                  fill="none"
                  stroke="var(--color-tomette)"
                  strokeOpacity="0.25"
                  strokeWidth="2"
                  strokeDasharray="6 10"
                  pathLength={100}
                  style={{ strokeDashoffset: 100 - fill }}
                />
              </svg>
              <span aria-hidden className="absolute right-6 bottom-3 font-display text-[7rem] leading-none font-semibold tracking-[-0.05em] text-transparent [-webkit-text-stroke:1.5px_var(--color-line)] sm:text-[9rem]">
                {String(active + 1).padStart(2, "0")}
              </span>
              {stepArts.map((Art, i) => {
                const d = pos - i;
                const o = clamp01(1 - Math.abs(d) * 1.6);
                return (
                  <div
                    key={i}
                    aria-hidden
                    className="absolute inset-0 flex items-center justify-center"
                    style={{
                      opacity: o,
                      transform: `translate3d(0, ${-d * 90}px, ${-Math.abs(d) * 260}px) rotateX(${d * 28}deg) rotateY(${-d * 10}deg)`,
                      visibility: o === 0 ? "hidden" : "visible",
                    }}
                  >
                    <div className="scale-[1.35] drop-shadow-[0_30px_40px_rgb(60_30_10/0.18)] sm:scale-[1.6] lg:scale-[1.9]">
                      <Art />
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Le tracé : un rail vertical qui se remplit, une étape par palier. */}
            <ol className="relative self-start lg:col-start-1 lg:row-start-2 lg:self-start">
              <span aria-hidden className="absolute top-3 bottom-3 left-[11px] w-0.5 rounded-full bg-line" />
              <span aria-hidden className="absolute top-3 left-[11px] w-0.5 rounded-full bg-tomette" style={{ height: `calc((100% - 24px) * ${fill / 100})` }} />
              {howItWorks.steps.map((s, i) => {
                const on = i === active;
                const done = i < active;
                return (
                  <li key={s.title} aria-current={on ? "step" : undefined} className="relative pb-4 pl-11 last:pb-0 lg:pb-6">
                    <span
                      aria-hidden
                      className={`absolute top-1 left-0 flex h-6 w-6 items-center justify-center rounded-full text-[11px] font-bold transition-all duration-500 ${
                        on ? "scale-110 bg-tomette text-white shadow-[0_0_0_6px_var(--color-tomette-soft)]" : done ? "bg-tomette text-white" : "bg-paper text-ink-soft ring-2 ring-line"
                      }`}
                    >
                      {i + 1}
                    </span>
                    <h3 className={`text-lg font-bold transition-colors duration-500 lg:text-xl ${on ? "text-ink" : "text-ink-soft/60"}`}>
                      <span className="sr-only">{ui.step(i + 1)} : </span>
                      {fr(s.title)}
                    </h3>
                    <div className={`grid transition-[grid-template-rows,opacity] duration-500 ${on ? "grid-rows-[1fr] opacity-100" : "grid-rows-[0fr] opacity-0"}`}>
                      <p className="overflow-hidden pt-1 text-ink-soft">{fr(s.text)}</p>
                    </div>
                  </li>
                );
              })}
            </ol>
          </Container>
        </div>
      </div>
    </section>
  );
}
