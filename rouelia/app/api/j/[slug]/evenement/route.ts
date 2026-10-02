import { hit, track, type StatField } from "@/lib/game";
import { clientIp, json, readJson } from "@/lib/http";
import { getShopBySlug } from "@/lib/shops";

const ALLOWED: StatField[] = ["visites", "avis_ouverts", "avis_clics", "avis_fermes"];

/** Compteurs anonymes du parcours client (aucune donnée personnelle). */
export async function POST(req: Request, { params }: { params: Promise<{ slug: string }> }) {
  const body = await readJson(req);
  const type = body?.type as StatField;
  if (!ALLOWED.includes(type)) return json({ ok: false }, 400);
  if ((await hit(`evt:${clientIp(req)}`)) > 300) return json({ ok: true });
  const shop = await getShopBySlug((await params).slug);
  if (!shop) return json({ ok: false }, 404);
  await track(shop.id, type);
  return json({ ok: true });
}
