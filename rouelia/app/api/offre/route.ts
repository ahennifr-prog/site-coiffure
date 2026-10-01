import { checkPayload, signPayload } from "@/lib/auth";
import { json } from "@/lib/http";
import { drawOffer, offerToken } from "@/lib/offers";

/** Hasard cryptographique : le résultat ne peut pas être deviné par le navigateur. */
function secureRandom(): number {
  const a = new Uint32Array(1);
  crypto.getRandomValues(a);
  return a[0] / 2 ** 32;
}

/**
 * Tirage de la roue d'offres Rouelia.
 * Le serveur choisit le cadeau et le signe : à l'inscription, seul ce jeton fait foi.
 */
export async function POST() {
  const offer = drawOffer(secureRandom, new Date());
  const token = offerToken(offer, { sign: signPayload, check: checkPayload });
  return json({ ok: true, offer: { ...offer, token } });
}
