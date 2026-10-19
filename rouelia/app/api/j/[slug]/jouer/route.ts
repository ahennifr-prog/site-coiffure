import { play } from "@/lib/game";
import { clientIp, json, readJson } from "@/lib/http";
import { sendClientCode } from "@/lib/notify";
import { getShopBySlug } from "@/lib/shops";
import { alertIfFirstPlay } from "@/lib/alerts";

type Ctx = { params: Promise<{ slug: string }> };

/** Partie d'un client : tirage fait par le serveur, une partie par téléphone sur la période réglée. */
export async function POST(req: Request, { params }: Ctx) {
  const shop = await getShopBySlug((await params).slug);
  if (!shop) return json({ ok: false, error: "introuvable" }, 404);
  const body = await readJson(req);
  if (!body) return json({ ok: false, error: "invalide" }, 400);
  const r = await play(shop, body as Parameters<typeof play>[1], clientIp(req));
  if (!r.ok) return json(r, r.error === "rate" ? 429 : r.error === "inactive" ? 409 : 422);
  // Le code part aussi par e-mail si le client l'a demandé (une erreur d'envoi ne bloque pas la partie).
  const emailed = !r.already && r.play.email ? (await sendClientCode(shop, r.play)).ok : false;
  // Première partie du commerce : alerte à contact@ (le QR code est en place).
  if (!r.already) await alertIfFirstPlay(shop);
  // Le téléphone complet n'est pas renvoyé au navigateur.
  const { phone: _phone, consentText: _c, cost: _cost, redeemedBy: _by, email: _email, ...visible } = r.play;
  return json({ ok: true, already: r.already, prizeIndex: r.prizeIndex, prizes: r.prizes, play: visible, emailed });
}
