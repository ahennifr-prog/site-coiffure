import { pricing, type OfferId, type PackId } from "@/content";
import { offerById, resolveOffer } from "@/lib/offers";

export type Pack = (typeof pricing.packs)[number];

/** Ce que coûte un pack le premier mois, selon le cadeau de la roue d'offres gagné par le commerçant. */
export interface PackQuote {
  packId: PackId;
  price: number;
  /** Prix du premier mois s'il diffère du prix normal. */
  firstMonth: number | null;
  /** Cadeau qui s'applique avec ce pack (libellé), sans effet sur le prix ou avec. */
  offerLabel: string | null;
  /** Remise du premier mois en euros (0 si aucune). */
  discount: number;
}

export function quotePack(packId: PackId, wonOffer: OfferId | null): PackQuote {
  const pack = pricing.packs.find((p) => p.id === packId) ?? pricing.packs[0];
  const base = { packId: pack.id, price: pack.price, firstMonth: null, offerLabel: null, discount: 0 };
  if (!wonOffer) return base;
  const r = resolveOffer(wonOffer, pack.id);
  if (r.status !== "applied" || r.id === "essai_21") return base;
  const croissance = pricing.packs.find((p) => p.id === "croissance")?.price ?? pack.price;
  const firstMonth =
    r.id === "moitie_1er_mois" ? Math.round(pack.price * 50) / 100 : r.id === "mois_offert" ? 0 : r.id === "premium_prix_croissance" ? croissance : null;
  return { ...base, firstMonth, offerLabel: offerById(r.id).label, discount: firstMonth === null ? 0 : Math.round((pack.price - firstMonth) * 100) / 100 };
}
