import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { getShopBySlug, publicShop } from "@/lib/shops";
import { ShopGame } from "@/components/jeu/ShopGame";

export const dynamic = "force-dynamic";

type Props = { params: Promise<{ slug: string }> };

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const shop = await getShopBySlug((await params).slug);
  return {
    title: { absolute: shop ? `Tentez votre chance | ${shop.settings.name}` : "Jeu introuvable" },
    description: shop ? `Tournez la roue de ${shop.settings.name} : chaque case est un cadeau.` : undefined,
    robots: { index: false, follow: false },
  };
}

export default async function Page({ params }: Props) {
  const shop = await getShopBySlug((await params).slug);
  if (!shop) notFound();
  return <ShopGame shop={publicShop(shop)} />;
}
