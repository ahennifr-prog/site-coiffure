import React from "react";
import { AbsoluteFill } from "remotion";
import { C, display, fontCss, sans } from "./theme";
import { Awning, Background, Logo, Star, Wheel } from "./components";

/** Image fixe de la pub story : titre, cercle « Jeu → Avis → Retour », adresse du site. */

const W = 1080;
const WHEEL = { colors: [C.tomette, C.cream, C.safran, C.sauge] };

function LoopNodeIcon({ k, size }: { k: number; size: number }) {
  if (k === 0) return <Wheel size={size} colors={WHEEL.colors} prizes={["", "", "", "", "", ""]} rotation={0} pointer={false} hubLabel="" />;
  if (k === 1) return <Star size={size} />;
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" strokeLinecap="round" strokeLinejoin="round">
      <path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" stroke={C.ink} strokeWidth="2.6" />
      <path d="M18 2v5h-5M6 22v-5h5" stroke={C.tomette} strokeWidth="2.6" />
    </svg>
  );
}

/** Cercle « Jeu → Avis → Retour » qui tourne. Partagé avec l'image fixe. */
export function Cycle({ cx, cy, R, spinDeg, appear = 1, lit = 3 }: { cx: number; cy: number; R: number; spinDeg: number; appear?: number; lit?: number }) {
  const labels = ["Jeu", "Avis", "Retour"];
  const arrows = [0, 1, 2].map((i) => {
    const a0 = -90 + i * 120 + 36;
    const a1 = -90 + (i + 1) * 120 - 38;
    const p = (a: number) => [R * Math.cos((a * Math.PI) / 180), R * Math.sin((a * Math.PI) / 180)];
    const [x0, y0] = p(a0);
    const [x1, y1] = p(a1);
    const tip = (a1 * Math.PI) / 180;
    const tx = -Math.sin(tip), ty = Math.cos(tip);
    return { d: `M${x0} ${y0} A${R} ${R} 0 0 1 ${x1} ${y1}`, head: `M${x1 - tx * 30 + Math.cos(tip) * 18} ${y1 - ty * 30 + Math.sin(tip) * 18} L${x1} ${y1} L${x1 - tx * 30 - Math.cos(tip) * 18} ${y1 - ty * 30 - Math.sin(tip) * 18}` };
  });
  return (
    <div style={{ position: "absolute", left: cx, top: cy, transform: `scale(${appear})` }}>
      <div style={{ position: "absolute", left: 0, top: 0, transform: `rotate(${spinDeg}deg)` }}>
        <svg width={R * 2 + 100} height={R * 2 + 100} viewBox={`${-R - 50} ${-R - 50} ${R * 2 + 100} ${R * 2 + 100}`} style={{ position: "absolute", left: -R - 50, top: -R - 50, overflow: "visible" }}>
          <circle r={R} fill="none" stroke={C.line} strokeWidth={22} />
          {arrows.map((a, i) => (
            <g key={i} stroke={C.tomette} strokeWidth={14} fill="none" strokeLinecap="round" strokeLinejoin="round">
              <path d={a.d} />
              <path d={a.head} />
            </g>
          ))}
        </svg>
        {labels.map((l, i) => {
          const a = ((-90 + i * 120) * Math.PI) / 180;
          const on = i < lit;
          return (
            <div key={i} style={{ position: "absolute", left: Math.cos(a) * R, top: Math.sin(a) * R, transform: `translate(-50%, -50%) rotate(${-spinDeg}deg)`, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <div style={{ width: 170, height: 170, borderRadius: "50%", background: "#fff", boxShadow: on ? `0 0 0 9px ${C.tomette}, 0 24px 44px rgba(0,0,0,0.2)` : "0 14px 30px rgba(0,0,0,0.12)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <LoopNodeIcon k={i} size={96} />
              </div>
              <div style={{ marginTop: 12, fontFamily: sans, fontWeight: 800, fontSize: 46, color: C.ink, background: "#fff", padding: "6px 26px", borderRadius: 999, boxShadow: "0 10px 24px rgba(0,0,0,0.12)" }}>{l}</div>
            </div>
          );
        })}
      </div>
    </div>
  );
}


export function StoryPoster() {
  return (
    <AbsoluteFill style={{ background: C.cream }}>
      <style>{fontCss}</style>
      <Background tint="#FCE7B8" floor={false} />
      <div style={{ position: "absolute", left: -40, top: -20 }}>
        <Awning width={1160} height={140} id="aw-poster" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
        <Logo size={110} spin={20} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 470, display: "flex", flexDirection: "column", alignItems: "center", textAlign: "center", fontFamily: display, fontWeight: 650, fontSize: 104, lineHeight: 1.05, color: C.ink }}>
        <div>Vos clients <span style={{ color: C.tomette, fontStyle: "italic" }}>reviennent.</span></div>
        <div style={{ marginTop: 10 }}>Vos avis <span style={{ color: C.tomette, fontStyle: "italic" }}>montent.</span></div>
      </div>
      <Cycle cx={W / 2} cy={1130} R={250} spinDeg={0} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1530, display: "flex", justifyContent: "center", fontFamily: display, fontWeight: 700, fontSize: 104, color: C.ink }}>rouelia.fr</div>
    </AbsoluteFill>
  );
}

