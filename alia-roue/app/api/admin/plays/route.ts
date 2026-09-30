import { listPlays } from "@/lib/game";
import { json, requireAdmin } from "@/lib/http";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return json({ ok: true, plays: await listPlays(1000) });
}
