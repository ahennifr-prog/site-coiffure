import { getConfig, saveConfig } from "@/lib/game";
import { json, readJson, requireAdmin } from "@/lib/http";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return json({ ok: true, config: await getConfig() });
}

export async function PUT(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await readJson(req);
  if (!body) return json({ ok: false, error: "invalid" }, 400);
  return json({ ok: true, config: await saveConfig(body.config) });
}
