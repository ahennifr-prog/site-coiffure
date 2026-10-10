import Image from "next/image";
import { ArrowDown } from "lucide-react";
import { merchantReviews, merchantReviewsSection, type MerchantReview } from "@/textes/avis-commercants";
import { fr } from "@/lib/format";
import { Container } from "@/components/ui/Section";

/** Un commerce de la bande : logo (ou monogramme) et nom. */
function Shop({ r }: { r: MerchantReview }) {
  return (
    <li className="flex w-24 shrink-0 flex-col items-center gap-1.5 px-1 text-center sm:w-32">
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
  );
}

/**
 * Bande des commerces qui utilisent Rouelia, sous la vidéo et juste au-dessus du bandeau des avantages, en défilement continu (pause au survol).
 * Mêmes données et même règle que les avis : seuls les commerces dont l'accord est validé (`valide: true`) apparaissent.
 * La première suite est la vraie liste (lue par les lecteurs d'écran) ; les suivantes, décoratives, servent à boucler
 * sans trou, même sur grand écran. Sans animation (préférence système), la bande se fait défiler au doigt.
 */
export function MerchantLogos() {
  const shops = merchantReviews.filter((r) => r.valide);
  if (!shops.length) return null;
  // Assez de logos par suite pour couvrir un grand écran (environ 1 600 px), puis la même suite une seconde fois.
  const perSet = Math.max(1, Math.ceil(13 / shops.length));
  const set = Array.from({ length: perSet }, () => shops).flat();
  return (
    <section id="logos" aria-labelledby="logos-title" className="pt-8 sm:pt-12">
      <Container>
        {/* Légende discrète au-dessus de la bande : le titre et un lien vers les avis complets. */}
        <p className="flex flex-wrap items-baseline justify-center gap-x-3 gap-y-1 text-center">
          <span id="logos-title" role="heading" aria-level={2} className="text-xs font-bold tracking-[0.12em] text-ink-soft uppercase">
            {fr(merchantReviewsSection.logosTitle)}
          </span>
          <a href="#avis" className="inline-flex items-center gap-1 text-xs font-semibold text-tomette-deep underline underline-offset-4 hover:text-ink">
            {merchantReviewsSection.logosLink}
            <ArrowDown aria-hidden size={12} />
          </a>
        </p>
      </Container>
      <div className="logos-band mt-3 overflow-hidden py-1 sm:mt-4 [mask-image:linear-gradient(to_right,transparent,black_8%,black_92%,transparent)]">
        <div className="logos-track">
          {/* Deux suites identiques : la première commence par la vraie liste, le reste ne sert qu'à boucler. */}
          {[0, 1].map((copy) => (
            <div key={copy} aria-hidden={copy > 0 || undefined} className="flex shrink-0">
              <ul className="flex shrink-0">
                {shops.map((r) => (
                  <Shop key={r.shop} r={r} />
                ))}
              </ul>
              {perSet > 1 ? (
                <ul aria-hidden className="flex shrink-0">
                  {set.slice(shops.length).map((r, i) => (
                    <Shop key={`${r.shop}-${i}`} r={r} />
                  ))}
                </ul>
              ) : null}
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
