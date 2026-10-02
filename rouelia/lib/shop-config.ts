/** Commerces : types et règles pures, utilisables aussi dans le navigateur. */
import { palettes, trades, type OfferId, type PackId, type PrizeIcon } from "@/content";
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
export function sanitizeSettings(input: unknown, base: ShopSettings): ShopSettings {
  const c = (input ?? {}) as Record<string, unknown>;
  const raw = Array.isArray(c.prizes) ? c.prizes.slice(0, MAX_PRIZES) : base.prizes;
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
  if (prizes.length < MIN_PRIZES) prizes = base.prizes;
  const ids = new Set<string>();
  prizes.forEach((p, i) => {
    if (ids.has(p.id)) p.id = `${p.id}-${i}`;
    ids.add(p.id);
  });
  const sum = prizes.reduce((s, x) => s + x.percent, 0);
  const shares = roundToTotal(prizes.map((p) => (p.percent / sum) * 100), 100);
  prizes = prizes.map((p, i) => ({ ...p, percent: shares[i] }));
  const color = typeof c.primaryColor === "string" && /^#[0-9a-fA-F]{6}$/.test(c.primaryColor) ? c.primaryColor.toUpperCase() : null;

  return {
    active: c.active === undefined ? base.active : c.active === true,
    name: str(c.name, 60) || base.name,
    address: c.address === undefined ? base.address : str(c.address, 200),
    phone: c.phone === undefined ? base.phone : str(c.phone, 30),
    reviewUrl: c.reviewUrl === undefined ? base.reviewUrl : safeUrl(c.reviewUrl),
    bookingUrl: c.bookingUrl === undefined ? base.bookingUrl : safeUrl(c.bookingUrl),
    paletteId: palettes.some((p) => p.id === c.paletteId) ? (c.paletteId as string) : base.paletteId,
    primaryColor: c.primaryColor === undefined ? base.primaryColor : color,
    hasLogo: base.hasLogo,
    logoVersion: base.logoVersion,
    prizes,
    validityDays: clampInt(c.validityDays, 1, 365, base.validityDays),
    delayDays: clampInt(c.delayDays, 0, 30, base.delayDays),
    replayDays: clampInt(c.replayDays, 0, 365, base.replayDays),
  };
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
export const hasBooking = (pack: PackId) => pack !== "essentiel";
/** La mention « Propulsé par Rouelia » disparaît en Premium. */
export const showsPoweredBy = (pack: PackId) => pack !== "premium";

/** Partie publique, envoyée au téléphone du client. */
export function publicShop(shop: Shop) {
  const s = shop.settings;
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
    theme: shopTheme(s),
    prizes: s.prizes.map((p) => ({ id: p.id, name: p.name, icon: p.icon, big: p.big })),
  };
}
export type PublicShop = ReturnType<typeof publicShop>;

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

