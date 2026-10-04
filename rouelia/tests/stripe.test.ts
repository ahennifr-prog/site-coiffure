import { createHmac } from "node:crypto";
import { afterEach, beforeEach, describe, expect, it } from "vitest";
import { setTestDb } from "@/lib/db";
import { quotePack } from "@/lib/billing";
import { getShop, insertShop, shopFromSignup, type Shop } from "@/lib/shops";
import { buildRecord } from "@/lib/signup";
import { applySubscription, createCheckout, formEncode, setStripeFetch, verifyWebhook, type StripeSubscription } from "@/lib/stripe";
import { POST as webhook } from "@/app/api/stripe/webhook/route";
import { sqliteD1 } from "./sqlite";

const now = new Date("2026-10-02T10:00:00Z");

async function newShop(extra: Partial<Shop> = {}): Promise<Shop> {
  const r = buildRecord(
    { firstName: "Martine", email: "martine@salon.fr", phone: "0612345678", establishment: { name: "Salon Martine" }, pack: "croissance", utm: {}, consent: { accepted: true, text: "ok" }, wheel: null },
    now,
    "s1",
  );
  if (!r.ok) throw new Error();
  const shop = { ...shopFromSignup(r.record, "shop-1", "salon-martine", now), ...extra };
  await insertShop(shop);
  return shop;
}

/** Faux Stripe : enregistre les appels, répond selon le chemin. */
const calls: { method: string; path: string; body: string }[] = [];
let routes: Record<string, (body: string) => unknown> = {};
function fakeStripe() {
  setStripeFetch(async (url, init) => {
    const u = new URL(url);
    const path = u.pathname.replace("/v1", "");
    const body = String(init.body ?? u.search.slice(1));
    calls.push({ method: init.method ?? "GET", path, body: decodeURIComponent(body) });
    const key = `${init.method} ${path}`;
    const handler = routes[key] ?? Object.entries(routes).find(([k]) => key.startsWith(k.replace("*", "")))?.[1];
    if (!handler) return new Response(JSON.stringify({ error: { code: "resource_missing" } }), { status: 404 });
    return new Response(JSON.stringify(handler(body)), { status: 200 });
  });
}

const sub = (o: Partial<StripeSubscription> = {}): StripeSubscription => ({
  id: "sub_1",
  customer: "cus_1",
  status: "trialing",
  cancel_at_period_end: false,
  metadata: { shop_id: "shop-1", pack: "croissance" },
  items: { data: [{ current_period_end: Date.parse("2026-10-16T00:00:00Z") / 1000, price: { metadata: { pack: "croissance" } } }] },
  ...o,
});

beforeEach(() => {
  setTestDb(sqliteD1());
  process.env.STRIPE_SECRET_KEY = "sk_test_x";
  process.env.STRIPE_WEBHOOK_SECRET = "whsec_test";
  calls.length = 0;
  routes = {};
  fakeStripe();
});
afterEach(() => {
  setStripeFetch(null);
  delete process.env.STRIPE_SECRET_KEY;
  delete process.env.STRIPE_WEBHOOK_SECRET;
});

describe("prix et cadeaux", () => {
  it("applique le cadeau de la roue d'offres au premier mois selon le pack", () => {
    expect(quotePack("croissance", "moitie_1er_mois")).toMatchObject({ firstMonth: 24.5, discount: 24.5 });
    expect(quotePack("premium", "mois_offert")).toMatchObject({ firstMonth: 0, discount: 89 });
    expect(quotePack("premium", "premium_prix_croissance")).toMatchObject({ firstMonth: 49, discount: 40 });
    expect(quotePack("croissance", "premium_prix_croissance")).toMatchObject({ firstMonth: null, discount: 0 });
    expect(quotePack("essentiel", "mois_offert")).toMatchObject({ firstMonth: null, offerLabel: null });
    expect(quotePack("croissance", "installation")).toMatchObject({ firstMonth: null, offerLabel: "Installation sur place offerte" });
    expect(quotePack("croissance", "essai_21").offerLabel).toBeNull();
  });
});

describe("Stripe", () => {
  it("encode les paramètres imbriqués", () => {
    expect(decodeURIComponent(formEncode({ a: 1, line_items: [{ price: "p", quantity: 1 }], m: { x: "y" }, k: ["z"] }))).toBe("a=1&line_items[0][price]=p&line_items[0][quantity]=1&m[x]=y&k[0]=z");
  });

  it("vérifie la signature des notifications", () => {
    const t = Math.floor(now.getTime() / 1000);
    const sig = createHmac("sha256", "whsec_test").update(`${t}.{"a":1}`).digest("hex");
    expect(verifyWebhook('{"a":1}', `t=${t},v1=${sig}`, "whsec_test", now.getTime())).toBe(true);
    expect(verifyWebhook('{"a":2}', `t=${t},v1=${sig}`, "whsec_test", now.getTime())).toBe(false);
    expect(verifyWebhook('{"a":1}', `t=${t},v1=${sig}`, "whsec_test", now.getTime() + 600_000)).toBe(false);
    expect(verifyWebhook('{"a":1}', null, "whsec_test")).toBe(false);
  });

  it("crée le prix au premier paiement, reporte le prélèvement à la fin de l'essai et applique le cadeau", async () => {
    const shop = await newShop({ offer: { wonId: "moitie_1er_mois", id: "moitie_1er_mois", code: "OFF-A", wonAt: "", expiresAt: "", status: "applied" } });
    routes = {
      "GET /prices": () => ({ data: [] }),
      "POST /products": () => ({ id: "prod_1" }),
      "POST /prices": () => ({ id: "price_1" }),
      "POST /coupons": () => ({ id: "c" }),
      "POST /checkout/sessions": () => ({ url: "https://checkout.stripe.com/x" }),
    };
    expect(await createCheckout(shop, "croissance", now)).toBe("https://checkout.stripe.com/x");
    const checkout = calls.find((c) => c.path === "/checkout/sessions")!.body;
    expect(checkout).toContain("line_items[0][price]=price_1");
    expect(checkout).toContain(`subscription_data[trial_end]=${Math.floor(Date.parse(shop.trialEndsAt) / 1000)}`);
    expect(checkout).toContain("discounts[0][coupon]=rouelia_moitie_1er_mois_croissance_2450");
    expect(checkout).toContain("client_reference_id=shop-1");
    expect(calls.find((c) => c.path === "/prices" && c.method === "POST")!.body).toContain("unit_amount=4900");
  });

  it("sans essai restant, l'abonnement démarre tout de suite", async () => {
    const shop = await newShop({ trialEndsAt: "2026-10-03T10:00:00Z" });
    routes = { "GET /prices": () => ({ data: [{ id: "price_1" }] }), "POST /checkout/sessions": () => ({ url: "u" }) };
    await createCheckout(shop, "croissance", now);
    expect(calls.find((c) => c.path === "/checkout/sessions")!.body).not.toContain("trial_end");
    expect(calls.some((c) => c.path === "/products")).toBe(false);
  });

  it("client tant que Stripe le dit, en pause quand l'abonnement s'arrête", async () => {
    const shop = await newShop();
    const a = applySubscription(shop, sub({ items: { data: [{ current_period_end: 1792108800, price: { metadata: { pack: "premium" } } }] } }));
    expect(a).toMatchObject({ plan: "active", pack: "premium", stripe: { customerId: "cus_1", status: "trialing", cancelAtPeriodEnd: false } });
    expect(applySubscription(a, sub({ status: "past_due" })).plan).toBe("active");
    expect(applySubscription(a, sub({ status: "active", cancel_at_period_end: true })).stripe?.cancelAtPeriodEnd).toBe(true);
    expect(applySubscription(a, sub({ status: "canceled" }), new Date("2026-11-01T00:00:00Z")).plan).toBe("paused");
    expect(applySubscription(a, sub({ status: "canceled" }), now).plan).toBe("trial");
  });

  it("la notification de Stripe passe le commerce en client", async () => {
    await newShop();
    routes = { "GET /subscriptions/sub_1": () => sub() };
    const payload = JSON.stringify({ type: "checkout.session.completed", data: { object: { mode: "subscription", subscription: "sub_1" } } });
    const t = Math.floor(Date.now() / 1000);
    const sig = createHmac("sha256", "whsec_test").update(`${t}.${payload}`).digest("hex");
    const res = await webhook(new Request("https://rouelia.fr/api/stripe/webhook", { method: "POST", body: payload, headers: { "stripe-signature": `t=${t},v1=${sig}` } }));
    expect(res.status).toBe(200);
    expect((await getShop("shop-1"))?.plan).toBe("active");
    const bad = await webhook(new Request("https://rouelia.fr/api/stripe/webhook", { method: "POST", body: payload, headers: { "stripe-signature": `t=${t},v1=faux` } }));
    expect(bad.status).toBe(400);
  });
});
