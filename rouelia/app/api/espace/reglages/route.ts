import { json, readJson, requireShop } from "@/lib/http";
import { sanitizeSettings, saveShop, withDefaults } from "@/lib/shops";

export async function GET() {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  return json({ ok: true, settings: withDefaults(shop.settings), pack: shop.pack });
}

export async function PUT(req: Request) {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  const body = await readJson(req);
  if (!body?.settings) return json({ ok: false, error: "invalide" }, 400);
  const next = { ...shop, settings: sanitizeSettings(body.settings, shop.settings) };
  await saveShop(next);
  return json({ ok: true, settings: next.settings });
}
