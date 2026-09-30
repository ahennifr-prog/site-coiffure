"use client";

import { forwardRef, useCallback, useEffect, useId, useImperativeHandle, useMemo, useRef } from "react";
import type { PrizeIcon } from "@/lib/types";
import { segmentAt, targetRotation } from "@/lib/wheel";
import { prizeIcons } from "./icons";

export interface WheelSegment {
  label: string;
  color: string;
  textColor: string;
  icon?: PrizeIcon;
  image?: string;
}

export interface WheelHandle {
  /** Fait tourner la roue jusqu'au segment `index`. Se résout à l'arrêt complet. */
  spin: (index: number) => Promise<void>;
  isSpinning: () => boolean;
}

interface WheelProps {
  segments: WheelSegment[];
  /** Couleur du cerclage extérieur. */
  rimColor?: string;
  /** Logo au centre (URL ou data URL). */
  logo?: string | null;
  /** Texte du centre si pas de logo (initiales du commerce). */
  monogram?: string;
  hubColor?: string;
  /** Couleur du pointeur et de sa pastille. */
  pointerColor?: string;
  pointerDot?: string;
  /** Couleurs des ampoules du cerclage. */
  bulbColors?: [string, string];
  /** Rotation lente en attente. */
  idle?: boolean;
  sound?: boolean;
  className?: string;
  label: string;
}

const CX = 200;
const CY = 214;
const R = 176;
const HUB = 44;
const ICON_R = 146;
const TEXT_R = 112;

function polar(angleDeg: number, r: number): [number, number] {
  const a = (angleDeg * Math.PI) / 180;
  return [CX + r * Math.sin(a), CY - r * Math.cos(a)];
}

function wedge(start: number, end: number): string {
  const [x0, y0] = polar(start, R);
  const [x1, y1] = polar(end, R);
  const large = end - start > 180 ? 1 : 0;
  return `M ${CX} ${CY} L ${x0} ${y0} A ${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`;
}

/** Coupe un libellé en lignes d'au plus `max` caractères. */
function splitLines(label: string, max: number): string[] {
  // Les espaces avant « % » et « € » restent insécables : on ne coupe pas « 10 % ».
  const words = label.replace(/ ([%€])/g, "\u00A0$1").split(" ");
  const lines: string[] = [];
  let cur = "";
  for (const w of words) {
    if (!cur) cur = w;
    else if ((cur + " " + w).length <= max) cur += " " + w;
    else {
      lines.push(cur);
      cur = w;
    }
  }
  if (cur) lines.push(cur);
  return lines;
}

/**
 * Ajuste un libellé au segment : deux lignes à la taille normale,
 * sinon trois lignes un peu plus petites, et en dernier recours une coupe propre.
 */
function fitLabel(label: string, max: number, size: number): { lines: string[]; size: number } {
  const two = splitLines(label, max);
  if (two.length <= 2 && two.every((l) => l.length <= max)) return { lines: two, size };
  const smallMax = Math.round(max * 1.2);
  const three = splitLines(label, smallMax);
  if (three.length <= 3 && three.every((l) => l.length <= smallMax)) return { lines: three, size: size * 0.84 };
  const cut = three.slice(0, 3);
  cut[2] = (cut[2].length > smallMax - 1 ? cut[2].slice(0, smallMax - 1) : cut[2]).trimEnd() + "…";
  return { lines: cut.map((l) => (l.length > smallMax ? l.slice(0, smallMax - 1) + "…" : l)), size: size * 0.84 };
}

const easeOutQuart = (t: number) => 1 - (1 - t) ** 4;
const easeInOut = (t: number) => (t < 0.5 ? 2 * t * t : 1 - (-2 * t + 2) ** 2 / 2);

export const Wheel = forwardRef<WheelHandle, WheelProps>(function Wheel(
  {
    segments,
    rimColor = "#A33317",
    logo,
    monogram,
    hubColor = "#C4401F",
    pointerColor = "#1D1A16",
    pointerDot = "#F3B23C",
    bulbColors = ["#FFFFFF", "#FCEBC8"],
    idle = false,
    sound = false,
    className,
    label,
  },
  ref,
) {
  const uid = useId().replace(/:/g, "");
  const rotor = useRef<HTMLDivElement>(null);
  const pointer = useRef<SVGGElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const rotation = useRef(0);
  const spinning = useRef(false);
  const visible = useRef(true);
  const soundRef = useRef(sound);
  const audio = useRef<AudioContext | null>(null);
  const n = segments.length;
  const nRef = useRef(n);
  nRef.current = n;
  soundRef.current = sound;

  const apply = useCallback(() => {
    // Transformation CSS sur un calque à part : la carte graphique la prend en charge, sans redessiner le SVG.
    if (rotor.current) rotor.current.style.transform = `rotate(${rotation.current % 360}deg)`;
  }, []);

  const tick = useCallback(() => {
    pointer.current?.animate?.(
      [{ transform: "rotate(-16deg)" }, { transform: "rotate(0deg)" }],
      { duration: 160, easing: "ease-out" },
    );
    if (!soundRef.current) return;
    try {
      const Ctx = window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      audio.current ??= new Ctx();
      const ctx = audio.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "triangle";
      osc.frequency.value = 1400;
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.04);
      osc.connect(gain).connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      /* son indisponible : on continue sans */
    }
  }, []);

  // Rotation lente en attente, suspendue hors écran et quand l'onglet est caché.
  useEffect(() => {
    if (!idle) return;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduce) return;
    let raf = 0;
    let last = performance.now();
    // On laisse la page finir de se charger avant de lancer la rotation lente.
    const startAt = last + 1200;
    const loop = (now: number) => {
      if (now < startAt) {
        last = now;
        raf = requestAnimationFrame(loop);
        return;
      }
      const dt = Math.min(64, now - last);
      last = now;
      if (!spinning.current && visible.current && !document.hidden) {
        rotation.current += dt * 0.006;
        apply();
      }
      raf = requestAnimationFrame(loop);
    };
    raf = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(raf);
  }, [idle, apply]);

  useEffect(() => {
    const el = rootRef.current;
    if (!el || typeof IntersectionObserver === "undefined") return;
    const io = new IntersectionObserver(([e]) => (visible.current = e.isIntersecting));
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useEffect(() => apply(), [apply, n]);

  useImperativeHandle(
    ref,
    () => ({
      isSpinning: () => spinning.current,
      spin: (index: number) =>
        new Promise<void>((resolve) => {
          if (spinning.current) return resolve();
          spinning.current = true;
          const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
          const count = nRef.current;
          const start = rotation.current;
          const end = targetRotation(start, index, count, Math.random, reduce ? 0 : 5 + Math.floor(Math.random() * 2));
          const overshoot = reduce ? 0 : Math.min(4, 360 / count / 5);
          const d1 = reduce ? 450 : 4600 + Math.random() * 800;
          const d2 = reduce ? 0 : 520;
          const t0 = performance.now();
          let lastSeg = segmentAt(start, count);
          const frame = (now: number) => {
            const el = now - t0;
            if (el < d1) {
              rotation.current = start + (end + overshoot - start) * easeOutQuart(el / d1);
            } else if (el < d1 + d2) {
              rotation.current = end + overshoot - overshoot * easeInOut((el - d1) / d2);
            } else {
              rotation.current = end;
              apply();
              spinning.current = false;
              resolve();
              return;
            }
            apply();
            const seg = segmentAt(rotation.current, count);
            if (seg !== lastSeg) {
              lastSeg = seg;
              if (!reduce) tick();
            }
            requestAnimationFrame(frame);
          };
          requestAnimationFrame(frame);
        }),
    }),
    [apply, tick],
  );

  const seg = 360 / Math.max(1, n);
  const fontSize = n <= 4 ? 19 : n <= 6 ? 16.5 : 14;
  const maxChars = n <= 4 ? 12 : n <= 6 ? 11 : 10;
  const bulbs = useMemo(() => Array.from({ length: 24 }, (_, i) => polar((i * 360) / 24, R + 11)), []);

  const origin = `50% ${(CY / 414) * 100}%`;

  return (
    <div ref={rootRef} role="img" aria-label={label} className={`relative ${className ?? ""}`} style={{ aspectRatio: "400 / 414" }}>
      {/* Calque fixe : cerclage et ampoules */}
      <svg aria-hidden viewBox="0 0 400 414" className="absolute inset-0 h-full w-full">
        <circle cx={CX} cy={CY} r={R + 20} fill={rimColor} />
        {bulbs.map(([x, y], i) => (
          <circle key={i} cx={x} cy={y} r={3.6} fill={i % 2 ? bulbColors[1] : bulbColors[0]} opacity={0.95} />
        ))}
      </svg>

      {/* Calque tournant : les segments */}
      <div ref={rotor} className="absolute inset-0 will-change-transform" style={{ transformOrigin: origin }}>
        <svg aria-hidden viewBox="0 0 400 414" className="h-full w-full">
          <defs>
            {segments.map((s, i) =>
              s.image ? (
                <clipPath key={i} id={`img-${uid}-${i}`}>
                  <circle cx={CX} cy={CY - ICON_R} r={17} />
                </clipPath>
              ) : null,
            )}
          </defs>
          {segments.map((s, i) => {
            const start = i * seg;
            const mid = start + seg / 2;
            const { lines, size: fs } = fitLabel(s.label, maxChars, fontSize);
            const IconCmp = s.icon ? prizeIcons[s.icon]?.Icon : undefined;
            return (
              <g key={i}>
                <path d={n === 1 ? `M ${CX - R} ${CY} a ${R} ${R} 0 1 0 ${2 * R} 0 a ${R} ${R} 0 1 0 ${-2 * R} 0` : wedge(start, start + seg)} fill={s.color} stroke="#FFFFFF" strokeOpacity={0.55} strokeWidth={1.5} />
                <g transform={`rotate(${mid} ${CX} ${CY})`}>
                  {s.image ? (
                    <>
                      <circle cx={CX} cy={CY - ICON_R} r={19} fill="#FFFFFF" />
                      <image
                        href={s.image}
                        x={CX - 17}
                        y={CY - ICON_R - 17}
                        width={34}
                        height={34}
                        preserveAspectRatio="xMidYMid slice"
                        clipPath={`url(#img-${uid}-${i})`}
                      />
                    </>
                  ) : IconCmp ? (
                    <IconCmp x={CX - 12} y={CY - ICON_R - 12} width={24} height={24} color={s.textColor} strokeWidth={2} aria-hidden />
                  ) : null}
                  <text
                    x={CX}
                    y={CY - TEXT_R}
                    textAnchor="middle"
                    fill={s.textColor}
                    fontSize={fs}
                    fontWeight={700}
                    fontFamily="var(--font-body), system-ui, sans-serif"
                    aria-hidden
                  >
                    {lines.map((l, k) => (
                      <tspan key={k} x={CX} dy={k === 0 ? 0 : fs * 1.1}>
                        {l}
                      </tspan>
                    ))}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>

      {/* Calque fixe : reflet, moyeu, pointeur */}
      <svg aria-hidden viewBox="0 0 400 414" className="pointer-events-none absolute inset-0 h-full w-full">
        <defs>
          <filter id={`sh-${uid}`} x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="3" stdDeviation="3" floodColor="#3C1E0A" floodOpacity="0.25" />
          </filter>
          <radialGradient id={`gloss-${uid}`} cx="50%" cy="35%" r="65%">
            <stop offset="0%" stopColor="#FFFFFF" stopOpacity="0.18" />
            <stop offset="60%" stopColor="#FFFFFF" stopOpacity="0" />
          </radialGradient>
          <clipPath id={`hub-${uid}`}>
            <circle cx={CX} cy={CY} r={HUB - 6} />
          </clipPath>
        </defs>
        <circle cx={CX} cy={CY} r={R} fill={`url(#gloss-${uid})`} />
        {/* Moyeu */}
        <circle cx={CX} cy={CY} r={HUB} fill="#FFFFFF" filter={`url(#sh-${uid})`} />
        {logo ? (
          <image
            href={logo}
            x={CX - HUB + 6}
            y={CY - HUB + 6}
            width={(HUB - 6) * 2}
            height={(HUB - 6) * 2}
            preserveAspectRatio="xMidYMid meet"
            clipPath={`url(#hub-${uid})`}
          />
        ) : (
          <>
            <circle cx={CX} cy={CY} r={HUB - 6} fill={hubColor} />
            <text
              x={CX}
              y={CY + 9}
              textAnchor="middle"
              fill="#FFFFFF"
              fontSize={monogram && monogram.length > 1 ? 24 : 28}
              fontWeight={600}
              fontFamily="var(--font-playfair), Georgia, serif"
              aria-hidden
            >
              {monogram || "R"}
            </text>
          </>
        )}

        {/* Pointeur */}
        <g ref={pointer} style={{ transformOrigin: `${CX}px 22px`, transformBox: "view-box" }} filter={`url(#sh-${uid})`}>
          <path d={`M ${CX} 62 C ${CX - 8} 48 ${CX - 20} 38 ${CX - 20} 24 A 20 20 0 1 1 ${CX + 20} 24 C ${CX + 20} 38 ${CX + 8} 48 ${CX} 62 Z`} fill={pointerColor} />
          <circle cx={CX} cy={24} r={7} fill={pointerDot} />
        </g>
      </svg>
    </div>
  );
});
