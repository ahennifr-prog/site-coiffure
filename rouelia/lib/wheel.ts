import type { Prize, PrizeIcon } from "@/content";

/** Chance minimale d'un lot : chaque segment doit pouvoir sortir. */
export const MIN_PERCENT = 1;

export interface WheelPrize extends Prize {
  id: string;
  /** Image choisie par le commerçant (URL locale ou data URL). */
  image?: string;
  /** Chance bloquée : elle ne bouge pas quand on règle les autres lots. */
  locked?: boolean;
}

let idCounter = 0;
export function prizeId(): string {
  idCounter += 1;
  return `lot-${Date.now().toString(36)}-${idCounter}`;
}

export function withIds(prizes: Prize[]): WheelPrize[] {
  return prizes.map((p) => ({ ...p, id: prizeId() }));
}

/**
 * Roue de départ de la démo : les lots les plus fréquents, plus le plus rare (le « gros lot »),
 * dans l'ordre du modèle, avec des chances remises à 100 %.
 */
export function starterPrizes(prizes: Prize[], count = 4): Prize[] {
  if (prizes.length <= count) return prizes;
  const byChance = prizes.map((p, i) => ({ p, i })).sort((a, b) => b.p.percent - a.p.percent || a.i - b.i);
  const rarest = byChance[byChance.length - 1];
  const keep = new Set([...byChance.slice(0, count - 1).map((x) => x.i), rarest.i]);
  const kept = prizes.filter((_, i) => keep.has(i));
  const total = sumPercents(kept);
  const rounded = roundToTotal(kept.map((p) => (p.percent * 100) / total), 100);
  return kept.map((p, i) => ({ ...p, percent: rounded[i] }));
}

export function sumPercents(prizes: Pick<Prize, "percent">[]): number {
  return prizes.reduce((s, p) => s + p.percent, 0);
}

/**
 * Arrondit des valeurs réelles en entiers dont la somme vaut exactement `total`
 * (méthode du plus fort reste), sans descendre sous `min`.
 */
export function roundToTotal(values: number[], total: number, min = MIN_PERCENT): number[] {
  if (values.length === 0) return [];
  const floors = values.map((v) => Math.max(min, Math.floor(v)));
  let diff = total - floors.reduce((a, b) => a + b, 0);
  const order = values
    .map((v, i) => ({ i, rest: v - Math.floor(v) }))
    .sort((a, b) => b.rest - a.rest || a.i - b.i);
  let guard = 0;
  while (diff !== 0 && guard < 10000) {
    for (const { i } of order) {
      if (diff === 0) break;
      if (diff > 0) {
        floors[i] += 1;
        diff -= 1;
      } else if (floors[i] > min) {
        floors[i] -= 1;
        diff += 1;
      }
    }
    guard += 1;
  }
  return floors;
}

/**
 * Répartit `total` entre des lots proportionnellement à leurs poids actuels,
 * chacun gardant au moins `min`. Si tous les poids sont nuls, répartition égale.
 */
export function distribute(weights: number[], total: number, min = MIN_PERCENT): number[] {
  const n = weights.length;
  if (n === 0) return [];
  const free = total - n * min;
  const extra = weights.map((w) => Math.max(0, w - min));
  const extraSum = extra.reduce((a, b) => a + b, 0);
  const raw = extra.map((e) => min + (extraSum > 0 ? (e / extraSum) * free : free / n));
  return roundToTotal(raw, total, min);
}

/** Valeur maximale qu'un lot peut prendre compte tenu des autres lots et des blocages. */
export function maxPercentFor(prizes: WheelPrize[], index: number): number {
  let reserved = 0;
  prizes.forEach((p, i) => {
    if (i === index) return;
    reserved += p.locked ? p.percent : MIN_PERCENT;
  });
  return Math.max(MIN_PERCENT, 100 - reserved);
}

/**
 * Fixe la chance d'un lot et redistribue l'écart sur les autres lots non bloqués,
 * proportionnellement à leur chance actuelle. Le total reste toujours 100.
 */
export function setPercent(prizes: WheelPrize[], index: number, value: number): WheelPrize[] {
  const others = prizes.map((p, i) => ({ p, i })).filter(({ p, i }) => i !== index && !p.locked);
  if (others.length === 0) return prizes;
  const lockedSum = prizes.reduce((s, p, i) => (i !== index && p.locked ? s + p.percent : s), 0);
  const clamped = Math.round(
    Math.min(maxPercentFor(prizes, index), Math.max(MIN_PERCENT, Number.isFinite(value) ? value : MIN_PERCENT)),
  );
  const rest = 100 - lockedSum - clamped;
  const shares = distribute(others.map(({ p }) => p.percent), rest);
  const next = prizes.map((p) => ({ ...p }));
  next[index].percent = clamped;
  others.forEach(({ i }, k) => {
    next[i].percent = shares[k];
  });
  return next;
}

/** Remet la somme à 100 en ajustant les lots non bloqués (utile après un chargement). */
export function normalize(prizes: WheelPrize[]): WheelPrize[] {
  if (prizes.length === 0) return prizes;
  const unlocked = prizes.map((p, i) => ({ p, i })).filter(({ p }) => !p.locked);
  const lockedSum = prizes.reduce((s, p) => (p.locked ? s + p.percent : s), 0);
  const targets = unlocked.length > 0 ? unlocked : prizes.map((p, i) => ({ p, i }));
  const total = unlocked.length > 0 ? 100 - lockedSum : 100;
  const shares = distribute(targets.map(({ p }) => p.percent), total);
  const next = prizes.map((p) => ({ ...p, locked: unlocked.length > 0 ? p.locked : false }));
  targets.forEach(({ i }, k) => {
    next[i].percent = shares[k];
  });
  return next;
}

/** Ajoute un lot avec une part équitable, prise proportionnellement sur les lots non bloqués. */
export function addPrize(prizes: WheelPrize[], base: { name: string; icon: PrizeIcon; cost: number }): WheelPrize[] {
  const fair = Math.max(MIN_PERCENT, Math.round(100 / (prizes.length + 1)));
  const next = [...prizes.map((p) => ({ ...p })), { ...base, id: prizeId(), percent: fair }];
  return setPercent(next, next.length - 1, fair);
}

/** Retire un lot et rend sa part aux autres lots non bloqués (ou à tous si tous sont bloqués). */
export function removePrize(prizes: WheelPrize[], index: number): WheelPrize[] {
  const rest = prizes.filter((_, i) => i !== index).map((p) => ({ ...p }));
  if (rest.length === 0) return rest;
  if (rest.every((p) => p.locked)) rest.forEach((p) => (p.locked = false));
  return normalize(rest);
}

/** Coût moyen d'une partie : somme du coût de chaque lot multiplié par sa probabilité. */
export function averageCost(prizes: Pick<Prize, "cost" | "percent">[]): number {
  return prizes.reduce((s, p) => s + (Number.isFinite(p.cost) ? p.cost : 0) * (p.percent / 100), 0);
}

/** Tirage pondéré : renvoie l'index du lot gagné. `rand` renvoie un nombre dans [0, 1). */
export function pickWeighted(prizes: Pick<Prize, "percent">[], rand: () => number = Math.random): number {
  const total = sumPercents(prizes);
  const r = rand() * total;
  let acc = 0;
  for (let i = 0; i < prizes.length; i++) {
    acc += prizes[i].percent;
    if (r < acc) return i;
  }
  return prizes.length - 1;
}

/**
 * Angle final (en degrés, sens horaire) pour que le pointeur situé en haut
 * s'arrête dans le segment `index`, après au moins `turns` tours complets.
 * Les segments sont de taille égale, le segment 0 commence à 0°.
 */
export function targetRotation(
  current: number,
  index: number,
  count: number,
  rand: () => number = Math.random,
  turns = 5,
): number {
  const seg = 360 / count;
  // Position dans le segment, loin des bords pour éviter tout doute visuel.
  const within = seg * (0.2 + rand() * 0.6);
  const segmentAngle = index * seg + within;
  // Le pointeur est à 0°. Tourner la roue de R amène l'angle (360 - R mod 360) sous le pointeur.
  const desiredMod = (360 - segmentAngle) % 360;
  const currentMod = ((current % 360) + 360) % 360;
  let delta = desiredMod - currentMod;
  if (delta < 0) delta += 360;
  return current + turns * 360 + delta;
}

/** Index du segment situé sous le pointeur pour une rotation donnée. */
export function segmentAt(rotation: number, count: number): number {
  const seg = 360 / count;
  const angle = (((360 - (rotation % 360)) % 360) + 360) % 360;
  return Math.floor(angle / seg) % count;
}

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

/** Code cadeau fictif du type ROU-7K4M, sans caractères ambigus (0, O, 1, I, L). */
export function generateCode(prefix = "ROU", rand: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < 4; i++) s += CODE_ALPHABET[Math.floor(rand() * CODE_ALPHABET.length)];
  return `${prefix}-${s}`;
}

export function deadlineFrom(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

/** Couleur de texte lisible (encre ou blanc) sur une couleur de fond donnée. */
export function readableOn(hex: string): "#1D1A16" | "#FFFFFF" {
  const lum = relativeLuminance(hex);
  const contrastInk = (lum + 0.05) / (relativeLuminance("#1D1A16") + 0.05);
  const contrastWhite = 1.05 / (lum + 0.05);
  return contrastInk >= contrastWhite ? "#1D1A16" : "#FFFFFF";
}

export function relativeLuminance(hex: string): number {
  const h = hex.replace("#", "");
  const full = h.length === 3 ? h.split("").map((c) => c + c).join("") : h;
  const ch = [0, 2, 4].map((i) => parseInt(full.slice(i, i + 2), 16) / 255);
  const lin = ch.map((v) => (v <= 0.03928 ? v / 12.92 : ((v + 0.055) / 1.055) ** 2.4));
  return 0.2126 * lin[0] + 0.7152 * lin[1] + 0.0722 * lin[2];
}

/** Décline une couleur principale en palette de segments harmonieuse. */
export function paletteFromPrimary(hex: string): string[] {
  return [hex, "#FBF6EE", mix(hex, "#1D1A16", 0.45), mix(hex, "#FFFFFF", 0.55)];
}

export function mix(a: string, b: string, t: number): string {
  const pa = [1, 3, 5].map((i) => parseInt(a.slice(i, i + 2), 16));
  const pb = [1, 3, 5].map((i) => parseInt(b.slice(i, i + 2), 16));
  return (
    "#" +
    pa
      .map((v, i) => Math.round(v + (pb[i] - v) * t).toString(16).padStart(2, "0"))
      .join("")
      .toUpperCase()
  );
}

/** Couleurs de segments : on alterne la palette en évitant deux voisins identiques. */
export function segmentColors(palette: readonly string[], count: number): string[] {
  const out: string[] = [];
  for (let i = 0; i < count; i++) out.push(palette[i % palette.length]);
  if (count > 2 && out[count - 1] === out[0]) {
    const alt = palette.find((c) => c !== out[0] && c !== out[count - 2]);
    if (alt) out[count - 1] = alt;
  }
  return out;
}

/** Initiales d'un commerce pour le centre de la roue (« Salon Martine » donne « SM »). */
export function monogramOf(name: string): string {
  const words = name
    .replace(/[^\p{L}\p{N} ]/gu, " ")
    .split(" ")
    .filter((w) => w.length > 1 && !["le", "la", "les", "de", "du", "des", "chez", "et", "au", "aux"].includes(w.toLowerCase()));
  if (words.length === 0) return name.trim().charAt(0).toUpperCase() || "R";
  if (words.length === 1) return words[0].charAt(0).toUpperCase();
  return (words[0].charAt(0) + words[1].charAt(0)).toUpperCase();
}
