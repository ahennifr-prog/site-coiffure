import { beforeEach, describe, expect, it, vi } from "vitest";

vi.mock("@/lib/auth", async (orig) => ({ ...(await orig<typeof import("@/lib/auth")>()), isAdmin: async () => true }));

import { getSignup, getSignupLogo, listSignups, setTestDb } from "@/lib/db";
import { database } from "@/lib/db";
import { deleteCall, followCall, followRequest, listCalls, listRequests, requestToSignup } from "@/lib/admin";
import { reserve } from "@/lib/bookings";
import { POST as roue } from "@/app/api/roue-pour-moi/route";
import { PATCH as editSignup } from "@/app/api/admin/signups/route";
import { sqliteD1 } from "./sqlite";

beforeEach(() => setTestDb(sqliteD1()));

const json = (url: string, method: string, body: object) => new Request(`http://x${url}`, { method, headers: { "Content-Type": "application/json" }, body: JSON.stringify(body) });
const LOGO = `data:image/png;base64,${Buffer.from("png").toString("base64")}`;
const demande = { shopName: "Salon Test", name: "Martine", phone: "06 12 34 56 78", email: "martine@salon.fr", address: "1 rue de Paris", google: "Salon Test Paris", prizes: "Café offert", message: "Couleurs vertes", pack: "croissance", consent: true, logo: LOGO, logoName: "logo.png" };

describe("admin", () => {
  it("« Créez-la pour moi » : fiche avec la demande et le logo, reliée à la demande", async () => {
    await roue(json("/api/roue-pour-moi", "POST", demande));
    const [s] = await listSignups();
    expect(s.request).toMatchObject({ prizes: "Café offert", message: "Couleurs vertes", hasLogo: true });
    expect(await getSignupLogo(s.id)).toBe(LOGO);
    const [r] = await listRequests();
    expect(r).toMatchObject({ shopName: "Salon Test", signupId: s.id });
    // Déjà reliée : pas de doublon.
    expect(await requestToSignup(r.id)).toBe(s.id);
    expect(await listSignups()).toHaveLength(1);
  });

  it("ajoute une ancienne demande (sans fiche) aux inscriptions, une seule fois", async () => {
    const db = await database();
    await db.prepare("INSERT INTO wheel_requests (id, created_at, email, data) VALUES (?, ?, ?, ?)").bind("old", "2026-10-09T18:00:00Z", "a@b.fr", JSON.stringify({ ...demande, phone: "+33612345678", logo: undefined })).run();
    const id = await requestToSignup("old");
    expect(id).toBeTruthy();
    expect(await requestToSignup("old")).toBe(id);
    expect((await getSignup(id!))?.status).toBe("essai_en_attente");
    expect(await listSignups()).toHaveLength(1);
  });

  it("suivi des demandes et des appels : traité, notes, annulation", async () => {
    await roue(json("/api/roue-pour-moi", "POST", demande));
    const [r] = await listRequests();
    await followRequest(r.id, { done: true, notes: "Roue envoyée" });
    expect((await listRequests())[0]).toMatchObject({ done: true, notes: "Roue envoyée" });

    const now = new Date("2026-10-08T08:00:00Z");
    await reserve({ name: "Karim", phone: "0612345678", email: "k@x.fr", shop: "", slot: "2026-10-09T12:05", consent: true }, now);
    await followCall("2026-10-09T12:05", { done: true, notes: "Rappeler lundi" });
    expect((await listCalls())[0]).toMatchObject({ name: "Karim", done: true, notes: "Rappeler lundi" });
    await deleteCall("2026-10-09T12:05");
    expect(await listCalls()).toHaveLength(0);
  });

  it("modifie une fiche : coordonnées vérifiées, notes, statut", async () => {
    await roue(json("/api/roue-pour-moi", "POST", demande));
    const [s] = await listSignups();
    const bad = await editSignup(json("/api/admin/signups", "PATCH", { id: s.id, email: "pas-un-email", phone: "12" }));
    expect(bad.status).toBe(422);
    expect((await bad.json()).errors).toEqual(["email", "phone"]);
    const ok = await editSignup(json("/api/admin/signups", "PATCH", { id: s.id, firstName: "Martine D.", phone: "07 11 22 33 44", pack: "premium", notes: "Rappelée", status: "perdu" }));
    expect(ok.status).toBe(200);
    expect(await getSignup(s.id)).toMatchObject({ firstName: "Martine D.", phone: "+33711223344", pack: "premium", notes: "Rappelée", status: "perdu" });
  });
});
