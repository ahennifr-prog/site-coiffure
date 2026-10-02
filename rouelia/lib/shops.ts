import { database } from "@/lib/db";
import type { Shop } from "@/lib/shop-config";

export * from "@/lib/shop-config";

/** Ce que la base garde à côté du commerce, jamais envoyé au navigateur. */
interface ShopRow {
  id: string;
  data: string;
  pwd_hash: string | null;
  invite_hash: string | null;
  invite_expires: string | null;
  session_version: number;
}

/* ------------------------------------------------------------------ */
/* Base de données                                                     */
/* ------------------------------------------------------------------ */

const parse = (row: { data: string } | null) => (row ? (JSON.parse(row.data) as Shop) : null);

export async function uniqueSlug(base: string): Promise<string> {
  const db = await database();
  for (let i = 1; i < 100; i++) {
    const slug = i === 1 ? base : `${base}-${i}`;
    const taken = await db.prepare("SELECT 1 AS x FROM shops WHERE slug = ?").bind(slug).first();
    if (!taken) return slug;
  }
  return `${base}-${Date.now().toString(36)}`;
}

export async function insertShop(shop: Shop): Promise<void> {
  const db = await database();
  await db
    .prepare("INSERT INTO shops (id, slug, email, created_at, data) VALUES (?, ?, ?, ?, ?)")
    .bind(shop.id, shop.slug, shop.email, shop.createdAt, JSON.stringify(shop))
    .run();
}

export async function saveShop(shop: Shop): Promise<void> {
  const db = await database();
  await db.prepare("UPDATE shops SET data = ?, email = ? WHERE id = ?").bind(JSON.stringify(shop), shop.email, shop.id).run();
}

export async function getShop(id: string): Promise<Shop | null> {
  const db = await database();
  return parse(await db.prepare("SELECT data FROM shops WHERE id = ?").bind(id).first<{ data: string }>());
}

export async function getShopBySlug(slug: string): Promise<Shop | null> {
  const db = await database();
  return parse(await db.prepare("SELECT data FROM shops WHERE slug = ?").bind(slug.toLowerCase()).first<{ data: string }>());
}

export async function listShops(): Promise<(Shop & { hasPassword: boolean })[]> {
  const db = await database();
  const { results } = await db.prepare("SELECT data, pwd_hash FROM shops ORDER BY created_at DESC").all<{ data: string; pwd_hash: string | null }>();
  return results.map((r) => ({ ...(JSON.parse(r.data) as Shop), hasPassword: !!r.pwd_hash }));
}

export async function setLogo(shop: Shop, dataUrl: string | null, now = new Date()): Promise<Shop> {
  const db = await database();
  if (dataUrl) {
    await db
      .prepare("INSERT INTO shop_logos (shop_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT (shop_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
      .bind(shop.id, dataUrl, now.toISOString())
      .run();
  } else {
    await db.prepare("DELETE FROM shop_logos WHERE shop_id = ?").bind(shop.id).run();
  }
  const next = { ...shop, settings: { ...shop.settings, hasLogo: !!dataUrl, logoVersion: shop.settings.logoVersion + 1 } };
  await saveShop(next);
  return next;
}

export async function getLogo(shopId: string): Promise<string | null> {
  const db = await database();
  const row = await db.prepare("SELECT data FROM shop_logos WHERE shop_id = ?").bind(shopId).first<{ data: string }>();
  return row?.data ?? null;
}

/* ------------------------------------------------------------------ */
/* Mots de passe, invitations et sessions                              */
/* ------------------------------------------------------------------ */

const ITERATIONS = 100_000;
const b64 = (buf: ArrayBuffer | Uint8Array) => Buffer.from(buf instanceof Uint8Array ? buf : new Uint8Array(buf)).toString("base64url");

async function pbkdf2(password: string, salt: Uint8Array, iterations: number): Promise<string> {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(password), "PBKDF2", false, ["deriveBits"]);
  const bits = await crypto.subtle.deriveBits({ name: "PBKDF2", hash: "SHA-256", salt: salt as BufferSource, iterations }, key, 256);
  return b64(bits);
}

export async function hashPassword(password: string): Promise<string> {
  const salt = crypto.getRandomValues(new Uint8Array(16));
  return `pbkdf2$${ITERATIONS}$${b64(salt)}$${await pbkdf2(password, salt, ITERATIONS)}`;
}

export async function verifyPassword(password: string, stored: string | null): Promise<boolean> {
  if (!stored) return false;
  const [kind, iter, salt, hash] = stored.split("$");
  if (kind !== "pbkdf2" || !salt || !hash) return false;
  const got = await pbkdf2(password, new Uint8Array(Buffer.from(salt, "base64url")), Number(iter));
  return got.length === hash.length && Buffer.from(got).equals(Buffer.from(hash));
}

export const MIN_PASSWORD = 8;

async function sha256(text: string): Promise<string> {
  return b64(await crypto.subtle.digest("SHA-256", new TextEncoder().encode(text)));
}

const INVITE_DAYS = 14;

/** Nouveau lien d'invitation : il permet de choisir (ou de changer) le mot de passe. L'ancien ne marche plus. */
export async function createInvite(shopId: string, now = new Date()): Promise<string> {
  const token = b64(crypto.getRandomValues(new Uint8Array(24)));
  const db = await database();
  await db
    .prepare("UPDATE shops SET invite_hash = ?, invite_expires = ? WHERE id = ?")
    .bind(await sha256(token), new Date(now.getTime() + INVITE_DAYS * 86_400_000).toISOString(), shopId)
    .run();
  return token;
}

export async function shopForInvite(token: string, now = new Date()): Promise<Shop | null> {
  if (!token || token.length > 100) return null;
  const db = await database();
  const row = await db.prepare("SELECT data, invite_expires FROM shops WHERE invite_hash = ?").bind(await sha256(token)).first<{ data: string; invite_expires: string }>();
  if (!row || new Date(row.invite_expires).getTime() < now.getTime()) return null;
  return parse(row);
}

/** Enregistre le mot de passe, invalide le lien et les anciennes sessions. Renvoie la nouvelle version de session. */
export async function setPassword(shopId: string, password: string): Promise<number> {
  const db = await database();
  const row = await db
    .prepare("UPDATE shops SET pwd_hash = ?, invite_hash = NULL, invite_expires = NULL, session_version = session_version + 1 WHERE id = ? RETURNING session_version")
    .bind(await hashPassword(password), shopId)
    .first<{ session_version: number }>();
  return row?.session_version ?? 1;
}

/** Connexion par e-mail et mot de passe. Un même e-mail peut avoir plusieurs commerces : on prend celui dont le mot de passe correspond. */
export async function login(email: string, password: string): Promise<{ shop: Shop; version: number } | null> {
  const db = await database();
  const { results } = await db
    .prepare("SELECT id, data, pwd_hash, invite_hash, invite_expires, session_version FROM shops WHERE email = ? ORDER BY created_at DESC")
    .bind(email.trim().toLowerCase())
    .all<ShopRow>();
  for (const r of results) {
    if (await verifyPassword(password, r.pwd_hash)) return { shop: JSON.parse(r.data) as Shop, version: r.session_version };
  }
  return null;
}

export async function sessionVersion(shopId: string): Promise<number | null> {
  const db = await database();
  const row = await db.prepare("SELECT session_version FROM shops WHERE id = ?").bind(shopId).first<{ session_version: number }>();
  return row?.session_version ?? null;
}

