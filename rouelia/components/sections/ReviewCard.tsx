import Image from "next/image";
import { ExternalLink, Star } from "lucide-react";
import { merchantReviewsSection, reviewSubtitle, type MerchantReview } from "@/textes/avis-commercants";
import { fr } from "@/lib/format";

/**
 * Carte d'avis : logo ou monogramme, nom, texte, étoiles. Relief léger au survol (CSS).
 * Dans le bandeau animé (décoratif pour les lecteurs d'écran), le lien vers la fiche Google reste cliquable
 * mais hors de la tabulation : la liste accessible de ReviewsBand porte le même lien.
 */
export function ReviewCard({ review: r }: { review: MerchantReview }) {
  return (
    <figure className="review-card flex w-[280px] shrink-0 flex-col rounded-xl bg-paper p-5 shadow-md ring-1 ring-line sm:w-[340px]">
      <div className="flex items-center gap-3">
        {r.logo ? (
          <span className="inline-flex h-12 w-14 shrink-0 items-center justify-center overflow-hidden rounded-lg p-1 ring-1 ring-line" style={{ background: r.logo.background }}>
            <Image src={r.logo.src} alt={`Logo ${r.shop}`} width={r.logo.width} height={r.logo.height} className="h-full w-full object-contain" />
          </span>
        ) : (
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-semibold text-white" style={{ background: r.color }}>
            {r.monogram}
          </span>
        )}
        <figcaption className="min-w-0">
          <p className="truncate font-bold">{r.shop}</p>
          <p className="truncate text-xs text-ink-soft">{fr(reviewSubtitle(r))}</p>
        </figcaption>
      </div>
      <div className="mt-3 flex gap-0.5 text-safran" aria-label={`${r.stars} sur 5`}>
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={16} fill={i < r.stars ? "currentColor" : "none"} strokeWidth={i < r.stars ? 0 : 1.5} />
        ))}
      </div>
      <blockquote className="mt-2 text-[15px] leading-snug text-ink">« {fr(r.text)} »</blockquote>
      {r.date || r.ficheGoogle ? (
        <p className="mt-auto flex items-center justify-between gap-3 pt-3 text-xs text-ink-soft">
          <span>{r.date}</span>
          {r.ficheGoogle ? (
            <a href={r.ficheGoogle} target="_blank" rel="noopener noreferrer" tabIndex={-1} className="inline-flex min-h-8 items-center gap-1 font-semibold text-tomette-deep underline underline-offset-2">
              {merchantReviewsSection.googleLink}
              <ExternalLink aria-hidden size={12} />
            </a>
          ) : null}
        </p>
      ) : null}
    </figure>
  );
}
