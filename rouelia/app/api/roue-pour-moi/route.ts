import { database } from "@/lib/db";
import { hit } from "@/lib/game";
import { clientIp, json, readJson } from "@/lib/http";
import { sendMail } from "@/lib/mail";
import { wheelRequestAlertMail, wheelRequestConfirmMail } from "@/lib/mail-templates";
import { isEmail, normalizeFrenchPhone } from "@/lib/signup";
import { countEvent } from "@/lib/mesure";
import { doneForYou, pricing, type PackId } from "@/content";

const str = (v: unknown, max = 200) => (typeof v === "string" ? v.trim().slice(0, max) : "");

/** Logo envoyé en data URL (image, 3 Mo au plus). */
function parseLogo(v: unknown, name: string): { filename: string; content: string; base64: true } | null {
  if (typeof v !== "string") return null;
  const m = /^data:image\/(png|jpe?g|webp|svg\+xml|gif);base64,([A-Za-z0-9+/=]+)$/.exec(v);
  if (!m || m[2].length > 4_200_000) return null;
  const ext = m[1] === "svg+xml" ? "svg" : m[1] === "jpeg" ? "jpg" : m[1];
  const safe = name.replace(/\.[a-z0-9]+$/i, "").replace(/[^a-z0-9_-]+/gi, "-").slice(0, 40) || "logo";
  return { filename: `${safe}.${ext}`, content: m[2], base64: true };
}

type WheelRequestField = "shopName" | "phone" | "email" | "address" | "google" | "consent";

/** Demande « Créez-la pour moi » : enregistrée, envoyée à contact@ avec le logo, confirmée au client. */
export async function POST(req: Request) {
  if (Number(req.headers.get("content-length") ?? 0) > 6_000_000) return json({ ok: false, error: "too_large" }, 413);
  const body = await readJson(req);
  if (!body) return json({ ok: false, error: "invalid_json" }, 400);
  if (body.website) return json({ ok: true });

  const p = {
    shopName: str(body.shopName, 120),
    name: str(body.name, 80),
    phone: str(body.phone, 30),
    email: str(body.email).toLowerCase(),
    address: str(body.address, 200),
    google: str(body.google, 300),
    prizes: str(body.prizes, 1000),
    message: str(body.message, 2000),
    logoName: null as string | null,
    // « Créez-la pour moi » n'existe qu'à partir de Croissance : toute autre valeur revient à Croissance.
    pack: (doneForYou.packs.includes(body.pack as PackId) ? body.pack : doneForYou.packs[0]) as PackId,
  };
  const packLabel = pricing.packs.find((x) => x.id === p.pack)?.name ?? p.pack;
  const errors: WheelRequestField[] = [];
  if (!p.shopName) errors.push("shopName");
  if (!normalizeFrenchPhone(p.phone)) errors.push("phone");
  if (!isEmail(p.email)) errors.push("email");
  if (!p.address) errors.push("address");
  if (!p.google) errors.push("google");
  if (body.consent !== true) errors.push("consent");
  if (errors.length) return json({ ok: false, errors }, 422);

  const logo = parseLogo(body.logo, str(body.logoName, 80));
  p.logoName = logo?.filename ?? null;
  p.phone = normalizeFrenchPhone(p.phone) ?? p.phone;

  const now = new Date();
  let stored = false;
  try {
    if ((await hit(`roue:${clientIp(req)}`, now)) > 8) return json({ ok: false, error: "rate" }, 429);
    const db = await database();
    await db
      .prepare("INSERT INTO wheel_requests (id, created_at, email, data) VALUES (?, ?, ?, ?)")
      .bind(crypto.randomUUID(), now.toISOString(), p.email, JSON.stringify(p))
      .run();
    stored = true;
  } catch (e) {
    // L'e-mail part quand même : la demande ne doit pas se perdre si la base est indisponible.
    console.error("[roue-pour-moi] enregistrement impossible", e);
  }

  const alert = await sendMail(wheelRequestAlertMail({ ...p, pack: packLabel }, logo));
  if (!alert.ok && (!stored || !alert.skipped)) return json({ ok: false, error: "mail" }, 502);
  await countEvent("roue_pour_moi_envoye", now);
  await sendMail(wheelRequestConfirmMail({ email: p.email, name: p.name, shopName: p.shopName, pack: packLabel }));
  return json({ ok: true }, 201);
}
