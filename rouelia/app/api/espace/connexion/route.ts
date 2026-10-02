import { hit } from "@/lib/game";
import { shopCookie, shopSessionToken } from "@/lib/espace";
import { clientIp, json, readJson } from "@/lib/http";
import { login } from "@/lib/shops";

export async function POST(req: Request) {
  const body = await readJson(req);
  const email = typeof body?.email === "string" ? body.email.slice(0, 200) : "";
  const password = typeof body?.password === "string" ? body.password.slice(0, 200) : "";
  if ((await hit(`connexion:${clientIp(req)}`)) > 10) return json({ ok: false, error: "trop" }, 429);
  const r = email && password ? await login(email, password) : null;
  if (!r) return json({ ok: false, error: "identifiants" }, 401);
  const res = json({ ok: true });
  res.cookies.set(shopCookie(shopSessionToken(r.shop.id, r.version)));
  return res;
}
