import { json, requireShop } from "@/lib/http";
import { createPortal, stripeReady } from "@/lib/stripe";

/** Portail client Stripe : carte, factures, changement de pack, arrêt. */
export async function POST() {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  if (!stripeReady() || !shop.stripe?.customerId) return json({ ok: false, error: "paiement_indisponible" }, 503);
  try {
    return json({ ok: true, url: await createPortal(shop) });
  } catch {
    return json({ ok: false, error: "stripe" }, 502);
  }
}
