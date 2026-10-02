import { json, readJson, requireShop } from "@/lib/http";
import { setLogo } from "@/lib/shops";

const MAX = 1_000_000;

/** Envoi ou suppression du logo (image déjà réduite dans le navigateur). */
export async function PUT(req: Request) {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  const body = await readJson(req);
  const logo = body?.logo;
  if (logo !== null && (typeof logo !== "string" || !/^data:image\/(png|jpeg|webp|gif|svg\+xml);base64,/i.test(logo) || logo.length > MAX)) {
    return json({ ok: false, error: "image" }, 422);
  }
  const next = await setLogo(shop, logo as string | null);
  return json({ ok: true, settings: next.settings });
}
