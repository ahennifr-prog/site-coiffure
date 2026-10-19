import { merchantReviewsSection, type MerchantReview } from "@/textes/avis-commercants";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { fr } from "@/lib/format";
import { ReviewsRail } from "./ReviewsRail";

/** Section des avis : titre, cartes fixes à faire glisser, et la façon dont les avis sont recueillis. */
export function ReviewsBand({ reviews, compact, draft = false }: { reviews: MerchantReview[]; compact?: boolean; draft?: boolean }) {
  return (
    <section id="avis" aria-labelledby="avis-title" className={compact ? "py-12" : "pt-(--section-y) pb-8 sm:pb-10"}>
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
      <ReviewsRail reviews={reviews} />
      <Container>
        <details className="mx-auto mt-2 max-w-2xl text-center text-sm text-ink-soft">
          <summary className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{merchantReviewsSection.howTitle}</summary>
          <p className="pb-2">{fr(merchantReviewsSection.how)}</p>
        </details>
      </Container>
    </section>
  );
}
