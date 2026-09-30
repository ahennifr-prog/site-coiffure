import { NextResponse } from "next/server";
import { checkPassword, createSessionToken, passwordConfigured, sessionCookie } from "@/lib/auth";
import { clientIp, json, readJson } from "@/lib/http";
import { kv } from "@/lib/store";

export async function POST(req: Request) {
  if (!passwordConfigured()) return json({ ok: false, error: "non_configure" }, 503);
  const tries = await kv().incr(`alia:login:${clientIp(req)}`, 900);
  if (tries > 10) return json({ ok: false, error: "trop_d_essais" }, 429);
  const body = await readJson(req);
  if (!checkPassword(typeof body?.password === "string" ? body.password : "")) return json({ ok: false, error: "mauvais_mot_de_passe" }, 401);
  const res = NextResponse.json({ ok: true });
  res.cookies.set(sessionCookie(createSessionToken()));
  return res;
}
