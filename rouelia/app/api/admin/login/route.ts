import { NextResponse } from "next/server";
import { checkPassword, createSessionToken, passwordConfigured, sessionCookie } from "@/lib/auth";
import { clientIp, json, readJson } from "@/lib/http";

// Limite simple des essais par adresse (par instance) contre la devinette du mot de passe.
const tries = new Map<string, { n: number; until: number }>();

export async function POST(req: Request) {
  if (!passwordConfigured()) return json({ ok: false, error: "non_configure" }, 503);
  const ip = clientIp(req);
  const now = Date.now();
  const t = tries.get(ip);
  const current = t && t.until > now ? t : { n: 0, until: now + 15 * 60_000 };
  if (current.n >= 10) return json({ ok: false, error: "trop_d_essais" }, 429);
  const body = await readJson(req);
  if (!checkPassword(typeof body?.password === "string" ? body.password : "")) {
    tries.set(ip, { ...current, n: current.n + 1 });
    return json({ ok: false, error: "mauvais_mot_de_passe" }, 401);
  }
  tries.delete(ip);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(createSessionToken()));
  return res;
}
