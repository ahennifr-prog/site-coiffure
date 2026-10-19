import { getSignup } from "@/lib/db";
import { json, readJson, requireAdmin } from "@/lib/http";
import { getShop, listShops } from "@/lib/shops";
import { openTrial } from "@/lib/trial";

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
  // « Créez-la pour moi » : on peut créer le commerce sans prévenir le commerçant, préparer sa roue, puis envoyer l'accès.
  const { shop, token, emailed } = await openTrial(signup, new Date(), { invite: body?.invite !== false });
  return json({ ok: true, shopId: shop.id, slug: shop.slug, token, emailed });
}
