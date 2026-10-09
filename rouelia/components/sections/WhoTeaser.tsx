import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { fr } from "@/lib/format";
import { whoPage, whoTeaser } from "@/textes/pour-qui";
import { prizeIcons } from "@/components/wheel/icons";
import { Container } from "@/components/ui/Section";

/**
 * Bloc compact sous les avis : « est-ce pour moi ? ». Pas de bouton d'action ici, les tarifs juste après
 * portent la décision ; seulement des liens vers les métiers et vers /pour-qui.
 */
export function WhoTeaser() {
  return (
    <section aria-labelledby="pour-qui-teaser" className="pb-(--section-y)">
      <Container>
        <div className="rounded-xl bg-paper p-5 ring-1 ring-line sm:p-8">
          <h2 id="pour-qui-teaser" className="max-w-3xl font-display text-xl leading-snug font-semibold text-balance sm:text-2xl">
            {fr(whoTeaser.title)}
          </h2>
          <p className="mt-2 max-w-2xl text-ink-soft">{fr(whoTeaser.text)}</p>
          <ul className="mt-5 flex flex-wrap gap-2">
            {whoPage.cards.map((c) => {
              const { Icon } = prizeIcons[c.icon];
              return (
                <li key={c.trade}>
                  <Link
                    href={c.href ?? whoPage.path}
                    className="inline-flex min-h-10 items-center gap-1.5 rounded-full bg-cream px-3 text-[13px] font-semibold ring-1 ring-line transition-colors hover:ring-ink/40 sm:min-h-11 sm:gap-2 sm:px-4 sm:text-sm"
                  >
                    <Icon aria-hidden size={16} className="text-tomette-deep" />
                    {fr(c.title)}
                  </Link>
                </li>
              );
            })}
          </ul>
          <Link href={whoPage.path} className="group mt-5 inline-flex min-h-11 items-center gap-1.5 font-semibold text-tomette-deep">
            <span className="underline underline-offset-4">{whoTeaser.link}</span>
            <ArrowRight aria-hidden size={16} className="transition-transform group-hover:translate-x-1" />
          </Link>
        </div>
      </Container>
    </section>
  );
}
