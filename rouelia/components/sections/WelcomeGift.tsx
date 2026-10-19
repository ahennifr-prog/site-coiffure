import { Gift } from "lucide-react";
import { offerWheel } from "@/content";
import { fr } from "@/lib/format";
import { OfferWheelLazy } from "./OfferWheelLazy";

/**
 * Cadeau de bienvenue de la page /creer-ma-roue, au-dessus des deux parcours.
 * Fond doré, roue dorée et sombre, mention « Cadeau de bienvenue » : rien à voir avec la roue des clients.
 * Le cadeau gagné suit le visiteur dans les deux parcours (inscription ou « Créez-la pour moi »).
 */
export function WelcomeGift() {
  return (
    <section aria-labelledby="bienvenue-title" className="mb-10 rounded-2xl bg-safran-soft p-5 ring-1 ring-safran sm:p-8">
      <div className="grid items-start gap-6 md:grid-cols-[1fr_auto] md:gap-10">
        <div className="md:pt-10">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-bold tracking-wide text-safran uppercase">
            <Gift aria-hidden size={14} /> {offerWheel.badge}
          </p>
          <h2 id="bienvenue-title" className="mt-3 font-display text-2xl leading-tight font-semibold text-balance sm:text-3xl">
            {fr(offerWheel.title)}
          </h2>
          <p className="mt-3 max-w-xl text-ink">{fr(offerWheel.text)}</p>
          <p className="mt-2 text-sm font-semibold text-ink-soft">{fr(offerWheel.note)}</p>
        </div>
        <div className="mx-auto w-full md:w-[320px]">
          <OfferWheelLazy />
        </div>
      </div>
    </section>
  );
}
