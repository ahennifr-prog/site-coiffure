import { addDays, parisDay } from "@/lib/dates";
import { database } from "@/lib/db";
import { activeWheel, gameState, packFeatures, publicPrizes, withDefaults, type Shop } from "@/lib/shops";
import { isEmail, normalizeFrenchPhone } from "@/lib/signup";
import { pickWeighted } from "@/lib/wheel";

/** Une partie jouée par un client, avec son code cadeau. */
export interface Play {
  code: string;
  prizeId: string;
  prizeName: string;
  prizeDetail: string;
  big: boolean;
  cost: number;
  firstName: string;
  phone: string;
  /** Le client accepte d'être recontacté par le commerce. */
  marketing: boolean;
  /** E-mail facultatif : code envoyé et un rappel avant la date limite. */
  email?: string | null;
  reminderSent?: boolean;
  createdAt: string;
  /** Dates au format AAAA-MM-JJ, heure de Paris. */
  validFrom: string;
  expiresOn: string;
  redeemedAt: string | null;
  consentText: string;
  /** Roue qui a servi (habituelle, saison, heures creuses). */
  wheelName?: string;
  /** Prénom de l'employé qui a validé le retrait. */
  redeemedBy?: string | null;
  /** Code du client qui a invité celui-ci (parrainage). */
  referredBy?: string | null;
  /** Bonus de parrainage gagnés et pas encore retirés, et déjà retirés. */
  bonusAvailable?: number;
  bonusUsed?: number;
}

export const STAT_FIELDS = ["visites", "avis_ouverts", "avis_clics", "avis_fermes", "parties", "retraits", "deja_joue", "parrainages", "bonus_retires"] as const;
export type StatField = (typeof STAT_FIELDS)[number];

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";

export function newCode(prefix: string, rand: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < 5; i++) s += CODE_ALPHABET[Math.floor(rand() * CODE_ALPHABET.length)];
  return `${prefix}-${s}`;
}

/** Retrouve la forme exacte d'un code tapé en caisse : « sal7k4m2 », « SAL 7K4M2 » ou « 7K4M2 ». */
export function normalizeCode(input: string, prefix: string): string {
  const c = input.toUpperCase().replace(/[^A-Z0-9]/g, "");
  const body = c.startsWith(prefix) && c.length === prefix.length + 5 ? c.slice(prefix.length) : c;
  return `${prefix}-${body}`;
}

/* ------------------------------------------------------------------ */
/* Compteurs et limites                                                */
/* ------------------------------------------------------------------ */

export async function track(shopId: string, field: StatField, by = 1, now = new Date()) {
  const db = await database();
  await db
    .prepare("INSERT INTO stats (shop_id, day, field, n) VALUES (?, ?, ?, ?) ON CONFLICT (shop_id, day, field) DO UPDATE SET n = n + excluded.n")
    .bind(shopId, parisDay(now), field, by)
    .run();
}

/** Compte les essais par fenêtre d'une heure. Renvoie le nombre d'essais dans la fenêtre en cours. */
export async function hit(key: string, now = new Date()): Promise<number> {
  const db = await database();
  const win = now.toISOString().slice(0, 13);
  const row = await db
    .prepare("INSERT INTO rates (key, win, n) VALUES (?, ?, 1) ON CONFLICT (key) DO UPDATE SET n = CASE WHEN rates.win = excluded.win THEN rates.n + 1 ELSE 1 END, win = excluded.win RETURNING n")
    .bind(key, win)
    .first<{ n: number }>();
  return row?.n ?? 1;
}

export async function stats(shopId: string, days = 14, now = new Date()) {
  const db = await database();
  const today = parisDay(now);
  const from = addDays(today, -(days - 1));
  const totals = await db.prepare("SELECT field, SUM(n) AS n FROM stats WHERE shop_id = ? GROUP BY field").bind(shopId).all<{ field: string; n: number }>();
  const rows = await db.prepare("SELECT day, field, n FROM stats WHERE shop_id = ? AND day >= ?").bind(shopId, from).all<{ day: string; field: string; n: number }>();
  const total: Record<string, number> = Object.fromEntries(totals.results.map((r) => [r.field, Number(r.n)]));
  const perDay = Array.from({ length: days }, (_, i) => {
    const day = addDays(from, i);
    return { day, ...Object.fromEntries(rows.results.filter((r) => r.day === day).map((r) => [r.field, Number(r.n)])) } as { day: string } & Record<string, number>;
  });
  return { total, perDay };
}

/* ------------------------------------------------------------------ */
/* Parties                                                             */
/* ------------------------------------------------------------------ */

export type PlayError = "inactive" | "firstName" | "phone" | "consent" | "rate" | "email";
export type PlayResult =
  | { ok: true; already: boolean; play: Play; prizeIndex: number; prizes: ReturnType<typeof publicPrizes> }
  | { ok: false; error: PlayError };

async function playByCode(shopId: string, code: string): Promise<Play | null> {
  const db = await database();
  const row = await db.prepare("SELECT data, redeemed_at FROM plays WHERE shop_id = ? AND code = ?").bind(shopId, code).first<{ data: string; redeemed_at: string | null }>();
  return row ? { ...(JSON.parse(row.data) as Play), redeemedAt: row.redeemed_at } : null;
}

export async function play(
  shop: Shop,
  input: { firstName: unknown; phone: unknown; consent: unknown; consentText: unknown; marketing?: unknown; referrer?: unknown; email?: unknown },
  ip: string,
  now = new Date(),
  rand: () => number = Math.random,
): Promise<PlayResult> {
  if (gameState(shop, now) !== "ouvert") return { ok: false, error: "inactive" };
  const firstName = typeof input.firstName === "string" ? input.firstName.trim().slice(0, 40) : "";
  if (!firstName) return { ok: false, error: "firstName" };
  const phone = typeof input.phone === "string" ? normalizeFrenchPhone(input.phone) : null;
  if (!phone) return { ok: false, error: "phone" };
  if (input.consent !== true) return { ok: false, error: "consent" };
  const rawEmail = typeof input.email === "string" ? input.email.trim().toLowerCase() : "";
  if (rawEmail && !isEmail(rawEmail)) return { ok: false, error: "email" };
  if ((await hit(`jouer:${ip}`, now)) > 60) return { ok: false, error: "rate" };

  const db = await database();
  const s = withDefaults(shop.settings);
  // La roue en vigueur (saison, heures creuses) : le téléphone la reçoit pour tourner sur les bons segments.
  const wheel = activeWheel(s, shop.pack, now);
  const prizes = publicPrizes(wheel.prizes);
  const indexOf = (prizeId: string) => Math.max(0, wheel.prizes.findIndex((p) => p.id === prizeId));

  // Une partie par numéro sur la période choisie : on renvoie le code déjà gagné.
  if (s.replayDays > 0) {
    const lock = await db.prepare("SELECT code FROM play_locks WHERE shop_id = ? AND phone = ? AND until > ?").bind(shop.id, phone, now.toISOString()).first<{ code: string }>();
    const existing = lock ? await playByCode(shop.id, lock.code) : null;
    if (existing) {
      await track(shop.id, "deja_joue", 1, now);
      return { ok: true, already: true, play: existing, prizeIndex: indexOf(existing.prizeId), prizes };
    }
  }

  // Parrainage : le code d'un autre client du même commerce, avec un autre numéro.
  let referredBy: string | null = null;
  if (packFeatures(shop.pack).referral && s.referral.enabled && typeof input.referrer === "string" && input.referrer) {
    const ref = await playByCode(shop.id, normalizeCode(input.referrer.slice(0, 20), shop.codePrefix));
    if (ref && ref.phone !== phone) referredBy = ref.code;
  }

  const prizeIndex = pickWeighted(wheel.prizes, rand);
  const prize = wheel.prizes[prizeIndex];
  const today = parisDay(now);
  const validFrom = addDays(today, s.delayDays);
  const p: Play = {
    code: "",
    prizeId: prize.id,
    prizeName: prize.name,
    prizeDetail: prize.detail,
    big: prize.big,
    cost: prize.cost,
    firstName,
    phone,
    marketing: input.marketing === true,
    email: rawEmail || null,
    reminderSent: false,
    createdAt: now.toISOString(),
    validFrom,
    expiresOn: addDays(validFrom, s.validityDays),
    redeemedAt: null,
    consentText: typeof input.consentText === "string" ? input.consentText.slice(0, 800) : "",
    wheelName: wheel.name,
    redeemedBy: null,
    referredBy,
    bonusAvailable: 0,
    bonusUsed: 0,
  };

  // Code unique : on réessaie en cas de collision.
  for (let i = 0; i < 6 && !p.code; i++) {
    const code = newCode(shop.codePrefix, rand);
    const inserted = await db
      .prepare("INSERT INTO plays (code, shop_id, phone, created_at, expires_on, redeemed_at, data) VALUES (?, ?, ?, ?, ?, NULL, ?) ON CONFLICT (code) DO NOTHING RETURNING code")
      .bind(code, shop.id, phone, p.createdAt, p.expiresOn, JSON.stringify({ ...p, code }))
      .first<{ code: string }>();
    if (inserted) p.code = code;
  }
  if (!p.code) throw new Error("Impossible de créer un code unique");

  if (s.replayDays > 0) {
    const until = new Date(now.getTime() + s.replayDays * 86_400_000).toISOString();
    const locked = await db
      .prepare("INSERT INTO play_locks (shop_id, phone, code, until) VALUES (?, ?, ?, ?) ON CONFLICT (shop_id, phone) DO UPDATE SET code = excluded.code, until = excluded.until WHERE play_locks.until <= ? RETURNING code")
      .bind(shop.id, phone, p.code, until, now.toISOString())
      .first<{ code: string }>();
    if (!locked) {
      // Deux envois simultanés : on garde la première partie.
      await db.prepare("DELETE FROM plays WHERE code = ?").bind(p.code).run();
      const other = await db.prepare("SELECT code FROM play_locks WHERE shop_id = ? AND phone = ?").bind(shop.id, phone).first<{ code: string }>();
      const existing = other ? await playByCode(shop.id, other.code) : null;
      if (existing) return { ok: true, already: true, play: existing, prizeIndex: indexOf(existing.prizeId), prizes };
    }
  }
  await track(shop.id, "parties", 1, now);
  return { ok: true, already: false, play: p, prizeIndex, prizes };
}

export async function findPlay(shop: Shop, input: string): Promise<Play | null> {
  return playByCode(shop.id, normalizeCode(input, shop.codePrefix));
}

export type RedeemError = "introuvable" | "deja" | "expire" | "pas_encore";

const cleanName = (by: unknown) => (typeof by === "string" ? by.trim().slice(0, 30) : "") || null;

export async function redeem(shop: Shop, input: string, now = new Date(), by?: unknown): Promise<{ ok: true; play: Play } | { ok: false; error: RedeemError; play?: Play }> {
  const p = await findPlay(shop, input);
  if (!p) return { ok: false, error: "introuvable" };
  if (p.redeemedAt) return { ok: false, error: "deja", play: p };
  const today = parisDay(now);
  if (today > p.expiresOn) return { ok: false, error: "expire", play: p };
  if (today < p.validFrom) return { ok: false, error: "pas_encore", play: p };
  const db = await database();
  // Validation atomique : deux téléphones qui valident en même temps ne comptent qu'un retrait.
  const redeemedBy = cleanName(by);
  const done = await db
    .prepare("UPDATE plays SET redeemed_at = ?, data = json_set(data, '$.redeemedBy', ?) WHERE shop_id = ? AND code = ? AND redeemed_at IS NULL RETURNING code")
    .bind(now.toISOString(), redeemedBy, shop.id, p.code)
    .first<{ code: string }>();
  if (!done) return { ok: false, error: "deja", play: (await playByCode(shop.id, p.code)) ?? p };
  await track(shop.id, "retraits", 1, now);
  // L'ami invité est venu retirer son cadeau : son parrain gagne un bonus.
  if (p.referredBy) {
    await db
      .prepare("UPDATE plays SET data = json_set(data, '$.bonusAvailable', COALESCE(json_extract(data, '$.bonusAvailable'), 0) + 1) WHERE shop_id = ? AND code = ?")
      .bind(shop.id, p.referredBy)
      .run();
    await track(shop.id, "parrainages", 1, now);
  }
  return { ok: true, play: { ...p, redeemedAt: now.toISOString(), redeemedBy } };
}

/** Retire un bonus de parrainage disponible sur le code d'un client. */
export async function redeemBonus(shop: Shop, input: string, now = new Date(), by?: unknown): Promise<{ ok: true; play: Play } | { ok: false; error: "introuvable" | "aucun_bonus" }> {
  const p = await findPlay(shop, input);
  if (!p) return { ok: false, error: "introuvable" };
  const db = await database();
  const done = await db
    .prepare(
      "UPDATE plays SET data = json_set(data, '$.bonusAvailable', json_extract(data, '$.bonusAvailable') - 1, '$.bonusUsed', COALESCE(json_extract(data, '$.bonusUsed'), 0) + 1, '$.bonusLastBy', ?) WHERE shop_id = ? AND code = ? AND COALESCE(json_extract(data, '$.bonusAvailable'), 0) > 0 RETURNING code",
    )
    .bind(cleanName(by), shop.id, p.code)
    .first();
  if (!done) return { ok: false, error: "aucun_bonus" };
  await track(shop.id, "bonus_retires", 1, now);
  return { ok: true, play: (await playByCode(shop.id, p.code)) ?? p };
}

/** Annule un retrait fait par erreur. */
export async function unredeem(shop: Shop, input: string, now = new Date()): Promise<Play | null> {
  const p = await findPlay(shop, input);
  if (!p || !p.redeemedAt) return p;
  const db = await database();
  const done = await db
    .prepare("UPDATE plays SET redeemed_at = NULL, data = json_set(data, '$.redeemedBy', NULL) WHERE shop_id = ? AND code = ? AND redeemed_at IS NOT NULL RETURNING code")
    .bind(shop.id, p.code)
    .first();
  if (done) {
    await track(shop.id, "retraits", -1, now);
    // Le bonus du parrain est repris s'il n'a pas encore été utilisé.
    if (p.referredBy) {
      const back = await db
        .prepare("UPDATE plays SET data = json_set(data, '$.bonusAvailable', json_extract(data, '$.bonusAvailable') - 1) WHERE shop_id = ? AND code = ? AND COALESCE(json_extract(data, '$.bonusAvailable'), 0) > 0 RETURNING code")
        .bind(shop.id, p.referredBy)
        .first();
      if (back) await track(shop.id, "parrainages", -1, now);
    }
  }
  return { ...p, redeemedAt: null, redeemedBy: null };
}

/** Parties du commerce, les plus récentes d'abord. Supprime au passage celles expirées depuis plus d'un an. */
export async function listPlays(shop: Shop, limit = 2000, now = new Date()): Promise<Play[]> {
  const db = await database();
  await db.prepare("DELETE FROM plays WHERE shop_id = ? AND expires_on < ?").bind(shop.id, addDays(parisDay(now), -365)).run();
  const { results } = await db
    .prepare("SELECT data, redeemed_at FROM plays WHERE shop_id = ? ORDER BY created_at DESC LIMIT ?")
    .bind(shop.id, limit)
    .all<{ data: string; redeemed_at: string | null }>();
  return results.map((r) => ({ ...(JSON.parse(r.data) as Play), redeemedAt: r.redeemed_at }));
}

/** Cadeaux à rappeler par e-mail : non retirés, avec e-mail, qui expirent le jour donné. */
export async function playsToRemind(expiresOn: string): Promise<{ shopId: string; play: Play }[]> {
  const db = await database();
  const { results } = await db
    .prepare(
      "SELECT shop_id, data FROM plays WHERE expires_on = ? AND redeemed_at IS NULL AND json_extract(data, '$.email') IS NOT NULL AND COALESCE(json_extract(data, '$.reminderSent'), 0) = 0 LIMIT 2000",
    )
    .bind(expiresOn)
    .all<{ shop_id: string; data: string }>();
  return results.map((r) => ({ shopId: r.shop_id, play: JSON.parse(r.data) as Play }));
}

export async function markReminded(shopId: string, code: string): Promise<void> {
  const db = await database();
  await db.prepare("UPDATE plays SET data = json_set(data, '$.reminderSent', json('true')) WHERE shop_id = ? AND code = ?").bind(shopId, code).run();
}

/** Chiffres d'une période pour le rapport hebdomadaire (jours AAAA-MM-JJ inclus). */
export async function periodNumbers(shopId: string, from: string, to: string, today: string) {
  const db = await database();
  const { results } = await db.prepare("SELECT field, SUM(n) AS n FROM stats WHERE shop_id = ? AND day >= ? AND day <= ? GROUP BY field").bind(shopId, from, to).all<{ field: string; n: number }>();
  const t = Object.fromEntries(results.map((r) => [r.field, Number(r.n)])) as Record<string, number>;
  const pending = await db
    .prepare("SELECT COUNT(*) AS n, SUM(CASE WHEN expires_on <= ? THEN 1 ELSE 0 END) AS soon FROM plays WHERE shop_id = ? AND redeemed_at IS NULL AND expires_on >= ?")
    .bind(addDays(today, 7), shopId, today)
    .first<{ n: number; soon: number | null }>();
  return {
    visites: t.visites ?? 0,
    parties: t.parties ?? 0,
    avisClics: t.avis_clics ?? 0,
    retraits: t.retraits ?? 0,
    enAttente: Number(pending?.n ?? 0),
    expirentBientot: Number(pending?.soon ?? 0),
  };
}
