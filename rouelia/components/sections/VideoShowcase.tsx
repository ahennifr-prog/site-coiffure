"use client";

import { useRef, useState } from "react";
import { Play, RotateCcw, Volume2 } from "lucide-react";
import { cta, video } from "@/content";
import { fr } from "@/lib/format";
import { ButtonLink } from "@/components/ui/Button";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";

/**
 * La vidéo de présentation. Rien n'est chargé avant le clic : on affiche une image fixe,
 * puis la bonne version (verticale sur téléphone, horizontale ailleurs) démarre avec le son.
 */
export function VideoShowcase() {
  const ref = useRef<HTMLVideoElement>(null);
  const [format, setFormat] = useState<typeof video.wide | null>(null);
  const [ended, setEnded] = useState(false);

  function play() {
    const wide = window.matchMedia("(min-width: 768px)").matches;
    setEnded(false);
    setFormat(wide ? video.wide : video.tall);
  }

  function replay() {
    setEnded(false);
    const v = ref.current;
    if (!v) return;
    v.currentTime = 0;
    void v.play();
  }

  return (
    <section id="video" aria-labelledby="video-title" className="relative pb-(--section-y)">
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{video.eyebrow}</Eyebrow>
          <SectionTitle id="video-title">{video.title}</SectionTitle>
        </div>
        <div className="mt-12" data-fx>
          <div className="fx-grow relative mx-auto aspect-[9/16] w-[min(100%,calc(80svh*9/16))] overflow-hidden rounded-[20px] bg-night shadow-lg ring-1 ring-black/5 md:aspect-video md:w-full">
            {format ? (
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
                <source src={format.mp4} type="video/mp4" />
                <source src={format.webm} type="video/webm" />
                <track kind="captions" srcLang="fr" label={video.captions} src={video.track} />
              </video>
            ) : (
              <button type="button" onClick={play} aria-label={video.play} className="group absolute inset-0 block h-full w-full cursor-pointer">
                <picture>
                  <source media="(min-width: 768px)" srcSet={video.wide.poster} />
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img src={video.tall.poster} alt="" loading="lazy" decoding="async" className="absolute inset-0 h-full w-full object-cover transition-transform duration-[1200ms] ease-out group-hover:scale-[1.03]" />
                </picture>
                <span aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/55 via-ink/10 to-transparent" />
                <span aria-hidden className="absolute inset-0 flex items-center justify-center">
                  <span className="relative flex h-24 w-24 items-center justify-center rounded-full bg-tomette text-white shadow-[0_20px_60px_-10px_rgb(196_64_31/0.8)] transition-transform duration-500 group-hover:scale-110 sm:h-28 sm:w-28">
                    <span className="absolute inset-0 animate-ping rounded-full bg-tomette/40 [animation-duration:2.4s]" />
                    <Play size={38} className="relative translate-x-0.5" fill="currentColor" />
                  </span>
                </span>
                <span aria-hidden className="absolute inset-x-0 bottom-0 flex items-center justify-between gap-3 p-5 text-sm font-semibold text-white sm:p-7">
                  <span className="inline-flex items-center gap-2 rounded-full bg-white/15 px-3 py-1.5 backdrop-blur-md">
                    <Volume2 size={16} /> {video.sound}
                  </span>
                  <span className="rounded-full bg-white/15 px-3 py-1.5 tabular backdrop-blur-md">{video.duration}</span>
                </span>
              </button>
            )}

            {ended ? (
              <div className="pop-in absolute inset-0 flex flex-col items-center justify-center gap-5 bg-ink/70 p-6 text-center text-white backdrop-blur-sm">
                <p className="font-display text-3xl font-semibold sm:text-5xl">{fr(video.endTitle)}</p>
                <ButtonLink href="#demo" size="lg">
                  {cta.primary}
                </ButtonLink>
                <p className="text-sm text-white/85">{fr(video.endNote)}</p>
                <button type="button" onClick={replay} className="inline-flex min-h-11 items-center gap-2 text-sm font-semibold underline underline-offset-4">
                  <RotateCcw aria-hidden size={16} /> {video.replay}
                </button>
              </div>
            ) : null}
          </div>
        </div>
      </Container>
    </section>
  );
}
