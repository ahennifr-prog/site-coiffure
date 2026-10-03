import { getSignup, updateSignup } from "@/lib/db";
import { json, readJson, requireAdmin } from "@/lib/http";
import { sendInvite } from "@/lib/notify";
import { createInvite, getShop, insertShop, listShops, shopFromSignup, slugify, uniqueSlug } from "@/lib/shops";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  const shops = await listShops();
  return json({ ok: true, shops: shops.map(({ settings, ...s }) => ({ ...s, name: settings.name, active: settings.active })) });
}

/** Ouvre l'essai d'une inscription : crée le commerce, sa roue, et un lien d'invitation. */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await readJson(req);
  const signup = typeof body?.signupId === "string" ? await getSignup(body.signupId) : null;
  if (!signup) return json({ ok: false, error: "introuvable" }, 404);
  if (signup.shopId && (await getShop(signup.shopId))) return json({ ok: false, error: "deja" }, 409);
  const now = new Date();
  const shop = shopFromSignup(signup, crypto.randomUUID(), await uniqueSlug(slugify(signup.wheelConfig?.shopName || signup.shopName)), now);
  await insertShop(shop);
  await updateSignup({ ...signup, shopId: shop.id, status: "essai_en_cours", trialStartedAt: now.toISOString() });
  const token = await createInvite(shop.id, now);
  // Le lien part aussi par e-mail au commerçant quand Brevo est branché.
  const emailed = (await sendInvite(shop, token)).ok;
  return json({ ok: true, shopId: shop.id, slug: shop.slug, token, emailed });
}
