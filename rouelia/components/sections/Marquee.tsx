import { Check } from "lucide-react";
import { advantages } from "@/content";
import { fr } from "@/lib/format";

/** Les avantages pour le commerçant, en bandeau fin qui défile. La liste lisible est pour les lecteurs d'écran. */
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
    <section aria-label={advantages.label} className="mt-10 mb-4 sm:mt-16">
      <ul className="sr-only">
        {advantages.items.map((m) => (
          <li key={m}>{fr(m)}</li>
        ))}
      </ul>
      <div aria-hidden className="overflow-hidden border-y border-line bg-paper py-4">
        <div className="marquee-track">{[0, 1].map(row)}</div>
      </div>
    </section>
  );
}
