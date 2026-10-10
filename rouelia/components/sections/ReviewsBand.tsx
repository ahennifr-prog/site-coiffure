import { merchantReviewsSection, reviewSubtitle, type MerchantReview } from "@/textes/avis-commercants";
import { Container, Eyebrow, SectionTitle } from "@/components/ui/Section";
import { fr } from "@/lib/format";
import { ReviewCard } from "./ReviewCard";

export function ReviewsBand({ reviews, compact, draft = false }: { reviews: MerchantReview[]; compact?: boolean; draft?: boolean }) {
  // Assez de cartes pour couvrir les grands écrans, puis la même suite une seconde fois pour boucler sans saut.
  const loop = reviews.length < 6 ? [...reviews, ...reviews] : reviews;
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
      {/* Liste lisible pour les lecteurs d'écran et les moteurs ; le bandeau animé est décoratif. */}
      {/* Elle s'affiche si l'on y arrive au clavier (lien vers une fiche Google). */}
      <ul className="sr-only focus-within:not-sr-only focus-within:mx-auto focus-within:mt-6 focus-within:block focus-within:max-w-2xl focus-within:space-y-2 focus-within:px-5 focus-within:text-sm">
        {reviews.map((r) => (
          <li key={r.shop}>
            {r.shop}, {reviewSubtitle(r)} : « {r.text} » {r.stars || r.date ? ` (${[r.stars ? `${r.stars} sur 5` : "", r.date ?? ""].filter(Boolean).join(", ")})` : ""}
            {r.ficheGoogle ? (
              <>
                {" "}
                <a href={r.ficheGoogle} target="_blank" rel="noopener noreferrer" className="font-semibold underline">
                  {merchantReviewsSection.googleLink} : {r.shop}
                </a>
              </>
            ) : null}
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
      <Container>
        <details className="mx-auto mt-2 max-w-2xl text-center text-sm text-ink-soft">
          <summary className="inline-flex min-h-11 items-center font-semibold underline underline-offset-4">{merchantReviewsSection.howTitle}</summary>
          <p className="pb-2">{fr(merchantReviewsSection.how)}</p>
        </details>
      </Container>
    </section>
  );
}
