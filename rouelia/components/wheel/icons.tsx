import {
  CakeSlice, Coffee, Croissant, Droplet, Gift, Hand, Heart, IceCreamCone, Leaf, Paintbrush,
  Percent, Scissors, SprayCan, Stamp, Star, UtensilsCrossed, Wheat, Wine, type LucideIcon,
} from "lucide-react";
import type { PrizeIcon } from "@/content";

export const prizeIcons: Record<PrizeIcon, { Icon: LucideIcon; label: string }> = {
  cadeau: { Icon: Gift, label: "Cadeau" },
  pourcent: { Icon: Percent, label: "Remise" },
  etoile: { Icon: Star, label: "Étoile" },
  coeur: { Icon: Heart, label: "Cœur" },
  ciseaux: { Icon: Scissors, label: "Ciseaux" },
  flacon: { Icon: SprayCan, label: "Flacon" },
  goutte: { Icon: Droplet, label: "Soin" },
  vernis: { Icon: Paintbrush, label: "Vernis" },
  main: { Icon: Hand, label: "Main" },
  feuille: { Icon: Leaf, label: "Feuille" },
  cafe: { Icon: Coffee, label: "Café" },
  verre: { Icon: Wine, label: "Verre" },
  assiette: { Icon: UtensilsCrossed, label: "Repas" },
  dessert: { Icon: IceCreamCone, label: "Dessert" },
  croissant: { Icon: Croissant, label: "Viennoiserie" },
  baguette: { Icon: Wheat, label: "Pain" },
  gateau: { Icon: CakeSlice, label: "Gâteau" },
  carte: { Icon: Stamp, label: "Fidélité" },
};

export const prizeIconIds = Object.keys(prizeIcons) as PrizeIcon[];
