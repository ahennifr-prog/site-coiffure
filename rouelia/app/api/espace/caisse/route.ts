import { findPlay, redeem, redeemBonus, unredeem } from "@/lib/game";
import { json, readJson, requireShop } from "@/lib/http";

/** Caisse : chercher un code, valider le retrait (et qui l'a fait), retirer un bonus de parrainage, annuler une erreur. */
export async function POST(req: Request) {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  const body = await readJson(req);
  const code = typeof body?.code === "string" ? body.code.slice(0, 40) : "";
  if (!code) return json({ ok: false, error: "introuvable" }, 422);
  if (body?.action === "valider") {
    const r = await redeem(shop, code, new Date(), body?.by);
    return json(r, r.ok ? 200 : 409);
  }
  if (body?.action === "bonus") {
    const r = await redeemBonus(shop, code, new Date(), body?.by);
    return json(r, r.ok ? 200 : 409);
  }
  if (body?.action === "annuler") {
    const p = await unredeem(shop, code);
    return p ? json({ ok: true, play: p }) : json({ ok: false, error: "introuvable" }, 404);
  }
  const p = await findPlay(shop, code);
  return p ? json({ ok: true, play: p }) : json({ ok: false, error: "introuvable" }, 404);
}
