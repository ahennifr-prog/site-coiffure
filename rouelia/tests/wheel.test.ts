import { describe, expect, it } from "vitest";
import { trades } from "@/content";
import {
  addPrize, averageCost, distribute, generateCode, maxPercentFor, normalize, pickWeighted,
  removePrize, roundToTotal, segmentAt, setPercent, sumPercents, targetRotation, withIds,
  type WheelPrize,
} from "@/lib/wheel";

function seeded(seed: number) {
  let s = seed >>> 0;
  return () => {
    s = (s * 1664525 + 1013904223) >>> 0;
    return s / 2 ** 32;
  };
}

const sample = (): WheelPrize[] => withIds(trades[0].prizes);

describe("modèles de lots", () => {
  it.each(trades.map((t) => [t.id, t]))("%s totalise 100 %% et reste entre 3 et 8 lots", (_id, t) => {
    expect(sumPercents(t.prizes)).toBe(100);
    expect(t.prizes.length).toBeGreaterThanOrEqual(3);
    expect(t.prizes.length).toBeLessThanOrEqual(8);
  });
});

describe("arrondis", () => {
  it("roundToTotal garde la somme exacte", () => {
    expect(roundToTotal([33.3, 33.3, 33.4], 100)).toEqual([33, 33, 34]);
    expect(sumPercents(roundToTotal([10.5, 20.5, 69], 100).map((percent) => ({ percent })))).toBe(100);
  });
  it("distribute respecte le minimum et la somme", () => {
    const out = distribute([0, 0, 50], 60);
    expect(out.reduce((a, b) => a + b, 0)).toBe(60);
    out.forEach((v) => expect(v).toBeGreaterThanOrEqual(1));
  });
  it("distribute répartit également si tous les poids sont nuls", () => {
    expect(distribute([0, 0, 0], 30)).toEqual([10, 10, 10]);
  });
});

describe("setPercent", () => {
  it("la somme reste 100 après chaque modification", () => {
    let p = sample();
    const rand = seeded(42);
    for (let k = 0; k < 500; k++) {
      const i = Math.floor(rand() * p.length);
      p = setPercent(p, i, Math.floor(rand() * 120) - 10);
      expect(sumPercents(p)).toBe(100);
      p.forEach((x) => expect(x.percent).toBeGreaterThanOrEqual(1));
    }
  });

  it("redistribue l'écart proportionnellement", () => {
    const p = withIds([
      { name: "A", icon: "cadeau", cost: 1, percent: 40 },
      { name: "B", icon: "cadeau", cost: 1, percent: 40 },
      { name: "C", icon: "cadeau", cost: 1, percent: 20 },
    ]);
    const next = setPercent(p, 0, 70);
    expect(next.map((x) => x.percent)).toEqual([70, 20, 10]);
  });

  it("ne touche pas aux lots bloqués", () => {
    const p = sample();
    p[1].locked = true;
    const locked = p[1].percent;
    const next = setPercent(p, 0, 50);
    expect(next[1].percent).toBe(locked);
    expect(sumPercents(next)).toBe(100);
  });

  it("borne la valeur à ce qui reste disponible", () => {
    const p = sample();
    const max = maxPercentFor(p, 0);
    expect(max).toBe(100 - (p.length - 1));
    expect(setPercent(p, 0, 1000)[0].percent).toBe(max);
    expect(setPercent(p, 0, -5)[0].percent).toBe(1);
  });

  it("ignore une valeur non numérique", () => {
    const next = setPercent(sample(), 0, Number.NaN);
    expect(sumPercents(next)).toBe(100);
  });
});

describe("ajout et retrait", () => {
  it("addPrize garde 100 %", () => {
    let p = sample();
    p = addPrize(p, { name: "Nouveau", icon: "cadeau", cost: 1 });
    expect(p).toHaveLength(7);
    expect(sumPercents(p)).toBe(100);
  });
  it("removePrize garde 100 %", () => {
    let p = sample();
    p = removePrize(p, 2);
    expect(p).toHaveLength(5);
    expect(sumPercents(p)).toBe(100);
  });
  it("removePrize débloque si tous les restants sont bloqués", () => {
    const p = sample().slice(0, 3).map((x) => ({ ...x, locked: true }));
    const next = removePrize(normalize(p), 0);
    expect(sumPercents(next)).toBe(100);
  });
});

describe("coût moyen", () => {
  it("somme des coûts pondérés par les chances", () => {
    expect(averageCost([{ cost: 1, percent: 50 }, { cost: 3, percent: 50 }])).toBeCloseTo(2);
    expect(averageCost(trades[0].prizes)).toBeCloseTo(2.015, 3);
  });
});

describe("tirage pondéré", () => {
  it("respecte les bornes", () => {
    const p = [{ percent: 10 }, { percent: 90 }];
    expect(pickWeighted(p, () => 0)).toBe(0);
    expect(pickWeighted(p, () => 0.0999)).toBe(0);
    expect(pickWeighted(p, () => 0.1)).toBe(1);
    expect(pickWeighted(p, () => 0.99999)).toBe(1);
  });
  it("suit les pourcentages sur un grand nombre de tirages", () => {
    const p = trades[1].prizes;
    const rand = seeded(7);
    const counts = new Array(p.length).fill(0);
    const n = 200_000;
    for (let i = 0; i < n; i++) counts[pickWeighted(p, rand)]++;
    counts.forEach((c, i) => expect(c / n).toBeCloseTo(p[i].percent / 100, 2));
  });
});

describe("rotation", () => {
  it("s'arrête toujours sur le segment gagné, après plusieurs tours", () => {
    const rand = seeded(3);
    let rot = 0;
    for (let k = 0; k < 300; k++) {
      const n = 3 + Math.floor(rand() * 6);
      const idx = Math.floor(rand() * n);
      const next = targetRotation(rot, idx, n, rand);
      expect(next - rot).toBeGreaterThanOrEqual(5 * 360);
      expect(segmentAt(next, n)).toBe(idx);
      rot = next;
    }
  });
});

describe("code cadeau", () => {
  it("a le format ROU-XXXX sans caractères ambigus", () => {
    const rand = seeded(9);
    for (let i = 0; i < 200; i++) expect(generateCode("ROU", rand)).toMatch(/^ROU-[2-9A-HJKMNP-Z]{4}$/);
  });
});
