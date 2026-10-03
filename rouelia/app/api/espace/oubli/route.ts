import { database } from "@/lib/db";
import { hit } from "@/lib/game";
import { clientIp, json, readJson } from "@/lib/http";
import { sendReset } from "@/lib/notify";
import { createInvite, getShop } from "@/lib/shops";
import { isEmail } from "@/lib/signup";

/** Mot de passe oublié : un lien par e-mail. La réponse est la même que l'adresse existe ou non. */
export async function POST(req: Request) {
  if ((await hit(`oubli:${clientIp(req)}`)) > 5) return json({ ok: false, error: "trop" }, 429);
  const body = await readJson(req);
  const email = typeof body?.email === "string" ? body.email.trim().toLowerCase() : "";
  if (isEmail(email)) {
    const db = await database();
    const { results } = await db.prepare("SELECT id FROM shops WHERE email = ? ORDER BY created_at DESC LIMIT 3").bind(email).all<{ id: string }>();
    for (const { id } of results) {
      const shop = await getShop(id);
      if (shop) await sendReset(shop, await createInvite(shop.id));
    }
  }
  return json({ ok: true });
}
