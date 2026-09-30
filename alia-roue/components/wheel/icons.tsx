import { Crown, Droplet, Gift, Heart, Percent, Scissors, Sparkles, Star, type LucideIcon } from "lucide-react";
import type { PrizeIcon } from "@/lib/types";

export const prizeIcons: Record<PrizeIcon, { Icon: LucideIcon; label: string }> = {
  cadeau: { Icon: Gift, label: "Cadeau" },
  pourcent: { Icon: Percent, label: "Remise" },
  goutte: { Icon: Droplet, label: "Soin" },
  ciseaux: { Icon: Scissors, label: "Coupe" },
  etoile: { Icon: Star, label: "Étoile" },
  coeur: { Icon: Heart, label: "Cœur" },
  couronne: { Icon: Crown, label: "Couronne" },
  eclat: { Icon: Sparkles, label: "Éclat" },
};
