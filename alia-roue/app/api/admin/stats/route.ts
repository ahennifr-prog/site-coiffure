import { stats } from "@/lib/game";
import { json, requireAdmin } from "@/lib/http";
import { storageKind } from "@/lib/store";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  return json({ ok: true, storage: storageKind(), ...(await stats(14)) });
}
