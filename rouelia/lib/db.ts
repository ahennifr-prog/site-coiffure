import { getCloudflareContext } from "@opennextjs/cloudflare";
import type { SignupRecord, SignupStatus } from "@/lib/signup";

/** Sous-ensemble de l'API D1 de Cloudflare utilisé ici. */
interface D1Statement {
  bind(...values: unknown[]): D1Statement;
  run(): Promise<unknown>;
  all<T = Record<string, unknown>>(): Promise<{ results: T[] }>;
  first<T = Record<string, unknown>>(): Promise<T | null>;
}
export interface D1Like {
  prepare(sql: string): D1Statement;
}

const g = globalThis as unknown as { __roueliaMemory?: SignupRecord[]; __roueliaSchema?: boolean; __roueliaTestDb?: D1Like | null };

const SCHEMA = `CREATE TABLE IF NOT EXISTS signups (
  id TEXT PRIMARY KEY,
  created_at TEXT NOT NULL,
  email TEXT NOT NULL,
  pack TEXT NOT NULL,
  status TEXT NOT NULL,
  data TEXT NOT NULL
)`;

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
    await db.prepare(SCHEMA).run();
    g.__roueliaSchema = true;
  }
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
}

/** Pour les tests : remplace la base (null = mémoire). */
export function setTestDb(db: D1Like | null) {
  g.__roueliaTestDb = db;
  g.__roueliaSchema = false;
  g.__roueliaMemory = [];
}
