import { deleteSignup, listSignups, setSignupStatus, storageKind } from "@/lib/db";
import { json, readJson, requireAdmin } from "@/lib/http";
import { SIGNUP_STATUSES, type SignupStatus } from "@/lib/signup";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return json({ ok: true, storage: await storageKind(), signups: await listSignups(1000) });
}

export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = await readJson(req);
  const id = typeof b?.id === "string" ? b.id : "";
  const status = b?.status as SignupStatus;
  if (!id || !SIGNUP_STATUSES.includes(status)) return json({ ok: false, error: "invalid" }, 400);
  await setSignupStatus(id, status);
  return json({ ok: true });
}

export async function DELETE(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = await readJson(req);
  const id = typeof b?.id === "string" ? b.id : "";
  if (!id) return json({ ok: false, error: "invalid" }, 400);
  await deleteSignup(id);
  return json({ ok: true });
}
