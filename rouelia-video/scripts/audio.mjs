/**
 * Musique et bruitages de la vidéo Rouelia, synthétisés en code (aucun échantillon externe).
 * Lit le minutage partagé avec l'image (src/timing.json, src/events.json, src/spin.json)
 * et écrit public/audio/music.wav, public/audio/sfx.wav et public/audio/mix.wav.
 * Usage : node scripts/audio.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const timing = JSON.parse(readFileSync(root + "src/timing.json", "utf8"));
const ev = JSON.parse(readFileSync(root + "src/events.json", "utf8"));
const spin = JSON.parse(readFileSync(root + "src/spin.json", "utf8"));

const SR = 48000;
const FPS = timing.fps;
const DUR = timing.duration / FPS + 1.5;
const N = Math.ceil(DUR * SR);
const fr = (f) => f / FPS; // image -> secondes
const S = timing.scenes;
const at = (scene, f = 0) => fr(S[scene][0] + f);

/* ------------------------------------------------------------------ */
/* Outils de synthèse                                                  */
/* ------------------------------------------------------------------ */

let seed = 12345;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;

function track() {
  return { L: new Float32Array(N), R: new Float32Array(N) };
}
/** Ajoute un son généré échantillon par échantillon. gen(t, i) renvoie une valeur ou [g, d]. */
function add(tr, start, dur, gen, gain = 1, pan = 0) {
  const i0 = Math.max(0, Math.floor(start * SR));
  const i1 = Math.min(N, Math.floor((start + dur) * SR));
  const gl = gain * Math.min(1, 1 - pan);
  const gr = gain * Math.min(1, 1 + pan);
  for (let i = i0; i < i1; i++) {
    const v = gen((i - i0) / SR, i - i0);
    if (Array.isArray(v)) {
      tr.L[i] += v[0] * gl;
      tr.R[i] += v[1] * gr;
    } else {
      tr.L[i] += v * gl;
      tr.R[i] += v * gr;
    }
  }
}
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));
const note = (n) => 440 * Math.pow(2, (n - 69) / 12); // MIDI -> Hz
const TAU = Math.PI * 2;

/** Filtre passe-bas à un pôle (état gardé par l'appelant). */
function lp(state, x, cutoff) {
  const a = 1 - Math.exp((-TAU * cutoff) / SR);
  state.y += a * (x - state.y);
  return state.y;
}
/** Filtre d'état variable (passe-bande) pour les whoosh. */
function svf() {
  let low = 0, band = 0;
  return (x, f, q = 0.7) => {
    const k = 2 * Math.sin((Math.PI * Math.min(f, SR / 6)) / SR);
    low += k * band;
    const high = x - low - q * band;
    band += k * high;
    return { low, band, high };
  };
}

/* ------------------------------------------------------------------ */
/* Musique : 120 BPM, Ré majeur (D, A, Bm, G)                           */
/* ------------------------------------------------------------------ */

const BPM = 120;
const BEAT = 60 / BPM;
const music = track();
const dropT = at("simple", 0); // la musique démarre franchement ici
const endT = timing.duration / FPS;
const chords = [
  [50, 54, 57, 62], // D
  [45, 52, 57, 61], // A
  [47, 54, 59, 62], // Bm
  [43, 50, 55, 59], // G
];
const chordAt = (t) => chords[Math.floor(Math.max(0, t - dropT) / (BEAT * 8)) % 4];

// Grille calée sur le départ de la musique.
const beatTimes = [];
for (let t = dropT; t < endT; t += BEAT) beatTimes.push(t);
const spinStart = at("roue", spin.start);
const spinEnd = at("roue", spin.end);
const calm = (t) => (t > at("reglages", 0) && t < at("ia", 60)) ; // couplet plus léger

function kick(t0, g = 1) {
  add(music, t0, 0.5, (t) => {
    const f = 45 + 110 * Math.exp(-t / 0.035);
    return Math.sin(TAU * f * t - 0) * env(t, 0.002, 0.16) * 0.95 + rnd() * env(t, 0.0005, 0.004) * 0.3;
  }, g);
}
function clap(t0, g = 1) {
  const f = svf();
  add(music, t0, 0.35, (t) => {
    const burst = t < 0.03 ? (Math.floor(t / 0.01) % 2 ? 0.6 : 1) : 1;
    const x = rnd() * env(t, 0.001, 0.09) * burst;
    return f(x, 1500, 0.9).band * 2.2 + Math.sin(TAU * 190 * t) * env(t, 0.001, 0.05) * 0.25;
  }, g);
}
function hat(t0, open = false, g = 1) {
  const f = svf();
  add(music, t0, open ? 0.25 : 0.06, (t) => f(rnd(), 9000, 0.4).high * env(t, 0.0008, open ? 0.08 : 0.018), g * 0.35, open ? 0.25 : -0.2);
}

// Pad (accords) : scies désaccordées filtrées, avec une ouverture du filtre au départ.
{
  const st = [{ y: 0 }, { y: 0 }];
  const phases = new Float64Array(16);
  add(music, 0, endT + 1, (t) => {
    const c = t < dropT ? chords[0] : chordAt(t);
    let l = 0, r = 0;
    c.forEach((n, k) => {
      for (let d = 0; d < 2; d++) {
        const idx = k * 2 + d;
        const fq = note(n + 12) * (d ? 1.004 : 0.996);
        phases[idx] = (phases[idx] + fq / SR) % 1;
        const saw = phases[idx] * 2 - 1;
        if (d) r += saw; else l += saw;
      }
    });
    const cutoff = t < dropT ? 300 + 900 * Math.max(0, (t - (dropT - 1.2)) / 1.2) : calm(t) ? 1400 : 2200;
    const fade = Math.min(1, t / 0.6) * (t > endT - 0.2 ? Math.max(0, 1 - (t - endT + 0.2) / 1.2) : 1);
    return [lp(st[0], l, cutoff) * 0.06 * fade, lp(st[1], r, cutoff) * 0.06 * fade];
  }, 1);
}

// Basse avec effet de pompe (ducking sur la grosse caisse).
{
  const st = { y: 0 };
  let ph = 0;
  add(music, dropT, endT - dropT + 0.3, (t) => {
    const T = t + dropT;
    const c = chordAt(T);
    const step = Math.floor(t / (BEAT / 2));
    const root = c[0] - 12 + (step % 4 === 3 ? 12 : 0);
    ph = (ph + note(root) / SR) % 1;
    const sq = ph < 0.5 ? 1 : -1;
    const beatPos = (t % BEAT) / BEAT;
    const duck = 0.35 + 0.65 * Math.min(1, beatPos * 3.2);
    const local = (t % (BEAT / 2)) / (BEAT / 2);
    const gate = Math.exp(-local * 2.2);
    return lp(st, sq, 260) * 0.22 * duck * gate * (T > endT ? 0 : 1);
  });
}

// Arpège « pluck » (marimba) en doubles croches, plus discret pendant le couplet calme.
for (let t = dropT; t < endT - 0.3; t += BEAT / 2) {
  const c = chordAt(t);
  const k = Math.round((t - dropT) / (BEAT / 2));
  const pattern = [0, 2, 1, 3, 2, 1, 3, 2];
  const n = c[pattern[k % 8]] + 12;
  const g = calm(t) ? 0.08 : 0.12;
  add(music, t, 0.4, (tt) => (Math.sin(TAU * note(n) * tt) + 0.3 * Math.sin(TAU * note(n) * 4 * tt) * Math.exp(-tt / 0.02)) * env(tt, 0.002, 0.11), g, k % 2 ? 0.3 : -0.3);
}

// Batterie.
beatTimes.forEach((t, k) => {
  if (t > endT - 0.2) return;
  const inSpin = t > spinStart - BEAT && t < spinEnd;
  if (!calm(t) || k % 2 === 0) kick(t, inSpin ? 0.8 : 1);
  if (k % 2 === 1 && !inSpin) clap(t, calm(t) ? 0.5 : 0.8);
  hat(t + BEAT / 2, k % 4 === 3, calm(t) ? 0.6 : 1);
  if (!calm(t)) hat(t + BEAT / 4, false, 0.5), hat(t + (3 * BEAT) / 4, false, 0.5);
});
// Roulement de caisse claire qui monte pendant que la roue tourne.
for (let t = spinStart; t < spinEnd - 0.05; ) {
  const p = (t - spinStart) / (spinEnd - spinStart);
  clap(t, 0.25 + 0.5 * p);
  t += BEAT / (2 + Math.floor(p * 3) * 2);
}
// Montée (riser) avant le départ de la musique et avant l'appel final.
function riser(tEnd, len, g = 0.5) {
  const f = svf();
  add(music, tEnd - len, len, (t) => {
    const p = t / len;
    return f(rnd(), 400 + 7000 * p * p, 0.5).band * p * p * 1.6;
  }, g);
}
riser(dropT, 1.4, 0.55);
riser(at("cta", 0), 1.2, 0.45);

/* ------------------------------------------------------------------ */
/* Bruitages                                                           */
/* ------------------------------------------------------------------ */

const sfx = track();

function whoosh(t0, len = 0.5, g = 0.5, up = true) {
  const f = svf();
  add(sfx, t0, len, (t) => {
    const p = t / len;
    const fc = up ? 300 + 5000 * p : 5300 - 5000 * p;
    return f(rnd(), fc, 0.35).band * Math.sin(Math.PI * p) * 1.6;
  }, g, up ? -0.4 + 0.8 * 0 : 0.3);
}
function pop(t0, g = 0.5, f0 = 900) {
  add(sfx, t0, 0.12, (t) => Math.sin(TAU * (f0 * Math.exp(-t / 0.04) + 220) * t) * env(t, 0.001, 0.035), g);
}
function click(t0, g = 0.5) {
  const f = svf();
  add(sfx, t0, 0.05, (t) => f(rnd(), 3500, 0.5).band * env(t, 0.0005, 0.006) * 3 + Math.sin(TAU * 2200 * t) * env(t, 0.0005, 0.008) * 0.4, g);
}
function tick(t0, g = 0.35, pitch = 2600) {
  add(sfx, t0, 0.04, (t) => (Math.sin(TAU * pitch * t) * 0.6 + Math.sin(TAU * pitch * 2.3 * t) * 0.3) * env(t, 0.0003, 0.006), g);
}
function bell(t0, freq, g = 0.4, dec = 0.6, pan = 0) {
  const partials = [[1, 1], [2.76, 0.4], [5.4, 0.2], [8.9, 0.1]];
  add(sfx, t0, dec * 4, (t) => partials.reduce((s, [m, a]) => s + Math.sin(TAU * freq * m * t) * a * Math.exp((-t * m) / dec / 1.5), 0) * env(t, 0.002, dec * 2), g, pan);
}
function thud(t0, g = 0.6) {
  add(sfx, t0, 0.3, (t) => Math.sin(TAU * (60 + 80 * Math.exp(-t / 0.03)) * t) * env(t, 0.002, 0.08), g);
}
function crackle(t0, len, g = 0.25) {
  for (let k = 0; k < len * 40; k++) {
    const t = t0 + (((rnd() + 1) / 2) * len);
    tick(t, g * (0.3 + 0.7 * ((rnd() + 1) / 2)), 3000 + 3000 * ((rnd() + 1) / 2));
  }
}
function crash(t0, g = 0.4) {
  const f = svf();
  add(sfx, t0, 2.5, (t) => f(rnd(), 7000, 0.6).high * env(t, 0.002, 0.7), g);
}

// Transitions entre scènes.
Object.entries(S).forEach(([id, [from]], k) => {
  if (k === 0) return;
  whoosh(fr(from) - 0.18, 0.42, 0.42);
});

// 1. Accroche : store qui tombe, porte qui se ferme, mots qui claquent.
whoosh(at("hook", ev.hookDrop), 0.3, 0.4, false);
thud(at("hook", ev.hookDrop + 10), 0.55);
thud(at("hook", 62), 0.35);
[6, 10, 14, 18, 22, 26].forEach((f) => pop(at("hook", f), 0.18, 700));
// 2. C'est simple : pop de la roue et du logo.
pop(at("simple", 4), 0.5, 1200);
bell(at("simple", 20), note(86), 0.25, 0.4);
// 3. Une roue par commerce : swipe à chaque changement.
for (let k = 1; k < 5; k++) {
  whoosh(at("shops", k * ev.shopLen) - 0.08, 0.22, 0.32);
  click(at("shops", k * ev.shopLen), 0.25);
}
// 4. Flyer : arrivée, téléphone, laser, bip.
whoosh(at("flyer", 0), 0.5, 0.35);
whoosh(at("flyer", ev.flyerPhone), 0.4, 0.3);
add(sfx, at("flyer", ev.scanLaser[0]), fr(ev.scanLaser[1] - ev.scanLaser[0]), (t) => Math.sin(TAU * (900 + 300 * Math.sin(t * 30)) * t) * 0.08, 0.5);
bell(at("flyer", ev.scanFlash), 1760, 0.3, 0.12);
bell(at("flyer", ev.scanFlash + 4), 2349, 0.3, 0.15);
// 5. Avis : 5 étoiles montantes, envol, compteur.
ev.stars.forEach((f, k) => bell(at("avis", f), note(81 + [0, 2, 4, 7, 9][k]), 0.32, 0.35, -0.3 + k * 0.15));
whoosh(at("avis", ev.reviewFly), 0.6, 0.35);
pop(at("avis", ev.reviewCount), 0.4, 1400);
// 6. La roue : clic, cliquetis qui ralentissent, gain.
click(at("roue", spin.start - 2), 0.7);
{
  const seg = 360 / spin.segments;
  const land = spin.turns * 360 + (360 - (spin.index * seg + seg / 2));
  const rot = (f) => {
    const p = Math.min(1, Math.max(0, (f - spin.start) / (spin.end - spin.start)));
    return (1 - Math.pow(1 - p, 3.2)) * land;
  };
  let last = 0;
  for (let f = spin.start; f <= spin.end; f += 0.05) {
    const n = Math.floor((rot(f) + seg / 2) / seg);
    if (n !== last) {
      tick(at("roue", 0) + fr(f), 0.4, 2400);
      last = n;
    }
  }
}
[0, 4, 7, 12].forEach((s, k) => bell(spinEnd + k * 0.07, note(74 + s), 0.32, 0.5, -0.2 + k * 0.15));
bell(spinEnd + 0.3, note(98), 0.18, 0.8);
crackle(spinEnd, 1.2, 0.2);
crash(spinEnd, 0.25);
// 7. Cadeau : retournement du ticket, tap sur le bouton, validation.
whoosh(at("cadeau", 4), 0.35, 0.3);
click(at("cadeau", ev.rdvTap), 0.6);
bell(at("cadeau", ev.rdvCheck), note(84), 0.3, 0.3);
bell(at("cadeau", ev.rdvCheck + 3), note(91), 0.3, 0.4);
// 8. Réglages : tics du curseur.
for (let f = ev.slider[0]; f < ev.slider[1]; f += 3) tick(at("reglages", f), 0.22, 3200);
pop(at("reglages", ev.slider[1]), 0.3, 1000);
// 9. IA : clic de souris, frappe.
click(at("ia", ev.iaClick), 0.7);
for (let f = ev.iaClick + 8; f < ev.iaClick + 8 + 62; f += 1) if (rnd() > -0.2) tick(at("ia", f) + rnd() * 0.01, 0.12, 1800 + rnd() * 600);
// 10. Boucle : whoosh à chaque étape, pièce sur le chiffre.
ev.loopSteps.forEach((f, k) => {
  whoosh(at("boucle", f) - 0.1, 0.3, 0.25);
  bell(at("boucle", f + 3), note(79 + k * 2), 0.22, 0.3);
});
bell(at("boucle", ev.loopCard), 1568, 0.3, 0.25);
bell(at("boucle", ev.loopCard + 3), 2093, 0.3, 0.35);
// 11. Appel à l'action : coup final.
thud(at("cta", 2), 0.6);
crash(at("cta", 2), 0.3);
pop(at("cta", ev.ctaButton), 0.4, 1100);
bell(at("cta", ev.ctaButton), note(86), 0.3, 0.8);
// Note finale.
[50, 57, 62, 66].forEach((n) => bell(endT - 0.9, note(n + 12), 0.12, 1.2));

/* ------------------------------------------------------------------ */
/* Écriture                                                            */
/* ------------------------------------------------------------------ */

function writeWav(path, tr, gain) {
  let peak = 0;
  for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(tr.L[i]), Math.abs(tr.R[i]));
  const g = gain ?? (peak > 0 ? 0.89 / peak : 1);
  const buf = Buffer.alloc(44 + N * 4);
  buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8);
  buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
  buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
  buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
  for (let i = 0; i < N; i++) {
    // Légère saturation douce pour coller le mix.
    const l = Math.tanh(tr.L[i] * g * 1.1) / Math.tanh(1.1);
    const r = Math.tanh(tr.R[i] * g * 1.1) / Math.tanh(1.1);
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(l * 32767))), 44 + i * 4);
    buf.writeInt16LE(Math.max(-32767, Math.min(32767, Math.round(r * 32767))), 46 + i * 4);
  }
  writeFileSync(path, buf);
  return g;
}

mkdirSync(root + "public/audio", { recursive: true });
const mix = track();
for (let i = 0; i < N; i++) {
  mix.L[i] = music.L[i] * 0.8 + sfx.L[i];
  mix.R[i] = music.R[i] * 0.8 + sfx.R[i];
}
writeWav(root + "public/audio/music.wav", music);
writeWav(root + "public/audio/sfx.wav", sfx);
writeWav(root + "public/audio/mix.wav", mix);
console.log(`Audio écrit : ${DUR.toFixed(1)} s, 3 pistes.`);
