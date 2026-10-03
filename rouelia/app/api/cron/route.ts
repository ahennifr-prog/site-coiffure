import { timingSafeEqual } from "node:crypto";
import { json } from "@/lib/http";
import { runDaily } from "@/lib/notify";

/**
 * Tâche quotidienne, appelée par le déclencheur planifié de Cloudflare (voir worker.ts et wrangler.jsonc).
 * Protégée par le secret SESSION_SECRET, jamais exposé.
 */
export async function POST(req: Request) {
  const expected = process.env.SESSION_SECRET ?? "";
  const got = req.headers.get("x-cron-secret") ?? "";
  if (!expected || got.length !== expected.length || !timingSafeEqual(Buffer.from(got), Buffer.from(expected))) {
    return json({ ok: false }, 401);
  }
  const done = await runDaily();
  console.log("[cron] tâche quotidienne", JSON.stringify(done));
  return json({ ok: true, ...done });
}
