import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { currentShop } from "@/lib/espace";
import { publicShop } from "@/lib/shops";
import { Flyer } from "@/components/espace/Flyer";

export const dynamic = "force-dynamic";
export const metadata: Metadata = { title: "Flyer et chevalet", robots: { index: false, follow: false } };

export default async function Page() {
  const shop = await currentShop();
  if (!shop) redirect("/espace/connexion");
  const p = publicShop(shop);
  return (
    <Flyer
      shop={{
        slug: p.slug,
        name: p.name,
        primary: p.theme.primary,
        onPrimary: p.theme.onPrimary,
        rim: p.theme.rim,
        monogram: p.theme.monogram,
        logoUrl: p.logoUrl,
        poweredBy: p.poweredBy,
        colors: p.theme.colors,
        prizes: p.prizes.map((x) => x.name),
      }}
    />
  );
}
