import { deleteCall, followCall, listCalls, parseFollow } from "@/lib/admin";
import { json, readJson, requireAdmin } from "@/lib/http";

/** Appels réservés sur /rendez-vous. */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return json({ ok: true, calls: await listCalls() });
  } catch {
    return json({ ok: false, error: "storage" }, 500);
  }
}

/** Marque un appel fait ou non, et garde des notes. */
export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = await readJson(req);
  const slot = typeof b?.slot === "string" ? b.slot : "";
  if (!slot || !(await followCall(slot, parseFollow(b)))) return json({ ok: false, error: "introuvable" }, 404);
  return json({ ok: true });
}

/** Annule un appel : le créneau redevient libre. */
export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = await readJson(req);
  if (typeof b?.slot !== "string") return json({ ok: false, error: "invalid" }, 400);
  await deleteCall(b.slot);
  return json({ ok: true });
}
