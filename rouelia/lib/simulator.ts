export interface SimulatorInput {
  clientsPerDay: number;
  openDaysPerMonth: number;
  /** Part des clients qui jouent, entre 0 et 1. */
  playRate: number;
  /** Part des gagnants qui reviennent retirer leur cadeau, entre 0 et 1. */
  redeemRate: number;
  /** Part des retours qui sont de vraies visites en plus, entre 0 et 1. */
  incrementalRate: number;
  averageBasket: number;
  /** Part du panier qui reste au commerçant, entre 0 et 1. */
  grossMargin: number;
  /** Coût moyen d'un cadeau, en euros (le coût moyen par partie de la roue). */
  lotCost: number;
  packPrice: number;
}

export interface SimulatorResult {
  plays: number;
  returns: number;
  extraVisits: number;
  extraRevenue: number;
  extraMargin: number;
  lotsCost: number;
  packCost: number;
  balance: number;
  /** Rapport entre ce que ça rapporte (marge) et ce que ça coûte. */
  ratio: number;
}

const clamp01 = (v: number) => Math.min(1, Math.max(0, Number.isFinite(v) ? v : 0));
const pos = (v: number) => Math.max(0, Number.isFinite(v) ? v : 0);

export function simulate(input: SimulatorInput): SimulatorResult {
  const plays = pos(input.clientsPerDay) * pos(input.openDaysPerMonth) * clamp01(input.playRate);
  // Chaque partie est gagnante : les cadeaux retirés sont les gagnants qui reviennent.
  const returns = plays * clamp01(input.redeemRate);
  const extraVisits = returns * clamp01(input.incrementalRate);
  const extraRevenue = extraVisits * pos(input.averageBasket);
  const extraMargin = extraRevenue * clamp01(input.grossMargin);
  // Seuls les cadeaux effectivement retirés coûtent quelque chose.
  const lotsCost = returns * pos(input.lotCost);
  const packCost = pos(input.packPrice);
  const costs = lotsCost + packCost;
  return {
    plays,
    returns,
    extraVisits,
    extraRevenue,
    extraMargin,
    lotsCost,
    packCost,
    balance: extraMargin - costs,
    ratio: costs > 0 ? extraMargin / costs : 0,
  };
}

/** Nombre de visites en plus par mois pour couvrir le prix du pack. */
export function visitsToCoverPack(packPrice: number, averageBasket: number, grossMargin: number): number {
  const perVisit = pos(averageBasket) * clamp01(grossMargin);
  if (perVisit <= 0) return Infinity;
  return Math.ceil(pos(packPrice) / perVisit);
}

/** Prix mensuel ramené à la journée, arrondi aux 5 centimes. */
export function pricePerDay(monthly: number): number {
  return Math.round(((monthly * 12) / 365) * 20) / 20;
}
