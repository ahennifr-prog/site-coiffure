/** Commerces : types et règles pures, utilisables aussi dans le navigateur. */
import { palettes, trades, type OfferId, type PackId, type PrizeIcon } from "@/content";
import { parisClock } from "@/lib/dates";
import type { SignupOffer, SignupRecord } from "@/lib/signup";
import { distribute, mix, monogramOf, paletteFromPrimary, readableOn, roundToTotal, segmentColors } from "@/lib/wheel";
import { prizeIconIds } from "@/components/wheel/icons";

/* ------------------------------------------------------------------ */
/* Types                                                               */
/* ------------------------------------------------------------------ */

export interface ShopPrize {
  id: string;
  name: string;
  /** Précision affichée sur l'écran de gain. */
  detail: string;
  icon: PrizeIcon;
  /** Gros cadeau : sa part se règle d'un seul geste avec le taux de gros cadeaux. */
  big: boolean;
  /** Coût estimé pour le commerçant, en euros. */
  cost: number;
  percent: number;
}

/**
 * Roue programmée : remplace la roue habituelle entre deux dates (roue saisonnière)
 * ou sur des créneaux de la semaine (heures creuses).
 */
export interface WheelSchedule {
  id: string;
  name: string;
  kind: "dates" | "heures";
  /** Dates incluses, AAAA-MM-JJ (roue saisonnière). */
  start: string;
  end: string;
  /** Jours de la semaine, 1 = lundi (heures creuses). */
  days: number[];
  /** Créneau « HH:MM », début inclus, fin exclue. */
  from: string;
  to: string;
  prizes: ShopPrize[];
}

export interface ShopSettings {
  /** Le commerçant peut mettre son jeu en pause. */
  active: boolean;
  name: string;
  address: string;
  phone: string;
  reviewUrl: string;
  bookingUrl: string;
  paletteId: string;
  primaryColor: string | null;
  hasLogo: boolean;
  logoVersion: number;
  prizes: ShopPrize[];
  validityDays: number;
  delayDays: number;
  replayDays: number;
  schedules: WheelSchedule[];
  /** Parrainage : le client invite un ami ; si l'ami retire son cadeau, le client reçoit un bonus. */
  referral: { enabled: boolean; reward: string };
  /** Prénoms de l'équipe, pour savoir qui valide en caisse. */
  employees: string[];
  instagramUrl: string;
  facebookUrl: string;
  /** Pour le suivi de la rentabilité : panier moyen (€) et part qui reste après achats (%). */
  profit: { basket: number; margin: number };
}

/** trial : essai gratuit ; active : client payant ; paused : mis en pause par Rouelia. */
export type ShopPlan = "trial" | "active" | "paused";
export const SHOP_PLANS: ShopPlan[] = ["trial", "active", "paused"];

export interface Shop {
  id: string;
  slug: string;
  email: string;
  firstName: string;
  phone: string;
  signupId: string | null;
  pack: PackId;
  plan: ShopPlan;
  trialEndsAt: string;
  createdAt: string;
  /** Cadeau de la roue d'offres Rouelia rattaché au compte. */
  offer: SignupOffer | null;
  codePrefix: string;
  settings: ShopSettings;
  /** E-mails automatiques déjà envoyés (dates AAAA-MM-JJ), pour ne jamais les doubler. */
  mails?: { trialSoon?: string; trialEnded?: string; weekly?: string };
}


export const MIN_PRIZES = 3;
export const MAX_PRIZES = 8;

/* ------------------------------------------------------------------ */
/* Réglages                                                            */
/* ------------------------------------------------------------------ */

const clampInt = (v: unknown, min: number, max: number, dflt: number) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : dflt;
};
const str = (v: unknown, max: number, dflt = "") => (typeof v === "string" ? v.trim().slice(0, max) : dflt);

/** Lien http(s) valide, ou chaîne vide. */
export function safeUrl(v: unknown): string {
  const s = str(v, 600);
  if (!s) return "";
  try {
    const u = new URL(/^https?:\/\//i.test(s) ? s : `https://${s}`);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : "";
  } catch {
    return "";
  }
}

/** Valide des réglages reçus de l'espace commerçant. La somme des chances est ramenée à 100. */
const TIME_RE = /^([01]\d|2[0-3]):[0-5]\d$/;
const DAY_RE = /^\d{4}-\d{2}-\d{2}$/;
export const MAX_SCHEDULES = 6;
export const MAX_EMPLOYEES = 20;

/** Valide une liste de lots et ramène la somme des chances à 100. */
export function sanitizePrizes(input: unknown, fallback: ShopPrize[]): ShopPrize[] {
  const raw = Array.isArray(input) ? input.slice(0, MAX_PRIZES) : fallback;
  let prizes: ShopPrize[] = raw.map((p, i) => {
    const q = (p ?? {}) as Record<string, unknown>;
    return {
      id: str(q.id, 40) || `lot-${i + 1}`,
      name: str(q.name, 30) || `Cadeau ${i + 1}`,
      detail: str(q.detail, 140),
      icon: prizeIconIds.includes(q.icon as PrizeIcon) ? (q.icon as PrizeIcon) : "cadeau",
      big: q.big === true,
      cost: Math.max(0, Math.min(9999, Math.round((Number(q.cost) || 0) * 100) / 100)),
      percent: Math.max(1, Number(q.percent) || 1),
    };
  });
  if (prizes.length < MIN_PRIZES) prizes = fallback.map((p) => ({ ...p }));
  const ids = new Set<string>();
  prizes.forEach((p, i) => {
    if (ids.has(p.id)) p.id = `${p.id}-${i}`;
    ids.add(p.id);
  });
  const sum = prizes.reduce((s, x) => s + x.percent, 0);
  const shares = roundToTotal(prizes.map((p) => (p.percent / sum) * 100), 100);
  return prizes.map((p, i) => ({ ...p, percent: shares[i] }));
}

function sanitizeSchedules(input: unknown, base: WheelSchedule[], prizes: ShopPrize[]): WheelSchedule[] {
  if (!Array.isArray(input)) return base;
  return input.slice(0, MAX_SCHEDULES).map((x, i) => {
    const q = (x ?? {}) as Record<string, unknown>;
    const kind = q.kind === "heures" ? "heures" : "dates";
    const days = Array.isArray(q.days) ? [...new Set(q.days.map(Number).filter((d) => Number.isInteger(d) && d >= 1 && d <= 7))].sort() : [];
    let start = typeof q.start === "string" && DAY_RE.test(q.start) ? q.start : "";
    let end = typeof q.end === "string" && DAY_RE.test(q.end) ? q.end : "";
    if (start && end && end < start) [start, end] = [end, start];
    return {
      id: str(q.id, 40) || `roue-${i + 1}`,
      name: str(q.name, 40) || (kind === "heures" ? "Heures creuses" : "Roue de saison"),
      kind,
      start,
      end,
      days,
      from: typeof q.from === "string" && TIME_RE.test(q.from) ? q.from : "14:00",
      to: typeof q.to === "string" && TIME_RE.test(q.to) ? q.to : "17:00",
      prizes: sanitizePrizes(q.prizes, prizes),
    };
  });
}

/** Valide des réglages reçus de l'espace commerçant. La somme des chances est ramenée à 100. */
export function sanitizeSettings(input: unknown, base: ShopSettings): ShopSettings {
  const c = (input ?? {}) as Record<string, unknown>;
  const b = withDefaults(base);
  const prizes = sanitizePrizes(c.prizes ?? b.prizes, b.prizes);
  const color = typeof c.primaryColor === "string" && /^#[0-9a-fA-F]{6}$/.test(c.primaryColor) ? c.primaryColor.toUpperCase() : null;
  const referral = (c.referral ?? b.referral) as Record<string, unknown>;
  const profit = (c.profit ?? b.profit) as Record<string, unknown>;
  const employees = Array.isArray(c.employees) ? c.employees : b.employees;

  return {
    active: c.active === undefined ? b.active : c.active === true,
    name: str(c.name, 60) || b.name,
    address: c.address === undefined ? b.address : str(c.address, 200),
    phone: c.phone === undefined ? b.phone : str(c.phone, 30),
    reviewUrl: c.reviewUrl === undefined ? b.reviewUrl : safeUrl(c.reviewUrl),
    bookingUrl: c.bookingUrl === undefined ? b.bookingUrl : safeUrl(c.bookingUrl),
    paletteId: palettes.some((p) => p.id === c.paletteId) ? (c.paletteId as string) : b.paletteId,
    primaryColor: c.primaryColor === undefined ? b.primaryColor : color,
    hasLogo: b.hasLogo,
    logoVersion: b.logoVersion,
    prizes,
    validityDays: clampInt(c.validityDays, 1, 365, b.validityDays),
    delayDays: clampInt(c.delayDays, 0, 30, b.delayDays),
    replayDays: clampInt(c.replayDays, 0, 365, b.replayDays),
    schedules: sanitizeSchedules(c.schedules, b.schedules, prizes),
    referral: { enabled: referral.enabled === true, reward: str(referral.reward, 60) || b.referral.reward },
    employees: [...new Set(employees.map((e) => str(e, 30)).filter(Boolean))].slice(0, MAX_EMPLOYEES),
    instagramUrl: c.instagramUrl === undefined ? b.instagramUrl : safeUrl(c.instagramUrl),
    facebookUrl: c.facebookUrl === undefined ? b.facebookUrl : safeUrl(c.facebookUrl),
    profit: {
      basket: Math.max(0, Math.min(10000, Number(profit.basket) || 0)),
      margin: clampInt(profit.margin, 0, 100, b.profit.margin),
    },
  };
}

/** Complète les réglages enregistrés avant l'ajout d'une fonction. */
export function withDefaults(s: ShopSettings): ShopSettings {
  return {
    ...s,
    schedules: s.schedules ?? [],
    referral: s.referral ?? { enabled: false, reward: "Un cadeau surprise" },
    employees: s.employees ?? [],
    instagramUrl: s.instagramUrl ?? "",
    facebookUrl: s.facebookUrl ?? "",
    profit: s.profit ?? { basket: 0, margin: 60 },
  };
}

/* ------------------------------------------------------------------ */
/* Fonctions par pack                                                  */
/* ------------------------------------------------------------------ */

/** Ce que chaque pack ouvre, selon le comparatif de la page Tarifs. */
export function packFeatures(pack: PackId) {
  const plus = pack !== "essentiel";
  const premium = pack === "premium";
  return {
    booking: plus,
    /** Rappel par e-mail avant la date limite des cadeaux non retirés. */
    reminders: plus,
    social: plus,
    seasons: plus,
    referral: plus,
    employees: plus,
    offPeak: premium,
    profit: premium,
    poweredBy: !premium,
  };
}

/** Roue en vigueur à cet instant : heures creuses, puis roue de saison, sinon roue habituelle. */
export function activeWheel(settings: ShopSettings, pack: PackId, now = new Date()): { id: string; name: string; prizes: ShopPrize[] } {
  const s = withDefaults(settings);
  const f = packFeatures(pack);
  const { day, weekday, time } = parisClock(now);
  const offPeak = f.offPeak && s.schedules.find((w) => w.kind === "heures" && w.days.includes(weekday) && w.from <= time && time < w.to);
  if (offPeak) return offPeak;
  const season = f.seasons && s.schedules.find((w) => w.kind === "dates" && w.start && w.end && w.start <= day && day <= w.end);
  if (season) return season;
  return { id: "base", name: "Roue habituelle", prizes: s.prizes };
}

export function bigTotal(prizes: Pick<ShopPrize, "big" | "percent">[]): number {
  return prizes.filter((p) => p.big).reduce((s, p) => s + p.percent, 0);
}

/**
 * Règle la part totale des gros cadeaux (ex. 15 %). Les gros cadeaux se partagent cette part
 * et les petits le reste, chacun gardant ses proportions. Le total reste 100.
 */
export function setBigRate<T extends Pick<ShopPrize, "big" | "percent">>(prizes: T[], rate: number): T[] {
  const big = prizes.map((p, i) => ({ p, i })).filter(({ p }) => p.big);
  const small = prizes.map((p, i) => ({ p, i })).filter(({ p }) => !p.big);
  if (big.length === 0 || small.length === 0) return prizes;
  const r = Math.round(Math.min(100 - small.length, Math.max(big.length, rate)));
  const bigShares = distribute(big.map(({ p }) => p.percent), r);
  const smallShares = distribute(small.map(({ p }) => p.percent), 100 - r);
  const next = prizes.map((p) => ({ ...p }));
  big.forEach(({ i }, k) => (next[i].percent = bigShares[k]));
  small.forEach(({ i }, k) => (next[i].percent = smallShares[k]));
  return next;
}

/** Couleurs de la roue et des boutons, comme dans la démo du site. */
export function shopTheme(s: Pick<ShopSettings, "paletteId" | "primaryColor" | "prizes" | "name">) {
  const palette = palettes.find((p) => p.id === s.paletteId) ?? palettes[0];
  const base = s.primaryColor ? paletteFromPrimary(s.primaryColor) : [...palette.colors];
  const colors = segmentColors(base, s.prizes.length);
  const primary = s.primaryColor ?? (palette.id === "nuit" ? palette.colors[1] : palette.colors[0]);
  return {
    /** Couleurs de base : la roue en déduit une couleur par segment, quel que soit le nombre de lots. */
    base,
    colors,
    textColors: colors.map(readableOn),
    primary,
    onPrimary: readableOn(primary),
    /** Cerclage de la roue : la couleur principale assombrie. */
    rim: mix(primary, "#1D1A16", 0.4),
    monogram: monogramOf(s.name),
  };
}

/* ------------------------------------------------------------------ */
/* État du jeu selon l'offre                                           */
/* ------------------------------------------------------------------ */

export type GameState = "ouvert" | "pause" | "essai_termine" | "suspendu";

export function gameState(shop: Pick<Shop, "plan" | "trialEndsAt" | "settings">, now = new Date()): GameState {
  if (shop.plan === "paused") return "suspendu";
  if (shop.plan === "trial" && now.getTime() > new Date(shop.trialEndsAt).getTime()) return "essai_termine";
  if (!shop.settings.active) return "pause";
  return "ouvert";
}

/** Jours d'essai restants (0 si terminé). */
export function trialDaysLeft(shop: Pick<Shop, "trialEndsAt">, now = new Date()): number {
  return Math.max(0, Math.ceil((new Date(shop.trialEndsAt).getTime() - now.getTime()) / 86_400_000));
}

/** Le lien de réservation après le jeu est réservé à Croissance et Premium. */
export const hasBooking = (pack: PackId) => packFeatures(pack).booking;
/** La mention « Propulsé par Rouelia » disparaît en Premium. */
export const showsPoweredBy = (pack: PackId) => packFeatures(pack).poweredBy;

/** Partie publique, envoyée au téléphone du client. */
export function publicShop(shop: Shop, now = new Date()) {
  const s = withDefaults(shop.settings);
  const f = packFeatures(shop.pack);
  const wheel = activeWheel(s, shop.pack, now);
  return {
    slug: shop.slug,
    name: s.name,
    address: s.address,
    phone: s.phone,
    reviewUrl: s.reviewUrl,
    bookingUrl: hasBooking(shop.pack) ? s.bookingUrl : "",
    logoUrl: s.hasLogo ? `/api/j/${shop.slug}/logo?v=${s.logoVersion}` : null,
    poweredBy: showsPoweredBy(shop.pack),
    validityDays: s.validityDays,
    delayDays: s.delayDays,
    replayDays: s.replayDays,
    state: gameState(shop),
    theme: shopTheme({ ...s, prizes: wheel.prizes }),
    prizes: publicPrizes(wheel.prizes),
    instagramUrl: f.social ? s.instagramUrl : "",
    facebookUrl: f.social ? s.facebookUrl : "",
    referral: f.referral && s.referral.enabled ? s.referral.reward : null,
  };
}
export type PublicShop = ReturnType<typeof publicShop>;

export const publicPrizes = (prizes: ShopPrize[]) => prizes.map((p) => ({ id: p.id, name: p.name, icon: p.icon, big: p.big }));

/* ------------------------------------------------------------------ */
/* Création depuis une inscription                                     */
/* ------------------------------------------------------------------ */

export function slugify(name: string): string {
  const s = name
    .normalize("NFD")
    .replace(/[̀-ͯ]/g, "")
    .toLowerCase()
    .replace(/&/g, " et ")
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 40)
    .replace(/-+$/g, "");
  return s || "commerce";
}

/** Préfixe des codes : trois lettres du nom (« Salon Martine » donne SAL). */
export function codePrefixOf(slug: string): string {
  const letters = slug.replace(/[^a-z]/g, "").toUpperCase();
  return (letters + "ROU").slice(0, 3);
}

/** Les plus chers des lots rares deviennent les « gros cadeaux ». */
function guessBig(prizes: { cost: number; percent: number }[]): boolean[] {
  const sorted = [...prizes].map((p, i) => ({ ...p, i })).sort((a, b) => b.cost - a.cost);
  const big = new Set(sorted.filter((p) => p.percent <= 10).slice(0, 2).map((p) => p.i));
  return prizes.map((_, i) => big.has(i));
}

const TRIAL_DAYS = 14;
const LONG_TRIAL_DAYS = 21;

export function shopFromSignup(r: SignupRecord, id: string, slug: string, now: Date): Shop {
  const w = r.wheelConfig;
  const trade = trades.find((t) => t.id === (w?.trade ?? r.trade)) ?? trades.find((t) => t.id === "autre")!;
  const source = w && w.prizes.length >= MIN_PRIZES ? w.prizes : trade.prizes;
  const big = guessBig(source);
  const prizes: ShopPrize[] = source.slice(0, MAX_PRIZES).map((p, i) => ({
    id: `lot-${i + 1}`,
    name: p.name.slice(0, 30),
    detail: "",
    icon: prizeIconIds.includes(p.icon) ? p.icon : "cadeau",
    big: big[i],
    cost: p.cost,
    percent: p.percent,
  }));
  const settings = sanitizeSettings(
    { prizes },
    {
      active: true,
      name: (w?.shopName || r.shopName).slice(0, 60),
      address: r.establishment.address ?? "",
      phone: "",
      reviewUrl: "",
      bookingUrl: "",
      paletteId: w?.paletteId && palettes.some((p) => p.id === w.paletteId) ? w.paletteId : "tomette",
      primaryColor: w?.primaryColor ?? null,
      hasLogo: false,
      logoVersion: 0,
      prizes,
      validityDays: 30,
      delayDays: 1,
      replayDays: 30,
      schedules: [],
      referral: { enabled: false, reward: "Un cadeau surprise" },
      employees: [],
      instagramUrl: "",
      facebookUrl: "",
      profit: { basket: trade.simulator.averageBasket, margin: Math.round(trade.simulator.grossMargin * 100) },
    },
  );
  const longTrial = r.offer?.status === "applied" && r.offer.id === ("essai_21" satisfies OfferId);
  return {
    id,
    slug,
    email: r.email,
    firstName: r.firstName,
    phone: r.phone,
    signupId: r.id,
    pack: r.pack,
    plan: "trial",
    trialEndsAt: new Date(now.getTime() + (longTrial ? LONG_TRIAL_DAYS : TRIAL_DAYS) * 86_400_000).toISOString(),
    createdAt: now.toISOString(),
    offer: r.offer,
    codePrefix: codePrefixOf(slug),
    settings,
  };
}

