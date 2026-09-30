import { describe, expect, it } from "vitest";
import { buildRecord, forLog, normalizeFrenchPhone, validateSignup } from "@/lib/signup";

describe("téléphone", () => {
  it.each([
    ["06 12 34 56 78", "+33612345678"],
    ["6 12 34 56 78", "+33612345678"],
    ["+33 6 12 34 56 78", "+33612345678"],
    ["0033612345678", "+33612345678"],
    ["01.23.45.67.89", "+33123456789"],
  ])("%s", (input, out) => expect(normalizeFrenchPhone(input)).toBe(out));
  it.each(["123", "06 12 34", "00 00 00 00 00", "abc"])("refuse %s", (input) =>
    expect(normalizeFrenchPhone(input)).toBeNull());
});

describe("validation", () => {
  it("signale chaque champ manquant", () => {
    expect(validateSignup({ firstName: "", email: "", phone: "", shopName: "", consent: false })).toEqual({
      firstName: "firstName", email: "emailMissing", phone: "phoneMissing", shopName: "shopName", consent: "consent",
    });
  });
  it("e-mail invalide", () => {
    expect(validateSignup({ firstName: "A", email: "a@b", phone: "0612345678", shopName: "X", consent: true }).email).toBe("emailInvalid");
  });
});

describe("enregistrement", () => {
  const body = {
    firstName: " Martine ", email: "Martine@Salon.fr", phone: "06 12 34 56 78",
    establishment: { name: "Salon Martine", placeId: null },
    pack: "croissance",
    wheel: { shopName: "Salon Martine", trade: "coiffeur", paletteId: "tomette", primaryColor: null, logo: "data:image/png;base64,AAAA", noLogo: false, prizes: [{ name: "Soin", icon: "goutte", cost: 2.5, percent: 100, hasImage: false }], averageCost: 2.5 },
    utm: { source: "flyer", medium: null },
    consent: { accepted: true, text: "J'accepte" },
  };
  it("construit un enregistrement complet", () => {
    const r = buildRecord(body, new Date("2026-10-01T10:00:00Z"), "id-1");
    expect(r.ok).toBe(true);
    if (!r.ok) return;
    expect(r.record).toMatchObject({
      id: "id-1", firstName: "Martine", email: "martine@salon.fr", phone: "+33612345678",
      shopName: "Salon Martine", trade: "coiffeur", pack: "croissance", status: "essai_en_attente",
      trialStartedAt: null, firstPlayAt: null, stripeCustomerId: null,
      consent: { accepted: true, date: "2026-10-01T10:00:00.000Z", text: "J'accepte" },
      utm: { source: "flyer" },
    });
    expect(forLog(r.record).wheelConfig?.logo).toMatch(/^\[image/);
  });
  it("refuse sans consentement", () => {
    const r = buildRecord({ ...body, consent: { accepted: false, text: "x" } }, new Date(), "id");
    expect(r.ok).toBe(false);
  });
  it("refuse un pack inconnu", () => {
    expect(buildRecord({ ...body, pack: "gratuit" }, new Date(), "id").ok).toBe(false);
  });
  it("refuse un corps vide", () => {
    expect(buildRecord(null, new Date(), "id").ok).toBe(false);
  });
});
