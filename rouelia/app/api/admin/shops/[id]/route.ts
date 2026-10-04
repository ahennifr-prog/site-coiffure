import { getSignup, updateSignup } from "@/lib/db";
import { json, readJson, requireAdmin } from "@/lib/http";
import { sendInvite, sendReset } from "@/lib/notify";
import { PACK_IDS } from "@/lib/signup";
import type { PackId } from "@/content";
import { createInvite, getShop, listShops, saveShop, SHOP_PLANS, type ShopPlan } from "@/lib/shops";

type Ctx = { params: Promise<{ id: string }> };

/** Nouveau lien d'invitation (premier accès ou mot de passe oublié). */
export async function POST(_req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const shop = await getShop((await params).id);
  if (!shop) return json({ ok: false, error: "introuvable" }, 404);
  const token = await createInvite(shop.id);
  const activated = (await listShops()).find((s) => s.id === shop.id)?.hasPassword;
  const emailed = (await (activated ? sendReset(shop, token) : sendInvite(shop, token))).ok;
  return json({ ok: true, token, slug: shop.slug, emailed });
}

/** Change l'offre (essai, client payant, pause) ou le pack. Prolonge l'essai si demandé. */
export async function PATCH(req: Request, { params }: Ctx) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const shop = await getShop((await params).id);
  if (!shop) return json({ ok: false, error: "introuvable" }, 404);
  const body = await readJson(req);
  const next = { ...shop };
  if (SHOP_PLANS.includes(body?.plan as ShopPlan)) next.plan = body?.plan as ShopPlan;
  if (PACK_IDS.includes(body?.pack as PackId)) next.pack = body?.pack as PackId;
  const extend = Number(body?.extendDays);
  if (Number.isInteger(extend) && extend > 0 && extend <= 60) {
    const base = Math.max(Date.now(), new Date(shop.trialEndsAt).getTime());
    next.trialEndsAt = new Date(base + extend * 86_400_000).toISOString();
    // Nouvelle date de fin : les e-mails de fin d'essai repartiront pour elle.
    if (next.mails) next.mails = { weekly: next.mails.weekly };
  }
  await saveShop(next);
  // Un commerce qui passe client est aussi marqué « Client » dans les inscriptions.
  if (next.plan === "active" && shop.plan !== "active" && shop.signupId) {
    const s = await getSignup(shop.signupId);
    if (s) await updateSignup({ ...s, status: "client" });
  }
  return json({ ok: true });
}
