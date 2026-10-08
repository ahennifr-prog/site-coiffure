import { merchantReviews } from "@/textes/avis-commercants";
import { ReviewsBand } from "./ReviewsBand";
import { DraftReviews } from "./DraftReviews";

/**
 * Avis de commerçants en bandeau qui défile lentement (pause au survol).
 * Seuls les avis validés par le commerçant s'affichent ; sinon la section reste masquée.
 */
export function MerchantReviews({ compact = false }: { compact?: boolean }) {
  const valid = merchantReviews.filter((r) => r.valide);
  if (!valid.length) return <DraftReviews reviews={merchantReviews} compact={compact} />;
  return <ReviewsBand reviews={valid} compact={compact} />;
}
