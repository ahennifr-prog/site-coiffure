import React from "react";
import { interpolate, spring, useCurrentFrame, useVideoConfig } from "remotion";
import { C, display, sans } from "./theme";
import { clamp, readable } from "./components";

/**
 * Habillage « 3D » de la pub story, dans l'esprit du flyer : or brillant, ruban rouge, lumière chaude,
 * reliefs, ampoules, profondeur. Tout est en CSS et SVG (aucun moteur 3D), donc rapide à rendre.
 */

export const GOLD = "linear-gradient(180deg, #FFF3C4 0%, #F7C948 38%, #D99A1E 68%, #A8670E 100%)";
export const GOLD_TEXT = "linear-gradient(180deg, #FFF6D0 0%, #FFD45A 40%, #E9A21F 70%, #B8720E 100%)";
export const RED = "linear-gradient(180deg, #EE4B2E 0%, #C9301A 55%, #95200E 100%)";
export const GREEN = "linear-gradient(180deg, #2E8A60 0%, #1F6B4A 55%, #134430 100%)";
export const DEEP_GREEN = "#123D2C";

/** Relief des textes : blanc sur ruban, vert foncé sur plaque, or sur fond. */
export const shadowWhite = "0 2px 0 #F1E2C2, 0 4px 0 #D9B97A, 0 6px 0 #A9782E, 0 12px 20px rgba(60,20,0,0.45)";
export const shadowDark = "0 2px 0 #FFFFFF, 0 4px 0 #E2CFA3, 0 6px 0 #C6A464, 0 12px 18px rgba(60,30,0,0.25)";
export const goldText: React.CSSProperties = { backgroundImage: GOLD_TEXT, WebkitBackgroundClip: "text", backgroundClip: "text", color: "transparent", filter: "drop-shadow(0 3px 0 #9A5B07) drop-shadow(0 6px 0 #6E3F02) drop-shadow(0 14px 18px rgba(60,20,0,0.45))" };

/* ------------------------------------------------------------------ */
/* Fond : lumière chaude, piliers flous, halos, rayons, sol brillant    */
/* ------------------------------------------------------------------ */

const BOKEH = Array.from({ length: 22 }, (_, i) => {
  const r = (n: number) => { const x = Math.sin(i * 91.7 + n * 13.3) * 43758.55; return x - Math.floor(x); };
  return { x: r(1), y: r(2), s: 30 + r(3) * 110, sp: 0.4 + r(4), o: 0.25 + r(5) * 0.5 };
});

export function GoldBg({ rays = true }: { rays?: boolean }) {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, overflow: "hidden", background: "radial-gradient(ellipse at 50% 38%, #FFF7E6 0%, #F8E3BC 42%, #EBC58C 78%, #D9A866 100%)" }}>
      {/* piliers d'un intérieur flou, pour la profondeur */}
      {[60, 300, 780, 1010].map((x, k) => (
        <div key={k} style={{ position: "absolute", left: x - 70 + Math.sin(f / 50 + k) * 12, top: -100, width: 140, height: 2200, background: "linear-gradient(180deg, rgba(255,255,255,0.75), rgba(255,240,210,0.15))", filter: "blur(30px)", opacity: 0.6 }} />
      ))}
      {rays ? (
        <div style={{ position: "absolute", left: 540 - 1300, top: 820 - 1300, width: 2600, height: 2600, background: "repeating-conic-gradient(from 0deg, rgba(255,255,255,0.22) 0deg 7deg, rgba(255,255,255,0) 7deg 20deg)", transform: `rotate(${f * 0.35}deg)`, maskImage: "radial-gradient(circle, black 10%, transparent 60%)", WebkitMaskImage: "radial-gradient(circle, black 10%, transparent 60%)" }} />
      ) : null}
      {BOKEH.map((b, k) => (
        <div key={k} style={{ position: "absolute", left: b.x * 1080 + Math.sin(f / 40 * b.sp + k) * 30, top: b.y * 1920 - ((f * b.sp * 0.8) % 200), width: b.s, height: b.s, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,231,160,0.95), rgba(255,200,90,0) 70%)", opacity: b.o * (0.7 + 0.3 * Math.sin(f / 12 + k)), filter: "blur(2px)" }} />
      ))}
      {/* sol brillant */}
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 0, height: 520, background: "linear-gradient(180deg, rgba(255,255,255,0) 0%, rgba(255,236,200,0.65) 40%, rgba(225,180,110,0.8) 100%)" }} />
      <div style={{ position: "absolute", left: 0, right: 0, bottom: 380, height: 4, background: "linear-gradient(90deg, transparent, rgba(255,255,255,0.8), transparent)", filter: "blur(2px)" }} />
      <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, rgba(0,0,0,0) 55%, rgba(90,45,5,0.28) 100%)" }} />
    </div>
  );
}

/** Serpentins dorés qui flottent. */
export function Streamers({ count = 10, seed = 1, fall = 1 }: { count?: number; seed?: number; fall?: number }) {
  const f = useCurrentFrame();
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r = (n: number) => { const x = Math.sin((i + seed * 7) * 78.2 + n * 17.1) * 12345.6; return x - Math.floor(x); };
        const x = r(1) * 1080;
        const y = ((r(2) * 2200 + f * (2 + r(3) * 3) * fall) % 2200) - 200;
        const rot = f * (2 + r(4) * 4) * (i % 2 ? 1 : -1);
        const w = 26 + r(5) * 30;
        return (
          <svg key={i} width={w} height={w * 2.6} viewBox="0 0 20 52" style={{ position: "absolute", left: x, top: y, transform: `rotate(${rot}deg) rotateY(${rot * 2}deg)`, filter: "drop-shadow(0 6px 6px rgba(120,60,0,0.3))", opacity: 0.9 }}>
            <defs>
              <linearGradient id={`st${i}-${seed}`} x1="0" x2="1">
                <stop offset="0" stopColor="#A8670E" /><stop offset="0.5" stopColor="#FFE07A" /><stop offset="1" stopColor="#C88414" />
              </linearGradient>
            </defs>
            <path d="M10 2 C 18 10, 2 16, 10 26 S 2 42, 10 50" fill="none" stroke={`url(#st${i}-${seed})`} strokeWidth="6" strokeLinecap="round" />
          </svg>
        );
      })}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Texte en relief                                                     */
/* ------------------------------------------------------------------ */

/** Phrase qui arrive mot par mot, avec relief. `gold` : mots en or. */
export function Pop({ text, at, step = 3, size = 90, font = sans, weight = 900, color = "#fff", shadow = shadowWhite, gold = [], width = 1000 }: { text: string; at: number; step?: number; size?: number; font?: string; weight?: number; color?: string; shadow?: string; gold?: string[]; width?: number }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return (
    <div style={{ maxWidth: width, display: "flex", flexWrap: "wrap", justifyContent: "center", columnGap: size * 0.24, rowGap: 0, fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.1, letterSpacing: "-0.01em" }}>
      {text.split(" ").map((w, i) => {
        const s = spring({ frame: frame - at - i * step, fps, config: { damping: 12, stiffness: 180 } });
        const isGold = gold.some((g) => w.toLowerCase().includes(g.toLowerCase()));
        const style: React.CSSProperties = isGold ? goldText : { color, textShadow: shadow };
        return (
          <span key={i} style={{ display: "inline-block", transform: `perspective(600px) translateY(${(1 - s) * size * 0.6}px) rotateX(${(1 - s) * -70}deg) scale(${0.7 + 0.3 * s})`, opacity: Math.min(1, s * 1.5), ...style }}>
            {w}
          </span>
        );
      })}
    </div>
  );
}

/** Plaque crème à bord doré (ligne 1) et ruban rouge (ligne 2), comme le titre du flyer. */
export function Banner({ plate, ribbon, at = 0, top = 300, gold = [], ribbonSize = 84, plateSize = 78 }: { plate?: string; ribbon: string; at?: number; top?: number; gold?: string[]; ribbonSize?: number; plateSize?: number }) {
  const f = useCurrentFrame();
  const { fps } = useVideoConfig();
  const p = spring({ frame: f - at, fps, config: { damping: 12, stiffness: 150 } });
  const rAt = at + (plate ? 5 : 0);
  const r = spring({ frame: f - rAt, fps, config: { damping: 13, stiffness: 140 } });
  const sway = Math.sin(f / 18) * 1.2;
  return (
    <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", transform: `perspective(1400px) rotateX(${8 + sway}deg)` }}>
      {plate ? (
        <div style={{ position: "relative", zIndex: 2, marginBottom: -14, border: "7px solid transparent", borderRadius: 30, background: `linear-gradient(180deg, #FFFDF6, #F6E8C8) padding-box, ${GOLD} border-box`, padding: "10px 40px 14px", boxShadow: "0 10px 0 #B07A20, 0 24px 40px rgba(80,40,0,0.35)", transform: `scale(${p}) rotate(${(1 - p) * -6}deg)`, opacity: Math.min(1, p * 2) }}>
          <Pop text={plate} at={at + 2} size={plateSize} color={DEEP_GREEN} shadow={shadowDark} width={940} gold={[]} />
        </div>
      ) : null}
      <div style={{ position: "relative", zIndex: 1, transform: `scaleX(${0.2 + 0.8 * r})`, opacity: Math.min(1, r * 2) }}>
        {/* bouts du ruban, repliés derrière */}
        <div style={{ position: "absolute", left: -78, top: 30, bottom: -30, width: 120, background: "linear-gradient(180deg, #B52812, #7E1708)", clipPath: "polygon(0 0, 100% 0, 100% 100%, 0 100%, 30% 50%)", zIndex: -1 }} />
        <div style={{ position: "absolute", right: -78, top: 30, bottom: -30, width: 120, background: "linear-gradient(180deg, #B52812, #7E1708)", clipPath: "polygon(0 0, 100% 0, 70% 50%, 100% 100%, 0 100%)", zIndex: -1 }} />
        <div style={{ position: "absolute", left: 0, bottom: -30, width: 42, height: 30, background: "#4E0E04", clipPath: "polygon(0 0, 100% 0, 100% 100%)", zIndex: -1 }} />
        <div style={{ position: "absolute", right: 0, bottom: -30, width: 42, height: 30, background: "#4E0E04", clipPath: "polygon(0 0, 100% 0, 0 100%)", zIndex: -1 }} />
        <div style={{ background: RED, padding: "16px 54px 22px", borderRadius: 10, boxShadow: "inset 0 5px 0 #F7C948, inset 0 -5px 0 #D99A1E, inset 0 10px 18px rgba(255,255,255,0.25), 0 20px 36px rgba(90,20,0,0.4)", maxWidth: 1000 }}>
          <Pop text={ribbon} at={rAt + 3} size={ribbonSize} gold={gold} width={900} />
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Bouton et carte en relief                                           */
/* ------------------------------------------------------------------ */

const BTN = {
  red: { bg: RED, edge: "#6E1608", text: "#fff" },
  gold: { bg: GOLD, edge: "#8A5505", text: C.ink },
  green: { bg: GREEN, edge: "#0B2C1F", text: "#fff" },
} as const;

export function GlossyButton({ children, color = "red", size = 44, pressed = false, style }: { children: React.ReactNode; color?: keyof typeof BTN; size?: number; pressed?: boolean; style?: React.CSSProperties }) {
  const b = BTN[color];
  const depth = pressed ? 3 : 12;
  return (
    <div style={{ position: "relative", display: "inline-flex", alignItems: "center", justifyContent: "center", gap: 14, background: b.bg, color: b.text, borderRadius: 999, padding: `${size * 0.55}px ${size * 1.3}px`, fontFamily: sans, fontWeight: 900, fontSize: size, boxShadow: `0 ${depth}px 0 ${b.edge}, 0 ${depth + 18}px 34px rgba(80,30,0,0.4), inset 0 3px 0 rgba(255,255,255,0.45)`, transform: `translateY(${12 - depth}px)`, textShadow: color === "gold" ? "0 2px 0 rgba(255,255,255,0.6)" : "0 3px 0 rgba(0,0,0,0.3)", overflow: "hidden", ...style }}>
      <div style={{ position: "absolute", left: "6%", right: "6%", top: 4, height: "42%", borderRadius: 999, background: "linear-gradient(180deg, rgba(255,255,255,0.55), rgba(255,255,255,0))" }} />
      <span style={{ position: "relative", display: "inline-flex", alignItems: "center", gap: 14 }}>{children}</span>
    </div>
  );
}

/** Carte blanche avec épaisseur. */
export function Card3D({ children, style, edge = "#E3CFA6" }: { children: React.ReactNode; style?: React.CSSProperties; edge?: string }) {
  return <div style={{ background: "linear-gradient(180deg, #FFFFFF, #FBF4E6)", borderRadius: 36, boxShadow: `0 14px 0 ${edge}, 0 40px 70px rgba(80,40,0,0.32), inset 0 2px 0 #fff`, ...style }}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Roue dorée à ampoules, sur son socle                                */
/* ------------------------------------------------------------------ */

export const WHEEL3D = {
  colors: ["#D2341E", "#F5B82E", "#1F6B4A", "#FFF4E0", "#D2341E", "#1F6B4A"],
  prizes: ["Cadeau offert", "-10 %", "Surprise", "-20 %", "Bonus", "Offert"],
};

export function GoldWheel({ size, rotation, glow, blur = 0, stand = true, tilt = 10 }: { size: number; rotation: number; glow?: { index: number; amount: number }; blur?: number; stand?: boolean; tilt?: number }) {
  const f = useCurrentFrame();
  const { colors, prizes } = WHEEL3D;
  const n = prizes.length;
  const cx = 250, cy = 250, R = 196;
  const pt = (deg: number, r: number) => { const a = (deg * Math.PI) / 180; return [cx + r * Math.sin(a), cy - r * Math.cos(a)]; };
  const seg = 360 / n;
  const id = `gw${Math.round(size)}`;
  return (
    <div style={{ position: "relative", width: size, height: size * (stand ? 1.28 : 1.04), transform: `perspective(1800px) rotateX(${tilt}deg)` }}>
      {stand ? (
        <svg width={size} height={size * 0.4} viewBox="0 0 500 200" style={{ position: "absolute", left: 0, top: size * 0.86 }}>
          <defs>
            <linearGradient id={`${id}-st`} x1="0" x2="1"><stop offset="0" stopColor="#8A5505" /><stop offset="0.3" stopColor="#FFE38A" /><stop offset="0.55" stopColor="#E0A126" /><stop offset="1" stopColor="#7A4A04" /></linearGradient>
          </defs>
          <path d="M215 0 L285 0 L300 110 L200 110 Z" fill={`url(#${id}-st)`} />
          <ellipse cx="250" cy="150" rx="215" ry="42" fill="#7A4A04" />
          <ellipse cx="250" cy="134" rx="215" ry="42" fill={`url(#${id}-st)`} />
          <ellipse cx="250" cy="128" rx="170" ry="26" fill="#FFF1B8" opacity="0.35" />
        </svg>
      ) : null}
      <svg width={size} height={size} viewBox="0 0 500 500" style={{ position: "absolute", left: 0, top: 0, overflow: "visible", filter: "drop-shadow(0 30px 34px rgba(90,40,0,0.4))" }}>
        <defs>
          <linearGradient id={`${id}-ring`} x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="#FFF1B0" /><stop offset="0.35" stopColor="#E9A923" /><stop offset="0.65" stopColor="#FFE07A" /><stop offset="1" stopColor="#9A5B07" /></linearGradient>
          <radialGradient id={`${id}-dome`} cx="50%" cy="50%" r="50%"><stop offset="0.55" stopColor="#000" stopOpacity="0" /><stop offset="1" stopColor="#000" stopOpacity="0.32" /></radialGradient>
          <radialGradient id={`${id}-hub`} cx="40%" cy="35%" r="70%"><stop offset="0" stopColor="#FF7A5C" /><stop offset="0.6" stopColor="#C9301A" /><stop offset="1" stopColor="#7E1708" /></radialGradient>
          <radialGradient id={`${id}-bulb`}><stop offset="0" stopColor="#FFFFFF" /><stop offset="0.45" stopColor="#FFF0B0" /><stop offset="1" stopColor="#FFC94A" stopOpacity="0" /></radialGradient>
          <filter id={`${id}-mb`}><feGaussianBlur stdDeviation={blur} /></filter>
        </defs>
        <circle cx={cx} cy={cy} r={246} fill={`url(#${id}-ring)`} />
        <circle cx={cx} cy={cy} r={226} fill="#8E1A0B" />
        <circle cx={cx} cy={cy} r={226} fill="none" stroke="#5E1004" strokeWidth={4} />
        <g transform={`rotate(${rotation} ${cx} ${cy})`} filter={blur > 0.2 ? `url(#${id}-mb)` : undefined}>
          {prizes.map((label, i) => {
            const a0 = i * seg, a1 = (i + 1) * seg, mid = (a0 + a1) / 2;
            const [x0, y0] = pt(a0, R), [x1, y1] = pt(a1, R), [tx, ty] = pt(mid, 128);
            const fill = colors[i % colors.length];
            return (
              <g key={i}>
                <path d={`M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z`} fill={fill} />
                {glow && glow.index === i ? <path d={`M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1} Z`} fill="#FFF6C8" opacity={glow.amount * 0.55} /> : null}
                <text x={tx} y={ty} fill={readable(fill)} fontFamily={sans} fontWeight={900} fontSize={label.length > 8 ? 24 : 30} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${mid - 90} ${tx} ${ty})`} style={{ paintOrder: "stroke" }} stroke={readable(fill) === "#FFFFFF" ? "rgba(0,0,0,0.25)" : "rgba(255,255,255,0.4)"} strokeWidth={2}>
                  {label}
                </text>
              </g>
            );
          })}
          {prizes.map((_, i) => { const [x, y] = pt(i * seg, R); return <line key={i} x1={cx} y1={cy} x2={x} y2={y} stroke="#F7C948" strokeWidth={5} />; })}
        </g>
        <circle cx={cx} cy={cy} r={R} fill={`url(#${id}-dome)`} />
        {Array.from({ length: 24 }, (_, i) => {
          const [x, y] = pt(i * 15 + 7.5, 236);
          const on = (Math.floor(f / 4) + i) % 2 === 0;
          return (
            <g key={i}>
              <circle cx={x} cy={y} r={on ? 15 : 10} fill={`url(#${id}-bulb)`} opacity={on ? 1 : 0.55} />
              <circle cx={x} cy={y} r={5.5} fill={on ? "#FFFDF0" : "#F1D27A"} />
            </g>
          );
        })}
        <ellipse cx={cx - 70} cy={cy - 95} rx={120} ry={60} fill="#fff" opacity={0.18} transform={`rotate(-30 ${cx - 70} ${cy - 95})`} />
        <circle cx={cx} cy={cy} r={52} fill={`url(#${id}-ring)`} />
        <circle cx={cx} cy={cy} r={42} fill={`url(#${id}-hub)`} />
        <text x={cx} y={cy + 3} fill="#fff" fontFamily={display} fontWeight={800} fontSize={50} textAnchor="middle" dominantBaseline="middle" style={{ filter: "drop-shadow(0 3px 0 #6E1608)" }}>R</text>
        <g transform={`translate(${cx} 4)`}>
          <path d="M-30 -6 L30 -6 L0 46 Z" fill={`url(#${id}-ring)`} stroke="#7A4A04" strokeWidth={4} strokeLinejoin="round" />
          <circle cx={0} cy={8} r={9} fill="#1F6B4A" stroke="#FFF1B8" strokeWidth={3} />
        </g>
      </svg>
    </div>
  );
}

/** Angle final pour que le lot `index` s'arrête sous le pointeur. */
export function landing3d(index: number, turns: number) {
  const seg = 360 / WHEEL3D.prizes.length;
  return turns * 360 + (360 - (index * seg + seg / 2));
}

/** Éclat lumineux (flash étoilé) à un instant donné. */
export function Burst({ at, x, y, size = 900 }: { at: number; x: number; y: number; size?: number }) {
  const f = useCurrentFrame();
  const p = interpolate(f, [at, at + 6, at + 26], [0, 1, 0], clamp);
  if (p <= 0) return null;
  return <div style={{ position: "absolute", left: x - size / 2, top: y - size / 2, width: size, height: size, borderRadius: "50%", background: "radial-gradient(circle, rgba(255,250,220,0.95), rgba(255,210,100,0.5) 35%, rgba(255,200,90,0) 70%)", transform: `scale(${0.4 + p * 0.8})`, opacity: p, mixBlendMode: "screen" }} />;
}
