import type { PackId, PrizeIcon, TradeId } from "@/content";
import type { Establishment } from "@/lib/places";

export const PACK_IDS: PackId[] = ["essentiel", "croissance", "premium"];
export const TRADE_IDS: TradeId[] = ["coiffeur", "restaurant", "institut", "boulangerie", "bar", "autre"];

/** Configuration de la roue telle qu'elle est transmise à l'inscription. */
export interface WheelConfig {
  shopName: string;
  trade: TradeId;
  paletteId: string;
  primaryColor: string | null;
  /** Logo en data URL, présent seulement si le commerçant l'a gardé. */
  logo: string | null;
  noLogo: boolean;
  prizes: { name: string; icon: PrizeIcon; cost: number; percent: number; hasImage: boolean }[];
  averageCost: number;
}

export interface Utm {
  source: string | null;
  medium: string | null;
  campaign: string | null;
  term: string | null;
  content: string | null;
  referrer: string | null;
  landingPath: string | null;
}

/** Ce que le formulaire envoie. */
export interface SignupPayload {
  firstName: string;
  email: string;
  phone: string;
  establishment: Establishment;
  pack: PackId;
  wheel: WheelConfig | null;
  utm: Utm;
  consent: { accepted: boolean; text: string };
}

/** Enregistrement complet, prêt pour une base de données et pour Stripe. */
export const SIGNUP_STATUSES = ["essai_en_attente", "essai_en_cours", "client", "perdu"] as const;
export type SignupStatus = (typeof SIGNUP_STATUSES)[number];

export interface SignupRecord {
  id: string;
  createdAt: string;
  firstName: string;
  email: string;
  phone: string;
  shopName: string;
  establishment: Establishment;
  trade: TradeId | null;
  pack: PackId;
  wheelConfig: WheelConfig | null;
  utm: Utm;
  consent: { accepted: true; date: string; text: string };
  status: SignupStatus;
  trialStartedAt: string | null;
  firstPlayAt: string | null;
  stripeCustomerId: string | null;
}

export type SignupField = "firstName" | "email" | "phone" | "shopName" | "consent";
export type SignupErrorKey =
  | "firstName"
  | "emailMissing"
  | "emailInvalid"
  | "phoneMissing"
  | "phoneInvalid"
  | "shopName"
  | "consent";

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;

/**
 * Normalise un numéro français au format international +33XXXXXXXXX.
 * Accepte « 06 12 34 56 78 », « 6 12 34 56 78 », « +33 6 12 34 56 78 », « 0033612345678 ».
 * Renvoie null si le numéro n'est pas valide.
 */
export function normalizeFrenchPhone(input: string): string | null {
  let digits = input.replace(/[\s.\-()]/g, "");
  if (digits.startsWith("+33")) digits = digits.slice(3);
  else if (digits.startsWith("0033")) digits = digits.slice(4);
  if (!/^\d+$/.test(digits)) return null;
  if (digits.length === 10 && digits.startsWith("0")) digits = digits.slice(1);
  if (digits.length !== 9 || digits.startsWith("0")) return null;
  return `+33${digits}`;
}

export function validateSignup(p: {
  firstName: string;
  email: string;
  phone: string;
  shopName: string;
  consent: boolean;
}): Partial<Record<SignupField, SignupErrorKey>> {
  const errors: Partial<Record<SignupField, SignupErrorKey>> = {};
  if (!p.firstName.trim()) errors.firstName = "firstName";
  const email = p.email.trim();
  if (!email) errors.email = "emailMissing";
  else if (!EMAIL_RE.test(email)) errors.email = "emailInvalid";
  if (!p.phone.trim()) errors.phone = "phoneMissing";
  else if (!normalizeFrenchPhone(p.phone)) errors.phone = "phoneInvalid";
  if (!p.shopName.trim()) errors.shopName = "shopName";
  if (!p.consent) errors.consent = "consent";
  return errors;
}

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.slice(0, max) : "");
const strOrNull = (v: unknown, max = 200) => (typeof v === "string" && v ? v.slice(0, max) : null);

/**
 * Valide un corps de requête inconnu et construit l'enregistrement.
 * Renvoie les erreurs si le contenu n'est pas acceptable.
 */
export function buildRecord(
  body: unknown,
  now: Date,
  id: string,
): { ok: true; record: SignupRecord } | { ok: false; errors: Partial<Record<SignupField, SignupErrorKey>> | "invalid" } {
  if (!body || typeof body !== "object") return { ok: false, errors: "invalid" };
  const b = body as Record<string, unknown>;
  const est = (b.establishment ?? {}) as Record<string, unknown>;
  const consent = (b.consent ?? {}) as Record<string, unknown>;
  const shopName = str(est.name, 120).trim();

  const errors = validateSignup({
    firstName: str(b.firstName, 80),
    email: str(b.email, 200),
    phone: str(b.phone, 30),
    shopName,
    consent: consent.accepted === true && typeof consent.text === "string" && consent.text.length > 0,
  });
  if (Object.keys(errors).length > 0) return { ok: false, errors };

  const pack = PACK_IDS.includes(b.pack as PackId) ? (b.pack as PackId) : null;
  if (!pack) return { ok: false, errors: "invalid" };

  const wheel = sanitizeWheel(b.wheel);
  const utm = (b.utm ?? {}) as Record<string, unknown>;

  return {
    ok: true,
    record: {
      id,
      createdAt: now.toISOString(),
      firstName: str(b.firstName, 80).trim(),
      email: str(b.email, 200).trim().toLowerCase(),
      phone: normalizeFrenchPhone(str(b.phone, 30)) as string,
      shopName,
      establishment: {
        name: shopName,
        placeId: strOrNull(est.placeId),
        address: strOrNull(est.address, 300),
        googleMapsUrl: strOrNull(est.googleMapsUrl, 500),
      },
      trade: wheel?.trade ?? null,
      pack,
      wheelConfig: wheel,
      utm: {
        source: strOrNull(utm.source),
        medium: strOrNull(utm.medium),
        campaign: strOrNull(utm.campaign),
        term: strOrNull(utm.term),
        content: strOrNull(utm.content),
        referrer: strOrNull(utm.referrer, 500),
        landingPath: strOrNull(utm.landingPath, 500),
      },
      consent: { accepted: true, date: now.toISOString(), text: str(consent.text, 1000) },
      status: "essai_en_attente",
      trialStartedAt: null,
      firstPlayAt: null,
      stripeCustomerId: null,
    },
  };
}

/** Une ligne de base D1 est limitée à 2 Mo : au-delà, le logo n'est pas conservé (il sera redemandé). */
const MAX_LOGO_CHARS = 1_500_000;

function sanitizeWheel(v: unknown): WheelConfig | null {
  if (!v || typeof v !== "object") return null;
  const w = v as Record<string, unknown>;
  const trade = TRADE_IDS.includes(w.trade as TradeId) ? (w.trade as TradeId) : "autre";
  const prizes = Array.isArray(w.prizes) ? w.prizes.slice(0, 8) : [];
  const logo = typeof w.logo === "string" && w.logo.startsWith("data:image/") && w.logo.length < MAX_LOGO_CHARS ? w.logo : null;
  return {
    shopName: str(w.shopName, 120),
    trade,
    paletteId: str(w.paletteId, 40),
    primaryColor: typeof w.primaryColor === "string" && /^#[0-9a-fA-F]{6}$/.test(w.primaryColor) ? w.primaryColor : null,
    logo,
    noLogo: w.noLogo === true,
    prizes: prizes.map((p) => {
      const q = (p ?? {}) as Record<string, unknown>;
      return {
        name: str(q.name, 60),
        icon: str(q.icon, 20) as PrizeIcon,
        cost: typeof q.cost === "number" && Number.isFinite(q.cost) ? Math.max(0, q.cost) : 0,
        percent: typeof q.percent === "number" && Number.isFinite(q.percent) ? q.percent : 0,
        hasImage: q.hasImage === true,
      };
    }),
    averageCost: typeof w.averageCost === "number" && Number.isFinite(w.averageCost) ? w.averageCost : 0,
  };
}

/** Version journalisable : sans le contenu binaire du logo. */
export function forLog(record: SignupRecord): SignupRecord {
  if (!record.wheelConfig?.logo) return record;
  const kb = Math.round((record.wheelConfig.logo.length * 3) / 4 / 1024);
  return { ...record, wheelConfig: { ...record.wheelConfig, logo: `[image ${kb} ko]` } };
}
