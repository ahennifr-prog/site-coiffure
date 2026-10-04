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
  // Léger pivot 3D à l'entrée et à la sortie.
  const rotY = (1 - inP) * -7 + outP * 7;
  const blur = (1 - inP) * 18 + outP * 22;
  const opacity = Math.min(inP * 1.6, 1 - outP);
  return <AbsoluteFill style={{ transform: `perspective(2200px) rotateY(${rotY}deg) scale(${scale}) translateY(${(1 - inP) * 60 - outP * 60}px)`, filter: blur > 0.3 ? `blur(${blur}px)` : undefined, opacity }}>{children}</AbsoluteFill>;
}

/** Effets de lumière par-dessus l'image : reflet qui balaie l'écran à chaque coupe, bokeh doux, vignette. */
function LightFx({ cuts }: { cuts: number[] }) {
  const f = useCurrentFrame();
  const cut = [...cuts].reverse().find((c) => f >= c - 4);
  const p = cut === undefined ? -1 : (f - (cut - 4)) / 18;
  const bokeh = [
    { x: 0.12, y: 0.2, r: 160, s: 0.7 }, { x: 0.85, y: 0.32, r: 110, s: 1.1 }, { x: 0.25, y: 0.78, r: 130, s: 0.9 },
    { x: 0.7, y: 0.86, r: 180, s: 0.6 }, { x: 0.55, y: 0.12, r: 90, s: 1.3 }, { x: 0.92, y: 0.62, r: 140, s: 0.8 },
  ];
  return (
    <AbsoluteFill style={{ pointerEvents: "none" }}>
      {bokeh.map((b, k) => (
        <div key={k} style={{ position: "absolute", left: `${b.x * 100}%`, top: `${b.y * 100}%`, width: b.r * 2, height: b.r * 2, marginLeft: -b.r, marginTop: -b.r, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,236,200,0.55), rgba(255,236,200,0) 70%)", mixBlendMode: "screen", opacity: 0.35 + 0.2 * Math.sin(f / 25 + k), transform: `translate(${Math.sin(f / 60 * b.s + k) * 40}px, ${Math.cos(f / 70 * b.s + k * 2) * 50}px)` }} />
      ))}
      {p >= 0 && p <= 1 ? (
        <div style={{ position: "absolute", top: -400, bottom: -400, width: 520, left: `${-40 + p * 140}%`, transform: "rotate(18deg)", background: "linear-gradient(90deg, rgba(255,255,255,0), rgba(255,244,222,0.8), rgba(255,255,255,0))", mixBlendMode: "screen", filter: "blur(18px)", opacity: Math.sin(p * Math.PI) }} />
      ) : null}
      <AbsoluteFill style={{ background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 60%, rgba(60,30,10,0.14) 100%)" }} />
    </AbsoluteFill>
  );
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
      <LightFx cuts={entries.slice(1).map(([, [from]]) => from)} />
      {hasAudio ? <Audio src={staticFile("audio/mix.wav")} /> : null}
    </AbsoluteFill>
  );
}
