import { beforeEach, describe, expect, it } from "vitest";
import { listSignups, setTestDb } from "@/lib/db";
import { POST } from "@/app/api/roue-pour-moi/route";
import { sqliteD1 } from "./sqlite";
import { checkPayload, signPayload } from "@/lib/auth";
import { offerToken } from "@/lib/offers";

beforeEach(() => setTestDb(sqliteD1()));

const body = {
  shopName: "Salon Test",
  name: "Martine",
  phone: "06 12 34 56 78",
  email: "martine@salon.fr",
  address: "1 rue de Paris",
  google: "https://maps.google.com/?cid=1",
  pack: "premium",
  consent: true,
};
const post = (b: object) => POST(new Request("http://x/api/roue-pour-moi", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(b) }));

describe("« Créez-la pour moi »", () => {
  it("crée un essai à ouvrir dans l'admin, sur le pack choisi", async () => {
    const res = await post(body);
    expect(res.status).toBe(201);
    const [s] = await listSignups();
    expect(s).toMatchObject({ shopName: "Salon Test", firstName: "Martine", pack: "premium", status: "essai_en_attente", phone: "+33612345678" });
    expect(s.utm.source).toBe("Créez-la pour moi");
    expect(s.establishment.googleMapsUrl).toBe("https://maps.google.com/?cid=1");
  });

  it("ramène un pack non concerné (Essentiel) sur Croissance", async () => {
    await post({ ...body, pack: "essentiel" });
    expect((await listSignups())[0].pack).toBe("croissance");
  });

  it("ajoute le cadeau de bienvenue gagné sur la page, et ignore un jeton faux", async () => {
    const now = Date.now();
    const won = { id: "flyers" as const, code: "OFF-TEST", wonAt: new Date(now).toISOString(), expiresAt: new Date(now + 86_400_000).toISOString() };
    await post({ ...body, offerToken: offerToken(won, { sign: signPayload, check: checkPayload }) });
    expect((await listSignups())[0].offer).toMatchObject({ id: "flyers", code: "OFF-TEST", status: "applied" });

    setTestDb(sqliteD1());
    await post({ ...body, offerToken: "faux.jeton" });
    expect((await listSignups())[0].offer).toBeNull();
  });
});
