import React from "react";
import QRCode from "qrcode";
import { Img, interpolate, spring, staticFile, useCurrentFrame, useVideoConfig, Easing } from "remotion";
import { C, display, sans } from "./theme";

/* ------------------------------------------------------------------ */
/* Outils d'animation                                                  */
/* ------------------------------------------------------------------ */

export const clamp = { extrapolateLeft: "clamp", extrapolateRight: "clamp" } as const;
export const ease = Easing.bezier(0.22, 1, 0.36, 1);
export const easeIn = Easing.bezier(0.55, 0, 1, 0.45);

/** Ressort qui démarre à `at` (en images). */
export function useSpring(at: number, config: { damping?: number; stiffness?: number; mass?: number } = {}) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  return spring({ frame: frame - at, fps, config: { damping: 14, stiffness: 140, mass: 0.9, ...config } });
}

/** Valeur de 0 à 1 entre deux images, avec courbe douce. */
export function useProgress(from: number, to: number, easing = ease) {
  const frame = useCurrentFrame();
  return interpolate(frame, [from, to], [0, 1], { ...clamp, easing });
}

export function readable(hex: string): string {
  const n = parseInt(hex.slice(1), 16);
  const r = (n >> 16) & 255, g = (n >> 8) & 255, b = n & 255;
  return 0.299 * r + 0.587 * g + 0.114 * b > 150 ? C.ink : "#FFFFFF";
}

/* ------------------------------------------------------------------ */
/* Format horizontal                                                   */
/* ------------------------------------------------------------------ */

/**
 * En 16:9, chaque scène verticale (1080 × 1920) devient une « scène » à droite de l'écran,
 * recadrée sous la zone de titre, et le titre passe en grand dans la colonne de gauche.
 */
export const Horizontal = React.createContext(false);
export const STAGE = { cropTop: 300, scale: 1080 / 1620, left: 1080 };
/** Convertit une position de l'écran horizontal (1920 × 1080) en coordonnées de scène. */
export const stageX = (x: number) => (x - STAGE.left) / STAGE.scale;
export const stageY = (y: number) => y / STAGE.scale + STAGE.cropTop;
/** Boîte d'un fond plein cadre : la scène en vertical, tout l'écran en horizontal. */
export function useBleed(): React.CSSProperties {
  const wide = React.useContext(Horizontal);
  return wide ? { left: stageX(-40), right: 1080 - stageX(1960), top: stageY(-40), bottom: 1920 - stageY(1120) } : { inset: 0 };
}

/* ------------------------------------------------------------------ */
/* Fond                                                                */
/* ------------------------------------------------------------------ */

/** Fond crème vivant : taches de couleur qui dérivent, grain léger, sol en perspective. */
export function Background({ tint = C.soft, floor = true }: { tint?: string; floor?: boolean }) {
  const frame = useCurrentFrame();
  const t = frame / 30;
  const box = useBleed();
  return (
    <div style={{ position: "absolute", ...box, background: C.cream, overflow: "hidden" }}>
      <div style={{ position: "absolute", width: 1100, height: 1100, borderRadius: "50%", background: tint, filter: "blur(120px)", opacity: 0.75, left: -300 + Math.sin(t * 0.6) * 120, top: -260 + Math.cos(t * 0.5) * 90 }} />
      <div style={{ position: "absolute", width: 900, height: 900, borderRadius: "50%", background: "#FCE7B8", filter: "blur(130px)", opacity: 0.6, right: -320 + Math.cos(t * 0.7) * 110, bottom: -200 + Math.sin(t * 0.4) * 120 }} />
      {floor ? (
        <div style={{ position: "absolute", left: "-50%", right: "-50%", bottom: -200, height: 900, transform: "perspective(900px) rotateX(68deg)", transformOrigin: "50% 100%", backgroundImage: `linear-gradient(${C.line} 2px, transparent 2px), linear-gradient(90deg, ${C.line} 2px, transparent 2px)`, backgroundSize: "120px 120px", backgroundPosition: `0 ${(frame * 3) % 120}px`, opacity: 0.55, maskImage: "linear-gradient(to top, black, transparent)" }} />
      ) : null}
      <div style={{ position: "absolute", inset: 0, opacity: 0.06, backgroundImage: "radial-gradient(#000 1px, transparent 1px)", backgroundSize: "4px 4px" }} />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Store banne                                                         */
/* ------------------------------------------------------------------ */

export function Awning({ width, height, stripe = C.tomette, base = C.cream, id = "aw" }: { width: number; height: number; stripe?: string; base?: string; id?: string }) {
  const n = 10;
  const w = 440;
  const scallops = Array.from({ length: n }, (_, i) => `A22 14 0 0 1 ${w - (i + 1) * 44} 30`).join(" ");
  return (
    <svg width={width} height={height} viewBox="0 0 440 44" preserveAspectRatio="none" style={{ display: "block", filter: "drop-shadow(0 10px 14px rgba(0,0,0,0.18))" }}>
      <defs>
        <pattern id={id} width="44" height="44" patternUnits="userSpaceOnUse">
          <rect width="22" height="44" fill={stripe} />
          <rect x="22" width="22" height="44" fill={base} />
        </pattern>
      </defs>
      <path fill={`url(#${id})`} d={`M0 0 H${w} V30 ${scallops} Z`} />
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Roue                                                                */
/* ------------------------------------------------------------------ */

export interface WheelProps {
  size: number;
  colors: string[];
  prizes: string[];
  /** Parts de chaque lot en pourcentage (sinon parts égales). */
  weights?: number[];
  rotation: number;
  rim?: string;
  hub?: string;
  hubLabel?: string;
  logo?: string;
  pointer?: boolean;
  /** Segment mis en avant (gagnant), opacité du halo. */
  glow?: { index: number; amount: number };
  motionBlur?: number;
}

export function Wheel({ size, colors, prizes, weights, rotation, rim = C.deep, hub = C.tomette, hubLabel = "R", logo, pointer = true, glow, motionBlur = 0 }: WheelProps) {
  const n = prizes.length;
  const total = (weights ?? prizes.map(() => 1)).reduce((a, b) => a + b, 0);
  const R = 176;
  const cx = 200;
  const cy = 210;
  let acc = 0;
  const segs = prizes.map((label, i) => {
    const w = (weights ? weights[i] : 1) / total;
    const a0 = acc * 360;
    acc += w;
    const a1 = acc * 360;
    return { label, a0, a1, color: colors[i % colors.length] };
  });
  const pt = (deg: number, r: number) => {
    const a = (deg * Math.PI) / 180;
    return [cx + r * Math.sin(a), cy - r * Math.cos(a)];
  };
  return (
    <svg width={size} height={size * 1.06} viewBox="0 0 400 424" style={{ overflow: "visible", filter: `drop-shadow(0 30px 40px rgba(60,30,10,0.28))` }}>
      <defs>
        <radialGradient id="shine" cx="35%" cy="25%" r="80%">
          <stop offset="0%" stopColor="#fff" stopOpacity="0.35" />
          <stop offset="60%" stopColor="#fff" stopOpacity="0" />
        </radialGradient>
        <filter id="mblur"><feGaussianBlur stdDeviation={motionBlur} /></filter>
      </defs>
      <circle cx={cx} cy={cy} r={196} fill={rim} />
      <g transform={`rotate(${rotation} ${cx} ${cy})`} filter={motionBlur > 0.2 ? "url(#mblur)" : undefined}>
        {segs.map((s, i) => {
          const [x0, y0] = pt(s.a0, R);
          const [x1, y1] = pt(s.a1, R);
          const large = s.a1 - s.a0 > 180 ? 1 : 0;
          const mid = (s.a0 + s.a1) / 2;
          const span = s.a1 - s.a0;
          const [tx, ty] = pt(mid, 116);
          // Taille du texte adaptée à la place disponible entre le centre et le bord.
          const fs = span < 25 ? 0 : Math.min(span < 40 ? 15 : 20, 108 / (Math.max(4, s.label.length) * 0.56));
          return (
            <g key={i}>
              <path d={`M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`} fill={s.color} stroke="#fff" strokeWidth={2} />
              {glow && glow.index === i ? <path d={`M${cx} ${cy} L${x0} ${y0} A${R} ${R} 0 ${large} 1 ${x1} ${y1} Z`} fill="#fff" opacity={glow.amount * 0.35} /> : null}
              {fs ? (
                <text x={tx} y={ty} fill={readable(s.color)} fontFamily={sans} fontWeight={800} fontSize={fs} textAnchor="middle" dominantBaseline="middle" transform={`rotate(${mid > 180 ? mid + 90 : mid - 90} ${tx} ${ty})`}>
                  {s.label}
                </text>
              ) : null}
            </g>
          );
        })}
      </g>
      {Array.from({ length: 20 }, (_, i) => {
        const [x, y] = pt(i * 18 + rotation * 0, 187);
        return <circle key={i} cx={x} cy={y} r={4.2} fill="#FFF6E0" opacity={0.95} />;
      })}
      <circle cx={cx} cy={cy} r={196} fill="url(#shine)" />
      <circle cx={cx} cy={cy} r={46} fill="#fff" />
      <circle cx={cx} cy={cy} r={40} fill={hub} />
      {logo ? (
        <image href={staticFile(logo)} x={cx - 28} y={cy - 28} width={56} height={56} preserveAspectRatio="xMidYMid meet" />
      ) : (
        <text x={cx} y={cy + 2} fill="#fff" fontFamily={display} fontWeight={700} fontSize={hubLabel.length > 1 ? 28 : 38} textAnchor="middle" dominantBaseline="middle">
          {hubLabel}
        </text>
      )}
      {pointer ? (
        <g>
          <path d="M178 2 H222 L200 46 Z" fill={C.ink} stroke="#fff" strokeWidth={4} strokeLinejoin="round" />
        </g>
      ) : null}
    </svg>
  );
}

/** Angle final pour que le segment `index` s'arrête sous le pointeur. */
export function landingRotation(index: number, n: number, turns: number) {
  const seg = 360 / n;
  return turns * 360 + (360 - (index * seg + seg / 2));
}

/* ------------------------------------------------------------------ */
/* Téléphone                                                           */
/* ------------------------------------------------------------------ */

export function Phone({ width = 560, children, screen = "#FBF6EE" }: { width?: number; children?: React.ReactNode; screen?: string }) {
  const h = width * 2.05;
  return (
    <div style={{ width, height: h, borderRadius: width * 0.15, background: "#151311", padding: width * 0.035, boxShadow: "0 60px 90px rgba(40,20,10,0.35), inset 0 0 0 3px #3a3532", position: "relative" }}>
      <div style={{ width: "100%", height: "100%", borderRadius: width * 0.12, background: screen, overflow: "hidden", position: "relative" }}>
        {children}
        <div style={{ position: "absolute", top: width * 0.03, left: "50%", transform: "translateX(-50%)", width: width * 0.3, height: width * 0.075, borderRadius: 999, background: "#151311" }} />
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Logo Rouelia                                                        */
/* ------------------------------------------------------------------ */

export function Logo({ size = 120, color = C.ink, spin = 0 }: { size?: number; color?: string; spin?: number }) {
  const r = 9.5;
  return (
    <div style={{ display: "inline-flex", alignItems: "center", fontFamily: display, fontWeight: 650, fontSize: size, color, lineHeight: 1, letterSpacing: "-0.01em" }}>
      <span>R</span>
      <svg viewBox="0 0 24 24" style={{ width: size * 0.72, height: size * 0.72, margin: `0 ${size * 0.04}px`, transform: `translateY(${size * 0.06}px) rotate(${spin}deg)` }}>
        <circle cx="12" cy="12" r="11.5" fill={C.tomette} />
        {Array.from({ length: 8 }, (_, i) => {
          if (i % 2) return null;
          const a0 = (i * Math.PI) / 4;
          const a1 = ((i + 1) * Math.PI) / 4;
          return <path key={i} d={`M12 12 L${12 + r * Math.sin(a0)} ${12 - r * Math.cos(a0)} A${r} ${r} 0 0 1 ${12 + r * Math.sin(a1)} ${12 - r * Math.cos(a1)} Z`} fill={C.cream} />;
        })}
        <circle cx="12" cy="12" r="2.6" fill={C.ink} />
      </svg>
      <span>uelia</span>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Texte cinétique                                                     */
/* ------------------------------------------------------------------ */

/** Phrase qui arrive mot par mot. `at` : image de départ ; `step` : écart entre les mots. */
export function Words({ text, at, step = 3, size = 92, color = C.ink, accent, weight = 650, font = display, align = "center", width = 940, italicAccent = true }: { text: string; at: number; step?: number; size?: number; color?: string; accent?: string[]; weight?: number; font?: string; align?: "center" | "left"; width?: number; italicAccent?: boolean }) {
  const frame = useCurrentFrame();
  const { fps } = useVideoConfig();
  const words = text.split(" ");
  return (
    <div style={{ width, display: "flex", flexWrap: "wrap", justifyContent: align === "center" ? "center" : "flex-start", columnGap: size * 0.26, rowGap: size * 0.05, fontFamily: font, fontWeight: weight, fontSize: size, lineHeight: 1.04, color, textAlign: align }}>
      {words.map((w, i) => {
        const s = spring({ frame: frame - at - i * step, fps, config: { damping: 13, stiffness: 170 } });
        const isAccent = accent?.some((a) => w.toLowerCase().includes(a.toLowerCase()));
        return (
          <span key={i} style={{ display: "inline-block", transform: `translateY(${(1 - s) * size * 0.7}px) scale(${0.6 + 0.4 * s}) rotate(${(1 - s) * 8}deg)`, opacity: Math.min(1, s * 1.4), color: isAccent ? C.tomette : color, fontStyle: isAccent && italicAccent ? "italic" : "normal", filter: `blur(${(1 - Math.min(1, s)) * 6}px)` }}>
            {w}
          </span>
        );
      })}
    </div>
  );
}

/** Pastille d'étape « 1 · Il scanne ». */
export function StepBadge({ n, label, at }: { n: number; label: string; at: number }) {
  const s = useSpring(at, { damping: 12 });
  return (
    <div style={{ display: "inline-flex", alignItems: "center", gap: 18, padding: "16px 34px 16px 16px", borderRadius: 999, background: C.ink, color: "#fff", fontFamily: sans, fontWeight: 800, fontSize: 44, transform: `scale(${s}) translateY(${(1 - s) * 40}px)`, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}>
      <span style={{ width: 64, height: 64, borderRadius: "50%", background: C.tomette, display: "inline-flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontSize: 40 }}>{n}</span>
      {label}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* QR code, étoiles, confettis, doigt                                  */
/* ------------------------------------------------------------------ */

const qrCache = new Map<string, boolean[][]>();
function qrMatrix(text: string) {
  if (!qrCache.has(text)) {
    const q = QRCode.create(text, { errorCorrectionLevel: "M" });
    const n = q.modules.size;
    const rows: boolean[][] = [];
    for (let y = 0; y < n; y++) rows.push(Array.from({ length: n }, (_, x) => !!q.modules.get(x, y)));
    qrCache.set(text, rows);
  }
  return qrCache.get(text)!;
}

export function QR({ text, size, color = C.ink }: { text: string; size: number; color?: string }) {
  const m = qrMatrix(text);
  const n = m.length;
  return (
    <svg width={size} height={size} viewBox={`-2 -2 ${n + 4} ${n + 4}`} shapeRendering="crispEdges">
      <rect x={-2} y={-2} width={n + 4} height={n + 4} fill="#fff" />
      {m.flatMap((row, y) => row.map((on, x) => (on ? <rect key={`${x}-${y}`} x={x} y={y} width={1.02} height={1.02} fill={color} /> : null)))}
    </svg>
  );
}

export function Star({ size, fill = 1, color = C.safran }: { size: number; fill?: number; color?: string }) {
  const d = "M12 2.5l2.9 6.1 6.6.8-4.9 4.6 1.3 6.6L12 17.3l-5.9 3.3 1.3-6.6L2.5 9.4l6.6-.8z";
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" style={{ overflow: "visible" }}>
      <path d={d} fill="#E8DFD2" />
      <path d={d} fill={color} style={{ transformOrigin: "12px 12px", transform: `scale(${fill})` }} />
    </svg>
  );
}

/** Confettis déterministes qui partent d'un point. */
export function Confetti({ at, x, y, count = 90, colors = [C.tomette, C.safran, C.sauge, "#E7B4A6", "#fff"] }: { at: number; x: number; y: number; count?: number; colors?: string[] }) {
  const frame = useCurrentFrame();
  const t = (frame - at) / 30;
  if (t < 0 || t > 3) return null;
  return (
    <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
      {Array.from({ length: count }, (_, i) => {
        const r1 = Math.sin(i * 12.9898) * 43758.5453;
        const r2 = Math.sin(i * 78.233) * 12345.678;
        const ang = ((r1 - Math.floor(r1)) * 2 - 1) * Math.PI;
        const sp = 900 + (r2 - Math.floor(r2)) * 1300;
        const px = x + Math.cos(ang) * sp * t;
        const py = y + Math.sin(ang) * sp * t * 0.8 + 1400 * t * t;
        const rot = t * 720 * ((i % 2) * 2 - 1);
        return <div key={i} style={{ position: "absolute", left: px, top: py, width: i % 3 ? 22 : 14, height: i % 3 ? 12 : 26, background: colors[i % colors.length], borderRadius: i % 4 === 0 ? 999 : 3, transform: `rotate(${rot}deg)`, opacity: Math.max(0, 1 - t / 2.6) }} />;
      })}
    </div>
  );
}

/** Doigt qui vient toucher l'écran à l'image `tapAt`. */
export function Finger({ x, y, tapAt, from = { x: 260, y: 520 } }: { x: number; y: number; tapAt: number; from?: { x: number; y: number } }) {
  const frame = useCurrentFrame();
  const inP = interpolate(frame, [tapAt - 18, tapAt - 2], [0, 1], { ...clamp, easing: ease });
  const press = interpolate(frame, [tapAt - 2, tapAt + 2, tapAt + 8], [1, 0.86, 1], clamp);
  const out = interpolate(frame, [tapAt + 10, tapAt + 26], [0, 1], { ...clamp, easing: easeIn });
  const ripple = interpolate(frame, [tapAt, tapAt + 16], [0, 1], clamp);
  return (
    <>
      {frame >= tapAt && frame < tapAt + 16 ? <div style={{ position: "absolute", left: x - 70, top: y - 70, width: 140, height: 140, borderRadius: "50%", border: `6px solid ${C.tomette}`, transform: `scale(${0.3 + ripple})`, opacity: 1 - ripple }} /> : null}
      <div style={{ position: "absolute", left: x + from.x * (1 - inP) + from.x * out - 34, top: y + from.y * (1 - inP) + from.y * out - 10, transform: `scale(${press})`, transformOrigin: "34px 10px", opacity: inP * (1 - out) }}>
        <svg width="150" height="190" viewBox="0 0 60 76">
          <path d="M14 6c0-3.3 2.7-6 6-6s6 2.7 6 6v22l14.2 3.6c3.6.9 5.9 4.3 5.4 8l-2.6 17.6C42.4 64 38.4 68 33.5 68H23c-3 0-5.9-1.5-7.6-4L4.6 48.5c-1.8-2.6-1.3-6.2 1.2-8.2 2.3-1.8 5.6-1.6 7.6.5L14 42V6z" fill="#F2C9A8" stroke="#5E3B24" strokeWidth="2" />
        </svg>
      </div>
    </>
  );
}

/** Carte blanche arrondie. */
export function Card({ children, style }: { children: React.ReactNode; style?: React.CSSProperties }) {
  return <div style={{ background: "#fff", borderRadius: 36, boxShadow: "0 30px 60px rgba(60,30,10,0.16), 0 0 0 2px #EFE6DA", padding: 40, ...style }}>{children}</div>;
}

export function ShopBadge({ logo, monogram, color, size = 90 }: { logo?: string; monogram: string; color: string; size?: number }) {
  return (
    <div style={{ width: size, height: size, borderRadius: "50%", background: logo ? "#1D1A16" : "#fff", boxShadow: `0 0 0 5px ${color}`, display: "flex", alignItems: "center", justifyContent: "center", overflow: "hidden" }}>
      {logo ? <Img src={staticFile(logo)} style={{ width: "64%", height: "64%", objectFit: "contain" }} /> : <span style={{ fontFamily: display, fontWeight: 700, fontSize: size * 0.42, color }}>{monogram}</span>}
    </div>
  );
}
