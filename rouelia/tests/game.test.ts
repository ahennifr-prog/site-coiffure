import { beforeEach, describe, expect, it } from "vitest";
import { setTestDb } from "@/lib/db";
import { findPlay, hit, listPlays, normalizeCode, play, redeem, stats, track, unredeem } from "@/lib/game";
import { readShopSession, shopSessionToken } from "@/lib/espace";
import {
  bigTotal, codePrefixOf, createInvite, gameState, getShopBySlug, hashPassword, insertShop, login, publicShop,
  sanitizeSettings, setBigRate, setPassword, shopForInvite, shopFromSignup, slugify, uniqueSlug, verifyPassword, type Shop,
} from "@/lib/shops";
import { buildRecord, type SignupRecord } from "@/lib/signup";
import { sqliteD1 } from "./sqlite";

const now = new Date("2026-10-02T10:00:00Z");

function signup(extra: Record<string, unknown> = {}): SignupRecord {
  const r = buildRecord(
    {
      firstName: "Martine", email: "Martine@Salon.fr", phone: "06 12 34 56 78",
      establishment: { name: "Salon Martine" }, pack: "croissance", utm: {},
      consent: { accepted: true, text: "ok" },
      wheel: {
        shopName: "Salon Martine", trade: "coiffeur", paletteId: "poudre", primaryColor: null, logo: null, noLogo: false, averageCost: 2,
        prizes: [
          { name: "Soin", icon: "goutte", cost: 2.5, percent: 50, hasImage: false },
          { name: "-10 %", icon: "pourcent", cost: 3, percent: 45, hasImage: false },
          { name: "Brushing", icon: "etoile", cost: 6, percent: 5, hasImage: false },
        ],
      },
      ...extra,
    },
    now,
    "sig-1",
  );
  if (!r.ok) throw new Error("inscription invalide");
  return r.record;
}

async function newShop(extra: Partial<Shop> = {}): Promise<Shop> {
  const shop = { ...shopFromSignup(signup(), "shop-1", await uniqueSlug(slugify("Salon Martine")), now), ...extra };
  await insertShop(shop);
  return shop;
}

const input = { firstName: "Léa", phone: "06 11 22 33 44", consent: true, consentText: "J'accepte" };

beforeEach(() => setTestDb(sqliteD1()));

describe("création d'un commerce", () => {
  it("reprend la roue de la démo et ouvre 14 jours d'essai", async () => {
    const shop = await newShop();
    expect(shop.slug).toBe("salon-martine");
    expect(shop.codePrefix).toBe("SAL");
    expect(shop.email).toBe("martine@salon.fr");
    expect(shop.settings.paletteId).toBe("poudre");
    expect(shop.settings.prizes.map((p) => p.name)).toEqual(["Soin", "-10 %", "Brushing"]);
    expect(shop.settings.prizes.map((p) => p.big)).toEqual([false, false, true]);
    expect(shop.trialEndsAt).toBe("2026-10-16T10:00:00.000Z");
    expect(await uniqueSlug("salon-martine")).toBe("salon-martine-2");
  });

  it("donne 21 jours avec le cadeau « essai prolongé »", () => {
    const r = { ...signup(), offer: { wonId: "essai_21" as const, id: "essai_21" as const, code: "OFF-AAAA", wonAt: "", expiresAt: "", status: "applied" as const } };
    expect(shopFromSignup(r, "x", "x", now).trialEndsAt).toBe("2026-10-23T10:00:00.000Z");
  });

  it("nettoie les noms", () => {
    expect(slugify("L'Atelier d'Émilie & Co !")).toBe("l-atelier-d-emilie-et-co");
    expect(slugify("")).toBe("commerce");
    expect(codePrefixOf("9-bis")).toBe("BIS");
  });
});

describe("réglages", () => {
  it("ramène les chances à 100 et refuse les liens douteux", async () => {
    const shop = await newShop();
    const s = sanitizeSettings({ prizes: shop.settings.prizes.map((p) => ({ ...p, percent: 10 })), reviewUrl: "javascript:alert(1)", bookingUrl: "planity.com/salon" }, shop.settings);
    expect(s.prizes.reduce((a, p) => a + p.percent, 0)).toBe(100);
    expect(s.reviewUrl).toBe("");
    expect(s.bookingUrl).toBe("https://planity.com/salon");
  });
  it("règle la part des gros cadeaux d'un geste", async () => {
    const shop = await newShop();
    const next = setBigRate(shop.settings.prizes, 20);
    expect(bigTotal(next)).toBe(20);
    expect(next.reduce((a, p) => a + p.percent, 0)).toBe(100);
  });
});

describe("état du jeu", () => {
  it("se met en pause à la fin de l'essai, pas pour un client", async () => {
    const shop = await newShop();
    expect(gameState(shop, now)).toBe("ouvert");
    const later = new Date("2026-10-17T10:00:00Z");
    expect(gameState(shop, later)).toBe("essai_termine");
    expect(gameState({ ...shop, plan: "active" }, later)).toBe("ouvert");
    expect(gameState({ ...shop, plan: "paused" }, now)).toBe("suspendu");
    expect(gameState({ ...shop, settings: { ...shop.settings, active: false } }, now)).toBe("pause");
  });
  it("cache la réservation en Essentiel et la mention Rouelia en Premium", async () => {
    const shop = await newShop();
    shop.settings.bookingUrl = "https://planity.com/x";
    expect(publicShop({ ...shop, pack: "essentiel" }).bookingUrl).toBe("");
    expect(publicShop(shop).bookingUrl).toBe("https://planity.com/x");
    expect(publicShop(shop).poweredBy).toBe(true);
    expect(publicShop({ ...shop, pack: "premium" }).poweredBy).toBe(false);
  });
});

describe("parties", () => {
  it("donne un code, une date limite et une seule partie par téléphone", async () => {
    const shop = await newShop();
    const a = await play(shop, input, "1.1.1.1", now, () => 0);
    expect(a).toMatchObject({ ok: true, already: false, prizeIndex: 0 });
    if (!a.ok) return;
    expect(a.play.code).toMatch(/^SAL-[2-9A-Z]{5}$/);
    expect(a.play.validFrom).toBe("2026-10-03");
    expect(a.play.expiresOn).toBe("2026-11-02");
    const b = await play(shop, { ...input, phone: "+33611223344" }, "1.1.1.1", now, () => 0.99);
    expect(b).toMatchObject({ ok: true, already: true });
    if (b.ok) expect(b.play.code).toBe(a.play.code);
    // Après la période, on peut rejouer.
    const c = await play({ ...shop, plan: "active" }, input, "1.1.1.1", new Date("2026-11-02T10:00:00Z"), () => 0.99);
    expect(c).toMatchObject({ ok: true, already: false });
    expect((await stats(shop.id, 14, now)).total).toMatchObject({ parties: 2, deja_joue: 1 });
  });

  it("refuse un jeu fermé ou un formulaire incomplet", async () => {
    const shop = await newShop();
    expect(await play(shop, { ...input, consent: false }, "ip", now)).toEqual({ ok: false, error: "consent" });
    expect(await play(shop, { ...input, phone: "123" }, "ip", now)).toEqual({ ok: false, error: "phone" });
    expect(await play({ ...shop, plan: "paused" }, input, "ip", now)).toEqual({ ok: false, error: "inactive" });
  });

  it("limite les parties par connexion", async () => {
    for (let i = 0; i < 60; i++) await hit("jouer:ip", now);
    expect(await hit("jouer:ip", now)).toBe(61);
    expect(await hit("jouer:ip", new Date("2026-10-02T11:00:00Z"))).toBe(1);
  });
});

describe("caisse", () => {
  it("valide une fois, au bon moment, et sait annuler", async () => {
    const shop = await newShop();
    const r = await play(shop, input, "ip", now, () => 0.5);
    if (!r.ok) throw new Error();
    const code = r.play.code;
    expect(normalizeCode(code.toLowerCase().replace("-", " "), "SAL")).toBe(code);
    expect(await findPlay(shop, code.slice(4))).toMatchObject({ code });
    expect(await redeem(shop, code, now)).toMatchObject({ ok: false, error: "pas_encore" });
    const tomorrow = new Date("2026-10-03T09:00:00Z");
    expect(await redeem(shop, code, tomorrow)).toMatchObject({ ok: true });
    expect(await redeem(shop, code, tomorrow)).toMatchObject({ ok: false, error: "deja" });
    expect((await unredeem(shop, code, tomorrow))?.redeemedAt).toBeNull();
    expect(await redeem(shop, code, new Date("2026-11-03T09:00:00Z"))).toMatchObject({ ok: false, error: "expire" });
    expect(await redeem(shop, "ZZZZZ", now)).toMatchObject({ ok: false, error: "introuvable" });
    const other = { ...shop, id: "autre" };
    expect(await findPlay(other, code)).toBeNull();
    expect((await stats(shop.id, 14, tomorrow)).total.retraits).toBe(0);
    expect(await listPlays(shop)).toHaveLength(1);
  });

  it("garde les compteurs par jour", async () => {
    await track("s", "visites", 1, now);
    await track("s", "visites", 2, now);
    const st = await stats("s", 14, now);
    expect(st.total.visites).toBe(3);
    expect(st.perDay.at(-1)).toMatchObject({ day: "2026-10-02", visites: 3 });
  });
});

describe("accès à l'espace", () => {
  it("invitation, mot de passe, connexion", async () => {
    const shop = await newShop();
    const token = await createInvite(shop.id, now);
    expect((await shopForInvite(token, now))?.id).toBe(shop.id);
    expect(await shopForInvite(token, new Date("2026-10-20T10:00:00Z"))).toBeNull();
    const v = await setPassword(shop.id, "motdepasse1");
    expect(v).toBe(2);
    expect(await shopForInvite(token, now)).toBeNull();
    expect((await login("MARTINE@salon.fr ", "motdepasse1"))?.shop.id).toBe(shop.id);
    expect(await login("martine@salon.fr", "mauvais")).toBeNull();
    expect((await getShopBySlug("SALON-MARTINE"))?.id).toBe(shop.id);
  });

  it("hache les mots de passe et signe les sessions", async () => {
    const h = await hashPassword("secret123");
    expect(h).not.toContain("secret123");
    expect(await verifyPassword("secret123", h)).toBe(true);
    expect(await verifyPassword("secret124", h)).toBe(false);
    const t = shopSessionToken("shop-1", 3, 0);
    expect(readShopSession(t, 1000)).toEqual({ shopId: "shop-1", version: 3 });
    expect(readShopSession(t.replace("shop-1", "shop-2"), 1000)).toBeNull();
    expect(readShopSession(t, Date.now() + 1e11)).toBeNull();
  });
});
