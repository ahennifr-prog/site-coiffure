import { createHmac } from "node:crypto";
import { describe, expect, it } from "vitest";
import { offerWheel } from "@/content";
import { drawOffer, offerForSignup, offerToken, readOfferToken, resolveOffer, suggestedPack } from "@/lib/offers";

const signer = {
  sign: (p: string) => createHmac("sha256", "test").update(p).digest("base64url"),
  check: (p: string, sig: string) => createHmac("sha256", "test").update(p).digest("base64url") === sig,
};
const now = new Date("2026-10-01T10:00:00Z");

describe("roue d'offres", () => {
  it("totalise 100 % et respecte les chances demandées", () => {
    expect(offerWheel.offers.reduce((s, o) => s + o.percent, 0)).toBe(100);
    expect(Object.fromEntries(offerWheel.offers.map((o) => [o.id, o.percent]))).toEqual({
      essai_21: 28, installation: 24, flyers: 22, audit: 17, moitie_1er_mois: 5, premium_prix_croissance: 3, mois_offert: 1,
    });
  });

  it("tire selon les poids et donne 7 jours", () => {
    expect(drawOffer(() => 0, now).id).toBe("essai_21");
    expect(drawOffer(() => 0.995, now).id).toBe("mois_offert");
    expect(drawOffer(() => 0.5, now).expiresAt).toBe("2026-10-08T10:00:00.000Z");
  });

  it("n'est jamais valable sur l'Essentiel", () => {
    for (const o of offerWheel.offers) expect(resolveOffer(o.id, "essentiel").status).toBe("needs_croissance");
  });

  it("remplace l'audit par l'installation en Premium", () => {
    expect(resolveOffer("audit", "premium")).toEqual({ status: "applied", id: "installation", substituted: true });
    expect(resolveOffer("audit", "croissance")).toEqual({ status: "applied", id: "audit", substituted: false });
  });

  it("Premium au prix de Croissance demande le pack Premium", () => {
    expect(resolveOffer("premium_prix_croissance", "croissance").status).toBe("needs_premium");
    expect(resolveOffer("premium_prix_croissance", "premium").status).toBe("applied");
    expect(suggestedPack("premium_prix_croissance")).toBe("premium");
    expect(suggestedPack("flyers")).toBe("croissance");
  });

  it("refuse un jeton modifié ou expiré", () => {
    const o = drawOffer(() => 0.5, now);
    const token = offerToken(o, signer);
    expect(readOfferToken(token, signer, now)).toEqual(o);
    const forged = Buffer.from(JSON.stringify({ i: "mois_offert", c: o.code, w: o.wonAt, e: o.expiresAt })).toString("base64url");
    expect(readOfferToken(`${forged}.${token.split(".")[1]}`, signer, now)).toBeNull();
    expect(readOfferToken(token, signer, new Date("2026-10-09T10:00:00Z"))).toBeNull();
    expect(readOfferToken("n'importe quoi", signer, now)).toBeNull();
  });

  it("rattache le cadeau à l'inscription selon le pack", () => {
    const o = { ...drawOffer(() => 0.6, now), id: "audit" as const };
    const token = offerToken(o, signer);
    expect(offerForSignup(token, "premium", signer, now)).toMatchObject({ wonId: "audit", id: "installation", status: "applied" });
    expect(offerForSignup(token, "essentiel", signer, now)).toMatchObject({ id: "audit", status: "needs_croissance" });
    expect(offerForSignup(null, "croissance", signer, now)).toBeNull();
  });
});
