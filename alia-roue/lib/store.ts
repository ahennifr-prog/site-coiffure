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

const g = globalThis as unknown as { __aliaKV?: KV; __aliaKVKind?: "redis" | "memory" };

/** Vercel + Upstash fournissent KV_REST_API_URL et KV_REST_API_TOKEN (ou UPSTASH_REDIS_REST_*). */
export function kv(): KV {
  if (g.__aliaKV) return g.__aliaKV;
  const url = process.env.KV_REST_API_URL ?? process.env.UPSTASH_REDIS_REST_URL;
  const token = process.env.KV_REST_API_TOKEN ?? process.env.UPSTASH_REDIS_REST_TOKEN;
  if (url && token) {
    g.__aliaKV = new UpstashKV(new Redis({ url, token }));
    g.__aliaKVKind = "redis";
  } else {
    g.__aliaKV = new MemoryKV();
    g.__aliaKVKind = "memory";
  }
  return g.__aliaKV;
}

export function storageKind(): "redis" | "memory" {
  kv();
  return g.__aliaKVKind ?? "memory";
}

/** Pour les tests. */
export function setKV(store: KV) {
  g.__aliaKV = store;
  g.__aliaKVKind = "memory";
}
