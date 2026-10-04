import { beforeEach, describe, expect, it } from "vitest";
import { setTestDb } from "@/lib/db";
import { listPlays, play, track } from "@/lib/game";
import { setMailTransport, type Mail } from "@/lib/mail";
import { clientCodeMail, merchantWeeklyMail, weeklyAction } from "@/lib/mail-templates";
import { runDaily, sendClientCode } from "@/lib/notify";
import { getShop, insertShop, shopFromSignup, type Shop } from "@/lib/shops";
import { buildRecord } from "@/lib/signup";
import { sqliteD1 } from "./sqlite";

const sent: Mail[] = [];
const now = new Date("2026-10-02T10:00:00Z"); // vendredi

async function newShop(extra: Partial<Shop> = {}): Promise<Shop> {
  const r = buildRecord(
    { firstName: "Martine", email: "martine@salon.fr", phone: "0612345678", establishment: { name: "Salon Martine" }, pack: "croissance", utm: {}, consent: { accepted: true, text: "ok" }, wheel: null },
    now,
    "s1",
  );
  if (!r.ok) throw new Error();
  const shop = { ...shopFromSignup(r.record, "shop-1", "salon-martine", now), ...extra };
  await insertShop(shop);
  return shop;
}

beforeEach(() => {
  setTestDb(sqliteD1());
  sent.length = 0;
  setMailTransport(async (m) => {
    sent.push(m);
    return { ok: true };
  });
});

describe("e-mails", () => {
  it("le code part au client qui a donné son e-mail, au nom du commerce", async () => {
    const shop = await newShop();
    const r = await play(shop, { firstName: "Léa", phone: "0611223344", email: " Lea@Exemple.fr ", consent: true, consentText: "ok" }, "ip", now);
    if (!r.ok) throw new Error();
    expect(r.play.email).toBe("lea@exemple.fr");
    await sendClientCode(shop, r.play, now);
    expect(sent[0]).toMatchObject({ to: { email: "lea@exemple.fr" }, fromName: "Salon Martine", replyTo: "martine@salon.fr" });
    expect(sent[0].html).toContain(r.play.code);
    expect(sent[0].text).toContain("3 octobre 2026");
  });

  it("refuse un e-mail invalide, accepte sans e-mail", async () => {
    const shop = await newShop();
    expect(await play(shop, { firstName: "A", phone: "0611223344", email: "pas-un-mail", consent: true, consentText: "" }, "ip", now)).toEqual({ ok: false, error: "email" });
    const r = await play(shop, { firstName: "A", phone: "0611223344", consent: true, consentText: "" }, "ip", now);
    expect(r.ok && r.play.email).toBeNull();
  });

  it("échappe le HTML venu des réglages", () => {
    const m = clientCodeMail(
      { name: "<b>Salon</b>", address: "", color: "#000", onColor: "#fff", replyTo: "a@b.fr", gameUrl: "" },
      { firstName: "<script>", prizeName: "Soin", prizeDetail: "", code: "SAL-AAAAA", validFrom: "2026-10-02", expiresOn: "2026-11-01" },
      "x@y.fr",
      "2026-10-02",
    );
    expect(m.html).not.toContain("<script>");
    expect(m.html).toContain("&lt;b&gt;Salon&lt;/b&gt;");
  });
});

describe("tâche quotidienne", () => {
  it("rappelle une seule fois les cadeaux qui expirent dans 3 jours (Croissance)", async () => {
    const shop = await newShop({ plan: "active" });
    const r = await play(shop, { firstName: "Léa", phone: "0611223344", email: "lea@exemple.fr", consent: true, consentText: "" }, "ip", now);
    if (!r.ok) throw new Error();
    sent.length = 0;
    const threeDaysBefore = new Date("2026-10-30T07:00:00Z"); // expire le 2 novembre
    expect((await runDaily(threeDaysBefore)).rappels).toBe(1);
    expect(sent.find((m) => m.subject.includes("expire bientôt"))?.to.email).toBe("lea@exemple.fr");
    expect((await runDaily(threeDaysBefore)).rappels).toBe(0);
    expect((await listPlays(shop))[0].reminderSent).toBe(true);
  });

  it("pas de rappel en Essentiel", async () => {
    const shop = await newShop({ plan: "active", pack: "essentiel" });
    await play(shop, { firstName: "Léa", phone: "0611223344", email: "lea@exemple.fr", consent: true, consentText: "" }, "ip", now);
    expect((await runDaily(new Date("2026-10-30T07:00:00Z"))).rappels).toBe(0);
  });

  it("prévient 3 jours avant la fin de l'essai, puis le jour de la fin, sans doublon", async () => {
    await newShop(); // essai jusqu'au 16 octobre
    expect((await runDaily(new Date("2026-10-10T07:00:00Z"))).essais).toBe(0);
    expect((await runDaily(new Date("2026-10-13T07:00:00Z"))).essais).toBe(1);
    expect((await runDaily(new Date("2026-10-14T07:00:00Z"))).essais).toBe(0);
    expect((await runDaily(new Date("2026-10-16T07:00:00Z"))).essais).toBe(1);
    expect((await runDaily(new Date("2026-10-17T07:00:00Z"))).essais).toBe(0);
    // Roue jamais jouée : on propose de l'aide, puis de relancer l'essai.
    expect(sent.map((m) => m.subject)).toEqual(["Martine, votre roue n'a pas encore tourné : on vous aide ?", "Martine, on prolonge votre essai ?"]);
    expect((await getShop("shop-1"))?.mails).toMatchObject({ trialSoon: "2026-10-13", trialEnded: "2026-10-16" });
  });

  it("fin d'essai : montre les vrais résultats, le cadeau et un lien pour continuer", async () => {
    const shop = await newShop({ offer: { wonId: "installation", id: "installation", code: "OFF-AAAA", wonAt: now.toISOString(), expiresAt: now.toISOString(), status: "applied" } });
    await track("shop-1", "parties", 7, new Date("2026-10-05T10:00:00Z"));
    await track("shop-1", "retraits", 2, new Date("2026-10-06T10:00:00Z"));
    await play(shop, { firstName: "Léa", phone: "0611223344", consent: true, consentText: "" }, "ip", now);
    sent.length = 0;
    await runDaily(new Date("2026-10-13T07:00:00Z"));
    const m = sent[0];
    expect(m.subject).toBe("Martine, 8 clients ont déjà joué chez Salon Martine");
    expect(m.text).toContain("8 parties jouées");
    expect(m.text).toContain("2 clients déjà revenus chercher leur cadeau");
    expect(m.text).toContain("Installation sur place offerte");
    expect(m.html).toContain("mailto:contact@rouelia.fr?subject=Je%20continue%20avec%20Croissance");
    await runDaily(new Date("2026-10-16T07:00:00Z"));
    expect(sent[1].subject).toBe("La roue de Salon Martine est en pause");
    expect(sent[1].text).not.toContain("Essentiel");
    expect(sent[1].html).toContain('<a href="https://rouelia.fr" style="color:#5E564E">rouelia.fr</a>');
    expect(sent[1].html).toContain("contact@rouelia.fr");
  });

  it("envoie le rapport le lundi, une fois", async () => {
    await newShop({ plan: "active" });
    await track("shop-1", "visites", 12, new Date("2026-10-08T10:00:00Z"));
    await track("shop-1", "parties", 5, new Date("2026-10-08T10:00:00Z"));
    const monday = new Date("2026-10-12T06:00:00Z");
    expect((await runDaily(new Date("2026-10-11T06:00:00Z"))).rapports).toBe(0);
    expect((await runDaily(monday)).rapports).toBe(1);
    expect((await runDaily(monday)).rapports).toBe(0);
    const report = sent.find((m) => m.subject.startsWith("Votre semaine"));
    expect(report?.subject).toBe("Votre semaine Rouelia : 5 parties, 0 cadeau retiré");
    expect(report?.text).toContain("Scans du QR code : 12");
  });

  it("choisit une action simple selon les chiffres", () => {
    const base = { visites: 10, parties: 8, avisClics: 2, retraits: 3, enAttente: 4, expirentBientot: 0 };
    expect(weeklyAction({ ...base, visites: 0 })).toContain("Personne n'a scanné");
    expect(weeklyAction({ ...base, parties: 1 })).toContain("peu de parties");
    expect(weeklyAction({ ...base, expirentBientot: 1 })).toContain("1 cadeau expire");
    expect(weeklyAction({ ...base, retraits: 0 })).toContain("Aucun cadeau retiré");
    expect(merchantWeeklyMail({ email: "a@b.fr", firstName: "A", shopName: "S", numbers: base }).subject).toBe("Votre semaine Rouelia : 8 parties, 3 cadeaux retirés");
  });
});
