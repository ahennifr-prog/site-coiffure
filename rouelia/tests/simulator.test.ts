import { describe, expect, it } from "vitest";
import { pricePerDay, simulate, visitsToCoverPack } from "@/lib/simulator";

const base = {
  clientsPerDay: 15, openDaysPerMonth: 26, playRate: 0.2, redeemRate: 0.3, incrementalRate: 0.4,
  averageBasket: 35, grossMargin: 0.75, lotCost: 2, packPrice: 49,
};

describe("simulateur", () => {
  it("calcule chaque étape", () => {
    const r = simulate(base);
    expect(r.plays).toBeCloseTo(78);
    expect(r.returns).toBeCloseTo(23.4);
    expect(r.extraVisits).toBeCloseTo(9.36);
    expect(r.extraRevenue).toBeCloseTo(327.6);
    expect(r.extraMargin).toBeCloseTo(245.7);
    expect(r.lotsCost).toBeCloseTo(46.8);
    expect(r.packCost).toBe(49);
    expect(r.balance).toBeCloseTo(245.7 - 46.8 - 49);
  });
  it("borne les taux et ignore les valeurs absurdes", () => {
    const r = simulate({ ...base, playRate: 2, redeemRate: -1, clientsPerDay: Number.NaN });
    expect(r.plays).toBe(0);
    expect(r.balance).toBe(-49);
  });
  it("un solde négatif est possible et affiché tel quel", () => {
    expect(simulate({ ...base, clientsPerDay: 1 }).balance).toBeLessThan(0);
  });
  it("prix par jour arrondi aux 5 centimes", () => {
    expect(pricePerDay(49)).toBeCloseTo(1.6);
    expect(pricePerDay(29)).toBeCloseTo(0.95);
    expect(pricePerDay(89)).toBeCloseTo(2.95);
  });
  it("visites pour couvrir le pack", () => {
    expect(visitsToCoverPack(49, 35, 0.75)).toBe(2);
    expect(visitsToCoverPack(49, 0, 0.75)).toBe(Infinity);
  });
});

describe("rentabilité affichée", () => {
  it("vient du calcul et vaut 2 clients (salon de coiffure, pack Croissance)", async () => {
    const { profitability, pricing } = await import("@/content");
    expect(profitability.clients).toBe(2);
    expect(pricing.profit).toBe("Rentable dès 2 clients qui reviennent par mois.");
  });
});
