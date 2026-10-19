"use client";

import dynamic from "next/dynamic";
import { offerWheel } from "@/content";
import { WhenVisible } from "@/components/ui/WhenVisible";

const OfferWheel = dynamic(() => import("./OfferWheel").then((m) => m.OfferWheel), { ssr: false, loading: () => <Placeholder /> });

/** Même encombrement que la roue : rien ne bouge quand elle arrive. */
function Placeholder() {
  return (
    <div role="status" aria-label={offerWheel.wheelLabel} className="flex flex-col items-center">
      <div className="aspect-square w-full max-w-[min(72vw,320px)] rounded-full bg-safran/20 ring-1 ring-safran/40" />
      <div className="mt-4 h-11" />
    </div>
  );
}

/**
 * Roue du cadeau de bienvenue, chargée seulement à l'approche :
 * la page s'affiche plus vite, sans rien changer pour le visiteur.
 */
export function OfferWheelLazy() {
  return (
    <WhenVisible margin="1200px" fallback={<Placeholder />}>
      <OfferWheel />
    </WhenVisible>
  );
}
