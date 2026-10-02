import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { parisDay } from "@/lib/dates";
import { currentShop } from "@/lib/espace";
import { gameState, trialDaysLeft } from "@/lib/shops";
import { Espace } from "@/components/espace/Espace";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Votre espace", robots: { index: false, follow: false } };

export default async function Page() {
  const shop = await currentShop();
  if (!shop) redirect("/espace/connexion");
  return (
    <Espace
      slug={shop.slug}
      name={shop.settings.name}
      firstName={shop.firstName}
      pack={shop.pack}
      plan={shop.plan}
      trialEnd={parisDay(new Date(shop.trialEndsAt))}
      daysLeft={trialDaysLeft(shop)}
      state={gameState(shop)}
      codePrefix={shop.codePrefix}
      offer={shop.offer ? { id: shop.offer.id, applied: shop.offer.status === "applied" } : null}
    />
  );
}
