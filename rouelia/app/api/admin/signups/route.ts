import { deleteSignup, getSignup, listSignups, storageKind, updateSignup } from "@/lib/db";
import { json, readJson, requireAdmin } from "@/lib/http";
import { getShop, saveShop } from "@/lib/shops";
import { isEmail, normalizeFrenchPhone, PACK_IDS, SIGNUP_STATUSES, type SignupRecord, type SignupStatus } from "@/lib/signup";
import type { PackId } from "@/content";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return json({ ok: true, storage: await storageKind(), signups: await listSignups(1000) });
}

type EditField = "firstName" | "shopName" | "email" | "phone" | "pack";
const text = (v: unknown, max: number) => (typeof v === "string" ? v.trim().slice(0, max) : null);

/**
 * Modifie une inscription : statut, notes privées, ou coordonnées (prénom, commerce, e-mail, téléphone, pack).
 * Seuls les champs envoyés changent. Si l'essai est ouvert, l'e-mail, le prénom et le téléphone du commerce suivent.
 */
export async function PATCH(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const b = await readJson(req);
  const id = typeof b?.id === "string" ? b.id : "";
  const current = id ? await getSignup(id) : null;
  if (!current) return json({ ok: false, error: "introuvable" }, 404);

  const next: SignupRecord = { ...current };
  const errors: EditField[] = [];
  if (b?.status !== undefined) {
    if (!SIGNUP_STATUSES.includes(b.status as SignupStatus)) return json({ ok: false, error: "invalid" }, 400);
    next.status = b.status as SignupStatus;
  }
  if (b?.notes !== undefined) next.notes = text(b.notes, 2000) ?? "";
  if (b?.firstName !== undefined) {
    const v = text(b.firstName, 40);
    if (v) next.firstName = v;
    else errors.push("firstName");
  }
  if (b?.shopName !== undefined) {
    const v = text(b.shopName, 120);
    if (v) next.shopName = v;
    else errors.push("shopName");
  }
  if (b?.email !== undefined) {
    const v = (text(b.email, 200) ?? "").toLowerCase();
    if (isEmail(v)) next.email = v;
    else errors.push("email");
  }
  if (b?.phone !== undefined) {
    const v = normalizeFrenchPhone(text(b.phone, 30) ?? "");
    if (v) next.phone = v;
    else errors.push("phone");
  }
  if (b?.pack !== undefined) {
    if (PACK_IDS.includes(b.pack as PackId)) next.pack = b.pack as PackId;
    else errors.push("pack");
  }
  if (errors.length) return json({ ok: false, errors }, 422);

  await updateSignup(next);
  if (next.shopId && (next.email !== current.email || next.firstName !== current.firstName || next.phone !== current.phone)) {
    const shop = await getShop(next.shopId);
    if (shop) await saveShop({ ...shop, email: next.email, firstName: next.firstName, phone: next.phone });
  }
  return json({ ok: true, signup: next });
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
