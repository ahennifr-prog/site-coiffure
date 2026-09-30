import { NextResponse } from "next/server";
import { saveSignup } from "@/lib/db";
import { buildRecord } from "@/lib/signup";

/**
 * Inscription à l'essai gratuit.
 * Validation, puis enregistrement dans la base D1 de Cloudflare (mémoire en local).
 * À brancher plus tard : création du client Stripe (stripeCustomerId), e-mail de bienvenue.
 */
export async function POST(req: Request) {
  const length = Number(req.headers.get("content-length") ?? 0);
  if (length > 8_000_000) {
    return NextResponse.json({ ok: false, error: "too_large" }, { status: 413 });
  }

  let body: unknown;
  try {
    body = await req.json();
  } catch {
    return NextResponse.json({ ok: false, error: "invalid_json" }, { status: 400 });
  }

  // Champ piège invisible : seuls les robots le remplissent. On leur répond « ok » sans rien enregistrer.
  if (body && typeof body === "object" && (body as Record<string, unknown>).website) {
    return NextResponse.json({ ok: true, id: "ok" }, { status: 201 });
  }

  const result = buildRecord(body, new Date(), crypto.randomUUID());
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
  }

  try {
    await saveSignup(result.record);
  } catch (e) {
    console.error("[inscription] enregistrement impossible", e);
    return NextResponse.json({ ok: false, error: "storage" }, { status: 500 });
  }

  return NextResponse.json({ ok: true, id: result.record.id }, { status: 201 });
}
