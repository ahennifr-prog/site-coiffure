import Image from "next/image";
import { Star } from "lucide-react";
import type { MerchantReview } from "@/textes/avis-commercants";
import { fr } from "@/lib/format";

/** Carte d'avis : logo ou monogramme, nom, texte, étoiles. Relief léger au survol (CSS). */
export function ReviewCard({ review: r }: { review: MerchantReview }) {
  return (
    <figure className="review-card flex w-[280px] shrink-0 flex-col rounded-xl bg-paper p-5 shadow-md ring-1 ring-line sm:w-[340px]">
      <div className="flex items-center gap-3">
        {r.logo ? (
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center overflow-hidden rounded-full" style={{ background: r.logo.background }}>
            <Image src={r.logo.src} alt="" width={r.logo.width} height={r.logo.height} className="h-9 w-9 object-contain" />
          </span>
        ) : (
          <span className="inline-flex h-12 w-12 shrink-0 items-center justify-center rounded-full font-display text-lg font-semibold text-white" style={{ background: r.color }}>
            {r.monogram}
          </span>
        )}
        <figcaption className="min-w-0">
          <p className="truncate font-bold">{r.shop}</p>
          <p className="truncate text-xs text-ink-soft">{fr(r.trade)}</p>
        </figcaption>
      </div>
      <div className="mt-3 flex gap-0.5 text-safran">
        {Array.from({ length: 5 }, (_, i) => (
          <Star key={i} size={16} fill={i < r.stars ? "currentColor" : "none"} strokeWidth={i < r.stars ? 0 : 1.5} />
        ))}
      </div>
      <blockquote className="mt-2 text-[15px] leading-snug text-ink">« {fr(r.text)} »</blockquote>
    </figure>
  );
}
