import { track } from "@/lib/game";
import { json, readJson } from "@/lib/http";
import type { StatField } from "@/lib/types";

const ALLOWED: Record<string, StatField> = {
  visite: "visites",
  avis_ouvert: "avis_ouverts",
  avis_clic: "avis_clics",
  avis_ferme: "avis_fermes",
};

export async function POST(req: Request) {
  const body = await readJson(req);
  const field = typeof body?.type === "string" ? ALLOWED[body.type] : undefined;
  if (!field) return json({ ok: false }, 400);
  await track(field);
  return json({ ok: true });
}
