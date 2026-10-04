import React from "react";
import { AbsoluteFill, Img, interpolate, interpolateColors, spring, staticFile, useCurrentFrame } from "remotion";
import { C, display, sans, SHOPS, type Shop } from "./theme";
import spin from "./spin.json";
import ev from "./events.json";
import {
  Horizontal, STAGE, stageX, stageY, useBleed, Awning, Background, Card, clamp, Confetti, ease, easeIn, Finger, landingRotation, Logo, Phone, QR, ShopBadge, Star, StepBadge, useProgress, useSpring, Wheel, Words,
} from "./components";

const W = 1080;

/** Zone de titre en haut de l'écran. */
function Headline({ children, top = 150 }: { children: React.ReactNode; top?: number }) {
  const wide = React.useContext(Horizontal);
  if (!wide) return <div style={{ position: "absolute", top, left: 0, right: 0, display: "flex", justifyContent: "center" }}>{children}</div>;
  // En 16:9 : titre en grand, aligné à gauche, centré verticalement dans la colonne de gauche.
  const width = 880 / STAGE.scale;
  const big = React.Children.map(children, (c) => (React.isValidElement<{ size?: number }>(c) ? React.cloneElement(c as React.ReactElement<Record<string, unknown>>, { width, align: "left", size: Math.round((c.props.size ?? 92) * 1.5) }) : c));
  return <div style={{ position: "absolute", left: stageX(90), width, top: stageY(540), transform: "translateY(-50%)", display: "flex" }}>{big}</div>;
}

/** Position de la roue de jeu (images locales de la scène « roue »). Partagée avec le son. */
export function spinRotation(f: number) {
  const p = Math.min(1, Math.max(0, (f - spin.start) / (spin.end - spin.start)));
  const eased = 1 - Math.pow(1 - p, 3.2);
  return eased * landingRotation(spin.index, spin.segments, spin.turns);
}

/* ------------------------------------------------------------------ */
/* 1. Accroche                                                         */
/* ------------------------------------------------------------------ */

export function Hook() {
  const f = useCurrentFrame();
  const drop = useSpring(2, { damping: 9, stiffness: 120 });
  const push = interpolate(f, [0, 72], [1, 1.1], clamp);
  const slam = ev.hookWords[0] + ev.hookWords[1] * 3;
  const shake = f >= slam && f < slam + 10 ? Math.sin((f - slam) * 2.6) * (10 - (f - slam)) * 1.4 : 0;
  const walk = interpolate(f, [20, 62], [0, 1], { ...clamp, easing: ease });
  const door = interpolate(f, [14, 20, 48, 56], [0, 1, 1, 0], clamp);
  return (
    <AbsoluteFill>
      <Background tint="#F6D9CE" />
      <AbsoluteFill style={{ transform: `scale(${push})`, perspective: 1600 }}>
        <div style={{ position: "absolute", left: 140, top: 820, width: 800, height: 760, transform: "rotateY(-14deg) rotateX(4deg)", transformStyle: "preserve-3d" }}>
          <div style={{ position: "absolute", inset: 0, background: "#EADFD2", borderRadius: 18, boxShadow: "0 50px 80px rgba(60,30,10,0.25)" }} />
          <div style={{ position: "absolute", left: 40, right: 40, top: 40, height: 90, background: C.ink, borderRadius: 10, display: "flex", alignItems: "center", justifyContent: "center", color: "#fff", fontFamily: display, fontSize: 56, fontWeight: 650 }}>Votre commerce</div>
          <div style={{ position: "absolute", left: -20, right: -20, top: 140 - (1 - drop) * 300, opacity: Math.min(1, drop * 2) }}>
            <Awning width={840} height={110} id="aw-hook" />
          </div>
          <div style={{ position: "absolute", left: 60, top: 290, width: 400, height: 380, background: "linear-gradient(160deg, #CFE3EA, #9FC2CF)", borderRadius: 12, boxShadow: "inset 0 0 0 10px #2c2724" }}>
            <div style={{ position: "absolute", left: 30, top: 30, width: 140, height: 60, background: "rgba(255,255,255,0.5)", borderRadius: 6, transform: "skewX(-20deg)" }} />
          </div>
          <div style={{ position: "absolute", left: 510, top: 290, width: 230, height: 470, background: "#2c2724", borderRadius: "12px 12px 0 0", overflow: "hidden" }}>
            <div style={{ position: "absolute", inset: 10, background: "#F7E8C9", opacity: door }} />
            <div style={{ position: "absolute", inset: 10, background: "#5b4a3f", transformOrigin: "left", transform: `perspective(600px) rotateY(${-door * 70}deg)`, borderRadius: 6 }} />
          </div>
          {/* client qui s'en va */}
          <div style={{ position: "absolute", left: 590 + walk * 420, top: 520, opacity: walk > 0 ? 1 - walk : 0, transform: `translateY(${Math.sin(walk * 20) * 6}px)` }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: C.ink, margin: "0 auto" }} />
            <div style={{ width: 120, height: 170, borderRadius: "60px 60px 20px 20px", background: C.ink, marginTop: 10 }} />
          </div>
        </div>
      </AbsoluteFill>
      <Headline top={230}>
        <div style={{ transform: `translate(${shake}px, ${shake * 0.4}px)` }}>
          <Words text="Du mal à fidéliser vos clients ?" at={ev.hookWords[0]} step={ev.hookWords[1]} size={128} accent={["fidéliser"]} />
        </div>
      </Headline>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 2. C'est simple                                                     */
/* ------------------------------------------------------------------ */

export function Simple() {
  const f = useCurrentFrame();
  const pop = useSpring(ev.simpleDrop - 4, { damping: 11, stiffness: 120 });
  const logo = useSpring(ev.simpleDrop + 12, { damping: 14 });
  return (
    <AbsoluteFill>
      <Background tint="#FCE1D3" />
      <div style={{ position: "absolute", left: (W - 820) / 2, top: 520, transform: `perspective(1400px) rotateY(${(1 - pop) * 100}deg) scale(${0.3 + 0.7 * pop})`, opacity: Math.min(1, pop * 3) }}>
        <Wheel size={820} colors={[C.tomette, C.cream, C.safran, C.sauge]} prizes={["Café offert", "-10 %", "Dessert", "Soin offert", "Cadeau", "Surprise", "-20 %", "Boisson"]} rotation={f * 7} hubLabel="R" />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1480, display: "flex", justifyContent: "center", transform: `scale(${logo}) translateY(${(1 - logo) * 60}px)`, opacity: logo }}>
        <Logo size={150} spin={f * 4} />
      </div>
      <Headline top={210}>
        <Words text="C'est pourtant devenu simple." at={ev.simpleWords[0]} step={ev.simpleWords[1]} size={118} accent={["simple"]} />
      </Headline>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 3. Une roue par commerce                                            */
/* ------------------------------------------------------------------ */

const CARD = { left: 70, top: 390, w: 940, h: 760 };
const SHOP_ORDER = ev.shopOrder;
const SHOP_STARTS = ev.shopStarts;
const MOSAIC = ev.mosaic;
/** Les mots de la voix off, affichés pile quand Xavier les dit. */
const SHOP_WORDS = ["Un brushing,", "un mochi,", "une séance bien-être offerte,", "une promo…"];

/** Photo cadrée sur un point focal, avec un lent zoom (Ken Burns). */
function ShopPhoto({ shop, start, local, opacity }: { shop: Shop; start: number; local: number; opacity: number }) {
  const p = shop.photo;
  const z = p.z * (1 + local * 0.0022);
  const wi = CARD.w * z;
  const hi = wi * p.aspect;
  const left = Math.min(0, Math.max(CARD.w - wi, CARD.w / 2 - p.fx * wi));
  const top = Math.min(0, Math.max(CARD.h - hi, CARD.h / 2 - p.fy * hi));
  const promo = shop.name === "La Boutique";
  const tag = useSpring(start + 6, { damping: 10, stiffness: 160 });
  return (
    <div style={{ position: "absolute", inset: 0, opacity }}>
      <div style={{ position: "absolute", left, top, width: wi, height: hi }}>
        <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%" }} />
        {promo ? (
          <div style={{ position: "absolute", left: "8%", width: "27%", top: "60%", display: "flex", justifyContent: "center", transform: `rotate(-3deg) scale(${0.4 + 0.6 * tag})`, opacity: tag }}>
            <span style={{ fontFamily: display, fontWeight: 750, fontSize: wi * 0.085, color: "#fff", lineHeight: 1, textShadow: "0 3px 10px rgba(0,0,0,0.35)" }}>-20 %</span>
          </div>
        ) : null}
      </div>
    </div>
  );
}

/** Fin de la scène : les cinq commerces en mosaïque. */
function ShopMosaic({ at }: { at: number }) {
  const f = useCurrentFrame();
  const wide = React.useContext(Horizontal);
  const spots = [
    { x: 60, y: 470 }, { x: 390, y: 430 }, { x: 720, y: 470 }, { x: 225, y: 960 }, { x: 555, y: 960 },
  ];
  return (
    <>
      {SHOPS.map((shop, k) => {
        const s = spring({ frame: f - at - k * 3, fps: 30, config: { damping: 13, stiffness: 140 } });
        const p = shop.photo;
        const sp = spots[k];
        const float = Math.sin((f + k * 11) / 18) * 8;
        return (
          <div key={k} style={{ position: "absolute", left: sp.x, top: sp.y + float, width: 300, height: 440, borderRadius: 30, overflow: "hidden", background: "#fff", boxShadow: "0 30px 60px rgba(40,20,10,0.3)", transform: `perspective(1200px) rotateY(${(1 - s) * 60}deg) rotate(${(k - 2) * 2.5}deg) scale(${0.4 + 0.6 * s})`, opacity: Math.min(1, s * 1.5) }}>
            <div style={{ height: 340, overflow: "hidden" }}>
              <Img src={staticFile(p.src)} style={{ width: "100%", height: "100%", objectFit: "cover", objectPosition: `${p.fx * 100}% ${p.fy * 100}%`, transform: `scale(${p.z})`, transformOrigin: `${p.fx * 100}% ${p.fy * 100}%` }} />
            </div>
            <div style={{ height: 100, display: "flex", alignItems: "center", gap: 12, padding: "0 16px" }}>
              <ShopBadge logo={shop.logo} monogram={shop.monogram} color={shop.hub} size={56} />
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 30, color: C.ink, lineHeight: 1.05 }}>{shop.name}</div>
            </div>
          </div>
        );
      })}
      {wide ? (
        <Headline>
          <Words text="Un client de passage devient un habitué" at={at + 8} step={4} size={84} accent={["habitué"]} />
        </Headline>
      ) : (
        <div style={{ position: "absolute", left: 0, right: 0, top: 1500, display: "flex", justifyContent: "center" }}>
          <Words text="Un client de passage devient un habitué" at={at + 8} step={4} size={84} accent={["habitué"]} />
        </div>
      )}
    </>
  );
}

export function Shops() {
  const f = useCurrentFrame();
  const mosaic = f >= MOSAIC;
  let n = 0;
  while (n + 1 < SHOP_STARTS.length && f >= SHOP_STARTS[n + 1]) n++;
  const start = SHOP_STARTS[n];
  const local = f - start;
  const shop = SHOPS[SHOP_ORDER[n]];
  const prev = n === 0 ? undefined : SHOPS[SHOP_ORDER[n - 1]];
  // Demi-tour en 3D au changement : la roue se retourne et revient avec la nouvelle identité.
  const flip = n === 0 ? 0 : interpolate(local, [0, 6], [90, 0], { ...clamp, easing: ease });
  const fade = !prev ? 1 : interpolate(local, [0, 5], [0, 1], clamp);
  const cardIn = useSpring(0, { damping: 15, stiffness: 110 });
  const out = interpolate(f, [MOSAIC - 2, MOSAIC + 6], [0, 1], { ...clamp, easing: easeIn });
  const chip = useSpring(start + 3, { damping: 12, stiffness: 150 });
  const tag = useSpring(start + 2, { damping: 13 });
  const tilt = Math.sin(f / 22) * 2.5;
  const bleed = useBleed();
  const bgPhoto = (src: string, o: number) => <Img src={staticFile(src)} style={{ position: "absolute", left: -80, top: -80, width: "calc(100% + 160px)", height: "calc(100% + 160px)", objectFit: "cover", filter: "blur(40px) saturate(1.2)", opacity: o }} />;
  return (
    <AbsoluteFill>
      {/* fond : la photo floutée, éclaircie */}
      <div style={{ position: "absolute", ...bleed, overflow: "hidden", background: C.cream }}>
        {prev && fade < 1 ? bgPhoto(prev.photo.src, 1) : null}
        {bgPhoto(shop.photo.src, fade * (1 - out))}
        <AbsoluteFill style={{ background: `rgba(251,246,238,${0.62 + out * 0.2})` }} />
      </div>
      {!mosaic ? (
        <Headline top={150}>
          <Words key={n} text={SHOP_WORDS[n]} at={start} step={2} size={SHOP_WORDS[n].length > 20 ? 84 : 110} accent={[SHOP_WORDS[n].split(" ").slice(-1)[0]]} />
        </Headline>
      ) : null}
      <div style={{ opacity: 1 - out, transform: `scale(${1 - out * 0.15})`, transformOrigin: "50% 50%", position: "absolute", inset: 0 }}>
        {/* la photo du commerce */}
        <div style={{ position: "absolute", left: CARD.left, top: CARD.top, perspective: 1800 }}>
          <div style={{ position: "relative", width: CARD.w, height: CARD.h, borderRadius: 44, overflow: "hidden", boxShadow: "0 50px 90px rgba(40,20,10,0.35)", transform: `rotateX(${(1 - cardIn) * 30 + 3}deg) rotateY(${tilt}deg) translateY(${(1 - cardIn) * 300}px) scale(${0.85 + 0.15 * cardIn})`, opacity: cardIn }}>
            {prev && fade < 1 ? <ShopPhoto shop={prev} start={SHOP_STARTS[n - 1]} local={f - SHOP_STARTS[n - 1]} opacity={1} /> : null}
            <ShopPhoto shop={shop} start={start} local={local} opacity={fade} />
            <div style={{ position: "absolute", left: 30, top: 30, display: "flex", alignItems: "center", gap: 14, padding: "14px 28px 14px 16px", borderRadius: 999, background: "#fff", boxShadow: "0 16px 36px rgba(0,0,0,0.22)", transform: `scale(${0.5 + 0.5 * chip}) translateX(${(1 - chip) * -60}px)`, transformOrigin: "left center", opacity: chip }}>
              <div style={{ width: 44, height: 44, borderRadius: "50%", background: C.tomette, display: "flex", alignItems: "center", justifyContent: "center" }}>
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="8" width="18" height="4" rx="1" /><path d="M12 8v13M19 12v7a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2v-7M7.5 8a2.5 2.5 0 0 1 0-5C11 3 12 8 12 8s1-5 4.5-5a2.5 2.5 0 0 1 0 5" /></svg>
              </div>
              <span style={{ fontFamily: sans, fontWeight: 800, fontSize: 40, color: C.ink }}>{shop.featured}</span>
            </div>
          </div>
        </div>
        <div style={{ position: "absolute", left: (W - 560) / 2, top: 1040, transform: `perspective(1500px) rotateY(${flip}deg)`, filter: "drop-shadow(0 30px 40px rgba(40,20,10,0.35))" }}>
          <Wheel size={560} colors={shop.colors} prizes={shop.prizes} rotation={f * 2.4 + n * 30} rim={shop.rim} hub={shop.hub} hubLabel={shop.monogram} logo={shop.logo} />
        </div>
        <div style={{ position: "absolute", left: 0, right: 0, top: 1660, display: "flex", justifyContent: "center" }}>
          <div key={n} style={{ display: "flex", alignItems: "center", gap: 22, padding: "14px 40px 14px 14px", borderRadius: 999, background: "#fff", boxShadow: "0 24px 50px rgba(60,30,10,0.18)", transform: `translateY(${(1 - tag) * 80}px) scale(${0.7 + 0.3 * tag})`, opacity: tag }}>
            <ShopBadge logo={shop.logo} monogram={shop.monogram} color={shop.hub} size={88} />
            <div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 52, color: C.ink, lineHeight: 1 }}>{shop.name}</div>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 28, color: C.inkSoft, marginTop: 6, textTransform: "uppercase", letterSpacing: "0.12em" }}>{shop.short}</div>
            </div>
          </div>
        </div>
      </div>
      {f >= MOSAIC - 2 ? <ShopMosaic at={MOSAIC} /> : null}
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 4. Le flyer 3D et le scan                                           */
/* ------------------------------------------------------------------ */

function FlyerCard() {
  const shop = SHOPS[0];
  return (
    <div style={{ width: 700, height: 990, background: "#fff", borderRadius: 20, overflow: "hidden", boxShadow: "0 70px 100px rgba(60,30,10,0.35)", display: "flex", flexDirection: "column", alignItems: "center", fontFamily: sans, color: C.ink }}>
      <Awning width={700} height={70} stripe={C.tomette} base="#fff" id="aw-flyer" />
      <div style={{ display: "flex", alignItems: "center", gap: 16, marginTop: 26 }}>
        <ShopBadge logo={shop.logo} monogram="AC" color={C.tomette} size={74} />
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40 }}>ALIA coiffure</div>
      </div>
      <div style={{ fontFamily: display, fontWeight: 700, fontSize: 76, marginTop: 22, lineHeight: 1 }}>Tentez votre chance</div>
      <div style={{ marginTop: 18, background: C.tomette, color: "#fff", borderRadius: 999, padding: "8px 24px", fontWeight: 800, fontSize: 20, letterSpacing: "0.06em", textTransform: "uppercase" }}>100 % gagnant : chaque case est un cadeau</div>
      <div style={{ display: "flex", alignItems: "center", gap: 30, marginTop: 34 }}>
        <div style={{ display: "flex", flexDirection: "column", alignItems: "center" }}>
          <div style={{ background: C.ink, color: "#fff", fontWeight: 800, fontSize: 18, padding: "6px 18px", borderRadius: "10px 10px 0 0", letterSpacing: "0.08em" }}>SCANNEZ-MOI</div>
          <div style={{ border: `5px solid ${C.ink}`, borderRadius: 18, padding: 8, background: "#fff" }}>
            <QR text="https://rouelia.fr/j/alia-coiffure" size={250} />
          </div>
        </div>
        <Wheel size={230} colors={shop.colors} prizes={shop.prizes} rotation={0} rim={shop.rim} hub={shop.hub} logo={shop.logo} />
      </div>
      <div style={{ display: "flex", gap: 30, marginTop: 40 }}>
        {["Scannez", "Tournez la roue", "Revenez"].map((t, k) => (
          <div key={k} style={{ display: "flex", flexDirection: "column", alignItems: "center", width: 170, gap: 8 }}>
            <div style={{ width: 46, height: 46, borderRadius: "50%", background: C.tomette, color: "#fff", display: "flex", alignItems: "center", justifyContent: "center", fontWeight: 800, fontSize: 24 }}>{k + 1}</div>
            <div style={{ fontWeight: 700, fontSize: 22, textAlign: "center" }}>{t}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function Flyer() {
  const f = useCurrentFrame();
  const enter = useProgress(0, 26);
  const ry = interpolate(enter, [0, 1], [-70, -16]) + Math.sin(f / 14) * 2;
  const rx = interpolate(enter, [0, 1], [35, 14]) + Math.cos(f / 16) * 1.5;
  const phoneIn = useProgress(ev.flyerPhone, ev.flyerPhone + 20);
  const laser = interpolate(f, ev.scanLaser, [0, 1], clamp);
  const flash = interpolate(f, [ev.scanFlash, ev.scanFlash + 4, ev.scanFlash + 16], [0, 1, 0], clamp);
  const scanned = f >= ev.scanFlash + 2;
  return (
    <AbsoluteFill>
      <Background tint="#F6D9CE" />
      <Headline top={140}>
        <Words text="Il scanne le QR code du flyer" at={2} step={3} size={92} accent={["flyer"]} />
      </Headline>
      <div style={{ position: "absolute", left: 60, top: 420, perspective: 1800 }}>
        <div style={{ transform: `rotateX(${rx}deg) rotateY(${ry}deg) rotateZ(${-4 + enter * 2}deg) translateY(${(1 - enter) * 400}px)`, transformStyle: "preserve-3d" }}>
          <FlyerCard />
        </div>
      </div>
      {/* téléphone qui vient scanner */}
      <div style={{ position: "absolute", left: 520 + (1 - phoneIn) * 600, top: 880 + (1 - phoneIn) * 400, transform: `rotate(${-8 + phoneIn * 4}deg)` }}>
        <Phone width={420} screen={scanned ? C.cream : "#111"}>
          {!scanned ? (
            <div style={{ position: "absolute", inset: 0, background: "radial-gradient(circle at 50% 45%, #3a3632, #0d0c0b)" }}>
              <div style={{ position: "absolute", left: 70, top: 260, width: 250, height: 250, border: "6px solid #fff", borderRadius: 24, opacity: 0.9 }} />
              <div style={{ position: "absolute", left: 80, top: 270, transform: "scale(0.92)", transformOrigin: "0 0", opacity: 0.85 }}>
                <QR text="https://rouelia.fr/j/alia-coiffure" size={230} />
              </div>
              <div style={{ position: "absolute", left: 60, width: 270, top: 260 + laser * 250, height: 6, background: C.tomette, boxShadow: `0 0 30px 10px ${C.tomette}`, opacity: laser > 0 && laser < 1 ? 1 : 0 }} />
            </div>
          ) : (
            <div style={{ position: "absolute", inset: 0, display: "flex", flexDirection: "column", alignItems: "center" }}>
              <Awning width={400} height={44} id="aw-phone1" />
              <div style={{ marginTop: 50, fontFamily: display, fontWeight: 700, fontSize: 40 }}>ALIA coiffure</div>
              <div style={{ marginTop: 30 }}>
                <Wheel size={320} colors={SHOPS[0].colors} prizes={SHOPS[0].prizes} rotation={f * 3} rim={SHOPS[0].rim} hub={SHOPS[0].hub} logo={SHOPS[0].logo} />
              </div>
            </div>
          )}
          <div style={{ position: "absolute", inset: 0, background: "#fff", opacity: flash }} />
        </Phone>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1780, display: "flex", justifyContent: "flex-start", paddingLeft: 70 }}>
        <StepBadge n={1} label="Il scanne" at={ev.flyerBadge} />
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 5. Invitation à l'avis                                              */
/* ------------------------------------------------------------------ */

export const STAR_TIMES = ev.stars;

export function Avis() {
  const f = useCurrentFrame();
  const phone = useSpring(0, { damping: 15 });
  const fly = interpolate(f, [ev.reviewFly, ev.reviewFly + 30], [0, 1], { ...clamp, easing: ease });
  const counter = f < ev.reviewCount ? 128 : 129;
  const bump = useSpring(ev.reviewCount, { damping: 8, stiffness: 220 });
  return (
    <AbsoluteFill>
      <Background tint="#FCE7B8" />
      <Headline top={140}>
        <Words text="Invité à laisser un avis Google" at={0} step={3} size={96} accent={["avis"]} />
      </Headline>
      <div style={{ position: "absolute", left: (W - 600) / 2, top: 440, transform: `translateY(${(1 - phone) * 700}px) rotate(${(1 - phone) * 6}deg)` }}>
        <Phone width={600}>
          <Awning width={560} height={56} id="aw-avis" />
          <div style={{ padding: "40px 36px", fontFamily: sans }}>
            <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
              <ShopBadge logo={SHOPS[0].logo} monogram="AC" color={C.tomette} size={70} />
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 38 }}>ALIA coiffure</div>
            </div>
            <div style={{ marginTop: 50, background: "#fff", borderRadius: 30, padding: "36px 30px", boxShadow: "0 20px 40px rgba(0,0,0,0.12)", position: "relative" }}>
              <div style={{ position: "absolute", right: 22, top: 18, fontSize: 40, color: C.inkSoft, fontWeight: 300 }}>×</div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 46, lineHeight: 1.08, color: C.ink }}>Un petit avis sur Google ?</div>
              <div style={{ fontSize: 26, color: C.inkSoft, marginTop: 14, lineHeight: 1.35 }}>Votre avis aide le salon. C'est facultatif, vous jouez de toute façon.</div>
              <div style={{ display: "flex", gap: 10, marginTop: 30, justifyContent: "center" }}>
                {STAR_TIMES.map((t, k) => {
                  const s = interpolate(f, [t, t + 6], [0, 1], { ...clamp, easing: ease });
                  const pop = 1 + Math.sin(Math.min(1, Math.max(0, (f - t) / 8)) * Math.PI) * 0.35;
                  return <div key={k} style={{ transform: `scale(${pop})` }}><Star size={84} fill={s} /></div>;
                })}
              </div>
              <div style={{ marginTop: 34, background: C.ink, color: "#fff", borderRadius: 999, padding: "20px 0", textAlign: "center", fontWeight: 800, fontSize: 30 }}>Laisser mon avis</div>
              <div style={{ marginTop: 18, textAlign: "center", fontWeight: 700, fontSize: 26, color: C.inkSoft }}>Passer et jouer</div>
            </div>
          </div>
        </Phone>
      </div>
      {/* l'avis s'envole vers la fiche Google */}
      {f >= ev.reviewFly - 4 ? (
        <div style={{ position: "absolute", left: 220 + fly * 300, top: 1150 - fly * 760, transform: `scale(${1 - fly * 0.45}) rotate(${-6 + fly * 10}deg)`, opacity: 1 - Math.max(0, fly - 0.85) * 6 }}>
          <Card style={{ padding: "24px 30px", width: 560 }}>
            <div style={{ display: "flex", gap: 6 }}>{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={40} />)}</div>
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 30, marginTop: 10 }}>« Super accueil, je recommande ! »</div>
          </Card>
        </div>
      ) : null}
      <div style={{ position: "absolute", right: 40, top: 420, transform: `scale(${f >= ev.reviewCount ? 1 + (1 - bump) * 0.25 : 1})`, opacity: interpolate(f, [ev.reviewFly - 10, ev.reviewFly], [0, 1], clamp) }}>
        <Card style={{ padding: "18px 28px", display: "flex", alignItems: "center", gap: 14 }}>
          <span style={{ fontFamily: sans, fontWeight: 800, fontSize: 32 }}>Google</span>
          <Star size={36} />
          <span style={{ fontFamily: sans, fontWeight: 800, fontSize: 32 }}>{counter} avis</span>
        </Card>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 6. La roue tourne                                                   */
/* ------------------------------------------------------------------ */

export function Roue() {
  const f = useCurrentFrame();
  const shop = SHOPS[0];
  const rot = spinRotation(f);
  const vel = Math.abs(spinRotation(f + 1) - rot);
  const won = f >= spin.end;
  const banner = useSpring(spin.end + 2, { damping: 10 });
  const zoom = interpolate(f, [0, spin.start, spin.end, spin.end + 10], [1, 1.04, 1.12, 1.06], clamp);
  return (
    <AbsoluteFill>
      <Background tint="#F6D9CE" />
      <Headline top={140}>
        {f < spin.end - 6 ? <Words text="Il tourne la roue…" at={0} step={4} size={104} /> : <Words key="g" text="100 % gagnant !" at={spin.end - 6} step={3} size={140} accent={["gagnant"]} />}
      </Headline>
      <div style={{ position: "absolute", left: (W - 620) / 2, top: 420, transform: `scale(${zoom})`, transformOrigin: "50% 40%" }}>
        <Phone width={620}>
          <Awning width={580} height={56} id="aw-roue" />
          <div style={{ display: "flex", flexDirection: "column", alignItems: "center", paddingTop: 40 }}>
            <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40 }}>ALIA coiffure</div>
            <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 24, color: C.inkSoft, marginTop: 8 }}>Touchez la roue pour jouer</div>
            <div style={{ marginTop: 50 }}>
              <Wheel size={540} colors={shop.colors} prizes={shop.prizes} rotation={rot} rim={shop.rim} hub={shop.hub} logo={shop.logo} motionBlur={Math.min(4, vel / 8)} glow={won ? { index: spin.index, amount: 0.5 + 0.5 * Math.sin((f - spin.end) / 3) } : undefined} />
            </div>
            {won ? (
              <div style={{ marginTop: 60, transform: `scale(${banner})`, background: C.sauge, color: "#fff", borderRadius: 999, padding: "18px 40px", fontFamily: sans, fontWeight: 800, fontSize: 36 }}>Bravo, vous gagnez : Brushing offert</div>
            ) : null}
          </div>
        </Phone>
      </div>
      <Finger x={W / 2} y={1050} tapAt={spin.start - 2} />
      <Confetti at={spin.end} x={W / 2} y={1000} count={120} />
      <div style={{ position: "absolute", left: 0, right: 0, top: 1790, display: "flex", justifyContent: "center" }}>
        <StepBadge n={2} label="Il gagne" at={spin.end + 6} />
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 7. Le cadeau et le rendez-vous                                      */
/* ------------------------------------------------------------------ */

export const RDV_TAP = ev.rdvTap;

export function Cadeau() {
  const f = useCurrentFrame();
  const flip = interpolate(f, [4, 26], [-180, 0], { ...clamp, easing: ease });
  const btn = useSpring(ev.rdvButton, { damping: 13 });
  const cal = useSpring(RDV_TAP + 6, { damping: 12 });
  const check = interpolate(f, [ev.rdvCheck, ev.rdvCheck + 12], [0, 1], { ...clamp, easing: ease });
  return (
    <AbsoluteFill>
      <Background tint="#E3EEE8" />
      <Headline top={140}>
        <Words text="Son cadeau l'attend à sa prochaine visite" at={0} step={3} size={92} accent={["prochaine", "visite"]} />
      </Headline>
      <div style={{ position: "absolute", left: (W - 820) / 2, top: 470, perspective: 1600 }}>
        <div style={{ transform: `rotateY(${flip}deg) rotateX(8deg)`, backfaceVisibility: "hidden" }}>
          <div style={{ width: 820, borderRadius: 40, background: "#fff", boxShadow: "0 50px 90px rgba(30,60,40,0.25)", overflow: "hidden", fontFamily: sans }}>
            <div style={{ background: C.sauge, color: "#fff", padding: "30px 44px", fontWeight: 800, fontSize: 34, letterSpacing: "0.1em", textTransform: "uppercase" }}>Votre cadeau</div>
            <div style={{ padding: "36px 44px" }}>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 76, lineHeight: 1 }}>Brushing offert</div>
              <div style={{ marginTop: 26, border: `4px dashed ${C.line}`, borderRadius: 24, padding: "20px 26px" }}>
                <div style={{ fontSize: 24, fontWeight: 700, color: C.inkSoft, letterSpacing: "0.14em" }}>VOTRE CODE</div>
                <div style={{ fontFamily: "Courier New, monospace", fontWeight: 800, fontSize: 72, letterSpacing: "0.08em" }}>ALI-7K4M2</div>
              </div>
              <div style={{ marginTop: 20, fontSize: 30, color: C.inkSoft, fontWeight: 600 }}>À montrer en caisse, dès votre prochaine visite.</div>
            </div>
          </div>
        </div>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1150, display: "flex", justifyContent: "center", transform: `scale(${btn * (f >= RDV_TAP && f < RDV_TAP + 6 ? 0.94 : 1)})`, opacity: btn }}>
        <div style={{ background: C.tomette, color: "#fff", borderRadius: 999, padding: "30px 56px", fontFamily: sans, fontWeight: 800, fontSize: 42, boxShadow: "0 24px 44px rgba(196,64,31,0.35)" }}>Réserver mon prochain rendez-vous</div>
      </div>
      <Finger x={W / 2 + 120} y={1190} tapAt={RDV_TAP} />
      <div style={{ position: "absolute", left: (W - 560) / 2, top: 1330, transform: `scale(${cal}) translateY(${(1 - cal) * 120}px)`, opacity: Math.min(1, cal * 1.5) }}>
        <Card style={{ width: 560, padding: 30 }}>
          <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 30, color: C.inkSoft, textTransform: "uppercase", letterSpacing: "0.1em" }}>Novembre</div>
          <div style={{ display: "grid", gridTemplateColumns: "repeat(7, 1fr)", gap: 8, marginTop: 14 }}>
            {Array.from({ length: 14 }, (_, k) => (
              <div key={k} style={{ height: 56, borderRadius: 14, background: k === 9 ? C.tomette : C.cream, color: k === 9 ? "#fff" : C.ink, display: "flex", alignItems: "center", justifyContent: "center", fontFamily: sans, fontWeight: 700, fontSize: 26, position: "relative" }}>
                {k + 3}
                {k === 9 ? (
                  <svg viewBox="0 0 40 40" width="74" height="74" style={{ position: "absolute", left: -9, top: -9 }}>
                    <path d="M8 21 L17 30 L33 10" fill="none" stroke={C.sauge} strokeWidth="6" strokeLinecap="round" strokeLinejoin="round" strokeDasharray="50" strokeDashoffset={50 * (1 - check)} />
                  </svg>
                ) : null}
              </div>
            ))}
          </div>
        </Card>
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: 1750, display: "flex", justifyContent: "center" }}>
        <StepBadge n={3} label="Il revient" at={RDV_TAP + 20} />
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 8. Réglages du commerçant                                           */
/* ------------------------------------------------------------------ */

export const SLIDER = ev.slider;

export function Reglages() {
  const f = useCurrentFrame();
  const card = useSpring(0, { damping: 15 });
  const p = interpolate(f, [SLIDER[0], SLIDER[1]], [0, 1], { ...clamp, easing: ease });
  const big = 5 - 3 * p;
  const cost = 0.74 - 0.22 * p;
  const shop = SHOPS[0];
  const weights = [big, 28, 22, 20, 15, 15 - (5 - big) * 0];
  const rows = [
    { name: "Brushing offert", pct: `${big.toFixed(0)} %`, big: true },
    { name: "Soin profond", pct: "28 %" },
    { name: "-10 % coupe", pct: "22 %" },
    { name: "Masque offert", pct: "20 %" },
  ];
  return (
    <AbsoluteFill>
      <Background tint="#EFE3F1" />
      <Headline top={140}>
        <Words text="Vous réglez les chances, le coût et vos gros cadeaux" at={0} step={4} size={84} accent={["chances,", "coût", "gros", "cadeaux"]} />
      </Headline>
      <div style={{ position: "absolute", left: 70, top: 470, perspective: 1800 }}>
        <div style={{ transform: `rotateX(${14 - card * 4}deg) rotateY(${-14 + card * 6}deg) translateY(${(1 - card) * 300}px)`, opacity: card }}>
          <Card style={{ width: 940, padding: 44 }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 52 }}>Vos lots</div>
              <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 26, color: C.inkSoft }}>Espace ALIA coiffure</div>
            </div>
            {rows.map((r, k) => (
              <div key={k} style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginTop: 22, padding: "20px 26px", borderRadius: 22, background: r.big ? "#FFF4E0" : C.cream, boxShadow: r.big ? `0 0 0 4px ${C.safran}` : "none", fontFamily: sans }}>
                <div style={{ fontWeight: 700, fontSize: 34 }}>{r.name}{r.big ? <span style={{ marginLeft: 14, fontSize: 22, background: C.safran, borderRadius: 999, padding: "4px 14px", verticalAlign: "middle" }}>GROS CADEAU</span> : null}</div>
                <div style={{ fontFamily: display, fontWeight: 700, fontSize: 40 }}>{r.pct}</div>
              </div>
            ))}
            <div style={{ marginTop: 34, fontFamily: sans, fontWeight: 700, fontSize: 28, color: C.inkSoft }}>Chance du gros cadeau</div>
            <div style={{ position: "relative", height: 60, marginTop: 10 }}>
              <div style={{ position: "absolute", top: 24, left: 0, right: 0, height: 12, borderRadius: 999, background: C.line }} />
              <div style={{ position: "absolute", top: 24, left: 0, width: `${(big / 10) * 100}%`, height: 12, borderRadius: 999, background: C.tomette }} />
              <div style={{ position: "absolute", top: 4, left: `calc(${(big / 10) * 100}% - 26px)`, width: 52, height: 52, borderRadius: "50%", background: "#fff", boxShadow: `0 0 0 6px ${C.tomette}, 0 10px 20px rgba(0,0,0,0.2)` }} />
            </div>
            <div style={{ marginTop: 26, display: "flex", justifyContent: "space-between", alignItems: "baseline", fontFamily: sans }}>
              <div style={{ fontWeight: 700, fontSize: 30, color: C.inkSoft }}>Coût moyen par client</div>
              <div style={{ fontFamily: display, fontWeight: 700, fontSize: 64, color: C.sauge }}>{cost.toFixed(2).replace(".", ",")} €</div>
            </div>
          </Card>
        </div>
      </div>
      <div style={{ position: "absolute", left: (W - 470) / 2, top: 1330 }}>
        <Wheel size={470} colors={shop.colors} prizes={shop.prizes} weights={weights} rotation={f * 1.5} rim={shop.rim} hub={shop.hub} logo={shop.logo} pointer={false} />
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 9. L'IA répond aux avis                                             */
/* ------------------------------------------------------------------ */

export const IA_CLICK = ev.iaClick;
const REPLY = "Merci beaucoup Julie ! Sarah sera ravie de lire votre message. À très bientôt chez ALIA coiffure.";
export const IA_TYPE = ev.iaType;
const TYPE_RATE = REPLY.length / (IA_TYPE[1] - IA_TYPE[0]);

export function IA() {
  const f = useCurrentFrame();
  const card = useSpring(0, { damping: 15 });
  const chars = Math.max(0, Math.min(REPLY.length, Math.floor((f - IA_TYPE[0]) * TYPE_RATE)));
  const cursorX = interpolate(f, ev.iaCursor, [980, 560], { ...clamp, easing: ease });
  const cursorY = interpolate(f, ev.iaCursor, [1700, 1090], { ...clamp, easing: ease });
  const pressed = f >= IA_CLICK && f < IA_CLICK + 5;
  const reply = useSpring(IA_CLICK + 4, { damping: 14 });
  return (
    <AbsoluteFill>
      <Background tint="#E4E9F6" />
      <Headline top={140}>
        <Words text="L'IA répond à vos avis en un clic" at={0} step={3} size={100} accent={["IA"]} italicAccent={false} />
      </Headline>
      <div style={{ position: "absolute", left: 70, top: 480, transform: `translateY(${(1 - card) * 300}px)`, opacity: card }}>
        <Card style={{ width: 940, padding: 40 }}>
          <div style={{ display: "flex", alignItems: "center", gap: 14 }}>
            <div style={{ width: 70, height: 70, borderRadius: "50%", background: "#E7B4A6", display: "flex", alignItems: "center", justifyContent: "center", fontFamily: display, fontWeight: 700, fontSize: 34 }}>J</div>
            <div>
              <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 34 }}>Julie</div>
              <div style={{ display: "flex", gap: 4 }}>{[0, 1, 2, 3, 4].map((k) => <Star key={k} size={34} />)}</div>
            </div>
          </div>
          <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 34, marginTop: 20, lineHeight: 1.35 }}>« Super coupe, Sarah a pris le temps de m'écouter. Je recommande ! »</div>
          <div style={{ marginTop: 30, display: "inline-flex", alignItems: "center", gap: 14, background: C.tomette, color: "#fff", borderRadius: 999, padding: "22px 40px", fontFamily: sans, fontWeight: 800, fontSize: 34, transform: `scale(${pressed ? 0.94 : 1})` }}>
            <svg width="36" height="36" viewBox="0 0 24 24"><path d="M12 2l2.2 6.6L21 11l-6.8 2.4L12 20l-2.2-6.6L3 11l6.8-2.4z" fill="#fff" /></svg>
            Proposer deux réponses
          </div>
        </Card>
      </div>
      {f >= IA_CLICK + 4 ? (
        <div style={{ position: "absolute", left: 70, top: 1130, transform: `translateY(${(1 - reply) * 120}px)`, opacity: reply }}>
          <Card style={{ width: 940, padding: 40, boxShadow: `0 30px 60px rgba(60,30,10,0.16), 0 0 0 4px ${C.tomette}` }}>
            <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 24, letterSpacing: "0.12em", color: C.tomette }}>RÉPONSE RÉDIGÉE PAR L'IA</div>
            <div style={{ fontFamily: sans, fontWeight: 500, fontSize: 36, marginTop: 16, lineHeight: 1.4, minHeight: 200 }}>
              {REPLY.slice(0, chars)}
              <span style={{ display: "inline-block", width: 4, height: 40, background: C.ink, marginLeft: 4, verticalAlign: "middle", opacity: Math.floor(f / 8) % 2 ? 1 : 0 }} />
            </div>
          </Card>
        </div>
      ) : null}
      {/* pointeur de souris */}
      <div style={{ position: "absolute", left: cursorX, top: cursorY, opacity: f < IA_CLICK + 14 ? 1 : interpolate(f, [IA_CLICK + 14, IA_CLICK + 22], [1, 0], clamp), transform: `scale(${pressed ? 0.85 : 1})` }}>
        <svg width="70" height="86" viewBox="0 0 24 30"><path d="M2 2 L2 24 L8 18.5 L12 28 L16 26.5 L12 17 L20 17 Z" fill="#fff" stroke={C.ink} strokeWidth="1.8" strokeLinejoin="round" /></svg>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 10. Le cercle vertueux                                              */
/* ------------------------------------------------------------------ */

export const LOOP_STEPS = ev.loopSteps;

function LoopIcon({ k, size }: { k: number; size: number }) {
  const s = { width: size, height: size };
  if (k === 0) return <Star size={size} />;
  if (k === 1)
    return (
      <svg {...s} viewBox="0 0 24 24"><circle cx="10" cy="10" r="6.5" fill="none" stroke={C.ink} strokeWidth="2.6" /><path d="M15 15 L21 21" stroke={C.ink} strokeWidth="3" strokeLinecap="round" /></svg>
    );
  if (k === 2)
    return (
      <svg {...s} viewBox="0 0 24 24"><circle cx="9" cy="8" r="4" fill={C.ink} /><path d="M2 21c0-4 3-7 7-7s7 3 7 7z" fill={C.ink} /><path d="M19 7v8M15 11h8" stroke={C.tomette} strokeWidth="2.6" strokeLinecap="round" /></svg>
    );
  return (
    <svg {...s} viewBox="0 0 24 24"><path d="M4 12a8 8 0 0 1 14-5.3M20 12a8 8 0 0 1-14 5.3" fill="none" stroke={C.ink} strokeWidth="2.6" strokeLinecap="round" /><path d="M18 2v5h-5M6 22v-5h5" fill="none" stroke={C.tomette} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round" /></svg>
  );
}

export function Boucle() {
  const f = useCurrentFrame();
  const labels = ["Plus d'avis", "Plus visible sur Google", "De nouveaux clients", "Qui reviennent"];
  const ring = useSpring(0, { damping: 16 });
  const card = useSpring(ev.loopCard, { damping: 12 });
  const R = 340;
  const cx = W / 2;
  const cy = 1010;
  const lit = LOOP_STEPS.filter((t) => f >= t).length;
  return (
    <AbsoluteFill>
      <Background tint="#FCE7B8" />
      {/* anneau en perspective */}
      <div style={{ position: "absolute", left: cx - R - 20, top: cy - R - 20, width: (R + 20) * 2, height: (R + 20) * 2, transform: `perspective(1400px) rotateX(35deg) scale(${ring})` }}>
        <svg width="100%" height="100%" viewBox="0 0 700 700" style={{ overflow: "visible" }}>
          <circle cx="350" cy="350" r={R} fill="none" stroke={C.line} strokeWidth="26" />
          <circle cx="350" cy="350" r={R} fill="none" stroke={C.tomette} strokeWidth="26" strokeLinecap="round" strokeDasharray={2 * Math.PI * R} strokeDashoffset={2 * Math.PI * R * (1 - Math.min(1, Math.max(0, f - LOOP_STEPS[0]) / (LOOP_STEPS[3] - LOOP_STEPS[0])))} transform="rotate(-90 350 350)" />
        </svg>
      </div>
      {labels.map((l, k) => {
        const a = -Math.PI / 2 + (k * Math.PI) / 2;
        const x = cx + Math.cos(a) * R;
        const y = cy + Math.sin(a) * R * 0.8 + 40;
        const s = spring({ frame: f - LOOP_STEPS[k], fps: 30, config: { damping: 11, stiffness: 180 } });
        const on = k < lit;
        return (
          <div key={k} style={{ position: "absolute", left: x, top: y, transform: `translate(${k === 1 ? -72 : k === 3 ? -28 : -50}%, -100%) scale(${0.3 + 0.7 * s})`, opacity: s, display: "flex", flexDirection: "column", alignItems: "center", gap: 12 }}>
            <div style={{ width: 130, height: 130, borderRadius: "50%", background: on ? "#fff" : C.cream, boxShadow: on ? `0 0 0 8px ${C.tomette}, 0 20px 40px rgba(0,0,0,0.18)` : "none", display: "flex", alignItems: "center", justifyContent: "center" }}>
              <LoopIcon k={k} size={70} />
            </div>
            <div style={{ fontFamily: sans, fontWeight: 800, fontSize: 40, color: C.ink, background: "#fff", padding: "8px 20px", borderRadius: 999, whiteSpace: "nowrap", boxShadow: "0 10px 24px rgba(0,0,0,0.1)" }}>{l}</div>
          </div>
        );
      })}
      <Headline top={160}>
        <Words text="Plus d'avis, plus de visibilité, plus de clients" at={2} step={13} size={90} accent={["avis,", "visibilité,", "clients"]} />
      </Headline>
      <div style={{ position: "absolute", left: (W - 900) / 2, top: 1500, transform: `translateY(${(1 - card) * 200}px) scale(${0.8 + 0.2 * card})`, opacity: card }}>
        <Card style={{ width: 900, padding: "36px 44px", textAlign: "center" }}>
          <div style={{ fontFamily: display, fontWeight: 700, fontSize: 68, lineHeight: 1.05 }}>Rentable dès <span style={{ color: C.tomette }}>3 retours</span> par mois*</div>
          <div style={{ fontFamily: sans, fontWeight: 600, fontSize: 26, color: C.inkSoft, marginTop: 14 }}>*Exemple : salon de coiffure, panier moyen 35 €, pack Croissance</div>
        </Card>
      </div>
    </AbsoluteFill>
  );
}

/* ------------------------------------------------------------------ */
/* 11. Appel à l'action                                                */
/* ------------------------------------------------------------------ */

export function Cta() {
  const f = useCurrentFrame();
  const wide = React.useContext(Horizontal);
  const logo = useSpring(2, { damping: 11, stiffness: 120 });
  const btn = useSpring(ev.ctaButton, { damping: 10 });
  const pulse = f > ev.ctaButton + 17 ? 1 + Math.sin((f - ev.ctaButton - 17) / 6) * 0.03 : 1;
  const aw = useSpring(0, { damping: 9 });
  return (
    <AbsoluteFill>
      <Background tint="#F6D9CE" floor={false} />
      <div style={{ position: "absolute", left: wide ? stageX(-40) : -40, top: (wide ? stageY(-30) : -20) - (1 - aw) * 200 }}>
        <Awning width={wide ? (2000 / STAGE.scale) : 1160} height={150} id="aw-cta" />
      </div>
      <div style={{ position: "absolute", left: (W - 1300) / 2, top: 1100, opacity: 0.12 }}>
        <Wheel size={1300} colors={[C.tomette, C.cream, C.safran, C.sauge]} prizes={["", "", "", "", "", "", "", ""]} rotation={f * 1.2} pointer={false} />
      </div>
      <div style={{ position: "absolute", left: wide ? stageX(90) : 0, right: wide ? undefined : 0, top: wide ? stageY(170) : 360, display: "flex", justifyContent: wide ? "flex-start" : "center", transform: `scale(${logo})`, transformOrigin: wide ? "left center" : "center" }}>
        <Logo size={wide ? 250 : 190} spin={f * 3} />
      </div>
      <div style={{ position: "absolute", top: wide ? stageY(420) : 610, left: wide ? stageX(90) : 0, right: wide ? undefined : 0, display: "flex", flexDirection: "column", alignItems: wide ? "flex-start" : "center", gap: 18 }}>
        <Words text="Vos clients gagnent un cadeau…" at={ev.ctaLine1[0]} step={ev.ctaLine1[1]} size={wide ? 124 : 84} width={wide ? 880 / STAGE.scale : 1000} align={wide ? "left" : "center"} accent={["cadeau…"]} />
        <Words text="vous, leur prochaine visite." at={ev.ctaLine2[0]} step={ev.ctaLine2[1]} size={wide ? 124 : 84} width={wide ? 880 / STAGE.scale : 1000} align={wide ? "left" : "center"} accent={["prochaine", "visite."]} />
      </div>
      <div style={{ position: "absolute", left: 0, right: 0, top: wide ? 760 : 1060, display: "flex", flexDirection: "column", alignItems: "center", gap: 30, transform: `scale(${btn * pulse * (wide ? 1.25 : 1)})`, opacity: Math.min(1, btn * 1.4) }}>
        <div style={{ background: C.tomette, color: "#fff", borderRadius: 999, padding: "34px 70px", fontFamily: sans, fontWeight: 800, fontSize: 60, boxShadow: "0 30px 60px rgba(196,64,31,0.4)" }}>Essai gratuit 14 jours</div>
        <div style={{ fontFamily: display, fontWeight: 700, fontSize: 96, color: C.ink }}>rouelia.fr</div>
        <div style={{ display: "flex", alignItems: "center", gap: 14, background: "#fff", borderRadius: 999, padding: "14px 34px", boxShadow: "0 16px 34px rgba(60,30,10,0.14)", fontFamily: sans, fontWeight: 800, fontSize: 42, color: C.sauge }}>
          <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke={C.sauge} strokeWidth="2.6" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="13" r="8" /><path d="M12 9v4l2.5 2M9 2h6" /></svg>
          Prêt en 5 minutes
        </div>
        <div style={{ fontFamily: sans, fontWeight: 700, fontSize: 38, color: C.inkSoft }}>Sans carte bancaire · Sans engagement</div>
      </div>
    </AbsoluteFill>
  );
}

export const SCENES = { hook: Hook, simple: Simple, shops: Shops, flyer: Flyer, avis: Avis, roue: Roue, cadeau: Cadeau, reglages: Reglages, ia: IA, boucle: Boucle, cta: Cta } as const;
export { Img, interpolateColors, easeIn };
