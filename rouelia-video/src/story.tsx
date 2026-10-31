import React from "react";
import { AbsoluteFill, Audio, getStaticFiles, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import story from "./story.json";
import { C, display, fontCss, sans } from "./theme";
import { Awning, clamp, Confetti, ease, Finger, Logo, Phone, QR, Star, useProgress, useSpring } from "./components";
import { Banner, Burst, Card3D, DEEP_GREEN, GlossyButton, GOLD, GoldBg, goldText, GoldWheel, GREEN, landing3d, Pop, Streamers } from "./fx3d";
import { LightFx, Shell } from "./Video";

/**
 * Pub verticale de 26,5 s pour les stories Instagram et les messages (WhatsApp, SMS), sans voix.
 * Style « 3D » du flyer (fx3d.tsx) : or, ruban rouge, lumière chaude, perspective.
 * Tout le texte reste entre 300 et 1580 px de haut, à l'abri des barres d'Instagram.
 */

const W = 1080;
const ev = story.ev;
const OVERLAP = 8;
const CONFETTI = ["#F7C948", "#FFE07A", "#D2341E", "#FFF4E0", "#1F6B4A"];

/* ------------------------------------------------------------------ */
/* Icônes de commerces                                                 */
/* ------------------------------------------------------------------ */

const ICONS: { label: string; d: React.ReactNode }[] = [
  { label: "Studio de musique", d: <><path d="M9 18V5l12-2v13" /><circle cx="6" cy="18" r="3" /><circle cx="18" cy="16" r="3" /></> },
  { label: "Studio photo", d: <><rect x="2.5" y="7" width="19" height="13" rx="2.5" /><path d="M8 7l2-3h4l2 3" /><circle cx="12" cy="13.5" r="3.8" /></> },
  { label: "Salon de coiffure", d: <><circle cx="6" cy="6" r="3" /><circle cx="6" cy="18" r="3" /><path d="M8.2 8.2L20 20M8.2 15.8L20 4" /></> },
  { label: "Restaurant", d: <><path d="M6 3v7c0 1.6 1 2.4 2 2.4s2-.8 2-2.4V3M8 12.4V21" /><path d="M17.5 21V3c-2 0-3.5 3-3.5 7.5h3.5" /></> },
  { label: "Institut de beauté", d: <><path d="M12 20c-4.5 0-8.5-3-9-8 3.5 0 6.5 1.5 9 4.5 2.5-3 5.5-4.5 9-4.5-.5 5-4.5 8-9 8z" /><path d="M12 16.5c-2.2-3.2-2.2-7.4 0-11 2.2 3.6 2.2 7.8 0 11z" /></> },
];

function ShopIcon({ k, size, color }: { k: number; size: number; color: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[k].d}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Le problème (4 s)                                              */
/* ------------------------------------------------------------------ */

function Probleme() {
  const f = useCurrentFrame();
  const shop = useSpring(4, { damping: 13, stiffness: 120 });
  const k = Math.min(ICONS.length - 1, Math.floor(f / ev.signStep));
  const swap = spring({ frame: f - k * ev.signStep, fps: 30, config: { damping: 11, stiffness: 200 } });
  const walk = interpolate(f, ev.probLeave, [0, 1], clamp);
  const door = interpolate(f, [ev.probLeave[0] - 8, ev.probLeave[0], ev.probLeave[1] - 22, ev.probLeave[1] - 12], [0, 1, 1, 0], clamp);
  const orbit = interpolate(f, [0, 120], [-22, -12], clamp);
  const promise = spring({ frame: f - ev.promise, fps: 30, config: { damping: 10, stiffness: 170 } });
  return (
    <AbsoluteFill>
      <GoldBg />
      <Banner plate="Vos clients passent," ribbon="mais ne reviennent pas." gold={["reviennent"]} ribbonSize={78} plateSize={84} />
      {/* devanture en 3D : l'enseigne change de métier, le client s'en va */}
      <div style={{ position: "absolute", left: 170, top: 900, width: 740, height: 560, perspective: 1600 }}>
        <div style={{ position: "absolute", inset: 0, transformStyle: "preserve-3d", transform: `rotateY(${orbit}deg) rotateX(6deg) translateY(${(1 - shop) * 600}px) scale(${0.8 + 0.2 * shop})`, opacity: Math.min(1, shop * 2) }}>
          {/* côté du mur, pour l'épaisseur */}
          <div style={{ position: "absolute", left: 740, top: 70, width: 90, height: 490, background: "linear-gradient(90deg, #CDB89B, #A68C6C)", transformOrigin: "left", transform: "rotateY(90deg)" }} />
          <div style={{ position: "absolute", inset: "70px 0 0 0", background: "linear-gradient(180deg, #F3E7D6, #E1CCAE)", borderRadius: 14, boxShadow: "0 50px 80px rgba(80,40,0,0.35)" }} />
          <div style={{ position: "absolute", left: 50, right: 50, top: 0, height: 120, border: "7px solid transparent", borderRadius: 22, background: `linear-gradient(180deg, #1C4A37, ${DEEP_GREEN}) padding-box, ${GOLD} border-box`, display: "flex", alignItems: "center", justifyContent: "center", gap: 18, boxShadow: "0 10px 0 #8A5505, 0 24px 34px rgba(0,0,0,0.3)" }}>
            <div style={{ transform: `scale(${0.4 + 0.6 * swap}) rotate(${(1 - swap) * -40}deg)` }}>
              <ShopIcon k={k} size={66} color="#FFD45A" />
            </div>
            <span style={{ fontFamily: display, fontWeight: 700, fontSize: 54, whiteSpace: "nowrap", ...goldText, filter: "drop-shadow(0 2px 0 #6E3F02)" }}>Votre commerce</span>
          </div>
          <div style={{ position: "absolute", left: -20, right: -20, top: 136 }}>
            <Awning width={780} height={104} id="aw-prob3d" />
          </div>
          <div style={{ position: "absolute", left: 50, top: 270, width: 350, height: 240, background: "radial-gradient(ellipse at 50% 70%, #FFE9B8, #F3C27A 60%, #C98B3E)", borderRadius: 12, boxShadow: "inset 0 0 0 10px #3A2A1E, 0 0 60px rgba(255,200,100,0.5)" }}>
            <div style={{ position: "absolute", left: 24, top: 24, width: 120, height: 44, background: "rgba(255,255,255,0.5)", borderRadius: 6, transform: "skewX(-20deg)" }} />
          </div>
          <div style={{ position: "absolute", left: 470, top: 240, width: 210, height: 320, background: "#3A2A1E", borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 10, background: "#FFE9B8", opacity: door }} />
            <div style={{ position: "absolute", inset: 10, background: "linear-gradient(90deg, #6B4A33, #4F3424)", transformOrigin: "left", transform: `perspective(600px) rotateY(${-door * 70}deg)`, borderRadius: 6 }} />
          </div>
          <div style={{ position: "absolute", left: 530 + walk * 360, top: 380, opacity: walk > 0 ? 1 - walk * walk : 0, transform: `translateY(${Math.sin(walk * 22) * 6}px)` }}>
            <div style={{ width: 58, height: 58, borderRadius: "50%", background: C.ink, margin: "0 auto" }} />
            <div style={{ width: 98, height: 140, borderRadius: "50px 50px 18px 18px", background: C.ink, marginTop: 8 }} />
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1490, display: "flex", justifyContent: "center" }}>
        {f < ev.promise ? (
          <div key={k} style={{ transform: `translateY(${(1 - swap) * 30}px) scale(${0.8 + 0.2 * swap})`, opacity: Math.min(1, swap * 1.5) }}>
            <GlossyButton color="gold" size={40}>{ICONS[k].label}</GlossyButton>
          </div>
        ) : (
          // La promesse arrive dès la 2e seconde : la solution se comprend avant même le scan.
          <div style={{ transform: `scale(${promise}) rotate(${(1 - promise) * -6}deg)`, opacity: Math.min(1, promise * 1.5) }}>
            <GlossyButton color="green" size={50}>
              Rouelia les fait <span style={{ color: "#FFD84D", textShadow: "0 3px 0 #6E3F02" }}>revenir</span>
            </GlossyButton>
          </div>
        )}
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* Écran du téléphone : la roue du commerce                            */
/* ------------------------------------------------------------------ */

function WheelScreen({ width, rotation = 0, dim = 0 }: { width: number; rotation?: number; dim?: number }) {
  const k = width / 600;
  return (
    <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 40%, #FFF7E6, #F6DDB0)" }}>
      <Awning width={width} height={56 * k} id={`aw-ws3-${Math.round(width)}`} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40 * k }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44 * k, color: C.ink }}>Votre commerce</div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 26 * k, color: C.inkSoft, marginTop: 8 * k }}>Touchez la roue pour jouer</div>
        <div style={{ marginTop: 50 * k }}>
          <GoldWheel size={520 * k} rotation={rotation} stand={false} tilt={0} />
        </div>
      </div>
      {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(29,26,22,${0.5 * dim})` }} /> : null}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Le scan au comptoir (3,5 s)                                      */
/* ------------------------------------------------------------------ */

function Scan() {
  const f = useCurrentFrame();
  const stand = useSpring(2, { damping: 14, stiffness: 120 });
  const phoneIn = useProgress(ev.scanPhone[0], ev.scanPhone[1]);
  const laser = interpolate(f, ev.scanLaser, [0, 1], clamp);
  const flash = interpolate(f, [ev.scanFlash, ev.scanFlash + 4, ev.scanFlash + 16], [0, 1, 0], clamp);
  const scanned = f >= ev.scanFlash + 2;
  const screenPop = useSpring(ev.scanFlash + 2, { damping: 12 });
  const sway = Math.sin(f / 20) * 2;
  return (
    <AbsoluteFill>
      <GoldBg />
      <Banner plate="Il scanne" ribbon="le QR code au comptoir" gold={["QR"]} ribbonSize={78} plateSize={88} />
      {/* comptoir brillant */}
      <div style={{ position: "absolute", left: -60, right: -60, top: 1370, height: 300, perspective: 900 }}>
        <div style={{ position: "absolute", inset: 0, transform: "rotateX(38deg)", transformOrigin: "50% 0", background: "linear-gradient(180deg, #FFF8EA, #E9D3B0 60%, #CFAE7C)", boxShadow: "0 -6px 0 #F7C948 inset" }} />
      </div>
      <div style={{ position: "absolute", left: -60, right: -60, top: 1370, height: 8, background: GOLD }} />
      {/* chevalet à cadre doré */}
      <div style={{ position: "absolute", left: 90, top: 760, perspective: 1600 }}>
        <div style={{ transform: `rotateY(${22 - 8 * stand + sway}deg) rotateX(8deg) translateY(${(1 - stand) * 600}px)`, transformOrigin: "50% 100%" }}>
          <div style={{ width: 440, height: 610, border: "8px solid transparent", borderRadius: 28, background: `linear-gradient(180deg, #FFFDF7, #F6E8C8) padding-box, ${GOLD} border-box`, boxShadow: "14px 14px 0 #B07A20, 0 60px 90px rgba(80,40,0,0.35)", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", fontFamily: sans }}>
            <Awning width={424} height={50} id="aw-tent3d" />
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 48, marginTop: 24, color: DEEP_GREEN }}>Tentez votre chance</div>
            <div style={{ marginTop: 12, background: "linear-gradient(180deg, #EE4B2E, #B8230F)", color: "#fff", borderRadius: 999, padding: "6px 20px", fontWeight: 900, fontSize: 19, letterSpacing: "0.05em" }}>CHAQUE CASE EST UN CADEAU</div>
            <div style={{ marginTop: 22, border: `6px solid ${C.ink}`, borderRadius: 18, padding: 8, position: "relative", overflow: "hidden", background: "#fff" }}>
              <QR text="https://rouelia.fr" size={260} />
              {laser > 0 && laser < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: `${laser * 100}%`, height: 6, background: "#FF5A3C", boxShadow: "0 0 26px 10px rgba(255,90,60,0.8)" }} /> : null}
            </div>
            <div style={{ marginTop: 14, fontWeight: 900, fontSize: 26, color: C.ink, letterSpacing: "0.08em" }}>SCANNEZ-MOI</div>
          </div>
        </div>
      </div>
      {/* téléphone qui arrive en perspective */}
      <div style={{ position: "absolute", left: 580 + (1 - phoneIn) * 600, top: 640 + (1 - phoneIn) * 300, perspective: 1600 }}>
        <div style={{ transform: `rotateY(${-28 + phoneIn * 14 - sway}deg) rotateX(6deg) rotateZ(${-4 + phoneIn * 2}deg)` }}>
          <Phone width={400} screen={C.cream}>
            {scanned ? (
              <div style={{ position: "absolute", inset: 0, transform: `scale(${0.85 + 0.15 * screenPop})`, opacity: screenPop }}>
                <WheelScreen width={400 * 0.93} rotation={(f - ev.scanFlash) * 4} />
              </div>
            ) : (
              // Vue de l'appareil photo : le QR code du chevalet, cadré, pendant le scan.
              <div style={{ position: "absolute", inset: 0, background: "radial-gradient(ellipse at 50% 45%, #FFF6E2, #E9CFA2)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                <div style={{ transform: `rotate(-6deg) scale(${1 + laser * 0.08})`, filter: `blur(${Math.max(0, 1.5 - laser * 3)}px)`, boxShadow: "0 10px 24px rgba(80,40,0,0.25)" }}>
                  <QR text="https://rouelia.fr" size={190} />
                </div>
                {[0, 1, 2, 3].map((c) => (
                  <div key={c} style={{ position: "absolute", width: 56, height: 56, left: c % 2 ? undefined : "16%", right: c % 2 ? "16%" : undefined, top: c < 2 ? "30%" : undefined, bottom: c < 2 ? undefined : "30%", borderColor: "#fff", borderStyle: "solid", borderWidth: `${c < 2 ? 6 : 0}px ${c % 2 ? 6 : 0}px ${c < 2 ? 0 : 6}px ${c % 2 ? 0 : 6}px`, borderRadius: 10, filter: "drop-shadow(0 2px 4px rgba(0,0,0,0.4))" }} />
                ))}
                {laser > 0 && laser < 1 ? <div style={{ position: "absolute", left: "16%", right: "16%", top: `${30 + laser * 40}%`, height: 5, background: "#FF5A3C", boxShadow: "0 0 18px 6px rgba(255,90,60,0.7)" }} /> : null}
              </div>
            )}
            <div style={{ position: "absolute", inset: 0, background: "linear-gradient(115deg, rgba(255,255,255,0) 40%, rgba(255,255,255,0.25) 50%, rgba(255,255,255,0) 60%)", transform: `translateX(${-100 + (f % 105) * 2.2}%)` }} />
            <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
          </Phone>
        </div>
      </div>
      <Burst at={ev.scanFlash} x={780} y={1050} size={700} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 3. L'avis, puis la grande roue (6 s)                                */
/* ------------------------------------------------------------------ */

const SPIN = ev.spin;
function spinRot(f: number) {
  const p = Math.min(1, Math.max(0, (f - SPIN.start) / (SPIN.end - SPIN.start)));
  return (1 - Math.pow(1 - p, 3.2)) * landing3d(SPIN.index, SPIN.turns);
}

function Avis() {
  const f = useCurrentFrame();
  const PW = 470;
  const SW = PW * 0.93;
  const k = SW / 560;
  const phone = useSpring(0, { damping: 15 });
  const gate = useSpring(3, { damping: 13 });
  const reviewIn = useSpring(ev.gateTap + 5, { damping: 13 });
  const ok = useSpring(ev.published, { damping: 10 });
  const out = interpolate(f, [ev.wheelOut - 4, ev.wheelOut + 8], [0, 1], { ...clamp, easing: ease });
  const big = useSpring(ev.wheelOut, { damping: 13, stiffness: 110 });
  const rot = spinRot(f);
  const vel = Math.abs(spinRot(f + 1) - rot);
  const won = f >= SPIN.end;
  const pill = useSpring(8, { damping: 12 });
  const sway = Math.sin(f / 16) * 6;
  const text = "Super accueil, je reviendrai !";
  const typed = text.slice(0, Math.max(0, Math.floor((f - ev.stars[4] + 2) * 3)));
  return (
    <AbsoluteFill>
      <GoldBg />
      {f < ev.wheelOut ? (
        <>
          <Banner plate="Un avis Google" ribbon="5 étoiles" gold={["étoiles"]} ribbonSize={96} plateSize={84} />
          <div style={{ position: "absolute", left: 0, right: 0, top: 575, display: "flex", justifyContent: "center", transform: `scale(${pill})`, opacity: pill }}>
            <GlossyButton color="green" size={38}>Proposé, jamais obligatoire</GlossyButton>
          </div>
        </>
      ) : won ? (
        <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center" }}>
          <Pop text="Gagné !" at={SPIN.end - 2} size={170} font={display} weight={800} gold={["Gagné", "!"]} />
        </div>
      ) : (
        <Banner key="b" ribbon="Puis il tourne la roue" gold={["roue"]} at={ev.wheelOut} ribbonSize={84} />
      )}
      {/* téléphone : invitation, puis avis */}
      {out < 1 ? (
        <div style={{ position: "absolute", left: (W - PW) / 2, top: 640, perspective: 1600, transform: `translateY(${(1 - phone) * 700 + out * 900}px)`, opacity: 1 - out }}>
          <div style={{ transform: `rotateY(${sway}deg) rotateX(${6 + out * 30}deg)` }}>
            <Phone width={PW}>
              <WheelScreen width={SW} dim={1} />
              {f < ev.gateTap + 5 ? (
                <div style={{ position: "absolute", left: 22 * k, right: 22 * k, bottom: 60 * k, background: "linear-gradient(180deg, #FFFFFF, #FFF6E6)", borderRadius: 30 * k, padding: `${44 * k}px ${30 * k}px ${30 * k}px`, textAlign: "center", fontFamily: sans, transform: `translateY(${(1 - gate) * 400}px)`, boxShadow: "0 20px 40px rgba(0,0,0,0.3)" }}>
                  <div style={{ position: "absolute", right: 22 * k, top: 14 * k, fontSize: 44 * k, color: C.inkSoft, fontWeight: 300, lineHeight: 1 }}>×</div>
                  <div style={{ margin: "0 auto", width: 64 * k, height: 64 * k, borderRadius: "50%", background: "#FCE7B8", display: "flex", alignItems: "center", justifyContent: "center" }}><Star size={40 * k} /></div>
                  <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40 * k, marginTop: 14 * k, color: C.ink }}>Merci de votre visite</div>
                  <div style={{ fontSize: 24 * k, color: C.inkSoft, marginTop: 10 * k, lineHeight: 1.35 }}>Nous vous invitons à nous laisser un avis sur Google : c'est la meilleure façon de nous soutenir.</div>
                  <div style={{ marginTop: 22 * k }}>
                    <GlossyButton color="red" size={24 * k} pressed={f >= ev.gateTap && f < ev.gateTap + 5}>Laisser un avis sur Google</GlossyButton>
                  </div>
                </div>
              ) : (
                <div style={{ position: "absolute", inset: 0, background: "#fff", padding: `${110 * k}px ${36 * k}px`, fontFamily: sans, transform: `translateX(${(1 - reviewIn) * 100}%)` }}>
                  <div style={{ fontWeight: 800, fontSize: 30 * k, color: C.inkSoft, letterSpacing: "0.06em", textTransform: "uppercase" }}>Votre avis sur Google</div>
                  <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44 * k, marginTop: 10 * k }}>Votre commerce</div>
                  <div style={{ display: "flex", gap: 8 * k, marginTop: 40 * k, justifyContent: "center" }}>
                    {ev.stars.map((t, i) => {
                      const s = interpolate(f, [t, t + 4], [0, 1], { ...clamp, easing: ease });
                      const pop = 1 + Math.sin(Math.min(1, Math.max(0, (f - t) / 7)) * Math.PI) * 0.4;
                      return <div key={i} style={{ transform: `scale(${pop})`, filter: s > 0.5 ? "drop-shadow(0 0 10px rgba(255,190,40,0.9)) drop-shadow(0 4px 0 #A8670E)" : undefined }}><Star size={84 * k} fill={s} color="#F7B928" /></div>;
                    })}
                  </div>
                  <div style={{ marginTop: 40 * k, border: `3px solid ${C.line}`, borderRadius: 20 * k, padding: `${20 * k}px ${22 * k}px`, minHeight: 120 * k, fontSize: 30 * k, fontWeight: 600, color: C.ink }}>{typed}</div>
                  <div style={{ marginTop: 34 * k, display: "flex", justifyContent: "center", transform: `scale(${ok})`, opacity: ok }}>
                    <GlossyButton color="green" size={28 * k}>Avis publié</GlossyButton>
                  </div>
                </div>
              )}
            </Phone>
          </div>
        </div>
      ) : null}
      {/* la grande roue dorée sort du téléphone */}
      {f >= ev.wheelOut - 2 ? (
        <div style={{ position: "absolute", left: (W - 780) / 2, top: 600, transform: `translateY(${(1 - big) * 900}px) scale(${0.5 + 0.5 * big}) rotate(${(1 - big) * -20}deg)`, transformOrigin: "50% 40%" }}>
          <GoldWheel size={780} rotation={rot} blur={Math.min(4, vel / 8)} glow={won ? { index: SPIN.index, amount: 0.5 + 0.5 * Math.sin((f - SPIN.end) / 3) } : undefined} />
        </div>
      ) : null}
      {f < ev.wheelOut ? <Finger x={W / 2} y={640 + PW * 2.05 - 60 * k - 60} tapAt={ev.gateTap} /> : null}
      <Finger x={W / 2 + 30} y={1000} tapAt={ev.spinTap} />
      <Burst at={SPIN.end} x={W / 2} y={990} size={1100} />
      <Confetti at={SPIN.end} x={W / 2} y={990} count={130} colors={CONFETTI} />
      {won ? <Streamers count={12} seed={3} fall={2} /> : null}
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Le cadeau et le retour (4,5 s)                                   */
/* ------------------------------------------------------------------ */

function Cadeau() {
  const f = useCurrentFrame();
  const flip = interpolate(f, [0, 18], [-160, 0], { ...clamp, easing: ease });
  const btn = useSpring(ev.rdvButton, { damping: 13 });
  const cal = useSpring(ev.rdvCal, { damping: 12 });
  const check = interpolate(f, [ev.rdvCheck, ev.rdvCheck + 10], [0, 1], { ...clamp, easing: ease });
  const float = Math.sin(f / 14) * 8;
  return (
    <AbsoluteFill>
      <GoldBg />
      <Streamers count={8} seed={5} />
      <Banner plate="Il gagne un cadeau" ribbon="et revient le chercher" gold={["revient"]} ribbonSize={80} plateSize={80} />
      <div style={{ position: "absolute", left: (W - 800) / 2, top: 600 + float, perspective: 1600 }}>
        <div style={{ transform: `rotateY(${flip + Math.sin(f / 20) * 6}deg) rotateX(10deg)` }}>
          <Card3D style={{ width: 800, overflow: "hidden", fontFamily: sans }}>
            <div style={{ background: "linear-gradient(180deg, #EE4B2E, #B8230F)", color: "#fff", padding: "22px 44px", fontWeight: 900, fontSize: 32, letterSpacing: "0.1em", textTransform: "uppercase", boxShadow: "inset 0 -5px 0 #F7C948", textShadow: "0 3px 0 rgba(0,0,0,0.3)" }}>Votre cadeau</div>
            <div style={{ padding: "26px 44px 32px" }}>
              <div style={{ fontFamily: display, fontWeight: 800, fontSize: 84, lineHeight: 1, color: DEEP_GREEN, textShadow: "0 3px 0 #E2CFA3" }}>Cadeau offert</div>
              <div style={{ marginTop: 20, border: "4px dashed #E3CFA6", borderRadius: 24, padding: "14px 26px" }}>
                <div style={{ fontSize: 24, fontWeight: 800, color: C.inkSoft, letterSpacing: "0.14em" }}>VOTRE CODE</div>
                <div style={{ fontFamily: "Courier New, monospace", fontWeight: 800, fontSize: 64, letterSpacing: "0.08em" }}>RVL-7K4M2</div>
              </div>
              <div style={{ marginTop: 14, fontSize: 30, color: C.inkSoft, fontWeight: 700 }}>À récupérer lors de votre prochaine visite.</div>
            </div>
          </Card3D>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1140, display: "flex", justifyContent: "center", transform: `scale(${btn})`, opacity: btn }}>
        <GlossyButton color="red" size={44} pressed={f >= ev.rdvTap && f < ev.rdvTap + 6}>Réserver ma prochaine visite</GlossyButton>
      </div>
      <Finger x={W / 2 + 340} y={1190} tapAt={ev.rdvTap} />
      <div style={{ position: "absolute", left: (W - 620) / 2, top: 1300, perspective: 1400, transform: `scale(${cal}) translateY(${(1 - cal) * 120}px)`, opacity: Math.min(1, cal * 1.5) }}>
        <div style={{ transform: "rotateX(14deg)" }}>
          <Card3D style={{ width: 620, padding: "20px 28px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", fontFamily: sans }}>
              <div style={{ fontWeight: 900, fontSize: 28, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.1em" }}>Prochaine visite</div>
              <div style={{ display: "flex", alignItems: "center", gap: 8, fontWeight: 900, fontSize: 28, color: C.sauge, opacity: check }}>
                <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.sauge} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                Réservé
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 14 }}>
              {Array.from({ length: 7 }, (_, d) => (
                <div key={d} style={{ height: 64, borderRadius: 14, background: d === 4 ? "linear-gradient(180deg, #EE4B2E, #B8230F)" : "#F6EBD6", color: d === 4 ? "#fff" : C.ink, boxShadow: d === 4 ? "0 5px 0 #6E1608" : "0 4px 0 #E3CFA6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontWeight: 800, fontSize: 28, transform: `scale(${d === 4 ? 1 + 0.15 * Math.sin(check * Math.PI) : 1})` }}>
                  {d + 10}
                </div>
              ))}
            </div>
          </Card3D>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 5. L'espace du commerçant (4,5 s)                                     */
/* ------------------------------------------------------------------ */

const TILES = [
  { label: "Avis Google", value: 38, prefix: "+", icon: "star" },
  { label: "Parties jouées", value: 412, prefix: "", icon: "wheel" },
  { label: "Rendez-vous pris", value: 57, prefix: "", icon: "cal" },
  { label: "Cadeaux retirés", value: 96, prefix: "", icon: "gift" },
] as const;

function TileIcon({ icon }: { icon: (typeof TILES)[number]["icon"] }) {
  if (icon === "star") return <Star size={46} color="#F7B928" />;
  const p = { width: 46, height: 46, viewBox: "0 0 24 24", fill: "none", stroke: C.tomette, strokeWidth: 2.4, strokeLinecap: "round" as const, strokeLinejoin: "round" as const };
  if (icon === "wheel") return <svg {...p}><circle cx="12" cy="12" r="9" /><path d="M12 3v18M3 12h18M5.6 5.6l12.8 12.8M18.4 5.6L5.6 18.4" /></svg>;
  if (icon === "cal") return <svg {...p}><rect x="3" y="5" width="18" height="16" rx="2.5" /><path d="M3 10h18M8 3v4M16 3v4" /></svg>;
  return <svg {...p}><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" /></svg>;
}

function Espace() {
  const f = useCurrentFrame();
  const card = useSpring(0, { damping: 15, stiffness: 110 });
  const chart = interpolate(f, [ev.tiles[0], ev.tiles[3] + ev.countLen], [0, 1], { ...clamp, easing: ease });
  const pts = [0.08, 0.14, 0.12, 0.25, 0.3, 0.42, 0.5, 0.62, 0.7, 0.86, 0.95];
  const cw = 800;
  const ch = 170;
  const path = pts.map((v, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * cw} ${ch - v * ch}`).join(" ");
  const ry = -12 + interpolate(f, [0, 135], [0, 14], clamp);
  return (
    <AbsoluteFill>
      <GoldBg />
      <Banner plate="Côté commerce" ribbon="tout monte" gold={["monte"]} ribbonSize={100} plateSize={88} />
      <div style={{ position: "absolute", left: (W - 920) / 2, top: 640, perspective: 1800 }}>
        <div style={{ transform: `rotateX(${12 + (1 - card) * 25}deg) rotateY(${ry}deg) translateY(${(1 - card) * 500}px)`, opacity: Math.min(1, card * 2) }}>
          <Card3D style={{ width: 920, overflow: "hidden", fontFamily: sans }}>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "22px 34px", borderBottom: "3px solid #EFE1C6" }}>
              <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
                <Logo size={48} spin={f * 2} />
                <span style={{ fontWeight: 800, fontSize: 28, color: C.inkSoft }}>Votre espace</span>
              </div>
              <span style={{ background: "#F6EBD6", borderRadius: 999, padding: "8px 18px", fontWeight: 800, fontSize: 22, color: C.inkSoft }}>Exemple</span>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, padding: "26px 30px 10px" }}>
              {TILES.map((t, i) => {
                const at = ev.tiles[i];
                const s = spring({ frame: f - at, fps: 30, config: { damping: 12, stiffness: 160 } });
                const c = interpolate(f, [at + 3, at + 3 + ev.countLen * 0.7], [0, 1], { ...clamp, easing: ease });
                const done = f >= at + 3 + ev.countLen * 0.7;
                return (
                  <div key={i} style={{ background: "linear-gradient(180deg, #FFFBF2, #F6EBD6)", borderRadius: 26, padding: "20px 22px", boxShadow: "0 8px 0 #E3CFA6, 0 18px 26px rgba(80,40,0,0.12)", transform: `translateY(${(1 - s) * 60}px) scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.5) }}>
                    <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                      <TileIcon icon={t.icon} />
                      <span style={{ fontWeight: 800, fontSize: 28, color: C.inkSoft }}>{t.label}</span>
                    </div>
                    <div style={{ display: "flex", alignItems: "center", gap: 14, marginTop: 6 }}>
                      <span style={{ fontFamily: display, fontWeight: 800, fontSize: 92, color: DEEP_GREEN, lineHeight: 1, textShadow: "0 3px 0 #E2CFA3, 0 6px 0 #C6A464" }}>{t.prefix}{Math.round(t.value * c)}</span>
                      <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 50, height: 50, borderRadius: "50%", background: GREEN, boxShadow: "0 4px 0 #0B2C1F", transform: `scale(${done ? 1 : 0})` }}>
                        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                      </span>
                    </div>
                  </div>
                );
              })}
            </div>
            <div style={{ padding: "18px 60px 30px" }}>
              <div style={{ fontWeight: 800, fontSize: 26, color: C.inkSoft, marginBottom: 10 }}>Avis ce mois-ci</div>
              <svg width={cw} height={ch} viewBox={`0 0 ${cw} ${ch}`} style={{ overflow: "visible" }}>
                <defs>
                  <linearGradient id="area3d" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stopColor="#F7C948" stopOpacity="0.6" /><stop offset="1" stopColor="#F7C948" stopOpacity="0" /></linearGradient>
                </defs>
                <path d={`${path} L${cw} ${ch} L0 ${ch} Z`} fill="url(#area3d)" opacity={chart} />
                <path d={path} fill="none" stroke="#C9301A" strokeWidth={9} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - chart} style={{ filter: "drop-shadow(0 4px 0 #7E1708)" }} />
              </svg>
            </div>
          </Card3D>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Le cercle Jeu, Avis, Retour et l'appel à l'action (4 s)          */
/* ------------------------------------------------------------------ */

const LOOP = [
  { label: "Jeu", color: "red" as const },
  { label: "Avis", color: "gold" as const },
  { label: "Retour", color: "green" as const },
];

function Fin() {
  const f = useCurrentFrame();
  const logo = useSpring(0, { damping: 11, stiffness: 120 });
  const ring = useSpring(2, { damping: 13 });
  const panel = useSpring(ev.ctaButton, { damping: 12 });
  const url = useSpring(ev.ctaUrl, { damping: 11 });
  const turn = 360 * interpolate(f, [0, 100], [0, 1], { ...clamp, easing: ease });
  const cx = W / 2, cy = 760, R = 330, RY = 120;
  return (
    <AbsoluteFill>
      <GoldBg />
      <Streamers count={10} seed={9} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", transform: `scale(${logo})`, filter: "drop-shadow(0 4px 0 #C6A464) drop-shadow(0 14px 18px rgba(80,40,0,0.35))" }}>
        <Logo size={140} spin={f * 4} />
      </div>
      {/* manège : le cercle Jeu → Avis → Retour tourne en 3D */}
      <svg width={W} height={500} viewBox={`0 0 ${W} 500`} style={{ position: "absolute", left: 0, top: cy - 250, opacity: ring, overflow: "visible" }}>
        <defs>
          <linearGradient id="ring3d" x1="0" x2="1"><stop offset="0" stopColor="#A8670E" /><stop offset="0.5" stopColor="#FFE07A" /><stop offset="1" stopColor="#A8670E" /></linearGradient>
        </defs>
        <ellipse cx={cx} cy={262} rx={R} ry={RY} fill="none" stroke="#8A5505" strokeWidth={20} />
        <ellipse cx={cx} cy={250} rx={R} ry={RY} fill="none" stroke="url(#ring3d)" strokeWidth={20} />
        <ellipse cx={cx} cy={250} rx={R} ry={RY} fill="none" stroke="#FFFDF0" strokeWidth={6} strokeDasharray="18 40" strokeDashoffset={-f * 6} strokeLinecap="round" />
      </svg>
      {LOOP.map((l, i) => {
        const th = ((90 - turn + i * 120) * Math.PI) / 180;
        const x = cx + Math.cos(th) * R;
        const y = cy + Math.sin(th) * RY;
        const d = (Math.sin(th) + 1) / 2;
        const s = spring({ frame: f - ev.pills[i], fps: 30, config: { damping: 11, stiffness: 180 } });
        return (
          <div key={i} style={{ position: "absolute", left: x, top: y, zIndex: Math.round(d * 10), transform: `translate(-50%, -60%) scale(${(0.62 + 0.45 * d) * s})`, opacity: Math.min(1, s * 1.5) * (0.7 + 0.3 * d) }}>
            <GlossyButton color={l.color} size={58}>{l.label}</GlossyButton>
          </div>
        );
      })}
      {/* panneau final, comme le flyer */}
      <div style={{ position: "absolute", left: (W - 860) / 2, top: 1040, perspective: 1600, transform: `translateY(${(1 - panel) * 400}px)`, opacity: Math.min(1, panel * 2) }}>
        <div style={{ transform: "rotateX(10deg)", width: 860, border: "8px solid transparent", borderRadius: 40, background: `linear-gradient(180deg, #1C4A37, #0E2E21) padding-box, ${GOLD} border-box`, boxShadow: "0 16px 0 #8A5505, 0 50px 80px rgba(60,30,0,0.45)", padding: "34px 30px 38px", display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ fontFamily: display, fontWeight: 800, fontSize: 112, lineHeight: 1, ...goldText }}>Essai gratuit</div>
          <div style={{ marginTop: 16, fontFamily: sans, fontWeight: 900, fontSize: 92, color: "#fff", textShadow: "0 4px 0 rgba(0,0,0,0.35)", transform: `scale(${url})` }}>rouelia.fr</div>
          <div style={{ marginTop: 14, display: "flex", alignItems: "center", gap: 12, fontFamily: sans, fontWeight: 800, fontSize: 38, color: "#FFF3C4", opacity: url }}>
            <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="#F7C948" strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="9.5" /><path d="M7.5 12.5l3 3 6-6.5" /></svg>
            Sans carte bancaire
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* Montage                                                             */
/* ------------------------------------------------------------------ */

const SCENES = { probleme: Probleme, scan: Scan, avis: Avis, cadeau: Cadeau, espace: Espace, fin: Fin } as const;

export function StoryVideo() {
  const entries = Object.entries(story.scenes) as [keyof typeof SCENES, number[]][];
  const hasAudio = getStaticFiles().some((x) => x.name === "audio/story.wav");
  return (
    <AbsoluteFill style={{ background: "#F8E3BC" }}>
      <style>{fontCss}</style>
      {entries.map(([id, [from, to]], k) => {
        const Scene = SCENES[id];
        const len = to - from;
        const last = k === entries.length - 1;
        return (
          <Sequence key={id} from={from} durationInFrames={len + (last ? 0 : OVERLAP)} name={id}>
            <Shell len={len} first={k === 0} last={last}>
              <Scene />
            </Shell>
          </Sequence>
        );
      })}
      <LightFx cuts={entries.slice(1).map(([, [from]]) => from)} />
      {hasAudio ? <Audio src={staticFile("audio/story.wav")} /> : null}
    </AbsoluteFill>
  );
}
