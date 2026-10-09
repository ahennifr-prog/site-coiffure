import { database } from "@/lib/db";
import { hit } from "@/lib/game";
import { clientIp, json, readJson } from "@/lib/http";
import { sendMail } from "@/lib/mail";
import { otherActivityAlertMail, otherActivityConfirmMail } from "@/lib/mail-templates";
import { isEmail, normalizeFrenchPhone } from "@/lib/signup";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Demande « Autre activité » de la page /pour-qui : enregistrée, envoyée à contact@, confirmée au visiteur. */
export async function POST(req: Request) {
  const body = await readJson(req);
  if (!body) return json({ ok: false, error: "invalid_json" }, 400);
  // Champ piège invisible : seuls les robots le remplissent.
  if (body.website) return json({ ok: true });

  const p = {
    kind: "autre-activite",
    name: str(body.name, 120),
    description: str(body.description, 1000),
    prizes: str(body.prizes, 1000),
    phone: str(body.phone, 30),
    email: str(body.email).toLowerCase(),
  };
  const errors: string[] = [];
  if (!p.name) errors.push("name");
  if (!p.description) errors.push("description");
  if (!normalizeFrenchPhone(p.phone)) errors.push("phone");
  if (!isEmail(p.email)) errors.push("email");
  if (body.consent !== true) errors.push("consent");
  if (errors.length) return json({ ok: false, errors }, 422);
  p.phone = normalizeFrenchPhone(p.phone) ?? p.phone;

  const now = new Date();
  let stored = false;
  try {
    if ((await hit(`autre:${clientIp(req)}`, now)) > 8) return json({ ok: false, error: "rate" }, 429);
    const db = await database();
    await db
      .prepare("INSERT INTO wheel_requests (id, created_at, email, data) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), now.toISOString(), p.email, JSON.stringify(p))
      .run();
    stored = true;
  } catch (e) {
    console.error("[autre-activite] enregistrement impossible", e);
  }

  const alert = await sendMail(otherActivityAlertMail(p));
  if (!alert.ok && (!stored || !alert.skipped)) return json({ ok: false, error: "mail" }, 502);
  await sendMail(otherActivityConfirmMail({ email: p.email, name: p.name }));
  return json({ ok: true }, 201);
}
