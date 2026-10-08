import { Check } from "lucide-react";
import { advantages } from "@/content";
import { fr } from "@/lib/format";

/** Les avantages pour le commerçant : grille sur téléphone, bandeau fin qui défile au-delà. */
export function Marquee() {
  const row = (k: number) => (
    <div key={k} className="flex shrink-0 items-center">
      {advantages.items.map((m) => (
        <span key={`${k}-${m}`} className="flex shrink-0 items-center gap-3 px-7 sm:px-10">
          <span className="inline-flex h-6 w-6 items-center justify-center rounded-full bg-sauge text-white">
            <Check size={14} strokeWidth={3} />
          </span>
          <span className="text-lg font-semibold whitespace-nowrap sm:text-xl">{fr(m)}</span>
        </span>
      ))}
    </div>
  );
  return (
    <section aria-label={advantages.label} className="mt-6 sm:mt-8">
      {/* Téléphone : les avantages en grille, jamais coupés. Écrans plus larges : bandeau qui défile. */}
      <ul className="mx-auto grid max-w-6xl grid-cols-2 gap-2 px-5 sm:hidden">
        {advantages.items.map((m) => (
          <li key={m} className="flex items-center gap-2 rounded-lg bg-paper px-3 py-2.5 text-sm leading-tight font-semibold ring-1 ring-line">
            <span aria-hidden className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-sauge text-white">
              <Check size={12} strokeWidth={3} />
            </span>
            {fr(m)}
          </li>
        ))}
      </ul>
      <ul className="sr-only max-sm:hidden">
        {advantages.items.map((m) => (
          <li key={m}>{fr(m)}</li>
        ))}
      </ul>
      <div aria-hidden className="hidden overflow-hidden border-y border-line bg-paper py-3.5 sm:block">
        <div className="marquee-track">{[0, 1].map(row)}</div>
      </div>
    </section>
  );
}
