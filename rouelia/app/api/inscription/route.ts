import { NextResponse } from "next/server";
import { checkPayload, signPayload } from "@/lib/auth";
import { saveSignup } from "@/lib/db";
import { sendMail } from "@/lib/mail";
import { signupAlertMail, signupConfirmMail } from "@/lib/mail-templates";
import { offerById, offerForSignup } from "@/lib/offers";
import { pricing } from "@/content";
import { buildRecord } from "@/lib/signup";
import { countEvent } from "@/lib/mesure";
import { clientIp } from "@/lib/http";
import { hit } from "@/lib/game";
import { inviteUrl } from "@/lib/notify";
import { openTrial } from "@/lib/trial";

/**
 * Inscription à l'essai gratuit.
 * Validation, enregistrement dans la base D1 de Cloudflare, puis ouverture automatique de l'essai
 * (commerce créé, accès envoyé par e-mail) et alerte immédiate à contact@.
 * Le cadeau de bienvenue est vérifié et rattaché selon le pack choisi.
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
  // Limite anti-abus : quelques inscriptions par heure et par adresse.
  try {
    if ((await hit(`inscription:${clientIp(req)}`, now)) > 6) return NextResponse.json({ ok: false, error: "rate" }, { status: 429 });
  } catch {
    // Base indisponible : l'enregistrement plus bas renverra l'erreur.
  }
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

  // Ouverture automatique de l'essai : le commerce est créé et l'accès part tout de suite par e-mail.
  // Si quelque chose échoue, l'inscription reste « à ouvrir » dans l'admin et le commerçant reçoit l'accusé de réception.
  const r = result.record;
  let opened: Awaited<ReturnType<typeof openTrial>> | null = null;
  try {
    opened = await openTrial(r, now);
  } catch (e) {
    console.error("[inscription] ouverture automatique impossible", e);
  }

  await Promise.all([
    opened ? Promise.resolve() : sendMail(signupConfirmMail({ email: r.email, firstName: r.firstName, shopName: r.shopName })),
    sendMail(
      signupAlertMail({
        firstName: r.firstName,
        shopName: r.shopName,
        email: r.email,
        phone: r.phone,
        pack: pricing.packs.find((p) => p.id === r.pack)?.name ?? r.pack,
        offer: r.offer ? `${offerById(r.offer.id).label} (${r.offer.status === "applied" ? "à appliquer" : "non applicable à ce pack"})` : null,
        opened: !!opened,
        slug: opened?.shop.slug,
      }),
    ),
  ]);

  // Le lien d'accès est aussi rendu au navigateur : le commerçant choisit son mot de passe sans attendre l'e-mail.
  return NextResponse.json({ ok: true, id: r.id, opened: !!opened, access: opened?.token ? inviteUrl(opened.token) : null }, { status: 201 });
}
