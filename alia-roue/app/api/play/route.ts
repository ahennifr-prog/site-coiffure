import { play } from "@/lib/game";
import { clientIp, json, readJson } from "@/lib/http";

export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return json({ ok: false, error: "invalid" }, 400);
  const r = await play(
    { firstName: body.firstName, phone: body.phone, consent: body.consent, consentText: body.consentText },
    clientIp(req),
  );
  if (!r.ok) return json(r, r.error === "rate" ? 429 : r.error === "inactive" ? 403 : 422);
  const p = r.play;
  // La cliente ne reçoit que ce qui la concerne.
  return json({
    ok: true,
    already: r.already,
    prizeIndex: r.prizeIndex,
    play: { code: p.code, prizeName: p.prizeName, prizeDetail: p.prizeDetail, tier: p.tier, firstName: p.firstName, validFrom: p.validFrom, expiresOn: p.expiresOn, redeemedAt: p.redeemedAt },
  });
}
