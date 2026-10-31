import React from "react";
import { AbsoluteFill, Audio, getStaticFiles, interpolate, Sequence, spring, staticFile, useCurrentFrame } from "remotion";
import story from "./story.json";
import { C, display, fontCss, sans } from "./theme";
import { Awning, Background, Card, clamp, Confetti, ease, Finger, landingRotation, Logo, Phone, QR, Star, useProgress, useSpring, Wheel, Words } from "./components";
import { LightFx, Shell } from "./Video";

/**
 * Pub verticale de 25 s pour les stories Instagram et les messages (WhatsApp, SMS), sans voix.
 * Mêmes composants que la vidéo du site. Tout le texte reste dans la zone centrale (entre 300 et 1580 px),
 * à l'abri des barres d'Instagram en haut et en bas.
 */

const W = 1080;
const ev = story.ev;
const OVERLAP = 8;

/** Roue neutre, valable pour tous les commerces. */
const WHEEL = {
  colors: [C.tomette, C.cream, C.safran, C.sauge],
  prizes: ["Cadeau offert", "-10 %", "Surprise", "-20 %", "Bonus", "Offert"],
  rim: C.deep,
  hub: C.tomette,
};

/** Sous-titre en haut de la zone centrale. */
function Cap({ children, top = 330 }: { children: React.ReactNode; top?: number }) {
  return <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", flexDirection: "column", alignItems: "center", gap: 6 }}>{children}</div>;
}

/** Pastille discrète sous un sous-titre. */
function Pill({ children, at, color = C.sauge }: { children: React.ReactNode; at: number; color?: string }) {
  const s = useSpring(at, { damping: 12 });
  return (
    <div style={{ marginTop: 18, transform: `scale(${s})`, opacity: s, background: "#fff", color, borderRadius: 999, padding: "12px 30px", fontFamily: sans, fontWeight: 800, fontSize: 40, boxShadow: "0 14px 30px rgba(60,30,10,0.14)" }}>
      {children}
    </div>
  );
}

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

function ShopIcon({ k, size, color = "#fff" }: { k: number; size: number; color?: string }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke={color} strokeWidth={2.2} strokeLinecap="round" strokeLinejoin="round">
      {ICONS[k].d}
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* 1. Le problème (3 s)                                                */
/* ------------------------------------------------------------------ */

function Probleme() {
  const f = useCurrentFrame();
  const shop = useSpring(0, { damping: 13, stiffness: 120 });
  const k = Math.min(ICONS.length - 1, Math.floor(f / ev.signStep));
  const swap = spring({ frame: f - k * ev.signStep, fps: 30, config: { damping: 11, stiffness: 200 } });
  const walk = interpolate(f, ev.probLeave, [0, 1], clamp);
  const door = interpolate(f, [ev.probLeave[0] - 8, ev.probLeave[0], ev.probLeave[1] - 24, ev.probLeave[1] - 14], [0, 1, 1, 0], clamp);
  const slam = ev.probWords2[0] + ev.probWords2[1] * 3;
  const shake = f >= slam && f < slam + 10 ? Math.sin((f - slam) * 2.6) * (10 - (f - slam)) * 1.3 : 0;
  return (
    <AbsoluteFill>
      <Background tint="#F6D9CE" />
      <Cap top={320}>
        <Words text="Vos clients passent," at={ev.probWords[0]} step={ev.probWords[1]} size={104} width={1040} />
        <div style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
          <Words text="mais ne reviennent pas." at={ev.probWords2[0]} step={ev.probWords2[1]} size={104} width={1040} accent={["reviennent"]} />
        </div>
      </Cap>
      {/* devanture : l'enseigne change de métier, le client s'en va */}
      <div style={{ position: "absolute", left: 190, top: 860, width: 700, height: 600, transform: `translateY(${(1 - shop) * 500}px) scale(${0.8 + 0.2 * shop})`, opacity: Math.min(1, shop * 2) }}>
        <div style={{ position: "absolute", inset: "70px 0 0 0", background: "#EADFD2", borderRadius: 18, boxShadow: "0 40px 70px rgba(60,30,10,0.25)" }} />
        <div style={{ position: "absolute", left: 40, right: 40, top: 0, height: 120, background: C.ink, borderRadius: 18, display: "flex", alignItems: "center", justifyContent: "center", gap: 20, boxShadow: "0 16px 30px rgba(0,0,0,0.2)" }}>
          <div style={{ transform: `scale(${0.4 + 0.6 * swap}) rotate(${(1 - swap) * -40}deg)` }}>
            <ShopIcon k={k} size={70} color={C.safran} />
          </div>
          <span style={{ fontFamily: display, fontWeight: 650, fontSize: 56, color: "#fff", whiteSpace: "nowrap" }}>Votre commerce</span>
        </div>
        <div style={{ position: "absolute", left: -18, right: -18, top: 140 }}>
          <Awning width={736} height={100} id="aw-prob" />
        </div>
        <div style={{ position: "absolute", left: 50, top: 270, width: 330, height: 250, background: "linear-gradient(160deg, #CFE3EA, #9FC2CF)", borderRadius: 12, boxShadow: "inset 0 0 0 10px #2c2724" }}>
          <div style={{ position: "absolute", left: 26, top: 26, width: 110, height: 46, background: "rgba(255,255,255,0.5)", borderRadius: 6, transform: "skewX(-20deg)" }} />
        </div>
        <div style={{ position: "absolute", left: 440, top: 250, width: 200, height: 350, background: "#2c2724", borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
          <div style={{ position: "absolute", inset: 10, background: "#F7E8C9", opacity: door }} />
          <div style={{ position: "absolute", inset: 10, background: "#5b4a3f", transformOrigin: "left", transform: `perspective(600px) rotateY(${-door * 70}deg)`, borderRadius: 6 }} />
        </div>
        <div style={{ position: "absolute", left: 500 + walk * 380, top: 390, opacity: walk > 0 ? 1 - walk * walk : 0, transform: `translateY(${Math.sin(walk * 22) * 6}px)` }}>
          <div style={{ width: 62, height: 62, borderRadius: "50%", background: C.ink, margin: "0 auto" }} />
          <div style={{ width: 104, height: 150, borderRadius: "52px 52px 18px 18px", background: C.ink, marginTop: 8 }} />
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center" }}>
        <div key={k} style={{ fontFamily: sans, fontWeight: 800, fontSize: 44, color: C.inkSoft, transform: `translateY(${(1 - swap) * 30}px)`, opacity: Math.min(1, swap * 1.5) }}>{ICONS[k].label}</div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 2. Le scan au comptoir (3 s)                                        */
/* ------------------------------------------------------------------ */

function WheelScreen({ width, rotation = 0, blur = 0, glow, dim = 0, caption = "Touchez la roue pour jouer" }: { width: number; rotation?: number; blur?: number; glow?: { index: number; amount: number }; dim?: number; caption?: string }) {
  const k = width / 600;
  return (
    <div style={{ position: "absolute", inset: 0 }}>
      <Awning width={width} height={56 * k} id={`aw-ws-${Math.round(width)}`} />
      <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40 * k }}>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 42 * k }}>Votre commerce</div>
        <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 26 * k, color: C.inkSoft, marginTop: 8 * k }}>{caption}</div>
        <div style={{ marginTop: 50 * k }}>
          <Wheel size={540 * k} colors={WHEEL.colors} prizes={WHEEL.prizes} rotation={rotation} rim={WHEEL.rim} hub={WHEEL.hub} hubLabel="VC" motionBlur={blur} glow={glow} />
        </div>
      </div>
      {dim > 0 ? <div style={{ position: "absolute", inset: 0, background: `rgba(29,26,22,${0.45 * dim})` }} /> : null}
    </div>
  );
}

function Scan() {
  const f = useCurrentFrame();
  const stand = useSpring(0, { damping: 14, stiffness: 120 });
  const phoneIn = useProgress(ev.scanPhone[0], ev.scanPhone[1]);
  const laser = interpolate(f, ev.scanLaser, [0, 1], clamp);
  const flash = interpolate(f, [ev.scanFlash, ev.scanFlash + 4, ev.scanFlash + 16], [0, 1, 0], clamp);
  const scanned = f >= ev.scanFlash + 2;
  const screenPop = useSpring(ev.scanFlash + 2, { damping: 12 });
  return (
    <AbsoluteFill>
      <Background tint="#FCE1D3" />
      <Cap top={320}>
        <Words text="Il scanne le QR code au comptoir" at={2} step={3} size={100} width={980} accent={["QR"]} />
      </Cap>
      {/* comptoir */}
      <div style={{ position: "absolute", left: -40, right: -40, top: 1380, height: 260, background: "linear-gradient(#C99A6B, #A97A4E)", boxShadow: "0 -10px 30px rgba(60,30,10,0.18)" }}>
        <div style={{ height: 22, background: "#DDB487" }} />
      </div>
      {/* chevalet avec le QR code */}
      <div style={{ position: "absolute", left: 110, top: 760, perspective: 1600 }}>
        <div style={{ transform: `rotateY(${18 - 8 * stand}deg) rotateX(6deg) translateY(${(1 - stand) * 500}px)`, transformOrigin: "50% 100%" }}>
          <div style={{ width: 430, height: 620, background: "#fff", borderRadius: 26, boxShadow: "0 50px 80px rgba(60,30,10,0.3)", display: "flex", flexDirection: "column", alignItems: "center", overflow: "hidden", fontFamily: sans }}>
            <Awning width={430} height={50} id="aw-tent" />
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 48, marginTop: 28, color: C.ink }}>Tentez votre chance</div>
            <div style={{ marginTop: 14, background: C.tomette, color: "#fff", borderRadius: 999, padding: "6px 20px", fontWeight: 800, fontSize: 20, letterSpacing: "0.05em" }}>CHAQUE CASE EST UN CADEAU</div>
            <div style={{ marginTop: 26, border: `5px solid ${C.ink}`, borderRadius: 18, padding: 8, position: "relative", overflow: "hidden" }}>
              <QR text="https://rouelia.fr" size={260} />
              {laser > 0 && laser < 1 ? <div style={{ position: "absolute", left: 0, right: 0, top: `${laser * 100}%`, height: 6, background: C.tomette, boxShadow: `0 0 24px 8px ${C.tomette}` }} /> : null}
            </div>
            <div style={{ marginTop: 18, fontWeight: 800, fontSize: 26, color: C.ink, letterSpacing: "0.08em" }}>SCANNEZ-MOI</div>
          </div>
        </div>
      </div>
      {/* téléphone */}
      <div style={{ position: "absolute", left: 590 + (1 - phoneIn) * 600, top: 640 + (1 - phoneIn) * 300, transform: `rotate(${-6 + phoneIn * 4}deg)` }}>
        <Phone width={410} screen={scanned ? C.cream : "#111"}>
          {scanned ? (
            <div style={{ position: "absolute", inset: 0, transform: `scale(${0.85 + 0.15 * screenPop})`, opacity: screenPop }}>
              <WheelScreen width={410 * 0.93} rotation={(f - ev.scanFlash) * 3} />
            </div>
          ) : (
            <div style={{ position: "absolute", inset: "20% 12%", border: "4px solid rgba(255,255,255,0.7)", borderRadius: 24 }} />
          )}
          <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
        </Phone>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 3. L'avis, puis la roue (5 s)                                       */
/* ------------------------------------------------------------------ */

const SPIN = ev.spin;
export function storySpinRotation(f: number) {
  const p = Math.min(1, Math.max(0, (f - SPIN.start) / (SPIN.end - SPIN.start)));
  return (1 - Math.pow(1 - p, 3.2)) * landingRotation(SPIN.index, SPIN.segments, SPIN.turns);
}

function Avis() {
  const f = useCurrentFrame();
  const PW = 520;
  const SW = PW * 0.93;
  const k = SW / 560;
  const phone = useSpring(0, { damping: 15 });
  const gate = useSpring(4, { damping: 13 });
  const review = f >= ev.gateTap + 6 && f < ev.backToWheel;
  const wheelPhase = f >= ev.backToWheel;
  const rot = storySpinRotation(f);
  const vel = Math.abs(storySpinRotation(f + 1) - rot);
  const won = f >= SPIN.end;
  const zoom = interpolate(f, [ev.backToWheel, SPIN.start, SPIN.end, SPIN.end + 10], [1, 1.03, 1.1, 1.05], clamp);
  const reviewIn = useSpring(ev.gateTap + 6, { damping: 13 });
  const ok = useSpring(ev.published, { damping: 10 });
  const badge = useSpring(SPIN.end + 2, { damping: 10 });
  const text = "Super accueil, je reviendrai !";
  const typed = text.slice(0, Math.max(0, Math.floor((f - ev.stars[4] + 2) * 2.2)));
  return (
    <AbsoluteFill>
      <Background tint="#FCE7B8" />
      <Cap top={300}>
        {!wheelPhase ? (
          <>
            <Words text="Un avis Google 5 étoiles" at={0} step={3} size={100} width={1000} accent={["avis", "Google"]} />
            <Pill at={10}>Proposé, jamais obligatoire</Pill>
          </>
        ) : (
          <Words key="w" text={won ? "Gagné !" : "Puis il tourne la roue"} at={won ? SPIN.end - 2 : ev.backToWheel} step={3} size={won ? 130 : 100} width={1000} accent={["roue", "Gagné"]} />
        )}
      </Cap>
      <div style={{ position: "absolute", left: (W - PW) / 2, top: 560, transform: `translateY(${(1 - phone) * 700}px) scale(${zoom})`, transformOrigin: "50% 40%" }}>
        <Phone width={PW}>
          <WheelScreen width={SW} rotation={wheelPhase ? rot : 0} blur={Math.min(4, vel / 8)} dim={wheelPhase ? 0 : 1} glow={won ? { index: SPIN.index, amount: 0.5 + 0.5 * Math.sin((f - SPIN.end) / 3) } : undefined} />
          {/* fenêtre d'invitation, comme dans le jeu : bouton vers Google et croix pour fermer */}
          {f < ev.gateTap + 6 ? (
            <div style={{ position: "absolute", left: 22 * k, right: 22 * k, bottom: 60 * k, background: "#fff", borderRadius: 30 * k, padding: `${44 * k}px ${30 * k}px ${30 * k}px`, textAlign: "center", fontFamily: sans, transform: `translateY(${(1 - gate) * 400}px)`, boxShadow: "0 20px 40px rgba(0,0,0,0.25)" }}>
              <div style={{ position: "absolute", right: 22 * k, top: 14 * k, fontSize: 44 * k, color: C.inkSoft, fontWeight: 300, lineHeight: 1 }}>×</div>
              <div style={{ margin: "0 auto", width: 64 * k, height: 64 * k, borderRadius: "50%", background: "#FCE7B8", display: "flex", alignItems: "center", justifyContent: "center" }}><Star size={40 * k} /></div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40 * k, marginTop: 14 * k, color: C.ink }}>Merci de votre visite</div>
              <div style={{ fontSize: 24 * k, color: C.inkSoft, marginTop: 10 * k, lineHeight: 1.35 }}>Nous vous invitons à nous laisser un avis sur Google : c'est la meilleure façon de nous soutenir.</div>
              <div style={{ marginTop: 22 * k, background: C.ink, color: "#fff", borderRadius: 999, padding: `${18 * k}px 0`, fontWeight: 800, fontSize: 26 * k, transform: `scale(${f >= ev.gateTap && f < ev.gateTap + 5 ? 0.95 : 1})` }}>Laisser un avis sur Google</div>
            </div>
          ) : null}
          {/* l'avis, rédigé sur la fiche */}
          {review ? (
            <div style={{ position: "absolute", inset: 0, background: "#fff", padding: `${110 * k}px ${36 * k}px`, fontFamily: sans, transform: `translateX(${(1 - reviewIn) * 100}%)` }}>
              <div style={{ fontWeight: 800, fontSize: 30 * k, color: C.inkSoft, letterSpacing: "0.06em", textTransform: "uppercase" }}>Votre avis sur Google</div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 44 * k, marginTop: 10 * k }}>Votre commerce</div>
              <div style={{ display: "flex", gap: 8 * k, marginTop: 40 * k, justifyContent: "center" }}>
                {ev.stars.map((t, i) => {
                  const s = interpolate(f, [t, t + 5], [0, 1], { ...clamp, easing: ease });
                  const pop = 1 + Math.sin(Math.min(1, Math.max(0, (f - t) / 8)) * Math.PI) * 0.35;
                  return <div key={i} style={{ transform: `scale(${pop})` }}><Star size={84 * k} fill={s} /></div>;
                })}
              </div>
              <div style={{ marginTop: 40 * k, border: `3px solid ${C.line}`, borderRadius: 20 * k, padding: `${20 * k}px ${22 * k}px`, minHeight: 120 * k, fontSize: 30 * k, fontWeight: 600, color: C.ink }}>{typed}</div>
              <div style={{ marginTop: 34 * k, display: "flex", justifyContent: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: 12 * k, background: C.sauge, color: "#fff", borderRadius: 999, padding: `${14 * k}px ${34 * k}px`, fontWeight: 800, fontSize: 30 * k, transform: `scale(${ok})`, opacity: ok }}>
                  <svg width={30 * k} height={30 * k} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
                  Avis publié
                </div>
              </div>
            </div>
          ) : null}
          {won ? (
            <div style={{ position: "absolute", left: 0, right: 0, bottom: 70 * k, display: "flex", justifyContent: "center" }}>
              <div style={{ transform: `scale(${badge})`, background: C.sauge, color: "#fff", borderRadius: 999, padding: `${16 * k}px ${36 * k}px`, fontFamily: sans, fontWeight: 800, fontSize: 32 * k }}>Bravo : Cadeau offert</div>
            </div>
          ) : null}
        </Phone>
      </div>
      <Finger x={W / 2} y={560 + PW * 2.05 - 60 * k - 70} tapAt={ev.gateTap} />
      <Finger x={W / 2 + 20} y={1000} tapAt={ev.spinTap} />
      <Confetti at={SPIN.end} x={W / 2} y={1000} count={120} />
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Le cadeau et la prochaine visite (5 s)                           */
/* ------------------------------------------------------------------ */

function Cadeau() {
  const f = useCurrentFrame();
  const flip = interpolate(f, [2, 22], [-180, 0], { ...clamp, easing: ease });
  const btn = useSpring(ev.rdvButton, { damping: 13 });
  const cal = useSpring(ev.rdvCal, { damping: 12 });
  const check = interpolate(f, [ev.rdvCheck, ev.rdvCheck + 12], [0, 1], { ...clamp, easing: ease });
  const second = f >= ev.giftCaption;
  return (
    <AbsoluteFill>
      <Background tint="#E3EEE8" />
      <Cap top={320}>
        {second ? (
          <Words key="b" text="Il réserve sa prochaine visite" at={ev.giftCaption} step={3} size={100} width={1000} accent={["prochaine", "visite"]} />
        ) : (
          <Words key="a" text="Il gagne un cadeau" at={0} step={3} size={112} width={1000} accent={["cadeau"]} />
        )}
      </Cap>
      <Confetti at={0} x={W / 2} y={700} count={90} />
      <div style={{ position: "absolute", left: (W - 800) / 2, top: 580, perspective: 1600 }}>
        <div style={{ transform: `rotateY(${flip}deg) rotateX(6deg)`, backfaceVisibility: "hidden" }}>
          <div style={{ width: 800, borderRadius: 40, background: "#fff", boxShadow: "0 50px 90px rgba(30,60,40,0.25)", overflow: "hidden", fontFamily: sans }}>
            <div style={{ background: C.sauge, color: "#fff", padding: "24px 44px", fontWeight: 800, fontSize: 32, letterSpacing: "0.1em", textTransform: "uppercase" }}>Votre cadeau</div>
            <div style={{ padding: "30px 44px" }}>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 80, lineHeight: 1 }}>Cadeau offert</div>
              <div style={{ marginTop: 22, border: `4px dashed ${C.line}`, borderRadius: 24, padding: "16px 26px" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.inkSoft, letterSpacing: "0.14em" }}>VOTRE CODE</div>
                <div style={{ fontFamily: "Courier New, monospace", fontWeight: 800, fontSize: 66, letterSpacing: "0.08em" }}>RVL-7K4M2</div>
              </div>
              <div style={{ marginTop: 16, fontSize: 30, color: C.inkSoft, fontWeight: 600 }}>À récupérer lors de votre prochaine visite.</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1140, display: "flex", justifyContent: "center", transform: `scale(${btn * (f >= ev.rdvTap && f < ev.rdvTap + 6 ? 0.94 : 1)})`, opacity: btn }}>
        <div style={{ background: C.tomette, color: "#fff", borderRadius: 999, padding: "28px 56px", fontFamily: sans, fontWeight: 800, fontSize: 44, boxShadow: "0 24px 44px rgba(196,64,31,0.35)" }}>Réserver ma prochaine visite</div>
      </div>
      <Finger x={W / 2 + 330} y={1185} tapAt={ev.rdvTap} />
      <div style={{ position: "absolute", left: (W - 600) / 2, top: 1290, transform: `scale(${cal}) translateY(${(1 - cal) * 120}px)`, opacity: Math.min(1, cal * 1.5) }}>
        <Card style={{ width: 600, padding: "22px 28px" }}>
          <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
            <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 28, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.1em" }}>Prochaine visite</div>
            <div style={{ display: "flex", alignItems: "center", gap: 8, fontFamily: sans, fontWeight: 800, fontSize: 28, color: C.sauge, opacity: check }}>
              <svg width="30" height="30" viewBox="0 0 24 24" fill="none" stroke={C.sauge} strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M5 12.5l4.5 4.5L19 7" /></svg>
              Réservé
            </div>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 14 }}>
            {Array.from({ length: 7 }, (_, d) => (
              <div key={d} style={{ height: 64, borderRadius: 14, background: d === 4 ? C.tomette : C.cream, color: d === 4 ? "#fff" : C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontWeight: 700, fontSize: 28, transform: `scale(${d === 4 ? 1 + 0.12 * Math.sin(check * Math.PI) : 1})` }}>
                {d + 10}
              </div>
            ))}
          </div>
        </Card>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 5. L'espace du commerçant (6 s)                                     */
/* ------------------------------------------------------------------ */

const TILES = [
  { label: "Avis Google", value: 38, prefix: "+", icon: "star" },
  { label: "Parties jouées", value: 412, prefix: "", icon: "wheel" },
  { label: "Rendez-vous pris", value: 57, prefix: "", icon: "cal" },
  { label: "Cadeaux retirés", value: 96, prefix: "", icon: "gift" },
] as const;

function TileIcon({ icon }: { icon: (typeof TILES)[number]["icon"] }) {
  if (icon === "star") return <Star size={46} />;
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
  const cw = 820;
  const ch = 190;
  const path = pts.map((v, i) => `${i ? "L" : "M"}${(i / (pts.length - 1)) * cw} ${ch - v * ch}`).join(" ");
  return (
    <AbsoluteFill>
      <Background tint="#F6D9CE" />
      <Cap top={310}>
        <Words text="Côté commerce, tout monte" at={2} step={3} size={104} width={1000} accent={["monte"]} />
      </Cap>
      <div style={{ position: "absolute", left: (W - 940) / 2, top: 560, transform: `perspective(1800px) rotateX(${(1 - card) * 25}deg) translateY(${(1 - card) * 400}px)`, opacity: Math.min(1, card * 2) }}>
        <div style={{ width: 940, background: "#fff", borderRadius: 40, boxShadow: "0 50px 90px rgba(60,30,10,0.25), 0 0 0 2px #EFE6DA", overflow: "hidden", fontFamily: sans }}>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "26px 36px", borderBottom: `2px solid ${C.line}` }}>
            <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
              <Logo size={50} spin={f * 2} />
              <span style={{ fontWeight: 700, fontSize: 30, color: C.inkSoft }}>Votre espace</span>
            </div>
            <span style={{ background: C.cream, borderRadius: 999, padding: "8px 18px", fontWeight: 700, fontSize: 22, color: C.inkSoft }}>Exemple</span>
          </div>
          <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 20, padding: "28px 32px 10px" }}>
            {TILES.map((t, i) => {
              const at = ev.tiles[i];
              const s = spring({ frame: f - at, fps: 30, config: { damping: 12, stiffness: 160 } });
              const c = interpolate(f, [at + 4, at + 4 + ev.countLen * 0.7], [0, 1], { ...clamp, easing: ease });
              const done = f >= at + 4 + ev.countLen * 0.7;
              return (
                <div key={i} style={{ background: C.cream, borderRadius: 28, padding: "22px 24px", transform: `scale(${0.6 + 0.4 * s})`, opacity: Math.min(1, s * 1.5) }}>
                  <div style={{ display: "flex", alignItems: "center", gap: 12 }}>
                    <TileIcon icon={t.icon} />
                    <span style={{ fontWeight: 800, fontSize: 30, color: C.inkSoft }}>{t.label}</span>
                  </div>
                  <div style={{ display: "flex", alignItems: "baseline", gap: 14, marginTop: 8 }}>
                    <span style={{ fontFamily: display, fontWeight: 700, fontSize: 96, color: C.ink, lineHeight: 1 }}>{t.prefix}{Math.round(t.value * c)}</span>
                    <span style={{ display: "inline-flex", alignItems: "center", justifyContent: "center", width: 46, height: 46, borderRadius: "50%", background: C.sauge, transform: `scale(${done ? 1 : 0})` }}>
                      <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="3.4" strokeLinecap="round" strokeLinejoin="round"><path d="M12 19V5M5 12l7-7 7 7" /></svg>
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
          <div style={{ padding: "18px 60px 34px" }}>
            <div style={{ fontWeight: 800, fontSize: 26, color: C.inkSoft, marginBottom: 10 }}>Avis ce mois-ci</div>
            <svg width={cw} height={ch} viewBox={`0 0 ${cw} ${ch}`} style={{ overflow: "visible" }}>
              <path d={`${path} L${cw} ${ch} L0 ${ch} Z`} fill={C.safran} opacity={0.25 * chart} />
              <path d={path} fill="none" stroke={C.tomette} strokeWidth={8} strokeLinecap="round" strokeLinejoin="round" pathLength={1} strokeDasharray={1} strokeDashoffset={1 - chart} />
            </svg>
          </div>
        </div>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 6. Le cercle Jeu, Avis, Retour et l'appel à l'action (3 s)          */
/* ------------------------------------------------------------------ */

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

function Fin() {
  const f = useCurrentFrame();
  const ring = useSpring(0, { damping: 13 });
  const btn = useSpring(ev.ctaButton, { damping: 10 });
  const url = useSpring(ev.ctaUrl, { damping: 11 });
  const lit = [0, 6, 12].filter((t) => f >= t).length;
  const pulse = f > ev.ctaButton + 15 ? 1 + Math.sin((f - ev.ctaButton - 15) / 5) * 0.03 : 1;
  return (
    <AbsoluteFill>
      <Background tint="#FCE7B8" floor={false} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 300, display: "flex", justifyContent: "center", transform: `scale(${ring})` }}>
        <Logo size={120} spin={f * 4} />
      </div>
      <Cycle cx={W / 2} cy={760} R={230} spinDeg={360 * interpolate(f, [0, 80], [0, 1], { ...clamp, easing: ease })} appear={ring} lit={lit} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", flexDirection: "column", alignItems: "center", gap: 26 }}>
        <div style={{ transform: `scale(${btn * pulse})`, opacity: Math.min(1, btn * 1.4), background: C.tomette, color: "#fff", borderRadius: 999, padding: "30px 64px", fontFamily: sans, fontWeight: 800, fontSize: 62, boxShadow: "0 30px 60px rgba(196,64,31,0.4)" }}>Essai gratuit 7 jours</div>
        <div style={{ transform: `scale(${url}) translateY(${(1 - url) * 40}px)`, opacity: Math.min(1, url * 1.4), fontFamily: display, fontWeight: 700, fontSize: 110, color: C.ink }}>rouelia.fr</div>
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
    <AbsoluteFill style={{ background: C.cream }}>
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

/* ------------------------------------------------------------------ */
/* Image fixe (même style)                                             */
/* ------------------------------------------------------------------ */

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

export { OVERLAP };
