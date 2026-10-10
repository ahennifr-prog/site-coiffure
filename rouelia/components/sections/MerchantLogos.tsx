import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { merchantReviews, merchantReviewsSection } from "@/textes/avis-commercants";
import { fr } from "@/lib/format";
import { Container } from "@/components/ui/Section";

/**
 * Bande compacte des commerces qui utilisent Rouelia, juste sous le haut de page.
 * Mêmes données et même règle que les avis : seuls les commerces dont l'accord est validé (`valide: true`) apparaissent.
 * Grille fixe, sans défilement : aucun logo n'est coupé sur téléphone.
 */
export function MerchantLogos() {
  const shops = merchantReviews.filter((r) => r.valide);
  if (!shops.length) return null;
  return (
    <section id="logos" aria-labelledby="logos-title" className="pt-2 pb-8 sm:pt-0 sm:pb-12">
      <Container>
        <h2 id="logos-title" className="text-center text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">
          {fr(merchantReviewsSection.logosTitle)}
        </h2>
        <ul className="mx-auto mt-4 grid max-w-5xl grid-cols-4 gap-x-2 gap-y-4 sm:mt-5 sm:gap-6 lg:grid-cols-8">
          {shops.map((r) => (
            <li key={r.shop} className="flex flex-col items-center gap-1.5 text-center">
              {r.logo ? (
                <span className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-xl p-1.5 shadow-sm ring-1 ring-line sm:h-16 sm:w-16" style={{ background: r.logo.background }}>
                  <Image src={r.logo.src} alt="" width={r.logo.width} height={r.logo.height} sizes="64px" className="h-full w-full object-contain" />
                </span>
              ) : (
                <span aria-hidden className="inline-flex h-14 w-14 items-center justify-center rounded-xl font-display text-lg font-semibold text-white shadow-sm sm:h-16 sm:w-16" style={{ background: r.color }}>
                  {r.monogram}
                </span>
              )}
              <span className="text-[11px] leading-tight font-semibold text-ink sm:text-sm">{r.shop}</span>
            </li>
          ))}
        </ul>
        <p className="mt-3 text-center">
          <a href="#avis" className="inline-flex min-h-11 items-center gap-1 text-sm font-semibold text-tomette-deep underline underline-offset-4 hover:text-ink">
            {merchantReviewsSection.logosLink}
            <ArrowDown aria-hidden size={14} />
          </a>
        </p>
      </Container>
    </section>
  );
}
