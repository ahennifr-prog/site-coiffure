import { beforeEach, describe, expect, it } from "vitest";
import { DEFAULT_CONFIG, sanitizeConfig, setBigRate, tierTotal } from "@/lib/config";
import { addDays, codeStatus, parisDay } from "@/lib/dates";
import { findPlay, getConfig, listPlays, play, redeem, saveConfig, stats, unredeem } from "@/lib/game";
import { MemoryKV, setKV } from "@/lib/store";
import { sumPercents } from "@/lib/wheel";

const input = { firstName: "Sarah", phone: "06 12 34 56 78", consent: true, consentText: "J'accepte" };

beforeEach(() => setKV(new MemoryKV()));

describe("configuration", () => {
  it("les lots par défaut totalisent 100 % dont 15 % de gros cadeaux", () => {
    expect(sumPercents(DEFAULT_CONFIG.prizes)).toBe(100);
    expect(tierTotal(DEFAULT_CONFIG.prizes, "gros")).toBe(15);
  });
  it("sanitizeConfig ramène toujours la somme à 100", () => {
    const c = sanitizeConfig({ ...DEFAULT_CONFIG, prizes: DEFAULT_CONFIG.prizes.map((p) => ({ ...p, percent: 50 })) });
    expect(sumPercents(c.prizes)).toBe(100);
  });
  it("refuse un lien non web et garde un minimum de 3 lots", () => {
    const c = sanitizeConfig({ reviewUrl: "javascript:alert(1)", prizes: [DEFAULT_CONFIG.prizes[0]] });
    expect(c.reviewUrl).toBe(DEFAULT_CONFIG.reviewUrl);
    expect(c.prizes.length).toBe(DEFAULT_CONFIG.prizes.length);
  });
  it("setBigRate règle la part des gros cadeaux et garde 100 %", () => {
    for (const rate of [3, 10, 25, 40, 90]) {
      const p = setBigRate(DEFAULT_CONFIG.prizes, rate);
      expect(sumPercents(p)).toBe(100);
      expect(tierTotal(p, "gros")).toBe(rate);
      p.forEach((x) => expect(x.percent).toBeGreaterThanOrEqual(1));
    }
  });
  it("saveConfig persiste", async () => {
    await saveConfig({ ...DEFAULT_CONFIG, validityDays: 15 });
    expect((await getConfig()).validityDays).toBe(15);
  });
});

describe("partie", () => {
  it("crée un code valable à partir du lendemain pendant 30 jours", async () => {
    const now = new Date("2026-10-01T10:00:00Z");
    const r = await play(input, "1.1.1.1", now);
    expect(r.ok && !r.already).toBe(true);
    if (!r.ok) return;
    expect(r.play.code).toMatch(/^ALIA-[2-9A-HJKMNP-Z]{5}$/);
    expect(r.play.validFrom).toBe("2026-10-02");
    expect(r.play.expiresOn).toBe("2026-11-01");
    expect(r.play.phone).toBe("+33612345678");
    expect(DEFAULT_CONFIG.prizes[r.prizeIndex].id).toBe(r.play.prizeId);
  });
  it("une seule partie par numéro : renvoie le même code", async () => {
    const a = await play(input, "1.1.1.1");
    const b = await play({ ...input, phone: "+33 6 12 34 56 78" }, "1.1.1.1");
    expect(a.ok && b.ok && b.already && a.play.code === b.play.code).toBe(true);
    expect((await listPlays()).length).toBe(1);
  });
  it("refuse sans prénom, numéro valide ou consentement", async () => {
    expect(await play({ ...input, firstName: " " }, "ip")).toEqual({ ok: false, error: "firstName" });
    expect(await play({ ...input, phone: "123" }, "ip")).toEqual({ ok: false, error: "phone" });
    expect(await play({ ...input, consent: false }, "ip")).toEqual({ ok: false, error: "consent" });
  });
  it("jeu en pause", async () => {
    await saveConfig({ ...DEFAULT_CONFIG, active: false });
    expect(await play(input, "ip")).toEqual({ ok: false, error: "inactive" });
  });
  it("limite les abus par adresse", async () => {
    let last;
    for (let i = 0; i < 61; i++) last = await play({ ...input, phone: `06 12 34 56 ${String(i).padStart(2, "0")}` }, "9.9.9.9");
    expect(last).toEqual({ ok: false, error: "rate" });
  });
  it("respecte les chances sur beaucoup de parties", async () => {
    await saveConfig({ ...DEFAULT_CONFIG, replayDays: 0 });
    const counts: Record<string, number> = {};
    let s = 1;
    const rand = () => ((s = (s * 1664525 + 1013904223) >>> 0) / 2 ** 32);
    for (let i = 0; i < 3000; i++) {
      const r = await play(input, `ip${i % 200}`, new Date(), rand);
      if (r.ok) counts[r.play.prizeId] = (counts[r.play.prizeId] ?? 0) + 1;
    }
    for (const p of DEFAULT_CONFIG.prizes) expect((counts[p.id] ?? 0) / 3000).toBeCloseTo(p.percent / 100, 1);
  });
});

describe("retrait en caisse", () => {
  it("valide une fois, pas avant la date, pas après expiration, et peut être annulé", async () => {
    const day0 = new Date("2026-10-01T10:00:00Z");
    const r = await play(input, "ip", day0);
    if (!r.ok) throw new Error();
    const code = r.play.code;
    expect((await redeem(code, day0)).ok).toBe(false);
    expect(await redeem(code.toLowerCase().replace("alia-", "")  , new Date("2026-10-02T10:00:00Z"))).toMatchObject({ ok: true });
    expect(await redeem(code, new Date("2026-10-03T10:00:00Z"))).toMatchObject({ ok: false, error: "deja" });
    expect((await unredeem(code))?.redeemedAt).toBeNull();
    expect(await redeem(code, new Date("2026-12-01T10:00:00Z"))).toMatchObject({ ok: false, error: "expire" });
    expect(await redeem("ALIA-ZZZZZ")).toMatchObject({ ok: false, error: "introuvable" });
    expect(await findPlay(code)).not.toBeNull();
  });
});

describe("dates et suivi", () => {
  it("statut d'un code", () => {
    const p = { validFrom: "2026-10-02", expiresOn: "2026-11-01", redeemedAt: null };
    expect(codeStatus(p, "2026-10-01")).toBe("pas_encore");
    expect(codeStatus(p, "2026-10-15")).toBe("valable");
    expect(codeStatus(p, "2026-11-02")).toBe("expire");
    expect(addDays("2026-12-31", 1)).toBe("2027-01-01");
    expect(parisDay(new Date("2026-10-01T23:30:00Z"))).toBe("2026-10-02");
  });
  it("compte les parties", async () => {
    await play(input, "ip");
    const s = await stats(7);
    expect(s.total.parties).toBe(1);
    expect(s.perDay).toHaveLength(7);
  });
});

describe("affichage des dates", async () => {
  const { formatDay } = await import("@/lib/dates");
  it("écrit 1er pour le premier du mois", () => {
    expect(formatDay("2026-10-01")).toBe("1er octobre 2026");
    expect(formatDay("2026-10-31")).toBe("31 octobre 2026");
  });
});
