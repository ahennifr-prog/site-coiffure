"use client";

import { useState } from "react";
import { ChevronDown, Gift } from "lucide-react";
import { offerWheel } from "@/content";
import { fr } from "@/lib/format";
import { useAppState } from "@/components/AppState";
import { OfferWheelLazy } from "./OfferWheelLazy";

/**
 * Cadeau de bienvenue de la page /creer-ma-roue, au-dessus des deux parcours.
 * Fond doré, roue dorée et sombre, mention « Cadeau de bienvenue » : rien à voir avec la roue des clients.
 * Sur téléphone, le bloc est replié (une ligne et un bouton) pour que le choix du parcours reste visible tout de suite ;
 * sur ordinateur, la roue est toujours affichée. Le cadeau gagné suit le visiteur dans les deux parcours.
 */
export function WelcomeGift() {
  const { offer } = useAppState();
  const [open, setOpen] = useState(false);
  const shown = open || !!offer;
  return (
    <section aria-labelledby="bienvenue-title" className="mb-8 rounded-2xl bg-safran-soft p-4 ring-1 ring-safran sm:p-8 md:mb-10">
      <div className="grid items-start gap-4 md:grid-cols-[1fr_auto] md:gap-10">
        <div className="md:pt-10">
          <p className="inline-flex items-center gap-1.5 rounded-full bg-ink px-3 py-1 text-xs font-bold tracking-wide text-safran uppercase">
            <Gift aria-hidden size={14} /> {offerWheel.badge}
          </p>
          <h2 id="bienvenue-title" className="mt-3 font-display text-xl leading-tight font-semibold text-balance sm:text-3xl">
            {fr(offerWheel.title)}
          </h2>
          <p className="mt-2 max-w-xl text-sm text-ink sm:mt-3 sm:text-base">{fr(offerWheel.text)}</p>
          <p className="mt-2 text-xs font-semibold text-ink-soft sm:text-sm">{fr(offerWheel.note)}</p>
          {!shown ? (
            <button
              type="button"
              onClick={() => setOpen(true)}
              aria-expanded={false}
              aria-controls="bienvenue-roue"
              className="mt-3 inline-flex min-h-11 items-center gap-1.5 rounded-full bg-ink px-5 text-sm font-semibold text-white md:hidden"
            >
              {offerWheel.open} <ChevronDown aria-hidden size={16} />
            </button>
          ) : null}
        </div>
        <div id="bienvenue-roue" className={`mx-auto w-full md:block md:w-[320px] ${shown ? "" : "max-md:hidden"}`}>
          <OfferWheelLazy />
        </div>
      </div>
    </section>
  );
}
