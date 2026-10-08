import { merchantReviewsSection, type MerchantReview } from "@/textes/avis-commercants";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { ReviewCard } from "./ReviewCard";

export function ReviewsBand({ reviews, compact, draft = false }: { reviews: MerchantReview[]; compact?: boolean; draft?: boolean }) {
  // Assez de cartes pour couvrir les grands écrans, puis la même suite une seconde fois pour boucler sans saut.
  const loop = reviews.length < 6 ? [...reviews, ...reviews] : reviews;
  return (
    <section id="avis" aria-labelledby="avis-title" className={compact ? "py-12" : "py-(--section-y)"}>
      <Container>
        <div className="mx-auto max-w-2xl text-center">
          <Eyebrow>{merchantReviewsSection.eyebrow}</Eyebrow>
          <SectionTitle id="avis-title">{merchantReviewsSection.title}</SectionTitle>
          {draft ? (
            <p role="note" className="mx-auto mt-4 inline-block rounded-full bg-safran-soft px-4 py-1.5 text-sm font-semibold ring-1 ring-safran">
              {merchantReviewsSection.draft}
            </p>
          ) : null}
        </div>
      </Container>
      {/* Liste lisible pour les lecteurs d'écran et les moteurs ; le bandeau animé est décoratif. */}
      <ul className="sr-only">
        {reviews.map((r) => (
          <li key={r.shop}>
            {r.shop}, {r.trade} : « {r.text} » ({r.stars} sur 5)
          </li>
        ))}
      </ul>
      <div aria-hidden className="reviews-band mt-8 overflow-hidden py-6 sm:mt-10" style={{ perspective: "1200px" }}>
        <div className="reviews-track">
          {[0, 1].map((k) => (
            <div key={k} className="flex shrink-0 gap-5 pr-5">
              {loop.map((r, i) => (
                <ReviewCard key={`${k}-${i}`} review={r} />
              ))}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
