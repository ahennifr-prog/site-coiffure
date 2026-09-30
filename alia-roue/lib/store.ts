import { getStore } from "@netlify/blobs";
import { Redis } from "@upstash/redis";

/** Petit sous-ensemble de Redis utilisé par l'application. */
export interface KV {
  get<T>(key: string): Promise<T | null>;
  set(key: string, value: unknown, opts?: { ex?: number; nx?: boolean }): Promise<boolean>;
  del(key: string): Promise<void>;
  hincrby(key: string, field: string, by: number): Promise<void>;
  hgetall(key: string): Promise<Record<string, number>>;
  expire(key: string, seconds: number): Promise<void>;
  zadd(key: string, score: number, member: string): Promise<void>;
  zrevrange(key: string, start: number, stop: number): Promise<string[]>;
  incr(key: string, exSeconds: number): Promise<number>;
  mget<T>(keys: string[]): Promise<(T | null)[]>;
}

class UpstashKV implements KV {
  constructor(private r: Redis) {}
  async get<T>(key: string) {
    return (await this.r.get<T>(key)) ?? null;
  }
  async set(key: string, value: unknown, opts: { ex?: number; nx?: boolean } = {}) {
    const o: Record<string, unknown> = {};
    if (opts.ex) o.ex = opts.ex;
    if (opts.nx) o.nx = true;
    const res = await this.r.set(key, value, o as never);
    return res === "OK";
  }
  async del(key: string) {
    await this.r.del(key);
  }
  async hincrby(key: string, field: string, by: number) {
    await this.r.hincrby(key, field, by);
  }
  async hgetall(key: string) {
    const h = (await this.r.hgetall<Record<string, number>>(key)) ?? {};
    return Object.fromEntries(Object.entries(h).map(([k, v]) => [k, Number(v) || 0]));
  }
  async expire(key: string, seconds: number) {
    await this.r.expire(key, seconds);
  }
  async zadd(key: string, score: number, member: string) {
    await this.r.zadd(key, { score, member });
  }
  async zrevrange(key: string, start: number, stop: number) {
    return (await this.r.zrange<string[]>(key, start, stop, { rev: true })) ?? [];
  }
  async incr(key: string, exSeconds: number) {
    const n = await this.r.incr(key);
    if (n === 1) await this.r.expire(key, exSeconds);
    return n;
  }
  async mget<T>(keys: string[]) {
    if (keys.length === 0) return [];
    return (await this.r.mget<(T | null)[]>(...keys)) ?? [];
  }
}


type Boxed = { v: unknown; exp?: number };

/**
 * Netlify Blobs : stockage intégré à Netlify, gratuit, sans configuration.
 * Écritures conditionnelles (ETag) pour que les compteurs et les verrous restent justes
 * même si deux clientes jouent au même moment.
 */
class BlobsKV implements KV {
  private store() {
    return getStore({ name: "alia", consistency: "strong" });
  }
  private async read(key: string): Promise<{ box: Boxed | null; etag?: string; exists: boolean }> {
    const r = await this.store().getWithMetadata(key, { type: "json", consistency: "strong" });
    if (!r) return { box: null, exists: false };
    const box = r.data as Boxed;
    if (box?.exp && box.exp < Date.now()) return { box: null, etag: r.etag, exists: true };
    return { box, etag: r.etag, exists: true };
  }
  /** Écriture conditionnelle à la version lue ; sans version connue, écriture simple. */
  private async writeOver(key: string, value: Boxed, etag: string | undefined, exists: boolean) {
    if (etag) return (await this.store().setJSON(key, value, { onlyIfMatch: etag })).modified;
    if (!exists) return (await this.store().setJSON(key, value, { onlyIfNew: true })).modified;
    await this.store().setJSON(key, value);
    return true;
  }
  /** Lecture, modification, écriture conditionnelle, avec quelques essais en cas de conflit. */
  private async update(key: string, fn: (box: Boxed | null) => Boxed): Promise<Boxed> {
    for (let i = 0; i < 8; i++) {
      const { box, etag, exists } = await this.read(key);
      const next = fn(box);
      if (await this.writeOver(key, next, etag, exists)) return next;
      await new Promise((r) => setTimeout(r, 20 + Math.random() * 60));
    }
    throw new Error(`Écriture impossible : ${key}`);
  }
  async get<T>(key: string) {
    return ((await this.read(key)).box?.v as T) ?? null;
  }
  async set(key: string, value: unknown, opts: { ex?: number; nx?: boolean } = {}) {
    const box: Boxed = { v: value, exp: opts.ex ? Date.now() + opts.ex * 1000 : undefined };
    if (!opts.nx) {
      await this.store().setJSON(key, box);
      return true;
    }
    const first = await this.store().setJSON(key, box, { onlyIfNew: true });
    if (first.modified) return true;
    // La clé existe : on ne la remplace que si elle a expiré.
    const { box: current, etag, exists } = await this.read(key);
    if (current) return false;
    return this.writeOver(key, box, etag, exists);
  }
  async del(key: string) {
    await this.store().delete(key);
  }
  async hincrby(key: string, field: string, by: number) {
    await this.update(key, (b) => {
      const h = { ...((b?.v as Record<string, number>) ?? {}) };
      h[field] = (h[field] ?? 0) + by;
      return { v: h, exp: b?.exp };
    });
  }
  async hgetall(key: string) {
    return { ...(((await this.read(key)).box?.v as Record<string, number>) ?? {}) };
  }
  async expire(key: string, seconds: number) {
    const { box } = await this.read(key);
    if (box) await this.store().setJSON(key, { ...box, exp: Date.now() + seconds * 1000 });
  }
  /** Index trié : une entrée par membre, la clé encode le score à l'envers pour lister du plus récent au plus ancien. */
  async zadd(key: string, score: number, member: string) {
    const rev = String(9_999_999_999_999 - Math.round(score)).padStart(13, "0");
    await this.store().setJSON(`z/${key}/${rev}~${member}`, { v: 1 });
  }
  async zrevrange(key: string, start: number, stop: number) {
    const { blobs } = await this.store().list({ prefix: `z/${key}/` });
    const members = blobs.map((b) => b.key).sort().map((k) => k.slice(k.indexOf("~") + 1));
    return members.slice(start, stop === -1 ? undefined : stop + 1);
  }
  async incr(key: string, exSeconds: number) {
    const next = await this.update(key, (b) => ({ v: ((b?.v as number) ?? 0) + 1, exp: b?.exp ?? Date.now() + exSeconds * 1000 }));
    return next.v as number;
  }
  async mget<T>(keys: string[]) {
    return Promise.all(keys.map((k) => this.get<T>(k)));
  }
}

/** Stockage en mémoire : développement local et tests. Les données sont perdues au redémarrage. */
export class MemoryKV implements KV {
  private data = new Map<string, { v: unknown; exp?: number }>();
  private alive(key: string) {
    const e = this.data.get(key);
    if (!e) return undefined;
    if (e.exp && e.exp < Date.now()) {
      this.data.delete(key);
      return undefined;
    }
    return e;
  }
  async get<T>(key: string) {
    const e = this.alive(key);
    return e ? (structuredClone(e.v) as T) : null;
  }
  async set(key: string, value: unknown, opts: { ex?: number; nx?: boolean } = {}) {
    if (opts.nx && this.alive(key)) return false;
    this.data.set(key, { v: structuredClone(value), exp: opts.ex ? Date.now() + opts.ex * 1000 : undefined });
    return true;
  }
  async del(key: string) {
    this.data.delete(key);
  }
  async hincrby(key: string, field: string, by: number) {
    const e = this.alive(key);
    const h = (e?.v as Record<string, number>) ?? {};
    h[field] = (h[field] ?? 0) + by;
    this.data.set(key, { v: h, exp: e?.exp });
  }
  async hgetall(key: string) {
    return { ...((this.alive(key)?.v as Record<string, number>) ?? {}) };
  }
  async expire(key: string, seconds: number) {
    const e = this.alive(key);
    if (e) e.exp = Date.now() + seconds * 1000;
  }
  async zadd(key: string, score: number, member: string) {
    const z = ((this.alive(key)?.v as [number, string][]) ?? []).filter(([, m]) => m !== member);
    z.push([score, member]);
    z.sort((a, b) => a[0] - b[0]);
    this.data.set(key, { v: z });
  }
  async zrevrange(key: string, start: number, stop: number) {
    const z = [...((this.alive(key)?.v as [number, string][]) ?? [])].reverse();
    return z.slice(start, stop === -1 ? undefined : stop + 1).map(([, m]) => m);
  }
  async incr(key: string, exSeconds: number) {
    const e = this.alive(key);
    const n = ((e?.v as number) ?? 0) + 1;
    this.data.set(key, { v: n, exp: e?.exp ?? Date.now() + exSeconds * 1000 });
    return n;
  }
  async mget<T>(keys: string[]) {
    return Promise.all(keys.map((k) => this.get<T>(k)));
  }
}

type Kind = "redis" | "netlify" | "memory";
const g = globalThis as unknown as { __aliaKV?: KV; __aliaKVKind?: Kind; netlifyBlobsContext?: unknown };

function onNetlify(): boolean {
  return !!(g.netlifyBlobsContext || process.env.NETLIFY_BLOBS_CONTEXT);
}

/**
 * Choix du stockage :
 * 1. Upstash Redis si ses variables sont présentes (KV_REST_API_* ou UPSTASH_REDIS_REST_*) ;
 * 2. Netlify Blobs quand le site tourne sur Netlify ;
 * 3. mémoire sinon (développement local, tests).
 */
export function kv(): KV {
  if (g.__aliaKV && g.__aliaKVKind !== "memory") return g.__aliaKV;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    g.__aliaKV = new UpstashKV(new Redis({ url, token }));
    g.__aliaKVKind = "redis";
  } else if (onNetlify()) {
    g.__aliaKV = new BlobsKV();
    g.__aliaKVKind = "netlify";
  } else if (!g.__aliaKV) {
    g.__aliaKV = new MemoryKV();
    g.__aliaKVKind = "memory";
  }
  return g.__aliaKV;
}

export function storageKind(): Kind {
  kv();
  return g.__aliaKVKind ?? "memory";
}

/** Pour les tests. */
export function setKV(store: KV) {
  g.__aliaKV = store;
  g.__aliaKVKind = "memory";
}
