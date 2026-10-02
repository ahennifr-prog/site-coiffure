import { hit } from "@/lib/game";
import { shopCookie, shopSessionToken } from "@/lib/espace";
import { clientIp, json, readJson } from "@/lib/http";
import { MIN_PASSWORD, setPassword, shopForInvite } from "@/lib/shops";

/** Lien d'invitation : le commerçant choisit son mot de passe et se retrouve connecté. */
export async function POST(req: Request) {
  if ((await hit(`activation:${clientIp(req)}`)) > 20) return json({ ok: false, error: "trop" }, 429);
  const body = await readJson(req);
  const token = typeof body?.token === "string" ? body.token : "";
  const password = typeof body?.password === "string" ? body.password : "";
  if (password.length < MIN_PASSWORD || password.length > 200) return json({ ok: false, error: "court" }, 422);
  const shop = await shopForInvite(token);
  if (!shop) return json({ ok: false, error: "lien" }, 410);
  const version = await setPassword(shop.id, password);
  const res = json({ ok: true });
  res.cookies.set(shopCookie(shopSessionToken(shop.id, version)));
  return res;
}
