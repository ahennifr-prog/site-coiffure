import type { GameConfig, Prize, PrizeIcon, Tier } from "@/lib/types";
import { distribute, roundToTotal } from "@/lib/wheel";

export const SALON = {
  name: "ALIA coiffure",
  city: "Champigny-sur-Marne",
  address: "17 avenue du Général de Gaulle, 94500 Champigny-sur-Marne",
  phone: "01 43 97 39 89",
  phoneHref: "tel:+33143973989",
  hours: "Ouvert 7 j/7, de 10 h à 19 h",
  instagram: "https://www.instagram.com/_aliacoiffureofficial/",
};

export const MIN_PRIZES = 3;
export const MAX_PRIZES = 8;
export const ICONS: PrizeIcon[] = ["cadeau", "pourcent", "goutte", "ciseaux", "etoile", "coeur", "couronne", "eclat"];

/** Lien direct « Laisser un avis » de la fiche Google du salon (identifiant de lieu Google). */
export const DEFAULT_REVIEW_URL = "https://search.google.com/local/writereview?placeid=ChIJV3ER3hoN5kcRXu6wMO8hfYI";

export const DEFAULT_CONFIG: GameConfig = {
  active: true,
  reviewUrl: DEFAULT_REVIEW_URL,
  bookingUrl: "https://www.planity.com/alia-coiffure-94500-champigny-sur-marne",
  validityDays: 30,
  delayDays: 1,
  replayDays: 30,
  updatedAt: null,
  prizes: [
    { id: "soin", name: "Soin offert", detail: "Un soin offert avec votre prochaine prestation.", icon: "goutte", tier: "petit", cost: 5, percent: 30 },
    { id: "moins10", name: "-10 % prochaine visite", detail: "-10 % sur votre prochaine prestation.", icon: "pourcent", tier: "petit", cost: 4, percent: 30 },
    { id: "moins5", name: "-5 € offerts", detail: "5 € de réduction sur votre prochaine prestation.", icon: "cadeau", tier: "petit", cost: 5, percent: 25 },
    { id: "patine", name: "Patine offerte", detail: "Une patine offerte (valeur 25 €).", icon: "eclat", tier: "gros", cost: 25, percent: 8 },
    { id: "coupe", name: "Coupe offerte", detail: "Une coupe simple offerte (valeur 15 €).", icon: "ciseaux", tier: "gros", cost: 15, percent: 5 },
    { id: "lissage", name: "-30 % lissage", detail: "-30 % sur un lissage brésilien.", icon: "couronne", tier: "gros", cost: 36, percent: 2 },
  ],
};

const clampInt = (v: unknown, min: number, max: number, dflt: number) => {
  const n = typeof v === "number" ? v : Number(v);
  return Number.isFinite(n) ? Math.min(max, Math.max(min, Math.round(n))) : dflt;
};
const str = (v: unknown, max: number, dflt = "") => (typeof v === "string" ? v.trim().slice(0, max) : dflt);

function safeUrl(v: unknown, dflt: string): string {
  const s = str(v, 600);
  try {
    const u = new URL(s);
    return u.protocol === "https:" || u.protocol === "http:" ? u.toString() : dflt;
  } catch {
    return dflt;
  }
}

/** Valide une configuration reçue de l'espace gestion. La somme des chances est ramenée à 100. */
export function sanitizeConfig(input: unknown, base: GameConfig = DEFAULT_CONFIG): GameConfig {
  const c = (input ?? {}) as Record<string, unknown>;
  const raw = Array.isArray(c.prizes) ? c.prizes.slice(0, MAX_PRIZES) : base.prizes;
  let prizes: Prize[] = raw.map((p, i) => {
    const q = (p ?? {}) as Record<string, unknown>;
    return {
      id: str(q.id, 40) || `lot-${i + 1}`,
      name: str(q.name, 30) || `Cadeau ${i + 1}`,
      detail: str(q.detail, 140),
      icon: ICONS.includes(q.icon as PrizeIcon) ? (q.icon as PrizeIcon) : "cadeau",
      tier: (q.tier === "gros" ? "gros" : "petit") as Tier,
      cost: Math.max(0, Math.min(9999, Number(q.cost) || 0)),
      percent: Math.max(1, Number(q.percent) || 1),
    };
  });
  if (prizes.length < MIN_PRIZES) prizes = base.prizes;
  const ids = new Set<string>();
  prizes.forEach((p, i) => {
    if (ids.has(p.id)) p.id = `${p.id}-${i}`;
    ids.add(p.id);
  });
  const shares = roundToTotal(
    prizes.map((p) => (p.percent / prizes.reduce((s, x) => s + x.percent, 0)) * 100),
    100,
  );
  prizes = prizes.map((p, i) => ({ ...p, percent: shares[i] }));

  return {
    active: c.active === undefined ? base.active : c.active === true,
    reviewUrl: safeUrl(c.reviewUrl, base.reviewUrl),
    bookingUrl: safeUrl(c.bookingUrl, base.bookingUrl),
    validityDays: clampInt(c.validityDays, 1, 365, base.validityDays),
    delayDays: clampInt(c.delayDays, 0, 30, base.delayDays),
    replayDays: clampInt(c.replayDays, 0, 365, base.replayDays),
    prizes,
    updatedAt: new Date().toISOString(),
  };
}

export function tierTotal(prizes: Pick<Prize, "tier" | "percent">[], tier: Tier): number {
  return prizes.filter((p) => p.tier === tier).reduce((s, p) => s + p.percent, 0);
}

/**
 * Règle la part totale des gros cadeaux (ex. 15 %). Les gros cadeaux se partagent cette part
 * et les petits le reste, chacun gardant ses proportions. Le total reste 100.
 */
export function setBigRate<T extends Pick<Prize, "tier" | "percent">>(prizes: T[], rate: number): T[] {
  const big = prizes.map((p, i) => ({ p, i })).filter(({ p }) => p.tier === "gros");
  const small = prizes.map((p, i) => ({ p, i })).filter(({ p }) => p.tier === "petit");
  if (big.length === 0 || small.length === 0) return prizes;
  const r = Math.round(Math.min(100 - small.length, Math.max(big.length, rate)));
  const bigShares = distribute(big.map(({ p }) => p.percent), r);
  const smallShares = distribute(small.map(({ p }) => p.percent), 100 - r);
  const next = prizes.map((p) => ({ ...p }));
  big.forEach(({ i }, k) => (next[i].percent = bigShares[k]));
  small.forEach(({ i }, k) => (next[i].percent = smallShares[k]));
  return next;
}

/** Partie publique de la configuration, envoyée au téléphone de la cliente. */
export function publicConfig(c: GameConfig) {
  return {
    active: c.active,
    reviewUrl: c.reviewUrl,
    bookingUrl: c.bookingUrl,
    validityDays: c.validityDays,
    delayDays: c.delayDays,
    replayDays: c.replayDays,
    prizes: c.prizes.map((p) => ({ id: p.id, name: p.name, icon: p.icon, tier: p.tier })),
  };
}
export type PublicConfig = ReturnType<typeof publicConfig>;
