import { json, requireAdmin } from "@/lib/http";
import { siteCounts } from "@/lib/mesure";

export async function GET() {
  const denied = await requireAdmin();
  if (denied) return denied;
  try {
    return json({ ok: true, events: await siteCounts() });
  } catch {
    return json({ ok: false, error: "storage" }, 500);
  }
}
