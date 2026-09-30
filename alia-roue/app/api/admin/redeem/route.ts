import { findPlay, redeem, unredeem } from "@/lib/game";
import { json, readJson, requireAdmin } from "@/lib/http";

/** action : « chercher », « valider » ou « annuler ». */
export async function POST(req: Request) {
  const denied = await requireAdmin();
  if (denied) return denied;
  const body = await readJson(req);
  const code = typeof body?.code === "string" ? body.code : "";
  if (!code.trim()) return json({ ok: false, error: "introuvable" }, 404);
  if (body?.action === "chercher") {
    const p = await findPlay(code);
    return p ? json({ ok: true, play: p }) : json({ ok: false, error: "introuvable" }, 404);
  }
  if (body?.action === "annuler") {
    const p = await unredeem(code);
    return p ? json({ ok: true, play: p }) : json({ ok: false, error: "introuvable" }, 404);
  }
  const r = await redeem(code);
  return json(r, r.ok ? 200 : r.error === "introuvable" ? 404 : 409);
}
