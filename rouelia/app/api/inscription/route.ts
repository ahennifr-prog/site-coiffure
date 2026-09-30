import { NextResponse } from "next/server";
import { buildRecord, forLog } from "@/lib/signup";

/**
 * Inscription à l'essai gratuit.
 * Aujourd'hui : validation et journalisation structurée.
 * À brancher : enregistrement en base (la structure SignupRecord est prête),
 * création du client Stripe (stripeCustomerId), e-mail de bienvenue.
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

  const result = buildRecord(body, new Date(), crypto.randomUUID());
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
  }

  // TODO base de données : await db.signups.insert(result.record)
  // TODO Stripe : const customer = await stripe.customers.create({ email, name, metadata: { signupId } })
  console.info("[inscription]", JSON.stringify(forLog(result.record)));

  return NextResponse.json({ ok: true, id: result.record.id }, { status: 201 });
}
