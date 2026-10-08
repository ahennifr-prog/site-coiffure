"use client";

import { useRef, useState } from "react";
import { Play, RotateCcw, Volume2 } from "lucide-react";
import { cta, video } from "@/content";
import { fr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Container } from "@/components/ui/Section";

/**
 * La vidéo de présentation, en horizontal sur tous les écrans. Rien n'est chargé avant le clic :
 * on affiche une image fixe, puis la vidéo démarre avec le son.
 */
export function VideoShowcase() {
  const ref = useRef<HTMLVideoElement>(null);
  const [playing, setPlaying] = useState(false);
  const [ended, setEnded] = useState(false);

  function play() {
    setEnded(false);
    setPlaying(true);
  }

  function replay() {
    setEnded(false);
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play();
  }

  return (
    <section id="video" aria-label={video.caption} className="relative">
      <Container>
        <div data-fx="grow">
          <div className="relative origin-top mx-auto aspect-video w-full overflow-hidden rounded-[14px] bg-night shadow-lg ring-1 ring-black/5 sm:rounded-[24px]">
            {playing ? (
              <video
                ref={ref}
                autoPlay
                controls
                playsInline
                preload="auto"
                onEnded={() => setEnded(true)}
                onPlay={() => setEnded(false)}
                className="absolute inset-0 h-full w-full bg-night object-contain"
              >
                {/* H.264 d'abord (lu partout), WebM en secours. */}
                <source src={video.mp4} type="video/mp4" />
                <source src={video.webm} type="video/webm" />
              </video>
            ) : (
              <button type="button" onClick={play} aria-label={video.play} className="group absolute inset-0 block h-full w-full cursor-pointer">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={video.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]" />
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
                <span aria-hidden className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-16 w-16 items-center justify-center rounded-full bg-tomette text-white shadow-[0_20px_60px_-10px_rgb(196_64_31/0.8)] transition-transform duration-500 group-hover:scale-110 sm:h-28 sm:w-28">
                    <span className="absolute inset-0 animate-ping rounded-full bg-tomette/40 [animation-duration:2.4s]" />
                    <Play size={30} className="relative translate-x-0.5 sm:scale-125" fill="currentColor" />
                  </span>
                </span>
                <span aria-hidden className="absolute bottom-0 left-0 p-3 text-xs font-semibold text-white sm:p-7 sm:text-sm">
                  <span className="inline-flex items-center gap-2 rounded-full bg-ink/45 px-3 py-1.5">
                    <Volume2 size={16} /> {video.sound}
                  </span>
                </span>
              </button>
            )}

            {ended ? (
              <div className="pop-in absolute inset-0 flex flex-col items-center justify-center gap-3 bg-ink/80 p-4 text-center text-white sm:gap-5 sm:p-6">
                <p className="font-display text-2xl font-semibold sm:text-5xl">{fr(video.endTitle)}</p>
                <ButtonLink href={cta.href} size="lg">
                  {cta.primary}
                </ButtonLink>
                <p className="hidden text-sm text-white/85 sm:block">{fr(video.endNote)}</p>
                <button type="button" onClick={replay} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">
                  <RotateCcw aria-hidden size={16} /> {video.replay}
                </button>
              </div>
            ) : null}
          </div>
        </div>
        {/* Résumé texte de la vidéo : toujours dans le HTML, lisible par les moteurs et les lecteurs d'écran. */}
        <details className="group mx-auto mt-3 max-w-3xl text-sm text-ink-soft">
          <summary className="inline-flex min-h-11 items-center gap-1.5 font-semibold text-tomette-deep">
            {video.summaryToggle}
          </summary>
          <div className="space-y-2 pb-2">
            {video.summary.map((t) => (
              <p key={t}>{fr(t)}</p>
            ))}
          </div>
        </details>
      </Container>
    </section>
  );
}
