/**
 * Son de la pub story (19,5 s, sans voix) : musique rapide à 120 BPM et bruitages, synthétisés en code.
 * Lit le minutage partagé avec l'image (src/story.json) et écrit public/audio/story.wav.
 * Les coupes tombent toutes sur un temps (2,5 s, 5 s, 9 s, 12,5 s, 16,5 s).
 * Usage : node scripts/story-audio.mjs
 */
import { readFileSync, writeFileSync, mkdirSync } from "node:fs";

const root = new URL("..", import.meta.url).pathname;
const story = JSON.parse(readFileSync(root + "src/story.json", "utf8"));
const ev = story.ev;
const SR = 48000;
const FPS = story.fps;
const END = story.duration / FPS;
const N = Math.ceil(END * SR);
const fr = (f) => f / FPS;
const S = story.scenes;
const at = (scene, f = 0) => fr(S[scene][0] + f);

/* Outils de synthèse (mêmes recettes que scripts/audio.mjs) */
let seed = 4242;
const rnd = () => ((seed = (seed * 1664525 + 1013904223) >>> 0) / 4294967296) * 2 - 1;
const track = () => ({ L: new Float32Array(N), R: new Float32Array(N) });
function add(tr, start, dur, gen, gain = 1, pan = 0) {
  const i0 = Math.max(0, Math.floor(start * SR));
  const i1 = Math.min(N, Math.floor((start + dur) * SR));
  const gl = gain * Math.min(1, 1 - pan);
  const gr = gain * Math.min(1, 1 + pan);
  for (let i = i0; i < i1; i++) {
    const v = gen((i - i0) / SR, i - i0);
    if (Array.isArray(v)) { tr.L[i] += v[0] * gl; tr.R[i] += v[1] * gr; } else { tr.L[i] += v * gl; tr.R[i] += v * gr; }
  }
}
const env = (t, a, d) => (t < a ? t / a : Math.exp(-(t - a) / d));
const note = (n) => 440 * Math.pow(2, (n - 69) / 12);
const TAU = Math.PI * 2;
function lp(state, x, cutoff) {
  const a = 1 - Math.exp((-TAU * cutoff) / SR);
  state.y += a * (x - state.y);
  return state.y;
}
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
/* Musique : 120 BPM, Mi mineur vers Sol majeur, énergique dès le début */
/* ------------------------------------------------------------------ */

const BEAT = 0.5;
const music = track();
const chords = [
  [52, 55, 59, 64], // Em
  [48, 52, 55, 60], // C
  [43, 50, 55, 59], // G
  [50, 54, 57, 62], // D
];
// Grille d'accords calée pour qu'un cycle Em, C, G, D démarre avec le refrain (2,5 s, début du scan).
const HOOK = fr(S.scan[0]);
const chordAt = (t) => chords[(((Math.floor((t - HOOK) / (BEAT * 4)) % 4) + 4) % 4)];
const spinStart = at("avis", ev.spin.start);
const spinEnd = at("avis", ev.spin.end);
const finT = at("fin", 0);

function kick(t0, g = 1) {
  add(music, t0, 0.45, (t) => Math.sin(TAU * (45 + 120 * Math.exp(-t / 0.03)) * t) * env(t, 0.002, 0.14) + rnd() * env(t, 0.0005, 0.004) * 0.3, g);
}
function clap(t0, g = 1) {
  const f = svf();
  add(music, t0, 0.3, (t) => {
    const burst = t < 0.03 ? (Math.floor(t / 0.01) % 2 ? 0.6 : 1) : 1;
    return f(rnd() * env(t, 0.001, 0.08) * burst, 1600, 0.9).band * 2.2;
  }, g);
}
function hat(t0, g = 1, open = false) {
  const f = svf();
  add(music, t0, open ? 0.2 : 0.05, (t) => f(rnd(), 9500, 0.4).high * env(t, 0.0008, open ? 0.07 : 0.014), g * 0.35, open ? 0.25 : -0.2);
}

// Pad court et pompé : accord en scies filtrées, coupé à chaque temps.
{
  const st = [{ y: 0 }, { y: 0 }];
  const ph = new Float64Array(8);
  add(music, 0, END, (t) => {
    const c = chordAt(t);
    let l = 0, r = 0;
    c.forEach((n, k) => {
      for (let d = 0; d < 2; d++) {
        const i = k * 2 + d;
        ph[i] = (ph[i] + (note(n + 12) * (d ? 1.005 : 0.995)) / SR) % 1;
        if (d) r += ph[i] * 2 - 1; else l += ph[i] * 2 - 1;
      }
    });
    const pump = 0.25 + 0.75 * Math.min(1, ((t % BEAT) / BEAT) * 2.5);
    const cutoff = t > finT ? 3200 : 1900 + 900 * Math.sin((t / END) * Math.PI);
    const fade = Math.min(1, t / 0.15) * Math.min(1, (END - t) / 0.6);
    return [lp(st[0], l, cutoff) * 0.055 * pump * fade, lp(st[1], r, cutoff) * 0.055 * pump * fade];
  });
}

// Basse en croches, octave sautée sur le contretemps.
{
  const st = { y: 0 };
  let ph = 0;
  add(music, 0, END, (t) => {
    const step = Math.floor(t / (BEAT / 2));
    const root = chordAt(t)[0] - 12 + (step % 2 ? 12 : 0);
    ph = (ph + note(root) / SR) % 1;
    const local = (t % (BEAT / 2)) / (BEAT / 2);
    const duck = 0.3 + 0.7 * Math.min(1, ((t % BEAT) / BEAT) * 3);
    return lp(st, ph < 0.5 ? 1 : -1, 300) * 0.24 * Math.exp(-local * 2.4) * duck * Math.min(1, (END - t) / 0.4);
  });
}

// Arpège pluck en doubles croches : c'est lui qui donne le côté rapide.
for (let t = 0, k = 0; t < END - 0.3; t += BEAT / 4, k++) {
  const c = chordAt(t);
  const n = c[[0, 1, 2, 3, 2, 1, 3, 2][k % 8]] + 24;
  const g = t >= HOOK ? 0.06 : 0.1;
  add(music, t, 0.25, (tt) => (Math.sin(TAU * note(n) * tt) + 0.25 * Math.sin(TAU * note(n) * 3 * tt) * Math.exp(-tt / 0.015)) * env(tt, 0.002, 0.07), g, k % 2 ? 0.35 : -0.35);
}

// Batterie : grosse caisse sur chaque temps, clap sur 2 et 4, charleston en doubles croches.
for (let t = 0, k = 0; t < END - 0.25; t += BEAT, k++) {
  const inSpin = t > spinStart - BEAT && t < spinEnd;
  kick(t, inSpin ? 0.75 : 1);
  if (k % 2 === 1 && !inSpin) clap(t, 0.75);
  hat(t + BEAT / 2, 1, k % 4 === 3);
  hat(t + BEAT / 4, 0.55);
  hat(t + (3 * BEAT) / 4, 0.55);
}
// Roulement qui accélère pendant que la roue tourne.
for (let t = spinStart; t < spinEnd - 0.05; ) {
  const p = (t - spinStart) / (spinEnd - spinStart);
  clap(t, 0.2 + 0.5 * p);
  t += BEAT / (2 + Math.floor(p * 3) * 2);
}
function riser(tEnd, len, g = 0.5) {
  const f = svf();
  add(music, tEnd - len, len, (t) => { const p = t / len; return f(rnd(), 400 + 7000 * p * p, 0.5).band * p * p * 1.6; }, g);
}
riser(finT, 1, 0.5);

/*
 * Refrain : mélodie originale, simple et répétée pour rester en tête, sur la suite d'accords pop
 * la plus familière (Em, C, G, D). Son de sifflet brillant doublé d'une cloche à l'octave.
 * Notes : [temps de départ, durée, note MIDI], en temps (0,5 s) depuis le début de la mesure.
 */
const PHRASE = [
  [[0, 0.5, 79], [0.5, 0.5, 79], [1, 1, 83], [2, 0.5, 81], [2.5, 0.5, 79], [3, 1, 76]],
  [[0, 0.5, 76], [0.5, 0.5, 79], [1, 1, 84], [2, 0.5, 83], [2.5, 0.5, 79], [3, 1, 76]],
  [[0, 0.5, 74], [0.5, 0.5, 79], [1, 1, 83], [2, 0.5, 81], [2.5, 0.5, 79], [3, 1, 81]],
  [[0, 0.5, 81], [0.5, 0.5, 78], [1, 1.5, 74], [3, 0.5, 78], [3.5, 0.5, 79]],
];
function lead(t0, dur, n, g = 0.16) {
  const fq = note(n);
  add(music, t0, dur * 0.95 + 0.25, (t) => {
    const vib = 1 + 0.006 * Math.sin(TAU * 5.5 * t) * Math.min(1, t / 0.15);
    const body = Math.sin(TAU * fq * vib * t) + 0.18 * Math.sin(TAU * fq * 2 * vib * t) + 0.08 * Math.sin(TAU * fq * 3 * t);
    const bellL = 0.35 * Math.sin(TAU * fq * 2 * t) * Math.exp(-t / 0.12);
    const release = t > dur * 0.95 ? Math.exp(-(t - dur * 0.95) / 0.06) : 1;
    return (body * Math.min(1, t / 0.012) * (0.85 + 0.15 * Math.exp(-t / 0.2)) + bellL) * release;
  }, g, 0.05);
}
// Deux passages du refrain, puis la signature sonore « Rou-e-li-a » sur l'adresse du site.
const logoT = at("fin", ev.ctaUrl);
for (let rep = 0; rep < 2; rep++) {
  PHRASE.forEach((bar, b) => bar.forEach(([st, d, n]) => {
    const t = HOOK + rep * 8 + b * 2 + st * BEAT;
    if (t < logoT - 0.3) lead(t, d * BEAT, n);
  }));
}
[[0, 74], [0.16, 79], [0.32, 83], [0.48, 86]].forEach(([dt, n], k) => lead(logoT + dt, k === 3 ? 0.9 : 0.15, n, 0.2));

/* ------------------------------------------------------------------ */
/* Bruitages                                                           */
/* ------------------------------------------------------------------ */

const sfx = track();
function whoosh(t0, len = 0.4, g = 0.4) {
  const f = svf();
  add(sfx, t0, len, (t) => { const p = t / len; return f(rnd(), 300 + 5000 * p, 0.35).band * Math.sin(Math.PI * p) * 1.6; }, g);
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
function hit(t0, g = 0.5) {
  const f = svf();
  add(sfx, t0, 0.6, (t) => Math.sin(TAU * (42 + 90 * Math.exp(-t / 0.05)) * t) * env(t, 0.002, 0.22) + f(rnd(), 1800, 0.6).band * env(t, 0.0005, 0.015) * 1.2, g);
}
function crash(t0, g = 0.4) {
  const f = svf();
  add(sfx, t0, 2, (t) => f(rnd(), 7000, 0.6).high * env(t, 0.002, 0.6), g);
}

// Coupes : clic et impact grave.
Object.values(S).forEach(([from], k) => {
  if (!k) return;
  click(fr(from) + 0.02, 0.5);
  hit(fr(from) + 0.02, 0.32);
});
// 1. Problème : mots qui claquent, porte qui se ferme.
for (let k = 0; k < 3; k++) pop(at("probleme", ev.probWords[0] + k * ev.probWords[1] + 2), 0.2, 700);
for (let k = 0; k < 4; k++) pop(at("probleme", ev.probWords2[0] + k * ev.probWords2[1] + 2), 0.2, 800);
hit(at("probleme", ev.probWords2[0] + ev.probWords2[1] * 3 + 2), 0.6);
thud(at("probleme", ev.probLeave[1] - 14), 0.45);
pop(at("probleme", ev.promise), 0.45, 1300);
bell(at("probleme", ev.promise + 1), note(83), 0.25, 0.3);
for (let f = ev.signStep; f < ev.promise; f += ev.signStep) tick(at("probleme", f), 0.25, 3000);
// 2. Scan : téléphone, laser, bip, la roue apparaît.
whoosh(at("scan", ev.scanPhone[0]), 0.4, 0.3);
add(sfx, at("scan", ev.scanLaser[0]), fr(ev.scanLaser[1] - ev.scanLaser[0]), (t) => Math.sin(TAU * (900 + 300 * Math.sin(t * 30)) * t) * 0.08, 0.5);
bell(at("scan", ev.scanFlash), 1760, 0.3, 0.12);
bell(at("scan", ev.scanFlash + 4), 2349, 0.3, 0.15);
// 3. Avis : tap, cinq étoiles qui montent, frappe, publié ; puis la roue.
click(at("avis", ev.gateTap), 0.6);
whoosh(at("avis", ev.gateTap + 4), 0.3, 0.25);
ev.stars.forEach((f, k) => bell(at("avis", f), note(83 + [0, 2, 4, 7, 9][k]), 0.3, 0.35, -0.3 + k * 0.15));
for (let f = ev.stars[4]; f < ev.published - 1; f += 1) tick(at("avis", f) + rnd() * 0.01, 0.1, 1800 + rnd() * 600);
bell(at("avis", ev.published), note(88), 0.3, 0.3);
bell(at("avis", ev.published + 3), note(95), 0.3, 0.4);
whoosh(at("avis", ev.wheelOut - 4), 0.45, 0.4);
pop(at("avis", ev.wheelOut + 4), 0.4, 700);
click(at("avis", ev.spinTap), 0.7);
{
  const seg = 360 / ev.spin.segments;
  const land = ev.spin.turns * 360 + (360 - (ev.spin.index * seg + seg / 2));
  const rot = (f) => { const p = Math.min(1, Math.max(0, (f - ev.spin.start) / (ev.spin.end - ev.spin.start))); return (1 - Math.pow(1 - p, 3.2)) * land; };
  let last = 0;
  for (let f = ev.spin.start; f <= ev.spin.end; f += 0.05) {
    const n = Math.floor((rot(f) + seg / 2) / seg);
    if (n !== last) { tick(at("avis", 0) + fr(f), 0.4, 2400); last = n; }
  }
}
[0, 4, 7, 12].forEach((s, k) => bell(spinEnd + k * 0.07, note(76 + s), 0.32, 0.5, -0.2 + k * 0.15));
crash(spinEnd, 0.25);
// 4. Cadeau : ticket, tap sur « Réserver », validation.
whoosh(at("cadeau", 2), 0.35, 0.3);
pop(at("cadeau", ev.rdvButton), 0.3, 1000);
click(at("cadeau", ev.rdvTap), 0.6);
pop(at("cadeau", ev.rdvCal), 0.3, 1200);
bell(at("cadeau", ev.rdvCheck), note(84), 0.3, 0.3);
bell(at("cadeau", ev.rdvCheck + 3), note(91), 0.3, 0.4);
// 5. Espace : chaque tuile arrive, les compteurs défilent, une pièce à la fin de chaque compteur.
ev.tiles.forEach((f, k) => {
  pop(at("espace", f), 0.25, 900 + k * 150);
  const end = f + 4 + ev.countLen * 0.7;
  for (let g = f + 4; g < end; g += 2) tick(at("espace", g), 0.12, 2600 + k * 200);
  bell(at("espace", end), note(84 + k * 2), 0.25, 0.3);
});
// 6. Fin : cercle, bouton, adresse.
ev.pills.forEach((f, k) => pop(at("fin", f + 2), 0.3, 900 + k * 200));
thud(at("fin", 1), 0.5);
pop(at("fin", ev.ctaButton), 0.4, 1100);
bell(at("fin", ev.ctaUrl), note(86), 0.3, 0.8);
[52, 59, 64, 67].forEach((n) => bell(END - 1.1, note(n + 12), 0.1, 1));

/* ------------------------------------------------------------------ */
/* Écriture                                                            */
/* ------------------------------------------------------------------ */

const mix = track();
for (let i = 0; i < N; i++) {
  mix.L[i] = music.L[i] * 0.8 + sfx.L[i];
  mix.R[i] = music.R[i] * 0.8 + sfx.R[i];
}
let peak = 0;
for (let i = 0; i < N; i++) peak = Math.max(peak, Math.abs(mix.L[i]), Math.abs(mix.R[i]));
const g = 0.89 / peak;
const buf = Buffer.alloc(44 + N * 4);
buf.write("RIFF", 0); buf.writeUInt32LE(36 + N * 4, 4); buf.write("WAVE", 8);
buf.write("fmt ", 12); buf.writeUInt32LE(16, 16); buf.writeUInt16LE(1, 20); buf.writeUInt16LE(2, 22);
buf.writeUInt32LE(SR, 24); buf.writeUInt32LE(SR * 4, 28); buf.writeUInt16LE(4, 32); buf.writeUInt16LE(16, 34);
buf.write("data", 36); buf.writeUInt32LE(N * 4, 40);
for (let i = 0; i < N; i++) {
  const l = Math.tanh(mix.L[i] * g * 1.1) / Math.tanh(1.1);
  const r = Math.tanh(mix.R[i] * g * 1.1) / Math.tanh(1.1);
  buf.writeInt16LE(Math.round(l * 32767), 44 + i * 4);
  buf.writeInt16LE(Math.round(r * 32767), 46 + i * 4);
}
mkdirSync(root + "public/audio", { recursive: true });
writeFileSync(root + "public/audio/story-raw.wav", buf);
console.log(`Son écrit : ${END.toFixed(1)} s.`);
