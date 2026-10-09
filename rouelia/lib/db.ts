import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { SignupRecord, SignupStatus } from "@/lib/signup";

/** Sous-ensemble de l'API D1 de Cloudflare utilisé ici. */
export interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}
export interface D1Like {
  prepare(sql: string): D1Statement;
}

const g = globalThis as unknown as { __roueliaMemory?: SignupRecord[]; __roueliaSchema?: boolean; __roueliaTestDb?: D1Like | null };

/** Tables créées au premier usage (inscriptions, commerces, parties, compteurs). */
const SCHEMA = [
  `CREATE TABLE IF NOT EXISTS signups (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  email TEXT NOT NULL,
  pack TEXT NOT NULL,
  status TEXT NOT NULL,
  data TEXT NOT NULL
)`,
  `CREATE TABLE IF NOT EXISTS shops (
  id TEXT PRIMARY KEY,
  slug TEXT NOT NULL UNIQUE,
  email TEXT NOT NULL,
  created_at TEXT NOT NULL,
  data TEXT NOT NULL,
  pwd_hash TEXT,
  invite_hash TEXT,
  invite_expires TEXT,
  session_version INTEGER NOT NULL DEFAULT 1
)`,
  "CREATE INDEX IF NOT EXISTS shops_email ON shops (email)",
  "CREATE TABLE IF NOT EXISTS shop_logos (shop_id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)",
  `CREATE TABLE IF NOT EXISTS plays (
  code TEXT PRIMARY KEY,
  shop_id TEXT NOT NULL,
  phone TEXT NOT NULL,
  created_at TEXT NOT NULL,
  expires_on TEXT NOT NULL,
  redeemed_at TEXT,
  data TEXT NOT NULL
)`,
  "CREATE INDEX IF NOT EXISTS plays_shop ON plays (shop_id, created_at)",
  "CREATE TABLE IF NOT EXISTS play_locks (shop_id TEXT NOT NULL, phone TEXT NOT NULL, code TEXT NOT NULL, until TEXT NOT NULL, PRIMARY KEY (shop_id, phone))",
  "CREATE TABLE IF NOT EXISTS stats (shop_id TEXT NOT NULL, day TEXT NOT NULL, field TEXT NOT NULL, n INTEGER NOT NULL, PRIMARY KEY (shop_id, day, field))",
  "CREATE TABLE IF NOT EXISTS rates (key TEXT PRIMARY KEY, win TEXT NOT NULL, n INTEGER NOT NULL)",
  // Appels de découverte : la clé primaire sur le créneau empêche toute double réservation.
  "CREATE TABLE IF NOT EXISTS bookings (slot TEXT PRIMARY KEY, created_at TEXT NOT NULL, email TEXT NOT NULL, data TEXT NOT NULL)",
  // Demandes « Créez-la pour moi ».
  "CREATE TABLE IF NOT EXISTS wheel_requests (id TEXT PRIMARY KEY, created_at TEXT NOT NULL, email TEXT NOT NULL, data TEXT NOT NULL)",
  // Logo envoyé avec « Créez-la pour moi », gardé à part pour ne pas alourdir la liste de l'admin.
  "CREATE TABLE IF NOT EXISTS signup_logos (signup_id TEXT PRIMARY KEY, data TEXT NOT NULL, updated_at TEXT NOT NULL)",
];

/** La base D1 liée sous le nom DB (voir wrangler.jsonc), ou null hors Cloudflare. */
async function d1(): Promise<D1Like | null> {
  if (g.__roueliaTestDb !== undefined) return g.__roueliaTestDb;
  try {
    const { env } = await getCloudflareContext({ async: true });
    return ((env as Record<string, unknown>).DB as D1Like | undefined) ?? null;
  } catch {
    return null;
  }
}

async function ready(): Promise<D1Like | null> {
  const db = await d1();
  if (db && !g.__roueliaSchema) {
    for (const sql of SCHEMA) await db.prepare(sql).run();
    g.__roueliaSchema = true;
  }
  return db;
}

/** Base prête à l'emploi. Le produit (commerces, parties) exige D1 : en local, `npm run dev` ou `npm run preview` la simulent. */
export async function database(): Promise<D1Like> {
  const db = await ready();
  if (!db) throw new Error("Base D1 non liée (liaison DB)");
  return db;
}

const memory = () => (g.__roueliaMemory ??= []);

export async function storageKind(): Promise<"d1" | "memory"> {
  return (await d1()) ? "d1" : "memory";
}

export async function saveSignup(r: SignupRecord): Promise<void> {
  const db = await ready();
  if (!db) {
    memory().unshift(r);
    return;
  }
  await db
    .prepare("INSERT INTO signups (id, created_at, email, pack, status, data) VALUES (?, ?, ?, ?, ?, ?)")
    .bind(r.id, r.createdAt, r.email, r.pack, r.status, JSON.stringify(r))
    .run();
}

export async function listSignups(limit = 500): Promise<SignupRecord[]> {
  const db = await ready();
  if (!db) return memory().slice(0, limit);
  const { results } = await db.prepare("SELECT data, status FROM signups ORDER BY created_at DESC LIMIT ?").bind(limit).all<{ data: string; status: string }>();
  return results.map((row) => ({ ...(JSON.parse(row.data) as SignupRecord), status: row.status as SignupStatus }));
}

/** Lecture d'une inscription. */
export async function getSignup(id: string): Promise<SignupRecord | null> {
  const db = await ready();
  if (!db) return memory().find((x) => x.id === id) ?? null;
  const row = await db.prepare("SELECT data, status FROM signups WHERE id = ?").bind(id).first<{ data: string; status: string }>();
  return row ? { ...(JSON.parse(row.data) as SignupRecord), status: row.status as SignupStatus } : null;
}

/** Réécrit une inscription (statut et contenu). */
export async function updateSignup(r: SignupRecord): Promise<void> {
  const db = await ready();
  if (!db) {
    const list = memory();
    const i = list.findIndex((x) => x.id === r.id);
    if (i >= 0) list[i] = r;
    return;
  }
  await db.prepare("UPDATE signups SET status = ?, data = ? WHERE id = ?").bind(r.status, JSON.stringify(r), r.id).run();
}

export async function setSignupStatus(id: string, status: SignupStatus): Promise<boolean> {
  const db = await ready();
  if (!db) {
    const r = memory().find((x) => x.id === id);
    if (r) r.status = status;
    return !!r;
  }
  await db.prepare("UPDATE signups SET status = ? WHERE id = ?").bind(status, id).run();
  return true;
}

/** Suppression définitive (droit à l'effacement). */
export async function deleteSignup(id: string): Promise<void> {
  const db = await ready();
  if (!db) {
    g.__roueliaMemory = memory().filter((x) => x.id !== id);
    return;
  }
  await db.prepare("DELETE FROM signups WHERE id = ?").bind(id).run();
  await db.prepare("DELETE FROM signup_logos WHERE signup_id = ?").bind(id).run();
}

/** Logo joint à une inscription (data URL), ou null. */
export async function getSignupLogo(id: string): Promise<string | null> {
  const db = await ready();
  if (!db) return null;
  const row = await db.prepare("SELECT data FROM signup_logos WHERE signup_id = ?").bind(id).first<{ data: string }>();
  return row?.data ?? null;
}

export async function saveSignupLogo(id: string, dataUrl: string, now = new Date()): Promise<void> {
  const db = await ready();
  if (!db) return;
  await db
    .prepare("INSERT INTO signup_logos (signup_id, data, updated_at) VALUES (?, ?, ?) ON CONFLICT (signup_id) DO UPDATE SET data = excluded.data, updated_at = excluded.updated_at")
    .bind(id, dataUrl, now.toISOString())
    .run();
}

/** Pour les tests : remplace la base (null = mémoire). */
export function setTestDb(db: D1Like | null) {
  g.__roueliaTestDb = db;
  g.__roueliaSchema = false;
  g.__roueliaMemory = [];
}
