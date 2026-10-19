import { beforeEach, describe, expect, it } from "vitest";
import { database, setTestDb } from "@/lib/db";
import { purgeExpired, shopEnd } from "@/lib/purge";
import { sqliteD1 } from "./sqlite";

beforeEach(() => setTestDb(sqliteD1()));

const now = new Date("2030-06-15T06:00:00Z");
const count = async (table: string) => ((await (await database()).prepare(`SELECT COUNT(*) AS n FROM ${table}`).first<{ n: number }>())?.n ?? 0);
const exec = async (sql: string, ...args: unknown[]) => (await database()).prepare(sql).bind(...args).run();

async function shop(id: string, data: object, signupId: string | null = null) {
  await exec("INSERT INTO shops (id, slug, email, created_at, data) VALUES (?, ?, ?, ?, ?)", id, id, `${id}@x.fr`, "2026-10-01T00:00:00Z", JSON.stringify({ id, signupId, ...data }));
  await exec("INSERT INTO plays (code, shop_id, phone, created_at, expires_on, data) VALUES (?, ?, ?, ?, ?, ?)", `C-${id}`, id, "+33600000000", "2030-06-01T00:00:00Z", "2030-07-01", "{}");
}
const signup = (id: string, createdAt: string, status = "perdu") =>
  exec("INSERT INTO signups (id, created_at, email, pack, status, data) VALUES (?, ?, ?, ?, ?, ?)", id, createdAt, `${id}@x.fr`, "croissance", status, JSON.stringify({ id }));

describe("ménage quotidien des données", () => {
  it("supprime les parties expirées depuis plus d'un an, garde les autres", async () => {
    for (const [code, expires] of [["VIEUX", "2029-06-01"], ["RECENT", "2029-07-01"], ["VALABLE", "2030-07-01"]])
      await exec("INSERT INTO plays (code, shop_id, phone, created_at, expires_on, data) VALUES (?, 's', '+33600000000', '2029-01-01', ?, '{}')", code, expires);
    await exec("INSERT INTO play_locks (shop_id, phone, code, until) VALUES ('s', '+33611111111', 'X', '2030-06-01T00:00:00Z'), ('s', '+33622222222', 'Y', '2030-07-01T00:00:00Z')");
    const r = await purgeExpired(now);
    expect(r).toMatchObject({ parties: 1, verrous: 1 });
    expect(await count("plays")).toBe(2);
    expect(await count("play_locks")).toBe(1);
  });

  it("supprime appels, demandes et compteurs anti-abus anciens", async () => {
    await exec("INSERT INTO bookings (slot, created_at, email, data) VALUES ('2027-06-01T09:00', '2027-05-01', 'a@x.fr', '{}'), ('2028-01-01T09:00', '2027-12-01', 'b@x.fr', '{}')");
    await exec("INSERT INTO wheel_requests (id, created_at, email, data) VALUES ('v', '2027-06-01T00:00:00Z', 'a@x.fr', '{}'), ('n', '2029-01-01T00:00:00Z', 'b@x.fr', '{}')");
    await exec("INSERT INTO rates (key, win, n) VALUES ('roue:1.2.3.4', '2030-06-10T08', 3), ('roue:5.6.7.8', '2030-06-15T05', 1)");
    expect(await purgeExpired(now)).toMatchObject({ appels: 1, demandes: 1, antiAbus: 1 });
    expect([await count("bookings"), await count("wheel_requests"), await count("rates")]).toEqual([1, 1, 1]);
  });

  it("supprime un essai jamais payé 3 ans après sa fin, et un ancien client 5 ans après sa dernière période payée", async () => {
    await signup("s-vieil-essai", "2026-10-01T00:00:00Z", "essai_en_cours");
    await shop("vieil-essai", { plan: "trial", trialEndsAt: "2027-06-01T00:00:00Z" }, "s-vieil-essai");
    await shop("essai-recent", { plan: "trial", trialEndsAt: "2027-07-01T00:00:00Z" });
    await signup("s-client", "2020-01-01T00:00:00Z", "client");
    await shop("client-actif", { plan: "active", trialEndsAt: "2020-02-01T00:00:00Z", stripe: { periodEnd: "2030-07-01", subscriptionId: "sub" } }, "s-client");
    await shop("ancien-client", { plan: "paused", trialEndsAt: "2020-02-01T00:00:00Z", stripe: { periodEnd: "2025-06-01", subscriptionId: "sub" } });
    await shop("ancien-client-recent", { plan: "paused", trialEndsAt: "2020-02-01T00:00:00Z", stripe: { periodEnd: "2025-07-01", subscriptionId: "sub" } });

    const r = await purgeExpired(now);
    expect(r.commerces).toBe(2);
    const { results } = await (await database()).prepare("SELECT id FROM shops ORDER BY id").all<{ id: string }>();
    expect(results.map((x) => x.id)).toEqual(["ancien-client-recent", "client-actif", "essai-recent"]);
    // Les parties des commerces supprimés partent avec eux ; l'inscription d'un client actif reste, même ancienne.
    expect(await count("plays")).toBe(3);
    const { results: signups } = await (await database()).prepare("SELECT id FROM signups").all<{ id: string }>();
    expect(signups.map((x) => x.id)).toEqual(["s-client"]);
  });

  it("supprime les inscriptions de plus de 3 ans sans commerce, garde les récentes", async () => {
    await signup("vieux", "2027-06-01T00:00:00Z");
    await signup("recent", "2027-07-01T00:00:00Z");
    await exec("INSERT INTO signup_logos (signup_id, data, updated_at) VALUES ('vieux', 'x', '2027-06-01')");
    expect((await purgeExpired(now)).inscriptions).toBe(1);
    expect(await count("signups")).toBe(1);
    expect(await count("signup_logos")).toBe(0);
  });

  it("ne compte pas la fin d'un client actif ni d'un abonnement sans date", () => {
    expect(shopEnd({ plan: "active", trialEndsAt: "2020-01-01T00:00:00Z" })).toBeNull();
    expect(shopEnd({ plan: "paused", trialEndsAt: "2020-01-01T00:00:00Z", stripe: { customerId: "c", subscriptionId: "sub", status: "canceled", periodEnd: null, cancelAtPeriodEnd: false } })).toBeNull();
  });
});
