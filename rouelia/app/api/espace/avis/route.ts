import { hit, track } from "@/lib/game";
import { json, readJson, requireShop } from "@/lib/http";
import { draftReplies, monthlyQuota, ReviewError, reviewsReady, sanitizeReview, usedThisMonth } from "@/lib/reviews";
import { withDefaults } from "@/lib/shops";

/** État de l'onglet Avis : quota du mois et réglages de réponse. */
export async function GET() {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  return json({ ok: true, ready: reviewsReady(), quota: monthlyQuota(shop), used: await usedThisMonth(shop.id), settings: withDefaults(shop.settings).reviews, pack: shop.pack });
}

/** Deux propositions de réponse pour l'avis collé par le commerçant. */
export async function POST(req: Request) {
  const { shop, denied } = await requireShop();
  if (denied) return denied;
  const quota = monthlyQuota(shop);
  if (quota === 0) return json({ ok: false, error: "pack" }, 403);
  if (!reviewsReady()) return json({ ok: false, error: "indisponible" }, 503);
  const input = sanitizeReview(await readJson(req));
  if (!input) return json({ ok: false, error: "invalide" }, 422);
  const used = await usedThisMonth(shop.id);
  if (quota !== null && used >= quota) return json({ ok: false, error: "quota", used, quota }, 429);
  // Garde-fou contre les clics en rafale, même en illimité.
  if ((await hit(`avis:${shop.id}`)) > 40) return json({ ok: false, error: "rafale" }, 429);
  try {
    const replies = await draftReplies(shop, input);
    await track(shop.id, "avis_ia");
    return json({ ok: true, replies, used: used + 1, quota });
  } catch (e) {
    return json({ ok: false, error: e instanceof ReviewError ? e.code : "ia" }, 502);
  }
}
