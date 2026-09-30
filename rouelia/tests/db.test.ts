import { beforeEach, describe, expect, it } from "vitest";
import { deleteSignup, listSignups, saveSignup, setSignupStatus, setTestDb, storageKind } from "@/lib/db";
import { buildRecord, type SignupRecord } from "@/lib/signup";

const body = {
  firstName: "Karim", email: "karim@table.fr", phone: "06 11 22 33 44",
  establishment: { name: "La Table de Karim" }, pack: "croissance",
  wheel: null, utm: { source: "flyer" }, consent: { accepted: true, text: "J'accepte" },
};

function record(id: string, date: string): SignupRecord {
  const r = buildRecord(body, new Date(date), id);
  if (!r.ok) throw new Error("invalide");
  return r.record;
}

beforeEach(() => setTestDb(null));

describe("stockage des inscriptions", () => {
  it("fonctionne en mémoire hors Cloudflare", async () => {
    expect(await storageKind()).toBe("memory");
    await saveSignup(record("a", "2026-10-01T10:00:00Z"));
    await saveSignup(record("b", "2026-10-02T10:00:00Z"));
    const list = await listSignups();
    expect(list.map((s) => s.id)).toEqual(["b", "a"]);
    await setSignupStatus("a", "client");
    expect((await listSignups()).find((s) => s.id === "a")?.status).toBe("client");
    await deleteSignup("b");
    expect((await listSignups()).map((s) => s.id)).toEqual(["a"]);
  });
});
