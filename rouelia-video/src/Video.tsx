import React from "react";
import { AbsoluteFill, Audio, interpolate, Sequence, staticFile, useCurrentFrame, getStaticFiles } from "remotion";
import timing from "./timing.json";
import { SCENES } from "./scenes";
import { fontCss } from "./theme";
import { clamp, ease, easeIn } from "./components";

const OVERLAP = 8;

/** Entrée et sortie de scène : zoom avant, flou de vitesse, léger décalage. */
function Shell({ children, len, first, last }: { children: React.ReactNode; len: number; first: boolean; last: boolean }) {
  const f = useCurrentFrame();
  const inP = first ? 1 : interpolate(f, [0, OVERLAP + 2], [0, 1], { ...clamp, easing: ease });
  const outP = last ? 0 : interpolate(f, [len - 2, len + OVERLAP], [0, 1], { ...clamp, easing: easeIn });
  const scale = (1.18 - 0.18 * inP) * (1 + 0.25 * outP);
  const blur = (1 - inP) * 18 + outP * 22;
  const opacity = Math.min(inP * 1.6, 1 - outP);
  return <AbsoluteFill style={{ transform: `scale(${scale}) translateY(${(1 - inP) * 60 - outP * 60}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity }}>{children}</AbsoluteFill>;
}

export function RoueliaVideo() {
  const entries = Object.entries(timing.scenes) as [keyof typeof SCENES, number[]][];
  const hasAudio = getStaticFiles().some((f) => f.name === "audio/mix.wav");
  return (
    <AbsoluteFill style={{ background: "#FBF6EE" }}>
      <style>{fontCss}</style>
      {entries.map(([id, [from, to]], k) => {
        const Scene = SCENES[id];
        const len = to - from;
        return (
          <Sequence key={id} from={from} durationInFrames={len + (k === entries.length - 1 ? 0 : OVERLAP)} name={id}>
            <Shell len={len} first={k === 0} last={k === entries.length - 1}>
              <Scene />
            </Shell>
          </Sequence>
        );
      })}
      {hasAudio ? <Audio src={staticFile("audio/mix.wav")} /> : null}
    </AbsoluteFill>
  );
}
