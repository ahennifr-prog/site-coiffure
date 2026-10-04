import { getSignup, updateSignup } from "@/lib/db";
import { getShop, saveShop, type Shop } from "@/lib/shops";
import { applySubscription, type StripeSubscription } from "@/lib/stripe";

/** Enregistre ce que Stripe dit de l'abonnement ; un commerce qui devient client l'est aussi dans les inscriptions. */
export async function syncSubscription(shop: Shop, sub: StripeSubscription): Promise<Shop> {
  const next = applySubscription(shop, sub);
  await saveShop(next);
  if (next.plan === "active" && shop.plan !== "active" && shop.signupId) {
    const s = await getSignup(shop.signupId);
    if (s && s.status !== "client") await updateSignup({ ...s, status: "client", stripeCustomerId: sub.customer });
  }
  return next;
}

/** Retrouve le commerce d'un abonnement (métadonnée posée au paiement), puis le met à jour. */
export async function syncSubscriptionById(sub: StripeSubscription): Promise<Shop | null> {
  const shopId = sub.metadata?.shop_id;
  const shop = shopId ? await getShop(shopId) : null;
  return shop ? syncSubscription(shop, sub) : null;
}
