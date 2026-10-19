import { beforeEach, describe, expect, it } from "vitest";
import { setTestDb } from "@/lib/db";
import { play } from "@/lib/game";
import { setMailTransport, type Mail } from "@/lib/mail";
import { alertIfFirstPlay, alertSubscription } from "@/lib/alerts";
import { insertShop, shopFromSignup, type Shop } from "@/lib/shops";
import { buildRecord } from "@/lib/signup";
import { sqliteD1 } from "./sqlite";

const sent: Mail[] = [];
const now = new Date("2026-10-02T10:00:00Z");

async function newShop(): Promise<Shop> {
  const r = buildRecord(
    { firstName: "Martine", email: "martine@salon.fr", phone: "0612345678", establishment: { name: "Salon Martine" }, pack: "croissance", utm: {}, consent: { accepted: true, text: "ok" }, wheel: null },
    now,
    "s1",
  );
  if (!r.ok) throw new Error();
  const shop = shopFromSignup(r.record, "shop-1", "salon-martine", now);
  await insertShop(shop);
  return shop;
}

beforeEach(() => {
  setTestDb(sqliteD1());
  sent.length = 0;
  setMailTransport(async (m) => {
    sent.push(m);
    return { ok: true };
  });
});

const toAdmin = () => sent.filter((m) => m.to.email === "contact@rouelia.fr").map((m) => m.subject);

describe("alertes immédiates à contact@", () => {
  it("prévient à la première partie seulement", async () => {
    const shop = await newShop();
    for (const phone of ["0611223344", "0611223355"]) {
      const r = await play(shop, { firstName: "Léa", phone, consent: true, consentText: "ok" }, "ip", now);
      if (!r.ok) throw new Error(r.error);
      await alertIfFirstPlay(shop, now);
    }
    expect(toAdmin()).toEqual(["Première partie : Salon Martine"]);
  });

  it("prévient d'un nouveau client et d'un abonnement arrêté", async () => {
    const shop = await newShop();
    await alertSubscription(shop, { ...shop, plan: "active" });
    await alertSubscription({ ...shop, plan: "active" }, { ...shop, plan: "paused" });
    await alertSubscription(shop, { ...shop });
    expect(toAdmin()).toEqual(["Nouveau client : Salon Martine", "Abonnement arrêté : Salon Martine"]);
  });
});
