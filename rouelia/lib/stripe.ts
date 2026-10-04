/**
 * Paiement des abonnements par Stripe (API appelée directement, sans bibliothèque : le Worker n'a que fetch).
 * Secrets Cloudflare : STRIPE_SECRET_KEY (sk_test_... pour essayer, sk_live_... en réel) et STRIPE_WEBHOOK_SECRET (whsec_...).
 * Sans clé, rien ne change : l'espace propose de répondre par e-mail comme avant.
 */
import { createHmac, timingSafeEqual } from "node:crypto";
import { brand, pricing, type OfferId, type PackId } from "@/content";
import { quotePack } from "@/lib/billing";
import { resolveOffer } from "@/lib/offers";
import type { Shop } from "@/lib/shops";

export const stripeReady = () => !!process.env.STRIPE_SECRET_KEY;

/** Abonnement Stripe d'un commerce, gardé avec le commerce. */
export interface ShopStripe {
  customerId: string;
  subscriptionId: string | null;
  /** Statut Stripe brut (active, trialing, past_due, canceled...). */
  status: string;
  /** Fin de la période payée (AAAA-MM-JJ). */
  periodEnd: string | null;
  cancelAtPeriodEnd: boolean;
}

type Params = Record<string, unknown>;

/** Encode des paramètres imbriqués au format attendu par Stripe (a[b][0]=c). */
export function formEncode(params: Params, prefix = ""): string {
  const out: string[] = [];
  for (const [k, v] of Object.entries(params)) {
    if (v === undefined || v === null) continue;
    const key = prefix ? `${prefix}[${k}]` : k;
    if (Array.isArray(v)) v.forEach((item, i) => out.push(typeof item === "object" ? formEncode(item as Params, `${key}[${i}]`) : `${encodeURIComponent(`${key}[${i}]`)}=${encodeURIComponent(String(item))}`));
    else if (typeof v === "object") out.push(formEncode(v as Params, key));
    else out.push(`${encodeURIComponent(key)}=${encodeURIComponent(String(v))}`);
  }
  return out.filter(Boolean).join("&");
}

type Fetcher = (url: string, init: RequestInit) => Promise<Response>;
const g = globalThis as unknown as { __roueliaStripeFetch?: Fetcher | null };
/** Pour les tests : remplace les appels à Stripe. */
export function setStripeFetch(f: Fetcher | null) {
  g.__roueliaStripeFetch = f;
}

export class StripeError extends Error {
  constructor(public status: number, public code: string) {
    super(`stripe_${status}_${code}`);
  }
}

async function api<T = Record<string, unknown>>(method: "GET" | "POST", path: string, params: Params = {}, idempotencyKey?: string): Promise<T> {
  const key = process.env.STRIPE_SECRET_KEY;
  if (!key) throw new StripeError(0, "no_key");
  const body = formEncode(params);
  const url = `https://api.stripe.com/v1${path}${method === "GET" && body ? `?${body}` : ""}`;
  const headers: Record<string, string> = { Authorization: `Bearer ${key}`, "Stripe-Version": "2025-03-31.basil" };
  if (method === "POST") headers["Content-Type"] = "application/x-www-form-urlencoded";
  if (idempotencyKey) headers["Idempotency-Key"] = idempotencyKey;
  const res = await (g.__roueliaStripeFetch ?? fetch)(url, { method, headers, body: method === "POST" ? body : undefined });
  const data = (await res.json().catch(() => ({}))) as Record<string, unknown>;
  if (!res.ok) {
    const err = (data.error ?? {}) as { code?: string; message?: string };
    console.error("[stripe]", method, path, res.status, err.message);
    throw new StripeError(res.status, err.code ?? "erreur");
  }
  return data as T;
}

/* ------------------------------------------------------------------ */
/* Catalogue : créé tout seul au premier besoin, en test comme en réel  */
/* ------------------------------------------------------------------ */

const PRICE_VERSION = "v1";
export const lookupKey = (pack: PackId, price: number) => `rouelia_${pack}_${price}eur_${PRICE_VERSION}`;

/** Identifiant du prix mensuel d'un pack (le produit et le prix sont créés s'ils n'existent pas). */
export async function ensurePrice(packId: PackId): Promise<string> {
  const pack = pricing.packs.find((p) => p.id === packId) ?? pricing.packs[0];
  const key = lookupKey(pack.id, pack.price);
  const found = await api<{ data: { id: string }[] }>("GET", "/prices", { lookup_keys: [key], active: true, limit: 1 });
  if (found.data[0]) return found.data[0].id;
  const product = await api<{ id: string }>("POST", "/products", { name: `Rouelia ${pack.name}`, description: pack.tagline, metadata: { pack: pack.id } }, `product-${key}`);
  const price = await api<{ id: string }>(
    "POST",
    "/prices",
    { product: product.id, currency: "eur", unit_amount: Math.round(pack.price * 100), recurring: { interval: "month" }, lookup_key: key, transfer_lookup_key: true, metadata: { pack: pack.id } },
    `price-${key}`,
  );
  return price.id;
}

/** Bon de réduction du premier mois pour un cadeau de la roue d'offres (créé s'il n'existe pas). */
export async function ensureCoupon(packId: PackId, wonOffer: OfferId | null): Promise<string | null> {
  const q = quotePack(packId, wonOffer);
  if (!wonOffer || q.discount <= 0) return null;
  const offer = resolveOffer(wonOffer, packId).id;
  const id = `rouelia_${offer}_${packId}_${Math.round(q.discount * 100)}`;
  try {
    await api("GET", `/coupons/${id}`);
    return id;
  } catch (e) {
    if (!(e instanceof StripeError) || e.status !== 404) throw e;
  }
  await api("POST", "/coupons", { id, name: q.offerLabel ?? "Cadeau Rouelia", amount_off: Math.round(q.discount * 100), currency: "eur", duration: "once" }, `coupon-${id}`);
  return id;
}

/* ------------------------------------------------------------------ */
/* Paiement et portail                                                 */
/* ------------------------------------------------------------------ */

const DAY = 86_400_000;

/** Ouvre une page de paiement Stripe pour le pack choisi. Le premier prélèvement attend la fin de l'essai. */
export async function createCheckout(shop: Shop, packId: PackId, now = new Date()): Promise<string> {
  const price = await ensurePrice(packId);
  const coupon = await ensureCoupon(packId, shop.offer?.wonId ?? null);
  const trialEnd = Math.floor(new Date(shop.trialEndsAt).getTime() / 1000);
  // Stripe demande au moins 48 heures d'essai restant ; en dessous, l'abonnement démarre tout de suite.
  const deferred = shop.plan === "trial" && trialEnd * 1000 - now.getTime() > 2 * DAY + 3_600_000;
  const back = `${brand.url}/espace/abonnement`;
  const session = await api<{ url: string }>("POST", "/checkout/sessions", {
    mode: "subscription",
    locale: "fr",
    line_items: [{ price, quantity: 1 }],
    ...(shop.stripe?.customerId ? { customer: shop.stripe.customerId } : { customer_email: shop.email }),
    client_reference_id: shop.id,
    metadata: { shop_id: shop.id, pack: packId },
    subscription_data: { metadata: { shop_id: shop.id, pack: packId }, ...(deferred ? { trial_end: trialEnd } : {}) },
    ...(coupon ? { discounts: [{ coupon }] } : { allow_promotion_codes: true }),
    payment_method_collection: "always",
    success_url: `${back}?retour=ok&session={CHECKOUT_SESSION_ID}`,
    cancel_url: `${back}?retour=annule`,
  });
  return session.url;
}

/** Portail client Stripe : carte, factures, changement de pack, arrêt en un clic. */
export async function createPortal(shop: Shop): Promise<string> {
  if (!shop.stripe?.customerId) throw new StripeError(0, "no_customer");
  const s = await api<{ url: string }>("POST", "/billing_portal/sessions", { customer: shop.stripe.customerId, return_url: `${brand.url}/espace/abonnement`, locale: "fr" });
  return s.url;
}

/* ------------------------------------------------------------------ */
/* Abonnement : ce que Stripe nous dit, appliqué au commerce            */
/* ------------------------------------------------------------------ */

export interface StripeSubscription {
  id: string;
  customer: string;
  status: string;
  cancel_at_period_end: boolean;
  metadata?: Record<string, string>;
  items?: { data: { current_period_end?: number; price?: { lookup_key?: string | null; metadata?: Record<string, string> } }[] };
  current_period_end?: number;
}

const day = (unix?: number) => (unix ? new Date(unix * 1000).toISOString().slice(0, 10) : null);
const LIVE = ["active", "trialing", "past_due"];

/** Le commerce après un changement d'abonnement : client payant tant que Stripe le dit, en pause sinon. */
export function applySubscription(shop: Shop, sub: StripeSubscription, now = new Date()): Shop {
  const item = sub.items?.data[0];
  const pack = (item?.price?.metadata?.pack ?? sub.metadata?.pack) as PackId | undefined;
  const live = LIVE.includes(sub.status);
  const next: Shop = {
    ...shop,
    stripe: {
      customerId: sub.customer,
      subscriptionId: sub.id,
      status: sub.status,
      periodEnd: day(item?.current_period_end ?? sub.current_period_end),
      cancelAtPeriodEnd: !!sub.cancel_at_period_end,
    },
  };
  if (pack && pricing.packs.some((p) => p.id === pack)) next.pack = pack;
  if (live) next.plan = "active";
  else if (["canceled", "unpaid", "incomplete_expired"].includes(sub.status) && shop.plan === "active")
    // Arrêt pendant l'essai : le commerçant garde ses jours gratuits restants, puis la roue se met en pause.
    next.plan = new Date(shop.trialEndsAt).getTime() > now.getTime() ? "trial" : "paused";
  return next;
}

export const getSubscription = (id: string) => api<StripeSubscription>("GET", `/subscriptions/${id}`);

/** Session de paiement terminée : l'abonnement qu'elle a créé, et le commerce concerné. */
export async function checkoutResult(sessionId: string): Promise<{ shopId: string; subscription: StripeSubscription } | null> {
  const s = await api<{ status: string; client_reference_id: string | null; subscription: string | null }>("GET", `/checkout/sessions/${encodeURIComponent(sessionId)}`);
  if (s.status !== "complete" || !s.client_reference_id || !s.subscription) return null;
  return { shopId: s.client_reference_id, subscription: await getSubscription(s.subscription) };
}

/* ------------------------------------------------------------------ */
/* Notifications de Stripe (webhook)                                   */
/* ------------------------------------------------------------------ */

/** Vérifie la signature d'une notification Stripe (en-tête Stripe-Signature). */
export function verifyWebhook(payload: string, header: string | null, secret: string | undefined, now = Date.now(), tolerance = 300): boolean {
  if (!header || !secret) return false;
  const parts = Object.fromEntries(header.split(",").map((kv) => kv.split("=") as [string, string]));
  const t = Number(parts.t);
  const sigs = header.split(",").filter((kv) => kv.startsWith("v1=")).map((kv) => kv.slice(3));
  if (!t || !sigs.length || Math.abs(now / 1000 - t) > tolerance) return false;
  const expected = Buffer.from(createHmac("sha256", secret).update(`${t}.${payload}`).digest("hex"));
  return sigs.some((s) => {
    const b = Buffer.from(s);
    return b.length === expected.length && timingSafeEqual(b, expected);
  });
}
