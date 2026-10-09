import { NextResponse } from "next/server";
import { checkPayload, signPayload } from "@/lib/auth";
import { saveSignup } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { signupAlertMail, signupConfirmMail } from "@/lib/mail-templates";
import { offerById, offerForSignup } from "@/lib/offers";
import { pricing } from "@/content";
import { buildRecord } from "@/lib/signup";
import { countEvent } from "@/lib/mesure";

/**
 * Inscription à l'essai gratuit.
 * Validation, puis enregistrement dans la base D1 de Cloudflare (mémoire en local).
 * Le cadeau de la roue d'offres est vérifié et rattaché selon le pack choisi.
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

  const now = new Date();
  const result = buildRecord(body, now, crypto.randomUUID());
  if (!result.ok) {
    return NextResponse.json({ ok: false, errors: result.errors }, { status: 422 });
  }
  // Cadeau de la roue d'offres : seul un jeton signé par le serveur et non expiré est pris en compte.
  result.record.offer = offerForSignup((body as Record<string, unknown>).offerToken, result.record.pack, { sign: signPayload, check: checkPayload }, now);

  try {
    await saveSignup(result.record);
  } catch (e) {
    console.error("[inscription] enregistrement impossible", e);
    return NextResponse.json({ ok: false, error: "storage" }, { status: 500 });
  }

  await countEvent("essai_envoye", now);

  // Accusé de réception au commerçant et alerte interne (sans effet si Brevo n'est pas branché).
  const r = result.record;
  await Promise.all([
    sendMail(signupConfirmMail({ email: r.email, firstName: r.firstName, shopName: r.shopName })),
    sendMail(
      signupAlertMail({
        firstName: r.firstName,
        shopName: r.shopName,
        email: r.email,
        phone: r.phone,
        pack: pricing.packs.find((p) => p.id === r.pack)?.name ?? r.pack,
        offer: r.offer ? `${offerById(r.offer.id).label} (${r.offer.status === "applied" ? "à appliquer" : "non applicable à ce pack"})` : null,
      }),
    ),
  ]);

  return NextResponse.json({ ok: true, id: r.id }, { status: 201 });
}
