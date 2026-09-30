import { afterAll, beforeAll, describe, expect, it } from "vitest";
import { mkdtempSync, rmSync } from "node:fs";
import { tmpdir } from "node:os";
import { join } from "node:path";
import { BlobsServer } from "@netlify/blobs/server";
import { DEFAULT_CONFIG } from "@/lib/config";
import { listPlays, play, redeem, saveConfig, stats } from "@/lib/game";
import { kv, storageKind } from "@/lib/store";

// Serveur Netlify Blobs local : on vérifie le vrai stockage utilisé en ligne.
const dir = mkdtempSync(join(tmpdir(), "alia-blobs-"));
const token = "jeton-de-test";
let server: BlobsServer;

beforeAll(async () => {
  server = new BlobsServer({ directory: dir, token });
  const { port } = await server.start();
  const ctx = { edgeURL: `http://localhost:${port}`, uncachedEdgeURL: `http://localhost:${port}`, siteID: "site-test", token };
  process.env.NETLIFY_BLOBS_CONTEXT = Buffer.from(JSON.stringify(ctx)).toString("base64");
  const g = globalThis as unknown as { __aliaKV?: unknown; __aliaKVKind?: unknown };
  g.__aliaKV = undefined;
  g.__aliaKVKind = undefined;
});

afterAll(async () => {
  await server.stop();
  delete process.env.NETLIFY_BLOBS_CONTEXT;
  rmSync(dir, { recursive: true, force: true });
});

describe("Netlify Blobs", () => {
  it("est choisi automatiquement sur Netlify", () => {
    kv();
    expect(storageKind()).toBe("netlify");
  });

  // Les écritures simultanées reposent sur les ETag du vrai service Netlify, que le serveur
  // local n'émule pas entièrement : on vérifie ici le comportement séquentiel.
  it("verrou : « si nouveau » échoue quand la clé existe", async () => {
    const store = kv();
    expect(await store.set("verrou", 1, { nx: true, ex: 60 })).toBe(true);
    expect(await store.set("verrou", 2, { nx: true, ex: 60 })).toBe(false);
    expect(await store.get("verrou")).toBe(1);
  });

  it("compteurs", async () => {
    const store = kv();
    for (let i = 0; i < 10; i++) await store.hincrby("compteurs", "parties", 1);
    expect((await store.hgetall("compteurs")).parties).toBe(10);
    for (let i = 0; i < 4; i++) await store.incr("rl", 60);
    expect(await store.incr("rl", 60)).toBe(5);
  });

  it("clé expirée : considérée comme absente et remplaçable", async () => {
    const store = kv();
    await store.set("court", "a", { ex: -1 });
    expect(await store.get("court")).toBeNull();
    expect(await store.set("court", "b", { nx: true })).toBe(true);
    expect(await store.get("court")).toBe("b");
  });

  it("parcours complet : partie, même numéro, liste, retrait, suivi", async () => {
    await saveConfig({ ...DEFAULT_CONFIG, delayDays: 0 });
    const input = { firstName: "Lina", phone: "06 98 76 54 32", consent: true, consentText: "ok" };
    const a = await play(input, "ip-1");
    const b = await play(input, "ip-1");
    expect(a.ok && b.ok && b.already && a.play.code === b.play.code).toBe(true);
    await play({ ...input, phone: "06 98 76 54 33" }, "ip-1");
    const list = await listPlays();
    expect(list).toHaveLength(2);
    expect(list[0].phone).toBe("+33698765433");
    if (!a.ok) return;
    expect((await redeem(a.play.code)).ok).toBe(true);
    expect(await redeem(a.play.code)).toMatchObject({ ok: false, error: "deja" });
    const s = await stats(3);
    expect(s.total.parties).toBe(2);
    expect(s.total.retraits).toBe(1);
  });
});
