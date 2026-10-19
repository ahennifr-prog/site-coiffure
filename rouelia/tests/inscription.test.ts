import { beforeEach, describe, expect, it } from "vitest";
import { listSignups, setTestDb } from "@/lib/db";
import { listShops, shopForInvite } from "@/lib/shops";
import { POST } from "@/app/api/inscription/route";
import { sqliteD1 } from "./sqlite";

beforeEach(() => setTestDb(sqliteD1()));

const body = {
  firstName: "Karim", email: "karim@table.fr", phone: "06 11 22 33 44",
  establishment: { name: "La Table de Karim" }, pack: "croissance",
  wheel: null, utm: { source: "flyer" }, consent: { accepted: true, text: "J'accepte" },
};
const post = (b: object, ip = "1.2.3.4") =>
  POST(new Request("http://x/api/inscription", { method: "POST", headers: { "Content-Type": "application/json", "cf-connecting-ip": ip }, body: JSON.stringify(b) }));

describe("inscription sur le site", () => {
  it("ouvre l'essai tout de suite et rend le lien pour choisir le mot de passe", async () => {
    const res = await post(body);
    expect(res.status).toBe(201);
    const data = (await res.json()) as { opened: boolean; access: string };
    expect(data.opened).toBe(true);
    const [shop] = await listShops();
    expect(shop).toMatchObject({ email: "karim@table.fr", plan: "trial" });
    const [signup] = await listSignups();
    expect(signup).toMatchObject({ status: "essai_en_cours", shopId: shop.id });
    // Le lien rendu ouvre bien l'invitation de ce commerce.
    const token = data.access.split("#")[1];
    expect((await shopForInvite(token))?.id).toBe(shop.id);
  });

  it("limite les inscriptions répétées depuis une même adresse", async () => {
    for (let i = 0; i < 6; i++) expect((await post({ ...body, email: `k${i}@table.fr` })).status).toBe(201);
    expect((await post({ ...body, email: "k7@table.fr" })).status).toBe(429);
  });
});
