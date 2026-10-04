import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { parisDay } from "@/lib/dates";
import { currentShop } from "@/lib/espace";
import { trialDaysLeft } from "@/lib/shops";
import { checkoutResult, stripeReady } from "@/lib/stripe";
import { syncSubscription } from "@/lib/subscription";
import { Abonnement, type AbonnementProps } from "@/components/espace/Abonnement";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Votre abonnement", robots: { index: false, follow: false } };

export default async function Page({ searchParams }: { searchParams: Promise<{ retour?: string; session?: string }> }) {
  let shop = await currentShop();
  if (!shop) redirect("/espace/connexion");
  const q = await searchParams;
  // Au retour du paiement, on n'attend pas la notification de Stripe : on relit la session tout de suite.
  if (q.retour === "ok" && q.session && stripeReady()) {
    try {
      const r = await checkoutResult(q.session);
      if (r && r.shopId === shop.id) shop = await syncSubscription(shop, r.subscription);
    } catch {
      /* la notification de Stripe fera la mise à jour */
    }
  }
  const st = shop.stripe;
  const live = st?.subscriptionId && ["active", "trialing", "past_due"].includes(st.status);
  const subscription: AbonnementProps["subscription"] = live
    ? { status: st.cancelAtPeriodEnd ? "canceling" : st.status === "past_due" ? "past_due" : "active", renewsOn: st.periodEnd }
    : null;
  return (
    <Abonnement
      firstName={shop.firstName}
      shopName={shop.settings.name}
      pack={shop.pack}
      plan={shop.plan}
      trialEnd={parisDay(new Date(shop.trialEndsAt))}
      daysLeft={trialDaysLeft(shop)}
      wonOffer={shop.offer?.wonId ?? null}
      subscription={subscription}
      stripeReady={stripeReady()}
      returned={q.retour === "ok" && live ? "ok" : q.retour === "annule" ? "annule" : null}
    />
  );
}
