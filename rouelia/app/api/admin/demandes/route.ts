import { deleteRequest, followRequest, listRequests, parseFollow, requestToSignup } from "@/lib/admin";
import { json, readJson, requireAdmin } from "@/lib/http";

/** Demandes reçues : « Créez-la pour moi » et « Autre activité ». */
export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return json({ ok: true, requests: await listRequests() });
  } catch {
    return json({ ok: false, error: "storage" }, 500);
  }
}

/** Marque une demande traitée ou non, et garde des notes. */
export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = await readJson(req);
  const id = typeof b?.id === "string" ? b.id : "";
  if (!id || !(await followRequest(id, parseFollow(b)))) return json({ ok: false, error: "introuvable" }, 404);
  return json({ ok: true });
}

/** Ajoute une demande « Créez-la pour moi » aux inscriptions (essai à ouvrir). */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = await readJson(req);
  const signupId = typeof b?.id === "string" ? await requestToSignup(b.id) : null;
  return signupId ? json({ ok: true, signupId }) : json({ ok: false, error: "introuvable" }, 404);
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = await readJson(req);
  if (typeof b?.id !== "string") return json({ ok: false, error: "invalid" }, 400);
  await deleteRequest(b.id);
  return json({ ok: true });
}
