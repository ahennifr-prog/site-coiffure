import { DEFAULT_CONFIG, sanitizeConfig } from "@/lib/config";
import { addDays, parisDay } from "@/lib/dates";
import { normalizeFrenchPhone } from "@/lib/phone";
import { kv } from "@/lib/store";
import type { GameConfig, Play, StatField } from "@/lib/types";
import { pickWeighted } from "@/lib/wheel";

const K = {
  config: "alia:config",
  play: (code: string) => `alia:play:${code}`,
  plays: "alia:plays",
  lock: (phone: string) => `alia:lock:${phone}`,
  stats: "alia:stats",
  day: (d: string) => `alia:day:${d}`,
  rate: (ip: string) => `alia:rl:${ip}`,
};

export async function getConfig(): Promise<GameConfig> {
  const c = await kv().get<GameConfig>(K.config);
  return c ? sanitizeConfig(c, DEFAULT_CONFIG) : DEFAULT_CONFIG;
}

export async function saveConfig(input: unknown): Promise<GameConfig> {
  const current = await getConfig();
  const next = sanitizeConfig(input, current);
  await kv().set(K.config, next);
  return next;
}

export async function track(field: StatField, by = 1) {
  const store = kv();
  const day = K.day(parisDay());
  await Promise.all([store.hincrby(K.stats, field, by), store.hincrby(day, field, by)]);
  await store.expire(day, 60 * 60 * 24 * 120);
}

const CODE_ALPHABET = "23456789ABCDEFGHJKMNPQRSTUVWXYZ";
export function newCode(rand: () => number = Math.random): string {
  let s = "";
  for (let i = 0; i < 5; i++) s += CODE_ALPHABET[Math.floor(rand() * CODE_ALPHABET.length)];
  return `ALIA-${s}`;
}

export type PlayResult =
  | { ok: true; already: false; play: Play; prizeIndex: number }
  | { ok: true; already: true; play: Play; prizeIndex: number }
  | { ok: false; error: "inactive" | "firstName" | "phone" | "consent" | "rate" };

export async function play(
  input: { firstName: unknown; phone: unknown; consent: unknown; consentText: unknown },
  ip: string,
  now = new Date(),
  rand: () => number = Math.random,
): Promise<PlayResult> {
  const config = await getConfig();
  if (!config.active) return { ok: false, error: "inactive" };
  const firstName = typeof input.firstName === "string" ? input.firstName.trim().slice(0, 40) : "";
  if (!firstName) return { ok: false, error: "firstName" };
  const phone = typeof input.phone === "string" ? normalizeFrenchPhone(input.phone) : null;
  if (!phone) return { ok: false, error: "phone" };
  if (input.consent !== true) return { ok: false, error: "consent" };

  const store = kv();
  if ((await store.incr(K.rate(ip), 3600)) > 60) return { ok: false, error: "rate" };

  // Une partie par numéro sur la période choisie : on renvoie le code déjà gagné.
  const existingCode = config.replayDays > 0 ? await store.get<string>(K.lock(phone)) : null;
  if (existingCode) {
    const existing = await store.get<Play>(K.play(existingCode));
    if (existing) {
      await track("deja_joue");
      const idx = config.prizes.findIndex((p) => p.id === existing.prizeId);
      return { ok: true, already: true, play: existing, prizeIndex: Math.max(0, idx) };
    }
  }

  const prizeIndex = pickWeighted(config.prizes, rand);
  const prize = config.prizes[prizeIndex];
  let code = newCode(rand);
  for (let i = 0; i < 5 && !(await store.set(K.play(code), "reserve", { nx: true, ex: 60 })); i++) code = newCode(rand);

  const today = parisDay(now);
  const validFrom = addDays(today, config.delayDays);
  const p: Play = {
    code,
    prizeId: prize.id,
    prizeName: prize.name,
    prizeDetail: prize.detail,
    tier: prize.tier,
    cost: prize.cost,
    firstName,
    phone,
    createdAt: now.toISOString(),
    validFrom,
    expiresOn: addDays(validFrom, config.validityDays),
    redeemedAt: null,
    consentText: typeof input.consentText === "string" ? input.consentText.slice(0, 600) : "",
  };

  if (config.replayDays > 0) {
    const locked = await store.set(K.lock(phone), code, { nx: true, ex: config.replayDays * 86400 });
    if (!locked) {
      // Deux envois simultanés : on renvoie la partie déjà enregistrée.
      await store.del(K.play(code));
      const other = await store.get<string>(K.lock(phone));
      const existing = other ? await store.get<Play>(K.play(other)) : null;
      if (existing) return { ok: true, already: true, play: existing, prizeIndex: Math.max(0, config.prizes.findIndex((x) => x.id === existing.prizeId)) };
    }
  }
  // Conservation : validité + 1 an, puis suppression automatique.
  await store.set(K.play(code), p, { ex: (config.delayDays + config.validityDays + 365) * 86400 });
  await store.zadd(K.plays, now.getTime(), code);
  await track("parties");
  return { ok: true, already: false, play: p, prizeIndex };
}

export async function findPlay(code: string): Promise<Play | null> {
  const c = code.trim().toUpperCase().replace(/\s+/g, "");
  const full = c.startsWith("ALIA-") ? c : c.startsWith("ALIA") ? `ALIA-${c.slice(4)}` : `ALIA-${c}`;
  return kv().get<Play>(K.play(full));
}

export async function redeem(code: string, now = new Date()): Promise<{ ok: true; play: Play } | { ok: false; error: "introuvable" | "deja" | "expire" | "pas_encore"; play?: Play }> {
  const p = await findPlay(code);
  if (!p) return { ok: false, error: "introuvable" };
  if (p.redeemedAt) return { ok: false, error: "deja", play: p };
  const today = parisDay(now);
  if (today > p.expiresOn) return { ok: false, error: "expire", play: p };
  if (today < p.validFrom) return { ok: false, error: "pas_encore", play: p };
  const next = { ...p, redeemedAt: now.toISOString() };
  await kv().set(K.play(p.code), next, { ex: 365 * 86400 });
  await track("retraits");
  return { ok: true, play: next };
}

/** Annule un retrait fait par erreur. */
export async function unredeem(code: string): Promise<Play | null> {
  const p = await findPlay(code);
  if (!p || !p.redeemedAt) return p;
  const next = { ...p, redeemedAt: null };
  await kv().set(K.play(p.code), next, { ex: 365 * 86400 });
  await track("retraits", -1);
  return next;
}

export async function listPlays(limit = 500): Promise<Play[]> {
  const codes = await kv().zrevrange(K.plays, 0, limit - 1);
  const plays = await kv().mget<Play>(codes.map(K.play));
  return plays.filter((p): p is Play => !!p && typeof p === "object");
}

export async function stats(days = 14) {
  const store = kv();
  const total = await store.hgetall(K.stats);
  const today = parisDay();
  const list = Array.from({ length: days }, (_, i) => addDays(today, -(days - 1 - i)));
  const perDay = await Promise.all(list.map(async (d) => ({ day: d, ...(await store.hgetall(K.day(d))) })));
  return { total, perDay };
}
