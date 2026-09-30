export type PrizeIcon = "cadeau" | "pourcent" | "goutte" | "ciseaux" | "etoile" | "coeur" | "couronne" | "eclat";
export type Tier = "petit" | "gros";

export interface Prize {
  id: string;
  name: string;
  /** Précision affichée sur l'écran de gain, ex. « valable sur toutes les prestations ». */
  detail: string;
  icon: PrizeIcon;
  tier: Tier;
  /** Valeur estimée pour le salon, en euros (sert au suivi). */
  cost: number;
  /** Chance de sortir, en pourcentage. La somme de tous les lots vaut 100. */
  percent: number;
}

export interface GameConfig {
  active: boolean;
  reviewUrl: string;
  bookingUrl: string;
  prizes: Prize[];
  /** Durée de validité du code, en jours. */
  validityDays: number;
  /** Délai avant de pouvoir utiliser le code (1 = à partir du lendemain). */
  delayDays: number;
  /** Une partie par numéro de téléphone tous les N jours. */
  replayDays: number;
  updatedAt: string | null;
}

export interface Play {
  code: string;
  prizeId: string;
  prizeName: string;
  prizeDetail: string;
  tier: Tier;
  cost: number;
  firstName: string;
  phone: string;
  createdAt: string;
  /** Dates au format AAAA-MM-JJ, heure de Paris. */
  validFrom: string;
  expiresOn: string;
  redeemedAt: string | null;
  consentText: string;
}

export type StatField = "visites" | "avis_ouverts" | "avis_clics" | "avis_fermes" | "parties" | "retraits" | "deja_joue";
