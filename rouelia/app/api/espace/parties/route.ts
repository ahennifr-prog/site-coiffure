import { listPlays } from "@/lib/game";
import { json, requireShop } from "@/lib/http";

export async function GET() {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  return json({ ok: true, plays: await listPlays(shop) });
}
