import type { PackId } from "@/content";
import { PACK_IDS } from "@/lib/signup";
import { json, readJson, requireShop } from "@/lib/http";
import { createCheckout, stripeReady } from "@/lib/stripe";

/** Ouvre la page de paiement Stripe pour le pack choisi. */
export async function POST(req: Request) {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  if (!stripeReady()) return json({ ok: false, error: "paiement_indisponible" }, 503);
  if (shop.stripe?.subscriptionId && ["active", "trialing", "past_due"].includes(shop.stripe.status)) return json({ ok: false, error: "deja_abonne" }, 409);
  const body = await readJson(req);
  const pack = PACK_IDS.includes(body?.pack as PackId) ? (body?.pack as PackId) : shop.pack;
  try {
    return json({ ok: true, url: await createCheckout(shop, pack) });
  } catch {
    return json({ ok: false, error: "stripe" }, 502);
  }
}
