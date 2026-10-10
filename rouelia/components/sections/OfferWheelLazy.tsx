"use client";

import dynamic from "next/dynamic";
import { offerWheel } from "@/content";
import { WhenVisible } from "@/components/ui/WhenVisible";

const OfferWheel = dynamic(() => import("./OfferWheel").then((m) => m.OfferWheel), { ssr: false, loading: () => <Placeholder /> });

/** Même encombrement que la roue : rien ne bouge quand elle arrive. */
function Placeholder() {
  return (
    <div role="status" aria-label={offerWheel.wheelLabel} className="flex flex-col items-center">
      <div className="aspect-square w-full rounded-full bg-white/10 ring-1 ring-white/20" />
      <div className="mt-4 h-11" />
    </div>
  );
}

/**
 * Roue d'offres de bas de page, chargée seulement à l'approche (environ deux écrans avant) :
 * l'accueil s'affiche plus vite, sans rien changer pour le visiteur qui descend jusqu'à elle.
 */
export function OfferWheelLazy() {
  return (
    <WhenVisible margin="1200px" fallback={<Placeholder />}>
      <OfferWheel />
    </WhenVisible>
  );
}
