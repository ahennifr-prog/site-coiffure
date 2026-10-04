import { json } from "@/lib/http";
import { getSubscription, verifyWebhook, type StripeSubscription } from "@/lib/stripe";
import { syncSubscriptionById } from "@/lib/subscription";

/**
 * Notifications envoyées par Stripe. À déclarer dans Stripe (Développeurs, Webhooks) avec l'adresse
 * https://rouelia.fr/api/stripe/webhook et les événements checkout.session.completed et customer.subscription.*.
 */
export async function POST(req: Request) {
  const payload = await req.text();
  if (!verifyWebhook(payload, req.headers.get("stripe-signature"), process.env.STRIPE_WEBHOOK_SECRET)) return json({ ok: false }, 400);
  const event = JSON.parse(payload) as { type: string; data: { object: Record<string, unknown> } };
  const o = event.data.object;
  try {
    if (event.type === "checkout.session.completed" && o.mode === "subscription" && typeof o.subscription === "string") {
      await syncSubscriptionById(await getSubscription(o.subscription));
    } else if (event.type.startsWith("customer.subscription.")) {
      // On relit l'abonnement chez Stripe : l'ordre d'arrivée des notifications n'est pas garanti.
      await syncSubscriptionById(await getSubscription((o as unknown as StripeSubscription).id));
    }
  } catch (e) {
    console.error("[stripe] notification non traitée", event.type, e);
    return json({ ok: false }, 500);
  }
  return json({ ok: true });
}
