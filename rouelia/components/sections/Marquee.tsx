"use client";

import { useState } from "react";
import { Check } from "lucide-react";
import { advantages } from "@/content";
import { fr } from "@/lib/format";

/**
 * Les avantages pour le commerçant, en bandeau qui défile en continu (téléphone et ordinateur).
 * La première suite est une vraie liste lue par les robots et les lecteurs d'écran ; la seconde, décorative,
 * sert seulement à boucler sans coupure. Pause au survol et au toucher ; sans animation (préférence système),
 * le bandeau se fait défiler au doigt.
 */
export function Marquee() {
  const [held, setHeld] = useState(false);
  const row = (copy: number) => (
    <ul aria-hidden={copy > 0 || undefined} className="flex shrink-0 items-center">
      {advantages.items.map((m) => (
        <li key={m} className="flex shrink-0 items-center gap-2 px-3.5 sm:gap-3 sm:px-10">
          <span aria-hidden className="inline-flex h-5 w-5 items-center justify-center rounded-full bg-sauge text-white sm:h-6 sm:w-6">
            <Check size={12} strokeWidth={3} className="sm:size-3.5" />
          </span>
          <span className="text-[15px] font-semibold whitespace-nowrap sm:text-xl">{fr(m)}</span>
        </li>
      ))}
    </ul>
  );
  return (
    <section aria-label={advantages.label} className="mt-3 sm:mt-4">
      <div
        className="advantages-band overflow-hidden border-y border-line bg-paper py-2.5 sm:py-3.5"
        data-held={held || undefined}
        onPointerDown={() => setHeld(true)}
        onPointerUp={() => setHeld(false)}
        onPointerCancel={() => setHeld(false)}
        onPointerLeave={() => setHeld(false)}
      >
        <div className="marquee-track">
          {row(0)}
          {row(1)}
        </div>
      </div>
    </section>
  );
}
